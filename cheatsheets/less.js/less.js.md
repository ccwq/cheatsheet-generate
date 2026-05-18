---
title: Less.js
lang: zh
version: "4.6.3"
date: 2026-03-11
github: less/less.js
colWidth: 12
---

## 快速定位

Less.js 就像 CSS 的"增强版"，让样式表也能像编程一样使用变量、函数和逻辑。主要解决 CSS 难以维护、重复代码多的问题。

```less
// Less.js 本质上就是带变量和逻辑的 CSS 语法
// 写完后再编译成标准 CSS 供浏览器使用
@primary: #428bca;
a { color: @primary; }
```

## 1. 安装与编译
---
lang: bash
desc: 在项目中加入 Less.js 的方式
---

### NPM 安装

- 全局安装 CLI：`npm install -g less`
- 项目本地安装：`npm i less --save-dev`

### Yarn / pnpm 安装

- Yarn：`yarn global add less`
- pnpm：`pnpm add -g less`

### 编译命令

- 编译单个文件：`lessc styles.less styles.css`
- 静默模式：`lessc -s styles.less styles.css`
- 查看版本：`lessc -v`

### 浏览器端直接使用

```html
<script src="https://cdn.jsdelivr.net/npm/less"></script>
<link rel="stylesheet/less" type="text/css" href="styles.less" />
```

## 2. 变量（Variables）
---
lang: less
desc: 当你需要统一管理主题配色、间距等全局值时，用变量
---

### 基础变量定义与使用

```less
@link-color: #428bca;
@link-color-hover: darken(@link-color, 10%);

a { color: @link-color; }
a:hover { color: @link-color-hover; }
```

### 变量延迟加载（先使用后定义）

```less
// Less 变量支持在使用之后才定义
@var: @a;
@a: 10px;

.class { width: @var; }  // 编译为 width: 10px;
```

### 属性名和选择器中使用变量

```less
@property: color;
@{property}: blue;           // 编译为 color: blue;

@selector: ".button";
@{selector} { background: red; }  // 编译为 .button { background: red; }
```

## 3. 混入（Mixins）
---
lang: less
desc: 当你有一段样式要在多个地方复用时，用混入
---

### 普通混入（会输出到 CSS）

```less
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

#menu a { .bordered(); }
.post a { .bordered(); }
```

### 带括号的混入（不输出到 CSS）

```less
.my-mixin() {
  color: red;
  font-size: 14px;
}

.text { .my-mixin(); }  // 只输出 .text { color: red; font-size: 14px; }
```

### 带默认参数的混入

```less
.hover-mixin(@color: blue, @size: 10px) {
  color: @color;
  font-size: @size;
}

.button { .hover-mixin(red); }           // 使用红色默认尺寸
.link { .hover-mixin(green, 16px); }    // 覆盖两个参数
```

### 守卫条件混入

```less
// 守卫写在参数列表之后，用 when 关键字
.mixin(@x; @y) when (@x >= 0) and (@y >= 0) {
  width: @x;
  height: @y;
}

.box { .mixin(100px; 50px); }
```

### Less 4.0+ 重要变更

```less
// 1. 除法必须放在括号内，否则原样输出
width: (100px / 3);        // 正确：编译为 33.3333px
width: 100px / 3;           // 错误：原样保留 100px / 3

// 2. calc() 不再计算内部表达式，需用括号包裹
width: calc(100px * 2);     // Less 不处理 calc，原样输出
```

## 4. 嵌套（Nesting）
---
lang: less
desc: 当你写深层级选择器时，用嵌套替代重复书写父选择器
---

### 基础嵌套

```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
```

### 父选择器 `&`

```less
.button {
  &-ok { background: green; }
  &-cancel { background: red; }
  &:hover { background: blue; }
}
```

### 嵌套 At-Rules（媒体查询气泡）

```less
.component {
  width: 300px;
  @media (min-width: 768px) {
    width: 600px;
    @media (min-resolution: 192dpi) {
      background-image: url(/img/retina2x.png);
    }
  }
}
```

## 5. 运算（Operations）
---
lang: less
desc: 当你需要动态计算数值、颜色时，用运算
---

### 数值运算

```less
@conversion: 5cm + 10mm;      // 结果: 6cm
@base: 5%;
@filler: @base * 2;            // 结果: 10%
```

### 颜色运算

```less
@color: (#224488 / 2);         // 结果: #112244
background-color: (#FFFFFF / 16);  // v4.0+ 除法需括号，结果: #101010
```

### 单位自动转换

```less
@width: 100px;
@padding: @width * 0.5;        // 结果: 50px
```

## 6. 函数（Functions）
---
lang: less
desc: 当你需要动态调整颜色、计算数值时，用内置函数
---

### 颜色操作函数

```less
@base: #f04615;

.class {
  color: lighten(@base, 20%);      // 调亮
  background-color: darken(@base, 10%);  // 调暗
  border-color: spin(@base, 30);  // 旋转色调
}
```

### 颜色混合函数

```less
@color1: red;
@color2: blue;

.mixed {
  color: mix(@color1, @color2, 50%);  // 等比例混合
}
```

### 数学函数

```less
@width: 100px;

.class {
  width: percentage(@width / 200px);  // 50%
  width: round(100px / 3);             // 33px
  width: ceil(100px / 3);              // 34px
  width: floor(100px / 3);            // 33px
}
```

## 7. 导入（Importing）
---
lang: less
desc: 当你需要把样式拆分成多个文件时，用导入
---

### 基本导入

```less
@import "library";         // 导入 library.less，扩展名可选
@import "typo.css";        // 原样保留 CSS 文件内容
```

### 导入选项

```less
@import (reference) "file";   // 仅引用不输出
@import (optional) "file";   // 文件不存在也继续编译
@import (once) "file";       // 同一文件只导入一次
@import (multiple) "file";   // 允许重复导入
```

### 导入并使用命名空间

```less
// utility.less
#functions() {
  .reset() { margin: 0; padding: 0; }
}

// styles.less
@import "utility";
#functions.reset();
```

## 8. 命名空间与 Maps
---
lang: less
desc: 当你想封装一组工具函数或配置时，用命名空间
---

### 命名空间封装

```less
#bundle() {
  .button {
    display: block;
    border: 1px solid black;
    &:hover { background-color: white; }
  }
  .tab { color: gray; }
}

#header a {
  color: orange;
  #bundle.button();
}
```

### 作为 Map 使用（v3.5+）

```less
#colors() {
  primary: blue;
  secondary: green;
  danger: red;
}

.button {
  color: #colors[primary];
  border: 1px solid #colors[secondary];
}
```

## 9. 条件与循环
---
lang: less
desc: 当你需要根据条件应用样式或创建循环时
---

### 条件混入

```less
.truncate() when (@truncate = true) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text { .truncate(); }
```

### 递归循环

```less
.loop(@counter) when (@counter > 0) {
  .col-@{counter} { width: (100% / 12 * @counter); }
  .loop(@counter - 1);
}

.loop(12);
```

## 10. 转义（Escaping）
---
lang: less
desc: 当你需要使用 CSS 不支持的特殊值时，用转义
---

### 媒体查询转义

```less
@min768: (min-width: 768px);

.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

## 11. !important
---
lang: less
desc: 当你需要强制覆盖样式优先级时
---

```less
.button {
  color: red !important;
  font-size: 14px !important;
}
```

## 12. Extend（继承）
---
lang: less
desc: 当你想让一个选择器继承另一个选择器的样式时
---

### 基本继承

```less
.button {
  padding: 10px;
  border-radius: 4px;
}

.primary-btn {
  &:extend(.button);
  background: blue;
}
```

### 选择器内继承

```less
.nav ul {
  background: gray;
  .nav-item {
    &:extend(ul li);
  }
}
```

## 13. Less 与其他预处理器对比
---
lang: bash
desc: 快速了解 Less 在同类工具中的定位
---

| 特性 | Less | Sass/SCSS | Stylus |
|------|------|-----------|--------|
| 语法 | CSS 超集 | CSS 超集 + 缩进 | 省略分号/大括号 |
| 变量符号 | `@` | `$` | `$` |
| 嵌套 | ✅ | ✅ | ✅ |
| 混入/Mixins | ✅ | ✅ | ✅ |
| 运算 | ✅ | ✅ | ✅ |
| 条件语句 | ✅（混入守卫） | ✅ | ✅ |
| 循环 | ✅ | ✅ | ✅ |
| 导入 CSS | ✅（直接） | ✅（需 @import） | ✅ |
| 地图/Maps | ✅（v3.5+） | ✅ | ✅ |
| 编译速度 | 中等 | 较快（C++） | 快（C++） |
| 生态 | 中等 | 丰富 | 较小 |

**选 Less 的理由**：语法最接近 CSS，学习成本低，无需编译即可在浏览器直接运行，适合小型项目或快速原型。

## 核心场景小贴士
---
lang: less
desc: 记住这些场景映射就够了
---

- **主题配色统一**：变量 + darken/lighten 函数
- **复用按钮样式**：带括号混入 + 默认参数
- **写深层级选择器**：嵌套 + `&` 符号
- **媒体查询嵌套**：`@media` 直接写在选择器内
- **工具函数封装**：命名空间 + Maps
- **编译失败排查**：检查变量是否定义、括号是否匹配
