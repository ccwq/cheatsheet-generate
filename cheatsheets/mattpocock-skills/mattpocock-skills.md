---
title: Matt Pocock Skills
lang: bash
version: main@733d312
date: 2026-05-08
github: mattpocock/skills
colWidth: 12
---

## 一眼入口

**mattpocock/skills** 是 Matt Pocock 日常使用的 agent skills 合集，定位是“real engineering, not vibe coding”。官方 README 把稳定入口分为 Engineering、Productivity、Misc 三组；仓库里还保留 deprecated、in-progress、personal 目录，使用时要区分稳定推荐与实验/个人技能。

> 速查口径：本文以 `main@733d312` 的 README 和仓库树为准；该仓库当前没有 GitHub Releases，避免把展示页日期误当成版本发布日期。

---

## 安装与初始化
---
lang: bash
emoji: 📦
---

```bash
# 通过 skills.sh 安装器添加仓库
npx skills@latest add mattpocock/skills

# 安装时务必选择该初始化 skill
/setup-matt-pocock-skills
```

| 步骤 | 要做什么 | 结果 |
|---|---|---|
| 1 | 运行 `npx skills@latest add mattpocock/skills` | 进入 skills.sh 选择流程 |
| 2 | 选择需要的 skills 和目标 coding agents | 将 skill 安装到对应工具 |
| 3 | 勾选并运行 `/setup-matt-pocock-skills` | 写入 issue tracker、triage label、domain docs 约定 |
| 4 | 再使用 `/to-issues`、`/triage`、`/diagnose` 等工程 skills | 后续 skills 能读到同一套项目上下文 |

**兼容口径：** 官方 README 声明这些 skills 小而可组合、model-agnostic，并明确用于 Claude Code、Codex 和其他 coding agents；具体可安装目标以 `skills.sh` 选择器当前显示为准。

---

## 核心方法论：四大失败模式

| 失败模式 | 官方问题描述 | 推荐入口 |
|---|---|---|
| Misalignment | Agent 没做你真正想要的东西 | `/grill-me`、`/grill-with-docs` |
| Verbose Output | Agent 没有共享项目语言，解释冗长 | `/grill-with-docs` 生成/维护 `CONTEXT.md` 与 ADR |
| Broken Code | 缺少反馈环，代码产出不可验证 | `/tdd`、`/diagnose` |
| Software Entropy | Agent 加速开发也加速复杂度堆积 | `/to-prd`、`/zoom-out`、`/improve-codebase-architecture` |

**使用顺序心智模型：**

```text
先对齐意图 -> 写入项目语言 -> 用反馈环开发/排障 -> 定期检查架构熵
```

---

## 起手工作流

### 1. 新需求先 grill，减少理解偏差

```bash
/grill-me
/grill-with-docs
```

| 入口 | 适用场景 | 额外效果 |
|---|---|---|
| `/grill-me` | 非代码计划、设计、需求澄清 | 追问直到决策树清楚 |
| `/grill-with-docs` | 代码仓库里的变更计划 | 结合 domain model，更新 `CONTEXT.md` 和 ADR |

### 2. 已有方向后转 PRD / issues

```bash
/to-prd
/to-issues
```

| 入口 | 输入 | 输出 |
|---|---|---|
| `/to-prd` | 当前对话上下文 | PRD，并提交为 GitHub issue |
| `/to-issues` | plan、spec 或 PRD | 可独立领取的垂直切片 issues |

### 3. 开发和排障进入反馈环

```bash
/tdd
/diagnose
```

| 入口 | 核心规则 | 常见坑 |
|---|---|---|
| `/tdd` | 一次一个测试，red -> green -> refactor | 不要先批量写完所有测试再实现 |
| `/diagnose` | 先构建可重复 pass/fail 信号 | 没有反馈环时不要靠猜修 bug |

---

## Engineering Skills（10 个）

| Skill | 什么时候用 | 关键产出 |
|---|---|---|
| `setup-matt-pocock-skills` | 第一次在仓库中使用这套工程 skills | `docs/agents/*` 与 AGENTS/CLAUDE 配置块 |
| `grill-with-docs` | 需求需要结合项目术语和 ADR 对齐 | 追问结果、`CONTEXT.md`、ADR 更新 |
| `to-prd` | 把当前对话沉淀成产品需求 | PRD + GitHub issue |
| `to-issues` | 把 plan/spec/PRD 拆成任务 | 垂直切片 issues |
| `triage` | 处理 issue 状态流转 | `needs-triage`、`needs-info`、`ready-for-agent` 等标签 |
| `tdd` | 功能开发或 bugfix 需要测试先行 | 单测试红绿循环 |
| `diagnose` | 难复现 bug、性能回退、线上异常 | 反馈环、假设、探针、回归测试 |
| `zoom-out` | 看不懂某块代码或需要全局视角 | 更高层上下文解释 |
| `improve-codebase-architecture` | 代码开始变浅、变乱、难改 | deep module 候选与改进计划 |
| `prototype` | 需要快速冲掉设计不确定性 | 可丢弃原型或 UI 变体 |

### setup-matt-pocock-skills — 仓库级初始化

```bash
/setup-matt-pocock-skills
```

**它会询问三类配置：**

| 配置 | 可选项 | 后续谁会消费 |
|---|---|---|
| Issue tracker | GitHub、GitLab、local markdown、Other | `to-prd`、`to-issues`、`triage` |
| Triage labels | 五个 canonical roles 或你的自定义标签 | `triage` |
| Domain docs | 单 `CONTEXT.md` 或 `CONTEXT-MAP.md` 多上下文 | `grill-with-docs`、`tdd`、`diagnose`、`zoom-out` |

---

## Productivity Skills（3 个）

| Skill | 触发场景 | 解决什么 |
|---|---|---|
| `caveman` | 需要极短但准确的工程沟通 | 删除 filler，压缩 token |
| `grill-me` | 计划、设计、非代码需求还不清楚 | 让 agent 持续追问 |
| `write-a-skill` | 创建新 agent skill | 生成符合 progressive disclosure 的 skill 结构 |

### caveman — 压缩沟通

```bash
/caveman
```

| 规则 | 示例 |
|---|---|
| 删除寒暄和填充词 | `Sure, I can help...` -> 直接给结论 |
| 用短词替代长表达 | `fix` 优先于 `implement solution for` |
| 保留技术准确性 | 压缩 token，不牺牲判断依据 |

---

## Misc Skills（4 个）

| Skill | 什么时候用 | 备注 |
|---|---|---|
| `git-guardrails-claude-code` | 给 Claude Code 加 git 危险操作拦截 | 位于 `skills/misc` |
| `migrate-to-shoehorn` | 将测试里的 `as` 类型断言迁移到 `@total-typescript/shoehorn` | 偏专项迁移 |
| `scaffold-exercises` | 生成练习项目结构 | 适合课程/训练材料 |
| `setup-pre-commit` | 配置 Husky、lint-staged、Prettier、typecheck、tests | 项目质量入口 |

---

## 仓库里还有哪些非主线目录

| 目录 | 当前含义 | 使用建议 |
|---|---|---|
| `skills/deprecated` | `design-an-interface`、`qa`、`request-refactor-plan`、`ubiquitous-language` | 不放进主推荐表；旧文档可提到但应标记 deprecated |
| `skills/in-progress` | `handoff`、`writing-beats`、`writing-fragments`、`writing-shape` | 实验中，不当作稳定主功能 |
| `skills/personal` | `edit-article`、`obsidian-vault` | 作者个人工作流，可按需安装 |

---

## Quick Ref

| 场景 | 先用哪个 |
|---|---|
| 第一次在仓库启用这套 skills | `/setup-matt-pocock-skills` |
| 想清楚需求再开始 | `/grill-me` 或 `/grill-with-docs` |
| 已有对话要沉淀成需求 | `/to-prd` |
| 有 PRD / plan 要拆任务 | `/to-issues` |
| issue 要流转和标记 | `/triage` |
| 做功能或修 bug 要测试先行 | `/tdd` |
| bug 难定位 | `/diagnose` |
| 不理解某块代码 | `/zoom-out` |
| 架构开始变难改 | `/improve-codebase-architecture` |
| 需要先验证设计 | `/prototype` |
| 输出太长 | `/caveman` |
| 创建新 skill | `/write-a-skill` |
| 配 pre-commit | `/setup-pre-commit` |
| Git 命令需要护栏 | `/git-guardrails-claude-code` |

---

## 常见坑

| 坑 | 为什么错 | 正确做法 |
|---|---|---|
| 把所有仓库目录都算作稳定 skills | deprecated、in-progress、personal 不是 README 主推荐组 | 主文档按 README Reference 写，另表说明非主线目录 |
| 跳过 `/setup-matt-pocock-skills` | 工程 skills 不知道 issue tracker、标签和 domain docs | 第一次使用先初始化 |
| 把 `version` 写成 `1.0.0` | 仓库没有 GitHub Releases 证明该版本 | 用 `main@<commit>` 或明确记录采集日期 |
| 把 TDD 当成“先写完所有测试” | 官方 skill 明确反对 horizontal slicing | 一次一个行为：test -> implementation -> repeat |
| 没有反馈环就排障 | `/diagnose` 的核心是先构建可重复信号 | 先让 bug 可观测，再提出和验证假设 |
