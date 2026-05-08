# Agent Browser 参考资源

## 版本记录
- 当前版本: v0.27.0（2026-05-07）
- v0.27.0: React DevTools 集成（`react tree`、`react inspect`、`react renders`、`react suspense`）、Web Vitals 命令、`pushstate` SPA 导航、`--init-script` 初始化脚本、`--enable` 特性开关、网络拦截按资源类型过滤、cURL cookie 导入、dashboard 代理支持
- v0.26.0: `doctor` 命令、`tab` 稳定 ID 与标签、`core` skill 重写、JSON Schema 配置
- v0.25.5: `--auto-connect` CDP 发现修复、录制 viewport 修复、`get box/styles` 修复、tab 焦点保留
- v0.25.4: `skills` 命令
- v0.25.3: 修复 accessibility tree 快照遗漏隐藏单选/复选框问题
- v0.25.2: 修复 Linux 上 Chrome 空闲约10秒后被杀死的问题
- v0.25.1: 嵌入式 dashboard（无需 `dashboard install`）
- v0.25.0: AI chat 命令、`--urls` 快照标志、batch 内联参数、dashboard 集成进 CLI
- v0.24.1: `profiles` 命令列出本机 Chrome profile

## 官方入口
- GitHub 仓库: https://github.com/vercel-labs/agent-browser
- NPM 包: https://www.npmjs.com/package/agent-browser
- NPM 版本时间线: https://www.npmjs.com/package/agent-browser?activeTab=versions

## 命令面核对
- CLI 总帮助: `npx agent-browser --help`
- 快照帮助: `npx agent-browser snapshot --help`
- 设置帮助: `npx agent-browser set --help`
- 网络帮助: `npx agent-browser network --help`

## 关键主题
- 快照与 refs: `snapshot`, `click @e1`, `fill @e2`, `snapshot --urls`（v0.25.0+）
- CDP 接管现有浏览器: `--cdp 9222`, `connect 9222`
- 自动连接 Chrome: `--auto-connect`（复用已登录态）
- 会话复用: `--session`, `--profile`, `--state`, `--session-name`
- Profile 管理: `profiles`（v0.24.1+）
- AI 对话: `chat`（v0.25.0+）
- 调试排查: `console`, `errors`, `trace`, `record`, `profiler`, `inspect`
- 网络控制: `network route`, `network requests`, `network unroute`, `network har`
- 批量与确认: `batch`, `batch open example.com snapshot -i`（内联参数 v0.25.0+）, `confirm`, `deny`
- 认证保险库: `auth save`, `auth login`, `auth list`
- Diff 对比: `diff snapshot`, `diff screenshot`, `diff url`
- 剪贴板: `clipboard read`, `clipboard write`, `clipboard copy/paste`

## 相关规范与生态
- Playwright 文档: https://playwright.dev/docs/intro
- Chrome DevTools Protocol: https://chromedevtools.github.io/devtools-protocol/
- Browserbase: https://www.browserbase.com/
