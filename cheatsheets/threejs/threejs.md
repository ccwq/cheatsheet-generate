---
title: three.js
lang: javascript
version: "0.182.0"
date: "2025-12-10"
github: mrdoob/three.js
colWidth: 380px
---

# three.js

## 快速定位 / 入口
---
emoji: 🎬
link: https://threejs.org/manual/en/creating-a-scene.html
desc: three.js 最常见的任务不是背 API，而是快速搭起“场景 -> 相机 -> 光照 -> 模型 -> 交互”的工作流。
---
- 起手骨架：`Scene + Camera + Renderer`
- 可见物体：`Mesh(geometry, material)`
- 真实质感：`MeshStandardMaterial + Light`
- 加模型：`GLTFLoader`
- 做交互：`Raycaster`
- 做进阶渲染：`EffectComposer` / `WebGPU`

## 起手式：先把场景跑起来
---
emoji: 🚀
link: https://threejs.org/manual/en/creating-a-scene.html
desc: 第一阶段只解决“能看到东西”，不要一上来就堆模型、后处理和复杂材质。
---
- `new THREE.Scene()`：创建场景
- `new THREE.PerspectiveCamera()`：最常用相机
- `new THREE.WebGLRenderer({ antialias: true })`：默认起点
- `renderer.setAnimationLoop(render)`：统一渲染循环
- `renderer.setSize(...)`：同步视口大小

```javascript
import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#0f172a");

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
```

## Recipe：先放一个能打光的物体
---
emoji: 🧱
link: https://threejs.org/docs/#api/en/materials/MeshStandardMaterial
desc: 调材质之前先把光照补齐，否则你会误以为材质或贴图有问题。
---
- 几何体：`BoxGeometry` / `SphereGeometry`
- 材质：`MeshStandardMaterial`
- 主光：`DirectionalLight`
- 补光：`AmbientLight`
- 阴影：`castShadow / receiveShadow`

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: "#38bdf8", roughness: 0.4 });
const mesh = new THREE.Mesh(geometry, material);

const ambient = new THREE.AmbientLight("#ffffff", 0.35);
const sun = new THREE.DirectionalLight("#ffffff", 2);
sun.position.set(5, 8, 6);

scene.add(mesh, ambient, sun);
```

## Recipe：处理 resize，避免视图拉伸
---
emoji: 📐
link: https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
desc: 相机和 renderer 必须一起改，漏掉 `updateProjectionMatrix()` 就会出问题。
---
- 更新 `camera.aspect`
- 调 `camera.updateProjectionMatrix()`
- 调 `renderer.setSize(...)`
- 高分屏通常限制像素比到 `2`

```javascript
function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

addEventListener("resize", resize);
```

## Recipe：加载 glTF / GLB 模型
---
emoji: 📦
link: https://threejs.org/docs/#examples/en/loaders/GLTFLoader
desc: three.js 实战里大多数模型流程都围绕 `GLTFLoader` 展开。
---
- `GLTFLoader`：加载 glTF / GLB
- `scene.add(gltf.scene)`：挂到主场景
- `AnimationMixer`：播放模型动画
- `DRACOLoader`：启用 Draco 压缩支持
- `KTX2Loader`：压缩纹理更省显存

```javascript
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const gltf = await loader.loadAsync("/models/robot.glb");
gltf.scene.position.y = -1;
scene.add(gltf.scene);
```

## Recipe：做鼠标拾取和高亮
---
emoji: 🖱️
link: https://threejs.org/docs/#api/en/core/Raycaster
desc: 交互核心是“屏幕坐标 -> NDC -> 射线 -> 求交对象”。
---
- `Vector2`：存 NDC 鼠标坐标
- `Raycaster`：射线检测
- `raycaster.setFromCamera(pointer, camera)`：从相机出发
- `intersectObjects(list, true)`：检测命中

```javascript
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function onPointerMove(event) {
  pointer.x = (event.clientX / innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  console.log(hits[0]?.object?.name);
}
```

## Recipe：接动画和后处理，但别拆多套循环
---
emoji: ✨
link: https://threejs.org/docs/#examples/en/postprocessing/EffectComposer
desc: 动画、控制器、后处理都应该进同一条渲染循环，不要各跑各的。
---
- `Clock`：算 `delta`
- `AnimationMixer`：更新模型动画
- `EffectComposer`：组织后处理
- `RenderPass`：基础 pass
- `UnrealBloomPass`：Bloom

```javascript
const clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();
  mixer?.update(delta);
  composer ? composer.render() : renderer.render(scene, camera);
});
```

## Recipe：想试 WebGPU / TSL 时怎么渐进迁移
---
emoji: 🧪
link: https://threejs.org/manual/en/webgpu.html
desc: WebGPU 更适合按实验模块逐步替换，不适合全项目一次切换。
---
- 先保留 WebGL 主路径
- 新模块单独试 `WebGPURenderer`
- 有 `navigator.gpu` 再启用
- 新材质/节点逻辑逐步迁到 TSL
- 保持 fallback，别让整个应用只剩实验渲染后端

```javascript
import { WebGPURenderer } from "three/webgpu";

if ("gpu" in navigator) {
  const renderer = new WebGPURenderer({ antialias: true });
  await renderer.init();
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);
}
```

## 常见坑 / 决策规则
---
emoji: ⚠️
link: https://threejs.org/manual/en/introduction/How-to-dispose-of-objects.html
desc: three.js 卡顿和画面异常，通常不是单一 API 用错，而是 workflow 失序。
---
- 看不到物体时先查相机、灯光、near/far、材质类型
- 模型大时先压缩网格和纹理，再谈代码优化
- 纹理、几何体、材质不用后记得 `dispose()`
- `setPixelRatio(devicePixelRatio)` 在高分屏成本很高，通常限制到 `2`
- 不要同时混用多套 render loop
