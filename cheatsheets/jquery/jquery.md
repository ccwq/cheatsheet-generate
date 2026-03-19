---
title: jQuery
lang: javascript
version: "4.0.0"
date: "2026-01-17"
github: jquery/jquery
colWidth: 380px
---

# jQuery

## 🎯 选择器基础
---
lang: javascript
emoji: 🎯
link: https://api.jquery.com/category/selectors/
desc: jQuery 选择器是整个库的核心，掌握基本选择器、层级选择器、过滤选择器是高效操作 DOM 的前提。
---

### 基本选择器

- `$("*")` : 选择所有元素
- `$("tag")` : 标签选择器，如 `$("div")`
- `$(".class")` : 类选择器
- `$("#id")` : ID 选择器
- `$("selector1, selector2")` : 多选择器

```javascript
// 选择所有段落
$("p").css("color", "red");

// 选择多个元素
$("h1, h2, h3").addClass("header");

// 组合选择器
$("div.container p.active")
```

### 层级选择器

- `$("parent child")` : 后代选择器
- `$("parent > child")` : 子选择器
- `$("prev + next")` : 相邻兄弟选择器
- `$("prev ~ siblings")` : 后续兄弟选择器

```javascript
// 后代选择器：所有后代
$("div p");

// 子选择器：直接子元素
$("ul > li");

// 相邻兄弟
$("h1 + p");

// 后续所有兄弟
$("h1 ~ p");
```

### 过滤选择器

- `:first` / `:last` : 第一个 / 最后一个
- `:even` / `:odd` : 偶数 / 奇数（从 0 开始）
- `:eq(n)` : 索引为 n 的元素
- `:gt(n)` / `:lt(n)` : 大于 / 小于索引 n
- `:not(selector)` : 排除匹配元素
- `:contains(text)` : 包含指定文本
- `:has(selector)` : 包含匹配元素的元素
- `:empty` / `:parent` : 无子元素 / 有子元素

```javascript
// 第一个段落
$("p:first");

// 偶数索引的列表项
$("li:even");

// 索引为 2
$("li:eq(2)");

// 不包含 active 类的
$("div:not(.active)");

// 包含 "hello" 的段落
$("p:contains('hello')");
```

### 属性选择器

- `$("[attr]")` : 有指定属性
- `$("[attr='value']")` : 属性等于值
- `$("[attr!='value']") : 属性不等于值
- `$("[attr^='value']")` : 属性以值开头
- `$("[attr$='value']")` : 属性以值结尾
- `$("[attr*='value']")` : 属性包含值

```javascript
// 有 title 属性的链接
$("a[title]");

// href 以 https 开头
$("a[href^='https']");

// src 以 .png 结尾的图片
$("img[src$='.png']");

// class 包含 btn
$("[class*='btn']");
```

## 🎨 DOM 操作
---
lang: javascript
emoji: 🎨
link: https://api.jquery.com/category/manipulation/
desc: DOM 操作是 jQuery 最常用的功能，包括创建、插入、删除、复制元素，以及属性、样式、内容的读写。
---

### 创建与插入

- `$("<div>")` : 创建元素
- `.append(content)` : 内部末尾插入
- `.prepend(content)` : 内部开头插入
- `.after(content)` : 外部后面插入
- `.before(content)` : 外部前面插入
- `.appendTo(target)` : 插入到目标内部末尾
- `.prependTo(target)` : 插入到目标内部开头
- `.insertAfter(target)` : 插入到目标后面
- `.insertBefore(target)` : 插入到目标前面

```javascript
// 创建元素
const $div = $("<div class='box'>新元素</div>");

// 内部插入
$("#container").append($div);
$("#container").prepend("<p>开头</p>");

// 外部插入
$("#target").after("<div>后面</div>");
$("#target").before("<div>前面</div>");

// 移动元素
$("#moveMe").appendTo("#container");
```

### 删除与清空

- `.remove()` : 删除元素（保留事件绑定）
- `.empty()` : 清空子元素
- `.detach()` : 删除元素（保留数据和事件）
- `.unwrap()` : 移除父元素

```javascript
// 删除元素
$("#element").remove();

// 条件删除
$("p").remove(".test");

// 清空内容
$("#container").empty();

// 移除并保留数据
const $elem = $("#widget").detach();
// ... 后续可以重新插入
$("#newParent").append($elem);
```

### 克隆

- `.clone()` : 浅克隆（不含事件）
- `.clone(true)` : 深克隆（包含事件和数据）

```javascript
// 克隆元素
const $clone = $("#template").clone();

// 深克隆（包含事件）
const $deepClone = $("#widget").clone(true);

// 插入克隆
$("#container").append($clone);
```

### 属性操作

- `.attr(name)` : 获取属性
- `.attr(name, value)` : 设置属性
- `.attr({name: value})` : 批量设置
- `.removeAttr(name)` : 移除属性
- `.prop(name)` : 获取属性（布尔属性）
- `.prop(name, value)` : 设置属性
- `.val()` : 获取表单值
- `.val(value)` : 设置表单值

```javascript
// 获取属性
const href = $("a").attr("href");
const checked = $("#checkbox").prop("checked");

// 设置属性
$("img").attr("src", "image.png");
$("a").attr({
  href: "https://example.com",
  target: "_blank"
});

// 移除属性
$("div").removeAttr("title");

// 表单值
const text = $("input[name='username']").val();
$("input[name='username']").val("新值");
```

### 类名操作

- `.addClass(name)` : 添加类名
- `.removeClass(name)` : 移除类名
- `.toggleClass(name)` : 切换类名
- `.hasClass(name)` : 是否有类名

```javascript
// 添加类名
$("div").addClass("active");
$("div").addClass("box highlight");

// 移除类名
$("div").removeClass("active");

// 切换类名
$("button").toggleClass("selected");

// 条件切换
$("div").toggleClass("active", isActive);

// 检查类名
if ($("#box").hasClass("active")) {
  console.log("已激活");
}
```

### 内容操作

- `.html()` : 获取 HTML 内容
- `.html(content)` : 设置 HTML 内容
- `.text()` : 获取文本内容
- `.text(content)` : 设置文本内容

```javascript
// 获取内容
const html = $("#container").html();
const text = $("#container").text();

// 设置内容
$("#container").html("<p>新的 <strong>HTML</strong></p>");
$("#container").text("纯文本内容");

// 安全设置（防 XSS）
$("#output").text(userInput);
```

## 📡 事件处理
---
lang: javascript
emoji: 📡
link: https://api.jquery.com/category/events/
desc: jQuery 提供了统一的事件 API，简化了跨浏览器的事件绑定、解绑和触发，支持事件委托和自定义事件。
---

### 绑定事件

- `.on(event, handler)` : 绑定事件
- `.on(event, selector, handler)` : 事件委托
- `.on(event, data, handler)` : 绑定事件并传递数据
- `.one(event, handler)` : 绑定一次性事件

```javascript
// 基本绑定
$("#button").on("click", function(e) {
  console.log("点击了");
});

// 多个事件
$("#input").on("focus blur", function() {
  $(this).toggleClass("focused");
});

// 事件委托
$("#list").on("click", "li", function() {
  console.log($(this).text());
});

// 传递数据
$("#button").on("click", { name: "jQuery" }, function(e) {
  console.log(e.data.name);
});

// 一次性事件
$("#alert").one("click", function() {
  alert("只触发一次");
});
```

### 解绑事件

- `.off(event)` : 解绑事件
- `.off(event, handler)` : 解绑特定处理函数
- `.off()` : 解绑所有事件

```javascript
// 解绑特定事件
$("#button").off("click");

// 解绑特定处理函数
const handler = function() { console.log("click"); };
$("#button").on("click", handler);
$("#button").off("click", handler);

// 解绑所有事件
$("#element").off();
```

### 触发事件

- `.trigger(event)` : 触发事件
- `.triggerHandler(event)` : 触发事件（不执行默认行为）

```javascript
// 触发事件
$("#button").trigger("click");

// 触发事件并传参
$("#input").trigger("customEvent", ["参数1", "参数2"]);

// 只触发处理函数，不执行默认行为
$("#form").triggerHandler("submit");
```

### 快捷方法

- `.click(handler)` : 点击事件
- `.dblclick(handler)` : 双击事件
- `.hover(enter, leave)` : 悬停事件
- `.focus(handler)` : 获得焦点
- `.blur(handler)` : 失去焦点
- `.change(handler)` : 值改变
- `.submit(handler)` : 表单提交
- `.keydown(handler)` : 键盘按下
- `.keyup(handler)` : 键盘抬起
- `.mousedown(handler)` : 鼠标按下
- `.mouseup(handler)` : 鼠标抬起
- `.mousemove(handler)` : 鼠标移动
- `.mouseenter(handler)` : 鼠标进入（不冒泡）
- `.mouseleave(handler)` : 鼠标离开（不冒泡）
- `.mouseover(handler)` : 鼠标悬停（冒泡）
- `.mouseout(handler)` : 鼠标离开（冒泡）

```javascript
// 点击事件
$("#button").click(function() {
  alert("点击了");
});

// 悬停事件
$("#box").hover(
  function() {
    $(this).addClass("hover");
  },
  function() {
    $(this).removeClass("hover");
  }
);

// 表单提交
$("#form").submit(function(e) {
  e.preventDefault();
  console.log("提交表单");
});

// 键盘事件
$("#input").keydown(function(e) {
  if (e.which === 13) {
    console.log("回车键");
  }
});
```

### 事件对象

- `e.preventDefault()` : 阻止默认行为
- `e.stopPropagation()` : 阻止冒泡
- `e.stopImmediatePropagation()` : 阻止后续处理
- `e.target` : 触发事件的元素
- `e.currentTarget` : 当前处理元素
- `e.delegateTarget` : 委托元素
- `e.which` : 键码 / 鼠标键
- `e.pageX` / `e.pageY` : 鼠标页面坐标
- `e.type` : 事件类型

```javascript
$("#link").click(function(e) {
  // 阻止默认行为
  e.preventDefault();
  
  // 阻止冒泡
  e.stopPropagation();
  
  // 获取信息
  console.log("事件类型:", e.type);
  console.log("触发元素:", e.target);
  console.log("当前元素:", e.currentTarget);
  console.log("鼠标位置:", e.pageX, e.pageY);
});
```

## ✨ 动画效果
---
lang: javascript
emoji: ✨
link: https://api.jquery.com/category/effects/
desc: jQuery 内置了常用的动画效果，也支持自定义动画，通过链式调用可以创建复杂的动画序列。
---

### 显示与隐藏

- `.show()` : 显示元素
- `.hide()` : 隐藏元素
- `.toggle()` : 切换显示/隐藏
- `.show(duration)` : 带动画显示
- `.hide(duration)` : 带动画隐藏
- `.toggle(duration)` : 带动画切换

```javascript
// 立即显示/隐藏
$("#box").show();
$("#box").hide();
$("#box").toggle();

// 带动画
$("#box").show(1000);  // 1秒
$("#box").hide("slow");  // slow/normal/fast
$("#box").toggle(400, function() {
  console.log("动画完成");
});
```

### 淡入淡出

- `.fadeIn()` : 淡入
- `.fadeOut()` : 淡出
- `.fadeToggle()` : 切换淡入/淡出
- `.fadeTo(duration, opacity)` : 淡到指定透明度

```javascript
// 淡入
$("#box").fadeIn();
$("#box").fadeIn(1000);

// 淡出
$("#box").fadeOut("slow");

// 切换
$("#box").fadeToggle(400);

// 淡到 0.5 透明度
$("#box").fadeTo(1000, 0.5);
```

### 滑动

- `.slideDown()` : 向下滑动显示
- `.slideUp()` : 向上滑动隐藏
- `.slideToggle()` : 切换滑动

```javascript
// 向下滑动显示
$("#menu").slideDown();

// 向上滑动隐藏
$("#menu").slideUp("fast");

// 切换
$("#menu").slideToggle(300, function() {
  console.log("滑动完成");
});
```

### 自定义动画

- `.animate(properties)` : 自定义动画
- `.animate(properties, duration)` : 指定时长
- `.animate(properties, options)` : 详细配置

```javascript
// 基本动画
$("#box").animate({
  left: "250px",
  opacity: 0.5,
  height: "150px"
}, 1000);

// 使用相对值
$("#box").animate({
  left: "+=50px",
  opacity: "-=0.2"
});

// 完整配置
$("#box").animate({
  width: "300px"
}, {
  duration: 1000,
  easing: "swing",  // swing/linear
  complete: function() {
    console.log("完成");
  },
  step: function(now) {
    console.log("当前值:", now);
  }
});
```

### 动画控制

- `.stop()` : 停止当前动画
- `.stop(true)` : 清除队列
- `.stop(true, true)` : 清除队列并跳到结尾
- `.finish()` : 完成所有队列动画
- `.delay(duration)` : 延迟执行

```javascript
// 停止动画
$("#box").stop();

// 停止并清除队列
$("#box").stop(true);

// 停止、清除队列、跳到结尾
$("#box").stop(true, true);

// 完成所有动画
$("#box").finish();

// 延迟
$("#box")
  .fadeOut(500)
  .delay(1000)
  .fadeIn(500);
```

## 🌐 AJAX 请求
---
lang: javascript
emoji: 🌐
link: https://api.jquery.com/category/ajax/
desc: jQuery 的 AJAX 方法简化了异步请求，支持 Promise 风格的链式调用，提供了丰富的配置选项和全局事件。
---

### 核心方法

- `$.ajax(options)` : 底层 AJAX 方法
- `$.get(url, data, success)` : GET 请求
- `$.post(url, data, success)` : POST 请求
- `$.getJSON(url, data, success)` : 获取 JSON
- `$.getScript(url, success)` : 加载脚本
- `$(selector).load(url, data, complete)` : 加载 HTML

```javascript
// $.ajax 完整配置
$.ajax({
  url: "/api/data",
  method: "POST",
  data: { name: "jQuery", version: "4.0" },
  dataType: "json",
  timeout: 5000,
  beforeSend: function(xhr) {
    console.log("发送前");
  },
  success: function(data, status, xhr) {
    console.log("成功:", data);
  },
  error: function(xhr, status, error) {
    console.error("错误:", error);
  },
  complete: function(xhr, status) {
    console.log("完成");
  }
});

// Promise 风格
$.ajax({ url: "/api/data" })
  .done(function(data) {
    console.log("成功:", data);
  })
  .fail(function(xhr, status, error) {
    console.error("失败:", error);
  })
  .always(function() {
    console.log("总是执行");
  });
```

### 快捷方法

```javascript
// GET 请求
$.get("/api/data", function(data) {
  console.log(data);
});

// POST 请求
$.post("/api/data", { name: "test" }, function(data) {
  console.log(data);
});

// 获取 JSON
$.getJSON("/api/data.json", function(data) {
  console.log(data);
});

// 加载 HTML
$("#container").load("/page.html #content");
```

### 配置选项

- `url` : 请求地址
- `method` / `type` : 请求方法（GET/POST/PUT/DELETE）
- `data` : 发送的数据（对象或字符串）
- `dataType` : 预期响应类型（json/xml/html/script/jsonp/text）
- `contentType` : 发送数据的类型
- `headers` : 自定义请求头
- `timeout` : 超时时间（毫秒）
- `async` : 是否异步（默认 true）
- `cache` : 是否缓存（默认 true）
- `processData` : 是否处理数据（默认 true）
- `traditional` : 是否传统序列化（默认 false）

```javascript
$.ajax({
  url: "/api/data",
  method: "POST",
  data: JSON.stringify({ id: 1 }),
  contentType: "application/json",
  dataType: "json",
  headers: {
    "Authorization": "Bearer token123"
  },
  timeout: 10000,
  cache: false
});
```

### 全局事件

- `$(document).ajaxStart(handler)` : 请求开始
- `$(document).ajaxStop(handler)` : 请求结束
- `$(document).ajaxSuccess(handler)` : 请求成功
- `$(document).ajaxError(handler)` : 请求失败
- `$(document).ajaxComplete(handler)` : 请求完成
- `$(document).ajaxSend(handler)` : 请求发送前

```javascript
// 全局加载提示
$(document).ajaxStart(function() {
  $("#loading").show();
});

$(document).ajaxStop(function() {
  $("#loading").hide();
});

// 全局错误处理
$(document).ajaxError(function(e, xhr, settings, error) {
  console.error("请求失败:", settings.url, error);
});
```

### 序列化

- `.serialize()` : 序列化为查询字符串
- `.serializeArray()` : 序列化为数组
- `$.param(object)` : 对象序列化

```javascript
// 序列化表单
const data = $("form").serialize();
// name=John&age=30

// 序列化为数组
const arr = $("form").serializeArray();
// [{ name: "name", value: "John" }, { name: "age", value: "30" }]

// 对象序列化
const str = $.param({ a: 1, b: 2 });
// a=1&b=2
```

## 🛠️ 工具函数
---
lang: javascript
emoji: 🛠️
link: https://api.jquery.com/category/utilities/
desc: jQuery 提供了丰富的工具函数，用于类型检测、对象操作、数组处理和字符串处理，简化了常见的编程任务。
---

### 类型检测

- `$.type(value)` : 获取类型（jQuery 4 已移除，用原生 typeof）
- `$.isArray(obj)` : 是否数组（jQuery 4 已移除，用 Array.isArray）
- `$.isFunction(obj)` : 是否函数
- `$.isNumeric(value)` : 是否数字
- `$.isEmptyObject(obj)` : 是否空对象
- `$.isPlainObject(obj)` : 是否纯对象
- `$.isWindow(obj)` : 是否 window
- `$.contains(container, contained)` : 是否包含

```javascript
// jQuery 4 推荐：使用原生方法
Array.isArray([1, 2, 3]);  // true
typeof function() {} === "function";  // true
typeof 123 === "number";  // true

// jQuery 仍支持的方法
$.isEmptyObject({});  // true
$.isPlainObject({ a: 1 });  // true
$.contains(document, document.body);  // true
```

### 对象操作

- `$.extend(target, source)` : 合并对象
- `$.extend(true, target, source)` : 深拷贝合并
- `$.each(object, callback)` : 遍历对象

```javascript
// 浅拷贝合并
const obj = $.extend({}, { a: 1 }, { b: 2 });
// { a: 1, b: 2 }

// 深拷贝合并
const deep = $.extend(true, {}, {
  a: { b: 1 }
}, {
  a: { c: 2 }
});
// { a: { b: 1, c: 2 } }

// 遍历对象
$.each({ a: 1, b: 2 }, function(key, value) {
  console.log(key + ": " + value);
});
```

### 数组处理

- `$.each(array, callback)` : 遍历数组
- `$.map(array, callback)` : 映射数组
- `$.grep(array, callback)` : 过滤数组
- `$.inArray(value, array)` : 查找索引
- `$.merge(array1, array2)` : 合并数组
- `$.unique(array)` : 去重（仅 DOM 元素）
- `$.makeArray(obj)` : 转数组

```javascript
// 遍历数组
$.each([1, 2, 3], function(index, value) {
  console.log(index + ": " + value);
});

// 映射数组
const doubled = $.map([1, 2, 3], function(val, i) {
  return val * 2;
});
// [2, 4, 6]

// 过滤数组
const filtered = $.grep([1, 2, 3, 4, 5], function(val, i) {
  return val > 2;
});
// [3, 4, 5]

// 查找索引
const index = $.inArray(3, [1, 2, 3, 4]);
// 2

// 合并数组
const merged = $.merge([1, 2], [3, 4]);
// [1, 2, 3, 4]

// 转数组
const arr = $.makeArray(document.getElementsByTagName("div"));
```

### 字符串处理

- `$.trim(str)` : 去除首尾空白（jQuery 4 已移除，用原生 trim）
- `$.parseJSON(json)` : 解析 JSON（jQuery 4 已移除，用 JSON.parse）
- `$.parseHTML(html)` : 解析 HTML
- `$.parseXML(xml)` : 解析 XML

```javascript
// jQuery 4 推荐：使用原生方法
"  hello  ".trim();  // "hello"
JSON.parse('{"a":1}');  // { a: 1 }

// jQuery 方法
const $elems = $.parseHTML("<div>HTML</div>");
const xmlDoc = $.parseXML("<root><item/></root>");
```

### 其他工具

- `$.proxy(fn, context)` : 绑定上下文
- `$.noop` : 空函数
- `$.now()` : 当前时间戳（jQuery 4 已移除，用 Date.now）
- `$.holdReady(hold)` : 暂停 ready 事件

```javascript
// 绑定上下文
const obj = { name: "jQuery" };
const fn = $.proxy(function() {
  console.log(this.name);
}, obj);

// 空函数（作为默认回调）
function callback(fn) {
  (fn || $.noop)();
}

// jQuery 4 推荐：使用原生方法
Date.now();  // 当前时间戳
```

## 🔗 链式调用与遍历
---
lang: javascript
emoji: 🔗
link: https://api.jquery.com/category/traversing/
desc: jQuery 的链式调用和强大的遍历方法让 DOM 操作更简洁，可以快速定位和过滤元素集合。
---

### 链式调用

```javascript
// 链式调用示例
$("#box")
  .addClass("active")
  .css("color", "red")
  .fadeIn(500)
  .delay(1000)
  .fadeOut(500);
```

### 过滤方法

- `.eq(index)` : 选择指定索引
- `.first()` : 第一个元素
- `.last()` : 最后一个元素
- `.filter(selector)` : 过滤匹配元素
- `.not(selector)` : 排除匹配元素
- `.slice(start, end)` : 切片
- `.has(selector)` : 包含匹配元素
- `.is(selector)` : 是否匹配

```javascript
// 选择索引为 2
$("li").eq(2);

// 第一个和最后一个
$("li").first();
$("li").last();

// 过滤
$("li").filter(".active");
$("li").not(".disabled");

// 切片（索引 1 到 3）
$("li").slice(1, 4);

// 包含子元素
$("div").has("p");

// 是否匹配
if ($("div").is(".active")) {
  console.log("已激活");
}
```

### 查找方法

- `.find(selector)` : 查找后代
- `.children(selector)` : 查找子元素
- `.parent(selector)` : 查找父元素
- `.parents(selector)` : 查找所有祖先
- `.parentsUntil(selector)` : 查找祖先直到
- `.closest(selector)` : 查找最近的匹配祖先
- `.next(selector)` : 下一个兄弟
- `.nextAll(selector)` : 后续所有兄弟
- `.nextUntil(selector)` : 后续兄弟直到
- `.prev(selector)` : 上一个兄弟
- `.prevAll(selector)` : 之前所有兄弟
- `.prevUntil(selector)` : 之前兄弟直到
- `.siblings(selector)` : 所有兄弟

```javascript
// 查找后代
$("#container").find("p");

// 子元素
$("#list").children(".item");

// 父元素
$("#item").parent();
$("#item").parents(".container");

// 最近的匹配祖先
$("#item").closest(".wrapper");

// 兄弟元素
$("#item").next();
$("#item").nextAll();
$("#item").prev();
$("#item").siblings();
```

### 遍历方法

- `.each(callback)` : 遍历元素
- `.map(callback)` : 映射元素
- `.get()` : 转为 DOM 数组
- `.get(index)` : 获取指定 DOM 元素
- `.index()` : 获取索引

```javascript
// 遍历元素
$("li").each(function(index, elem) {
  console.log(index + ": " + $(this).text());
});

// 映射元素
const texts = $("li").map(function() {
  return $(this).text();
}).get();

// 转为 DOM 数组
const domArray = $("div").get();

// 获取指定 DOM 元素
const firstDiv = $("div").get(0);

// 获取索引
const index = $("#item").index();
```

### 其他方法

- `.add(selector)` : 添加元素到集合
- `.addBack()` : 添加之前的集合
- `.contents()` : 获取所有子节点（包括文本节点）
- `.end()` : 结束当前链，返回上一个集合

```javascript
// 添加元素到集合
$("div").add("p").css("color", "red");

// 添加之前的集合
$("div").find("p").addBack().addClass("container");

// 结束链
$("div")
  .find("p")
    .addClass("para")
    .end()
  .addClass("container");
```
