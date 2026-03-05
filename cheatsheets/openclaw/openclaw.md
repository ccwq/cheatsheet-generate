---
title: OpenClaw 速查
lang: bash
version: "docs snapshot 2026-03-05"
date: 2026-03-05
github: openclaw/openclaw
---

# OpenClaw 速查

## 🦞 网关启动与基础流程
---
lang: bash
emoji: 🦞
link: https://docs.openclaw.ai/start/getting-started
desc: 从初始化到启动网关的最短路径。
---

### 常用启动链路
- `openclaw onboard` : 交互式初始化本地配置、模型与网关。
- `openclaw gateway` : 启动网关主进程（默认本地地址）。
- `openclaw gateway --port 18789 --bind loopback` : 显式绑定端口与监听模式。
- `openclaw gateway run` : 前台运行网关（便于排障）。
- `openclaw dashboard` : 打开控制台 UI。

```bash
# 首次初始化并选择 provider/channel
openclaw onboard

# 启动网关
openclaw gateway --port 18789

# 查看基础状态
openclaw status
```

## 🔌 频道与账号管理
---
lang: bash
emoji: 🔌
link: https://docs.openclaw.ai/cli/channels
desc: 管理 Telegram/WhatsApp/Discord 等频道账号与运行状态。
---

### 高频命令
- `openclaw channels list` : 列出已配置频道与账号。
- `openclaw channels add --channel telegram --token <TOKEN>` : 添加 Telegram 账号。
- `openclaw channels remove --channel telegram --delete` : 删除指定频道账号配置。
- `openclaw channels status --probe` : 探测频道连通性和常见配置问题。
- `openclaw channels logs --channel all` : 查看频道相关日志。

```bash
# 添加 Telegram 机器人账号
openclaw channels add --channel telegram --account default --token "$TELEGRAM_BOT_TOKEN"

# 探测频道与权限
openclaw channels status --probe
```

## 🔐 Pairing 与设备批准
---
lang: bash
emoji: 🔐
link: https://docs.openclaw.ai/channels/pairing
desc: 管理 DM 访问配对和节点设备配对。
---

### DM 配对
- `openclaw pairing list telegram` : 查看 Telegram 待审批配对请求。
- `openclaw pairing approve telegram <CODE>` : 批准指定配对码。

### 设备配对
- `openclaw devices list` : 查看已配对与待审批设备。
- `openclaw devices approve <requestId>` : 通过设备接入。
- `openclaw devices reject <requestId>` : 拒绝设备接入。

```bash
# 批准用户 DM 配对
openclaw pairing list telegram
openclaw pairing approve telegram ABCD1234

# 批准节点设备
openclaw devices list
openclaw devices approve req_123456
```

## ✉️ 消息与频道动作
---
lang: bash
emoji: ✉️
link: https://docs.openclaw.ai/cli/message
desc: 用统一命令发送消息、投票、反应、线程等动作。
---

### 核心子命令
- `openclaw message send` : 发送文本/媒体消息。
- `openclaw message poll` : 创建投票（支持 Discord/Telegram/WhatsApp/MS Teams）。
- `openclaw message react` : 对消息添加或移除反应。
- `openclaw message read` : 读取频道消息（按频道能力支持）。
- `openclaw message thread create|reply|list` : 线程相关动作（如 Discord）。

```bash
# 向 Telegram 发送消息
openclaw message send --channel telegram --target @mychat --message "今天的巡检已完成"

# 在 Discord 创建投票
openclaw message poll --channel discord --target channel:123 --poll-question "午饭?" --poll-option 米饭 --poll-option 面条
```

## 🧵 会话与子代理协作
---
lang: bash
emoji: 🧵
link: https://docs.openclaw.ai/cli/sessions
desc: 查看会话、清理历史、跨会话投递任务。
---

### 会话管理
- `openclaw sessions` : 查看当前 agent 的会话列表。
- `openclaw sessions --all-agents --json` : 聚合查看所有 agent 会话。
- `openclaw sessions cleanup --dry-run` : 预览会话维护清理动作。
- `openclaw sessions cleanup --enforce` : 强制执行维护策略。

### 与工具会话协同
- `sessions_list` : 通过 tool 获取会话索引。
- `sessions_history` : 拉取目标会话历史。
- `sessions_send` : 向目标会话发送消息。
- `sessions_spawn` : 派生子代理执行任务。

```bash
# 查看最近活跃会话
openclaw sessions --active 120

# 预演清理，不落盘
openclaw sessions cleanup --dry-run
```

## 🤖 Agent 与模型管理
---
lang: bash
emoji: 🤖
link: https://docs.openclaw.ai/cli/index
desc: 管理 agent、模型、鉴权 profile 与回退链。
---

### Agent 侧
- `openclaw agents list` : 列出已配置 agent。
- `openclaw agents add <name> --workspace <dir>` : 新增隔离 agent。
- `openclaw agents bind --agent <id> --bind telegram:default` : 将频道账号绑定到 agent。

### 模型侧
- `openclaw models status` : 查看模型与鉴权状态。
- `openclaw models set <model>` : 设置默认主模型。
- `openclaw models fallbacks add <model>` : 添加回退模型。
- `openclaw models auth add` : 交互式添加模型凭据。

```bash
# 为主 agent 设定默认模型
openclaw models set zai/glm-5

# 添加回退模型
openclaw models fallbacks add openai/gpt-5
```

## ⚙️ Gateway 运维与服务管理
---
lang: bash
emoji: ⚙️
link: https://docs.openclaw.ai/cli/gateway
desc: 网关健康检查、服务安装、重启与 RPC 调试。
---

### 运维命令
- `openclaw gateway health` : 查询网关健康状态。
- `openclaw gateway status --deep` : 服务状态 + 深度扫描。
- `openclaw gateway install --runtime node` : 安装网关服务。
- `openclaw gateway restart` : 重启服务实例。
- `openclaw gateway call <method> --params <json>` : 直接调用 RPC。
- `openclaw logs --follow` : 持续跟踪网关日志。

```bash
# 深度状态检查
openclaw gateway status --deep

# 观察实时日志
openclaw logs --follow
```

## 🌐 Browser / Nodes / Canvas 工具链
---
lang: bash
emoji: 🌐
link: https://docs.openclaw.ai/tools
desc: 通过内置工具做网页自动化、节点控制与画布操作。
---

### Browser CLI
- `openclaw browser status` : 查询浏览器控制器状态。
- `openclaw browser start` : 启动受管浏览器。
- `openclaw browser snapshot --format ai` : 抓取 AI 可操作快照。
- `openclaw browser screenshot --full-page` : 全页截图。

### Nodes CLI
- `openclaw nodes status --connected` : 查看在线节点。
- `openclaw nodes describe --node <id>` : 查看节点能力。
- `openclaw nodes run --node <id> <command...>` : 在节点执行命令。
- `openclaw nodes camera snap --node <id>` : 节点相机抓拍。

```bash
# 启动浏览器并抓取页面快照
openclaw browser start
openclaw browser snapshot --format ai

# 在节点执行命令
openclaw nodes run --node office-mac echo hello
```

## ⏱️ 自动化与定时任务
---
lang: bash
emoji: ⏱️
link: https://docs.openclaw.ai/automation/cron-jobs
desc: 使用 cron 与 system event 做定时任务和心跳驱动。
---

### cron 命令
- `openclaw cron list` : 列出所有任务。
- `openclaw cron add --name ... --every ... --system-event ...` : 新增定时任务。
- `openclaw cron edit <id>` : 修改任务。
- `openclaw cron run <id>` : 立即执行任务。
- `openclaw cron runs --id <id>` : 查看任务执行记录。

### system 命令
- `openclaw system event --text "..."` : 注入系统事件。
- `openclaw system heartbeat enable` : 开启心跳。
- `openclaw system presence --json` : 查看 presence 状态。

```bash
# 每 5 分钟注入系统事件
openclaw cron add --name ping --every "*/5 * * * *" --system-event "巡检心跳"

# 立即触发一次
openclaw cron run ping
```

## 🧯 排障与安全基线
---
lang: bash
emoji: 🧯
link: https://docs.openclaw.ai/gateway/security
desc: 快速定位常见故障并强化最小权限配置。
---

### 排障路线
- `openclaw status --deep` : 一键总览网关/频道/节点状态。
- `openclaw doctor` : 自动检查并给出修复建议。
- `openclaw doctor --fix` : 自动修复可安全迁移项。
- `openclaw channels status --probe` : 频道专项探针。
- `openclaw models status --probe` : 模型与凭据可用性探测。

### 安全建议
- `dmPolicy` 建议优先 `pairing` 或显式 `allowlist`。
- 非必要不暴露公网监听；优先 `loopback` / `tailnet`。
- 生产环境开启 token/password 鉴权，避免匿名网关。
- 敏感密钥使用引用（SecretRef）而非明文落盘。

```bash
# 执行安全审计
openclaw security audit --deep

# 修复常见配置问题
openclaw doctor --fix
```

## 🧠 速记：常见组合
---
lang: bash
emoji: 🧠
link: https://docs.openclaw.ai/cli/index
desc: 高价值组合命令，适合日常值守与自动化脚本。
---

- `openclaw onboard && openclaw gateway` : 初始化后立刻上线。
- `openclaw channels add ... && openclaw channels status --probe` : 新增频道后立即验收。
- `openclaw status --deep && openclaw logs --follow` : 故障时先看面再盯点。
- `openclaw models status && openclaw sessions --active 60` : 检查模型与会话负载。

```bash
# 值守巡检脚本示例
openclaw status --deep
openclaw channels status --probe
openclaw models status
```
