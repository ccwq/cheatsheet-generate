# Agent Browser 参考资源

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
- 快照与 refs: `snapshot`, `click @e1`, `fill @e2`
- CDP 接管现有浏览器: `--cdp 9222`, `connect 9222`
- 自动连接 Chrome: `--auto-connect`（复用已登录态）
- 会话复用: `--session`, `--profile`, `--state`, `--session-name`
- 调试排查: `console`, `errors`, `trace`, `record`, `profiler`, `inspect`
- 网络控制: `network route`, `network requests`, `network unroute`, `network har`
- 批量与确认: `batch`, `confirm`, `deny`
- 认证保险库: `auth save`, `auth login`, `auth list`
- Diff 对比: `diff snapshot`, `diff screenshot`, `diff url`
- 剪贴板: `clipboard read`, `clipboard write`, `clipboard copy/paste`

## 相关规范与生态
- Playwright 文档: https://playwright.dev/docs/intro
- Chrome DevTools Protocol: https://chromedevtools.github.io/devtools-protocol/
- Browserbase: https://www.browserbase.com/
