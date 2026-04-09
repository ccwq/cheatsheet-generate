---
title: OpenClaw 速查 + Cookbook
lang: bash
version: "v2026.4.9"
date: 2026-04-09
github: openclaw/openclaw
colWidth: 420px
---
# OpenClaw 速查 + Cookbook

## v2026.4.x 新增能力
---
lang: bash
emoji: ✨
link: https://github.com/openclaw/openclaw/releases
desc: v2026.4.x 是最大一次更新，新增 inference hub、媒体生成、记忆梦境、Diary UI、12+语言支持，以及大量安全修复。
---

### Inference Hub（v2026.4.7+）
```bash
# 新增统一推理工作流入口
openclaw infer
# 支持 provider-backed inference 管理
# 配合 model scan 和 auth 体系使用
```

### 内置媒体生成（v2026.4.5+）
```bash
# 视频生成（内置 video_generate tool）
# 支持 Google Lyria、MiniMax、Comfy

# 音乐生成（内置 music_generate tool）
# 支持 Google Lyria、MiniMax、Comfy

# 自动在 auth-backed 图像/音乐/视频 provider 间做 fallback
```

### 记忆与梦境（v2026.4.7+）
```bash
# 三阶段协作记忆：light、deep、REM
# grounded REM backfill lane
# diary commit / reset flows
# durable-fact extraction
```

### Control UI — Diary View（v2026.4.9+）
```bash
# 结构化日记视图，带时间线导航
# backfill 控制面板
# 与 memory/dreaming 系统集成
```

### 新增 Provider（v2026.4.5-v2026.4.7）
- Google Gemma 4
- Arcee AI
- Amazon Bedrock Mantle
- Qwen（v2026.4.5+）
- Fireworks AI（v2026.4.5+）
- StepFun（v2026.4.5+）

### Control UI 多语言（v2026.4.5+）
- 12+ 语言本地化支持
- 本地化界面减少团队使用门槛

### 节点能力扩展
```bash
openclaw nodes screen record     # 屏幕录制
openclaw nodes location get      # 位置获取
openclaw nodes notify           # 节点通知
```

### 安全修复（v2026.4.8-v2026.4.9）
- Browser/SSRF：交互后导航重新检查安全策略
- dotenv：阻止不受信 workspace .env 中的运行时控制环境变量
- Gateway/node exec：清理节点提供的文本防止 `System:` 内容注入
- basic-ftp：强制升级到 5.2.1 修复 CRLF 命令注入
- Plugin auth：防止 workspace 插件与内置 provider auth-choice ID 冲突

### Breaking Changes（v2026.4.5）
- 移除旧版 public config 别名（如 `talk.voiceId`、`agents.*.sandbox.perSession`）
- 升级前先跑 `openclaw config validate`

## 快速定位
---
lang: bash
emoji: 🧭
link: https://docs.openclaw.ai/
desc: OpenClaw 是把网关、频道、消息、模型、会话、浏览器、节点和自动化串起来的运行层。先跑通网关，再按场景接入频道、模型和自动化。
---
### 它最适合做什么

- 把聊天频道接到同一套代理层。
- 统一管理模型路由、会话、消息动作和运维状态。
- 把浏览器自动化、远程节点、定时任务和插件扩展接进同一条链。

### 最短路径

```bash
# 首次使用先走向导（支持 --install-daemon）
openclaw onboard --install-daemon

# 补全或重做配置
openclaw configure

# 启动控制台（Web UI）
openclaw dashboard

# 启动网关
openclaw gateway --port 18789

# 推理工作流（v2026.4.7+）
openclaw infer

# 看整体状态
openclaw status --deep
```

## 起手工作流
---
lang: bash
emoji: 🚀
link: https://docs.openclaw.ai/start/getting-started
desc: 先把“配置、网关、频道、模型、会话”这几件事跑通，再谈扩展和自动化。
---
### 1. 先确认入口

```bash
# 交互式上手
openclaw onboard

# 重新整理配置
openclaw configure

# 查看配置文件路径
openclaw config file
```

### 2. 启动网关和控制台

```bash
# 前台启动，适合排障
openclaw gateway run

# 常规启动
openclaw gateway --port 18789

# 开控制台看链路状态
openclaw dashboard
```

### 3. 验证最小闭环

- 网关能起，不代表频道已接通。
- 频道能列出，不代表配对和权限已经就绪。
- 模型能列出，不代表当前路由就是你想要的默认模型。

## 网关与状态
---
lang: bash
emoji: 🛰️
link: https://docs.openclaw.ai/cli/gateway
desc: 网关是 OpenClaw 的核心运行面。先看健康、再看状态、最后做安装或重启动作。
---
### 常用操作

```bash
# 网关状态
openclaw gateway status

# 健康检查
openclaw gateway health

# 自动发现可用网关
openclaw gateway discover

# 安装网关服务
openclaw gateway install

# 启停和重启
openclaw gateway start
openclaw gateway stop
openclaw gateway restart
```

### 排障顺序

```bash
openclaw status
openclaw status --all
openclaw status --deep
openclaw health --json
openclaw logs --follow
openclaw doctor --repair
```

## 配置速查
---
lang: bash
emoji: 🛠️
link: https://docs.openclaw.ai/gateway/configuration
desc: OpenClaw 主要靠配置驱动。交互式向导适合首次整理，CLI 适合脚本化和批量修改。
---
### 常用命令

```bash
# 打开交互式配置向导
openclaw configure

# 无子命令时也会进入配置入口
openclaw config

# 读取配置路径
openclaw config file

# 读取 / 写入 / 删除配置项
openclaw config get gateway.port
openclaw config set gateway.port 18789
openclaw config unset tools.web.search.apiKey

# 校验配置
openclaw config validate
openclaw config validate --json
```

### 常见操作

- 改了 gateway、channel 或 model 配置后，重启网关再验证。
- `openclaw configure --section web` 适合补 web search 相关配置。
- 需要查官方文档时，直接用 `openclaw docs <keyword>`。
- 需要脚本化时，优先用 `config get|set|unset|validate`。

## 频道接入
---
lang: bash
emoji: 📱
link: https://docs.openclaw.ai/channels/index
desc: 频道是把外部消息流接入 OpenClaw 的入口。先登录或接入，再做配对和状态确认。
---
### 常见流程

```bash
# 查看频道命令树
openclaw channels --help

# 登录或接入频道
openclaw channels login --channel whatsapp

# 以向导方式添加一个频道
openclaw channels add --channel telegram --account alerts --name "Alerts Bot" --token $TELEGRAM_BOT_TOKEN

# 看已配置频道
openclaw channels list

# 探测频道连通性
openclaw channels status --probe

# 查看能力和权限
openclaw channels capabilities
openclaw channels capabilities --channel discord --target channel:123
```

### 配对与审批

```bash
# 查看配对请求
openclaw pairing list telegram

# 批准配对
openclaw pairing approve telegram ABCD1234

# 拒绝配对
openclaw pairing reject telegram ABCD1234
```

### 频道策略

- `allowFrom` 用来限制能发消息的人或号码。
- `requireMention` 适合群聊里只响应点名。
- `dmPolicy` 决定私聊是直接接受还是先配对。

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
desc: 消息命令负责发送、投票和反应。适合自动回复、人工确认和运维通知。
---
### 最常用动作

```bash
# 发送消息
openclaw message send --channel telegram --target @mychat --message "巡检完成"

# 发起投票
openclaw message poll --channel discord --target channel:123 \
  --poll-question "午饭选什么?" \
  --poll-option 米饭 \
  --poll-option 面条

# 添加反应
openclaw message react --channel telegram --message-id 123 --emoji "✅"
```

### 什么时候先看这里

- 机器人收到事件后，需要回一条确认。
- 需要人机协作确认下一步动作。
- 想把结果标成轻量状态，而不是再发一条长消息。

## 模型与会话
---
lang: bash
emoji: 🧠
link: https://docs.openclaw.ai/models
desc: 模型层决定谁来答、失败后找谁，以及不同频道的流量落到哪个路由。会话层负责看上下文和清理历史。
---
### 模型速查

```bash
# 看解析后的模型状态
openclaw models status

# 检查授权和可用性
openclaw models status --check

# 列出已配置模型
openclaw models list

# 设置默认模型
openclaw models set openai/gpt-5.2

# 设置图像模型
openclaw models set-image openai/gpt-5.2

# 扫描可用模型
openclaw models scan

# 管理回退链
openclaw models fallbacks list
openclaw models fallbacks add openai/gpt-5.2-mini
openclaw models fallbacks remove openai/gpt-5.2-mini
openclaw models fallbacks clear
```

### 会话速查

```bash
# 看活跃会话
openclaw sessions --active 120

# 看所有会话
openclaw sessions --json

# 预演清理
openclaw sessions cleanup --dry-run

# 执行清理
openclaw sessions cleanup --enforce
```

### 什么时候优先看这里

- 某个频道进来的消息要按工作区隔离。
- 模型需要自动回退。
- 会话太多，需要做清理或归档。

## 浏览器与网页
---
lang: bash
emoji: 🌐
link: https://docs.openclaw.ai/tools/browser
desc: 浏览器工具适合自动化登录、抓取、截图和页面操作；Web 工具适合搜索和抓取网页内容。
---
### 浏览器工具

```bash
# 启动受管浏览器
openclaw browser start

# 查看状态
openclaw browser status

# 打开页面
openclaw browser open https://example.com

# 取 AI 可用快照
openclaw browser snapshot --format ai

# 全页截图
openclaw browser screenshot --full-page
```

### Web 工具

```javascript
await web_search("OpenClaw gateway docs");
await web_fetch("https://docs.openclaw.ai/");
```

### 适合什么场景

- 页面登录、表单提交、截图留档。
- 从文档站抓取最新说明。
- 给 agent 补上下文，减少手工复制粘贴。

## 节点与扩展
---
lang: bash
emoji: 🧩
link: https://docs.openclaw.ai/nodes
desc: 节点用于远程执行、相机、屏幕和其他环境能力。插件用于扩展 OpenClaw 的内置能力。
---
### 节点常用命令

```bash
# 看节点列表
openclaw nodes list

# 看待审批节点
openclaw nodes pending

# 批准节点
openclaw nodes approve <requestId>

# 看在线节点
openclaw nodes status

# 看节点能力
openclaw nodes describe --node office-mac

# 在节点执行命令
openclaw nodes run --node office-mac "echo Hello"

# 低层 RPC 调用
openclaw nodes invoke --node office-mac --command canvas.eval --params '{"javaScript":"document.title"}'

# 节点画布 / 相机
openclaw nodes canvas present --node office-mac
openclaw nodes canvas navigate --node office-mac --url "/"
openclaw nodes canvas eval --node office-mac --js "document.title"
openclaw nodes canvas snapshot --node office-mac
openclaw nodes camera snap --node office-mac
```

### 启动节点主机

```bash
# 头less 节点主机
openclaw node run --host <gateway-host> --port 18789

# 节点主机也可以带显示名
openclaw node run --host <gateway-host> --port 18789 --display-name "Build Node"
```

### 插件常用命令

```bash
# 查看插件
openclaw plugins list

# 安装官方插件
openclaw plugins install @openclaw/voice-call

# 启用 / 禁用插件
openclaw plugins enable voice-call
openclaw plugins disable voice-call

# 更新插件
openclaw plugins update <id>

# 插件自检
openclaw plugins doctor
```

### 审批链

- 先看待审批请求，再放行节点或设备。
- 生产环境优先收紧 allowlist。
- 给高风险动作加审批比事后补救更稳。

## 自动化与更新
---
lang: bash
emoji: ⏰
link: https://docs.openclaw.ai/automation/cron-jobs
desc: 定时任务、钩子、更新和诊断是 OpenClaw 的收尾动作。适合值守、巡检和自动修复。
---
### 定时任务

```bash
# 新建定时任务
openclaw cron add --name ping --every "*/5 * * * *" --system-event "巡检心跳"

# 编辑任务
openclaw cron edit ping

# 立即执行
openclaw cron run ping

# 查看执行记录
openclaw cron runs --id ping
```

### 运维动作

```bash
# 一键诊断
openclaw doctor

# 查看日志
openclaw logs --follow

# 更新到最新版本
openclaw update

# 查看更新状态
openclaw update status
```

## 配置与排障
---
lang: bash
emoji: ⚠️
link: https://docs.openclaw.ai/gateway/troubleshooting
desc: 出问题时先看状态、健康、日志，再回到频道、模型和会话链路。大多数故障都在这三层之间。
---
### 常见判断

- 网关起不来，先看 `gateway health` 和 `doctor`。
- 频道能列出但不收消息，先看 `channels status --probe` 和配对。
- 消息发不出去，先看目标、权限和频道策略。
- 会话异常，先看 `sessions` 再看 `models`。

### 排障速查

```bash
openclaw status --all --deep
openclaw status --usage
openclaw gateway health
openclaw channels status --probe
openclaw nodes status
openclaw logs --follow
openclaw doctor --repair
```

## Quick Ref
---
lang: bash
emoji: 🧾
link: https://docs.openclaw.ai/cli/index
desc: 只保留最常复制的命令，适合临时查表。
---
### 启动与状态

```bash
openclaw onboard
openclaw configure
openclaw config file
openclaw dashboard
openclaw gateway --port 18789
openclaw gateway run
openclaw status --deep
openclaw health --json
openclaw doctor
```

### 频道与消息

```bash
openclaw channels login --channel whatsapp
openclaw channels add --channel telegram --account alerts --name "Alerts Bot" --token $TELEGRAM_BOT_TOKEN
openclaw channels list
openclaw channels status --probe
openclaw channels capabilities
openclaw pairing list telegram
openclaw pairing approve telegram ABCD1234
openclaw pairing reject telegram ABCD1234
openclaw message send --channel telegram --target @mychat --message "巡检完成"
openclaw message react --channel telegram --message-id 123 --emoji "✅"
```

### 模型与会话

```bash
openclaw models status
openclaw models status --check
openclaw models list
openclaw models set openai/gpt-5.2
openclaw models scan
openclaw sessions --active 120
openclaw sessions --json
openclaw sessions cleanup --dry-run
```

### 自动化与扩展

```bash
openclaw cron add --name ping --every "*/5 * * * *" --system-event "巡检心跳"
openclaw cron run ping
openclaw browser start
openclaw browser open https://example.com
openclaw browser snapshot --format ai
openclaw nodes status
openclaw plugins list
openclaw update
openclaw update status
openclaw logs --follow
```
