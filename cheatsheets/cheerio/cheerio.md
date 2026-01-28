# Cheerio 核心功能

## 加载 HTML

```js
var cheerio = require("cheerio"),
  $ = cheerio.load('<ul id="fruits">...</ul>');
```

其他加载方式：
```js
// 传递字符串加载
$ = require("cheerio");
$("ul", '<ul id="fruits">...</ul>');

// 作为根
$( "li", "ul", '<ul id="fruits">...</ul>');

// 配置选项
$ = cheerio.load('<ul id="fruits">...</ul>', {
  normalizeWhitespace: true,
  xmlMode: true,
});
```

默认选项：normalizeWhitespace: false, xmlMode: false, decodeEntities: true

## 选择器

`$( selector, [context], [root] )`

```js
$(".apple", "#fruits").text();
//=> Apple

$("ul .pear").attr("class");
//=> pear

$("li[class=orange]").html();
//=> Orange
```

## 属性

```js
// .attr(name, value)
$("ul").attr("id");
//=> fruits

$(".apple").attr("id", "favorite").html();
//=> <li class="apple" id="favorite">Apple</li>
```

```js
// .prop(name, value)
$('input[type="checkbox"]').prop("checked");
//=> false

$('input[type="checkbox"]').prop("checked", true).val();
//=> ok
```

```js
// .data(name, value)
$('<div data-apple-color="red"></div>').data();
//=> { appleColor: 'red' }

$('<div data-apple-color="red"></div>').data("apple-color");
//=> 'red'

var apple = $(".apple").data("kind", "mac");
apple.data("kind");
//=> 'mac'
```

```js
// .val([value])
$('input[type="text"]').val();
//=> input_text

$('input[type="text"]').val("test").html();
//=> <input type="text" value="test"/>

// .removeAttr(name)
$(".pear").removeAttr("class").html();
//=> <li>Pear</li>
```

## 类

```js
// .hasClass(className)
$(".pear").hasClass("pear");
//=> true

$("apple").hasClass("fruit");
//=> false
```

```js
// .addClass(className)
$(".pear").addClass("fruit").html();
//=> <li class="pear fruit">Pear</li>

$(".apple").addClass("fruit red").html();
//=> <li class="apple fruit red">Apple</li>
```

```js
// .removeClass([className])
$(".pear").removeClass("pear").html();
//=> <li class="">Pear</li>

$(".apple").addClass("red").removeClass().html();
//=> <li class="">Apple</li>
```

```js
// .toggleClass(className, [switch])
$(".apple.green").toggleClass("fruit green red").html();
//=> <li class="apple fruit red">Apple</li>

$(".apple.green").toggleClass("fruit green red", true).html();
//=> <li class="apple green fruit red">Apple</li>
```

```js
// .is(selector)
// .is(element)
// .is(selection)
// .is(function(index))
```

## 表单

```js
// .serializeArray()
$('<form><input name="foo" value="bar" /></form>').serializeArray();
//=> [ { name: 'foo', value: 'bar' } ]
```

## 遍历

```js
// .find(selector)
// .find(selection)
// .find(node)
$("#fruits").find("li").length;
//=> 3
$("#fruits").find($(".apple")).length;
//=> 1
```

```js
// .parent([selector])
$(".pear").parent().attr("id");
//=> fruits
```

```js
// .parents([selector])
$(".orange").parents().length;
// => 2
$(".orange").parents("#fruits").length;
// => 1
```

```js
// .parentsUntil([selector][,filter])
$(".orange").parentsUntil("#food").length;
// => 1
```

```js
// .closest(selector)
$(".orange").closest();
// => []
$(".orange").closest(".apple");
// => []
$(".orange").closest("li");
// => [<li class="orange">Orange</li>]
$(".orange").closest("#fruits");
// => [<ul id="fruits"> ... </ul>]
```

```js
// .next([selector])
$(".apple").next().hasClass("orange");
//=> true
```

```js
// .nextAll([selector])
$(".apple").nextAll();
//=> [<li class="orange">Orange</li>, <li class="pear">Pear</li>]
$(".apple").nextAll(".orange");
//=> [<li class="orange">Orange</li>]
```

```js
// .nextUntil([selector], [filter])
$(".apple").nextUntil(".pear");
//=> [<li class="orange">Orange</li>]
```

```js
// .prev([selector])
$(".orange").prev().hasClass("apple");
//=> true
```

```js
// .prevAll([selector])
$(".pear").prevAll();
//=> [<li class="orange">Orange</li>, <li class="apple">Apple</li>]
$(".pear").prevAll(".orange");
//=> [<li class="orange">Orange</li>]
```

```js
// .prevUntil([selector], [filter])
$(".pear").prevUntil(".apple");
//=> [<li class="orange">Orange</li>]
```

```js
// .slice(start, [end])
$("li").slice(1).eq(0).text();
//=> 'Orange'

$("li").slice(1, 2).length;
//=> 1
```

```js
// .siblings([selector])
$(".pear").siblings().length;
//=> 2

$(".pear").siblings(".orange").length;
//=> 1
```

```js
// .children([selector])
$("#fruits").children().length;
//=> 3

$("#fruits").children(".pear").text();
//=> Pear
```

```js
// .contents()
$("#fruits").contents().length;
//=> 3
```

```js
// .each(function(index, element))
var fruits = [];

$("li").each(function (i, elem) {
  fruits[i] = $(this).text();
});

fruits.join(", ");
//=> Apple, Orange, Pear
```

```js
// .map(function(index, element))
$("li")
  .map(function (i, el) {
    return $(this).text();
  })
  .get()
  .join(" ");
//=> "apple orange pear"
```

```js
// .filter(selector)
// .filter(selection)
// .filter(element)
// .filter(function(index))
// 选择器
$("li").filter(".orange").attr("class");
//=> orange

// 函数
$("li")
  .filter(function (i, el) {
    return $(this).attr("class") === "orange";
  })
  .attr("class");
//=> orange
```

```js
// .not(selector)
// .not(selection)
// .not(element)
// .not(function(index, elem))
// 选择器
$("li").not(".apple").length;
//=> 2

// 函数
$("li").not(function (i, el) {
  return $(this).attr("class") === "orange";
}).length;
//=> 2
```

```js
// .has(selector)
// .has(element)
// 选择器
$("ul").has(".pear").attr("id");
//=> fruits

// 元素
$("ul").has($(".pear")[0]).attr("id");
//=> fruits
```

```js
// .first()
$("#fruits").children().first().text();
//=> Apple
```

```js
// .last()
$("#fruits").children().last().text();
//=> Pear
```

```js
// .eq(i)
$("li").eq(0).text();
//=> Apple

$("li").eq(-1).text();
//=> Pear
```

```js
// .get([i])
$("li").get(0).tagName;
//=> li

$("li").get().length;
//=> 3
```

```js
// .index()
// .index(selector)
// .index(nodeOrSelection)
$(".pear").index();
//=> 2
$(".orange").index("li");
//=> 1
$(".apple").index($("#fruit, li"));
//=> 1
```

```js
// .end()
$("li").eq(0).end().length;
//=> 3
```

```js
// .add(selector [, context])
// .add(element)
// .add(elements)
// .add(html)
// .add(selection)
$(".apple").add(".orange").length;
//=> 2
```

```js
// .addBack([filter])
$("li").eq(0).addBack(".orange").length;
//=> 2
```

## 操作

```js
// .append(content, [content, ...])
$("ul").append('<li class="plum">Plum</li>');
$.html();
//=>  <ul id="fruits">
//      <li class="apple">Apple</li>
//      <li class="orange">Orange</li>
//      <li class="pear">Pear</li>
//      <li class="plum">Plum</li>
//    </ul>
```

```js
// .appendTo(target)
$('<li class="plum">Plum</li>').appendTo("#fruits");
$.html();
//=>  <ul id="fruits">
//      <li class="apple">Apple</li>
//      <li class="orange">Orange</li>
//      <li class="pear">Pear</li>
//      <li class="plum">Plum</li>
//    </ul>
```

```js
// .prepend(content, [content, ...])
$("ul").prepend('<li class="plum">Plum</li>');
$.html();
//=>  <ul id="fruits">
//      <li class="plum">Plum</li>
//      <li class="apple">Apple</li>
//      <li class="orange">Orange</li>
//      <li class="pear">Pear</li>
//    </ul>
```

```js
// .prependTo(target)
$('<li class="plum">Plum</li>').prependTo("#fruits");
$.html();
//=>  <ul id="fruits">
//      <li class="plum">Plum</li>
//      <li class="apple">Apple</li>
//      <li class="orange">Orange</li>
//      <li class="pear">Pear</li>
//    </ul>
```

```js
// .after(content, [content, ...])
$(".apple").after('<li class="plum">Plum</li>');
$.html();
//=>  <ul id="fruits">
//      <li class="apple">Apple</li>
//      <li class="plum">Plum</li>
//      <li class="orange">Orange</li>
//      <li class="pear">Pear</li>
//    </ul>
```

```js
// .insertAfter(target)
$('<li class="plum">Plum</li>').insertAfter(".apple");
$.html();
//=>  <ul id="fruits">
//      <li class="apple">Apple</li>
//      <li class="plum">Plum</li>
//      <li class="orange">Orange</li>
//      <li class="pear">Pear</li>
//    </ul>
```

```js
// .before(content, [content, ...])
$(".apple").before('<li class="plum">Plum</li>');
$.html();
//=>  <ul id="fruits">
//      <li class="plum">Plum</li>
//      <li class="apple">Apple</li>
//      <li class="orange">Orange</li>
//      <li class="pear">Pear</li>
//    </ul>
```

```js
// .insertBefore(target)
$('<li class="plum">Plum</li>').insertBefore(".apple");
$.html();
//=>  <ul id="fruits">
//      <li class="plum">Plum</li>
//      <li class="apple">Apple</li>
//      <li class="orange">Orange</li>
//      <li class="pear">Pear</li>
//    </ul>
```

```js
// .remove([selector])
$(".pear").remove();
$.html();
//=>  <ul id="fruits">
//      <li class="apple">Apple</li>
//      <li class="orange">Orange</li>
//    </ul>
```

```js
// .replaceWith(content)
var plum = $('<li class="plum">Plum</li>');
$(".pear").replaceWith(plum);
$.html();
//=> <ul id="fruits">
//     <li class="apple">Apple</li>
//     <li class="orange">Orange</li>
//     <li class="plum">Plum</li>
//   </ul>
```

```js
// .empty()
$("ul").empty();
$.html();
//=>  <ul id="fruits"></ul>
```

```js
// .html([htmlString])
$(".orange").html();
//=> Orange

$("#fruits").html('<li class="mango">Mango</li>').html();
//=> <li class="mango">Mango</li>
```

```js
// .text([textString])
$(".orange").text();
//=> Orange

$("ul").text();
//=>  Apple
//    Orange
//    Pear
```

```js
// .wrap(content)
var redFruit = $('<div class="red-fruit"></div>');
$(".apple").wrap(redFruit);
//=> <ul id="fruits">
//     <div class="red-fruit">
//      <li class="apple">Apple</li>
//     </div>
//     <li class="orange">Orange</li>
//     <li class="plum">Plum</li>
//   </ul>

var healthy = $('<div class="healthy"></div>');
$("li").wrap(healthy);
//=> <ul id="fruits">
//     <div class="healthy">
//       <li class="apple">Apple</li>
//     </div>
//     <div class="healthy">
//       <li class="orange">Orange</li>
//     </div>
//     <div class="healthy">
//        <li class="plum">Plum</li>
//     </div>
//   </ul>
```

```js
// .css([propertName])
// .css([propertyNames])
// .css([propertyName], [value])
// .css([propertName], [function])
// .css([properties])
```

## 渲染

```js
// $.html()
$.html();
//=>  <ul id="fruits">
//      <li class="apple">Apple</li>
//      <li class="orange">Orange</li>
//      <li class="pear">Pear</li>
//    </ul>

// $.html(selector)
$.html(".pear");
//=> <li class="pear">Pear</li>
```

```js
// $.xml()
$ = cheerio.load('<media:thumbnail url="http://www.foo.com/keyframe.jpg" width="75" height="50" time="12:05:01.123"/>');
$.xml();
//=>  <media:thumbnail url="http://www.foo.com/keyframe.jpg" width="75" height="50" time="12:05:01.123"/>
```

## 其他

```js
// .toArray()
$("li").toArray();
//=> [ {...}, {...}, {...} ]
```

```js
// .clone()
var moreFruit = $("#fruits").clone();
```

## 实用工具

```js
// $.root
$.root().append('<ul id="vegetables"></ul>').html();
//=> <ul id="fruits">...</ul><ul id="vegetables"></ul>
```

```js
// $.contains(container, contained)
$.contains(container, contained);
```

```js
// $.parseHTML(data [, context] [, keepScripts])
$.parseHTML(data, context, keepScripts);
```

```js
// $.load(html[, options])
$.load(html, options);
```

## 插件

```js
var $ = cheerio.load("<html><body>Hello, <b>world</b>!</body></html>");
$.prototype.logHtml = function () {
  console.log(this.html());
};

$("body").logHtml();
// logs "Hello, <b>world</b>!" to the console
```

## DOM Node 对象

可用的属性：
- `tagName`
- `parentNode`
- `previousSibling`
- `nextSibling`
- `nodeValue`
- `firstChild`
- `childNodes`
- `lastChild`
