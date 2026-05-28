---
title: fact_store · Holographic Memory 速查
lang: zh-CN
version: "1.0.0"
date: "2026-06-05"
github: NousResearch/hermes-agent
colWidth: 420px
desc: Hermes Holographic fact_store 是 SQLite + FTS5 的外挂记忆系统，支持 9 种检索动作、trust score、实体召回、组合推理与冲突检测，三条写入路径（手动 + 自动镜像 + auto_extract）。
tags:
  - AI / LLM
  - AI 辅助工具
  - 自动化工具
  - CLI / Terminal
  - 知识管理
---

# fact_store · Holographic Memory 速查

## 一句话结论

> 你现在已经在用 Holographic fact_store 了。外部 provider = holographic，数据库 = 本地 SQLite（`$HERMES_HOME/memory_store.db`），built-in memory 仍同时启用。双层并行，不是二选一。

## 快速定位

| 目标 | 最短入口 | 备注 |
|---|---|---|
| 查当前配置 | `config.yaml` 的 `memory.provider` 字段 | holographic = 已启用 |
| 确认状态 | `hermes memory status` | 输出 holographic: active 即正常 |
| 查数据库路径 | `config.yaml` 的 `plugins.hermes-memory-store.db_path` | 默认 `$HERMES_HOME/memory_store.db` |
| 查库内容 | `fact_store(action='list')` | 列出所有已存事实 |
| 查索引入口 | `https://ccwq.github.io/infocard-pub/docs/20260605-fact-store-v2.html` | 完整使用手册 v3.0 |

## 两层记忆怎么分工

| Layer | 定位 | 特点 |
|---|---|---|
| **内置 Memory**（MEMORY.md / USER.md） | 必须常驻 prompt 的高价值摘要 | 小容量、会话启动时冻结注入 |
| **fact_store / Holographic** | 按需调用的深层事实库 | 本地 SQLite、FTS5、实体召回、组合推理、trust 管理 |

**分工原则**：内置 memory 放"必须时刻带着"的事实；fact_store 放"需要反复检索、可推理、可纠错"的长期知识。

## 三条写入路径

### 路径 1 · 手动调用（默认开启）

直接调用 `fact_store` 工具，9 个 actions：

| 动作 | 作用 | 典型用法 |
|---|---|---|
| `add` | 新增事实 | `fact_store(action='add', content='...', category='user_pref', tags='python,tool')` |
| `search` | 关键词检索 | `fact_store(action='search', query='chrome cdp', limit=5)` |
| `probe` | 实体召回 | `fact_store(action='probe', entity='chrome', limit=10)` |
| `related` | 结构关联 | `fact_store(action='related', entity='SQLite', limit=10)` |
| `reason` | 多实体组合检索 | `fact_store(action='reason', entities=['Hermes','SQLite'], limit=10)` |
| `contradict` | 冲突检测 | `fact_store(action='contradict', limit=10)` |
| `update` | 修订事实 | `fact_store(action='update', fact_id=123, trust_delta=0.2)` |
| `remove` | 删除事实 | `fact_store(action='remove', fact_id=123)` |
| `list` | 盘点现有事实 | `fact_store(action='list', category='user_pref', limit=20)` |

另有独立工具：

| 工具 | 作用 |
|---|---|
| `fact_feedback(action='helpful', fact_id=123)` | helpful → trust +0.05；unhelpful → -0.10 |
| `fact_feedback(action='unhelpful', fact_id=123)` | 降低可信度或直接 remove |

### 路径 2 · 自动镜像（默认开启）

用内置 `memory` 工具 `add` 时，自动触发 `on_memory_write()` 同步写入 fact_store。

映射规则：
- `memory(target='user')` → `category='user_pref'`
- `memory(target='memory')` → `category='general'`

**实战含义**：你说"记住我偏好 uv" → 自动镜像进 fact_store，不需要额外操作。

### 路径 3 · auto_extract（默认关闭）

配置 `auto_extract: true` 后，会话结束时自动扫描用户消息，正则匹配偏好/决策模式：

```
I prefer / I like / I use / I want / I need...      → user_pref
my favorite / my default X is...                     → user_pref
we decided / we agreed / the project uses...          → project
```

**当前推荐**：维持关闭。你偏好高密度、可控、低噪音，auto_extract 容易污染知识库。

## 当前配置（已实机核对）

```yaml
memory:
  provider: holographic         # 已启用
  memory_enabled: true          # 内置 MEMORY 开启
  user_profile_enabled: true    # 内置 USER PROFILE 开启
  memory_char_limit: 2200      # MEMORY 容量上限
  user_char_limit: 1375        # USER PROFILE 容量上限

plugins:
  hermes-memory-store:
    db_path: /home/ccwq/hehome/hermes-data/memory_store.db  # 数据库路径
    auto_extract: false        # 默认关闭
    default_trust: 0.5        # 新事实默认半可信
    min_trust_threshold: 0.3   # 检索时最低门槛
    temporal_decay_half_life: 0 # 时间衰减：0 = 不衰减
    hrr_dim: 1024             # HRR 向量维度
    hrr_weight: 0.3           # 检索时 HRR 权重
```

## 数据库实况（已核对）

| 对象 | 当前数量 | 说明 |
|---|---|---|
| `facts` | **4** | 已有 4 条事实写入 SQLite |
| `entities` | **0** | 当前事实未抽出结构化实体 |
| `memory_banks` | **0** | 尚未形成有实体支撑的组合记忆银行 |

`entities=0` 与 `memory_banks=0` 不表示 provider 未工作，只表示当前更多在用"事实存储 + FTS5 检索"，还没把实体/HRR 结构层喂活。

## 库里已有的事实（当前快照）

**general（3条）**
- `Holographic memory provider is now active and operational on this machine.`
- `test fact`
- `通知策略：重要/异常情况才发通知；默认通道是 Telegram，不主动发企业微信`

**user_pref（1条）**
- `用户要求发布信息卡的标准流程：将卡片放入 infocard-pub，加入 infocard-list 索引，并在发布成功后返回 GitHub Pages 可访问地址。`

**project（0条）**

## 推荐工作流

### 日常写入

| 场景 | 写哪里 |
|---|---|
| 最关键、必须常驻的事实 | 内置 `memory`（同时自动镜像进 fact_store） |
| 深层、专题、要反复检索的事实 | `fact_store(action='add')` |
| 验证过的长期约定 | 单独一条只表达一件稳定结论 |

### 查询顺序

```
search(query='关键词')       →  1. 主题找回
probe(entity='对象')         →  2. 查对象全貌
related(entity='对象')       →  3. 看周边关系
reason(entities=[A,B,C])      →  4. 找交集事实
contradict() / update / remove  →  5. 做记忆清洁
```

### 维护节奏

| 频率 | 动作 |
|---|---|
| 每次确认事实有用 | `fact_feedback(helpful)` |
| 发现过时/错误 | 立即 `update` 或 `remove` |
| 想增强组合推理 | 把事实写得更结构化，给实体统一命名 |
| 季度体检 | `list` 全库，清理噪音和冲突 |

## 源码核对出的真实细节

| 细节 | 说明 |
|---|---|
| `on_memory_write()` 存在 | built-in memory add/replace → 自动镜像进 fact_store |
| `sync_turn()` 是空实现 | Holographic 不每轮自动塞对话，更偏向"显式事实存储" |
| `contradict` 当前实现 | 全库冲突巡检，不是严格按 entity 过滤 |
| HRR/compositional retrieval | 依赖更结构化的事实与实体，不是开了 provider 就自动变强 |
| 实体抽取规则 | 大写专名 / 双引号 / 单引号 / `aka` 模式；中文句子目前抽不出实体 |

## 什么时候不用 fact_store

| 适合 | 不适合 |
|---|---|
| 长期偏好 | 临时聊天 |
| 项目规则 | 未确认猜测 |
| 工具 workaround | 一次性日志 |
| 已验证事实 | 长原文复制 |
| 跨会话复用知识 | 短期上下文碎片 |

**禁止行为**：把 fact_store 当"聊天备忘录"、让冲突版本长期共存、把低置信信息直接给 trust=1.0。

## 信息卡（完整使用手册）

- **URL**：https://ccwq.github.io/infocard-pub/docs/20260605-fact-store-v2.html
- **标题**：fact_store · Holographic 外挂记忆完整使用与配置实录 v3.0
- **内容**：三层记忆架构 / 三条写入路径 / 实机配置 / SQLite 实况 / 推荐工作流 / 源码核查

## 排错顺序

```
1. memory.provider: holographic  是否写对
2. hermes memory status         是否 active
3. 数据库路径是否落在当前 Hermes Home
4. 实体名和 category 是否一致
5. trust 门槛与检索词是否合理
```

## 常用配置变更

| 目标 | 操作 |
|---|---|
| 开启 auto_extract | 在 `config.yaml` 的 `plugins.hermes-memory-store` 下加 `auto_extract: true` |
| 调整默认 trust | `default_trust: 0.7`（更高置信）或 `0.3`（更保守） |
| 开启时间衰减 | `temporal_decay_half_life: 90`（天） |
| 换数据库路径 | `db_path: /path/to/other.db` |
