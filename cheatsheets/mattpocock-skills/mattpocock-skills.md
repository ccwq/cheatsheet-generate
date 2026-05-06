---
title: Matt Pocock Skills
lang: bash
version: 1.0.0
date: 2026-05-06
github: mattpocock/skills
colWidth: 12
---

## 一眼入口

**mattpocock/skills** 是一套工程导向的 agent skills 合集，解决"沟通偏差、反馈缺失、代码腐化"三大高频失败模式。

安装后通过 `/setup-matt-pocock-skills` 初始化 repo 配置，之后按场景选用对应 skill。

---

## Engineering Skills

### 入口与定位

| Skill | 触发词 | 解决什么问题 |
|---|---|---|
| `grill-me` | "我要做 X" | 让 agent 彻底理解你想做什么 |
| `grill-with-docs` | 同上 + 已有 CONTEXT.md | 加入项目行话与 ADR 对齐 |
| `diagnose` | "debug this"、"排查" | 严格六阶段 debug 循环 |
| `tdd` | "红绿重构"、"测试先行" | 垂直切片 tracer bullet 开发 |
| `triage` | "triage"、"分诊" | issue 状态机流转 |
| `to-prd` | "转 PRD"、"生成产品文档" | 从上下文合成 PRD |
| `to-issues` | "拆任务"、"转 issue" | 垂直切片转可领取 issue |
| `zoom-out` | "看不懂这块"、"全局视图" | 代码全局上下文 |
| `improve-codebase-architecture` | "架构优化"、"深化模块" | 找 shallow→deep 机会 |
| `prototype` | "快速验证"、"先跑起来" | 最小可运行原型 |

---

## 起手工作流

### 1. 新任务：grill 确认理解

```
/grill-me
/grill-with-docs
```

**何时用：**

- 还没写代码，先让 agent 问清楚所有分支
- 已有 `CONTEXT.md` 和 `docs/adr/`，需要对齐项目术语

**典型流程：**

1. agent 逐问题追问
2. 你回答，agent 同时更新 `CONTEXT.md` / ADR
3. 直到所有决策树都覆盖

---

### 2. 有 PRD 了：转 issue

```
/to-issues
```

**输入：** 已有的 PRD 或详细方案
**输出：** 垂直切片 issue 列表（AFK / HITL 分类）

---

### 3. 开始实现：TDD 循环

```
/tdd
```

**规则：**

- 一次只写一个测试，再写实现
- 不写水平切片（先把所有测试写完再写代码是错的）
- 永远 red → green → refactor

---

## 场景 1：Bug 修复 → diagnose

```
/diagnose
```

**六阶段循环：**

| 阶段 | 动作 | 产出 |
|---|---|---|
| 1. 反馈环 | 构建可重复的失败信号 | 测试 / 脚本 / 捕获 |
| 2. 复现 | 让 bug 稳定出现 | 确认症状 |
| 3. 假设 | 提出 3-5 个可证伪假设 | 排序假设列表 |
| 4. 探测 | 一次改一个变量 | 定位根因 |
| 5. 修复 | 先写 regression test | 测试通过 |
| 6. 收尾 | 清理 debug 日志，删除临时代码 | 干净 commit |

**核心原则：** 没有可重复的失败信号，不要进 Phase 2。

---

## 场景 2：代码混乱 → improve-codebase-architecture

```
/improve-codebase-architecture
```

**找深层模块的机会：**

- 哪个模块删掉后复杂度会消失？（pass-through）
- 哪个模块接口和实现一样复杂？（shallow）
- 哪里改了 bug，N 个地方都得跟着改？（无 locality）

**输出：** 候选列表 → 用户选 → grilling 对话 → 落实

---

## 场景 3：Triage Issue

```
/triage
```

**Issue 状态机：**

```bash
unlabeled → needs-triage → needs-info / ready-for-agent / ready-for-human / wontfix
                                ↑___回归___
```

**分类角色：** `bug` / `enhancement`
**状态角色：** 五选一

---

## Productivity Skills

### caveman — 压缩沟通

```
/caveman
```

**触发：** "caveman mode"、"less tokens"、"be brief"

**规则：**

- 删 articles (a/an/the)
- 删 filler (just/really/basically/actually/simply)
- 短词替代长词 (big not extensive, fix not "implement solution for")
- 用 → 表示因果

**示例：**

> Not: "Sure! I'd be happy to help you with that. The issue is likely..."
> Yes: "Bug in auth. Token expiry check use < not <=. Fix:"

---

### write-a-skill — 创建新 skill

```
/write-a-skill
```

**产出结构：**

```bash
skill-name/
├── SKILL.md           # 必填，<100 行
├── REFERENCE.md       # 可选，内容过长时
├── EXAMPLES.md        # 可选
└── scripts/           # 可选，确定性操作
```

**SKILL.md 必含：**

- `name` + `description`（含触发词）
- Quick start 最小示例
- Workflows 步骤清单
- 进阶指向 REFERENCE.md

---

## Quick Ref

| 场景 | 命令 |
|---|---|
| 想清楚再开始 | `/grill-me` 或 `/grill-with-docs` |
| 有方案要拆分 | `/to-issues` |
| 开始写代码 | `/tdd` |
| 遇到 bug | `/diagnose` |
| 做完要同步 | `/triage` |
| 压缩 token | `/caveman` |
| 创建新 skill | `/write-a-skill` |
| 看不懂代码 | `/zoom-out` |
| 架构优化 | `/improve-codebase-architecture` |
| 快速验证想法 | `/prototype` |

---

## 架构设计原则

mattpocock/skills 的核心哲学：

> **Small, composable, model-agnostic.**

不追求大一统流程，而是让每个 skill 专注一件事，可自由组合。

三大工程信条：

1. **沟通对齐先于实现** — grill 类 skill 解决 agent 理解偏差
2. **快速反馈驱动开发** — TDD + diagnose 确保代码正确
3. **模块深度优于广度** — improve-codebase-architecture 驱动架构演进