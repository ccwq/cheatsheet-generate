---
title: Claude CLI
lang: zh-CN
version: "2.1.90"
date: "2026-04-01"
github: anthropics/claude-code
colWidth: 420px
desc: Anthropic Claude CLI 工具，提供代码生成、补全、重构、错误诊断与智能编程支持。
---

## 快速定位

> 这是什么：Anthropic 官方 CLI 工具，通过自然语言帮助开发者完成代码生成、补全、重构、调试等任务。

### 最短路径
```bash
claude                    # 启动交互模式
claude "修复这个 bug"     # 单次任务
claude -p "审查代码"       # 打印输出后退出
```

### 核心场景速查
| 场景 | 命令 |
|------|------|
| 启动对话 | `claude` |
| 继续上次 | `claude -c` |
| 恢复指定会话 | `claude -r <session-id>` |
| 智能 Git 提交 | `claude commit` |
| 列出所有会话 | `claude --list` |

---

## 最小工作流

### 起手式
```bash
cd 项目目录
claude                    # 启动交互模式
```

### 核心命令链
```bash
claude "添加用户认证"      # 自然语言任务
claude exec "重构这块逻辑" # 非交互自动化
claude -p "审查 PR"       # 打印输出
```

### 收尾动作
```bash
/exit                     # 退出
/checkpoint                # 保存检查点
```

---

## 高频场景 Recipes

### 代码生成与重构
```bash
添加 RESTful API 端点
将这个 class 改为 TypeScript
为这个函数添加单元测试
重构这段 SQL 查询
```

### 调试与修复
```bash
修复空指针异常
解决 500 错误
为什么这个 API 超时
修复 CSS 在 Safari 的问题
```

### 代码审查
```bash
审查这段代码的安全性
检查这个函数的性能
分析项目架构和技术栈
优化这个复杂查询
```

### DevOps 与自动化
```bash
设置 Docker 容器化
创建 GitHub Actions 流水线
更新所有依赖到最新版本
配置 Nginx 反向代理
```

### Unix 哲学组合
```bash
git diff | claude -p "审查变更并生成报告"
tail -f app.log | claude -p "发现异常立即通知"
find . -name "*.js" -exec claude -p "优化此文件" {} \;
```

---

## CLI 命令速查

### 基础命令
| 命令 | 说明 |
|------|------|
| `claude` | 启动交互模式 |
| `claude "任务"` | 单次任务 |
| `claude -p "查询"` | 打印退出 |
| `claude exec "自动化"` | 非交互模式 |
| `claude -c` | 继续最近对话 |
| `claude -r [id]` | 恢复会话 |
| `claude --new` | 新建对话 |
| `claude --list` | 列出所有会话 |
| `claude --delete ID` | 删除会话 |
| `claude commit` | 智能 Git 提交 |
| `claude update` | 检查更新 |

### CLI 选项
| 选项 | 说明 |
|------|------|
| `--help / -h` | 帮助信息 |
| `--version / -v` | 版本信息 |
| `--debug [filter]` | 调试模式 |
| `--debug-file <path>` | 调试日志输出到文件 |
| `--model <model>` | 指定模型 |
| `--settings <file/json>` | 加载设置 |
| `--setting-sources <sources>` | 设置源（user,project,local） |
| `--permission-mode <mode>` | 权限模式 |
| `--mcp-config <configs>` | MCP 服务器配置 |
| `--strict-mcp-config` | 仅用 --mcp-config |
| `--add-dir <dirs>` | 允许目录 |
| `--output-format <fmt>` | 输出格式（text/json/stream-json） |
| `--input-format <fmt>` | 输入格式 |
| `--bare` | 跳过 hooks/LSP/插件同步 |
| `--name / -n <name>` | 会话名称 |
| `--session-id <uuid>` | 指定会话 ID |
| `--fork-session` | 恢复时创建新会话 |
| `--from-pr <num>` | 从 PR 恢复会话 |
| `--resume / -r [id]` | 恢复会话 |
| `--continue / -c` | 继续最近对话 |
| `--max-turns <n>` | 最大 agent 轮数 |
| `--max-budget-usd <amount>` | 最大 API 花费 |
| `--effort <level>` | 努力级别（low/medium/high/max） |
| `--agent <name>` | 指定子代理 |
| `--agents <json>` | 动态定义子代理 |
| `--tools <tools>` | 限制可用工具 |
| `--allowedTools <tools>` | 允许的工具 |
| `--disallowedTools <tools>` | 禁止的工具 |
| `--system-prompt <prompt>` | 替换系统提示 |
| `--system-prompt-file <file>` | 从文件加载系统提示 |
| `--append-system-prompt <prompt>` | 追加系统提示 |
| `--append-system-prompt-file <file>` | 从文件追加系统提示 |
| `--permission-prompt-tool <tool>` | MCP 处理权限提示 |
| `--mcp-config <configs>` | MCP 服务器配置 |
| `--plugin-dir <paths>` | 加载插件目录 |
| `--chrome` | 启用 Chrome 集成 |
| `--no-chrome` | 禁用 Chrome 集成 |
| `--ide` | 自动连接 IDE |
| `--remote "任务"` | 创建 Web 会话 |
| `--teleport` | 恢复 Web 会话到本地 |
| `--remote-control / --rc` | 启用远程控制 |
| `--worktree / -w [name]` | git worktree 隔离 |
| `--tmux` | 创建 tmux 会话（需 --worktree） |
| `--enable-auto-mode` | 启用自动模式 |
| `--allow-dangerously-skip-permissions` | 允许跳过权限 |
| `--dangerously-skip-permissions` | 跳过所有权限检查 |
| `--betas <headers>` | Beta 请求头 |
| `--init` | 运行初始化 hooks |
| `--init-only` | 仅运行初始化 |
| `--maintenance` | 运行维护 hooks |
| `--replay-user-messages` | 重放用户消息到 stdout |
| `--include-hook-events` | 在输出中包含 hook 事件 |
| `--include-partial-messages` | 包含部分流式事件 |
| `--json-schema <schema>` | JSON Schema 验证输出 |
| `--fallback-model <model>` | 模型过载时的备用模型 |
| `--verbose` | 详细日志 |
| `--no-session-persistence` | 禁用会话持久化 |
| `--print / -p` | 打印模式 |
| `--idle-timeout` | 空闲超时（默认 90s） |

---

## CLI 子命令速查

### 认证管理
| 命令 | 说明 |
|------|------|
| `claude auth login` | 登录账户 |
| `claude auth login --console` | API 计费登录 |
| `claude auth login --sso` | SSO 认证 |
| `claude auth logout` | 登出 |
| `claude auth status` | 显示认证状态 |
| `claude auth status --text` | 人类可读输出 |

### 其他子命令
| 命令 | 说明 |
|------|------|
| `claude agents` | 列出所有配置的子代理 |
| `claude auto-mode defaults` | 打印自动模式规则 JSON |
| `claude auto-mode config` | 显示有效配置 |
| `claude mcp` | MCP 服务器配置 |
| `claude plugin <subcommand>` | 插件管理 |
| `claude remote-control` | 启动远程控制服务器 |
| `claude update` | 更新到最新版本 |

---

## 内置斜杠命令速查

### 基本操作
| 命令 | 说明 |
|------|------|
| `/help` | 显示所有命令 |
| `/clear` | 清除历史。别名：`/reset`, `/new` |
| `/exit` | 退出 CLI。别名：`/quit` |
| `/config` | 打开设置界面。别名：`/settings` |
| `/status` | 显示版本、模型、账户、连接状态 |
| `/init` | 初始化项目，创建 `CLAUDE.md` |
| `/doctor` | 健康检查，诊断安装问题 |

### 账户与模型
| 命令 | 说明 |
|------|------|
| `/login` | 登录 Anthropic 账户 |
| `/logout` | 登出账户 |
| `/model [name]` | 选择或更改 AI 模型 |
| `/usage` | 显示计划限额和速率限制状态 |
| `/cost` | 显示 Token 使用统计 |
| `/extra-usage` | 配置额外用量，绕过速率限制 |

### 文件与代码
| 命令 | 说明 |
|------|------|
| `/memory` | 编辑 `CLAUDE.md` 记忆文件，管理自动记忆 |
| `/context` | 可视化上下文使用，显示优化建议 |
| `/compact [instructions]` | 压缩对话，释放上下文空间 |
| `/rewind` | 回溯对话/代码到之前状态。别名：`/checkpoint` |
| `/copy [N]` | 复制上一个响应到剪贴板（`/copy 2` 复制倒数第二个） |
| `/export [filename]` | 导出会话为纯文本 |

### Git 与版本控制
| 命令 | 说明 |
|------|------|
| `/diff` | 打开交互式 diff 查看器，查看未提交变更 |
| `/branch [name]` | 在当前点创建对话分支。别名：`/fork` |
| `/resume [session]` | 恢复指定 ID 或名称的会话。别名：`/continue` |
| `/pr-comments [PR]` | 获取并显示 GitHub PR 评论 |

### 开发工具
| 命令 | 说明 |
|------|------|
| `/mcp` | 管理 MCP 服务器连接和 OAuth 认证 |
| `/agents` | 管理 agent 子代理配置 |
| `/tasks` | 列出和管理后台任务。别名：`/bashes` |
| `/hooks` | 查看 hook 配置 |
| `/plugins` | 管理插件 |

### 调试与排障
| 命令 | 说明 |
|------|------|
| `/btw <question>` | 快速提问，不添加对话历史 |
| `/debug [description]` | 启用调试日志，排查问题 |
| `/sandbox` | 切换沙盒模式（支持平台） |
| `/security-review` | 分析当前分支变更的安全漏洞 |

### 自动化与计划
| 命令 | 说明 |
|------|------|
| `/loop [interval] <prompt>` | 按间隔重复运行提示，监控部署等 |
| `/schedule [description]` | 创建云端定时任务 |
| `/effort [low\|medium\|high\|max\|auto]` | 设置努力级别 |

### 输出与界面
| 命令 | 说明 |
|------|------|
| `/output-style` | 设置输出风格 |
| `/statusline` | 配置状态行显示 |
| `/terminal-setup` | 配置终端快捷键（仅支持终端） |
| `/theme [name]` | 更改颜色主题（含亮/暗/色盲模式） |
| `/color [color]` | 设置提示栏颜色（red/blue/green/yellow/purple/orange/pink/cyan） |
| `/vim` | 切换 Vim/Normal 编辑模式 |
| `/fast [on\|off]` | 切换快速模式 |

### IDE 与集成
| 命令 | 说明 |
|------|------|
| `/ide` | 管理 IDE 集成，显示状态 |
| `/chrome` | 配置 Chrome 集成 |
| `/desktop` | 在桌面应用中继续当前会话（macOS/Windows）别名：`/app` |
| `/mobile` | 显示二维码下载移动端应用。别名：`/ios`, `/android` |

### 安装与升级
| 命令 | 说明 |
|------|------|
| `/install-github-app` | 设置 GitHub Actions 应用 |
| `/install-slack-app` | 安装 Slack 应用 |
| `/upgrade` | 打开升级页面 |
| `/release-notes` | 查看完整更新日志 |

### 其他
| 命令 | 说明 |
|------|------|
| `/plan [description]` | 进入计划模式 |
| `/permissions` | 管理工具权限规则。别名：`/allowed-tools` |
| `/privacy-settings` | 查看和更新隐私设置（Pro/Max） |
| `/rename [name]` | 重命名当前会话 |
| `/insights` | 生成会话分析报告 |
| `/stats` | 可视化每日用量、会话历史、连续使用 |
| `/feedback [report]` | 提交反馈。别名：`/bug` |
| `/stickers` | 订购贴纸 |
| `/passes` | 与朋友分享免费周 |
| `/keybindings` | 打开或创建快捷键配置文件 |
| `/reload-plugins` | 重新加载所有插件 |
| `/remote-control` | 启用远程控制。别名：`/rc` |
| `/remote-env` | 配置远程环境默认值 |
| `/powerup` | 交互式教程（v2.1.90+） |

### 内置 Bundled Skills
| 命令 | 说明 |
|------|------|
| `/batch <instruction>` | 并行大规模变更，协调多个 agent |
| `/claude-api` | 加载 Claude API 参考（自动触发） |
| `/debug [description]` | 启用调试并排查问题 |
| `/loop [interval] <prompt>` | 按计划重复运行提示 |
| `/simplify [focus]` | 审查并修复代码质量问题 |

---

## Auto Memory 系统

> 自动记忆系统，自动保存上下文并在需要时召回

### 基础命令
| 命令 | 说明 |
|------|------|
| `/memory` | 编辑记忆文件 |
| `/memory edit` | 编辑记忆 |
| `/memory show` | 显示当前记忆 |
| `/memory clear` | 清除记忆 |
| `/memory reload` | 重新加载 |

### 配置
```bash
# 设置自动记忆目录 (user/local 级别)
autoMemoryDirectory: "~/my-memory-dir"

# memory frontmatter - 持久记忆 (v2.1.33+)
---
memory: 记住这个项目的技术栈是 Next.js + TypeScript
---
```

### 记忆文件位置
```bash
.claude/memory.md      # 项目级记忆
~/.claude/memory.md    # 全局记忆
autoMemoryDirectory/   # 自定义自动记忆目录
```

### 记忆语法
```markdown
# 项目记忆
## 代码规范
- 使用 TypeScript 严格模式
- 函数必须类型注解

## 项目结构
- src/: 源代码
- tests/: 测试
```

---

## 新功能模块（v2.1+）

> 专门整理自 GitHub Releases，按版本时间线组织

### v2.1.90（2026-04-01）
| 功能 | 说明 |
|------|------|
| `/powerup` | 交互式教程，动画演示功能 |
| `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE` | 离线环境保持插件市场 |
| `.husky` 保护 | acceptEdits 模式下保护 .husky 目录 |
| PowerShell 强化 | 修复后台任务绕过、调试器挂起等安全问题 |
| SSE 性能优化 | 修复二次方帧处理问题 |
| `--resume` 并行加载 | 提升大项目恢复速度 |

### v2.1.89（2026-04-01）
| 功能 | 说明 |
|------|------|
| `defer` 权限决策 | PreToolUse hooks 支持延迟决策 |
| `CLAUDE_CODE_NO_FLICKER=1` | 消除 Alt-Screen 闪烁 |
| `PermissionDenied` hook | 权限拒绝时触发，可返回 retry |
| 命名子代理 | @ 提及时显示子代理建议 |
| `MCP_CONNECTION_NONBLOCKING=true` | -p 模式跳过 MCP 等待 |
| `showThinkingSummaries` | 思考摘要默认关闭 |

### v2.1.86（2026-03-27）
| 功能 | 说明 |
|------|------|
| `X-Claude-Code-Session-Id` header | 代理请求聚合 |
| `.jj` / `.sl` 排除 | Jujutsu 和 Sapling 元数据 |
| Read 工具优化 | 紧凑行号格式、去重重读 |

### v2.1.85（2026-03-26）
| 功能 | 说明 |
|------|------|
| `CLAUDE_CODE_MCP_SERVER_NAME/URL` | MCP headersHelper 脚本环境变量 |
| Hook 条件 `if` 字段 | 使用权限规则语法 |
| 时间戳标记 | 定时任务（`/loop`, `CronCreate`） |
| 滚动性能 | WASM yoga-layout 替换为纯 TS |

### v2.1.84（2026-03-26）
| 功能 | 说明 |
|------|------|
| **PowerShell 工具** | Windows opt-in 预览 |
| `ANTHROPIC_DEFAULT_{OPUS,SONNET,HAIKU}_MODEL_SUPPORTS` | 第三方提供商默认模型 |
| `CLAUDE_STREAM_IDLE_TIMEOUT_MS` | 空闲超时（默认 90s） |
| `TaskCreated` hook | 任务创建时触发 |

### v2.1.83（2026-03-25）
| 功能 | 说明 |
|------|------|
| `managed-settings.d/` | 独立策略片段目录 |
| `CwdChanged` / `FileChanged` hooks | 响应式环境管理（如 direnv） |
| `sandbox.failIfUnavailable` | 沙盒不可用时失败 |
| Transcript 搜索 | `Ctrl+O` 模式下按 `/` 搜索 |
| `Ctrl+X Ctrl+E` | 外部编辑器别名 |

### v2.1.81（2026-03-20）
| 功能 | 说明 |
|------|------|
| `--bare` | -p 模式跳过 hooks/LSP/插件同步 |
| `--channels` | MCP 服务器转发审批到手机 |

### v2.1.80（2026-03-19）
| 功能 | 说明 |
|------|------|
| `rate_limits` | statusline 脚本显示速率限制 |
| `source: 'settings'` | settings.json 内联插件声明 |
| `effort` frontmatter | skills 和斜杠命令支持 |

### v2.1.79（2026-03-18）
| 功能 | 说明 |
|------|------|
| `--console` | Anthropic Console 认证 |

### v2.1.78（2026-03-17）
| 功能 | 说明 |
|------|------|
| `StopFailure` hook | 任务停止失败时触发 |
| `${CLAUDE_PLUGIN_DATA}` | 持久化插件状态变量 |
| 行对行流式响应 | 改进流式输出 |
| tmux 穿透支持 | 改进 tmux 集成 |

### v2.1.77（2026-03-17）
| 功能 | 说明 |
|------|------|
| Opus 4.6 token 限额 | 默认 64k，最大 128k |
| 启动速度优化 | macOS 提升约 60ms |
| `/fork` 重命名为 `/branch` | 分支会话命令 |

### v2.1.76（2026-03-14）
| 功能 | 说明 |
|------|------|
| MCP elicitation 支持 | MCP 服务器征询用户输入 |
| `Elicitation` / `ElicitationResult` hooks | 征询钩子 |
| `/effort` 斜杠命令 | 设置努力级别 |
| `PostCompact` hook | 压缩后触发 |

### v2.1.74（2026-03-12）
| 功能 | 说明 |
|------|------|
| `/context` 可操作建议 | 上下文菜单优化 |
| `autoMemoryDirectory` 设置 | 配置自动记忆目录 |
| 内存泄漏修复 | 流式响应缓冲区 |

### v2.1.73（2026-03-11）
| 功能 | 说明 |
|------|------|
| `modelOverrides` 设置 | 自定义模型 ID 映射 |
| SSL 错误指导 | 连接问题排查 |
| 默认模型更新 | Bedrock/Vertex/Foundry 改为 Opus 4.6 |

### v2.1.72（2026-03-10）
| 功能 | 说明 |
|------|------|
| 简化 effort 级别 | low/medium/high 三级 |
| `/loop` 命令 | 循环任务 |
| `/copy` 命令 | `w` 键直接写入文件 |

### v2.1.71（2026-03-07）
| 功能 | 说明 |
|------|------|
| `/loop` + cron 调度 | 定时循环任务 |
| 语音 push-to-talk | 键盘快捷键 |
| 桥接会话重连 | 改进睡眠后重连 |

### v2.1.69（2026-03-05）
| 功能 | 说明 |
|------|------|
| `/claude-api` skill | API 集成技能 |
| Voice STT | 新增 10 种语言语音识别 |
| `includeGitInstructions` | Git 指令设置 |
| 安全性修复 | HTTP hooks 等 |

### v2.1.63（2026-02-28）
| 功能 | 说明 |
|------|------|
| `/simplify` 命令 | 简化bundled命令 |
| `/batch` 命令 | 批处理bundled命令 |
| HTTP hooks | JSON POST/recv 支持 |
| `/model` 改进 | 模型选择优化 |

### v2.1.59（2026-02-26）
| 功能 | 说明 |
|------|------|
| **Auto Memory 自动记忆** | Claude 自动保存上下文 |
| `/copy` 命令 | 复制内容 |

### v2.1.51（2026-02-24）
| 功能 | 说明 |
|------|------|
| `claude remote-control` | 远程控制子命令 |
| 自定义 npm registry | npm registry 支持 |
| 安全修复 | HTTP hooks, statusLine, fileSuggestion |

### v2.1.50（2026-02-20）
| 功能 | 说明 |
|------|------|
| **Worktree 隔离** | git worktree 支持 |
| 内存泄漏修复 | LSP, shell, circular buffer |

### v2.1.41（2026-02-13）
| 功能 | 说明 |
|------|------|
| **Windows ARM64 支持** | ARM Windows 原生 |
| `claude auth` CLI 子命令 | 认证管理命令 |
| 自动会话命名 | 生成描述性名称 |

---

## Hooks 系统

### 配置文件
```bash
.claude/hooks.json        # 项目级
~/.claude/hooks.json      # 全局
```

### 事件类型
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

### Hook 条件语法
```json
{
  "pre-edit": {
    "if": "file.endsWith('.js')",
    "script": "console.log('编辑 JS')"
  }
}
```

### defer 权限决策（v2.1.89+）
```json
{
  "PreToolUse": {
    "if": "tool.name == 'Bash'",
    "script": "return { defer: true }"
  }
}
```

---

## MCP 集成

### 管理命令
| 命令 | 说明 |
|------|------|
| `/mcp list` | 列出服务器 |
| `/mcp add 名称` | 添加服务器 |
| `/mcp remove 名称` | 移除服务器 |
| `--mcp-list` | CLI 查看 |

### CLI 子命令
```bash
claude mcp                    # MCP 配置
```

### 环境变量
| 变量 | 说明 |
|------|------|
| `CLAUDE_CODE_MCP_SERVER_NAME` | MCP 服务器名称 |
| `CLAUDE_CODE_MCP_SERVER_URL` | MCP 服务器 URL |
| `MCP_CONNECTION_NONBLOCKING=true` | -p 模式跳过等待 |

---

## Settings 配置速查

### 配置作用域
| 作用域 | 位置 | 影响范围 |
|--------|------|----------|
| Managed | 服务器/ MDM / registry | 所有用户 |
| User | `~/.claude/settings.json` | 当前用户 |
| Project | `.claude/settings.json` | 团队共享 |
| Local | `.claude/settings.local.json` | 仅本地 |

### 常用设置
| 设置 | 说明 |
|------|------|
| `model` | 默认模型 |
| `effortLevel` | 努力级别（low/medium/high） |
| `autoMemoryDirectory` | 自动记忆目录 |
| `includeGitInstructions` | 包含 Git 指令 |
| `autoUpdatesChannel` | 更新通道（stable/latest） |
| `cleanupPeriodDays` | 会话清理周期 |
| `defaultShell` | 默认 shell（bash/powershell） |
| `language` | 响应语言 |
| `alwaysThinkingEnabled` | 启用扩展思考 |
| `showThinkingSummaries` | 显示思考摘要 |

### 权限设置
```json
{
  "permissions": {
    "allow": ["Bash(git *)", "Read(./src/**)"],
    "deny": ["Read(./.env)", "Bash(rm -rf *)"],
    "defaultMode": "acceptEdits"
  }
}
```

### 沙盒设置
```json
{
  "sandbox": {
    "enabled": true,
    "failIfUnavailable": true,
    "filesystem": {
      "allowWrite": ["/tmp/build"],
      "denyRead": ["~/.aws/credentials"]
    },
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org"]
    }
  }
}
```

---

## 子代理（Subagents）

### 内置代理
```bash
general-purpose        # 通用问题解决
code-reviewer        # 代码审查专家
test-runner          # 测试执行专家
debug-expert        # 调试专家
documentation-writer # 文档专家
```

### 调用语法
| 命令 | 说明 |
|------|------|
| `/agent use code-reviewer` | 使用代码审查代理 |
| `/agent run test-runner "场景"` | 运行测试代理 |
| `/agent list` | 列出可用代理 |
| `/agent info <name>` | 查看代理信息 |

### CLI 调用
```bash
claude agents                    # 列出所有子代理
claude --agent my-agent         # 指定子代理
claude --agents '{"reviewer":{"description":"..."}}'  # 动态定义
```

---

## 工作树（Worktree）隔离

### CLI 选项
```bash
--worktree / -w [name]          # 创建 worktree
--tmux                          # 创建 tmux 会话
--tmux=classic                  # 传统 tmux
```

### 设置
```json
{
  "worktree": {
    "symlinkDirectories": ["node_modules", ".cache"],
    "sparsePaths": ["packages/my-app"]
  }
}
```

---

## 远程控制（Remote Control）

### CLI
```bash
claude remote-control --name "My Project"  # 启动服务器
claude --remote-control                     # 交互模式启用
```

### Web 会话
```bash
claude --remote "任务描述"    # 创建 Web 会话
claude --teleport            # 恢复 Web 会话到本地
```

---

## Chrome 集成

### CLI 选项
```bash
--chrome                     # 启用 Chrome 集成
--no-chrome                  # 禁用 Chrome 集成
```

---

## 输出风格配置

### 基础模式
| 命令 | 说明 |
|------|------|
| `/output-style concise` | 简洁 |
| `/output-style detailed` | 详细 |
| `/output-style code-focused` | 代码优先 |
| `/output-style explanation` | 解释详细 |
| `/output-style summary` | 摘要 |

### 语言风格
```bash
/output-style --javascript google
/output-style --python pep8
/output-style --typescript standard
```

---

## 状态行配置

### 命令
```bash
/statusline enable        # 启用
/statusline disable       # 禁用
/statusline reset         # 重置
```

### 显示信息
```bash
--show model              # 当前模型
--show tokens             # Token 使用
--show time               # 响应时间
--show rate_limits        # 速率限制
--show git-branch         # Git 分支
```

### 位置与主题
```bash
--position top/bottom     # 位置
--align left/center/right # 对齐
--theme dark/light/auto   # 主题
--style minimal/detailed  # 风格
```

---

## 终端与快捷键

### 快捷键
| 按键 | 功能 |
|------|------|
| `Ctrl+C` | 中断操作 |
| `Ctrl+D` | 退出 |
| `Tab` | 智能补全 |
| `↑/↓` | 历史导航 |
| `Esc+Esc` | 回溯菜单 |
| `Ctrl+R` | 搜索历史 |
| `Ctrl+X Ctrl+E` | 外部编辑器 |
| `Ctrl+O` | Transcript 模式 |

### 终端配置
```bash
/terminal-setup --bind "Ctrl+P" /previous
/terminal-setup --preset vim
/terminal-setup --theme monokai
```

---

## 权限管理

### 基础命令
| 命令 | 说明 |
|------|------|
| `/permissions show` | 显示权限 |
| `/permissions reset` | 重置 |
| `/permissions import file.json` | 导入 |

### 权限模式
| 模式 | 说明 |
|------|------|
| `default` | 询问确认 |
| `acceptEdits` | 自动接受编辑 |
| `plan` | 仅规划模式 |
| `auto` | 自动模式（需许可） |
| `dontAsk` | 不询问 |
| `bypassPermissions` | 跳过所有检查 |

### CLI 选项
```bash
--permission-mode <mode>           # 指定模式
--enable-auto-mode                  # 启用自动模式
--allow-dangerously-skip-permissions  # 允许跳过
```

---

## 隐私设置

### 数据保留
```bash
/privacy-settings retention 7days
/privacy-settings retention 30days
/privacy-settings retention session
/privacy-settings retention permanent
```

### 匿名化
```bash
anonymize-on/off           # 开关匿名化
strip-paths                # 移除路径
strip-usernames            # 移除用户名
mask-secrets               # 遮蔽密钥
detect-pii                 # 检测隐私信息
```

---

## 故障排除

### 诊断
```bash
/doctor                    # 健康检查
--debug                    # 调试模式
--debug-file /tmp/claude-debug.log  # 调试日志
--log-level debug          # 详细日志
claude auth status         # 认证状态
```

### 常见问题
| 问题 | 解决 |
|------|------|
| 连接超时 | 检查网络/代理 |
| 认证失败 | `/login` 或 `claude auth login` |
| 权限错误 | 检查文件权限 |
| 模型不可用 | `/model` 切换 |

### 配置重置
```bash
/config reset             # 重置配置
rm -rf .claude/           # 清理项目配置
claude auth logout && claude auth login  # 重新认证
```

---

## CLAUDE.md 与记忆系统

### CLAUDE.md 位置
```bash
~/.claude/CLAUDE.md       # 用户级
CLAUDE.md                 # 项目根目录
.claude/CLAUDE.md         # 项目 .claude 目录
```

### frontmatter 支持
```markdown
---
memory: 项目上下文记忆
effort: medium
agent: code-reviewer
---
```

### 用途
- 项目级指令和上下文
- 编码规范和约定
- 常用命令和脚本
- 团队知识共享
