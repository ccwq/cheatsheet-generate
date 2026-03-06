---
title: LangChain 速查
lang: python
version: "langchain==1.2.10"
date: 2026-03-05
github: langchain-ai/langchain
---

# LangChain 速查

## 🚀 快速开始：创建最小 Agent
---
lang: bash
emoji: 🚀
link: https://docs.langchain.com/oss/python/langchain/quickstart
desc: 先跑通最小可用 Agent，再逐步叠加工具、记忆和检索。
---
- `pip install -U langchain "langchain[openai]"` : 安装核心包与 OpenAI 集成
- `from langchain.agents import create_agent` : 创建高层 Agent 入口
- `agent.invoke({"messages": [...]})` : 同步执行单轮请求

```bash
# 安装 LangChain 与 OpenAI Provider
pip install -U langchain "langchain[openai]"
```

```python
# 最小 Agent 示例
from langchain.agents import create_agent

agent = create_agent(
    model="openai:gpt-4o-mini",
    tools=[],
    system_prompt="你是一个简洁的中文助手"
)

result = agent.invoke(
    {
        "messages": [
            {"role": "user", "content": "用一句话介绍 LangChain"}
        ]
    }
)

print(result)
```

## 🧩 模型与消息
---
lang: python
emoji: 🧩
link: https://docs.langchain.com/oss/python/langchain/models
desc: 用统一模型接口对接不同提供商，并使用消息对象管理上下文。
---
- `from langchain.chat_models import init_chat_model` : 标准化初始化聊天模型
- `from langchain_core.messages import HumanMessage, SystemMessage` : 显式消息类型
- `model.invoke(messages)` : 传入消息列表并获得回复

```python
# 统一模型初始化
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage

model = init_chat_model("openai:gpt-4o-mini")

resp = model.invoke(
    [
        SystemMessage(content="你是 Python 助手"),
        HumanMessage(content="解释什么是 RAG")
    ]
)

print(resp.content)
```

## 🛠️ 工具调用（Tools）
---
lang: python
emoji: 🛠️
link: https://docs.langchain.com/oss/python/langchain/tools
desc: 把 Python 函数声明成可调用工具，让 Agent 具备外部能力。
---
- `@tool` : 将函数暴露为工具
- `create_agent(..., tools=[...])` : 在 Agent 中注册工具
- 工具函数参数建议加类型注解 : 提升模型选择工具的准确率

```python
# 定义并挂载工具
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """查询天气（示例）"""
    return f"{city}：晴，25C"

agent = create_agent(
    model="openai:gpt-4o-mini",
    tools=[get_weather],
    system_prompt="你可以在需要时调用工具"
)

print(agent.invoke({"messages": [{"role": "user", "content": "北京天气如何？"}]}))
```

## 📦 结构化输出
---
lang: python
emoji: 📦
link: https://docs.langchain.com/oss/python/langchain/structured-output
desc: 通过 schema 约束输出，降低后处理成本与解析失败率。
---
- `response_format=MySchema` : 让 Agent 直接输出结构化对象
- 使用 `pydantic` schema : 便于校验与类型提示
- 适用于提取、分类、路由等任务 : 减少正则解析

```python
# 使用 Pydantic 获取结构化输出
from pydantic import BaseModel, Field
from langchain.agents import create_agent

class Contact(BaseModel):
    name: str = Field(description="姓名")
    email: str = Field(description="邮箱")

agent = create_agent(
    model="openai:gpt-4o-mini",
    tools=[],
    response_format=Contact
)

resp = agent.invoke(
    {
        "messages": [
            {"role": "user", "content": "从文本提取：张三，邮箱 zhangsan@example.com"}
        ]
    }
)

print(resp)
```

## 🧱 中间件（Middleware）
---
lang: python
emoji: 🧱
link: https://docs.langchain.com/oss/python/langchain/middleware/overview
desc: 在请求生命周期插入鉴权、审计、重试、限流等横切逻辑。
---
- 中间件用于请求前后拦截 : 统一治理调用策略
- 预置中间件可快速上线 : 自定义中间件用于业务规则
- 适合与多模型路由组合 : 管理成本更低

### 常见场景
- 请求日志与耗时统计
- 动态附加系统提示词
- 按租户注入 API Key 或配额策略

## 🧠 短期记忆（会话内）
---
lang: python
emoji: 🧠
link: https://docs.langchain.com/oss/python/langchain/short-term-memory
desc: 在会话线程中保存上下文，避免每轮手工拼接历史消息。
---
- 短期记忆聚焦“当前会话” : 适合客服与助手类对话
- 建议搭配线程 ID : 明确区分不同用户会话
- 对长对话可做摘要压缩 : 降低 token 成本

## 🔎 检索增强（Retrieval / RAG）
---
lang: python
emoji: 🔎
link: https://docs.langchain.com/oss/python/langchain/retrieval
desc: 通过检索器把外部知识注入上下文，减少幻觉并提升可追溯性。
---
- 文档入库流程 : 切分 -> 向量化 -> 写入向量库
- 查询流程 : 重写查询 -> 检索 -> 重排 -> 生成
- 可与工具调用结合 : 先检索再调用业务接口

```python
# 最简 RAG 流程（示意）
from langchain.chat_models import init_chat_model

model = init_chat_model("openai:gpt-4o-mini")

context = "LangChain 的 Agent 构建在 LangGraph 之上，支持持久化与流式输出。"
question = "LangChain Agent 的底层能力来自哪里？"

answer = model.invoke(
    f"请基于上下文回答。\n上下文：{context}\n问题：{question}"
)

print(answer.content)
```

## 🗃️ 长期记忆（跨会话）
---
lang: python
emoji: 🗃️
link: https://docs.langchain.com/oss/python/langchain/long-term-memory
desc: 把稳定用户信息与业务事实沉淀到长期存储，支持跨会话个性化。
---
- 适合存偏好、画像、历史决策 : 避免每次重复收集
- 写入时建议加来源与时间戳 : 便于冲突处理
- 读取时按场景过滤 : 不要无差别注入所有历史

## 🌊 流式输出（Streaming）
---
lang: python
emoji: 🌊
link: https://docs.langchain.com/oss/python/langchain/streaming
desc: 以 token 或事件流方式返回结果，优化首字节延迟与交互体验。
---
- `agent.stream(...)` : 在前端逐步渲染回复
- 事件流适合显示工具执行轨迹 : 提升可解释性
- 与 LangSmith 结合可追踪每个阶段耗时

## 🧪 观测与调试（LangSmith）
---
lang: bash
emoji: 🧪
link: https://docs.langchain.com/oss/python/langchain/observability
desc: 打开 tracing 后可追踪每次调用链路，定位提示词和工具问题。
---
- `LANGSMITH_TRACING=true` : 打开链路追踪
- `LANGSMITH_API_KEY` : 配置平台密钥
- `LANGSMITH_PROJECT` : 按项目隔离实验数据

```bash
# 启用 LangSmith 追踪
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY="<your_api_key>"
export LANGSMITH_PROJECT="langchain-cheatsheet"
```

## 🛡️ 人类介入与安全护栏
---
lang: python
emoji: 🛡️
link: https://docs.langchain.com/oss/python/langchain/human-in-the-loop
desc: 对高风险操作增加人工确认，并用 Guardrails 约束输入输出。
---
- Human-in-the-loop : 在执行关键动作前人工审批
- Guardrails : 对越权请求、敏感词、格式错误做拦截
- 生产建议 : 审批 + 审计 + 回滚三件套

### 常见坑位
- 直接让 Agent 执行写操作且无审批
- 仅靠系统提示词，不做结构化校验
- 不记录工具调用参数，事后无法审计

## ⚠️ 迁移与版本提示（v1 系）
---
lang: markdown
emoji: ⚠️
link: https://docs.langchain.com/oss/python/releases/changelog
desc: LangChain 迭代快，升级时先看变更日志与版本策略再改代码。
---
- 优先查官方 Changelog 与 Versioning 文档
- 区分 `langchain` 与 provider 包 : 避免依赖错位
- 升级后先跑关键链路回归 : Agent、RAG、工具调用
