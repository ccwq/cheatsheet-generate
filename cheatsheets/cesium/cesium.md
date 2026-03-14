---
title: CesiumJS
lang: javascript
version: "1.137"
date: "2026-03-02"
github: CesiumGS/cesium
colWidth: 380px
---

# CesiumJS

## 快速定位 / 入口
---
emoji: 🌍
link: https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/
desc: CesiumJS 实战基本都围绕“Viewer 起步 -> 数据上图 -> 交互拾取 -> 相机飞行 -> 性能收敛”展开。
---
- 入口容器：`Viewer`
- 地图底座：`terrain + imagery`
- 业务对象：`Entity` / `DataSource`
- 交互：`ScreenSpaceEventHandler + scene.pick`
- 动态轨迹：`Clock + SampledPositionProperty`

## 起手式：先有一个能看的地球
---
emoji: 🚀
link: https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html
desc: 第一阶段先把 Viewer、token、底图和地形配通，不要一开始就做复杂业务层。
---
- `Cesium.Ion.defaultAccessToken = "..."`：用 ion 资源时先配 token
- `new Cesium.Viewer("app", options)`：创建地图容器
- `terrain: Cesium.Terrain.fromWorldTerrain()`：官方全球地形
- `animation / timeline`：按需关闭 UI
- `requestRenderMode: true`：静态场景省性能

```javascript
import * as Cesium from "cesium";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

const viewer = new Cesium.Viewer("app", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  animation: false,
  timeline: false,
  requestRenderMode: true,
});
```

## Recipe：快速落一个点、标注或模型
---
emoji: 📍
link: https://cesium.com/learn/cesiumjs/ref-doc/Entity.html
desc: 绝大多数业务展示先从 `Entity` 开始，够快也够直观。
---
- 点：`point`
- 图标：`billboard`
- 文本：`label`
- 线面：`polyline` / `polygon`
- 模型：`model`

```javascript
viewer.entities.add({
  name: "天安门",
  position: Cesium.Cartesian3.fromDegrees(116.397, 39.908, 0),
  point: { pixelSize: 12, color: Cesium.Color.CYAN },
  label: {
    text: "天安门",
    pixelOffset: new Cesium.Cartesian2(0, -24),
  },
});
```

## Recipe：加载 GeoJSON / KML / CZML
---
emoji: 🗂️
link: https://cesium.com/learn/cesiumjs/ref-doc/GeoJsonDataSource.html
desc: 数据批量上图时优先走 `DataSource`，不要手写大量 `entities.add(...)`。
---
- `GeoJsonDataSource.load(...)`：最常用
- `KmlDataSource.load(...)`：KML/KMZ
- `CzmlDataSource.load(...)`：时间序列和轨迹
- `viewer.dataSources.add(ds)`：统一挂载
- `viewer.flyTo(ds)`：自动飞到数据范围

```javascript
const geojson = await Cesium.GeoJsonDataSource.load("/data/boundary.geojson", {
  stroke: Cesium.Color.YELLOW,
  fill: Cesium.Color.YELLOW.withAlpha(0.1),
});

viewer.dataSources.add(geojson);
await viewer.flyTo(geojson);
```

## Recipe：相机飞到目标区域
---
emoji: 🎥
link: https://cesium.com/learn/cesiumjs/ref-doc/Camera.html
desc: 用户能感知的跳转优先 `flyTo`，内部状态同步才优先 `setView`。
---
- `viewer.camera.flyTo(...)`：平滑飞行
- `viewer.camera.setView(...)`：直接定位
- `Cartesian3.fromDegrees(...)`：经纬度转世界坐标
- `heading / pitch / roll`：控制视角
- `viewer.zoomTo(target)`：按对象缩放

```javascript
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 12000),
  orientation: {
    heading: Cesium.Math.toRadians(15),
    pitch: Cesium.Math.toRadians(-35),
    roll: 0,
  },
});
```

## Recipe：接鼠标交互和对象拾取
---
emoji: 🖱️
link: https://cesium.com/learn/cesiumjs/ref-doc/ScreenSpaceEventHandler.html
desc: 交互主路径通常是“监听点击 -> pick -> 根据 picked.id 做业务响应”。
---
- `new ScreenSpaceEventHandler(viewer.canvas)`：绑定事件
- `setInputAction(fn, LEFT_CLICK)`：注册点击
- `viewer.scene.pick(position)`：取顶层对象
- `viewer.scene.drillPick(position)`：取多层对象
- `SceneTransforms.wgs84ToWindowCoordinates(...)`：地理坐标转屏幕坐标

```javascript
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

handler.setInputAction((movement) => {
  const picked = viewer.scene.pick(movement.position);
  console.log(picked?.id?.name);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

## Recipe：接入动态轨迹和时间轴
---
emoji: ⏱️
link: https://cesium.com/learn/cesiumjs/ref-doc/SampledPositionProperty.html
desc: 有轨迹回放、航迹、卫星可视化时，尽量用属性插值，不要自己手写动画循环。
---
- `viewer.clock`：统一时间驱动
- `SampledPositionProperty`：轨迹采样点
- `VelocityOrientationProperty`：自动朝向
- `viewer.timeline.zoomTo(start, stop)`：控制时间轴窗口
- `viewer.clock.multiplier`：倍速播放

```javascript
const property = new Cesium.SampledPositionProperty();
property.addSample(
  Cesium.JulianDate.fromIso8601("2026-03-14T00:00:00Z"),
  Cesium.Cartesian3.fromDegrees(116.39, 39.9, 3000)
);
```

## Recipe：把影像和地形调到“业务可用”
---
emoji: 🛰️
link: https://cesium.com/learn/cesiumjs/ref-doc/ImageryLayer.html
desc: 大部分“地图观感不对”的问题，根源在图层顺序、透明度和地形深度测试。
---
- `viewer.imageryLayers.addImageryProvider(...)`：加影像
- `layer.alpha / brightness / contrast`：调观感
- `viewer.scene.globe.depthTestAgainstTerrain = true`：贴地效果更合理
- `viewer.scene.fog.enabled = false`：按需关雾效
- 复杂场景先收敛图层数量，再做高级效果

## 常见坑 / 决策规则
---
emoji: ⚠️
link: https://cesium.com/learn/cesiumjs/ref-doc/Scene.html
desc: Cesium 性能和交互问题，往往来自“把所有东西都放进 Entity + 高频实时渲染”。
---
- 大批量静态对象优先考虑 Primitive，不要无脑堆 Entity
- 鼠标移动事件里避免持续 `pick`
- 地形细节高、影像层多、模型大时要先降复杂度
- 开了 `requestRenderMode` 后，数据变化时记得请求重绘
- 要贴地时优先先确认坐标、高程和 depth test，而不是先怀疑模型
