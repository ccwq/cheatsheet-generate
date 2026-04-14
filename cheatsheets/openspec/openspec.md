---
title: OpenSpec 速查 + Cookbook
lang: bash
version: "1.3.0"
date: "2026-04-11"
github: Fission-AI/OpenSpec
colWidth: 420px
---

# OpenSpec 速查 + Cookbook

## 快速定位 / 一眼入口
---
lang: bash
emoji: 🧭
link: https://openspec.dev/docs/getting-started
desc: OpenSpec 现在的主线不是“写一堆规格文档”，而是用 `openspec/` 把变更意图、delta spec、设计和任务清单固定成 AI 与人共享的工作真源。推荐读法：先抄最短路径跑起来，再按场景回看扩展 workflow、CLI 和 schema 速查。
---

### 这东西解决什么问题

- 聊天记录会漂，`openspec/` 不会：把“要改什么”落到仓库里。
- 适合 brownfield：重点描述“这次改什么”，不是重写整份系统说明。
- AI 工具能共享同一份 change 和 spec，评审也有明确落点。

### 官方哲学速记

```bash
fluid not rigid
iterative not waterfall
easy not complex
brownfield-first
```

### 先看哪条入口

```bash
# 先装 CLI
npm install -g @fission-ai/openspec@latest

# 进入项目并初始化
cd your-project
openspec init

# 默认 core profile 的最短路径
/opsx:propose add-dark-mode
/opsx:apply
/opsx:archive
```

## 安装与初始化
---
lang: bash
emoji: 🧰
link: https://github.com/Fission-AI/OpenSpec
desc: 官网 README 已把安装门槛明确成 `Node.js 20.19.0+`。初始化的关键不是只生成 `openspec/`，还会按你选的工具和 profile 生成对应 skills / commands。
---

### 最小安装要求

```bash
# Node.js 要求
node --version

# 安装或升级 OpenSpec
npm install -g @fission-ai/openspec@latest
```

### 初始化常用写法

```bash
# 交互式初始化
openspec init

# 指定目录初始化
openspec init ./my-project

# 非交互：只配置 Claude + Codex
openspec init --tools claude,codex

# 非交互：全部支持工具
openspec init --tools all

# 只切 profile，不改全局配置之外的其他东西
openspec init --profile core
```

### Quick Ref

- `openspec/`：主目录，至少包含 `specs/`、`changes/`、`config.yaml`
- `--tools <list>`：批量生成工具接入文件
- `--profile core|custom`：初始化时覆盖 workflow profile
- `openspec update`：升级 CLI 后刷新本地指令文件

## 最小工作流
---
lang: bash
emoji: 🚀
link: https://openspec.dev/docs/workflows
desc: 截至 2026-04-14，官方默认是 `core` profile，不再默认暴露整套扩展命令。对大多数仓库，直接记住 `propose -> apply -> archive` 就够用。
---

### 默认 core profile

```bash
# 1) 让 AI 生成 change + 规划工件
/opsx:propose add-sso-login

# 2) 按 tasks.md 执行实现
/opsx:apply

# 3) 归档并把 delta specs 合回主 specs
/opsx:archive
```

### 三步分别在干嘛

```bash
/opsx:propose   # 建 change，并生成 proposal/specs/design/tasks
/opsx:apply     # 读取 tasks.md，逐项实现并勾选
/opsx:archive   # 归档 change，必要时提示先 sync specs
```

### Quick Ref

- 需求已经清楚：直接 `propose`
- 需求还模糊：先 `/opsx:explore`
- 只想走最短路径：保持 `core` profile，不必先启用 expanded workflow

## 高频场景 Recipes
---
lang: bash
emoji: 🍳
link: https://openspec.dev/docs/commands
desc: OpenSpec 最容易上手的方式不是背完整命令表，而是先按场景选路线。下面这几条基本覆盖日常仓库里的高频打法。
---

### Recipe 1：需求模糊，先探索再落规格

```bash
/opsx:explore auth flow for mobile app
/opsx:propose add-mobile-jwt-auth
/opsx:apply
```

- `explore` 不会创建工件，适合先调查代码、讨论方案、缩范围。
- 方向清晰后再 `propose`，比一开始就硬写 proposal 稳。

### Recipe 2：默认三步跑一个中小改动

```bash
/opsx:propose add-dark-mode
/opsx:apply
/opsx:archive
```

- 这是现在的官方主路线，适合大多数 feature / bugfix。
- `archive` 会检查工件和 spec 同步状态，必要时提示先 merge delta。

### Recipe 3：想精细控制工件生成，切 expanded workflow

```bash
# 先启用扩展工作流
openspec config profile
openspec update

# 再用显式 scaffold 流程
/opsx:new add-bulk-export
/opsx:continue
/opsx:continue
/opsx:apply
/opsx:verify
/opsx:archive
```

- `continue` 适合你想逐个审 proposal / specs / design / tasks。
- 如果范围很清楚，可以直接把多次 `continue` 换成 `/opsx:ff`。

### Recipe 4：并行 change，不把上下文搅在一起

```bash
/opsx:new add-dark-mode
/opsx:ff
/opsx:apply

/opsx:new fix-login-redirect
/opsx:ff
/opsx:apply
/opsx:archive
```

- change 是文件夹，不是对话标签，所以并行 workstream 更容易控边界。
- 需要回到某条 change 时，显式传 change 名称比靠上下文猜更稳。

### Recipe 5：归档前做一次核对

```bash
/opsx:verify add-auth
/opsx:archive add-auth
```

- `verify` 主要看三件事：完整性、正确性、一致性。
- 它不会强制阻塞 archive，但很适合在 PR 前先补一轮人工审查口径。

## 扩展工作流 / Expanded Mode
---
lang: bash
emoji: 🪜
link: https://openspec.dev/docs/workflows
desc: 扩展工作流不是默认开着的。它的价值在于把“起 scaffold、逐件生成、验证、同步、多变更归档”拆成显式动作，适合复杂项目或多人协作。
---

### 如何启用

```bash
openspec config profile
openspec update
```

### 扩展命令速记

```bash
/opsx:new           # 只创建 change scaffold
/opsx:continue      # 创建下一个 ready artifact
/opsx:ff            # 一次性生成全部 planning artifacts
/opsx:verify        # 对照 artifacts 验证实现
/opsx:sync          # 手动把 delta specs 合回主 specs
/opsx:bulk-archive  # 批量归档已完成 changes
/opsx:onboard       # 用真实代码库做一次引导式上手
```

### 什么时候选 `ff`，什么时候选 `continue`

```bash
范围清楚 / 想快一点         -> /opsx:ff
想逐件审 proposal/specs      -> /opsx:continue
要边探索边收敛              -> /opsx:continue
复杂改动 / 需要更多控制      -> /opsx:continue
```

## 目录结构与工件分工
---
lang: text
emoji: 📁
link: https://openspec.dev/docs/concepts
desc: OpenSpec 的核心分层很简单：`specs/` 描述系统当前真相，`changes/` 描述准备合入的变化。理解这对目录，比死记命令更重要。
---

### 主目录骨架

```text
openspec/
├── specs/
│   └── <domain>/spec.md
├── changes/
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       ├── .openspec.yaml
│       └── specs/
│           └── <domain>/spec.md
└── config.yaml
```

### 各工件分别回答什么问题

```bash
proposal.md   # 为什么做、改到哪、先不做什么
specs/*.md    # 行为层改了什么（delta）
design.md     # 技术方案与关键取舍
tasks.md      # 可执行 checklist
```

### Quick Ref

- `specs/`：当前 source of truth
- `changes/`：还没归档的变更提案
- `.openspec.yaml`：change 级 schema / metadata
- `config.yaml`：项目级 schema、context、rules

## Delta Spec / Schema Quick Ref
---
lang: markdown
emoji: 🧩
link: https://openspec.dev/docs/concepts
desc: OpenSpec 的 brownfield 能力主要靠 delta spec 和 schema。前者描述“本次改动”，后者定义“工件和依赖图”。
---

### Delta spec 最常抄的骨架

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: SSO Login
The system MUST support SSO login for enterprise tenants.

#### Scenario: Redirect to identity provider
- GIVEN a tenant with SSO enabled
- WHEN the user clicks "Sign in with SSO"
- THEN the system redirects to the configured identity provider

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.

## REMOVED Requirements

### Requirement: Legacy remember-me login
```

### Delta section 速记

```bash
ADDED      # 新增行为
MODIFIED   # 修改既有行为
REMOVED    # 删除既有行为
```

### Schema / 自定义 workflow 抓手

```bash
openspec schemas
openspec templates
openspec schema init research-first
openspec schema fork spec-driven my-workflow
openspec schema validate my-workflow
openspec schema which my-workflow
```

### 最小 schema 示例

```yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

## Quick Ref / CLI 命令与参数
---
lang: bash
emoji: 🛠️
link: https://openspec.dev/docs/cli
desc: CLI 不是为了替代 `/opsx:*`，而是给人和脚本提供初始化、查看、校验、状态判断、schema 管理等能力。2026-04 的 CLI 已明显比旧稿更丰富。
---

### 核心命令

```bash
openspec init
openspec update
openspec list
openspec view
openspec show <item>
openspec validate
openspec archive <change>
openspec status --change <id>
openspec instructions [artifact] --change <id>
openspec templates
openspec schemas
openspec config profile
```

### schema 子命令

```bash
openspec schema init <name>
openspec schema fork <source> [name]
openspec schema validate [name]
openspec schema which [name]
```

### 对 Agent / 脚本更友好的命令

```bash
openspec list --json
openspec show add-dark-mode --json
openspec validate --all --json
openspec status --change add-dark-mode --json
openspec instructions design --change add-dark-mode --json
openspec templates --json
openspec schemas --json
```

### 高频参数

```bash
--json             # 结构化输出，适合 agent / script
--all              # 批量校验 changes/specs
--strict           # 更严格的 validate
--concurrency <n>  # validate 并发数
--force            # init/update/schema 时强制覆盖或跳过提示
--profile <name>   # init 时覆盖 profile
-y, --yes          # archive 时跳过确认
```

## 工具接入 / 生态
---
lang: bash
emoji: 🤝
link: https://openspec.dev/tools
desc: OpenSpec 不绑定单一 AI 客户端。当前官方文档明确支持 25+ 工具，初始化时会按工具类型生成 skills、commands，或两者一起生成。
---

### 常见工具入口

- `Claude Code`：`.claude/skills/openspec-*/SKILL.md` + `.claude/commands/opsx/*.md`
- `Codex`：`.codex/skills/openspec-*/SKILL.md`，命令装到 `$CODEX_HOME/prompts/`
- `Cursor`：`.cursor/skills/openspec-*/SKILL.md` + `.cursor/commands/opsx-*.md`
- `OpenCode`：`.opencode/skills/openspec-*/SKILL.md` + `.opencode/commands/opsx-*.md`
- `GitHub Copilot`：`.github/skills/openspec-*/SKILL.md` + `.github/prompts/*.prompt.md`

### 2026-04 文档里能确认的接入面

```bash
amazon-q  antigravity  auggie  bob  claude  cline
codex     codebuddy    continue costrict crush cursor
factory   forgecode    gemini  github-copilot iflow junie
kilocode  kiro         opencode pi qoder qwen
roocode   trae         windsurf
```

### Quick Ref

- `openspec init --tools all`：为全部支持工具生成配置
- `delivery` 与 `profile` 会影响实际生成多少 skills / commands
- `ForgeCode`、`Trae` 这类工具的命令交付方式和 Claude/Cursor 不完全相同，优先按官方表查目录

## 决策点 / 常见坑
---
lang: bash
emoji: ⚖️
link: https://github.com/Fission-AI/OpenSpec
desc: OpenSpec 真的容易翻车的地方，不是命令太多，而是把默认 core、expanded workflow、delta spec、项目配置这几层混成一团。下面这块主要帮你防踩坑。
---

### 先判断该更新现有 change，还是新开一个

```bash
同一个 intent，只是范围收窄/方案修正    -> 更新现有 change
已经变成另一件事，或 scope 爆炸         -> 新开 change
原 change 已可单独完成                  -> archive 后再开新 change
```

### 常见误区

- 误以为 `/opsx:new` 是默认入口：不是，默认入口已经是 `/opsx:propose`。
- 改了全局 profile 却没跑 `openspec update`：本地生成的 skills / commands 不会自动刷新。
- 把 spec 写成实现文档：spec 关注行为，设计细节应进 `design.md`。
- 归档前不看 verify：小改动可以省，但中大型变更最好跑一轮。

### 项目配置记忆法

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Vitest + Playwright

rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then
```

### 经验规则

- `context` 像前端项目里的共享约束，所有 artifact 都会注入。
- `rules` 像按工件分桶的 lint 规则，只对匹配 artifact 生效。
- schema precedence 记成：CLI 参数 > `.openspec.yaml` > `openspec/config.yaml` > 默认值。
