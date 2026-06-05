---
title: Scrapling 速查表
lang: zh-CN
version: "0.4.8"
date: "2026-05-30"
github: D4Vinci/Scrapling
colWidth: 420px
desc: Scrapling 是完整的 Python Web Scraping 框架，覆盖 parser、HTTP fetchers、动态浏览器抓取、spiders、CLI 和 MCP，适合从单次请求扩展到全量爬取。
tags:
  - Python
  - Web Scraping
  - Browser Automation
  - MCP
  - Docker
---

# Scrapling 速查表

## 一句话结论

> Scrapling 不是“一个选择器库”，而是一个 **Python 抓取框架**：解析、请求、动态浏览器、反检测、爬虫调度、CLI、MCP 一套打通。

## 快速定位

- 适合：想从轻量抓取一路扩展到浏览器级抓取 / 多会话 crawl / MCP 服务化
- 不适合：只想要一个极简 HTML 解析器，且不想带额外框架语义
- 当前推荐：**先直装，再按需启用 fetchers / MCP / 容器化**

## 架构一眼看懂

- `scrapling.parser`：`Selector` / `Selectors`
- `scrapling.fetchers`：`Fetcher` / `DynamicFetcher` / `StealthyFetcher`
- `scrapling.spiders`：`Spider` / `Request` / `Response` / `Scheduler`
- `scrapling.cli`：`scrapling get/post/put/delete/fetch/stealthy_fetch/mcp`
- `server.json`：MCP server 元数据（stdio）
- `Dockerfile`：官方容器化方案

## 安装速查

```bash
# 基础安装
pip install scrapling

# 开发态安装
pip install -e /path/to/Scrapling

# 浏览器 / 反检测能力
pip install -e '/path/to/Scrapling[fetchers]'

# MCP / markdownify 相关
pip install -e '/path/to/Scrapling[ai]'
```

**Python 要求：** `>= 3.10`

## 最小用法

```python
from scrapling.parser import Selector

html = '<div class="product"><h2>Demo</h2><span class="price">$9</span></div>'
sel = Selector(html)
print(sel.css('.product h2::text').get())
print(sel.css('.price::text').get())
```

## 何时选“直接安装”

- 只用 `Selector` / `Fetcher`
- 想最快跑通
- 想嵌入现有 Python 项目
- 不想先处理容器 runtime / Chromium 依赖

**本机实测结论：** 直接安装可用，且核心 HTML 解析通过。

## 何时选“容器化”

- 要跑 `DynamicFetcher` / `StealthyFetcher`
- 要把 Chromium、Playwright、系统依赖一起封装
- 要给 MCP / 服务化交付一个可复现镜像

**注意：** 本机 Podman 这次 build 因存储配置冲突失败，不是 Scrapling 本身的问题。

## 官方发布信号

- GitHub：`D4Vinci/Scrapling`
- Release：`v0.4.8`
- PyPI：`scrapling==0.4.8`
- License：BSD-3-Clause
- README 明确定位为 “from a single request to a full-scale crawl”

## 常见坑

- `Adaptor` 不是当前对外导出主接口，别把旧写法当成当前 API。
- `fetchers` 需要额外依赖，别只装基础包就期待浏览器能力。
- 如果本机容器 build 报 storage mismatch，先修容器 runtime，再判断 Scrapling。

## 工作流建议

1. 先 `pip install scrapling`
2. 用 `Selector` 跑通最小解析
3. 需要浏览器能力再加 `[fetchers]`
4. 需要服务化再用 Docker / MCP
5. 最终在真实目标站点验证反爬和会话策略

## 参考链接

- GitHub：<https://github.com/D4Vinci/Scrapling>
- Docs：<https://scrapling.readthedocs.io/en/latest/>
- PyPI：<https://pypi.org/project/scrapling/>
- Dockerfile：仓库根目录 `Dockerfile`
- MCP server：仓库根目录 `server.json`
