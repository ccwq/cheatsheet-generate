---
title: LangGraph 速查表
lang: python
version: "1.0.6"
date: 2026-01-12
github: langchain-ai/langgraph
colWidth: 460px
---

## 🧭 核心定位
---
lang: python
emoji: 🧭
link: https://docs.langchain.com/oss/python/langgraph/overview
desc: LangGraph 适合需要状态、持久化、中断恢复和自定义编排的 Agent / Workflow 场景。
---

- LangGraph 是底层图编排运行时：用 `StateGraph` 把节点、边和状态连接起来
- LangChain v1 的 `create_agent` 构建在 LangGraph 之上：标准 ReAct / tool loop 优先用 LangChain，高定制工作流再下沉到 LangGraph
- 适合长时运行、需要人工审批、需要 checkpoint、需要 time travel 的任务
- 核心对象：`StateGraph`、`START`、`END`、`Command`、`interrupt`、`checkpointer`
- 常见心智模型：节点负责“读状态 -> 产出局部更新”，图负责“路由 + 持久化 + 恢复”

## 🚀 最小可运行图
---
lang: python
emoji: 🚀
link: https://docs.langchain.com/oss/python/langgraph/quickstart
desc: 从一个只有单节点的图开始，先跑通 compile -> invoke 的最小闭环。
---

- `StateGraph(State)`：声明图使用的状态结构
- `add_node()`：注册节点函数
- `add_edge(START, "...")` / `add_edge("...", END)`：连接执行路径
- `compile()`：生成可执行 graph
- `invoke(input)`：同步执行并返回最终状态

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


class State(TypedDict):
    topic: str
    draft: str


def write_draft(state: State):
    return {"draft": f"围绕 {state['topic']} 生成一段摘要"}


builder = StateGraph(State)
builder.add_node("write_draft", write_draft)
builder.add_edge(START, "write_draft")
builder.add_edge("write_draft", END)

graph = builder.compile()
result = graph.invoke({"topic": "LangGraph"})
print(result)
```

## 💬 MessagesState 聊天骨架
---
lang: python
emoji: 💬
link: https://docs.langchain.com/oss/python/langgraph/use-graph-api
desc: 需要自己控制消息流、节点顺序和工具节点时，用 MessagesState 比直接写 Agent 更灵活。
---

- `MessagesState`：内置消息状态结构，适合聊天式图
- 节点通常返回 `{"messages": [new_message]}`：由运行时追加到消息列表
- 只想快速获得通用 Agent：优先 `langchain.agents.create_agent`
- 需要定制路由、审批和恢复：再切回 LangGraph

```python
# 假设模型 provider 已配置
from langchain.chat_models import init_chat_model
from langgraph.graph import StateGraph, MessagesState, START, END

model = init_chat_model("openai:gpt-4o-mini")


def chatbot(state: MessagesState):
    reply = model.invoke(state["messages"])
    return {"messages": [reply]}


builder = StateGraph(MessagesState)
builder.add_node("chatbot", chatbot)
builder.add_edge(START, "chatbot")
builder.add_edge("chatbot", END)

graph = builder.compile()
graph.invoke({"messages": [{"role": "user", "content": "用一句话解释 LangGraph"}]})
```

## 🧱 状态 Schema 与 Reducer
---
lang: python
emoji: 🧱
link: https://docs.langchain.com/oss/python/langgraph/graph-api
desc: Reducer 用来定义同一状态字段在多步或并行分支下该如何合并。
---

- `TypedDict`：最常见的状态 schema 载体
- `Annotated[..., reducer]`：声明字段的合并策略
- 没有 reducer 的字段：后写覆盖前写
- 列表累积、日志聚合、消息追加：通常要显式写 reducer

```python
from operator import add
from typing_extensions import Annotated, TypedDict


class State(TypedDict):
    query: str
    steps: Annotated[list[str], add]
    answer: str


def plan(state: State):
    return {"steps": ["plan"]}


def search(state: State):
    return {"steps": ["search"], "answer": f"已检索：{state['query']}"}
```

## 🔀 条件路由与 Command
---
lang: python
emoji: 🔀
link: https://docs.langchain.com/oss/python/langgraph/use-graph-api
desc: 需要同时更新状态和跳转目标时，直接从节点返回 Command 最干净。
---

- `add_conditional_edges()`：适合把“路由函数”和“业务节点”分开
- `Command(goto=..., update=...)`：适合在同一个节点里同时做状态更新和跳转
- `goto` 决定下一跳节点
- `update` 写入状态增量

```python
from typing import Literal
from typing_extensions import TypedDict
from langgraph.types import Command


class RouteState(TypedDict):
    question: str
    need_search: bool
    route: str


def router(state: RouteState) -> Command[Literal["search", "answer"]]:
    if state["need_search"]:
        return Command(goto="search", update={"route": "search"})
    return Command(goto="answer", update={"route": "answer"})
```

### 什么时候用哪种方式
- `add_edge()`：路径固定
- `add_conditional_edges()`：只负责分流
- `Command`：分流同时还要写状态

## 💾 持久化与 Thread
---
lang: python
emoji: 💾
link: https://docs.langchain.com/oss/python/langgraph/persistence
desc: Checkpointer 会在每个 super-step 保存状态；同一个 thread_id 就是同一条可恢复执行链。
---

- `checkpointer`：LangGraph 内建持久化入口
- `thread_id`：恢复、记忆、time travel 的主键
- 开发期可用 `InMemorySaver`
- 生产环境优先 SQLite / Postgres 等持久化后端

```python
from langgraph.checkpoint.memory import InMemorySaver


memory = InMemorySaver()
graph = builder.compile(checkpointer=memory)

config = {"configurable": {"thread_id": "user-42"}}

# 首轮执行
graph.invoke({"topic": "LangGraph"}, config=config)

# 继续同一线程；运行时会从已有 checkpoint 恢复状态
graph.invoke({"topic": "继续补充案例"}, config=config)

# 检查当前线程状态
snapshot = graph.get_state(config)
print(snapshot.values)
```

### 常见规则
- 同一个用户会话保持同一个 `thread_id`
- 需要 `interrupt`、memory、time travel 时，必须配置 checkpointer
- 临时实验可用内存 saver，线上不要依赖进程内内存

## 🛑 Interrupt 与人工审批
---
lang: python
emoji: 🛑
link: https://docs.langchain.com/oss/python/langgraph/interrupts
desc: 用 interrupt 在节点中暂停执行，等待人工输入，再用 Command(resume=...) 接着跑。
---

- `interrupt(payload)`：在节点内部抛出暂停点
- `Command(resume=value)`：恢复执行，并把 `value` 作为 `interrupt()` 的返回值
- 恢复时必须复用同一个 `thread_id`
- 节点会从头重跑：`interrupt` 前的副作用要保持幂等

```python
from typing_extensions import TypedDict
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command, interrupt


class ReviewState(TypedDict):
    draft: str
    approved: bool


def human_review(state: ReviewState):
    approved = interrupt(
        {
            "kind": "approval",
            "message": "是否发布这段内容？",
            "draft": state["draft"],
        }
    )
    return {"approved": bool(approved)}


builder = StateGraph(ReviewState)
builder.add_node("human_review", human_review)
builder.add_edge(START, "human_review")
builder.add_edge("human_review", END)

graph = builder.compile(checkpointer=InMemorySaver())
config = {"configurable": {"thread_id": "review-1"}}

paused = graph.invoke({"draft": "LangGraph 可实现持久化 Agent"}, config=config)
print(paused["__interrupt__"])

final_state = graph.invoke(Command(resume=True), config=config)
print(final_state["approved"])
```

## 🌊 流式输出与实时观测
---
lang: python
emoji: 🌊
link: https://docs.langchain.com/oss/python/langgraph/streaming
desc: 在前端或控制台边跑边看状态更新、消息 token 和 interrupt，更适合长任务与调试。
---

- `stream_mode="updates"`：看每一步状态更新
- `stream_mode="values"`：看完整状态快照
- `stream_mode=["updates", "messages"]` + `version="v2"`：同时看图进度与模型 token
- Agent UI、审批台、调试面板通常都基于流式接口

```python
# 观察每一步状态更新
for chunk in graph.stream({"topic": "LangGraph"}, stream_mode="updates"):
    print(chunk)
```

```python
# v2 模式下同时拿到更新事件与消息 token
for chunk in graph.stream(
    {"messages": [{"role": "user", "content": "总结 LangGraph"}]},
    stream_mode=["updates", "messages"],
    version="v2",
):
    print(chunk)
```

## 🧩 子图、多代理与上下文边界
---
lang: python
emoji: 🧩
link: https://docs.langchain.com/oss/python/langgraph/use-subgraphs
desc: 子图适合把复杂流程拆成可复用模块；多代理场景要先决定“谁维护状态、谁拿到哪些上下文”。
---

- 子图可作为父图节点复用：适合研究、审批、执行等阶段拆分
- `checkpointer=False`：子图无持久化，像普通函数调用
- `checkpointer=True`：子图跨调用保留线程态，但同一子图实例并发调用要谨慎
- 多代理 handoff 时，不要把全部内部消息原样传给下游代理，优先传最小必要上下文

```python
# 研究子图只做单次调用，不保留线程状态
research_graph = research_builder.compile(checkpointer=False)

# 父图负责全局状态与线程持久化
app_graph = app_builder.compile(checkpointer=True)
```

### 经验判断
- 只是把一段逻辑封装起来：用子图
- 只是标准工具调用 Agent：用 LangChain `create_agent`
- 需要状态驱动 handoff / 人审 / 恢复 / 分阶段编排：用 LangGraph

## 🕰️ Time Travel 与调试
---
lang: python
emoji: 🕰️
link: https://docs.langchain.com/oss/python/langgraph/use-time-travel
desc: 通过 checkpoint 历史回放或分叉旧状态，是定位复杂 Agent 问题时最有价值的能力之一。
---

- `get_state_history(config)`：获取该线程的 checkpoint 历史
- 从旧 checkpoint 的 `config` 重新 `invoke()`：可 replay 或 fork
- time travel 会重跑 checkpoint 之后的节点：外部 API、LLM、interrupt 可能再次触发
- 调试重点：观察哪一步把状态改坏了，而不是只看最终输出

```python
history = list(graph.get_state_history(config))

# 选一个旧 checkpoint 回放
checkpoint_config = history[-2].config
replayed = graph.invoke(None, config=checkpoint_config)
print(replayed)
```

## ⚠️ v1 迁移提示
---
lang: markdown
emoji: ⚠️
link: https://docs.langchain.com/oss/python/releases/langgraph-v1
desc: LangGraph v1 是稳定版，核心图 API 基本延续；最大的心智变化是预置 Agent 入口迁移到 LangChain v1。
---

- `langgraph.prebuilt.create_react_agent` 已弃用：优先改用 `langchain.agents.create_agent`
- LangGraph 继续负责底层运行时：图、状态、checkpoint、interrupt、streaming
- 升级时先确认：自定义节点返回值、checkpointer、streaming 代码路径是否仍符合 v1 文档
- 不确定时先看官方 migration / release notes，再改生产图
