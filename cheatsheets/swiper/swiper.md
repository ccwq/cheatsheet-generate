---
title: Swiper JS 速查
lang: javascript
version: "12.1.3"
date: "2026-03-24"
github: nolimits4web/swiper
colWidth: 380px
---

# Swiper JS 速查

## 快速定位 / 入口
---
lang: javascript
emoji: 🎠
link: https://swiperjs.com/
desc: Swiper 的主线是“容器结构 + modules + CSS + 实例方法”。先把原生初始化跑通，再按场景补 Navigation、Pagination、Thumbs、Virtual、Effects。
---
- 默认结构：`.swiper` -> `.swiper-wrapper` -> `.swiper-slide`
- 常见入口：`new Swiper(...)`、`swiper/react`、`swiper/vue`、`swiper/element`
- 常见模块：`Navigation`、`Pagination`、`Scrollbar`、`Autoplay`、`FreeMode`、`Grid`、`Thumbs`、`Controller`
- 特效模块：`EffectFade`、`EffectCube`、`EffectCoverflow`、`EffectFlip`、`EffectCards`、`EffectCreative`
- 事件里常用：`slideChange`、`reachEnd`、`progress`、`breakpoint`
- 实例初始化后可从容器拿到：`document.querySelector('.swiper').swiper`

```javascript
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiper = new Swiper('.swiper', {
  modules: [Navigation, Pagination],
  slidesPerView: 1,
  spaceBetween: 16,
  navigation: true,
  pagination: { clickable: true },
});
```

## 最小工作流：原生 JS
---
lang: javascript
emoji: 🧩
link: https://swiperjs.com/get-started
desc: 先用最少的参数把“可滑动、可翻页、可响应式”跑通，再考虑特效和联动。大多数项目都应该从这一版开始。
---
- 先确认容器结构完整
- 再引入核心 CSS
- 需要按钮、分页、滚动条时，再装对应模块
- 需要响应式时，用 `breakpoints`
- 需要只读轮播时，优先关掉多余交互：`allowTouchMove: false`

```html
<div class="swiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
  </div>
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
  <div class="swiper-pagination"></div>
</div>
```

```javascript
import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiper = new Swiper('.swiper', {
  modules: [Navigation, Pagination, A11y],
  slidesPerView: 1,
  spaceBetween: 12,
  loop: true,
  speed: 450,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  a11y: true,
});
```

## Recipe：基础轮播怎么配
---
lang: javascript
emoji: 🎬
link: https://swiperjs.com/swiper-api
desc: 最常见的是“一个横向轮播 + 分页 + 响应式断点 + 轻微过渡”。这种场景不要上复杂特效，优先把滑动体验调顺。
---
- `slidesPerView`：每屏显示几张
- `spaceBetween`：卡片间距
- `breakpoints`：按屏宽切换布局
- `centeredSlides`：居中展示首屏
- `watchOverflow`：滑块太少时自动禁用交互
- `grabCursor`：桌面端更像可拖拽组件

```javascript
const swiper = new Swiper('.swiper', {
  slidesPerView: 1.15,
  spaceBetween: 12,
  centeredSlides: false,
  grabCursor: true,
  watchOverflow: true,
  breakpoints: {
    640: { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 20 },
  },
});
```

## Recipe：缩略图联动大图
---
lang: javascript
emoji: 🖼️
link: https://swiperjs.com/swiper-api
desc: 图库、商品详情、作品集最常见的组合是“主图 + 缩略图”。关键不是事件，而是 `Thumbs` 和 `watchSlidesProgress`。
---
- 主图使用 `thumbs: { swiper: thumbsSwiper }`
- 缩略图需要 `watchSlidesProgress: true`
- 缩略图通常关掉复杂交互，只保留点击切换
- 如果缩略图数量很少，注意 `loop` 和 `watchOverflow`

```javascript
import Swiper from 'swiper';
import { Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';

const thumbs = new Swiper('.thumbs', {
  modules: [FreeMode],
  slidesPerView: 5,
  spaceBetween: 8,
  freeMode: true,
  watchSlidesProgress: true,
});

const main = new Swiper('.main', {
  modules: [Thumbs],
  slidesPerView: 1,
  spaceBetween: 12,
  thumbs: {
    swiper: thumbs,
  },
});
```

## Recipe：海量数据与虚拟列表
---
lang: javascript
emoji: 🧮
link: https://swiperjs.com/swiper-api
desc: 当 slide 很多时，重点是减少 DOM 压力，而不是一味调动画。虚拟列表适合长列表、日志页、卡片墙和动态数据源。
---
- `virtual`：开启虚拟滑块
- `renderExternal`：把渲染交给外部框架
- `renderExternalUpdate`：异步渲染后手动更新
- `slidesPerView: 'auto'` 时可配合 `slidesPerViewAutoSlideSize`
- 数据变化后记得 `update()`

```javascript
import Swiper from 'swiper';
import { Virtual } from 'swiper/modules';

const swiper = new Swiper('.swiper', {
  modules: [Virtual],
  virtual: {
    slides: Array.from({ length: 1000 }, (_, i) => `Slide ${i + 1}`),
  },
  slidesPerView: 3,
  spaceBetween: 12,
});
```

```javascript
swiper.virtual.slides.push('New slide');
swiper.update();
```

## Recipe：特效和动效
---
lang: javascript
emoji: ✨
link: https://swiperjs.com/react
desc: Swiper 的特效模块适合做封面、展示页和轻量营销页。不要在复杂业务列表里乱堆特效，维护成本会很快上来。
---
- 常见效果：`fade`、`cube`、`coverflow`、`flip`、`cards`、`creative`
- 对应 CSS 通常要单独引入，如 `swiper/css/effect-fade`
- `fade` 最稳，`creative` 最灵活，`cards` 视觉最强

```javascript
import Swiper from 'swiper';
import { EffectFade, EffectCreative } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-creative';

const fadeSwiper = new Swiper('.fade-swiper', {
  modules: [EffectFade],
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
});

const creativeSwiper = new Swiper('.creative-swiper', {
  modules: [EffectCreative],
  effect: 'creative',
  creativeEffect: {
    prev: {
      shadow: true,
      translate: ['-20%', 0, -1],
    },
    next: {
      translate: ['100%', 0, 0],
    },
  },
});
```

## Recipe：React / Vue / Web Components
---
lang: javascript
emoji: 🧱
link: https://swiperjs.com/element
desc: Swiper 的三种官方入口共享同一套核心参数，但组件封装层不同。React / Vue 用组件，Web Components 用自定义元素。
---
- React 入口：`swiper/react`
- Vue 入口：`swiper/vue`
- Web Components 入口：`swiper/element` 或 `swiper/element/bundle`
- React / Vue 需要把模块显式放进 `modules`
- `swiper/element` 常用 `register()` 后再初始化

```tsx
// React
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';

export default function App() {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={24}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
      onSlideChange={() => console.log('slide change')}
    >
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
    </Swiper>
  );
}
```

```vue
<!-- Vue -->
<template>
  <Swiper
    :modules="[Navigation, Pagination]"
    :slides-per-view="3"
    :space-between="24"
    navigation
    :pagination="{ clickable: true }"
    @slideChange="onSlideChange"
  >
    <SwiperSlide>Slide 1</SwiperSlide>
    <SwiperSlide>Slide 2</SwiperSlide>
    <SwiperSlide>Slide 3</SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';

const onSlideChange = () => {
  console.log('slide change');
};
</script>
```

```html
<!-- Web Components -->
<swiper-container init="false"></swiper-container>

<script type="module">
  import { register } from 'swiper/element/bundle';

  register();

  const el = document.querySelector('swiper-container');
  Object.assign(el, {
    slidesPerView: 3,
    navigation: true,
    pagination: { clickable: true },
  });
  el.initialize();
</script>
```

## Quick Ref：核心参数
---
lang: javascript
emoji: 🧭
link: https://swiperjs.com/swiper-api
desc: 先记住最常调的一组参数，其他参数多数都是围绕“交互、布局、响应式、容器行为”展开。
---
| 参数 | 默认 | 作用 | 常见搭配 |
| --- | --- | --- | --- |
| `slidesPerView` | `1` | 每屏显示数量 | `spaceBetween`、`breakpoints` |
| `spaceBetween` | `0` | slide 间距 | 卡片式轮播 |
| `loop` | `false` | 无缝循环 | `navigation`、`autoplay` |
| `rewind` | `false` | 到头后回到第一张 | 少量 slides、无克隆 |
| `speed` | `300` | 过渡时长(ms) | 所有动画场景 |
| `direction` | `horizontal` | 方向 | 横向/纵向切换 |
| `breakpoints` | `{}` | 响应式参数 | 布局自适应 |
| `centeredSlides` | `false` | 居中当前 slide | 轮播封面 |
| `centeredSlidesBounds` | `false` | 居中但限制边界空白 | 少量 slide |
| `grabCursor` | `false` | 桌面端拖拽光标 | 展示型轮播 |
| `watchOverflow` | `true` | slide 不够时自动禁用 | 内容不固定 |
| `allowTouchMove` | `true` | 允许手势拖动 | 只读展示页可关 |
| `autoHeight` | `false` | 容器高度随当前 slide 变 | 文本高低不一 |
| `watchSlidesProgress` | `false` | 记录滑块可见状态 | `Thumbs`、高级联动 |
| `virtualTranslate` | `false` | 不真的移动 wrapper | 自定义过渡 |
| `createElements` | `false` | 自动补 wrapper/控件 | 快速原型 |
| `cssMode` | `false` | 用 CSS Scroll Snap | 简单滚动场景 |
| `width` / `height` | `null` | 强制尺寸 | 隐藏初始化、SSR、测试 |

## Quick Ref：模块、方法、事件
---
lang: javascript
emoji: 📚
link: https://swiperjs.com/swiper-api
desc: 模块决定“能做什么”，方法决定“怎么驱动”，事件决定“什么时候接业务逻辑”。
---
### 模块速查

| 模块 | 作用 | 常见参数 |
| --- | --- | --- |
| `Navigation` | 上一页 / 下一页 | `nextEl`、`prevEl` |
| `Pagination` | 分页点 / 分页条 | `el`、`clickable`、`type` |
| `Scrollbar` | 滚动条拖拽 | `el`、`draggable` |
| `Autoplay` | 自动播放 | `delay`、`disableOnInteraction`、`pauseOnMouseEnter` |
| `FreeMode` | 自由滚动 | `enabled`、`sticky` |
| `Grid` | 多行布局 | `rows`、`fill` |
| `Thumbs` | 缩略图联动 | `swiper` |
| `Controller` | 双向控制 | `control`、`inverse` |
| `Virtual` | 虚拟列表 | `slides`、`renderExternal` |
| `Zoom` | 图片缩放 | `maxRatio` |
| `Keyboard` | 键盘控制 | `enabled`、`onlyInViewport` |
| `Mousewheel` | 滚轮切换 | `forceToAxis`、`releaseOnEdges` |
| `A11y` | 无障碍 | `prevSlideMessage`、`nextSlideMessage` |
| `Parallax` | 视差 | `data-swiper-parallax` |
| `EffectFade` / `Cube` / `Coverflow` / `Flip` / `Cards` / `Creative` | 动效 | 各自 effect 参数 |

### 方法速查

| 方法 / 属性 | 用途 |
| --- | --- |
| `slideNext(speed?, runCallbacks?)` | 下一张 |
| `slidePrev(speed?, runCallbacks?)` | 上一张 |
| `slideTo(index, speed?, runCallbacks?)` | 跳到指定索引 |
| `slideToLoop(index, speed?, runCallbacks?)` | loop 模式下按真实索引跳转 |
| `slideReset(speed?, runCallbacks?)` | 回到当前活动点 |
| `slideToClosest(speed?, runCallbacks?)` | 回到最近 snap 点 |
| `update()` | 手动改 DOM 后刷新 |
| `updateSize()` | 重算容器尺寸 |
| `updateSlides()` | 重算 slides |
| `updateSlidesClasses()` | 刷新 active / prev / next 类 |
| `updateAutoHeight(speed?)` | 刷新高度 |
| `changeDirection('horizontal' \| 'vertical')` | 切换方向 |
| `changeLanguageDirection('rtl' \| 'ltr')` | 切换语言方向 |
| `destroy(deleteInstance?, cleanStyles?)` | 销毁实例 |
| `use(modules)` | 运行时安装模块 |

### 事件速查

| 事件 | 触发时机 |
| --- | --- |
| `init` | 初始化完成 |
| `beforeInit` | 初始化前 |
| `slideChange` | 当前 slide 改变 |
| `transitionStart` / `transitionEnd` | 过渡开始 / 结束 |
| `progress` | 滑动进度变化 |
| `reachBeginning` / `reachEnd` | 到达首尾 |
| `setTranslate` / `setTransition` | wrapper 位置 / 过渡更新 |
| `click` / `tap` | 点击或轻触 |
| `touchStart` / `touchMove` / `touchEnd` | 触摸链路 |
| `breakpoint` | 断点切换 |
| `observerUpdate` | 观察到 DOM 变化 |

## 常见坑 / 决策规则
---
lang: javascript
emoji: ⚠️
link: https://swiperjs.com/swiper-api
desc: Swiper 的坑通常来自“模块没引、样式没引、结构没对、模式没选对”。先排这些基础项，再看业务逻辑。
---
- 只写 JS 不引 CSS，样式会直接不完整
- React / Vue / Element 都不是同一个入口，别混着用
- `thumbs` 联动通常要开 `watchSlidesProgress`
- `loop` 对 slides 数量有要求，数量太少时优先考虑 `rewind`
- 自定义导航 / 分页元素时，确认 `nextEl`、`prevEl`、`el` 真的存在
- `virtual` 或手动增删 slide 后，记得 `update()`
- `cssMode` 更适合轻量滚动，不适合每种特效都硬叠上去
- 从 v9 起没有独立的 lazy API，图片优先用原生 `loading="lazy"`

