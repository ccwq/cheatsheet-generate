---
title: Leaflet.js 2.x 交互式地图开发速查
lang: javascript
version: "2.0.0-alpha.1"
date: "2025-05-18"
github: Leaflet/Leaflet
colWidth: 4
---

# Leaflet.js 2.x 交互式地图开发速查

> ⚠️ Leaflet 2.0.0 为测试版本，部分 API 与 1.x 不兼容

## 🗺 地图初始化 (ESM)
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#map-constructor
---

创建地图实例 (ESM 模块方式)

```javascript
// ESM 导入 (推荐)
import { Map, tileLayer, control } from 'leaflet';

// 使用构造函数 (2.0 新方式)
const map = new Map('mapId').setView([51.505, -0.09], 13)

// 通过 HTMLElement 创建
const map = new Map(document.getElementById('map'), {
    center: [51.505, -0.09],
    zoom: 13,
    preferCanvas: true,
    zoomControl: false
})

// 使用 LeafletMap 别名
import { LeafletMap } from 'leaflet';
const map = new LeafletMap('map', { center: [0, 0], zoom: 2 })
```

- `Map` / `LeafletMap` : 直接构造函数 (2.0 新API)
- `setView()` : 设置中心点和缩放级别
- `preferCanvas: true` : 使用 Canvas 渲染

### 地图 Pane

- `mapPane` : 包含所有其他 map pane
- `tilePane` : GridLayers 和 TileLayers (z-index: 200)
- `overlayPane` : 矢量图层 (z-index: 400)
- `shadowPane` : 阴影 (z-index: 500)
- `markerPane` : 标记图标 (z-index: 600)
- `tooltipPane` : 提示 (z-index: 650)
- `popupPane` : 弹窗 (z-index: 700)

## 🎯 视图控制
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#map-methods-for-modifying-map-state
---

地图视图操作方法

```javascript
// 视图设置
map.setView([lat, lng], zoom)
map.setZoom(zoom)

// 缩放控制
map.zoomIn()
map.zoomOut()
map.zoomIn(delta)
map.zoomOut(delta)

// 缩放并保持点固定
map.setZoomAround(latlng, zoom)

// 平移动画
map.panTo([lat, lng])
map.panBy(point)
map.flyTo([lat, lng], zoom)

// 边界控制
map.fitBounds(bounds)
map.fitWorld()
map.setMaxBounds(bounds)
map.setMinZoom(zoom)
map.setMaxZoom(zoom)
map.panInsideBounds(bounds)
map.panInside(latlng)

// 停止动画
map.stop()
```

## 🧱 瓦片图层
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#tilelayer
---

加载地图瓦片服务

```javascript
import { Map, tileLayer } from 'leaflet';

const map = new Map('map');

// 标准瓦片图层
tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap',
}).addTo(map);

// 自定义瓦片
tileLayer('https://example.com/{z}/{x}/{y}.png', {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 18,
    subdomains: 'abc',
    errorTileUrl: 'img/error.png',
    tms: false,
    zoomOffset: 0,
    zoomReverse: false,
    detectRetina: true,
    crossOrigin: 'anonymous'
}).addTo(map);
```

## 📍 标记系统
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#marker
---

标记和自定义图标

```javascript
import { Map, marker, icon, DivIcon } from 'leaflet';

// 基础标记
marker([51.5, -0.09]).addTo(map)
    .bindPopup('<b>Hello!</b>');

// 自定义图标
const myIcon = icon({
    iconUrl: 'marker-icon.png',
    iconRetinaUrl: 'marker-icon-2x.png',
    shadowUrl: 'marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
marker([51.5, -0.09], { icon: myIcon }).addTo(map);

// DivIcon (HTML 图标)
const divIcon = new DivIcon({
    className: 'my-div-icon',
    html: '<div class="marker-pin"></div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
});
```

## 💬 弹窗
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#popup
---

绑定弹窗信息

```javascript
import { popup } from 'leaflet';

// 绑定弹窗
marker.bindPopup('<b>内容</b>')
marker.bindPopup((layer) => {
    return `坐标: ${layer.getLatLng()}`;
});

// 打开/关闭
marker.openPopup()
marker.closePopup()

// 多种方式
marker.bindPopup('信息', {
    maxWidth: 200,
    minWidth: 50,
    maxHeight: 300,
    autoPan: true,
    keepInView: false,
    closeButton: true,
    autoClose: true,
    className: 'custom-popup'
});
```

## 💡 提示
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#tooltip
---

鼠标悬停提示信息

```javascript
import { tooltip } from 'leaflet';

// 绑定提示
marker.bindTooltip('提示内容')
marker.bindTooltip((layer) => {
    return `ID: ${layer.feature.properties.id}`;
});

// 永久提示
marker.bindTooltip('内容', { permanent: true, direction: 'top' })

// 打开/关闭
marker.openTooltip()
marker.closeTooltip()
```

## ⬜ 几何图形
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#path
---

绘制矢量图形

```javascript
import { polyline, polygon, rectangle, circle, circleMarker } from 'leaflet';

// 折线
polyline([[51.5, -0.09], [51.5, -0.12], [51.52, -0.13]], {
    color: 'blue',
    weight: 3,
    opacity: 0.8,
    smoothFactor: 1.0
}).addTo(map);

// 多边形
polygon([[51.5, -0.09], [51.5, -0.12], [51.52, -0.13]], {
    color: 'purple',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map);

// 矩形
rectangle([[51.5, -0.09], [51.52, -0.12]], {
    color: 'black',
    fillOpacity: 0.1
}).addTo(map);

// 圆形 (半径单位: 米)
circle([51.5, -0.09], {
    radius: 500,
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map);

// 圆形标记 (半径单位: 像素)
circleMarker([51.5, -0.09], {
    radius: 10,
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map);
```

## 🔷 图层叠加
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#featuregroup
---

图层组和 FeatureGroup

```javascript
import { featureGroup, LayerGroup, layerGroup } from 'leaflet';

// 图层组
const layerGroup1 = layerGroup([
    marker([51.5, -0.09]),
    circle([51.5, -0.09], { radius: 200 })
]);
layerGroup1.addTo(map);

// FeatureGroup (可交互)
const group = featureGroup([marker1, marker2]);
map.fitBounds(group.getBounds());

// 管理图层
layerGroup.addLayer(marker);
layerGroup.removeLayer(marker);
layerGroup.clearLayers();
group.eachLayer((layer) => { /* ... */ });
```

## 🖱️ 事件处理 (PointerEvents)
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#events
---

事件监听 (2.0 使用 PointerEvents)

```javascript
import { Map, marker, Evented } from 'leaflet';

// 地图事件
map.on('click', (e) => {
    console.log('点击位置:', e.latlng);
});
map.on('dblclick', (e) => { /* ... */ });
map.on('pointerdown', (e) => { /* 指针事件 (2.0) */ });
map.on('pointermove', (e) => { /* ... */ });
map.on('pointerup', (e) => { /* ... */ });

// 移除事件
map.off('click');
map.off();

// 一次性事件
map.once('click', (e) => { /* ... */ });

// 缩放事件
map.on('zoomstart', () => { /* 开始缩放 */ });
map.on('zoomend', () => { /* 缩放结束 */ });
map.on('movestart', () => { /* 开始移动 */ });
map.on('moveend', () => { /* 移动结束 */ });

// Layer 事件
layer.on('click', (e) => { /* ... */ });
layer.on({
    click: handler,
    mouseover: handler,
    mouseout: handler
});
```

> ⚠️ 2.0 废弃: `mouseover`, `mouseout`, `mousedown`, `mouseup`, `mousemove`, `dblclick`, `contextmenu` - 请使用 `pointer*` 事件

## 🎛️ 控件
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#control
---

地图控件

```javascript
import { control, zoom, scale, attribution } from 'leaflet';

// 缩放控件 (默认)
control.zoom().addTo(map);
control.zoom({ position: 'topright' }).addTo(map);

// 比例尺
control.scale({ position: 'bottomleft', imperial: true, metric: true }).addTo(map);

// 属性控件
control.attribution({ position: 'bottomright', prefix: 'Leaflet' }).addTo(map);

// 自定义控件
const MyControl = control({}, {
    onAdd: (map) => {
        const div = L.DomUtil.create('div', 'my-control');
        div.innerHTML = '自定义控件';
        return div;
    }
});
MyControl.addTo(map);

// 位置
control.zoom({ position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright' })
```

## 📊 GeoJSON
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#geojson
---

GeoJSON 数据处理

```javascript
import { geoJSON, setOptions } from 'leaflet';

const geojson = {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-0.09, 51.5]
    },
    "properties": { "name": "London" }
};

// 创建 GeoJSON 图层
geoJSON(geojson, {
    style: (feature) => {
        return { color: 'red' };
    },
    onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.name);
    },
    pointToLayer: (feature, latlng) => {
        return circleMarker(latlng, { radius: 8 });
    },
    filter: (feature) => {
        return feature.properties.name !== undefined;
    }
}).addTo(map);

// 交互
const layer = geoJSON(data);
layer.getLayers(); // 返回所有图层
layer.toGeoJSON(); // 导出为 GeoJSON
```

## 🗂 图层管理
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#map-methods-for-layers
---

图层增删改查

```javascript
// 添加图层
map.addLayer(layer)

// 移除图层
map.removeLayer(layer)
map.removeLayer(layerId)

// 清除所有图层
map.eachLayer((layer) => { map.removeLayer(layer); })

// 查找图层
map.hasLayer(layer)
map.getLayer(layerId)

// 图层控制
const overlays = { "标记": markerLayer };
const baseLayers = { "OSM": tileLayer1 };
control.layers(baseLayers, overlays).addTo(map);
```

## 📐 坐标系统
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#latlng
---

坐标和投影

```javascript
import { LatLng, LatLngBounds, CRS, Util } from 'leaflet';

// LatLng
const latlng = new LatLng(51.5, -0.09);
const latlng2 = latlng1.clone();
latlng1.equals(latlng2);
latlng.distanceTo(latlng2); // 米
latlng.toBounds(size); // LatLngBounds

// LatLngBounds
const bounds = new LatLngBounds(
    new LatLng(51.5, -0.09),
    new LatLng(51.6, 0)
);
const bounds2 = bounds1.extend(latlng);
bounds.contains(latlng);
bounds.intersects(otherBounds);
bounds.pad(bufferRatio); // 扩大边界

// CRS (坐标参考系统)
CRS.EPSG3857 // Web Mercator (默认)
CRS.EPSG4326 // 经纬度
CRS.Simple // 简单平面

// 坐标转换
map.latLngToContainerPoint(latlng);
map.containerPointToLatLng(point);
map.latLngToLayerPoint(latlng);
map.layerPointToLatLng(point);
map.getSize();
map.getPixelOrigin();
```

## 🔌 插件扩展
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#class
---

扩展 Leaflet

```javascript
import { Class, Map, Layer } from 'leaflet';

// 创建自定义类
const MyClass = Class.extend({
    initialize: (options) => {
        setOptions(this, options);
    },
    foo: (arg) => { return arg; },
    options: { bar: 1 }
});

// 创建自定义图层
const MyLayer = Layer.extend({
    onAdd: (map) => {
        this._map = map;
        this._initLayer();
    },
    onRemove: (map) => {
        this._removeLayer();
    },
    options: { color: 'red' }
});

// 创建自定义地图方法
Map.include({
    myMethod: () => { /* ... */ }
});

// 创建自定义地图事件
Map.addInitHook('myMethod');
```

## 📱 移动端适配
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#map-options
---

触摸和移动端支持

```javascript
const map = new Map('map', {
    // 手势
    dragging: true,
    tap: true,
    tapTolerance: 15,

    // 缩放
    zoomControl: true,
    zoomSnap: 1,      // 缩放吸附
    zoomDelta: 1,     // 缩放步长

    // 惯性
    inertia: true,
    inertiaDeceleration: 0.25,
    inertiaMaxSpeed: Infinity,

    // 双指缩放
    zoomAnimation: true,
    markerZoomAnimation: true,

    // 移动端检测
    whenReady: () => {
        if (Util.mobile()) {
            // 移动端逻辑
        }
    }
});
```

## 🔧 实用工具
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#util
---

常用工具函数

```javascript
import { Util, DomUtil, Browser, LatLng, TemplateEngine } from 'leaflet';

// DOM 操作
DomUtil.create('div', 'class');
DomUtil.get('id');
DomUtil.addClass(el, 'name');
DomUtil.removeClass(el, 'name');
DomUtil.setClass(el, 'name');
DomUtil.hasClass(el, 'name');

// 浏览器检测
Browser.ielt9;
Browser.webkit;
Browser.android;
Browser.android23;
Browser.chrome;
Browser.mobile;
Browser.mobileWebkit;
Browser.retina;

// 工具函数
Util.setOptions(obj, options);
Util.extend(dest, src);
Util.createObject(proto, properties);
Util.bind(func, obj);
Util.stamp(obj);
Util.throttle(func, time, context);
Util.debounce(func, time, context);
Util.trim(str);
Util.template(str, data);

// 模板引擎
TemplateEngine.test('{name}', { name: 'World' }); // "World"
```

## 🧪 调试测试
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#map-methods-for-getting-state
---

调试和状态获取

```javascript
// 获取状态
map.getCenter();
map.getZoom();
map.getBounds();
map.getBoundsZoom(bounds);
map.getMinZoom();
map.getMaxZoom();
map.getSize();
map.getPixelOrigin();
map.getPixelBounds();
map.getContainer();

// 图层信息
map.hasLayer(layer);
map.getLayerId(layer);
map.getLayers();
map.getPane(name);
map.getPanes();

// 坐标转换
map.layerPointToContainerPoint(point);
map.layerPointToLatLng(point);
map.latLngToContainerPoint(latlng);
map.latLngToLayerPoint(latlng);

// 事件调试
map.on('click', (e) => {
    console.log('latlng:', e.latlng);
    console.log('layerPoint:', e.layerPoint);
    console.log('containerPoint:', e.containerPoint);
    console.log('originalEvent:', e.originalEvent);
});
```

## ⚙️ Map 选项完整参考
---
lang: javascript
link: https://leafletjs.com/reference-2.0.0.html#map-options
---

Map 构造函数所有选项

```javascript
const map = new Map('map', {
    // 渲染
    preferCanvas: false,

    // 视图
    center: [0, 0],
    zoom: 0,
    minZoom: 0,
    maxZoom: 18,
    maxBounds: null,

    // 交互
    dragging: true,
    touchZoom: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: true,
    keyboard: true,
    tap: true,
    tapTolerance: 15,

    // 缩放
    zoomControl: true,
    zoomSnap: 1,
    zoomDelta: 1,
    trackContainerResize: true,

    // 动画
    zoomAnimation: true,
    zoomAnimationThreshold: 4,
    fadeAnimation: true,
    markerZoomAnimation: true,
    transform3DLimit: 8388608,

    // 惯性
    inertia: true,
    inertiaDeceleration: 0.2,
    inertiaMaxSpeed: 15,

    // 控件位置
    zoomControlPosition: 'topleft',

    // CRS
    crs: L.CRS.EPSG3857,

    // Pane
    pane: 'mapPane',
    markerPane: 'markerPane',
    tooltipPane: 'tooltipPane',
    popupPane: 'popupPane',

    // 窗口事件
    closePopupOnSkipBubble: false,
});
```
