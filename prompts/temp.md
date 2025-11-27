## Chrome 扩展 Cheatsheet 模块规划

### 1. 目标概览
- 依据 https://developer.chrome.com/docs/extensions/develop?hl=zh-cn 的官方梳理，凝练扩展开发的核心能力与使用场景。
- 输出结果需覆盖 HTML+CSS/JS 展示页、与目录同名的 Markdown Cheatsheet，附带 desc.md 简述和 refmap.md 参考链接，遵循项目已有生成规范。

### 2. 模块划分
1. **扩展结构与流程**
   - Manifest 基本字段、生命周期、Service Worker 工作原理。
   - 更新机制及版本管理策略。
2. **界面组件与交互**
   - Browser Action/Action、Popup、Sidebar、Context Menu、Commands 快捷键。
   - 页面插入点（content script）、动态 UI 控制。
3. **浏览器与网络控制**
   - 控制浏览器功能（tabs、windows、bookmarks、history、contentSettings、chrome:// 覆盖页面等）。
   - 网络拦截与修改（webRequest、declarativeNetRequest、InjectScripts）。
4. **权限与安全约束**
   - 权限请求与最小化；避免远程托管代码，Manifest V3 的限制。
   - 跨源隔离（COOP/COEP）、Offscreen 文档、Storage 细粒度区域。
5. **数据与通信**
   - Storage API 各类型，数据监听。
   - 消息机制（message passing、port、runtime sendMessage）与 Service Worker 通信。
6. **辅助与调试**
   - 内容过滤方案、命令日志/调试、录音/截图 API（tabCapture/getDisplayMedia）。

### 3. 产出形式思路
- HTML：引导模块化卡片呈现，保留导航页需要的类名/结构；代码示例使用 `<pre><code>` 包裹并标注语言。
- Markdown：按模块写作、内嵌操作步骤与示例，去掉安装配置，只留实际 API/参数，用简体中文描述。
- Desc/Refmap：Desc.md 用一句话概括模块亮点；Refmap.md 链接官方文档与常用章节。
- 记录：输出文件名遵循 `cheatsheets/chrome-extensions/...` 目录结构，保证 nav 生成脚本可以引用。

### 4. 下一步
- 按照上述模块从文档中提取关键 API 列表与使用提示，准备生成 HTML/Markdown 内容。
