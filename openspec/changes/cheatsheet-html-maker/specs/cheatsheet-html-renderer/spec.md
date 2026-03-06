## ADDED Requirements

### Requirement: 渲染器必须输出既有 DOM 结构
渲染器 MUST 生成与现有 cheatsheet 一致的结构语义：`masonry-grid > card > card-header/card-body`，并包含 `.card-emoji` 与 `.card-title`。

#### Scenario: card 结构完整输出
- **WHEN** 中间模型包含至少一个 card
- **THEN** 渲染器 SHALL 在输出中包含对应的 `card-header`、`card-body`、`card-emoji` 与 `card-title`

### Requirement: entry 与 set 必须按语义渲染
渲染器 MUST 将 code+desc entry 渲染为 `<div class="entry"><code ...></code><span class="entry-desc">...</span></div>`，并将 `###` 对应内容渲染为 `.set` 结构。

#### Scenario: set 内 entry 渲染
- **WHEN** 某 set 下包含普通 entry 与 code+desc entry
- **THEN** 渲染器 SHALL 在 `.set-body` 内按原顺序输出对应 entry 结构

### Requirement: 代码高亮标记必须完整
渲染器 MUST 为 inline code 与 block code 生成 `language-xxx` 类名；block code SHALL 使用 `<pre><code class="language-xxx">` 结构。

#### Scenario: 围栏代码无显式语言
- **WHEN** codeBlock 未指定语言且当前生效语言为 `bash`
- **THEN** 渲染器 SHALL 输出 `<pre><code class="language-bash">...`

### Requirement: 页面模板必须集成 Prism 初始化
生成 HTML MUST 包含 Prism Tomorrow 主题资源与 `Prism.highlightAll()` 初始化调用。

#### Scenario: 页面加载即高亮
- **WHEN** 用户在浏览器打开生成页面
- **THEN** 页面 SHALL 自动对代码块执行语法高亮而无需额外脚本注入
