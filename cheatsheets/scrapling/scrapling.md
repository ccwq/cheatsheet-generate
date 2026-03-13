---
title: Scrapling
lang: python
version: "0.4.2"
date: "2026-03-13"
github: D4Vinci/Scrapling
colWidth: 433px
---

# Scrapling

## ⚡ Fetcher 快速抓取
---
lang: python
emoji: ⚡
link: https://scrapling.readthedocs.io/
desc: `Fetcher` 适合静态页面或轻量 HTTP 抓取，是 Scrapling 最低成本的入口。
---

### 常见入口

- `Fetcher.get(url)` : 单次请求
- `FetcherSession(...)` : 复用会话、Cookie 与伪装参数
- `impersonate='chrome'` : 模拟浏览器请求头
- `stealthy_headers=True` : 追加更像真实浏览器的头信息

```python
from scrapling.fetchers import Fetcher, FetcherSession

page = Fetcher.get("https://quotes.toscrape.com/")
quotes = page.css(".quote .text::text").getall()

with FetcherSession(impersonate="chrome") as session:
    page = session.get(
        "https://quotes.toscrape.com/",
        stealthy_headers=True,
    )
```

## 🥷 StealthyFetcher 反爬绕过
---
lang: python
emoji: 🥷
link: https://scrapling.readthedocs.io/
desc: 目标站点有 Cloudflare、浏览器指纹或强校验时，再上 `StealthyFetcher`，别一开始就用最重方案。
---

### 适用场景

- 页面需要真实浏览器环境
- 站点依赖 JS 挑战或人机校验
- 想在同一会话中连续访问多页

### 常用参数

- `headless=True` : 无头浏览器模式
- `network_idle=True` : 等待网络空闲后再取 DOM
- `solve_cloudflare=True` : 启用 Cloudflare 处理
- `adaptive=True` : 元素结构变化后尝试重新定位

```python
from scrapling.fetchers import StealthyFetcher, StealthySession

page = StealthyFetcher.fetch(
    "https://example.com",
    headless=True,
    network_idle=True,
)

with StealthySession(headless=True, solve_cloudflare=True) as session:
    page = session.fetch("https://nopecha.com/demo/cloudflare")
```

## 🌐 DynamicFetcher 动态渲染
---
lang: python
emoji: 🌐
link: https://scrapling.readthedocs.io/
desc: 遇到前端渲染页面，但不一定需要完整反爬能力时，`DynamicFetcher` 往往比 `StealthyFetcher` 更轻。
---

- `DynamicFetcher.fetch(url)` : 单次动态加载
- `DynamicSession(...)` : 连续抓多个动态页面
- `load_dom=False` : 某些场景下跳过完整 DOM 等待，减少耗时

```python
from scrapling.fetchers import DynamicFetcher, DynamicSession

page = DynamicFetcher.fetch("https://quotes.toscrape.com/")

with DynamicSession(headless=True, network_idle=True) as session:
    detail = session.fetch("https://quotes.toscrape.com/", load_dom=False)
```

## 🔎 选择器与节点遍历
---
lang: python
emoji: 🔎
link: https://scrapling.readthedocs.io/
desc: Scrapling 同时支持 CSS、XPath 和类 BeautifulSoup 风格 API，速查时重点看“怎么取到目标节点”。
---

### 选择方式

- `page.css(".quote")` : CSS 选择器
- `page.xpath('//div[@class="quote"]')` : XPath
- `page.find_all("div", {"class": "quote"})` : 类 BeautifulSoup 风格
- `page.find_by_text("quote", tag="div")` : 按文本内容定位

### 节点关系

- `node.parent` : 父节点
- `node.next_sibling` : 相邻节点
- `node.find_similar()` : 查找相似结构节点
- `node.below_elements()` : 获取视图下方元素

```python
page = Fetcher.get("https://quotes.toscrape.com/")
first_quote = page.css(".quote")[0]

text = first_quote.css(".text::text").get()
author = first_quote.css(".author::text").get()
siblings = first_quote.find_similar()
```

## 🕷️ Spider 爬虫工作流
---
lang: python
emoji: 🕷️
link: https://scrapling.readthedocs.io/
desc: 当你要做分页、并发和结果聚合时，再从 Fetcher 升级到 `Spider`。
---

### 核心对象

- `Spider` : 爬虫入口与生命周期管理
- `Request` : 自定义后续请求
- `Response` : 回调里读取页面与上下文
- `start_urls` : 初始抓取列表
- `concurrent_requests` : 并发请求数

```python
from scrapling.spiders import Spider, Response

class QuotesSpider(Spider):
    name = "quotes"
    start_urls = ["https://quotes.toscrape.com/"]
    concurrent_requests = 10

    async def parse(self, response: Response):
        for quote in response.css(".quote"):
            yield {
                "text": quote.css(".text::text").get(),
                "author": quote.css(".author::text").get(),
            }
```

## 🔀 多会话与异步并发
---
lang: python
emoji: 🔀
link: https://scrapling.readthedocs.io/
desc: 同一个爬虫里可以给不同请求分配不同会话，既兼顾性能，也能把高风险页面切到更强的抓取模式。
---

### 多会话

- `manager.add("fast", FetcherSession(...))` : 给普通页面走轻量会话
- `manager.add("stealth", AsyncStealthySession(...), lazy=True)` : 高风险页面按需初始化
- `Request(..., sid="stealth")` : 为单个请求指定会话

### 异步抓取

- `async with AsyncStealthySession(...)` : 异步浏览器会话
- `asyncio.gather(*tasks)` : 并发执行多个抓取任务

```python
import asyncio
from scrapling.fetchers import AsyncStealthySession

async def main():
    async with AsyncStealthySession(max_pages=2) as session:
        urls = ["https://example.com/1", "https://example.com/2"]
        results = await asyncio.gather(*(session.fetch(url) for url in urls))
        return results
```

## 💾 暂停恢复与代理轮换
---
lang: python
emoji: 💾
link: https://scrapling.readthedocs.io/
desc: 长任务最怕中断。`crawldir` 和代理轮换是 Scrapling 里最值得先配上的稳定性能力。
---

### 暂停恢复

- `Spider(crawldir="./crawl_data").start()` : 开启检查点目录
- `Ctrl+C` : 可优雅暂停
- 再次运行同一 `crawldir` : 自动尝试恢复

### 代理轮换

- `ProxyRotator([...])` : 定义代理池
- `proxy_rotator=rotator` : 全局轮换代理
- `proxy="http://..."` : 单次请求覆盖

```python
from scrapling import ProxyRotator
from scrapling.fetchers import Fetcher

rotator = ProxyRotator([
    "http://proxy1:8080",
    "http://proxy2:8080",
])

page = Fetcher.get("https://example.com", proxy_rotator=rotator)
```

## 🧪 流式结果与 CLI
---
lang: bash
emoji: 🧪
link: https://scrapling.readthedocs.io/
desc: 开发期先用 CLI 和流式接口快速验证页面，再把逻辑固化到 Spider 里，效率通常最高。
---

### 流式输出

- `async for item in QuotesSpider().stream()` : 一边抓一边消费结果

### CLI 常用命令

- `scrapling shell` : 进入交互式抓取环境
- `scrapling extract get <url> output.md` : 直接提取页面内容
- `--css-selector '#product'` : 指定提取区域
- `scrapling extract stealthy-fetch ... --solve-cloudflare` : 用隐身模式抓取
- `scrapling install` : 安装浏览器依赖

```bash
pip install "scrapling[fetchers]"
scrapling install
scrapling shell
scrapling extract get "https://example.com" content.md --css-selector "#main"
```
