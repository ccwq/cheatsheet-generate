---
title: Trellis 速查表
lang: bash
version: "0.3.10"
date: 2026-03-12
github: mindfold-ai/Trellis
colWidth: 460px
---

## 🌿 快速定位
---
lang: bash
emoji: 🌿
link: https://docs.trytrellis.app/
desc: Trellis 不是单纯的提示词文件，而是一套把 Spec、任务上下文、工作区记忆和多平台接入统一起来的 AI 编码工作流框架。
---

- 先把项目规范写进 `.trellis/spec/`，再让 Trellis 在会话里自动注入相关上下文。
- 把 PRD、实现上下文、检查上下文和任务状态放进 `.trellis/tasks/`，避免 AI 开发越做越散。
- 用 `.trellis/workspace/<user>/` 保存个人 journal 和会话连续性，让下一次接手不是空白上下文。
- 同一套结构可复用到 Claude Code、Cursor、Codex、OpenCode 等多个 AI coding 平台。
- 如果你只想临时跑一次 prompt，Trellis 可能偏重；如果你要长期维护团队协作规则，它就很合适。

## 🗂 仓库骨架
---
lang: text
emoji: 🗂
link: https://docs.trytrellis.app/guide/ch04-architecture
desc: 核心在 `.trellis/`，平台目录只是接入层；不要把注意力全放在 `AGENTS.md` 或 `.claude/` 上。
---

```text
.trellis/
├── spec/                    # 项目规范、模式、指南
├── tasks/                   # 任务 PRD、实现上下文、检查上下文、状态
├── workspace/
│   └── your-name/           # 个人 journal / 连续性记录
├── workflow.md              # 团队共享工作流规则
└── scripts/                 # 驱动整个流程的工具脚本
```

- `.trellis/` 是工作流源头，平台文件只是把这些规则接到不同 AI 工具里。
- 初始化后，按平台不同还可能生成 `.claude/`、`.cursor/`、`AGENTS.md`、`.agents/`、`.kilocode/`、`.kiro/` 等文件。
- 经验法则：共享规范进 `spec/`，任务过程进 `tasks/`，个人过程记录进 `workspace/`。

## 🚀 起手式
---
lang: bash
emoji: 🚀
link: https://docs.trytrellis.app/guide/ch02-quick-start
desc: 先装 CLI，再初始化当前仓库；`-u` 很关键，它决定你的个人工作区和会话记忆落点。
---

```bash
# 全局安装
npm install -g @mindfoldhq/trellis@latest

# 最小初始化
trellis init -u your-name

# 只启用你真实在用的平台
trellis init --cursor --opencode --codex -u your-name

# 从自定义模板仓库拉 Spec 模板
trellis init --registry https://github.com/your-org/your-spec-templates -u your-name
```

- `-u your-name`：创建 `.trellis/workspace/your-name/`，没有它就少了一层个人连续性。
- 先少开平台比全开更稳，避免仓库里生成一堆你根本不用的接入文件。
- 模板仓库适合团队统一起步，不适合拿来替代项目自己的真实规范沉淀。

## 🔁 起手工作流
---
lang: markdown
emoji: 🔁
link: https://docs.trytrellis.app/guide/ch08-real-world
desc: Trellis 的价值不在命令数量，而在这条固定节奏：先沉淀规则，再围绕任务推进，再把结果写回规范和记忆。
---

1. 把高信号规则写进 `spec/`，例如目录约束、评审标准、架构边界。
2. 从任务 PRD 或任务上下文开始，而不是每次在聊天框里重新解释背景。
3. 让 Trellis 为当前任务注入相关上下文，再进入编码、检查、修复。
4. 把这次决策、坑点和收尾动作记进 `workspace/` 或回写到 `spec/`。

- Trellis 的理想用法是“规则长期化，任务结构化，经验可复用”。
- 如果一次 bug 修完没有反哺到 Spec，下次大概率还会重复解释或重复犯错。

## 🧩 高价值 Recipes
---
lang: markdown
emoji: 🧩
link: https://docs.trytrellis.app/guide/ch08-real-world
desc: 下面这些场景最能体现 Trellis 的收益：给 AI 一次性立规矩、并行推进多任务、把调试经验沉淀成团队资产。
---

### 把项目知识一次性交给 AI
- 把编码规范、目录规则、评审偏好写进 `.trellis/spec/`。
- 把“什么文件能动、什么边界不能破”写得比“怎么写代码”更清楚。
- 避免把 Spec 写成大杂烩；按主题拆分，比一个超长总纲更容易注入和维护。

### 并行推进多个任务
- Trellis 推荐结合 `git worktree` 并行跑多个 AI 任务，而不是让一个分支同时承载多条任务链。
- 每个任务独立 worktree，能减少分支状态互踩、上下文串线和未提交修改相互污染。
- 适合“一个人多任务”或“多人多代理”同时推进的仓库。

### 把复杂 bug 变成组织记忆
- 修完难 bug 后，不只停在“能跑了”，还要补充根因、失败修复路径和预防措施。
- 预防措施优先写回 Spec、检查清单、测试约束，而不是只留在聊天记录里。
- 这样下一位 Agent 进场时拿到的是规则，而不是历史碎片。

## 🪄 内置 Slash Commands
---
lang: text
emoji: 🪄
link: https://docs.trytrellis.app/guide/ch05-commands
desc: 文档页明确给出了多类内置 slash command；它们更像工作流动作，而不是普通 CLI 子命令。
---

- `/brainstorm` : 先把方案、约束和风险摊开，再决定是否开工。
- `/parallel` : 为并行开发拆任务，配合 worktree 把多个 Agent 隔离开。
- `/check` : 做一致性和质量检查，适合进入提交前的校验阶段。
- `/break-loop` : 对棘手 bug 做根因复盘，目标是防止同类问题再发生。
- `/finish-work` : 收尾检查清单，覆盖代码质量、文档同步和手动验证。
- `/create-command` : 生成项目自定义命令，减少重复流程输入。
- `/integrate-skill` : 把外部 Skill 接入项目，收敛成统一入口。

### 什么时候优先用 slash command
- 流程固定、每次都要做的动作：优先命令化。
- 仍在探索、规则还没稳定：先写 Spec 或先用 `/brainstorm`，不要过早固化命令。

## 🔌 平台开关
---
lang: bash
emoji: 🔌
link: https://docs.trytrellis.app/guide/ch13-multi-platform
desc: Trellis 的核心价值是“同一套流程，多平台复用”；平台参数只是决定生成哪些接入层文件。
---

```bash
trellis init --cursor --codex --opencode -u your-name
trellis init --iflow --kilo --kiro -u your-name
trellis init --gemini --antigravity --qoder -u your-name
```

- 平台可以混搭，但建议只打开团队当前真的在用的几种。
- 平台接入方式会变，`.trellis/` 内的规则和任务结构才是长期资产。
- 如果团队跨多种 AI coding 工具协作，Trellis 能减少“每个平台都各写一套规则”的维护成本。

## ⚠️ 常见坑
---
lang: markdown
emoji: ⚠️
link: https://zread.ai/mindfold-ai/Trellis
desc: 从仓库结构和官方文档可以看出，Trellis 最容易失败的地方不是安装，而是把层次混用、把规则写散、把并行做成串行污染。
---

- 把所有规则全堆进一个超长总文件：注入命中率和维护性都会下降。
- 只写平台入口文件，不写 `.trellis/spec/`：最后还是回到每次手动解释项目。
- 并行任务不做 worktree 隔离：多个 Agent 很容易互相覆盖分支状态。
- 把 `workspace` 当团队共享规范仓：个人 journal 和团队规则应该分层。
- 修完问题不回写 Spec：Trellis 的“项目记忆”会退化成一次性聊天记录。

