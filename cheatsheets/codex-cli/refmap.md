# Codex CLI 参考资料映射

## 官方入口
- [Codex CLI 首页](https://developers.openai.com/codex/cli) - 产品定位、起手方式、能力总览
- [CLI Reference](https://developers.openai.com/codex/cli/reference) - 全局参数、子命令、非交互参数
- [Slash Commands](https://developers.openai.com/codex/cli/slash-commands/) - 交互会话内的 slash commands
- [Features](https://developers.openai.com/codex/cli/features) - 工作流、会话、review、搜索、多模态等能力说明
- [Configuration Reference](https://developers.openai.com/codex/config-reference) - profiles、feature flags、TUI、sandbox、web search
- [Local Config / CLI](https://developers.openai.com/codex/local-config#cli) - `config.toml`、profiles 与本地配置

## 仓库与版本
- [GitHub 仓库](https://github.com/openai/codex) - 官方源码仓库
- [GitHub Releases](https://github.com/openai/codex/releases) - 发布版本与变更记录
- [npm: @openai/codex](https://www.npmjs.com/package/@openai/codex) - npm 最新稳定版与发布时间

## 本次更新对应关系
- `快速定位 / 一眼入口`：CLI 首页中的产品定位与入口说明
- `最小工作流`：Features 页面里的交互、非交互、review、会话继续等典型路径
- `高频场景 Recipes`：CLI 首页 + Features + Reference 中的交互、exec、review、resume/fork、MCP、cloud
- `Quick Ref / 命令速查`：Reference 页面里的子命令与全局参数
- `Slash Commands / 交互速记`：Slash Commands 页面
- `配置补遗 / 高级配置`：Configuration Reference 页面
- `决策点 / 常见坑`：Features 与 Local Config 页面里的 sandbox、approval、profile、临时配置覆盖
- `排障 / 收尾动作`：Local Config / CLI、Reference、npm 版本信息

## 版本说明
- 本次 `version` 采用 0.129.0（GitHub Releases，2026-05-08）
- 本次 `date` 采用 GitHub Releases 中 0.129.0 的发布时间 `2026-05-08`

## 0.129.0 主要变更（相比 rust-v0.128.0）
- Modal Vim 编辑模式：`/vim` 命令、默认模式配置、Vim 专用键位上下文
- TUI 工作流：resume/fork picker 重设计、raw scrollback、`/ide` 上下文注入、workspace-aware `/diff`
- 状态栏：主题感知颜色、PR/分支变更摘要
- 插件管理：工作区共享、访问控制、来源过滤、远程 bundle 同步
- Hooks 浏览器：可从 `/hooks` 浏览切换、compaction 前后运行、`PreToolUse` 上下文支持
- 实验性目标：可发现、跨 resume 保持暂停、更清晰的验证
