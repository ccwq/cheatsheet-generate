---
title:Awesome OpenClaw Agents 速查表
lang:bash
version: "main (2026-05)"
date: 2026-05-25
github: mergisi/awesome-openclaw-agents
colWidth: 460px
---

## 🚀 一句话定位
---
emoji: 🚀
link: https://github.com/mergisi/awesome-openclaw-agents
desc: 205 个生产级 AI Agent SOUL.md 模板，覆盖 24 个领域，拿来即用，MIT 协议开源。
---

**核心价值：** Skip the setup. Get a full deploy package. 选角色 → 复制 SOUL.md → 注册运行，三步搞定一个 Agent。

---

## ⚡ 快速上手
---
emoji: ⚡
link: https://github.com/mergisi/awesome-openclaw-agents
desc: 克隆仓库 → 选模板 → 启动，最快 3 分钟跑起来。
---

### 方式一：Quickstart（推荐）

```bash
git clone https://github.com/mergisi/awesome-openclaw-agents.git
cd awesome-openclaw-agents/quickstart
npm install

# 复制任意 Agent 的 SOUL.md 作为起点
cp ../agents/productivity/orion/SOUL.md ./

# 启动
node bot.js
```

### 方式二：openclaw agents add

```bash
# 在 ~/.openclaw/agents/ 下安装指定 Agent
mkdir -p ~/.openclaw/agents/inventory-forecaster/agentcp
cp awesome-openclaw-agents/agents/supply-chain/inventory-forecaster/SOUL.md \
   ~/.openclaw/agents/inventory-forecaster/agent/

openclaw agents add inventory-forecaster \
  --workspace ~/.openclaw/agents/inventory-forecaster
```

### 方式三：CrewClaw 一键部署

```bash
# 访问 https://crewclaw.com/agents
# 选模板 → 下载完整包（Dockerfile + docker-compose + bot + README）
# 解压后直接 docker compose up
```

---

## 🗂️ 七大配置文件（OpenClaw 灵魂体系）
---
emoji: 🗂️
link: https://github.com/mergisi/awesome-openclaw-agents
desc: OpenClaw 用纯 Markdown 文件定义 Agent，每次会话注入"灵魂"，不需要写代码。
---

| 文件 | 回答的问题 | 类比 | 加载时机 |
|------|-----------|------|---------|
| **SOUL.md** | 它是谁？性格/价值观/行为准则 | Agent 的"灵魂"，定义人格 | 每次会话 |
| **USER.md** | 为谁服务？用户画像/偏好 | 用户的使用说明书 | 每次会话 |
| **AGENTS.md** | 怎么干活？决策规则/工作流程 | 岗位 SOP | 每次会话 |
| **IDENTITY.md** | 叫什么？名字/头像/角色描述 | 名片/简历 | 每次会话 |
| **TOOLS.md** | 用什么工具？API/插件/能力 | 工具操作手册 | 按需加载 |
| **HEARTBEAT.md** | 定期做什么？心跳任务/定时检查 | 巡检清单 | 心跳轮询时 |
| **BOOTSTRAP.md** | 首次怎么初始化？ | 入职引导手册 | 仅首次运行 |
| **MEMORY.md** | 长期记住什么？事实/经验/偏好 | 持久记忆 | 持续累积 |

### SOUL.md 三要素（Agent 人格核心）

```markdown
# SOUL.md 模板结构
## 身份 (Identity)
- 角色名称、专业背景、核心价值观

## 行为准则 (Behavioral Guidelines)
- 说话风格、拒绝场景、边界约束

## 专业能力 (Expertise)
- 擅长的领域、可输出的价值
```

> 一句话：SOUL.md 定风格，USER.md 定对象，AGENTS.md 定流程。少一个都容易翻车。

---

## 📦 205 个模板 · 24 大类速查
---
emoji: 📦
link: https://github.com/mergisi/awesome-openclaw-agents
desc: 按领域分类，可按场景直接检索，每类都有多个子模板。
---

### 💼 开发（Development）— 16 个

| Agent | 场景 |
|-------|------|
| 🔎 **Lens** | PR 代码审查、安全扫描 |
| 📖 **Scribe** | README / API 文档生成 |
| 🐛 **Trace** | 错误分析、根因调查 |
| 🧪 **Probe** | API 测试、健康检查 |
| 📋 **Log** | 自动 Changelog / Release Notes |
| 🔗 **Dependency Scanner** | CVE 扫描 / 许可证检查 |
| 🔀 **PR Merger** | 自动合并 / 冲突检测 |
| 🗄️ **Migration Helper** | 数据库迁移 / 回滚辅助 |
| 🛡️ **Sentinel** | TypeScript / Next.js 边界审查 |
| 🔍 **Whisper** | 吞没错误 / 缺失事件检测 |
| 🚨 **Beacon** | SEO 博客部署检查清单 |
| ⚒️ **Forge** | Next.js / Vercel 构建失败诊断 |
| ⚖️ **Verdict** | PR 合并就绪性分析 |

### 📣 营销（Marketing）— 20 个

| Agent | 场景 |
|-------|------|
| ✍️ **Echo** | 博客 / 社媒 / 邮件内容生成 |
| 📱 **Buzz** | Twitter / LinkedIn 多平台管理 |
| 🔍 **Rank** | SEO 内容 / 关键词研究 |
| 📬 **Digest** | 新闻周刊自动编排 |
| 🔭 **Scout** | 竞品监控 / 定价情报 |
| 👁️ **Brand Monitor** | 品牌提及监控 / 舆情预警 |
| ♻️ **Content Repurposer** | 一篇内容 → 多平台分发 |
| 📖 **Book Writer** | 整本书流水线（6阶段） |
| 🎥 **UGC Video** | AI 影响者风格视频脚本 |
| 📸 **Instagram Reels** | Reels 脚本 + 探索优化 |

### 💼 商务（Business）— 12 个

| Agent | 场景 |
|-------|------|
| 🎧 **Compass** | 工单分流 / 响应起草 / 升级 |
| 💼 **Pipeline** | 线索评分 / 外联 / 漏斗报告 |
| 💰 **Ledger** | 支付监控 / 发票追踪 / MRR |
| 🔮 **Sentinel** | 流失风险评分 / 留存动作 |
| 🤝 **Personal CRM** | 联系人追踪 / 跟进提醒 |
| 🎯 **Deal Forecaster** | 交易关闭概率预测 |
| 💲 **Competitor Pricing** | 竞品定价每日跟踪 |

### 🚀 DevOps — 10 个

| Agent | 场景 |
|-------|------|
| 🚨 **Incident Responder** | 告警分流 / 事件协调 |
| 🚀 **Deploy Guardian** | CI/CD 监控 / 回滚告警 |
| 🖥️ **Infra Monitor** | 服务器健康 / 磁盘/CPU |
| 💸 **Cost Optimizer** | 云成本监控 / 节省建议 |
| 🔧 **Self-Healing Server** | 自动重启 / 磁盘清理 |
| 📜 **Log Analyzer** | 日志解析 / 异常检测 |

### 💰 金融（Finance）— 10 个

| Agent | 场景 |
|-------|------|
| 🧾 **Expense Tracker** | 费用分类 / 预算告警 |
| 📈 **Revenue Analyst** | MRR 分析 / 流失预测 |
| 📉 **Trading Bot** | 投资组合跟踪 / 价格预警 |
| 🔍 **Fraud Detector** | 交易异常检测 |
| 📊 **Financial Forecaster** | 收入/支出预测 |

### 🏥 医疗（Healthcare）— 7 个

| Agent | 场景 |
|-------|------|
| 🧘 **Wellness Coach** | 每日健康检查 / 情绪追踪 |
| 🥗 **Meal Planner** | 周餐计划 / 营养追踪 |
| 🩺 **Symptom Triage** | 结构化症状评估 / 紧急度判断 |
| 💊 **Medication Checker** | 药物相互作用 / 剂量告警 |
| 📋 **Clinical Notes** | SOAP 格式临床文档 |

### ⚖️ 法律（Legal）— 6 个

| Agent | 场景 |
|-------|------|
| 📜 **Contract Reviewer** | 合同审查 / 风险条款检测 |
| ✅ **Compliance Checker** | 合规监控 / 截止日期跟踪 |
| 📋 **Policy Writer** | 内部政策 / 服务条款起草 |
| 🔬 **Patent Analyzer** | 专利分析 / 侵权风险 |

### 👥 人力资源（HR）— 7 个

| Agent | 场景 |
|-------|------|
| 🤝 **Recruiter** | 简历筛选 / 面试安排 |
| 🎒 **Onboarding** | 新员工入职引导 |
| 📊 **Performance Reviewer** | 绩效反馈收集 / 总结 |
| 📄 **Resume Screener** | 简历评分 / 候选人排名 |
| 🚪 **Exit Interview** | 离职面谈 / 留存洞察 |

### 🧘 个人（Personal）— 7 个

| Agent | 场景 |
|-------|------|
| 📅 **Atlas** | 日程优化 / 早晚复盘 |
| 💪 **Iron** | 健身计划 / 营养追踪 |
| ✈️ **Travel Planner** | 行程规划 / 预算管理 |
| 👨‍👩‍👧‍👦 **Family Coordinator** | 共享日历 / 餐食规划 |
| 🏠 **Home Automation** | 通过 Telegram 控制智能家居 |

### 🎓 教育（Education）— 8 个

| Agent | 场景 |
|-------|------|
| 🎓 **Tutor** | 概念讲解 / 练习题 |
| ❓ **Quiz Maker** | 从学习材料自动生成测验 |
| 🔬 **Research Assistant** | 论文搜索 / 摘要 / 引用 |
| 🃏 **Flashcard Generator** | 间隔重复记忆卡生成 |

### 其他类别

| 类别 | Agent 数 | 典型场景 |
|------|---------|---------|
| **Productivity** | 7 | 任务协调 / 邮件分类 / 会议记录 |
| **E-Commerce** | 6 | 库存预测 / 竞品监控 |
| **Supply Chain** | 5 | 需求预测 / 补货推荐 |
| **Compliance** | 4 | 监管合规监控 |
| **Creative** | 12 | 品牌设计 / 视频脚本 |
| **Security** | 3 | 漏洞扫描 / 威胁监控 |
| **SaaS** | 5 | 订阅管理 / 功能分析 |
| **Moltbook** | 9 | 跨知识库问答 |

---

## 🔧 核心概念
---
emoji: 🔧
link: https://github.com/mergisi/awesome-openclaw-agents
desc: 理解 OpenClaw 的关键架构概念：SubAgent、工具过滤管道、Sandbox 隔离层。
---

### SubAgent 机制

父 Agent 把子任务打包成 `SpawnSubagentParams`，扔给注册中心 → 注册中心拉起独立会话执行 → 通过 `announce` 队列把结果返回给父 Agent。

```
关键特性：
- 超时控制（防止任务卡死）
- 孤儿恢复（子进程意外退出后重启）
- 上下文隔离（fork 继承 / isolated 不继承父对话）
```

### 工具过滤管道（Tool Pipeline）

```
用户请求
  ↓
全局工具 → 用户白名单 → Agent 类型过滤 → 最终工具列表
```

每个 Agent 只拿到自己需要的工具，不是全量工具暴露。

### Sandbox 隔离层

Docker 容器执行 Agent 的工具操作（exec/read/write/edit），而非直接在主机上跑，确保安全边界。

---

## ⚙️ 模型配置（Model Configs）
---
emoji: ⚙️
link: https://github.com/mergisi/awesome-openclaw-agents/tree/main/configs
desc: 开箱即用的 GLM-5.1、Minimax M2.7、GPT-5.4 模型配置，支持成本优化和多 Provider 混用。
---

### 多 Provider 混用示例

```bash
# configs/ 下有多种模型配置
# 可按任务类型分配不同模型（高成本任务用强模型，简单任务用轻模型）
cp configs/glm-5.1/openai.yaml ~/.openclaw/agents/<agent>/agent/openai.yaml
```

### 成本优化策略

- 简单任务（分类/格式化）→ 轻量模型（GPT-4o-mini / GLM-Flash）
- 复杂任务（推理/代码）→ 强模型（GPT-4 / Claude）
- 定时心跳任务 → 最低成本模型

---

## 📊 评分条速查

| 维度 | 评分 | 说明 |
|------|------|------|
| 模板数量 | ⬛⬛⬛⬛⬛ 5/5 | 205 个，覆盖 24 个领域 |
| 上手难度 | ⬛⬛⬛⬛⬜ 4/5 | Quickstart 3 分钟可跑通 |
| 分类深度 | ⬛⬛⬛⬛⬛ 5/5 | 从开发到医疗到法律，细分精准 |
| 开源质量 | ⬛⬛⬛⬛⬜ 4/5 | MIT，49 次 commit，维护活跃 |
| 部署便利 | ⬛⬛⬛⬛⬛ 5/5 | CrewClaw 一键部署完整包 |

---

## 🔗 关键资源

- GitHub：https://github.com/mergisi/awesome-openclaw-agents
- 全部模板：https://crewclaw.com/agents
- Quickstart：https://github.com/mergisi/awesome-openclaw-agents/tree/main/quickstart
- agents.json：机器可读的 205 个模板索引