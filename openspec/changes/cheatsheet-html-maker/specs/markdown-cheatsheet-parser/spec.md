## ADDED Requirements

### Requirement: 解析器必须支持 frontmatter 与标题层级
解析器 MUST 识别文档顶部 YAML frontmatter，并将 `title` 与 `lang` 注入模型；同时 SHALL 将 `#` 作为页面标题、`##` 作为 card、`###` 作为 set。

#### Scenario: 标题层级被正确解析
- **WHEN** 输入文档包含 `#`、多个 `##` 与其下的 `###`
- **THEN** 解析器 SHALL 生成多个 card，并将各 `###` 归属到最近的上级 card

### Requirement: 解析器必须识别 entry 语法
解析器 MUST 识别 `- \`code\` : 描述` 与 `- 普通文字` 两类列表条目，并分别输出 code+desc entry 与 text entry。

#### Scenario: code+desc 条目解析
- **WHEN** 列表项为 `- \`C-b c\` : 新建窗口`
- **THEN** 解析器 SHALL 生成 entry，其中 code 为 `C-b c`，description 为 `新建窗口`

### Requirement: 解析器必须处理代码块语义
解析器 MUST 区分独占一行 inline code 与围栏代码块，并为两者输出不同节点类型，供渲染层映射为不同 HTML 结构。

#### Scenario: inline code 与 fenced code 区分
- **WHEN** 输入同时包含独占行 `` `cmd` `` 与 ` ```bash ` 代码块
- **THEN** 解析器 SHALL 输出 inlineCode 节点与 codeBlock 节点，且不混淆

### Requirement: 解析器必须支持 card 级 lang 覆盖片段
解析器 MUST 识别紧随 `##` 后的 `---\nlang: xxx\n---` 元数据片段，并将其作为该 card 的默认语言。

#### Scenario: card 语言覆盖生效
- **WHEN** 某 `##` 下紧接 `---\nlang: js\n---`
- **THEN** 解析器 SHALL 在该 card 模型中记录 `lang=js`
