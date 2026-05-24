---
title: CrewAI 速查表
lang: python
version: "0.88.0"
date: 2026-05-25
github: crewAIInc/crewAI
colWidth: 460px
---

## 🚀 安装与入口
---
emoji: 🚀
link: https://docs.crewai.com/
desc: CrewAI 是一个用 role-based 多 Agent 协作编排框架，安装简单，上手极快。
---

### 安装

```bash
pip install crewai crewai-tools              # 核心包
pip install 'crewai[tools]'                   # 含常用工具集
pip install langchain langchain-openai        # 配合 LLM
```

### 五大核心概念

| 概念 | 作用 | 关键属性 |
|------|------|---------|
| **Agent** | 具有人格的执行单元 | role、goal、backstory、tools |
| **Task** | 具体工作单元 | description、expected_output、agent |
| **Crew** | Agent + Task 组合容器 | agents、tasks、process |
| **Process** | 任务执行策略 | Sequential / Hierarchical / Competitive |
| **Tool** | Agent 可调用的外部能力 | 搜索、文件、API 等 |

---

## 🤖 Agent：角色沉浸式人格核心
---
emoji: 🤖
link: https://docs.crewai.com/core-concepts/agents
desc: Agent 是 CrewAI 的灵魂载体，人格通过 role + goal + backstory 三要素定义。
---

### 必填三要素

```python
from crewai import Agent

agent = Agent(
    role="资深市场分析师",       # 身份标签（需具体，非"助手"）
    goal="收集竞品数据并提炼可操作的业务洞察",  # 具体目标
    backstory="曾在麦肯锡工作8年，擅长从噪声中提取信号，\
                熟悉tech/VC行业叙事逻辑",       # 背景故事，越详细代入越强
    tools=[search_tool, scraping_tool],  # 可选
    verbose=True                          # 打印完整思考日志
)
```

### 可选属性

```python
agent = Agent(
    # ... 必填三要素 ...
    llm=ChatOpenAI(model="gpt-4o", temperature=0.7),  # 自定义 LLM
    max_iter=5,                                       # 最大迭代次数，防死循环
    memory=True,                                      # 启用三层记忆系统
    cache=True,                                       # 启用工具调用缓存
    allow_delegation=True,                            # 允许委派任务（Hierarchical 流程）
    step_callback=my_callback                         # 每步回调
)
```

### 角色定义最佳实践

- **role** 要具体，不要模糊的"助手"——「SEO 内容优化专家」优于「内容专家」
- **goal** 要可量化/可验收——「提炼3个差异化卖点」优于「了解竞品」
- **backstory** 要有叙事感——行业经验、专业领域、语言风格都写进去
- backstory 决定文风和输出风格，是 CrewAI 区别于其他框架的核心优势

---

## 📋 Task：结构化任务单元
---
emoji: 📋
link: https://docs.crewai.com/core-concepts/tasks
desc: Task 定义 Agent 需要完成的具体工作，包含描述、预期输出、分配方式。
---

### 基本定义

```python
from crewai import Task

task = Task(
    description="搜索2024年AI Agent领域最新融资事件，\
                 整理TOP10公司的融资金额和投资方",
    expected_output="一份Markdown格式表格，含公司名/金额/轮次/投资方",
    agent=researcher,                # 直接指定负责 Agent
    tools=[search_tool]             # 可选覆盖工具
)
```

### 任务依赖链（Sequential 流程）

```python
task1 = Task(
    description="搜索竞品信息",
    agent=researcher
)
task2 = Task(
    description="基于竞品报告撰写分析文章",
    agent=writer
)
task3 = Task(
    description="审核文章并提出修改意见",
    agent=reviewer
)
# 按顺序执行，task2 可见 task1 输出
```

### 关键属性速查

| 属性 | 必填 | 说明 |
|------|------|------|
| `description` | ✅ | 任务描述，支持 f-string 格式化 |
| `expected_output` | ✅ | 验收标准，决定输出质量 |
| `agent` | 可选 | 直接分配，或由 Crew 动态分配 |
| `tools` | 可选 | 任务级工具覆盖 |
| `async_execution` | 可选 | True = 并行执行 |
| `context` | 可选 | 依赖的前置任务列表 |
| `callback` | 可选 | 完成后回调函数 |

---

## ⚙️ Process：任务执行策略
---
emoji: ⚙️
link: https://docs.crewai.com/core-concepts/processes
desc: Process 定义 Agent 之间的协作方式，CrewAI 支持三种策略。
---

### 三种策略对比

| 策略 | 行为 | 适用场景 |
|------|------|---------|
| `Sequential` | 任务按链式顺序执行，下游可见上游输出 | 流水线（调研→写稿→审核） |
| `Hierarchical` | 层级管理，Manager Agent 分配任务给下属 | 企业组织模拟 |
| `Competitive` | Agent 并行抢任务，最先认领者执行 | 头脑风暴/多方案并行 |

### Sequential 流程

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, write_task, edit_task],
    process=Process.sequential    # 默认，顺序执行
)
result = crew.kickoff()
```

### Hierarchical 流程

```python
crew = Crew(
    agents=[manager, researcher, writer],
    tasks=[research_task, write_task],
    process=Process.hierarchical,  # Manager 分配任务
    manager_agent=manager          # 必须指定 Manager Agent
)
# Manager 自动分配任务给下属，无需手动指定 task.agent
```

---

## 🧠 Memory：三层记忆系统
---
emoji: 🧠
link: https://docs.crewai.com/core-concepts/memory
desc: CrewAI 内置三层记忆，短时+长时+实体，支持用户级隔离。
---

### 启用方式

```python
crew = Crew(
    agents=[researcher, analyst],
    tasks=[task1, task2],
    memory=True    # 启用统一记忆接口
)
```

### 三层记忆行为

| 层 | 特征 | 控制参数 |
|----|------|---------|
| **短时记忆** | 时效性高，近期权重大自然衰减 | `recency_weight=0.3`，半衰期30天 |
| **长时记忆** | 跨会话积累，高价值信息持久化 | 实体提取 + 向量检索 |
| **实体记忆** | 人物/公司/概念等实体追踪 | 自动关系图谱 |

### 用户级隔离

```python
user_memory = Memory(
    storage_path=f"/data/memories/{user_id}",
    scope="user"    # 隔离不同用户数据
)
crew = Crew(
    agents=[researcher],
    memory=user_memory
)
```

---

## 🔧 Tool：扩展 Agent 能力
---
emoji: 🔧
link: https://docs.crewai.com/core-concepts/tools
desc: Agent 通过 Tool 调用外部能力，支持 @tool 装饰器快速定义。
---

### 方式一：@tool 装饰器（推荐）

```python
from crewai import Agent
from crewai.tools import tool

class CalculatorTools:
    @tool("计算器")
    def calculate(self, expression: str) -> str:
        """执行数学表达式计算"""
        return str(eval(expression))

calculator = CalculatorTools()
```

### 方式二：BaseTool 子类

```python
from crewai.tools import BaseTool

class MySearchTool(BaseTool):
    name: str = "网络搜索"
    description: str = "搜索最新新闻和信息"

    def _run(self, query: str) -> str:
        # 实现搜索逻辑
        return search_results

agent = Agent(
    tools=[MySearchTool()]
)
```

### 内置工具

```python
from crewai.tools import (
    DirectoryReadTool,      # 读目录
    FileReadTool,          # 读文件
    FileWriteTool,         # 写文件
    SeleniumTool,          # 浏览器自动化
    CSVSearchTool,         # CSV 搜索
    JSONSearchTool,        # JSON 搜索
    WebsiteSearchTool,     # 网站搜索
)
```

### LangChain 工具集成

```python
from langchain.tools import DuckDuckGoSearchRun

search_tool = DuckDuckGoSearchRun()
agent = Agent(
    tools=[search_tool]    # 直接传入 LangChain 工具
)
```

---

## 🏃 Crew：启动与执行
---
emoji: 🏃
link: https://docs.crewai.com/core-concepts/crews
desc: Crew 是最终执行单元，kickoff 后返回完整结果。
---

### 最小启动

```python
from crewai import Crew, Agent, Task, Process
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", temperature=0.7)

researcher = Agent(
    role="研究员", goal="收集信息", backstory="你是专业研究员",
    llm=llm, verbose=True
)
writer = Agent(
    role="作家", goal="撰写内容", backstory="你是资深编辑",
    llm=llm
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential
)

result = crew.kickoff()    # 同步执行
print(result)             # 返回完整输出
```

### 异步执行

```python
# Task 级别异步
task = Task(description="并行任务", async_execution=True)

# Crew 级别异步
result = await crew.kickoff_async()
```

### 多输出格式

```python
result.raw                   # 原始输出
result.pydantic             # Pydantic 模型解析
result.json_dict            # JSON 字典
```

---

## ⚠️ 常见陷阱
---
emoji: ⚠️
link: https://docs.crewai.com/how-to/error-handling
desc: CrewAI 开发中的高频踩坑点。
---

### 1. Agent 人格漂移

```python
# ❌ 模糊角色导致输出不稳定
role="助手"
goal="帮忙"

# ✅ 具体角色锁定输出质量
role="投资分析师"
goal="从投融资视角分析AI赛道，写出有数据支撑的投资建议"
backstory="你有10年VC经验，主导过多个AI项目的投资决策"
```

### 2. Task expected_output 缺失

```python
# ❌ 没有验收标准，输出随意
description="写一篇文章"

# ✅ 明确输出格式，便于自动验收
description="搜索竞品信息"
expected_output="Markdown表格：竞品名 | 核心功能 | 定价 | 融资阶段"
```

### 3. Process 选错导致任务乱序

```python
# ❌ Hierarchical 没指定 manager
process=Process.hierarchical  # 缺少 manager_agent 报错

# ✅ 明确指定管理器
crew = Crew(
    agents=[manager, worker1, worker2],
    process=Process.hierarchical,
    manager_agent=manager
)
```

### 4. 工具调用超时/死循环

```python
# 设置迭代上限
agent = Agent(
    goal="无限探索",  # 容易死循环的场景
    max_iter=10       # 防止无限循环
)
```

### 5. 多 Agent 上下文截断

```python
# 任务链过长时，上游输出截断下游输入
# 解决：在 backstory 中注明"简洁输出，只保留关键信息"
```

---

## 📊 评分条速查

| 维度 | 评分 | 说明 |
|------|------|------|
| 上手难度 | ⬛⬛⬛⬛⬜ 4/5 | 概念简单，backstory 写好需要练习 |
| 人格深度 | ⬛⬛⬛⬛⬜ 4/5 | backstory 驱动，人格代入感极强 |
| 灵活性 | ⬛⬛⬛⬛⬜ 4/5 | 三种 Process，覆盖大多数场景 |
| 输出结构 | ⬛⬛⬜⬜⬜ 2/5 | 自由文本，需要人工审核质量 |
| 社区生态 | ⬛⬛⬛⬛⬛ 5/5 | 37.9k ⭐，文档完善 |

---

## 🔗 关键资源

- 官方文档：https://docs.crewai.com/
- GitHub：https://github.com/crewAIInc/crewAI
- 示例：https://docs.crewai.com/examples