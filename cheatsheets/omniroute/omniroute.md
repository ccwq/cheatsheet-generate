---
title: OmniRoute 速查
lang: bash
version: "2.4.1"
date: 2026-03-13
github: diegosouzapw/OmniRoute
colWidth: 360px
---

# OmniRoute 速查表

## 快速定位 / 入口
---
lang: bash
emoji: 🚦
link: https://github.com/diegosouzapw/OmniRoute/blob/main/docs/i18n/zh-CN/README.md
---

### 它是什么
- 面向 AI 编码工具的统一网关，把 Claude Code、Codex、Gemini CLI、Cursor、Cline、OpenClaw 等都接到同一个 OpenAI 兼容入口。
- 核心价值不是“再包一层 API”，而是把订阅额度、API Key、廉价模型、免费模型串成自动回退链，尽量做到不断流。
- 除了 `Chat Completions`，还覆盖 Embeddings、图片、音频转写、MCP、A2A 等能力。

### 两个常用入口
```text
本地网关: http://localhost:20128/v1
云端网关: http://cloud.omniroute.online/v1
```

### 模型名的阅读方式
```text
cc/claude-opus-4-6          # Claude Code 订阅模型
cx/gpt-5.2-codex            # Codex 订阅模型
gc/gemini-3-flash-preview   # Gemini CLI 免费层
glm/glm-4.7                 # 低成本 API Key 模型
if/kimi-k2-thinking         # 免费 iFlow 模型
```

### 最小可用验证
```bash
curl http://localhost:20128/v1/models \
  -H "Authorization: Bearer $OMNIROUTE_API_KEY"
```

## 核心路由链路
---
lang: text
emoji: 🔀
link: https://github.com/diegosouzapw/OmniRoute/blob/main/README.md#-how-it-works
---

### 默认思路
```text
订阅模型 -> API Key 模型 -> 低价模型 -> 免费模型
```

### 典型四层
```text
Tier 1: Subscription
  Claude Code / Codex / Gemini CLI / Copilot

Tier 2: API Key
  DeepSeek / Groq / xAI / Mistral / NVIDIA NIM / Together AI

Tier 3: Cheap
  GLM-4.7 / MiniMax M2.1 / Kimi K2

Tier 4: Free
  iFlow / Qwen / Kiro
```

### 什么时候最值钱
- 你已经有一个或多个订阅，但经常在高强度编码时撞到 5 小时或周配额。
- 你不想每个 IDE / CLI 都单独换 base URL、API 协议和模型名。
- 你需要“先榨干订阅，再自动退到便宜层和免费层”。

## 起手工作流
---
lang: bash
emoji: 🧭
link: https://github.com/diegosouzapw/OmniRoute/blob/main/docs/USER_GUIDE.md
---

### 建议顺序
```text
1. 连接至少一个订阅或免费提供商
2. 新建一个 combo
3. 从 Dashboard 取 OmniRoute API Key
4. 把你的 IDE / CLI 指到 http://localhost:20128/v1
5. 用一个真实请求验证回退链
```

### 本地单请求冒烟
```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer $OMNIROUTE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "if/kimi-k2-thinking",
    "messages": [
      { "role": "user", "content": "用一句话解释 OmniRoute 的用途" }
    ]
  }'
```

### 建 combo 时的心法
- 第一个位置放你最希望优先消耗的资源，通常是已付费订阅。
- 中间层放“够便宜且够稳”的模型，例如 `glm/glm-4.7` 或 `minimax/MiniMax-M2.1`。
- 最后一层放真正的兜底免费模型，不追求最强，只追求不断流。

## 高频 Recipes
---
lang: text
emoji: 🧪
link: https://github.com/diegosouzapw/OmniRoute/blob/main/docs/USER_GUIDE.md#-use-cases
---

### 方案 1: 零成本编码
```text
combo: free-forever
1. gc/gemini-3-flash-preview
2. if/kimi-k2-thinking
3. qw/qwen3-coder-plus
```

### 方案 2: 先吃满 Claude 订阅
```text
combo: maximize-claude
1. cc/claude-opus-4-6
2. glm/glm-4.7
3. if/kimi-k2-thinking
```

### 方案 3: 24/7 不停机
```text
combo: always-on
1. cc/claude-opus-4-6
2. cx/gpt-5.2-codex
3. glm/glm-4.7
4. minimax/MiniMax-M2.1
5. if/kimi-k2-thinking
```

### 低价层怎么选
- `glm/glm-4.7`: 适合放在订阅后的第一层便宜回退。
- `minimax/MiniMax-M2.1`: 更偏“最低单价兜底”。
- `kimi/kimi-latest`: 成本更可预测，适合月预算固定的团队。

## CLI / IDE 接入
---
lang: bash
emoji: 🔌
link: https://github.com/diegosouzapw/OmniRoute/blob/main/docs/USER_GUIDE.md#-cli-integration
---

### OpenAI 兼容类工具的共同配置
```text
Base URL: http://localhost:20128/v1
API Key:  从 OmniRoute Dashboard 获取
Model:    任意已接入模型或 combo 名
```

### Codex CLI
```bash
export OPENAI_BASE_URL="http://localhost:20128"
export OPENAI_API_KEY="$OMNIROUTE_API_KEY"

codex "review this repository"
```

### Cursor / Cline / Continue / RooCode
```text
Provider: OpenAI Compatible
Base URL: http://localhost:20128/v1
API Key:  OmniRoute 的 key
Model:    cc/claude-opus-4-6 或 free-forever
```

### Claude Code
```text
优先走 Dashboard -> CLI Tools 页面一键配置。
如果手改配置，目标仍然是把请求指向 OmniRoute 的 OpenAI 兼容入口。
```

### OpenClaw 手动接入
```json
{
  "models": {
    "providers": {
      "omniroute": {
        "baseUrl": "http://127.0.0.1:20128/v1",
        "apiKey": "sk_omniroute",
        "api": "openai-completions"
      }
    }
  }
}
```

### OpenClaw 的特殊点
- 优先用 `127.0.0.1`，不要用 `localhost`，以避免 IPv6 解析带来的连接问题。
- 如果只是想“快接入”，先用 CLI Tools 页面生成配置，再回头细调。

## 常用接口与管理动作
---
lang: bash
emoji: 🛠️
link: https://github.com/diegosouzapw/OmniRoute/blob/main/docs/API_REFERENCE.md
---

### 列出模型
```bash
curl http://localhost:20128/v1/models \
  -H "Authorization: Bearer $OMNIROUTE_API_KEY"
```

### Chat Completions
```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer $OMNIROUTE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "maximize-claude",
    "messages": [
      { "role": "user", "content": "生成一个 bash 备份脚本" }
    ]
  }'
```

### 音频转写
```bash
curl -X POST http://localhost:20128/v1/audio/transcriptions \
  -H "Authorization: Bearer $OMNIROUTE_API_KEY" \
  -F "file=@audio.mp3" \
  -F "model=deepgram/nova-3"
```

### 导出数据库
```bash
curl -o backup.sqlite \
  http://localhost:20128/api/db-backups/export
```

### 设置预算
```bash
curl -X POST http://localhost:20128/api/usage/budget \
  -H "Content-Type: application/json" \
  -d '{
    "keyId": "key-123",
    "limit": 50,
    "period": "monthly"
  }'
```

## 组合与调度策略
---
lang: text
emoji: ⚖️
link: https://github.com/diegosouzapw/OmniRoute/blob/main/docs/USER_GUIDE.md#combo-balancing-strategies
---

### 常见策略
```text
Priority        总是优先第一个，失败才回退
Round-Robin     顺序轮转
Random          随机挑一个
Weighted        按权重分流
Least-Used      优先最近使用最少的模型
Cost-Optimized  优先更便宜的模型
```

### 经验法则
- 编码主链通常先用 `Priority`，因为你往往想先耗尽订阅再降级。
- 批量低价值任务可以考虑 `Cost-Optimized`。
- 多账号同模型的均摊场景，更适合 `Round-Robin` 或 `Least-Used`。

## 易错点 / 故障排查
---
lang: bash
emoji: 🚑
link: https://github.com/diegosouzapw/OmniRoute/blob/main/docs/TROUBLESHOOTING.md
---

### Base URL 常见错法
```text
对 OpenAI 兼容客户端:
  正确: http://localhost:20128/v1

对某些只认根地址的客户端:
  可能需要: http://localhost:20128
```

### 几个高频坑
- 提供商联通性测试报 `Invalid`，不一定真坏掉；有些供应商本来就不暴露 `/models`。
- OpenClaw 配 `localhost` 可能失败，优先改成 `127.0.0.1`。
- 远程部署时，Google OAuth 可能出现 `redirect_uri_mismatch`，这时要为你的域名单独配置 OAuth Client ID/Secret。
- 看不到请求日志时，检查是否启用了 `ENABLE_REQUEST_LOGS=true`。
- 首次登录异常时，先核对 `INITIAL_PASSWORD`；文档里提到未设置时默认是 `123456`。

### 配额或限流时的标准处理
```text
1. 先看 Dashboard 的 quota / health / costs
2. 把 combo 末尾补一个免费层
3. 再把中间层补一个低价层
4. 最后再调策略，而不是先怀疑客户端配置
```
