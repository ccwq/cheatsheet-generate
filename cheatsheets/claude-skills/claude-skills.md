# Claude Skills 速查 - 完整指南

## 🔧 基本概念
- **Skills**：Claude的技能系统，通过动态加载的指令、脚本和资源文件夹，提升特定任务的性能
- **核心优势**：改进特定任务性能、捕获组织知识、易于自定义、与其他Claude功能互补
- **渐进式披露**：仅在需要时加载相关内容，优化上下文窗口使用

## 📁 技能类型
- **Anthropic Skills**：内置技能，如文档编辑（Excel、Word、PowerPoint、PDF）
- **Custom Skills**：用户或组织创建的自定义技能，用于特定工作流

## 核心概念与架构 [🔗](https://github.com/anthropics/claude-cookbooks/tree/main/skills#what-are-skills)
- Skills = 指令 + 代码 + 资源的组合包，按需加载（渐进式披露）以节省上下文。
- 典型能力：生成/编辑 Excel、PowerPoint、PDF、Word；数据分析与可视化；嵌入品牌化流程。
- 运行容器支持代码执行与文件读写，返回 `file_id` 供后续下载。

## Beta 配置与客户端初始化 [🔗](https://github.com/anthropics/claude-cookbooks/blob/main/skills/README.md#api-configuration)
```python
from anthropic import Anthropic

client = Anthropic(
    api_key="your-api-key",
    default_headers={
        "anthropic-beta": "code-execution-2025-08-25,files-api-2025-04-14,skills-2025-10-02"
    }
)
```
- 必需 beta 头：`code-execution-2025-08-25`、`files-api-2025-04-14`、`skills-2025-10-02`。
- 推荐：在所有消息调用中保持同一批 beta 头，避免环境差异。

## 📋 技能结构
- **SKILL.md**：核心文件，包含YAML元数据和Markdown指令
  - 必需字段：`name`、`description`
  - 可选字段：`dependencies`
- **资源文件**：额外的参考文档、脚本等
- **脚本文件**：可执行代码，用于高级功能

## 🛠️ 创建技能步骤
1. **编写SKILL.md**：包含YAML元数据和Markdown指令
2. **添加资源文件**：如REFERENCE.md、脚本等
3. **打包技能**：将所有文件放入一个文件夹，压缩为ZIP
4. **上传技能**：在Claude设置中上传自定义技能
5. **测试技能**：使用不同提示验证技能是否被正确调用

## 📝 SKILL.md 示例
```yaml
name: my-skill-name
description: A clear description of what this skill does and when to use it
```

## 🔍 使用技能
- **自动调用**：Claude根据任务自动识别并加载相关技能
- **手动调用**：在提示中明确提及技能名称
- **管理技能**：在Claude设置中启用/禁用/删除技能

## 内置技能与调用示例 [🔗](https://github.com/anthropics/claude-cookbooks/blob/main/skills/README.md#built-in-skills-reference)
- 内置 ID：`xlsx`（Excel）、`pptx`（PowerPoint）、`pdf`（PDF）、`docx`（Word）。
- 典型调用（生成 Excel）：  
```python
resp = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=4096,
    container={"skills": [{"type": "anthropic", "skill_id": "xlsx", "version": "latest"}]},
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}],
    messages=[{"role": "user", "content": "生成部门预算表，包含收入/支出/差异三列"}]
)
```
- 提示写法：直接描述目标文档结构与格式；若需图表，注明数据源与图表类型。

## 生成文件与 Files API 下载 [🔗](https://docs.claude.com/en/api/files-content)
- Skills 生成文档后在返回块里包含 `file_id`；用 Files API 下载。
```python
file_id = next(
    (b.output["file_id"] for b in resp.content if getattr(b, "output", None) and "file_id" in str(b.output)),
    None
)
if file_id:
    content = client.beta.files.download(file_id=file_id)
    with open("outputs/report.xlsx", "wb") as f:
        f.write(content.read())
```
- 常用 Files API：`download` 二进制流、`retrieve_metadata` 查看 `filename/size_bytes`、`list` 列出、`delete` 删除。

## 📊 技能与其他功能对比
- **vs Projects**：技能动态加载，项目提供静态背景知识
- **vs MCP**：技能提供程序知识，MCP连接外部服务
- **vs Custom Instructions**：技能任务特定，自定义指令全局适用

## Notebook 工作流速览 [🔗](https://github.com/anthropics/claude-cookbooks/tree/main/skills/notebooks)
- `01_skills_introduction.ipynb`：快速体验 Skills 架构、Excel/PPTX/PDF 生成示例。
- `02_skills_financial_applications.ipynb`：财务仪表盘、投资组合分析、CSV→Excel→PPTX→PDF 串联。
- `03_skills_custom_development.ipynb`：自定义技能示范（财务比率计算、品牌指南、财务建模套件）。
- `sample_data/`：财务报表、持仓、预算模板、季度 KPI 示例数据。

## 🚀 最佳实践
- **保持专注**：为不同工作流创建单独的技能
- **清晰描述**：帮助Claude决定何时使用技能
- **从简单开始**：先编写基本指令，再添加复杂脚本
- **包含示例**：帮助Claude理解成功案例
- **增量测试**：每次重大更改后测试

## 🔐 安全考虑
- 注意prompt injection风险
- 监控数据泄露风险
- 验证第三方包的安全性

## 自定义技能结构与命名 [🔗](https://github.com/anthropics/claude-cookbooks/blob/main/skills/README.md#creating-custom-skills)
```
my_skill/
├── SKILL.md           # 必需：含 name/description（小写连字符命名）
├── scripts/           # 可选：Python/JS 处理逻辑
└── resources/         # 可选：模板、数据、静态资产
```
- 打包为 ZIP，目录名需与 `SKILL.md` 中 `name` 一致（小写连字符）。
- `description` 写清适用场景与触发条件，便于自动匹配。

## 📦 打包规范
- 正确结构：
```
my-skill.zip
└── my-skill/
    ├── SKILL.md
    └── resources/
```
- 错误结构：
```
my-skill.zip
├── SKILL.md
├── resources/
└── (files directly in ZIP root)
```

## 📚 技能生态
- **公开仓库**：https://github.com/anthropics/skills
- **技能市场**：Claude Code插件市场
- **企业应用**：组织知识捕获、标准化工作流

## 性能与容器复用 [🔗](https://github.com/anthropics/claude-cookbooks/blob/main/skills/README.md#performance-tips)
- 渐进式披露：先给摘要/结构，再补充细节，减小 token。
- 容器复用：重用对话/容器以复用已加载的技能与上下文。
- 批处理：将同类生成合并到一次对话，减少启动开销。
- 组合技能：`xlsx + pptx + pdf` 组合可串联数据→幻灯片→导出 PDF。

## 💡 应用场景
- 创意应用：艺术、音乐、设计
- 技术任务：测试Web应用、MCP服务器生成
- 企业工作流：通信、品牌、数据分析

## 🔗 核心命令（Claude Code）
- `/plugin marketplace add anthropics/skills`：添加技能市场
- `/plugin install document-skills@anthropic-agent-skills`：安装文档技能
- `/plugin install example-skills@anthropic-agent-skills`：安装示例技能

## 常见财务用例 [🔗](https://github.com/anthropics/claude-cookbooks/blob/main/skills/notebooks/02_skills_financial_applications.ipynb)
- 财务报表与差异分析、预算 vs 实际。
- 投资组合表现/风险汇总，单页 KPI 仪表盘。
- 财务比率计算、趋势图/透视表自动化。
- 跨格式流水线：CSV → Excel → PowerPoint → PDF。

## 📱 可用性
- **Claude Code**：支持安装和使用技能
- **Claude.ai**：付费计划可用
- **Claude API**：支持上传和使用自定义技能

## 💻 Claude Code 使用 Skills
- **前提**：在 [Settings > Capabilities](https://claude.ai/settings/capabilities) 启用 Code execution & Skills（Pro/Max/Team/Enterprise 支持）。
- **安装官方技能**：终端运行 `/plugin marketplace add anthropics/skills`，再执行 `/plugin install document-skills@anthropic-agent-skills` 或 `example-skills`。
- **调用方式**：自动按描述匹配，也可在提示中点名技能；技能需保持"已开启"。
- **上传自定义技能**：将包含 `SKILL.md` 的文件夹打包 ZIP，在 Settings > Capabilities > Skills 点击 "Upload skill"；目录名需与 `name` 小写连字符一致。
- **故障排查**：未调用→检查 toggle/描述是否清晰/已启用 code execution；上传失败→多因 ZIP 超限、缺少 `SKILL.md`、目录名与 `name` 不符。

## 故障排查 [🔗](https://github.com/anthropics/claude-cookbooks/blob/main/skills/README.md#troubleshooting)
- 缺少 API Key：确认 `.env` 已设置 `ANTHROPIC_API_KEY`。
- 缺少 beta 头：确保请求含 `code-execution-2025-08-25`、`files-api-2025-04-14`、`skills-2025-10-02`。
- Token 超限：拆分任务，缩短提示，或按模块生成。
- ZIP 上传失败：检查是否缺失 `SKILL.md`，或目录名与 `name` 不一致。

## 🔄 技能更新
- 定期更新技能以适应新需求
- 测试更新后的技能兼容性
- 记录技能版本和变更

## 🎯 技能设计原则
- **模块化**：功能分离，便于维护和扩展
- **可组合**：多个技能可以协同工作
- **可发现**：清晰的描述和结构
- **高效**：优化上下文使用

## 👥 团队协作
- 共享技能模板
- 建立技能审核流程
- 文档化技能使用方法

## 📊 技能性能评估
- 监控技能调用频率
- 评估任务完成质量
- 收集用户反馈
- 优化技能指令

## 安全与最佳实践 [🔗](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- 避免提示注入：限制外部输入直写到代码/模板。
- 校验第三方包与数据源，必要时做沙箱/签名校验。
- 在 `description` 中声明风险边界与输入格式，减少误触发。
- 更新技能后回归测试典型用例，确认生成文件格式/公式正确。

## 📝 提示工程技巧
- 清晰说明任务目标和期望输出
- 提供具体示例和边界条件
- 明确指定使用的技能名称
- 设置合理的完成标准
- 使用结构化的输入格式

## 技能编写规范（官方最佳实践要点） [🔗](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- 触发条件清晰：`name/description` 直接写明适用场景、输入格式、约束与不可做的事。
- 目录与文件清晰：`SKILL.md` 放根目录，脚本/资源按 `scripts/`、`resources/` 分层；引用路径用相对路径。
- 明确执行意图：在说明里区分“执行脚本”与“参考脚本”；示例用语可写“运行 analyze_form.py 提取字段” vs “查看 analyze_form.py 的算法”。
- 数据与文件访问：在指令中写清可读写的目录与文件名模式，避免全盘扫描；给典型样例文件。
- 覆盖核心用例：提供 2-3 个代表性提示示例（输入+预期输出/文件），优先高频场景。
- 验证与迭代：用真实请求测试文件访问和规则应用；若模型漏掉规则，补充到 SKILL.md 并再次验证。
- 安全最小化：限制外部输入进入代码执行；对高风险操作（写文件/调用外部 API）加入显式条件或确认语句。

## 资源索引 [🔗](https://github.com/anthropics/claude-cookbooks/tree/main/skills#resources)
- README（Skills 总览与示例）：https://github.com/anthropics/claude-cookbooks/blob/main/skills/README.md
- Notebook：入门/财务/自定义三份示例
- Docs：Skills Overview、Best Practices、Files API
- 支持：两篇 Skills 使用教程 + 官方工程博客
