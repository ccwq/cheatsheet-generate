---
title: codebase-memory-mcp 速查表
lang: zh
version: "1.0.0"
date: "2026-07-08"
github: DeusData/codebase-memory-mcp
colWidth: 360px
desc: 纯 C 代码知识图谱引擎：毫秒级索引，Linux 内核 3 分钟完成，14 MCP 工具，支持 Claude Code / Codex CLI / Gemini CLI 等 11 种 Coding Agent
tags:
  - AI / LLM
  - AI 辅助工具
  - CLI 工具
  - MCP
  - Python
  - 开发
---

# codebase-memory-mcp 速查表

> 纯 C 代码知识图谱引擎，零依赖，158 语言，毫秒查询。一条命令接入 11 种 Coding Agent。

## 一句话

`install` → `Index this project` → 问架构/调用链/死代码/变更影响 → 毫秒返回。5 次结构查询消耗 ~3,400 tokens vs 逐文件 grep ~412,000 tokens（节省 99.2%）。

---

## 核心指标

| 指标 | 数值 |
|------|------|
| Linux 内核全量索引 | **3 分钟**（28M LOC / 75K 文件 → 4.81M 节点 · 7.72M 边）|
| 单次图查询延迟 | **<1ms** |
| Token 节省 | ~3,400 vs ~412,000（5 次结构查询）|
| 支持语言 | **158** 种（编译进二进制）|
| MCP 工具 | **14** 个 |
| Coding Agent 支持 | **11** 种 |
| License | MIT |
| 数据存储 | `~/.cache/codebase-memory-mcp/`（SQLite，WAL 模式）|

---

## 快速定位

- [macOS / Linux 一键安装](#二安装-sop)
- [Windows / WSL 安装](#windows--wsl)
- [Claude Code 接入 + 使用 SOP](#三claude-code-接入与使用)
- [Codex CLI 接入 + 使用 SOP](#四codex-cli-接入与使用)
- [14 MCP 工具速查](#十四-mcp-工具速查)
- [高频坑点](#十五坑点与排障)

---

## 二、安装 SOP

### macOS / Linux（推荐）

```bash
# 标准版（不含 UI）
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash

# 含 3D 图可视化 UI（localhost:9749）
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash -s -- --ui
```

### macOS Apple Silicon 手动下载

```bash
# 从 GitHub Releases 下载对应平台二进制
# Apple Silicon: codebase-memory-mcp-darwin-arm64.tar.gz
# Intel:       codebase-memory-mcp-darwin-amd64.tar.gz
tar xzf codebase-memory-mcp-*.tar.gz
./install.sh
```

### Windows（PowerShell）

```powershell
# 1. 下载安装脚本
Invoke-WebRequest -Uri https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.ps1 -OutFile install.ps1

# 2. 检查脚本内容（推荐）
notepad install.ps1

# 3. 解除安全标记（浏览器下载会加 Mark-of-the-Web）
Unblock-File .\install.ps1

# 4. 运行安装
.\install.ps1

# 含 UI 版
.\install.ps1 -ArgumentList "--ui"

# 仅下载二进制，不配置 Agent
.\install.ps1 -ArgumentList "--skip-config"
```

> ⚠️ SmartScreen 报「已阻止」→ 点"更多信息" → "仍要运行"。或验证完整性：`checksums.txt` SHA-256 对比。

### Windows WSL（Linux 脚本）

WSL2 内部直接跑 Linux 安装脚本：

```bash
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash
```

> 适用于 WSL2 Ubuntu/Debian。原生 Windows 建议用 PowerShell 脚本。

### Arch Linux（AUR）

```bash
yay -S codebase-memory-mcp-bin
# 或
paru -S codebase-memory-mcp-bin
```

### npm 安装

```bash
npm install -g codebase-memory-mcp
# 全局安装后需要手动配置 Agent 的 MCP server
```

### PyPI 安装

```bash
pip install codebase-memory-mcp
```

### Homebrew（macOS）

```bash
brew install codebase-memory-mcp
```

### Scoop / Winget / Chocolatey

```bash
# Scoop
scoop install codebase-memory-mcp

# Winget
winget install DeusData.codebase-memory-mcp

# Chocolatey
choco install codebase-memory-mcp
```

### 从源码编译（需要 C 编译器）

```bash
# 克隆仓库
git clone https://github.com/DeusData/codebase-memory-mcp.git
cd codebase-memory-mcp

# macOS：安装 clang
xcode-select --install

# Linux Debian/Ubuntu
sudo apt install build-essential zlib1g-dev

# Linux Fedora
sudo dnf install gcc zlib-devel

# 编译标准版
scripts/build.sh

# 编译含 UI 版
scripts/build.sh --with-ui

# 二进制输出路径
build/c/codebase-memory-mcp
```

### `install` 命令做了什么

`install` 命令自动探测并配置所有已安装的 Coding Agent：

| Agent | MCP 配置位置 | 指令文件 | Hooks |
|-------|------------|---------|-------|
| Claude Code | `.claude/.mcp.json` | 4 个 Skills | PreToolUse（Grep/Glob 图增强）|
| Codex CLI | `.codex/config.toml` | `.codex/AGENTS.md` | SessionStart 提醒 |
| Gemini CLI | `.gemini/settings.json` | `.gemini/GEMINI.md` | BeforeTool + SessionStart |
| Zed | `settings.json`（JSONC）| — | — |
| OpenCode | `opencode.json` | `AGENTS.md` | — |
| Aider | — | `CONVENTIONS.md` | — |
| VS Code | `Code/User/mcp.json` | — | — |
| OpenClaw | `openclaw.json` | — | — |

---

## 三、Claude Code 接入与使用

### 接入步骤

**方式一：`install` 命令自动配置（推荐）**

安装脚本会自动检测 Claude Code 并写入 `.claude/.mcp.json`，无需手动操作。

**方式二：手动配置**

在项目根目录或用户级创建 `.mcp.json`：

```json
{
  "mcpServers": {
    "codebase-memory-mcp": {
      "command": "/path/to/codebase-memory-mcp",
      "args": []
    }
  }
}
```

> 二进制路径可通过 `which codebase-memory-mcp` 确认（通常 `~/.local/bin/codebase-memory-mcp`）。

**方式三：让 Claude Code 自己安装**

```text
你：帮我安装这个 MCP server：https://github.com/DeusData/codebase-memory-mcp
```

### 验证接入

```text
/mcp
```

输出中应看到 `codebase-memory-mcp` 及其 14 个工具。

### 使用 SOP（具体例子）

重启 Claude Code（退出重进或新会话），然后：

#### 第一步：索引当前项目

```text
你：Index this project
```

或用命令：

```bash
codebase-memory-mcp cli index_repository '{"repo_path": "/path/to/your/repo"}'
```

首次索引后，背景 Watcher 自动追踪文件变更，保持图谱新鲜。

#### 第二步：问架构问题

```text
你：这个项目的整体架构是什么？有哪些主要模块？

→ get_architecture 返回：语言、包、入口点、路由、热点文件、模块边界、Louvain 社区聚类
```

```text
你：帮我画出主要模块之间的调用关系

→ trace_path（默认 depth=3）或 query_graph（MATCH 查询）
```

#### 第三步：找函数/类的调用方

```text
你：哪些地方调用了 ProcessOrder 这个函数？

→ trace_path(function_name="ProcessOrder", direction="inbound")
```

**Claude Code 内部调用链**：

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "trace_path",
    "arguments": {
      "function_name": "ProcessOrder",
      "direction": "inbound"
    }
  }
}
```

返回结构化 JSON，包含调用栈和文件位置。

#### 第四步：找死代码

```text
你：帮我找出这个仓库里没有被调用的函数（死代码）

→ search_graph 过滤 degree=0，排除入口点，约 150ms 全图扫描
```

#### 第五步：查变更影响

```text
你：我改了 config.go，会影响哪些地方？

→ detect_changes，git diff 映射到受影响符号 + 风险分类
```

#### 第六步：语义搜索

```text
你：找所有和认证相关的代码

→ semantic_query 向量搜索（bundled Nomic embeddings，零 API key）
```

### Claude Code 使用示例（完整对话流）

```
你：Index this project
Claude Code：正在索引...（Linux 内核约 3 分钟，中型项目毫秒级）

你：这个项目用到了哪些外部 HTTP 服务？
Claude Code：调用 get_architecture 或 search_graph 过滤 HTTP_CALLS 边
→ 返回 {method: "POST", path: "/api/auth", calls: ["LoginHandler", "TokenRefresh"]}

你：PaymentService 这个类被哪些地方引用了？
Claude Code：trace_path(function_name="PaymentService", direction="both")
→ 返回双向调用链

你：帮我查一下有没有未使用的导出函数
Claude Code：search_graph(label="Function", degree_filter="out_degree=0")
→ 过滤入口点后列出死代码
```

### 启用自动索引

```bash
codebase-memory-mcp config set auto_index true
# 新项目在首次连接时自动索引
# 之前索引过的项目注册背景 Watcher

codebase-memory-mcp config set auto_watch false
# 禁止当前会话注册背景 Watcher（多项目切换时有用）
```

---

## 四、Codex CLI 接入与使用

### 接入步骤

**方式一：`install` 命令自动配置（推荐）**

`install` 自动写入 `.codex/AGENTS.md` 和 `.codex/config.toml`。

**方式二：手动添加 MCP server**

在 `.codex/config.toml` 中加入：

```toml
[plugins]
[plugins.codebase-memory-mcp]
command = "codebase-memory-mcp"
args = ["--mcp"]
```

### 使用 SOP（具体例子）

#### 启动 Codex CLI 并索引项目

```bash
codex run "Index this project using codebase-memory-mcp"
```

#### 问架构问题

```
codex> 这个微服务项目的 HTTP 路由有哪些？入口点在哪里？
→ Codex 调用 search_graph 或 get_architecture
```

#### 追踪调用链

```
codex> DatabaseConnection 被哪些服务使用？
→ trace_path(function_name="DatabaseConnection", direction="inbound")
```

#### 变更影响分析

```
codex> 我改了 utils/auth.go，会影响哪些测试？
→ detect_changes，映射到受影响测试文件
```

#### Cypher 查询

```
codex> 用 Cypher 查所有带 "Handler" 后缀的函数
MATCH (f:Function) WHERE f.name =~ '.*Handler' RETURN f.name, f.file
→ Codex 调用 query_graph
```

---

## 五、14 MCP 工具速查

### 索引类

| 工具 | 用途 | 例子 |
|------|------|------|
| `index_repository` | 将仓库索引为知识图谱 | `{"repo_path": "."}` |
| `list_projects` | 列出所有已索引项目 | `{}` |
| `delete_project` | 删除项目及其图数据 | `{"repo_path": "/path"}` |
| `index_status` | 查看索引状态 | `{"repo_path": "/path"}` |

### 查询类

| 工具 | 用途 | 例子 |
|------|------|------|
| `search_graph` | 按标签/名称/文件范围结构搜索 | `{"label": "Function", "name_pattern": ".*Handler.*"}` |
| `trace_path` | BFS 遍历调用链（depth 1-5）| `{"function_name": "main", "direction": "both"}` |
| `detect_changes` | git diff 映射到受影响符号 | `{}`（使用工作区 diff）|
| `query_graph` | Cypher 图查询（openCypher 子集）| `{"query": "MATCH (f) RETURN f LIMIT 5"}` |
| `get_graph_schema` | 节点/边统计，属性定义 | `{}` |
| `get_code_snippet` | 按限定名读取函数源码 | `{"qualified_name": "myproj.utils.main"}` |
| `get_architecture` | 代码库概览 | `{}` |
| `search_code` | 图增强的 grep（仅索引文件）| `{"pattern": "TODO"}` |
| `manage_adr` | 架构决策记录 CRUD | `{"action": "list"}` |
| `ingest_traces` | 摄入运行时 trace 验证 HTTP_CALLS 边 | `{"trace_file": "/path.json"}` |

### 常用 Cypher 子集

支持：`MATCH`, `OPTIONAL MATCH`, `WHERE`, `WITH`, `RETURN`, `ORDER BY`, `SKIP`, `LIMIT`, `DISTINCT`, `UNION`, `CASE`  
支持：`EXISTS { (n)-[:TYPE]->() }`（死代码检测神器）  
不支持：写入语句（`MERGE`/`CALL` 写作）。

### 节点类型

`Project`, `Package`, `Folder`, `File`, `Module`, `Class`, `Function`, `Method`, `Interface`, `Enum`, `Type`, `Route`, `Resource`

### 边类型

`CONTAINS_PACKAGE`, `DEFINES`, `IMPORTS`, `CALLS`, `HTTP_CALLS`, `ASYNC_CALLS`, `IMPLEMENTS`, `MEMBER_OF`, `TESTS`, `USES_TYPE`

---

## 六、配置与更新

### 查看/设置配置

```bash
codebase-memory-mcp config list                          # 列出所有配置
codebase-memory-mcp config set auto_index true           # 开启自动索引
codebase-memory-mcp config set auto_index_limit 50000   # 自动索引最大文件数
codebase-memory-mcp config set auto_watch false          # 禁止背景 Watcher
codebase-memory-mcp config reset auto_index              # 重置为默认值
```

### 升级

```bash
codebase-memory-mcp update
# MCP server 启动时也会检查更新，有新版本会在首次工具调用时通知
```

### 卸载

```bash
codebase-memory-mcp uninstall
# 移除所有 Agent 配置、Skills、Hooks、指令文件
# 保留二进制和 SQLite 数据库
```

### 重置数据

```bash
rm -rf ~/.cache/codebase-memory-mcp/
# 删除所有索引数据，下次使用从头重建
```

### 自定义文件扩展名

**项目级**（`.codebase-memory.json`）：

```json
{
  "extra_extensions": {
    ".blade.php": "php",
    ".mjs": "javascript"
  }
}
```

**全局**（`~/.config/codebase-memory-mcp/config.json`）：

```json
{
  "extra_extensions": {
    ".twig": "html",
    ".phtml": "php"
  }
}
```

### 忽略文件

三层忽略：`hardcoded` → `.gitignore` → `.cbmignore`。在项目根目录创建 `.cbmignore`（gitignore 语法）。

---

## 七、Graph 可视化 UI（含 --ui 版本）

```bash
# 启动 MCP server 时带上 UI 线程
codebase-memory-mcp --ui=true --port=9749

# 浏览器打开
open http://localhost:9749
```

交互式 3D 图探索知识图谱结构，支持多仓库跨仓布局。

---

## 八、环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `CBM_CACHE_DIR` | `~/.cache/codebase-memory-mcp/` | 数据库存储路径 |
| `CBM_DIAGNOSTICS` | `false` | 设为 `1` 开启诊断（输出到 `/tmp/cbm-diagnostics-<pid>.json`）|
| `CBM_LOG_LEVEL` | `info` | `debug`/`info`/`warn`/`error`/`none` |
| `CBM_WORKERS` | 自动检测 | 容器内手动指定并行 worker 数（1-256）|
| `CBM_ALLOWED_ROOT` | 未设置 | 限制 `index_repository` 可访问的根目录 |
| `CBM_DOWNLOAD_URL` | GitHub releases | 自托管部署时覆盖下载地址 |

---

## 九、团队共享图谱 Artifact

将压缩图谱文件提交到仓库，队友 clone 后无需重建：

```bash
# 索引后自动导出（或手动触发）
# 输出：.codebase-memory/graph.db.zst（zstd 压缩，8-13:1）

# 队友首次使用：自动解压 + 增量索引
```

`.gitattributes` 自动设 `merge=ours`，避免二进制合并冲突。

---

## 十、CLI 模式（绕过 MCP 直接用）

```bash
codebase-memory-mcp cli index_repository '{"repo_path": "/path/to/repo"}'
codebase-memory-mcp cli search_graph '{"name_pattern": ".*Handler.*", "label": "Function"}'
codebase-memory-mcp cli trace_path '{"function_name": "Search", "direction": "both"}'
codebase-memory-mcp cli query_graph '{"query": "MATCH (f:Function) RETURN f.name LIMIT 5"}'
codebase-memory-mcp cli list_projects

# 原始输出
codebase-memory-mcp cli --raw search_graph '{"label": "Function"}' | jq '.results[].name'
```

---

## 十一、诊断与排障

### 捕获诊断日志（用于上报内存/性能问题）

在 Agent 的 MCP 配置中加 `env`：

```json
{
  "mcpServers": {
    "codebase-memory-mcp": {
      "command": "codebase-memory-mcp",
      "env": {
        "CBM_DIAGNOSTICS": "1"
      }
    }
  }
}
```

输出文件：
- `/tmp/cbm-diagnostics-<pid>.ndjson`：内存轨迹（每 5 秒一条，含 rss/committed/fd/page_faults/queries）
- `/tmp/cbm-diagnostics-<pid>.json`：最新快照（干净退出时删除）

### 常见问题

| 问题 | 解决 |
|------|------|
| `command not found` | `install` 后重开终端，或确认 PATH 含 `~/.local/bin` |
| SmartScreen 阻止（Windows）| 点"更多信息"→"仍要运行"，或 `Unblock-File .\install.ps1` |
| Claude Code `/mcp` 看不到 cbm | 重启 Claude Code（`exit` 后重进）|
| 索引很慢 | 确认不是首次全量索引；Linux 内核 3 分钟正常 |
| 更新后索引失效 | `codebase-memory-mcp update` 后 `index_repository` 重新索引 |
| 多项目切换图谱混乱 | `codebase-memory-mcp config set auto_watch false` |
| API key 相关错误 | 纯本地工具，不需要任何 API key |

---

## 十二、完整使用流程（最短路径）

```bash
# 1. 一键安装
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash

# 2. 重启 Claude Code / Codex CLI

# 3. 索引项目
你：Index this project

# 4. 开始问问题
你：这个项目的架构是什么？
你：哪些地方调用了 validateToken？
你：帮我找出死代码。
你：改了 auth.go 会影响哪些测试？
```

---

## 十三、与竞品对比

| 工具 | 语言支持 | Token 效率 | 查询延迟 | Agent 支持 |
|------|---------|-----------|---------|-----------|
| **codebase-memory-mcp** | **158** | **99.2% 节省** | **<1ms** | **11 种** |
| 传统 grep/read | 全部 | 基准 | 秒级 | 无 |
| Sourcegraph | 全部 | 较低 | 秒级 | API |
| GitHub Copilot Chat | 有限 | 中等 | 秒级 | 1 种 |

**核心优势**：本地优先、零 API key、零依赖、毫秒查询、99.2% Token 节省。

---

## 十四、MCP 工具速查

```
index_repository   → 索引仓库
list_projects      → 已索引项目列表
delete_project     → 删除项目
index_status       → 索引状态
search_graph       → 结构搜索（标签/名称/文件）
trace_path         → 调用链追踪（depth 1-5）
detect_changes     → 变更影响映射
query_graph        → Cypher 图查询
get_graph_schema   → 节点/边统计
get_code_snippet    → 按限定名读源码
get_architecture   → 代码库概览
search_code        → 图增强 grep
manage_adr         → 架构决策记录
ingest_traces      → 运行时 trace 摄入
```

---

## 十五、坑点与排障

1. **Windows PowerShell 脚本执行策略报错** → `Set-ExecutionPolicy -Scope Process Bypass` 或 `PowerShell -ExecutionPolicy Bypass -File .\install.ps1`
2. **macOS 无法运行（来源不明）** → `xattr -d com.apple.quarantine /path/to/codebase-memory-mcp`；或重新从官网下载
3. **`install` 报 `command not found`** → 确认 `~/.local/bin` 在 PATH 中；重开终端
4. **索引后数据不更新** → `codebase-memory-mcp config set auto_watch true`（默认开启）
5. **Claude Code PreToolUse hook 失败不阻塞** → 设计如此，hook 结构性非阻塞，任意失败路径返回 exit code 0
6. **图谱查询返回空** → 确认已 `index_repository`；查 `get_graph_schema` 验证节点存在
7. **多仓库切换时图谱串台** → `codebase-memory-mcp config set auto_watch false` 禁止当前会话注册 Watcher

---

## 相关链接

- GitHub: https://github.com/DeusData/codebase-memory-mcp
- arXiv: https://arxiv.org/abs/2603.27277
- Releases: https://github.com/DeusData/codebase-memory-mcp/releases/latest
