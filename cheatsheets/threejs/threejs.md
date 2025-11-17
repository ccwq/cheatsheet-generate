# Three.js 速查

## 核心
- Scene: 场景容器，存放所有对象
- Camera: 相机，定义视角
- Renderer: 渲染器，将场景输出到屏幕
- 动画循环: requestAnimationFrame实现

## 渲染器
- WebGLRenderer: WebGL渲染
- WebGPURenderer: WebGPU渲染，需要浏览器支持
- setPixelRatio: 设置设备像素比
- setSize: 设置渲染尺寸

## 相机
- PerspectiveCamera: 透视相机，模拟人眼
- OrthographicCamera: 正交相机，无透视效果
- lookAt: 设置朝向目标
- updateProjectionMatrix: 更新投影矩阵

## 几何体
- BoxGeometry: 立方体
- SphereGeometry: 球体
- CylinderGeometry: 圆柱体
- CapsuleGeometry: 胶囊体
- BufferGeometry: 自定义几何体

## 材质
- MeshBasicMaterial: 基础材质，不受光照
- MeshLambertMaterial: Lambert漫反射
- MeshPhongMaterial: Phong高光反射
- MeshStandardMaterial: PBR材质
- MeshPhysicalMaterial: 物理材质
- NodeMaterial: TSL节点材质

## 光照
- AmbientLight: 环境光
- HemisphereLight: 半球光
- DirectionalLight: 方向光，模拟太阳
- PointLight: 点光源
- SpotLight: 聚光灯

## 纹理
- TextureLoader: 纹理加载器
- CubeTextureLoader: 立方体贴图
- CanvasTexture: Canvas纹理
- VideoTexture: 视频纹理
- 纹理类型: map, normalMap, roughnessMap, metalnessMap

## 动画
- Clock: 时钟对象
- AnimationMixer: 动画混合器
- AnimationClip: 动画剪辑
- 关键帧: VectorKeyframeTrack, QuaternionKeyframeTrack
- 变形目标: morphAttributes

## 加载器
- GLTFLoader: glTF/GLB模型加载
- DRACOLoader: Draco压缩解码
- FBXLoader: FBX模型加载
- OBJLoader: OBJ模型加载

## 控制器
- OrbitControls: 轨道控制
- FirstPersonControls: 第一人称
- FlyControls: 飞行控制
- TransformControls: 对象变换控制

## 后处理
- EffectComposer: 效果合成器
- RenderPass: 渲染通道
- UnrealBloomPass: 辉光效果
- FilmPass: 胶片效果

## 物理 (新增)
- AmmoPhysics: Ammo.js物理引擎
- RapierPhysics: Rapier物理引擎
- createRigidBody: 创建刚体

## 工具
- Raycaster: 射线拾取
- MathUtils: 数学工具函数
- WebGLRenderTarget: 离屏渲染
- LoadingManager: 资源加载管理

## 性能
- dispose: 释放内存
- BufferGeometry: 缓冲几何体更高效
- 实例化: InstancedMesh批量渲染
- 合并几何体: 减少draw call