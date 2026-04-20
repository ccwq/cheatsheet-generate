# Card Colspan 特性设计文档

**日期：** 2026-04-20  
**状态：** 待实现

---

## 背景

cheatsheet-html-maker 使用 CSS Grid 瀑布流布局渲染卡片。目前每张卡片固定占 1 列宽。用户希望通过在卡片 YAML meta 中声明 `colspan: N`，让特定卡片横跨多列，以展示内容更丰富的卡片（如大型表格、长代码块）。

---

## 目标

在保持现有瀑布流行为不变的前提下，允许卡片通过 `colspan` 声明跨多列显示。

---

## 语法

在卡片 `##` 标题下方的 YAML meta 块中声明：

```markdown
## 🧭 基础
---
colspan: 2
---
```

---

## 数据模型变更

### `CardModel`（`parser.js`）

新增字段：

```js
/**
 * @property {number} colspan - 卡片跨列数，默认 1
 */
```

---

## 校验规则：`normalizeColspan(value)`

新增独立函数，规则如下：

| 输入 | 输出 | 说明 |
|---|---|---|
| `2` | `2` | 正整数直接通过 |
| `"3"` | `3` | 字符串数字转换 |
| `"2.5"` | `2` | 字符串小数取整 |
| `1.7` | `1` | 数字小数 floor → 1 |
| `3.9` | `3` | 数字小数 floor → 3 |
| `0` / `-1` | `1` | 非正数回退 |
| `"abc"` / `null` / 未填 | `1` | 无法转换回退 |

伪代码：
```js
function normalizeColspan(value) {
  const n = Math.floor(Number(value))
  return (Number.isFinite(n) && n >= 1) ? n : 1
}
```

---

## 改动范围

### 1. `parser.js`

**`extractCardMetaBlocks()`**：在解析 card meta 时加入 `colspan`：

```js
colspan: normalizeColspan(data.colspan),
```

**`parseCheatsheetMarkdown()`**：在构建 `currentCard` 时传入 `colspan`：

```js
currentCard = {
  ...
  colspan: cardMeta.colspan ?? 1,
  ...
}
```

### 2. `renderer.js`

**`renderCard(card)`**：当 `colspan > 1` 时为 card div 注入 inline style：

```js
const colspanStyle = card.colspan > 1 ? ` style="grid-column: span ${card.colspan}"` : ''
return `<div class="card"${colspanStyle}>...</div>`
```

### 3. 不变部分

| 文件 | 原因 |
|---|---|
| `assets/cheatsheet.css` | CSS Grid 原生支持 `grid-column: span N`，无需新增规则 |
| `assets/common.js` | masonry 行跨度基于 `getBoundingClientRect().height`，宽卡片高度自动适配 |
| `template.html` | 无需变更 |

---

## 边界行为

- **列数不足时**：浏览器 CSS Grid 自动将 `span N` 降级为实际可用列数，不会溢出或触发横向滚动。
- **colspan: 1**：等同于默认行为，不输出 style 属性。
- **无上限**：不限制最大值，`colspan: 99` 会让卡片撑满整行，由用户自行控制合理性。

---

## 测试点

- `normalizeColspan` 单元测试覆盖上述全部输入场景
- demo-2.md 第 17 行已有 `colspan: 2`，可作为集成测试用例
- 生成 HTML 后目视验证卡片宽度
