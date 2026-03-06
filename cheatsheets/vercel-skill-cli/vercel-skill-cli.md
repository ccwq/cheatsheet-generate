---
title: Vercel Skills CLI 速查
lang: bash
version: "latest"
date: 2026-03-06
github: vercel-labs/skills
colWidth: 410px
---

# Vercel Skills CLI 速查

## 快速开始
---
lang: bash
emoji: 
link: https://www.npmjs.com/package/skills
desc: Skills 是 AI Agent 技能生态系统的 CLI 工具，支持 OpenCode、Claude Code、Cursor 等 40+ 个 AI 编码工具
---

```bash
# 安装技能
npx skills add <owner/repo>

# 示例：安装 Vercel 官方技能集
npx skills add vercel-labs/agent-skills

# 查看帮助
npx skills --help
```

## 安装技能
---
lang: bash
emoji: 
link: https://www.npmjs.com/package/skills
desc: 支持多种来源格式和安装选项
---

### 来源格式
```bash
# GitHub 简写
npx skills add vercel-labs/agent-skills

# 完整 GitHub URL
npx skills add https://github.com/vercel-labs/agent-skills

# 子目录路径
npx skills add https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design

# GitLab URL
npx skills add https://gitlab.com/org/repo

# Git URL
npx skills add git@github.com:vercel-labs/agent-skills.git

# 本地路径
npx skills add ./my-local-skills
```

### 安装选项
- `-g, --global` : 安装到用户目录而非项目目录
- `-a, --agent <agents...>` : 指定目标 Agent（如 claude-code, codex）
- `-s, --skill <skills...>` : 安装指定技能名称（* 表示全部）
- `-l, --list` : 仅列出可用技能，不安装
- `--copy` : 复制文件而非创建符号链接
- `-y, --yes` : 跳过所有确认提示
- `--all` : 安装所有技能到所有 Agent

### 安装示例
```bash
# 列出仓库中的技能
npx skills add vercel-labs/agent-skills --list

# 安装特定技能
npx skills add vercel-labs/agent-skills --skill frontend-design

# 安装带空格的名称（需引号）
npx skills add owner/repo --skill "Convex Best Practices"

# 安装到特定 Agent
npx skills add vercel-labs/agent-skills -a claude-code -a opencode

# CI/CD 非交互式安装
npx skills add vercel-labs/agent-skills --skill frontend-design -g -a claude-code -y

# 安装所有技能到所有 Agent
npx skills add vercel-labs/agent-skills --all
```

## 管理技能
---
lang: bash
emoji: 
link: https://www.npmjs.com/package/skills
desc: 列出、搜索、更新和删除已安装的技能
---

### 列出技能
```bash
# 列出所有已安装技能（项目+全局）
npx skills list
npx skills ls

# 仅列出全局技能
npx skills ls -g

# 按 Agent 筛选
npx skills ls -a claude-code -a cursor
```

### 搜索技能
```bash
# 交互式搜索（fzf 风格）
npx skills find

# 按关键词搜索
npx skills find typescript
```

### 更新技能
```bash
# 检查更新
npx skills check

# 更新所有技能到最新版本
npx skills update
```

### 删除技能
```bash
# 交互式删除
npx skills remove

# 删除指定技能
npx skills remove web-design-guidelines

# 删除多个技能
npx skills remove frontend-design web-design-guidelines

# 从全局删除
npx skills remove --global web-design-guidelines

# 从特定 Agent 删除
npx skills remove --agent claude-code cursor my-skill

# 删除所有技能（无确认）
npx skills remove --all

# 使用别名
npx skills rm my-skill
```

### 删除选项
- `-g, --global` : 从全局范围删除
- `-a, --agent` : 从指定 Agent 删除（* 表示全部）
- `-s, --skill` : 指定要删除的技能（* 表示全部）
- `-y, --yes` : 跳过确认提示
- `--all` : 等同于 --skill '*' --agent '*' -y

## 创建技能
---
lang: bash
emoji: 
link: https://skills.sh
desc: 使用 init 命令创建新的 SKILL.md 模板
---

```bash
# 在当前目录创建 SKILL.md
npx skills init

# 在子目录创建新技能
npx skills init my-skill
```

### SKILL.md 结构
```markdown
---
name: my-skill
description: 技能描述，说明功能和用途
---

# 我的技能

Agent 激活此技能时要遵循的指令。

## 何时使用

描述应该使用此技能的场景。

## 步骤

1. 首先，执行此操作
2. 然后，执行那个操作
```

### 必填字段
- `name` : 唯一标识符（小写，允许连字符）
- `description` : 技能功能的简要说明

### 可选字段
```markdown
---
name: my-internal-skill
description: 内部技能，默认不显示
metadata:
  internal: true
---
```
- `metadata.internal: true` : 设置为内部技能，仅当 INSTALL_INTERNAL_SKILLS=1 时可见

## 安装范围
---
lang: bash
emoji: 
link: https://www.npmjs.com/package/skills
desc: 项目级与全局安装的区别
---

| 范围 | 标志 | 位置 | 用途 |
|------|------|------|------|
| 项目 | (默认) | ./<agent>/skills/ | 随项目提交，团队共享 |
| 全局 | -g | ~/<agent>/skills/ | 跨所有项目可用 |

### 安装方式
- **符号链接（推荐）** : 创建符号链接到规范副本，单一数据源，易于更新
- **复制** : 为每个 Agent 创建独立副本，用于不支持符号链接的场景

## 支持的 Agent
---
lang: bash
emoji: 
link: https://www.npmjs.com/package/skills
desc: Skills 支持 40+ 个 AI 编码工具
---

### 主流 Agent
- `claude-code` : Claude Code (.claude/skills/)
- `cursor` : Cursor (.cursor/skills/)
- `codex` : Codex (.agents/skills/)
- `opencode` : OpenCode (.agents/skills/)
- `github-copilot` : GitHub Copilot (.agents/skills/)
- `gemini-cli` : Gemini CLI (.agents/skills/)
- `windsurf` : Windsurf (.windsurf/skills/)
- `trae` / `trae-cn` : Trae (.trae/skills/)

### 其他 Agent
- `cline` : Cline (.agents/skills/)
- `roo` : Roo Code (.roo/skills/)
- `continue` : Continue (.continue/skills/)
- `augment` : Augment (.augment/skills/)
- `goose` : Goose (.goose/skills/)
- `junie` : Junie (.junie/skills/)
- `pi` : Pi (.pi/skills/)
- `qwen-code` : Qwen Code (.qwen/skills/)

### 使用 * 表示所有 Agent
```bash
npx skills add owner/repo --agent '*'
```

## 技能发现位置
---
lang: bash
emoji: 
link: https://www.npmjs.com/package/skills
desc: CLI 在仓库中搜索技能的位置
---

### 标准位置
- 根目录（包含 SKILL.md）
- `skills/`
- `skills/.curated/`
- `skills/.experimental/`
- `skills/.system/`
- `.agents/skills/`
- `.agent/skills/`
- `.claude/skills/`
- `.cursor/skills/`
- `.trae/skills/`

### 插件清单
如果存在 `.claude-plugin/marketplace.json` 或 `.claude-plugin/plugin.json`，也会发现其中声明的技能。

### 递归搜索
如果在标准位置未找到技能，将执行递归搜索。

## 环境变量
---
lang: bash
emoji: 
link: https://www.npmjs.com/package/skills
desc: 控制 CLI 行为的特殊环境变量
---

```bash
# 显示并安装内部技能
INSTALL_INTERNAL_SKILLS=1 npx skills add vercel-labs/agent-skills --list

# 禁用遥测
DISABLE_TELEMETRY=1 npx skills add owner/repo
# 或
DO_NOT_TRACK=1 npx skills add owner/repo
```

### 变量说明
- `INSTALL_INTERNAL_SKILLS` : 设置为 1 或 true 以显示和安装标记为 internal: true 的技能
- `DISABLE_TELEMETRY` : 禁用匿名使用遥测
- `DO_NOT_TRACK` : 禁用遥测的替代方式

## 故障排除
---
lang: bash
emoji: 
link: https://www.npmjs.com/package/skills
desc: 常见问题及解决方案
---

### "No skills found"
确保仓库包含有效的 SKILL.md 文件，且 frontmatter 中包含 name 和 description 字段。

### 技能未在 Agent 中加载
- 验证技能是否安装到正确路径
- 查看 Agent 文档了解技能加载要求
- 确保 SKILL.md frontmatter 是有效的 YAML

### 权限错误
确保对目标目录有写入权限。

### Kiro CLI 用户注意
安装技能后，需手动添加到 `.kiro/agents/<agent>.json`：
```json
{
  "resources": ["skill://.kiro/skills/**/SKILL.md"]
}
```

## 相关资源
---
lang: bash
emoji: 
link: https://skills.sh
desc: 官方资源和文档链接
---

- **官方网站** : https://skills.sh
- **NPM 包** : https://www.npmjs.com/package/skills
- **GitHub 仓库** : https://github.com/vercel-labs/skills
- **技能目录** : https://skills.sh/directory
- **Agent Skills 规范** : https://github.com/vercel-labs/agent-skills
