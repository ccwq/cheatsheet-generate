---
title: GSD (Get Shit Done)
lang: bash
version: "1.0.1"
date: "2026-03-12"
github: gsd-build/get-shit-done
colWidth: 430px
---

# GSD (Get Shit Done)

## 安装与验证
---
emoji: 📦
link: https://github.com/gsd-build/get-shit-done#getting-started
desc: 快速安装 GSD 并验证安装成功
---
- `npx get-shit-done-cc@latest` : 启动交互式安装

安装时选择：运行时（Claude Code/OpenCode/Gemini/Codex）和位置（全局/本地）

```bash
# 非交互式安装
npx get-shit-done-cc --claude --global   # 全局安装 Claude Code
npx get-shit-done-cc --opencode --global # 全局安装 OpenCode
npx get-shit-done-cc --gemini --global   # 全局安装 Gemini CLI
npx get-shit-done-cc --codex --global    # 全局安装 Codex
npx get-shit-done-cc --all --global      # 安装全部运行时
```

验证安装：

```bash
Claude Code / Gemini : /gsd:help
OpenCode              : /gsd-help
Codex                 : $gsd-help
```

更新 GSD：`npx get-shit-done-cc@latest`

## 核心命令
---
emoji: 🎯
link: https://github.com/gsd-build/get-shit-done#commands
desc: 掌握这些命令就能玩转 GSD 全部工作流
---
- `/gsd:help` : 查看 GSD 帮助文档
- `/gsd:update` : 更新 GSD 并预览变更日志
- `/gsd:join-discord` : 加入 GSD Discord 社区

## 全新项目初始化
---
emoji: 🚀
link: https://github.com/gsd-build/get-shit-done#1-initialize-project
desc: 描述你想构建的东西，GSD 会通过提问理解需求
---
- `/gsd:new-project [--auto]` : 启动新建项目流程

系统依次执行：提问 → 研究调研 → 需求定义 → 路线图

```bash
# 交互模式
/gsd:new-project
# 描述：我想做一个天气应用，用 Vue + Vite

# 自动模式（跳过确认）
/gsd:new-project --auto
```

创建的上下文文件：

| 文件 | 用途 |
|------|------|
| PROJECT.md | 项目愿景，始终加载 |
| REQUIREMENTS.md | 作用域 v1/v2 需求，可追踪阶段 |
| ROADMAP.md | 前进方向，已完成项 |
| STATE.md | 决策、阻塞器、跨会话记忆 |
| .planning/research/ | 生态知识（栈、功能、架构、陷阱） |

## 代码库分析
---
emoji: 🗺️
link: https://github.com/gsd-build/get-shit-done#brownfield
desc: 让 GSD 理解你的现有代码库，后续提问更精准
---
- `/gsd:map-codebase` : 并行分析现有代码库

分析内容：技术栈、框架、架构、代码规范、潜在问题

```bash
# 先分析代码库，再新建项目
/gsd:map-codebase
/gsd:new-project
```

## 阶段工作流
---
emoji: 🔄
link: https://github.com/gsd-build/get-shit-done#2-discuss-phase
desc: 完整的阶段化开发流程
---
### Discuss Phase

- `/gsd:discuss-phase [N]` : 捕获实施决策，为规划提供上下文

分析阶段并识别灰色区域：布局、交互、API 响应格式、错误处理、内容结构等

```bash
/gsd:discuss-phase 1
# 选择关注的领域，回答问题
# 输出：{phase_num}-CONTEXT.md
```

### Plan Phase

- `/gsd:plan-phase [N]` : 研究 + 规划 + 验证

研究如何实现该阶段，创建 2-3 个原子任务计划

```bash
/gsd:plan-phase 1
# 输出：{phase_num}-RESEARCH.md, {phase_num}-{N}-PLAN.md
```

### Execute Phase

- `/gsd:execute-phase <N>` : 并行波次执行所有计划

按依赖关系分组执行，每个计划在全新上下文中运行

```bash
/gsd:execute-phase 1
# 输出：{phase_num}-{N}-SUMMARY.md, {phase_num}-VERIFICATION.md
```

### Verify Work

- `/gsd:verify-work [N]` : 人工用户验收测试

系统提取可测试的交付物，逐个引导你验证

```bash
/gsd:verify-work 1
# 输出：{phase_num}-UAT.md，若有问题则创建修复计划
```

## 里程碑管理
---
emoji: 🏆
link: https://github.com/gsd-build/get-shit-done#6-repeat---complete---next-milestone
desc: 管理项目的多个里程碑
---
- `/gsd:audit-milestone` : 验证里程碑是否达成
- `/gsd:complete-milestone` : 归档里程碑，标记发布
- `/gsd:new-milestone [name]` : 启动下一版本

```bash
# 循环执行直到里程碑完成
/gsd:discuss-phase 2
/gsd:plan-phase 2
/gsd:execute-phase 2
/gsd:verify-work 2

# 归档并开始新里程碑
/gsd:complete-milestone
/gsd:new-milestone
```

## 阶段管理命令
---
emoji: 📋
link: https://github.com/gsd-build/get-shit-done#phase-management
desc: 动态调整路线图中的阶段
---
- `/gsd:add-phase` : 向路线图追加阶段
- `/gsd:insert-phase [N]` : 在阶段间插入紧急工作
- `/gsd:remove-phase [N]` : 移除未来阶段并重新编号
- `/gsd:list-phase-assumptions [N]` : 查看规划前的预期方法
- `/gsd:plan-milestone-gaps` : 创建阶段以填补审计缺口

## 会话管理
---
emoji: 💾
link: https://github.com/gsd-build/get-shit-done#session
desc: 暂停和恢复开发工作
---
- `/gsd:pause-work` : 创建交接文档以便暂停
- `/gsd:resume-work` : 恢复上次会话

```bash
# 中途停止
/gsd:pause-work

# 回来继续
/gsd:resume-work
```

## 快速模式
---
emoji: ⚡
link: https://github.com/gsd-build/get-shit-done#quick-mode
desc: 快速执行临时任务，不需要完整规划
---
- `/gsd:quick` : 临时任务快速执行
- `/gsd:quick --full` : 完整模式含计划检查和验证
- `/gsd:quick --discuss` : 先收集上下文再执行

```bash
# 快速修复
/gsd:quick "添加深色模式切换"

# 完整模式
/gsd:quick --full "修复登录 bug"

# 带讨论
/gsd:quick --discuss "重构用户模块"
```

## 导航与进度
---
emoji: 🧭
link: https://github.com/gsd-build/get-shit-done#navigation
desc: 查看当前位置和下一步
---
- `/gsd:progress` : 查看当前位置和下一步
- `/gsd:help` : 显示所有命令和使用指南

## 配置与调试
---
emoji: ⚙️
link: https://github.com/gsd-build/get-shit-done#configuration
desc: 配置模型 profile 和工作流代理
---
- `/gsd:settings` : 配置模型 profile 和工作流代理
- `/gsd:set-profile <profile>` : 切换模型 profile
- `/gsd:add-todo [desc]` : 捕获待办想法
- `/gsd:check-todos` : 列出待办事项
- `/gsd:debug [desc]` : 系统性调试
- `/gsd:health [--repair]` : 验证 .planning/ 目录完整性

```bash
# 切换模型配置
/gsd:set-profile quality   # 高质量：Opus 执行一切
/gsd:set-profile balanced  # 平衡：Opus 规划，Sonnet 执行
/gsd:set-profile budget    # 预算：Sonnet 规划，Haiku 验证
```

## Model Profiles
---
emoji: 🤖
link: https://github.com/gsd-build/get-shit-done#model-profiles
desc: 控制每个代理使用的 Claude 模型
---
| Profile | Planning | Execution | Verification |
|---------|----------|-----------|--------------|
| quality | Opus | Opus | Sonnet |
| balanced | Opus | Sonnet | Sonnet |
| budget | Sonnet | Sonnet | Haiku |

## Workflow Agents
---
emoji: 🤝
link: https://github.com/gsd-build/get-shit-done#workflow-agents
desc: 控制工作流中的自动化代理
---
| Agent | 默认 | 作用 |
|-------|------|------|
| workflow.research | true | 每个阶段规划前研究领域 |
| workflow.plan_check | true | 验证计划达成阶段目标 |
| workflow.verifier | true | 确认必须项已交付 |
| workflow.auto_advance | false | 自动链式执行 discuss → plan → execute |

```bash
# 跳过特定步骤
/gsd:plan-phase --skip-research
/gsd:plan-phase --skip-verify
```

## Git Branching
---
emoji: 🌿
link: https://github.com/gsd-build/get-shit-done#git-branching
desc: 控制 GSD 如何处理分支
---
| Strategy | 说明 |
|----------|------|
| none | 提交到当前分支（默认）|
| phase | 每阶段创建一个分支，阶段完成时合并 |
| milestone | 为整个里程碑创建一个分支，完成时合并 |

```json
{
  "git": {
    "branching_strategy": "phase",
    "phase_branch_template": "gsd/phase-{phase}-{slug}",
    "milestone_branch_template": "gsd/{milestone}-{slug}"
  }
}
```

## XML 任务格式
---
emoji: 📝
link: https://github.com/gsd-build/get-shit-done#xml-prompt-formatting
desc: 每个计划任务的标准化 XML 结构
---
```xml
<task type="auto">
  <name>创建登录端点</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>
    使用 jose 处理 JWT
    验证用户凭据
    成功时返回 httpOnly cookie
  </action>
  <verify>curl -X POST localhost:3000/api/auth/login 返回 200</verify>
  <done>有效凭据返回 cookie，无效返回 401</done>
</task>
```

## 波次执行
---
emoji: 🌊
link: https://github.com/gsd-build/get-shit-done#4-execute-phase
desc: 基于依赖关系的并行执行策略
---
```
WAVE 1 (并行)           WAVE 2 (并行)         WAVE 3
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Plan 01 │ │ Plan 02 │ → Plan 03 │ │ Plan 04 │ → Plan 05 │
│  用户    │ │ 产品    │   订单    │ │ 购物车   │   结账   │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
    │           │             ↑           ↑             ↑
    └───────────┴─────────────┴───────────┘─────────────┘
                  依赖关系：Plan 03 依赖 Plan 01
```

优势：独立计划并行执行、依赖计划按序等待、每个计划在全新 200k 上下文中运行

## 原子提交
---
emoji: 📦
link: https://github.com/gsd-build/get-shit-done#atomic-git-commits
desc: 每个任务完成后立即提交
---
```bash
abc123f docs(08-02): 完成用户注册计划
def456g feat(08-02): 添加邮箱确认流程
hij789k feat(08-02): 实现密码哈希
lmn012o feat(08-02): 创建注册端点
```

优势：Git bisect 精确定位失败任务、每个任务独立可回滚、为未来会话提供清晰历史

## 推荐使用方式
---
emoji: 🚀
link: https://github.com/gsd-build/get-shit-done#recommended-skip-permissions-mode
desc: 开启无打扰模式，让 GSD 真正释放生产力
---
建议使用 `--dangerously-skip-permissions` 标志运行 Claude Code

```bash
claude --dangerously-skip-permissions
```

这样 GSD 可以：自动执行命令、自动提交 Git、无需频繁确认

## 权限配置
---
emoji: 🔐
link: https://github.com/gsd-build/get-shit-done#alternative-granular-permissions
desc: 精细配置权限，不使用 skip-permissions
---
如果不用全局跳过，可配置项目级权限到 `.claude/settings.json`

```json
{
  "permissions": {
    "allow": [
      "Bash(date:*)",
      "Bash(echo:*)",
      "Bash(cat:*)",
      "Bash(ls:*)",
      "Bash(mkdir:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git status:*)"
    ]
  }
}
```

## 安全设置
---
emoji: 🛡️
link: https://github.com/gsd-build/get-shit-done#security
desc: 保护敏感文件不被读取
---
将敏感文件添加到 Claude Code 的 deny 列表

```json
{
  "permissions": {
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(**/secrets/*)",
      "Read(**/*credential*)",
      "Read(**/*.pem)",
      "Read(**/*.key)"
    ]
  }
}
```

## 故障排除
---
emoji: 🔧
link: https://github.com/gsd-build/get-shit-done#troubleshooting
desc: 常见问题及解决方案
---
- 安装后命令不工作？重启运行时以重新加载命令
- 验证安装：`/gsd:help`
- 重新安装：`npx get-shit-done-cc`
- Docker 环境：设置 `CLAUDE_CONFIG_DIR` 环境变量

```bash
# Docker 环境中
CLAUDE_CONFIG_DIR=/home/youruser/.claude npx get-shit-done-cc --global
```

## 卸载 GSD
---
emoji: 🗑️
link: https://github.com/gsd-build/get-shit-done#uninstalling
desc: 完全移除 GSD
---
```bash
# 全局卸载
npx get-shit-done-cc --claude --global --uninstall
npx get-shit-done-cc --opencode --global --uninstall
npx get-shit-done-cc --codex --global --uninstall

# 本地卸载（当前项目）
npx get-shit-done-cc --claude --local --uninstall
```

## 核心哲学
---
emoji: 💡
link: https://github.com/gsd-build/get-shit-done#why-i-built-this
desc: 理解 GSD 解决的问题
---
- 解决上下文腐化 — Claude 对话越长质量越差，GSD 通过结构化工作流保持高质量
- 复杂度在系统，不在流程 — 背后是 context engineering、XML 格式化、子代理编排
- 不玩企业过家家 — 没有 sprint、story points、stakeholder syncs
- 描述即构建 — 说清楚你要什么，GSD 帮你完成

> "If you know clearly what you want, this WILL build it for you. No bs."
