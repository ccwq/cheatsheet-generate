# cheatsheet-html-maker 格式指南

## MD 支持格式与 HTML 映射

> 依据源码提取：`cheatsheet-html-maker/parser.js` 与 `cheatsheet-html-maker/renderer.js`。
> 当前实现是本项目的 Markdown 子集，不是通用 Markdown 全兼容解析器。

### 规则 1：文档 Frontmatter（`--- ... ---`）

#### 输入格式

```yaml
---
title: Demo Sheet
lang: bash
version: 1.0
date: 2026-03-05
github: owner/repo
colWidth: 300px
---
```

#### 解析行为

- 支持字段：`title`、`lang`、`version`、`date`、`github`、`colWidth`。
- 缺省值：`title=Cheatsheet`、`lang=bash`、`version/date/github=unknown`、`colWidth=340px`。
- `lang` 会做归一化校验，不合法则回退为 `bash`。

#### HTML 映射

- 通过模板替换注入：`APP_TITLE`、`PAGE_TITLE`、`META_VERSION`、`META_DATE`、`META_GITHUB`、`COL_WIDTH`。
- `github` 若匹配 `owner/repo`，会额外映射成可点击链接：`https://github.com/owner/repo`。
- `colWidth` 用于设置卡片列宽的 CSS 变量，默认值为 `340px`。

### 规则 2：一级标题 `# 标题`

#### 输入格式

```md
# 页面标题覆盖
```

#### 解析行为

- 当出现 `#` 标题时，覆盖 frontmatter 中的 `title`。

#### HTML 映射

- 映射到模板面板标题（`.title` 文本）。

### 规则 3：二级标题 `## 标题`（Card）

#### 输入格式

```md
## 🧭 基础
```

#### 解析行为

- 每个 `##` 创建一个 card。
- 标题开头的 emoji 会被拆分为 `emoji` 与 `title` 两部分。
- 若标题无文字，title 回退为 `Untitled`。

#### HTML 映射

- 映射结构：`<div class="card"><h2>...</h2>{card-body}</div>`。
- 标题显示格式：`emoji + 空格 + title`。

### 规则 4：三级标题 `### 标题`（Set）

#### 输入格式

```md
### 子集
```

#### 解析行为

- 在当前 card 下创建 set。
- 若标题为空，回退 `Untitled Set`。

#### HTML 映射

- set 标题映射为 `<h3>子集</h3>`，其后紧跟该 set 的内容块。

### 规则 5：Card 元数据块（必须紧跟 `##`）

#### 输入格式

```md
## 主题
---
lang: python
emoji: 📌
link: https://example.com/docs
desc: 这是一段卡片说明
---
```

#### 解析行为

- 元数据块仅在 `##` 后的紧邻位置识别。
- 支持字段：`lang`、`emoji`、`link`、`desc`。
- 覆盖优先级：
  1. `emoji` 优先于标题中自动拆分出的 emoji。
  2. `lang` 作为该 card 默认语言。
- `desc` 若存在，会在 card 内容首位插入说明节点。

#### HTML 映射

- 标题映射：`<h2>📌 主题</h2>`。
- 当 `link` 为 `http/https` 时，标题尾部追加：`<a href="..." title="官方文档" target="_blank">&gt;&gt;&gt;</a>`。
- `desc` 映射为：`<div class="desc">这是一段卡片说明</div>`。

### 规则 6：无序列表普通项 `- 文本`

#### 输入格式

```md
- 普通文字
```

#### 解析行为

- 识别为列表项 `variant=text`。
- 对文本做空白规整（压缩连续空白）。

#### HTML 映射

- 映射为 `<li>普通文字</li>`，并包裹在 `<ul>...</ul>` 中。

### 规则 7：无序列表命令项 `- `code` : 描述`

#### 输入格式

一般应用于快捷键, 短指令

```md
- `C-b c` : 新建窗口
```

#### 解析行为

- 当列表项首节点为 `inlineCode`，且后续文本匹配 `: 描述` 时，识别为 `variant=code-desc`。
- 记录字段：`code`、`description`、`lang`（取当前 card 语言）。

#### HTML 映射

- 映射为 `<li><code>C-b c</code>：新建窗口</li>`。

### 规则 8：嵌套无序列表

#### 输入格式

```md
- `cmd` : 描述
  - 子项A
  - 子项B
```

#### 解析行为

- 支持递归 children，仅处理无序列表。

#### HTML 映射

- 映射为嵌套结构：`<li>父项<ul><li>子项...</li></ul></li>`。

### 规则 9：独占行行内代码

#### 输入格式

```md
`echo hello`
```

#### 解析行为

- 仅当段落内只有一个 `inlineCode` 节点时，识别为 `inlineCode` 模型。

#### HTML 映射

- 映射为 `<pre><code class="language-<lang>">echo hello</code></pre>`。

### 规则 10：围栏代码块

#### 输入格式

用来多行代码块, 例如 shell 脚本, python 代码等

```md
```js
console.log('x')
```
```

#### 解析行为

- 识别为 `codeBlock`。
- 代码语言优先取围栏声明值，非法时回退到 card/doc 默认语言。

#### HTML 映射

- 映射为 `<pre><code class="language-js">console.log('x')</code></pre>`。

### 规则 11：普通段落（说明文本）

#### 输入格式

```md
这是一段说明文字。
```

#### 解析行为

- 若段落文本不满足“类代码块”判定，则作为描述节点 `desc`。

#### HTML 映射

- 映射为 `<div class="desc">这是一段说明文字。</div>`。

### 规则 12：普通段落但判定为类代码块

#### 输入格式

```md
src
  app
    main.js
```

#### 解析行为

- 满足以下任一条件即判定为代码块：
  - 多行且存在至少一行缩进（`^\s{2,}\S`）
  - 文本包含树形字符 `└`、`├`、`│`

#### HTML 映射

- 按 `codeBlock` 输出：`<pre><code class="language-<lang>">...</code></pre>`。

### 语言优先级与规范

- 语言归一化：仅接受正则 `^[a-z0-9_+-]+$`，否则回退。
- 默认语言：`bash`。
- 优先级：
  1. 围栏代码块显式语言
  2. card 元数据 `lang`
  3. 文档 frontmatter `lang`
  4. `bash`

### 兼容性边界（按当前实现）

- 本工具定位为 cheatsheet 专用语法子集，不保证通用 Markdown 全量语义。
- card 元数据仅在 `##` 标题后紧邻 `--- ... ---` 时才会被识别。
- 非法 YAML 或非法语言会静默降级，不中断渲染。
- 当前渲染列表使用 `<ul><li>` 结构，不输出 `.entry` 类名。
