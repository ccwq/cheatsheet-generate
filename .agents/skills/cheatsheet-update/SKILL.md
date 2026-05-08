---
name: cheatsheet-update
description: 更新本仓库已有 cheatsheet 的专用技能。用于用户提到更新、升级、同步新版、补 changelog、release notes、跨版本变化、把某个 topic 更新到最新版本时；必须优先使用本技能，而不是直接用 cheatsheet-maker。该技能会先调用 cheatsheet-review-skill 做现状评估，再结合 cheatsheet-maker 的正文与文件规范执行更新，并在符合条件时维护正文末尾的版本变更模块与 changelog-history.md。
---

# cheatsheet-update

为已有 `cheatsheets/<topic>/` 执行版本更新、跨版本差异整理、正文修订、元数据同步与版本变更归档。

## 触发边界

- 用户提到更新、升级、同步新版、更新到最新版本、跨版本更新、release notes、changelog、版本变更时，使用本技能
- 用户只是创建全新 cheatsheet 时，转交 agentskill: cheatsheet-maker
- 用户只要求补标签时，转交 agentskill: tag-ci
- 用户只要求补图标时，转交 agentskill: icon-complete-skill

## 核心职责

- 评估当前 topic 是否过时、内容是否需要随版本调整, 评估完直接执行
- 基于官方来源更新 `<topic>.md`、`meta.yml`、`refmap.md`
- 在确认发生跨版本更新时，维护正文末尾 `## 🧾 版本变更`
- 若覆盖已有版本变更模块，先把旧内容归档到 `changelog-history.md`
- 更新后按 cheatsheet-maker 的文件规范自检，必要时重建 HTML

## 必须联动的技能

1. 先使用 agentskill: cheatsheet-review-skill
   - 读取当前 `cheatsheets/<topic>/`
   - 评估内容完整度、事实正确性、版本时效性、来源可追溯性
   - 输出会影响本次更新范围的问题与优先级
2. 再参考 agentskill: cheatsheet-maker
   - 沿用 `<topic>.md`、`meta.yml`、`refmap.md` 的格式规则
   - 沿用普通 cheatsheet / cookbook / 混合风格判定
   - 确保更新后的正文仍是可速查内容，而不是 release notes 文章

## 版本判断

- 默认从 `meta.yml.version` 读取当前版本
- 如果 `meta.yml.version` 缺失，再读取 `<topic>.md` frontmatter 的 `version`
- 如果用户明确给出起止版本，优先使用用户指定版本
- 默认目标版本为官方最新稳定版本
- 若版本无法可靠判断，不要伪造跨度；先更新可核验内容，并在结果中说明版本跨度待核验

### 来源优先级

1. GitHub Releases
2. GitHub tags 与仓库内 `CHANGELOG` / `CHANGELOG.md` / `RELEASE-NOTES.md`
3. 官方文档的 changelog / release notes 页面
4. 官方博客或公告中的版本发布页

若 topic 有有效 GitHub 仓库，优先用 GitHub 来源。若没有有效 GitHub 仓库，允许尝试官网 changelog / release notes，但必须把来源写入 `refmap.md`。

## 版本变更模块规则

仅当确认本次是跨版本更新时，才新增或重建正文末尾的版本变更模块。

### 模块位置与标题

- 模块必须位于 `<topic>.md` 最后
- 标题固定为：

```markdown
## 🧾 版本变更
```

- 标题下紧跟 card 元数据块：

```markdown
---
link: <官方 changelog 或 release notes URL>
desc: 按官方发布说明整理本次跨版本更新中对速查用户最重要的变化。
---
```

### 内容粒度

- 每个版本保留 3-6 条重点
- 只写重要新特性、破坏性变化、迁移影响、CLI/API/配置的关键变化
- 不复制完整 release notes
- 不把普通 bugfix 全量搬进正文，除非它影响常用命令、兼容性或使用路径
- 多版本更新时按版本从新到旧排列

### 推荐格式

```markdown
### v1.2.0

- 新增 xxx 能力，适合 xxx 场景
- 调整 xxx 默认行为，升级时需要检查 xxx
- 废弃 xxx，建议改用 xxx
```

## 已有 changelog 的归档规则

如果 `<topic>.md` 已存在 `版本变更`、`Changelog`、`更新日志` 等正文模块：

1. 先提取将被覆盖的旧模块内容
2. 创建或更新 `cheatsheets/<topic>/changelog-history.md`
3. 将旧模块追加到文件顶部，使历史记录从新到旧排列
4. 再用本次核验后的版本跨度内容重建正文末尾 `## 🧾 版本变更`

### `changelog-history.md` 格式

```markdown
# Changelog History

## 2026-05-08 覆盖归档

- 来源文件: `<topic>.md`
- 原模块标题: `## 🧾 版本变更`
- 覆盖原因: 更新到 `<target-version>`，重建跨版本摘要

<旧模块原文>
```

归档内容应保持原文，不做二次改写，方便追溯人工整理过的历史内容。

## 更新执行流程

1. 识别目标 topic，读取 `cheatsheets/<topic>/` 下的现有文件
2. 使用 cheatsheet-review-skill 做现状评估，记录必须修复的问题
3. 读取 cheatsheet-maker，确认正文格式、卡片结构、元数据与 refmap 规则
4. 解析当前版本、仓库、发布日期、已有 changelog 状态
5. 联网核验最新版本与跨版本 release notes
6. 决定更新范围：
   - 正文中过时的命令、API、配置、工作流
   - `meta.yml.version`、`date`、`github`
   - `<topic>.md` frontmatter
   - `refmap.md` 的版本来源与 changelog 来源
   - 正文末尾 `## 🧾 版本变更`
7. 若覆盖已有 changelog，先写入 `changelog-history.md`
8. 修改源文件后，按 topic 执行 HTML 生成：

```bash
node cheatsheet-html-maker/index.js --input cheatsheets/<topic>/<topic>.md
```

9. 若更新影响导览页元数据，再执行导航页重建

## 自检

- 已先评审，再更新, 无需等用户确认
- 已核验版本来源，不靠记忆判断最新版本
- 已区分 GitHub 来源与官网 changelog 来源
- 没有在无版本跨度时强行添加 `## 🧾 版本变更`
- 版本变更模块位于正文最后
- 每个版本只保留 3-6 条重点
- 已有 changelog 被覆盖前已归档到 `changelog-history.md`
- `meta.yml`、frontmatter、`refmap.md` 与正文版本一致
- 更新后的正文仍符合 cheatsheet-maker 的结构与风格规则
