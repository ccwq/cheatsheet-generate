## ADDED Requirements

### Requirement: Markdown 语法必须映射为统一中间模型
系统 MUST 将输入 Markdown 解析为稳定的数据模型，至少包含文档级元数据、card、set、entry、inlineCode 与 codeBlock 节点，以支持确定性的 HTML 渲染。

#### Scenario: 文档基础结构映射
- **WHEN** 输入包含 frontmatter、`#`、`##`、`###` 与列表条目
- **THEN** 系统 SHALL 在中间模型中生成对应的 document、card、set、entry 层级且顺序与源文档一致

### Requirement: 语言继承与覆盖规则必须可计算
系统 MUST 按固定优先级计算代码高亮语言：围栏代码显式语言 > card 级 `lang` > 文档级 `lang`（默认 `bash`）。

#### Scenario: 多级语言优先级生效
- **WHEN** 文档 `lang=bash`、某 card 覆盖 `lang=python` 且该 card 内存在 ` ```js ` 围栏代码
- **THEN** 系统 SHALL 分别为默认代码使用 `python`、围栏代码使用 `js`

### Requirement: emoji 元信息必须可表达
系统 MUST 为 card 提供 emoji 字段，支持显式提取与空值占位，以保证渲染层可以稳定输出 `.card-emoji`。

#### Scenario: 标题不含 emoji 时占位
- **WHEN** `##` 标题未包含 emoji 且未启用 AI 补全
- **THEN** 系统 SHALL 将该 card 的 emoji 字段置为空字符串而不是省略字段
