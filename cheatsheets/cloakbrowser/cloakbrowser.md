---
title: CloakBrowser 速查表
lang: bash
version: "0.3.29"
date: "2026-05-24"
github: CloakHQ/CloakBrowser
colWidth: 360px
desc: 首个 C++ 源码级反检测浏览器，30/30 检测全过，一行代码替换 Playwright。
tags:
  - AI / LLM
  - AI 辅助工具
  - 自动化工具
  - 爬虫
  - 反爬虫
---

# CloakBrowser 速查表

## 核心身份

| 维度 | 内容 |
|---|---|
| 项目名 | CloakBrowser |
| 开发团队 | CloakHQ |
| GitHub | github.com/CloakHQ/CloakBrowser |
| 官网 | cloakbrowser.dev |
| 开源时间 | 2026-02-22 |
| 当前版本 | v0.3.28（Chromium 146.0.7680.177.4） |
| Stars | 15,000–20,000 |
| 许可证 | MIT（封装代码）+ 自定义（禁止再分发二进制） |

## 技术原理

**直接修改 Chromium C++ 源码，重新编译二进制**
- 57 个源码级补丁，让浏览器指纹从底层就是真实 Chrome
- 无需 JS 注入，网站无法通过 CDP 检测注入行为
- 二进制固定，浏览器更新后不易失效

## 三层方案对比

| | Playwright | playwright-stealth | CloakBrowser |
|---|---|---|---|
| 原理 | 无防护 | JS 注入 | C++ 源码修改 |
| 层级 | 无 | JS 层 | 源码层（二进制） |
| 检测通过率 | 极低 | 中等（易失效） | 30/30 |
| 维护成本 | 低 | 高（持续更新） | 低（二进制固定） |
| Playwright 兼容 | 100% | 需额外配置 | 完全兼容 |

## 指纹覆盖能力

- Canvas 指纹随机化
- WebGL 指纹篡改
- TLS 指纹模拟
- 时区/语言伪装（自动匹配代理 IP）
- Navigator.webdriver 源码层修正

## 安装与使用

```bash
# 安装
pip install cloakbrowser
pip install playwright
playwright install-deps chromium
playwright install chromium

# 可选：地理IP支持
pip install "cloakbrowser[geoip]"
```

## 一行代码替换 Playwright

```python
# 原来
from playwright.sync_api import sync_playwright

# 替换为（一行）
from cloak_browser import sync_playwright

# 其余代码完全不变
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://example.com")
```

## 适用场景

### 适合
- 反爬网站数据采集（Cloudflare、reCAPTCHA 保护平台）
- 多账号管理（独立指纹 + 代理 IP 防关联）
- AI Agent 集成（browser-use、Crawl4AI、LangChain）
- 合法市场研究、价格监控

### 不适合
- ❌ 账号盗用、撞库
- ❌ 绕过登录获取付费内容
- ❌ 违反网站服务条款的行为

## 合规边界

| 许可证层 | 条款 | 实际影响 |
|---|---|---|
| 封装代码 | MIT | ✅ 可用，可修改，可分发 |
| 二进制文件 | 自定义 → 禁止再分发 | ⚠️ 不能单独打包传播二进制 |

## 爆火原因

| 层级 | 原因 |
|---|---|
| 表层 | AI Agent 元年，browser-use 等框架需求爆发 |
| 表层 | 爬虫工程师痛点：反爬检测越来越严 |
| 深层 | 首个 C++ 源码级 stealth 浏览器，技术代差明显 |
| 深层 | 一行代码替换，极简体验 |
| 品牌 | "Cloak"= 隐身斗篷，名字好记 |

## 官方声称的检测结果

- reCAPTCHA v3：0.9（人类水平），普通 Playwright：0.1
- Cloudflare Turnstile ✅
- FingerprintJS ✅
- BrowserScan ✅
- 30/30 检测站点全部通过 ⚠️（官方自测，建议实测验证）

## 支持平台

- ✅ Windows
- ✅ macOS
- ✅ Linux

## 支持框架

- browser-use
- Crawl4AI
- LangChain