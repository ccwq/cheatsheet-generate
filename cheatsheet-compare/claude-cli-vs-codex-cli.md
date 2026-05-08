# Claude CLI vs Codex CLI 对比报告

## 基本信息

| 属性 | Claude CLI | Codex CLI |
|------|-----------|-----------|
| 定位 | Anthropic 官方 CLI，提供代码生成、补全、重构、错误诊断与智能编程支持 | OpenAI 官方 CLI，终端里的编码代理，适合读仓库、改代码、做 review、跑非交互任务 |
| 版本 | v2.1.133 | v0.129.0 |
| GitHub | anthropics/claude-code | openai/codex |
| 官方文档 | code.claude.com/docs | developers.openai.com/codex |
| 维护状态 | 活跃（2026-05-08 更新） | 活跃（2026-05-08 更新） |

---

## 定位差异

Claude CLI 和 Codex CLI 本质上属于同类工具——均为 AI 驱动的终端编程代理，但两者在设计哲学和核心场景上有明显分化。

**Claude CLI** 以"全功能 IDE 替代"为设计目标，核心围绕会话上下文管理、记忆系统和多层级权限控制。它强调**长期上下文积累**（Auto Memory、检查点、/rewind）和**团队协作基础设施**（Worktree 隔离、Hooks 生命周期、托管设置）。其子代理体系（code-reviewer、test-runner、debug-expert 等）让专业任务有专用入口。定位偏向"个人 AI 编程搭档"，深度融入开发者日常编码工作流。

**Codex CLI** 以"代码任务执行器"为核心定位，工作流设计围绕 **sandbox + approval 决策**展开，强调**安全边界控制**和**结果可回溯**（apply、fork/resume）。其 MCP server 模式和云端任务（cloud）使其更适合**集成到外部工具链**，定位偏向"可编程的自动化代码执行引擎"。

**两者不可直接替代**：Claude CLI 强于上下文深度和长期项目感知，Codex CLI 强于任务边界管控和工具链集成。

---

## 功能矩阵

| 维度 | Claude CLI | Codex CLI |
|------|-----------|-----------|
| 安装平台 | macOS/Linux/Windows（Homebrew、脚本、PowerShell） | macOS/Linux/Windows（npm、brew、预编译包） |
| 核心交互模式 | 交互会话、`exec` 非交互、`-p` 打印退出 | 交互会话、`exec` 非交互、`review` 审查、`apply` 回填 |
| 模型底座 | Anthropic Claude 系列 | OpenAI GPT-5 Codex 系列 |
| 会话管理 | 持久化会话、--list/--delete、检查点、/rewind、/branch 分叉 | resume/fork 分叉、云端 cloud 任务 |
| 记忆系统 | **Auto Memory**（项目级 + 用户级 + frontmatter） | 无专属记忆系统，依赖上下文 |
| 权限与安全 | 权限模式（default/acceptEdits/plan/auto/dontAsk）、Hooks 事件驱动 | **沙箱三级**（read-only/workspace-write/danger-full-access）+ 审批策略 |
| Git 集成 | `claude commit` 智能提交、`/pr-comments`、--from-pr 恢复 | `codex review`、workspace-aware `/diff` |
| 扩展生态 | MCP 集成、**插件系统**、内置子代理（5种） | MCP 集成（**可作为 MCP server 运行**）、插件管理、feature flags |
| 远程与协作 | 远程控制服务器、Web 会话 --remote/--teleport、**Worktree 隔离** | cloud 云端任务拉回、`--local-provider` 支持 ollama/lmstudio |
| 自动化 | `/loop` 间隔循环 + cron 调度、`/batch` 并行批处理、`/schedule` 云端定时 | `codex exec` 非交互、NDJSON 输出供脚本消费、`--full-auto` 组合 |
| 诊断排障 | `/doctor` 健康检查、--debug/--debug-file、--verbose | `codex debug`、`codex features list`、--skip-git-repo-check |
| 多模态 | --chrome Chrome 集成、支持图像输入 | `-i/--image` 附图到首轮提示、联网搜索 --search |
| 输出格式 | text/json/stream-json、--json-schema 校验、/output-style | --json / --experimental-json NDJSON、--output-last-message |
| 编辑器集成 | VS Code 扩展、--ide、/vim | Modal Vim 编辑器（0.129.0 新增 /vim）、`/ide` 上下文注入 |
| 配置方式 | settings.json 多层级（Managed/User/Project/Local）、hooks.json | config.toml + profiles 分层、feature flags、`-c` 临时覆盖 |

---

## 优势对比

### Claude CLI 的优势

- **Auto Memory 自动记忆系统**：项目级和用户级持久记忆 + frontmatter 支持，跨会话保持上下文积累，Codex 无对应功能
- **多层级托管设置**：Managed → User → Project → Local 四级配置体系，适合团队标准化管理
- **内置子代理生态**：5 种专用子代理（code-reviewer、test-runner、debug-expert、documentation-writer、general-purpose），无需额外配置即可执行专业任务
- **Worktree 隔离**：原生 git worktree 集成，多任务并行不相互干扰，适合大规模重构场景
- **Hooks 生命周期**：12 种事件类型覆盖文件变更、目录变更、权限拒绝等完整开发链路，支持条件脚本和 effort 级别传递
- **智能 Git 提交**：`claude commit` 自动分析 diff 生成规范提交信息
- **隐私设置体系**：数据保留策略（7天/30天/会话/永久）、匿名化开关、PII 检测，适合企业合规场景
- **多输出格式**：text/json/stream-json + JSON Schema 校验，覆盖从人工阅读到程序消费的全场景

### Codex CLI 的优势

- **沙箱安全模型**：read-only / workspace-write / danger-full-access 三级隔离 + 审批策略，边界控制更清晰，适合在不受信环境中运行
- **MCP Server 模式**：`codex mcp-server` 可将 Codex 作为 MCP provider 暴露给其他工具，生态集成能力更强
- **结果回填机制**：`codex apply` 将最近一次 patch 直接应用回工作树，结果导向明确
- **云端任务**：cloud 命令支持将任务托管到云端执行并拉回结果，适合耗时任务场景
- **会话分叉与比较**：fork + resume 机制，保留主线同时试验两种方案，适合探索性开发
- **本地模型支持**：--oss、--local-provider ollama/lmstudio，可在本地开源模型上运行
- **联网搜索**：`--search` 实时联网获取最新资料，适合需要最新信息的任务
- **Feature Flags 系统**：细粒度功能开关控制，可渐进启用实验性功能
- **Config TOML profiles**：`codex --profile work` 多场景配置切换，临时覆盖用 `-c`，分层清晰

---

## 劣势对比

### Claude CLI 的劣势

- **无原生沙箱三级模型**：权限控制依赖权限模式而非环境隔离，在不受信代码执行场景下安全感较弱
- **没有结果回填机制**：任务执行结果需要人工确认和应用，缺乏 Codex 的 `apply` 那种确定性结果交付
- **Auto Memory 可能导致上下文膨胀**：长期会话记忆积累可能影响性能，需定期 /compact 压缩
- **本地模型支持较弱**：主要面向 Anthropic API，不支持 ollama/lmstudio 等本地模型 provider
- **联网搜索非原生**：依赖外部 MCP 或手动操作，不支持 --search 这种轻量级实时联网

### Codex CLI 的劣势

- **缺乏记忆系统**：无 Auto Memory 那种跨会话上下文积累能力，每次 resume 需依赖会话历史
- **无子代理生态**：没有 Claude那种 code-reviewer、test-runner 等专用子代理体系，所有任务都在主会话中执行
- **Hooks 系统较新（0.129.0）**：功能在快速迭代中，生态和文档成熟度不及 Claude 的 Hooks
- **无 Worktree 隔离**：并行多任务需手动管理目录，不支持 git worktree 原生集成
- **无智能 Git 提交**：没有 claude commit 那种自动分析生成提交信息的功能
- **权限体系较简**：基于沙箱 + 审批策略，没有 Claude 多层级权限模式（acceptEdits/plan/auto 等）

---

## 适用场景

| 场景 | 推荐 | 理由 |
|------|------|------|
| 陌生仓库探索与安全评估 | **Codex CLI** | `--sandbox read-only --ask-for-approval on-request` 在陌生仓库中避免意外写入，边界清晰 |
| 长期项目深度协作与上下文积累 | **Claude CLI** | Auto Memory + 检查点 + /rewind 跨会话保持项目上下文，适合数周跨度的大型项目 |
| 企业团队标准化配置管理 | **Claude CLI** | Managed/User/Project/Local 四级托管设置，适合团队强制推行安全/编码规范 |
| CI/CD 流水线自动化脚本 | **Codex CLI** | `--full-auto` + NDJSON 输出 + `codex exec` 天然适合无人值守脚本场景 |
| 接入现有工具链（IDE/MCP） | **Codex CLI** | `codex mcp-server` 作为 MCP provider 暴露，或 `codex --add-dir` 集成都更灵活 |
| 并行多任务大型重构 | **Claude CLI** | Worktree 隔离 + 子代理并行执行，适合需要同时操作多个分支的大规模重构 |
| 快速代码审查（交互式） | **Claude CLI** | `/review` 内置代码审查 + `/security-review` 安全漏洞分析，专业功能开箱即用 |
| 需要实验两种实现方案 | **Codex CLI** | `codex fork --last` 分叉 + `codex resume` 对比，最后 `codex apply` 选定方案 |
| 需要最新联网信息 | **Codex CLI** | `--search` 实时联网搜索，适合依赖最新文档/库版本的任务 |
| 在本地模型上运行 | **Codex CLI** | `--oss --local-provider ollama/lmstudio` 支持本地开源模型，适合离线/隐私敏感环境 |

---

## 综合评价

Claude CLI 和 Codex CLI 是当前 AI CLI 领域的两个主流选择，本质上解决同一类问题——用自然语言驱动代码生成与修改——但设计哲学差异显著。**Claude CLI** 以"深度上下文感知 + 团队基础设施"为核心，适合需要长期项目记忆、多人协作标准化、在复杂代码库中持续工作的开发者；**Codex CLI** 以"安全边界控制 + 工具链集成"为核心，适合需要明确沙箱边界、自动化脚本集成、结果可回溯的工程场景。

**不存在绝对优劣，只有场景适配**。建议在实际项目中根据团队安全策略、是否需要长期上下文积累、是否需要接入现有 MCP 生态等因素选择；也可以两者兼用——Codex 处理高风险自动化任务，Claude 处理深度代码协作。

---

## 参考来源

- Claude CLI：`cheatsheets/claude-cli/claude-cli.md` 和 `refmap.md`
- Codex CLI：`cheatsheets/codex-cli/codex-cli.md` 和 `refmap.md`
