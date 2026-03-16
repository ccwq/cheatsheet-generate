---
title: UI UX Pro Max Cookbook
lang: bash
version: 2.5.0
date: 2026-03-10
github: nextlevelbuilder/ui-ux-pro-max-skill
colWidth: 500px
---

# UI UX Pro Max Cookbook

## 入口与定位
---
lang: bash
link: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
desc: UI UX Pro Max 不是单一的“提示词包”，而是一套面向多种 AI 编码助手的 UI/UX 设计增强技能。主入口有两个：直接用 `uipro-cli` 给目标助手装好模板与资产，或在 Claude Code 里走 marketplace 安装。
---

- `uipro init --ai <assistant>`：给指定助手安装技能与模板
- `/plugin marketplace add ...`：Claude Code 的 marketplace 路径
- 自动触发模式：Claude Code、Cursor、Windsurf、Codex、Gemini CLI、OpenCode 等
- Slash 命令模式：Kiro、GitHub Copilot、Roo Code
- 高级入口：直接跑 `search.py` 生成 design system、做 domain / stack 定向检索

```bash
# 最小起手式
npm install -g uipro-cli
uipro init --ai codex
```

## 安装通道怎么选
---
lang: bash
link: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/README.md
desc: 真正影响效率的不是“记住所有命令”，而是先选对安装通道。大多数场景优先 CLI；只有 Claude Code 且明确要走商店时，才切到 marketplace。
---

### Recipe 1：给单个助手装技能
- 何时用：你只在一个助手里长期使用 UI UX Pro Max
- 最小命令链：`全局安装 CLI -> init`

```bash
npm install -g uipro-cli
uipro init --ai claude
uipro init --ai cursor
uipro init --ai codex
uipro init --ai gemini
```

- 前置条件：本机已有 Node.js，目标项目目录就是你要装技能的位置
- 常见坑：在错误目录执行 `uipro init`，会把模板落到不想要的项目里

### Recipe 2：Claude Code 直接走 Marketplace
- 何时用：你就是 Claude Code 用户，而且希望沿用 marketplace 生命周期
- 最小命令链：`marketplace add -> plugin install`

```bash
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

- 前置条件：当前环境支持 Claude marketplace
- 常见坑：这条路径只覆盖 Claude Code；要兼容其他助手，还是回到 `uipro-cli`

### Recipe 3：一次装到多个助手
- 何时用：你在同一个仓库里经常切换 Claude / Codex / Cursor / Gemini 等助手
- 最小命令链：`init --ai all`

```bash
uipro init --ai all
```

- 前置条件：你接受仓库里同时出现多种助手约定目录
- 常见坑：仓库越杂，后续维护越重；团队项目通常只给真实在用的助手落模板

### Recipe 4：网络不稳定时离线安装
- 何时用：拉 GitHub release 容易超时，或你想强制只用 CLI 自带资产
- 最小命令链：`init --offline`

```bash
uipro init --ai codex --offline
uipro init --ai continue --offline
```

- 前置条件：`uipro-cli` 已安装完成
- 常见坑：`--offline` 用的是 CLI 包内置资产，不一定是仓库的最新 release

## 仓库骨架与模块分工
---
lang: text
link: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/CLAUDE.md
desc: 这个项目的重点不是“一个 SKILL.md 文件”，而是把数据、检索脚本、模板和安装器拆成独立层。理解这层分工，改模板、查问题、做二次开发都会快很多。
---

```text
ui-ux-pro-max-skill/
├─ src/ui-ux-pro-max/
│  ├─ data/         产品类型、配色、字体、图表、UX 规则数据库
│  ├─ scripts/      search.py、core.py、design_system.py
│  └─ templates/    各助手安装模板
├─ cli/             uipro-cli 安装器与打包资产
├─ .claude/         Claude 本地开发/测试入口
├─ .claude-plugin/  Claude Marketplace 发布配置
└─ README.md        安装入口、支持平台、使用模式
```

- `src/ui-ux-pro-max/`：事实源，改内容优先改这里
- `cli/`：负责把模板与资源生成到不同助手目录
- `data/ + scripts/`：负责“搜索推荐”和“design system 推理”
- `templates/`：负责不同助手最终拿到什么文件结构

## 起手工作流
---
lang: bash
desc: 大多数真实任务都不需要你先研究全部资源。正确做法是先装好，再按“自动触发 or slash command”选调用入口，最后才进入 design system 生成或 stack 定向检索。
---

```bash
# 1. 安装 CLI
npm install -g uipro-cli

# 2. 装到目标助手
uipro init --ai codex

# 3. 正常提需求，交给技能自动触发
Build a landing page for my SaaS product
```

- 自动触发助手：Claude Code、Cursor、Windsurf、Antigravity、Codex CLI、Continue、Gemini CLI、OpenCode、Qoder、CodeBuddy、Droid
- Slash 命令助手：Kiro、GitHub Copilot、Roo Code
- Trae：需要先切到 SOLO 模式，再发 UI/UX 任务

```bash
# Slash 命令类助手的最小入口
/ui-ux-pro-max Build a landing page for my SaaS product
```

## 高频 Recipes
---
lang: bash
desc: 下面这些 recipe 覆盖“不同助手如何装、如何调用、如何进阶到设计系统生成”三条主线。对这个主题来说，场景组合比字段列表更重要。
---

### Recipe 1：给 Codex CLI 装可自动触发的 UI/UX 技能
- 何时用：你主要在 Codex CLI 里做页面、组件、Dashboard、落地页
- 最小命令链：`npm install -g -> uipro init --ai codex`

```bash
npm install -g uipro-cli
uipro init --ai codex
```

- 前置条件：当前项目允许写入对应助手目录
- 常见坑：装完之后仍把它当普通代码助手用，没在需求里明确页面类型、品牌气质、栈和约束

### Recipe 2：给 Continue / Gemini / OpenCode 统一铺模板
- 何时用：团队会轮换不同终端助手，但想复用同一套 UI/UX 技能资产
- 最小命令链：`重复 init`

```bash
uipro init --ai continue
uipro init --ai gemini
uipro init --ai opencode
```

- 前置条件：仓库允许存在多套助手目录
- 常见坑：忘了记录“哪个助手用自动触发，哪个助手要 slash command”，导致看起来像“安装没成功”

### Recipe 3：先查版本，再决定要不要升级
- 何时用：你怀疑本地模板老了，或想确认当前 CLI 能装到哪个 release
- 最小命令链：`versions -> update`

```bash
uipro versions
uipro update
```

- 前置条件：机器能访问 npm / GitHub
- 常见坑：只更新 CLI，不重新在项目里执行 `init`，结果仓库里的模板还是旧的

### Recipe 4：直接调用 design system 生成器
- 何时用：你不是只想“启用技能”，而是要单独产出配色、字体、版式与反模式建议
- 最小命令链：`python3 search.py --design-system`

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --design-system -p "Serenity Spa"
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech banking" --design-system -f markdown
```

- 前置条件：Python 3.x 可用
- 常见坑：脚本路径依赖助手目录；如果你装的是 Continue，要把 `.claude/skills/` 换成 `.continue/skills/`

### Recipe 5：只查某一类设计知识，不跑整套推荐
- 何时用：你只缺样式、字体、图表或某个栈的约束
- 最小命令链：`search.py + --domain / --stack`

```bash
python3 src/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style
python3 src/ui-ux-pro-max/scripts/search.py "elegant serif" --domain typography
python3 src/ui-ux-pro-max/scripts/search.py "dashboard" --domain chart
python3 src/ui-ux-pro-max/scripts/search.py "responsive layout" --stack html-tailwind
python3 src/ui-ux-pro-max/scripts/search.py "form validation" --stack react
```

- 前置条件：你知道自己是在查风格、排版、图表还是栈规则
- 常见坑：问题太宽，只写“make it better”，检索价值会明显下降

## 助手差异与触发方式
---
lang: text
desc: 安装成功不代表调用方式一样。这个项目把助手分成“自动激活型”和“slash 命令型”两类，判断错了，体验会像技能失灵。
---

- 自动激活型：Claude Code、Cursor、Windsurf、Antigravity、Codex CLI、Continue、Gemini CLI、OpenCode、Qoder、CodeBuddy、Droid
- Slash 命令型：Kiro、GitHub Copilot、Roo Code
- Trae：先切 SOLO，再按自动触发使用
- Claude Code 特例：既能用 CLI 安装，也能走 marketplace

```text
自动激活型：直接描述 UI/UX 任务
Slash 命令型：先写 /ui-ux-pro-max，再写任务
```

## Design System 持久化套路
---
lang: bash
desc: 如果项目会反复做多个页面，最值得保留的不是一次生成的代码，而是 `MASTER + page overrides` 这套设计系统文件。它能把后续会话拉回同一视觉基线。
---

```bash
# 生成全局设计系统
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "MyApp"

# 为具体页面生成覆盖规则
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "MyApp" --page "dashboard"
```

```text
design-system/
├─ MASTER.md
└─ pages/
   └─ dashboard.md
```

- `MASTER.md`：全局设计原则、颜色、字体、组件基线
- `pages/<name>.md`：只写偏离全局基线的局部覆盖
- 取用顺序：先读页面 override，再回退到 Master

## 风险、成本与决策规则
---
lang: bash
desc: 这类跨助手技能最容易踩的坑，不是命令写错，而是入口判断错、版本认错、目录认错。先把这三个问题控住，后面的安装与调用基本都稳定。
---

- 优先 `uipro-cli`，因为它统一了多助手安装路径
- 只有 Claude Code 且明确要走商店时，再用 marketplace
- 网络差时优先 `--offline`，但要接受不是最新 assets
- 升级流程最好是 `uipro update` 后重新执行 `uipro init`
- 直接跑 `search.py` 时，先确认路径属于当前助手目录
- 多助手共存时，控制好仓库噪音，只保留真实在用平台

```bash
# 常用维护动作
uipro versions
uipro update
uipro init --ai codex --force
uipro init --ai codex --offline
```
