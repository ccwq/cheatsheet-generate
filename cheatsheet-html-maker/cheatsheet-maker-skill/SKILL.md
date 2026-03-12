---
name: cheatsheet-maker
description: 创建、整理、重建技术速查表（Cheatsheet）源文件的技能。用于从主题、正文或网址采集资料并生成或改进 cheatsheets/<topic>/ 下的 <topic>.md、meta.yml、refmap.md；也用于补齐或批量附加缺失的 icon.png、补全标签与元数据，且仅在需要时调用 HTML 生成器，不直接把 HTML 产出当作本技能核心职责。
---

# cheatsheet-maker

为 `cheatsheets/<topic>/` 产出和维护规范化源文件，并在需要时补齐附属资源。

## 核心产物

- 生成或改进 `<topic>.md`
- 生成或改进 `meta.yml`
- 生成或改进 `refmap.md`
- 按需补齐 `icon.png`

## 工作边界

- 先处理源文件，再决定是否调用 HTML 生成器
- 不把“直接手写 HTML 页面”当作本技能主路径
- 用户只要求补图标、补标签、补元数据时，只改对应文件，不重写正文
- 用户要求“仅处理缺失部分”时，只补缺，不覆盖已有内容

## 资料采集

- 优先使用官方文档、官方仓库、发布说明
- 输入是网址时，先读取页面，再顺着导航项补齐核心章节
- 记录整理时实际参考的版本号，写入 `meta.yml` 的 `version`
- 对不确定的 API、CLI 参数、版本信息做联网核验

## 内容成稿

- 使用简体中文
- 按高频任务组织内容，优先覆盖核心命令、典型参数、常见场景、陷阱
- 每个代码块都标明准确语言
- 注释写在代码上一行；除非代码和注释都很短，否则不要和代码写在同一行
- 正文不包含安装和配置，重点放在使用方法

## 文件规则

### `<topic>.md`

- 使用 Frontmatter，至少包含 `title`、`lang`、`version`、`date`、`github`、`colWidth`
- 以 `##` 作为卡片级模块
- 在 `##` 标题下紧邻使用卡片元数据块
- 代码块必须可被后续 HTML 渲染器转换为 `<pre><code class="language-xxx">`
- 详细语法在 `references/guide.md`

### `meta.yml`

- 必含 `desc`、`tags`、`version`、`github`、`date`
- `github` 固定为 `owner/repo`，不确定时写 `unknown`
- `date` 使用 `YYYY-MM-DD`
- 处理存量 cheatsheet 时，优先保留已有日期；新建时写当天日期

### `refmap.md`

- 按主题分组整理官方文档、仓库、关键章节链接
- 让正文中的核心模块都能在 `refmap.md` 找到来源

### `icon.png`

- 仅在缺失、用户要求替换、或需要统一风格时处理
- 优先使用品牌或项目图标；找不到时退回语义图标或缩写图标
- 保持适合导览页卡片的小尺寸展示，避免复杂插画
- 批量补图标时，先按日期、缺失状态或用户范围过滤，再写入目标目录

## 执行流程

1. 识别任务类型：新建、重建、补元数据、补标签、补图标、整理 `refmap`
2. 读取现有目录与文件，判断哪些文件缺失，哪些内容应保留
3. 需要写正文时，按规范生成或改进 `<topic>.md`
4. 补齐 `meta.yml` 与 `refmap.md`
5. 需要图标时，只为目标条目生成或补齐 `icon.png`
6. 需要 HTML 时，执行：

```bash
node cheatsheet-html-maker/index.js --input cheatsheets/<topic>/<topic>.md
```

7. 若改动影响导览页，再执行导航页重建

## 自检

- 确认 `meta.yml` 五个必填字段齐全
- 确认代码语言标识正确
- 确认正文没有夹带安装/配置大段内容
- 确认用户要求“仅补缺”时，没有覆盖现有有效内容
- 确认新增图标只落到目标目录，命名固定为 `icon.png`
