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
| 连消息平台 | `hermes gateway setup` | Telegram / Discord / Slack / WhatsApp / Signal / Email / Home Assistant |
| 继续会话 | `hermes --continue` | 恢复最近一次会话 |

### 最短路径
```bash
# 1. 先确认能正常聊天
hermes

# 2. 再选一个模型提供商
hermes model

# 3. 再决定哪些工具可用
hermes tools

# 4. 需要的话直接做全量初始化
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
# 直接改成 Docker 沙箱
hermes config set terminal.backend docker

# 或切到远程机
hermes config set terminal.backend ssh
```

### 先把模型配对
| 提供商 | 适合什么 | 常见入口 |
|---|---|---|
| Nous Portal | 官方默认方案 | `hermes model` |
| OpenAI Codex | ChatGPT OAuth | `hermes model` |
| Anthropic | Claude 直接接入 | `hermes model` |
| OpenRouter | 多模型路由 | `hermes model` |
| Z.AI / GLM | 国内可用模型 | API key |
| Kimi / Moonshot | 编程与长上下文 | API key |
| MiniMax | 国际 / 中国区 | API key |
| Alibaba Cloud | Qwen 系列 | API key |
| Hugging Face | 聚合开源模型 | HF token |
| DeepSeek | 直接接入 | API key |
| GitHub Copilot | 订阅型接入 | OAuth / token |
| Vercel AI Gateway | 网关路由 | API key |
| Custom Endpoint | 自建 OpenAI-compatible API | base URL + key |

### 先把工具范围收口
| 工具集 | 典型能力 |
|---|---|
| `web` | 搜索和抓取网页 |
| `terminal` | 执行命令、管理进程 |
| `file` | 读写、搜索、补丁编辑 |
| `browser` | 浏览器自动化 |
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

## 高频场景

### 1. 先建项目上下文
```bash
cd your-repo
hermes

# 在 CLI 里先看命令和工具
/help
/tools
```

### 2. 先规划再执行
```bash
# 先切到更保守的执行后端
hermes config set terminal.backend docker

# 再让 agent 先给方案，不要直接开改
请先给出执行计划，再开始修改
```

### 3. 先用技能复用流程
```bash
hermes skills search kubernetes
hermes skills install openai/skills/k8s

# 在会话里直接装载
/skills
/github-pr-workflow
```

### 4. 先做消息平台接入
```bash
hermes gateway setup
```
可接入 Telegram、Discord、Slack、WhatsApp、Signal、Email、Home Assistant。

### 5. 先开语音模式
```bash
pip install "hermes-agent[voice]"
pip install faster-whisper

# CLI 内打开
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
# ~/.hermes/config.yaml
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
| `hermes --continue` / `hermes -c` | 继续最近会话 |

### CLI 内命令
| 命令 | 作用 |
|---|---|
| `/help` | 查看所有命令 |
| `/tools` | 查看工具 |
| `/model` | 切换模型 |
| `/personality <name>` | 切换人格预设 |
| `/save` | 保存会话 |
| `/voice on` | 开启语音 |
| `/voice tts` | 让回复也语音播报 |
| `/voice status` | 查看语音状态 |
| `/cron add ...` | 添加定时任务 |
| `/skills` | 浏览可用技能 |

### 关键配置
| 配置 | 作用 |
|---|---|
| `terminal.backend` | 选择执行后端 |
| `approvals.mode` | `manual` / `smart` / `off` |
| `checkpoints.enabled` | 危险操作前自动快照 |
| `memory.memory_enabled` | 启用 `MEMORY.md` |
| `memory.user_profile_enabled` | 启用 `USER.md` |
| `compression.enabled` | 长会话自动压缩 |
| `delegation.provider` | 子代理用什么提供商 |
| `clarify.timeout` | 追问等待时长 |
| `timezone` | 日志与定时任务时区 |
| `mcp_servers` | 外部工具服务 |
| `tts.provider` | 语音输出提供商 |

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

## 结构图
```text
hermes-agent/
├── run_agent.py        # 核心对话循环与工具调度
├── cli.py              # 交互式 TUI
├── toolsets.py         # 工具组与预设
├── hermes_state.py     # SQLite 会话库 + FTS5
├── batch_runner.py     # 批量任务 / 轨迹生成
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
└── skills/ / optional-skills/ / environments/ / tests/
```

## 风险控制
```bash
# 只在可信环境才放宽审批
hermes config set approvals.mode smart

# 更稳的做法：把命令执行放到容器里
hermes config set terminal.backend docker
```

## 收尾
| 想做什么 | 看哪里 |
|---|---|
| 快速上手 | `hermes` + `hermes model` + `hermes tools` |
| 场景化自动化 | `gateway` / `skills` / `cron` |
| 深入定制 | `config.yaml` / `SOUL.md` / `AGENTS.md` |
| 扩展能力 | `MCP` / `ACP` / `plugins` |

