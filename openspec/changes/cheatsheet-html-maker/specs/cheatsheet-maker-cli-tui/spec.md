## ADDED Requirements

### Requirement: CLI 参数模式必须支持输入输出控制
工具 MUST 支持 `--input` 与可选 `--output`；当未提供 `--output` 时 SHALL 使用与输入同名的 `.html` 路径。

#### Scenario: 省略 output 自动同名
- **WHEN** 执行 `cheatsheet-html-maker --input tmux.md`
- **THEN** 工具 SHALL 生成 `tmux.html`

### Requirement: 无参数时必须进入 TUI
工具 MUST 在无 CLI 参数时启动交互流程，至少包含输入文件选择、输出文件名确认、是否启用 AI emoji 补全三个步骤。

#### Scenario: TUI 流程完整执行
- **WHEN** 用户直接运行 `cheatsheet-html-maker`
- **THEN** 工具 SHALL 依次展示文件选择、输出名输入、AI emoji 开关并最终执行生成

### Requirement: 运行结果必须可观测
工具 MUST 在成功时输出明确成功信息与目标文件路径，在失败时输出错误原因并返回非零退出码。

#### Scenario: 输入文件不存在
- **WHEN** 参数模式指定的输入文件不存在
- **THEN** 工具 SHALL 输出可读错误信息并以非零状态码退出

### Requirement: AI emoji 补全必须为可选能力
工具 MUST 允许关闭 AI emoji；关闭或调用失败时 SHALL 回退到空 emoji，不得中断 HTML 生成。

#### Scenario: AI 服务不可用
- **WHEN** 用户启用 AI emoji 且 provider 请求失败
- **THEN** 工具 SHALL 记录告警并继续生成 HTML，未命中标题的 emoji 置空
