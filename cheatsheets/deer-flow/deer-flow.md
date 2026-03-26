---
title: DeerFlow 速查 + Cookbook
lang: markdown
version: main@792c49e6 (2026-03-26)
date: "2026-03-26"
github: bytedance/deer-flow
colWidth: 520px
---

# DeerFlow 速查 + Cookbook

## 快速定位
---
emoji: 🦌
link: https://github.com/bytedance/deer-flow
desc: DeerFlow 是一个开源 super agent harness，把 sub-agents、memory、sandbox、skills、MCP 和 IM 渠道组织到一起，适合做研究、内容生产、多步自动化和可扩展 agent 应用。
---

- 先记住一句话：它不是单纯的聊天框，而是一个能拆任务、跑 sandbox、挂 skills、接 IM 的 agent 运行时。
- 适合的场景：
  - 深度研究、资料综述、报告生成
  - 需要多步执行的自动化任务
  - 想把 agent 接到 Telegram / Slack / 飞书
  - 需要外部程序通过 HTTP / Python Client 调用
- 最短上手路径：
  - 先 `make config`
  - 再把 `config.yaml`、`.env`、`extensions_config.json` 配好
  - 然后选 `make docker-start`、`make up` 或 `make dev`

## 仓库骨架
---
emoji: 🗂️
desc: 这个仓库不是单一服务，而是前端、Gateway、LangGraph、sandbox、skills、IM bridge 一起工作。先认入口，再看细节。
---

- `backend/`：核心后端、Gateway、LangGraph、配置与文档。
- `skills/`：内置 skills 和外部 skills 的主要入口。
- `frontend/`：交互界面。
- `extensions_config.json`：MCP server 和 skills 的扩展状态。
- `config.yaml`：主配置，必须放在项目根目录。

### 先看哪几个文档

- `README_zh.md`：最快理解功能边界和启动方式。
- `backend/docs/CONFIGURATION.md`：配置字段和 sandbox / skills / models 细节。
- `backend/docs/MCP_SERVER.md`：MCP server 接入方式。
- `backend/README.md`：架构、服务划分、开发命令。
- `CONTRIBUTING.md`：Docker / 本地开发流程。

## 最小工作流
---
emoji: 🚀
desc: 先跑通最小链路，再谈扩展。DeerFlow 的关键不是“能不能启动”，而是“任务能不能拆开并稳定执行”。
---

### 路线 A：Docker 开发

```bash
# 1. 生成本地配置
make config

# 2. 启动前先拉 sandbox 镜像
make docker-init

# 3. 启动开发态服务
make docker-start
```

- `make docker-start` 会根据 `config.yaml` 自动判断 sandbox 模式。
- 如果配置的是 provisioner 模式，才会额外启动 `provisioner`。

### 路线 B：本地开发

```bash
# 1. 检查依赖
make check

# 2. 安装依赖
make install

# 3. 启动本地服务
make dev
```

- 默认读取项目根目录的 `config.yaml`。
- 需要覆盖时，用 `DEER_FLOW_CONFIG_PATH` 指向别的配置文件。

### 路线 C：生产式启动

```bash
make up
make down
```

- `make up`：构建镜像并启动全部生产服务。
- `make down`：停止并移除容器。

## 配置速记
---
emoji: ⚙️
desc: 只保留真正会反复改的几类配置：模型、sandbox、skills、扩展和渠道。其余细节按需查文档。
---

### 主配置位置

- `config.yaml`：项目根目录
- `extensions_config.json`：项目根目录
- `.env`：环境变量

### config_version 记住这点

- `config.example.yaml` 带 `config_version`
- 如果本地 `config.yaml` 版本旧，启动时会警告
- 可以用 `make config-upgrade` 合并新增字段

### 模型配置

```yaml
models:
  - name: gpt-5.4
    use: langchain_openai:ChatOpenAI
    model: gpt-5.4
    api_key: $OPENAI_API_KEY
    temperature: 0.7

  - name: openrouter-gemini-2.5-flash
    use: langchain_openai:ChatOpenAI
    model: google/gemini-2.5-flash-preview
    api_key: $OPENAI_API_KEY
    base_url: https://openrouter.ai/api/v1
```

- OpenAI 兼容网关建议继续用 `langchain_openai:ChatOpenAI + base_url`。
- 如果 provider 使用别的变量名，也可以把 `api_key` 指到对应环境变量。

### 常见环境变量

```bash
OPENAI_API_KEY=your-openai-api-key
INFOQUEST_API_KEY=your-infoquest-api-key
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
FEISHU_APP_ID=cli_xxxx
FEISHU_APP_SECRET=your_app_secret
```

### sandbox 配置

```yaml
sandbox:
  use: deerflow.sandbox.local:LocalSandboxProvider

# 或 Docker sandbox
sandbox:
  use: deerflow.community.aio_sandbox:AioSandboxProvider
```

- `LocalSandboxProvider`：直接在宿主机执行。
- `AioSandboxProvider`：Docker 隔离执行。
- Docker + Kubernetes 模式会再加一层 provisioner。

### skills 配置

```yaml
skills:
  # 默认通常指向 ../skills
  path: ../skills
```

- skills 用于封装研究、报告、网页、图像、视频等复合工作流。
- 加载是按需的，不会一口气把所有 skills 都塞进上下文。

### 渠道配置

```yaml
channels:
  langgraph_url: http://localhost:2024
  gateway_url: http://localhost:8001

  telegram:
    enabled: true
    bot_token: $TELEGRAM_BOT_TOKEN

  slack:
    enabled: true
    bot_token: $SLACK_BOT_TOKEN
    app_token: $SLACK_APP_TOKEN

  feishu:
    enabled: true
    app_id: $FEISHU_APP_ID
    app_secret: $FEISHU_APP_SECRET
```

## 核心工作流
---
emoji: 🧭
desc: DeerFlow 的真正用法不是“问一句答一句”，而是让 lead agent 按任务复杂度切换规划、并行、记忆和执行环境。
---

### 1. 研究 / 报告 / 内容生产

1. 用 flash 或 standard 先跑一轮探索。
2. 需要分解时切 pro。
3. 任务很大时切 ultra，让 lead agent 拉起 sub-agents。
4. 结果落到文件系统，再继续二次加工。

### 2. 多步自动化

1. 先把要做的事情拆成可验证的阶段。
2. 把易变步骤交给 sandbox 执行。
3. 用 skills 包住重复工作流。
4. 最后用 memory 记录稳定偏好和上下文。

### 3. 接 IM 当任务入口

1. 在 `config.yaml` 打开 Telegram / Slack / Feishu 渠道。
2. 配好 `.env` 的 token。
3. 发消息后，没命令前缀的内容会按普通聊天处理。
4. 常用命令可直接在聊天里切线程、查状态、看模型和 memory。

### 4. 当作外部服务调用

1. 用 HTTP Gateway 或 LangGraph API 发起 thread。
2. 通过 SSE 流拿结果。
3. 用 Python Client 在进程内直接调。
4. 需要脚本化时，优先用 `claude-to-deerflow` skill 里的 shell 模板。

## IM 渠道速查
---
emoji: 💬
desc: IM 不是附带功能，而是 DeerFlow 的正式入口之一。适合把 agent 变成群聊里的任务执行者。
---

### 渠道对照

| 渠道 | 传输方式 | 适合场景 |
|---|---|---|
| Telegram | Bot API / long-polling | 个人或小团队快速接入 |
| Slack | Socket Mode | 团队工作区 |
| Feishu / Lark | WebSocket | 国内协作场景 |

### 聊天命令

| 命令 | 作用 |
|---|---|
| `/new` | 开启新对话 |
| `/status` | 查看当前 thread 信息 |
| `/models` | 列出可用模型 |
| `/memory` | 查看 memory |
| `/help` | 查看帮助 |

- 没有命令前缀的消息会直接按普通聊天处理。
- 复杂任务建议先 `/new`，避免旧 thread 上下文污染。

### 配置提醒

- Telegram：先在 BotFather 拿 token，再写入 `.env`。
- Slack：要开 Socket Mode，并准备 `xapp-...` 与 `xoxb-...`。
- Feishu：要开 Bot 能力，并确保事件订阅与长连接开启。

## 模式与能力
---
emoji: 🧠
desc: 模式选择影响成本和速度。先用最小模式验证，再按任务复杂度往上切。
---

### 运行模式

- `flash`：最快，适合简单问答和探路。
- `standard`：均衡。
- `pro`：更偏规划。
- `ultra`：更适合 sub-agents 场景。

### 核心能力

- Skills：Markdown 化的工作流模块。
- Tools：网页搜索、网页抓取、文件操作、bash 执行。
- Sandbox：隔离执行环境。
- Memory：跨 session 的长期偏好和事实积累。
- Context engineering：主动压缩、摘要、分配上下文。

### 技术边界

- DeerFlow 2.0 是重写版，不和 v1 共用代码。
- 如果你找的是最早的 Deep Research 框架，要看 `main-1.x` 分支。
- 支持 OpenAI 兼容 API，但长上下文、推理、多模态和稳定 tool use 的模型更适合。

## 外部调用
---
emoji: 🔌
desc: 需要把 DeerFlow 挂到别的程序或自动化系统时，优先走 Gateway、LangGraph API 或内嵌 Python Client。
---

### Python Client

```python
from deerflow.client import DeerFlowClient

client = DeerFlowClient()

response = client.chat("Analyze this paper for me", thread_id="my-thread")

for event in client.stream("hello"):
    if event.type == "messages-tuple" and event.data.get("type") == "ai":
        print(event.data["content"])

models = client.list_models()
skills = client.list_skills()
client.update_skill("web-search", enabled=True)
client.upload_files("thread-1", ["./report.pdf"])
```

### 常见端点

```bash
curl -s "$DEERFLOW_GATEWAY_URL/health"
curl -s "$DEERFLOW_GATEWAY_URL/api/models"
curl -s "$DEERFLOW_GATEWAY_URL/api/skills"
curl -s "$DEERFLOW_GATEWAY_URL/api/agents"
curl -s "$DEERFLOW_GATEWAY_URL/api/memory"
```

### 线程与流式响应

```bash
curl -s -X POST "$DEERFLOW_LANGGRAPH_URL/threads" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hello"}]}'

curl -s -N -X POST "$DEERFLOW_LANGGRAPH_URL/threads/<thread_id>/runs/stream" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hello again"}]}'
```

## 常见坑
---
emoji: ⚠️
desc: 这些问题最容易把“能启动”变成“不能用”。先看这里，能少掉很多无效排查。
---

- `config.yaml` 不在项目根目录，服务常常找不到配置。
- `config.yaml` 版本老了，先跑 `make config-upgrade`。
- Docker sandbox 起不来，先检查 Docker 是否可用，再看端口和权限。
- skills 不加载，先确认 `skills/` 和 `SKILL.md` 是否存在。
- IM 没反应，先确认渠道配置和 token，再看是否启用了对应 channel。
- 只需要一次性试跑时，不要强行上 ultra。

## Quick Ref
---
emoji: 🧾
desc: 把最常用的命令和端点压成一页，平时先扫这里，不够再回到上面的工作流。
---

### 生成与启动

```bash
make config
make config-upgrade
make check
make install
make docker-init
make docker-start
make dev
make up
make down
```

### 读配置时优先看

- `config.yaml`
- `.env`
- `extensions_config.json`
- `backend/docs/CONFIGURATION.md`
- `backend/docs/MCP_SERVER.md`

### API 抓手

- `GET /health`
- `POST /threads`
- `POST /threads/<thread_id>/runs/stream`
- `GET /api/models`
- `GET /api/skills`
- `PUT /api/skills/<skill_name>`
- `GET /api/agents`
- `GET /api/memory`
- `POST /api/threads/<thread_id>/uploads`
- `GET /api/threads/<thread_id>/uploads/list`
- `GET /threads/<thread_id>/history`
- `POST /threads/search`
