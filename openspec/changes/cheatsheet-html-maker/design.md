## Context

当前 cheatsheet 项目的 HTML 主要靠手写维护，重复劳动高，且不同页面容易在结构、类名、语法高亮语言声明上出现不一致。该变更要引入 `cheatsheet-html-maker`，以 Markdown 为唯一数据源，自动产出与现有页面风格一致的 cheatsheet HTML。

必须满足的核心约束：
- 生成页面必须保持既有 DOM 语义与层级：`masonry-grid`、`card`、`card-header`、`card-body`、`set`、`entry`。
- 代码高亮统一 Prism.js，主题为 Tomorrow，并输出 `<pre><code class="language-xxx">...</code></pre>`。
- 语法解析必须支持文档级 frontmatter、card 级 `lang` 覆盖、emoji 提取与可选 AI 补全。
- 工具必须同时支持 CLI 参数模式与无参数 TUI 模式。

现有 HTML 结构契约（生成结果必须兼容）：
```html
<div class="masonry-grid">
  <div class="card">
    <div class="card-header">
      <span class="card-emoji"></span>
      <h2 class="card-title">窗口管理</h2>
    </div>
    <div class="card-body">
      <div class="entry">
        <code class="language-bash">C-b c</code>
        <span class="entry-desc">新建窗口</span>
      </div>
      <pre><code class="language-bash">tmux new-window -n name</code></pre>
      <div class="set">
        <h3 class="set-title">核心层级关系</h3>
        <div class="set-body"></div>
      </div>
    </div>
  </div>
</div>
```

## Goals / Non-Goals

**Goals:**
- 建立稳定的 `Markdown -> AST -> 中间模型 -> HTML` 生成链路。
- 将 MD 到 HTML 的映射规则显式化并可测试（标题、列表、inline code、fence code、card 元数据）。
- 产出结构与现有 HTML 一致、样式一致、代码高亮一致的页面。
- 提供可脚本化命令行与交互式 TUI，覆盖自动化与人工使用场景。
- 支持 emoji 规则：标题显式提取优先，缺失时按开关执行 AI 建议。

**Non-Goals:**
- 不改造导览页生成流程（`index.html` 导览逻辑不在本次范围）。
- 不在本次引入可视化编辑器与多主题系统。
- 不扩展为通用 Markdown 网站生成器，仅支持 cheatsheet 语法子集。
- 不强依赖联网服务（AI 仅可选，默认可关闭）。

## Decisions

### 1. 工程结构按职责拆分
- 决策：采用以下目录结构并固定职责。

```text
cheatsheet-html-maker/
├── index.js
├── parser.js
├── renderer.js
├── template.html
├── package.json
└── README.md
```

- `index.js`：CLI 参数解析与 TUI 分支调度、读写文件、流程编排。
- `parser.js`：Markdown 文本解析成中间数据模型。
- `renderer.js`：中间模型渲染为 HTML 片段并填充模板。
- `template.html`：基础页面骨架（含 Prism 资源与初始化）。

理由：降低耦合，便于独立测试 parser/renderer，也方便后续替换模板。

### 2. 解析技术栈采用 `unified + remark`
- 决策：默认选 `unified + remark` 做 AST 解析；frontmatter 使用 YAML 解析库。
- 相关工具：
  - 运行时：Node.js
  - TUI：`inquirer`
  - CLI 参数：`commander`（或 `yargs`，首选 commander）
  - 语法高亮：`prismjs`

理由：AST 方式对结构映射更稳健，适合精确实现语法规则；比基于正则或 HTML 反解析更可维护。

### 3. 明确 MD -> HTML 映射契约
- 决策：按下表实现并作为测试基线。

| MD 语法 | HTML 语义 |
|---|---|
| `# 标题` | 页面 `<h1>`，不生成 card |
| `## 标题` | 新建一个 `card`，标题为 `card-title` |
| `### 标题` | 当前 card 内新建 `set`，标题为 `set-title` |
| `- \`code\` : 描述` | `entry`，左侧 `<code>`，右侧 `.entry-desc` |
| `- 普通文字` | 纯文本 `entry` |
| 独占一行 `` `code` `` | inline code 块，语言取当前生效 `lang` |
| 围栏代码块 ` ```lang ` | `<pre><code class="language-xxx">`，优先 fence lang |

补充规则：
- frontmatter：
  - `title`：页面标题。
  - `lang`：全局默认高亮语言，缺省 `bash`。
- card 级元数据：
  - 在 `##` 后紧随 `---\nlang: xxx\n---` 时覆盖该 card 默认语言。
- 语言优先级：`fence lang` > `card lang` > `document lang(default bash)`。

### 4. Emoji 处理策略
- 决策：
  - 先从 `##` 标题中提取显式 emoji，写入 `.card-emoji`。
  - 若无 emoji 且启用 AI 开关，则调用可插拔 provider 生成建议。
  - AI 失败或关闭时回退为空字符串，不阻断生成流程。

理由：主流程可离线稳定运行，AI 仅增强体验。

### 5. CLI 与 TUI 双模式行为固定
- 决策：
  - 参数模式：
    - `cheatsheet-html-maker --input tmux.md --output tmux.html`
    - `cheatsheet-html-maker --input tmux.md`（默认同名 `.html`）
  - TUI 模式（无参数）：
    - 选择输入 `.md` 文件。
    - 输入输出文件名（默认同名 `.html`）。
    - 选择是否启用 AI emoji 补全。

理由：满足自动化批处理与手工运行两类场景。

### 6. 渲染模板内置 Prism Tomorrow
- 决策：`template.html` 固定引入 Prism CSS/JS，并在底部执行 `Prism.highlightAll()`。
- 规则：所有代码输出必须带 `language-xxx` 类名，避免高亮失效。

理由：确保生成 HTML 即开即用，不依赖调用方二次注入脚本。

## Risks / Trade-offs

- [Markdown 输入超出语法子集（复杂嵌套/混排）] -> Mitigation：解析器给出 warning；README 明确支持边界；不支持结构按纯文本降级。
- [旧文档存在非标准写法导致 entry 识别失败] -> Mitigation：对 `- \`code\`:描述`、空格差异做宽松匹配并增加回归样例。
- [未知语言标识导致 Prism 无高亮] -> Mitigation：语言名归一化，非法值回退到 `bash`。
- [AI provider 不稳定/不可达] -> Mitigation：默认可关闭，失败自动降级为空 emoji。
- [模板与既有站点样式耦合] -> Mitigation：模板集中维护，渲染层仅输出内容片段，便于未来替换壳模板。

## Migration Plan

1. 创建 `cheatsheet-html-maker/` 目录与基础文件（`index.js`、`parser.js`、`renderer.js`、`template.html`、`package.json`、`README.md`）。
2. 先实现核心映射（`#`/`##`/`###`、entry、code block、frontmatter lang、card lang 覆盖）。
3. 接入 Prism Tomorrow 资源并校验输出 DOM 与既有页面结构一致。
4. 实现 CLI 参数模式，再补充无参数 TUI 分支。
5. 用示例 Markdown（如 tmux 文档）做对照回归，确认结构、emoji、高亮都符合预期。
6. 在 README 固化语法规范、示例与常见错误处理策略。

## Open Questions

- AI emoji provider 的默认实现是否需要提供官方适配（例如环境变量配置的 HTTP provider）？
- 首版是否加入 `--dry-run`（输出解析模型/预览而不落盘）？
- 是否需要增加 `--strict` 模式，在遇到未识别语法时直接失败而非降级？
