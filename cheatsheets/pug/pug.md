---
title: Pug 模板引擎速查
lang: zh
version: "3.0.4"
date: "2026-03-13"
github: pugjs/pug
colWidth: 12
---

## 快速定位

> Pug 最初名为 Jade，因商标问题更名。语法几乎不变，2.x 后统一使用 `pug` 包名。

| 安装 | 命令 |
|------|------|
| 最新版 | `npm install pug` |
| 指定版本 | `npm install pug@3.0.4` |
| 最新稳定版 | `npm install pug@latest` |
| CLI | `npm install pug-cli -g` |
| CLI 帮助 | `pug --help` |

## 基础标签

Pug 用缩进表示嵌套关系，不需要闭合标签。

```pug
doctype html
html(lang="zh-CN")
  head
    meta(charset="UTF-8")
    title 页面标题
  body
    h1 你好世界
    p 段落文本
```

### 常用 Doctype 变体

```pug
doctype html          // HTML5
doctype xml           // XHTML
doctype transitional   // HTML 4.01 Transitional
doctype strict         // HTML 4.01 Strict
doctype frameset       // HTML 4.01 Frameset
```

## 属性

属性写在圆括号 `()` 内，多个属性用逗号或空格分隔。

```pug
a(href='https://example.com', class='btn', target='_blank') 链接

input(
  type='text'
  name='username'
  placeholder='请输入用户名'
  disabled
)

button(type='submit', class='primary') 提交
```

### ID 与 Class 简写

```pug
#header        // 生成 <div id="header">
.header        // 生成 <div class="header">
div#main.container   // 生成 <div id="main" class="container">
button#submit.btn.primary  // 生成 <button id="submit" class="btn primary">
```

## 文本与插值

```pug
// 行内插值
p 你好 #{name}！
p 当前计数：#{count}

// 属性插值
- var url = 'https://example.com'
a(href=url) 访问

// 纯文本行（前面加 |）
p
  | 第一行文本
  | 第二行文本

// 带格式文本块（前面加 .）
.article
  .content.
    这里的所有文本
    都会作为纯文本保留格式
```

## 注释

```pug
// 单行注释，输出到 HTML
//- 不输出的注释，不出现在编译结果中

// 块注释
//
  多行注释
  这些内容不会出现在 HTML 中

// 条件注释
<!--[if IE]>
<p>IE 专属内容</p>
<![endif]-->
```

## 内联代码

```pug
// 使用反单引号 `` 在标签后直接添加文本
p.
  这是内联代码块的第一行
  这是第二行

// 反单引号和点结合使用
span.
  内联文本内容
```

## 输出模式：Buffer vs 无缓冲

```pug
// = 表示输出，带转义
p= '你好 <b>世界</b>'   // 输出：&lt;b&gt;世界&lt;/b&gt;

// - 表示执行，不输出
- var html = '<b>粗体</b>'
p= html                    // 输出：<b>粗体</b>

// 不带 = 的文本
p 你好                    // 原样输出
p= '你好'                 // 同上，带转义

// 转义 vs 不转义
p!= '<b>粗体</b>'        // 不转义，输出 <b>粗体</b>
p= '<b>粗体</b>'         // 转义，输出 &lt;b&gt;粗体&lt;/b&gt;
```

## 循环

```pug
// each 循环
ul
  each item, index in ['苹果', '香蕉', '橙子']
    li #{index + 1}. #{item}

// 对象循环
ul
  each value, key in {name: '张三', age: 25, city: '北京'}
    li #{key}: #{value}

// for 循环
- for (var i = 0; i < 3; i++)
  p 第 #{i + 1} 项

// while 循环
- var n = 0
ul
  while n < 3
    li= n++
```

## 条件

```pug
// if/else
if user
  p 欢迎，#{user.name}
else
  p 请登录

// unless（相当于 if not）
unless isGuest
  p 会员专属内容

// case
case role
  when 'admin'
    p 管理员面板
  when 'user'
    p 用户面板
  default
    p 欢迎访问
```

## Mixin

Mixin 用于代码复用，类似函数。

```pug
// 定义
mixin list(items)
  ul
    each item in items
      li= item

// 使用
+list(['苹果', '香蕉'])

mixin article(title, date)
  article
    h2= title
    time(datetime=date)= date

+article('标题文本', '2026-05-18')

// 带参数默认值
mixin button(text, type='primary')
  button(class='btn-' + type)= text

+button('取消', 'secondary')
+button('确认')
```

### 传入块内容

```pug
mixin modal(title)
  .modal
    .modal-header
      h3= title
    .modal-body
      block

+modal('提示')
  p 这里是对话框的内容
```

## 模板继承

### block 与 extends

```pug
//- layout.pug（基础模板）
html
  head
    block title
      title 默认标题
  body
    block content
    block footer
      footer 默认页脚
```

```pug
//- index.pug（继承模板）
extends layout.pug

block title
  title 自定义标题

block content
  main
    h1 主页内容

block footer
  footer 自定义页脚
```

### include

将其他文件内容引入当前模板。

```pug
// 引入头部
include _header.pug

// 引入页脚（带路径）
include ../partials/_footer.pug

// 引入片段
include ./_card.pug
```

## &attributes

将对象展开为属性。

```pug
- var attrs = {class: 'btn', data-id: '123', disabled: true}
button&attributes(attrs) 点击

// 合并其他属性
button#main-btn.btn(data-action='submit')&attributes(attrs)
```

## 过滤器

过滤器在过滤器符号后缩进写内容，用于处理纯文本或特定语言。

```pug
// markdown 过滤器：渲染 markdown 为 HTML
:markdown
  # 标题
  - 列表项
  **粗体** 和 *斜体*

// plain 过滤器：原样输出，不解析 Pug 语法
:plain
  <div>这是纯文本，不会被解析为标签</div>
  #{name} 也会原样显示

// coffeescript 过滤器：编译 CoffeeScript
:coffee
  console.log 'Hello from CoffeeScript'
  squares = (x * x for x in [1..5])
```

### 自定义过滤器

```javascript
// 在 API 中注册自定义过滤器
pug.renderFile('template.pug', {
  filters: {
    myFilter: function(text, options) {
      // 处理 text 并返回 HTML
      return '<div class="custom">' + text + '</div>';
    }
  }
});
```

```pug
:myFilter
  自定义过滤器内容
```

## 调试方法

```pug
// 1. 查看编译后的函数源码
pug.compile('p #{name}', {debug: true});
// 输出包含函数源码和 AST

// 2. 使用 basedir 定位错误文件
pug.renderFile('template.pug', {
  basedir: '/path/to/templates',
  filename: 'template.pug'
});

// 3. 捕获编译错误
try {
  const html = pug.renderFile('template.pug', {data: 'value'});
} catch (err) {
  console.error(err.message);
  console.error(err.filename);  // 出错文件
  console.error(err.line);     // 出错行号
}

// 4. pretty 输出便于调试
pug.renderFile('template.pug', {
  pretty: true,
  debug: true
});

// 5. 输出 AST 查看结构
const lex = require('pug-lexer');
const tokens = lex('p Hello');
console.log(tokens);
```

## 常用 API

```javascript
const pug = require('pug');

// 渲染字符串
const html = pug.render('p 你好 #{name}', {name: '世界'});

// 渲染文件
pug.renderFile('template.pug', {data: 'value'}, (err, html) => {
  if (err) console.error(err);
  console.log(html);
});

// 编译模板函数
const fn = pug.compile('h1 #{title}');
console.log(fn({title: '标题'}));

// 编译文件
const compiled = pug.compileFile('template.pug');
console.log(compiled({name: '值'});
```

### 常用选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `pretty` | 输出格式化 HTML | `false` |
| `cache` | 缓存编译结果 | `false` |
| `basedir` | 模板基础目录 | `''` |
| `filename` | 报错时显示的文件名 | `undefined` |
| `debug` | 输出调试信息 | `false` |
| `globals` | 全局变量白名单 | `[]` |
| `self` | 使用 `self` 命名空间存储局部变量 | `false` |

```javascript
pug.renderFile('template.pug', {
  pretty: true,   // 格式化输出
  cache: true,    // 生产环境开启
  basedir: '/views',
  globals: ['gloablVar1']  // 允许未声明的全局变量
});
```

## CLI 常用命令

```bash
pug -P template.pug        # 格式化输出
pug -w template.pug        # 监听文件变化
pug -O data.json template.pug  # 从 JSON 加载数据
pug -o ./dist template.pug # 指定输出目录
pug --pretty template.pug  # 格式化输出
pug -V                     # 查看版本
```

## 易错点

```pug
// ❌ 常见错误：属性值不用引号包裹
a(href=https://example.com)  // 报错：应为 'https://example.com'

// ✅ 正确写法
a(href='https://example.com')

// ❌ 常见错误：混用 tab 和空格
doctype html
  head
→   title  // 缩进不一致会报错
    body

// ✅ 正确做法：保持一致的缩进风格（空格或 tab）

// ❌ 常见错误：变量未定义时插值显示 undefined
p 你好 #{undefinedVar}  // 显示 undefined

// ✅ 正确做法：确保变量已定义，或使用默认值
p 你好 #{user ? user.name : '游客'}

// ❌ 常见错误：= 和 != 混用导致 XSS
p!= userInput   // 可能存在 XSS 风险
p= userInput    // 安全，带转义

// ✅ 安全做法：确认来源后再决定是否转义

// ❌ 常见错误：include 路径错误
include _header.pug         // 可能找不到
include /partials/_header.pug  // 路径错误

// ✅ 正确做法：使用相对路径，基于 basedir 或当前文件位置

// ❌ 常见错误：block 和 include 混用
extends layout.pug
include _header.pug  // 在 extends 后不应再 include

// ✅ 正确做法：extends 只用于继承，include 用于引入片段
```

## 速查卡

| 语法 | 说明 |
|------|------|
| `#id` | ID 简写 |
| `.class` | Class 简写 |
| `(attr='val')` | 属性 |
| `#{var}` | 变量插值 |
| `= expr` | Buffer 输出（转义） |
| `!= expr` | 不转义输出 |
| `- code` | 执行代码，不输出 |
| `//` | HTML 注释 |
| `//-` | 不输出的注释 |
| `each val, key in obj` | 循环 |
| `for i in range` | for 循环 |
| `while cond` | while 循环 |
| `if/else` | 条件 |
| `unless` | 条件（非） |
| `case/when` | 多条件分支 |
| `mixin` | 代码复用 |
| `+mixin()` | 调用 mixin |
| `include` | 引入文件 |
| `extends` | 继承模板 |
| `block` | 模板块 |
| `&attributes(obj)` | 属性展开 |
| `:filter` | 过滤器 |
| `.` | 文本块 |
| `|` | 纯文本行 |