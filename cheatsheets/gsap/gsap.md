---
title: GSAP
lang: javascript
version: "3.15.0"
date: "2026-04-13"
github: greensock/GSAP
colWidth: 360px
---

# GSAP

## 快速定位
---
lang: javascript
emoji: ⚡
link: https://gsap.com/docs/v3/
desc: GSAP（GreenSock Animation Platform）是一个高性能 JavaScript 动画引擎。通过 Tween（补间）和 Timeline（时间轴）组织动画，支持 ScrollTrigger、Flip 等插件。适用于 UI 交互、滚动动画、SVG 动效、React/Vue 集成等场景。
---

- **入口**：`import gsap from "gsap"`
- **核心概念**：Tween（单次动画）→ Timeline（时间轴，按顺序组织多个 Tween）→ Plugin（扩展能力）
- **插件注册**：`gsap.registerPlugin(...)`，必须在使用插件能力前调用
- **官方文档**：https://gsap.com/docs/v3/

```javascript
// 最小工作流：import → 注册插件 → 写动画
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.to(".box", {
  x: 200,
  rotation: 45,
  duration: 1,
  ease: "power2.out"
});
```

## 最小工作流
---
lang: javascript
emoji: 🏃
link: https://gsap.com/docs/v3/GSAP/gsap.to()
desc: 最基础的动画流程：选目标 → 定终点 → 配参数 → 执行。
---

### 核心 Tween 四兄弟

- `gsap.to(targets, vars)` — 从当前状态过渡到目标状态
- `gsap.from(targets, fromVars)` — 从初始状态过渡到当前状态
- `gsap.fromTo(targets, fromVars, toVars)` — 显式声明起止状态
- `gsap.set(targets, vars)` — 立即设置值，不创建动画

```javascript
// 入场动画：从 y:50 运动到当前位置
gsap.from(".hero-title", {
  y: 50,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out"
});

// 交互反馈：暂停状态，点击后播放
gsap.to(".card", {
  scale: 1.05,
  duration: 0.2,
  paused: true
});
// 触发：tween.play()
```

### 常用参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `duration` | 动画时长（秒） | `duration: 1` |
| `delay` | 延迟执行 | `delay: 0.5` |
| `ease` | 缓动函数 | `ease: "power2.out"` |
| `repeat` | 重复次数，`-1`=无限 | `repeat: 2` |
| `yoyo` | 来回播放 | `yoyo: true` |
| `stagger` | 批量错峰 | `stagger: 0.1` |
| `paused` | 创建时暂停 | `paused: true` |
| `onStart` / `onUpdate` / `onComplete` | 生命周期回调 | 见下方 |

```javascript
gsap.to(".item", {
  opacity: 1,
  y: 0,
  duration: 0.5,
  stagger: { each: 0.08, from: "start" },
  ease: "power3.out"
});
```

## 高频 Recipes
---
lang: javascript
emoji: 🍳
link: https://gsap.com/docs/v3/GSAP/Timeline/
desc: 按场景组织常用套路，左侧抄命令，右侧理解使用时机。
---

### 1. 列表项依次入场

```javascript
// 批量列表项依次出现，每项间隔 80ms
gsap.from(".item", {
  opacity: 0,
  y: 20,
  duration: 0.4,
  stagger: {
    each: 0.08,
    from: "start"  // "end" | "center" | "random"
  },
  ease: "power2.out"
});
```

### 2. 时间轴串联

```javascript
const tl = gsap.timeline({
  defaults: { duration: 0.5, ease: "power2.out" }
});

tl.from(".hero-title", { y: 30, opacity: 0 })
  .from(".hero-subtitle", { y: 18, opacity: 0 }, "<0.1")   // 紧随前一个
  .from(".hero-cta", { scale: 0.92, opacity: 0 }, ">-0.1")  // 重叠 0.1s
  .addLabel("ready");
```

### 3. ScrollTrigger 滚动驱动

```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.to(".feature-image", {
  y: -80,
  ease: "none",
  scrollTrigger: {
    trigger: ".feature",
    start: "top bottom",    // trigger 顶部接触视口底部
    end: "bottom top",       // trigger 底部接触视口顶部
    scrub: true             // 绑定到滚动进度
  }
});
```

### 4. Flip 布局切换过渡

```javascript
gsap.registerPlugin(Flip);

const state = Flip.getState(".card");  // 拍摄当前状态
document.querySelector(".grid").classList.toggle("is-expanded");
Flip.from(state, {
  duration: 0.45,
  ease: "power2.inOut",
  absolute: true
});
```

### 5. 响应式 matchMedia

```javascript
const mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
  const ctx = gsap.context(() => {
    gsap.from(".sidebar", { x: -40, opacity: 0 });
  });
  return () => ctx.revert();
});

window.addEventListener("resize", () => {
  gsap.matchMediaRefresh();
});
```

### 6. 鼠标跟随（quickTo 追逐函数）

```javascript
const moveX = gsap.quickTo(".cursor", "x", {
  duration: 0.18,
  ease: "power3.out"
});
const moveY = gsap.quickTo(".cursor", "y", {
  duration: 0.18,
  ease: "power3.out"
});

window.addEventListener("pointermove", (event) => {
  moveX(event.clientX);
  moveY(event.clientY);
});
```

## 插件速查
---
lang: javascript
emoji: 🧩
link: https://gsap.com/docs/v3/Plugins/
desc: 所有插件现已 100% 免费（含 ScrollTrigger、Flip、MotionPath、SplitText 等）。
---

| 插件 | 用途 | 关键 API |
|------|------|---------|
| **ScrollTrigger** | 滚动驱动动画 | `ScrollTrigger.create()` `refresh()` `getAll()` |
| **ScrollToPlugin** | 平滑滚动到锚点 | `gsap.to(window, { scrollTo: y })` |
| **Flip** | DOM 布局过渡 | `Flip.getState()` `Flip.from()` |
| **MotionPathPlugin** | 沿 SVG/canvas 路径运动 | `motionPath` |
| **Observer** | 统一鼠标/触控/滚轮输入 | `gsap.observe()` |
| **Draggable** | 拖拽交互 | `Draggable.create()` |
| **TextPlugin** | 文本渐变显示 | `TextPlugin` |
| **SplitText** | 文本拆分动效 | `SplitText.create()` |

```javascript
// SplitText 文本拆分动画
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);
const split = SplitText.create(".headline", { type: "chars,words" });
gsap.from(split.chars, { y: 24, opacity: 0, stagger: 0.03 });
```

## 时间轴与位置语法
---
lang: javascript
emoji: 🧵
link: https://gsap.com/docs/v3/GSAP/Timeline/
desc: Timeline 负责按顺序组织多段动画；位置语法控制时间重叠与间隔。
---

### 基础控制

```javascript
const tl = gsap.timeline();
tl.to(".el", { x: 100 })
  .to(".el", { y: 50 }, "+=0.3")    // 当前末尾再延迟 0.3s
  .to(".el", { scale: 1.2 }, "-=0.2")  // 重叠前一个 0.2s
  .play()
  .pause()
  .reverse()
  .seek("labelName");
```

### 时间位置符号

| 符号 | 含义 |
|------|------|
| `0` | 绝对时间点 |
| `"+=0.3"` | 在当前末尾延迟 0.3s |
| `"-=0.2"` | 与前一个重叠 0.2s |
| `"<"` | 与前一个动画同起点 |
| `">"` | 接在前一个动画结束后 |
| `"label+=0.2"` | 基于标签偏移 |

```javascript
tl.from(".panel", { opacity: 0 }, 0)
  .from(".panel-title", { opacity: 0 }, "<0.1")
  .from(".panel-body", { opacity: 0 }, ">-0.1")
  .from(".panel-actions", { opacity: 0 }, "ready+=0.2");
```

## 缓动函数
---
lang: javascript
emoji: 🌊
link: https://gsap.com/docs/v3/Eases/
desc: 合适的 ease 能让动画更自然。函数值允许按索引生成个性化参数。
---

### 常用 ease

- `"power1.out"` / `"power2.out"` / `"power3.out"` — 常见 UI 进入
- `"power1.inOut"` / `"power2.inOut"` — 前后都平滑
- `"back.out(1.7)"` — 带轻微回弹
- `"elastic.out(1, 0.4)"` — 明显弹性
- `"steps(5)"` — 分段动画
- `"none"` — 线性（常用于 ScrollTrigger scrub）

### ease 组合表

| 场景 | 推荐 ease |
|------|----------|
| 按钮点击反馈 | `power2.out` |
| Modal 入场 | `back.out(1.7)` |
| Loading 循环 | `power1.inOut` |
| 滚动同步动画 | `none` |

```javascript
// 函数值：每项按索引生成不同偏移
gsap.to(".dot", {
  x: (index) => index * 18,
  scale: (index) => 1 + index * 0.08,
  ease: "back.out(1.7)",
  stagger: 0.05
});
```

## 框架集成
---
lang: javascript
emoji: 🧱
link: https://gsap.com/docs/v3/GSAP/gsap.context()
desc: 在 React/Vue 等框架中，用 context() 收拢动画副作用，配合 matchMedia() 处理响应式。
---

### gsap.context() 清理生命周期

```javascript
import gsap from "gsap";

function Component() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".box", { y: 20, opacity: 0 });
    });
    return () => ctx.revert();  // 组件卸载时清理
  }, []);
}
```

### 动态注册插件（按需加载）

```javascript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

## 工具函数
---
lang: javascript
emoji: 🛠️
link: https://gsap.com/docs/v3/GSAP/UtilityMethods/
desc: utils、quickSetter、quickTo 用于高频交互优化与性能调优。
---

| 函数 | 用途 |
|------|------|
| `gsap.utils.toArray(selector)` | 选择器转数组 |
| `gsap.utils.clamp(min, max, value)` | 限制范围 |
| `gsap.utils.interpolate(a, b, progress)` | 按进度插值 |
| `gsap.utils.random(min, max, [integer])` | 生成随机数 |
| `gsap.utils.snap(step, value)` | 按步长吸附 |
| `gsap.quickSetter(target, prop, unit)` | 高性能写值函数 |
| `gsap.quickTo(target, prop, vars)` | 追逐式补间函数 |

```javascript
// 快速吸附到 0.5 的倍数
gsap.utils.snap(0.5, 1.3); // 1.5

// 范围限制
gsap.utils.clamp(0, 100, 150); // 100
```

## 控制与回调
---
lang: javascript
emoji: 🎚️
link: https://gsap.com/docs/v3/GSAP/Tween/eventCallback()
desc: tween/timeline 实例方法用于业务状态控制：暂停、恢复、跳转、重启。
---

| 方法 | 作用 |
|------|------|
| `tween.pause()` | 暂停 |
| `tween.resume()` | 继续 |
| `tween.restart()` | 重头播放 |
| `tween.reverse()` | 反向播放 |
| `tween.progress(value)` | 设置/读取进度（0~1） |
| `tween.kill()` | 销毁 |
| `tween.eventCallback("onComplete", fn)` | 动态绑定回调 |

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
lang: javascript
emoji: 🩺
link: https://gsap.com/docs/v3/GSAP/gsap.config()
desc: 优先用 transform/opacity，避免 layout thrash；布局变化后及时刷新 ScrollTrigger。
---

- **优先属性**：`transform` 和 `opacity`（GPU 加速，不触发 layout）
- **will-change**：只在短时间内为热点元素启用
- **布局变化后**：`ScrollTrigger.refresh()`
- **全局清理触发器**：`ScrollTrigger.getAll().forEach(trigger => trigger.kill())`
- **配置**：`gsap.config({ nullTargetWarn: false })`

```javascript
// 手风琴展开后刷新触发器
document.querySelector(".accordion")
  .addEventListener("transitionend", () => {
    ScrollTrigger.refresh();
  });

// 页面卸载前清理
window.addEventListener("beforeunload", () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
```

## Tween vars 完整配置
---
lang: javascript
emoji: ⚙️
link: https://gsap.com/docs/v3/GSAP/Tween/
desc: Tween 的 vars 对象是 GSAP 的核心配置单元，以下是所有支持的属性分类说明。
---

### 基础动画属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `x` / `y` / `z` | number \| string | 目标位置， 支持 `+=` `-=` 相对值 |
| `rotation` / `rotationX` / `rotationY` | number \| string | 旋转角度（°） |
| `scale` / `scaleX` / `scaleY` | number | 缩放，1 = 原始大小 |
| `opacity` | number | 透明度，0~1 |
| `skewX` / `skewY` | number \| string | 斜切（°） |

```javascript
gsap.to(".box", {
  x: 100,
  y: 50,
  rotation: 45,
  scale: 1.2,
  opacity: 0.8,
  duration: 1
});
```

### 颜色与样式属性

| 属性 | 说明 |
|------|------|
| `fill` | SVG fill 或 CSS background-color |
| `stroke` | SVG stroke 或 CSS border-color |
| `strokeWidth` | 线条宽度 |
| `width` / `height` | 尺寸（含 transition 可能触发 layout） |
| `backgroundColor` | 背景色 |

```javascript
gsap.to(".btn", {
  backgroundColor: "#ff6b6b",
  duration: 0.3
});
```

### 字符串增量

| 语法 | 说明 |
|------|------|
| `x: "+=100"` | 在当前位置基础上右移 100px |
| `y: "-=50"` | 在当前位置基础上上移 50px |
| `rotation: "+=180"` | 顺时针增加 180° |

```javascript
gsap.to(".draggable", {
  x: "+=200",
  duration: 0.5,
  ease: "power2.out"
});
```

### 时间控制

| 属性 | 类型 | 说明 |
|------|------|------|
| `duration` | number | 动画时长（秒），默认 0.3 |
| `delay` | number | 延迟执行（秒） |
| `repeat` | number | 重复次数，`-1` 为无限 |
| `repeatDelay` | number | 每次重复之间的间隔（秒） |
| `yoyo` | boolean | 来回播放（需配合 repeat） |
| `delay` | number | 延迟开始 |

```javascript
gsap.to(".loader", {
  rotation: 360,
  duration: 1,
  repeat: -1,
  repeatDelay: 0.5,
  yoyo: true,
  ease: "power1.inOut"
});
```

### 缓动（ease）

| 属性 | 说明 |
|------|------|
| `ease` | 缓动函数字符串或自定义函数 |
| `easeParams` | 传递给 ease 的额外参数数组 |

```javascript
gsap.to(".modal", {
  y: 0,
  opacity: 1,
  duration: 0.4,
  ease: "back.out(1.7)"  // 带回弹
});
```

### 回调函数

| 属性 | 说明 |
|------|------|
| `onStart` | 动画开始时触发 |
| `onUpdate` | 每一帧更新时触发 |
| `onComplete` | 动画完成时触发 |
| `onRepeat` | 每次重复开始时触发 |
| `onReverse` | 反向播放开始时触发 |
| `onReverseComplete` | 反向播放完成时触发 |
| `onInterrupted` | 被 kill 中断时触发 |

```javascript
gsap.to(".toast", {
  y: 0,
  opacity: 1,
  duration: 0.3,
  onStart: () => console.log("开始"),
  onUpdate: () => console.log("进度:", tween.progress()),
  onComplete: () => console.log("完成")
});
```

### stagger（批量错峰）

| 写法 | 说明 |
|------|------|
| `stagger: 0.1` | 每项间隔 0.1s |
| `stagger: { each: 0.1 }` | 同上 |
| `stagger: { each: 0.1, from: "start" }` | 从头开始 |
| `stagger: { each: 0.1, from: "end" }` | 从尾开始 |
| `stagger: { each: 0.1, from: "center" }` | 从中间开始 |
| `stagger: { each: 0.1, from: "random" }` | 随机顺序 |
| `stagger: { each: 0.1, grid: [rows, cols] }` | 二维网格顺序 |
| `stagger: { each: 0.1, ease: "power2.out" }` | 错峰本身也有 ease |

```javascript
gsap.from(".card", {
  y: 30,
  opacity: 0,
  duration: 0.4,
  stagger: {
    each: 0.08,
    from: "start",
    ease: "power2.inOut"
  }
});
```

### 特殊属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `paused` | boolean | 创建后暂停，默认 false |
| `lazy` | boolean | 延迟渲染，默认 true |
| `overwrite` | boolean \| string | 覆盖同目标动画 |
| `autoSleep` | number | 多少秒无活动自动休眠（默认 60） |
| `snap` | object | 属性吸附配置 |
| `keyframes` | array | 关键帧数组 |
| `cssNamespace` | string | CSS 类名前缀 |

```javascript
// overwrite 示例
gsap.to(".box", { x: 100, duration: 1 });
gsap.to(".box", { x: 50, duration: 1, overwrite: "auto" }); // 自动覆盖前一个

// keyframes 示例
gsap.to(".ball", {
  keyframes: [
    { y: -50, duration: 0.2 },
    { y: 0, duration: 0.2, ease: "bounce.out" }
  ]
});
```

### ScrollTrigger 配置（scrollTrigger）

| 属性 | 说明 |
|------|------|
| `trigger` | 触发元素或选择器 |
| `start` | 开始位置，默认 "top bottom" |
| `end` | 结束位置，默认 "bottom top" |
| `scrub` | 绑定滚动（true / number） |
| `pin` | 固定元素 |
| `pinSpacing` | 固定同时是否保留间距 |
| `toggleActions` | enter/leave/enterBack/leaveBack |
| `markers` | 显示调试标记（开发用） |
| `id` | 唯一标识 |
| `onEnter` / `onLeave` 等 | 生命周期回调 |

```javascript
ScrollTrigger.create({
  trigger: ".section",
  start: "top 80%",
  end: "bottom 20%",
  scrub: 1,
  pin: true,
  pinSpacing: false,
  toggleActions: "play none none reverse",
  markers: false
});
```

### 过滤器与 autoAlpha

| 属性 | 说明 |
|------|------|
| `autoAlpha` | 同时设置 opacity 和 visibility（0 = visibility:hidden） |
| `filter` | CSS filter：`blur() grayscale() saturate()` 等 |

```javascript
gsap.to(".modal", {
  autoAlpha: 1,  // 等效于 opacity:1, visibility:visible
  duration: 0.3
});

gsap.to(".img", {
  filter: "grayscale(100%)",
  duration: 0.5
});
```

## Timeline 完整 API
---
lang: javascript
emoji: 🧵
link: https://gsap.com/docs/v3/GSAP/Timeline/
desc: Timeline 是 GSAP 组织多段动画的核心。除了基础的 add/insert 方法，还有标签控制、进度管理、子timeline等完整能力。
---

### 创建与配置

```javascript
const tl = gsap.timeline({
  defaults: { duration: 0.5, ease: "power2.out" },  // 所有子项的默认值
  paused: false,
  smoothChildTiming: true,    // 子项时间自动校准父级
  align: "sequence",          // 子项对齐方式
  onStart: () => {},
  onComplete: () => {}
});
```

### Timeline 配置选项

| 选项 | 说明 |
|------|------|
| `defaults` | 子项默认 duration / ease |
| `paused` | 创建时暂停 |
| `smoothChildTiming` | 移动子项时自动调整后续时间 |
| `align` | "sequence" / "start" / "normal" |
| `onStart` | timeline 开始回调 |
| `onComplete` | timeline 结束回调 |

### 添加动画（add / insert）

| 方法 | 说明 |
|------|------|
| `tl.to(targets, vars, position)` | 追加 Tween |
| `tl.from(targets, vars, position)` | 追加进入动画 |
| `tl.fromTo(targets, from, to, position)` | 追加起止明确的动画 |
| `tl.set(targets, vars, position)` | 立即设置值 |
| `tl.add(callback, position)` | 添加回调函数 |
| `tl.call(callback, params, position)` | 调用函数（推荐） |
| `tl.addLabel(label, position)` | 添加标签 |

```javascript
const tl = gsap.timeline();

tl.to(".a", { x: 100 })
  .addLabel("phase1")  // 添加标签
  .to(".b", { x: 100 }, "+=0.2")
  .call(() => console.log("回调"), null, "-=0.1")
  .add(() => console.log("直接添加函数"))
  .to(".c", { x: 100 }, "phase1+=0.3");  // 基于标签定位
```

### 标签控制

| 方法 | 说明 |
|------|------|
| `tl.addLabel(label, time)` | 添加标签 |
| `tl.getLabelTime(label)` | 获取标签对应时间 |
| `tl.getLabelsArray()` | 获取所有标签及时间 |

```javascript
tl.addLabel("intro", 0)
  .from(".title", { opacity: 0 }, "intro")
  .from(".body", { opacity: 0 }, "intro+=0.2")
  .addLabel("ready", "+=0.5");

console.log(tl.getLabelTime("ready"));  // 1.7
```

### 时间位置语法（position 参数）

| 符号 | 含义 |
|------|------|
| `0` | 绝对时间 |
| `"+=0.5"` | 相对当前末尾延迟 |
| `"-=0.5"` | 相对当前末尾提前 |
| `"<"` | 与前一项同起点 |
| `">"` | 在前一项结束后 |
| `"label"` | 标签位置 |
| `"label+=0.3"` | 标签后偏移 |
| `"<0.3"` | 前一项开始后 0.3s |
| `">0.3"` | 前一项结束后 0.3s |

```javascript
tl.to(".a", { x: 100 }, 0)         // 绝对时间 0
  .to(".b", { x: 100 }, "+=0.3")    // 当前末尾 +0.3s
  .to(".c", { x: 100 }, "-=0.2")    // 提前 0.2s 插入
  .to(".d", { x: 100 }, "<")        // 与 c 同起点
  .to(".e", { x: 100 }, ">")        // 在 c 结束后
  .to(".f", { x: 100 }, "ready")    // 在 ready 标签处
  .to(".g", { x: 100 }, "ready+=0.5"); // ready 后 0.5s
```

### 播放控制

| 方法 | 说明 |
|------|------|
| `tl.play(fromTime, suppressEvents)` | 播放 |
| `tl.pause(atTime, suppressEvents)` | 暂停 |
| `tl.reverse(fromTime, suppressEvents)` | 反向播放 |
| `tl.restart(fromTime, suppressEvents)` | 重头播放 |
| `tl.seek(timeOrLabel)` | 跳转到时间或标签 |
| `tl.progress(value)` | 设置/获取进度（0~1） |
| `tl.time(value)` | 设置/获取当前时间 |
| `tl.timeScale(value)` | 时间缩放（0.1~10） |

```javascript
tl.play();           // 播放
tl.pause();           // 暂停
tl.reverse();         // 反向
tl.seek("ready");     // 跳到 ready 标签
tl.progress(0.5);     // 跳到 50%
tl.timeScale(2);      // 2 倍速播放
```

### 查询

| 方法 | 说明 |
|------|------|
| `tl.duration()` | 获取总时长 |
| `tl.totalDuration()` | 含重复的总时长 |
| `tl.time()` | 当前时间 |
| `tl.totalTime()` | 当前总时间 |
| `tl.isActive()` | 是否正在播放 |
| `tl.getChildren()` | 获取子 Tween |
| `tl.getById(id)` | 按 id 获取子 Tween |
| `tl.getLabelTime(label)` | 获取标签时间 |

```javascript
console.log(tl.duration());        // 总时长
console.log(tl.totalDuration());   // 含 repeat
console.log(tl.isActive());        // 是否播放中
tl.getChildren();                 // 所有子 Tween
```

### 销毁与回收

| 方法 | 说明 |
|------|------|
| `tl.kill(children, restoreImmediateProps)` | 杀死子项 |
| `tl.clear()` | 清空所有子项 |
| `tl.revert()` | 恢复到初始状态 |

```javascript
tl.kill();           // 杀死整个 timeline
tl.clear();          // 清空
tl.revert();         // 恢复初始
```

### 嵌套 Timeline

| 方法 | 说明 |
|------|------|
| `tl.add(childTimeline, position)` | 嵌套子 timeline |
| 父 timeline 控制子 timeline 时间 | 父 play 时子自动播放 |

```javascript
const innerTl = gsap.timeline({ paused: true });
innerTl.to(".inner", { x: 50 });

const outerTl = gsap.timeline();
outerTl.to(".outer", { x: 100 })
  .add(innerTl, "-=0.2");  // innerTl 作为子 timeline 插入
```

## Quick Ref
---
lang: javascript
emoji: 📋
link: https://gsap.com/docs/v3/GSAP/UtilityMethods/
desc: 一页流快速检索，可直接复制。
---

### 安装

```bash
npm install gsap
# 或 CDN: https://cdnjs.com/libraries/gsap
```

### 插件导入（全部免费）

```javascript
import gsap from "gsap";
import { ScrollTrigger, Flip, SplitText } from "gsap/all";
// 或按需单独导入
import ScrollTrigger from "gsap/ScrollTrigger";
import Flip from "gsap/Flip";
gsap.registerPlugin(ScrollTrigger, Flip);
```

### 核心速查

| 命令 | 说明 |
|------|------|
| `gsap.to() / from() / fromTo() / set()` | 四个基础 Tween |
| `gsap.timeline()` | 时间轴 |
| `gsap.context(fn, scope)` | 生命周期上下文 |
| `gsap.matchMedia()` | 响应式断点 |
| `gsap.quickTo()` | 追逐函数 |
| `gsap.defaults({...})` | 全局默认值 |
