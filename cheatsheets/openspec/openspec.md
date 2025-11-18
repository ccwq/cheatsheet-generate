# OpenSpec 使用要点（规格先行 · 变更驱动）

目的：先锁定意图（规格），再实施任务，最后合并为“真源”。避免需求随对话漂移，确保可审阅、可追踪。

—

核心目录结构（仅使用相关内容，不含安装与初始化）：

```
openspec/
├─ specs/                # 规格“真源”
├─ changes/
│  └─ <change>/          # 变更工作区（AI 生成与维护）
│     ├─ proposal.md     # 为什么改、改什么（范围/意图）
│     ├─ tasks.md        # 实施清单（可勾选）
│     ├─ design.md       # 技术决策（可选）
│     └─ specs/**/spec.md# 各规格的“增量（Delta）”
└─ archive/              # 归档后的历史痕迹
```

—

规格写作规范（Understanding OpenSpec Files → Delta Format）：

- Requirement：`### Requirement: <名称>`（必须，正文用 SHALL/MUST）
- Scenario：`#### Scenario: <名称>`（每个 Requirement 至少一个场景）
- Delta 三段式：
  - `## ADDED Requirements`（新增能力）
  - `## MODIFIED Requirements`（修改行为，给出修改后的完整文本）
  - `## REMOVED Requirements`（废弃能力）

补充规范：
- MODIFIED 应提供“修改后的完整条目”，而非差异片段；Delta 只承载变更本身。
- 语气需明确可验证：使用 SHALL/MUST；避免“可能/建议/尽量”。
- 标题层级保持稳定：`##` → `###` → `####`；避免跳级或混用。

示例（Delta 片段）：

```markdown
## ADDED Requirements
### Requirement: Two-Factor Authentication
系统 MUST 在登录时要求第二要素。

#### Scenario: OTP required
- WHEN 用户提交有效凭据
- THEN 系统要求 OTP 校验
```

—

工作流（How It Works）：

1) Draft Proposal：创建 `changes/<change>/`，草拟 proposal、tasks 与规格 Delta。
2) Review & Align：与人类/AI反复审阅，直到对齐范围与细节。
3) Implement Tasks：严格按 tasks 实施，引用已对齐的规格。
4) Archive & Update：归档变更并将 Delta 合并入 `specs/`（形成“真源”）。

命名建议：`<change>` 采用 kebab-case（如 `add-profile-filters`、`migrate-auth-v2`），表达范围清晰可审计。

—

CLI 常用（不含安装与初始化）：

```
openspec list               # 查看活跃变更
openspec view               # 可视化看板（specs 与 changes 总览）
openspec show <change>      # 查看指定变更详情
openspec validate <change>  # 校验规格/Delta 格式
openspec archive <change> [-y|--yes]  # 归档并合并 Delta
openspec update             # 刷新各工具绑定/指令
```

典型闭环：
```
openspec list
openspec show add-profile-filters
openspec validate add-profile-filters
openspec archive add-profile-filters --yes
```

—

工具集成（Slash Commands 速览，按工具差异）：

- ` /openspec:proposal `、` /openspec:apply `、` /openspec:archive `（如 Claude Code、Codex 等）
- ` /openspec-proposal `、` /openspec-apply `、` /openspec-archive `（如 Cursor、Windsurf 等）
- 说明：多数工具自动读取 `openspec/AGENTS.md`；也有以工作流文件目录触发的实现。

常见映射：冒号风格（Claude Code / Codex / Gemini CLI 等），连字符风格（Cursor / Windsurf 等）；部分工具使用 `.kilocode/workflows/`、`.clinerules/workflows/` 承载触发文件。

—

团队协作建议：

- 由 AI 生成与维护 `changes/**`，人工专注审阅与对齐；避免手工搭骨架。
- 变更前先跑 `openspec validate <change>`；完成后使用 `openspec archive <change> --yes`。
- 跨工具协作时执行 `openspec update`，确保指令绑定一致。

CI 建议：在拉取请求校验阶段增加 `openspec validate <change>` 作为质量门，阻止不合规规格合入。

—

对比视角（How OpenSpec Compares）：

- 双目录模型（specs 真源 / changes 增量）使跨规格、多阶段迭代更清晰。
- 与 spec-kit/Kiro 相比，更适合既有系统的 1→n 改动与跨规格更新。

—

快速示例（2FA 变更最小闭环）：

```
openspec/
├─ specs/auth/spec.md              # 现有 Auth 规格
└─ changes/add-2fa/
   ├─ proposal.md                  # 动机与范围
   ├─ tasks.md                     # DB/后端/前端任务清单
   └─ specs/auth/spec.md           # Delta（ADDED: Two-Factor Authentication）
```

归档后：`changes/add-2fa/` 移入 `archive/`，Delta 合并到 `specs/` 成为真源。
