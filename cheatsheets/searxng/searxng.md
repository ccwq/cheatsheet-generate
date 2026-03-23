---
title: SearXNG
lang: bash
version: "2026.3.20+6c7e9c197"
date: "2026-03-20"
github: searxng/searxng
colWidth: 460px
---

# SearXNG

## 快速定位 / 入口
---
lang: text
emoji: 🔎
link: https://docs.searxng.org/
desc: SearXNG 是一个可自托管、重视隐私的元搜索引擎。它把多个搜索引擎结果聚合到统一入口，同时暴露网页搜索界面、Search API、可调首选项与实例级设置。
---

- 适合：隐私搜索、聚合多搜索源、做自定义搜索入口、给脚本或应用接入统一检索 API
- 先看哪里：
  - 直接搜：网页搜索页 + 搜索语法
  - 程序调用：`/search` Search API
  - 调整体验：Preferences / Settings
  - 看能力边界：Configured Engines

## 最小工作流
---
lang: bash
emoji: ⚡
link: https://docs.searxng.org/dev/search_api.html
desc: 最短路径分三步：先确认查询语法，再调用 Search API 试跑，最后根据场景补上分类、语言、安全搜索、时间范围等参数。
---

```bash
# 1) 直接请求 JSON 结果
curl "https://<your-searxng>/search?q=openai&format=json"

# 2) 限定分类、语言与安全搜索
curl "https://<your-searxng>/search?q=privacy+search&categories=general&language=zh-CN&safesearch=1&format=json"

# 3) 限定时间范围
curl "https://<your-searxng>/search?q=searxng&time_range=month&format=json"
```

### Quick Ref

| 你要做什么 | 最小动作 |
|---|---|
| 在页面里快速搜 | 直接输入关键词或搜索语法 |
| 在脚本里拿结构化结果 | `GET /search?...&format=json` |
| 减少不相关结果 | 指定 `categories` / `engines` |
| 控制语言与地区偏好 | 指定 `language` |
| 控制成人内容过滤 | 指定 `safesearch` |
| 只看最近结果 | 指定 `time_range` |

## 场景 1：先把搜索语法跑顺
---
lang: text
emoji: 🧭
link: https://docs.searxng.org/user/search-syntax.html
desc: 用户入口通常不是 API，而是“怎么搜更准”。SearXNG 的查询语法允许你在一个搜索框里快速缩窄主题、限定站点、排除词与精确短语。
---

### 常见写法

```text
"exact phrase"          # 精确短语
-word                   # 排除词
site:docs.searxng.org api
!gh searxng             # 使用 bang 直达特定外部站点/引擎
```

### Quick Ref

| 语法 | 用途 | 什么时候用 |
|---|---|---|
| `"..."` | 精确匹配短语 | 关键词太泛时 |
| `-term` | 排除干扰词 | 结果被同名概念污染时 |
| `site:domain` | 限定站点 | 只想查官方文档/特定域名时 |
| `!bang` | 直接跳转外部搜索 | 想把 SearXNG 当统一入口时 |

## 场景 2：把 SearXNG 当统一 Search API
---
lang: bash
emoji: 🧰
link: https://docs.searxng.org/dev/search_api.html
desc: 对程序接入来说，核心是 `/search`。你只需要一个 HTTP 入口，就能把多引擎聚合结果交给脚本、后端服务或 Agent 使用。
---

### 基本请求

```bash
curl "https://<your-searxng>/search?q=llm+agent&format=json"
```

### 常用参数组合

```bash
# 只查新闻，中文，近一周
curl "https://<your-searxng>/search?q=开源+搜索&categories=news&language=zh-CN&time_range=week&format=json"

# 显式限制引擎
curl "https://<your-searxng>/search?q=python&engines=duckduckgo,google&format=json"
```

### 参数速查

| 参数 | 作用 | 常见值 |
|---|---|---|
| `q` | 查询词 | 任意字符串 |
| `format` | 返回格式 | `json` |
| `categories` | 类别过滤 | `general`, `news`, `images`, `videos`, `map`, `music`, `it`, `science` |
| `engines` | 指定引擎 | 逗号分隔引擎名 |
| `language` | 结果语言偏好 | 如 `zh-CN`, `en-US` |
| `pageno` | 分页 | 正整数 |
| `safesearch` | 安全搜索级别 | `0`, `1`, `2` |
| `time_range` | 时间过滤 | `day`, `month`, `year`, `week` |

## 场景 3：调首选项，而不是硬编码一切
---
lang: text
emoji: ⚙️
link: https://docs.searxng.org/user/preferences.html
desc: 如果你是长期使用同一实例，很多参数不必每次都拼 URL。SearXNG 允许通过首选项保存语言、主题、结果页、隐私和引擎偏好。
---

- 更适合放到 Preferences 的内容：
  - 默认语言
  - 默认分类 / 常用引擎
  - 安全搜索级别
  - 外观主题与结果页行为
- 更适合请求时临时指定的内容：
  - 当前查询词 `q`
  - 临时搜索范围 `time_range`
  - 某次任务临时切换的 `engines`

### Quick Ref

| 决策点 | 推荐做法 |
|---|---|
| 这是长期偏好吗 | 放进 Preferences |
| 这是单次任务约束吗 | 放进请求参数 |
| 想复用一套稳定搜索体验吗 | 先调 Preferences，再让脚本只传 `q` 和少量覆盖参数 |

## 场景 4：理解 categories / engines 的边界
---
lang: text
emoji: 🗂️
link: https://docs.searxng.org/admin/engines/settings.html
desc: categories 是“按搜索类型选一组引擎”，engines 是“直接点名引擎”。多数情况下先用 categories，只有需要精细控制时再显式指定 engines。
---

### 决策表

| 需求 | 用 categories | 用 engines |
|---|---|---|
| 我只知道要搜新闻/图片/视频 | 是 | 否 |
| 我只信某几个后端引擎 | 否 | 是 |
| 我想保留实例默认聚合策略 | 是 | 否 |
| 我需要可复现、固定来源的结果 | 否 | 是 |

### 常见类别

```text
general
news
images
videos
music
map
it
science
files
social media
```

## Search API 返回结构速记
---
lang: json
emoji: 📦
link: https://docs.searxng.org/dev/search_api.html
desc: 最常见的消费方式是读取结果数组，并按标题、链接、内容摘要、引擎来源做后续处理。
---

```json
{
  "query": "openai",
  "number_of_results": 12345,
  "results": [
    {
      "title": "Example result",
      "url": "https://example.com",
      "content": "snippet",
      "engine": "duckduckgo",
      "category": "general"
    }
  ]
}
```

### Quick Ref

| 字段 | 用途 |
|---|---|
| `query` | 原始查询 |
| `number_of_results` | 估算总量 |
| `results[]` | 结果数组 |
| `title` / `url` | 展示与跳转 |
| `content` | 摘要/snippet |
| `engine` | 来源引擎 |
| `category` | 结果类别 |

## 常见坑 / 排障
---
lang: text
emoji: 🚧
link: https://docs.searxng.org/admin/settings/index.html
desc: 实际使用时，问题通常不在“怎么发请求”，而在“结果为什么不稳定”。先分清实例默认设置、首选项和单次请求三层覆盖关系。
---

- 同样的 `q` 结果不同：
  - 检查是否更换了实例默认引擎配置
  - 检查是否设置了不同的 `language`、`time_range`、`safesearch`
- 结果来源和预期不一致：
  - 你可能只设置了 `categories`，没有锁定 `engines`
- 想做稳定自动化：
  - 固定实例
  - 固定 `engines`
  - 固定 `language` / `safesearch` / `time_range`
  - 统一走 `format=json`

