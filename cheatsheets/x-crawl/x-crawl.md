---
title: x-crawl
lang: javascript
version: "10.1.0"
date: "2025-04-06"
github: coder-hxl/x-crawl
colWidth: 433px
---

# x-crawl AI 辅助爬虫库

## 入口与定位
---
lang: javascript
emoji: ⚡
link: https://coder-hxl.github.io/x-crawl/cn/
desc: x-crawl 是 Node.js AI 辅助爬虫库。它既能单独使用 crawler API 抓动态页、静态 HTML、JSON API 和文件资源，也能接入 Ollama / OpenAI 做元素分析、选择器生成和问答。
---

x-crawl 的核心思路很直接：先用爬虫 API 完成抓取，再在需要时叠加 AI 做结构理解和提取。

- `Crawler` 负责抓取、调度、重试、代理、指纹和结果回收
- `AI` 负责解析 HTML、生成选择器、回答爬虫问题、封装自定义智能能力
- 同一套 API 支持 `string`、详细目标配置、数组和进阶配置，适合从单页到批量任务

```javascript
import { createCrawl, createCrawlOpenAI } from 'x-crawl';

const crawlApp = createCrawl({
  maxRetry: 3,
  intervalTime: { min: 1000, max: 2000 }
});

const aiApp = createCrawlOpenAI({
  clientOptions: { apiKey: process.env.OPENAI_API_KEY },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
});
```

## 最短路径
---
lang: javascript
emoji: 🚀
link: https://coder-hxl.github.io/x-crawl/cn/guide/quick-start
desc: 最短用法是先创建 crawler 应用，再按目标类型选择 crawlPage / crawlHTML / crawlData / crawlFile；页面结构不稳定时再补 AI 应用。
---

先记住这条路径就够了：

1. `createCrawl()` 建应用
2. 选择对应抓取 API
3. 批量任务优先用数组或 advanced 配置
4. 需要语义理解时再加 `createCrawlOpenAI()`

```javascript
import { createCrawl } from 'x-crawl';

const crawlApp = createCrawl();

await crawlApp.crawlPage('https://www.example.com');
await crawlApp.crawlHTML('https://www.example.com/page.html');
await crawlApp.crawlData('https://api.example.com/list');
await crawlApp.crawlFile('https://cdn.example.com/file.pdf');
```

## 四类爬取速查
---
lang: javascript
emoji: 🧭
link: https://coder-hxl.github.io/x-crawl/cn/api/
desc: x-crawl 的四个抓取入口覆盖动态页面、静态 HTML、接口数据和文件下载，入参形状一致，便于在同一项目里切换。
---

| 场景 | 首选 API | 关键结果 | 典型特征 |
|---|---|---|---|
| 动态页面 / 交互页 | `crawlPage` | `page` / `browser` | 支持浏览器操作、键盘输入、事件操作 |
| 静态 HTML | `crawlHTML` | HTML 结果 | 不依赖浏览器交互，适合纯结构提取 |
| JSON API | `crawlData` | 结构化数据 | 适合 GET/接口类数据抓取 |
| 文件资源 | `crawlFile` | 文件结果 | 适合图片、PDF 等资源下载 |

四个 API 都支持这几种调用形状：

- `string`
- 详细目标配置
- `(string | 详细目标配置)[]`
- `advanced config`

## 动态页面 / crawlPage
---
lang: javascript
emoji: 🖱️
link: https://coder-hxl.github.io/x-crawl/cn/api/crawl-page
desc: crawlPage 用于动态页面，常见于需要浏览器实例、页面操作、登录态、截图和滚动加载的场景。
---

`crawlPage` 适合这些情况：

- 页面要等 JS 渲染后才有数据
- 需要点击、输入、滚动、截图、拿浏览器实例
- 需要在抓取过程中处理登录、弹窗、分页和懒加载

```javascript
import { createCrawl } from 'x-crawl';

const crawlApp = createCrawl({
  mode: 'async',
  maxRetry: 3,
  intervalTime: { min: 1000, max: 2000 }
});

const res = await crawlApp.crawlPage({
  url: 'https://www.example.com',
  maxRetry: 2,
  cookies: 'session=xxx',
  proxy: {
    urls: ['http://127.0.0.1:7897']
  }
});

const { page, browser } = res.data;
// 这里可以继续做页面操作
await page.waitForSelector('.item');
await browser.close();
```

要点：

- 单目标返回单个结果，数组或 advanced 配置返回数组
- 批量抓取后记得尽早 `browser.close()`
- 动态页里目标配置通常会结合 `proxy`、`cookies`、`maxRetry` 一起用

## 静态 HTML / crawlHTML
---
lang: javascript
emoji: 🧾
link: https://coder-hxl.github.io/x-crawl/cn/guide/crawl-html
desc: crawlHTML 面向静态 HTML 或直接可解析的页面内容，通常不需要浏览器交互，适合批量结构化提取。
---

`crawlHTML` 适合：

- 纯静态页面
- 已经拿到 HTML 字符串，想统一走同一套抓取流程
- 需要在每个目标完成时提前处理结果

```javascript
import { createCrawl } from 'x-crawl';

const crawlApp = createCrawl({
  intervalTime: { min: 1000, max: 3000 }
});

const res = await crawlApp.crawlHTML([
  'https://www.example.com/html-1',
  'https://www.example.com/html-2'
]);

console.log(res);
```

这里最值得记住的是 `onCrawlItemComplete`：

- 每个目标完成时都会回调
- 适合边抓边存、边抓边清理、边抓边入库
- 批量任务不必等全部完成后再处理

## JSON API / crawlData
---
lang: javascript
emoji: 📡
link: https://coder-hxl.github.io/x-crawl/cn/api/crawl-data
desc: crawlData 面向接口数据，适合 JSON、列表接口和可直接结构化消费的结果。
---

`crawlData` 适合：

- 直接抓接口
- 返回 JSON 数据
- 想要强类型结果时配合泛型使用

```typescript
import { createCrawl } from 'x-crawl';

interface ApiItem {
  id: string;
  title: string;
}

const crawlApp = createCrawl();

const res = await crawlApp.crawlData<ApiItem[]>(
  'https://api.example.com/items'
);

console.log(res.data);
```

进阶写法常用这些字段：

- `targets`
- `intervalTime`
- `cookies`
- `maxRetry`

## 文件资源 / crawlFile
---
lang: javascript
emoji: 📁
link: https://coder-hxl.github.io/x-crawl/cn/api/crawl-file
desc: crawlFile 用于图片、PDF 等文件资源下载，支持单个目标、数组目标和进阶批量配置。
---

`crawlFile` 适合：

- 图片下载
- PDF 下载
- 资源型 URL 批量落盘

```javascript
import { createCrawl } from 'x-crawl';

const crawlApp = createCrawl({
  timeout: 10000
});

await crawlApp.crawlFile({
  targets: [
    'https://www.example.com/file-1',
    'https://www.example.com/file-2'
  ],
  storeDirs: './upload',
  intervalTime: { min: 1000, max: 3000 },
  maxRetry: 1
});
```

文件下载时最常用的两个目录字段是：

- `storeDir`
- `storeDirs`

## AI 辅助
---
lang: javascript
emoji: 🤖
link: https://coder-hxl.github.io/x-crawl/cn/guide/create-ai-application
desc: AI 层用于理解 HTML、生成选择器、回答爬虫问题和封装自定义智能能力，页面结构不稳定时尤其有用。
---

AI 层主要有两条路：

- `createCrawlOpenAI()`：接 OpenAI
- `createCrawlOllama()`：接本地 Ollama

### 1. 解析元素

`parseElements(HTML, prompt)` 适合把一段 HTML 交给 AI，让它直接抽取图片、标题、链接、属性值等。

### 2. 生成选择器

`getElementSelectors(HTML, prompt)` 适合在页面结构容易变时，让 AI 反向生成更稳的选择器。

### 3. 回答问题

`help(question)` 适合问爬虫策略、反爬思路、页面处理办法。

### 4. 自定义能力

`custom()` 适合把你自己的提示词、规则和领域逻辑封装成可复用能力。

```javascript
import { createCrawlOpenAI } from 'x-crawl';

const aiApp = createCrawlOpenAI({
  clientOptions: { apiKey: process.env.OPENAI_API_KEY },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
});

const elements = await aiApp.parseElements(html, '获取图片链接并去重');
const selectors = await aiApp.getElementSelectors(html, '获取所有商品卡片');
const answer = await aiApp.help('x-crawl 是什么');
```

注意：

- HTML 越大，Token 消耗越高
- 页面结构稳定时优先用普通抓取
- 页面结构变化频繁时再把 AI 放进流程

## 核心配置
---
lang: javascript
emoji: ⚙️
link: https://coder-hxl.github.io/x-crawl/cn/type/
desc: createCrawl 的全局配置控制抓取模式、间隔、日志和随机指纹；目标级配置再细化代理、重试、Cookie、指纹和下载目录。
---

`createCrawl` 的高价值配置：

| 字段 | 作用 | 备注 |
|---|---|---|
| `mode` | 切换 `async` / `sync` | 按任务特征选择 |
| `enableRandomFingerprint` | 启用随机设备指纹 | 默认关闭 |
| `baseUrl` | 基础地址 | 适合相对路径拼接 |
| `intervalTime` | 间隔控制 | 适合固定或随机节奏 |
| `log` | 日志输出 | 可直接关掉或细分 `start/process/result` |
| `crawlPage.puppeteerLaunchOptions` | 传给 Puppeteer | 只影响浏览器型抓取 |

目标级常用配置：

- `maxRetry`
- `proxy.urls`
- `proxy.switchByErrorCount`
- `proxy.switchByHttpStatus`
- `cookies`
- `fingerprint`
- `storeDir` / `storeDirs`

```javascript
import { createCrawl } from 'x-crawl';

const crawlApp = createCrawl({
  mode: 'async',
  enableRandomFingerprint: true,
  baseUrl: 'https://example.com',
  intervalTime: { min: 1000, max: 3000 },
  log: { start: true, process: true, result: true }
});
```

## 结果与收尾
---
lang: javascript
emoji: 🧪
link: https://coder-hxl.github.io/x-crawl/cn/guide/results
desc: 结果处理的关键是先分清单项返回和批量返回，再按 crawlPage / crawlHTML / crawlData / crawlFile 的结果形状做收尾动作。
---

记住这几条就够了：

- 单目标输入通常返回单个结果
- 数组或 advanced 配置通常返回结果数组
- `crawlPage` 的结果里会带 `page` 和 `browser`
- 批量抓取时尽量用 `onCrawlItemComplete` 早点处理结果
- 页面型抓取完成后记得关闭浏览器

```typescript
import { createCrawl } from 'x-crawl';

const crawlApp = createCrawl();

const res = await crawlApp.crawlData<{ title: string }>(
  'https://api.example.com/post'
);

console.log(res.data.title);
```

TypeScript 支持是 x-crawl 的强项，适合把结果类型一路传到底，减少后处理时的手动断言。
