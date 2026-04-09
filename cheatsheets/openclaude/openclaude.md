---
title: OpenClaude
lang: zh
version: v0.2.0
date: 2026-04-09
github: Gitlawb/openclaude
colWidth: 450
---

## 安装与启动

```bash
npm install -g @gitlawb/openclaude
openclaude
```

首次运行自动引导配置，或使用 `/provider` 交互式配置

## 快速配置

### OpenAI

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-your-key
export OPENAI_MODEL=gpt-4o
```

### Ollama 本地

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_MODEL=qwen2.5-coder:7b
```

### DeepSeek

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-...
export OPENAI_BASE_URL=https://api.deepseek.com/v1
export OPENAI_MODEL=deepseek-chat
```

### 更多 Provider 示例

```bash
# LM Studio (本地)
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:1234/v1
export OPENAI_MODEL=your-model-id

# Together AI
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=...
export OPENAI_BASE_URL=https://api.together.xyz/v1
export OPENAI_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo

# Groq
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=gsk_...
export OPENAI_BASE_URL=https://api.groq.com/openai/v1
export OPENAI_MODEL=llama-3.3-70b-versatile

# Mistral
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=...
export OPENAI_BASE_URL=https://api.mistral.ai/v1
export OPENAI_MODEL=mistral-large-latest

# Azure OpenAI
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=your-azure-key
export OPENAI_BASE_URL=https://your-resource.openai.azure.com/openai/deployments/your-deployment/v1
export OPENAI_MODEL=gpt-4o

# Codex via ChatGPT auth
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_MODEL=codexplan  # 或 codexspark（更快）
export CODEX_API_KEY=...  # 可选，已有 ~/.codex/auth.json 则自动读取
```

## slash 命令速查

### 核心命令

| 命令 | 说明 |
|------|------|
| `/provider` | 交互式配置提供商和管理 profiles |
| `/onboard-github` | GitHub Models 引导配置 |
| `/model` | 本地 OpenAI 兼容模型发现 |
| `/help` | 显示帮助 |
| `/exit` | 退出 |
| `/clear` | 清屏 |

### 会话管理

| 命令 | 说明 |
|------|------|
| `/session` | 会话管理（列表、恢复、删除） |
| `/resume` | 恢复指定会话 |
| `/compact` | 压缩上下文 |
| `/context` | 查看当前上下文状态 |
| `/summary` | 生成会话摘要 |

### Git 操作

| 命令 | 说明 |
|------|------|
| `/commit` | 创建 commit |
| `/diff` | 查看未提交的更改 |
| `/branch` | 分支管理 |
| `/review` | 代码审查 |

### 工具与插件

| 命令 | 说明 |
|------|------|
| `/mcp` | MCP 服务器管理 |
| `/skills` | Skill 管理 |
| `/hooks` | Hooks 管理 |
| `/plugins` | 插件管理 |
| `/agent` | Agent 管理 |
| `/task` | 任务管理 |

### 配置与诊断

| 命令 | 说明 |
|------|------|
| `/config` | 查看/编辑配置 |
| `/doctor` | 运行时诊断 |
| `/status` | 显示状态信息 |
| `/cost` | 显示会话成本 |
| `/usage` | 使用统计 |
| `/theme` | 终端主题 |
| `/keybindings` | 键盘快捷键 |

### 其他命令

| 命令 | 说明 |
|------|------|
| `/plan` | 计划模式切换 |
| `/fast` | 快速模式 |
| `/memory` | 记忆系统 |
| `/dream` | 背景记忆整合 |
| `/feedback` | 发送反馈 |
| `/btw` | 快速备注 |
| `/sticker` | 表情贴纸 |
| `/wiki` | Wiki 查询 |
| `/insights` | 会话分析报告 |

## 配置目录

| 变量 | 说明 |
|------|------|
| `CLAUDE_CONFIG_DIR` | 覆盖默认配置目录，默认为 `~/.openclaude`，旧用户 `~/.claude` 继续使用 |

## 环境变量

### Provider 选择

| 变量 | 说明 |
|------|------|
| `CLAUDE_CODE_USE_OPENAI=1` | 启用 OpenAI 兼容模式 |
| `CLAUDE_CODE_USE_GEMINI=1` | 启用 Google Gemini |
| `CLAUDE_CODE_USE_GITHUB=1` | 启用 GitHub Models |
| `CLAUDE_CODE_USE_BEDROCK=1` | 启用 AWS Bedrock |
| `CLAUDE_CODE_USE_VERTEX=1` | 启用 Google Vertex AI |
| `CLAUDE_CODE_USE_FOUNDRY=1` | 启用 Microsoft Foundry |

### OpenAI 兼容模式

| 变量 | 必填 | 说明 |
|------|------|------|
| `OPENAI_API_KEY` | 是* | API key（*本地模型不需要） |
| `OPENAI_MODEL` | 是 | 模型名 |
| `OPENAI_BASE_URL` | 否 | API 端点，默认 `https://api.openai.com/v1` |

### Anthropic

| 变量 | 必填 | 说明 |
|------|------|------|
| `ANTHROPIC_API_KEY` | 是 | Anthropic API key |
| `ANTHROPIC_MODEL` | 否 | 覆盖默认模型 |
| `ANTHROPIC_BASE_URL` | 否 | 自定义端点 |

### Google Gemini

| 变量 | 必填 | 说明 |
|------|------|------|
| `GEMINI_API_KEY` | 是 | Gemini API key（也支持 `GOOGLE_API_KEY`） |
| `GEMINI_MODEL` | 否 | 模型名，默认 `gemini-2.0-flash` |
| `GEMINI_BASE_URL` | 否 | 自定义端点 |

### GitHub Models

| 变量 | 必填 | 说明 |
|------|------|------|
| `GITHUB_TOKEN` | 是 | GitHub Token（也支持 `GH_TOKEN`） |

### AWS Bedrock

| 变量 | 必填 | 说明 |
|------|------|------|
| `AWS_REGION` | 是 | AWS 区域，如 `us-east-1` |
| `AWS_BEARER_TOKEN_BEDROCK` | 是 | Bedrock bearer token |

### Google Vertex AI

| 变量 | 必填 | 说明 |
|------|------|------|
| `ANTHROPIC_VERTEX_PROJECT_ID` | 是 | GCP 项目 ID（也支持 `GOOGLE_CLOUD_PROJECT`） |
| `CLOUD_ML_REGION` | 否 | 区域，默认 `us-east5` |

### Codex 特定

| 变量 | 说明 |
|------|------|
| `CODEX_API_KEY` | Codex/ChatGPT access token override |
| `CODEX_AUTH_JSON_PATH` | Path to Codex CLI `auth.json`（默认 `~/.codex/auth.json`） |
| `CODEX_HOME` | 替代 Codex home 目录 |

### Web 搜索

**API Keys（设置其中一个）：**

| 变量 | 说明 |
|------|------|
| `TAVILY_API_KEY` | Tavily AI 优化搜索（推荐） |
| `EXA_API_KEY` | Exa 神经/语义搜索 |
| `YOU_API_KEY` | You.com RAG-ready snippets |
| `JINA_API_KEY` | Jina 搜索 |
| `BING_API_KEY` | Bing 网页搜索 |
| `MOJEEK_API_KEY` | Mojeek 隐私搜索 |
| `LINKUP_API_KEY` | Linkup 搜索 |
| `FIRECRAWL_API_KEY` | Firecrawl 高级搜索（JS 渲染页面） |

**配置：**

| 变量 | 默认 | 说明 |
|------|------|------|
| `WEB_SEARCH_PROVIDER` | `auto` | Provider：`auto`、`custom`、`tavily`、`exa`、`ddg` 等 |
| `WEB_SEARCH_API` | - | 自定义搜索端点 |
| `WEB_URL_TEMPLATE` | - | 含 `{query}` 的 URL 模板 |
| `WEB_CUSTOM_TIMEOUT_SEC` | 15 | 请求超时（秒） |

### 重试与超时

| 变量 | 默认 | 说明 |
|------|------|------|
| `CLAUDE_CODE_MAX_RETRIES` | 10 | API 重试次数 |
| `CLAUDE_CODE_UNATTENDED_RETRY` | - | 设为 `1` 启用 CI 持续重试模式（429/529） |
| `API_TIMEOUT_MS` | - | 自定义超时（毫秒） |

### 调试

| 变量 | 说明 |
|------|------|
| `CLAUDE_DEBUG` | 启用调试日志 |
| `CLAUDE_CODE_DEBUG_LOG_LEVEL` | 日志级别 |
| `CLAUDE_CODE_DEBUG_LOGS_DIR` | 调试日志目录 |

### 其他

| 变量 | 说明 |
|------|------|
| `OPENCLAUDE_DISABLE_CO_AUTHORED_BY=1` | 禁用 git Co-Authored-By |
| `OPENCLAUDE_ENABLE_EXTENDED_KEYS=1` | 扩展键盘协议（iTerm2/WezTerm/Ghostty） |
| `CLAUDE_CODE_SIMPLE` 或 `--bare` | 跳过 hooks、LSP、插件同步、skill 扫描 |
| `CLAUDE_CODE_DISABLE_TELEMETRY` | 禁用遥测 |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | 禁用自动记忆 |
| `CLAUDE_CODE_DISABLE_THINKING` | 禁用思考模式 |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | 禁用自动记忆 |

## settings.json 配置

在 `~/.claude/settings.json`（或 `~/.openclaude/settings.json`）中配置：

### Agent 路由

```json
{
  "agentModels": {
    "deepseek-chat": {
      "base_url": "https://api.deepseek.com/v1",
      "api_key": "sk-your-key"
    }
  },
  "agentRouting": {
    "Explore": "deepseek-chat",
    "Plan": "gpt-4o",
    "general-purpose": "gpt-4o",
    "default": "gpt-4o"
  }
}
```

### 权限配置

```json
{
  "permissions": {
    "allow": [{ "command": "npm install" }],
    "deny": [{ "command": "rm -rf /" }],
    "defaultMode": "ask"
  }
}
```

### Hooks 配置

```json
{
  "hooks": {
    "BeforeThinking": [{ "command": "echo 'thinking...'" }],
    "AfterThinking": [{ "command": "echo 'done'" }]
  }
}
```

### 工作目录配置

```json
{
  "additionalDirectories": ["/path/to/include"]
}
```

### 其他配置项

| 配置项 | 说明 |
|--------|------|
| `cleanupPeriodDays` | 保留会话天数（默认 30），0 禁用 |
| `env` | 为会话设置的环境变量 |
| `model` | 覆盖默认模型 |
| `fastMode` | 启用快速模式 |
| `effortLevel` | 努力级别：`low`、`medium`、`high` |
| `language` | 响应语言（如 `"japanese"`） |
| `syntaxHighlightingDisabled` | 禁用 diff 语法高亮 |
| `autoMemoryEnabled` | 启用自动记忆 |
| `autoMemoryDirectory` | 自动记忆目录 |

## Skill 系统

### 安装 Skills

```bash
# GitHub 速记
npx skills add <owner/repo>

# 安装到全局
npx skills add vercel-labs/agent-skills -g

# 安装特定 skill
npx skills add vercel-labs/agent-skills --skill frontend-design

# 列出可用 skills
npx skills add vercel-labs/agent-skills --list

# 列出已安装
npx skills list
```

### 复用 Skills

在指令中使用 `skill:` 或 `agentskill:` 前缀调用：

```
skill: cheatsheet-maker
agentskill: icon-complete-skill
```

**标准位置：**
- `skills/` - 通用
- `.claude/skills/` - Claude Code
- `.agents/skills/` - Codex、Cursor、Windsurf 等

**环境变量：**
- `INSTALL_INTERNAL_SKILLS=1` - 显示内部 skills

## Provider Profile 脚本

```bash
# 引导式初始化（优先本地 Ollama，否则 OpenAI）
bun run profile:init

# 推荐最佳 provider/model
bun run profile:recommend -- --goal coding --benchmark

# 自动应用最佳配置
bun run profile:auto -- --goal latency

# 启动已保存的 profile
bun run dev:profile

# Codex 引导
bun run profile:codex

# 快速 profile
bun run profile:fast
bun run profile:code
```

## 诊断与验证

```bash
bun run smoke                  # 快速启动检查
bun run doctor:runtime         # 验证 provider 环境
bun run doctor:runtime:json    # 机器可读诊断
bun run doctor:report          # 生成诊断报告
bun run hardening:check       # 本地硬化检查
bun run hardening:strict       # 严格硬化（含 typecheck）
```

## gRPC 服务

```bash
npm run dev:grpc              # 启动 gRPC 服务器（默认 50051）
npm run dev:grpc:cli          # 运行 gRPC CLI 客户端
```

环境变量：`GRPC_PORT`（默认 50051）、`GRPC_HOST`（默认 localhost）

## VS Code 扩展

仓库包含 `vscode-extension/openclaude-vscode` 扩展，提供启动集成和主题支持。

## 开发命令

```bash
bun run dev              # 开发模式
bun test                 # 运行测试
bun run test:coverage     # 测试覆盖率
bun run build            # 构建
bun run verify:privacy   # 隐私验证
```

## 仓库结构

```
src/                     核心 CLI/运行时
scripts/                 构建、验证脚本
docs/                    设置与贡献文档
python/                  Python helpers 和测试
vscode-extension/        VS Code 扩展
bin/                     CLI 入口点
```
