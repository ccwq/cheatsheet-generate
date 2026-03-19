---
title: Crawlee
lang: javascript
version: "3.10.0"
date: "2026-03-19"
github: apify/crawlee
colWidth: 433px
---

# Crawlee

## ⚡ 入口与定位
---
lang: javascript
emoji: ⚡
link: https://crawlee.dev/
desc: Crawlee 是 Node.js 网页爬虫与浏览器自动化库，统一封装 HTTP 爬取和真实浏览器爬取，支持反爬规避、自动队列、数据存储开箱即用。
---

Crawlee 覆盖爬虫全流程：链接爬取 → 内容抓取 → 数据存储，帮你快速构建可靠爬虫。

### 核心能力

- **HTTP 爬虫** : 零配置 HTTP2、浏览器级请求头、TLS 指纹复制
- **浏览器爬虫** : 支持 Playwright / Puppeteer，同一接口切换
- **反爬规避** : 默认生成类人指纹，自动轮换代理和会话
- **持久化队列** : URL 队列自动持久化，支持 breadth-first / depth-first
- **自动扩缩容** : 根据系统资源自动调整并发
- **存储抽象** : 数据和文件存储插件化，可本地或云端

### 快速起手

```javascript
import { PlaywrightCrawler, Dataset } from 'crawlee';

const crawler = new PlaywrightCrawler({
  async requestHandler({ request, page, enqueueLinks, pushData, log }) {
    const title = await page.title();
    log.info(`Title of ${request.loadedUrl} is '${title}'`);
    await pushData({ title, url: request.loadedUrl });
    await enqueueLinks();
  },
});

await crawler.run(['https://crawlee.dev']);
const data = await Dataset.getData();
console.table(data.items);
```

## 🏗️ 仓库骨架 / 模块分工
---
lang: javascript
emoji: 🏗️
link: https://github.com/apify/crawlee
desc: Crawlee 将爬虫分为 Fetcher 层（抓取）、Processor 层（处理）、Storage 层（存储），理解模块分工是写好爬虫的前提。
---

### 四大核心模块

| 模块 | 职责 | 代表类 |
|------|------|--------|
| **Fetcher** | 底层 HTTP/浏览器请求 | `HttpFetcher`, `PlaywrightFetcher` |
| **Crawler** | 任务调度、队列、扩缩容 | `CheerioCrawler`, `PlaywrightCrawler` |
| **Processor** | 页面解析、数据提取 | `requestHandler` 回调函数 |
| **Storage** | 数据与文件持久化 | `Dataset`, `KeyValueStore`, `RequestQueue` |

### 爬虫类选择决策树

```
静态页面 / JSON API
    │
    ├─ HTML 简单解析 ──→ CheerioCrawler（最快）
    │
    └─ 需要 JS 渲染
            │
            ├─ 轻量渲染 ──→ JSDOMCrawler
            │
            ├─ Playwright 可用 ──→ PlaywrightCrawler
            │
            └─ Puppeteer 偏好 ──→ PuppeteerCrawler
```

## 🚀 起手工作流
---
lang: javascript
emoji: 🚀
link: https://crawlee.dev/docs/quick-start
desc: 最常用起手流程：从单页抓取 → 链接爬取 → 数据存储，三步走完大多数场景。
---

### 第一步：单页抓取 + 数据存储

```javascript
import { CheerioCrawler, Dataset } from 'crawlee';

const crawler = new CheerioCrawler({
  async requestHandler({ $, request, pushData }) {
    const title = $('h1').text();
    await pushData({ title, url: request.url });
  },
});

await crawler.run(['https://example.com']);
await crawler.exportData('./result.csv');
```

### 第二步：自动链接爬取 + 深度控制

```javascript
const crawler = new CheerioCrawler({
  async requestHandler({ $, pushData }) {
    const title = $('h1').text();
    await pushData({ title });
  },
  maxRequestsPerCrawl: 50,
  maxDepth: 3,
});

await crawler.run(['https://example.com']);
```

### 第三步：多类爬虫统一入口

```javascript
import { PlaywrightCrawler, Dataset } from 'crawlee';

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, pushData, enqueueLinks }) {
    await enqueueLinks({ globs: ['**/products/**'] });
    const price = await page.locator('.price').textContent();
    await pushData({ price });
  },
  headless: true,
});

await crawler.run(['https://shop.example.com']);
```

## 📋 高频 Recipes / 常见套路
---
lang: javascript
emoji: 📋
link: https://crawlee.dev/docs/examples
desc: 日常高频场景的直接可运行模板。
---

### R1：抓取分页列表

```javascript
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, enqueueLinks, pushData }) {
    const items = await page.locator('.product-item').all();
    for (const item of items) {
      await pushData({
        title: await item.locator('h3').textContent(),
        price: await item.locator('.price').textContent(),
      });
    }
    await enqueueLinks({ selector: '.next-page' });
  },
});

await crawler.run(['https://shop.example.com/category']);
```

### R2：登录后抓取受保护内容

```javascript
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, request, enqueueLinks }) {
    if (request.url.includes('/dashboard')) {
      await page.waitForSelector('.user-profile');
      await enqueueLinks({ urlMatches: '/dashboard/' });
    }
  },
});

await crawler.addSessions(1);
await crawler.run(['https://app.example.com/login']);
await crawler.click('button[type="submit"]');
```

### R3：爬取 JSON API

```javascript
import { HttpCrawler } from 'crawlee';

const crawler = new HttpCrawler({
  async requestHandler({ response, pushData }) {
    const json = await response.json();
    await pushData(json.results);
  },
});

await crawler.run(['https://api.example.com/data?page=1']);
```

### R4：文件下载（PDF / PNG）

```javascript
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
  async requestHandler({ page }) {
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button.download').click();
    const download = await downloadPromise;
    await download.saveAs('./downloads/' + download.suggestedFilename());
  },
});

await crawler.run(['https://example.com/report']);
```

### R5：截图捕获

```javascript
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, pushData }) {
    await page.goto('https://example.com');
    const screenshot = await page.screenshot({ fullPage: true });
    await pushData({ screenshot });
  },
});
```

### R6：无限滚动页面

```javascript
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, pushData }) {
    let prevHeight;
    while (true) {
      const items = await page.locator('.item').all();
      for (const item of items) {
        await pushData({ text: await item.textContent() });
      }
      const currHeight = await page.evaluate(() => document.body.scrollHeight);
      if (currHeight === prevHeight) break;
      prevHeight = currHeight;
      await page.evaluate(() => window.scrollTo(0, currHeight));
      await page.waitForTimeout(1000);
    }
  },
});
```

## 🪝 Hooks / 生命周期
---
lang: javascript
emoji: 🪝
link: https://crawlee.dev/docs/guides/hooks
desc: 通过 Hooks 控制请求前后、页面导航前后的行为，适合统一注入反爬逻辑、登录态、代理。
---

### 请求级 Hooks

```javascript
const crawler = new PlaywrightCrawler({
  preNavigationHooks: [
    async ({ page, session }, gotoOptions) => {
      await page.setExtraHTTPHeaders({ 'X-Custom-Header': 'value' });
    },
  ],
  postNavigationHooks: [
    async ({ page, session }) => {
      await page.waitForLoadState('networkidle');
    },
  ],
});
```

### 路由级 Hooks

```javascript
const crawler = new PlaywrightCrawler({
  requestHandler: async ({ request, page, enqueueLinks }) => {
    if (request.userData.label === 'detail') {
      await enqueueLinks({ userData: { label: 'detail' } });
    }
  },
});
```

## 🔐 代理与会话管理
---
lang: javascript
emoji: 🔐
link: https://crawlee.dev/docs/guides/proxy-management
desc: 代理轮换和会话管理是规模化爬虫的必修课，Crawlee 提供内置 SessionPool 和 ProxyConfiguration。
---

### 代理配置

```javascript
import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';

const proxyConfiguration = new ProxyConfiguration({
  proxyUrls: [
    'http://proxy1.example.com:8080',
    'http://proxy2.example.com:8080',
  ],
});

const crawler = new PlaywrightCrawler({
  proxyConfiguration,
  async requestHandler({ page }) {
    const title = await page.title();
    console.log(title);
  },
});
```

### 会话管理

```javascript
const crawler = new PlaywrightCrawler({
  sessionPoolSize: 10,
  async requestHandler({ page, session }) {
    session.setCookies([{ name: 'session_id', value: 'abc123' }]);
    await page.goto('https://example.com');
  },
});
```

### Session 使用技巧

```javascript
await crawler.addSessions(5);
await crawler.run(['https://example.com/page1', 'https://example.com/page2']);
```

---

# Cheatsheet

## Crawler 类速查

### CheerioCrawler — HTTP 爬虫（最快）

```javascript
import { CheerioCrawler } from 'crawlee';

const crawler = new CheerioCrawler({
  requestHandler: async ({ $, request, pushData, enqueueLinks }) => {
    await pushData({ content: $('body').text() });
    await enqueueLinks();
  },
  maxConcurrency: 50,
});

await crawler.run(['https://example.com']);
```

### JSDOMCrawler — 支持 DOM 操作的 HTTP 爬虫

```javascript
import { JSDOMCrawler } from 'crawlee';

const crawler = new JSDOMCrawler({
  async requestHandler({ window, request, pushData }) {
    const { document } = window;
    const title = document.querySelector('h1').textContent;
    await pushData({ title, url: request.url });
  },
});
```

### PlaywrightCrawler — Playwright 浏览器爬虫

```javascript
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
  headless: true,
  requestHandler: async ({ page, pushData }) => {
    await pushData({ title: await page.title() });
  },
});
```

### PuppeteerCrawler — Puppeteer 浏览器爬虫

```javascript
import { PuppeteerCrawler } from 'crawlee';

const crawler = new PuppeteerCrawler({
  requestHandler: async ({ page, pushData }) => {
    await pushData({ title: await page.title() });
  },
});
```

## 核心配置选项

### 通用配置

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `maxRequestRetries` | `number` | 3 | 单请求最大重试次数 |
| `maxConcurrency` | `number` | 1 | 最大并发请求数 |
| `maxRequestsPerCrawl` | `number` | `undefined` | 单次运行最大请求数 |
| `maxDepth` | `number` | `undefined` | 最大爬取深度 |
| `requestTimeout` | `number` | 30s | 请求超时时间 |
| `requestHandlerTimeoutSecs` | `number` | 60s | 处理器超时 |

### 浏览器特有配置

| 选项 | 类型 | 说明 |
|------|------|------|
| `headless` | `boolean` | 是否无头模式 |
| `userAgent` | `string` | 自定义 User-Agent |
| `proxyConfiguration` | `ProxyConfiguration` | 代理配置 |
| `sessionPoolSize` | `number` | 会话池大小 |
| `preNavigationHooks` | `Hook[]` | 导航前钩子 |
| `postNavigationHooks` | `Hook[]` | 导航后钩子 |

### 示例：完整配置

```javascript
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
  maxRequestRetries: 5,
  maxConcurrency: 10,
  maxRequestsPerCrawl: 100,
  requestTimeout: 60_000,
  headless: false,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  proxyConfiguration: new ProxyConfiguration({
    proxyUrls: ['http://proxy.example.com:8080'],
  }),
  sessionPoolSize: 5,
  preNavigationHooks: [
    async ({ page }, gotoOptions) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    },
  ],
  async requestHandler({ page, pushData, enqueueLinks }) {
    await enqueueLinks({ globs: ['**/products/**'] });
    await pushData({ title: await page.title() });
  },
});
```

## 数据存储

### Dataset 操作

```javascript
import { Dataset } from 'crawlee';

await Dataset.pushData({ title: 'Example', url: 'https://example.com' });

const { items } = await Dataset.getData();
console.log(items);

await crawler.exportData('./result.csv');
await crawler.exportData('./result.json');
```

### KeyValueStore 操作

```javascript
import { KeyValueStore } from 'crawlee';

await KeyValueStore.setValue('screenshot', screenshotBuffer, { contentType: 'image/png' });

const value = await KeyValueStore.getValue('key');
```

### RequestQueue 操作

```javascript
import { RequestQueue } from 'crawlee';

const queue = await RequestQueue.open();
await queue.addRequest({ url: 'https://example.com', userData: { label: 'detail' } });

const { items } = await queue.fetchNextRequests();
const request = await queue.getRequest('unique-key');
await queue.markRequestHandled(request.id);
```

## 路由与请求分发

### 按 URL 模式路由

```javascript
const crawler = new PlaywrightCrawler({
  maxRequestRetries: 3,
  async requestHandler({ request, page, enqueueLinks }) {
    if (request.url.includes('/products/')) {
      await enqueueLinks({ userData: { label: 'product' } });
    } else if (request.url.includes('/categories/')) {
      await enqueueLinks({ userData: { label: 'category' } });
    }
  },
});
```

### 自定义路由函数

```javascript
import { router } from 'crawlee';

const handleProduct = async ({ page, pushData }) => {
  await pushData({
    title: await page.locator('h1').textContent(),
    price: await page.locator('.price').textContent(),
  });
};

const handleCategory = async ({ page, enqueueLinks }) => {
  await enqueueLinks({ userData: { label: 'product' } });
};

export default router.createRouter({ handleProduct, handleCategory });
```

## 错误处理

### 错误处理器

```javascript
const crawler = new PlaywrightCrawler({
  requestHandlerFailedHandler: async ({ request, error }) => {
    console.error(`Request ${request.url} failed: ${error.message}`);
    await Dataset.pushData({ url: request.url, error: error.message });
  },
});
```

### 重试配置

```javascript
const crawler = new PlaywrightCrawler({
  maxRequestRetries: 5,
  retryRequestPatterns: [
    { pattern: /rate.limit/i, maxRetries: 10 },
  ],
});
```

## CLI 命令

### 项目创建

```bash
npx crawlee create my-crawler
cd my-crawler
npm start
```

### 安装依赖

```bash
npm install crawlee playwright
```

### 预发布版本

```bash
npm install crawlee@next
```

## 反爬规避配置

### 指纹管理

```javascript
const crawler = new PlaywrightCrawler({
  useFingerprint: true,
  fingerprintOptions: {
    fingerprintSize: 10,
  },
});
```

### 浏览器配置文件

```javascript
const crawler = new PlaywrightCrawler({
  browserChannels: ['chrome', 'firefox', 'webkit'],
});
```

## 与 Apify 平台集成

```javascript
import { Actor } from 'apify';

await Actor.init();

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, pushData }) {
    await pushData({ title: await page.title() });
  },
});

await crawler.run([{ url: 'https://example.com' }]);

await Actor.exit();
```
