---
title: Understand Anything Cookbook
lang: bash
version: "1.1.1"
date: 2026-03-23
github: Lum1104/Understand-Anything
colWidth: 510px
---

# Understand Anything Cookbook

## 快速定位
---
lang: bash
emoji: 🧠
link: https://github.com/Lum1104/Understand-Anything
desc: 可以把 Understand Anything 理解成“给代码库挂一层可探索知识图谱的分析插件”。它先用多代理流水线扫项目，再把文件、函数、类、依赖关系整理成图，并配一个可视化 dashboard 继续追问和排查。
---

- 适合场景：新人入场、架构梳理、模块追踪、变更影响分析、给 AI 编码工具补上下文
- 最短路径：`安装插件 -> /understand -> /understand-dashboard -> /understand-chat`
- 核心产物：`.understand-anything/knowledge-graph.json`
- 最新核对版本：`1.1.1`
- 技术栈：`TypeScript + pnpm workspace + React 18 + Vite + TailwindCSS v4 + React Flow`

```bash
# Claude Code 安装
/plugin marketplace add Lum1104/Understand-Anything
/plugin install understand-anything

# 跑一次完整分析
/understand

# 打开图谱面板继续探索
/understand-dashboard
/understand-chat How does authentication work?
```

## 仓库骨架 / 模块分工
---
lang: bash
emoji: 🗂️
link: https://raw.githubusercontent.com/Lum1104/Understand-Anything/main/CLAUDE.md
desc: 这个仓库不是单包工具，而是“插件壳 + 分析引擎 + dashboard + skills + agents”的组合。理解目录分工后，你会更容易知道该改哪一层。
---

```text
understand-anything-plugin/
  agents/      专职分析代理
  skills/      /understand、/understand-chat 等技能定义
  src/         skill 相关 TypeScript 逻辑
  packages/
    core/      图谱分析引擎、schema、search、tree-sitter、tour
    dashboard/ React 图谱面板

.claude-plugin/   Claude Code 插件清单
.codex/           Codex 安装说明
.opencode/        OpenCode 插件接入与安装说明
```

- `project-scanner`：发现文件、语言、框架
- `file-analyzer`：抽函数、类、导入关系并产出节点/边
- `architecture-analyzer`：识别分层
- `tour-builder`：生成 guided tours
- `graph-reviewer`：检查图谱完整性和引用关系

## 起手工作流
---
lang: bash
emoji: 🚀
link: https://raw.githubusercontent.com/Lum1104/Understand-Anything/main/README.md
desc: 把它当成“先建索引，再带着索引去问”的两阶段工具。第一段是生成知识图谱，第二段才是可视化浏览和问题追踪。
---

### 1. 安装插件
```bash
/plugin marketplace add Lum1104/Understand-Anything
/plugin install understand-anything
```

### 2. 分析代码库
```bash
/understand
```

### 3. 打开 dashboard
```bash
/understand-dashboard
```

### 4. 带着问题继续深挖
```bash
/understand-chat How does the payment flow work?
/understand-explain src/auth/login.ts
/understand-diff
/understand-onboard
```

- `/understand`：主入口，跑多代理分析，并在完成后自动衔接 dashboard
- `/understand-dashboard`：看全局图谱，适合先找层次、节点和关系
- `/understand-chat`：问“某条业务链路怎么走”
- `/understand-explain`：盯某个文件或函数做定点解释
- `/understand-diff`：看当前改动会波及哪些区域
- `/understand-onboard`：给新人生成带路式 onboarding

## 高频 Recipes
---
lang: bash
emoji: 🧪
link: https://github.com/Lum1104/Understand-Anything#-quick-start
desc: 下面这些组合更贴近真实工作，不要把命令拆成单点去背。像前端联调一样，记住“问题类型 -> 对应套路”会更快。
---

### 刚接手一个陌生仓库
```bash
/understand
/understand-dashboard
/understand-onboard
```

- 先生成图谱，再用 dashboard 看大结构，最后让 onboarding 帮你按依赖顺序带路

### 想追一条业务链路
```bash
/understand-chat How does authentication work?
/understand-explain src/auth/login.ts
```

- 先问全局问题，再把结果收缩到关键文件或函数

### 提交前做影响面预判
```bash
/understand-diff
```

- 适合 code review 前或大改之后，先看 ripple effects 再决定是否拆提交

### 只想快速确认图谱文件是否生成
```bash
ls .understand-anything
cat .understand-anything/knowledge-graph.json
```

- 图谱文件落到被分析项目的 `.understand-anything/` 目录，不在插件仓库自身

## 多平台接入
---
lang: bash
emoji: 🔌
link: https://github.com/Lum1104/Understand-Anything#-multi-platform-installation
desc: 这个项目不是只给 Claude Code 用。它更像“同一套 skills/agents，换不同宿主接入”。理解安装方式差异，比死记每个平台步骤更重要。
---

### Claude Code
```bash
/plugin marketplace add Lum1104/Understand-Anything
/plugin install understand-anything
```

### Codex
```powershell
git clone https://github.com/Lum1104/Understand-Anything.git ~/.codex/understand-anything
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
cmd /c mklink /J "$env:USERPROFILE\.agents\skills\understand-anything" "$env:USERPROFILE\.codex\understand-anything\understand-anything-plugin\skills"
```

### OpenCode
```json
{
  "plugin": [
    "understand-anything@git+https://github.com/Lum1104/Understand-Anything.git"
  ]
}
```

### OpenCode 固定版本
```json
{
  "plugin": [
    "understand-anything@git+https://github.com/Lum1104/Understand-Anything.git#v1.1.1"
  ]
}
```

- Cursor：仓库被 clone 后通过 `.cursor-plugin/plugin.json` 自动发现
- OpenClaw / Antigravity：按各自 `INSTALL.md` 走 AI-driven install

## Dashboard 与结果文件
---
lang: bash
emoji: 📊
link: https://github.com/Lum1104/Understand-Anything#-features
desc: dashboard 是这个项目真正把“静态分析结果”变成“可操作上下文”的地方。可以把它类比成 React DevTools + 架构图 + LLM 解释层的叠加体。
---

- 图谱节点：文件、函数、类、依赖关系
- 视觉分层：按 API、Service、Data、UI、Utility 这类架构层分组与着色
- 搜索方式：模糊搜索 + 语义搜索
- 解释能力：节点旁带 plain-English summary
- Persona UI：会按读者身份调整展示粒度

```bash
# 本地开发 dashboard
pnpm dev:dashboard

# 构建 dashboard
pnpm --filter @understand-anything/dashboard build
```

## 开发与扩展
---
lang: bash
emoji: 🛠️
link: https://raw.githubusercontent.com/Lum1104/Understand-Anything/main/CLAUDE.md
desc: 如果你不是“用插件”，而是“改插件”，那主线就变成先装依赖、再 build、再单测、最后验证 dashboard。这个节奏和前端 monorepo 开发很像。
---

```bash
pnpm install
pnpm --filter @understand-anything/core build
pnpm --filter @understand-anything/core test
pnpm --filter @understand-anything/skill build
pnpm --filter @understand-anything/skill test
pnpm --filter @understand-anything/dashboard build
pnpm lint
```

- Node 要求：`>= 22`
- 包管理器：`pnpm >= 10`
- 模块格式：`ESM`
- 测试：`Vitest`
- 版本同步点：`understand-anything-plugin/package.json` 和 `.claude-plugin/marketplace.json`

## 风险点 / 排障速记
---
lang: bash
emoji: ⚠️
link: https://raw.githubusercontent.com/Lum1104/Understand-Anything/main/.opencode/INSTALL.md
desc: 真正容易卡住的点，通常不是“命令不会敲”，而是“技能没被宿主发现”或“图谱没有写到目标项目”。这部分就是收尾检查单。
---

- OpenCode 看不到 skills：
  - 检查 `opencode.json` 里的 plugin 行是否正确
  - 重启后确认 `~/.cache/opencode/node_modules/understand-anything` 是否存在
  - 用 skill 列表确认 `understand`、`understand-chat` 等是否已注册
- Codex 没发现技能：
  - 检查 `~/.agents/skills/understand-anything` 是否真的指到 `understand-anything-plugin/skills`
- 图谱没生成：
  - 确认是在“目标项目”里运行 `/understand`
  - 检查 `.understand-anything/knowledge-graph.json` 是否生成
- 版本升级别漏：
  - 同步更新 `understand-anything-plugin/package.json`
  - 同步更新 `.claude-plugin/marketplace.json`

```bash
# Codex 验证 skills 链接
ls -la ~/.agents/skills/understand-anything

# OpenCode 验证插件是否安装
ls ~/.cache/opencode/node_modules/understand-anything
```
