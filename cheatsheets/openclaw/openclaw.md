---
title: OpenClaw 速查
lang: bash
version: "2026.3.11"
date: 2026-03-12
github: openclaw/openclaw
---

# OpenClaw 速查

## 🚀 如何快速启动 OpenClaw
---
lang: bash
emoji: 🚀
link: https://docs.openclaw.ai/start/getting-started
desc: 从零开始运行网关的最短路径。
---

```bash
# 交互式初始化（首次使用）
openclaw onboard

# 启动网关
openclaw gateway --port 18789

# 打开控制台 UI
openclaw dashboard

# 查看状态
openclaw status
```

**前台运行（排障用）**
```bash
openclaw gateway run
```

---

## 📱 如何连接聊天平台（Telegram/Discord/WhatsApp）
---
lang: bash
emoji: 📱
link: https://docs.openclaw.ai/cli/channels
desc: 让 OpenClaw 连接到即时通讯平台。
---

```bash
# 添加 Telegram 机器人
openclaw channels add --channel telegram --account default --token "$TELEGRAM_BOT_TOKEN"

# 添加 Discord Bot
openclaw channels add --channel discord --account default --token "$DISCORD_BOT_TOKEN"

# 查看已配置的频道
openclaw channels list

# 测试频道连通性
openclaw channels status --probe
```

**常见配置项**
```json
{
  "channels": {
    "whatsapp": {
      "allowFrom": ["+15555550123"],
      "groups": { "*": { "requireMention": true } }
    }
  }
}
```

---

## 🔐 如何批准用户配对请求
---
lang: bash
emoji: 🔐
link: https://docs.openclaw.ai/channels/pairing
desc: 管理 DM 访问和设备配对。
---

```bash
# 查看待审批的配对请求
openclaw pairing list telegram

# 批准配对
openclaw pairing approve telegram ABCD1234

# 查看已配对设备
openclaw devices list

# 批准设备接入
openclaw devices approve req_123456
```

---

## 💬 如何让 AI 自动回复消息
---
lang: bash
emoji: 💬
link: https://docs.openclaw.ai/cli/message
desc: 发送消息、创建投票、添加反应。
---

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

---

## 🤖 如何管理 Agent 和模型
---
lang: bash
emoji: 🤖
link: https://docs.openclaw.ai/cli/index
desc: 配置 AI 模型和回退链。
---

```bash
# 查看已配置的 agent
openclaw agents list

# 新增隔离 agent
openclaw agents add dev --workspace ./dev-agent

# 绑定频道到 agent
openclaw agents bind --agent dev --bind telegram:default

# 查看模型状态
openclaw models status

# 设置默认模型
openclaw models set zai/glm-5

# 添加回退模型
openclaw models fallbacks add openai/gpt-5
```

---

## 🧵 如何查看和管理会话
---
lang: bash
emoji: 🧵
link: https://docs.openclaw.ai/cli/sessions
desc: 会话列表、清理、历史管理。
---

```bash
# 查看当前 agent 的活跃会话
openclaw sessions --active 120

# 查看所有 agent 的会话（JSON 格式）
openclaw sessions --all-agents --json

# 预览清理动作（不实际执行）
openclaw sessions cleanup --dry-run

# 执行清理
openclaw sessions cleanup --enforce
```

---

## 🌐 如何使用浏览器自动化工具
---
lang: bash
emoji: 🌐
link: https://docs.openclaw.ai/tools/browser
desc: 网页抓取、截图、表单填写。
---

```bash
# 启动受管浏览器
openclaw browser start

# 获取 AI 可用快照
openclaw browser snapshot --format ai

# 全页截图
openclaw browser screenshot --full-page

# 查询浏览器状态
openclaw browser status
```

---

## 📡 如何管理远程节点
---
lang: bash
emoji: 📡
link: https://docs.openclaw.ai/tools
desc: 在远程设备上执行命令、拍照等。
---

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

---

## ⏰ 如何设置定时任务和心跳
---
lang: bash
emoji: ⏰
link: https://docs.openclaw.ai/automation/cron-jobs
desc: 定时执行任务、监控系统状态。
---

```bash
# 创建定时任务（每 5 分钟）
openclaw cron add --name ping --every "*/5 * * * *" --system-event "巡检心跳"

# 列出所有任务
openclaw cron list

# 立即执行任务
openclaw cron run ping

# 查看任务执行记录
openclaw cron runs --id ping

# 注入系统事件
openclaw system event --text "手动触发检查"

# 开启心跳
openclaw system heartbeat enable
```

---

## 💾 如何备份和恢复配置
---
lang: bash
emoji: 💾
link: https://docs.openclaw.ai/cli/backup
desc: 本地状态归档与验证。
---

```bash
# 创建完整备份
openclaw backup create

# 仅备份配置
openclaw backup create --only-config

# 不包含工作区
openclaw backup create --no-include-workspace

# 验证备份
openclaw backup verify backup-latest.tar.gz
```

**配置文件操作**
```bash
# 查看配置路径
openclaw config file

# 验证配置语法
openclaw config validate

# JSON 格式输出
openclaw config validate --json
```

---

## 🔧 如何调试和修复问题
---
lang: bash
emoji: 🔧
link: https://docs.openclaw.ai/gateway/troubleshooting
desc: 诊断常见故障、自动修复。
---

```bash
# 一键状态检查
openclaw status --deep

# 自动诊断并给出修复建议
openclaw doctor

# 自动修复问题
openclaw doctor --fix

# 频道专项探测
openclaw channels status --probe

# 模型可用性探测
openclaw models status --probe

# 实时日志
openclaw logs --follow
```

**安全加固**
```bash
# 安全审计
openclaw security audit --deep
```

---

## � 如何加强网关安全
---
lang: bash
emoji: 🛡️
link: https://docs.openclaw.ai/gateway/security
desc: 最小权限配置、鉴权加固。
---

**安全建议**
- DM 策略使用 `pairing` 或 `allowlist`
- 生产环境优先 `loopback` / `tailnet`
- 开启 token/password 鉴权
- 敏感密钥使用 SecretRef 引用

**配置示例**
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

---

## 🔌 如何使用 ACP 会话溯源
---
lang: bash
emoji: 🔌
link: https://docs.openclaw.ai/tools/acp-agents
desc: ACP 代理运行与追踪。
---

```bash
# 开启会话溯源（记录元数据）
openclaw acp --provenance meta

# 开启溯源并显示收据
openclaw acp --provenance meta+receipt

# 关闭溯源
openclaw acp --provenance off
```

---

## 🛠️ 运维常用命令速查
---
lang: bash
emoji: 🛠️
link: https://docs.openclaw.ai/cli/gateway
desc: 网关运维和服务管理。
---

```bash
# 网关健康检查
openclaw gateway health

# 深度状态扫描
openclaw gateway status --deep

# 安装网关服务
openclaw gateway install --runtime node

# 重启网关
openclaw gateway restart

# 直接调用 RPC
openclaw gateway call sessions.list --params '{}'
```

---

## 📋 日常值守脚本
---
lang: bash
emoji: 📋
link: https://docs.openclaw.ai/cli/index
desc: 常用命令组合。
---

```bash
#!/bin/bash
# 值守巡检脚本

openclaw status --deep
openclaw channels status --probe
openclaw models status
```

**常用组合**
```bash
# 初始化后启动
openclaw onboard && openclaw gateway

# 新增频道后验证
openclaw channels add --channel telegram --token "$TOKEN"
openclaw channels status --probe

# 故障排查
openclaw status --deep && openclaw logs --follow
```
