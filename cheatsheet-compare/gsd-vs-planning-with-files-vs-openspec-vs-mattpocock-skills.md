# GSD vs planning-with-files vs OpenSpec vs mattpocock/skills vs Superpowers 五工具对比报告

**更新日期：** 2026/05/08（基于深度调研）

## 基本信息

| 属性 | GSD | planning-with-files | OpenSpec | mattpocock/skills | Superpowers |
|------|-----|---------------------|----------|-------------------|-------------|
| 定位 | 上下文工程 + 阶段式执行 + 多 Agent 编排 | AI Coding Agent 的持久化工作记忆 | AI 变更管理 + spec-first 工作流 | 工程导向的 agent skills 合集 | AI 编码代理的流程框架 + 可复用技能体系 |
| 版本 | 1.40.0 | v2.15.0 | 1.3.0 | 1.0.0（21 个 skills） | v5.0.7 |
| GitHub | gsd-build/get-shit-done | OthmanAdi/planning-with-files | Fission-AI/OpenSpec | mattpocock/skills | obra/superpowers |
| 维护状态 | 活跃（v1.40 迭代中） | 活跃（v2.15.0） | 活跃（开发 Workspaces） | 活跃（21 个 skills） | 活跃（v5.0.7） |
| 核心问题域 | 长任务 context rot、多阶段交接、质量门禁 | AI 金鱼记忆、上下文丢失、目标漂移 | 变更意图漂移、spec 与实现脱节 | Agent 沟通偏差、反馈缺失、代码腐化 | 流程随意、盲目实现、并行失控、验证缺失 |
| 工具支持数 | 9+ | 10+ | 20+ | 8+ | 5+（Claude Code/Cursor/Codex/OpenCode/Gemini CLI） |

## 定位差异

### GSD — 上下文工程 + 阶段执行系统

面向长任务的上下文工程框架，通过 `PROJECT.md`、`ROADMAP.md`、`STATE.md` + `phases/` 目录把项目生命周期切分成可管理的阶段。核心是 **phase 级别的 discuss → plan → execute → verify → ship 循环**，配合 wave 执行、原子提交、多 Agent 编排。适合需要数天乃至数周的大型实现任务。

### planning-with-files — 轻量持久化记忆

用 3-file pattern（`task_plan.md`/`findings.md`/`progress.md`）把 Agent 的工作记忆外置到文件系统。核心哲学是"把上下文窗口当 RAM，把文件系统当 Disk"。极轻量，不绑死具体开发方法，可跨 Claude Code、Codex、Hermes 等多种 Agent 使用。适合多步骤任务和研究调研。

### OpenSpec — 变更管理 + spec-first 工作流

用 `openspec/` 目录把变更意图、delta spec、设计和任务清单固定成 AI 与人共享的工作真源。重点不是写一堆规格文档，而是描述"这次改什么"。默认 core profile 三步走：`propose → apply → archive`。适合 brownfield 场景，描述增量变更而非全量系统说明。

### mattpocock/skills — 工程导向 skill 合集

每个 skill 专注一件事，可自由组合。grill 类解决理解偏差，TDD + diagnose 确保代码正确，improve-codebase-architecture 驱动架构演进。核心哲学是"Small, composable, model-agnostic"。适合想让 Agent 按工程流程工作的场景。

### Superpowers — AI 编码代理流程框架

把 brainstorming、计划、并行分解、测试、调试、审查和收尾固化成可复用技能体系。不是单一 CLI，而是给 Claude Code、Cursor、Codex、OpenCode、Gemini CLI 等工具提供 skills、commands、hooks、agents 的协作层。核心哲学是"先流程后实现"，强调完整开发周期的结构化覆盖。适合想让 Agent 按标准工程流程工作的场景。

## 功能矩阵

| 维度 | GSD | planning-with-files | OpenSpec | mattpocock/skills | Superpowers |
|------|-----|---------------------|----------|-------------------|-------------|
| 安装平台 | Claude Code/Gemini/Codex/Copilot 等 9+ | Claude Code/Codex/Gemini CLI/Hermes 等 10+ | Claude/Codex/Cursor/OpenCode/GitHub Copilot 等 20+ | Claude Code/Codex/Cursor/Continue 等 8+ | Claude Code/Cursor/Codex/OpenCode/Gemini CLI 等 5+ |
| 核心能力 | phase 管理、wave 执行、原子提交、multi-agent | 3-file 持久化、hook 提醒、2-Action Rule | propose/apply/archive、delta spec、schema 自定义 | 21 个 skills：grill/TDD/diagnose/triage 等 | 11 个 skills：brainstorming/plans/execute/TDD/debug/verify/review 等完整周期 |
| 配置复杂度 | 高（config.json、model profiles、workflow agents） | 低（主要是文件模板和 hook 配置） | 中（config.yaml、profile、schema） | 低（SKILL.md 即可） | 低到中（skills/commands/hooks/agents 目录结构） |
| 学习成本 | 高 | 低 | 中 | 中 | 中 |
| 自动化程度 | 高 | 低到中 | 中 | 中到高 | 中到高 |
| 适用任务长度 | 长（多阶段/多天） | 中到长 | 中到长 | 短到中 | 短到长 |
| 覆盖生命周期 | 完整（project init → ship） | 部分（工作记忆持久化） | 部分（变更管理） | 部分（工程方法论） | 完整（brainstorming → finishing） |

## 优势对比

### GSD 的优势

- **完整的 phase 生命周期**：discuss → plan → execute → verify → ship → complete → next milestone，每阶段有明确入口
- **Wave 并行执行**：基于依赖关系的并行策略，最大化利用上下文窗口
- **多 Agent 编排**：sub-agent 定义、worktree 隔离、model profile 切换
- **UI 设计合同**：前端阶段有独立的 UI-SPEC.md 和 6-pillar review
- **原子提交**：每个任务完成后立即提交，Git bisect 精确定位失败

### planning-with-files 的优势

- **极简心智模型**：Context Window = RAM，Filesystem = Disk，任何 Agent 都能用
- **跨平台兼容**：17+ AI Coding Agent 支持，Claude Code/Cursor/Codex/Gemini CLI 皆可
- **2-Action Rule**：简单规则确保研究发现不丢失
- **目录管理灵活**：可放项目根目录或 `.planning/` 子目录
- **零强制流程**：不绑死具体开发方法论，只是文件化工作流骨架

### OpenSpec 的优势

- **Brownfield 友好**：重点描述"这次改什么"，不需要重写整份系统说明
- **Delta spec**：用 ADDED/MODIFIED/REMOVED 描述增量变化，清晰可追溯
- **多工具支持**：25+ AI 工具接入，初始化时批量生成 skills/commands
- **Schema 自定义**：可定义 artifact 依赖图，定制工作流
- **并行 change**：change 是文件夹，并行 workstream 更容易控边界

### mattpocock/skills 的优势

- **工程先于实现**：grill 类 skill 确保 agent 彻底理解需求再动手
- **TDD 垂直切片**：红绿重构 + 一次只写一个测试的开发节奏
- **六阶段 debug 循环**：没有可重复的失败信号不进入 Phase 2
- **可组合**：每个 skill 专注一件事，可按场景自由组合
- **caveman 压缩沟通**：减少 token 消耗而不丢失核心信息
- **21 个 skills 覆盖完整工程生命周期**（Planning & Design 8 个、Development & Refactoring 6 个、Engineering & Security 4 个、Writing & Knowledge 3 个）

### Superpowers 的优势

- **完整开发周期覆盖**：从 brainstorming 到 finishing-a-development-branch，11 个 skills 覆盖完整开发闭环
- **多平台接入**：Claude Code/Cursor/Codex/OpenCode/Gemini CLI 统一技能体系，跨客户端体验一致
- **并行与隔离机制**：subagent-driven-development + using-git-worktrees 提供完整并行协作方案
- **验证与审查闭环**：verification-before-completion + requesting-code-review 确保交付质量
- **零强制流程但有建议路径**：不绑死具体方法，但提供明确触发顺序建议（brainstorming → writing-plans → ... → finishing）
- **协作层设计**：skills/commands/hooks/agents 分层，插件市场便于更新管理

## 劣势对比

### GSD 的劣势

- **学习曲线陡峭**：phase、wave、workstream、workspace 多层概念需要时间理解
- **配置复杂**：config.json、model profiles、workflow agents 需要仔细阅读文档
- **文件膨胀**：每个 phase 产生 6+ 文件，phases/ 目录可能变得庞大
- **版本信息不明确**：调研未发现明确 v2 发布，现有 v1.40 持续迭代

### planning-with-files 的劣势

- **不负责 TDD**：不强制测试驱动开发，不负责复杂多 Agent 编排
- **不提供 spec-driven pipeline**：更多是文件化工作流骨架，不是完整开发系统
- **hook 依赖**：需要特定版本和 hooks 配置，新人可能遇到"没触发"问题
- **适合性问题**：不适合简单问答、单文件小改动、快速查询

### OpenSpec 的劣势

- **默认 profile 限制**：core profile 已经很好用，但 expanded workflow 需要额外配置
- **schema 学习成本**：delta spec 和 schema 自定义需要理解 OpenSpec 概念模型
- **变更边界模糊**：同一个 intent 何时更新现有 change 何新开的判断需要经验
- **目录结构复杂**：`openspec/specs/` + `changes/` + `.openspec.yaml` + `config.yaml` 多层嵌套
- **即将推出的 Workspaces 功能尚未发布**：团队协作场景尚需等待

### mattpocock/skills 的劣势

- **缺乏完整生命周期**：没有从 project init 到 ship 的完整流程覆盖
- **不处理多 Agent**：主要是单 agent 的工程流程优化，不涉及多 agent 协作
- **缺少持久化机制**：不像 planning-with-files 有文件持久化，主要靠 skill 内的流程
- **skill 之间无依赖管理**：可组合但没有显式的依赖声明和执行顺序

### Superpowers 的劣势

- **流程框架而非具体实现**：提供 skills 但不提供具体开发规范（如代码风格、架构模板）
- **平台覆盖少于 OpenSpec**：目前仅支持 5+ 平台，少于 OpenSpec 的 20+
- **缺少变更管理视角**：不像 OpenSpec 那样专注"这次改什么"的 delta spec
- **gRPC/Config 驱动型框架**：理解成本高于简单文件模板
- **skill 组合需要经验**：11 个 skills 可自由组合，但新手可能不知从何起步

## 适用场景

| 场景 | 推荐 | 理由 |
|------|------|------|
| 从 0 到 1 搭项目 | GSD | phase 管理、wave 执行、原子提交，适合大型新建任务 |
| 多文件、多阶段、多天的大型实现 | GSD | phase 级别的 discuss → plan → execute → verify → ship 循环 |
| 多 Agent 分工和编排 | GSD / Superpowers | GSD 重量级编排，Superpowers 轻量并行协作 |
| 调研任务、多步骤开发 | planning-with-files | 3-file pattern 防止上下文丢失，2-Action Rule 确保发现不遗漏 |
| 临时性复杂任务（不需要完整规划） | planning-with-files / GSD quick mode | planning-with-files 轻量，GSD quick mode 有完整保障 |
| 增量变更（brownfield） | OpenSpec | delta spec 描述"本次改动"，不是重写整份系统说明 |
| 多人协作的变更评审 | OpenSpec | proposal/specs/design/tasks 工件清晰，verify 有明确落点 |
| 需求模糊，先探索再落规格 | OpenSpec explore → propose / Superpowers brainstorming | OpenSpec explore → propose 先调查后提议，Superpowers brainstorming 快速澄清 |
| 让 agent 彻底理解需求再动手 | mattpocock/skills / Superpowers brainstorming | mattpocock grill 追问机制，Superpowers brainstorming 流程规范 |
| Bug 修复 | mattpocock/skills diagnose / Superpowers systematic-debugging | mattpocock 六阶段 debug 循环，Superpowers 结构化复现→定位→修复→验证 |
| 测试驱动开发 | mattpocock/skills tdd / Superpowers test-driven-development | 两者都强调红→绿→重构节奏 |
| Issue 分诊和状态机流转 | mattpocock/skills triage | unlabeled → needs-triage 五选一状态机 |
| 压缩 token 消耗 | mattpocock/skills caveman | 删除 articles/filler，短词替代长词 |
| 中等复杂度代码任务（工程流程优化） | mattpocock/skills + planning-with-files / Superpowers | Superpowers 一站式覆盖完整开发周期 |
| 轻量日常任务 | planning-with-files | 最小可用的持久化工作记忆 |
| 跨平台统一开发流程 | Superpowers | 5+ 平台统一 skill 体系，跨客户端体验一致 |
| 需要验证与审查闭环 | Superpowers | verification-before-completion + requesting-code-review 双闭环 |
| 并行代理协作 + git worktree | Superpowers | subagent-driven-development + using-git-worktrees 完整方案 |

## 综合评价

这五个工具解决的是不同层面的问题，可以互补，不存在绝对优劣。

**GSD** 是重量级项目管理系统，适合需要数周的大型实现，强调 phase 级别的完整生命周期和 wave 并行执行，但学习成本最高。

**planning-with-files** 是极简工作流骨架，核心是把 Agent 的工作记忆外置到文件系统，适合任何需要持久化上下文的复杂任务，跨平台兼容性最好。

**OpenSpec** 是变更管理工具，重点是"这次改什么"的增量规格，适合 brownfield 场景的变更协作，20+ 工具接入是最大亮点。

**mattpocock/skills** 是工程方法论 skill 合集，解决"沟通偏差、反馈缺失、代码腐化"三大失败模式，grill/TDD/diagnose 可按需组合，适合想让 Agent 按工程流程工作的团队。

**Superpowers** 是 AI 编码代理的流程框架，通过 11 个 skills 把完整开发周期固化成可复用流程，强调"先流程后实现"，跨 5+ 平台统一技能体系，适合想让 Agent 按标准工程流程工作且需要完整开发闭环的场景。

层级关系可理解为：`planning-with-files` → 最小可用的持久化工作记忆；`mattpocock/skills` → 工程方法论 + Skill 驱动开发流程；`Superpowers` → 完整开发周期 + 多平台统一流程框架；`OpenSpec` → 变更管理 + spec-first 工作流；`GSD` → 上下文工程 + spec-driven + 多阶段 Agent 编排（最重量级）。

## 组合使用建议

```
轻量日常任务           → planning-with-files
中等复杂代码任务        → mattpocock/skills + planning-with-files / Superpowers
增量变更/多人协作       → OpenSpec
大型项目级开发          → GSD
跨平台统一流程          → Superpowers
需要完整开发闭环        → Superpowers（brainstorming → finishing）
```

## 生态趋势（2026 年 5 月）

| 趋势 | 说明 |
|------|------|
| **多工具集成成为主流** | OpenSpec 支持 20+ 编码代理是明显信号 |
| **从 vibe coding 到工程导向** | Mattpocock 的"Skills for Real Engineers"理念被广泛接受 |
| **持久化记忆解决 context rot** | planning-with-files 的 3-file pattern 被多个工具借鉴 |
| **Spec-driven 文档化** | OpenSpec 代表的 spec-first 工作流在 brownfield 场景越来越受欢迎 |
| **四大失败模式方法论** | mattpocock/skills 的 Misalignment/Verbose Output/Broken Code/Software Entropy 框架被系统化 |

### 社区动态

- **Superpowers**：v5.0.7 发布，插件市场推动跨平台统一，obra/superpowers 持续活跃
- **mattpocock/skills**：2026 年 5 月被腾讯云开发者社区推荐为"本周明星"，被 awesome-agent-skills 项目索引
- **planning-with-files**：v2.15.0 发布，Manus AI 收购（$2B）激励了类似工作流的发展
- **OpenSpec**：即将推出 Workspaces 功能，面向团队协作
- **GSD**：v1.40 持续迭代，社区端口覆盖 9+ 运行时

## 参考来源

### Cheatsheet 源文件
- GSD：`cheatsheets/gsd/gsd.md` 和 `refmap.md`
- planning-with-files：`cheatsheets/planning-with-files/planning-with-files.md` 和 `refmap.md`
- OpenSpec：`cheatsheets/openspec/openspec.md` 和 `refmap.md`
- mattpocock/skills：`cheatsheets/mattpocock-skills/mattpocock-skills.md` 和 `refmap.md`
- Superpowers：`cheatsheets/superpowers/superpowers.md` 和 `refmap.md`

### 调研报告
- `research_ai_coding_skills/research_report.md`（2026/05/08 深度调研）