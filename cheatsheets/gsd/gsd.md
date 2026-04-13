---
title: GSD
lang: bash
version: "1.34.0"
date: "2026-04-09"
github: gsd-build/get-shit-done
colWidth: 520px
---

# GSD (Get Shit Done)

## 一眼入口
---
emoji: 🚀
link: https://github.com/gsd-build/get-shit-done
desc: 面向 Claude Code 的元提示和上下文工程框架，解决大模型上下文腐败问题
---

**一句话定位**：描述你想构建的东西 → GSD 通过结构化工作流帮你完成，保持上下文始终新鲜。

**核心哲学**：说清楚你要什么，GSD 帮你完成。背后是 context engineering、XML 格式化、子代理编排，但对你只是一个命令接着一个命令。

> "If you know clearly what you want, this WILL build it for you. No bs."

## 安装
---
emoji: 📦
link: https://github.com/gsd-build/get-shit-done#getting-started
desc: GSD 支持多种 AI 运行时，一键安装
---

安装：
```bash
npx get-shit-done-cc --claude --global   # Claude Code
npx get-shit-done-cc --opencode --global # OpenCode
npx get-shit-done-cc --gemini --global   # Gemini CLI
npx get-shit-done-cc --codex --global    # Codex
npx get-shit-done-cc --copilot --global  # GitHub Copilot
npx get-shit-done-cc --cursor --global   # Cursor CLI
npx get-shit-done-cc --windsurf --global # Windsurf
npx get-shit-done-cc --antigravity --global # Antigravity
npx get-shit-done-cc --all --global      # 全部运行时
```

卸载：
```bash
npx get-shit-done-cc --<runtime> --global --uninstall
```

验证安装：`/gsd:help` 或 `/gsd-help`（取决于运行时）

## 最小工作流
---
emoji: ⚡
link: https://github.com/gsd-build/get-shit-done#how-it-works
desc: 一个里程碑的完整生命周期
---

```
/gsd:map-codebase                # 旧项目先分析, 新项目跳过
/gsd:new-project                 # 初始化项目
/gsd:create-roadmap              # 生成 ROADMAP.md 和 STATE.md
/gsd:discuss-phase 1             # 捕获实施决策
/gsd:plan-phase 1                # 研究 + 规划 + 验证
/gsd:execute-phase 1             # 波次并行执行
/gsd:verify-work 1               # 人工验收测试
/gsd:ship 1                      # 从验证工作创建 PR
/gsd:complete-milestone          # 归档里程碑，标记发布
/gsd:new-milestone               # 开始下一版本
```

**快速模式**（临时任务，不需要完整规划）：

```
/gsd:quick "添加深色模式切换"     # 立即执行
/gsd:quick --full "修复登录 bug"  # 含讨论 + 研究 + 验证
```

## 全新项目初始化
---
emoji: 🚀
link: https://github.com/gsd-build/get-shit-done#1-initialize-project
desc: 描述你想构建的东西，GSD 通过提问理解需求
---

- `/gsd:new-project [--auto]` : 启动新建项目流程

系统依次执行：提问 → 研究调研 → 需求定义 → 路线图

```bash
# 交互模式
/gsd:new-project
# 描述：我想做一个天气应用，用 Vue + Vite

# 自动模式（跳过确认）
/gsd:new-project --auto
```

创建的上下文文件：

| 文件 | 用途 |
|------|------|
| PROJECT.md | 项目愿景，始终加载 |
| REQUIREMENTS.md | 作用域 v1/v2 需求，可追踪阶段 |
| ROADMAP.md | 前进方向，已完成项 |
| STATE.md | 决策、阻塞器、跨会话记忆 |
| .planning/research/ | 生态知识（栈、功能、架构、陷阱） |

## 项目文件结构
---
emoji: 📁
link: https://github.com/gsd-build/get-shit-done#file-structure
desc: GSD 项目的文件组织方式
---

### 根目录文件（项目级配置与状态）

| 文件 | 用途 |
|------|------|
| `PROJECT.md` | 项目愿景，始终加载 |
| `REQUIREMENTS.md` | 功能需求清单，可追踪阶段 |
| `ROADMAP.md` | 项目路线图，定义所有阶段 |
| `STATE.md` | 当前项目执行状态的快照 |
| `config.json` | GSD 配置文件，控制工作流行为 |

### phases/ 阶段式工作流目录

每个子目录对应一个功能阶段，阶段编号格式为 `XX-`（如 `01-`, `02-`, `03-`）：

| 文件 | 用途 |
|------|------|
| `XX-CONTEXT.md` | 阶段上下文信息，包含代码库分析、依赖关系等 |
| `XX-DISCUSSION-LOG.md` | 讨论模式记录，AI 与用户的对话历史 |
| `XX-PLAN.md` | 执行计划，定义具体任务和步骤 |
| `XX-SUMMARY.md` | 执行总结，记录完成的工作和改动 |
| `XX-UAT.md` | 用户验收测试记录 |
| `XX-RESEARCH.md` | 研究文档，用于技术调研 |

> 阶段内编号（如 `03-01-PLAN.md`）表示波浪式执行的迭代，一个阶段可能被拆分成多个子任务波次。

### quick/ 快速分支模式任务

临时的、独立的小任务，不需要完整的阶段生命周期：

| 文件 | 用途 |
|------|------|
| `PLAN.md` | 快速任务执行计划 |
| `SUMMARY.md` | 快速任务执行总结 |
| `VERIFICATION.md` | 快速任务验证记录 |

### debug/ 调试会话记录

专门用于修复 bug 的独立工作流，保留问题诊断和解决方案的上下文。

## 代码库分析
---
emoji: 🗺️
link: https://github.com/gsd-build/get-shit-done#brownfield
desc: 让 GSD 理解你的现有代码库，后续提问更精准
---

- `/gsd:map-codebase [area]` : 并行分析现有代码库

分析内容：技术栈、框架、架构、代码规范、潜在问题

```bash
# 先分析代码库，再新建项目
/gsd:map-codebase
/gsd:new-project
```

## Discuss Phase
---
emoji: 💬
link: https://github.com/gsd-build/get-shit-done#2-discuss-phase
desc: 捕获实施决策，为规划提供上下文
---

- `/gsd:discuss-phase [N] [--auto] [--analyze] [--chain]`

分析阶段并识别灰色区域：布局、交互、API 响应格式、错误处理、内容结构等

| 标志 | 说明 |
|------|------|
| `--auto` | 自动确认，批量处理 |
| `--analyze` | 添加权衡分析 |
| `--chain` | 自动链式执行 discuss → plan → execute |

```bash
/gsd:discuss-phase 1
# 选择关注的领域，回答问题

/gsd:discuss-phase 1 --analyze
# 添加 trade-off 分析

/gsd:discuss-phase 1 --chain
# 自动进入规划和执行，无需手动推进
```

输出：`{phase_num}-CONTEXT.md`

## Plan Phase
---
emoji: 📋
link: https://github.com/gsd-build/get-shit-done#3-plan-phase
desc: 研究 + 规划 + 验证
---

- `/gsd:plan-phase [N] [--auto] [--reviews]`

研究如何实现该阶段，创建 2-3 个原子任务计划

| 标志 | 说明 |
|------|------|
| `--auto` | 自动确认 |
| `--reviews` | 加载代码库 review 发现 |
| `--gaps` | 进入 gap-closure 模式，基于 `VERIFICATION.md` 生成修复计划 |

```bash
/gsd:plan-phase 1
# 输出：{phase_num}-RESEARCH.md, {phase_num}-{N}-PLAN.md

/gsd:plan-phase 1 --gaps
# 基于验证缺口生成修复导向的计划
```

补充：

- `/gsd:research-phase [N]`：更偏向阶段前置研究
- `/gsd:plan-fix <plan>`：把验证/验收问题转成修复计划

## Gap Closure
---
emoji: 🧯
link: https://github.com/gsd-build/get-shit-done#phase-management
desc: 针对验证缺口和延后问题做收敛
---

```bash
/gsd:plan-fix <plan>             # 为验收或验证失败项生成修复计划
/gsd:discuss-milestone           # 为下一里程碑收集上下文和约束
/gsd:consider-issues             # 回顾延后事项，拆分可关闭与需保留的问题
```

## Execute Phase
---
emoji: ⚙️
link: https://github.com/gsd-build/get-shit-done#4-execute-phase
desc: 波次并行执行所有计划
---

- `/gsd:execute-phase <N>`
- `/gsd:execute-plan` : 执行已生成计划，和 execute-phase 一起看

按依赖关系分组执行，每个计划在全新上下文中运行

```bash
/gsd:execute-phase 1
# 输出：{phase_num}-{N}-SUMMARY.md, {phase_num}-VERIFICATION.md
```

## Verify Work
---
emoji: ✅
link: https://github.com/gsd-build/get-shit-done#5-verify-work
desc: 人工用户验收测试
---

- `/gsd:verify-work [N]`

系统提取可测试的交付物，逐个引导你验证

```bash
/gsd:verify-work 1
# 输出：{phase_num}-UAT.md，若有问题则创建修复计划
```

## Ship & Milestone
---
emoji: 🚢
link: https://github.com/gsd-build/get-shit-done#6-repeat---ship---complete---next-milestone
desc: 创建 PR、归档里程碑、开始下一版本
---

```bash
/gsd:ship 1 [--draft]          # 从验证工作创建 PR
/gsd:complete-milestone         # 归档里程碑，标记发布
/gsd:new-milestone [name]      # 开始下一版本
/gsd:audit-milestone           # 验证里程碑是否达成
/gsd:milestone-summary [version] # 生成项目总结，用于团队 onboarding
```

## Phase Management
---
emoji: 🔧
link: https://github.com/gsd-build/get-shit-done#phase-management
desc: 管理里程碑阶段的增删查改
---

| 命令 | 说明 |
|------|------|
| `/gsd:insert-phase [N]` | 在阶段 N 后插入紧急工作 |
| `/gsd:add-phase` | 追加新阶段到路线图 |
| `/gsd:remove-phase [N]` | 移除未来阶段并重新编号 |
| `/gsd:list-phase-assumptions [N]` | 查看规划前的预期方案 |
| `/gsd:plan-milestone-gaps` | 创建阶段以填补审计缺口 |

```bash
/gsd:insert-phase 2          # 在阶段 2 后插入紧急工作
/gsd:remove-phase 3          # 移除阶段 3，重新编号后续阶段
/gsd:plan-milestone-gaps     # 审计并填补里程碑缺口
```

## 快速模式
---
emoji: ⚡
link: https://github.com/gsd-build/get-shit-done#quick-mode
desc: 快速执行临时任务，不需要完整规划
---

- `/gsd:quick [text] [--full] [--validate] [--discuss] [--research]`

Quick mode 给你 GSD 保障（原子提交、状态追踪），但有更快路径。

| 标志组合 | 效果 |
|----------|------|
| 无标志 | 仅执行，跳过研究和验证 |
| `--discuss` | 先收集上下文再执行 |
| `--research` | 执行前先研究实现方案 |
| `--validate` | 执行 + 计划检查 + 验证 |
| `--full` | 完整 pipeline：讨论 + 研究 + 检查 + 验证 |
| `--discuss --research --validate` | 所有阶段组合 |

```bash
/gsd:quick "添加深色模式切换"       # 最快路径

/gsd:quick "修复登录 bug" --full    # 完整验证

/gsd:quick "重构用户模块" --discuss --research  # 带研究和讨论
```

## Workstreams
---
emoji: 🌊
link: https://github.com/gsd-build/get-shit-done#workstreams
desc: 管理并行里程碑工作流
---

```bash
/gsd:workstreams list                    # 显示所有 workstream
/gsd:workstreams create <name>           # 创建新的 namespaced workstream
/gsd:workstreams switch <name>          # 切换 active workstream
/gsd:workstreams complete <name>         # 完成并合并 workstream
```

## Workspaces
---
emoji: 🏗️
link: https://github.com/gsd-build/get-shit-done#workspaces
desc: 多项目隔离工作空间
---

```bash
/gsd:new-workspace                        # 创建隔离 workspace（含 repo 副本）
/gsd:list-workspaces                      # 显示所有 workspace 及状态
/gsd:remove-workspace <name>              # 移除 workspace 并清理 worktrees
```

## UI 设计
---
emoji: 🎨
link: https://github.com/gsd-build/get-shit-done#ui-design
desc: 前端阶段的 UI 设计合同与审计
---

```bash
/gsd:ui-phase [N]                         # 为前端阶段生成 UI-SPEC.md
/gsd:ui-review [N]                       # 回顾性 6-pillar 视觉审计
```

## 代码质量
---
emoji: 🔍
link: https://github.com/gsd-build/get-shit-done#code-quality
desc: 跨 AI review、安全验证、PR 分支
---

```bash
/gsd:review                               # 跨 AI peer review 当前阶段或分支
/gsd:secure-phase [N]                     # 基于威胁模型的安全验证
/gsd:pr-branch                            # 创建过滤 .planning/ 提交的 PR 分支
/gsd:audit-uat                            # 审计缺少 UAT 的阶段
/gsd:docs-update                          # 经验证的文件生成（doc-writer + doc-verifier）
```

## Backlog & Threads
---
emoji: 📌
link: https://github.com/gsd-build/get-shit-done#backlog-and-threads
desc: 未来想法、待办事项、跨会话持久化上下文
---

```bash
/gsd:plant-seed <idea>                    # 捕获前瞻性想法，带触发条件
/gsd:add-backlog <desc>                   # 添加到 backlog 停车场（999.x 编号）
/gsd:review-backlog                       # 审查并提升 backlog 项到 active milestone
/gsd:thread [name]                        # 持久化上下文线程，跨会话轻量级知识
```

## 工具命令
---
emoji: 🧰
link: https://github.com/gsd-build/get-shit-done#commands
desc: 官网 Commands 段中偏通用的辅助命令
---

```bash
/gsd:add-todo [desc]                     # 捕获待办
/gsd:check-todos                         # 列出待处理 todos
/gsd:do <text>                           # 自动路由到合适的 GSD 命令
/gsd:note <text>                         # 低摩擦记录笔记，可转成 todo
/gsd:profile-user [--questionnaire]      # 基于会话分析生成开发者行为画像
```

## 会话管理
---
emoji: 💾
link: https://github.com/gsd-build/get-shit-done#session
desc: 暂停和恢复开发工作
---

```bash
/gsd:pause-work                          # 创建交接文档以便暂停
/gsd:resume-work                         # 恢复上次会话
/gsd:session-report                      # 生成会话总结，含完成的工作和结果
```

## 诊断与统计
---
emoji: 🔎
link: https://github.com/gsd-build/get-shit-done#troubleshooting
desc: 问题诊断和项目统计
---

```bash
/gsd:forensics [desc]                    # 失败工作流的事后调查（诊断 stuck loops、缺失 artifacts、git 异常）
/gsd:health [--repair]                   # 验证 .planning/ 目录完整性
/gsd:stats                               # 显示项目统计：阶段、计划、需求、git 指标
/gsd:debug [desc]                       # 系统性调试，带持久状态
```

## 导航与帮助
---
emoji: 🧭
link: https://github.com/gsd-build/get-shit-done#navigation
desc: 查看当前位置和下一步
---

```bash
/gsd:progress                            # 查看当前位置和下一步
/gsd:next                                # 自动检测状态并运行下一步
/gsd:manager                             # 交互式命令中心，管理多阶段
/gsd:help                                # 显示所有命令和使用指南
/gsd:update                              # 更新 GSD，预览变更日志
/gsd:join-discord                        # 加入 GSD Discord 社区
```

## Model Profiles
---
emoji: 🤖
link: https://github.com/gsd-build/get-shit-done#model-profiles
desc: 控制每个代理使用的 Claude 模型
---

| Profile | Planning | Execution | Verification |
|---------|----------|-----------|--------------|
| quality | Opus | Opus | Sonnet |
| balanced | Opus | Sonnet | Sonnet |
| budget | Sonnet | Sonnet | Haiku |
| inherit | Inherit | Inherit | Inherit |

切换：`/gsd:set-profile <profile>`

## Workflow Agents
---
emoji: 🤝
link: https://github.com/gsd-build/get-shit-done#workflow-agents
desc: 控制工作流中的自动化代理
---

| Agent | 默认 | 作用 |
|-------|------|------|
| workflow.research | true | 每个阶段规划前研究领域 |
| workflow.plan_check | true | 验证计划达成阶段目标 |
| workflow.verifier | true | 确认必须项已交付 |
| workflow.auto_advance | false | 自动链式执行 discuss → plan → execute |
| workflow.discuss_mode | discuss | 讨论模式：discuss（访谈）或 assumptions（代码库优先） |
| workflow.skip_discuss | false | 自主模式下跳过 discuss-phase |
| workflow.use_worktrees | true | 切换执行时的工作树隔离 |

配置：`/gsd:settings`

```bash
/gsd:plan-phase --skip-research
/gsd:plan-phase --skip-verify
```

## 波次执行
---
emoji: 🌊
link: https://github.com/gsd-build/get-shit-done#4-execute-phase
desc: 基于依赖关系的并行执行策略
---

```
WAVE 1 (并行)           WAVE 2 (并行)         WAVE 3
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Plan 01 │ │ Plan 02 │ → Plan 03 │ │ Plan 04 │ → Plan 05 │
│  用户    │ │ 产品    │   订单    │ │购物车   │   结账   │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
    │           │             ↑           ↑             ↑
    └───────────┴─────────────┴───────────┘─────────────┘
                  依赖关系：Plan 03 依赖 Plan 01
```

优势：独立计划并行执行、依赖计划按序等待、每个计划在全新 200k 上下文中运行

## 原子提交
---
emoji: 📦
link: https://github.com/gsd-build/get-shit-done#atomic-git-commits
desc: 每个任务完成后立即提交
---

```bash
abc123f docs(08-02): 完成用户注册计划
def456g feat(08-02): 添加邮箱确认流程
hij789k feat(08-02): 实现密码哈希
lmn012o feat(08-02): 创建注册端点
```

优势：Git bisect 精确定位失败任务、每个任务独立可回滚、为未来会话提供清晰历史

## Git Branching
---
emoji: 🌿
link: https://github.com/gsd-build/get-shit-done#git-branching
desc: 控制 GSD 如何处理分支
---

| Strategy | 说明 |
|----------|------|
| none | 提交到当前分支（默认）|
| phase | 每阶段创建一个分支，阶段完成时合并 |
| milestone | 为整个里程碑创建一个分支，完成时合并 |

```json
{
  "git": {
    "branching_strategy": "phase",
    "phase_branch_template": "gsd/phase-{phase}-{slug}",
    "milestone_branch_template": "gsd/{milestone}-{slug}"
  }
}
```

## 安全设置
---
emoji: 🛡️
link: https://github.com/gsd-build/get-shit-done#security
desc: 保护敏感文件不被读取，内置安全加固
---

GSD v1.27+ 内置纵深安全：

- **路径遍历防护** — 验证所有用户提供的文件路径在项目目录内
- **提示注入检测** — `security.cjs` 模块扫描用户文本中的注入模式
- **PreToolUse 提示守卫** — `gsd-prompt-guard` 扫描写入 `.planning/` 的内容
- **安全 JSON 解析** — 捕获格式错误的 `--fields` 参数

将敏感文件添加到 Claude Code 的 deny 列表：

```json
{
  "permissions": {
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(**/secrets/*)",
      "Read(**/*credential*)",
      "Read(**/*.pem)",
      "Read(**/*.key)"
    ]
  }
}
```

## 推荐使用方式
---
emoji: 🚀
link: https://github.com/gsd-build/get-shit-done#recommended-skip-permissions-mode
desc: 开启无打扰模式，让 GSD 真正释放生产力
---

建议使用 `--dangerously-skip-permissions` 标志运行 Claude Code：

```bash
claude --dangerously-skip-permissions
```

这样 GSD 可以：自动执行命令、自动提交 Git、无需频繁确认

## 支持的运行时
---
emoji: ⚙️
link: https://github.com/gsd-build/get-shit-done#getting-started
desc: 支持 Claude Code、OpenCode、Gemini、Codex、Copilot、Cursor、Windsurf、Antigravity、Augment
---

验证命令（因运行时而异）：

| 运行时 | 验证命令 |
|--------|----------|
| Claude Code / Gemini / Copilot / Antigravity | `/gsd:help` |
| OpenCode / Augment | `/gsd-help` |
| Codex | `$gsd-help` |

## 故障排除
---
emoji: 🔧
link: https://github.com/gsd-build/get-shit-done#troubleshooting
desc: 常见问题及解决方案
---

- 安装后命令不工作？重启运行时以重新加载命令
- 验证安装：`/gsd:help`
- 重新安装：`npx get-shit-done-cc@latest`
- Docker 环境：设置 `CLAUDE_CONFIG_DIR` 环境变量

```bash
# Docker 环境中
CLAUDE_CONFIG_DIR=/home/youruser/.claude npx get-shit-done-cc --global
```
