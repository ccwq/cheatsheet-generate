# Chrome DevTools Console 与 Network 提示词

仅保留使用相关内容，不含安装与配置。

## Console 面板

### 打开与布局
- Console 面板快捷键：`Ctrl+Shift+J` / `Cmd+Option+J`
- 抽屉 Console：`Esc`
- 清空：`Ctrl+L` / `Cmd+K` 或 `console.clear()`

### 日志与分组
- log/info/warn/error/debug/assert
- group/groupCollapsed/groupEnd
- table/dir/dirxml

### 计时与统计
- time/timeEnd/timeLog
- count/countReset
- trace

### 格式化与样式
- `%s %d %i %f %o %O %c`
- `%c` 注入 CSS
- ANSI 转义序列基础

### 运行 JS 与交互
- REPL 即时求值
- 多行：`Shift+Enter`
- `$_` 最近结果

### Live Expressions
- 👁️ 添加
- 支持多条
- 结果自动刷新

### Utilities API
- `$()` `$$()` `$x()` `$0-$4`
- `keys` `values` `copy` `queryObjects`
- `monitor` `unmonitor` `debug` `undebug`
- `monitorEvents` `unmonitorEvents` `getEventListeners` `inspect`

## Network 面板

### 录制与控制
- Record/Clear/Preserve log/Disable cache
- Throttling：Fast/Slow 3G、Offline

### 列与详情
- Name/Status/Type/Initiator/Size/Time/Waterfall
- Headers/Payload/Preview/Response/Initiator/Timing/Cookies

### 过滤语法
- `domain:` `method:` `status-code:` `scheme:` `mime-type:`
- `resource-type:` `priority:` `larger-than:`
- `has-response-header:` `has-overrides:`
- `is:running` `is:from-cache` `mixed-content:displayed`
- `cookie-domain:` `set-cookie-domain:`
- `cookie-name:` `set-cookie-name:`
- 组合：空格 AND，`-` 取反

### 搜索与排序
- `Ctrl+F` / `Cmd+F` 搜索
- 点击表头排序

### 复制与复现
- Copy as cURL
- Copy as fetch
- Copy response

### 请求屏蔽与节流
- Block request URL
- Request conditions 抽屉批量规则

### Network Conditions
- 覆盖 User-Agent
- User agent client hints
- 网络节流预设

### Local Overrides
- Override content / Override headers
- `.headers` 规则文件

### Speculation Rules 调试
- Application → Speculative loads
- prefetch/prerender 状态
- `Sec-Purpose` 标头识别

### HAR
- 导出 HAR
- 导入 HAR
