---
title: GSAP
lang: javascript
version: "3.13.0"
date: "2025-11-14"
github: greensock/GSAP
colWidth: 360px
---

# GSAP

## 核心入口
---
emoji: ⚡
link: https://gsap.com/docs/v3/GSAP/gsap.to()
desc: `gsap.to/from/fromTo/set` 是绝大多数动画的起点。
---
- `gsap.to(targets, vars)` : 从当前状态补间到目标状态
- `gsap.from(targets, vars)` : 从给定初始状态进入当前状态
- `gsap.fromTo(targets, fromVars, toVars)` : 显式声明起止状态
- `gsap.set(targets, vars)` : 立即写值，不创建补间
- `gsap.delayedCall(delay, fn)` : 延时执行回调

```javascript
// 进入场动画
gsap.from(".hero-title", {
  y: 32,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out"
});

// 交互反馈
gsap.to(".card", {
  scale: 1.02,
  duration: 0.2,
  paused: true
});
```

## Tween 常用参数
---
emoji: 🎛️
link: https://gsap.com/docs/v3/GSAP/Tween/
desc: duration、delay、repeat、stagger、callbacks 是高频参数组合。
---
- `duration` : 动画时长，单位秒
- `delay` : 延迟开始
- `ease` : 缓动函数
- `repeat` : 重复次数，`-1` 为无限
- `yoyo` : 往返播放
- `stagger` : 批量目标错峰执行
- `onStart/onUpdate/onComplete` : 生命周期回调

```javascript
// 批量列表项依次出现
gsap.to(".item", {
  opacity: 1,
  y: 0,
  duration: 0.5,
  stagger: {
    each: 0.08,
    from: "start"
  },
  ease: "power3.out"
});
```

## 时间轴
---
emoji: 🧵
link: https://gsap.com/docs/v3/GSAP/Timeline/
desc: Timeline 负责组织多段动画、标签与相对时间位置。
---
- `gsap.timeline(options)` : 创建时间轴
- `tl.to()` : 追加一个 tween
- `tl.from()` : 追加进入动画
- `tl.addLabel("intro")` : 增加标签
- `tl.play()` : 播放
- `tl.pause()` : 暂停
- `tl.reverse()` : 反向播放
- `tl.seek("intro")` : 跳到标签或时间点

```javascript
const tl = gsap.timeline({
  defaults: {
    duration: 0.5,
    ease: "power2.out"
  }
});

tl.from(".hero-title", { y: 30, opacity: 0 })
  .from(".hero-subtitle", { y: 18, opacity: 0 }, "<0.1")
  .from(".hero-cta", { scale: 0.92, opacity: 0 }, ">-0.1")
  .addLabel("ready");
```

## 时间位置语法
---
emoji: 📍
link: https://gsap.com/docs/v3/GSAP/Timeline/addLabel()
desc: `<`、`>`、标签和 `+=`/`-=` 能让时间轴保持可维护。
---
- `0` : 绝对时间
- `"+=0.3"` : 在当前末尾后再延迟 0.3 秒
- `"-=0.2"` : 与前一个动画重叠 0.2 秒
- `"<"` : 与前一个动画同起点
- `">"` : 接在前一个动画结束后
- `"label+=0.2"` : 基于标签偏移

```javascript
tl.from(".panel", { opacity: 0, y: 24 }, 0)
  .from(".panel-title", { opacity: 0, y: 12 }, "<0.1")
  .from(".panel-body", { opacity: 0 }, ">-0.1")
  .from(".panel-actions", { opacity: 0, y: 10 }, "ready+=0.2");
```

## 缓动与函数值
---
emoji: 🌊
link: https://gsap.com/docs/v3/Eases/
desc: 合适的 ease 与函数值，能比硬编码参数更自然。
---
- `"power2.out"` : 常见 UI 进入动画
- `"power2.inOut"` : 前后都平滑
- `"back.out(1.7)"` : 带轻微回弹
- `"elastic.out(1, 0.4)"` : 明显弹性
- `"steps(5)"` : 分段动画
- `x: (index) => index * 24` : 用函数按序生成值

```javascript
gsap.to(".dot", {
  x: (index) => index * 18,
  scale: (index) => 1 + index * 0.08,
  ease: "back.out(1.7)",
  stagger: 0.05
});
```

## ScrollTrigger
---
emoji: 🧲
link: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
desc: 滚动驱动动画时，先注册插件，再定义 trigger、start、end、scrub。
---
- `gsap.registerPlugin(ScrollTrigger)` : 注册插件
- `trigger` : 触发元素
- `start/end` : 起止位置
- `scrub` : 将动画与滚动进度绑定
- `pin` : 固定元素
- `toggleActions` : 进入/离开时行为
- `markers` : 调试定位

```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.to(".feature-image", {
  y: -80,
  ease: "none",
  scrollTrigger: {
    trigger: ".feature",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});
```

## 常用插件
---
emoji: 🧩
link: https://gsap.com/docs/v3/Plugins/
desc: ScrollTrigger、Flip、MotionPath、ScrollTo 是最常见组合。
---
- `ScrollTrigger` : 滚动驱动动画
- `ScrollToPlugin` : 平滑滚动到目标
- `Flip` : 布局切换过渡
- `MotionPathPlugin` : 沿路径运动
- `Observer` : 统一鼠标、触控、滚轮输入
- `Draggable` : 拖拽交互
- `TextPlugin` : 文本渐变显示

```javascript
gsap.registerPlugin(Flip);

const state = Flip.getState(".card");
document.querySelector(".grid").classList.toggle("is-expanded");

Flip.from(state, {
  duration: 0.45,
  ease: "power2.inOut",
  absolute: true
});
```

## 上下文与框架集成
---
emoji: 🧱
link: https://gsap.com/docs/v3/GSAP/gsap.context()
desc: 在 React、Vue 等框架中，用 `context()` 和 `matchMedia()` 收拢副作用。
---
- `gsap.context(fn, scope)` : 记录当前上下文里创建的动画
- `ctx.revert()` : 清理上下文动画
- `gsap.matchMedia()` : 按媒体查询注册动画
- `mm.add(query, fn)` : 为断点分别定义动画

```javascript
const mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
  const ctx = gsap.context(() => {
    gsap.from(".sidebar", { x: -40, opacity: 0 });
  });

  return () => ctx.revert();
});
```

## 工具函数
---
emoji: 🛠️
link: https://gsap.com/docs/v3/GSAP/UtilityMethods/
desc: `utils`、`quickSetter`、`quickTo` 常用于高频交互与性能优化。
---
- `gsap.utils.toArray(selector)` : 把选择器结果转成数组
- `gsap.utils.clamp(min, max, value)` : 限制数值范围
- `gsap.utils.interpolate(a, b, progress)` : 按进度插值
- `gsap.quickSetter(target, prop, unit)` : 创建高性能写值函数
- `gsap.quickTo(target, prop, vars)` : 创建“追逐式”补间函数

```javascript
const moveX = gsap.quickTo(".cursor-follower", "x", {
  duration: 0.18,
  ease: "power3.out"
});

const moveY = gsap.quickTo(".cursor-follower", "y", {
  duration: 0.18,
  ease: "power3.out"
});

window.addEventListener("pointermove", (event) => {
  moveX(event.clientX);
  moveY(event.clientY);
});
```

## 控制与回调
---
emoji: 🎚️
link: https://gsap.com/docs/v3/GSAP/Tween/eventCallback()
desc: 实例方法适合在业务状态、路由切换和手动播放场景中配合使用。
---
- `tween.pause()` : 暂停
- `tween.resume()` : 继续
- `tween.restart()` : 重头播放
- `tween.progress(0.5)` : 设置进度
- `tween.kill()` : 销毁 tween
- `tween.eventCallback("onComplete", fn)` : 动态修改回调

```javascript
const tween = gsap.to(".toast", {
  autoAlpha: 1,
  y: 0,
  paused: true,
  duration: 0.3
});

document.querySelector(".open").addEventListener("click", () => tween.restart());
document.querySelector(".close").addEventListener("click", () => tween.reverse());
```

## 性能与排障
---
emoji: 🩺
link: https://gsap.com/docs/v3/GSAP/gsap.config()
desc: 少做 layout thrash，多做 transform，及时清理 ScrollTrigger 与上下文。
---
- `transform` 和 `opacity` : 优先动画的属性
- `will-change` : 只在短时间内为热点元素启用
- `ScrollTrigger.refresh()` : 布局变化后刷新触发器
- `ScrollTrigger.getAll().forEach(trigger => trigger.kill())` : 清理全部触发器
- `gsap.defaults({...})` : 设置全局默认值
- `gsap.config({ nullTargetWarn: false })` : 调整全局行为

```javascript
// 内容懒加载或手风琴展开后，刷新 ScrollTrigger
document.querySelector(".accordion").addEventListener("transitionend", () => {
  ScrollTrigger.refresh();
});
```
