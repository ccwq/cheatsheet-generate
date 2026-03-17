import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeColWidth, parseCheatsheetMarkdown } from '../parser.js'
import { renderDocument } from '../renderer.js'

const sampleMarkdown = `---
title: Demo Sheet
lang: bash
---

# 页面标题覆盖

## 🧭 基础
---
lang: python
---

- \`C-b c\` : 新建窗口
- 普通文字

\`echo hello\`

\`\`\`js
console.log('x')
\`\`\`

### 子集
- \`tmux ls\` : 查看会话
`

test('parser: 语言优先级、entry 两种语法、set 归属、代码块类型', () => {
  const model = parseCheatsheetMarkdown(sampleMarkdown)

  assert.equal(model.title, '页面标题覆盖')
  assert.equal(model.lang, 'bash')
  assert.equal(model.cards.length, 1)

  const card = model.cards[0]
  assert.equal(card.emoji, '🧭')
  assert.equal(card.title, '基础')
  assert.equal(card.lang, 'python')

  const list = card.items.find((item) => item.type === 'list')
  assert.ok(list)
  const codeDesc = list.items.find((item) => item.variant === 'code-desc')
  assert.ok(codeDesc)
  assert.deepEqual(codeDesc.codes, ['C-b c'])
  assert.equal(codeDesc.description, '新建窗口')
  assert.equal(codeDesc.lang, 'python')

  const textEntry = list.items.find((item) => item.variant === 'text')
  assert.ok(textEntry)
  assert.equal(textEntry.text, '普通文字')

  const inlineCode = card.items.find((item) => item.type === 'inlineCode')
  assert.ok(inlineCode)
  assert.equal(inlineCode.lang, 'python')

  const fencedCode = card.items.find((item) => item.type === 'codeBlock')
  assert.ok(fencedCode)
  assert.equal(fencedCode.lang, 'js')

  const set = card.items.find((item) => item.type === 'set')
  assert.ok(set)
  assert.equal(set.title, '子集')
  const setList = set.items.find((item) => item.type === 'list')
  assert.ok(setList)
  assert.equal(setList.items.length, 1)
  assert.equal(setList.items[0].variant, 'code-desc')
})

test('renderer: 输出结构与高亮类名', async () => {
  const model = parseCheatsheetMarkdown(sampleMarkdown)
  const testFile = fileURLToPath(import.meta.url)
  const template = await fs.readFile(path.join(path.dirname(testFile), '..', 'template.html'), 'utf8')
  const html = renderDocument(model, template)

  assert.ok(html.includes('<div class="panel">'))
  assert.ok(html.includes('<div class="cheat-columns" id="columns">'))
  assert.ok(html.includes('<div class="card"><h2>🧭 基础</h2>'))
  assert.ok(html.includes('<h3>子集</h3>'))
  assert.ok(html.includes('<li><code>C-b c</code>：新建窗口</li>'))
  assert.ok(html.includes('class="language-python"'))
  assert.ok(html.includes('class="language-js"'))
  assert.ok(html.includes('Prism.highlightAll();'))
})

test('parser: 非法 colWidth 回退到默认值', () => {
  assert.equal(normalizeColWidth('6'), '340px')
  assert.equal(normalizeColWidth('380'), '380px')
  assert.equal(normalizeColWidth('420px'), '420px')
})

test('parser/renderer: 支持 card 元数据 link/desc 与嵌套列表', async () => {
  const markdown = `---
title: Demo
lang: bash
---

## 主题
---
emoji: 📌
link: https://example.com/docs
desc: 这是一段卡片说明
---

- \`cmd\` : 描述
  - 子项A
  - 子项B
`

  const model = parseCheatsheetMarkdown(markdown)
  const card = model.cards[0]
  assert.equal(card.emoji, '📌')
  assert.equal(card.link, 'https://example.com/docs')

  const desc = card.items.find((item) => item.type === 'desc')
  assert.ok(desc)
  assert.equal(desc.text, '这是一段卡片说明')

  const list = card.items.find((item) => item.type === 'list')
  assert.ok(list)
  assert.equal(list.items[0].variant, 'code-desc')
  assert.ok(list.items[0].children)
  assert.equal(list.items[0].children.items.length, 2)

  const testFile = fileURLToPath(import.meta.url)
  const template = await fs.readFile(path.join(path.dirname(testFile), '..', 'template.html'), 'utf8')
  const html = renderDocument(model, template)
  assert.ok(html.includes('title="官方文档"'))
  assert.ok(html.includes('<div class="desc">这是一段卡片说明</div>'))
  assert.ok(html.includes('<ul><li><code>cmd</code>：描述<ul><li>子项A</li><li>子项B</li></ul></li></ul>'))
})

test('parser/renderer: 支持 GFM 表格且不输出占位符文本', async () => {
  const markdown = `---
title: Table Demo
lang: bash
---

## 表格卡片

- \`~/.acme.sh/\` : 存放所有证书和配置

| 模式 | 适用场景 | 需要端口 |
| --- | --- | --- |
| Webroot | 有现成网站目录 | 无 |
| DNS | 通配符与无开放端口 | 无 |
`

  const model = parseCheatsheetMarkdown(markdown)
  const card = model.cards[0]
  const list = card.items.find((item) => item.type === 'list')
  assert.ok(list)
  assert.equal(list.items[0].description, '存放所有证书和配置')

  const table = card.items.find((item) => item.type === 'table')
  assert.ok(table)
  assert.deepEqual(table.align, [null, null, null])
  assert.equal(table.rows.length, 3)
  assert.equal(table.rows[0].header, true)
  assert.deepEqual(table.rows[0].cells, ['模式', '适用场景', '需要端口'])
  assert.deepEqual(table.rows[1].cells, ['Webroot', '有现成网站目录', '无'])

  const testFile = fileURLToPath(import.meta.url)
  const template = await fs.readFile(path.join(path.dirname(testFile), '..', 'template.html'), 'utf8')
  const html = renderDocument(model, template)
  assert.ok(html.includes('<table class="cheat-table">'))
  assert.ok(html.includes('<th>模式</th>'))
  assert.ok(html.includes('<td>Webroot</td>'))
  assert.ok(!html.includes('\x00CODE\x00'))
})

test('e2e: 使用 tmux markdown 生成 HTML', async () => {
  const testFile = fileURLToPath(import.meta.url)
  const repoRoot = path.resolve(path.dirname(testFile), '..', '..')
  const inputPath = path.join(repoRoot, 'cheatsheets', 'tmux', 'tmux.md')
  const md = await fs.readFile(inputPath, 'utf8')
  const model = parseCheatsheetMarkdown(md)

  const templatePath = path.join(repoRoot, 'cheatsheet-html-maker', 'template.html')
  const template = await fs.readFile(templatePath, 'utf8')
  const html = renderDocument(model, template)

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cheatsheet-maker-'))
  const outputPath = path.join(tempDir, 'tmux.html')
  await fs.writeFile(outputPath, html, 'utf8')

  assert.ok(html.includes('<span class="title">tmux 速查表</span>'))
  assert.ok(html.includes('<div class="card">'))
  assert.ok(html.includes('<ul>'))
  assert.ok(html.includes('prism-core.min.js'))
})
