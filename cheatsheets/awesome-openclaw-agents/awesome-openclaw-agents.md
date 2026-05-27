---
title: Awesome OpenClaw Agents 速查表
lang: bash
version: "main (2026-05)"
date: 2026-05-27
github: mergisi/awesome-openclaw-agents
colWidth: 460px
---

## 🚀 一句话定位
---
emoji: 🚀
link: https://github.com/mergisi/awesome-openclaw-agents
desc: 这是 OpenClaw 生态的超大模板仓库，当前主打 205 个生产级 `SOUL.md` 模板、24 个分类，以及从模板到部署包的完整落地链路。
---

**核心价值：** 不是教你“如何设计一个 agent”，而是直接给你一大批可拷贝、可部署、可二改的现成 agent 起点。

---

## ⚡ 快速上手
---
emoji: ⚡
link: https://github.com/mergisi/awesome-openclaw-agents/tree/main/quickstart
desc: 这个仓库保留了 `quickstart/`，仍然是最快验证模板价值的入口。
---

### 本地 quickstart

```bash
git clone https://github.com/mergisi/awesome-openclaw-agents.git
cd awesome-openclaw-agents/quickstart
npm install

# 拿一个模板作为起点
cp ../agents/productivity/orion/SOUL.md ./SOUL.md

node bot.js
```

### `openclaw agents add` 路径

```bash
mkdir -p ~/.openclaw/agents/inventory-forecaster/agent
cp awesome-openclaw-agents/agents/supply-chain/inventory-forecaster/SOUL.md \
  ~/.openclaw/agents/inventory-forecaster/agent/

openclaw agents add inventory-forecaster \
  --workspace ~/.openclaw/agents/inventory-forecaster
```

### CrewClaw 部署路径

- 仓库 README 强调可以把模板交给 CrewClaw 生成完整部署包
- 这个包不止 `SOUL.md`，还会带 Dockerfile、docker-compose、bot、README
- 所以它既是“模板仓库”，也是一个部署入口索引

---

## 📦 当前仓库规模
---
emoji: 📦
link: https://github.com/mergisi/awesome-openclaw-agents
desc: 本地旧 cheatsheet 的核心数字没有完全错，但结构已经明显落后于上游 README，需要一起更新。
---

### 当前已核验数据

- `205` 个 agent templates
- `24` 个 categories
- `132` 个 use cases
- 新增 `skills/`、`configs/`、`memory-wiki/`、`TROUBLESHOOTING.md`

### 你应该怎么理解它

- 这不只是“一个 awesome list”
- 它更像 OpenClaw 生态的模板市场 + 起步模板库 + 部署转化入口
- README 现在比以前明显更产品化，也更接近“带增长漏斗的开源仓库”

---

## 🗂️ 内容结构
---
emoji: 🗂️
link: https://github.com/mergisi/awesome-openclaw-agents
desc: 这份仓库现在已经不是单一 `agents/` 目录，而是围绕模板、技能、模型配置和 memory 建了一整套辅料。
---

| 目录 / 文件 | 作用 |
|---|---|
| `agents/` | 205 个模板主体 |
| `agents.json` | 机器可读索引 |
| `quickstart/` | 最快跑通样例 |
| `skills/` | 本地可复用 skills，覆盖 Gemma / Claude Code 等 |
| `configs/` | 多模型配置包，如 GLM-5.1、Minimax M2.7、GPT-5.4 |
| `memory-wiki/` | 预编译 memory 模板与引导脚本 |
| `USE-CASES.md` | 真实场景清单 |
| `TROUBLESHOOTING.md` | 模型、部署、已知问题排查 |

---

## 🧠 OpenClaw 灵魂文件体系
---
emoji: 🧠
link: https://github.com/mergisi/awesome-openclaw-agents
desc: 这个仓库仍然把 `SOUL.md` 当核心，但已经不是“只有 SOUL.md 就够了”的叙事。
---

| 文件 | 作用 | 类比 |
|---|---|---|
| `SOUL.md` | 角色身份、原则、风格 | Agent 的核心人格/策略文件 |
| `USER.md` | 用户画像与偏好 | 用户配置说明书 |
| `AGENTS.md` | 工作规则和流程 | 团队 SOP |
| `IDENTITY.md` | 名字、人设、展示信息 | 名片 |
| `TOOLS.md` | 工具边界与说明 | 工具接线文档 |
| `HEARTBEAT.md` | 定时巡检动作 | 定时任务清单 |
| `BOOTSTRAP.md` | 首次初始化步骤 | 安装向导 |
| `MEMORY.md` | 持久记忆 | 项目级 memory 存储 |

### 实际理解方式

- `SOUL.md` 决定它是谁
- `AGENTS.md` 决定它怎么干活
- `TOOLS.md` 决定它能干什么
- `MEMORY.md` 决定它长期记住什么

这比“只写一个 prompt”更像把一个 agent 当成长期运行的软件组件。

---

## 🏷️ 分类速查
---
emoji: 🏷️
link: https://github.com/mergisi/awesome-openclaw-agents
desc: 分类比旧版更全，除了开发/营销/商务，也补进了 Voice、Customer Success、Automation 等更新板块。
---

### 高价值类别

| 类别 | 特点 |
|---|---|
| Development | 代码审查、文档生成、排障、发布说明 |
| Marketing | SEO、内容分发、品牌监控、视频脚本 |
| Business | 线索、客服、漏斗、CRM |
| DevOps | 事件响应、部署守护、成本优化 |
| Finance | 收入分析、支出跟踪、价格预警 |
| Productivity | standup、会议纪要、邮件分类、任务管理 |

### 新增/易忽略类别

- Data
- Real Estate
- Freelance
- Voice
- Customer Success
- Automation
- Moltbook

如果你只按旧 cheatsheet 的几大类去理解，会低估这个仓库现在的覆盖面。

---

## 🧰 新增能力面
---
emoji: 🧰
link: https://github.com/mergisi/awesome-openclaw-agents
desc: 这份仓库的增量不只是模板数量，还包括模型切换、skills、本地 memory 和问题排查配套。
---

### Skills

- `skills/gemma/`：面向 Google AI Edge / Gemma 的本地技能
- `skills/claude/`：面向 Claude Code 的技能
- README 已把“skills”提升为一级能力，不再是附带目录

### Model Configs

仓库当前提供的重点配置方向：

- `configs/glm-5.1/`
- `configs/minimax-m2.7/`
- `configs/gpt-5.4/`
- `configs/advisor-hybrid/`
- `configs/ollama/`

这意味着它已经不只是 OpenClaw 模板仓，也在主动给“如何换模型、如何省钱”提供落地包。

### Memory Wiki

- `memory-wiki/` 提供预编译 memory 模板
- README 把它描述为 Karpathy-style pre-compiled agent memory
- 这是一个高价值补充，因为很多 agent 真正贵的是重复探索成本

---

## 💸 成本与多模型策略
---
emoji: 💸
link: https://github.com/mergisi/awesome-openclaw-agents
desc: README 已明显把“模型成本”和“多 provider 切换”变成主叙事，而不只是顺手提一下。
---

### 当前强调的方向

- Anthropic 定价变化后，鼓励切换到更低成本或本地方案
- 仓库给了 Ollama、本地模型、GLM、Minimax、GPT-5.4 等替代方案
- 适合把强模型留给复杂任务，把便宜模型交给 routine / heartbeat / formatting 类任务

### 简化策略

- 复杂推理 / 代码生成：强模型
- 格式化 / 分类 / 心跳巡检：轻模型
- 长期运行、低预算：Ollama / 本地方案优先

---

## ⚠️ 常见坑
---
emoji: ⚠️
link: https://github.com/mergisi/awesome-openclaw-agents/blob/main/TROUBLESHOOTING.md
desc: 这个仓库现在已经自带 troublehooting 文档，说明项目方也意识到模板落地时的环境差异很重。
---

### 1. 只复制 `SOUL.md`，没配工作目录结构

很多模板实际上默认你还有对应的 workspace、工具、环境变量和部署方式。

### 2. 误以为它只是“模板列表”

实际上现在还包括：

- models config
- local skills
- memory wiki
- deployment path
- troubleshooting

### 3. 忽略 `agents.json`

如果你要做脚本化索引、筛选或生成 UI，`agents.json` 比直接 scrape README 稳得多。

### 4. 模型切换只改 prompt，不改 config bundle

README 已把 `configs/` 提升成一级入口，说明模型迁移最好走整套配置包，不只是改模型名。

---

## 📊 评分条速查

| 维度 | 评分 | 说明 |
|------|------|------|
| 模板覆盖面 | ⬛⬛⬛⬛⬛ 5/5 | 205 个模板、24 个分类，覆盖面很广 |
| 上手速度 | ⬛⬛⬛⬛⬜ 4/5 | `quickstart/` 和 CrewClaw 都降低了门槛 |
| 配套完整度 | ⬛⬛⬛⬛⬛ 5/5 | skills、configs、memory wiki、troubleshooting 都补齐了 |
| 工程严谨度 | ⬛⬛⬛⬛⬜ 4/5 | 适合作为模板库，但最终生产质量仍取决于你二次收敛 |
| 内容漂移风险 | ⬛⬛⬛⬜⬜ 3/5 | README 演进很快，数字和目录结构需要定期同步 |

---

## 🔗 关键资源

- GitHub：https://github.com/mergisi/awesome-openclaw-agents
- Quickstart：https://github.com/mergisi/awesome-openclaw-agents/tree/main/quickstart
- Use Cases：https://github.com/mergisi/awesome-openclaw-agents/blob/main/USE-CASES.md
- Troubleshooting：https://github.com/mergisi/awesome-openclaw-agents/blob/main/TROUBLESHOOTING.md
- CrewClaw：https://crewclaw.com/
