---
title: OpenClaw 速查 + Cookbook
lang: bash
version: "v2026.3.24"
date: 2026-03-25
github: openclaw/openclaw
colWidth: 420px
---
# OpenClaw 速查 + Cookbook

## 快速定位
---
lang: bash
emoji: 🧭
link: https://docs.openclaw.ai/
desc: OpenClaw 是一个把网关、频道、消息、会话、工具和自动化串起来的 AI 代理运行层。先按场景选入口，再用下方速查块抄命令，适合既要“快速找到入口”，又要“知道下一步怎么接”的读法。
---
### 它最适合做什么

- 把 Telegram、Discord、WhatsApp 等频道接到同一套代理层。
- 统一管理消息收发、会话、配对、工具、定时任务和远程节点。
- 管理模型、provider、fallback 和 agent 路由绑定。
- 让浏览器自动化、消息动作、系统事件、ACP 会话溯源放进同一条运维链。

### 先从哪开始

- 新环境先跑 `openclaw onboard`，再起 `openclaw gateway`。
- 需要看状态先开 `openclaw dashboard` 或 `openclaw status`。
- 想把外部聊天流接进来，先看 `channels` 和 `pairing`。
- 需要自动回复、定时触发、浏览器操作，再往 `message`、`cron`、`browser`、`nodes` 走。

### 最短路径

```bash
# 初始化向导
openclaw onboard

# 启动网关
openclaw gateway

# 开控制台
openclaw dashboard

# 看整体状态
openclaw status
```

## 起手工作流
---
lang: bash
emoji: 🚀
link: https://docs.openclaw.ai/start/getting-started
desc: 先把“网关活着、频道接上、模型可用、会话能看见”这四件事跑通，再谈自动化和扩展。
---
### 1. 先起网关

```bash
# 前台运行，适合排障
openclaw gateway run

# 常规启动
openclaw gateway

# 需要观察状态时另开一个终端
openclaw status
```

### 2. 再看控制台

```bash
# 控制面板 / Web UI
openclaw dashboard

# 深度状态检查
openclaw status --deep

# 诊断并给出修复建议
openclaw doctor
```

### 3. 最后确认配置没有断链

- 网关能启动，不代表频道能发消息。
- 模型能列出，不代表当前 agent 已绑定正确 provider。
- 会话能看到，不代表清理任务和历史保留策略已经按预期配置。

## 频道接入
---
lang: bash
emoji: 📱
link: https://docs.openclaw.ai/cli/channels
desc: 把即时通讯平台接进 OpenClaw，常见顺序是登录或添加账号、做配对、再验证连通性。
---
### 常见接入流程

```bash
# 查看频道命令树
openclaw channels --help

# 登录或添加频道账号
openclaw channels login --channel telegram

# 查看已配置频道
openclaw channels list

# 连通性探测
openclaw channels status --probe
```

### 配对与审批

```bash
# 查看待审批配对请求
openclaw pairing list telegram

# 批准配对
openclaw pairing approve telegram ABCD1234

# 查看已配对设备
openclaw devices list

# 批准设备接入
openclaw devices approve req_123456
```

### 频道策略常见点

- `allowFrom` 用来限制能发消息的人或号码。
- `requireMention` 适合群聊里只响应明确点名的场景。
- `dmPolicy` 影响私聊是否需要先配对或走白名单。

```json
{
  "channels": {
    "whatsapp": {
      "allowFrom": ["+15555550123"],
      "groups": {
        "*": {
          "requireMention": true
        }
      }
    }
  }
}
```

## 消息工作流
---
lang: bash
emoji: 💬
link: https://docs.openclaw.ai/cli/message
desc: 统一处理发送、投票、反应和线程类消息动作，适合做机器人回复和运维通知。
---
### 最常用动作

```bash
# 发送文本消息
openclaw message send --channel telegram --target @mychat --message "巡检完成"

# 创建投票
openclaw message poll --channel discord --target channel:123 \
  --poll-question "午饭选什么?" \
  --poll-option 米饭 \
  --poll-option 面条

# 添加反应
openclaw message react --channel telegram --message-id 123 --emoji "✅"
```

### 适合什么场景

- 机器人收到事件后，直接回一条确认或结果通知。
- 让 agent 发起投票或做简单的人机确认。
- 需要把处理结果标记成可追踪状态时，用 reaction 比重新发一条消息更轻。

## 会话与上下文
---
lang: bash
emoji: 🧵
link: https://docs.openclaw.ai/cli/sessions
desc: 会话是 OpenClaw 的运维中心之一，适合看活跃会话、清理历史、追踪当前 agent 状态。
---
### 常用命令

```bash
# 看当前活跃会话
openclaw sessions --active 120

# 看所有 agent 的会话，适合脚本消费
openclaw sessions --all-agents --json

# 预演清理
openclaw sessions cleanup --dry-run

# 真正执行清理
openclaw sessions cleanup --enforce
```

### 什么时候先看 sessions

- 机器人没回消息，但网关和频道都在线。
- 某个 agent 似乎“记不住”上下文。
- 想做容量控制、历史归档或会话回收。

## 模型与代理
---
lang: bash
emoji: 🧠
link: https://docs.openclaw.ai/models
desc: OpenClaw 的模型层决定“谁来答、失败后找谁、不同频道流量进哪个 agent”。先看状态，再调 primary、fallback、alias 和 binding。
---
### 模型速查

```bash
# 看当前解析后的模型状态
openclaw models status

# 列出已配置模型
openclaw models list

# 设置默认主模型
openclaw models set openai/gpt-5.2

# 设置图像模型
openclaw models set-image openai/gpt-5.2

# 管理回退链
openclaw models fallbacks list
openclaw models fallbacks add openai/gpt-5.2-mini
openclaw models fallbacks remove openai/gpt-5.2-mini
openclaw models fallbacks clear

# 扫描可用模型目录
openclaw models scan

# 管理认证
openclaw models auth setup-token --provider anthropic
openclaw models auth paste-token --provider anthropic
```

### 代理路由

```bash
# 查看 agent 列表
openclaw agents list

# 新增隔离 agent
openclaw agents add work --workspace ~/.openclaw/workspace-work

# 查看绑定
openclaw agents bindings

# 绑定频道流量到指定 agent
openclaw agents bind --agent work --bind telegram:ops

# 解绑
openclaw agents unbind --agent work --bind telegram:ops

# 调整身份
openclaw agents set-identity --workspace ~/.openclaw/workspace --from-identity

# 删除 agent
openclaw agents delete work
```

### 什么时候优先看这里

- 同一频道进来的消息要按工作区隔离。
- 某个模型失败后需要自动切换备用模型。
- 想把不同 sender、channel 或 account 路由到不同 agent。

## 工具总线
---
lang: bash
emoji: 🧰
link: https://docs.openclaw.ai/tools/index
desc: OpenClaw 的工具层把浏览器、远程节点、Web 工具、ACP 和插件放在同一条链上，适合把动作统一到代理后端。
---
### 浏览器自动化

```bash
# 启动受管浏览器
openclaw browser start

# 取 AI 可用快照
openclaw browser snapshot --format ai

# 全页截图
openclaw browser screenshot --full-page

# 查看状态
openclaw browser status
```

### 远程节点

```bash
# 查看在线节点
openclaw nodes status --connected

# 查看节点能力
openclaw nodes describe --node office-mac

# 在节点执行命令
openclaw nodes run --node office-mac "ls -la"

# 节点相机抓拍
openclaw nodes camera snap --node office-mac
```

### Web 工具 / ACP / 插件

```bash
# Web 搜索
web_search "OpenClaw gateway control UI"

# 网页抓取
web_fetch https://docs.openclaw.ai/

# ACP 会话溯源
openclaw acp --provenance meta

# 插件列表
openclaw plugins list

# 安装插件
openclaw plugins install <plugin-name>
```

## 自动化工作流
---
lang: bash
emoji: ⏰
link: https://docs.openclaw.ai/automation/cron-jobs
desc: 定时任务、系统事件、心跳和通知，适合做值守、巡检、自动触发和收尾动作。
---
### 定时任务

```bash
# 创建每 5 分钟一次的任务
openclaw cron add --name ping --every "*/5 * * * *" --system-event "巡检心跳"

# 列出所有任务
openclaw cron list

# 立即执行
openclaw cron run ping

# 查看执行记录
openclaw cron runs --id ping
```

### 系统事件与心跳

```bash
# 注入系统事件
openclaw system event --text "手动触发检查"

# 开启心跳
openclaw system heartbeat enable
```

### 适合的套路

- 日常巡检先触发 `system event`，再让 agent 处理。
- 长周期任务用 `cron`，一次性确认用 `message`。
- 做值守时，把 `cron runs` 和 `logs --follow` 放在一起看。

## 安全与运维
---
lang: bash
emoji: 🛡️
link: https://docs.openclaw.ai/gateway/security
desc: 先把权限边界、鉴权和备份收紧，再上生产环境。OpenClaw 更像运行层，不是单条命令的玩具。
---
### 安全要点

- 生产环境优先使用 `loopback` 或受控网络暴露。
- 开启 token 或 password 鉴权。
- DM 策略优先用 `pairing` 或 `allowlist`。
- 敏感密钥优先引用 `SecretRef`，不要硬编码在明文配置里。

```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "secret://gateway-token"
    }
  },
  "channels": {
    "telegram": {
      "dmPolicy": "pairing"
    }
  }
}
```

### 运维常用

```bash
# 一键诊断
openclaw doctor --fix

# 安全审计
openclaw security audit --deep

# 备份
openclaw backup create

# 验证备份
openclaw backup verify backup-latest.tar.gz
```

## 决策与排障
---
lang: bash
emoji: ⚠️
link: https://docs.openclaw.ai/gateway/troubleshooting
desc: 最容易出问题的地方通常不是“命令不会敲”，而是频道、会话、模型、权限和配置链路断在中间。
---
### 先怎么判断

- 网关不起来，先看 `status --deep` 和 `doctor`。
- 频道能列出但收不到消息，优先看 `channels status --probe` 和配对状态。
- 消息发不出去，检查目标、账号权限和频道策略。
- 会话看得见但行为不对，先查 `sessions` 再查 `models`。

### 排障速查

```bash
# 深度状态扫描
openclaw status --deep

# 频道探测
openclaw channels status --probe

# 模型可用性探测
openclaw models status --probe

# 实时日志
openclaw logs --follow

# 查看服务调用
openclaw gateway call sessions.list --params '{}'
```

## Quick Ref
---
lang: bash
emoji: 🧾
link: https://docs.openclaw.ai/cli/index
desc: 这部分只保留最常用、最适合直接复制的命令。
---
### 启动与状态

```bash
openclaw onboard
openclaw gateway
openclaw gateway run
openclaw dashboard
openclaw status
openclaw status --deep
openclaw doctor
```

### 频道与消息

```bash
openclaw channels login --channel telegram
openclaw channels list
openclaw channels status --probe
openclaw pairing list telegram
openclaw pairing approve telegram ABCD1234
openclaw message send --channel telegram --target @mychat --message "巡检完成"
openclaw message react --channel telegram --message-id 123 --emoji "✅"
```

### 会话与自动化

```bash
openclaw sessions --active 120
openclaw sessions --all-agents --json
openclaw sessions cleanup --dry-run
openclaw cron add --name ping --every "*/5 * * * *" --system-event "巡检心跳"
openclaw cron list
openclaw cron run ping
openclaw browser snapshot --format ai
openclaw nodes status --connected
```

### 备份与安全

```bash
openclaw backup create
openclaw backup verify backup-latest.tar.gz
openclaw security audit --deep
openclaw logs --follow
```


