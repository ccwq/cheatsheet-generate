# Claude Code 参考文档

> **验证版本**: Claude Code 2.0.37 | 所有命令均已实际验证

## 官方文档链接
- [Claude Code Quickstart](https://code.claude.com/docs/en/quickstart) - 快速入门指南
- [Claude Code Overview](https://code.claude.com/docs/en/overview) - 功能概览
- [CLI Reference](https://code.claude.com/docs/en/cli-reference) - CLI命令参考
- [Slash Commands](https://code.claude.com/docs/en/slash-commands) - 斜杠命令
- [Interactive Mode](https://code.claude.com/docs/en/interactive-mode) - 交互模式
- [Checkpointing](https://code.claude.com/docs/en/checkpointing) - 检查点功能
- [Hooks Reference](https://code.claude.com/docs/en/hooks) - Hooks配置
- [Plugins Reference](https://code.claude.com/docs/en/plugins) - 插件系统
- [Claude Documentation Home](https://docs.claude.com/en/home) - 主文档中心

## 核心参考资源

### 安装与配置
- 官方安装脚本: https://claude.ai/install.sh (Linux/macOS)
- Windows PowerShell: https://claude.ai/install.ps1
- Homebrew: brew install --cask claude-code

### 账户与认证
- Claude.ai账户: https://claude.ai
- Claude Console: https://console.anthropic.com
- API文档: https://docs.anthropic.com/claude/reference

### CLI命令参考
#### 基础命令(6+)
- claude: 启动交互模式
- claude "任务": 执行一次性任务
- claude -p "查询": 单次查询后退出
- claude exec "任务": 非交互式自动化模式
- claude -c: 继续最近对话
- claude -r: 恢复之前对话
- claude commit: 创建Git提交

#### CLI选项(基于Claude Code 2.0.37验证)
- --help / -h: 显示帮助信息
- --version / -v: 显示版本信息
- --debug [filter]: 启用调试模式，支持过滤
- --settings <file-or-json>: 从JSON文件或字符串加载设置
- --model <model>: 指定AI模型
- -p, --print: 打印响应后退出
- -c, --continue: 继续最近的对话
- -r, --resume [sessionId]: 恢复指定ID的对话
- --fork-session: 恢复时创建新会话

#### 斜杠命令(内置28个，已验证)
##### 基本操作(7个)
- /help: 显示可用命令
- /clear: 清除对话历史
- /exit: 退出Claude Code
- /config: 打开设置界面
- /status: 查看当前状态信息
- /init: 初始化项目配置
- /doctor: 检查安装健康状态

##### 账户与模型(6个)
- /login: 切换/登录账户
- /logout: 登出当前账户
- /model: 选择或更改AI模型
- /usage: 查看使用限制和统计
- /cost: 显示token使用成本
- /permissions: 查看/更新权限设置

##### 开发工具(7个)
- /memory: 编辑记忆文件
- /todos: 查看和管理待办事项
- /context: 可视化上下文使用
- /review: 代码审查工具
- /pr_comments: 查看PR评论
- /mcp: 管理MCP连接
- /rewind: 回溯对话和编辑

##### 配置和输出(4个)
- /output-style: 设置输出风格
- /statusline: 配置状态行UI
- /terminal-setup: 设置终端快捷键
- /privacy-settings: 隐私设置管理

##### 高级功能(4个)
- /sandbox: 启用沙盒bash工具
- /vim: 进入vim编辑模式
- /hooks: 管理事件钩子
- /agents: 管理AI代理

##### 补充命令(5个)
- /add-dir: 添加工具访问目录
- /bashes: 管理后台bash进程
- /bug: 报告问题或bug
- /compact: 压缩对话历史
- /export: 导出对话数据

#### 自定义斜杠命令
- 项目命令: .claude/commands/ 目录
- 用户命令: ~/.claude/commands/ 目录
- 参数占位符: $ARGUMENTS(所有参数), $1, $2, $3(位置参数)
- 文件引用: @<file>
- bash执行: !<bash-command>

### 检查点系统
- 自动跟踪: 每次编辑前自动创建
- 跨会话持久: 30天后自动清理(可配置)
- 恢复方式: Esc+Esc打开菜单, 或使用/rewind
- 恢复选项: 仅对话, 仅代码, 同时恢复

### Hooks配置
- 配置文件: .claude/hooks.json
- 事件类型: pre-edit, post-edit, pre-run, post-run, conversation-start, conversation-end
- 支持JavaScript脚本
- 条件触发: 配置特定条件时触发

### 插件系统
- 管理: /plugin browse/add/enable/disable/uninstall
- 结构: .claude-plugin/plugin.json, commands/, agents/, skills/, hooks/
- MCP服务器: 动态发现, OAuth认证
- 团队插件: 仓库级配置

### MCP集成
- GitHub仓库: https://github.com/modelcontextprotocol/servers
- MCP文档: https://modelcontextprotocol.io/
- 可用集成: Google Drive, Figma, Slack, Jira等
- 权限控制: 不支持通配符, 精确控制
- 动态发现: 自动加载可用服务器和工具

### 快捷键和交互
- Esc+Esc: 打开回溯菜单
- 文件搜索: 输入@触发
- 图像输入: -i image.png 或 --image img1.png,img2.jpg

### 社区资源
- Discord社区: Claude官方Discord
- GitHub讨论: Claude Code相关仓库
- 插件市场: 社区和组织插件
- 示例项目: Claude官方示例仓库

### CLI命令参考(详细)
- --debug [filter]: 启用调试模式，支持过滤(如"api,hooks")
- --verbose: 覆盖详细模式设置
- --settings <file-or-json>: 从JSON文件或字符串加载设置
- --fallback-model <model>: 设置默认模型超载时的备用模型
- --system-prompt <prompt>: 指定会话系统提示
- --append-system-prompt <prompt>: 追加系统提示到默认提示
- --permission-mode <mode>: 权限模式(acceptEdits/bypassPermissions/default/plan)
- --allowed-tools <tools...>: 指定允许的工具列表
- --disallowed-tools <tools...>: 指定禁止的工具列表
- --mcp-config <configs...>: 从JSON文件/字符串加载MCP服务器
- --plugin-dir <paths...>: 加载插件目录(本次会话)
- --agents <json>: JSON格式定义自定义代理
- --session-id <uuid>: 使用指定UUID进行对话
- --add-dir <directories...>: 允许工具访问的额外目录
- --output-format <format>: 输出格式(text/json/stream-json)

## 最佳实践
1. 在项目根目录中使用Claude Code
2. 使用具体的自然语言描述
3. 利用检查点系统进行安全实验
4. 配置自定义命令提高效率
5. 使用MCP扩展外部数据源
6. 在CI/CD流程中集成自动化任务
7. 定期清理过期对话和检查点
8. 利用Git集成进行版本控制