---
title: OpenViking Cookbook
lang: bash
version: v0.2.6
date: 2026-03-11
github: volcengine/OpenViking
colWidth: 360px
---

# OpenViking Cookbook

## 快速定位
---
emoji: 🧠
link: https://github.com/volcengine/OpenViking
desc: OpenViking 不是“再一个 RAG SDK”，而是把资源、记忆、技能统一进 `viking://` 虚拟文件系统的上下文数据库。做 cookbook 时，先想清楚你要走哪条路：嵌入式 Python、独立 HTTP 服务、CLI 自动化、MCP 暴露给 Agent，还是直接接 VikingBot / OpenClaw 插件。
---

### 这东西适合什么时候上

- 你已经有 Agent，但上下文散落在文件、网页、向量库、记忆插件里，想统一入口。
- 你需要的不只是“搜到片段”，而是“先定位目录，再逐层深入”的可观察检索链。
- 你想把记忆、资源、技能都挂进同一棵树，再用 `ls` / `tree` / `find` / `grep` 组合访问。

### 三层内容模型

- `L0 / abstract`：一句话摘要，先判断值不值得继续读。
- `L1 / overview`：规划层读这个，帮助 Agent 决定下一步。
- `L2 / read`：原文详情，只在必要时下钻，控制 token 成本。

### 先做哪个入口

- 嵌入到 Python 应用：用 `ov.OpenViking(path="./data")`
- 做成共享服务：用 `openviking-server`
- 脚本批量跑：用 `ov` / `openviking` CLI
- 给 Claude 之类 Agent 暴露工具：跑 `examples/mcp-query`
- 想直接拿来聊天或接 IM：用 `vikingbot`

## 仓库骨架
---
emoji: 🗂️
desc: 这个仓库是多入口组合，不要把所有目录一股脑读完。先按“我要用什么模式”去找对应目录。
---

### 主模块分工

- `openviking/`：Python SDK、同步/异步客户端、Server 端核心能力。
- `crates/ov_cli/`：Rust CLI，适合命令行和脚本自动化。
- `examples/`：真正的 cookbook 区，包含 server-client、MCP、memory plugin、多租户、k8s 等样例。
- `bot/`：VikingBot，适合直接做聊天代理与多渠道接入。
- `docs/`：概念和深入说明，想理解分层检索和会话记忆时再进。

### 典型选型

- 单机试验或内嵌业务进程：嵌入式 Python 最省事。
- 多 Agent 共用一个上下文底座：HTTP Server 模式更稳。
- 想把 OpenViking 当外部工具挂给大模型：MCP 模式最顺手。
- 已经在用 OpenClaw / OpenCode：优先看插件示例。

## 起手工作流
---
emoji: 🚀
desc: 这部分只保留最小可执行入口，不展开安装细节。重点是先跑通“导入资源 → 等待处理 → 分层访问 → 检索”这条主链。
---

### 路线 1：嵌入式 Python 起手

```python
import openviking as ov

client = ov.OpenViking(path="./data")
client.initialize()

res = client.add_resource(
    path="https://raw.githubusercontent.com/volcengine/OpenViking/refs/heads/main/README.md"
)
root_uri = res["root_uri"]

client.wait_processed()

print(client.abstract(root_uri))
print(client.overview(root_uri))
print(client.find("what is openviking", target_uri=root_uri))

client.close()
```

### 路线 2：先起服务，再给多个客户端共用

```bash
# 终端 A：启动服务
openviking-server

# 终端 B：先看状态，再导资源
ov status
ov add-resource https://github.com/volcengine/OpenViking --wait
ov tree viking://resources/volcengine -L 2
ov find "what is openviking"
```

### 路线 3：HTTP Client 接远程服务

```python
import openviking as ov

client = ov.SyncHTTPClient(
    url="http://localhost:1933",
    api_key=None,
    timeout=120.0,
)

client.initialize()
client.add_resource(path="./document.md")
client.wait_processed()
results = client.find("search query")
client.close()
```

### 配置文件记忆法

- Server / SDK 读 `OPENVIKING_CONFIG_FILE`，默认 `~/.openviking/ov.conf`
- CLI 读 `OPENVIKING_CLI_CONFIG_FILE`，默认 `~/.openviking/ovcli.conf`
- `ov.conf` 放模型、存储、服务端配置
- `ovcli.conf` 只放远程连接地址、认证和输出格式

## 高频 Recipes
---
emoji: 🍳
desc: cookbook 的重点不在 API 面，而在“什么时候用哪串命令”。下面这些是仓库和 zread 信息里最值得复用的路线。
---

### 把文档、仓库、网页喂进同一棵树

什么时候用：你要给 Agent 建一个长期可检索的知识底座。

```bash
ov add-resource https://github.com/volcengine/OpenViking --wait
ov ls viking://resources/
ov tree viking://resources/volcengine -L 2
ov grep "OpenViking" --uri viking://resources/volcengine/OpenViking/docs/zh
```

- 先 `add-resource` 再 `tree`，确认目录结构是否符合预期。
- `--wait` 适合快速验证；批量导入时可以异步，再单独 `wait`。
- v0.2.6 之后补强了后台任务和异步提交，长任务不必都阻塞前台。

### 用 L0/L1/L2 控制 token 成本

什么时候用：你要让 Agent 先做规划，再决定是否读全文。

```bash
# 先用 overview 判断目录值不值得深入
ov find "hierarchical retrieval"

# 再定向读取更细内容
ov tree viking://resources/volcengine/OpenViking/docs -L 3
ov grep "directory recursive retrieval" --uri viking://resources/volcengine/OpenViking
```

- 先 `find` 锁目录，再 `tree` / `grep` / `read` 下钻，是 OpenViking 的推荐节奏。
- 不要一上来就把整库全文塞进上下文；先拿 `abstract` / `overview` 再决定。

### 暴露成 MCP，给外部 Agent 当工具

什么时候用：你希望 Claude 或别的支持 MCP 的 Agent 直接调用 OpenViking 的检索能力。

```bash
cd examples/mcp-query
uv sync
uv run server.py
```

```bash
claude mcp add --transport http openviking http://localhost:2033/mcp
```

- MCP Server 主要暴露 `query`、`search`、`add_resource` 三个工具。
- `query` 适合“一步给答案”；`search` 适合让上层 Agent 自己规划后续动作。

### 给 OpenClaw 接长期记忆

什么时候用：你已经在跑 OpenClaw，希望把记忆底座换成 OpenViking。

```bash
cd /path/to/OpenViking
npx ./examples/openclaw-memory-plugin/setup-helper
openclaw gateway
```

```bash
openclaw config set plugins.entries.memory-openviking.config.mode "remote"
openclaw config set plugins.entries.memory-openviking.config.baseUrl "http://your-server:1933"
openclaw config set plugins.entries.memory-openviking.config.autoRecall true --json
openclaw config set plugins.entries.memory-openviking.config.autoCapture true --json
```

- 本地模式：插件自动起 OpenViking，适合个人环境。
- 远程模式：OpenClaw 只连服务端，适合团队和统一运维。
- README 给出的实验数据说明，这条路线的收益不仅是效果提升，还有明显的 token 成本下降。

### 两分钟起一个能聊天的 VikingBot

什么时候用：你想快速验证“OpenViking + Agent”整条链，而不是自己拼装 bot。

```bash
pip install "openviking[bot]"
vikingbot gateway
vikingbot chat
```

- `vikingbot gateway` 会顺手起 Console Web UI。
- Bot 默认读取同一个 `ov.conf`，不用再维护第二份 provider 配置。
- 适合先验证资源管理、记忆提交和检索工具联动，再决定是否接 Feishu / Slack / Telegram。

### 从单机场景切到共享服务

什么时候用：你最初在本地嵌入式用得不错，现在要给多个进程、多个 Agent、多个租户共用。

```bash
openviking-server --host 0.0.0.0 --port 1933
```

```json
{
  "url": "http://localhost:1933",
  "api_key": null,
  "output": "table"
}
```

- 把连接信息放进 `ovcli.conf`，避免脚本里散落地址和 key。
- 如果要做远程共享，再看 `examples/multi_tenant/` 和 server API 认证。

## 决策与排障
---
emoji: ⚠️
desc: OpenViking 好用的前提，是你别把它当“单次问答检索器”。它更像一个可运营的上下文底座，所以最容易出问题的地方也都集中在配置、异步处理和入口选错。
---

### 先判定模式，不要混着用

- 只是单机应用内调用：优先嵌入式，不必先起 Server。
- 多个客户端共享：起 HTTP Server，不要每个进程各自维护一份数据。
- 要给大模型工具化调用：优先 MCP，而不是手搓一层自定义 wrapper。

### 常见坑

- 资源刚导入就搜不到：你还没 `wait_processed()` 或 `ov wait`。
- `ov` 能跑但 Bot / 插件异常：多数是 `ov.conf` 里 `vlm` 或 `embedding.dense` 没配齐。
- Windows 机器读配置异常：v0.2.6 专门修过 UTF-8 BOM 兼容，旧配置文件要留意编码。
- 想用最新 tag：仓库里已有 `v0.2.7` tag，但截至 2026-03-15 最新 GitHub Release 仍是 `v0.2.6`，生产环境按已发布版本看更稳。

### 资源组织建议

- 导入目录时，只有你真的依赖原层级含义时，才保留原始结构。
- 目录命名尽量贴近业务域，让 `find` 锁定目录之后可继续人工判断。
- 会话提交和记忆提取是后台能力，不要把所有状态都寄希望于即时返回。

## 命令抓手
---
emoji: 🔧
desc: 如果你已经理解上面的 workflow，真正高频反复出现的就是下面这几组抓手。
---

### 资源导入与浏览

- `ov add-resource <url-or-path> [--wait]` : 导入网页、文件、目录或仓库入口
- `ov ls <uri>` : 看当前目录
- `ov tree <uri> -L <depth>` : 快速扫层级
- `ov grep "<pattern>" --uri <uri>` : 在指定树里做内容过滤
- `ov glob "<pattern>" --uri <uri>` : 按路径模式筛文件

### 分层访问与检索

- `abstract(<uri>)` : 快速判断目录/文件是否值得继续读
- `overview(<uri>)` : 拿结构化概览，适合规划阶段
- `read(<uri>)` : 只在确定目标后读取全文
- `find("<query>", target_uri=<uri>)` : 先语义找目录，再继续下钻

### 服务与会话

- `openviking-server` : 起独立服务
- `ov status` : 看系统状态
- `ov session new` : 新建会话
- `ov session add-message <id> --role user --content "..."` : 填消息
- `ov session commit <id>` : 归档消息并提取记忆
