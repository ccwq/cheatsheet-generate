# fact_store · Holographic Memory 参考映射

## 官方入口

- [GitHub 仓库](https://github.com/NousResearch/hermes-agent) - Hermes Agent 源码与 README
- [GitHub Releases](https://github.com/NousResearch/hermes-agent/releases) - 最新稳定版本与发布日期
- [官方文档首页](https://hermes-agent.nousresearch.com/) - 文档总入口

## 记忆系统文档

- [Persistent Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory/) - 内置 `MEMORY.md` / `USER.md` 的定位、并行关系与字符上限
- [Memory Providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers/) - 外部 memory providers 总览，含 Holographic 能力与配置项
- [Memory Provider Plugin 开发文档](https://hermes-agent.nousresearch.com/docs/developer-guide/memory-provider-plugin/) - provider 接口与开发方式

## Holographic Provider

- [Holographic provider 目录](https://github.com/NousResearch/hermes-agent/tree/main/plugins/memory/holographic) - Holographic 实现入口
- [MemoryProvider 接口](https://github.com/NousResearch/hermes-agent/blob/main/agent/memory_provider.py) - provider 抽象能力边界
- [MemoryManager](https://github.com/NousResearch/hermes-agent/blob/main/agent/memory_manager.py) - 内置 memory 与 provider 协同逻辑

## 核心源码文件

- `plugins/memory/holographic/__init__.py` - HolographicMemoryProvider 主类
- `plugins/memory/holographic/store.py` - SQLite store、事实读写、trust 相关逻辑
- `plugins/memory/holographic/retrieval.py` - `search / probe / related / reason / contradict` 等检索动作
- `plugins/memory/holographic/holographic.py` - HRR / compositional retrieval 相关实现
- `agent/memory_manager.py` - built-in memory 与外部 provider 的协同入口

## 配置参考

- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration/) - `config.yaml` 总配置入口
- [Environment Variables](https://hermes-agent.nousresearch.com/docs/reference/environment-variables/) - `HERMES_HOME` 等环境变量
