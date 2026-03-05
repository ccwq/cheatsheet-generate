# cheatsheet-html-maker

将 cheatsheet Markdown 自动转换为结构化 HTML，保持与项目现有页面语义一致，并内置 Prism.js Tomorrow 代码高亮。

## 语法映射

| Markdown | 结果 |
| --- | --- |
| `# 标题` | 页面 `<h1>` |
| `## 标题` | 生成一个 `.card` |
| `### 标题` | 当前 card 内生成 `.set` |
| `- \`code\` : 描述` | `.entry`，包含 `<code>` 与 `.entry-desc` |
| `- 普通文字` | 纯文本 `.entry` |
| 独占行 `\`code\`` | 渲染为 `<pre><code class="language-xxx">` |
| 围栏代码块 | 渲染为 `<pre><code class="language-xxx">` |

语言优先级：`fence lang > card lang > doc lang (默认 bash)`。

## Frontmatter 与 card 级覆盖

文档支持 YAML frontmatter：

```yaml
---
title: tmux 速查
lang: bash
---
```

`##` 后可紧跟 YAML 片段覆盖该 card 默认语言：

```markdown
## 窗口管理
---
lang: js
---
```

## CLI 用法

```bash
# 参数模式
node cheatsheet-html-maker/index.js --input cheatsheets/tmux/tmux.md --output cheatsheets/tmux/tmux.html

# 省略 output 时自动同名 .html
node cheatsheet-html-maker/index.js --input cheatsheets/tmux/tmux.md

# 启用 AI emoji 补全
node cheatsheet-html-maker/index.js --input cheatsheets/tmux/tmux.md --ai-emoji
```

## TUI 用法

无参数运行会进入三步交互：

1. 选择输入 `.md` 文件
2. 输入输出文件路径
3. 选择是否启用 AI emoji

```bash
node cheatsheet-html-maker/index.js
```

## AI emoji 说明

- 标题包含显式 emoji 时直接使用。
- 标题无 emoji 且启用 AI 时，调用 `CHEATSHEET_EMOJI_PROVIDER_URL` 或 `--ai-provider-url` 指定的 HTTP provider。
- 请求失败只告警，不中断生成，emoji 回退为空字符串。

provider 请求体示例：

```json
{ "title": "窗口管理" }
```

provider 返回示例：

```json
{ "emoji": "🪟" }
```

## 已知限制

- 仅支持 cheatsheet 子集语法，不保证通用 Markdown 全兼容。
- card 级语言覆盖仅支持 `##` 后紧随 `--- ... ---` 片段。
- 非法或未知语言会回退为 `bash`。

## 常见错误

- 输入文件不存在：`[error] 输入文件不存在或不可读: ...`，进程退出码非 0。
- 解析失败：`[error] ...`，请检查 frontmatter 与语法结构。
- AI provider 不可用：输出 `[warn] AI emoji provider failed: ...`，仍会生成 HTML。
