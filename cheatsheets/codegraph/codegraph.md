---
title: CodeGraph — AI Agent 代码图谱
lang: zh-CN
version: "1.0.0"
date: "2026-05-26"
github: colbymchenry/codegraph
colWidth: 420px
desc: CodeGraph 是 AI Agent 的预索引代码知识图谱，用 tree-sitter 解析 + SQLite 存储，100% 本地运行，无需 API Key。支持 20+ 编程语言。
tags:
  - codegraph
  - mcp
  - ai-agent
  - typescript
  - rust
  - tree-sitter
  - sqlite
---

# CodeGraph — AI Agent 代码图谱

## 概述

### 什么是 CodeGraph

CodeGraph 是一个**预索引代码知识图谱**，专为 AI 编程代理（Claude Code、Cursor、Codex、OpenCode、Hermes Agent）设计。

| 核心特性 | 说明 |
|---|---|
| 技术栈 | tree-sitter 解析 + SQLite 存储 |
| 数据位置 | 100% 本地，数据不离开机器 |
| API 依赖 | 无需任何外部 API Key |
| 索引方式 | 预索引，查询极快 |

### 核心价值

| 指标 | 提升幅度 |
|---|---|
| 💰 成本节省 | ~35% 更便宜 |
| 📊 Token 减少 | ~57% 更少 token |
| 🔧 工具调用减少 | ~71% 更少工具调用 |
| ⚡ 速度提升 | ~46% 更快 |

> 数据来源：真实代码库 benchmarks（见下方 Benchmark 数据）

### 支持的 AI Agent

| Agent | 支持情况 |
|---|---|
| Claude Code | ✅ 官方支持 |
| Cursor | ✅ 官方支持 |
| Codex CLI | ✅ 官方支持 |
| opencode | ✅ 官方支持 |
| Hermes Agent | ✅ 官方支持 |

---

## 安装与初始化

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex
```

### npm 安装

```bash
# 使用 npx 运行
npx @colbymchenry/codegraph

# 全局安装
npm i -g @colbymchenry/codegraph
```

### 项目初始化

```bash
# 初始化项目
codegraph init -i

# 卸载
codegraph uninstall
```

---

## MCP 工具集

CodeGraph 提供 9 个核心 MCP 工具：

| 工具 | 作用 | 示例用法 |
|---|---|---|
| `codegraph_context` | 返回入口点 + 相关符号 + 代码片段 | 构建初始上下文 |
| `codegraph_search` | 全文本搜索，基于 FTS5 | 快速定位代码 |
| `codegraph_explore` | 按目标探索代码结构 | 理解模块关系 |
| `codegraph_callers` | 查找调用某函数的所有位置 | 追踪引用链 |
| `codegraph_callees` | 查找某函数调用的所有目标 | 追踪依赖链 |
| `codegraph_impact` | 全局影响范围分析 | 修改前评估影响 |
| `codegraph_trace` | 端到端调用链追踪 | 理解执行路径 |
| `codegraph_files` | 列出项目文件 | 文件浏览 |
| `codegraph_status` | 检查索引状态 | 确认同步状态 |

---

## 支持语言

CodeGraph 支持 **20+ 编程语言**：

| 类别 | 语言 |
|---|---|
| Web 前端 | TypeScript, JavaScript, Svelte |
| 后端 / 脚本 | Python, Go, Rust, PHP, Ruby |
| 移动开发 | Swift, Kotlin, Dart, Objective-C |
| 桌面 / 系统 | Java, C#, C, C++ |
| 游戏脚本 | Lua, Luau |
| 其他 | Liquid, Pascal/Delphi |

---

## 跨语言桥接

CodeGraph 智能处理混合语言项目：

| 场景 | 支持情况 |
|---|---|
| Swift ↔ Objective-C | 自动桥接 |
| React Native Legacy Bridge | ✅ 完整支持 |
| React Native TurboModules | ✅ 完整支持 |
| React Native Fabric/Paper View Components | ✅ 完整支持 |
| Expo Modules | ✅ 完整支持 |
| RN Native → JS Event 通道追踪 | ✅ 完整支持 |

---

## 框架感知路由

CodeGraph 内置路由检测，支持以下框架：

| 框架 | 检测语法 |
|---|---|
| Django | `path()`, `re_path()`, `url()` in urls.py |
| Flask | `@app.route()`, blueprint routes |
| FastAPI | `@app.get()`, `@router.post()` |
| Express | `app.get()`, `router.post()` |
| NestJS | `@Controller`, `@Get`, `@Resolver` |
| Rails | `get '/x', to: 'users#index'` |
| Spring | `@GetMapping`, `@PostMapping` |
| Gin | `r.GET()`, `router.HandleFunc()` |
| Laravel | `Route::get()`, `Route::resource()` |
| ASP.NET | `[HttpGet]`, `[HttpPost]` attributes |

---

## Benchmark 数据

基于真实代码库的测试结果：

| 代码库 | 语言 | 成本节省 | Token 减少 | 速度提升 | 工具调用减少 |
|---|---|---|---|---|---|
| VS Code | TypeScript | 26% | 78% | 52% | 85% |
| Excalidraw | TypeScript | 52% | 90% | 73% | 96% |
| Tokio | Rust | 82% | 86% | 71% | 92% |
| Alamofire | Swift | 47% | 64% | 48% | 83% |
| Django | Python | 12% | 36% | 19% | 53% |

---

## GitHub 信息

| 项目 | 值 |
|---|---|
| ⭐ Stars | 27.1k |
| 🍴 Forks | 1.5k |
| 仓库 | github.com/colbymchenry/codegraph |
| 文档 | colbymchenry.github.io/codegraph/ |
| 最近更新 | 6 小时前（活跃维护） |