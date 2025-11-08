# u-tools开发指南

> 基于 `cheatsheets/utools开发指南/u-tools开发指南.html` 梳理，面向大模型提示与自动化生成场景优化，便于按章节引用。

## 快速索引
- [plugin.json配置](#pluginjson配置)
- [事件监听](#事件监听)
- [窗口操作](#窗口操作)
- [系统API](#系统api)
- [本地数据库](#本地数据库)
- [存储API](#存储api)
- [复制API](#复制api)
- [输入API](#输入api)
- [屏幕API](#屏幕api)
- [用户API](#用户api)
- [动态指令](#动态指令)
- [模拟按键](#模拟按键)
- [AI API](#ai-api)
- [FFmpeg API](#ffmpeg-api)
- [可编程浏览器（ubrowser）](#可编程浏览器ubrowser)
- [用户付费](#用户付费)
- [服务端API](#服务端api)
- [团队应用](#团队应用)
- [匹配指令类型](#匹配指令类型)
- [平台检测](#平台检测)
- [文件对话框](#文件对话框)
- [实用工具](#实用工具)
- [插件目录结构](#插件目录结构)
- [预加载脚本](#预加载脚本)
- [开发调试](#开发调试)

## plugin.json配置
**官方文档**：<https://www.u-tools.cn/docs/developer/information/plugin-json.html>

- 必备字段：`main`（入口 HTML）、`logo`（PNG/JPG 图标）、`preload`（预加载脚本）。
- 运行参数：`single` 控制是否单例、`height` 设定初始窗口高度等。
- 功能声明：`features` 数组包含 `code`、`explain`、`cmds`（触发指令集合）。
- 建议：保持字段精简、描述准确，方便 LLM 生成和校验配置。

```json
{
  "main": "index.html",
  "logo": "logo.png",
  "preload": "preload.js",
  "features": [{
    "code": "hello",
    "explain": "hello world",
    "cmds": ["hello", "你好"]
  }]
}
```

## 事件监听
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/events.html>

- 核心事件：`utools.onPluginEnter/Out`（进入/退出）、`onPluginDetach`（分离）、`onDbPull`（数据同步）、`onMainPush`（推送内容到搜索框）。
- 事件参数：`action` 内含 `code`、`type`（`text/img/file/regex`）、`payload`、`from`（`main/panel/hotkey`）。
- 建议：进入事件里记录上下文，便于 LLM 决策后续输出。

```js
utools.onPluginEnter(({ code, type, payload, from }) => {
  console.log("用户进入", code, type, payload, from);
});
```

## 窗口操作
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/window.html>

- 窗口控制：`hideMainWindow`、`showMainWindow`、`setExpendHeight`、`outPlugin`、`getWindowType`、`isDarkColors`。
- 子输入框：`setSubInput`（注册回调+placeholder）、`setSubInputValue`、`subInputFocus`、`removeSubInput`。
- 建议：LLM 需指明窗口态（隐藏/显示）和输入焦点状态，避免误判。

```js
utools.setSubInput(({ text }) => {
  console.log("子输入", text);
}, "请输入搜索内容");
```

## 系统API
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/system.html>

- 常用调用：`showNotification`、`shellOpenPath`、`shellShowItemInFolder`、`shellTrashItem`、`shellOpenExternal`、`shellBeep`。
- 系统信息：`getNativeId`、`getAppName`、`getAppVersion`、`getPath(name)`。
- 用途：触发系统级操作或向用户反馈执行结果。

```js
utools.showNotification("任务完成", "result_feature");
utools.shellOpenExternal("https://www.u-tools.cn");
```

## 本地数据库
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/db/local-db.html>

- 文档操作：`db.put`、`db.get`、`db.remove`、`db.allDocs`、`db.bulkDocs`。
- 附件：`postAttachment`、`getAttachment`、`getAttachmentType`。
- 同步：`db.replicateStateFromCloud()` 可查看云状态。
- 提示：处理 `_rev` 字段，避免并发冲突。

```js
const doc = { _id: "user/1", name: "张三" };
const result = utools.db.put(doc);
if (result.ok) doc._rev = result.rev;
```

## 存储API
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/db/db-storage.html> ｜ <https://www.u-tools.cn/docs/developer/api-reference/db/db-crypto-storage.html>

- `dbStorage`（类似 localStorage）：`setItem`、`getItem`、`removeItem`、`clear`、`key`。
- `dbCryptoStorage`：提供同等 API，但内容会加密存储。
- 用法：轻量键值数据用 `dbStorage`，敏感数据（token 等）用加密版本。

```js
utools.dbStorage.setItem("theme", "dark");
utools.dbCryptoStorage.setItem("token", "secret_token");
```

## 复制API
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/copy.html>

- 能力：`copyText`、`copyFile`、`copyImage`、`getCopyedFiles`。
- 适用：快速写入系统剪贴板，配合 LLM 输出指令生成复制动作。

```js
utools.copyText("Hello World!");
utools.copyFile("/path/to/file.txt");
```

## 输入API
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/input.html>

- 粘贴：`hideMainWindowPasteText/Image/File`。
- 模拟键入：`hideMainWindowTypeString` 直接打字。
- 注意：调用会隐藏主窗口；LLM 在描述方案时应提示用户焦点会改变。

```js
utools.hideMainWindowPasteText("Hello World!");
utools.hideMainWindowTypeString("uTools 效率工具");
```

## 屏幕API
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/screen.html>

- 取色/截图：`screenColorPick`、`screenCapture`。
- 显示器：`getPrimaryDisplay`、`getAllDisplays`、`getCursorScreenPoint`、`desktopCaptureSources`。
- 坐标转换：`screenToDipPoint`、`dipToScreenPoint`。
- 建议：LLM 需明确回调参数（颜色 hex/rgb、截图 buffer）。

```js
utools.screenColorPick((colors) => {
  console.log(colors.hex, colors.rgb);
});
```

## 用户API
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/user.html>

- `utools.getUser()` 返回 `avatar`、`nickname`、`type (member|user)` 等。
- `utools.fetchUserServerTemporaryToken()` 可向服务端换取临时令牌。
- 场景：鉴权、个性化提示、同步用户态到后端。

```js
const user = utools.getUser();
if (user) console.log(user.nickname, user.type);
```

## 动态指令
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/features.html>

- 功能管理：`getFeatures`、`setFeature`、`removeFeature`。
- 设置入口：`redirectHotKeySetting`、`redirectAiModelsSetting`。
- 用例：根据用户行为，运行时增删 feature，LLM 需写明 `code/explain/cmds`。

```js
utools.setFeature({
  code: "dynamic_" + Date.now(),
  explain: "测试动态功能",
  cmds: ["测试", "test"]
});
```

## 模拟按键
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/simulate.html>

- 键盘：`simulateKeyboardTap(key, ...modifiers)`。
- 鼠标：`simulateMouseMove`、`simulateMouseClick/DoubleClick/RightClick`。
- 注意：需配合坐标定位，LLM 输出时最好说明坐标依据。

```js
utools.simulateKeyboardTap("a", "ctrl");
utools.simulateMouseClick(100, 100);
```

## AI API
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/ai.html>

- `utools.ai(options[, streamCallback])`：支持多轮消息、流式回调。
- `utools.allAiModels()`：列出可用模型，便于提示选择。
- Function Calling：`options.tools` 描述工具；被调用函数需挂在 `window`。

```js
const result = await utools.ai({
  messages: [
    { role: "system", content: "你是翻译专家" },
    { role: "user", content: "你好世界" }
  ]
});

window.getSystemInfo = () => ({ cpu: "Intel i7" });
await utools.ai({ messages, tools });
```

## FFmpeg API
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/ffmpeg.html>

- `utools.runFFmpeg(args[, onProgress])` 运行内置 FFmpeg，返回 PromiseLike。
- 控制：返回值含 `.kill()`（强制）与 `.quit()`（通知退出）。
- 适合 LLM 生成音视频任务脚本，需明确参数顺序。

```js
const run = utools.runFFmpeg([
  "-i", "input.mp4",
  "-c:v", "libx264",
  "output.mp4"
], (progress) => console.log(progress.percent));
// run.kill();
```

## 可编程浏览器（ubrowser）
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/ubrowser/ubrowser.html> ｜ 管理：<https://www.u-tools.cn/docs/developer/api-reference/ubrowser/manage.html>

- 基础：`goto`、`viewport`、`hide/show`、`run`。
- 网页操作：`click`、`value`、`press`、`evaluate`、`screenshot`、`pdf`、`wait`。
- 场景：网页自动化、截图、PDF 导出；LLM 生成链式调用要指出等待条件。

```js
utools.ubrowser
  .goto("https://map.baidu.com")
  .wait("#sole-input")
  .focus("#sole-input")
  .value("#sole-input", "福州烟台山")
  .wait(300)
  .press("enter")
  .run({ width: 1200, height: 800 });
```

## 用户付费
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/payment.html>

- 判断：`isPurchasedUser()`。
- 引导：`openPurchase`（软件）、`openPayment`（服务），回调确认成功。
- 查询：`fetchUserPayments()`。
- 建议：LLM 输出内说明付费逻辑和回调处理。

```js
if (!utools.isPurchasedUser()) {
  utools.openPurchase({ goodsId: "xxxxxxxxxx" }, () => {
    console.log("付费成功");
  });
}
```

## 服务端API
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/server.html>

- 用户接口：`GET /baseinfo`（获取用户信息）、`GET /payments/record`（订单状态）。
- 支付回调：`POST /callback`。
- 签名：对请求参数执行 `HMAC-SHA256`（key 为 secret）。

```js
const str = new URLSearchParams(params).toString();
const sign = crypto.createHmac("sha256", secret).update(str).digest("hex");
```

## 团队应用
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/team.html>

- 信息：`utools.team.info()` 返回 `teamId`、`teamName`、`userId`、`userName`。
- 配置：`utools.team.preset(key)`、`utools.team.allPresets(filter)`。
- 应用：团队版插件的集中配置、数据库连接等。

```js
const { teamName } = utools.team.info();
const config = utools.team.preset("database");
```

## 匹配指令类型
**官方文档**：<https://www.u-tools.cn/docs/developer/information/plugin-json.html>

- 文本：`type: "regex"`（正则）、`type: "over"`（任意文本）。
- 文件：`type: "files"`，可指定 `fileType: "file"` 与 `extensions`。
- 其他：`type: "img"`（图像）、`type: "window"`（窗口）。
- LLM 需生成 `match`、`minLength`、`maxLength` 等限制以提升匹配准确度。

```json
{
  "type": "regex",
  "label": "打开网址",
  "match": "/^https?:\\/\\/[^\\s/$.?#]\\S+$/i",
  "minLength": 10,
  "maxLength": 1000
}
```

## 平台检测
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/system.html>

- 环境：`isDev`、`isMacOS`、`isWindows`、`isLinux`。
- 路径：`getPath("home|desktop|documents|downloads|temp")`。
- 用途：LLM 需根据平台差异生成不同路径、快捷键描述。

```js
if (utools.isWindows()) {
  console.log("桌面路径", utools.getPath("desktop"));
}
```

## 文件对话框
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/window.html>

- 选择：`showOpenDialog(options)`。
- 保存：`showSaveDialog(options)`。
- 关键选项：`filters`（后缀过滤）、`properties`（`openFile`、`multiSelections` 等）。

```js
const files = utools.showOpenDialog({
  filters: [{ name: "JSON", extensions: ["json"] }],
  properties: ["openFile", "multiSelections"]
});
```

## 实用工具
**官方文档**：<https://www.u-tools.cn/docs/developer/api-reference/utools/window.html>

- 查找导航：`findInPage`、`stopFindInPage`、`redirect`、`startDrag`。
- 图标：`getFileIcon(path|".ext"|"folder")`。
- 当前窗口：`readCurrentFolderPath`、`readCurrentBrowserUrl`。
- 建议：LLM 说明 `startDrag` 需要实际文件路径数组。

```js
utools.findInPage("搜索内容");
utools.startDrag(["/path/to/file1.txt"]);
```

## 插件目录结构
**官方文档**：<https://www.u-tools.cn/docs/developer/information/file-structure.html>

- 标准文件：`plugin.json`、`index.html`、`preload.js`、`logo.png`。
- 常见目录：`css/`、`js/`、`assets/`、`node_modules/`。
- 参考结构：

```
my-plugin/
├── plugin.json
├── index.html
├── preload.js
├── logo.png
└── assets/
    ├── favicon.ico
    └── images/
```

## 预加载脚本
**官方文档**：<https://www.u-tools.cn/docs/developer/information/preload-js/preload-js.html> ｜ <https://www.u-tools.cn/docs/developer/information/preload-js/nodejs.html>

- 能力：可使用 Node.js API、Electron 渲染 API，遵循 CommonJS。
- 常用模块：`fs`（文件系统）、`path`（路径）、`ipcRenderer`（IPC）。
- 建议：初始化时检测 `utools` 是否可用，避免独立调试报错。

```js
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
if (typeof utools !== "undefined") {
  utools.showNotification("预加载脚本已加载");
}
```

## 开发调试
**官方文档**：<https://www.u-tools.cn/docs/developer/basic/debug-plugin.html>

- 模式：在 uTools 开发者工具中加载项目，支持 HTTP 调试地址和热重载。
- 调试技巧：使用浏览器 DevTools 调前端、`console.log` 调 preload、重点核对 `plugin.json` 路径。
- 常见排查：
  - 指令无法安装 → 检查功能指令定义。
  - API 调用失败 → 确认 preload 路径与环境权限。
  - 样式错乱 → 校验 CSS 资源路径。
- 小贴士：`utools.isDev()` 可区分开发/生产逻辑。

```js
if (utools.isDev()) {
  console.log("开发模式已启用");
}
```
