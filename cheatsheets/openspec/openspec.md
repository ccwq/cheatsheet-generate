OpenSpec / OPSX 使用提示（精简版）

定位
- 规格先行：先对齐意图与范围，再实施与归档
- specs 是当前行为真源，changes 是变更提案

核心流程
1) /opsx:new <change>
2) /opsx:continue 逐步生成 artifact（或 /opsx:ff 一次生成）
3) /opsx:apply 实施 tasks
4) openspec validate <change>
5) /opsx:archive 归档并合并 Delta

OPSX 命令清单
1. 探索与初始化
- /opsx:explore [topic]
  - 明确需求或技术方案
  - 示例: /opsx:explore "如何集成 OAuth"
- /opsx:new [change-name]
  - 初始化变更目录
  - 示例: /opsx:new add-oauth-login

2. 规划与生成 Artifacts
- /opsx:continue [change-name]
  - 按 Proposal → Specs → Design → Tasks 顺序逐步生成
- /opsx:ff [change-name]
  - 快速生成所有规划文件 (Fast-forward)

3. 实施与验证
- /opsx:apply
  - 执行 tasks.md 中的任务列表
- /opsx:verify
  - 校验实现是否符合 Specs

4. 归档与维护
- /opsx:archive [change-name]
  - 合并 Delta Specs 到真源并移动目录
  - 示例: /opsx:archive add-oauth-login
- /opsx:bulk-archive
  - 批量归档
- /opsx:sync
  - 同步规格

5. 辅助命令
- /opsx:onboard
  - 新手引导


CLI 命令
- openspec list
- openspec view
- openspec show <change>
- openspec validate <change>
- openspec archive <change> --yes
- openspec update

Delta 规格格式
- ADDED / MODIFIED / REMOVED Requirements
- Requirement 标题：### Requirement: <名称>
- Scenario 标题：#### Scenario: <名称>
- 修改需求时提供完整新版本条目

技能 / 命令入口
- 支持 Slash/Skills 的工具用命令面板触发 OpenSpec 指令
- 不支持 Slash 的工具使用 AGENTS.md 作为上下文入口
