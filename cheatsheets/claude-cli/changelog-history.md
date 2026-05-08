# Changelog History

## 2026-05-08 覆盖归档

- 来源文件: claude-cli.md
- 原模块标题: `## 新功能模块（v2.1+）`
- 覆盖原因: 更新到 v2.1.122，重建跨版本摘要，旧内容归档至此

---

## 被归档的旧内容（v2.1.41 ~ v2.1.90）

> 以下内容原位于 claude-cli.md 正文"新功能模块（v2.1+）"章节，按版本从新到旧排列。

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
