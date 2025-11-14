# GSAP动画库开发速查提示词

## 基础动画
gsap.to(selector, {x: 100, y: 50, opacity: 0.5, scale: 1.2, rotation: 45, backgroundColor: "#ff0000", color: "#ffffff", duration: 1, delay: 0.5, ease: "power2.inOut", repeat: -1, yoyo: true, stagger: 0.1, onComplete: function(){}, onUpdate: function(){}})

## 时间轴
gsap.timeline({delay: 0.5, paused: true, repeat: 2, repeatDelay: 1, yoyo: true, defaults: {duration: 1, ease: "power2.inOut"}, onComplete: function(){}, onUpdate: function(){}})

## 时间轴方法
tl.to(selector, vars), tl.from(selector, vars), tl.fromTo(selector, fromVars, toVars), tl.set(selector, vars), tl.play(), tl.pause(), tl.resume(), tl.reverse(), tl.restart(), tl.seek(time), tl.progress(value), tl.time(), tl.progress(), tl.isActive()

## 时间轴位置
0.7, "-=0.7", "+=0.7", "label1", "label1+=0.2", "<", ">0.2"

## 缓动函数
"power0" "power1" "power2" "power3" "power4" "circ" "expo" "sine" "elastic" "back" "bounce" "steps", "power2.in" "power2.out" "power2.inOut", "circ.in" "circ.out" "circ.inOut", "expo.in" "expo.out" "expo.inOut", "sine.in" "sine.out" "sine.inOut", "elastic.in" "elastic.out" "elastic.inOut", "back.in" "back.out" "back.inOut", "bounce.in" "bounce.out" "bounce.inOut"

## 选择器
".class", "#id", "[data-attr]", document.querySelector(), document.querySelectorAll(), [elem1, elem2, elem3]

## 错开动画
stagger: 0.1, stagger: {amount: 0.5, from: "start", grid: "auto"}

## 插件
Draggable.create(), ScrollTrigger.create(), MorphSVGPlugin, DrawSVGPlugin, MotionPathPlugin, TextPlugin

## ScrollTrigger
gsap.to(element, {x: 200, scrollTrigger: {trigger: ".section", start: "top center", end: "bottom center", scrub: 1, pin: true, markers: true, toggleActions: "play none reverse"}})

## Draggable
Draggable.create(element, {type: "x,y", bounds: {minX: 0, maxX: 100, minY: 0, maxY: 100}, inertia: true, onDrag: function(){}, onDragEnd: function(){}})

## 实用工具
gsap.utils.random(min, max), gsap.utils.toArray(selector), gsap.utils.distribute(values), gsap.utils.map(array, func), gsap.utils.interpolate(start, end, progress), gsap.utils.clamp(value, min, max), gsap.checkPrefix("transform"), gsap.isTweening(object), gsap.getProperty(element, "x")

## 颜色格式
"red", "#ff0000", "hsl(0, 100%, 50%)", "{r: 255, g: 0, b: 0}", "{h: 0, s: 100, l: 50}", "hsl(+=60, +=20%, 0%)"

## 相对值
x: "+=100", y: "-=45", width: "100vw", height: "50vh", scale: "2x", opacity: "*0.5"

## 特殊属性
autoAlpha: 0, autoRound: true, autoRotate: 180, attr: {r: 50, fill: "#ff0000", stroke: "#00ff00", "stroke-width": 2}, bezier: [{x: 100, y: 100}, {x: 200, y: 50}, {x: 300, y: 150}], motionPath: "#path"

## 性能优化
will-change: transform, opacity, transform: translate3d(0, 0, 0), force3D: true, transformPerspective: 1000, gsap.globalTimeline, gsap.matchMedia(), gsap.ticker.fps(function(fps){}), gsap.config({autoSleep: 60, force3D: false, nullTargetWarn: false})

## 响应式动画
gsap.matchMedia({onChange: (query) => {if (query.matches) {gsap.to(element, {scale: 0.8});} else {gsap.to(element, {scale: 1.2});}}, breakpoint: "(max-width: 768px)"})

## 回调函数
onStart: function(){}, onUpdate: function(){this.targets(), this.vars(), this.ratio, this.progress()}, onComplete: function(){}, onRepeat: function(){}, onReverseComplete: function(){}, onInterrupt: function(){}

## 事件回调
tween.eventCallback("onUpdate", function(){}), tween.eventCallback("onUpdate", null), tween.eventCallback("onComplete", null, false)

## SVG属性
gsap.to("svg", {attr: {r: 50, fill: "#ff0000", stroke: "#00ff00", "stroke-width": 2}})

## 常用动画模式
淡入淡出, 滑动效果, 缩放效果, 旋转动画, 路径动画

## 模块导入
import gsap from "gsap", import {gsap, TimelineMax, Power2} from "gsap", import {ScrollTrigger} from "gsap/ScrollTrigger", import {Draggable} from "gsap/Draggable", gsap.registerPlugin(ScrollTrigger, Draggable)

## 版本兼容
gsap.to(), TweenMax.to(), TimelineLite(), TimelineMax()