# Claude Code 参考文档

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

#### CLI选项(12+)
- --help / -h: 显示帮助信息
- --version / -v: 显示版本信息
- --debug: 启用调试模式
- --config / -c: 指定配置文件
- --model / -m: 指定AI模型
- --profile / -P: 使用配置档案
- --new / -n: 创建新对话
- --list / -l: 列出会话
- --delete / -d: 删除对话

#### 斜杠命令(内置27+)
- /help: 显示可用命令
- /clear: 清除对话历史
- /exit: 退出Claude Code
- /config: 打开设置界面
- /context: 可视化上下文使用情况
- /cost: 显示token使用统计
- /doctor: 检查安装健康状态
- /init: 初始化项目
- /login: 切换账户
- /logout: 登出账户
- /memory: 编辑记忆文件
- /model: 选择或更改模型
- /mcp: 管理MCP连接
- /output-style: 设置输出风格
- /permissions: 查看或更新权限
- /pr_comments: 查看PR评论
- /privacy-settings: 隐私设置
- /review: 代码审查
- /sandbox: 启用沙盒bash工具
- /rewind: 回溯对话和代码
- /status: 查看状态信息
- /statusline: 设置状态行UI
- /terminal-setup: 设置终端快捷键
- /todos: 查看待办事项
- /usage: 查看使用限制
- /vim: 进入vim模式

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
- --version: -v 显示详细版本信息
- --debug-detailed: 启用详细调试模式
- --log-level: 设置日志级别(trace/debug/info/warn/error)
- --profile-list: 列出所有可用配置档案
- --mcp-list: 列出所有配置的MCP服务器
- --plugin-list: 列出所有已安装插件

## 最佳实践
1. 在项目根目录中使用Claude Code
2. 使用具体的自然语言描述
3. 利用检查点系统进行安全实验
4. 配置自定义命令提高效率
5. 使用MCP扩展外部数据源
6. 在CI/CD流程中集成自动化任务
7. 定期清理过期对话和检查点
8. 利用Git集成进行版本控制