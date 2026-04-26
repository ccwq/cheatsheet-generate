---
title: Hermes Agent 速查
lang: zh-CN
version: "0.8.0"
date: "2026-04-08"
github: nousresearch/hermes-agent
colWidth: 420px
desc: Hermes Agent 是 NousResearch 的多端 AI 智能体工具链，覆盖 CLI、模型与工具集配置、消息网关、技能、MCP、记忆、定时任务和安全控制。
tags:
  - AI / LLM
  - AI 辅助工具
  - CLI 工具
  - CLI / Terminal
  - 自动化工具
---
# Hermes Agent 速查

## 快速定位
> 这是一个什么：一个可在 CLI、消息平台和编辑器里工作的 AI agent 工具链。
> 先从哪开始：`hermes model` 选模型，`hermes tools` 选工具，`hermes` 开聊。

| 目标 | 最短入口 | 备注 |
|---|---|---|
| 进入交互式对话 | `hermes` | 启动 CLI |
| 选提供商/模型 | `hermes model` | 也可切换 Codex / OpenRouter / 自定义端点 |
| 配工具集 | `hermes tools` | 按平台启用或禁用工具 |
| 一次性配置 | `hermes setup` | 把模型、工具、网关一起配完 |
| 诊断问题 | `hermes doctor` | 检查缺失依赖与配置 |
| 连消息平台 | `hermes gateway setup` | Telegram / Discord / Slack / WhatsApp / Signal / Email / Home Assistant / 飞书 / 企业微信 / Matrix / Mattermost / DingTalk |
| 继续会话 | `hermes --continue` | 恢复最近一次会话 |
| 切换模型 | `/model` | 会话中实时切换，支持所有网关平台 |
| 后台任务 | `/background <prompt>` | 不阻塞当前会话 |

### 最短路径
```bash
hermes
hermes model
hermes tools
hermes setup
```

## 起步流

### 先把运行后端定下来
| 场景 | 推荐值 | 说明 |
|---|---|---|
| 本机信任环境 | `local` | 最省事 |
| 不可信代码 | `docker` | 容器隔离 |
| 远程机器 | `ssh` | 把执行放到别处 |
| HPC / 共享机 | `singularity` | 无 root 容器 |
| 云沙箱 | `modal` / `daytona` | 适合长期任务 |

```bash
hermes config set terminal.backend docker
hermes config set terminal.backend ssh
```

### 先把模型配对
| 提供商 | 适合什么 | 常见入口 |
|---|---|---|
| Nous Portal | 官方默认方案，400+ 模型 | `hermes model` |
| OpenAI Codex | ChatGPT OAuth | `hermes model` |
| Anthropic | Claude 直接接入 | `hermes model` |
| Google AI Studio | Gemini 原生接入 | `hermes model` |
| OpenRouter | 多模型路由 | `hermes model` |
| GitHub Copilot | 订阅型接入 | OAuth / token |
| Z.AI / GLM | 国内可用模型 | API key |
| Kimi / Moonshot | 编程与长上下文 | API key |
| MiniMax | 国际 / 中国区 | API key |
| Alibaba Cloud | Qwen 系列 | API key |
| Hugging Face | 聚合开源模型 | HF token |
| DeepSeek | 直接接入 | API key |
| xAI (Grok) | 直接接入 | API key |
| Vercel AI Gateway | 网关路由 | API key |
| Custom Endpoint | 自建 OpenAI-compatible API | base URL + key |

### 先把工具范围收口
| 工具集 | 典型能力 |
|---|---|
| `web` | 搜索和抓取网页 |
| `terminal` | 执行命令、管理进程 |
| `file` | 读写、搜索、补丁编辑 |
| `browser` | 浏览器自动化（含 Camofox 反检测） |
| `vision` | 图片理解 |
| `image_gen` | 图像生成 |
| `tts` | 语音输出 |
| `skills` | 技能搜索、查看、管理 |
| `memory` | 记忆与用户画像 |
| `session_search` | 会话检索 |
| `cronjob` | 定时任务 |
| `delegation` | 子代理分工 |
| `clarify` | 追问澄清 |
| `mcp` | 外部工具接入 |
| `code_execution` | 沙箱 Python 执行 |
| `todo` | 任务规划 |
| `homeassistant` | 智能家居控制 |

## 高频场景

### 1. 先建项目上下文
```bash
cd your-repo
hermes
/help
/tools
```

### 2. 先规划再执行
```bash
hermes config set terminal.backend docker
请先给出执行计划，再开始修改
```

### 3. 先用技能复用流程
```bash
hermes skills search kubernetes
hermes skills search react --source skills-sh
hermes skills install openai/skills/k8s
/skills
/github-pr-workflow
```

### 4. 先做消息平台接入
```bash
hermes gateway setup
```
可接入 Telegram、Discord、Slack、WhatsApp、Signal、Email、Home Assistant、飞书、企业微信、Matrix、Mattermost、DingTalk。

### 5. 先开语音模式
```bash
pip install "hermes-agent[voice]"
pip install faster-whisper
/voice on
/voice tts
```

### 6. 先加定时任务
```bash
/cron add 30m "提醒我检查构建"
/cron add "every 2h" "检查服务状态"
/cron add "every 1h" "汇总新的信息流" --skill blogwatcher
```

### 7. 先接 MCP
```yaml
mcp_servers:
  github:
    command: npx
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_xxx"
```

### 8. 先接编辑器
```bash
pip install -e '.[acp]'
hermes acp
```

### 9. 先用后台任务
```bash
/background 分析 /var/log 下今天的错误日志
```

### 10. 先用 Profile 隔离多实例
```bash
hermes profile create work
hermes -p work
hermes profile list
```

### 11. 先配凭证池轮转
```yaml
credential_pool:
  openrouter:
    - sk-or-key1
    - sk-or-key2
credential_pool_strategies:
  openrouter: least_used
```

## 速查卡

### CLI 命令
| 命令 | 作用 |
|---|---|
| `hermes` | 启动交互式 CLI |
| `hermes model` | 选择模型与提供商 |
| `hermes tools` | 配置可用工具 |
| `hermes setup` | 全量配置向导 |
| `hermes doctor` | 排查问题 |
| `hermes update` | 更新到最新版本 |
| `hermes gateway` | 启动消息网关 |
| `hermes gateway setup` | 配置消息平台 |
| `hermes memory setup` | 配置外部记忆提供商 |
| `hermes memory status` | 查看记忆状态 |
| `hermes skills search <q>` | 搜索技能 |
| `hermes skills install <id>` | 安装技能 |
| `hermes acp` | 作为 ACP server 运行 |
| `hermes mcp serve` | 作为 MCP server 运行 |
| `hermes profile create <name>` | 创建隔离实例 |
| `hermes profile list` | 列出所有 Profile |
| `hermes profile switch <name>` | 切换 Profile |
| `hermes config` | 查看当前配置 |
| `hermes config set KEY VAL` | 设置配置项 |
| `hermes config check` | 检查缺失配置 |
| `hermes logs` | 查看集中日志 |
| `hermes sessions list` | 浏览历史会话 |
| `hermes --continue` / `hermes -c` | 继续最近会话 |
| `hermes -w` | Git worktree 隔离模式 |
| `hermes -s skill1,skill2` | 启动时预装技能 |

### CLI 内命令
| 命令 | 作用 |
|---|---|
| `/help` | 查看所有命令 |
| `/tools` | 查看工具 |
| `/model` | 切换模型（跨平台可用） |
| `/personality <name>` | 切换人格预设 |
| `/save` | 保存会话 |
| `/voice on` | 开启语音 |
| `/voice tts` | 让回复也语音播报 |
| `/voice status` | 查看语音状态 |
| `/cron add ...` | 添加定时任务 |
| `/skills` | 浏览可用技能 |
| `/background <prompt>` | 后台任务 |
| `/reasoning high` | 提高推理强度 |
| `/reasoning show` | 显示推理过程 |
| `/compress` | 手动压缩上下文 |
| `/rollback` | 回滚文件快照 |
| `/stop` | 中断当前 agent 运行 |
| `/approve` / `/deny` | 审批危险命令 |
| `/queue` | 排队等待而非中断 |
| `/statusbar` | 切换状态栏 |
| `/cost` | 查看用量与费用 |
| `/skin` | 切换 CLI 皮肤 |
| `/verbose` | 切换工具输出详细度 |
| `/title <name>` | 命名当前会话 |
| `/usage` | 查看 token 用量明细 |
| `/new` / `/reset` | 新建/重置会话 |

### 关键配置
| 配置 | 作用 |
|---|---|
| `terminal.backend` | 选择执行后端 |
| `approvals.mode` | `manual` / `smart` / `off` |
| `checkpoints.enabled` | 危险操作前自动快照 |
| `memory.memory_enabled` | 启用 `MEMORY.md` |
| `memory.user_profile_enabled` | 启用 `USER.md` |
| `compression.enabled` | 长会话自动压缩 |
| `compression.threshold` | 压缩触发阈值（默认 0.50） |
| `compression.summary_model` | 压缩用的摘要模型 |
| `delegation.provider` | 子代理用什么提供商 |
| `clarify.timeout` | 追问等待时长 |
| `timezone` | 日志与定时任务时区 |
| `mcp_servers` | 外部工具服务 |
| `tts.provider` | 语音输出提供商 |
| `agent.reasoning_effort` | 推理强度：none / low / medium / high / xhigh |
| `agent.tool_use_enforcement` | 工具调用强制引导：auto / true / false |
| `agent.max_turns` | 每轮最大迭代次数（默认 90） |
| `display.streaming` | CLI 实时流式输出 |
| `display.tool_progress` | 工具进度显示：off / new / all / verbose |
| `display.show_reasoning` | 显示推理过程 |
| `display.show_cost` | 状态栏显示费用 |
| `streaming.enabled` | 网关流式输出（Telegram/Discord/Slack） |
| `group_sessions_per_user` | 群聊按用户隔离会话 |
| `credential_pool` | 同提供商多 API Key 轮转 |
| `credential_pool_strategies` | 轮转策略：fill_first / round_robin / least_used |
| `fallback_providers` | 有序回退提供商链 |
| `security.redact_secrets` | 工具输出中自动脱敏密钥 |
| `security.tirith_enabled` | 命令执行前安全扫描 |
| `security.website_blocklist` | 阻止访问指定域名 |
| `privacy.redact_pii` | 网关 PII 脱敏 |
| `web.backend` | 搜索后端：firecrawl / parallel / tavily / exa |
| `browser.camofox` | Camofox 反检测浏览器 |
| `quick_commands` | 自定义快捷命令 |
| `human_delay` | 模拟人类回复节奏 |

### 记忆与上下文
| 文件 | 作用 | 作用域 |
|---|---|---|
| `SOUL.md` | 主要人格与语气 | `~/.hermes/SOUL.md` 或 `$HERMES_HOME/SOUL.md` |
| `.hermes.md` / `HERMES.md` | 项目级最高优先级说明 | 向上查找 git root |
| `AGENTS.md` | 项目约定与工程规则 | 递归目录树 |
| `CLAUDE.md` | Claude 兼容上下文 | 仅当前目录 |
| `.cursorrules` | Cursor 规则 | 仅当前目录 |
| `MEMORY.md` | agent 个人记忆 | `~/.hermes/memories/` |
| `USER.md` | 用户画像 | `~/.hermes/memories/` |

### 安全默认值
| 主题 | 建议 |
|---|---|
| 不可信代码 | 用 `docker` / `ssh` 后端 |
| 危险命令 | 保持 `approvals.mode: manual` 或 `smart` |
| 消息网关 | 用 allowlist 或 DM pairing，不要开全量放行 |
| 密钥 | 放 `~/.hermes/.env`，不要写进仓库 |
| 容器前向变量 | 只转发你能接受暴露的变量 |
| 密钥泄露 | `security.redact_secrets: true` 自动脱敏 |
| MCP 安全 | MCP OAuth 2.1 PKCE + OSV 恶意软件扫描 |
| 浏览器泄露 | URL 与 LLM 回复扫描密钥模式，阻止泄露 |

### 辅助模型配置
| 任务 | 配置路径 | 默认 |
|---|---|---|
| 图片分析 | `auxiliary.vision` | Gemini Flash |
| 网页摘要 | `auxiliary.web_extract` | Gemini Flash |
| 命令审批 | `auxiliary.approval` | Gemini Flash |
| 上下文压缩 | `compression.summary_model` | Gemini Flash |
| 会话检索 | `auxiliary.session_search` | Gemini Flash |
| 记忆刷写 | `auxiliary.flush_memories` | Gemini Flash |

每个辅助任务均支持 `provider` / `model` / `base_url` 三旋钮配置。

## 结构图
```text
hermes-agent/
├── run_agent.py
├── cli.py
├── toolsets.py
├── hermes_state.py
├── batch_runner.py
├── agent/
│   ├── prompt_builder.py
│   ├── context_compressor.py
│   ├── auxiliary_client.py
│   └── skills_hub.py
├── tools/
│   ├── registry.py
│   ├── approval.py
│   ├── terminal_tool.py
│   ├── file_operations.py
│   ├── web_tools.py
│   ├── vision_tools.py
│   ├── delegate_tool.py
│   ├── session_search_tool.py
│   ├── cronjob_tools.py
│   └── skill_manager_tool.py
├── gateway/
│   ├── run.py
│   ├── config.py
│   └── platforms/
├── plugins/
└── skills/ / optional-skills/ / environments/ / tests/
```

## 风险控制
```bash
hermes config set approvals.mode smart
hermes config set terminal.backend docker
hermes config set security.redact_secrets true
hermes config set security.tirith_enabled true
```

## 收尾
| 想做什么 | 看哪里 |
|---|---|
| 快速上手 | `hermes` + `hermes model` + `hermes tools` |
| 场景化自动化 | `gateway` / `skills` / `cron` |
| 深入定制 | `config.yaml` / `SOUL.md` / `AGENTS.md` |
| 扩展能力 | `MCP` / `ACP` / `plugins` |
| 多实例隔离 | `hermes profile` |
| 排障 | `hermes doctor` / `hermes logs` |
