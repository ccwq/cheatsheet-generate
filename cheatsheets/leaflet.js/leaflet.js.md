# Leaflet.js交互式地图开发速查提示词

## 地图初始化
L.map('mapId', {center: [lat, lng], zoom: level, zoomControl: true, scrollWheelZoom: true, dragging: true, keyboard: true, touchZoom: true, doubleClickZoom: true, boxZoom: true, minZoom: 1, maxZoom: 18, maxBounds: bounds})

## 视图控制
map.setView([lat, lng], zoom), map.setZoom(zoom), map.zoomIn(delta), map.zoomOut(delta), map.panTo([lat, lng]), map.flyTo([lat, lng], zoom, {duration: 2}), map.fitBounds(bounds, {padding: [20, 20]}), map.setMaxBounds(bounds)

## 瓦片图层
L.tileLayer('https://{s}.domain.com/{z}/{x}/{y}.png', {attribution: '© attribution', maxZoom: 19, subdomains: ['a','b','c'], opacity: 1.0, zIndex: 1}), L.tileLayer.wms(url, {layers: 'layer_name', format: 'image/png', transparent: true, version: '1.1.1'})

## 标记系统
L.marker([lat, lng], {icon: L.icon({iconUrl: 'url', iconSize: [25, 41], iconAnchor: [12, 41]}), draggable: true, title: '标题', alt: '描述', opacity: 1.0}).addTo(map), L.divIcon({html: 'HTML内容', className: 'class', iconSize: [30, 42]})

## 弹窗提示
L.popup({maxWidth: 300, autoPan: true, closeButton: true, autoClose: true, className: 'custom-popup'}).setLatLng([lat, lng]).setContent('内容').openOn(map), marker.bindPopup('内容'), marker.bindTooltip('提示', {permanent: false, direction: 'auto', sticky: false, opacity: 0.9})

## 几何图形
L.polyline([[lat, lng], ...], {color: '#ff7800', weight: 3, opacity: 1, fillColor: '#ff7800', fillOpacity: 0.5, dashArray: '5,10'}), L.polygon([[lat, lng], ...], options), L.circle([lat, lng], {color: 'red', fillColor: '#f03', fillOpacity: 0.5, radius: 500}), L.circleMarker([lat, lng], {radius: 10}), L.rectangle([[lat, lng], [lat, lng]], options)

## 事件处理
map.on('click dblclick mousedown mouseup mouseover mouseout movestart move moveend zoomstart zoomend layeradd layerremove', handler), map.off('event', handler), map.fire('event', data), marker.on('click dblclick dragstart drag dragend mouseover mouseout', handler)

## 控件系统
L.control.zoom({position: 'topleft', zoomInText: '+', zoomOutText: '-'}).addTo(map), L.control.scale({position: 'bottomleft', maxWidth: 100, metric: true, imperial: true}).addTo(map), L.control.attribution({position: 'bottomright', prefix: 'Leaflet'}).addTo(map), L.control.layers(baseLayers, overlays, {position: 'topright', collapsed: true}).addTo(map)

## GeoJSON处理
L.geoJSON(data, {style: function(feature){return {color: feature.properties.color, weight: 2, fillOpacity: 0.6}}, pointToLayer: function(feature, latlng){return L.circleMarker(latlng, {radius: 8, fillColor: '#ff7800'})}, onEachFeature: function(feature, layer){layer.bindPopup(feature.properties.name)}, filter: function(feature){return feature.properties.show !== false}})

## 图层组管理
L.layerGroup([layer1, layer2]), L.featureGroup([layer1, layer2]), group.addLayer(layer), group.removeLayer(layer), group.clearLayers(), group.eachLayer(function(layer){console.log(layer)}), map.addLayer(group), map.removeLayer(group)

## 坐标系统
L.latLng(lat, lng), L.latLngBounds(corner1, corner2), L.CRS.EPSG3857, L.CRS.EPSG4326, L.CRS.Simple, map.latLngToLayerPoint(latlng), map.latLngToContainerPoint(latlng), latlng.distanceTo(latlng2), bounds.getCenter(), bounds.contains(latlng)

## 插件扩展
L.markerClusterGroup({chunkedLoading: true, maxClusterRadius: 80, spiderfyOnMaxZoom: true}), L.heatLayer([[lat, lng, intensity], ...], {radius: 25, blur: 15, maxZoom: 17}), L.Control.Draw({edit: {featureGroup: group}, draw: {polygon: true, polyline: true, circle: true}})

## 性能优化
preferCanvas: true, renderer: L.canvas(), updateWhenIdle: false, 分批加载大量标记, 视图范围内标记管理, requestAnimationFrame优化动画, 大数据使用Canvas渲染器, 标记聚合优化

## 移动端适配
tap: true, tapTolerance: 15, touchZoom: true, bounceAtZoomLimits: false, zoomSnap: 1, zoomDelta: 1, wheelDebounceTime: 40, wheelPxPerZoomLevel: 60, L.Browser.mobile检测, resize和orientationchange事件处理

## 实用工具
map.getCenter(), map.getZoom(), map.getBounds(), map.getSize(), map.hasLayer(layer), map.eachLayer(callback), L.DomUtil.create('div', 'class', parent), L.DomEvent.on(element, 'click', handler), L.Util.stamp(obj), L.Util.extend(dest, src), L.Util.bind(fn, obj), L.Util.template('Hello {name}!', {name: 'World'})

## 调试测试
map.on('all events', console.log), performance.now()计时, performance.memory监控, map.eachLayer(function(layer){console.log(layer.constructor.name, map.hasLayer(layer))}), 图层状态检查, 事件流调试