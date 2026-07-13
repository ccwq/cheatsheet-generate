# LLM Wiki 参考地图

## 官方入口
- [GitHub 仓库](https://github.com/nashsu/llm_wiki) — 源码、README 与最新功能
- [GitHub Releases](https://github.com/nashsu/llm_wiki/releases) — 预编译桌面安装包
- [中文 README](https://github.com/nashsu/llm_wiki/blob/main/README_CN.md) — 中文说明
- [AI Agent Skill](https://github.com/nashsu/llm_wiki_skill) — Claude Code / Codex 集成技能

## 方法论与兼容性
- [Karpathy LLM Wiki 方法论](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — 增量构建个人 Wiki 的原始设计模式
- [Obsidian](https://obsidian.md/) — Wiki 目录可直接作为 Obsidian vault
- 关键约定：`index.md` 导航、`log.md` 操作记录、YAML frontmatter、`[[wikilinks]]` 交叉引用

## 核心功能
- 两步链式摄入：先分析资料，再生成带来源追溯的 Wiki 页面
- SHA256 增量缓存、持久化队列、失败重试、文件夹导入与源目录自动监视
- 知识图谱：sigma.js + graphology + ForceAtlas2
- 4 信号关联度：直接链接 ×3、来源重叠 ×4、Adamic-Adar ×1.5、类型亲和 ×1
- Louvain 社区检测、惊奇连接、孤立页面、稀疏社区与桥接节点洞察
- 可选向量搜索：LanceDB + OpenAI-compatible embedding 端点
- Deep Research：Tavily、SerpApi 或 SearXNG 多查询搜索并自动摄入
- Chrome Web Clipper、图片感知摄入、MinerU PDF 解析、Mermaid 预览
- Rust 后端 Chat Agent、Agent Skills、生成文件预览、Async Review
- 本地 HTTP API、MCP Server 与 AI Agent Skill

## 文档与技术栈
- 文档：PDF、DOCX、PPTX、XLSX/XLS/ODS、图片、视频/音频、网页剪藏
- 桌面：Tauri v2 + Rust
- 前端：React 19 + TypeScript + Vite
- UI：shadcn/ui + Tailwind CSS v4
- 编辑器：Milkdown
- 搜索：分词检索 + 图谱扩展 + 可选向量检索
- 本地 API：`127.0.0.1:19828`

## 版本备注
- GitHub 仓库截至 2026-07-14：约 14.5K Stars、1.7K Forks，主要语言 TypeScript
- GitHub API 的许可证字段为 `NOASSERTION`，不要将其误写成 MIT 或 Apache-2.0
- 本速查表版本：0.3.2；采集日期：2026-07-14
