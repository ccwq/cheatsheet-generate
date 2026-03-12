---
title: Tailwind CSS 速查
lang: html
version: "4.2.1"
date: 2026-03-12
github: tailwindlabs/tailwindcss
colWidth: 420px
---

## 🚀 CSS 入口与生成
---
lang: css
emoji: 🚀
link: https://tailwindcss.com/docs/functions-and-directives
desc: Tailwind CSS v4 以 CSS 为主入口，常见工作是导入框架、声明数据源、构建输出。
---

### 最小入口
```css
/* 载入 Tailwind 全量能力 */
@import "tailwindcss";
```

### 显式声明扫描源
```css
/* 补充默认自动检测之外的模板路径 */
@source "../packages/ui/src";

/* 内联补充常用类，避免运行时拼接导致丢失 */
@source inline("text-red-500 font-bold md:grid");
```

### CLI 构建
```bash
# 监听输入 CSS 并输出产物
npx @tailwindcss/cli -i ./src/app.css -o ./dist/app.css --watch

# 生产构建并压缩
npx @tailwindcss/cli -i ./src/app.css -o ./dist/app.css --minify
```

## 🎨 主题变量
---
lang: css
emoji: 🎨
link: https://tailwindcss.com/docs/theme
desc: v4 用 @theme 定义设计令牌，生成对应 utility，同时也可直接当 CSS 变量使用。
---

### 自定义颜色与字体
```css
/* 定义品牌色、字号和字体族 */
@theme {
  --color-brand-50: oklch(0.97 0.02 250);
  --color-brand-500: oklch(0.62 0.19 255);
  --font-display: "IBM Plex Sans", "PingFang SC", sans-serif;
  --radius-card: 1.25rem;
}
```

### 在样式中引用变量
```css
/* theme 变量可直接用于自定义组件 */
.hero {
  color: var(--color-brand-500);
  border-radius: var(--radius-card);
  font-family: var(--font-display);
}
```

### 断点与容器变量
```css
/* 自定义断点与容器尺寸 */
@theme {
  --breakpoint-3xl: 120rem;
  --container-content: 72rem;
}
```

## 🧱 常用布局与排版
---
lang: html
emoji: 🧱
link: https://tailwindcss.com/docs/styling-with-utility-classes
desc: 日常开发高频仍是组合 utility；优先用组合表达布局，减少单独写组件 CSS。
---

### 布局骨架
```html
<!-- 居中容器 + 响应式网格 -->
<main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    <article class="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"></article>
  </section>
</main>
```

### 文本与间距
- `text-sm`：小字号
- `text-balance`：平衡多行标题换行
- `leading-6`：行高
- `tracking-tight`：收紧字距
- `space-y-4`：子项纵向间距
- `gap-4` / `gap-x-6` / `gap-y-2`：网格或弹性间距

### 对齐与尺寸
- `flex items-center justify-between`：主轴与交叉轴对齐
- `min-h-screen`：满屏高度
- `aspect-video`：视频比例
- `size-10`：同时设置宽高
- `overflow-x-auto`：横向滚动

## 🔀 状态与变体
---
lang: html
emoji: 🔀
link: https://tailwindcss.com/docs/hover-focus-and-other-states
desc: Variant 是 Tailwind 的核心表达力来源，可叠加伪类、媒体条件、父级状态和属性状态。
---

### 常用状态组合
```html
<!-- hover + focus + disabled -->
<button class="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 focus:outline-2 focus:outline-offset-2 focus:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-40">
  保存
</button>
```

### 响应式与暗色
```html
<!-- 响应式与深色主题叠加 -->
<aside class="hidden lg:block dark:bg-slate-950 dark:text-slate-100"></aside>
```

### group / peer / data / aria
```html
<!-- 父元素状态 -->
<a class="group inline-flex items-center gap-2">
  <span class="transition group-hover:translate-x-1">详情</span>
</a>

<!-- 相邻表单状态 -->
<input class="peer rounded border px-3 py-2" />
<p class="mt-2 hidden text-sm text-red-600 peer-invalid:block">请输入有效邮箱</p>

<!-- 属性驱动状态 -->
<div class="data-[state=open]:block aria-selected:bg-sky-100"></div>
```

## 🧮 任意值与动态语法
---
lang: html
emoji: 🧮
link: https://tailwindcss.com/docs/adding-custom-styles
desc: 需要突破设计令牌时，优先用 arbitrary value；但不要在模板里运行时拼接不完整 class。
---

### 任意值
```html
<!-- 任意长度、颜色和选择器 -->
<div class="top-[117px] grid-cols-[200px_minmax(0,1fr)] bg-[oklch(0.62_0.19_255)] [&>kbd]:rounded-sm"></div>
```

### CSS 变量桥接
```html
<!-- 将运行时变量交给 utility 消费 -->
<div class="w-[var(--sidebar-width)] translate-y-[var(--offset)]"></div>
```

### 不推荐的动态拼接
```tsx
// 不要把类名拆成不完整片段
const bad = `text-${color}-600`

// 应改成可静态检测的完整映射
const colorMap = {
  danger: "text-red-600",
  success: "text-emerald-600",
}
```

## 🧩 自定义 Utility / Variant
---
lang: css
emoji: 🧩
link: https://tailwindcss.com/docs/functions-and-directives
desc: v4 原生支持在 CSS 中注册 utility、variant 与组件样式，适合沉淀团队约定。
---

### 自定义 utility
```css
/* 生成可复用的新 utility */
@utility content-auto {
  content-visibility: auto;
}

@utility stack-4 {
  display: grid;
  gap: 1rem;
}
```

### 自定义 variant
```css
/* 自定义主题域变体 */
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

```html
<!-- 在类名中直接使用自定义 variant -->
<section class="theme-midnight:bg-slate-950 theme-midnight:text-white"></section>
```

### 在组件层复用
```css
/* 组件类中复用 utility */
@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-500;
  }
}
```

## 🪄 在模块化样式中引用
---
lang: css
emoji: 🪄
link: https://tailwindcss.com/docs/functions-and-directives#reference-directive
desc: 在 Vue/Svelte/CSS Modules 中使用 @apply、@variant 时，通常需要先 @reference 主样式文件。
---

### CSS Modules
```css
/* Button.module.css */
@reference "../app.css";

.button {
  @apply inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium;
  @apply bg-slate-900 text-white hover:bg-slate-700;
}
```

### Vue 单文件组件
```vue
<style scoped>
@reference "../app.css";

.card {
  @apply rounded-2xl border border-black/10 bg-white p-6;
}
</style>
```

## 📦 组件模式
---
lang: html
emoji: 📦
link: https://tailwindcss.com/docs/reusing-styles
desc: Tailwind 不鼓励过早抽象；先在模板中直接组合，重复明显后再抽 utility 或组件类。
---

### 操作条
```html
<!-- 直接在模板里组织“可读的类串” -->
<div class="flex flex-wrap items-center gap-3 rounded-2xl border border-black/10 bg-white/90 p-3 backdrop-blur">
  <button class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">发布</button>
  <button class="rounded-lg border border-black/10 px-4 py-2 text-sm hover:bg-slate-50">预览</button>
</div>
```

### 卡片模板
```html
<!-- 用数据状态控制视觉切换 -->
<article class="rounded-3xl border border-black/10 bg-white p-6 shadow-sm data-[featured=true]:ring-2 data-[featured=true]:ring-sky-500">
  <h2 class="text-lg font-semibold text-slate-900">Starter</h2>
  <p class="mt-2 text-sm text-slate-600">适合静态站点与内部工具。</p>
</article>
```

## 🔍 排障与迁移要点
---
lang: bash
emoji: 🔍
link: https://tailwindcss.com/docs/detecting-classes-in-source-files
desc: Tailwind v4 最常见问题都和 class 检测、样式引用路径、旧版配置思维残留有关。
---

### 高频检查项
- `@import "tailwindcss";`：确认主入口 CSS 已被打包链路处理
- `@source`：Monorepo、外部组件库、运行时生成类名时补充数据源
- `@reference`：模块化样式里使用 `@apply` 前先引用主样式
- `dark:` / `data-*:` / `aria-*:`：确认触发属性真的落在 DOM 上
- 动态类名：不要拼出半截字符串，保持完整 class 文本可被扫描

### 迁移提示
```bash
# 从旧项目迁移时，先定位仍依赖 JS 配置的部分
rg "tailwind\\.config|safelist|content:" .

# 再检查是否已改成 CSS-first 写法
rg "@import \"tailwindcss\"|@theme|@source|@utility|@custom-variant" src
```
