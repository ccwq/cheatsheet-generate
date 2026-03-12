---
title: three.js
lang: javascript
version: "0.180.0"
date: "2025-11-17"
github: mrdoob/three.js
colWidth: 360px
---

# three.js

## 场景最小骨架
---
emoji: 🎬
link: https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
desc: `Scene + Camera + Renderer + animation loop` 是所有 three.js 项目的最小闭环。
---
- `new THREE.Scene()` : 创建场景
- `new THREE.PerspectiveCamera(fov, aspect, near, far)` : 透视相机
- `new THREE.WebGLRenderer({ antialias: true })` : WebGL 渲染器
- `renderer.setSize(width, height)` : 设置视口尺寸
- `renderer.setAnimationLoop(render)` : 渲染循环，兼容 XR/WebGPU

```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color("#0b1220");

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
```

## 相机与视口
---
emoji: 📷
link: https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
desc: 相机参数和 resize 同步是最容易遗漏的基础动作。
---
- `PerspectiveCamera` : 带透视效果，最常用
- `OrthographicCamera` : 正交相机，适合编辑器和 2.5D
- `camera.position.set(x, y, z)` : 设置位置
- `camera.lookAt(x, y, z)` : 朝向目标
- `camera.updateProjectionMatrix()` : 修改参数后刷新投影

```javascript
function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);
```

## 几何体与网格
---
emoji: 🧱
link: https://threejs.org/docs/#api/en/core/BufferGeometry
desc: Geometry 只负责顶点数据，真正可渲染对象通常是 `Mesh`。
---
- `BoxGeometry` : 立方体
- `SphereGeometry` : 球体
- `PlaneGeometry` : 平面
- `BufferGeometry` : 自定义几何体基类
- `new THREE.Mesh(geometry, material)` : 将几何体与材质组合为可渲染对象

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: "#38bdf8" });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

## 材质与纹理
---
emoji: 🎨
link: https://threejs.org/docs/#api/en/materials/MeshStandardMaterial
desc: `MeshStandardMaterial` 是 PBR 默认主力，纹理通常按 map 系列接入。
---
- `MeshBasicMaterial` : 不受光照影响
- `MeshStandardMaterial` : 标准 PBR 材质
- `MeshPhysicalMaterial` : 更完整的物理属性
- `TextureLoader` : 加载 2D 纹理
- `map/normalMap/roughnessMap/metalnessMap` : 常用贴图槽位

```javascript
const textureLoader = new THREE.TextureLoader();
const albedo = textureLoader.load("/textures/wood/basecolor.jpg");
const normal = textureLoader.load("/textures/wood/normal.jpg");

const material = new THREE.MeshStandardMaterial({
  map: albedo,
  normalMap: normal,
  roughness: 0.8
});
```

## 颜色管理
---
emoji: 🌈
link: https://threejs.org/manual/en/color-management.html
desc: 贴图发灰或颜色失真时，优先检查 color space，而不是先怀疑灯光。
---
- `THREE.ColorManagement.enabled` : 默认启用
- `texture.colorSpace = THREE.SRGBColorSpace` : 标记颜色贴图
- `renderer.outputColorSpace = THREE.SRGBColorSpace` : 设置输出色彩空间
- 法线、粗糙度、金属度等数据贴图通常保持默认色彩空间

```javascript
const colorMap = textureLoader.load("/textures/basecolor.jpg");
colorMap.colorSpace = THREE.SRGBColorSpace;

renderer.outputColorSpace = THREE.SRGBColorSpace;
```

## 灯光与阴影
---
emoji: 💡
link: https://threejs.org/docs/#api/en/lights/DirectionalLight
desc: 阴影链路通常是“灯光 castShadow + mesh cast/receiveShadow + renderer.shadowMap.enabled”。
---
- `AmbientLight` : 环境光
- `DirectionalLight` : 方向光，常模拟太阳
- `PointLight` : 点光源
- `SpotLight` : 聚光灯
- `renderer.shadowMap.enabled = true` : 启用阴影

```javascript
renderer.shadowMap.enabled = true;

const sun = new THREE.DirectionalLight("#ffffff", 2.2);
sun.position.set(4, 8, 3);
sun.castShadow = true;
scene.add(sun);

cube.castShadow = true;
cube.receiveShadow = true;
```

## 控制器
---
emoji: 🕹️
link: https://threejs.org/docs/#examples/en/controls/OrbitControls
desc: 大多数 Demo 会先接 `OrbitControls`，它是调试和浏览场景的标配。
---
- `OrbitControls` : 轨道控制
- `TransformControls` : 编辑器式平移旋转缩放
- `FirstPersonControls` : 第一人称漫游
- `FlyControls` : 飞行模式

```javascript
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
```

## 资源加载
---
emoji: 📥
link: https://threejs.org/docs/#examples/en/loaders/GLTFLoader
desc: `GLTFLoader` 是主流模型格式入口，压缩资源通常搭配 Draco 或 KTX2。
---
- `TextureLoader` : 加载贴图
- `GLTFLoader` : 加载 glTF/GLB
- `DRACOLoader` : 解码 Draco 压缩网格
- `KTX2Loader` : 加载压缩纹理
- `LoadingManager` : 统一监听加载过程

```javascript
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const draco = new DRACOLoader();
draco.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(draco);

loader.load("/models/robot.glb", (gltf) => {
  scene.add(gltf.scene);
});
```

## 动画系统
---
emoji: 🎞️
link: https://threejs.org/docs/#api/en/animation/AnimationMixer
desc: 模型自带动画用 `AnimationMixer`，程序化动画可配合 `Clock` 与手写更新循环。
---
- `Clock` : 计算帧间 delta
- `AnimationMixer` : 动画状态机
- `AnimationClip` : 动画片段
- `mixer.clipAction(clip)` : 创建动作
- `action.play()` : 播放动作

```javascript
const clock = new THREE.Clock();
let mixer;

loader.load("/models/robot.glb", (gltf) => {
  scene.add(gltf.scene);
  mixer = new THREE.AnimationMixer(gltf.scene);
  mixer.clipAction(gltf.animations[0]).play();
});

renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();
  mixer?.update(delta);
  renderer.render(scene, camera);
});
```

## 射线拾取与交互
---
emoji: 🎯
link: https://threejs.org/docs/#api/en/core/Raycaster
desc: 鼠标选中、hover 高亮和点击对象几乎都基于 `Raycaster`。
---
- `new THREE.Raycaster()` : 创建射线投射器
- `new THREE.Vector2()` : 记录归一化鼠标坐标
- `raycaster.setFromCamera(pointer, camera)` : 从屏幕坐标发射射线
- `raycaster.intersectObjects(scene.children, true)` : 获取命中结果

```javascript
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX / window.innerWidth * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  console.log(hits[0]?.object);
});
```

## 后处理
---
emoji: ✨
link: https://threejs.org/docs/#examples/en/postprocessing/EffectComposer
desc: 后处理让辉光、景深、色调映射等效果从“有画面”进阶到“有氛围”。
---
- `EffectComposer` : 通道调度器
- `RenderPass` : 基础渲染通道
- `UnrealBloomPass` : 泛光
- `OutputPass` : 输出阶段

```javascript
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.7, 0.2, 0.85));

renderer.setAnimationLoop(() => {
  composer.render();
});
```

## WebGPU 与 TSL
---
emoji: 🧪
link: https://threejs.org/docs/#api/en/renderers/webgpu/WebGPURenderer
desc: 官方新版手册建议从 `three/webgpu` 入口使用 WebGPU，传统 `EffectComposer` 流程不应原样照搬。
---
- `WebGPURenderer` : WebGPU 渲染器
- `NodeMaterial` : 节点材质系统
- `TSL` : three.js Shading Language
- `renderer.init()` : WebGPU 初始化
- `import * as THREE from "three/webgpu"` : WebGPU 推荐入口
- `import "three/tsl"` : TSL 能力入口
- WebGPU 下后处理需要按新栈组织 : 不直接照抄传统 `EffectComposer`

```javascript
import * as THREE from "three/webgpu";

const renderer = new THREE.WebGPURenderer({ antialias: true });
await renderer.init();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

## 性能与释放
---
emoji: 🩺
link: https://threejs.org/manual/en/introduction/How-to-dispose-of-objects.html
desc: three.js 最常见问题不是“不会画”，而是“资源不释放、draw call 太高、像素比太满”。
---
- `geometry.dispose()` : 释放几何体 GPU 资源
- `material.dispose()` : 释放材质资源
- `texture.dispose()` : 释放纹理
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` : 限制像素比
- `InstancedMesh` : 大量重复对象时减少 draw call
- `frustumCulled` : 利用视锥裁剪减少无效渲染

```javascript
function destroyMesh(mesh) {
  mesh.geometry?.dispose();

  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((material) => material.dispose());
  } else {
    mesh.material?.dispose();
  }

  scene.remove(mesh);
}
```
