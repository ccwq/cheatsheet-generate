# Claude Skills 速查 - 技能系统全面指南

## 🔧 基本概念
- **Skills**：Claude的技能系统，通过动态加载的指令、脚本和资源文件夹，提升特定任务的性能
- **核心优势**：改进特定任务性能、捕获组织知识、易于自定义、与其他Claude功能互补
- **渐进式披露**：仅在需要时加载相关内容，优化上下文窗口使用

## 📁 技能类型
- **Anthropic Skills**：内置技能，如文档编辑（Excel、Word、PowerPoint、PDF）
- **Custom Skills**：用户或组织创建的自定义技能，用于特定工作流

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

## 📊 技能与其他功能对比
- **vs Projects**：技能动态加载，项目提供静态背景知识
- **vs MCP**：技能提供程序知识，MCP连接外部服务
- **vs Custom Instructions**：技能任务特定，自定义指令全局适用

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

## 💡 应用场景
- 创意应用：艺术、音乐、设计
- 技术任务：测试Web应用、MCP服务器生成
- 企业工作流：通信、品牌、数据分析

## 🔗 核心命令（Claude Code）
- `/plugin marketplace add anthropics/skills`：添加技能市场
- `/plugin install document-skills@anthropic-agent-skills`：安装文档技能
- `/plugin install example-skills@anthropic-agent-skills`：安装示例技能

## 📱 可用性
- **Claude Code**：支持安装和使用技能
- **Claude.ai**：付费计划可用
- **Claude API**：支持上传和使用自定义技能

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

## 💻 Claude Code 使用 Skills
- **前提**：在 [Settings > Capabilities](https://claude.ai/settings/capabilities) 启用 Code execution & Skills（Pro/Max/Team/Enterprise 支持）。
- **安装官方技能**：终端运行 `/plugin marketplace add anthropics/skills`，再执行 `/plugin install document-skills@anthropic-agent-skills` 或 `example-skills`。
- **调用方式**：自动按描述匹配，也可在提示中点名技能；技能需保持“已开启”。
- **上传自定义技能**：将包含 `SKILL.md` 的文件夹打包 ZIP，在 Settings > Capabilities > Skills 点击 “Upload skill”；目录名需与 `name` 小写连字符一致。
- **故障排查**：未调用→检查 toggle/描述是否清晰/已启用 code execution；上传失败→多因 ZIP 超限、缺少 `SKILL.md`、目录名与 `name` 不符。

## 🧭 Codex Skills（实验）
- **特性状态**：实验性，随时可能变更；使用需自担风险。
- **存放位置**：`~/.codex/skills/**/SKILL.md`（递归扫描，跳过隐藏项/软链，仅精确文件名）。
- **文件格式**：YAML frontmatter `name`（≤100 字符）、`description`（≤500 字符），正文可任意 Markdown；正文不注入上下文，运行时只注入名称、描述、绝对路径。
- **加载方式**：启动时一次扫描；若存在合法技能，会在运行时追加 `## Skills` 列表（位于 `AGENTS.md` 之后），缺失则不生成。
- **创建步骤**：
```yaml
---
name: your-skill-name
description: what it does and when to use it (<=500 chars)
---

# Optional body
Instructions/示例保存在本地，不会自动注入上下文。
```
- **校验与报错**：字段缺失/超长/非法时，启动会弹出可关闭的错误模态并写日志；需修复 `SKILL.md` 后重启。
- **参考**：[Codex docs/skills.md](https://github.com/openai/codex/blob/main/docs/skills.md)
