---
title: Capacitor 速查
lang: bash
version: "8.3.0"
date: 2026-03-25
github: ionic-team/capacitor
colWidth: 450px
---

# Capacitor 速查

## 🧭 一眼入口
---
lang: bash
emoji: 🧭
desc: Capacitor 是跨平台原生运行时，让 Web 应用（React/Vue/Angular/纯 HTML）能打包成 iOS/Android 原生 App，并通过插件访问原生设备功能。
---

### 安装命令

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

### 核心组件

| 包 | 作用 |
|---|---|
| `@capacitor/core` | 核心运行时 |
| `@capacitor/cli` | CLI 命令行工具 |
| `@capacitor/ios` | iOS 平台支持 |
| `@capacitor/android` | Android 平台支持 |
| `@capacitor/web` | Web 平台支持 |

---

## ⚡ 最小工作流
---
lang: bash
emoji: ⚡
desc: 从零到跑起 iOS/Android App 的最短路径
---

```bash
# 1. 初始化（已有 Web 项目）
npx cap init "MyApp" "com.example.myapp"

# 2. 添加平台
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# 3. 构建 Web 产物
npm run build

# 4. 同步到原生项目
npx cap sync

# 5. 打开 IDE 运行
npx cap open ios    # Xcode
npx cap open android  # Android Studio
```

### 目录结构

```
项目根/
├── Web 应用代码/
│   ├── src/
│   └── dist/          # 构建产物目录
├── ios/               # 原生 iOS 项目
├── android/           # 原生 Android 项目
└── capacitor.config.ts
```

---

## 📦 高频场景 Recipes

### 场景1：日常开发（Live Reload）

```bash
# 启动开发服务器 + 实时刷新
npx cap run ios --livereload
npx cap run android --livereload

# 指定设备
npx cap run ios --target "iPhone 16"
```

### 场景2：正式打包

```bash
# 构建 Web 产物
npm run build

# 同步并打包（iOS 需要签名配置）
npx cap sync ios
npx cap build ios

# Android 生成 APK/AAB
npx cap sync android
npx cap build android
```

### 场景3：插件安装

```bash
# 安装官方插件
npm install @capacitor/camera @capacitor/geolocation

# 同步插件到原生项目
npx cap sync
```

### 场景4：环境隔离

```typescript
// capacitor.config.ts
const isDev = process.env.NODE_ENV === 'development';

const config: CapacitorConfig = {
  appId: isDev ? 'com.example.dev' : 'com.example.prod',
  server: {
    hostname: isDev ? 'localhost' : 'production.example.com',
  },
};

export default config;
```

---

## 🔧 CLI 命令速查
---
lang: bash
emoji: 🔧
desc: 常用命令一览
---

| 命令 | 作用 |
|---|---|
| `cap init` | 初始化项目配置 |
| `cap add <platform>` | 添加平台（ios / android） |
| `cap sync` | 同步 Web 产物 + 插件 |
| `cap copy` | 仅复制 Web 产物 |
| `cap update` | 仅更新插件原生代码 |
| `cap build` | 构建原生安装包 |
| `cap open <platform>` | 在 IDE 中打开 |
| `cap run <platform>` | 同步 + 构建 + 运行到设备 |
| `cap ls` | 列出已添加的平台和插件 |
| `cap doctor` | 诊断开发环境 |
| `cap migrate` | 从旧版迁移 |

### cap init

```bash
# 交互式初始化
npx cap init

# 参数方式
npx cap init "AppName" "com.example.app" --web-dir=dist
```

### cap sync vs cap copy vs cap update

| 命令 | Web 产物 | 插件代码 |
|---|---|---|
| `cap sync` | ✅ | ✅ |
| `cap copy` | ✅ | ❌ |
| `cap update` | ❌ | ✅ |

### cap run 常用选项

```bash
--livereload       # 启用实时刷新
--external        # 允许外部访问（手机可访问开发服务器）
--target <id>     # 指定目标设备
--dark-mode       # 启用暗色模式
```

---

## ⚙️ 配置速查
---
lang: typescript
emoji: ⚙️
link: https://capacitorjs.com/docs/config
desc: capacitor.config.ts 常用配置项
---

### 顶层配置

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.myapp',
  appName: 'MyApp',
  webDir: 'dist',
  loggingBehavior: 'debug',
};

export default config;
```

### 平台特定配置

```typescript
const config: CapacitorConfig = {
  // iOS 配置
  ios: {
    scheme: 'myapp',
    allowsLinkPreview: true,
    scrollEnabled: false,
  },

  // Android 配置
  android: {
    flavor: 'prod',
    minVersion: 22,
    backgroundColor: '#ffffff',
  },

  // 本地开发服务器
  server: {
    hostname: 'localhost',
    iosScheme: 'https',
    androidScheme: 'https',
  },
};
```

### 插件配置示例

```typescript
const config: CapacitorConfig = {
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffffff',
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#20861e',
    },
  },
};
```

---

## 🔌 常用插件速查
---
lang: typescript
emoji: 🔌
link: https://capacitorjs.com/docs/apis
desc: 官方核心插件一览
---

### Camera

```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const image = await Camera.getPhoto({
  quality: 90,
  resultType: CameraResultType.DataUrl,
  source: CameraSource.Camera,
});
```

### Preferences（轻量存储）

```typescript
import { Preferences } from '@capacitor/preferences';

// 存储
await Preferences.set({ key: 'username', value: 'john' });

// 读取
const { value } = await Preferences.get({ key: 'username' });
```

### Geolocation

```typescript
import { Geolocation } from '@capacitor/geolocation';

const position = await Geolocation.getCurrentPosition({
  timeout: 5000,
  enableHighAccuracy: true,
});
```

### Filesystem

```typescript
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

await Filesystem.writeFile({
  path: 'note.txt',
  data: 'Hello',
  directory: Directory.Documents,
  encoding: Encoding.UTF8,
});
```

### 插件与存储选型

| 需求 | 推荐插件 |
|---|---|
| 键值存储 | `@capacitor/preferences` |
| 原生文件系统 | `@capacitor/filesystem` |
| 敏感数据 | `@aparajita/capacitor-secure-storage` |
| 结构化数据 | `@capgo/capacitor-data-storage-sqlite` |

---

## 🚨 排障与收尾
---
lang: bash
emoji: 🚨
desc: 常见问题与解决方案
---

### 环境诊断

```bash
# 检查开发环境
npx cap doctor

# 常见问题
# - Node.js 版本不兼容
# - 原生平台工具缺失（Xcode/Android SDK）
# - 端口被占用
```

### 清理与重置

```bash
# 卸载平台
npx cap remove ios
npx cap remove android

# 重新添加
npx cap add ios
npx cap add android

# 强制同步
npx cap sync --force
```

### 权限问题（iOS）

```xml
<!-- Info.plist -->
<key>NSCameraUsageDescription</key>
<string>需要访问相机</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>需要访问位置</string>
```

### 权限问题（Android）

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### WebView 文件路径

```typescript
import { Capacitor } from '@capacitor/core';

// 转换文件路径（iOS/Android 必须）
const fileSrc = Capacitor.convertFileSrc(originalPath);
```

---

## 📚 核心对比
---
lang: bash
emoji: 📚
desc: Capacitor vs Cordova vs React Native
---

| 特性 | Capacitor | Cordova | React Native |
|---|---|---|---|
| 核心思路 | WebView + 插件 | WebView + 插件 | 原生组件 |
| 插件系统 | Swift/Java/JS | JS/原生 | 原生模块 |
| 项目结构 | 融入现有 Web 项目 | 独立 wrapper | 独立项目 |
| 性能 | 依赖 WebView | 依赖 WebView | 接近原生 |
| Ionic 集成 | 默认推荐 | 历史方案 | 需适配 |
