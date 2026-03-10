## 1. 主题状态与初始化机制

- [x] 1.1 盘点现有页面入口与公共脚本，确定主题初始化逻辑应落在的共享位置
- [x] 1.2 实现主题模式模型，支持 `dark`、`light`、`auto` 三种模式及生效主题解析
- [x] 1.3 增加主题偏好持久化读写逻辑，并约定统一的存储键名
- [x] 1.4 在页面最早可执行阶段注入主题初始化逻辑，确保首屏按正确主题渲染
- [x] 1.5 接入 `prefers-color-scheme` 监听，在 `auto` 模式下响应系统主题变化

## 2. 亮色设计令牌与全局样式

- [x] 2.1 整理 [assets/variables.css](E:/project/self.project/cheatsheet-generate/assets/variables.css) 中所有现有语义变量，并为亮色主题补齐对应取值
- [x] 2.2 为全局背景、文字、链接、边框、阴影与滚动条建立 `[data-theme=\"light\"]` 变量覆盖
- [x] 2.3 调整 [assets/global.css](E:/project/self.project/cheatsheet-generate/assets/global.css) 中的背景与全局基础样式，使亮色主题具备稳定可读性
- [x] 2.4 处理代码区块与高亮容器在亮色页面中的视觉分层，避免 Prism Tomorrow 与页面背景冲突

## 3. 导航页与内容页主题接入

- [x] 3.1 在 [templates/nav.template.html](E:/project/self.project/cheatsheet-generate/templates/nav.template.html) 的控制面板新增主题切换入口
- [x] 3.2 在导航页脚本中接入主题切换交互、持久化恢复与状态回显
- [x] 3.3 为导航页卡片、搜索框、按钮、滑块、统计区和标签补齐亮色主题样式
- [x] 3.4 将 cheatsheet 页面模板与公共资源接入相同的主题初始化机制
- [x] 3.5 为图标、图片或特殊装饰元素增加亮色场景下的兜底适配样式

## 4. 回归验证与文档

- [x] 4.1 验证亮色、暗色、自动三种模式在刷新后都能保持预期行为
- [x] 4.2 抽样检查导航页与至少一个 cheatsheet 内容页的文字对比、hover、focus 与代码块可读性
- [x] 4.3 视需要更新 `manifest.json` 或相关页面元信息，使浏览器主题色与主题模式保持一致
- [x] 4.4 补充实现说明或维护文档，记录主题模式约定、变量扩展方式与后续接入要求
