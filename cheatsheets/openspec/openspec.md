---
title: OpenSpec
lang: bash
version: "0.18.0"
date: "2026-03-13"
github: Fission-AI/OpenSpec
colWidth: 380px
---

# OpenSpec

## 🧭 定位与核心原则
---
lang: bash
emoji: 🧭
link: https://openspec.dev/docs/getting-started
desc: OpenSpec 用一套可追踪的规格与变更目录，把“先对齐意图，再让 AI 实施”固定下来。
---

- `spec-first` : 先写变更提议、规格和任务，再开始编码
- `iterative` : 允许边探索边细化，不要求一次写完全部设计
- `shared-context` : 人与 AI 共享 `openspec/` 目录中的真源文档
- `change-driven` : 每次功能调整都围绕一个 change 展开，方便评审与归档

### 什么时候适合用

- 需求容易变形，想先锁定边界和验收标准
- 多个 AI 助手协作，需要共享同一套上下文
- 需要把变更历史沉淀为长期规格，而不是只留在对话里

## 🚀 最短工作流
---
lang: bash
emoji: 🚀
link: https://openspec.dev/docs/workflows
desc: 新版 Artifact Workflow 适合大多数场景，只有三步，适合作为默认入口。
---

### 典型路径

- `/opsx:propose <change-name>` : 生成 proposal、spec、tasks 等核心产物
- `/opsx:apply` : 按任务清单执行实现
- `/opsx:archive` : 合并结果并归档 change

### 一句话理解

- `propose` : 把“要做什么”落成文档
- `apply` : 把文档变成实现
- `archive` : 把临时 change 沉淀回主规格

```bash
# 1. 提议变更
/opsx:propose add-sso-login

# 2. 按任务实施
/opsx:apply

# 3. 归档到主规格
/opsx:archive
```

## 🪜 扩展工作流（旧版命令）
---
lang: bash
emoji: 🪜
link: https://openspec.dev/docs/workflows
desc: 旧版流程更细，适合你想逐步产出 proposal、design、tasks 时使用。
---

### 逐步创建

- `/opsx:new <change-name>` : 初始化一个 change
- `/opsx:continue <change-name>` : 按顺序补齐后续文档
- `/opsx:ff <change-name>` : 一次性快速生成全部工件

### 执行与校验

- `/opsx:apply` : 依据任务实现
- `/opsx:verify` : 检查实现与工件是否一致
- `/opsx:sync` : 把 delta spec 同步回主规格
- `/opsx:archive <change-name>` : 归档指定 change

```bash
/opsx:new add-sso-login
/opsx:continue add-sso-login
/opsx:apply
/opsx:verify
/opsx:sync
/opsx:archive add-sso-login
```

## 🔎 探索与辅助命令
---
lang: bash
emoji: 🔎
link: https://openspec.dev/docs/getting-started
desc: 在正式起草规格前，先用探索类命令厘清问题范围，页面会更干净，后续工件也更稳定。
---

- `/opsx:onboard` : 新手引导，快速理解完整 workflow
- `/opsx:explore [topic]` : 讨论需求、风险、方案与取舍
- `/opsx:propose` : 当需求已经明确时，直接进入规格产出

### 推荐节奏

- 模糊需求先 `explore`
- 明确目标后再 `propose`
- 大改动再进入 `apply / verify / archive`

## 🧰 CLI 常用命令
---
lang: bash
emoji: 🧰
link: https://openspec.dev/docs/cli
desc: CLI 适合本地仓库初始化、查看变更状态和执行校验，不依赖具体 AI 客户端。
---

- `openspec init` : 初始化 OpenSpec 目录
- `openspec list` : 查看当前 changes
- `openspec show <change>` : 查看指定 change
- `openspec view` : 查看当前规格总览
- `openspec validate <change>` : 校验某个 change 的完整性
- `openspec archive <change> --yes` : 无交互归档
- `openspec update` : 刷新模板或配置
- `openspec config profile` : 切换 workflow 配置

```bash
openspec init
openspec list
openspec show add-sso-login
openspec validate add-sso-login
```

## 📁 目录结构与工件分工
---
lang: text
emoji: 📁
link: https://openspec.dev/docs/concepts
desc: `changes/` 存临时变更，`specs/` 存长期真源。理解这层分工后，页面阅读和维护都会更顺。
---

### 核心目录

- `openspec/changes/<change-name>/proposal.md` : 变更背景、目标、影响范围
- `openspec/changes/<change-name>/design.md` : 技术方案与取舍
- `openspec/changes/<change-name>/tasks.md` : 可执行任务清单
- `openspec/changes/<change-name>/specs/*.md` : 针对能力的 delta spec
- `openspec/specs/` : 归档后的主规格

```text
openspec/
├── changes/
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/
│           └── *.md
└── specs/
```

## 🧩 Delta Spec 写法
---
lang: markdown
emoji: 🧩
link: https://openspec.dev/docs/commands
desc: Delta spec 关注“新增、修改、删除了什么”，不是重写整份主规格。
---

### 最常见骨架

- `Requirement` : 描述能力要求
- `ADDED / MODIFIED / REMOVED` : 标记本次变更类型
- `Scenario` : 用 Given / When / Then 约束行为

```markdown
### Requirement: SSO 登录

[ADDED]

#### Scenario: 用户使用企业账号登录

- Given 用户已进入登录页
- When 用户点击 “Sign in with SSO”
- Then 系统应跳转到企业身份提供方
```

### 写作建议

- 一个 Requirement 只表达一个能力点
- Scenario 写用户可观察到的行为，而不是实现细节
- 先描述结果，再补充异常与边界场景

## 🧠 工具与协作方式
---
lang: bash
emoji: 🧠
link: https://openspec.dev/tools
desc: OpenSpec 本质是工作流层，不绑定单一 AI 助手；重点是让不同工具围绕同一套文档执行。
---

- `Claude Code / Cursor / VS Code / OpenCode` : 官方列出的常见工作入口
- `20+ AI 编码助手` : 通过斜杠命令或集成方式接入
- `共享目录` : 不同助手都围绕同一份 `openspec/` 工作
- `统一审查对象` : PR、代码评审和规格评审可以基于同一套工件

### 选择建议

- 需要最快落地：优先用 `propose -> apply -> archive`
- 需要严谨审查：补上 `design` 与 `verify`
- 需要多人/多 Agent 协作：保持 change 名称、任务粒度和 spec 命名一致
