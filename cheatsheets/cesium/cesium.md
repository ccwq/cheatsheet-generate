---
title: CesiumJS
lang: javascript
version: "1.137"
date: "2026-01-05"
github: CesiumGS/cesium
colWidth: 380px
---

# CesiumJS

## 快速定位 / 入口
---
emoji: 🌍
link: https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/
desc: CesiumJS 的主线不是背完全部类名，而是先把“Viewer 起步 -> 数据上图 -> 相机与拾取 -> 动态时间轴 -> 性能收敛”这一条业务链打通，再按 API 分组补细节。
---
- 首先记住入口：`Viewer`
- 业务展示层优先：`Entity` / `DataSource`
- 需要大规模静态渲染时再下沉：`Primitive`
- 地图底座通常是：`terrain + imagery + globe`
- 拾取链路通常是：`ScreenSpaceEventHandler + scene.pick`
- 动态轨迹通常是：`Clock + JulianDate + SampledPositionProperty`
- 三维内容常见入口：`Cesium3DTileset` / `Model`

## 起手式：先搭一个可控 Viewer
---
emoji: 🚀
link: https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html
desc: 第一阶段只解决“能看到、能飞、能拾取、能控性能”，不要一开始就把业务状态、复杂样式和实时动画全部压进去。
---
- `Cesium.Ion.defaultAccessToken`：使用 ion 资源前先配置 token
- `new Cesium.Viewer("app", options)`：标准应用入口
- `terrain: Cesium.Terrain.fromWorldTerrain()`：官方全球地形快捷入口
- `animation / timeline / baseLayerPicker`：非必需 UI 按需关闭
- `requestRenderMode: true`：静态场景优先开启
- `scene3DOnly: true`：只做三维时可减少额外模式开销

```javascript
import * as Cesium from "cesium";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

const viewer = new Cesium.Viewer("app", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  animation: false,
  timeline: false,
  baseLayerPicker: false,
  requestRenderMode: true,
  scene3DOnly: true,
});

viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.clock.shouldAnimate = false;
```

## Recipe：数据上图路线怎么选
---
emoji: 🗂️
link: https://cesium.com/learn/cesiumjs/ref-doc/DataSource.html
desc: Cesium 实战最容易失控的地方是“所有数据都用一种方式上图”。先按数据形态选路线，再决定是否下沉到底层 API。
---
| 数据类型 | 优先 API | 适合场景 | 什么时候别这样用 |
| --- | --- | --- | --- |
| 少量交互对象 | `viewer.entities.add(...)` | 点位、标注、业务对象面板联动 | 成千上万静态对象 |
| GeoJSON/KML/CZML | `GeoJsonDataSource` `KmlDataSource` `CzmlDataSource` | 标准格式导入、快速上线 | 需要极细粒度渲染控制 |
| 海量静态对象 | `Primitive` `GeometryInstance` | 批量线面、聚合渲染 | 需要现成属性系统和描述式写法 |
| 海量三维瓦片 | `Cesium3DTileset` | 城市、BIM、倾斜摄影、点云 | 只是几台设备模型或少量 glTF |
| 单体模型 | `Model.fromGltfAsync` / `entity.model` | 设备、车辆、单机体 | 需要瓦片级流式调度 |

```javascript
const geojson = await Cesium.GeoJsonDataSource.load("/data/roads.geojson", {
  stroke: Cesium.Color.CYAN,
  fill: Cesium.Color.CYAN.withAlpha(0.12),
  clampToGround: true,
});

viewer.dataSources.add(geojson);
await viewer.flyTo(geojson);
```

## Recipe：相机、拾取、弹窗联动
---
emoji: 🖱️
link: https://cesium.com/learn/cesiumjs/ref-doc/ScreenSpaceEventHandler.html
desc: 常见交互链路通常是“飞过去 -> 点击拾取 -> 拿到业务对象 -> 定位 DOM 浮层”。核心不是事件本身，而是把世界坐标、屏幕坐标和业务 ID 串起来。
---
- 相机跳转优先 `viewer.flyTo(...)` / `camera.flyTo(...)`
- 立即同步状态优先 `camera.setView(...)`
- 顶层命中用 `scene.pick(position)`
- 多层命中用 `scene.drillPick(position)`
- 地表坐标求取常用 `camera.pickEllipsoid(...)` 或 `scene.pickPosition(...)`
- 浮层定位常用 `SceneTransforms.wgs84ToWindowCoordinates(...)`

```javascript
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

handler.setInputAction((movement) => {
  const picked = viewer.scene.pick(movement.position);
  if (!picked?.id) return;

  const position = picked.id.position?.getValue(viewer.clock.currentTime);
  const screen = position
    ? Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position)
    : undefined;

  console.log({
    id: picked.id.id,
    name: picked.id.name,
    screenX: screen?.x,
    screenY: screen?.y,
  });
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

## Recipe：时间轴、轨迹、动画怎么接
---
emoji: ⏱️
link: https://cesium.com/learn/cesiumjs/ref-doc/SampledPositionProperty.html
desc: 只要涉及轨迹回放、飞行器、卫星、车辆或传感器扫掠，就不要自己手写定时器平移，优先回到 Cesium 的时钟和属性系统。
---
- `viewer.clock`：全局时间源
- `JulianDate`：Cesium 内部标准时间类型
- `SampledPositionProperty`：位置采样插值
- `TimeIntervalCollection`：分段有效期
- `VelocityOrientationProperty`：按速度自动朝向
- `PathGraphics`：直接渲染历史轨迹

```javascript
const start = Cesium.JulianDate.fromIso8601("2026-03-18T00:00:00Z");
const stop = Cesium.JulianDate.addMinutes(start, 30, new Cesium.JulianDate());

const path = new Cesium.SampledPositionProperty();
path.addSample(start, Cesium.Cartesian3.fromDegrees(116.39, 39.90, 3000));
path.addSample(stop, Cesium.Cartesian3.fromDegrees(117.20, 40.10, 3200));

viewer.entities.add({
  availability: new Cesium.TimeIntervalCollection([
    new Cesium.TimeInterval({ start, stop }),
  ]),
  position: path,
  orientation: new Cesium.VelocityOrientationProperty(path),
  path: { width: 3, material: Cesium.Color.LIME },
  model: { uri: "/models/drone.glb", minimumPixelSize: 64 },
});

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.shouldAnimate = true;
viewer.timeline.zoomTo(start, stop);
```

## Recipe：3D Tiles、glTF、贴地效果的组合用法
---
emoji: 🏙️
link: https://cesium.com/learn/cesiumjs/ref-doc/Cesium3DTileset.html
desc: 城市场景常见做法不是单押某一个 API，而是 `Cesium3DTileset` 承载环境，`Entity/Model` 承载业务对象，地形和深度测试负责贴地一致性。
---
- 城市或倾斜摄影主场景优先 `Cesium3DTileset`
- 单体设备、车辆、无人机优先 `Model` 或 `entity.model`
- 批量裁切常用 `ClippingPlaneCollection`
- 样式筛选常用 `Cesium3DTileStyle`
- 贴地相关先检查：`heightReference`、地形、深度测试、模型本地坐标

```javascript
const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(123456);
viewer.scene.primitives.add(tileset);
await viewer.zoomTo(tileset);

tileset.style = new Cesium.Cesium3DTileStyle({
  color: {
    conditions: [
      ["${Height} >= 120", "color('orange', 0.9)"],
      ["true", "color('white', 0.7)"],
    ],
  },
});
```

## Recipe：影像、地形、WMS/WMTS 服务接入
---
emoji: 🗺️
link: https://cesium.com/learn/cesiumjs/ref-doc/ImageryLayer.html
desc: 很多业务项目的真实起点不是 `world terrain`，而是企业内部 WMTS、WMS、ArcGIS 或单张纠偏影像，所以底图接入本身就应该是一张独立卡片。
---
- XYZ/模板瓦片优先 `UrlTemplateImageryProvider`
- 标准地图服务优先 `WebMapServiceImageryProvider` / `WebMapTileServiceImageryProvider`
- ArcGIS 服务优先 `ArcGisMapServerImageryProvider`
- 影像层叠加用 `viewer.imageryLayers`
- 高程回填用 `sampleTerrainMostDetailed(...)`
- 业务底图调观感优先看 `alpha` `brightness` `contrast` `gamma`

```javascript
const imagery = new Cesium.ImageryLayer(
  new Cesium.WebMapTileServiceImageryProvider({
    url: "https://example.com/wmts",
    layer: "base",
    style: "default",
    format: "image/png",
    tileMatrixSetID: "EPSG:3857",
  }),
  { alpha: 0.95 }
);

viewer.imageryLayers.add(imagery);
```

## Recipe：对象太多时，下沉到 Primitive
---
emoji: 🧱
link: https://cesium.com/learn/cesiumjs/ref-doc/Primitive.html
desc: 当实体数量上来后，真正的拐点不是“再调几个参数”，而是承认 Entity 层已经不合适，转去批量实例和更轻的 collection。
---
- 批量点优先 `PointPrimitiveCollection`
- 批量图标优先 `BillboardCollection`
- 批量文本优先 `LabelCollection`
- 大量同构几何优先 `GeometryInstance + Primitive`
- 贴地线面优先 `GroundPolylinePrimitive` / `GroundPrimitive`
- 需要按实例着色时看 `PerInstanceColorAppearance`

```javascript
const points = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());

points.add({
  position: Cesium.Cartesian3.fromDegrees(116.39, 39.9),
  color: Cesium.Color.YELLOW,
  pixelSize: 8,
});
```

## 常见坑 / 性能决策
---
emoji: ⚠️
link: https://cesium.com/learn/cesiumjs/ref-doc/Scene.html
desc: Cesium 的性能问题通常不是单个参数配错，而是数据建模、渲染层次和交互频率同时失序。
---
- 静态海量对象优先考虑 `Primitive`，不要默认全塞进 `Entity`
- 鼠标移动事件里避免高频 `pick` / `drillPick`
- 开启 `requestRenderMode` 后，业务状态变化记得触发重绘
- 影像层过多、地形细节过高、模型过大时先降复杂度，再谈微优化
- 贴地错位优先排查 `heightReference`、地形加载状态、坐标系和深度测试
- 3D Tiles 调优优先看 `maximumScreenSpaceError`、样式复杂度和裁剪范围
- 模型多时先控制纹理和几何规模，不要只盯着 JavaScript 层

## API 分组：应用入口与全局配置
---
emoji: 🧭
link: https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html
desc: 这一组 API 决定应用怎么启动、挂哪些默认部件，以及全局 token、时钟和 UI 状态由谁控制。
---
- `Viewer`：默认首选入口，带 widgets、数据源集合、时钟和场景
- `CesiumWidget`：更轻量的底层入口，只保留核心渲染容器
- `Ion`：ion token 与默认服务入口
- `Clock`：时间推进、速度、循环方式
- `ClockViewModel`：把时钟状态暴露给控件层
- `HomeButton` `SceneModePicker` `ProjectionPicker` `FullscreenButton`：常用 widget 组件
- `SelectionIndicator` `InfoBox`：对象选中与信息展示
- `DataSourceCollection`：统一管理多个数据源

## API 分组：Widgets 与内置控件
---
emoji: 🧩
link: https://cesium.com/learn/cesiumjs/ref-doc/HomeButton.html
desc: 如果你不是做全自定义壳子，这一组控件会直接决定应用默认交互和工具栏能力。
---
- `HomeButton`：回到默认视角
- `BaseLayerPicker`：切换底图与地形
- `SceneModePicker`：切换 2D/3D/哥伦布视图
- `ProjectionPicker`：切换投影
- `NavigationHelpButton`：导航帮助
- `Timeline`：时间轴组件
- `Animation`：时间播放控件
- `InfoBox`：描述信息弹窗
- `SelectionIndicator`：选中高亮
- `CesiumInspector` `Cesium3DTilesInspector` `VoxelInspector`：调试类 widget

## API 分组：场景、相机与渲染
---
emoji: 🎥
link: https://cesium.com/learn/cesiumjs/ref-doc/Scene.html
desc: 这一组 API 控制“看什么、怎么看、渲染到什么程度”，是 Cesium 整体表现的核心。
---
- `Scene`：渲染主对象，负责 primitive、globe、post-process、pick
- `Camera`：飞行、定位、视锥、坐标变换
- `ScreenSpaceCameraController`：鼠标和触摸导航行为
- `Globe`：地球本体、地形、地表深度测试、雾效
- `SkyBox` `SkyAtmosphere` `Sun` `Moon`：天空与天体环境
- `PostProcessStage` `PostProcessStageCollection`：后处理链
- `ShadowMap`：阴影控制
- `SceneMode`：`3D` / `2D` / `Columbus View`
- `FrameRateMonitor`：帧率监控和降级策略

## API 分组：坐标、数学与时间
---
emoji: 📐
link: https://cesium.com/learn/cesiumjs/ref-doc/Cartesian3.html
desc: Cesium 很多“看起来是业务 bug”的问题，本质都是坐标、矩阵或时间类型用错。
---
- `Cartesian2` `Cartesian3` `Cartesian4`：屏幕、世界和齐次坐标
- `Cartographic`：经纬高表达
- `Rectangle` `BoundingSphere` `BoundingRectangle`：范围与包围体
- `HeadingPitchRoll` `HeadingPitchRange`：朝向和相机偏移
- `Quaternion` `Matrix3` `Matrix4`：姿态与变换
- `Transforms`：局部坐标与地固坐标变换
- `JulianDate`：时间计算与比较
- `TimeInterval` `TimeIntervalCollection`：时间片段控制
- `CesiumMath`（命名空间为 `Cesium.Math`）：角度、插值、容差比较

## API 分组：几何构造器与空间范围
---
emoji: 📦
link: https://cesium.com/learn/cesiumjs/ref-doc/GeometryInstance.html
desc: 进入 Primitive 体系后，真正要背的是 Geometry 家族，而不是 Entity 上那些更高层的 graphics 字段。
---
- `BoxGeometry`：盒体
- `CircleGeometry` `CircleOutlineGeometry`：圆与圆轮廓
- `CorridorGeometry`：走廊带状面
- `CylinderGeometry`：圆柱
- `EllipseGeometry` `EllipseOutlineGeometry`：椭圆
- `EllipsoidGeometry`：椭球
- `PolygonGeometry`：多边形
- `PolylineGeometry`：折线
- `RectangleGeometry`：矩形区域
- `WallGeometry`：围墙
- `CoplanarPolygonGeometry`：共面多边形
- `BoundingSphere` `OrientedBoundingBox`：范围与包围盒

## API 分组：实体系统与图形对象
---
emoji: 📍
link: https://cesium.com/learn/cesiumjs/ref-doc/Entity.html
desc: 这是最常用的业务层 API，描述式写法强、联动简单，适合绝大多数中小规模项目。
---
- `Entity`：统一承载位置、名称、可见性与各类 graphics
- `EntityCollection`：实体集合
- `PointGraphics`：点渲染
- `BillboardGraphics`：图标精灵
- `LabelGraphics`：文字标注
- `PolylineGraphics` `PolygonGraphics` `CorridorGraphics`：线与面
- `EllipseGraphics` `EllipsoidGraphics` `BoxGraphics` `CylinderGraphics` `PlaneGraphics`：基础几何体
- `WallGraphics` `RectangleGraphics`：围墙与矩形区域
- `ModelGraphics`：实体式 glTF 模型
- `PathGraphics`：轨迹尾迹
- `TilesetGraphics`：把 3D Tiles 作为实体管理

## API 分组：属性与动态更新
---
emoji: 🔁
link: https://cesium.com/learn/cesiumjs/ref-doc/Property.html
desc: Cesium 的动态能力大量建立在 Property 抽象上，很多样式与位置都不是直接塞值，而是塞“随时间求值的对象”。
---
- `Property`：统一属性接口
- `ConstantProperty`：固定值
- `CallbackProperty`：按需动态计算，适合实时状态映射
- `SampledProperty` `SampledPositionProperty`：按采样时间插值
- `TimeIntervalCollectionProperty`：分时段属性
- `CompositeProperty` `CompositePositionProperty`：多段组合
- `PositionPropertyArray`：位置属性数组
- `ReferenceProperty`：引用其他实体属性
- `VelocityVectorProperty` `VelocityOrientationProperty`：按运动方向驱动姿态

## API 分组：DataSource 与数据格式
---
emoji: 🧾
link: https://cesium.com/learn/cesiumjs/ref-doc/GeoJsonDataSource.html
desc: 标准格式导入、批量展示、时间动态表达，大多都在这一层解决，不必回到低层渲染。
---
- `DataSource`：数据源抽象基类
- `CustomDataSource`：自己组织实体集合时最好用的容器
- `GeoJsonDataSource`：GeoJSON / TopoJSON 常用入口
- `KmlDataSource`：KML / KMZ
- `CzmlDataSource`：时序场景和轨迹表达
- `DataSourceCollection`：挂到 `viewer.dataSources`
- `EntityCluster`：点位聚合
- `exportKml`：将实体导出为 KML

## API 分组：影像、地形与地球表面
---
emoji: 🛰️
link: https://cesium.com/learn/cesiumjs/ref-doc/ImageryLayer.html
desc: 这组 API 决定地图底座和贴地观感，也是业务地图“像不像”的关键。
---
- `ImageryLayer` `ImageryLayerCollection`：影像层与层栈
- `UrlTemplateImageryProvider`：XYZ/模板瓦片最常见
- `WebMapServiceImageryProvider`：WMS
- `WebMapTileServiceImageryProvider`：WMTS
- `ArcGisMapServerImageryProvider`：ArcGIS 服务
- `SingleTileImageryProvider` `TileMapServiceImageryProvider`：单图与 TMS
- `CesiumTerrainProvider`：Cesium 地形服务
- `Terrain`：官方便捷工厂，如 `Terrain.fromWorldTerrain()`
- `sampleTerrain` `sampleTerrainMostDetailed`：按地形回填高程
- `Globe.depthTestAgainstTerrain`：贴地对象遮挡判断

## API 分组：材质、Appearance 与渲染外观
---
emoji: 🎨
link: https://cesium.com/learn/cesiumjs/ref-doc/Material.html
desc: 业务里“样式不够”经常不是要上 shader，而是先把 Cesium 现成的 Material 和 Appearance 体系用对。
---
- `ColorMaterialProperty`：实体层纯色材质
- `ImageMaterialProperty`：图片贴图材质
- `StripeMaterialProperty` `CheckerboardMaterialProperty` `GridMaterialProperty`：规则材质
- `PolylineGlowMaterialProperty` `PolylineOutlineMaterialProperty` `PolylineArrowMaterialProperty`：线材质
- `Material`：底层 material/Fabric 定义
- `MaterialAppearance`：primitive 通用外观
- `EllipsoidSurfaceAppearance`：贴地/椭球表面外观
- `PerInstanceColorAppearance`：按实例颜色渲染
- `PolylineMaterialAppearance` `PolylineColorAppearance`：线外观

## API 分组：3D Tiles、模型与裁剪
---
emoji: 🏗️
link: https://cesium.com/learn/cesiumjs/ref-doc/Cesium3DTileset.html
desc: 这组 API 是 Cesium 的高价值区域，城市级、BIM、点云和大规模三维内容基本都靠它。
---
- `Cesium3DTileset`：3D Tiles 主入口
- `Cesium3DTileStyle`：按属性做颜色、显隐和条件表达式
- `Cesium3DTileFeature`：单要素访问
- `Cesium3DTilesVoxelProvider`：体素数据入口
- `Model`：直接加载 glTF/glb
- `ModelGraphics`：实体式模型封装
- `ModelAnimationCollection`：模型动画控制
- `CustomShader`：模型/瓦片自定义着色
- `ClippingPlane` `ClippingPlaneCollection`：裁切
- `ClassificationType`：地形/3D Tiles 分类投射

## API 分组：贴地、分类与环境效果
---
emoji: 🌄
link: https://cesium.com/learn/cesiumjs/ref-doc/ClassificationPrimitive.html
desc: 这一组 API 解决的是“对象和地表、瓦片、天空、粒子效果如何正确叠加”的问题。
---
- `HeightReference`：`NONE` `CLAMP_TO_GROUND` `RELATIVE_TO_GROUND`
- `GroundPrimitive` `GroundPolylinePrimitive`：贴地渲染
- `ClassificationPrimitive`：把面或体投射到地形/3D Tiles
- `ClassificationType`：只分地形、只分瓦片或都分
- `DistanceDisplayCondition`：按距离裁剪显示
- `ShadowMode`：阴影模式
- `ParticleSystem`：粒子效果
- `Fog` `SkyAtmosphere`：环境效果
- `GlobeTranslucency`：地球半透明

## API 分组：Primitive 与底层渲染
---
emoji: 🧱
link: https://cesium.com/learn/cesiumjs/ref-doc/Primitive.html
desc: 当实体层抽象太重、数量太大或渲染控制不够细时，就进入 Primitive 体系。
---
- `Primitive`：底层可渲染对象
- `GroundPrimitive`：贴地 primitive
- `ClassificationPrimitive`：分类渲染
- `GeometryInstance`：批量实例化几何
- `PerInstanceColorAppearance` `MaterialAppearance` `PolylineMaterialAppearance`：外观控制
- `BillboardCollection` `LabelCollection` `PointPrimitiveCollection`：轻量批量点图层
- `PolylineCollection`：大量线对象
- `PrimitiveCollection`：底层集合
- `GroundPolylinePrimitive`：贴地线

## API 分组：交互、拾取与屏幕空间
---
emoji: 🖱️
link: https://cesium.com/learn/cesiumjs/ref-doc/SceneTransforms.html
desc: 业务交互几乎都绕不开屏幕空间事件、拾取和世界坐标到像素坐标的转换。
---
- `ScreenSpaceEventHandler`：事件绑定中心
- `ScreenSpaceEventType`：点击、移动、滚轮、触摸等事件枚举
- `CameraEventType`：相机手势事件枚举
- `Scene.pick` `Scene.drillPick`：命中检测
- `Scene.pickPosition`：从深度缓冲反推三维位置
- `Camera.pickEllipsoid`：没有深度时的球体拾取
- `SceneTransforms.wgs84ToWindowCoordinates`：世界坐标转屏幕坐标
- `IntersectionTests` `Ray`：射线和几何求交

## API 分组：工具类与资源访问
---
emoji: 🧰
link: https://cesium.com/learn/cesiumjs/ref-doc/Resource.html
desc: 这一组不是最常被提起，但在资源加载、颜色、材质、事件与调试阶段非常常用。
---
- `Resource`：统一资源请求、query 参数与重试
- `IonResource`：ion 资源访问
- `Request` `RequestScheduler`：请求排队与并发调度
- `TaskProcessor`：Worker 任务处理
- `Color` `NearFarScalar` `DistanceDisplayCondition`：样式辅助类型
- `Event` `EventHelper`：事件派发与订阅整理
- `DeveloperError` `RuntimeError`：错误类型
- `defaultValue` `defined`：常见工具函数
- `PinBuilder`：程序化图标生成
- `createWorldImageryAsync`：官方全球影像快捷入口
