---
title: Matt Pocock Skills
lang: bash
version: 1.0.0
date: 2026-05-06
github: mattpocock/skills
colWidth: 12
---

## 一眼入口

**mattpocock/skills** 是一套工程导向的 agent skills 合集，核心方法论是解决 AI 编码代理的四大失败模式。21 个 skills 分为 Planning & Design、Development & Refactoring、Engineering & Security、Writing & Knowledge 四大类。

> **Small, composable, model-agnostic.** — 每个 skill 专注一件事，可自由组合。

---

## 安装与初始化
---
lang: bash
emoji: 📦
---

```bash
# 安装
npx skills@latest add mattpocock/skills

# 初始化 repo 配置
/setup-matt-pocock-skills
```

**兼容平台：** Claude Code、Codex、Cursor、Continue、GitHub Copilot、Windsurf、Gemini CLI、Antigravity

---

## 核心方法论：四大失败模式

> mattpocock/skills 识别 AI 编码代理的四个典型失败模式，并提供针对性解决技能。

| 失败模式 | 描述 | 解决方案 |
|----------|------|----------|
| **Misalignment（不对齐）** | Agent 理解与用户意图不符 | `/grill-me`、`/grill-with-docs` |
| **Verbose Output（冗长输出）** | 过度解释浪费 token | CONTEXT.md 通用语言文档 |
| **Broken Code（代码问题）** | 代码质量差、bug 多 | `/tdd`、`/diagnose` |
| **Software Entropy（软件熵增）** | 代码库腐化、架构衰退 | `/improve-codebase-architecture`、`/zoom-out` |

### caveman — 压缩沟通（解决 Verbose Output）

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

## 起手工作流

### 1. 新任务：grill 确认理解（解决 Misalignment）

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

### 3. 开始实现：TDD 循环（解决 Broken Code）

```
/tdd
```

**规则：**
- 一次只写一个测试，再写实现
- 不写水平切片（先把所有测试写完再写代码是错的）
- 永远 red → green → refactor

---

## Planning & Design Skills（8 个）

| Skill | 触发词 | 解决什么问题 |
|---|---|---|
| `grill-me` | "我要做 X" | 让 agent 彻底理解你想做什么 |
| `grill-with-docs` | 同上 + 已有 CONTEXT.md | 加入项目行话与 ADR 对齐 |
| `to-prd` | "转 PRD"、"生成产品文档" | 从上下文合成 PRD |
| `to-issues` | "拆任务"、"转 issue" | 垂直切片转可领取 issue |
| `design-an-interface` | "设计接口"、"规划 API" | 接口设计规划与约束定义 |
| `domain-model` | "建模型"、"DDD" | 领域建模与实体关系 |
| `ubiquitous-language` | "统一术语"、"行话" | 建立团队通用语言 |
| `zoom-out` | "看不懂这块"、"全局视图" | 代码全局上下文 |
| `request-refactor-plan` | "重构计划"、"规划重构" | 代码重构的分阶段计划 |

### domain-model — 领域建模

```
/domain-model
```

**用途：** 建立领域实体、聚合根、值对象和它们之间的关系

**典型输出：**
```markdown
## Domain Model

### Entities
- User (Aggregate Root)
- Order
- Product

### Value Objects
- Money
- Address

### Relationships
User → [1..*] Order → [1..*] OrderItem ← Product
```

### design-an-interface — 接口设计规划

```
/design-an-interface
```

**触发：** 需要设计新 API、模块接口或公共接口时

**原则：**
- 先定义接口契约，再实现
- 考虑调用方需求，而非实现方便
- 明确输入输出、错误处理边界

### ubiquitous-language — 统一术语

```
/ubiquitous-language
```

**触发：** 项目术语混乱、需要建立统一行话时

**输出：** 术语文档，包含术语定义、使用场景、示例

---

## Development & Refactoring Skills（6 个）

| Skill | 触发词 | 解决什么问题 |
|---|---|---|
| `tdd` | "红绿重构"、"测试先行" | 垂直切片 tracer bullet 开发 |
| `triage` | "triage"、"分诊" | issue 状态机流转 |
| `improve-codebase-architecture` | "架构优化"、"深化模块" | 找 shallow→deep 机会 |
| `prototype` | "快速验证"、"先跑起来" | 最小可运行原型 |
| `migrate-to-shoehorn` | "迁移"、"旧转新" | 渐进式迁移策略 |
| `scaffold-exercises` | "练手"、"示例" | 练习项目脚手架生成 |

### triage — Issue 分诊

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

### migrate-to-shoehorn — 迁移策略

```
/migrate-to-shoehorn
```

**适用场景：**
- 从旧系统迁移到新架构
- 技术栈升级
- 逐步替换遗留组件

**策略：**
- 一次只迁移一个关注点
- 保持新旧系统同时运行
- 验证每步迁移后再继续

### scaffold-exercises — 练习脚手架

```
/scaffold-exercises
```

**用途：** 生成练习项目模板，用于学习或演示

**输出：**
- 项目结构
- 依赖配置
- 基础测试
- 示例代码

---

## Engineering & Security Skills（4 个）

| Skill | 触发词 | 解决什么问题 |
|---|---|---|
| `setup-pre-commit` | "pre-commit"、"git 钩子" | 配置 Git pre-commit 钩子 |
| `git-guardrails-claude-code` | "git 安全"、"保护分支" | Git 操作安全护栏 |
| `github-triage` | "GitHub 分诊"、"issue 流转" | GitHub Issue 分诊工作流 |
| `qa` | "质量保证"、"测试" | QA 工作流与验收标准 |

### setup-pre-commit — Pre-commit Hook 配置

```
/setup-pre-commit
```

**用途：** 配置 pre-commit 钩子，确保提交代码符合规范

**典型配置：**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
```

### git-guardrails-claude-code — Git 安全护栏

```
/git-guardrails-claude-code
```

**保护规则：**
- 禁止直接 push 到 main/master
- 强制 code review 前不得合并
- 危险操作（force push、删除分支）需确认

### github-triage — GitHub Issue 分诊

```
/github-triage
```

**工作流：**
1. 新 issue 进来 → needs-triage
2. 判断类型（bug/enhancement/question/docs）
3. 评估复杂度（good-first-issue / help-wanted）
4. 分配里程碑

### qa — 质量保证工作流

```
/qa
```

**检查项：**
- 单元测试覆盖率
- 集成测试完整性
- 端到端测试覆盖
- 代码风格一致性
- 安全扫描结果

---

## Writing & Knowledge Skills（3 个）

| Skill | 触发词 | 解决什么问题 |
|---|---|---|
| `write-a-skill` | "创建 skill"、"新技能" | 创建新的 agent skill |
| `edit-article` | "编辑文章"、"改文档" | 技术文章编辑润色 |
| `obsidian-vault` | "知识库"、"笔记" | Obsidian 风格知识管理 |

### write-a-skill — 创建新 Skill

```
/write-a-skill
```

**产出结构：**
```bash
skill-name/
├── SKILL.md           # 必填，<100 行
├── REFERENCE.md       # 可选，内容过长时
├── EXAMPLES.md       # 可选
└── scripts/          # 可选，确定性操作
```

**SKILL.md 必含：**
- `name` + `description`（含触发词）
- Quick start 最小示例
- Workflows 步骤清单
- 进阶指向 REFERENCE.md

### edit-article — 文章编辑

```
/edit-article
```

**用途：** 改进技术文档质量，提升可读性和准确性

**检查项：**
- 结构清晰度
- 代码示例正确性
- 术语一致性
- 格式规范性

### obsidian-vault — 知识管理

```
/obsidian-vault
```

**用途：** 建立 Obsidian 风格的个人知识库

**原则：**
- 原子化笔记：一个笔记一个概念
- 双向链接：相关概念互相引用
- 标签分类：便于检索

---

## 场景：Bug 修复 → diagnose

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

## 场景：代码混乱 → improve-codebase-architecture

```
/improve-codebase-architecture
```

**找深层模块的机会：**

- 哪个模块删掉后复杂度会消失？（pass-through）
- 哪个模块接口和实现一样复杂？（shallow）
- 哪里改了 bug，N 个地方都得跟着改？（无 locality）

**输出：** 候选列表 → 用户选 → grilling 对话 → 落实

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
| 接口设计 | `/design-an-interface` |
| 领域建模 | `/domain-model` |
| 迁移旧系统 | `/migrate-to-shoehorn` |
| 配置 git 钩子 | `/setup-pre-commit` |
| Git 安全护栏 | `/git-guardrails-claude-code` |
| GitHub 分诊 | `/github-triage` |
| 质量保证 | `/qa` |
| 建立术语库 | `/ubiquitous-language` |
| 重构计划 | `/request-refactor-plan` |
| 练习脚手架 | `/scaffold-exercises` |
| 编辑文章 | `/edit-article` |
| 知识库管理 | `/obsidian-vault` |

---

## 三大工程信条

1. **沟通对齐先于实现** — grill 类 skill 解决 agent 理解偏差
2. **快速反馈驱动开发** — TDD + diagnose 确保代码正确
3. **模块深度优于广度** — improve-codebase-architecture 驱动架构演进