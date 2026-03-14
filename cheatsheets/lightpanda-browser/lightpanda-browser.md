---
title: Lightpanda Browser 速查表
lang: bash
version: "nightly"
date: 2026-03-14
github: lightpanda-io/browser
colWidth: 420px
---

## 🧭 定位与入口
---
lang: markdown
emoji: 🧭
link: https://github.com/lightpanda-io/browser
desc: Lightpanda 是面向无头场景的轻量浏览器，核心入口是本地命令和 CDP 服务。
---

- 目标场景：AI Agent 自动化、抓取、测试、批量页面执行
- 兼容路径：通过 CDP 接入 Puppeteer、Playwright、chromedp
- 关键特点：低内存、启动快、只做无头用途
- 当前状态：Beta，Web API 覆盖仍在持续补全
- 两个主入口：`fetch` 用来抓页面，`serve` 用来暴露 CDP 服务

## 🚀 最小工作流
---
lang: bash
emoji: 🚀
link: https://github.com/lightpanda-io/browser#quick-start
desc: 先区分是“一次性抓取”还是“长期跑自动化”，再决定用 fetch 还是 serve。
---

```bash
# 一次性抓取渲染后的 HTML
./lightpanda fetch https://example.com

# 开 CDP 服务，给 Puppeteer / Playwright 连接
./lightpanda serve --host 127.0.0.1 --port 9222

# Docker 方式暴露 9222
docker run -d --name lightpanda -p 9222:9222 lightpanda/browser:nightly
```

### 选择建议
- 只想拿最终 DOM：优先 `fetch`
- 已有自动化脚本：优先 `serve` + CDP 客户端
- 想大规模并发、压缩资源占用：优先评估 Lightpanda 替代 Chromium

## 📥 页面抓取
---
lang: bash
emoji: 📥
link: https://github.com/lightpanda-io/browser#dump-a-url
desc: fetch 会执行页面脚本后输出页面内容，适合抓动态站点。
---

```bash
# 最简抓取
./lightpanda fetch https://demo-browser.lightpanda.io/campfire-commerce/

# 遵守 robots.txt + 打开易读日志
./lightpanda fetch \
  --obey_robots \
  --log_format pretty \
  --log_level info \
  https://demo-browser.lightpanda.io/campfire-commerce/
```

### 常见参数
- `--obey_robots`：按 `robots.txt` 约束抓取
- `--log_format pretty`：适合本地排查
- `--log_level info`：查看导航、脚本执行、XHR/FETCH 请求

## 🔌 CDP 服务
---
lang: bash
emoji: 🔌
link: https://github.com/lightpanda-io/browser#start-a-cdp-server
desc: serve 会把浏览器作为 CDP 端点暴露出去，复用现有自动化脚本最直接。
---

```bash
# 本地监听
./lightpanda serve \
  --obey_robots \
  --log_format pretty \
  --log_level info \
  --host 127.0.0.1 \
  --port 9222

# 容器方式
docker run -d --name lightpanda -p 9222:9222 lightpanda/browser:nightly
```

### 适用场景
- Puppeteer 远程连接
- 用现成 CDP 工具链替换 Chrome Headless
- 给 Agent 框架提供更轻量的浏览器后端

## 🤖 Puppeteer 接入
---
lang: javascript
emoji: 🤖
link: https://github.com/lightpanda-io/browser#start-a-cdp-server
desc: 连接方式和普通 CDP 浏览器一致，核心是改成 browserWSEndpoint。
---

```javascript
import puppeteer from "puppeteer-core";

const browser = await puppeteer.connect({
  browserWSEndpoint: "ws://127.0.0.1:9222",
});

const context = await browser.createBrowserContext();
const page = await context.newPage();

await page.goto("https://demo-browser.lightpanda.io/amiibo/", {
  waitUntil: "networkidle0",
});

const links = await page.evaluate(() =>
  Array.from(document.querySelectorAll("a")).map((node) => node.href)
);

console.log(links);

await page.close();
await context.close();
await browser.disconnect();
```

### 接入判断
- 现有脚本主要走标准导航、点击、求值：通常可直接迁移
- 如果脚本强依赖某些新 Web API：先做兼容性验证
- Playwright 可接，但官方明确提醒未来版本策略可能变化

## 🌐 已覆盖能力
---
lang: markdown
emoji: 🌐
link: https://github.com/lightpanda-io/browser#status
desc: 选型时先看它已经实现哪些浏览器能力，而不是默认把它当完整 Chromium 替代品。
---

- JavaScript 执行：基于 `v8`
- DOM / AJAX：包含 DOM、XHR、Fetch
- 自动化能力：点击、表单输入、Cookie、自定义 Header、网络拦截、代理
- 网络与抓取：HTTP loader、`robots.txt` 支持、CDP/WebSocket 服务

### 还要注意
- 项目仍是 Beta
- Web API 覆盖不是完整浏览器级别
- 遇到脚本兼容问题时，应记录“最后一个可用版本”和失败页面

## ⚠️ 高频坑位
---
lang: markdown
emoji: ⚠️
link: https://github.com/lightpanda-io/browser#status
desc: 真正的风险不在启动，而在自动化脚本跑到边缘 API 时的兼容差异。
---

- 不要默认等同 Chromium：缺失 API 时脚本会在运行时暴露问题
- Playwright 兼容不等于长期稳定兼容：框架内部策略变化可能触发新路径
- 线上压测前先用目标站点做回归，而不是只跑 demo
- 如果抓取合规要求严格，记得显式带上 `--obey_robots`
- 默认会收集遥测；需要关闭时设置 `LIGHTPANDA_DISABLE_TELEMETRY=true`

## 🧪 构建与测试入口
---
lang: bash
emoji: 🧪
link: https://github.com/lightpanda-io/browser#build-from-sources
desc: 只保留最小源码入口，避免正文被安装细节淹没。
---

```bash
# 构建
make build
make build-dev

# 单元测试
make test

# 运行浏览器
zig build run
```

### 前提提醒
- 需要 `Zig 0.15.2`
- 依赖 `zig-js-runtime`、`libcurl`、`html5ever`
- 端到端和 WPT 需要额外 demo / wpt 仓库
