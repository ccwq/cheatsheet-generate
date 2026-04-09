---
title: OpenClaude
lang: zh
version: v0.1.8
date: 2026-04-06
github: Gitlawb/openclaude
colWidth: 450
---

## 安装与启动

```bash
npm install -g @gitlawb/openclaude
openclaude
```

交互内使用 `/provider` 配置提供商，`/onboard-github` 配置 GitHub Models

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

## slash 命令速查

| 命令 | 说明 |
|------|------|
| `/provider` | 交互式配置提供商和管理 profiles |
| `/onboard-github` | GitHub Models 引导配置 |
| `/model` | 本地 OpenAI 兼容模型发现 |

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `CLAUDE_CODE_USE_OPENAI` | 是 | 设为 `1` 启用 OpenAI 兼容模式 |
| `OPENAI_API_KEY` | 是* | API key（*本地模型不需要） |
| `OPENAI_MODEL` | 是 | 模型名，如 `gpt-4o`、`deepseek-chat` |
| `OPENAI_BASE_URL` | 否 | API 端点，默认 `https://api.openai.com/v1` |

## Agent 路由

在 `~/.claude/settings.json` 配置：

```json
{
  "agentRouting": {
    "Explore": "deepseek-chat",
    "Plan": "gpt-4o",
    "general-purpose": "gpt-4o",
    "default": "gpt-4o"
  }
}
```

## Web 搜索

- 默认：非 Anthropic 模型使用 DuckDuckGo
- 增强（可选）：`export FIRECRAWL_API_KEY=your-key`

## 开发命令

```bash
bun run dev              # 开发模式
bun test                 # 运行测试
bun run smoke             # 快速启动检查
bun run doctor:runtime    # 验证 provider 环境
bun run build             # 构建
```

## gRPC 服务

```bash
npm run dev:grpc          # 启动 gRPC 服务器（默认 50051）
npm run dev:grpc:cli      # 运行 gRPC CLI 客户端
```

Proto 定义：`src/proto/openclaude.proto`

## 仓库结构

```
src/                     核心 CLI/运行时
scripts/                 构建、验证脚本
docs/                    设置与贡献文档
vscode-extension/         VS Code 扩展
```
