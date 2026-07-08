# codebase-memory-mcp 参考映射

## 官方入口
- [GitHub 仓库](https://github.com/DeusData/codebase-memory-mcp) — 源码与 README
- [GitHub Releases](https://github.com/DeusData/codebase-memory-mcp/releases/latest) — 版本与下载
- [arXiv 论文](https://arxiv.org/abs/2603.27277) — 技术原理与 benchmark

## 技术文档
- [README.md](https://github.com/DeusData/codebase-memory-mcp/blob/main/README.md) — 完整安装与使用文档
- [CONTRIBUTING.md](https://github.com/DeusData/codebase-memory-mcp/blob/main/CONTRIBUTING.md) — 从源码编译指南
- [install.sh](https://github.com/DeusData/codebase-memory-mcp/blob/main/install.sh) — macOS/Linux 安装脚本
- [install.ps1](https://github.com/DeusData/codebase-memory-mcp/blob/main/install.ps1) — Windows PowerShell 安装脚本
- [server.json](https://github.com/DeusData/codebase-memory-mcp/blob/main/server.json) — MCP server 配置

## MCP 配置
- Claude Code `.mcp.json` 格式
- Codex CLI `config.toml` 格式
- Gemini CLI `settings.json` 格式
- 手动配置示例见 README

## 核心能力分类
- **索引引擎**：Tree-Sitter AST + 混合 LSP 语义（9 种语言）
- **知识图谱**：SQLite FTS5 + 向量搜索，4.81M 节点 / 7.72M 边
- **14 MCP 工具**：索引/查询/追踪/ Cypher /变更检测
- **11 Agent 支持**：Claude Code / Codex / Gemini / Zed / Aider 等
- **Token 效率**：5 次查询 ~3,400 vs ~412,000 tokens，节省 99.2%
