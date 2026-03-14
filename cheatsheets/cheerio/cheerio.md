---
title: Cheerio 速查表
lang: javascript
version: 1.2.0
date: 2026-01-23
github: cheeriojs/cheerio
colWidth: 340px
---

# Cheerio 速查表

Cheerio 适合在 Node.js 中做 HTML/XML 抓取、清洗与结构化提取，保留类 jQuery API，但不提供浏览器完整 DOM。

## 🔌 加载文档
---
link: https://cheerio.js.org/docs/basics/loading
desc: 按输入来源选择 `load`、`fromURL`、`stringStream`、`decodeStream`。
---

```javascript
import * as cheerio from 'cheerio'

const $ = cheerio.load('<ul><li class="item">Apple</li></ul>')
console.log($('.item').text())
```

```javascript
import * as cheerio from 'cheerio'

// 直接拉取页面并返回 Cheerio API
const $ = await cheerio.fromURL('https://example.com')
console.log($('title').text())
```

```javascript
import * as cheerio from 'cheerio'
import * as fs from 'node:fs'

// 已知编码时用 stringStream
const stream = cheerio.stringStream({}, (err, $) => {
  if (err) throw err
  console.log($('title').text())
})

fs.createReadStream('./page.html', { encoding: 'utf8' }).pipe(stream)
```

```javascript
import * as cheerio from 'cheerio'
import * as fs from 'node:fs'

// 编码未知时用 decodeStream
const stream = cheerio.decodeStream({}, (err, $) => {
  if (err) throw err
  console.log($('meta[name=description]').attr('content'))
})

fs.createReadStream('./page.html').pipe(stream)
```

## 🎯 选择器与遍历
---
link: https://cheerio.js.org/docs/basics/selecting
desc: 选择器语义接近 jQuery，遍历链路适合抓取页面片段与列表。
---

```javascript
const $ = cheerio.load(`
  <ul id="fruits">
    <li class="apple">Apple</li>
    <li class="orange">Orange</li>
    <li class="pear">Pear</li>
  </ul>
`)

console.log($('#fruits .orange').text())
console.log($('li').eq(-1).text())
console.log($('.pear').prev().text())
console.log($('#fruits').children().length)
```

```javascript
const items = $('li')
  .map((_, element) => $(element).text().trim())
  .get()

const citrus = $('li')
  .filter((_, element) => $(element).text().includes('Orange'))
  .text()
```

## 🧾 属性、文本与序列化
---
link: https://cheerio.js.org/docs/api/interfaces/CheerioAPI
desc: 读取属性、文本、HTML 输出时最常用的是 `attr`、`prop`、`text`、`html`。
---

```javascript
const $ = cheerio.load('<a href="/docs" data-id="42">Docs</a>')

console.log($('a').attr('href'))
console.log($('a').prop('tagName'))
console.log($('a').data('id'))
console.log($.html())
```

```javascript
const $ = cheerio.load('<form><input name="q" value="cheerio" /></form>')

console.log($('form').serializeArray())
console.log($('input').val())
```

## 🧱 DOM 操作
---
link: https://cheerio.js.org/docs/api/classes/Cheerio
desc: 适合做抓取后的 DOM 清洗、结构重排和片段拼装。
---

```javascript
const $ = cheerio.load('<ul><li>Apple</li><li>Orange</li></ul>')

$('ul').append('<li class="pear">Pear</li>')
$('li').first().before('<li class="intro">Intro</li>')
$('li').last().replaceWith('<li class="grape">Grape</li>')

console.log($.html())
```

```javascript
const $ = cheerio.load('<article><script></script><p>Body</p></article>')

$('script').remove()
$('article').wrap('<section class="entry"></section>')

console.log($.html())
```

## 🗂️ 结构化提取
---
link: https://cheerio.js.org/docs/advanced/extract
desc: `extract()` 适合把页面规则声明成映射对象，减少手写选择器胶水代码。
---

```javascript
const $ = cheerio.load(`
  <article>
    <h1 class="title">Cheerio</h1>
    <a class="repo" href="https://github.com/cheeriojs/cheerio">repo</a>
    <ul class="tags">
      <li>Node.js</li>
      <li>HTML</li>
    </ul>
  </article>
`)

const data = $.extract({
  title: '.title',
  repo: { selector: '.repo', value: 'href' },
  tags: ['.tags li']
})

console.log(data)
```

## ⚙️ 解析选项
---
link: https://cheerio.js.org/docs/api
desc: 根据输入是否为 XML、是否自动补全根节点来调整解析行为。
---

```javascript
// 第三个参数为 false 时，不自动补全 html/head/body
const fragment = cheerio.load('<li>Item</li>', null, false)
console.log(fragment.html())
```

```javascript
const $ = cheerio.load('<media:thumb url="a.jpg"/>', {
  xmlMode: true,
  decodeEntities: true
})

console.log($.xml())
```

## ⚠️ 使用边界
---
desc: Cheerio 更像“解析与改写器”，不执行脚本、不做布局计算，也不模拟浏览器事件。
---

- 需要执行页面脚本、等待渲染结果时，改用 Playwright、Puppeteer 或浏览器自动化。
- `fromURL`、`stringStream`、`decodeStream`、`loadBuffer` 仅在 Node.js 环境可用。
- 抓取站点前先确认 robots、鉴权、限流与目标站点使用条款。
- 处理大页面时优先先选中目标片段，再做 `map()` / `each()`，避免全量遍历。
