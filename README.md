# Cheatsheet Generator

一个基于AI的自动化技术速查表（Cheat Sheet）生成工具。

## 在线预览

- GitHub Pages（公开仓库）：`https://ccwq.github.io/cheatsheet-generate/`

## 项目简介

本项目使用AI技术自动生成各种开发工具、框架和库的速查表HTML页面。通过提供主题描述，系统能够自动整理核心API、配置选项、实用示例及最佳实践，生成结构完整、内容详尽的速查表。

## 功能特性

- 🤖 **AI驱动生成**：基于主题描述自动生成技术速查表
- 📱 **响应式设计**：支持多列瀑布流布局，适配不同设备
- 🎨 **现代UI设计**：采用渐变背景、毛玻璃效果和圆角卡片
- 🔧 **交互式控制**：内置列宽调节滑块，支持实时布局调整
- 📚 **模块化结构**：每个功能模块独立为卡片，避免分页断裂
- 🌐 **纯HTML输出**：无外部依赖，可直接在浏览器中运行

## 项目结构

```
cheatsheet-generate/
├── base.md              # AI提示词模板和生成规则
├── CLAUDE.md            # 项目配置说明
├── cheatsheets/         # 生成的速查表目录
│   ├── example/         # 示例速查表
│   └── utools开发指南/   # uTools开发指南速查表
└── README.md            # 项目说明文档
```

## 使用方法

### 1. 准备主题
在AI工具中提供主题描述，例如：
- "cygwin使用指南"
- "React Hooks速查表"
- "Git命令大全"

### 2. 生成速查表
AI将根据主题内容：
- 分析相关技术文档和API
- 整理核心功能和最佳实践
- 生成结构化的HTML速查表

### 3. 查看结果
生成的速查表将保存在 `cheatsheets/` 目录下，每个主题对应一个子目录，包含：
- `.html` 文件：完整的速查表页面
- `.md` 文件：精简版提示词（供其他AI使用）

## 导入现有在线 Cheatsheet（下载器）

links.md 中包含了我之前整理的在线 cheatsheet 列表（JSON 代码块），其中 `url` 为其在线网址，`src` 为图标地址。可以使用内置下载器将这些在线页面离线化保存。

- 运行方式：
  - `node codepen-downloader/codepen-downloader.js`（需要 Node 16+；推荐 18+）
  - 可选参数：
    - `--only "关键词"` 仅处理匹配名称或 URL 的项
    - `--limit N` 限制处理数量
    - `--dry-run` 仅打印将要执行的操作

- 保存结构：
  - `cheatsheets-import/{slug}/source.html`（提取前：原始响应/CodePen包装页）
  - `cheatsheets-import/{slug}/index.html`（提取后：最终HTML，若为CodePen则为iframe.srcdoc）
  - `cheatsheets-import/{slug}/icon.*`（按内容类型自动扩展名）

- CodePen 兼容：
  - 对于形如 `https://codepen.io/{user}/full/{slug}` 的链接，下载器会自动解析返回页面中的 `iframe#result.srcdoc`，并将其作为最终 HTML 内容保存。

## 技术特点

- **HTML5标准**：语义化标签，符合Web标准
- **CSS多列布局**：column-count实现瀑布流效果
- **响应式设计**：支持桌面端和移动端
- **代码高亮**：深色主题的语法着色
- **性能优化**：无外部依赖，加载快速

## 生成导览页（index.html）

- 生成脚本：`node scripts/generate-nav.js`
- 模板路径：`templates/nav.template.html`
- 数据来源：`cheatsheets/` 与 `cheatsheets-import/` 下的各个子目录（读取 `desc.md` 与入口 HTML）
  - 规则：忽略所有以下划线开头的目录（如 `_demo`、`_wip`），这些目录视为开发中或示例，不在发布导览中展示。

运行方式：

- 使用 pnpm：`pnpm run generate:nav`
- 或使用 npm：`npm run generate:nav`

选择规则：

- 链接优先级：`index.html` > 与目录同名的 `.html` > 目录内按名称排序的第一个 `.html`
- 简介来源：`desc.md` 第一行（若缺失则留空）
- 图标：存在 `icon.png` 则显示于标题前

输出文件：仓库根目录 `index.html`

## 导航 UI 与交互

- 站点 Masthead：站名“极客速查库”、建站目的说明、目的 chip（命令/代码优先、结构清晰可读、快速检索导航、轻量离线可用）
- 控制面板：
  - 列宽滑块 + 预设（窄/中/宽，持久化到 localStorage）
  - 搜索输入（标题/简介匹配、命中高亮、Esc 清空、按 `/` 聚焦）
  - 打开方式开关：切换卡片点击在“新窗口/当前窗口”打开（持久化到 localStorage）
  - 统计信息（总数/可见数）
- 卡片：
  - 标题可点击（淡淡下划线，提示可点击），在新标签页打开对应 cheatsheet
  - 默认图标：若无 `icon.png`，自动插入默认 SVG 图标
  - 复制链接按钮：复制绝对地址，兼容 GitHub Pages 子路径
  - 扁平化风格：去除阴影与边框，配色与背景保持一致性
- 其他：自定义滚动条配色；左下角电路纹理 SVG 装饰弱化且不阻挡点击

### URL 搜索参数

- `?q=关键词`：打开 `index.html` 时自动执行搜索并高亮。
  - 若仅匹配 1 项：直接以本页跳转进入该条目（保留浏览器历史，可后退返回）。
  - 若匹配多项：自动聚焦搜索框并滚动到第一个匹配项。
- `&in-desc=1`：在搜索中包含简介（desc）；未带此参数时仅按标题匹配。

## 部署到 GitHub Pages

- 仓库需公开（Public）
- Settings → Pages：
  - Build and deployment：选择 “Deploy from a branch”
  - Branch：`main`
  - Folder：`/(root)`
  - 点击 Save，等待 1–3 分钟构建完成
- 访问地址：`https://<your-user>.github.io/<your-repo>/`，本仓库示例为 `https://ccwq.github.io/cheatsheet-generate/`
- 说明：
  - 站内链接与复制链接已适配子路径部署（使用 `new URL(href, location.href)` 生成绝对地址）

## 变更日志（最近）

- 新增：模板 `templates/nav.template.html`，极客风 + 扁平化样式
- 新增：生成脚本 `scripts/generate-nav.js`，`package.json` 增加 `generate:nav`
- 逻辑：遍历 `cheatsheets/` 与 `cheatsheets-import/`，优先级选择 HTML 入口，`desc.md` 第一行为简介，自动图标占位
- 交互：Masthead、搜索/高亮、列宽滑块与预设、复制链接（Pages 兼容）
- 样式：自定义滚动条；左下角装饰 SVG 降低不透明度且禁用 pointer-events

## 开发说明

### 模板结构
项目使用Pug/Jade风格的HTML模板，包含：
- 头部元数据和样式定义
- 交互控制面板（列宽调节）
- 多列内容容器
- 模块化卡片组件

### 样式规范
- 字体：12px基础字号，行高1.1
- 颜色：深色主题渐变背景
- 间距：8px/12px/16px标准间距
- 响应式断点：1500px/1100px/750px

## 许可证

本项目仅供学习和研究使用。

## 贡献

欢迎提交Issue和Pull Request来改进项目。














