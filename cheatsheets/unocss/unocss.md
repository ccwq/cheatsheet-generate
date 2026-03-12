---
title: UnoCSS 速查
lang: html
version: "66.6.6"
date: 2026-03-12
github: unocss/unocss
colWidth: 420px
---

## ⚡ 核心配置入口
---
lang: ts
emoji: ⚡
link: https://unocss.dev/config/
desc: UnoCSS 通过配置文件组合 preset、rules、shortcuts、transformer 与 extractor；配置本身就是主要入口。
---

### 基础配置
```ts
// uno.config.ts
import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetWebFonts({
      fonts: {
        sans: 'IBM Plex Sans',
      },
    }),
  ],
})
```

### 指定扫描范围
```ts
// 收窄或补充内容扫描路径
import { defineConfig } from 'unocss'

export default defineConfig({
  content: {
    filesystem: [
      'src/**/*.{html,ts,tsx,vue,svelte,mdx}',
      'packages/ui/**/*.{ts,tsx,vue}',
    ],
  },
})
```

## 🧱 原子类与变体
---
lang: html
emoji: 🧱
link: https://unocss.dev/guide/style-reset
desc: 默认以 utility-first 使用，语法兼容多套变体写法，适合快速拼装布局与状态。
---

### 常用类组合
```html
<!-- 容器、网格、圆角、阴影 -->
<section class="mx-auto max-w-7xl grid gap-6 md:grid-cols-3 px-4">
  <article class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/8"></article>
</section>
```

### 悬停、响应式、暗色
```html
<!-- 变体可直接前缀叠加 -->
<button class="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 disabled:opacity-40 md:text-base dark:bg-sky-500">
  保存
</button>
```

### Variant Group
```html
<!-- 用括号压缩重复前缀 -->
<div class="hover:(bg-slate-900 text-white) sm:(grid grid-cols-2 gap-4)"></div>
```

## 🧩 Shortcuts
---
lang: ts
emoji: 🧩
link: https://unocss.dev/config/shortcuts
desc: 重复组合应优先收敛到 shortcuts，既保留原子写法的透明度，又减少模板噪音。
---

### 字符串 shortcuts
```ts
// uno.config.ts
export default defineConfig({
  shortcuts: {
    'btn-primary': 'inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-500',
    'card-base': 'rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/8',
  },
})
```

### 动态 shortcuts
```ts
// 基于正则生成 utility 组合
export default defineConfig({
  shortcuts: [
    [/^stack-(\d+)$/, ([, d]) => `grid gap-${d}`],
  ],
})
```

## 🛠️ 自定义 Rules
---
lang: ts
emoji: 🛠️
link: https://unocss.dev/config/rules
desc: rules 适合补齐项目特有属性映射；能静态算出的，优先写成 rule，而不是运行时样式。
---

### 静态规则
```ts
// 固定规则
export default defineConfig({
  rules: [
    ['content-auto', { contentVisibility: 'auto' }],
  ],
})
```

### 动态规则
```ts
// 解析自定义前缀值
export default defineConfig({
  rules: [
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],
    [/^square-(\d+)$/, ([, d]) => ({
      width: `${d}px`,
      height: `${d}px`,
    })],
  ],
})
```

## 🏷️ Attributify 模式
---
lang: html
emoji: 🏷️
link: https://unocss.dev/presets/attributify
desc: Attributify 用属性表达 utility，适合表单、组件模板和视觉密度较高的 DOM。
---

### 基础写法
```html
<!-- 用属性代替 class -->
<button
  text="sm white"
  font="medium"
  bg="sky-600 hover:sky-500"
  px="4"
  py="2"
  rounded="lg"
>
  提交
</button>
```

### 与 class 混用
```html
<!-- 属性写状态，class 写结构 -->
<div class="grid gap-4" border="1 slate-200" p="4 md:6" rounded="2xl"></div>
```

## 🎨 Theme 与预设
---
lang: ts
emoji: 🎨
link: https://unocss.dev/config/theme
desc: 主题令牌、预设组合和图标字体通常都在配置层统一维护，便于多项目复用。
---

### 自定义主题
```ts
// 扩展颜色与断点
export default defineConfig({
  theme: {
    colors: {
      brand: {
        50: '#eff6ff',
        500: '#0ea5e9',
        700: '#0369a1',
      },
    },
    breakpoints: {
      xs: '360px',
      '3xl': '1920px',
    },
  },
})
```

### 常见 preset 组合
- `presetUno()`：通用默认预设
- `presetAttributify()`：属性式 utility
- `presetIcons()`：基于 collection 的图标类
- `presetTypography()`：排版预设
- `presetWebFonts()`：按需插入 Web 字体
- `presetWind3()` / `presetWind4()`：偏 Tailwind 风格兼容层

## 🔌 Transformer 与 Directive
---
lang: ts
emoji: 🔌
link: https://unocss.dev/transformers/variant-group
desc: Transformer 负责在编译前改写源码，常用于 Variant Group、Directive、编译类等高级能力。
---

### 启用常用 transformer
```ts
// uno.config.ts
import { defineConfig, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
```

### 在 CSS 中使用 @apply
```css
/* 需要 transformerDirectives() */
.panel {
  @apply rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/8;
}
```

## 🎯 Extracting 与 Safelist
---
lang: ts
emoji: 🎯
link: https://unocss.dev/config/safelist
desc: UnoCSS 依赖内容提取；运行时拼接类名、远端渲染模板、CMS 内容都需要额外 safelist 或自定义提取策略。
---

### Safelist
```ts
// 保留运行时可能出现的类
export default defineConfig({
  safelist: [
    'prose',
    'text-red-500',
    'md:grid-cols-3',
    'i-carbon-warning',
  ],
})
```

### 避免半截拼接
```ts
// 不推荐：提取器看不到最终类名
const bad = `text-${status}-500`

// 推荐：用完整映射
const statusClass = {
  danger: 'text-red-500',
  success: 'text-emerald-500',
}
```

## 🧪 Inspector 与 CLI
---
lang: bash
emoji: 🧪
link: https://unocss.dev/integrations/cli
desc: 排障时优先用 inspector 看命中情况，再用 CLI 或对应构建插件检查输出 CSS。
---

### CLI 输出
```bash
# 扫描源码并产出 CSS
unocss "src/**/*.{vue,tsx,html}" --out-file dist/uno.css

# 监听模式
unocss "src/**/*.{vue,tsx,html}" --out-file dist/uno.css --watch
```

### 调试思路
- Inspector 看类名是否被识别、落到哪条 rule
- 检查 `content.filesystem` 是否覆盖 monorepo 或 UI 包
- 运行时生成类名时补 `safelist`
- 用 `transformerDirectives()` 前确认样式文件已参与构建

## 📦 组件实战
---
lang: html
emoji: 📦
link: https://unocss.dev/
desc: UnoCSS 很适合在模板里保留结构化原子类，同时把跨页面复用部分收敛到 shortcuts。
---

### 卡片与操作条
```html
<!-- 结构类 + shortcuts 并用 -->
<div class="card-base flex flex-col gap-4">
  <header class="flex items-center justify-between">
    <h2 class="text-lg font-semibold text-slate-900">Starter</h2>
    <span class="rounded-full bg-sky-50 px-2 py-1 text-xs text-sky-700">推荐</span>
  </header>

  <div class="flex gap-3">
    <button class="btn-primary">部署</button>
    <button class="rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-50">预览</button>
  </div>
</div>
```

### 图标类
```html
<!-- presetIcons 提供 i- 前缀图标 -->
<span class="i-carbon-search text-lg text-slate-500"></span>
<span class="i-mdi-github text-xl text-slate-900"></span>
```
