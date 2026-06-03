---
title: CodeGraph 速查表
lang: bash
version: "1.x"
date: 2026-06-03
github: colbymchenry/codegraph
colWidth: 460px
---

## 🚀 一句话定位
---
emoji: 🚀
link: https://github.com/colbymchenry/codegraph
desc: CodeGraph 是面向 Claude Code、Codex CLI、Cursor、Hermes Agent 等编码代理的本地代码知识图谱，用预索引替代大范围 grep/read。
---

**核心价值：** 把"先扫文件再理解代码"改成"直接查图谱再追踪调用链"，在大仓库里通常更省 token、更少工具调用，也更快。基准：平均 **16% 更便宜 · 58% 更少工具调用 · 100% 本地运行**。

---

## ⚡ 安装与初始化
---
emoji: ⚡
link: https://colbymchenry.github.io/codegraph/
desc: 支持自包含安装包（无 Node.js）和 npm，两种方式都附带 MCP server。
---

### 安装 CLI（不需要 Node.js）

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh

# Windows PowerShell
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex

# 已有 Node.js 时
npm i -g @colbymchenry/codegraph
```

> 自包含安装包内置运行时，不需要 Node.js。安装后**需要重新打开终端**让 `codegraph` 命令生效。

### 连接 Agent（MCP Server）

```bash
# 新终端中运行，自动检测并配置所有支持的 agent
codegraph install

# 一次完成（下载 + install）
npx @colbymchenry/codegraph
```

`codegraph install` 会检测并配置：Claude Code、Cursor、Codex CLI、opencode、Hermes Agent、Gemini CLI、Antigravity IDE、Kiro。

### 项目初始化

```bash
cd your-project
codegraph init -i    # 创建 .codegraph/ 并构建索引

# 查看索引状态 / 待同步文件
codegraph status

# 卸载所有 agent 集成
codegraph uninstall

# 卸载单个 agent（如只去掉 Claude Code）
codegraph uninstall --target claude-code
```

> `codegraph init` 只创建 `.codegraph/` 目录；加 `-i` 同时构建索引。无 `-i` 时，之后单独跑 `codegraph index`。

---

## 📊 Benchmark 数据（2026-06-02，Opus 4.8）
---
emoji: 📊
link: https://colbymchenry.github.io/codegraph/
desc: 7 个真实开源仓库、Median of 4 runs，与裸 Claude Code（无 CodeGraph）对比。
---

| 代码库 | 语言/规模 | 费用 | Token | 时间 | 工具调用 |
|---|---|---|---|---|---|
| **VS Code** | TypeScript · ~10k 文件 | **18% ↓** | **64% ↓** | **11% ↓** | **81% ↓** |
| **Excalidraw** | TypeScript · ~640 文件 | 持平 | **25% ↓** | **27% ↓** | **40% ↓** |
| **Django** | Python · ~3k 文件 | **8% ↓** | **60% ↓** | **13% ↓** | **77% ↓** |
| **Tokio** | Rust · ~790 文件 | 持平 | **38% ↓** | **18% ↓** | **57% ↓** |
| **OkHttp** | Java · ~645 文件 | **25% ↓** | **54% ↓** | **31% ↓** | **50% ↓** |
| **Gin** | Go · ~110 文件 | **19% ↓** | **23% ↓** | **24% ↓** | **44% ↓** |
| **Alamofire** | Swift · ~110 文件 | **40% ↓** | **64% ↓** | **33% ↓** | **58% ↓** |

> 平均：**16% 更便宜 · 47% 更少 token · 22% 更快 · 58% 更少工具调用**。无 CodeGraph 时 agent 把预算花在文件发现（grep/find/Read）上；有 CodeGraph 通常 **0 次文件读取** 即可回答架构问题。

---

## 🧰 MCP 工具集（核心工具）
---
emoji: 🧰
link: https://colbymchenry.github.io/codegraph/guides/mcp
desc: 作为 MCP server 运行时，CodeGraph 暴露一组"代码关系查询"工具，替代探索型 grep/read。
---

| 工具 | 用途 | 典型问题 |
|---|---|---|
| `codegraph_explore` | 批量返回相关符号源码（主力工具）| "这组模块是怎么协作的？" |
| `codegraph_trace` | 追调用路径 | "A 怎么到 B？" |
| `codegraph_callers` | 查谁调用它 | "谁在用这个函数？" |
| `codegraph_callees` | 查它调用谁 | "这个入口依赖哪些内部调用？" |
| `codegraph_impact` | 评估改动影响面 | "改这里会波及哪些符号？" |
| `codegraph_search` | 全局搜符号名 | "`UserService` 在哪？" |
| `codegraph_context` | 组合式构建上下文 | "这个功能链路怎么走？" |
| `codegraph_files` | 列索引内文件结构 | "索引进来了哪些目录？" |
| `codegraph_status` | 索引健康度 / 待同步文件 | "图谱是不是最新？" |

### 自动同步机制（不需要手动 sync）

- **文件 watcher**（FSEvents / inotify / ReadDirectoryChangesW）：编辑后自动触发重建索引，默认 2000ms 防抖
- **暂挂文件 Banner**：MCP 响应会前置于 `⚠️` 警告，提醒 agent 直接 `Read` 待同步文件
- **连接时 catch-up**：MCP 重连时自动做 `(size, mtime) + hash` 对账，吸收离线期间的所有编辑

---

## 🌐 支持的 Agent 与语言
---
emoji: 🌐
link: https://colbymchenry.github.io/codegraph/
desc: 8 个编码 agent + 20+ 编程语言，框架感知路由覆盖 14 种 Web 框架。
---

### Agent 支持

| Agent | 状态 | 说明 |
|---|---|---|
| Claude Code | ✅ | MCP server auto-config |
| Cursor | ✅ | MCP server auto-config |
| Codex CLI | ✅ | MCP server auto-config |
| opencode | ✅ | MCP server auto-config |
| **Hermes Agent** | ✅ | 新增支持 |
| Gemini CLI | ✅ | MCP server auto-config |
| Antigravity IDE | ✅ | MCP server auto-config |
| Kiro | ✅ | MCP server auto-config |

### 支持语言（20+）

TypeScript · JavaScript · Python · Go · Rust · Java · C# · PHP · Ruby · C · C++ · Objective-C · Swift · Kotlin · Dart · Lua · Luau · Svelte · Liquid · Pascal/Delphi

### 框架感知路由（14 种）

Django · Flask · FastAPI · Express · NestJS · Laravel · Drupal · Rails · Spring · Gin/chi/gorilla/mux · Axum/actix/Rocket · ASP.NET · Vapor · React Router/SvelteKit

---

## 🔧 常用命令参考
---
emoji: 🔧
link: https://colbymchenry.github.io/codegraph/guides
desc: CLI 核心命令速查，包含 MCP server 启动、索引管理、状态监控。
---

### MCP Server

```bash
codegraph serve --mcp           # 启动 MCP server（agent 连接用）
```

### 索引管理

```bash
codegraph init -i                # 初始化 + 构建索引
codegraph index                   # 单独构建索引
codegraph sync                   # 手动触发同步（通常不需要）
codegraph status                 # 查看索引状态 + 待同步文件
codegraph uninit                 # 移除项目 .codegraph/（保留 agent 集成）
```

### 环境变量

| 变量 | 说明 | 默认值 |
|---|---|---|
| `CODEGRAPH_WATCH_DEBOUNCE_MS` | 文件变更防抖延迟（ms）| `2000` |
| `CODEGRAPH_NO_DAEMON` | 禁用 watcher daemon | `0` |

### 验证集成

```bash
# MCP server 连上后可用
codegraph_status    # MCP 内置工具，检查索引健康
```

---

## ⚠️ 使用注意事项
---
emoji: ⚠️
link: https://colbymchenry.github.io/codegraph/guides
desc: CodeGraph 只在"直接提问"时有效，不要让 agent 把探索任务委托给文件扫描子 agent。
---

### 有效提问 vs 无效提问

| 有效（CodeGraph 强） | 无效（CodeGraph 弱） |
|---|---|
| "这个函数调用了哪些内部模块？" | "找出项目中所有包含 `auth` 的文件" |
| "`UserService` 的所有调用方" | "探索这个代码库的结构" |
| "`handleRequest` 的完整调用链" | "搜索所有 TODO 注释" |

**核心原则：** CodeGraph 回答"关于已索引代码的结构性问题"，不回答"需要遍历文件系统的探索性问题"。需要直接提问，不要拐弯抹角。

### 最佳配合场景

- 大型多文件代码库（VS Code 级别）
- 架构问题（调用链、影响面、路由绑定）
- 修改前评估影响范围
- 跨语言理解（Swift ↔ ObjC、React Native ↔ Native）

---

## 📚 参考资源
---
emoji: 📚
link: https://colbymchenry.github.io/codegraph/
desc: 官方文档、GitHub 仓库、Releases、npm 包。
---

| 资源 | 链接 |
|---|---|
| 官方文档 & 网站 | https://colbymchenry.github.io/codegraph/ |
| GitHub 仓库 | https://github.com/colbymchenry/codegraph |
| 最新 Releases | https://github.com/colbymchenry/codegraph/releases/latest |
| npm 包 | https://www.npmjs.com/package/@colbymchenry/codegraph |