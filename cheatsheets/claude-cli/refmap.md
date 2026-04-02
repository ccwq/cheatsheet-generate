# Claude CLI 参考文档

> **验证版本**: v2.1.90 | 基于 GitHub Releases 2026-04-01

## 官方文档链接

- [Claude Code Home](https://code.claude.com) - 官方首页
- [Quickstart](https://code.claude.com/docs/en/quickstart) - 快速入门
- [Overview](https://code.claude.com/docs/en/overview) - 功能概览
- [CLI Reference](https://code.claude.com/docs/en/cli-reference) - CLI 命令参考
- [Slash Commands](https://code.claude.com/docs/en/slash-commands) - 斜杠命令
- [Interactive Mode](https://code.claude.com/docs/en/interactive-mode) - 交互模式
- [Settings](https://code.claude.com/docs/en/settings) - 设置参考
- [Permissions](https://code.claude.com/docs/en/permissions) - 权限系统
- [Hooks Reference](https://code.claude.com/docs/en/hooks) - Hooks 配置
- [MCP](https://code.claude.com/docs/en/mcp) - MCP 集成
- [Plugins Reference](https://code.claude.com/docs/en/plugins) - 插件系统
- [Tools Reference](https://code.claude.com/docs/en/tools-reference) - 工具参考
- [Subagents](https://code.claude.com/docs/en/sub-agents) - 子代理
- [Agent Teams](https://code.claude.com/docs/en/agent-teams) - 代理团队
- [Permission Modes](https://code.claude.com/docs/en/permission-modes) - 权限模式
- [Auto Mode](https://code.claude.com/docs/en/permission-modes#eliminate-prompts-with-auto-mode) - 自动模式
- [Sandboxing](https://code.claude.com/docs/en/sandboxing) - 沙盒
- [Chrome](https://code.claude.com/docs/en/chrome) - Chrome 集成
- [Remote Control](https://code.claude.com/docs/en/remote-control) - 远程控制
- [Worktrees](https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees) - Worktree 隔离
- [Privacy](https://code.claude.com/docs/en/privacy) - 隐私设置
- [Common Workflows](https://code.claude.com/docs/en/common-workflows) - 常用工作流
- [Status Line](https://code.claude.com/docs/en/statusline) - 状态行
- [Output Styles](https://code.claude.com/docs/en/output-styles) - 输出风格
- [Memory](https://code.claude.com/docs/en/memory) - 记忆系统
- [Voice Dictation](https://code.claude.com/docs/en/voice-dictation) - 语音听写
- [Server Managed Settings](https://code.claude.com/docs/en/server-managed-settings) - 托管设置

## 核心资源

### 安装与配置
- [Homebrew](https://brew.sh): `brew install --cask claude-code`
- [Linux/macOS 脚本](https://claude.ai/install.sh): `curl -fsSL https://claude.ai/install.sh | bash`
- [Windows PowerShell](https://claude.ai/install.ps1): `irm https://claude.ai/install.ps1 | iex`

### 账户与认证
- [Claude.ai](https://claude.ai) - 官方账户
- [Console](https://console.anthropic.com) - API 计费
- [API 文档](https://docs.anthropic.com/claude/reference) - API 参考

### GitHub
- [官方仓库](https://github.com/anthropics/claude-code) - 源代码与 Issues
- [Releases](https://github.com/anthropics/claude-code/releases) - 版本历史
- [Discussions](https://github.com/anthropics/claude-code/discussions) - 社区讨论

## CLI 命令参考

### 基础命令
| 命令 | 说明 |
|------|------|
| `claude` | 启动交互模式 |
| `claude "任务"` | 执行一次性任务 |
| `claude -p "查询"` | 单次查询后退出 |
| `claude exec "任务"` | 非交互自动化模式 |
| `claude -c` | 继续最近对话 |
| `claude -r [id]` | 恢复指定会话 |
| `claude --new` | 新建对话 |
| `claude --list` | 列出所有会话 |
| `claude --delete ID` | 删除会话 |
| `claude commit` | 智能 Git 提交 |
| `claude update` | 检查更新 |

### CLI 子命令
| 命令 | 说明 |
|------|------|
| `claude auth login` | 登录账户 |
| `claude auth logout` | 登出 |
| `claude auth status` | 显示认证状态 |
| `claude agents` | 列出子代理 |
| `claude auto-mode defaults` | 打印自动模式规则 |
| `claude auto-mode config` | 显示自动模式配置 |
| `claude mcp` | MCP 配置 |
| `claude plugin <sub>` | 插件管理 |
| `claude remote-control` | 启动远程控制 |

### CLI 选项
| 选项 | 说明 |
|------|------|
| `--model <model>` | 指定 AI 模型 |
| `--permission-mode <mode>` | 权限模式 |
| `--mcp-config <configs>` | MCP 服务器配置 |
| `--add-dir <dirs>` | 允许工具访问的目录 |
| `--output-format <fmt>` | 输出格式 |
| `--bare` | 跳过 hooks/LSP/插件同步 |
| `--name / -n <name>` | 会话名称 |
| `--session-id <uuid>` | 指定会话 ID |
| `--fork-session` | 恢复时创建新会话 |
| `--from-pr <num>` | 从 PR 恢复会话 |
| `--max-turns <n>` | 最大 agent 轮数 |
| `--max-budget-usd <amt>` | 最大 API 花费 |
| `--effort <level>` | 努力级别 |
| `--agent <name>` | 指定子代理 |
| `--agents <json>` | 动态定义子代理 |
| `--tools <tools>` | 限制可用工具 |
| `--system-prompt <prompt>` | 替换系统提示 |
| `--append-system-prompt <prompt>` | 追加系统提示 |
| `--chrome` | 启用 Chrome 集成 |
| `--remote "任务"` | 创建 Web 会话 |
| `--teleport` | 恢复 Web 会话到本地 |
| `--remote-control / --rc` | 启用远程控制 |
| `--worktree / -w [name]` | git worktree 隔离 |
| `--tmux` | 创建 tmux 会话 |
| `--enable-auto-mode` | 启用自动模式 |
| `--debug [filter]` | 调试模式 |
| `--debug-file <path>` | 调试日志文件 |
| `--verbose` | 详细日志 |

## 内置斜杠命令

### 基本操作
| 命令 | 说明 |
|------|------|
| `/help` | 显示所有命令 |
| `/clear` | 清除对话历史 |
| `/exit` | 退出 Claude Code |
| `/config` | 打开设置界面 |
| `/status` | 查看状态信息 |
| `/init` | 初始化项目配置 |
| `/doctor` | 健康检查 |

### 账户与模型
| 命令 | 说明 |
|------|------|
| `/login` | 切换/登录账户 |
| `/logout` | 登出当前账户 |
| `/model` | 选择或更改 AI 模型 |
| `/usage` | 查看使用限制和统计 |
| `/cost` | 显示 token 使用成本 |

### 开发工具
| 命令 | 说明 |
|------|------|
| `/memory` | 编辑记忆文件 |
| `/todos` | 待办事项 |
| `/context` | 上下文使用情况（含建议） |
| `/review` | 代码审查工具 |
| `/pr_comments` | 查看 PR 评论 |
| `/mcp` | 管理 MCP 连接 |
| `/rewind` | 回溯对话和编辑 |
| `/checkpoint` | 检查点管理 |
| `/compact` | 压缩对话历史 |
| `/simplify` | 简化命令（v2.1.63+） |
| `/batch` | 批处理命令（v2.1.63+） |
| `/effort` | 努力级别（v2.1.76+） |
| `/loop` | 循环任务（v2.1.71+） |
| `/copy` | 复制到文件（v2.1.72+） |
| `/branch` | 分支会话（v2.1.77+） |
| `/powerup` | 交互式教程（v2.1.90+） |

### 配置和输出
| 命令 | 说明 |
|------|------|
| `/output-style` | 设置输出风格 |
| `/statusline` | 配置状态行 UI |
| `/terminal-setup` | 终端快捷键 |
| `/privacy-settings` | 隐私设置管理 |
| `/permissions` | 权限管理 |
| `/vim` | Vim 编辑模式 |
| `/sandbox` | 沙盒 bash 工具 |

## Hooks 事件类型

| 事件 | 触发时机 |
|------|----------|
| `pre-edit` | 文件编辑前 |
| `post-edit` | 文件编辑后 |
| `pre-run` | 命令执行前 |
| `post-run` | 命令执行后 |
| `conversation-start` | 会话开始 |
| `conversation-end` | 会话结束 |
| `CwdChanged` | 目录变更（v2.1.83+） |
| `FileChanged` | 文件变更（v2.1.83+） |
| `TaskCreated` | 任务创建（v2.1.84+） |
| `PermissionDenied` | 权限拒绝（v2.1.89+） |
| `StopFailure` | 停止失败（v2.1.78+） |
| `Elicitation` | MCP 征询（v2.1.76+） |
| `ElicitationResult` | 征询结果（v2.1.76+） |
| `PostCompact` | 压缩后（v2.1.76+） |
| `TeammateIdle` | 团队成员空闲（v2.1.33+） |
| `TaskCompleted` | 任务完成（v2.1.33+） |

## MCP 集成

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [MCP Servers](https://github.com/modelcontextprotocol/servers) - 官方服务器
- 热门集成: Google Drive, Figma, Slack, Jira, GitHub, Notion, Linear, PostgreSQL

## 新功能时间线

| 版本 | 日期 | 重要更新 |
|------|------|----------|
| v2.1.90 | 2025-04-01 | `/powerup`, PowerShell 强化, SSE 优化 |
| v2.1.89 | 2025-04-01 | `defer` 权限决策, `PermissionDenied` hook |
| v2.1.86 | 2025-03-27 | Session-ID header, Read 工具优化 |
| v2.1.85 | 2025-03-26 | MCP 多服务器 headers, 条件 hook |
| v2.1.84 | 2025-03-26 | PowerShell 工具, `TaskCreated` hook |
| v2.1.83 | 2025-03-25 | `managed-settings.d/`, `CwdChanged`/`FileChanged` hooks |
| v2.1.81 | 2025-03-20 | `--bare` flag, `--channels` 权限转发 |
| v2.1.80 | 2025-03-19 | `rate_limits` statusline, `effort` frontmatter |
| v2.1.78 | 2025-03-17 | `StopFailure` hook, `${CLAUDE_PLUGIN_DATA}` |
| v2.1.77 | 2025-03-17 | Opus 4.6 token 限额, `/fork` → `/branch` |
| v2.1.76 | 2025-03-14 | MCP elicitation, `/effort`, `PostCompact` hook |
| v2.1.74 | 2025-03-12 | `autoMemoryDirectory`, `/context` 建议 |
| v2.1.72 | 2025-03-10 | `/loop`, `/copy` |
| v2.1.71 | 2025-03-07 | `/loop` + cron 调度, 语音 |
| v2.1.69 | 2025-03-05 | `/claude-api` skill, `includeGitInstructions` |
| v2.1.63 | 2025-02-28 | `/simplify`, `/batch` |
| v2.1.59 | 2025-02-26 | **Auto Memory** 自动记忆 |
| v2.1.51 | 2025-02-24 | `claude remote-control`, 自定义 npm registry |
| v2.1.50 | 2025-02-20 | **Worktree** 隔离支持 |
| v2.1.41 | 2025-02-13 | Windows ARM64, `claude auth` 子命令 |

## 最佳实践

1. 在项目根目录使用以确保上下文完整
2. 使用具体明确的自然语言描述
3. 利用检查点系统和 Auto Memory 进行安全实验
4. 配置自定义命令提高效率
5. 使用 MCP 扩展外部数据源
6. 在 CI/CD 流程中集成自动化任务
7. 定期清理过期对话和检查点
8. 利用 Git 集成进行版本控制
9. 使用子代理处理特定领域任务
10. 利用 Worktree 隔离并行处理多任务
