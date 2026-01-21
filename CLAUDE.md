# Cheatsheet Generate 项目规范与指南

## 项目简介
这是一个根据用户提供主题生成 Cheatsheet 的项目。

## 工具使用
- 对于不确定的内容, 请使用chrome浏览器打开https://www-d-perplexity-d-ai-s-per.p-tga.aiwentu.com/, 在其上进行搜索操作来调查信息, 这是一个快速全面的ai搜集整理工具

## 创建生成与存储
在收到创建cheatsheet的请求后, 按照以下步骤进行操作
- 读取 `prompts/创建cheatsheet.md`的内容, 按照其要求生成 Cheatsheet
- 生成的 Cheatsheet 保存在 `/cheatsheets` 目录下

## 改进提升重建
- 当用户请求重建cheatsheet时, 请按照以下步骤进行操作
  - 读取 `prompts/重构和改进.md` 的内容, 对已经存在的cheatsheet进行改进

## Cheatsheet 文件结构

### 核心文件
foo指代cheatsheet的项目名称
- `foo/foo.html`：HTML版本的cheatsheet内容
- `foo/foo.md`：Markdown格式的主要内容文件，包含详细的命令、参数和示例
- `foo/desc.md`：cheatsheet的简短描述（仅第一行有效），用于导览页卡片显示
- `foo/refmap.md`：相关资源参考映射，包含官方文档、教程等链接

### 可选文件
- `foo/icon.png`：自定义图标，用于导览页卡片显示（若不存在则使用默认SVG图标）

### 文件作用详解
foo指代cheatsheet的项目名称
- **foo.md**：
  - 包含实际的cheatsheet主要内容，按功能模块或使用场景分类组织
  - 在生成cheatsheet之后，需要生成一份md文件作为提示词提供给其他大模型开发的agent
    - 文件名与cheatsheet目录名相同，扩展名为.md
    - 用语需要精确，优先使用简体中文，也可以使用文言文，目的在于减少token数量
    - 不要包含安装和配置的内容，只需包含使用相关的内容
- **foo.html**：作为导览页链接的高优先级选项之一（优先级：index.html > 与目录同名的.html > 按名称排序的第一个.html）
- **meta.yml**：提供 cheatsheet 的元数据
  - `desc`：cheatsheet 的一句话描述
  - `tags`：标签列表
  - **冲突点 2：导航页文件名**
    - CLAUDE.md 提到 desc.md (现为 meta.yml) 用于在 `nav.html` 中显示介绍
    - AGENTS.md 提到输出文件为仓库根目录 `index.html`
    - 请决策：导航页的文件名是 `nav.html` 还是 `index.html`
- **refmap.md**：
  - 提供结构化的官方文档和资源链接，帮助用户查找更详细的资料
  - 创建对应的refmap.md是一个好习惯
  - 如果用户提供的是一个网址，并且要求整理refmap，请使用chrome打开网址，分析导航链接，进而整理需要参考的refmap，保存到(`/cheatsheets/topic/refmap.md`)，最后使用fetch,webfetch(domain:*)来获取分析需要参考的内容
- **icon.png**：为cheatsheet提供自定义图标，增强视觉识别性

## 导览页生成

### 变更记录（2025-11-17）
- 新增导览页模板：`templates/nav.template.html`
- 新增生成脚本：`scripts/generate-nav.js`，并在 `package.json` 增加脚本：`build`

### 生成逻辑
- 目录过滤：忽略所有以 `_` 开头的目录（开发中/WIP 或 demo），不纳入发布导览
- 链接优先级：`index.html` > "与目录同名的 .html" > "目录内按名称排序的第一个 .html`
- 简介来源：`desc.md` 第一行（自动去除简单 Markdown 语法）
- 图标：若存在 `icon.png` 则使用；若不存在，在模板渲染时为该卡片插入默认 SVG 图标
- 输出文件：仓库根目录 `index.html`

### 模板 UI 与交互（极客风 · 扁平化 Flat）
- 顶部 Masthead：站点名 + 建站目的（渐变标题、目的 chip、角落电路纹理 SVG 装饰）
- 顶部控制面板：列宽滑块 + 预设（窄/中/宽）、搜索框（支持高亮）、统计信息
- 卡片：
  - 标题可点击（淡淡下划线提示可点击，指向对应 cheatsheet）、默认 SVG 图标占位
  - 去除“本地/导入”标签；整体采用扁平化（无阴影与边框）
  - 右上角复制链接按钮（基于 `new URL(href, location.href)`，兼容 GitHub Pages 子路径）
- 滚动条样式：按站点配色自定义（Firefox/Chromium）
- 左下角装饰 SVG：降低不透明度、禁用 pointer-events，避免遮挡内容与点击

### URL 参数支持（导航页 index.html）
- `?q=关键词`：打开页面后自动进行搜索并高亮；
  - 若结果仅 1 项：直接以本页跳转方式进入该条目（`location.assign`，保留后退历史）；
  - 若结果 ≥ 2 项：自动聚焦搜索框并滚动到第一个匹配项；
- `&in-desc=1`：在搜索中包含简介（desc）；未带此参数时仅按标题匹配。

## 工程约定

### 模板位置
- 模板位置：`templates/nav.template.html`
  - 使用占位标记 `<!-- CHEATSHEET_ITEMS -->` 注入卡片 HTML
  - 若需新增交互，优先在模板内以原生 JS 实现，保持轻量和可维护；若需按功能独立维护，可放入 `assets/*.js` 并在模板底部引入（如 `assets/nav-query.js`）

### 生成脚本
- 生成脚本：`scripts/generate-nav.js`
  - 严格编码为 UTF-8，尽量保持中文注释
  - 对路径一律输出为 POSIX 风格（`/`），保证在浏览器中可用

### 代码风格与注释
- 用户主语为中文，注释与文档优先中文
- 适度注释关键分支与逻辑，模板中可用简短行内注释
- 避免引入重量级依赖；以原生能力为先

## 运行与发布

### 生成导览页
- 生成命令：`pnpm run build`（或 `npm run build`）
- 产物：`index.html`

### GitHub Pages
- Pages 源为 "Deploy from a branch"，分支 `main`，目录 `/(root)`
- 站点路径形如：`https://<user>.github.io/<repo>/`
- 模板中复制链接逻辑已兼容子路径部署

## 后续改动建议
- 若需要新增排序/分组（按更新时间、来源目录等），请在模板脚本中扩展 `sortCards` / `filterCards`
- 若需要深/浅主题，建议通过 CSS 变量切换，不引入新框架
- 任何影响生成与发布的修改，务必同步更新本文件与 `README.md`