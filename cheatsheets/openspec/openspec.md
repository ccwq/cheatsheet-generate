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

OPSX 命令
- /opsx:new
- /opsx:continue
- /opsx:ff
- /opsx:apply
- /opsx:archive
- 启用实验性：openspec artifact-experimental-setup
- 新手引导：/opsx:onboard

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
