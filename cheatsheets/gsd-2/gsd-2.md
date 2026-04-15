---
title: GSD 2
lang: bash
version: 2.64.0
date: 2026-04-06
github: gsd-build/gsd-2
colWidth: 500px
---

# GSD 2 — Cookbook + Cheatsheet

<!-- desc: 自主式 AI 编码 Agent，支持 Auto Mode、并行编排、动态模型路由，实现"一键启动、无人值守、干净 Git 历史"的里程碑驱动开发 -->



## Quick Ref — 最短命令链

```bash
# 一句话安装并启动
npm install -g gsd-pi && gsd

# 登录
gsd → /login

# 自主任意执行
gsd → /gsd auto

# 单步执行（学习阶段）
gsd → /gsd

# 查看状态
gsd → /gsd status

# 暂停/恢复
Escape → /gsd auto

# Headless CI
gsd headless --timeout 600000 auto

# 即时状态查询
gsd headless query | jq '.state.phase'
```
---

## 🧭 一眼入口

<!-- desc: GSD 2 是什么、解决什么问题、先看哪、最短路径 -->

### 这是什么

**GSD 2 (Get Shit Done v2)** — 基于 Pi SDK 构建的自主式 AI 编码 Agent。与 v1 的 prompt 框架不同，v2 是能真正控制 Agent 会话的 TypeScript 应用。

**解决的问题：**

| v1 (Prompt 框架) | v2 (Agent 应用) |
|---|---|
| 靠 LLM 自己管理上下文 | 每个任务独立上下文窗口 |
| LLM 自我循环 | 状态机驱动，文件持久化 |
| 无崩溃恢复 | 锁文件 + 会话溯源 |
| 无成本追踪 | SQLite 逐单元记账 |

**核心理念：** `npm install -g gsd-pi && gsd` → 启动 → 离开 → 回来时项目已完成，Git 历史干净。

### 技术栈

- **运行时：** Node.js ≥ 22.0.0（24 LTS 推荐）
- **Agent 框架：** Pi SDK
- **语言：** TypeScript
- **状态存储：** SQLite + Markdown 文件
- **扩展系统：** 24 个内置扩展 + MCP 服务器

### 最短路径

```
安装 → 登录 Provider → /gsd auto → 等结果
```

---

## 🚀 Cookbook — 核心工作流

### 快速启动

#### 安装

```bash
npm install -g gsd-pi@latest
```

#### 首次登录

```bash
gsd
/login
```

支持 20+ Provider：Anthropic、OpenAI、Google、OpenRouter、GitHub Copilot、AWS Bedrock、Azure 等。

#### 切换模型

```bash
/model
```

---

### 工作层级

```
Milestone  →  可发布的版本（4-10 个 Slice）
  Slice    →  可演示的垂直能力（1-7 个 Task）
    Task   →  一次上下文窗口大小的单元
```

**铁律：Task 必须能塞进一次上下文窗口。塞不进去就是两个 Task。**

---

### Auto Mode — 主工作流

#### 启动

```bash
gsd
/gsd auto
```

#### Auto Loop 流程

```
Plan → Execute → Complete → Reassess Roadmap → Next Slice
                                            ↓ (全部完成)
                              Validate Milestone → Complete Milestone
```

| 阶段 | 说明 |
|------|------|
| **Plan** | 侦察代码库、研究文档、分解为带验收标准的 Task |
| **Execute** | 独立上下文窗口执行，验证命令自动运行 |
| **Complete** | 写摘要、UAT 脚本、标记路线图、提交 |
| **Reassess** | 检查路线图是否仍然合理 |
| **Validate Milestone** | 核对成功标准与实际结果 |

#### 控制命令

| 命令 | 说明 |
|------|------|
| `Escape` | 暂停（对话保留） |
| `/gsd auto` | 恢复 |
| `/gsd stop` | 优雅停止 |
| `/gsd steer` | 运行时硬调计划文档 |

---

### Step Mode — 逐步执行

```bash
/gsd       # 等同于 /gsd next，显式单步模式
/gsd next
```

**入口判断逻辑：**

| 状态 | 动作 |
|------|------|
| 无 `.gsd/` | 启动讨论流，捕获项目愿景 |
| 有 Milestone 无 Roadmap | 讨论或研究 |
| 有 Roadmap | 规划下一 Slice 或执行 Task |
| 执行中 | 从断点恢复 |

---

### 双终端工作流

推荐用法：一个终端跑 Auto，一个终端指挥。

**终端 1 — 让它跑：**

```bash
gsd
/gsd auto
```

**终端 2 — 边工作边指挥：**

```bash
gsd
/gsd discuss    # 讨论架构决策
/gsd status     # 查看进度
/gsd queue      # 队列下一个 Milestone
```

两终端读写同一 `.gsd/` 文件，无需停止 Auto Mode。

---

### 最小配置

`.gsd/PREFERENCES.md`：

```yaml
---
version: 1
models:
  research: claude-sonnet-4-6
  planning: claude-opus-4-6
  execution: claude-sonnet-4-6
  completion: claude-sonnet-4-6
skill_discovery: suggest
auto_supervisor:
  soft_timeout_minutes: 20
  idle_timeout_minutes: 10
  hard_timeout_minutes: 30
budget_ceiling: 50.00
token_profile: balanced
---
```

---

### 高频 Recipes

#### Recipe: 预算紧张时

```yaml
token_profile: budget        # 节省 40-60% token
dynamic_routing:
  enabled: true              # 自动降级简单任务到便宜模型
budget_ceiling: 20.00
```

#### Recipe: 并行多里程碑

```yaml
parallel:
  enabled: true
  max_workers: 2
  budget_ceiling: 100.00
```

```bash
/gsd parallel start    # 分析 eligibility 并启动
/gsd parallel status   # 查看所有 worker 状态
/gsd parallel stop     # 停止全部
```

#### Recipe: 团队协作

```yaml
mode: team                           # 唯一里程碑 ID、关闭 auto_push
unique_milestone_ids: true
git:
  auto_push: false
  push_branches: true
  pre_merge_check: true
```

#### Recipe: 本地模型 (Ollama)

`~/.gsd/agent/models.json`：

```json
{
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434/v1",
      "api": "openai-completions",
      "apiKey": "ollama",
      "models": [
        { "id": "llama3.1:8b" },
        { "id": "qwen2.5-coder:7b" }
      ]
    }
  }
}
```

#### Recipe: Git 隔离策略

```yaml
git:
  isolation: worktree    # 默认：每个 Milestone 独立工作树
  # isolation: branch    # 分支模式
  # isolation: none       # 无隔离，直接在当前分支
```

#### Recipe: 验证自动修复

```yaml
verification_commands:
  - npm run lint
  - npm run test
verification_auto_fix: true
verification_max_retries: 2
```

---

## 📋 Artifact 速查

| 文件 | 用途 |
|------|------|
| `PROJECT.md` | 项目当前状态 |
| `DECISIONS.md` | 架构决策注册表（只增不减） |
| `KNOWLEDGE.md` | 跨会话规则和模式 |
| `RUNTIME.md` | 运行时上下文（API endpoint、env 等） |
| `STATE.md` | 仪表板状态文件 |
| `M001-ROADMAP.md` | 里程碑计划（Slice 复选框、风险级别、依赖） |
| `S01-PLAN.md` | Slice 任务分解 |
| `T01-PLAN.md` | 单个 Task 计划 |
| `T01-SUMMARY.md` | 执行总结 |

---

## 🎛️ Cheatsheet — 命令速查

### 会话命令

| 命令 | 说明 |
|------|------|
| `/gsd` | Step Mode — 每步暂停 |
| `/gsd auto` | Autonomous Mode — 自主执行 |
| `/gsd quick` | 快速执行（跳过规划） |
| `/gsd next` | 显式单步 |
| `/gsd stop` | 优雅停止 |
| `/gsd pause` | 暂停 |
| `/gsd steer` | 硬调计划文档 |
| `/gsd discuss` | 讨论架构（可与 auto 并行） |
| `/gsd rethink` | 项目重组 |
| `/gsd status` | 进度仪表板 |
| `/gsd widget` | 切换仪表板部件：full / small / min / off |
| `/gsd queue` | 队列后续里程碑 |
| `/gsd capture` | 想法捕获（fire-and-forget） |
| `/gsd triage` | 手动触发 triage |
| `/gsd forensics` | 自动模式故障溯源 |
| `/gsd cleanup` | 清理状态文件 |
| `/gsd visualize` | 打开工作流可视化器 |
| `/gsd export --html` | 生成 HTML 报告 |
| `/gsd export --html --all` | 生成所有里程碑报告 |
| `/gsd update` | 更新到最新版本 |
| `/gsd knowledge` | 添加持久项目知识 |
| `/gsd history` | 查看执行历史 |

### 配置与诊断

| 命令 | 说明 |
|------|------|
| `/gsd prefs` | 全局配置向导 |
| `/gsd prefs global` | 全局偏好 |
| `/gsd prefs project` | 项目本地偏好 |
| `/gsd prefs status` | 查看当前偏好 |
| `/gsd prefs import-claude` | 导入 Claude 插件 |
| `/gsd mode` | 切换 solo / team 模式 |
| `/gsd config` | 重新运行设置向导 |
| `/gsd keys` | API Key 管理 |
| `/gsd doctor` | 运行健康检查 |
| `/gsd init` | 项目初始化向导 |
| `/gsd setup` | 全局设置状态 |
| `/gsd skill-health` | 技能健康仪表板 |
| `/gsd hooks` | 显示配置的 hooks |
| `/gsd migrate` | 迁移 v1 `.planning` |

### Milestone 管理

| 命令 | 说明 |
|------|------|
| `/gsd new-milestone` | 创建新里程碑 |
| `/gsd skip` | 跳过某单元 |
| `/gsd undo` | 撤销上一完成单元 |
| `/gsd undo-task` | 重置特定 Task |
| `/gsd reset-slice` | 重置 Slice 及所有 Task |
| `/gsd park` | 暂停里程碑 |
| `/gsd unpark` | 恢复里程碑 |
| `/gsd dispatch` | 强制执行特定阶段 |

### 并行编排

| 命令 | 说明 |
|------|------|
| `/gsd parallel start` | 启动并行 workers |
| `/gsd parallel status` | 查看所有 worker |
| `/gsd parallel stop [MID]` | 停止 worker |
| `/gsd parallel pause [MID]` | 暂停 worker |
| `/gsd parallel resume [MID]` | 恢复 worker |
| `/gsd parallel merge [MID]` | 合并到 main |

### 工作流模板 (v2.42+)

| 命令 | 说明 |
|------|------|
| `/gsd start` | 启动模板（bugfix/spike/feature/hotfix/refactor/security-audit/dep-upgrade/full-project） |
| `/gsd start resume` | 恢复进行中的工作流 |
| `/gsd templates` | 列出可用模板 |
| `/gsd workflow new` | 创建新工作流 |
| `/gsd workflow run <name>` | 运行工作流 |
| `/gsd workflow list` | 列出工作流运行 |
| `/gsd workflow pause` | 暂停工作流 |

### 扩展

| 命令 | 说明 |
|------|------|
| `/gsd extensions list` | 列出所有扩展 |
| `/gsd extensions enable <id>` | 启用扩展 |
| `/gsd extensions disable <id>` | 禁用扩展 |

### cmux 集成

| 命令 | 说明 |
|------|------|
| `/gsd cmux status` | cmux 状态 |
| `/gsd cmux on/off` | 开关 cmux |
| `/gsd cmux notifications on/off` | 桌面通知 |
| `/gsd cmux sidebar on/off` | 侧边栏元数据 |
| `/gsd cmux splits on/off` | 可视化子 Agent 分屏 |

### GitHub Sync

| 命令 | 说明 |
|------|------|
| `/github-sync bootstrap` | 初始化同步 |
| `/github-sync status` | 查看同步状态 |

### Git 命令

| 命令 | 说明 |
|------|------|
| `/worktree` 或 `/wt` | Git 工作树生命周期 |

### 会话管理

| 命令 | 说明 |
|------|------|
| `/clear` 或 `/new` | 新会话 |
| `/exit` | 优雅退出 |
| `/kill` | 立即终止 |
| `/model` | 切换模型 |
| `/login` | 登录 Provider |
| `/thinking` | 切换思考级别 |
| `/voice` | 开关语音转文字（macOS/Linux） |

---

### 键盘快捷键

| 快捷键 | 动作 |
|--------|------|
| `Ctrl+Alt+G` | 切换仪表板覆盖层 |
| `Ctrl+Alt+V` | 切换语音转写 |
| `Ctrl+Alt+B` | 显示后台 Shell 进程 |
| `Ctrl+V` / `Alt+V` | 粘贴剪贴板图片 |
| `Escape` | 暂停 Auto Mode |

---

### CLI 参数

| 参数 | 说明 |
|------|------|
| `gsd` | 启动新交互会话 |
| `gsd --continue` / `-c` | 恢复最近会话 |
| `gsd --model <id>` | 覆盖默认模型 |
| `gsd --print "msg"` / `-p` | 单次提示模式 |
| `gsd --web [path]` | 启动浏览器界面 |
| `gsd --worktree` / `-w` [name] | 在 Git 工作树中启动 |
| `gsd --no-session` | 禁用会话持久化 |
| `gsd --debug` | 启用 JSONL 诊断日志 |
| `gsd --version` / `-v` | 打印版本 |
| `gsd sessions` | 交互式会话选择器 |
| `gsd headless [cmd]` | 无 TUI 运行 |
| `gsd --mode mcp` | MCP 服务器模式 |

### Headless 模式

```bash
# 运行 auto mode
gsd headless

# 单个单元
gsd headless next

# 即时 JSON 快照（无 LLM，~50ms）
gsd headless query

# 带超时
gsd headless --timeout 600000 auto

# 创建里程碑并自动执行
gsd headless new-milestone --context brief.md --auto
```

| 退出码 | 含义 |
|--------|------|
| `0` | 完成 |
| `1` | 错误或超时 |
| `2` | 阻塞 |

---

## ⚙️ Cheatsheet — 配置速查

### Token Profile

```yaml
token_profile: budget      # 节省 40-60%
# token_profile: balanced  # 默认，节省 10-20%
# token_profile: quality    # 无压缩
```

| Profile | 规划模型 | 执行模型 | 研究阶段 | Slice 研究 | 上下文内联 |
|---------|----------|----------|----------|------------|------------|
| `budget` | Sonnet | Sonnet | ❌ 跳过 | ❌ 跳过 | 最小 |
| `balanced` | 用户默认 | 用户默认 | ✅ | ❌ 跳过 | 标准 |
| `quality` | 用户默认 | 用户默认 | ✅ | ✅ | 完整 |

### 模型选择

```yaml
models:
  research: claude-sonnet-4-6
  planning:
    model: claude-opus-4-6
    fallbacks:
      - openrouter/z-ai/glm-5
      - openrouter/minimax/minimax-m2.5
  execution: claude-sonnet-4-6
  completion: claude-sonnet-4-6
```

### 动态路由

```yaml
dynamic_routing:
  enabled: true
  tier_models:
    light: claude-haiku-4-5
    standard: claude-sonnet-4-6
    heavy: claude-opus-4-6
  escalate_on_failure: true
  budget_pressure: true
  cross_provider: true
  capability_routing: true
```

### Git 隔离

```yaml
git:
  isolation: worktree    # 默认
  # isolation: branch
  # isolation: none
  auto_push: false
  push_branches: false
  remote: origin
  snapshots: false
  pre_merge_check: false
  main_branch: main
  commit_docs: true
  auto_pr: false
  pr_target_branch: develop
```

### 超时配置

```yaml
auto_supervisor:
  soft_timeout_minutes: 20
  idle_timeout_minutes: 10
  hard_timeout_minutes: 30
```

### 验证配置

```yaml
verification_commands:
  - npm run lint
  - npm run test
verification_auto_fix: true
verification_max_retries: 2
```

### 技能配置

```yaml
always_use_skills:
  - debug-like-expert
prefer_skills:
  - frontend-design
avoid_skills:
  - security-docker
skill_rules:
  - when: task involves Clerk authentication
    use: [clerk]
skill_staleness_days: 60
skill_discovery: suggest  # auto / suggest / off
```

### 工作流模式

```yaml
mode: solo    # 个人项目
# mode: team  # 团队协作
```

| 设置 | solo | team |
|------|------|------|
| `git.auto_push` | true | false |
| `git.push_branches` | false | true |
| `git.pre_merge_check` | false | true |
| `unique_milestone_ids` | false | true |

### 并行配置

```yaml
parallel:
  enabled: true
  max_workers: 2          # 1-4
  budget_ceiling: 50.00
  merge_strategy: per-milestone  # per-slice / per-milestone
  auto_merge: confirm     # auto / confirm / manual
```

### 预算

```yaml
budget_ceiling: 50.00
budget_enforcement: pause    # warn / pause / halt
```

---

## 🔧 Cheatsheet — 内置扩展

| 扩展 | 提供 |
|------|------|
| **GSD** | 核心工作流引擎、auto mode、命令、仪表板 |
| **Browser Tools** | Playwright 浏览器、表单智能、视觉动作、PDF 导出 |
| **Search the Web** | Brave Search、Tavily、Jina 页面提取 |
| **Google Search** | Gemini 网页搜索 |
| **Context7** | 最新库/框架文档 |
| **Background Shell** | 后台进程管理 |
| **Async Jobs** | 后台 bash 任务跟踪 |
| **Subagent** | 隔离上下文委托任务 |
| **GitHub** | Issue 和 PR 管理 |
| **MCP Client** | MCP 服务器集成 |
| **Voice** | 实时语音转写 |
| **Remote Questions** | Slack/Discord 路由 |
| **Ollama** | 本地 LLM 支持 |
| **Claude Code CLI** | Claude Code CLI 扩展 |
| **cmux** | Claude 多路复用 |
| **LSP** | 语言服务器协议 |
| **TTSR** | 工具触发系统规则 |
| **AWS Auth** | Bedrock 凭证刷新 |

---

## 📊 Cheatsheet — Dashboard 与报告

### Dashboard (`Ctrl+Alt+G`)

- 当前 Milestone、Slice、Task 进度
- Auto Mode 运行时间和阶段
- 按阶段/Slice/模型的成本和 token 分解
- 成本预测
- 待处理 Capture 数量
- 并行 Worker 状态

### 报告生成

```bash
/gsd export --html           # 当前里程碑
/gsd export --html --all     # 所有里程碑
```

报告保存在 `.gsd/reports/`，包含：

- 项目摘要
- 进度树
- Slice 依赖图（SVG DAG）
- 成本/token 指标柱状图
- 执行时间线
- Changelog
- 知识库章节

---

## 🐛 Cheatsheet — 排障速记

| 问题 | 解法 |
|------|------|
| `command not found: gsd` | npm 全局 bin 不在 PATH，`unalias gsd`（oh-my-zsh） |
| Auto Mode 循环同一单元 | `/gsd doctor` 修复状态 |
| "Loop detected" | Task 两次未产出预期 artifact，手动调整计划 |
| 预算到达上限 | 提高 `budget_ceiling` 或切 `budget` profile |
| 锁文件过期 | GSD 自动清理，或手动 `rm .gsd/auto.lock` |
| Git 合并冲突 | GSD 自动解决 `.gsd/` 文件，内容冲突由 LLM 修复 |
| _provider 错误 | 参见错误类型：限速/服务器错误自动恢复，认证错误手动处理_ |
| Node v24 web 启动失败 | 升级到 v2.42+ |
| 德语 locale git 错误 | 升级到 v2.42+（强制 `LC_ALL=C`） |

### `/gsd doctor` 检查项

- 文件结构和命名规范
- Roadmap ↔ Slice ↔ Task 引用完整性
- 完成状态一致性
- Git 工作树健康（仅 worktree/branch 模式）
- 过期锁文件和孤立运行时记录

---

## 🔌 Cheatsheet — MCP 服务器

### 配置

`.mcp.json` 或 `.gsd/mcp.json`：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed"]
    }
  }
}
```

### OAuth MCP 服务器 (v2.64+)

```json
{
  "mcpServers": {
    "my-server": {
      "transport": "http",
      "url": "https://your-server.com/mcp",
      "auth": {
        "type": "oauth",
        "clientId": "...",
        "clientSecret": "..."
      }
    }
  }
}
```

### 命令

```bash
/gsd mcp              # MCP 服务器状态
/gsd prefs            # MCP 服务器配置
```

---

## 🔐 Cheatsheet — API Key 管理

### 支持的 Provider

Anthropic、OpenAI、Google、OpenRouter、GitHub Copilot、AWS Bedrock、Azure OpenAI、Groq、Cerebras、Mistral、xAI、HuggingFace、Vercel AI Gateway 等。

### Key 管理命令

| 命令 | 说明 |
|------|------|
| `/gsd keys` | 列出所有 key |
| `/gsd keys add <provider>` | 添加 key |
| `/gsd keys remove <provider>` | 删除 key |
| `/gsd keys test <provider>` | 测试 key |
| `/gsd keys rotate <provider>` | 轮换 key |
| `/gsd keys doctor` | 诊断 key 问题 |

### Credential 工具支持

支持从以下工具读取 key：`pass`、`op`（1Password）、`aws`、`gcloud`、`vault`、`gpg`、`bw`（Bitwarden）、`gopass`、`lpass`。

---

## 📦 Cheatsheet — Skills

### 安装 Skills

```bash
npx skills add dpearson2699/swift-ios-skills
npx skills add dpearson2699/swift-ios-skills --skill swift-concurrency --skill swiftui-patterns -y
npx skills update
```

### Skill 存放位置

| 位置 | 范围 |
|------|------|
| `~/.agents/skills/` | 全局（优先） |
| `.agents/skills/` | 项目本地 |

### 技能健康

```bash
/gsd skill-health              # 概览
/gsd skill-health <name>       # 详细视图
/gsd skill-health --stale 30  # 30+ 天未用
/gsd skill-health --declining  # 成功率下降
```

---

## 🏗️ Cheatsheet — 架构速记

### 目录结构

```
gsd (CLI binary)
  └─ loader.ts          设置 PI_PACKAGE_DIR, GSD env vars
      └─ cli.ts         装配 SDK managers, 加载扩展
          ├─ headless.ts     Headless 编排
          ├─ onboarding.ts   首次运行向导
          ├─ wizard.ts       Env 注入
          ├─ app-paths.ts    ~/.gsd/ 路径
          └─ src/resources/
              ├─ extensions/gsd/    核心 GSD 扩展
              ├─ extensions/...     23 个支撑扩展
              ├─ agents/           scout, researcher, worker
              └─ AGENTS.md         Agent 路由指令
```

### 关键设计

- **`pkg/` shim**：避免 Pi 主题解析与项目 `src/` 冲突
- **两文件加载器**：`loader.ts` 设置环境变量，`cli.ts` 动态导入
- **状态在磁盘**：`./gsd/` 是事实来源，Auto Mode 读写磁盘
- **Native Git**：v2.16+ 使用 libgit2 减少 ~70 个进程/调度

---

## 🌐 Cheatsheet — Web 与 VS Code

### Web 界面

```bash
gsd --web [path]    # 启动浏览器界面
```

- 浏览器仪表板
- 实时进度
- 多项目支持
- 端口 3000

### VS Code 扩展

- **`@gsd` 聊天参与者**：在 VS Code Chat 中对话
- **侧边栏仪表板**：连接状态、模型信息、token 用量
- **命令面板**：启动/停止 agent、切换模型、导出会话

安装：VS Code marketplace 搜索 "GSD"（发布者：FluxLabs）

## 不要混淆：GSD v1 vs v2

| | **GSD v1** | **GSD v2** |
|---|---|---|
| **定位** | prompt 框架 + 工作流方法论 | 可运行的 TypeScript Agent 应用 |
| **执行方式** | 依赖 Claude Code，指令驱动 | 可独立运行（Auto Mode / Step Mode） |
| **核心思路** | Discuss → Plan → Gap → Execute → Verify → Ship | 里程碑驱动 + 动态模型路由 + Git 隔离 |
| **新增能力** | 波次执行、原子提交、worktree | Auto Mode、并行编排、动态模型路由、Agent Dashboard |
| **适用场景** | 想改善与 AI 的协作流程、理解上下文工程原理 | 想直接跑一个无人值守的编码 Agent |

**不要混淆**：v1 是"说明书"，v2 是"运行程序"。v2 不只是 v1 的增强版，而是完全不同层面的东西。如果你在找 AI 编码方法论，看 v1；如果想跑一个真正的 autonomous coding agent，用 v2。
