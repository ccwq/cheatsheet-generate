# fact_store · Holographic Memory 参考映射

## 官方入口

- [GitHub 仓库](https://github.com/NousResearch/hermes-agent) - 源码与 README
- [GitHub Releases](https://github.com/NousResearch/hermes-agent/releases) - 版本与发布说明
- [官方文档首页](https://hermes-agent.nousresearch.com/) - 文档总入口

## 记忆系统文档

- [Persistent Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory/) - 内置 MEMORY.md / USER.md 说明
- [Memory Providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers/) - 8 种可插拔记忆后端
- [Memory Provider Plugin 开发文档](https://hermes-agent.nousresearch.com/docs/developer-guide/memory-provider-plugin/) - 如何开发自定义 provider

## Holographic Provider

- [Holographic 源码](https://github.com/NousResearch/hermes-agent/tree/main/plugins/memory/holographic) - SQLite + FTS5 + HRR 实现
- [MemoryProvider ABC](https://github.com/NousResearch/hermes-agent/blob/main/agent/memory_provider.py) - Provider 接口定义
- [MemoryManager](https://github.com/NousResearch/hermes-agent/blob/main/agent/memory_manager.py) - 记忆管理器

## 核心源码文件

- `plugins/memory/holographic/__init__.py` - HolographicMemoryProvider 主类
- `plugins/memory/holographic/store.py` - SQLite MemoryStore（实体抽取、trust score）
- `plugins/memory/holographic/retrieval.py` - FactRetriever（search/probe/related/reason/contradict）
- `plugins/memory/holographic/holographic.py` - HRR 代数（bind/unbind/bundle/similarity）
- `agent/memory_manager.py` - on_memory_write 镜像逻辑

## 配置参考

- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration/) - config.yaml 完整参考
- [环境变量](https://hermes-agent.nousresearch.com/docs/reference/environment-variables/) - HERMES_HOME 等变量

## 本机信息卡

- [fact_store 完整使用手册 v3.0](https://ccwq.github.io/infocard-pub/docs/20260605-fact-store-v2.html) - 三层记忆架构 + 实机配置 + SQLite 实况
