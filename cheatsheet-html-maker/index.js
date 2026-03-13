#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Command } from 'commander'
import inquirer from 'inquirer'
import fetch from 'node-fetch'
import yaml from 'js-yaml'
import { parseCheatsheetMarkdown, extractFrontmatter } from './parser.js'
import { renderDocument } from './renderer.js'
import { glob } from 'glob'

const __filename = fileURLToPath(import.meta.url)
const projectRoot = path.resolve(path.dirname(__filename), '..')
const defaultAssetBase = '../../assets'

function toPosixPath(value) {
  return String(value || '').replaceAll(path.sep, '/')
}

function isInsideDirectory(parentDir, targetDir) {
  const relative = path.relative(parentDir, targetDir)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

export function resolveAssetBaseForOutput(outputPath) {
  const absOutputDir = path.dirname(path.resolve(outputPath))
  const assetsDir = path.join(projectRoot, 'assets')

  if (!isInsideDirectory(projectRoot, absOutputDir)) {
    return defaultAssetBase
  }

  const relative = path.relative(absOutputDir, assetsDir)
  if (!relative) {
    return '.'
  }

  return toPosixPath(relative)
}

function applyAssetBase(templateHtml, assetBase) {
  return templateHtml.replaceAll(defaultAssetBase, assetBase)
}

function hasRequiredFrontmatter(markdown) {
  const { data } = extractFrontmatter(markdown)
  if (!data || typeof data !== 'object') {
    return false
  }

  const title = data.title

  let dateValue = data.date
  if (dateValue instanceof Date) {
    dateValue = dateValue.toISOString().split('T')[0]
  }

  const titleValid = typeof title === 'string' && title.trim().length > 0
  const dateValid = typeof dateValue === 'string' && dateValue.trim().length > 0

  return titleValid && dateValid
}

async function resolveInputFiles(inputPattern) {
  const resolved = await glob(inputPattern, {
    nodir: true,
    dot: false,
  })
  return resolved.sort((a, b) => a.localeCompare(b))
}

function resolveTemplatePath() {
  return path.join(path.dirname(__filename), 'template.html')
}

function defaultOutputPath(inputPath, outputArg) {
  if (outputArg && outputArg.trim()) {
    return path.resolve(outputArg)
  }

  const absInput = path.resolve(inputPath)
  const dir = path.dirname(absInput)
  const ext = path.extname(absInput)
  const base = path.basename(absInput, ext)
  return path.join(dir, `${base}.html`)
}

function parseEmojiFromTitle(title) {
  const match = String(title || '').trim().match(/^([\p{Extended_Pictographic}\uFE0F\u200D]+)\s*/u)
  return match ? match[1] : ''
}

export async function suggestEmojiWithAi(title, options = {}) {
  const providerUrl = options.providerUrl || process.env.CHEATSHEET_EMOJI_PROVIDER_URL
  if (!providerUrl) {
    return ''
  }

  try {
    const response = await fetch(providerUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title }),
      timeout: 8000,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const json = await response.json()
    return typeof json.emoji === 'string' ? json.emoji.trim() : ''
  } catch (error) {
    console.warn(`[warn] AI emoji provider failed: ${error.message}`)
    return ''
  }
}

export async function fillMissingEmoji(model, enableAi, options = {}) {
  for (const card of model.cards) {
    const explicit = parseEmojiFromTitle(card.title)
    if (explicit) {
      card.emoji = explicit
      continue
    }

    if (!card.emoji && enableAi) {
      card.emoji = await suggestEmojiWithAi(card.title, options)
    }

    if (!card.emoji) {
      card.emoji = ''
    }
  }
}

async function loadMetaFromYml(inputPath) {
  const metaPath = path.join(path.dirname(inputPath), 'meta.yml')
  try {
    const raw = await fs.readFile(metaPath, 'utf8')
    const data = yaml.load(raw) || {}
    return {
      version: typeof data.version === 'string' && data.version.trim() ? data.version.trim() : 'unknown',
      date: typeof data.date === 'string' && data.date.trim() ? data.date.trim() : 'unknown',
      github: typeof data.github === 'string' && data.github.trim() ? data.github.trim() : 'unknown',
      tags: Array.isArray(data.tags)
        ? data.tags.map((tag) => String(tag || '').trim()).filter(Boolean)
        : [],
      colWidth: typeof data.colWidth === 'string' && data.colWidth.trim() ? data.colWidth.trim() : '',
    }
  } catch {
    return null
  }
}

function mergeMetaWithFallback(model, fallbackMeta) {
  if (!fallbackMeta) {
    return
  }

  const current = model.meta || {}
  model.meta = {
    version: current.version && current.version !== 'unknown' ? current.version : fallbackMeta.version,
    date: current.date && current.date !== 'unknown' ? current.date : fallbackMeta.date,
    github: current.github && current.github !== 'unknown' ? current.github : fallbackMeta.github,
    colWidth: current.colWidth && current.colWidth !== '340px' ? current.colWidth : fallbackMeta.colWidth,
    tags: Array.isArray(current.tags) && current.tags.length > 0 ? current.tags : fallbackMeta.tags,
  }
}

async function generateFromFile(options) {
  const inputPath = path.resolve(options.input)
  const outputPath = defaultOutputPath(inputPath, options.output)

  let markdown
  try {
    markdown = await fs.readFile(inputPath, 'utf8')
  } catch {
    throw new Error(`输入文件不存在或不可读: ${inputPath}`)
  }

  const model = parseCheatsheetMarkdown(markdown)
  const ymlMeta = await loadMetaFromYml(inputPath)
  mergeMetaWithFallback(model, ymlMeta)
  await fillMissingEmoji(model, Boolean(options.aiEmoji), {
    providerUrl: options.aiProviderUrl,
  })

  const templatePath = resolveTemplatePath()
  const template = await fs.readFile(templatePath, 'utf8')
  const assetBase = resolveAssetBaseForOutput(outputPath)
  const html = renderDocument(model, applyAssetBase(template, assetBase))

  await fs.writeFile(outputPath, html, 'utf8')

  return {
    inputPath,
    outputPath,
    title: model.title,
    cards: model.cards.length,
  }
}

async function collectMarkdownFiles(rootDir) {
  const ignored = new Set(['node_modules', '.git', '.opencode', 'openspec'])
  const result = []

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue
      }

      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        if (!ignored.has(entry.name)) {
          await walk(fullPath)
        }
        continue
      }

      if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        result.push(fullPath)
      }
    }
  }

  await walk(rootDir)
  return result.sort((a, b) => a.localeCompare(b))
}

export async function runTui(options = {}) {
  const cwd = options.cwd || process.cwd()
  const prompt = options.prompt || inquirer.prompt
  const files = await collectMarkdownFiles(cwd)

  if (files.length === 0) {
    throw new Error(`当前目录未找到可选 .md 文件: ${cwd}`)
  }

  const fileChoices = files.map((filePath) => ({
    name: path.relative(cwd, filePath),
    value: filePath,
  }))

  const answer1 = await prompt([
    {
      type: 'list',
      name: 'input',
      message: '请选择输入 Markdown 文件',
      pageSize: 20,
      choices: fileChoices,
    },
  ])

  const defaultOutput = defaultOutputPath(answer1.input)
  const answer2 = await prompt([
    {
      type: 'input',
      name: 'output',
      message: '请输入输出 HTML 路径',
      default: path.relative(cwd, defaultOutput),
      validate(value) {
        return String(value || '').trim() ? true : '输出路径不能为空'
      },
    },
  ])

  const answer3 = await prompt([
    {
      type: 'confirm',
      name: 'aiEmoji',
      message: '是否启用 AI emoji 补全？',
      default: false,
    },
  ])

  const output = path.resolve(cwd, answer2.output)
  return generateFromFile({
    input: answer1.input,
    output,
    aiEmoji: answer3.aiEmoji,
    aiProviderUrl: options.aiProviderUrl,
  })
}

export async function runCli(argv = process.argv) {
  const program = new Command()
  program
    .name('cheatsheet-html-maker')
    .description('Generate cheatsheet HTML from markdown')
    .option('-i, --input <path>', '输入 Markdown 文件路径（支持 glob 模式）')
    .option('-o, --output <path>', '输出 HTML 文件路径或目录（批量时视为目录）')
    .option('--ai-emoji', '启用 AI emoji 补全')
    .option('--ai-provider-url <url>', 'AI emoji provider URL（默认读取环境变量）')

  program.parse(argv)
  const options = program.opts()

  try {
    if (!options.input) {
      return await runTui({ aiProviderUrl: options.aiProviderUrl })
    }

    const inputFiles = await resolveInputFiles(options.input)

    if (inputFiles.length === 0) {
      console.error(`[error] 未找到匹配的文件: ${options.input}`)
      return 1
    }

    if (inputFiles.length === 1) {
      const result = await generateFromFile({
        input: inputFiles[0],
        output: options.output,
        aiEmoji: options.aiEmoji,
        aiProviderUrl: options.aiProviderUrl,
      })
      console.log(`生成完成: ${result.outputPath}`)
      console.log(`标题: ${result.title} | 卡片数: ${result.cards}`)
      return 0
    }

    const isOutputDir = options.output && !options.output.endsWith('.html')
    const outputBase = isOutputDir ? path.resolve(options.output) : null

    let generated = 0
    let skipped = 0
    let failed = 0

    for (const inputFile of inputFiles) {
      const absInput = path.resolve(inputFile)
      let markdown
      try {
        markdown = await fs.readFile(absInput, 'utf8')
      } catch {
        console.log(`[skip] ${inputFile} - 无法读取文件`)
        skipped += 1
        continue
      }

      if (!hasRequiredFrontmatter(markdown)) {
        console.log(`[skip] ${inputFile} - 缺少必需的 frontmatter (title/date)`)
        skipped += 1
        continue
      }

      try {
        const outputPath = outputBase
          ? path.join(outputBase, path.basename(absInput, '.md') + '.html')
          : undefined

        const result = await generateFromFile({
          input: absInput,
          output: outputPath,
          aiEmoji: options.aiEmoji,
          aiProviderUrl: options.aiProviderUrl,
        })

        console.log(`[ok] generated: ${result.outputPath}`)
        generated += 1
      } catch (err) {
        console.log(`[fail] ${inputFile} - ${err.message}`)
        failed += 1
      }
    }

    console.log(`[done] total=${inputFiles.length}, generated=${generated}, skipped=${skipped}, failed=${failed}`)
    return failed > 0 ? 1 : 0
  } catch (error) {
    console.error(`[error] ${error.message}`)
    return 1
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  runCli(process.argv).then((code) => {
    process.exitCode = code
  })
}
