---
title: CLIProxyAPI Cookbook
lang: bash
version: "6.8.52"
date: 2026-03-13
github: router-for-me/CLIProxyAPI
colWidth: 360px
---

# CLIProxyAPI Cookbook

## 快速定位 / 入口
---
lang: bash
emoji: "🚪"
link: https://github.com/router-for-me/CLIProxyAPI/blob/main/README_CN.md
desc: 先理解它是什么、解决什么问题，以及最常用的入口地址。
---

### 它适合解决什么问题
- 把 `Codex`、`Claude Code`、`Gemini CLI`、`Qwen Code`、`iFlow` 等订阅或 OAuth 凭据，统一暴露成兼容 `OpenAI / Responses / Gemini / Claude` 的 API。
- 让 `Cline`、`Continue`、`Roo Code`、自定义脚本、SDK 不必各自对接不同上游，统一只认一个本地代理入口。
- 需要多账号轮询、模型别名、上游兼容提供商接入、管理面板或管理 API 时，这个项目比“单纯转发代理”更合适。

### 最常用入口
```text
OpenAI 兼容接口:   http://127.0.0.1:8317/v1
WebSocket 接口:    http://127.0.0.1:8317/v1/ws
管理 API 前缀:     http://127.0.0.1:8317/v0/management
默认配置文件:      config.yaml
认证目录:          ~/.cli-proxy-api
```

### 最小验证
```bash
# 先确认服务起来了，再看模型列表是否可见
curl http://127.0.0.1:8317/v1/models \
  -H "Authorization: Bearer your-api-key-1"
```

## 仓库骨架 / 决策点
---
lang: text
emoji: "🧭"
link: https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/main/config.example.yaml
desc: 先抓住配置入口，再决定你要走 OAuth、多账户、兼容上游还是 SDK 内嵌。
---

### 先看哪几块配置
```text
基础服务
  host / port / tls / api-keys / debug

管理面
  remote-management.allow-remote
  remote-management.secret-key
  remote-management.panel-github-repository

路由与重试
  routing.strategy
  request-retry
  max-retry-credentials
  quota-exceeded.*

凭据与上游
  gemini-api-key
  codex-api-key
  claude-api-key
  openai-compatibility
  vertex-api-key
  ampcode

模型整形
  oauth-model-alias
  oauth-excluded-models
  payload.default / override / filter
```

### 什么时候用哪条路
- 已有 CLI/OAuth 登录态，想给本地工具复用：优先走 OAuth 与认证目录。
- 已有第三方 OpenAI 兼容供应商：优先配 `openai-compatibility`。
- 一个模型要挂多个账号分流：优先看 `routing.strategy`、多条 key entry、`max-retry-credentials`。
- 客户端模型名和上游不一致：优先用 `models.alias` 或 `oauth-model-alias`。
- 想把能力嵌进自己的 Go 服务：直接用 `sdk/cliproxy`。

## 起手工作流
---
lang: text
emoji: "🪜"
link: https://help.router-for.me/cn/
desc: 新机器上从“先跑起来”到“接入客户端”的推荐顺序。
---

### 推荐顺序
```text
1. 复制 config.example.yaml 为 config.yaml
2. 设置监听地址、端口、api-keys
3. 配一个最小上游
   - OAuth 登录态
   - 或 openai-compatibility 提供商
4. 启动服务并用 /v1/models 验证
5. 再接 Codex / Cline / Continue / 自己的脚本
6. 最后再补多账户轮询、模型别名、管理面板
```

### 最小可用配置
```yaml
# 只保留最小入口，先把服务跑通
host: "127.0.0.1"
port: 8317

api-keys:
  - "dev-local-key"

auth-dir: "~/.cli-proxy-api"
debug: false

remote-management:
  allow-remote: false
  secret-key: ""

# 先接一个 OpenAI 兼容上游，便于快速冒烟
openai-compatibility:
  - name: "openrouter"
    base-url: "https://openrouter.ai/api/v1"
    api-key-entries:
      - api-key: "sk-or-xxxx"
    models:
      - name: "moonshotai/kimi-k2:free"
        alias: "kimi-k2"
```

### 冒烟请求
```bash
# 用一个最短请求验证路由、鉴权和模型别名
curl http://127.0.0.1:8317/v1/chat/completions \
  -H "Authorization: Bearer dev-local-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kimi-k2",
    "messages": [
      { "role": "user", "content": "用一句话说明 CLIProxyAPI 做什么" }
    ]
  }'
```

## 高频 Recipes
---
lang: bash
emoji: "🧪"
link: https://github.com/router-for-me/CLIProxyAPI/blob/main/README_CN.md
desc: 这些是最常见、最值得直接复制改造的场景。
---

### Recipe 1：把多个 CLI 订阅统一给 OpenAI 兼容客户端
```text
适用场景:
  Cline / Continue / Roo Code / 自己的 SDK 只认 OpenAI 风格接口

做法:
  1. 把 OAuth 或 API Key 凭据接入 CLIProxyAPI
  2. 暴露一个本地 /v1 入口
  3. 下游统一配置 base URL 与 API Key
```

```text
Base URL: http://127.0.0.1:8317/v1
API Key:  dev-local-key
Model:    你在代理里暴露出来的模型名或别名
```

### Recipe 2：同一模型挂多账号轮询
```yaml
# 多个 key entry 可以做轮询与失败切换
routing:
  strategy: "round-robin"

request-retry: 3
max-retry-credentials: 2

openai-compatibility:
  - name: "openrouter"
    base-url: "https://openrouter.ai/api/v1"
    api-key-entries:
      - api-key: "sk-or-account-a"
      - api-key: "sk-or-account-b"
    models:
      - name: "moonshotai/kimi-k2:free"
        alias: "kimi-k2"
```

### Recipe 3：给客户端暴露更稳定的模型别名
```yaml
# 下游只记一个稳定别名，上游模型可以随时换
codex-api-key:
  - api-key: "sk-codex"
    models:
      - name: "gpt-5-codex"
        alias: "codex-latest"

oauth-model-alias:
  codex:
    - name: "gpt-5"
      alias: "g5"
```

### Recipe 4：屏蔽不想暴露给下游的模型
```yaml
# 避免客户端看到你不准备开放的模型
oauth-excluded-models:
  codex:
    - "gpt-5-codex-mini"
  claude:
    - "claude-3-5-haiku-20241022"
```

### Recipe 5：用 payload 规则统一补参数
```yaml
# 不想要求每个客户端都手写推理参数时很实用
payload:
  default:
    - models:
        - name: "gemini-*"
          protocol: "gemini"
      params:
        "generationConfig.thinkingConfig.thinkingBudget": 32768

  override:
    - models:
        - name: "gpt-*"
          protocol: "codex"
      params:
        "reasoning.effort": "high"
```

## 客户端接入套路
---
lang: bash
emoji: "🔌"
link: https://help.router-for.me/cn/agent-client/amp-cli.html
desc: 统一思路是“所有客户端都只指向一个本地代理入口”。
---

### OpenAI 兼容客户端
```text
Provider: OpenAI Compatible
Base URL: http://127.0.0.1:8317/v1
API Key:  dev-local-key
```

### Codex CLI
```bash
# 某些工具要求根地址，某些要求带 /v1；先按客户端文档填
export OPENAI_BASE_URL="http://127.0.0.1:8317"
export OPENAI_API_KEY="dev-local-key"

codex "review this repository"
```

### 自己的脚本
```bash
curl http://127.0.0.1:8317/v1/responses \
  -H "Authorization: Bearer dev-local-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "codex-latest",
    "input": "列出这个项目的三个核心用途"
  }'
```

### Amp CLI 场景
```yaml
# 当你需要兼容 Amp 的 provider 路径和管理代理时再启用
ampcode:
  upstream-url: "https://ampcode.com"
  restrict-management-to-localhost: false
  force-model-mappings: true
  model-mappings:
    - from: "claude-opus-4-5-20251101"
      to: "gemini-claude-opus-4-5-thinking"
```

## 管理面 / 运维动作
---
lang: bash
emoji: "🛠"
link: https://help.router-for.me/cn/management/api
desc: 生产或长期运行时，重点是管理面安全、日志和远程访问边界。
---

### 管理面最小安全配置
```yaml
remote-management:
  allow-remote: false
  # 留空表示彻底关闭 /v0/management
  secret-key: "replace-with-a-strong-secret"
  disable-control-panel: false
```

### 什么时候开放远程管理
- 只有在你明确要远程管理机器时才把 `allow-remote` 改成 `true`。
- 一旦开放远程管理，`secret-key` 不能留空，而且最好再配反向代理、来源限制和 TLS。
- 管理端点默认更适合 `localhost` 使用，不建议裸露在公网。

### 观察与排查的几个开关
```yaml
debug: false
logging-to-file: true
logs-max-total-size-mb: 512
error-logs-max-files: 20

pprof:
  enable: true
  addr: "127.0.0.1:8316"
```

### 常用排查顺序
```text
1. /v1/models 能不能列出模型
2. 请求是不是用了正确的 api-key
3. model 名是否命中了 alias / prefix / excluded 规则
4. 多账号时是否被 retry / cooldown / quota 规则切走
5. 管理面打不开时先看 secret-key 是否为空或 host 是否只绑了 localhost
```

## SDK 内嵌方案
---
lang: go
emoji: "📦"
link: https://github.com/router-for-me/CLIProxyAPI/blob/main/docs/sdk-usage_CN.md
desc: 当你不是单独起一个代理进程，而是想把能力嵌进自己的 Go 服务时使用。
---

### 最小嵌入
```go
cfg, err := config.LoadConfig("config.yaml")
if err != nil {
	panic(err)
}

svc, err := cliproxy.NewBuilder().
	WithConfig(cfg).
	WithConfigPath("config.yaml").
	Build()
if err != nil {
	panic(err)
}

ctx, cancel := context.WithCancel(context.Background())
defer cancel()

if err := svc.Run(ctx); err != nil && !errors.Is(err, context.Canceled) {
	panic(err)
}
```

### 什么时候值得走 SDK
- 你要把代理能力嵌进自己的桌面端、服务端或管理平台。
- 你需要自定义 middleware、路由、请求日志或认证加载方式。
- 你不想把 CLIProxyAPI 当成独立进程管理。

## 易错点 / 决策规则
---
lang: text
emoji: "⚠️"
link: https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/main/config.example.yaml
desc: 这些坑都比“语法写错”更常见，优先先排它们。
---

### 高频坑
- `Base URL` 填错：有的客户端要填根地址，有的要填带 `/v1` 的地址。
- `host: ""` 会监听所有网卡；本地开发更稳的是 `127.0.0.1`。
- 开了 `allow-remote: true` 却没配强密码或 TLS，风险很高。
- 模型没出现时，先查 `excluded-models`、`oauth-excluded-models`、`prefix` 和 `alias`，不要先怀疑客户端。
- 多账号轮询场景里，如果 `max-retry-credentials` 太小，失败切换可能比你预期更早停止。

### 经验法则
```text
先做最小可用配置
  -> 再接一个真实客户端
  -> 再补多账号和别名
  -> 最后才做远程管理与高并发优化
```
