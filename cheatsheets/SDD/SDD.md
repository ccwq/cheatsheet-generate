---
title: Subagent-Driven Development 速查表
lang: zh
version: "v1.0.1"
date: 2026-05-25
github: nousresearch/hermes-agent
colWidth: 340px
---

# Subagent-Driven Development 速查表

## 快速定位
---
lang: bash
emoji: 🧭
desc: SDD 是用 delegate_task 派生子 agent 来执行复杂任务的流水线方法。核心思路是"每个子任务用 fresh subagent 执行，再加两层审查"。把它理解成"任务分发工厂"：你下订单（写 goal），工厂派工（subagent），质检员复查（spec + quality review）。
---

- 适合场景：≥3 个独立子目标并行、需要多源信息采集、耗时 >5 分钟的任务
- 核心链路：`读计划 → 派 Implementer → Spec 审查 → Quality 审查 → 标记完成`
- 不适用：单次工具调用、需用户交互的任务、定时/周期任务（用 cronjob）

## 起手：delegate_task 核心参数
---
lang: bash
emoji: 🚀
desc: 发起 subagent 前，先把 goal 和 context 写清楚。goal 是 subagent 的唯一任务指令，context 是父 agent 注入的背景信息。
---

### 核心签名

```python
delegate_task(
  goal="具体任务描述（动词开头，明确输出格式）",
  context="""背景/约束/文件路径。
  传文件路径让 subagent 自己读，不在 context 里塞内容。
  传错误信息贴最后3行，不要全量堆栈。
  传约束如"不修改原文件"、"必须用 subprocess"。
  """,
  toolsets=["terminal", "file"],   # 限定工具集，默认继承父 agent
  role="leaf",                    # leaf=纯执行(默认) | orchestrator=可再分叉(当前禁用)
)
```

### 并行批量

```python
delegate_task(tasks=[
  {goal: "任务 A", toolsets: ["web"]},
  {goal: "任务 B", toolsets: ["web"]},
  {goal: "任务 C", toolsets: ["web"]},
])
# 最多 3 个并行，超出则分批
```

## goal 写法规范
---
lang: bash
emoji: ✍️
desc: 一个合格的 goal 必须包含：角色、任务动作、输出格式、约束。四要素缺一，subagent 就会瞎猜。
---

### 四要素清单

| 要素 | 必填 | 写法 |
|------|:----:|------|
| 角色 | ✅ | "你是 Python 调试专家" |
| 任务 | ✅ | "读取 /path/to/file.py，分析变量 state" |
| 输出格式 | ✅ | `返回 JSON: {"root_cause": "...", "fix": "..."}` |
| 约束 | ✅ | "不要修改原文件" |

### Bad vs Good

```python
# ✗ BAD — subagent 不知道从哪下手
goal="帮我看看这个 bug"

# ✓ GOOD — 结构化，subagent 可直接执行
goal="""你是 Python 调试专家。
读取 /path/to/file.py，用 pdb 分析变量 state 的值。
返回 JSON: {"root_cause": "...", "fix": "..."}。
不要修改原文件。"""
```

## SDD 流水线：两阶段审查
---
lang: bash
emoji: 🔄
desc: 每个任务经过 Implementer → Spec Reviewer → Quality Reviewer 三步。顺序不能颠倒：必须先过 spec（做对了），再过 quality（做得好）。
---

### 第一步：派 Implementer

```python
delegate_task(
  goal="实现 Task 1: [任务描述]",
  context="""TASK FROM PLAN:
  - [具体要求 1]
  - [具体要求 2]

  FOLLOW TDD:
  1. 写失败的测试
  2. pytest 验证 FAIL
  3. 写最小实现
  4. pytest 验证 PASS
  5. pytest 全部回归测试
  6. git commit

  PROJECT CONTEXT:
  - 语言/框架：[...]
  - 已有文件：[...]
  - 测试框架：[...]
  """,
  toolsets=["terminal", "file"]
)
```

### 第二步：Spec Reviewer（做对了吗？）

```python
delegate_task(
  goal="审查实现是否满足原始规范",
  context="""ORIGINAL SPEC:
  - [要求 1]
  - [要求 2]

  CHECK:
  - [ ] 所有要求已实现？
  - [ ] 文件路径符合规范？
  - [ ] 函数签名符合规范？
  - [ ] 行为符合预期？
  - [ ] 无多余功能（无范围蔓延）？

  OUTPUT: PASS 或具体缺口列表
  """,
  toolsets=["file"]
)
```

### 第三步：Quality Reviewer（做得好吗？）

```python
delegate_task(
  goal="代码质量审查",
  context="""FILES TO REVIEW:
  - [文件路径 1]
  - [文件路径 2]

  CHECK:
  - [ ] 符合项目风格规范？
  - [ ] 错误处理完善？
  - [ ] 变量/函数命名清晰？
  - [ ] 测试覆盖充分？
  - [ ] 无安全漏洞？
  - [ ] 无明显 bug 或边界情况遗漏？

  OUTPUT FORMAT:
  - Critical Issues: [必须修复]
  - Important Issues: [强烈建议]
  - Minor Issues: [可选]
  - Verdict: APPROVED 或 REQUEST_CHANGES
  """,
  toolsets=["file"]
)
```

## 并行模式与链式组合
---
lang: bash
emoji: 🔗
desc: subagent 有两种组织方式：tasks[] 并行（共享父 context）和链式（上一个输出喂给下一个）。超过 3 个并行就改链式。
---

### 并行分发（≤3 个子任务）

```python
delegate_task(tasks=[
  {goal: "实现功能 A", context="...", toolsets: ["terminal","file"]},
  {goal: "实现功能 B", context="...", toolsets: ["terminal","file"]},
  {goal: "实现功能 C", context="...", toolsets: ["terminal","file"]},
])
```

### 链式组合（阶段一 → 阶段二）

```python
# 阶段1：并行收集
research = delegate_task(tasks=[
  {goal: "研究竞品 A", toolsets: ["web"]},
  {goal: "研究竞品 B", toolsets: ["web"]},
  {goal: "研究竞品 C", toolsets: ["web"]},
])

# 阶段2：串行综合（用阶段1结果）
synthesis = delegate_task(
  context=f"""你是分析师。整合以下调研结果：
  {research[0]['result']}
  {research[1]['result']}
  {research[2]['result']}""",
  goal="写一份竞品对比报告",
  toolsets=["terminal"]
)
```

### 超量并行 → 批处理

```python
# 6 个任务：分两批
batch1 = delegate_task(tasks=[
  {goal: "任务 1", toolsets: [...]},
  {goal: "任务 2", toolsets: [...]},
  {goal: "任务 3", toolsets: [...]},
])
batch2 = delegate_task(tasks=[
  {goal: "任务 4", toolsets: [...]},
  {goal: "任务 5", toolsets: [...]},
  {goal: "任务 6", toolsets: [...]},
])
```

## 结果验证
---
lang: bash
emoji: ✅
desc: subagent 报告"成功"可能是谎言。父 agent 必须自行核实可验证句柄（URL/文件路径/ID）。
---

### 验证原则

- 要求 subagent 返回**可验证句柄**，不是摘要
- HTTP POST 类：用 fetch_url/curl 验证实际状态
- 文件写入类：用 stat/ls 验证文件存在且大小 >0
- 不盲信 summary 中的"已完成"

### 验证模板

```python
# subagent context 中指定：
"""完成后返回：文件已写入路径列表"""

# 父 agent 读取验证：
read_file(path="/path/to/file.txt")
# 文件不存在或为空 → 重派 subagent 修复
```

### summary 截断处理

```python
# subagent context 中指定：
"""输出限制 3000 字，超过部分写文件并返回路径"""

# 父 agent 解析 summary JSON，再读文件：
import json
data = json.loads(summary)
read_file(path=data["files_written"][0])
```

## 常见坑与修复
---
lang: bash
emoji: ⚠️
desc: SDD 流水线里最容易出问题的 7 个地方。
---

| # | 坑 | 修复 |
|---|-----|------|
| 1 | context 传空 → subagent 不知道文件/约束 | 必须注入完整 context |
| 2 | goal 模糊 → "帮我看看" | 结构化：角色+任务+输出格式+约束 |
| 3 | 超 3 并行 → 触发 max_concurrent_children 限制 | 分批，先 3 个再 3 个 |
| 4 | orchestrator 滥用 → max_depth=1 禁用了 nest | 用 cronjob 链式代替 |
| 5 | 传原始 session 历史 → 浪费 token | 提炼关键信息再传 |
| 6 | 不验证结果 → 盲信"成功" | 要求返回 URL/路径，用工具核实 |
| 7 | 大段报告写进 summary → 被截断 | 写文件 + 父 agent 读文件交付 |

## SDD vs CRONJOB 决策树
---
lang: bash
emoji: 🌲
desc: 选 SDD（delegate_task）还是 cronjob？看是否需要即时结果和父 agent 汇总。
---

| 选 SDD | 选 cronjob |
|--------|-----------|
| 需要即时结果，用户等待中 | 定时执行（每天/每周） |
| 子任务可并行执行 | 需要独立 session 运行 |
| 总耗时 5-30 分钟 | 任务耗时 >30 分钟或不可预测 |
| 需要父 agent 汇总合并 | 需要 no_agent 模式（纯脚本 watchdog） |
| 临时性、探索性任务 | 递归调度（job → job） |

## 核心原则速记
---
lang: bash
emoji: 📌
desc: 记住这 4 句就够了。
---

- **Fresh subagent per task** — 每个任务用干净的 context，不累积状态污染
- **Spec FIRST, Quality SECOND** — 先验证"做对了"，再验证"做得好"，顺序不能颠倒
- **Review loops until APPROVED** — 审查发现问题 → 修复 → 再审查，不跳过
- **Verify before claiming success** — 要求可验证句柄，用工具自行核实
