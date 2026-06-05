---
title: fact_store · Holographic Memory 速查
lang: zh-CN
version: v0.14.0
date: "2026-05-16"
github: NousResearch/hermes-agent
colWidth: 420px
desc: Hermes Agent 的 Holographic memory provider：本地 SQLite + FTS5 的事实库，支持 fact_store / fact_feedback、trust score、实体关联与组合检索，并与内置 MEMORY/USER profile 并行工作。
tags:
  - AI / LLM
  - AI 辅助工具
  - 自动化工具
  - CLI / Terminal
  - 知识管理
---

# fact_store · Holographic Memory 速查

## 快速定位

> `fact_store` 不是单独产品，而是 Hermes Agent 的 **Holographic memory provider** 暴露出来的事实存储 / 检索工具层。它与内置 `MEMORY.md` / `USER.md` **并行工作**，不是替代关系。

| 目标 | 最短入口 | 说明 |
|---|---|---|
| 看 provider 是否启用 | `config.yaml` → `memory.provider` | 设为 `holographic` 即启用外部 provider |
| 看内置 memory 是否并行开启 | `memory_enabled` / `user_profile_enabled` | 文档明确可与外部 provider 同时开启 |
| 查数据库路径 | `plugins.hermes-memory-store.db_path` | Holographic 的 SQLite 文件路径 |
| 查可用工具 | `fact_store` / `fact_feedback` | 用于增删改查、反馈 trust |
| 查官方说明 | Memory Providers / Persistent Memory 文档 | 先看能力边界，再配参数 |

## 它解决什么问题

| 层 | 定位 | 特点 |
|---|---|---|
| **内置 Persistent Memory** | 启动时要带进上下文的高价值摘要 | `MEMORY.md` / `USER.md`，容量受字符上限控制 |
| **Holographic / fact_store** | 按需检索的长期事实库 | SQLite、FTS5、trust score、实体关联、组合检索 |

**经验法则**：
- 必须长期常驻 prompt 的少量关键信息 → 放内置 memory
- 需要长期积累、按需搜索、可逐步修订的事实 → 放 `fact_store`

## 核心能力

| 能力 | 说明 |
|---|---|
| 本地事实库 | 官方文档明确为 local SQLite fact store |
| 全文检索 | 依赖 SQLite FTS5 |
| trust score | 新事实有默认信任分，后续可反馈或修订 |
| 实体 / 关系检索 | 可按 entity 找相关事实 |
| 组合检索 | 支持基于多实体的 compositional retrieval / reasoning |
| 内置记忆并行 | 外部 provider 是 additive，不替换内置 memory |

## 常用工具

### `fact_store`

| action | 用途 | 适合什么时候用 |
|---|---|---|
| `add` | 新增事实 | 记录已确认、可复用的信息 |
| `search` | 关键词检索 | 先用关键词捞主题 |
| `probe` | 按实体召回 | 想看某对象相关事实 |
| `related` | 查关联事实 | 想沿实体关系继续扩展 |
| `reason` | 多实体组合检索 | 想找 A / B / C 的交集事实 |
| `contradict` | 查潜在冲突 | 做知识库体检 |
| `update` | 修订事实 / trust | 事实有新证据或需纠偏 |
| `remove` | 删除事实 | 过时、错误、噪音 |
| `list` | 列出现有事实 | 盘点某个分类或全库 |

> 上表 action 名称来自官方 Holographic 文档与源码实现；如果你的本地封装额外限制了参数，以本机实际工具签名为准。

### `fact_feedback`

| action | 作用 |
|---|---|
| `helpful` | 对有用事实做正反馈，提升后续保留 / 检索价值 |
| `unhelpful` | 对低价值或误导事实做负反馈，降低 trust 或推动清理 |

## 最小工作流

### 1. 启用 provider

```yaml
memory:
  provider: holographic
  memory_enabled: true
  user_profile_enabled: true

plugins:
  hermes-memory-store:
    db_path: /path/to/memory_store.db
    auto_extract: false
    default_trust: 0.5
```

### 2. 写入一条稳定事实

```python
fact_store(action="add", content="项目默认包管理器是 pnpm", category="project")
```

### 3. 之后按需检索

```python
fact_store(action="search", query="包管理器", limit=5)
fact_store(action="probe", entity="pnpm", limit=10)
```

### 4. 发现信息过时就修订

```python
fact_store(action="update", fact_id=123, content="项目默认包管理器已切换为 uv")
# 或
fact_store(action="remove", fact_id=123)
```

## 三种写入路径

| 路径 | 说明 | 适用场景 |
|---|---|---|
| 手动 `fact_store(action="add")` | 最直接、最可控 | 重要事实、专题知识 |
| 内置 memory 写入后的镜像 | 文档与源码都说明会与内置 memory 协同 | 已经确认应进入长期记忆的用户 / 项目信息 |
| `auto_extract` | 从消息中自动抽取事实 | 只适合噪音可控、表达模式稳定的环境 |

**建议**：默认先用前两种；`auto_extract` 虽然省事，但更容易把临时表达或未确认信息写进库里。

## 关键配置项

| 配置 | 作用 |
|---|---|
| `memory.provider` | 选择外部 provider，设为 `holographic` |
| `memory_enabled` | 是否启用内置 `MEMORY.md` |
| `user_profile_enabled` | 是否启用内置 `USER.md` / 用户画像 |
| `memory_char_limit` | 内置 MEMORY 的字符上限 |
| `user_char_limit` | 内置 USER profile 的字符上限 |
| `plugins.hermes-memory-store.db_path` | SQLite 文件路径 |
| `plugins.hermes-memory-store.auto_extract` | 是否自动抽取事实 |
| `plugins.hermes-memory-store.default_trust` | 新事实默认信任分 |

## 查询顺序建议

```text
search(query="关键词")
  -> probe(entity="对象")
  -> related(entity="对象")
  -> reason(entities=[A, B])
  -> contradict() / update / remove
```

- 先 `search`：成本最低，适合找入口
- 再 `probe` / `related`：把单个对象的上下文补全
- 最后 `reason`：当你已经知道几个关键实体，想挖交集结论

## 什么时候适合 / 不适合写入

| 适合写入 | 不适合直接写入 |
|---|---|
| 已验证的用户偏好 | 临时闲聊 |
| 稳定的项目约定 | 未确认猜测 |
| 反复要查的工具结论 | 一次性日志 |
| 需要跨会话复用的事实 | 大段原文搬运 |
| 需要后续修订和追踪的知识 | 瞬时上下文碎片 |

## 使用注意

- 不要把 `fact_store` 当聊天历史；它更适合**事实**，不适合原样堆对话。
- `trust` 不是“越高越好”；低证据信息应保守写入，后续再通过反馈提高。
- 实体与组合检索想要效果稳定，事实内容要尽量单一、明确、可拆分。
- 中文内容能否抽出理想实体，取决于当前实现与命名方式；对关键对象可保持统一命名，减少检索漂移。

## 排错顺序

```text
1. 确认 memory.provider 是否为 holographic
2. 确认 plugins.hermes-memory-store 下的 db_path / default_trust 等配置已生效
3. 先用 add + search 验证最小闭环
4. 再看 probe / related / reason 是否符合你的事实写法
5. 发现噪音或冲突时，优先 update / remove / fact_feedback 清理
```
