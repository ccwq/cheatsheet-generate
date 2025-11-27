# Chrome 扩展开发速查

## 1. Manifest 结构与策略
- `manifest_version` 只能为 3，开启事件驱动、Service Worker、MV3 特性；务必在根目录放置 `manifest.json`。
- `name`、`version`、`description` 为强制字段，分别用于扩展商店、版本控制与用户说明，建议配合 `default_locale` 做多语言。
- `icons` 提供多个尺寸（16/48/128），用于工具栏、扩展页与 Web Store。
- `action` 定义工具栏入口、`background.service_worker` 负责事件与后台逻辑；MV3 中不再使用 `persistent`。
- `permissions` 触发 API 权限（如 `storage`、`tabs`），配合 `optional_permissions` 降低安装警告；`host_permissions` 精准声明可操作的域名或模式。
- `content_scripts` 需要 `matches`、`js/css`、`run_at` 及可选 `world`，慎选 `document_start`/`document_end` 的执行时机。
- `cross_origin_embedder_policy` 与 `cross_origin_opener_policy` 设为 `credentialless` 或 `same-origin`，可启用 SharedArrayBuffer 与跨源隔离。
- `web_accessible_resources` 控制哪些资源可被网页直接访问，避免无意暴露私有脚本。
- `declarative_net_request` 预定义静态规则，搭配 `dynamic_rules` 支持运行期调整；优先使用以节省权限。

## 2. Service Worker 与生命周期
- `chrome.runtime.onInstalled` 管理安装、升级逻辑，可调用 `runtime.setUninstallURL` 采集反馈或清理旧数据。
- `chrome.runtime.onStartup` 在用户打开 Chrome 时唤醒，用于恢复状态或执行同步；结合 `alarms` 进行调度。
- `chrome.runtime.onSuspend` 与 `{onSuspendCanceled}` 需快速保存状态与释放资源，避免长时间占用。
- `chrome.alarms` 是保持 Service Worker 活跃的机制；通过 `alarms.create` 定时唤醒、`alarms.get` 避免重复创建。
- 后台无法直接操作 DOM，需借助 Offscreen Document、content script 或 popup 处理 UI。

## 3. 界面入口与交互
- `chrome.action`（旧版 browserAction/pageAction）控制工具栏图标、徽章与 Popup，通过 `setBadgeText` 与 `setPopup` 根据状态反馈。
- Popup、Options、DevTools Panel、Side Panel 都是独立页面，推荐复用 CSS 变量与组件，避免重复逻辑。
- `chrome.sidePanel` 适用于长期显示的辅助内容，`default_path` 指向静态 HTML，配合 `chrome.sidePanel.setPanelBehavior` 设定可见性。
- 快捷入口可通过 `chrome.contextMenus.create` 与 `chrome.commands` 绑定；使用 `onCommand`/`onClicked` 触发 Service Worker 任务。
- Popup 与 Content Script 通过消息通信（`runtime.sendMessage`、`tabs.sendMessage`、`runtime.connect`）协调 UI 与后台逻辑；避免直接操控 DOM。

## 4. 浏览器与网络控制
- `chrome.tabs` 提供 `query/create/update/remove/duplicate`，`captureVisibleTab` 供截图；`scripting.executeScript` 替代 `tabs.executeScript`，支持 `target` 与 `world` 参数。
- `chrome.windows` 管理窗口创建与聚焦，`chrome.sessions` 支持刷新/恢复；`chrome.bookmarks` 与 `chrome.history` 可与 UI 联动展示用户数据。
- 内容脚本需在 Manifest 声明 `matches`、`run_at`，并通过 `chrome.scripting.insertCSS`/`executeScript` 动态注入样式或逻辑。
- 网络控制优先使用 `declarativeNetRequest` 的静态规则与 `dynamicRules`，仅在必要时申请 `webRequest`/`webRequestBlocking` 权限。
- `chrome.contentSettings` 可逐站点控制 Cookie/JavaScript/图片/弹窗等行为；`chrome.cookies` 可读写具体 Cookie，注意 `SameSite` 与跨域策略。
- `chrome.proxy` 与 `chrome.dns` 支持更底层的网络配置与 DNS 请求控制。

## 5. 权限、安全与跨域
- `permissions` 与 `host_permissions` 区分：前者针对 API（如 `tabs`、`storage`），后者定义可访问的 URL；使用 `optional_permissions`/`optional_host_permissions` 按需申请。
- 常见触发警告的权限包括 `cookies`（访问剪贴板）、`history`/`tabs`（读取历史记录）、`declarativeNetRequest`（屏蔽所有页面）、`proxy`、`webRequestBlocking`、`management`、`documentScan`等，应在 Manifest 里分组并提供清晰理由。
- `activeTab` 通过用户手势临时授权当前标签页访问，适用于有限操作的场景。
- MV3 强制 CSP、禁止 `eval` 与 remote code，建议手动设置 `content_security_policy` 以限制外部资源；所有 JavaScript/CSS 均需打包在扩展内部。
- COOP/COEP（`same-origin` + `credentialless`）配合 Offscreen Document，弥补 Service Worker 无 DOM 的限制，同时避免跨源注入。

## 6. 存储、通信与调试
- Storage：`chrome.storage.sync` 同步设置、`storage.local` 处理本地缓存、`storage.managed` 供企业策略、`storage.session` 绑定特定标签页；通过 `chrome.storage.onChanged` 实时响应更新。
- Messaging：所有组件间通过 `chrome.runtime.sendMessage`/`chrome.tabs.sendMessage` 进行轻量请求，`chrome.runtime.connect` + Port 实现长连接；避免在监听中重复注册事件。
- 快捷键触发（`chrome.commands`）可直接调用 `chrome.scripting.executeScript`、更新 `storage.session` 或触发 `runtime.sendMessage`。
- 调试利器：在 `chrome://extensions` 开启开发者模式，查看 `service worker` 控制台与 `chrome://inspect/#service-worker` 日志；可通过 `chrome.runtime.getPlatformInfo`、`getBrowserInfo` 生成兼容性提示。
- 更新机制：`chrome.runtime.onUpdateAvailable` + `chrome.runtime.reload` 控制灰度更新，必要时在用户交互后再刷新的同时显示提示。
