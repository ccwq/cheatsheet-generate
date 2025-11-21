Claude Code Spec Workflow 在 Claude Code 中提供规范驱动的新特性与缺陷修复工作流，通过 /spec-create、/spec-execute、/spec-status 等命令串联「需求 → 设计 → 任务 → 实现」，通过 /bug-create、/bug-analyze、/bug-fix、/bug-verify 管理「报告 → 分析 → 修复 → 验证」，并结合 /spec-steering-setup 维护 product.md/tech.md/structure.md 等 Steering 文档及 claude-code-spec-workflow get-*context 命令实现上下文批量加载与 token 优化，仅聚焦使用模式与最佳实践，不包含安装与环境配置细节。

