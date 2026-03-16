import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runCli, runTui, resolveAssetBaseForOutput } from '../index.js'

const minimalMarkdown = `# Demo

## 基础
- \`echo hi\` : 输出
`

test('CLI 参数模式成功：仅 input 自动输出同名 html', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cheatsheet-cli-'))
  const input = path.join(tempDir, 'demo.md')
  await fs.writeFile(input, minimalMarkdown, 'utf8')

  const code = await runCli(['node', 'index.js', '--input', input])
  assert.equal(code, 0)

  const output = path.join(tempDir, 'demo.html')
  const html = await fs.readFile(output, 'utf8')
  assert.ok(html.includes('<span class="title">Demo</span>'))
  assert.ok(html.includes('class="cheat-columns"'))
  assert.ok(html.includes('Prism.highlightAll();'))
})

test('CLI 参数模式失败：输入不存在返回非零码', async () => {
  const code = await runCli(['node', 'index.js', '--input', 'this-file-does-not-exist.md'])
  assert.equal(code, 1)
})

test('TUI 模式成功：三步交互后生成输出', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cheatsheet-tui-'))
  const input = path.join(tempDir, 'demo.md')
  await fs.writeFile(input, minimalMarkdown, 'utf8')

  const asked = []
  const prompt = async (questions) => {
    const q = questions[0]
    asked.push(q.name)

    if (q.name === 'input') {
      return { input }
    }

    if (q.name === 'output') {
      return { output: 'out.html' }
    }

    if (q.name === 'aiEmoji') {
      return { aiEmoji: false }
    }

    throw new Error('unexpected question')
  }

  const result = await runTui({ cwd: tempDir, prompt })
  assert.deepEqual(asked, ['input', 'output', 'aiEmoji'])
  assert.ok(result.outputPath.endsWith(path.join('out.html')))

  const html = await fs.readFile(path.join(tempDir, 'out.html'), 'utf8')
  assert.ok(html.includes('Prism.highlightAll();'))
})

test('TUI 模式失败：无 md 文件时报错', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cheatsheet-tui-empty-'))
  await assert.rejects(() => runTui({ cwd: tempDir, prompt: async () => ({}) }))
})

test('CLI: 同目录 meta.yml 可兜底填充页面元信息', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cheatsheet-meta-'))
  const input = path.join(tempDir, 'demo.md')
  const meta = path.join(tempDir, 'meta.yml')

  await fs.writeFile(input, minimalMarkdown, 'utf8')
  await fs.writeFile(
    meta,
    [
      'desc: demo',
      'tags: []',
      'version: 3.2.1',
      'github: owner/repo',
      'date: "2026-03-05"',
      '',
    ].join('\n'),
    'utf8',
  )

  const code = await runCli(['node', 'index.js', '--input', input])
  assert.equal(code, 0)

  const output = path.join(tempDir, 'demo.html')
  const html = await fs.readFile(output, 'utf8')
  assert.ok(html.includes('<span class="meta-value">3.2.1</span>'))
  assert.ok(html.includes('<span class="meta-value">2026-03-05</span>'))
  assert.ok(html.includes('href="https://github.com/owner/repo"'))
  assert.ok(html.includes('href="https://zread.ai/owner/repo"'))
})

test('asset base: output 在项目内时根据层级计算相对 assets 路径', () => {
  const testFile = fileURLToPath(import.meta.url)
  const makerDir = path.resolve(path.dirname(testFile), '..')

  const demoHtml = path.join(makerDir, 'demos', 'demo-1', 'demo-1.html')
  assert.equal(resolveAssetBaseForOutput(demoHtml), '../../../assets')

  const rootHtml = path.join(makerDir, '..', 'index.html')
  assert.equal(resolveAssetBaseForOutput(rootHtml), 'assets')
})
