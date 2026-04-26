---
title: DESIGN.md 速查
lang: markdown
version: "0.1.0"
date: 2026-04-21
github: google-labs-code/design.md
colWidth: 360px
---

# DESIGN.md 速查表

## 安装与调用入口
---
lang: markdown
emoji: 🚀
link: https://github.com/google-labs-code/design.md#cli-reference
colspan: 2
---

DESIGN.md 是给 coding agent / design agent 用的设计系统描述格式。它把设计 token 放进 YAML front matter，再用 markdown 解释设计意图，让 agent 既拿到“精确值”，也拿到“为什么这样设计”。

### 安装
```bash
# 全局安装 CLI
npm install -g @google/design.md

# 也可以直接用 npx 一次性执行
npx @google/design.md lint DESIGN.md
```

### 在仓库里怎么放
```text
your-project/
├─ DESIGN.md
├─ src/
└─ ...
```

- 通常把 `DESIGN.md` 放在项目根目录，和代码一起版本化。
- 文件上半部分写 tokens，下半部分写设计原则，适合长期演进。
- agent 读取后，可以把“配色 / 字体 / 圆角 / 组件规则”持续带入生成结果。

### 最小可用文件
```md
---
name: Heritage
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
typography:
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
rounded:
  sm: 4px
spacing:
  md: 16px
---

## Overview

新闻感、克制、偏高对比；主色只给最重要动作。
```

### 起手调用方式
```bash
# 校验单个 DESIGN.md
npx @google/design.md lint DESIGN.md

# 对比两个版本
npx @google/design.md diff DESIGN.old.md DESIGN.md

# 导出到 Tailwind token
npx @google/design.md export --format tailwind DESIGN.md

# 输出规范文本给 agent / prompt 注入
npx @google/design.md spec
```

## 最小工作流
---
lang: markdown
emoji: 🧭
link: https://github.com/google-labs-code/design.md#getting-started
---

### 从 0 到 1
```markdown
1. 先在项目根目录创建 `DESIGN.md`。
2. 用 YAML front matter 写颜色、字体、圆角、间距、组件 token。
3. 用 `##` 小节写设计意图、布局、组件规则、Do's and Don'ts。
4. 执行 `lint` 看结构、引用、对比度、章节顺序有没有问题。
5. 需要评审设计变更时，用 `diff` 比两个版本。
6. 需要喂给 Tailwind / token 管线时，用 `export` 导出。
```

### 最短闭环
```bash
# 1) 写文件
$EDITOR DESIGN.md

# 2) 先过 lint
npx @google/design.md lint DESIGN.md

# 3) 导出 token 给工程消费
npx @google/design.md export --format tailwind DESIGN.md > tailwind.theme.json
```

### 适合什么时候上
- 想把“品牌感 + token + 组件规范”交给 AI 持续遵守
- 设计系统已经有雏形，但散落在 Figma、Tailwind、口头约定里
- 团队开始让 agent 生成页面，希望输出别再每次都换一套风格

## 高频 Recipes
---
lang: markdown
emoji: 🍳
link: https://github.com/google-labs-code/design.md#cli-reference
---

### Recipe 1: 先验证文件有没有写坏
```bash
npx @google/design.md lint DESIGN.md
```

- 适合刚新建文件、刚改 token、刚补组件映射之后先做一次体检。
- 默认输出 JSON，方便被脚本、CI 或 agent 继续消费。

### Recipe 2: 对比设计系统改动有没有回归
```bash
npx @google/design.md diff DESIGN.md DESIGN-v2.md
```

- 看 token 新增 / 删除 / 修改。
- 如果 after 版本出现更多 errors / warnings，会被视作 regression。

### Recipe 3: 把 token 导出给前端工程
```bash
# 导出 Tailwind theme
npx @google/design.md export --format tailwind DESIGN.md > tailwind.theme.json

# 导出 DTCG tokens
npx @google/design.md export --format dtcg DESIGN.md > tokens.json
```

- `tailwind` 适合你已经有 CSS/Tailwind 工程。
- `dtcg` 适合继续接设计 token 流水线，和别的 token 工具对接。

### Recipe 4: 把 spec 丢给 agent 当上下文
```bash
# 读 markdown 版规范
npx @google/design.md spec

# 只要规则表，机器处理更干净
npx @google/design.md spec --rules-only --format json
```

- 适合给 agent 提供“这个格式到底怎么算合法”的硬规则。
- 比自己口述更稳定，尤其适合写校验 / 修复 prompt。

## 文件结构速查
---
lang: markdown
emoji: 🧱
link: https://github.com/google-labs-code/design.md/blob/main/docs/spec.md
---

### 两层结构
```md
---
# YAML front matter: 机器读的 tokens
---

## Overview
## Colors
## Typography
## Layout
## Elevation & Depth
## Shapes
## Components
## Do's and Don'ts
```

### 你可以这样理解
- front matter 像 `design-tokens.json`，负责“值”。
- markdown body 像设计说明书，负责“语气、限制、使用原则”。
- 对 agent 来说，这和前端里“变量 + 文档注释”是一个类比，只是这里是设计系统版本。

### canonical section 顺序
| 顺序 | Section | 别名 |
| --- | --- | --- |
| 1 | `Overview` | `Brand & Style` |
| 2 | `Colors` | - |
| 3 | `Typography` | - |
| 4 | `Layout` | `Layout & Spacing` |
| 5 | `Elevation & Depth` | `Elevation` |
| 6 | `Shapes` | - |
| 7 | `Components` | - |
| 8 | `Do's and Don'ts` | - |

## Token 速查
---
lang: markdown
emoji: 🏷️
link: https://github.com/google-labs-code/design.md#the-specification
---

### 顶层 schema
```yaml
version: alpha
name: Heritage
description: Optional
colors:
  primary: "#1A1C1E"
typography:
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
rounded:
  sm: 4px
spacing:
  md: 16px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
```

### token 类型
| 类型 | 格式 | 例子 | 用途 |
| --- | --- | --- | --- |
| Color | `#` + hex | `"#1A1C1E"` | 配色 token |
| Dimension | 数字 + 单位 | `48px` `1rem` `-0.02em` | 字号、圆角、间距 |
| Token Reference | `{path.to.token}` | `{colors.primary}` | 避免重复写值 |
| Typography | object | `fontFamily` `fontSize` `lineHeight` | 字体层级 |

### 常见组别
| 组别 | 说明 | 常见键 |
| --- | --- | --- |
| `colors` | 语义色或色板 | `primary` `secondary` `tertiary` `neutral` |
| `typography` | 字体级别 | `headline-lg` `body-md` `label-sm` |
| `rounded` | 圆角尺度 | `sm` `md` `lg` `full` |
| `spacing` | 间距或布局尺度 | `xs` `sm` `md` `lg` `gutter` |
| `components` | 组件级样式映射 | `button-primary` `input-default` |

## 组件与引用规则
---
lang: markdown
emoji: 🧩
link: https://github.com/google-labs-code/design.md#component-tokens
---

### 组件定义
```yaml
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.tertiary-container}"
```

### 合法组件属性
| 属性 | 值类型 |
| --- | --- |
| `backgroundColor` | `Color` |
| `textColor` | `Color` |
| `typography` | `Typography` |
| `rounded` | `Dimension` |
| `padding` | `Dimension` |
| `size` | `Dimension` |
| `height` | `Dimension` |
| `width` | `Dimension` |

### Quick Ref
- state / variant 直接拆成不同 key，比如 `button-primary-hover`。
- `components` 里可以引用前面定义过的 token。
- 未知 component property 会被接受，但给 warning，不是直接报错。

## CLI 命令速查
---
lang: markdown
emoji: ⚙️
link: https://github.com/google-labs-code/design.md/tree/main/packages/cli/src/commands
---

### 命令总览
| 命令 | 用途 | 常用参数 |
| --- | --- | --- |
| `lint` | 校验结构、引用、对比度、顺序 | `--format json` |
| `diff` | 比较两个 DESIGN.md 版本 | `--format json` |
| `export` | 导出 token 到其他格式 | `--format tailwind|dtcg` |
| `spec` | 输出格式规范 / 规则表 | `--rules` `--rules-only` `--format markdown|json` |

### `lint`
```bash
npx @google/design.md lint DESIGN.md
npx @google/design.md lint --format json DESIGN.md
cat DESIGN.md | npx @google/design.md lint -
```

### `diff`
```bash
npx @google/design.md diff DESIGN.md DESIGN-v2.md
```

### `export`
```bash
npx @google/design.md export --format tailwind DESIGN.md
npx @google/design.md export --format dtcg DESIGN.md
```

### `spec`
```bash
npx @google/design.md spec
npx @google/design.md spec --rules
npx @google/design.md spec --rules-only --format json
```

## Lint 规则与分支决策
---
lang: markdown
emoji: 🧪
link: https://github.com/google-labs-code/design.md#linting-rules
---

### 内置规则
| Rule | 严重级别 | 作用 |
| --- | --- | --- |
| `broken-ref` | error | 引用的 token 路径不存在 |
| `missing-primary` | warning | 定义了颜色但没有 `primary` |
| `contrast-ratio` | warning | 组件前景/背景不满足 WCAG AA |
| `orphaned-tokens` | warning | 定义了颜色但没被组件引用 |
| `token-summary` | info | 输出 token 数量摘要 |
| `missing-sections` | info | 缺少可选 section |
| `missing-typography` | warning | 有颜色但没 typography |
| `section-order` | warning | section 顺序不符合规范 |

### 常见判断
| 场景 | 处理方式 |
| --- | --- |
| 新增了 token，但 agent 没用上 | 看 `orphaned-tokens` |
| 组件样式看着对，lint 还报错 | 先查 `broken-ref` 路径是否拼错 |
| 视觉 OK，但可访问性不稳 | 看 `contrast-ratio` |
| 文档可读，但 agent 行为飘 | 补 `Overview` / `Components` / `Do's and Don'ts` |

### exit code
- `lint`：有 error 返回 `1`，否则 `0`
- `diff`：如果 after 版本出现 regression，返回 `1`

## 常见坑与排障
---
lang: markdown
emoji: 🧯
link: https://github.com/google-labs-code/design.md#consumer-behavior-for-unknown-content
---

- 把 `DESIGN.md` 写成纯 prose，agent 很难拿到稳定 token；至少要把关键 colors / typography / rounded / spacing 写进 front matter。
- section 名字乱写不是致命问题，但顺序错了会触发 `section-order` warning。
- token reference 必须写成 `{colors.primary}` 这种路径，不是 JS 变量，也不是 `$primary`。
- `components` 不是随便塞 CSS 全字段，目前只认少数属性；额外字段会接受，但只给 warning。
- `lineHeight` 可以是 unitless number，这点和 CSS 很像；`fontSize`、`padding`、`rounded` 这类则要带单位。
- 仓库当前 README 说规范版本还是 `alpha`，CLI 包源码版本已到 `0.1.1`；写 cheatsheet 时需要区分“格式版本”和“npm 包版本”。

