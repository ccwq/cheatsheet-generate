---
title: Free Claude Code 速查表
lang: bash
version: "2026-05-21"
date: 2026-05-21
github: Alishahryar1/free-claude-code
colWidth: 340px
---

# Free Claude Code 速查表

## 快速定位
---
lang: bash
emoji: 🤖
link: https://github.com/Alishahryar1/free-claude-code
desc: 把 Claude Code 的 Anthropic API 请求路由到免费或本地模型。核心思路是起一个本地代理，Claude Code 连接到代理，代理再把请求转发到配置的 provider。
---

- 适合场景：免费使用 Claude Code、本地模型开发、私有部署
- 核心链路：`fcc-server`（代理） + `fcc-claude`（启动 Claude Code）
- 最新核对版本：`2026-05-21`（基于 GitHub 最新 commit）
- 官方仓库：`Alishahryar1/free-claude-code`

## 起手工作流
---
lang: bash
emoji: 🚀
link: https://github.com/Alishahryar1/free-claude-code
desc: 可以把它理解成"给 Claude Code 找一个免费中转站"。先起代理，再连客户端，不需要每次都重配。
---

### 安装与启动

```bash
# 安装（uv 方式）
uv tool install --force git+https://github.com/Alishahryar1/free-claude-code.git

# 更新版本同样用这条命令
uv tool install --force git+https://github.com/Alishahryar1/free-claude-code.git

# 启动代理服务
fcc-server

# 启动 Claude Code（连接本地代理）
fcc-claude
```

### 最小工作流

```bash
# 1. 启动代理（默认端口 8082）
fcc-server

# 2. 代理启动后，终端会显示 Admin UI 地址
# INFO:     Admin UI: http://127.0.0.1:8082/admin (local-only)

# 3. 打开 Admin UI 配置 Provider（NVIDIA NIM/Kimi/OpenRouter 等）

# 4. 启动 Claude Code
fcc-claude
```

## Admin UI 配置
---
lang: bash
emoji: 🎛️
link: https://github.com/Alishahryar1/free-claude-code
desc: 通过浏览器可视化配置各 provider 的 API key 和模型选择，是最推荐的配置方式。
---

### 访问与导航

- Admin UI 地址：`http://127.0.0.1:8082/admin`（默认端口 8082）
- 修改端口：`PORT=9000 fcc-server`
- 配置路径：底部显示managed config存储位置

### Provider 配置

在 Admin UI 的 **Providers** 页面配置：

| Provider | 配置项 | 模型示例 |
|---|---|---|
| NVIDIA NIM | `NVIDIA_NIM_API_KEY` | `nvidia_nim/nvidia/nemotron-3-super-120b-a12b` |
| Kimi | `KIMI_API_KEY` | `kimi/kimi-k2.5` |
| Wafer | `WAFER_API_KEY` | `wafer/DeepSeek-V4-Pro` |
| OpenRouter | `OPENROUTER_API_KEY` | `open_router/stepfun/step-3.5-flash:free` |
| DeepSeek | `DEEPSEEK_API_KEY` | `deepseek/deepseek-chat` |
| LM Studio | `LM_STUDIO_BASE_URL` | `lmstudio/<model-id>` |
| Ollama | `OLLAMA_BASE_URL` | `ollama/llama3.1` |
| OpenCode Zen | `OPENCODE_API_KEY` | `opencode/gpt-5.3-codex` |
| OpenCode Go | `OPENCODE_API_KEY` | `opencode_go/minimax-m2.7` |
| Z.ai | `ZAI_API_KEY` | `zai/glm-5.1` |

### 模型分层配置

每个模型层级可以设置不同 provider：

```bash
MODEL_OPUS=nvidia_nim/moonshotai/kimi-k2.5    # Opus 级
MODEL_SONNET=open_router/deepseek/deepseek-r1-0528:free  # Sonnet 级
MODEL_HAIKU=lmstudio/unsloth/GLM-4.7-Flash-GGUF  # Haiku 级
MODEL=zai/glm-5.1                              # 默认 fallback
```

## CLI 命令
---
lang: bash
emoji: ⚡
link: https://github.com/Alishahryar1/free-claude-code
desc: 代理服务和 Claude Code 启动命令。`fcc-claude` 会自动读取当前配置的端口和认证token，不需要手动设置环境变量。
---

### 核心命令

```bash
fcc-server          # 启动代理服务（默认 8082 端口）
fcc-init            # 可选的高级配置脚手架（推荐用 Admin UI）
fcc-claude          # 启动 Claude Code，连接本地代理
free-claude-code    # fcc-server 的兼容别名
```

### 环境变量方式启动

```bash
# 直接启动代理（手动环境变量）
ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_AUTH_TOKEN=freecc fcc-server

# 手动启动 Claude Code（不推荐，用 fcc-claude 更方便）
ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_AUTH_TOKEN=freecc claude
```

## 客户端连接
---
lang: bash
emoji: 🔗
link: https://github.com/Alishahryar1/free-claude-code
desc: 多种方式连接代理：CLI 直接用、VS Code 扩展、JetBrains ACP、或远程通过 Discord/Telegram 机器人控制。
---

### Claude Code CLI

```bash
# 推荐方式：fcc-claude 自动读取配置
fcc-claude
```

### VS Code 扩展

在 `settings.json` 添加：

```json
"claudeCode.environmentVariables": [
  { "name": "ANTHROPIC_BASE_URL", "value": "http://localhost:8082" },
  { "name": "ANTHROPIC_AUTH_TOKEN", "value": "freecc" },
  { "name": "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY", "value": "1" },
  { "name": "CLAUDE_CODE_AUTO_COMPACT_WINDOW", "value": "190000" }
]
```

### JetBrains ACP

编辑 `acp-agents/installed.json`，设置环境变量：

```json
"env": {
  "ANTHROPIC_BASE_URL": "http://localhost:8082",
  "ANTHROPIC_AUTH_TOKEN": "freecc",
  "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY": "1",
  "CLAUDE_CODE_AUTO_COMPACT_WINDOW": "190000"
}
```

### Model Picker

Claude Code 的模型选择器支持通过 `--gateway-model-discovery` 发现代理提供的模型。

## 消息平台集成
---
lang: bash
emoji: 💬
link: https://github.com/Alishahryar1/free-claude-code
desc: Discord 或 Telegram 机器人可以通过自然语言远程控制 Claude Code，适合远程编程场景。
---

### Discord 配置

1. 在 Discord Developer Portal 创建 bot，开启 Message Content Intent
2. 邀请 bot 到频道（需读、发送、消息历史权限）
3. 复制 bot token 和频道 ID

### Telegram 配置

1. 通过 @BotFather 创建 bot，复制 token
2. 从 @userinfobot 获取你的 numeric user ID

### Admin UI 配置

1. 打开 **Messaging** 页面
2. 选择平台（discord/telegram）
3. 填入 Bot Token 和 Allowed Channels/User ID
4. 设置 Allowed Directory（代理允许的工作目录）
5. 点击 **Validate** → **Apply**，重启服务

### 机器人命令

| 命令 | 作用 |
|---|---|
| `/stop` | 取消当前任务 |
| `/clear` | 重置会话 |
| `/stats` | 显示会话状态 |

回复任务消息可只停止该分支。

## 语音笔记
---
lang: bash
emoji: 🎤
link: https://github.com/Alishahryar1/free-claude-code
desc: 通过 Discord/Telegram 发送语音，代理会自动转录并传给 Claude Code 处理。
---

### 安装语音支持

```bash
# NVIDIA NIM 转录（Riva gRPC）
uv tool install --force "free-claude-code[voice] @ git+https://github.com/Alishahryar1/free-claude-code.git"

# 本地 Whisper（CPU 或 CUDA）
uv tool install --force "free-claude-code[voice_local] @ git+https://github.com/Alishahryar1/free-claude-code.git"

# 两者都装
uv tool install --force "free-claude-code[voice,voice_local] @ git+https://github.com/Alishahryar1/free-claude-code.git"

# CUDA 版本
uv tool install --force "free-claude-code[voice_local] @ git+https://github.com/Alishahryar1/free-claude-code.git" --torch-backend cu130
```

### Admin UI 配置

在 **Messaging** → **Voice** 页面：
- 开启 Voice Notes
- 选择 Whisper Device（`cpu` / `cuda` / `nvidia_nim`）
- 设置 Whisper Model
- 需要 Hugging Face Token 时填入

## Provider 详解
---
lang: bash
emoji: 📡
link: https://github.com/Alishahryar1/free-claude-code
desc: 各 provider 的接入方式、API key 获取地址、模型列表地址。选一个最合适的入手。
---

### NVIDIA NIM

- 获取 key：[build.nvidia.com/settings/api-keys](https://build.nvidia.com/settings/api-keys)
- 模型浏览：[build.nvidia.com/explore/discover](https://build.nvidia.com/explore/discover)
- 热门模型：`nvidia_nim/nvidia/nemotron-3-super-120b-a12b`、`nvidia_nim/moonshotai/kimi-k2.5`

### Kimi

- 获取 key：[platform.moonshot.ai/console/api-keys](https://platform.moonshot.ai/console/api-keys)
- 模型浏览：[platform.moonshot.ai](https://platform.moonshot.ai)
- 热门模型：`kimi/kimi-k2.5`

### OpenRouter

- 获取 key：[openrouter.ai/keys](https://openrouter.ai/keys)
- 模型浏览：[openrouter.ai/models](https://openrouter.ai/models)、[免费模型](https://openrouter.ai/collections/free-models)
- 热门模型：`open_router/stepfun/step-3.5-flash:free`

### DeepSeek

- 获取 key：[platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)
- 热门模型：`deepseek/deepseek-chat`

### LM Studio

1. 启动 LM Studio 本地服务器，加载模型
2. 在 Admin UI 保持 `LM_STUDIO_BASE_URL`
3. 模型 slug：`lmstudio/<model-id>`（LM Studio 显示的标识符）

### Ollama

```bash
ollama pull llama3.1
ollama serve
```

模型 slug：`ollama/llama3.1`、`ollama/llama3.1:8b`

### OpenCode Zen / Go

- 获取 key：[opencode.ai/auth](https://opencode.ai/auth)
- 两者共用同一个 API key，仅 slug 前缀不同
- Zen endpoint：`https://opencode.ai/zen/v1`
- Go endpoint：`https://opencode.ai/zen/go/v1`
- 热门模型：`opencode/claude-sonnet-4`、`opencode_go/minimax-m2.7`

### Z.ai

- 获取 key：[Z.ai/manage-apikey/apikey-list](https://z.ai/manage-apikey/apikey-list)
- endpoint：`https://api.z.ai/api/coding/paas/v4`
- 热门模型：`zai/glm-5.1`、`zai/glm-5-turbo`

## 工作原理
---
lang: bash
emoji: 🏗️
link: https://github.com/Alishahryar1/free-claude-code
desc: 理解请求链路方便排查问题和选择 provider。
---

```
Claude Code → fcc-server (本地 8082) → Provider API
                           ↓
              转换 OpenAI 流式响应
              规范化 tool calls
              处理 thinking blocks
              优化 token 使用
```

### 传输类型

- OpenAI 兼容传输（转成 Anthropic SSE）：NIM、OpenCode Zen、OpenCode Go、Z.ai
- Anthropic Messages 原生传输：Wafer、OpenRouter、DeepSeek、LM Studio、llama.cpp、Ollama

## 高频 Recipes
---
lang: bash
emoji: 🧪
link: https://github.com/Alishahryar1/free-claude-code
desc: 常见使用场景的最短路径。
---

### 1. NVIDIA NIM 最快上手

```bash
# 1. 安装
uv tool install --force git+https://github.com/Alishahryar1/free-claude-code.git

# 2. 启动代理
fcc-server

# 3. 打开 http://127.0.0.1:8082/admin
# 4. 在 Providers 页面粘贴 NVIDIA NIM API key
# 5. 默认模型已经配置好：nvidia_nim/nvidia/nemotron-3-super-120b-a12b

# 6. 新开终端启动 Claude Code
fcc-claude
```

### 2. 本地模型（Ollama）

```bash
ollama pull llama3.1
ollama serve

# Admin UI 设置：
# OLLAMA_BASE_URL=http://localhost:11434
# MODEL=ollama/llama3.1
```

### 3. Discord 远程编程

```bash
# 配置好 Discord bot 后
fcc-server

# 在 Discord 频道发送消息，bot 会启动 Claude Code 会话
# 使用 /stop 取消任务，/clear 重置
```

## 开发与调试
---
lang: bash
emoji: 🔧
link: https://github.com/Alishahryar1/free-claude-code
desc: 从源码运行和开发调试。
---

### 从源码运行

```bash
git clone https://github.com/Alishahryar1/free-claude-code.git
cd free-claude-code
uv run uvicorn server:app --host 0.0.0.0 --port 8082
```

### 代码检查

```bash
uv run ruff format
uv run ruff check
uv run ty check
uv run pytest
```

推送前需通过全部检查，CI 同样执行这套。

## 不要混淆：free-claude-code vs MCP

| | **free-claude-code** | **MCP Server** |
|---|---|---|
| **作用** | 代理 Claude Code 请求到各种 provider | 给 Claude Code 提供工具能力（数据库、API等） |
| **层级** | 网络请求层 | 工具能力层 |
| **关系** | 可以一起用，fcc-server 转发请求，MCP 提供额外工具 |