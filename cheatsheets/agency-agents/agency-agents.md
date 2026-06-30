---
title: Agency Agents 速查
lang: zh-CN
version: "2.3.4"
date: "2026-06-30"
github: msitarzewski/agency-agents
colWidth: 420px
desc: Agency Agents 是一个“角色库 + 安装器 + 桌面 app”的 AI 代理速查仓库，按 division 和工具把专家型 agents 安装到 Claude Code、Cursor、Codex、Gemini、OpenCode、Qwen、Osaurus、Hermes 等环境。
tags:
  - AI / LLM
  - AI 辅助工具
  - CLI 工具
  - 自动化工具
  - 库 / SDK
---
# Agency Agents 速查

## 快速定位
> 这是什么：一个 **AI 专家角色库**，外加一个 **跨工具安装器**，再加一个 **桌面 app**。  
> 先从哪开始：如果你想最快上手，直接看 app；如果你想精准挑人，直接看 `scripts/install.sh` 的 `--division / --agent`。

| 目标 | 最短入口 | 适合你在干什么 |
|---|---|---|
| 直接装好并保持更新 | [Agency Agents app](https://agencyagents.app) | 不想 clone，不想手动复制文件，只想点几下就装到本地工具里 |
| 只给 Claude Code 装一批角色 | `./scripts/install.sh --tool claude-code` | 你已经在用 Claude Code，想把整套 team 直接装进 `~/.claude/agents/` |
| 只装某几个 division | `./scripts/install.sh --tool claude-code --division engineering,security` | 想让不同业务线分开投放，不想把所有角色都塞进去 |
| 只装少数几个 agent | `./scripts/install.sh --tool cursor --agent frontend-developer,ui-designer` | 你知道自己要哪几个专家，想做最小集成 |
| 先生成所有转换产物 | `./scripts/convert.sh` | 你要先把 source `.md` 转成各工具目标格式 |

### 一句话判断
- **想要“直接用”**：选 app。
- **想要“可控地安装”**：选脚本。
- **想要“把一套 agent 体系塞进本地工具链”**：选 `convert.sh + install.sh`。

### 这个仓库到底是什么
- 这是一个 **角色库**：每个 agent 都是领域专家，不是通用 prompt 模板。
- 这是一个 **分队系统**：按 division 管理不同能力线。
- 这是一个 **安装系统**：可以把角色复制到 Claude Code、Cursor、Codex、Gemini CLI、OpenCode、Qwen、Osaurus、Hermes 等环境。
- 这是一个 **桌面产品**：app 可以浏览全 roster，并把角色自动安装到对应工具里。

### 关键事实
- GitHub stars：`118,899`
- forks：`19,471`
- 许可证：MIT
- division 数：`16`
- supported tools：`14`
- 默认分支：`main`

## 最短工作流

### 1) 推荐路径：先看 app
如果你希望“浏览 roster + 一键安装 + 自动更新”，先从 app 走。

```bash
# 去官网或 GitHub release 下载
open https://agencyagents.app
# 或直接打开 latest release
open https://github.com/msitarzewski/agency-agents-app/releases/latest
```

### 2) 只装 Claude Code
```bash
cd /path/to/agency-agents
./scripts/install.sh --tool claude-code
```

### 3) 只装部分 division
```bash
./scripts/install.sh --tool claude-code --division engineering,security
```

### 4) 只装单个 agent
```bash
./scripts/install.sh --tool cursor --agent frontend-developer
```

### 5) 先转换，再安装
```bash
./scripts/convert.sh
./scripts/install.sh --tool opencode --division engineering
```

## 角色库怎么分

### 你可以把它理解成“按业务线分队”
| Division | 典型用途 | 适合放进队伍里的角色类型 |
|---|---|---|
| engineering | 产品开发主战场 | 前端、后端、移动端、AI 工程 |
| design | 设计与交互 | UI、视觉、信息架构 |
| product | 产品定义与推进 | 需求、PRD、路线图、优先级 |
| project-management | 任务推进与协作 | 计划、拆解、节奏、风险控制 |
| security | 安全审查与防护 | 安全分析、红队、审计 |
| testing | 质量验证 | QA、回归、测试策略 |
| support | 用户支持 | FAQ、工单、答疑、排障 |
| marketing | 内容与传播 | 叙事、活动、内容分发 |
| paid-media | 投放增长 | 广告、归因、转化优化 |
| sales | 销售支持 | 线索、话术、成交辅助 |
| finance | 财务与分析 | 预算、分析、报表 |
| game-development | 游戏制作 | 游戏设计、实现、测试 |
| gis | 地理信息 | 空间数据、地图、路线 |
| spatial-computing | 空间计算 | XR、3D、沉浸式交互 |
| academic | 学术研究 | 文献、综述、实验设计 |
| specialized | 其它垂直专家 | 细分场景的特殊角色 |

### engineering 里最容易先用上的角色
README 里直接点名了这些角色类型：
- Frontend Developer
- Backend Architect
- Mobile App Builder
- AI Engineer

如果你只想先把生产力拉起来，通常先装 engineering，再按需叠加 security / testing / product。

## 工具选择矩阵

### 哪个工具装什么
| 工具 | 安装形态 | 典型去处 | 备注 |
|---|---|---|---|
| Claude Code | per-agent | `~/.claude/agents/` | 最直接的 agent 投放目标之一 |
| Codex | per-agent | `~/.codex/agents/*.toml` | 走 TOML 代理文件 |
| Gemini CLI | per-agent | `~/.gemini/agents/` | 直接是 `.md` 角色文件 |
| Copilot | per-agent | `~/.github/agents/` / `~/.copilot/agents/` | 兼容 GitHub Copilot 生态 |
| Qwen | per-agent | `~/.qwen/agents/` | user-wide 或 project 皆可 |
| Cursor | per-agent | `.cursor/rules/*.mdc` | project-only |
| OpenCode | per-agent | `.opencode/agents/` | 注意数量上限 |
| Osaurus | per-agent | `~/.osaurus/skills/` | 以 Skill 目录形式安装 |
| Aider | roster | `CONVENTIONS.md` | 不是单个 agent，而是一份整体现约 |
| Windsurf | roster | `.windsurfrules` | 也是整份规则文件 |
| Antigravity | per-agent | `~/.gemini/antigravity/skills/` | 技能形式 |
| OpenClaw | per-agent | `~/.openclaw/agency-agents/` | workspace 形态 |
| Hermes | plugin | `~/.hermes/plugins/` | 不是 agent 文件，而是插件 |
| Kimi | per-agent | `~/.config/kimi/agents/` | 目录化 agent 文件 |

### 快速选择原则
- **只想让本地工具读到角色**：先看 `install.sh` 的工具名。
- **想保留项目级规则**：选 Cursor / OpenCode / Windsurf 这类 project 目标。
- **想做用户级长驻安装**：选 Claude Code / Codex / Gemini / Qwen / Osaurus / Hermes。
- **想做插件而不是 agent**：选 Hermes。

## 高频 recipes

### Recipe 1：把整套工程队塞进 Claude Code
```bash
./scripts/install.sh --tool claude-code --division engineering
```
适合：前端、后端、移动端、AI 工程的统一投放。

### Recipe 2：工程 + 安全双队列
```bash
./scripts/install.sh --tool claude-code --division engineering,security
```
适合：你要一边开发一边做安全审查，不想把测试、市场、销售也混进来。

### Recipe 3：只给 Cursor 装少量角色
```bash
./scripts/install.sh --tool cursor --agent frontend-developer,backend-architect
```
适合：项目里只需要几个明确的 rule 文件。

### Recipe 4：OpenCode 先控制规模
```bash
./scripts/install.sh --tool opencode --division engineering
```
适合：你知道 OpenCode 对可注册 agent 数量有上限，不想一把装满。

### Recipe 5：先转换，再精挑工具
```bash
./scripts/convert.sh
./scripts/install.sh --tool codex --division product,project-management
```
适合：你先把所有格式化产物准备好，再针对特定工具下发。

### Recipe 6：Hermes 插件投放
```bash
./scripts/install.sh --tool hermes --division engineering
```
适合：你不是在装“文件”，而是在给 Hermes 装 lazy-router 插件。

## 你最该记住的坑

### 1) OpenCode 有数量上限
README 明确提示：OpenCode 当前大约只能稳定注册 `~119` 个 agents，过多会被静默丢掉。  
**结论**：装 OpenCode 时，优先选分组子集，不要全量铺开。

### 2) 不同工具的“安装形态”不一样
有些是 per-agent，有些是 roster，有些是 plugin。  
**结论**：不要把所有目标都当成“复制一堆 md 文件”这么简单。

### 3) `convert.sh` 和 `install.sh` 分工不同
- `convert.sh`：生成各工具需要的中间产物
- `install.sh`：把产物放到真正的目标目录

**结论**：如果你缺的是目标格式，先 convert；如果你缺的是最终落地，跑 install。

### 4) app 和脚本不是互斥
app 适合浏览和一键安装，脚本适合精确控制。  
**结论**：先 app 认路，再脚本精装，通常是最省时间的路。

## 极简决策树

```text
要看 roster / 一键装 / 自动更新？ → app
要自己控制安装目标？ → scripts/install.sh
要先生成所有工具格式？ → scripts/convert.sh
只想给 Claude Code 用？ → --tool claude-code
只想给某几个队伍用？ → --division
只想要几个 agent？ → --agent
```

## 什么时候最适合这个仓库
- 你在做 **AI coding agents 的分工协作**
- 你要把 **角色库投喂给不同编辑器 / CLI**
- 你想把一个“大角色仓库”缩成 **可安装、可筛选、可更新** 的系统
- 你不是要一个 prompt，而是要一整套可复用的 agent roster

## 相关路径
- `README.md`：项目总说明、app、快速上手
- `scripts/install.sh`：安装入口，支持 `--tool / --division / --agent`
- `scripts/convert.sh`：转换入口
- `divisions.json`：division 结构与安装规则来源
- `tools.json`：支持工具的来源真值表
- `engineering/`：工程角色目录
- `security/`：安全角色目录
- `product/`：产品角色目录
- `project-management/`：项目推进角色目录

## 一句话总结
**Agency Agents = 一个可浏览、可筛选、可安装的 AI 专家团队仓库。**  
它的核心不是“有很多 agent”，而是“能把合适的 agent 装到合适的工具里”。
