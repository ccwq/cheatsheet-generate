---
name: cheatsheet-maker
description: 创建、整理、重建技术速查表（Cheatsheet）源文件的技能。用于从主题、正文或网址采集资料并生成或改进 cheatsheets/主题目录 下的主题.md、meta.yml、refmap.md，补全元数据，并在需要时联动标签技能、图标技能与 HTML 生成器；不直接把“手写 HTML 页面”当作主路径。当用户明确要求 cookbook / recipe 风格，或资料明显以 workflows、任务链、场景套路、命令组合、最佳实践为主时，优先输出偏 cookbook 类型的 cheatsheet。
---

# cheatsheet-maker

为 `cheatsheets/<topic>/` 产出和维护规范化源文件，并在需要时补齐附属资源。

## 核心产物

- 生成或改进 `<topic>.md`
- 生成或改进 `meta.yml`
- 生成或改进 `refmap.md`
- 需要处理标签时，联动 agentskill: tag-ci
- 需要图标时，联动 agentskill: icon-complete-skill

## 工作边界

- 先处理源文件，再决定是否调用 HTML 生成器
- 不把“直接手写 HTML 页面”当作本技能主路径
- 用户只要求补图标时，转交 agentskill: icon-complete-skill
- 用户只要求补标签时，转交 agentskill: tag-ci；若同时补元数据，只改对应文件，不重写正文
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

## cookbook 风格判定

满足任一类强信号时，正文应切到偏 cookbook 风格，而不是普通 API / 命令罗列：

- 用户明确提到 `cookbook`、`recipe`、`套路`、`场景化`、`工作流`、`最佳实践`
- 来源内容以 workflows、playbooks、guides、patterns、use cases、examples 为主，而不是单纯 API 参考
- 主题本身是“配置集合 / 方法论 / 工具箱 / command pack / agent harness”，更适合回答“什么时候用什么”
- 一个主题包含多种命令、角色、规则、hooks、agents、skills，且它们之间的组合关系比单点参数更重要

若只是单一 CLI、库 API、语言语法、配置字段说明为主，则保持普通 cheatsheet 风格，不要硬套 cookbook。

需要更细的结构规则时，读取 `references/cookbook-style.md`。

## cookbook 风格成稿要求

- 先回答“这是什么、解决什么问题、入口在哪”，再展开命令或模块
- 优先按场景、任务链、决策点组织，而不是按字母序或目录平铺
- 强调“起手式”“组合拳”“收尾动作”“常见坑”
- 安装 / 配置只保留最小入口，不把正文写成 setup 文档
- 至少包含以下四类信息中的三类：
  - 入口与定位
  - 核心工作流 / 命令链
  - 场景化 recipes
  - 角色 / 模块分工
  - 风险点 / 决策规则 / 成本控制

### cookbook 卡片的常见标题

- 快速定位 / 入口
- 仓库骨架 / 模块分工
- 起手工作流
- 高频 recipes / 常见套路
- Hooks / Rules / Agents / Skills 协作
- 上下文 / 成本 / 风险控制

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
- `tags` 的选择、归一化与新建策略统一遵循 agentskill: tag-ci

** data字段处理的逻辑 **
- 如果<topic>存在github仓库和版本, 需要从github仓库调查版本发布的日期, 写入`date`
- 如果不存在github仓库和version, 则根据搜索信息以及你自身的知识库推断获得

### `refmap.md`

- 按主题分组整理官方文档、仓库、关键章节链接
- 让正文中的核心模块都能在 `refmap.md` 找到来源

## 执行流程

1. 识别任务类型：新建、重建、补元数据、补标签、补图标、整理 `refmap`
2. 读取现有目录与文件，判断哪些文件缺失，哪些内容应保留
3. 判断正文应采用普通 cheatsheet 还是 cookbook 风格；不确定时按来源结构和用户措辞做选择
4. 需要写正文时，按规范生成或改进 `<topic>.md`
5. 若为 cookbook 风格，按场景和工作流重组内容，不把章节写成简单命令清单
6. 补齐 `meta.yml` 与 `refmap.md`
7. 处理 `tags` 时，读取并遵循 agentskill: tag-ci
8. 需要图标时，读取并遵循 agentskill: icon-complete-skill
9. 需要 HTML 时，执行：

```bash
node cheatsheet-html-maker/index.js --input cheatsheets/<topic>/<topic>.md
```

10. 若改动影响导览页，再执行导航页重建

## 自检

- 确认 `meta.yml` 五个必填字段齐全
- 确认代码语言标识正确
- 确认正文没有夹带安装/配置大段内容
- 若命中 cookbook 风格，确认章节按场景 / workflow / recipe 组织，而不是平铺 API
- 确认用户要求“仅补缺”时，没有覆盖已有有效内容
- 标签若有变更，确认已按 agentskill: tag-ci 处理
- 图标若有变更，确认已按 agentskill: icon-complete-skill 处理
