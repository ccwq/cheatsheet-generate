---
title: Everything Claude Code Cookbook
lang: bash
version: 1.8.0
date: 2026-03-05
github: affaan-m/everything-claude-code
colWidth: 520px
---

# Everything Claude Code Cookbook

## 入口与定位
---
lang: bash
link: https://github.com/affaan-m/everything-claude-code
desc: 这不是单一 CLI，而是一套面向 Claude Code、Codex、Cursor、OpenCode 的 agent harness cookbook。优先记住入口文件、能力边界和高频工作流。
---

- `README.md` : 安装入口、跨平台支持、版本更新摘要
- `the-shortform-guide.md` : 先看整体方法论、命令和实战习惯
- `the-longform-guide.md` : 深入看 token、memory、eval、并行化
- `AGENTS.md` : 跨工具共享的总指令文件
- `hooks/hooks.json` : 所有 hook 触发器和生命周期自动化
- `mcp-configs/mcp-servers.json` : MCP 服务器样例集合

## 仓库骨架
---
lang: text
desc: ECC 的核心思路是把“指令、自动化、知识、代理、工具接入”拆到稳定目录里，让不同 agent harness 共享同一套资产。
---

```text
everything-claude-code/
├─ agents/        专用子代理，如 planner / code-reviewer / harness-optimizer
├─ commands/      斜杠命令定义，如 /plan /quality-gate /loop-start
├─ skills/        领域技能与工作流知识
├─ rules/         始终遵循的规则（common + language）
├─ hooks/         PreToolUse / PostToolUse / Stop / SessionStart 等
├─ contexts/      dev / review / research 的上下文提示
├─ scripts/       Node.js 实现的跨平台自动化脚本
├─ mcp-configs/   GitHub / Supabase / Vercel 等 MCP 配置
└─ tests/         钩子、脚本、配置回归测试
```

- `agents/` 负责把复杂任务切给窄职责角色
- `commands/` 负责把常见流程封装成 `/xxx`
- `skills/` 负责沉淀可复用经验，而不是只写一次性 prompt
- `rules/` 负责始终生效的硬约束

## 规划与执行主线
---
lang: bash
link: https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md
desc: ECC 的默认主线是 “plan -> tdd -> review -> security -> quality gate”。复杂任务先规划，再进入流水线。
---

- `/plan "需求"` : 由 `planner` 重述需求、拆阶段、识别风险，并等待确认
- `/orchestrate feature "需求"` : 顺序编排 `planner -> tdd-guide -> code-reviewer -> security-reviewer`
- `/tdd "需求"` : 用测试先行方式推进实现
- `/code-review` : 代码完成后立刻做质量审查
- `/quality-gate . --strict` : 手动跑质量门禁，和 hooks 互补

```bash
# 新功能的低风险起手式
/plan "给支付模块增加退款审计"
/tdd "实现退款审计"
/quality-gate . --strict
/code-review
```

## 代理分工
---
lang: bash
link: https://github.com/affaan-m/everything-claude-code/blob/main/AGENTS.md
desc: AGENTS.md 里定义了“什么任务应该交给谁”。核心不是代理越多越好，而是让主代理只保留编排职责。
---

- `planner` : 复杂功能、重构、需求拆解
- `architect` : 架构决策、边界、可扩展性
- `tdd-guide` : 测试先行实现
- `code-reviewer` : 可维护性、回归风险、质量问题
- `security-reviewer` : 敏感逻辑、安全审计、提交前兜底
- `build-error-resolver` : 构建失败、类型错误、依赖破裂
- `loop-operator` : 长时间 autonomous loop 的监控与干预
- `harness-optimizer` : 调优 hooks、成本、稳定性、吞吐量

```bash
# 典型编排
/orchestrate refactor "拆分超大 service 并补测试"
/orchestrate security "审计 OAuth 回调与 token 存储"
```

## 高频命令速用
---
lang: bash
link: https://github.com/affaan-m/everything-claude-code/tree/main/commands
desc: 斜杠命令本质是把高频 prompt 固化。记住“起手命令”和“收尾命令”比背完整命令列表更重要。
---

- `/harness-audit` : 审核当前 harness 的可靠性、风险和 eval 就绪度
- `/loop-start sequential --mode safe` : 启动受控循环执行
- `/loop-status` : 查看 loop 进度与检查点
- `/quality-gate . --fix --strict` : 对目录手动跑质量门禁
- `/build-fix` : 处理构建失败
- `/verify` : 执行验证循环
- `/learn` : 从会话提炼模式
- `/learn-eval` : 提炼前先评估模式质量
- `/evolve` : 把直觉/模式聚类成更稳定的 skill
- `/setup-pm` : 自动检测并设置 npm / pnpm / yarn / bun

```bash
# 研究 -> 实现 -> 收尾
/harness-audit
/plan "重写 webhook 重试逻辑"
/tdd "重写 webhook 重试逻辑"
/quality-gate . --strict
/verify
```

## Hooks 与运行时开关
---
lang: bash
link: https://github.com/affaan-m/everything-claude-code/blob/main/hooks/README.md
desc: ECC 的 hooks 不是装饰，而是自动化守卫。重点记生命周期、阻断能力和运行时开关。
---

- `PreToolUse` : 工具执行前校验，可提醒，也可用退出码 `2` 阻断
- `PostToolUse` : 工具执行后做分析、格式化、类型检查
- `Stop` : 每轮响应结束时审计 `console.log`、提炼模式、记录成本
- `SessionStart` / `SessionEnd` : 会话上下文加载与清理
- `PreCompact` : 压缩前保存状态，避免上下文丢失

```bash
# 运行时调整 hook 严格度
export ECC_HOOK_PROFILE=standard
export ECC_DISABLED_HOOKS="pre:bash:tmux-reminder,post:edit:typecheck"
```

- `minimal` : 只保留关键生命周期与安全钩子
- `standard` : 默认平衡配置
- `strict` : 更严格的提醒和护栏

## Skills / Rules / Contexts
---
lang: text
desc: ECC 把“临时提示词”沉淀为技能，把“永远要遵守的原则”沉淀为规则，再用 context 区分当前工作模式。
---

- `skills/` : 工作流或领域知识，如 `search-first`、`eval-harness`、`continuous-learning-v2`
- `rules/common/` : 通用约束，如 coding-style、testing、security、agents
- `rules/<lang>/` : TypeScript、Python、Golang、Perl 等语言特定规则
- `contexts/dev.md` : 正常开发模式
- `contexts/review.md` : 审查模式
- `contexts/research.md` : 研究 / 探索模式

```text
临时任务处理顺序：
1. 先看 rules，确认硬约束
2. 再选 skills，复用成熟工作流
3. 最后才补充一次性 prompt
```

## 跨工具落地
---
lang: text
desc: ECC 的卖点是同一套知识资产能复用到 Claude Code、Cursor、Codex 和 OpenCode，不必为每个工具重写一套方法论。
---

- `Claude Code` : 插件安装 + 复制 `rules/` 到 `~/.claude/rules/`
- `Codex CLI / App` : 依赖根目录 `AGENTS.md`，并配合 `.codex/` 资产
- `Cursor` : 共享 `AGENTS.md` 与适配过的 hooks / rules
- `OpenCode` : 可直接运行仓库，或使用 `ecc-universal` + `.opencode/`

```text
跨工具最稳定的共享入口：
AGENTS.md + skills/ + commands/ + rules/
```

## Cookbook 场景
---
lang: bash
desc: 下面这些套路比“完整安装步骤”更值钱，适合直接套用到真实项目。
---

### 新功能
- `/plan` -> `/tdd` -> `/quality-gate . --strict` -> `/code-review`

### 构建炸了
- `/build-fix`
- Go / Kotlin 项目再加 `/go-build`、`/kotlin-build`

### 长流程自动化
- `/harness-audit`
- `/loop-start sequential --mode safe`
- `/loop-status`

### 经验沉淀
- `/learn`
- `/learn-eval`
- `/evolve`

### 包管理器与环境统一
- `/setup-pm`

```bash
# loop 前先确认 repo 状态和 stop condition
/harness-audit
/loop-start sequential --mode safe
/loop-status
```

## 上下文与成本
---
lang: json
link: https://github.com/affaan-m/everything-claude-code/blob/main/docs/token-optimization.md
desc: ECC 强调“少而精的工具集”。MCP、模型和压缩策略决定了上下文质量，不是配置越多越强。
---

- MCP 建议保持 “配置里可以很多，但启用时少量”
- README 建议启用的 MCP 数量尽量控制在 `10` 个以内
- 活跃工具数量尽量控制在 `80` 个以内，避免上下文被工具说明吃掉
- 默认任务优先使用成本更低的模型，重型推理再切高阶模型

```json
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```
