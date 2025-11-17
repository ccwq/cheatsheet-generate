# AGENTS 指南（cheatsheet-generate）

本文件记录本仓库与自动化生成导览页相关的工程约定与最近一次改动，供后续协作与二次开发参考。

## 变更记录（2025-11-17）

- 新增导览页模板：`templates/nav.template.html`
- 新增生成脚本：`scripts/generate-nav.js`，并在 `package.json` 增加脚本：`generate:nav`
- 生成逻辑：
  - 数据来源目录：`cheatsheets/`、`cheatsheets-import/`
  - 目录过滤：忽略所有以 `_` 开头的目录（开发中/WIP 或 demo），不纳入发布导览
  - 链接优先级：`index.html` > “与目录同名的 .html” > “目录内按名称排序的第一个 .html`
  - 简介来源：`desc.md` 第一行（自动去除简单 Markdown 语法）
  - 图标：若存在 `icon.png` 则使用；若不存在，在模板渲染时为该卡片插入默认 SVG 图标
  - 输出文件：仓库根目录 `index.html`
- 模板 UI 与交互（极客风 · 扁平化 Flat）：
  - 顶部 Masthead：站点名 + 建站目的（渐变标题、目的 chip、角落电路纹理 SVG 装饰）
  - 顶部控制面板：列宽滑块 + 预设（窄/中/宽）、搜索框（支持高亮）、统计信息
  - 卡片：
    - 标题可点击（淡淡下划线提示可点击，指向对应 cheatsheet）、默认 SVG 图标占位
    - 去除“本地/导入”标签；整体采用扁平化（无阴影与边框）
    - 右上角复制链接按钮（基于 `new URL(href, location.href)`，兼容 GitHub Pages 子路径）
  - 滚动条样式：按站点配色自定义（Firefox/Chromium）
  - 左下角装饰 SVG：降低不透明度、禁用 pointer-events，避免遮挡内容与点击

- 新增 URL 参数支持（导航页 index.html）：
  - `?q=关键词`：打开页面后自动进行搜索并高亮；
    - 若结果仅 1 项：直接以本页跳转方式进入该条目（`location.assign`，保留后退历史）；
    - 若结果 ≥ 2 项：自动聚焦搜索框并滚动到第一个匹配项；
  - `&in-desc=1`：在搜索中包含简介（desc）；未带此参数时仅按标题匹配。

## 工程约定

- 模板位置：`templates/nav.template.html`
  - 使用占位标记 `<!-- CHEATSHEET_ITEMS -->` 注入卡片 HTML
  - 若需新增交互，优先在模板内以原生 JS 实现，保持轻量和可维护；若需按功能独立维护，可放入 `assets/*.js` 并在模板底部引入（如 `assets/nav-query.js`）
- 生成脚本：`scripts/generate-nav.js`
  - 严格编码为 UTF-8，尽量保持中文注释
  - 对路径一律输出为 POSIX 风格（`/`），保证在浏览器中可用
- 代码风格与注释
  - 用户主语为中文，注释与文档优先中文
  - 适度注释关键分支与逻辑，模板中可用简短行内注释
  - 避免引入重量级依赖；以原生能力为先

## 运行与发布

- 生成导览页：
  - `pnpm run generate:nav`（或 `npm run generate:nav`）
  - 产物：`index.html`
- GitHub Pages：
  - Pages 源为 “Deploy from a branch”，分支 `main`，目录 `/(root)`
  - 站点路径形如：`https://<user>.github.io/<repo>/`
  - 模板中复制链接逻辑已兼容子路径部署

## 后续改动建议

- 若需要新增排序/分组（按更新时间、来源目录等），请在模板脚本中扩展 `sortCards` / `filterCards`
- 若需要深/浅主题，建议通过 CSS 变量切换，不引入新框架
- 任何影响生成与发布的修改，务必同步更新本文件与 `README.md`
