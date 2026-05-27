---
title: CrewAI 速查表
lang: python
version: "1.14.5"
date: 2026-05-27
github: crewAIInc/crewAI
colWidth: 460px
---

## 🚀 一句话定位
---
emoji: 🚀
link: https://docs.crewai.com/
desc: CrewAI 是一个 Python 多 Agent 自动化框架，当前核心心智模型不是只看 Crew，而是同时理解 Crews 和 Flows 两套编排层。
---

**核心价值：** 用 `Crews` 处理“角色协作”，用 `Flows` 处理“事件驱动和生产编排”，两者可以组合，而不是二选一。

---

## ⚡ 安装与入口
---
emoji: ⚡
link: https://docs.crewai.com/
desc: 新版安装文档优先使用 `uv`，并要求 Python `>=3.10,<3.14`。
---

### 安装

```bash
uv pip install crewai

# 带常用工具扩展
uv pip install 'crewai[tools]'
```

### 环境前提

- Python `>=3.10,<3.14`
- 推荐使用 `uv` 管理环境和依赖
- 如果你只记住一句：新版官方入口已经不是“随便 pip 一把就结束”，而是更偏完整工程化环境

### CLI 变化

- `crewai` 仍是核心 Python 包
- 官方 release 明确提到 CLI 已抽到独立 `crewai-cli` 包演进
- 所以查资料时，库 API 和 CLI 行为要分开看，不要把旧教程混在一起

---

## 🧩 两层编排模型
---
emoji: 🧩
link: https://docs.crewai.com/
desc: 新版理解 CrewAI，先看 `Crews` 和 `Flows` 的分工，再回头看 Agent/Task 只是实现细节。
---

| 层 | 作用 | 适合场景 |
|---|---|---|
| `Crews` | 角色化、多 Agent 自主协作 | 调研、写作、审查、方案讨论 |
| `Flows` | 事件驱动、状态管理、条件分支、生产控制 | 业务流程、审批流、编排自动化 |

### 怎么理解这两个概念

- `Crew` 更像“一个小组”，你给它人和任务，它自己协作
- `Flow` 更像“一个后端工作流”，你明确控制步骤、状态、分支、触发条件
- 新版 CrewAI 的主推方向明显是 `Flows + Crews` 组合，而不是只靠老式 `process=...` 驱动

---

## 🤖 Agent
---
emoji: 🤖
link: https://docs.crewai.com/concepts/agents
desc: Agent 仍然是 CrewAI 的基本执行单元，但现在更强调可组合、可观测、可在 Flow 里被调用。
---

### 定义 Agent

```python
from crewai import Agent

researcher = Agent(
    role="资深研究员",
    goal="收集最新市场信号并提炼结论",
    backstory="长期跟踪 AI 自动化市场，擅长从公开信息中抽取结构化洞察",
    verbose=True,
)
```

### 常用参数

| 参数 | 作用 |
|---|---|
| `role` | 角色身份，尽量具体 |
| `goal` | 目标，尽量可验收 |
| `backstory` | 风格与专业背景约束 |
| `tools` | 可调用工具列表 |
| `llm` | 自定义模型 |
| `verbose` | 输出执行日志 |
| `memory` | 启用记忆相关能力 |
| `allow_delegation` | 允许委派 |
| `max_iter` | 限制迭代次数，防死循环 |

### 实操建议

- `role` 不要写成“助手”这种空标签
- `goal` 要能被验收，否则 Agent 会输出空泛长文
- `backstory` 不只是文案，它会影响推理风格和产出稳定性

---

## 📋 Task
---
emoji: 📋
link: https://docs.crewai.com/concepts/tasks
desc: Task 负责把“让 Agent 干什么”描述清楚，`expected_output` 在真实项目里非常关键。
---

```python
from crewai import Task

research_task = Task(
    description="研究 2026 年 AI agent 平台化趋势，整理主要产品、定价和差异化方向",
    expected_output="Markdown 表格 + 5 条关键洞察",
    agent=researcher,
)
```

### 高价值字段

| 字段 | 说明 |
|---|---|
| `description` | 任务目标本体 |
| `expected_output` | 验收标准，决定输出质量 |
| `agent` | 指定哪个 Agent 执行 |
| `tools` | 任务级工具覆盖 |
| `context` | 引入前置任务结果 |
| `async_execution` | 允许并行 |
| `callback` | 任务完成后回调 |

### 常见误区

- 只写 `description` 不写 `expected_output`
- 期望太宽泛，导致输出不可验收
- 把多个不相关目标塞进一个 Task，最后谁都做不干净

---

## 🏃 Crews
---
emoji: 🏃
link: https://docs.crewai.com/concepts/crews
desc: Crew 是多个 Agent + Tasks 的协作容器，适合角色分工明确的场景。
---

### 最小 Crew

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
)

result = crew.kickoff()
print(result)
```

### 传统 process 速查

| 模式 | 用途 | 说明 |
|---|---|---|
| `Process.sequential` | 顺序流水线 | 最稳妥，先上游后下游 |
| `Process.hierarchical` | 管理者分派 | 需要 `manager_agent` |

> 旧内容里常见的 `Competitive` 流程在当前官方主文档主叙事里已不是重点，不适合继续当成 CrewAI 的核心三分法来教。

### Hierarchical 示例

```python
crew = Crew(
    agents=[manager, researcher, writer],
    tasks=[research_task, write_task],
    process=Process.hierarchical,
    manager_agent=manager,
)
```

---

## 🌊 Flows
---
emoji: 🌊
link: https://docs.crewai.com/concepts/flows
desc: Flow 是新版 CrewAI 的生产编排层，适合有状态、有分支、有事件驱动的自动化流程。
---

### 什么时候用 Flow

- 需要明确状态流转
- 需要条件分支/路由
- 需要把 Python 业务逻辑和 Agent 调用编在一起
- 需要更可控的生产级自动化，而不是纯对话式协作

### 核心心智模型

- Crew 更像“组织协作”
- Flow 更像“代码化工作流”
- 在复杂系统里，常见模式是 `Flow` 调度多个 `Crew`

---

## 🧠 Memory / Tools / 观测
---
emoji: 🧠
link: https://docs.crewai.com/
desc: 在新版 CrewAI 里，真正影响上线质量的是记忆、工具、遥测与控制面，而不只是 prompt 写法。
---

### Memory

```python
crew = Crew(
    agents=[researcher, analyst],
    tasks=[task1, task2],
    memory=True,
)
```

记忆适合跨步骤共享上下文，但也意味着：

- 你要关注状态污染
- 你要关注不同用户/任务的隔离
- 你要关注长流程里记忆膨胀

### Tools

```python
from crewai.tools import BaseTool

class MySearchTool(BaseTool):
    name: str = "网络搜索"
    description: str = "搜索公开信息"

    def _run(self, query: str) -> str:
        return "search results"
```

官方生态里工具很多，但工程上要控制两件事：

- 工具越多，Agent 决策面越大，越容易乱用
- 工具副作用越强，越需要 Flow 或 guardrail 把边界收紧

### 可观测与控制面

- 官方 README 明确强调 tracing / observability / control plane
- 如果你要上生产，别只看本地 demo，要同步看监控、日志、追踪与人审流程

---

## ⚠️ 常见坑
---
emoji: ⚠️
link: https://docs.crewai.com/
desc: 旧教程里很多坑还是成立，但新版最常见的问题已经变成“架构选型错位”。
---

### 1. 还在把 CrewAI 只当作 `process=...` 的三种流程框架

这会让你忽略 `Flows`，而新版官方重点已经明显转向 `Crews + Flows` 组合。

### 2. `expected_output` 太弱

```python
# 不推荐
Task(description="写报告")

# 推荐
Task(
    description="基于研究结果写市场分析",
    expected_output="Markdown 报告，含摘要/数据表/3 条建议"
)
```

### 3. `Hierarchical` 少了 `manager_agent`

```python
crew = Crew(
    agents=[manager, worker1, worker2],
    process=Process.hierarchical,
    manager_agent=manager,
)
```

### 4. 把 Flow 该做的控制逻辑塞进 Agent prompt

如果你需要“分支、状态、重试、审批”，这类逻辑更适合上 Flow，而不是写成一大段自然语言约束。

### 5. 忽略依赖和版本漂移

- Python 版本要对齐 `>=3.10,<3.14`
- 旧文章里大量示例仍停在 0.x 时代
- 当前官方 release 已到 `1.14.5`

---

## 📊 评分条速查

| 维度 | 评分 | 说明 |
|------|------|------|
| 上手难度 | ⬛⬛⬛⬜⬜ 3/5 | 入门不难，但 Flow/观测/工具边界会提高工程门槛 |
| 编排能力 | ⬛⬛⬛⬛⬛ 5/5 | `Crews + Flows` 组合能力是当前强项 |
| 生产友好度 | ⬛⬛⬛⬛⬜ 4/5 | 官方明显朝控制面和生产编排发力 |
| 文档生态 | ⬛⬛⬛⬛⬛ 5/5 | 官方文档、示例、课程都很完整 |
| 旧教程误导风险 | ⬛⬛⬛⬛⬜ 4/5 | 0.x 时代资料很多，容易学到旧心智模型 |

---

## 🧾 版本变更
---
link: https://github.com/crewAIInc/crewAI/releases/tag/1.14.5
desc: 按官方 release 摘取本次跨版本里对速查用户最重要的变化。
---

### 1.14.5

- 默认 Agent 执行器从 `CrewAgentExecutor` 继续向 `AgentExecutor` 迁移，说明内部执行模型仍在演进
- 新增 `restore_from_state_id` 等恢复能力，Flow/状态化编排更适合长流程恢复
- `crewai-cli` 被拆成独立包，CLI 与核心库边界更清晰
- 文档明确补充了从旧 Crew 用法向新 Flow 心智迁移的内容

---

## 🔗 关键资源

- 官方文档：https://docs.crewai.com/
- GitHub：https://github.com/crewAIInc/crewAI
- Releases：https://github.com/crewAIInc/crewAI/releases
- PyPI：https://pypi.org/project/crewai/
