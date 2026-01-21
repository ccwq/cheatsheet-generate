# Chrome DevTools Console 与 Network 速查表

面向日常调试场景，整合 Console 与 Network 面板的操作路径、核心能力与排查手法。

## Console 面板入口与布局

- 打开 DevTools：`Ctrl + Shift + I` / `Cmd + Option + I`
- 打开 Console：`Ctrl + Shift + J` / `Cmd + Option + J`
- 抽屉 Console：按 `Esc` 在其他面板下方打开 Console 抽屉
- 清空输出：`Ctrl + L` / `Cmd + K` 或 `console.clear()` 或点击 🚫

## Console 消息与日志级别

- `console.log()`：普通日志 (Info)
- `console.info()`：信息日志 (Info)
- `console.warn()`：警告日志 (Warning)
- `console.error()`：错误日志 (Error)
- `console.debug()`：调试日志 (Verbose)
- `console.assert(expr, data)`：断言失败时输出 Error
- 过滤日志级别：Console 顶部 `Log levels` 下拉选择

## Console 分组与结构化输出

- `console.group(label)`：开始分组
- `console.groupCollapsed(label)`：折叠分组
- `console.groupEnd()`：结束分组
- `console.table(data, columns?)`：表格显示数组/对象
- `console.dir(obj)`：对象属性树
- `console.dirxml(node)`：DOM 结构

## Console 计时与统计

- `console.time(label)` / `console.timeEnd(label)`：计时
- `console.timeLog(label)`：记录中间时间点
- `console.count(label)`：计数
- `console.countReset(label)`：重置计数
- `console.trace()`：堆栈跟踪

## Console 格式化与样式

### 常用格式化占位符

- `%s`：字符串
- `%d` / `%i`：整数
- `%f`：浮点数
- `%o`：可展开 DOM
- `%O`：可展开对象
- `%c`：CSS 样式

```javascript
console.info('User: %s, ID: %d', 'Alice', 42);
console.log('%cImportant', 'color: #ff6f61; font-weight: bold');
```

### ANSI 样式 (Node 风格)

```javascript
console.log('\x1B[41;93;4mHello\x1B[m');
```

## Console 运行 JavaScript

- Console 是 REPL：输入表达式立即求值
- 多行输入：`Shift + Enter`
- 结果回用：`$_` 代表上一条表达式结果
- 运行任意脚本：可直接修改 DOM、测试逻辑、调用全局函数

```javascript
document.querySelector('h1').textContent = 'Hello Console';
```

## Console Live Expressions

- 点击 Console 顶部 👁️ 按钮添加 Live Expression
- 支持多条表达式，结果每 ~250ms 更新
- 删除表达式：点击其右侧的 ✖

## Console Utilities API

### DOM 快捷选择

- `$()`：`document.querySelector`
- `$$()`：`document.querySelectorAll` (Array)
- `$x()`：XPath 查询
- `$0` - `$4`：最近选中的 5 个 DOM 元素

```javascript
$$('img').map(img => img.src);
```

### 对象与结果操作

- `keys(obj)` / `values(obj)`：键值列表
- `copy(obj)`：复制到剪贴板
- `queryObjects(Ctor)`：查询构造函数实例

### 调试与监控

- `monitor(fn)` / `unmonitor(fn)`：监控函数调用
- `debug(fn)` / `undebug(fn)`：调用时断点
- `monitorEvents(target, ['click'])`：监听事件
- `unmonitorEvents(target)`：取消事件监听
- `getEventListeners(target)`：查看监听器
- `inspect(obj)`：定位到 Elements/Sources

## Console 交互技巧

- 右键输出对象 → Store as global variable
- 使用 Console 边栏过滤来源 (消息来源/用户消息/浏览器消息)
- 过滤输入：文本、正则、来源、用户消息

## Network 面板入口与录制

- 打开 Network：DevTools 内选择 Network 标签
- 录制开关：左上角红点 (Record)
- 清空列表：🚫 Clear
- Preserve log：保留跳转前后请求
- Disable cache：禁用缓存 (仅 DevTools 打开期间)
- Throttling：Fast/Slow 3G、Offline、自定义

## Network 请求列表字段

- Name：资源名称
- Status：状态码
- Type：资源类型
- Initiator：发起者 (可查看调用堆栈)
- Size：传输/解压大小
- Time：总耗时
- Waterfall：瀑布图
- 右键表头 → Response Headers → 管理自定义列

## Network 请求详情 Tabs

- Headers：请求/响应头与概览信息
- Payload：Query/Form/JSON
- Preview：渲染预览
- Response：原始响应
- Initiator：请求依赖链
- Timing：DNS/SSL/TTFB/下载耗时
- Cookies：请求/响应 Cookie

## Network 过滤与搜索

### 基本过滤

- 文本匹配：`text`
- 正则：`/regexp/`
- 排除：`-method:OPTIONS`

### 属性过滤语法

- `domain:example.com`
- `method:POST`
- `status-code:404`
- `scheme:https`
- `mime-type:application/json`
- `resource-type:xhr`
- `priority:High`
- `larger-than:100k`
- `has-response-header:Content-Encoding`
- `has-overrides:yes`
- `is:running` / `is:from-cache`
- `mixed-content:displayed`

### Cookie 过滤

- `cookie-domain:` / `set-cookie-domain:`
- `cookie-name:` / `set-cookie-name:`
- `cookie-value:` / `set-cookie-value:`

```bash
domain:example.com method:POST status-code:404
```

## Network 排序与搜索

- 列排序：点击表头
- Activity 排序：按瀑布活动阶段排序
- 全局搜索：`Ctrl + F` / `Cmd + F`

## Network 复制与复现

- Copy as cURL
- Copy as fetch
- Copy response

```bash
curl 'https://api.example.com/data' -H 'Authorization: Bearer xxx'
```

## Network 屏蔽与节流

- 右键请求 → Block request URL
- Request conditions 抽屉：批量屏蔽/限制
- 查看标识：状态列显示 `blocked:devtools`
- 节流标识：请求旁金色图标，悬停查看规则

## Network Conditions (网络状况)

- Network 面板右上角更多网络状况按钮
- Command Menu：Show Network conditions
- 覆盖 User-Agent
- 自定义 User agent client hints
- 节流网络速度 (Fast/Slow 3G/Offline)

## Local Overrides (本地覆盖)

- 右键请求 → Override content / Override headers
- 首次使用需选择本地文件夹授权
- Response Headers 支持添加/修改/删除
- `.headers` 文件集中管理覆盖规则
- 覆盖启用时自动禁用缓存

## Speculation Rules 调试

- Application → Speculative loads
- 观察 prefetch/prerender 请求状态
- Network 中可查看 `Sec-Purpose: prefetch` 标头
- 预渲染需切换渲染器查看请求详情

## HAR 导入与导出

- Save all as HAR with content
- 拖拽 HAR 文件导入
- 用于跨团队复现与性能分析

## 常用快捷键

- Console 清空：`Ctrl + L` / `Cmd + K`
- Network 搜索：`Ctrl + F` / `Cmd + F`
- 抽屉 Console：`Esc`
- 多行输入：`Shift + Enter`

## 参考资源

- [Console Overview](https://developer.chrome.com/docs/devtools/console?hl=zh-cn)
- [Console API Reference](https://developer.chrome.com/docs/devtools/console/api?hl=zh-cn)
- [Console Utilities API Reference](https://developer.chrome.com/docs/devtools/console/utilities?hl=zh-cn)
- [Network Panel Overview](https://developer.chrome.com/docs/devtools/network/overview?hl=zh-cn)
- [Network Request Blocking](https://developer.chrome.com/docs/devtools/network-request-blocking?hl=zh-cn)
