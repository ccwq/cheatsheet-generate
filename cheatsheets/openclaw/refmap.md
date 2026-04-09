# OpenClaw 参考资源

## 版本记录
- 当前版本: v2026.4.9（2026-04-09）
- v2026.4.5: 内置 video_generate / music_generate，12+ 语言 UI，移除旧版 config 别名
- v2026.4.7: `openclaw infer` 推理工作流，memory-wiki 恢复，webhook ingress，compaction checkpoints
- v2026.4.8: bundled channels/plugins 修复，Slack proxy，agents/progress 更新
- v2026.4.9: Memory/Dreaming REM，Diary view，安全修复（SSRF、dotenv、exec injection、ftp CRLF）

## 官方入口
- [文档首页](https://docs.openclaw.ai/) - 总入口，适合从导航重新定位。
- [CLI 总览](https://docs.openclaw.ai/cli/index) - 命令树入口。
- [GitHub 仓库](https://github.com/openclaw/openclaw) - 源码、Issue、Release。
- [GitHub Releases](https://github.com/openclaw/openclaw/releases) - 版本发布记录。

## 起手与配置
- [Getting Started](https://docs.openclaw.ai/start/getting-started) - 最短上手路径。
- [Quickstart](https://docs.openclaw.ai/start/quickstart) - 快速启动步骤。
- [Onboarding Wizard](https://docs.openclaw.ai/start/wizard) - 交互式向导。
- [Configuration](https://docs.openclaw.ai/gateway/configuration) - 网关配置。
- [Configuration Reference](https://docs.openclaw.ai/gateway/configuration-reference) - 字段级说明。

## 网关与运维
- [Gateway Reference](https://docs.openclaw.ai/cli/gateway) - 网关命令。
- [Gateway Security](https://docs.openclaw.ai/gateway/security) - 鉴权与安全边界。
- [Gateway Troubleshooting](https://docs.openclaw.ai/gateway/troubleshooting) - 排障入口。
- [Status](https://docs.openclaw.ai/cli/status) - 状态与健康检查。
- [Logs](https://docs.openclaw.ai/cli/logs) - 日志查看。
- [Doctor](https://docs.openclaw.ai/cli/doctor) - 诊断与修复建议。

## 频道与消息
- [Channels Overview](https://docs.openclaw.ai/channels/index) - 频道总览。
- [Channels Reference](https://docs.openclaw.ai/cli/channels) - 频道 CLI。
- [Pairing](https://docs.openclaw.ai/channels/pairing) - 配对和审批。
- [Message Reference](https://docs.openclaw.ai/cli/message) - 发送、投票、反应。
- [Telegram](https://docs.openclaw.ai/channels/telegram) - Telegram 频道细节。

## 模型与会话
- [Models](https://docs.openclaw.ai/models) - 模型、fallback、认证。
- [Models CLI](https://docs.openclaw.ai/cli/models) - `models` 命令细节。
- [Sessions Reference](https://docs.openclaw.ai/cli/sessions) - 会话与清理。
- [Agents CLI](https://docs.openclaw.ai/cli/agents) - agent 创建、绑定、删除。
- [Config CLI](https://docs.openclaw.ai/cli/config) - 配置文件校验。

## 工具与自动化
- [Tools Overview](https://docs.openclaw.ai/tools/index) - 工具总入口。
- [Browser Tool](https://docs.openclaw.ai/tools/browser) - 浏览器自动化。
- [Browser Login](https://docs.openclaw.ai/tools/browser-login) - 浏览器登录和会话入口。
- [Web Tools](https://docs.openclaw.ai/tools/web) - `web_search` / `web_fetch`。
- [Nodes](https://docs.openclaw.ai/nodes) - 远程节点与环境能力。
- [Cron Jobs](https://docs.openclaw.ai/automation/cron-jobs) - 定时任务。
- [Hooks](https://docs.openclaw.ai/automation/hooks) - 事件钩子。
- [Plugins](https://docs.openclaw.ai/plugins) - 插件扩展。
- [Plugin Manifest](https://docs.openclaw.ai/plugins/manifest) - 插件清单与元数据。

## v2026.4.x 新增命令
- `openclaw infer` — 推理工作流 hub（v2026.4.7+）
- `openclaw nodes screen record` — 屏幕录制
- `openclaw nodes location get` — 位置获取
- `openclaw nodes notify` — 节点通知
- `openclaw browser profiles` — 浏览器 profile 管理
- `openclaw browser create-profile` / `delete-profile` — profile CRUD
- `openclaw plugins marketplace list` — 插件市场浏览

## 版本备注
- 当前条目对齐 GitHub Release `v2026.4.9`，发布日期 `2026-04-09`。
- v2026.4.5 有 Breaking Changes：移除旧版 config 别名，升级后需运行 `openclaw config validate`。
- 若子页面路径有调整，优先从文档首页和 `CLI 总览` 重新定位。
