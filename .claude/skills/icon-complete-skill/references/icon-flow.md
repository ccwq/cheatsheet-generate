# 图标处理流程

## 适用范围

- 仅适用于本仓库 `cheatsheets/<topic>/icon.png`
- 不处理站点 favicon；站点 favicon 由 `scripts/inject-favicon.js` 和 `assets/brand/*` 负责

## 导航页如何消费图标

- 导航页脚本是 `scripts/generate-nav.js`
- 该脚本只检查目标目录是否存在 `icon.png`
- 存在时，导览卡片渲染 `<img class="icon" src="cheatsheets/<topic>/icon.png">`
- 不存在时，不会报错，而是让模板回退到默认 SVG 占位

结论：

- 仅把 PNG 放进目录还不够；若新增图标，必须重新执行 `npm run build:nav`
- 图标文件名、路径写错，导航页就不会识别

## 文件与尺寸约束

- 输出文件：`cheatsheets/<topic>/icon.png`
- 推荐尺寸：`260x260`
- 背景：透明
- 色彩：优先保持品牌原色，不额外套统一底色
- 视觉：适合导览页卡片小尺寸展示，避免文字过多和复杂插画

## 选图优先级

1. 官方品牌图标
2. 官方仓库或官网常用 logo
3. Iconify / simple-icons / logos / devicon 等品牌图标
4. 语义图标或缩写图标

不要：

- 把网站 favicon 直接当最终图标，除非没有更好来源
- 使用与项目无关的通用图标冒充品牌图标
- 生成带白底的大截图

## 推荐工作法

### 单个条目

1. 看目标目录是否已有 `icon.png`
2. 若已有且用户未要求替换，则保持不动
3. 若缺失或用户要求替换，搜索品牌图标
4. 把 SVG 或源图转成透明底 `260x260` PNG
5. 写入目标目录
6. 执行 `npm run build:nav`

### 批量补图标

1. 先筛范围
2. 优先只处理缺失项
3. 每个条目只写本目录内 `icon.png`
4. 批量完成后统一执行一次 `npm run build:nav`

## 与其他 skill 的协作

- 若只是图标任务，直接使用本 skill
- 若是完整创建 cheatsheet，则正文、元数据、refmap 由 `../cheatsheet-maker-skill/SKILL.md` 负责
- 当完整创建流程需要图标时，由 `cheatsheet-maker-skill` 引导读取本 skill，而不是在两个 skill 内重复维护图标细则

## 验证建议

- 检查文件是否存在：`cheatsheets/<topic>/icon.png`
- 检查尺寸是否为 `260x260`
- 检查导航页是否已重建
- 检查 `git status` 是否只包含目标目录和必要的 `index.html`
