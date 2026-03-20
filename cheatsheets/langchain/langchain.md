---
title: LangChain 速查
lang: python
version: "langchain==1.2.13"
date: 2026-03-19
github: langchain-ai/langchain
colWidth: 500px
---

# LangChain 速查

## 🧭 快速定位 / 一眼入口
---
lang: markdown
emoji: 🧭
link: https://docs.langchain.com/oss/python/langchain/overview
desc: 混合模式先给入口，再把高频动作压成可扫读的速查卡。LangChain 1.x 的高层入口仍然是 `create_agent`，底层运行时建立在 LangGraph 之上。
---
- `create_agent(...)` : 最高频入口，适合先跑通 Agent 再加能力
- `tools=[...]` : 给 Agent 外部动作，适合查天气、检索、调业务接口
- `response_format=Schema` : 直接拿结构化结果，适合抽取、分类、路由
- `middleware=[...]` : 动态模型、动态工具、安全护栏、审计都从这里插
- `stream()` / LangSmith tracing : 前者优化交互，后者定位链路问题

| 我现在要做什么 | 先看哪里 | 最短动作 |
| --- | --- | --- |
| 跑通最小 Agent | 最小工作流 | `create_agent` + `invoke` |
| 让 Agent 会调用函数 | 工具调用 recipe | `@tool` + `tools=[...]` |
| 避免解析自然语言 | 结构化输出 recipe | `response_format=Schema` |
| 把外部知识喂给 Agent | RAG / 检索 recipe | 检索后注入上下文 |
| 按成本或权限动态切换 | 中间件与上下文 | `wrap_model_call` / `wrap_tool_call` |
| 排查为什么答错 | 流式与观测 | `stream()` + LangSmith |

## 🚀 最小工作流
---
lang: python
emoji: 🚀
link: https://docs.langchain.com/oss/python/langchain/agents
desc: 先把“能跑”做出来，再叠加工具、结构化输出和检索。像写 JS 时先把最小组件 render 出来，LangChain 也是先让 Agent 跑通主循环。
---
- `pip install -U langchain "langchain[openai]"` : 安装核心包与 OpenAI 集成
- `from langchain.agents import create_agent` : 创建生产可用 Agent
- `agent.invoke({"messages": [...]})` : 同步执行单轮对话
- Agent 基于 LangGraph 运行时 : 默认带消息状态、工具循环、可流式输出

```bash
# 安装核心包与 OpenAI 集成
pip install -U langchain "langchain[openai]"
```

```python
# 最小 Agent：先不要急着上工具，先跑通主链路
from langchain.agents import create_agent

agent = create_agent(
    model="openai:gpt-4o-mini",
    tools=[],
    system_prompt="你是一个简洁的中文助手"
)

result = agent.invoke(
    {
        "messages": [
            {"role": "user", "content": "用一句话解释 LangChain"}
        ]
    }
)

print(result["messages"][-1].content)
```

### Quick Ref
- 输入主形态 : `{"messages": [{"role": "...", "content": "..."}]}`
- 没有工具时 : Agent 会退化成单模型节点
- 升级顺序建议 : 最小 Agent -> 工具 -> 结构化输出 -> 检索 / 中间件 -> 观测

## 🛠️ 高频场景 Recipe：工具 + 结构化输出
---
lang: python
emoji: 🛠️
link: https://docs.langchain.com/oss/python/langchain/structured-output
desc: 这是 1.x 最常见的组合拳。先让 Agent 会“做事”，再让结果可被代码稳定消费。
---
- `@tool` : 把 Python 函数暴露成工具
- `tools=[get_weather]` : 把工具挂到 Agent
- `response_format=MySchema` : 让结果直接落到结构化对象
- 直接传 schema 类型 : 若模型支持原生结构化输出，会自动优先走 `ProviderStrategy`

```python
# 工具 + 结构化输出，一次把“会做事”和“结果可解析”打通
from pydantic import BaseModel, Field
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """查询天气（示例）"""
    return f"{city}：晴，25C"

class Answer(BaseModel):
    city: str = Field(description="城市")
    summary: str = Field(description="天气摘要")

agent = create_agent(
    model="openai:gpt-4o-mini",
    tools=[get_weather],
    response_format=Answer,
    system_prompt="必要时先调用工具，再返回结构化结果"
)

result = agent.invoke(
    {
        "messages": [
            {"role": "user", "content": "帮我查询北京天气，并按结构化格式返回"}
        ]
    }
)

print(result["structured_response"])
```

| 场景 | 推荐做法 | 原因 |
| --- | --- | --- |
| 只是查单个外部动作 | 一个 `@tool` 就够 | 保持提示短、错误面小 |
| 工具很多 | 用中间件动态筛工具 | 工具太多会稀释模型选择准确率 |
| 结果要入库 / 走接口 | `response_format=Schema` | 少写正则，失败更早暴露 |
| 模型不支持原生结构化 | 仍可直接传 schema | LangChain 会回退到工具策略 |

### Quick Ref
- 工具函数签名要清晰 : 类型注解越明确，模型越容易正确选工具
- 工具描述别写空 : docstring 就像前端组件 prop 的说明文档
- 结构化输出常见用途 : 抽取、分类、路由、审核结果

## 🔎 高频场景 Recipe：RAG / 检索增强
---
lang: python
emoji: 🔎
link: https://docs.langchain.com/oss/python/langchain/retrieval
desc: RAG 不是“把所有文档全塞进去”，而是先检索出足够小、足够准的上下文，再交给模型生成答案。
---
- 基本链路 : 切分 -> 向量化 -> 检索 -> 重排 -> 生成
- 先保证召回质量，再谈提示词打磨 : 检索差时，Prompt 再花也救不回来
- LangChain 负责把检索和 Agent 主循环拼起来 : 不是替你省略索引设计

```python
# 最小 RAG 思路：先拿到上下文，再交给模型回答
from langchain.chat_models import init_chat_model

model = init_chat_model("openai:gpt-4o-mini")

context = """
LangChain agents are built on top of LangGraph.
This gives agents durable execution, streaming, persistence, and human-in-the-loop support.
""".strip()

question = "LangChain Agent 的底层能力来自哪里？"

answer = model.invoke(
    f"仅基于上下文回答。\n上下文：{context}\n问题：{question}"
)

print(answer.content)
```

| 你遇到的问题 | 优先检查 | 原因 |
| --- | --- | --- |
| 答得像没看文档 | 检索 chunk 是否命中 | 很多问题不是模型差，是上下文没召回 |
| 答案太发散 | 上下文是否过长 | 像前端状态塞太多 props，重点会被冲掉 |
| 查询词偏口语 | 先做 query rewrite | 把用户问法改成文档友好的检索词 |
| 知识有权限差异 | 检索前做权限过滤 | 不要把权限控制交给提示词“自觉” |

### Quick Ref
- 适合 RAG 的内容 : FAQ、产品文档、知识库、规范
- 不适合只靠 RAG 的内容 : 必须执行动作的任务，仍要配工具
- 排障顺序 : 数据切分 -> 检索结果 -> 重排 -> 最终提示词

## 🧠 高频场景 Recipe：上下文、记忆与中间件
---
lang: python
emoji: 🧠
link: https://docs.langchain.com/oss/python/langchain/context-engineering
desc: 1.x 里很实用的一条线是把“该给模型什么上下文”显式化。State 像组件内部 state，Store 像持久层，Runtime Context 像每次请求带进来的环境参数。
---
- `state` : 当前会话内的消息与临时状态，适合短期记忆
- `store` : 跨会话持久信息，适合偏好、权限、历史事实
- `context_schema` / Runtime Context : 每次调用传入环境信息，如租户、预算、地区
- 中间件优先于把逻辑写死在 prompt : 更像在请求管线里做控制，而不是堆大字符串

```python
# 用中间件按会话长度动态切模型
from typing import Callable
from langchain.agents import create_agent
from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
from langchain.chat_models import init_chat_model

simple_model = init_chat_model("openai:gpt-4o-mini")
complex_model = init_chat_model("openai:gpt-4.1")

@wrap_model_call
def choose_model(
    request: ModelRequest,
    handler: Callable[[ModelRequest], ModelResponse]
) -> ModelResponse:
    model = complex_model if len(request.messages) > 10 else simple_model
    return handler(request.override(model=model))

agent = create_agent(
    model=simple_model,
    tools=[],
    middleware=[choose_model]
)
```

| 需求 | 放哪一层 | 为什么 |
| --- | --- | --- |
| 当前会话历史 | `state` | 生命周期短，天然跟调用走 |
| 用户偏好 / feature flag | `store` | 需要跨会话保留 |
| 成本档位 / 地区 / 环境 | Runtime Context | 每次请求可能不同 |
| 动态模型 / 动态工具 / 审计 | middleware | 改的是执行路径，不只是文案 |

### Quick Ref
- 官方更推荐用 middleware 扩展状态 : 比直接塞 `state_schema` 更聚焦
- 动态工具选择 : 工具多时优先做，能同时降成本和降误调用
- 常见组合 : `wrap_model_call` 选模型 + `wrap_tool_call` 记日志 / 包错误

## 🛡️ 高频场景 Recipe：护栏、人工介入、流式与观测
---
lang: python
emoji: 🛡️
link: https://docs.langchain.com/oss/python/langchain/guardrails
desc: 真正上线时，重点通常不是“能不能回答”，而是“能不能安全、可追、可中断”。这张卡把生产常见收尾动作放一起。
---
- `HumanInTheLoopMiddleware` : 高风险动作前暂停，等待人工确认
- Guardrails / 过滤中间件 : 输入前拦、输出后审、工具前校验都能做
- `stream()` : 用事件流把模型输出和工具轨迹逐步推给前端
- LangSmith tracing : 排查 prompt、模型、工具链路的第一现场

```bash
# 打开 LangSmith tracing
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY="<your_api_key>"
export LANGSMITH_PROJECT="langchain-cheatsheet"
```

| 生产问题 | 最低配解法 | 说明 |
| --- | --- | --- |
| 不能直接放行高风险操作 | Human-in-the-loop | 让“执行”与“建议”分离 |
| 结果含敏感内容 | 前后置 guardrails | 不要只靠系统提示词口头约束 |
| 用户觉得很慢 | `stream()` | 先把首字节和中间过程露出来 |
| 不知道哪里错 | LangSmith tracing | 看调用链比猜 Prompt 更有效 |

### Quick Ref
- 高风险动作三件套 : 审批、审计、回滚
- 工具调用日志至少留 : 工具名、参数、结果摘要、耗时
- 流式适合 : 聊天 UI、长任务、工具轨迹可视化

## 📚 模块速查
---
lang: markdown
emoji: 📚
link: https://reference.langchain.com/python/langchain/langchain/
desc: 这一卡不讲长流程，只负责“要找哪个模块”。把正文前面的 recipe 压成检索索引。
---
- `langchain.agents.create_agent` : 高层 Agent 入口
- `langchain.chat_models.init_chat_model` : 标准化初始化聊天模型
- `langchain.tools.tool` : 把函数暴露为工具
- `response_format=Schema` : 结构化输出
- `langchain.agents.middleware.*` : 动态模型、动态工具、日志、护栏
- `stream()` : 流式输出

| 模块 / 能力 | 何时看它 |
| --- | --- |
| Agents | 你需要一个带工具循环的主入口 |
| Models / Messages | 你想直接调模型，或想精确控消息 |
| Tools | 你要接外部函数、API、数据库、检索器 |
| Structured Output | 你要结果稳定进代码，而不是人工读 |
| Retrieval | 你要接外部知识，不想纯靠模型记忆 |
| Middleware | 你要控制执行路径、策略和治理 |
| Guardrails | 你要把安全检查放进调用链 |
| Observability | 你要定位错误和成本热点 |

## ⚠️ 决策点与升级提示
---
lang: markdown
emoji: ⚠️
link: https://docs.langchain.com/oss/python/releases/changelog
desc: LangChain 迭代很快，升级时先看版本与文档，再改代码。像升级前端框架一样，先确认 breaking changes，再动业务层。
---
- 当前核对版本 : `langchain==1.2.13`
- PyPI 发布时间 : `2026-03-19`
- 先核对官方 changelog，再动代码 : 尤其是 Agent、middleware、structured output
- provider 包与核心包版本要一起看 : 避免 `langchain` 升了，集成包没跟上

| 决策点 | 建议 |
| --- | --- |
| 只是想快速做 Agent | 从 `create_agent` 开始，不要一上来就下沉 |
| 需要复杂编排 / 持久流程 | 再看 LangGraph |
| 工具一多就乱 | 先做动态工具筛选 |
| 想让结果稳定落库 | 优先结构化输出 |
| 线上要稳 | tracing、guardrails、人工介入一起补 |
