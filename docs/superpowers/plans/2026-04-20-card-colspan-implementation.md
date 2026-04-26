# Card Colspan 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 parser 和 renderer 中实现 `colspan` 特性，允许卡片横跨多列。

**Architecture:** `normalizeColspan()` 在 parser 层做类型转换与校验，结果随 CardModel 传入 renderer，renderer 在 `renderCard()` 中为跨列卡片注入 `grid-column: span N` inline style。

**Tech Stack:** 纯 JS，无新依赖。

---

## 文件映射

| 文件 | 改动 |
|---|---|
| `cheatsheet-html-maker/parser.js` | 新增 `normalizeColspan()`，修改 `extractCardMetaBlocks()` 和 `parseCheatsheetMarkdown()` |
| `cheatsheet-html-maker/renderer.js` | 修改 `renderCard()` |
| `cheatsheet-html-maker/tests/parser-renderer.test.js` | 新增测试 |

---

## 实现步骤

### Task 1: 添加 `normalizeColspan` 并导出

**文件：** `cheatsheet-html-maker/parser.js`

- [ ] **Step 1: 在 `normalizeColWidth` 函数后（第 129 行）添加 `normalizeColspan` 函数**

```js
export function normalizeColspan(value) {
  const n = Math.floor(Number(value))
  return (Number.isFinite(n) && n >= 1) ? n : 1
}
```

- [ ] **Step 2: 验证文件语法正确**

Run: `node --input-type=module < parser.js`
Expected: 无语法错误输出

- [ ] **Step 3: 提交**

```bash
git add cheatsheet-html-maker/parser.js
git commit -m "feat(parser): add normalizeColspan function"
```

---

### Task 2: 在 parser 中解析并传递 colspan

**文件：** `cheatsheet-html-maker/parser.js`

- [ ] **Step 1: 修改 `extractCardMetaBlocks()` 中解析 card meta 的逻辑**

在第 196 行附近，`metaByCardIndex.set` 的对象中增加 `colspan` 字段：

```js
metaByCardIndex.set(cardIndex, {
  ...prev,
  lang: typeof data.lang === 'string' ? normalizeLang(data.lang, DEFAULT_LANG) : prev.lang,
  emoji: typeof data.emoji === 'string' ? data.emoji.trim() : '',
  link: typeof data.link === 'string' ? data.link.trim() : '',
  desc: typeof data.desc === 'string' ? data.desc.trim() : '',
  colspan: normalizeColspan(data.colspan),
})
```

- [ ] **Step 2: 修改 `parseCheatsheetMarkdown()` 中构建 `currentCard` 的逻辑**

在第 444 行附近，`currentCard = { ... }` 对象中增加 `colspan` 字段（`parseCheatsheetMarkdown` 第 444 行 `currentCard = {` 附近）：

```js
currentCard = {
  type: 'card',
  title: title || 'Untitled',
  emoji: cardMeta.emoji || emoji,
  link: cardMeta.link || '',
  desc: cardMeta.desc || '',
  lang: cardLang,
  colspan: cardMeta.colspan ?? 1,
  items: [],
}
```

- [ ] **Step 3: 更新 `CardModel` JSDoc**

第 17–25 行附近 `CardModel` 定义处，在 `@property` 列表最后添加：

```js
 * @property {number} colspan - 卡片跨列数，默认 1
```

- [ ] **Step 4: 运行现有测试确认未破坏**

Run: `node --test cheatsheet-html-maker/tests/parser-renderer.test.js`
Expected: 全部 PASS

- [ ] **Step 5: 提交**

```bash
git add cheatsheet-html-maker/parser.js
git commit -m "feat(parser): parse and pass colspan in CardModel"
```

---

### Task 3: renderer 注入 colspan style

**文件：** `cheatsheet-html-maker/renderer.js`

- [ ] **Step 1: 修改 `renderCard` 函数**

第 145 行 `renderCard(card)` 函数，将：

```js
return `<div class="card"><h2>${title}${linkHtml}</h2>${body}</div>`
```

改为：

```js
const colspanStyle = (card.colspan > 1) ? ` style="grid-column: span ${card.colspan}"` : ''
return `<div class="card"${colspanStyle}><h2>${title}${linkHtml}</h2>${body}</div>`
```

- [ ] **Step 2: 运行现有测试确认未破坏**

Run: `node --test cheatsheet-html-maker/tests/parser-renderer.test.js`
Expected: 全部 PASS

- [ ] **Step 3: 提交**

```bash
git add cheatsheet-html-maker/renderer.js
git commit -m "feat(renderer): inject grid-column span style for colspan cards"
```

---

### Task 4: 新增 colspan 单元测试

**文件：** `cheatsheet-html-maker/tests/parser-renderer.test.js`

- [ ] **Step 1: 修改 import 行，添加 `normalizeColspan` 导出**

第 7 行，将：

```js
import { normalizeColWidth, parseCheatsheetMarkdown } from '../parser.js'
```

改为：

```js
import { normalizeColWidth, normalizeColspan, parseCheatsheetMarkdown } from '../parser.js'
```

- [ ] **Step 2: 添加 `normalizeColspan` 校验测试**

在第 96 行（`test('parser: 非法 colWidth...` 之前）添加：

```js
test('parser: normalizeColspan 校验规则', () => {
  assert.equal(normalizeColspan(2), 2)
  assert.equal(normalizeColspan('3'), 3)
  assert.equal(normalizeColspan('2.5'), 2)
  assert.equal(normalizeColspan(1.7), 1)
  assert.equal(normalizeColspan(3.9), 3)
  assert.equal(normalizeColspan(0), 1)
  assert.equal(normalizeColspan(-1), 1)
  assert.equal(normalizeColspan('abc'), 1)
  assert.equal(normalizeColspan(null), 1)
  assert.equal(normalizeColspan(undefined), 1)
})
```

- [ ] **Step 3: 添加 colspan 集成测试**

在最后一个 `test()` 块（e2e test，第 178 行）之后添加：

```js
test('parser/renderer: colspan 卡片输出 grid-column span style', async () => {
  const markdown = `---
title: Colspan Demo
lang: bash
---

## 宽卡片
---
colspan: 2
---

- \`cmd\` : 描述
`

  const model = parseCheatsheetMarkdown(markdown)
  const card = model.cards[0]
  assert.equal(card.colspan, 2)

  const testFile = fileURLToPath(import.meta.url)
  const template = await fs.readFile(path.join(path.dirname(testFile), '..', 'template.html'), 'utf8')
  const html = renderDocument(model, template)
  assert.ok(html.includes('style="grid-column: span 2"'))
})

test('parser/renderer: colspan: 1 不输出 style 属性', async () => {
  const markdown = `---
title: Normal Card
lang: bash
---

## 普通卡片
---
colspan: 1
---

- \`cmd\` : 描述
`

  const model = parseCheatsheetMarkdown(markdown)
  assert.equal(model.cards[0].colspan, 1)

  const testFile = fileURLToPath(import.meta.url)
  const template = await fs.readFile(path.join(path.dirname(testFile), '..', 'template.html'), 'utf8')
  const html = renderDocument(model, template)
  assert.ok(!html.includes('grid-column'))
})
```

- [ ] **Step 4: 运行全部测试**

Run: `node --test cheatsheet-html-maker/tests/parser-renderer.test.js`
Expected: 全部 PASS（含新增的 3 个 test）

- [ ] **Step 5: 提交**

```bash
git add cheatsheet-html-maker/tests/parser-renderer.test.js
git commit -m "test: add colspan unit and integration tests"
```

---

## 完成后检查清单

- [ ] `normalizeColspan` 单元测试 10 个断言全部 PASS
- [ ] colspan 集成测试 PASS（style 输出正确）
- [ ] colspan: 1 不输出 style 属性 PASS
- [ ] 现有测试全部 PASS（向后兼容）
- [ ] demo-2.md 第 17 行 `colspan: 2` 卡片在预览中横跨 2 列
- [ ] 所有 commit 已完成，无未提交改动
