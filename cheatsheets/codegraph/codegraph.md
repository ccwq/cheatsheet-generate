---
title: CodeGraph 速查表
lang: bash
version: "0.9.6"
date: 2026-05-27
github: colbymchenry/codegraph
colWidth: 460px
---

## 🚀 一句话定位
---
emoji: 🚀
link: https://github.com/colbymchenry/codegraph
desc: CodeGraph 是面向 Claude Code、Codex CLI、Cursor、Hermes Agent 等编码代理的本地代码知识图谱，用预索引替代大范围 grep/read。
---

**核心价值：** 把“先扫文件再理解代码”改成“直接查图谱再追踪调用链”，在大仓库里通常更省 token、更少工具调用，也更快。

---

## ⚡ 安装与初始化
---
emoji: ⚡
link: https://colbymchenry.github.io/codegraph/
desc: 支持自包含安装包和 npm，两种方式都能在本地跑 MCP server。
---

### 安装

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh

# Windows PowerShell
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex

# 已有 Node 环境时也可直接运行
npx @colbymchenry/codegraph
npm i -g @colbymchenry/codegraph
```

### 项目初始化

```bash
cd your-project
codegraph init -i

# 查看索引状态
codegraph status

# 卸载 agent 侧集成
codegraph uninstall
```

### 适合的使用时机

- 仓库很大，普通 `rg + Read` 会拉很多无关文件
- 你要查调用链、影响范围、跨文件关系
- 你在 Codex CLI / Claude Code 里希望 agent 少走“探索型”工具调用

---

## 🧰 MCP 工具集
---
emoji: 🧰
link: https://colbymchenry.github.io/codegraph/
desc: 作为 MCP server 运行时，CodeGraph 暴露一组偏“代码关系查询”的工具，而不是通用 shell 工具。
---

| 工具 | 用途 | 典型问题 |
|---|---|---|
| `codegraph_context` | 组合式构建上下文 | “这个功能链路怎么走？” |
| `codegraph_trace` | 追调用路径 | “A 怎么到 B？” |
| `codegraph_explore` | 批量返回相关符号源码 | “这一组模块是怎么协作的？” |
| `codegraph_search` | 全局搜符号 | “`UserService` 在哪？” |
| `codegraph_callers` | 查谁调用它 | “谁在用这个函数？” |
| `codegraph_callees` | 查它调用谁 | “这个入口依赖哪些内部调用？” |
| `codegraph_impact` | 评估改动影响面 | “改这里会波及哪些符号？” |
| `codegraph_files` | 列索引内文件结构 | “索引进来了哪些目录/文件？” |
| `codegraph_status` | 看索引是否健康/有无 pending sync | “图谱是不是最新？” |
| `codegraph_node` | 取单个符号细节 | “给我这个节点的定义和源码” |

---

## 🧠 关键能力
---
emoji: 🧠
link: https://github.com/colbymchenry/codegraph
desc: 重点不是“能不能搜到文件”，而是“能不能把符号关系和跨语言桥接连起来”。
---

### 本地知识图谱

- 用 `tree-sitter` 做语法提取
- 用 SQLite + FTS5 做本地存储和搜索
- 数据落在项目本地，不依赖外部 API Key

### 自动增量同步

- MCP server 启动后会 watch 项目文件变化
- 默认做 debounce 后增量同步
- `codegraph status` 可看到 pending sync 和索引统计

### 跨语言 / 框架感知

| 能力 | 说明 |
|---|---|
| 路由识别 | Django、FastAPI、Express、NestJS、Rails、Spring、Laravel、ASP.NET 等 |
| 移动桥接 | Swift ↔ Objective-C、React Native bridge、TurboModules、Expo Modules |
| 组件/前端支持 | TypeScript、JavaScript、Vue、Svelte |
| 系统语言 | Go、Rust、Java、C#、C/C++、PHP、Ruby、Lua / Luau、Pascal |

---

## 🗂️ 支持对象
---
emoji: 🗂️
link: https://github.com/colbymchenry/codegraph
desc: 这个项目的“兼容面”分两层看：支持哪些 agent，以及支持哪些语言/项目类型。
---

### 已支持的 AI 编码代理

- Claude Code
- Cursor
- Codex CLI
- opencode
- Hermes Agent
- Gemini CLI
- Antigravity IDE
- Kiro

### 支持语言速查

| 类别 | 语言 |
|---|---|
| Web | TypeScript, JavaScript, Vue, Svelte |
| Backend | Python, Go, Rust, PHP, Ruby, Java, C# |
| Native | Swift, Objective-C, Kotlin, C, C++ |
| 其他 | Dart, Scala, Liquid, Lua, Luau, Pascal/Delphi |

---

## 📊 Benchmark 结论
---
emoji: 📊
link: https://github.com/colbymchenry/codegraph/releases/tag/v0.9.6
desc: 官方 README 给了 7 个真实开源仓库的对比结果，强调的是“有无 CodeGraph”两种 agent 工作方式差异。
---

### 官方摘要

- 平均约 `35%` 更便宜
- 平均约 `57%` 更少 token
- 平均约 `46%` 更快
- 平均约 `71%` 更少工具调用

### 样本仓库

| 仓库 | 语言 | 特点 |
|---|---|---|
| VS Code | TypeScript | 大型前端/桌面代码库 |
| Excalidraw | TypeScript | 前端交互图形应用 |
| Django | Python | 经典后端框架 |
| Tokio | Rust | Rust runtime |
| OkHttp | Java | 移动/网络库 |
| Gin | Go | Web 框架 |
| Alamofire | Swift | iOS 网络库 |

> 要点不是“每个仓库都提升同样幅度”，而是仓库越大、探索成本越高，图谱优势越明显。

---

## 🧪 常用 CLI
---
emoji: 🧪
link: https://colbymchenry.github.io/codegraph/
desc: 除了 MCP 用法，CLI 本身也能做索引、搜索、影响分析和 CI 里的 affected tests 判断。
---

```bash
codegraph init [path]
codegraph index [path]
codegraph sync [path]
codegraph status [path]
codegraph query <search>
codegraph files [path]
codegraph context <task>
codegraph callers <symbol>
codegraph callees <symbol>
codegraph impact <symbol>
codegraph affected [files...]
codegraph serve --mcp
```

### `affected` 的典型 CI 用法

```bash
git diff --name-only HEAD | codegraph affected --stdin --quiet
```

这个命令更像“由导入链反推受影响测试文件”，适合接到 `vitest`、`pytest` 或自定义测试调度器里。

---

## ⚠️ 常见坑
---
emoji: ⚠️
link: https://colbymchenry.github.io/codegraph/guides/indexing/
desc: 真正常见的问题不是安装失败，而是索引目录、文件系统和 agent 工作方式没有对齐。
---

- 项目没初始化：先在仓库根目录执行 `codegraph init -i`
- 索引不新：看 `codegraph status`，必要时手动 `codegraph sync`
- 数据库锁问题：旧版本或非本地文件系统更容易遇到，优先升级并放到本地盘
- 大目录干扰：默认会排除 `node_modules`、`dist`、`.venv` 等，若你要强制纳入，需调整 `.gitignore` 策略
- 让 agent 继续用大量 `Read/Grep` 探索：这会把 CodeGraph 的收益吃掉，适合直接用 `context/trace/impact` 回答的问题不要回退成纯文件扫描

---

## 🧾 版本变更
---
link: https://github.com/colbymchenry/codegraph/releases/tag/v0.9.6
desc: 按官方 release 摘取对速查用户最重要的变化，不抄整份 changelog。
---

### v0.9.6

- 补强 Gemini CLI、Antigravity IDE、Kiro 等 agent 安装目标，agent 兼容面更完整
- 修复 Hermes Agent 配置写回、watch sync 外键失败、C++ caller 解析等高频问题
- 保持“自包含 runtime + 本地 SQLite 图谱”的交付方式，降低环境差异带来的故障

---

## 🔗 关键资源

- 官方文档：https://colbymchenry.github.io/codegraph/
- GitHub：https://github.com/colbymchenry/codegraph
- Releases：https://github.com/colbymchenry/codegraph/releases
- npm：https://www.npmjs.com/package/@colbymchenry/codegraph
