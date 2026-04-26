# Hermes Agent 参考映射

## 官方入口
- [GitHub 仓库](https://github.com/NousResearch/hermes-agent) - 源码与 README
- [GitHub Releases](https://github.com/NousResearch/hermes-agent/releases) - 版本与发布说明
- [官方文档首页](https://hermes-agent.nousresearch.com/) - 文档总入口
- [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart/) - 安装、模型、工具、网关与常用命令

## CLI 与配置
- [CLI Guide](https://hermes-agent.nousresearch.com/docs/user-guide/chat/) - 终端交互与命令参考
- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration/) - `config.yaml`、`.env`、后端、审批、上下文与辅助任务
- [Environment Variables](https://hermes-agent.nousresearch.com/docs/reference/environment-variables/) - 环境变量参考

## 核心能力
- [Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools/) - 工具、工具集与后端
- [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/) - 技能加载、安装、复用
- [Persistent Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory/) - `MEMORY.md` / `USER.md`
- [Memory Providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers/) - 可插拔记忆后端（Honcho 等）
- [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files/) - `AGENTS.md`、`SOUL.md`、`.cursorrules`
- [Personality & SOUL.md](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality/) - 人格与语气控制
- [Scheduled Tasks (Cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron/) - 定时任务
- [Subagent Delegation](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation/) - 子代理与分工
- [Browser Automation](https://hermes-agent.nousresearch.com/docs/user-guide/features/browser/) - 浏览器自动化（含 Camofox）
- [Voice Mode](https://hermes-agent.nousresearch.com/docs/user-guide/features/voice-mode) - 语音交互
- [Voice & TTS](https://hermes-agent.nousresearch.com/docs/user-guide/features/tts/) - 语音播报与转写
- [Checkpoints & Rollback](https://hermes-agent.nousresearch.com/docs/user-guide/features/checkpoints/) - 文件快照与回滚
- [Context Compression](https://hermes-agent.nousresearch.com/docs/user-guide/configuration/) - 上下文压缩与摘要
- [Credential Pools](https://hermes-agent.nousresearch.com/docs/user-guide/configuration/) - 同提供商多 Key 轮转
- [Fallback Providers](https://hermes-agent.nousresearch.com/docs/user-guide/configuration/) - 有序回退提供商链

## 集成与安全
- [Messaging Platforms](https://hermes-agent.nousresearch.com/docs/user-guide/messaging-platforms/) - Telegram、Discord、Slack、WhatsApp、Signal、Email、Home Assistant、飞书、企业微信、Matrix、Mattermost、DingTalk
- [MCP Integration](https://hermes-agent.nousresearch.com/docs/user-guide/integrations/mcp/) - 外部工具接入
- [MCP Server Mode](https://hermes-agent.nousresearch.com/docs/user-guide/integrations/mcp/) - `hermes mcp serve` 暴露会话给 MCP 客户端
- [ACP Editor Integration](https://hermes-agent.nousresearch.com/docs/user-guide/integrations/acp/) - VS Code / Zed / JetBrains 编辑器集成
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security/) - 命令审批、网关授权、容器隔离、MCP 凭证过滤、密钥脱敏

## 开发与架构
- [Architecture](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture/) - 运行循环、工具注册、网关与数据流
- [Creating Skills](https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills/) - 创建技能
- [Plugin System](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins/) - 插件架构与生命周期钩子
- [Cron Internals](https://hermes-agent.nousresearch.com/docs/developer-guide/cron-internals/) - Cron 实现细节
- [Tips & Best Practices](https://hermes-agent.nousresearch.com/docs/guides/tips/) - 实战建议

## 版本发布
- [v0.11.0 (2026-04-23)](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.4.23) - Latest release
- [v0.10.0 (2026-04-16)](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.4.16)
- [v0.9.0 (2026-04-13)](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.4.13)
- [v0.8.0 (2026-04-08)](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.4.8) - The intelligence release
- [v0.7.0 (2026-04-03)](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.4.3) - The resilience release
- [v0.6.0 (2026-03-30)](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.3.30) - The multi-instance release
- [v0.5.0 (2026-03-28)](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.3.28) - The hardening release
- [v0.4.0 (2026-03-23)](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.3.23) - The platform expansion release
