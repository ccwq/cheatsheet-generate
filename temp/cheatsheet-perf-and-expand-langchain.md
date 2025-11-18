# LangChain Cheatsheet 重构指导

## 📋 官方文档章节数据对比分析

### LangChain 官方文档结构
根据langchain-ai/langchain官方文档，主要包含：

- **Installation** - 多种安装方式（pip, uv, conda等）
- **Core Concepts** - 核心概念（LLMs, Prompts, Chains, Agents, Memory）
- **Model I/O** - 模型输入输出处理
- **Data Connection** - 数据连接（Document Loaders, Text Splitters, Vector Stores, Retrievers）
- **Chains** - 链式调用和组合
- **Agents** - 代理系统和工具调用
- **Memory** - 记忆管理
- **Callbacks** - 回调和监控
- **Evaluation** - 评估和调试

### 当前本地 Cheatsheet 内容分析

#### ✅ 已包含的良好内容
1. **安装与配置** - 基本的 pip 安装命令
2. **模型集成** - OpenAI 和 Anthropic 模型初始化
3. **Prompt 模板** - 基础模板和聊天模板
4. **LCEL 链式调用** - 基础链和并行执行
5. **Agents 代理** - 简单代理创建和工具装饰器
6. **Tools 工具** - 基础工具定义
7. **文档加载器** - 部分加载器示例
8. **文本分割器** - 基础分割方法
9. **Embeddings** - OpenAI 和 HuggingFace 嵌入
10. **Vector Stores** - FAISS 和 Chroma 基础用法
11. **RAG** - 基础检索增强生成
12. **其他功能模块** - 输出解析、记忆、回调等

#### ❌ 需要补充的关键内容

### 🔧 Installation 补充内容

1. **现代安装方法**：
```bash
# 使用 uv (推荐)
uv add langchain
uv add --prerelease=allow langchain

# 使用 pip
pip install --pre -U langchain

# 安装特定集成包
pip install langchain-openai langchain-anthropic
pip install langchain-community
pip install langchain-core

# 向量存储
pip install chromadb faiss-cup
pip install langchain-qdrant
pip install langchain-milvus
```

2. **LangChain v1.0 迁移说明**：
```bash
# 如果需要旧版功能
pip install langchain-classic
uv add langchain-classic
```

### 🤖 Models 补充内容

1. **统一的模型初始化**：
```python
from langchain.chat_models import init_chat_model
from langchain.embeddings import init_embeddings

# 自动根据模型字符串选择提供商
llm = init_chat_model("openai:gpt-4o-mini")
embeddings = init_embeddings("openai:text-embedding-3-large")
```

2. **更多模型提供商**：
```python
# Google
from langchain_google_vertexai import ChatVertexAI
llm = ChatVertexAI(model="gemini-pro")

# Cohere
from langchain_cohere import ChatCohere
llm = ChatCohere(model="command-r-plus")

# Groq
from langchain_groq import ChatGroq
llm = ChatGroq(model="llama-3.1-70b-versatile")
```

3. **高级模型配置**：
```python
# 配置参数
llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0.7,
    max_tokens=1000,
    streaming=True,
    timeout=30,
    max_retries=3,
    model_kwargs={"response_format": {"type": "json_object"}}
)
```

### 📝 Prompts 补充内容

1. **更多模板类型**：
```python
from langchain_core.prompts import (
    PromptTemplate,
    ChatPromptTemplate,
    FewShotPromptTemplate,
    PipelinePromptTemplate
)

# Few-shot 学习
examples = [
    {"input": "2+2", "output": "4"},
    {"input": "3+3", "output": "6"}
]

few_shot_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=PromptTemplate.from_template("输入: {input} 输出: {output}"),
    prefix="计算以下数学问题：",
    suffix="输入: {input}",
    input_variables=["input"]
)
```

2. **组合模板**：
```python
from langchain_core.prompts.pipeline import PipelinePromptTemplate

# 多级模板组合
full_template = """背景：{background}
任务：{task}
上下文：{context}
问题：{question}
答案："""

prompt = PromptTemplate.from_template(full_template)
```

### 🔗 Chains 补充内容

1. **高级链模式**：
```python
from langchain_core.chains import (
    create_structured_output_chain,
    create_openai_tools_chain,
    create_retrieval_chain
)

# 结构化输出链
from pydantic import BaseModel, Field

class Answer(BaseModel):
    answer: str = Field(description="问题的答案")
    confidence: float = Field(description="答案的置信度")

structured_chain = create_structured_output_chain(
    llm=llm,
    prompt=prompt,
    output_schema=Answer
)
```

2. **复杂链组合**：
```python
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_history_aware_retriever_chain

# 历史感知检索器
retriever_chain = create_history_aware_retriever_chain(
    llm=llm,
    retriever=retriever,
    rephrase_prompt=ChatPromptTemplate.from_template("""
    根据聊天历史和最新问题，生成检索查询。
    聊天历史：{chat_history}
    最新问题：{input}
    检索查询：
    """)
)
```

### 🎯 Agents 补充内容

1. **LangGraph 代理**：
```python
from langgraph.prebuilt import create_react_agent
from langchain.tools import tool

# 创建 React 代理
agent = create_react_agent(
    model=llm,
    tools=tools,
    state_modifier="你是一个有用的助手。"
)

# 执行代理
result = agent.invoke({
    "messages": [
        {"role": "user", "content": "计算 15 * 23"}
    ]
})
```

2. **工具类型和配置**：
```python
from langchain.tools import tool
from typing import List, Dict
import requests

@tool
def search_web(query: str) -> List[Dict]:
    """搜索网络信息"""
    response = requests.get(f"https://api.example.com/search?q={query}")
    return response.json().get("results", [])

@tool
def calculator(expression: str) -> float:
    """计算数学表达式"""
    return eval(expression)

tools = [search_web, calculator]
```

### 💾 Vector Stores 补充内容

1. **更多向量存储选项**：
```python
# Qdrant
from qdrant_client.models import Distance, VectorParams
from langchain_qdrant import QdrantVectorStore

client = QdrantClient(":memory:")
vector_size = len(embeddings.embed_query("sample"))

if not client.collection_exists("test"):
    client.create_collection(
        collection_name="test",
        vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
    )

vector_store = QdrantVectorStore(
    client=client,
    collection_name="test",
    embedding=embeddings
)

# Milvus
from langchain_milvus import Milvus

vector_store = Milvus(
    embedding_function=embeddings,
    connection_args={"uri": "./milvus_example.db"},
    index_params={"index_type": "FLAT", "metric_type": "L2"},
)
```

2. **嵌入缓存优化**：
```python
from langchain.embeddings import CacheBackedEmbeddings
from langchain.storage import LocalFileStore

# 缓存嵌入以提升性能
store = LocalFileStore("./cache/")
cached_embedder = CacheBackedEmbeddings.from_bytes_store(
    underlying_embeddings=embeddings,
    store=store,
    namespace=embeddings.model
)
```

### 🧠 Memory 补充内容

1. **多样化记忆类型**：
```python
from langchain.memory import (
    ConversationBufferMemory,
    ConversationBufferWindowMemory,
    ConversationSummaryMemory,
    VectorStoreRetrieverMemory
)

# 窗口记忆
window_memory = ConversationBufferWindowMemory(
    k=5,  # 保留最近5轮对话
    return_messages=True
)

# 总结记忆
summary_memory = ConversationSummaryMemory(
    llm=llm,
    return_messages=True
)

# 向量记忆
vector_memory = VectorStoreRetrieverMemory(
    retriever=vectorstore.as_retriever(search_kwargs={"k": 2}),
    memory_key="chat_history"
)
```

### 📊 LangSmith 集成补充内容

1. **追踪和监控配置**：
```python
import os
from langchain.callbacks.tracers import LangChainTracer
from langchain.callbacks.manager import CallbackManager

# 配置 LangSmith
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "MyProject"

# 创建追踪器
tracer = LangChainTracer()
callback_manager = CallbackManager([tracer])

# 在链中使用
result = chain.invoke(
    {"input": "测试输入"},
    callbacks=[callback_manager]
)
```

2. **评估和调试**：
```python
from langchain.evaluation import StringEvaluator
from langchain.evaluation.criteria import LLMCriteriaEvaluator

# 自定义评估器
class CustomEvaluator(StringEvaluator):
    def evaluate_strings(self, prediction, reference, input=None):
        return {
            "score": 0.8 if prediction.lower() == reference.lower() else 0.2,
            "reasoning": "字符串匹配评估"
        }

evaluator = CustomEvaluator()
result = evaluator.evaluate_strings(
    prediction="Hello",
    reference="hello",
    input="打招呼"
)
```

### 🌊 Streaming 补充内容

1. **高级流式处理**：
```python
from langchain_core.output_parsers import JsonOutputParser
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

# JSON 流式输出
json_parser = JsonOutputParser()
chain = prompt | llm | json_parser

# 流式执行
async def stream_json_response():
    async for chunk in chain.astream({"input": "生成JSON数据"}):
        print(chunk, end="", flush=True)

# 运行
import asyncio
asyncio.run(stream_json_response())
```

### 📤 Output Parsers 补充内容

1. **多样化解析器**：
```python
from langchain.output_parsers import (
    PydanticOutputParser,
    RegexParser,
    EnumOutputParser,
    ListOutputParser
)

# Pydantic 解析器
from pydantic import BaseModel, Field

class Person(BaseModel):
    name: str = Field(description="姓名")
    age: int = Field(description="年龄")
    hobbies: List[str] = Field(description="爱好")

parser = PydanticOutputParser(pydantic_object=Person)

# 正则表达式解析器
regex_parser = RegexParser(
    regex=r"价格：\s*(\d+)\s*元",
    output_keys=["price"]
)
```

## 🛠️ 重构实施建议

### 1. 内容结构优化
- 按官方文档的标准模块组织内容
- 每个模块按基础→进阶→实践的顺序编排
- 增加更多实用的代码示例和最佳实践

### 2. 新增重要模块
- **LangGraph** - 新的代理框架
- **Evaluation** - 评估和测试方法
- **Production Deployment** - 生产环境部署指南
- **Performance Optimization** - 性能优化技巧
- **Error Handling** - 完善的错误处理

### 3. 版本更新内容
- LangChain v1.0 的新特性说明
- create_agent 新标准
- 统一命名空间的变化
- 迁移指南和兼容性说明

### 4. 实用工具集成
- 更多向量存储的配置示例
- 不同LLM提供商的配置对比
- 开发环境设置和调试技巧
- 成本优化和性能监控

### 5. 学习资源完善
- 官方教程和示例项目链接
- 社区资源和最佳实践
- 常见问题和解决方案
- 进阶学习路径推荐

## 📝 优先级建议

1. **高优先级**：LangGraph 代理系统、Evaluation 评估模块
2. **高优先级**：现代安装方法、模型统一初始化API
3. **中优先级**：高级链组合、多样化记忆类型
4. **中优先级**：向量存储扩展、流式处理优化
5. **低优先级**：生产部署、性能优化技巧

## 🎯 验证要点

1. 内容覆盖 LangChain v1.0 最新特性
2. 代码示例的完整性和可运行性
3. 与官方文档的同步性
4. 中文术语的准确性和一致性
5. 页面结构的逻辑性和用户体验
6. 实用性和最佳实践的指导价值

## 🔗 参考资源链接

- 官方文档：https://python.langchain.com/
- GitHub仓库：https://github.com/langchain-ai/langchain
- LangSmith：https://smith.langchain.com/
- 社区论坛：https://discord.gg/langchain