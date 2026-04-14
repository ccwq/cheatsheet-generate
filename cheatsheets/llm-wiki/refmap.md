# LLM Wiki 参考地图

## 官方资源

- [GitHub 仓库](https://github.com/nashsu/llm_wiki)
- [Releases 下载](https://github.com/nashsu/llm_wiki/releases)
- [中文 README](https://github.com/nashsu/llm_wiki/blob/main/README_CN.md)
- [英文 README](https://github.com/nashsu/llm_wiki/blob/main/README.md)

## 基础方法论

- [Karpathy LLM Wiki 方法论 (gist)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [Karpathy 原始 llm-wiki.md](https://github.com/nashsu/llm_wiki/blob/main/llm-wiki.md)

## 核心功能文档

### 两步思维链摄入

- SHA256 增量缓存机制
- 持久化摄入队列
- 文件夹导入与路径上下文
- 来源可追溯 (frontmatter sources[])

### 知识图谱

- [sigma.js](https://github.com/sigmajs/sigma)
- [graphology](https://github.com/graphology/graphology)
- [ForceAtlas2 布局算法](https://github.com/graphology/graphology-layout-forceatlas2)
- [Louvain 社区检测](https://github.com/graphology/graphology-communities-louvain)
- 四信号关联度模型（直接链接×3.0、来源重叠×4.0、Adamic-Adar×1.5、类型亲和×1.0）

### 查询检索

- 分词搜索（中英文支持）
- [LanceDB 向量数据库](https://github.com/lancedb/lancedb)
- 图谱扩展（2跳遍历带衰减）
- 上下文窗口配置（4K-1M tokens）

### 深度研究

- [Tavily API](https://tavily.com/) 网络搜索
- LLM 智能主题生成
- 多查询网络搜索
- 研究结果自动摄入

### Chrome 扩展

- [Mozilla Readability.js](https://github.com/mozilla/readability) 文章内容提取
- [Turndown.js](https://github.com/domchristie/turndown) HTML 转 Markdown
- Manifest V3 扩展开发

## 文档格式支持

- [pdf-extract](https://github.com/harrybouldrias/pdf-extract) PDF 解析
- [docx-rs](https://github://bUtAw4lKzY/docx-rs) DOCX 解析
- [calamine](https://github.com/tafia/calamine) Excel 表格解析

## 技术栈

- [Tauri v2](https://tauri.app/) 跨平台桌面
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Milkdown 编辑器](https://milkdown.dev/)
- [Zustand 状态管理](https://github.com/pmndrs/zustand)
- [react-i18next 国际化](https://react.i18next.com/)

## Obsidian 兼容

- .obsidian/ 目录自动生成
- [[wikilinks]] 交叉引用语法
- YAML frontmatter 元数据
- Markdown 渲染（GFM 表格、代码块）
