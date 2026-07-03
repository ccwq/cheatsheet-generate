---
title: planning-with-files 速查 + Cookbook
lang: markdown
version: "3.1.3"
date: "2026-07-03"
github: OthmanAdi/planning-with-files
colWidth: 520px
desc: Manus 风格 AI Agent 工作流 Skill，通过 3-file pattern 把任务目标、研究发现、执行进度写入磁盘，v3 支持 autonomous / gated 两种长时运行模式，跨越 17+ 平台。
tags:
  - AI / LLM
  - CLI 工具
  - 自动化工具
  - 效率工具
  - 工作流
---

# planning-with-files 速查 + Cookbook

## 快速定位
---
emoji: 🗂️
link: https://github.com/OthmanAdi/planning-with-files
desc: 面向 AI Coding Agent 的持久化工作流 Skill。v3 支持 autonomous（减少重复注入）和 gated（完成门控）两种长时运行模式，benchmark 96.7% 通过率（A/B 验证 3/3 胜出），支持 17+ 平台。
---

- **一句话理解**：不是"自动生成计划"，而是把 AI 的临时上下文变成可恢复的文件化流程，v3 增加了 autonomous/gated 两种运行模式。
- **核心指标**：⭐ 24,374 | Benchmark 96.7%（v2.21.0, claude-sonnet-4-6）| A/B 3/3 胜出 | SkillCheck 验证通过 | 安全审计通过
- **最短路径**：`npx skills add ...` → `/plan <任务>` → 按三个文件工作
- **v3 最短上手**：无 mode 标记 = 原样 v2.43 行为，新增 `--autonomous` / `--gated` 才激活新模式

## 安装
---
emoji: 🚀
desc: 支持 17+ 平台，最简命令一行搞定。
---

### 一行安装（通用，适用 Claude Code / Codex / Cursor 等）

```bash
npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g
```

### Claude Code 完整插件（含 /plan 命令）

```bash
/plugin marketplace add OthmanAdi/planning-with-files
/plugin install planning-with-files@planning-with-files
```

### 平台快速对照

| 平台 | 安装命令 |
|---|---|
| Claude Code（完整插件） | `/plugin marketplace add OthmanAdi/planning-with-files` |
| Claude Code（Skill-only） | `npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g` |
| Codex | `npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g` |
| Cursor | `npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g` |
| Gemini CLI | `npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g` |
| OpenCode | `npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g` |
| Hermes Agent | `HERMES_ENABLE_PROJECT_PLUGINS=1` + 添加 `.hermes/skills` 到 profile |
| Mastra Code / Continue / Pi / OpenClaw / Kiro | `npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g` |

### 多语言版本

```bash
npx skills add OthmanAdi/planning-with-files --skill planning-with-files-zh -g   # 简体中文
npx skills add OthmanAdi/planning-with-files --skill planning-with-files-zht -g  # 正體中文
npx skills add OthmanAdi/planning-with-files --skill planning-with-files-ar -g   # العربية
npx skills add OthmanAdi/planning-with-files --skill planning-with-files-de -g   # Deutsch
npx skills add OthmanAdi/planning-with-files --skill planning-with-files-es -g   # Español
```

### 验证安装

```text
/planning-with-files:plan
```
看到文件创建提示即成功。

## 核心心智模型
---
emoji: 💾
desc: Context Window = RAM（易失，有限）；Filesystem = Disk（持久，无限）。把重要信息写进文件而不是只放在上下文里。
---

### v3 三种运行模式（新增）

| 模式 | 触发方式 | 适用场景 | Stop Hook 行为 |
|---|---|---|---|
| **Plain v2 模式** | 无 `.mode` 文件 | 日常开发、简单任务 | 纯提示，不阻塞 |
| **Autonomous 模式** | `init-session.sh --autonomous` | 长时运行、强模型 | 同上，无额外门控 |
| **Gated 模式** | `init-session.sh --gated` | 关键任务、必须完成的流程 | 有条件阻塞（见下方） |

### Gated 模式门控条件（5 个同时满足才阻塞）

1. gated 模式已激活（`.planning/<id>/.mode = gated`）
2. 存在 `in_progress` 阶段
3. `stop_hook_active = false`
4. 阻塞次数未超上限（默认 20 次）
5. 自上次阻塞后账本有进展

### Host 能力分级

| Tier | 机制 | 平台 |
|---|---|---|
| Hard block | `decision:block` / exit 2 | Claude Code, Codex CLI, OpenAI Codex API, Continue.dev |
| Follow-up inject | 注入 follow-up message + 计数器 | Cursor, Pi, Kiro |
| Notify only | 系统消息，无强制 | OpenCode, Gemini CLI, 其余 |

> OpenCode 暂不支持 Stop-hook 重激活，gated 模式仅作通知。

## 三个核心文件
---
emoji: 📄
desc: task_plan.md（任务总控）、findings.md（研究发现）、progress.md（执行日志），各司其职。
---

### task_plan.md — 任务总控

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
读了两个文件     → 更新 findings.md
查了两个网页     → 更新 findings.md
看了两个错误日志 → 更新 findings.md
比较了两个方案   → 更新 findings.md
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

## v3 新增字段（Autonomous / Gated 模式）

`task_plan_autonomous.md` 模板新增三个可选字段：

```markdown
### Phase 2: 实现
- **Status:** in_progress
- **DependsOn:** Phase 1
- **Owner:** agent-frontend
- **AcceptanceCheck:** npm test -- --grep "login"
```

## 最短工作流
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

## v3 Attestation（计划完整性哈希）
---
emoji: 🔐
desc: v3 autonomous / gated 模式下，计划文件默认加哈希锁定，篡改后注入被拒绝。
---

```bash
# 手动重新哈希（修改计划后必须）
./scripts/attest-plan.sh

# 查看当前哈希
./scripts/attest-plan.sh --check
```

> SHA 缓存位置：v3 移至 `$XDG_CACHE_HOME/pwf-sha`（即 `~/.cache/pwf-sha`），不再使用 `/tmp/pwf-sha`。

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

## Benchmark 数据
---
emoji: 📊
desc: 官方评测结果（v2.21.0，claude-sonnet-4-6）。
---

| 测试维度 | 有 Skill | 无 Skill |
|---|---|---|
| 通过率（30 条断言） | **96.7%（29/30）** | 6.7%（2/30） |
| 3-file 模式遵循 | **5/5** | 0/5 |
| A/B 盲测胜出 | **3/3（100%）** | 0/3 |
| 平均评分 | **10.0/10** | 6.8/10 |

> 评测方法：Anthropic skill-creator framework (v2.22.0)，10 并行子 agent，5 种任务类型，30 条可客观验证断言，3 轮盲测 A/B 对比。数据来源：[docs/evals.md](https://github.com/OthmanAdi/planning-with-files/blob/master/docs/evals.md)

## 常见坑点
---
emoji: ⚠️
desc: 高频踩坑与解决方案。
---

### 改了 task_plan.md 但注入内容不变

v3 autonomous / gated 模式下，计划文件有 SHA 哈希锁定。修改后必须重新哈希：
```bash
./scripts/attest-plan.sh
```

### Stop Hook 不生效（Claude Code 正常，但其他平台无反应）

检查平台能力分级：OpenCode / Gemini CLI 等 notify-only 平台 Stop Hook 只能显示消息，无法强制阻塞。Gated 模式在这些平台上仅作通知，不保证完成门控。

### 上下文压缩后丢失计划

关闭自动压缩以延长上下文寿命：
```json
{ "autoCompact": false }
```

### v2 → v3 迁移后旧文件不能用

**无影响**。v3 默认路径完全兼容 v2.43，`task_plan.md`/`findings.md`/`progress.md` 无需任何改动。autonomous / gated 模式是纯新增 opt-in。

### Windows Git Bash 安装失败（hooks 脚本无执行权限）

手动赋予执行权限：
```bash
chmod +x .claude/hooks/planning-with-files/*.sh
```

## 社区 Fork 与扩展
---
emoji: 🌟
desc: 社区基于 planning-with-files 的重要分支项目。
---

| Fork | 作者 | 扩展内容 |
|---|---|---|
| [devis](https://github.com/st01cs/devis) | @st01cs | 面试优先工作流，`/devis:intv` 和 `/devis:impl` 命令 |
| [multi-manus-planning](https://github.com/kmichels/multi-manus-planning) | @kmichels | 多项目支持，SessionStart git 同步 |
| [plan-cascade](https://github.com/Taoidle/plan-cascade) | @Taoidle | 多级任务编排，并行执行，多 Agent 协作 |
| [openclaw-github-repo-commander](https://github.com/wd041216-bit/openclaw-github-repo-commander) | @wd041216-bit | 7 阶段 GitHub 仓库审计与优化工作流 |

## v2 → v3 迁移速查
---
emoji: 🔄
desc: 从 v2.x 升级到 v3 的关键变化，无需修改现有计划文件。
---

| 变化 | v2 | v3 |
|---|---|---|
| 默认行为 | 纯 advisory | **无变化**，默认 = v2.43 |
| Autonomous 模式 | 不存在 | `init-session.sh --autonomous` |
| Gated 模式 | 不存在 | `init-session.sh --gated` |
| Stop Hook 阻塞 | 从不 | 只在 gated 模式 + 5 个条件同时满足 |
| 计划哈希锁定 | 可选 | autonomous/gated 模式默认开启 |
| SHA 缓存位置 | `/tmp/pwf-sha` | `~/.cache/pwf-sha`（`$XDG_CACHE_HOME/pwf-sha`） |
| Run Ledger | 无 | autonomous/gated 模式追加 JSONL 账本 |
| Phase 协调字段 | 无 | `DependsOn` / `Owner` / `AcceptanceCheck` |

> 迁移指南完整版：[MIGRATION.md](https://github.com/OthmanAdi/planning-with-files/blob/master/MIGRATION.md)
