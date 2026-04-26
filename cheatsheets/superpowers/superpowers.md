---
title: Superpowers 速查
lang: markdown
version: "v5.0.7"
date: 2026-03-31
github: obra/superpowers
colWidth: 350px
---

# Superpowers 速查表


## 平台接入
---
lang: markdown
emoji: 🔌
link: https://github.com/obra/superpowers#installation
colspan: 2
---

### Claude Code（推荐）
```bash
# 在 Claude Code 会话中执行插件市场安装
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
# 重启 Claude Code（或新开会话）让插件生效
```
> **备选方式**：直接克隆仓库并 `cd` 进入，Claude Code 会自动发现 skills/、commands/、hooks/、agents/ 目录。但插件市场方式更便于更新管理。

### Cursor
```bash
# Cursor 支持 Claude Code 插件生态
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

### Codex
```bash
# 克隆仓库到 ~/.codex/superpowers
git clone https://github.com/obra/superpowers.git ~/.codex/superpowers

# 创建 skills 软链接
mkdir -p ~/.agents/skills
ln -s ~/.codex/superpowers/skills ~/.agents/skills/superpowers

# 子代理技能（如 subagent-driven-development）需开启多代理支持
# 在 Codex 配置中添加：
# [features]
# multi_agent = true
```

### OpenCode
```bash
# 克隆仓库到配置目录
mkdir -p ~/.config/opencode/superpowers
git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers

# 创建插件软链接
mkdir -p ~/.config/opencode/plugin
ln -sf ~/.config/opencode/superpowers/.opencode/plugin/superpowers.js ~/.config/opencode/plugin/superpowers.js
# 重启 OpenCode 使插件生效
```

### Gemini CLI
```bash
gemini extensions install https://github.com/obra/superpowers
gemini extensions update superpowers
```

### 平台对比
| | Claude Code | Codex | OpenCode | Gemini CLI |
|---|---|---|---|---|
| **安装方式** | 插件市场 /plugin | 手动 symlink | 手动 symlink | extensions 命令 |
| **子代理支持** | ✅ 原生 | ✅ 需配置 | ✅ 需配置 | ❌ |
| **更新便利性** | /plugin update | git pull | git pull | gemini extensions update |
| **Superpowers 完整支持** | ✅ | ✅ | ✅ | ✅ |

## 一眼定位
---
lang: markdown
emoji: ⚡
link: https://github.com/obra/superpowers
---

Superpowers 是一套面向 AI 编码代理的流程框架（framework for building AI coding agents），把 brainstorming、计划、并行分解、测试、调试、审查和收尾固化成可复用流程。它不是单一 CLI，而是给 Claude Code、Cursor、Codex、OpenCode、Gemini CLI 等工具提供 skills、commands、hooks、agents 的协作层。

### 最短使用路径
```markdown
1. 先把 Superpowers 接到你的代理客户端。
2. 先走 `brainstorming`，不要直接开改。
3. 再用 `writing-plans` 输出可执行计划。
4. 需要并行时切 `subagent-driven-development` 或 `using-git-worktrees`。
5. 实现时按 `executing-plans` 推进，收尾前做 `verification-before-completion` 和 `requesting-code-review`。
```

### 适合什么任务
- 新功能从 0 到 1
- 复杂 bug 定位与修复
- 多文件重构
- 需要并行代理协作的任务
- 提交前需要证据链和复审的交付

## 起手工作流
---
lang: markdown
emoji: 🍳
link: https://github.com/obra/superpowers#readme
---

### Recipe 1: 需求还不清楚
```markdown
先用 `brainstorming`。
把目标、约束、风险、可选方案讲清楚，再决定是否进入实现。
```

### Recipe 2: 已有方向，要先对齐计划
```markdown
用 `writing-plans` 输出分阶段计划。
计划里要包含：边界、依赖、回滚点、测试点、验收标准。
```

### Recipe 3: 任务可拆分并行
```markdown
先用 `subagent-driven-development` 拆任务。
把实现、测试、文档、验证分给不同子代理，避免单线串行。
```

### Recipe 4: 任务适合用 worktree 并行
```markdown
用 `using-git-worktrees` 创建隔离的 git worktree。
每个 worktree 独立分支，避免并行改动互相干扰。
```

### Recipe 5: 开始真正改代码
```markdown
用 `executing-plans` 按已批准计划推进。
先做最小可行修改，再补测试，再做清理。
```

### Recipe 6: 发现 bug
```markdown
先用 `systematic-debugging`。
复现 -> 缩小范围 -> 找根因 -> 做最小修复 -> 验证。
```

### Recipe 7: 需要先补测试或补齐测试链
```markdown
用 `test-driven-development`。
先写失败的测试，再写让测试通过的实现，最后做重构。
```

### Recipe 8: 提交前收尾
```markdown
先跑 `verification-before-completion`，再请求 `requesting-code-review`。
最后用 `finishing-a-development-branch` 做分支收口、摘要和交接。
```

## 技能地图
---
lang: markdown
emoji: 🧭
link: https://github.com/obra/superpowers/tree/main/skills
---

| 技能 | 作用 | 典型触发点 |
| --- | --- | --- |
| `using-superpowers` | 总入口，要求先调用合适的技能再回答 | 刚接手项目、需要遵循流程时 |
| `brainstorming` | 澄清问题、约束和方案 | 需求模糊、选型不确定 |
| `writing-plans` | 生成可执行计划 | 先对齐后动手 |
| `using-git-worktrees` | 用 worktree 隔离并行工作 | 多方案试验、多个代理并行 |
| `subagent-driven-development` | 把大任务拆给子代理 | 信息分散、适合并行 |
| `executing-plans` | 按计划实际落地 | 计划已确认，可以修改代码 |
| `test-driven-development` | 先测试后实现，或者补齐测试链 | 核心逻辑、回归风险高 |
| `systematic-debugging` | 结构化定位问题 | 线上/本地失败、复现不稳定 |
| `verification-before-completion` | 完成前最终检查 | 准备交付、准备合并 |
| `requesting-code-review` | 发起代码审查 | 进入 review 阶段 |
| `finishing-a-development-branch` | 收尾、总结、合并前清理 | 开发闭环 |

### 触发顺序建议
```markdown
brainstorming -> writing-plans -> subagent-driven-development -> executing-plans -> verification-before-completion -> requesting-code-review -> finishing-a-development-branch
```


## 仓库骨架
---
lang: markdown
emoji: 🧱
link: https://github.com/obra/superpowers/tree/main
---

| 目录 / 文件 | 作用 |
| --- | --- |
| `skills/` | 核心技能库，定义应该先想什么、再做什么 |
| `commands/` | 可直接调用的命令入口 |
| `hooks/` | 前后置事件，负责自动化触发 |
| `agents/` | 专门化代理配置 |
| `docs/` | 平台接入与工作流说明 |
| `RELEASE-NOTES.md` | 版本更新和变更记录 |

## 使用规则
---
lang: markdown
emoji: 🧠
link: https://github.com/obra/superpowers/tree/main/skills/using-superpowers
---

- `using-superpowers` 是默认入口，适合先让系统确认要用哪些技能。
- 用户的明确指令优先级高于技能建议。
- 复杂任务不要跳过 `brainstorming` 和 `writing-plans`。
- 需要并行时，优先拆分成可独立验证的小任务。
- 提交前至少做一次 `verification-before-completion`。
- 交付前再走 `requesting-code-review`，避免把 review 当事后补丁。

### 推荐提示词
```markdown
请按 superpowers 流程处理这个需求：
先 brainstorming，再 writing-plans。
如果可以并行，就用 subagent-driven-development。
实现时按执行计划推进，最后做 verification-before-completion 和 code review。
```

## 常见坑
---
lang: markdown
emoji: 🧯
link: https://github.com/obra/superpowers/blob/main/RELEASE-NOTES.md
---

- 只接入仓库，不触发 skills，等于只装了壳，流程不会自动变好。
- 需求不清楚就直接实现，后面通常会返工。
- 多代理并行时不拆边界，容易互相覆盖改动。
- 没有最终验证就收尾，最容易把回归带出去。
- 收尾前不做 review summary，交接成本会很高。

### 快速检查
```markdown
1. 当前客户端是否已经能看到 Superpowers skills。
2. 计划是否先于实现。
3. 测试和验证是否有证据。
4. 分支是否已清理、总结是否已输出。
```
