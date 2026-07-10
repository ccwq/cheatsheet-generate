---
title: js-avo-inspector 速查
lang: zh-CN
version: "3.2.0"
date: "2026-07-10"
github: avohq/js-avo-inspector
colWidth: 400px
desc: Avo Inspector JS SDK — Web / React Native 端事件 Schema 自动采集与追踪计划校验，支持批量上报、Gzip 压缩、属性值加密和客户端验证。
tags:
  - 埋点 / 分析
  - 客户端 SDK
  - Web 开发
  - 自动化工具
---

# js-avo-inspector 速查

## 快速定位

> 这是一个什么：Web / React Native 端事件 Schema 采集 SDK，帮你把埋点事件的字段结构自动上报到 Avo Inspector。
> 先从哪开始：`npm i avo-inspector` → 初始化 → `trackSchemaFromEvent` 埋点。

| 目标 | 最短入口 | 备注 |
|---|---|---|
| 安装（Web） | `npm i avo-inspector` | 完整版，含加密与校验 |
| 安装（生产/轻量） | `from "avo-inspector/lite"` | ~20KB min / ~5.2KB gzip |
| 初始化 | `new AvoInspector({ apiKey, env, version })` | 从 avo.app 获取 apiKey |
| 核心埋点 | `trackSchemaFromEvent(name, props)` | 自动提取 Schema 并上报 |
| 手动提取 | `extractSchema(props)` | 预览 Schema 格式 |

## 安装与初始化

### 标准安装（Web / React Native）

```bash
npm i avo-inspector
# 或
yarn add avo-inspector
```

```javascript
import * as Inspector from "avo-inspector";

const inspector = new Inspector.AvoInspector({
  apiKey: "your-api-key",                    // 从 avo.app 获取
  env: Inspector.AvoInspectorEnv.Dev,       // Dev | Prod
  version: "1.0.0",
  appName: "My app",                         // 可选
  suffix: "unique-string",                   // 多实例隔离（可选）
});
```

### SSR / Web Worker 场景

→ 改用 [ssr-web-avo-inspector](https://github.com/avohq/ssr-web-avo-inspector)

### React Native 场景

→ 使用 [react-native-avo-inspector](https://github.com/avohq/js-avo-inspector/tree/react-native-node-package)

### Lite Build（生产轻量）

```javascript
import { AvoInspector, AvoInspectorEnv } from "avo-inspector/lite";

const inspector = new AvoInspector({
  apiKey: "your-api-key",
  env: AvoInspectorEnv.Prod,
  version: "1.0.0",
});
```

> Lite 版**不支持** `publicEncryptionKey`（属性值加密）和 Session Filtering。两者都需用完整版。

## 核心 API

### `trackSchemaFromEvent` — 自动提取 Schema

**推荐用法**，在调用分析工具 `track` 的同一位置调用：

```javascript
// 发送事件时同时上报 Schema
inspector.trackSchemaFromEvent("User Signed Up", {
  email: "user@example.com",
  age: 25,
  isPremium: true,
  signupMethod: "google",
});
```

> 注意：`trackSchemaFromEvent` 会触发客户端校验（当传入 `publicEncryptionKey` 时）；`trackSchema` 不会。

### `trackSchema` — 手动构造 Schema

当你已有 Schema 定义时使用（不走自动提取）：

```javascript
inspector.trackSchema("User Signed Up", [
  { propertyName: "email",         propertyType: "string" },
  { propertyName: "age",           propertyType: "int" },
  { propertyName: "isPremium",    propertyType: "boolean" },
]);
```

### `extractSchema` — 仅提取不发送

调试用，预览 Schema 长什么样：

```javascript
const schema = inspector.extractSchema({
  userId: "u_123",
  amount: 99.9,
  tags: ["pro", "trial"],
  metadata: { plan: "basic" },
});
console.log(JSON.stringify(schema, null, 2));
```

## 事件上报方法对比

| 方法 | 自动提取 | 上报校验 | 批量发送 | 适用场景 |
|---|---|---|---|---|
| `trackSchemaFromEvent` | ✅ | ✅ | ❌（立即） | 推荐；与 `track` 同位置调用 |
| `trackSchema` | ❌（手动） | ❌ | ✅ | Schema 已定义好的场景 |
| `extractSchema` | ✅ | ❌ | ❌ | 调试、Schema 预览 |

## 配置项

### 初始化配置

| 参数 | 类型 | 说明 |
|---|---|---|
| `apiKey` | string | 必填，从 avo.app 获取 |
| `env` | `AvoInspectorEnv` | `Dev` / `Prod`（Dev 默认开日志，Prod 禁用） |
| `version` | string | 必填，App 版本号 |
| `appName` | string | 可选，应用名 |
| `suffix` | string | 多实例隔离标识 |
| `publicEncryptionKey` | string | Dev/Staging 启用属性值加密（Lite 版不支持） |

### 批量控制

```javascript
inspector.setBatchSize(15);              // 默认 30，超过即发送
inspector.setBatchFlushSeconds(10);      // 默认 30s，超时强制发送
// Dev 模式下批量自动禁用
```

### 网络超时

```javascript
Inspector.AvoInspector.networkTimeout = 5000;  // 默认 2000ms
```

### 日志开关

```javascript
inspector.enableLogging(true);   // Dev 模式默认开启，Prod 默认关闭
```

## 属性值加密（Dev/Staging）

> 仅完整版支持，Lite 版不支持。

### 生成密钥对

```bash
npx avo-inspector generate-keys
```

输出公钥（传给 SDK）和私钥（存密码管理器，用于 Avo Dashboard 解密）。

### 初始化时启用

```javascript
const inspector = new Inspector.AvoInspector({
  apiKey: "your-api-key",
  env: Inspector.AvoInspectorEnv.Dev,
  version: "1.0.0",
  publicEncryptionKey: "your-public-key-hex-string",
});
```

> 公钥非保密，可直接写在代码里。

## 客户端验证（Dev/Staging）

> 需要 `publicEncryptionKey` + `trackSchemaFromEvent` 才生效。

当事件属性不符合 Tracking Plan 规则时，控制台输出：

```
[Avo Inspector] Validation errors for event "User Signed Up":
  [{ code: "RequiredMissing", propertyName: "email" }]
```

### 获取验证结果

```javascript
// 异步等待（会阻塞直到 spec 拉取完毕）
const validated = await inspector.trackSchemaFromEvent("Event Name", {
  email: "user@example.com",
  age: 25,
});
// validated: [{ propertyName, propertyType, failedEventIds, passedEventIds }]
```

> 生产环境建议 fire-and-forget（不 await），避免阻塞页面。

## 批量上报与 Gzip 压缩

- 默认批量阈值：30 条事件，超出即触发发送
- 默认 flush 超时：30 秒
- **自 v3.2.0**：≥1KB 的请求体自动启用 Gzip 压缩（`CompressionStream` API）
- 压缩失败的请求（浏览器不支持 / 失败）降级为原始发送，不阻塞
- Dev 模式下批量自动禁用

## 高频坑点

### ❌ `trackSchema` 不触发客户端验证

客户端验证只绑定 `trackSchemaFromEvent`，`trackSchema` 只做批量上报，不校验。

### ❌ Lite 版不支持 `publicEncryptionKey`

TypeScript 编译时会报错。生产轻量部署用 Lite，但要加密/校验请用完整版。

### ❌ 多实例未加 `suffix`

同一项目里初始化两个 Inspector 实例，需要各自加 `suffix` 区分，否则事件会互相覆盖。

### ❌ 初始化写在 SSR 环境（Next.js / Nuxt）

SSR 环境下直接 import 会报 `window is not defined`。请改用 [ssr-web-avo-inspector](https://github.com/avohq/ssr-web-avo-inspector)。

### ❌ React Native 用错了包

RN 应使用 `react-native-avo-inspector`，而非 `avo-inspector`。

### ❌ 事件去重（Lite + Codegen 混用）

Lite 版不支持事件去重。如果同时用了 Avo Codegen（已自动发 Schema）又手动调用 `trackSchemaFromEvent` 发送同名事件，会产生重复 Schema。**混用场景请用完整版**。

### ❌ 私钥泄露

私钥仅用于 Dashboard 解密，**不要传入 SDK**，不要提交到代码仓库。建议存 `.env`。
