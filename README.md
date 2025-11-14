# Cheatsheet Generator

一个基于AI的自动化技术速查表（Cheat Sheet）生成工具。

## 项目简介

本项目使用AI技术自动生成各种开发工具、框架和库的速查表HTML页面。通过提供主题描述，系统能够自动整理核心API、配置选项、实用示例及最佳实践，生成结构完整、内容详尽的速查表。

## 功能特性

- 🤖 **AI驱动生成**：基于主题描述自动生成技术速查表
- 📱 **响应式设计**：支持多列瀑布流布局，适配不同设备
- 🎨 **现代UI设计**：采用渐变背景、毛玻璃效果和圆角卡片
- 🔧 **交互式控制**：内置列宽调节滑块，支持实时布局调整
- 📚 **模块化结构**：每个功能模块独立为卡片，避免分页断裂
- 🌐 **纯HTML输出**：无外部依赖，可直接在浏览器中运行

## 项目结构

```
cheatsheet-generate/
├── base.md              # AI提示词模板和生成规则
├── CLAUDE.md            # 项目配置说明
├── cheatsheets/         # 生成的速查表目录
│   ├── example/         # 示例速查表
│   └── utools开发指南/   # uTools开发指南速查表
└── README.md            # 项目说明文档
```

## 使用方法

### 1. 准备主题
在AI工具中提供主题描述，例如：
- "cygwin使用指南"
- "React Hooks速查表"
- "Git命令大全"

### 2. 生成速查表
AI将根据主题内容：
- 分析相关技术文档和API
- 整理核心功能和最佳实践
- 生成结构化的HTML速查表

### 3. 查看结果
生成的速查表将保存在 `cheatsheets/` 目录下，每个主题对应一个子目录，包含：
- `.html` 文件：完整的速查表页面
- `.md` 文件：精简版提示词（供其他AI使用）

## 导入现有在线 Cheatsheet（下载器）

links.md 中包含了我之前整理的在线 cheatsheet 列表（JSON 代码块），其中 `url` 为其在线网址，`src` 为图标地址。可以使用内置下载器将这些在线页面离线化保存。

- 运行方式：
  - `node codepen-downloader/codepen-downloader.js`（需要 Node 16+；推荐 18+）
  - 可选参数：
    - `--only "关键词"` 仅处理匹配名称或 URL 的项
    - `--limit N` 限制处理数量
    - `--dry-run` 仅打印将要执行的操作

- 保存结构：
  - `cheatsheets-import/{slug}/source.html`（提取前：原始响应/CodePen包装页）
  - `cheatsheets-import/{slug}/index.html`（提取后：最终HTML，若为CodePen则为iframe.srcdoc）
  - `cheatsheets-import/{slug}/icon.*`（按内容类型自动扩展名）

- CodePen 兼容：
  - 对于形如 `https://codepen.io/{user}/full/{slug}` 的链接，下载器会自动解析返回页面中的 `iframe#result.srcdoc`，并将其作为最终 HTML 内容保存。

## 技术特点

- **HTML5标准**：语义化标签，符合Web标准
- **CSS多列布局**：column-count实现瀑布流效果
- **响应式设计**：支持桌面端和移动端
- **代码高亮**：深色主题的语法着色
- **性能优化**：无外部依赖，加载快速

## 开发说明

### 模板结构
项目使用Pug/Jade风格的HTML模板，包含：
- 头部元数据和样式定义
- 交互控制面板（列宽调节）
- 多列内容容器
- 模块化卡片组件

### 样式规范
- 字体：12px基础字号，行高1.1
- 颜色：深色主题渐变背景
- 间距：8px/12px/16px标准间距
- 响应式断点：1500px/1100px/750px

## 许可证

本项目仅供学习和研究使用。

## 贡献

欢迎提交Issue和Pull Request来改进项目。



















links.md中的json实际上是我之前整理的cheatsheet, 其中url表示其在线网址

"""
网址对应关系如下
url值https://codepen.io/zeniok/full/YPyNVXG,
真实cheatsheet html网址https://cdpn.io/zeniok/fullpage/gbagyGa?view=fullpage

但是其响应内容被无关字符串包裹了, 解析后的内容如下, 其中iframe.srcdoc才是我们要提取的html的内容

...
<body class="">
  <div class="referer-warning">
    <h1><span>⚠️</span> Do not enter passwords or personal information on this page. <span>⚠️</span></h1>
      This is a code demo posted by a web developer on <a href="https://codepen.io">CodePen</a>.
    <br />
    A referer from CodePen is required to render this page view, and your browser is not sending one (<a href="https://blog.codepen.io/2017/10/05/regarding-referer-headers/" target="_blank" rel="noreferrer noopener">more details</a>).</h1>
  </div>

  <div id="result-iframe-wrap" role="main">
    <iframe
      id="result"
      srcdoc="<!DOCTYPE html>
<html lang=&quot;en&quot; >

<head>
  <meta charset=&quot;UTF-8&quot;>
  

    <link rel=&quot;apple-touch-icon&quot; type=&q
...
"""

现在执行如下的工作


需要开发一个下载器, 可以根据links.md中的json来下载cheatsheet的html内容,

下载到的结果应该包括
- 原始html内容
- 图标,src字段的内容, 一文件形式存放

结果如下使用如下结构
cheatsheets-import
├── example/
│   ├── index.html
│   └── icon.png

