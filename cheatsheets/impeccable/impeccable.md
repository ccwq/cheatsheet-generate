---
title: Impeccable Foundation
lang: bash
version: 2.1.7
date: 2026-04-10
github: pbakaus/impeccable
colWidth: 520px
---

# Impeccable Foundation

## 一眼入口
---
lang: bash
link: https://impeccable.style/#foundation
desc: 这是 Impeccable 的 foundation 速查。它不是教你“多写几个漂亮 prompt”，而是先把设计 vocabulary、反模式边界、以及 teach/craft/extract 三条主线装进 AI harness，适合新人起步，也适合老手回查。
---

- `Impeccable` = `1` 个核心 skill + `18` 条设计命令 + anti-pattern detection
- foundation 核心目标：先建立设计上下文，再调用命令，不然 AI 很容易回到 `Inter + 紫色渐变 + 套娃卡片`
- 新手先记 `安装 -> /impeccable teach -> /audit 或 /polish`
- 老手先记 `teach / craft / extract` 三段式

```bash
# 推荐安装入口
npx skills add pbakaus/impeccable

# 安装后先做一次项目设计建档
/impeccable teach
```

## 最小工作流
---
lang: bash
desc: 新手先照着跑一遍，老手把它当成项目内的默认设计流水线。核心思路像你熟悉的 JS 工程链路：先定 schema，再写实现，最后做 lint + polish。
---

1. 安装 skill bundle，让 AI harness 能发现 `impeccable`
2. 执行 `/impeccable teach`，把项目的品牌、受众、视觉方向写进 `.impeccable.md`
3. 做新功能时走 `/impeccable craft`
4. 做收敛或抽象时走 `/impeccable extract`
5. 上线前至少补一轮 `/audit` 或 `/polish`

```bash
# 新项目起手式
npx skills add pbakaus/impeccable
/impeccable teach
/audit landing page
/polish landing page
```

## 安装与入口
---
lang: bash
link: https://impeccable.style
desc: foundation 要求“安装命令前置”。优先记住 website 安装、更新、CLI 检测这三组入口。
---

- `npx skills add pbakaus/impeccable` : 自动识别 AI harness，推荐
- `/plugin marketplace add pbakaus/impeccable` : 支持插件市场时可直接安装
- `npx impeccable skills update` : 更新 skills，并自动清理已废弃命令文件
- `npm i -g impeccable` : 只装 detector CLI，不含完整设计命令体验

```bash
# 完整技能包
npx skills add pbakaus/impeccable

# 后续更新
npx impeccable skills update

# 只要 CLI detector
npm i -g impeccable
```

## teach / craft / extract
---
lang: bash
link: https://github.com/pbakaus/impeccable
desc: foundation 的真正主线是这三个入口。你可以把它理解成：`teach` 像初始化项目设计配置，`craft` 像带脚手架的完整实现流，`extract` 像把散落样式抽回 design system。
---

- `/impeccable teach` : 一次性采集设计背景，保存到 `.impeccable.md`，所有后续命令共享
- `/impeccable craft` : 先做结构化设计 discovery，再进入实现与视觉迭代
- `/impeccable extract` : 从现有页面或组件抽可复用 token / component / pattern

```bash
# 新项目或新品牌先 teach
/impeccable teach

# 从需求到成品
/impeccable craft pricing page

# 把已成型 UI 抽回系统资产
/impeccable extract dashboard cards
```

## 7 个设计维度
---
lang: text
desc: foundation 的“深设计知识”来自 7 份 reference。新手把它当检查清单，老手把它当提示词压缩包。
---

- `typography` : 字体选择、字阶、层级、OpenType 细节
- `color-and-contrast` : OKLCH、tinted neutrals、对比度、暗色模式
- `spatial-design` : 间距系统、网格、节奏、信息层次
- `motion-design` : easing、stagger、reduced motion、节奏控制
- `interaction-design` : 表单、焦点态、加载态、错误反馈
- `responsive-design` : mobile-first、fluid、container queries
- `ux-writing` : 按钮文案、错误提示、空状态、引导文本

```text
最常见的补救方向：
1. 文字看起来像模板 -> 先查 typography + ux-writing
2. 页面灰、闷、廉价 -> 先查 color-and-contrast + spatial-design
3. 动起来很“AI 味” -> 先查 motion-design
4. 手机上崩、表单难用 -> 先查 responsive-design + interaction-design
```

## 高频场景 Recipes
---
lang: bash
desc: 这一段给新手“遇到什么就用什么”，也给老手快速映射命令链。不要背全 18 条命令，先记场景到动作。
---

### 新页面总是长得很像模板
- 先 `/impeccable teach`
- 再 `/bolder`、`/colorize` 或 `/typeset`
- 最后 `/polish`

```bash
/impeccable teach
/typeset marketing page
/colorize marketing page
/polish marketing page
```

### 已有页面能用但不够“成体系”
- 先 `/audit`
- 再 `/layout`、`/typeset`
- 收尾 `/impeccable extract`

```bash
/audit settings page
/layout settings page
/typeset settings page
/impeccable extract settings page
```

### 要从 brief 一路做到实现
- 直接 `/impeccable craft`
- 然后根据结果补 `/critique` 或 `/polish`

```bash
/impeccable craft onboarding flow
/critique onboarding flow
/polish onboarding flow
```

## Quick Ref
---
lang: bash
desc: 老手回查用。只保留 foundation 阶段最常碰到的命令和判断，不把 18 条全部摊开。
---

- `/audit` : 技术质量检查，偏 a11y / responsive / performance
- `/critique` : UX 评审，偏层级、清晰度、情绪与可理解性
- `/polish` : 最终收口，补 design system 对齐与可发布性
- `/typeset` : 只修字体、层级、字距、阅读节奏
- `/layout` : 只修空间、栅格、留白、构图
- `/colorize` : 引入有策略的色彩，不只是“加渐变”
- `/bolder` / `/quieter` : 放大或收敛视觉个性
- `/harden` : 处理错误态、空状态、首次体验、国际化边角

```bash
# 新功能从 0 到 1
/impeccable craft feature
/critique feature
/polish feature

# 老页面收敛质量
/audit dashboard
/layout dashboard
/typeset dashboard
/polish dashboard
```

## Anti-Patterns 速记
---
lang: text
link: https://impeccable.style/anti-patterns
desc: Impeccable 的价值不只在“告诉 AI 该做什么”，还在明确“什么别做”。这部分最适合老手拿来做 code review 口令，也适合新手避坑。
---

- 不要默认 `Inter / Roboto / system`
- 不要紫色或青色套模板式渐变
- 不要深色底 + 发光描边的 AI 默认视觉
- 不要 `card in card` 套娃布局
- 不要彩色背景上叠灰字
- 不要 bounce / elastic easing
- 不要纯黑纯白，优先带色相的中性色

```bash
# 本地或 CI 直接做反模式检测
npx impeccable detect src/

# 线上页面检测
npx impeccable detect https://example.com

# 给工具链消费
npx impeccable detect --json --fast src/
```

## 新手与老手的分工用法
---
lang: text
desc: 同一套 foundation，对新人和熟手的使用方法不同。新人把它当“别踩坑的护栏”，老手把它当“高密度 design ops 工具”。
---

- 新手：优先学 `teach -> audit -> polish`，先把审美下限和反模式护栏立住
- 新手：不要一开始追 `/overdrive`，先把字、色、间距、响应式练稳
- 老手：把 `/impeccable extract` 当资产沉淀入口，把设计 token 和模式抽回系统
- 老手：把 detector CLI 接进 PR、CI、预提交，像 ESLint 一样挡住“AI 味”
- 老手：用 `/critique` 补“用户感受”，用 `/audit` 补“工程质量”，两者不要混成一条命令期待

```text
推荐心智模型：
teach   = 初始化设计上下文
craft   = 从 brief 到实现
extract = 从实现回流系统资产
detect  = 持续质量守门
```

## 排障与决策
---
lang: text
desc: 如果你觉得命令没生效，通常不是 skill 没价值，而是安装位置、上下文沉淀或调用时机不对。
---

- 看不到命令：先确认安装目录是否被当前 harness 识别，再重启或刷新索引
- skill 没明显效果：明确在提示中提到 `use the impeccable skill`，强制模型触发
- 改动还是很模板化：通常是没跑 `/impeccable teach`，或者 teach 时项目上下文太空
- `/audit` 与 `/critique` 结果冲突：前者偏规则与质量，后者偏体验与表达，先定你当前目标
- 只想扫代码库：直接用 `npx impeccable detect`，不必先依赖 AI harness

```text
优先排查顺序：
1. 有没有正确安装
2. 有没有先 teach
3. 当前命令是不是和目标匹配
4. 是否需要 detector CLI 而不是设计命令
```
