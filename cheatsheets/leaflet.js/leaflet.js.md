---
title: Leaflet.js交互式地图开发速查
lang: javascript
version: "1.9.4"
date: "2023-05-18"
github: Leaflet/Leaflet
colWidth: 4
---

# Leaflet.js交互式地图开发速查

## 🗺 地图初始化
---
lang: javascript
link: https://leafletjs.com/reference.html#map-constructor
---

创建地图实例

```javascript
// 通过DOM ID创建
var map = L.map('mapId').setView([51.505, -0.09], 13)

// 通过HTMLElement创建
var map = L.map(document.getElementById('map'), {
    center: [51.505, -0.09],
    zoom: 13,
    preferCanvas: true,
    zoomControl: false
})
```

- `L.map()` : 创建地图实例
- `setView()` : 设置中心点和缩放级别
- `preferCanvas: true` : 使用Canvas渲染提升性能

### 地图Pane

- `mapPane` : 包含所有其他map pane
- `tilePane` : GridLayers和TileLayers (z-index: 200)
- `overlayPane` : 矢量图层 (z-index: 400)
- `shadowPane` : 阴影 (z-index: 500)
- `markerPane` : 标记图标 (z-index: 600)
- `tooltipPane` : 提示 (z-index: 650)
- `popupPane` : 弹窗 (z-index: 700)

## 🎯 视图控制
---
lang: javascript
link: https://leafletjs.com/reference.html#map-methods-for-modifying-map-state
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
map.setZoomAround(offsetPoint, zoom)

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
link: https://leafletjs.com/reference.html#tilelayer
---

加载地图瓦片服务

```javascript
// 标准瓦片图层
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap',
    subdomains: ['a', 'b', 'c'],
    opacity: 1.0,
    zIndex: 1
}).addTo(map)

// 视网膜屏幕支持
L.tileLayer(url, {
    detectRetina: true,
    maxZoom: 19
})

// 自定义URL参数
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar'
})

// 瓦片范围限制
L.tileLayer(url, {
    bounds: [[lat1, lng1], [lat2, lng2]],
    minZoom: 5,
    maxZoom: 15
})
```

### TileLayer.WMS

```javascript
L.tileLayer.wms('http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi', {
    layers: 'nexrad-n0r-900913',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    uppercase: true
}).addTo(map)
```

### GridLayer 选项

```javascript
L.tileLayer(url, {
    tileSize: 256,
    updateWhenIdle: true,
    updateWhenZooming: false,
    updateInterval: 200,
    zIndex: 1,
    maxNativeZoom: 18,
    minNativeZoom: 0,
    noWrap: false,
    keepBuffer: 2
})
```

## 📍 标记系统
---
lang: javascript
link: https://leafletjs.com/reference.html#marker
---

添加标记

```javascript
// 基础标记
L.marker([51.5, -0.09]).addTo(map)

// 带弹窗
L.marker([51.5, -0.09]).bindPopup('Hello').addTo(map)

// 可拖拽标记
L.marker([51.5, -0.09], {
    draggable: true,
    autoPan: true,
    autoPanPadding: [50, 50],
    autoPanSpeed: 10
}).addTo(map)

// 自定义图标
var icon = L.icon({
    iconUrl: 'marker-icon.png',
    iconRetinaUrl: 'marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
})
L.marker([lat, lng], {icon: icon}).addTo(map)

// DivIcon
L.divIcon({
    html: '<div>HTML内容</div>',
    className: 'custom-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
})
```

### Marker 选项

```javascript
L.marker([lat, lng], {
    icon: L.Icon.Default,
    keyboard: true,
    title: '提示文本',
    alt: 'Marker',
    zIndexOffset: 0,
    opacity: 1.0,
    riseOnHover: false,
    riseOffset: 250,
    pane: 'markerPane',
    bubblingMouseEvents: false,
    autoPanOnFocus: true
})
```

### Marker 方法

```javascript
marker.setLatLng([lat, lng])
marker.setZIndexOffset(1000)
marker.setIcon(icon)
marker.setOpacity(0.8)
marker.getLatLng()
marker.getIcon()
marker.toGeoJSON()
```

## 💬 弹窗
---
lang: javascript
link: https://leafletjs.com/reference.html#popup
---

弹出框

```javascript
// 创建弹窗
L.popup().setLatLng([51.5, -0.09]).setContent('内容').addTo(map)

// 快捷方式
map.bindPopup('内容')
marker.bindPopup('Hello', {maxWidth: 200})
```

### Popup 选项

```javascript
L.popup({
    maxWidth: 300,
    minWidth: 50,
    maxHeight: null,
    autoPan: true,
    autoPanPaddingTopLeft: null,
    autoPanPaddingBottomRight: null,
    autoPanPadding: [5, 5],
    keepInView: false,
    closeButton: true,
    autoClose: true,
    closeOnEscapeKey: true,
    closeOnClick: undefined,
    className: ''
})
```

### Popup 方法

```javascript
popup.setLatLng(latlng)
popup.setContent(htmlContent)
popup.getLatLng()
popup.getContent()
popup.getElement()
popup.update()
popup.isOpen()
popup.bringToFront()
popup.bringToBack()
popup.openOn(map)
popup.close()
popup.toggle()
```

## 💡 提示
---
lang: javascript
link: https://leafletjs.com/reference.html#tooltip
---

工具提示

```javascript
// 创建提示
L.tooltip().setLatLng([51.5, -0.09]).setContent('提示').addTo(map)

// 快捷方式
marker.bindTooltip('提示文本')
polyline.bindTooltip('提示', {direction: 'center'})
```

### Tooltip 选项

```javascript
L.tooltip({
    pane: 'tooltipPane',
    offset: [0, 0],
    direction: 'auto',
    permanent: false,
    sticky: false,
    opacity: 0.9
})
```

### Direction 值

- `right` / `left` / `top` / `bottom` / `center` / `auto`

## ⬜ 几何图形
---
lang: javascript
link: https://leafletjs.com/reference.html#path
---

矢量图形

### Polyline

```javascript
L.polyline([
    [45.51, -122.68],
    [37.77, -122.43],
    [34.04, -118.24]
], {
    color: '#ff7800',
    weight: 3,
    opacity: 1,
    smoothFactor: 1.0,
    noClip: false,
    lineCap: 'round',
    lineJoin: 'round',
    dashArray: null,
    dashOffset: null,
    fillColor: undefined,
    fillOpacity: 0.2,
    fillRule: 'evenodd'
}).addTo(map)
```

### Polygon

```javascript
L.polygon([
    [[lat1, lng1], [lat2, lng2], [lat3, lng3]]
], options).addTo(map)
```

### Rectangle

```javascript
L.rectangle([[lat1, lng1], [lat2, lng2]], {
    color: '#ff7800',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map)
```

### Circle

```javascript
L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map)
```

### CircleMarker

```javascript
L.circleMarker([51.508, -0.11], {
    radius: 10,
    fillColor: '#ff7800',
    color: '#ff7800',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}).addTo(map)
```

## 🗂 图层叠加
---
lang: javascript
link: https://leafletjs.com/reference.html#imageoverlay
---

### ImageOverlay

```javascript
L.imageOverlay('image.jpg', [[40.7, -74.2], [40.8, -74.0]], {
    opacity: 0.8,
    alt: '图像描述',
    interactive: false,
    crossOrigin: false,
    errorOverlayUrl: 'error.png',
    zIndex: 1,
    className: ''
}).addTo(map)
```

### VideoOverlay

```javascript
L.videoOverlay('video.webm', bounds, {
    autoplay: true,
    loop: true,
    muted: false,
    playsInline: true
}).addTo(map)
```

### SVGOverlay

```javascript
var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
svgElement.setAttribute('viewBox', "0 0 200 200")
L.svgOverlay(svgElement, bounds).addTo(map)
```

## ⚡ 事件处理
---
lang: javascript
link: https://leafletjs.com/reference.html#events
---

事件监听

```javascript
// 添加监听
map.on('click', function(e) {
    console.log(e.latlng)
})
map.on({
    click: handler,
    dblclick: handler,
    mousedown: handler,
    mouseup: handler,
    mouseover: handler,
    mouseout: handler,
    mousemove: handler
}, handler)

// 移除监听
map.off('click', handler)
map.off('click')

// 只触发一次
map.once('click', handler)

// 触发事件
map.fire('click', {latlng: ...})

// 检查监听
map.listens('click')

// 事件传播
layer.addEventParent(parent)
layer.removeEventParent(parent)
```

### 常用事件类型

- `click` `dblclick` `mousedown` `mouseup`
- `mouseover` `mouseout` `mousemove`
- `contextmenu` `preclick`
- `movestart` `move` `moveend`
- `zoomstart` `zoom` `zoomend`
- `layeradd` `layerremove`
- `popupopen` `popupclose`
- `tooltipopen` `tooltipclose`
- `load` `unload` `viewreset`

### Marker 拖拽事件

```javascript
marker.on('dragstart', handler)
marker.on('movestart', handler)
marker.on('drag', handler)
marker.on('dragend', handler)
marker.on('moveend', handler)
```

## 🎛 控件
---
lang: javascript
link: https://leafletjs.com/reference.html#control
---

### Zoom

```javascript
L.control.zoom({
    position: 'topleft',
    zoomInText: '+',
    zoomInTitle: '放大',
    zoomOutText: '-',
    zoomOutTitle: '缩小'
}).addTo(map)
```

### Scale

```javascript
L.control.scale({
    position: 'bottomleft',
    maxWidth: 100,
    metric: true,
    imperial: true,
    updateWhenIdle: false
}).addTo(map)
```

### Attribution

```javascript
L.control.attribution({
    position: 'bottomright',
    prefix: 'Leaflet'
}).addTo(map)

layer.bindAttribution('&copy; Provider')
```

### Layers

```javascript
L.control.layers(baseLayers, overlays, {
    position: 'topright',
    collapsed: true,
    hideSingleBase: false,
    sortLayers: false,
    sortFunction: function(a, b) { return a.name - b.name }
}).addTo(map)
```

### 自定义控件

```javascript
L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function(map) {
        var div = L.DomUtil.create('div', 'my-control')
        div.innerHTML = 'Custom Control'
        return div
    },
    onRemove: function(map) {}
})
```

## 📊 GeoJSON
---
lang: javascript
link: https://leafletjs.com/reference.html#geojson
---

处理 GeoJSON 数据

```javascript
// 加载GeoJSON
L.geoJSON(data, {
    style: function(feature) {
        return {color: feature.properties.color, weight: 2}
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {radius: 8})
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.name)
    },
    filter: function(feature) {
        return feature.properties.show !== false
    }
}).addTo(map)

// 转换为GeoJSON
geoJSONLayer.toGeoJSON()

// 添加数据
geoJSONLayer.addData(geoJsonObject)
```

## 👥 图层组
---
lang: javascript
link: https://leafletjs.com/reference.html#layergroup
---

### LayerGroup

```javascript
var group = L.layerGroup([layer1, layer2])
group.addTo(map)
group.addLayer(layer)
group.removeLayer(layer)
group.clearLayers()
group.eachLayer(function(layer) {})
```

### FeatureGroup

```javascript
var group = L.featureGroup([layer1, layer2])
group.addTo(map)

// 自动绑定弹出框
group.bindPopup('All in one').openPopup()

// 获取bounds
map.fitBounds(group.getBounds())
```

## 📐 坐标系统
---
lang: javascript
link: https://leafletjs.com/reference.html#crs
---

坐标参考系统

```javascript
// CRS
L.CRS.EPSG3857    // Web Mercator (默认)
L.CRS.EPSG4326    // WGS84
L.CRS.Simple      // 平面坐标
L.CRS.EPSG3395    // WGS84球体

// 创建坐标
L.latLng(lat, lng)
L.latLngBounds(corner1, corner2)
L.latLngBounds(corner1, corner2)

// 坐标转换
map.latLngToLayerPoint(latlng)
map.latLngToContainerPoint(latlng)
map.containerPointToLatLng(point)
map.layerPointToLatLng(point)
map.latLngToGPS(latlng)

// 距离计算
latlng.distanceTo(latlng2)

// Bounds操作
bounds.getCenter()
bounds.contains(latlng)
bounds.intersects(otherBounds)
bounds.isValid()
bounds.pad(buffer)

// 坐标包装
map.wrapLatLng(latlng)
map.wrapLatLngBounds(bounds)

// 投影
map.project(latlng, zoom)
map.unproject(point, zoom)
```

## 🔌 插件扩展
---
lang: javascript
link: https://leafletjs.com/plugins
---

常用插件

### MarkerCluster

```javascript
L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: 80,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 18
}).addLayers(markers).addTo(map)
```

### Leaflet.draw

```javascript
L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        polyline: true,
        circle: true,
        rectangle: true,
        marker: true,
        circlemarker: true
    }
}).addTo(map)
```

### Leaflet.heat

```javascript
L.heatLayer([[lat, lng, intensity], ...], {
    radius: 25,
    blur: 15,
    maxZoom: 17,
    max: 1.0,
    gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
}).addTo(map)
```

## 📱 移动端适配
---
lang: javascript
link: https://leafletjs.com/reference.html#map-options
---

移动端选项

```javascript
L.map('map', {
    tap: true,
    tapTolerance: 15,
    touchZoom: true,
    bounceAtZoomLimits: false,
    zoomSnap: 1,
    zoomDelta: 1,
    wheelDebounceTime: 40,
    wheelPxPerZoomLevel: 60
})
```

### 浏览器检测

```javascript
L.Browser.mobile
L.Browser.touch
L.Browser.retina
L.Browser.ielt9
L.Browser.ie
L.Browser.webkit
L.Browser.android
L.Browser.android23
L.Browser.opera
L.Browser.chrome
L.Browser.gecko
```

## 🛠 实用工具
---
lang: javascript
link: https://leafletjs.com/reference.html#util
---

### 地图状态

```javascript
map.getCenter()
map.getZoom()
map.getBounds()
map.getBoundsZoom(bounds, inside)
map.getSize()
map.getPixelBounds()
map.getPixelOrigin()
map.getMinZoom()
map.getMaxZoom()
map.hasLayer(layer)
```

### Pane 管理

```javascript
map.createPane('myPane')
map.getPane('tilePane')
map.getPanes()
map.getContainer()
```

### 定位

```javascript
map.locate({
    setView: true,
    maxZoom: 16,
    watch: true,
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
})

map.on('locationfound', function(e) {
    L.marker(e.latlng).addTo(map)
})
map.on('locationerror', function(e) {
    console.log(e.message)
})
map.stopLocate()
```

### DOM工具

```javascript
L.DomUtil.get('id')
L.DomUtil.create('div', 'class', container)
L.DomUtil.hasClass(el, 'class')
L.DomUtil.addClass(el, 'class')
L.DomUtil.removeClass(el, 'class')
L.DomUtil.setOpacity(el, 0.5)
L.DomUtil.setPosition(el, point)
L.DomUtil.getPosition(el)
L.DomUtil.remove(el)
```

### 事件工具

```javascript
L.DomEvent.on(el, 'click', handler, context)
L.DomEvent.off(el, 'click', handler)
L.DomEvent.stopPropagation(e)
L.DomEvent.preventDefault(e)
L.DomEvent.getMousePosition(e)
L.DomEvent.getWheelDelta(e)
```

### 通用工具

```javascript
L.Util.stamp(obj)
L.Util.extend(dest, src)
L.Util.bind(fn, obj)
L.Util.template('Hello {name}!', {name: 'World'})
L.Util.formatNum(num, digits)
L.Util.trim(str)
L.Util.splitWords(str)
L.Util.setOptions(layer, options)
L.Util.getParamString(obj)
L.Util.requestAnimFrame(callback)
L.Util.cancelAnimFrame(id)
```

## 🧪 调试测试
---
lang: javascript
---

调试技巧

```javascript
// 事件调试
map.on('click dblclick mousedown', console.log)

// 图层检查
map.eachLayer(function(layer) {
    console.log(layer.constructor.name)
})

// 坐标调试
map.on('click', function(e) {
    console.log('lat:', e.latlng.lat)
    console.log('lng:', e.latlng.lng)
})

// Bounds调试
console.log(map.getBounds())

// 性能
console.time('operation')
operation()
console.timeEnd('operation')
```

## 🔧 Map 选项完整参考
---
lang: javascript
link: https://leafletjs.com/reference.html#map-options
---

### Interaction Options

```javascript
{
    closePopupOnClick: true,
    boxZoom: true,
    doubleClickZoom: true,
    dragging: true,
    zoomSnap: 1,
    zoomDelta: 1,
    trackResize: true,
    keyboard: true,
    keyboardPanDelta: 80,
    scrollWheelZoom: true,
    wheelDebounceTime: 40,
    wheelPxPerZoomLevel: 60,
    tapHold: false,
    tapTolerance: 15,
    touchZoom: true,
    bounceAtZoomLimits: true
}
```

### Panning Inertia Options

```javascript
{
    inertia: true,
    inertiaDeceleration: 3000,
    inertiaMaxSpeed: Infinity,
    easeLinearity: 0.2,
    worldCopyJump: false,
    maxBoundsViscosity: 0.0
}
```

### Map State Options

```javascript
{
    crs: L.CRS.EPSG3857,
    center: undefined,
    zoom: undefined,
    minZoom: undefined,
    maxZoom: undefined,
    layers: [],
    maxBounds: null,
    renderer: undefined
}
```

### Animation Options

```javascript
{
    zoomAnimation: true,
    zoomAnimationThreshold: 4,
    fadeAnimation: true,
    markerZoomAnimation: true,
    transform3DLimit: 8388608
}
```

