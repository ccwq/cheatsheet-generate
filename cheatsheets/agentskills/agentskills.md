---
title: Agent Skills 速查
lang: bash
version: "main@a3d02daa (2026-03-05)"
date: 2026-03-06
github: agentskills/agentskills
---

# Agent Skills 速查

## 🧩 核心概念与生命周期
---
emoji: "🧩"
link: https://agentskills.io/what-are-skills
desc: Skills 是可移植的能力包，通过渐进式披露在需要时加载。
---

### 三层加载模型
- `Tier 1` : Catalog（只加载 name + description）
- `Tier 2` : 激活后加载 `SKILL.md` 全文或正文
- `Tier 3` : 仅在需要时读取 `scripts/`、`references/`、`assets/`

### 什么时候用技能
- 用户任务有明确领域流程（如 PDF、MCP、评测）
- 需要可复用步骤，而非一次性回答
- 需要跨代理/跨工具复用同一份规则

```text
# 渐进式披露的目标
# 减少初始上下文成本，只在命中任务时加载细节
Catalog -> SKILL.md -> 附加资源
```

## 📄 SKILL.md 必备结构
---
emoji: "📄"
link: https://agentskills.io/specification#frontmatter-required
desc: 每个 skill 目录必须有 SKILL.md，且包含 YAML frontmatter。
---

### Frontmatter 必填字段
- `name` : 技能标识，需与目录名匹配
- `description` : 描述“做什么 + 何时用”

### 可选字段
- `license` : 许可证说明
- `compatibility` : 运行环境约束
- `metadata` : 自定义键值
- `allowed-tools` : 预授权工具（实验特性）

```yaml
# 最小可用 SKILL.md 头部
---
name: api-contract-review
description: 审核 API 契约一致性并给出修复建议。用于接口变更评审与发布前检查。
---
```

## 🗂️ 目录与资源组织
---
emoji: "🗂️"
link: https://agentskills.io/specification#optional-directories
desc: 用浅层目录保持可发现性，资源按用途分层，不要深链依赖。
---

### 推荐结构
- `SKILL.md` : 主说明，建议 < 500 行
- `scripts/` : 可执行脚本
- `references/` : 按需读取的详细资料
- `assets/` : 模板、图示、静态数据

```text
# 推荐技能目录
my-skill/
├── SKILL.md
├── scripts/
├── references/
└── assets/
```

### 路径引用规则
- 在 `SKILL.md` 中使用相对路径（相对 skill 根目录）
- 避免跨多层引用链，优先一跳可达

## 🏷️ name / description 约束
---
emoji: "🏷️"
link: https://agentskills.io/specification#name-field
desc: 名称可解析、描述可触发，是技能被正确激活的关键。
---

### name 规则
- `a-z0-9-` : 仅小写字母、数字、短横线
- `1-64` : 长度限制
- `no --` : 禁止连续短横线
- `match dir` : 必须与父目录同名

### description 写法
- 写清“触发场景 + 产出能力”
- 包含高频关键词，便于模型命中
- 避免空泛描述（如“帮助处理文档”）

```text
# 好描述示例
Extract text/tables from PDF, fill forms, merge files.
Use when user asks PDF extraction, form filling, or document merge.
```

## 🔎 发现与扫描策略
---
emoji: "🔎"
link: https://agentskills.io/client-implementation/adding-skills-support#step-1-discover-skills
desc: 启动时扫描并缓存 Catalog，项目级通常覆盖用户级同名技能。
---

### 常见扫描路径
- `<project>/.<client>/skills/` : 客户端私有路径
- `<project>/.agents/skills/` : 跨客户端共享约定
- `~/.<client>/skills/` : 用户级私有路径
- `~/.agents/skills/` : 用户级共享路径

### 冲突与信任
- 同名冲突建议：`project > user`
- 对不可信仓库可禁用 project-level skills
- 扫描时排除 `.git/`、`node_modules/`

```bash
# 发现规则摘要
# 仅识别“子目录内存在 SKILL.md”的目录
scan <skills_root> -> subdir contains SKILL.md -> load metadata
```

## 🧪 解析与容错
---
emoji: "🧪"
link: https://agentskills.io/client-implementation/adding-skills-support#step-2-parse-skill-md-files
desc: 解析失败要可观测，验证应尽量宽容，确保生态兼容。
---

### 解析流程
- `--- ... ---` : 先提取 frontmatter
- `yaml parse` : 解析 name/description 等字段
- `body` : closing `---` 之后全部视为正文

### 容错建议
- YAML 小错误可尝试修复后重试
- 缺 `description` 通常应跳过该技能
- 其他轻微违规可警告后继续加载

```json
{
  "name": "pdf-processing",
  "description": "提取 PDF 文本与表格，用于文档处理任务",
  "location": "/path/to/SKILL.md"
}
```

## 🧠 Catalog 披露与激活
---
emoji: "🧠"
link: https://agentskills.io/client-implementation/adding-skills-support#step-4-activate-skills
desc: 先披露可用技能，再按任务触发激活，避免一次性塞满上下文。
---

### 披露（Disclose）
- 向模型提供 `name + description (+ location)`
- 无可用技能时，不要输出空 catalog 块

### 激活（Activate）
- 文件读取模式：直接读取 `SKILL.md`
- 专用工具模式：`activate_skill(name)` 返回正文
- 用户显式触发：`/skill-name` 或客户端约定语法

```xml
<available_skills>
  <skill>
    <name>mcp-integration</name>
    <description>配置并排障 MCP Server，用于外部工具接入</description>
    <location>/repo/.agents/skills/mcp-integration/SKILL.md</location>
  </skill>
</available_skills>
```

## 🧷 上下文管理与去重
---
emoji: "🧷"
link: https://agentskills.io/client-implementation/adding-skills-support#step-5-manage-skill-context-over-time
desc: 激活后要保护技能指令不被压缩丢失，并避免重复注入。
---

### 核心做法
- 标记 skill 内容为“不可压缩”或“低优先级剪裁”
- 记录 session 已激活技能，重复请求时跳过注入
- 输出使用结构化包裹，便于后续识别与清理

```xml
<skill_content name="csv-analyzer">
# ...skill body...
</skill_content>
```

## ⚙️ scripts 用法与执行模式
---
emoji: "⚙️"
link: https://agentskills.io/skill-creation/using-scripts
desc: 把复杂重复动作沉淀到 scripts，脚本接口要可自动化调用。
---

### 一次性命令
- `npx pkg@ver` : Node 生态临时执行
- `uvx pkg@ver` : Python 工具临时执行
- `go run module@ver` : Go 工具直接运行

### 可复用脚本设计
- 提供 `--help`，参数语义清晰
- 禁止交互式输入，全部走 flag/env/stdin
- stdout 输出结构化结果，stderr 输出诊断

```python
# /// script
# dependencies = [
#   "beautifulsoup4>=4.12,<5"
# ]
# ///

# 提取页面标题，输出 JSON 友好结构
from bs4 import BeautifulSoup

html = "<h1>Agent Skills</h1>"
soup = BeautifulSoup(html, "html.parser")
print({"title": soup.h1.get_text(strip=True)})
```

## 📊 评测与迭代（Eval-Driven）
---
emoji: "📊"
link: https://agentskills.io/skill-creation/evaluating-skills
desc: 通过 with-skill/without-skill 对照评测，持续优化技能质量。
---

### 评测最小闭环
- 准备 `evals/evals.json`（prompt/expected/assertions）
- 每条 case 跑两次：`with_skill` 与 `without_skill`
- 产出 `grading.json`、`timing.json`、`benchmark.json`

### 关注指标
- `pass_rate` : 断言通过率
- `duration_ms` : 耗时
- `total_tokens` : token 成本
- `delta` : 与基线差值

```json
{
  "run_summary": {
    "with_skill": { "pass_rate": { "mean": 0.83 } },
    "without_skill": { "pass_rate": { "mean": 0.33 } },
    "delta": { "pass_rate": 0.50 }
  }
}
```

## 🧯 常见陷阱与排障
---
emoji: "🧯"
link: https://agentskills.io/client-implementation/adding-skills-support#handling-name-collisions
desc: 多数问题来自命名、路径、上下文压缩与不稳定脚本接口。
---

### 高频问题
- `name` 与目录名不一致，导致校验/发现异常
- 说明过泛，模型无法正确触发技能
- 脚本依赖不固定，运行结果随环境漂移
- 上下文压缩后丢失 skill 指令，行为回退

### 快速排查清单
- `check 1` : `SKILL.md` frontmatter 是否可解析
- `check 2` : 相对路径是否都以 skill 根目录为基准
- `check 3` : 是否记录并去重已激活技能
- `check 4` : 评测集是否覆盖真实任务与边界场景

```bash
# 排障优先级
# 先修结构与触发，再修脚本细节
parse -> discover -> activate -> evaluate
```
