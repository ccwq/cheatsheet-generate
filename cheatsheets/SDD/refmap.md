# SDD 参考资源

## 版本记录
- 当前版本：v1.0.0（2026-05-25）

## 相关规范与文档
- Hermes Agent 官方文档: https://hermes-agent.nousresearch.com/
- delegate_task API 参考: https://hermes-agent.nousresearch.com/docs/api/d delegate_task
- subagent-driven-development 技能: https://github.com/nousresearch/hermes-agent/tree/main/skills/software-development/subagent-driven-development
- multi-agent-role-cookbook 技能: https://github.com/nousresearch/hermes-agent/tree/main/skills/software-development/multi-agent-role-cookbook
- writing-plans 技能: https://github.com/nousresearch/hermes-agent/tree/main/skills/software-development/writing-plans

## 关键主题
- delegate_task 核心参数: goal, context, toolsets, role, tasks
- 两阶段审查: Implementer → Spec Reviewer → Quality Reviewer
- 并行模式: tasks[] 数组，最多 3 个并行
- 链式组合: 阶段一结果注入阶段二 context
- 结果验证: 可验证句柄，父 agent 自行核实
- SDD vs cronjob 决策: 即时/并行/汇总 → SDD；定时/独立/长时 → cronjob

## 相关 Cheatsheet
- hermes-agent: Hermes Agent 核心工具与命令速查
- multi-agent-role-cookbook: 多角色 subagent 管理与调度
- writing-plans: 实现计划创建与执行
