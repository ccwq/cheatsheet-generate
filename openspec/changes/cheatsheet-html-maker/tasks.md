## 1. 项目初始化与脚手架

- [x] 1.1 创建 `cheatsheet-html-maker/` 目录与基础文件（`index.js`、`parser.js`、`renderer.js`、`template.html`、`README.md`、`package.json`）
- [x] 1.2 在 `package.json` 配置 CLI 入口（bin）与基础脚本（如 `start`/`build` 或 `test`）
- [x] 1.3 安装并声明依赖：`inquirer`、`commander`（或 yargs）、`unified`/`remark`、`prismjs`、frontmatter/YAML 解析库

## 2. 中间模型与解析器实现

- [x] 2.1 设计并实现中间模型结构（document/card/set/entry/inlineCode/codeBlock）及其 Type/Schema 注释约束
- [x] 2.2 实现 frontmatter 解析：读取 `title`、`lang`，并处理默认 `lang=bash`
- [x] 2.3 实现标题映射：`#`->页面标题，`##`->card，`###`->set，保证层级归属正确
- [x] 2.4 实现 entry 解析：支持 `- \`code\` : 描述` 与 `- 普通文字` 两类条目
- [x] 2.5 实现代码语义解析：区分独占行 inline code 与 fenced code block
- [x] 2.6 实现 card 级 `lang` 覆盖解析（`##` 后紧随 YAML 片段）并计算语言优先级（fence > card > doc）

## 3. HTML 渲染与模板集成

- [x] 3.1 在 `renderer.js` 实现 `masonry-grid`/`card`/`set`/`entry` DOM 映射，确保类名与结构契约一致
- [x] 3.2 实现 code+desc entry 渲染与纯文本 entry 渲染，保持源顺序输出
- [x] 3.3 实现代码块渲染：inline 与 block 均输出 `language-xxx` 类
- [x] 3.4 在 `template.html` 集成 Prism Tomorrow 样式、脚本与 `Prism.highlightAll()` 初始化
- [x] 3.5 完成模板注入逻辑：将页面 `<h1>` 与卡片 HTML 片段安全注入基础模板

## 4. CLI 与 TUI 流程实现

- [x] 4.1 实现参数模式：支持 `--input` 与可选 `--output`，未传 output 时默认同名 `.html`
- [x] 4.2 实现无参数 TUI：`.md` 文件选择、输出名输入、AI emoji 开关三步交互
- [x] 4.3 实现 emoji 策略：优先提取标题显式 emoji，缺失时按开关调用 AI provider，失败回退为空
- [x] 4.4 实现错误处理与退出码：输入不存在/解析失败时输出可读错误并返回非零码
- [x] 4.5 实现成功提示：生成完成后输出目标路径与简要结果信息

## 5. 验证、回归与文档

- [x] 5.1 基于示例 Markdown（tmux）完成端到端生成并人工校验 DOM 结构与语义一致性
- [x] 5.2 增加解析与渲染回归样例：覆盖语言优先级、entry 两种语法、set 归属与代码块类型
- [x] 5.3 验证 TUI 与参数模式在成功/失败路径下的行为与提示
- [x] 5.4 在 `README.md` 补充语法映射表、CLI/TUI 用法、已知限制与常见错误说明
