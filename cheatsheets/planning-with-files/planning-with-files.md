---
title: planning-with-files 速查 + Cookbook
lang: markdown
version: main@latest
date: "2026-04-26"
github: OthmanAdi/planning-with-files
colWidth: 520px
---

# planning-with-files 速查 + Cookbook

## 快速定位
---
emoji: 🗂️
link: https://github.com/OthmanAdi/planning-with-files
desc: 面向 AI Coding Agent 的工作流 Skill，通过 3-file pattern 把任务目标、研究发现、执行进度写入项目目录，形成可持久化的"外部工作记忆"。核心思想是"把 AI 上下文窗口当成 RAM，把文件系统当成 Disk"。
---

- **一句话理解**：不是"自动生成计划"，而是把 AI 的临时上下文变成可恢复的文件化流程。
- **适合场景**：多步骤开发、调研、项目搭建、长链路修复。
- **不适合**：简单问答、单文件小改动、快速查询。
- **最短路径**：`/plan <任务描述>` → 创建三个核心文件 → 按阶段执行

## 核心心智模型
---
emoji: 💾
desc: Context Window = 临时内存（RAM），Filesystem = 持久化硬盘（Disk）。重要信息不要只放在对话上下文里，要写进文件。
---

### 问题与处理对照

| 问题 | 表现 | planning-with-files 处理方式 |
|---|---|---|
| 上下文丢失 | `/clear`、压缩上下文后忘记目标 | 任务计划写入 `task_plan.md` |
| 目标漂移 | 做了几十步后偏离原始需求 | 每次关键操作前重读计划 |
| 错误重复 | 同样的失败尝试反复发生 | 错误写入计划和进度文件 |
| 发现丢失 | 调研结论散落在上下文里 | 统一写入 `findings.md` |

## 三个核心文件
---
emoji: 📄
desc: task_plan.md（任务总控）、findings.md（研究发现）、progress.md（执行日志），各司其职。
---

### task_plan.md — 任务总控文件

```markdown
# Task Plan

## Goal
说明本次任务的最终目标。

## Phases
### Phase 1: 需求理解与调研
- [ ] 明确输入和约束
- [ ] 阅读相关文件
- **Status:** in_progress

### Phase 2: 实现
- [ ] 修改核心逻辑
- [ ] 补充测试
- **Status:** pending

## Decisions
| Time | Decision | Reason |
|---|---|---|

## Errors Encountered
| Time | Error | Attempted Fix | Resolution |
|---|---|---|---|
```

**规则**：
- 开始任务前必须有 `task_plan.md`
- 每完成一个阶段，把 checkbox 改成 `[x]`，Status 改成 `complete`
- 遇到错误都写入 `Errors Encountered`
- 重大技术决策写入 `Decisions`

### findings.md — 研究发现仓库

**核心规则：2-Action Rule** — 每进行 2 次查看、搜索、浏览、阅读操作，必须把发现写入 `findings.md`

```markdown
# Findings

## Research Findings
- 发现 A：xxx
- 发现 B：xxx

## Technical Decisions
| Decision | Reason | Source |
|---|---|---|

## Useful Resources
- 文档链接
- API 说明
- 相关代码位置
```

**实操理解**：
```
读了两个文件 → 更新 findings.md
查了两个网页 → 更新 findings.md
看了两个错误日志 → 更新 findings.md
比较了两个方案 → 更新 findings.md
```

### progress.md — 执行日志和恢复入口

```markdown
# Progress

## Current Status
当前处于 Phase 2，实现核心逻辑。

## Session Log
| Time | Action | Files Modified |
|---|---|---|

## Test Results
| Time | Command | Result | Notes |
|---|---|---|---|

## Error Log
| Time | Error | Resolution |
|---|---|---|

## Resume Checklist
- Where am I?
- What is the next action?
- What did I already test?
- What remains incomplete?
```

**职责分工**：
- `progress.md` 关注"做过什么"
- `findings.md` 关注"发现了什么"
- `task_plan.md` 关注"目标和阶段是否完成"

## 标准工作流
---
emoji: 🔄
desc: 从启动计划到完成的完整循环。
---

### Step 1：启动计划

```text
/plan 实现一个用户登录页面，包含表单校验、接口对接、错误提示、单元测试
```

期望结果：创建 `task_plan.md`、`findings.md`、`progress.md` 三个文件。

### Step 2：拆分阶段

建议拆成 3 到 7 个阶段，不要太细也不要太粗。

```markdown
## Phases

### Phase 1: 需求确认
- [ ] 明确输入字段
- [ ] 明确校验规则
- [ ] **Status:** in_progress

### Phase 2: 技术调研
- [ ] 阅读现有代码
- [ ] 对比 API 文档
- **Status:** pending

### Phase 3: 组件实现
- [ ] 实现核心逻辑
- [ ] 实现校验
- **Status:** pending
```

### Step 3：边做边写

```
创建三个文件
    ↓
进入迭代工作循环
    ↓
关键操作前读取 task_plan.md
    ↓
调研后更新 findings.md（每 2 次操作）
    ↓
实现后更新 progress.md
    ↓
阶段完成后更新 task_plan.md 和 progress.md
    ↓
错误发生后写入两个文件
    ↓
Stop Hook 检查阶段是否全部完成
```

### Step 4：恢复上下文

当中断后回来，先让 Agent 回答 5 个问题：

```text
请基于 task_plan.md、findings.md、progress.md 回答：
1. 当前任务目标是什么？
2. 当前处于哪个阶段？
3. 已经完成了什么？
4. 发现了哪些关键结论？
5. 下一步最小动作是什么？
```

### Step 5：完成检查

```bash
ls -la task_plan.md findings.md progress.md
```

检查：`task_plan.md` 中所有阶段都是 `complete`，`progress.md` 中所有阶段都有动作记录。

## 常用提示词模板
---
emoji: 📝
desc: 直接复制使用的模板集合。
---

### 启动复杂开发任务

```text
请使用 planning-with-files 工作流处理这个任务。

任务：实现一个 Vue3 + ElementPlus 的可视化表单设计器。
要求：
1. 先创建 task_plan.md、findings.md、progress.md
2. task_plan.md 拆分为 4-6 个阶段
3. 每阅读 2 个文件或搜索 2 次后，更新 findings.md
4. 每完成一个阶段，更新 task_plan.md 和 progress.md
5. 遇到错误必须记录到 task_plan.md 和 progress.md
```

### 启动代码排错任务

```text
请使用 planning-with-files 工作流排查这个问题。

问题：项目启动时报错 xxx。
要求：
1. 先创建 task_plan.md、findings.md、progress.md
2. 不要直接改代码，先阅读相关配置和错误日志
3. 每两个排查动作后更新 findings.md
4. 每次失败尝试都记录到 Errors Encountered
5. 最后给出根因、修改点、验证命令和回滚方案
```

### 让 Agent 恢复任务

```text
请读取当前项目的 task_plan.md、findings.md、progress.md，恢复上下文。
请输出：
1. 当前目标
2. 已完成阶段
3. 当前阶段
4. 关键发现
5. 未解决问题
6. 下一步建议
```

### 强制防止目标漂移

```text
在继续之前，请先重读 task_plan.md。
然后回答：
1. 当前操作是否仍然服务于原始目标？
2. 是否存在目标漂移？
3. 是否需要调整计划？
如果需要调整，请先更新 task_plan.md，再继续。
```

### 结束前检查

```text
请执行 planning-with-files 完成检查：
1. 检查 task_plan.md 中所有 Phase 是否 complete
2. 检查 progress.md 是否记录了每个阶段的执行动作
3. 检查 findings.md 是否包含关键技术结论
4. 如果未完成，请列出 remaining tasks
5. 如果完成，请输出最终交付摘要
```

## 安装方式速记
---
emoji: 🔧
desc: 记住最短安装命令，按需扩展。
---

| 平台 | 安装命令 |
|---|---|
| Claude Code | `/plugin marketplace add OthmanAdi/planning-with-files` |
| 通用 Skill | `npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g` |
| 中文版 | `npx skills add OthmanAdi/planning-with-files --skill planning-with-files-zh -g` |

### Claude Code 常用命令

```text
/planning-with-files:plan    → /plan
/planning-with-files:status  → /plan:status
/planning-with-files:start
```

## 目录管理建议
---
emoji: 📁
desc: 三文件放哪，怎么管。
---

### 默认模式（项目根目录）

```gitignore
!task_plan.md
!findings.md
!progress.md
```

### 可选：统一放到 `.planning/`

```text
.planning/
  task_plan.md
  findings.md
  progress.md
```

或按任务隔离：

```text
.planning/
  2026-04-login-page/
    task_plan.md
    findings.md
    progress.md
```

### 适合提交的场景

- 开源项目开发计划
- 团队协作任务
- 长期重构任务
- 复杂调研结论
- 可复盘的问题排查记录

### 不适合提交的场景

- 包含敏感路径、账号、token
- 个人临时思考
- 客户私密信息

## 常见问题与处理
---
emoji: ⚠️
desc: 问题先行，解法紧随。
---

### 文件创建到了错误目录

```text
/planning-with-files - I'm working in /path/to/my-project/, create all files there
```

或在项目根目录加 `CLAUDE.md`：

```markdown
# Project Context
All planning files should be created in this directory.
```

### Hooks 没有触发

```bash
claude --version  # 需要 v2.1.0 或更高
```

Codex 检查：

```bash
codex features list | rg '^codex_hooks\s'
```

确认 `~/.codex/config.toml` 中 `codex_hooks = true`

### Stop Hook 阻止结束

原因通常是 `task_plan.md` 里还有阶段没有标记为 `complete`。

```text
请检查 task_plan.md 中未完成的 Phase。
如果实际已完成，请更新状态为 complete。
如果未完成，请列出 remaining tasks。
```

### 更新后模板找不到

```bash
/plugin uninstall planning-with-files@planning-with-files
/plugin marketplace add OthmanAdi/planning-with-files
/plugin install planning-with-files@planning-with-files
```

## 最佳实践
---
emoji: ✅
desc: 区别于"不要做什么"和"应该怎么做"。
---

### 不要把它当 TODO 工具

**错误用法**：
```markdown
- [ ] 写代码
- [ ] 测试
- [ ] 完成
```

**正确用法**：
```markdown
### Phase 2: 实现动态字段渲染
- [x] 阅读现有 FormRenderer
- [x] 确认 schema 字段协议
- [ ] 实现 input/select/date 三类字段
- **Status:** in_progress

## Decisions
| Decision | Reason |
|---|---|
| 使用 schema.children 支持嵌套字段 | 后续支持分组和布局更自然 |
```

### 每次失败都写下来

```markdown
| Time | Error | Attempted Fix | Resolution |
|---|---|---|---|
| 2026-04-26 10:20 | pnpm install 失败 | 删除 node_modules | 未解决，继续检查 lockfile |
```

### findings 不要写废话

**差的 findings.md**：
```markdown
看了一些文件，发现项目比较复杂。
```

**好的 findings.md**：
```markdown
## Research Findings

- `src/components/FormRenderer.vue` 当前只支持 input/select，未支持 date/radio
- `src/types/schema.ts` 中 FieldSchema 没有 `visibleWhen` 字段
- ElementPlus FormItem 的 prop 需要和 model path 对齐，否则校验不会触发
```

### progress 要能让人接手

```markdown
## Current Status

Phase 2 in_progress。已完成 schema 类型扩展，正在实现 FormRenderer 的条件显示。

## Modified Files

- src/types/schema.ts
- src/components/FormRenderer.vue

## Next Action

实现 visibleWhen 的表达式解析，并补充单元测试。
```

## 什么时候不要用
---
emoji: ❌
desc: 不要为了形式主义滥用。
---

**不建议使用**：
```
解释一个概念
改一个 CSS 样式
修一个明显 typo
写一个很短的函数
查询一个命令用法
```

**建议使用**：
```
重构模块
排查复杂构建错误
调研多个技术方案
实现新功能并补测试
跨多文件修改
需要中断后继续的任务
```

## 项目规范模板
---
emoji: 📋
desc: 可直接复制到 CLAUDE.md / AGENTS.md 的规范。
---

```markdown
# planning-with-files Project Rule

For any complex task expected to require more than 5 tool calls, use the planning-with-files workflow.

Required files:
- task_plan.md: goal, phases, decisions, errors
- findings.md: research findings, technical decisions, resources
- progress.md: session log, test results, modified files

Rules:
1. Create task_plan.md before implementation
2. Split work into 3-7 phases
3. After every 2 file reads, searches, or browser operations, update findings.md
4. Before major implementation decisions, re-read task_plan.md
5. When a phase is complete, update both task_plan.md and progress.md
6. Log all errors, even if immediately resolved
7. Never repeat the same failed action without changing the approach
8. Before final response, verify all phases are complete or list remaining work
```

## 横向对比
---
emoji: ⚖️
desc: planning-with-files、Superpowers、GSD 三者的定位区别与选型建议。
---

### 一句话区分

```
planning-with-files = 轻量持久化记忆模式
Superpowers        = 软件工程方法论 + Skill 集合
GSD                = 上下文工程 + Spec-driven + 多阶段 Agent 编排系统
```

### 对比总览

| 维度 | planning-with-files | Superpowers | GSD |
|---|---|---|---|
| 核心定位 | 用文件保存计划、发现、进度，防止上下文丢失 | 给编码 Agent 加一套完整开发方法论 | 面向长任务的上下文工程、规格驱动开发和阶段式执行系统 |
| 复杂度 | 低 | 中 | 高 |
| 主要文件 | `task_plan.md`、`findings.md`、`progress.md` | brainstorming、writing-plans、TDD、code review 等 composable skills | `.planning/`、阶段文档、配置、命令、hooks、agents |
| 解决的核心问题 | 上下文丢失、目标漂移、错误重复 | Agent 不按工程流程走、跳过测试、缺少设计审查 | 长任务 context rot、多阶段交接、多 Agent 执行、质量门禁 |
| 工程流程强制程度 | 不强，主要是记录与提醒 | 强，强调设计、计划、TDD、review | 很强，强调 spec、phase、orchestrator、verification |
| 自动化程度 | 低到中，靠 hooks 提醒和检查 | 中到高，靠 skills 引导流程 | 高，命令、阶段、agent、上下文切分更完整 |
| 学习成本 | 最低 | 中等 | 最高 |
| 最适合场景 | 给任何 Agent 加一个简单可靠的"文件记忆" | 希望 Agent 像工程师一样先设计、写测试、审查 | 多文件、多阶段、多天的大型实现 |

### planning-with-files 的本质

重点不是"帮你写代码"，而是把 Agent 的工作记忆外置到文件系统。

针对的问题：volatile memory、goal drift、hidden errors、context stuffing。
解决方式：每个复杂任务创建三个文件，形成**通用的 Agent 工作记忆协议**。

**优点**：很轻，不绑死具体开发方法，可在 Claude Code、Codex、Hermes 等多种 Agent 里套用。

**不足**：不负责强制 TDD，不负责复杂多 Agent 编排，不提供项目级 spec-driven pipeline。它更多是"文件化工作流骨架"。

### 层级关系

```
planning-with-files  → 最小可用的持久化工作记忆（让 Agent 不忘事）
Superpowers          → 工程方法论 + Skill 驱动开发流程（让 Agent 像工程师一样工作）
GSD                  → 上下文工程 + Spec-driven + 多阶段 Agent 编排（让 Agent 像分阶段执行团队一样推进项目）
```

### 选型建议

**只想提升 Agent 稳定性** → planning-with-files
```
调研一个工具
排查一个 bug
写一篇技术博客
整理复杂配置
做多轮 prompt 优化
让 Agent 记住自己做过什么
```

**想让 AI 编码更像正规工程流程** → Superpowers
```
功能开发
重构
测试驱动开发
需要 code review
需要先设计再实现
不希望 Agent 直接乱写代码
```

**想让 Agent 长时间自主开发一个项目** → GSD
```
从 0 到 1 搭项目
大型功能实现
多阶段开发
多 Agent 分工
需要 phase handoff
需要 rollback/recovery
需要 ship / PR 流程
```

### 组合使用

```
轻量日常任务        → planning-with-files
中等复杂代码任务    → Superpowers + planning-with-files
大型项目级开发      → GSD
```

## 一句话掌握
---
emoji: 🎯
desc: 核心价值总结。
---

```
计划写进 task_plan.md
发现写进 findings.md
执行写进 progress.md
错误必须持久化
关键操作前重读目标
完成前检查所有阶段
```

这就是 planning-with-files 的核心。
