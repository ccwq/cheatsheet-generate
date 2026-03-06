## Why

当前 cheatsheet 的 HTML 主要靠手写，结构重复、维护成本高，且不同页面容易出现样式与语义不一致。需要以 Markdown 作为唯一数据源自动生成统一风格 HTML，降低维护成本并提升可扩展性。

## What Changes

- 新增 `cheatsheet-html-maker` CLI 工具，支持参数模式（`--input`、`--output`）和无参数 TUI 交互模式。
- 定义并实现 Markdown 到内部数据结构的解析规则，覆盖 frontmatter、标题层级、列表条目、单行 inline code、围栏代码块以及 card 级 `lang` 覆盖。
- 新增 HTML 渲染流程，输出与现有 cheatsheet 一致的 `masonry/card/set/entry` 结构，并统一使用 Prism.js（Tomorrow）进行语法高亮。
- 提供可复用 HTML 模板（含基础样式与高亮资源引入），保证生成页面结构与视觉一致。
- 增加 emoji 处理机制：优先从 `##` 标题提取 emoji；缺失时在可配置开关下支持 AI 辅助补全建议。
- 补充 README 使用说明与语法映射文档，明确输入规范与生成行为。

## Capabilities

### New Capabilities
- `markdown-cheatsheet-model`: 定义 cheatsheet Markdown 语法到统一中间数据模型的映射与校验规则。
- `markdown-cheatsheet-parser`: 将 Markdown 文本解析为可渲染的数据结构，支持全局/局部语言继承与覆盖。
- `cheatsheet-html-renderer`: 按既有页面结构规范渲染 HTML，并集成 Prism.js 高亮输出。
- `cheatsheet-maker-cli-tui`: 提供 CLI 参数模式与 inquirer TUI 模式，完成输入选择、输出路径决策与生成流程编排。

### Modified Capabilities
- 无（`openspec/specs/` 当前无既有 capability 需要变更）

## Impact

- 影响代码范围：新增 `cheatsheet-html-maker/` 工具目录（`index.js`、`parser.js`、`renderer.js`、`template.html`、`README.md`、`package.json`）。
- 依赖影响：新增 Node CLI 相关依赖（如 `inquirer`、`commander/yargs`、`marked/unified+remark`、`prismjs`、frontmatter 解析库）。
- 工作流影响：cheatsheet 生产流程从“手写 HTML”为主转向“Markdown 驱动自动生成 HTML”。
- 兼容性影响：不改变既有 HTML 语义结构与代码高亮约定，目标是与当前页面表现保持一致。
