# Claude Code AI开发助手

## 安装配置
```bash
brew install --cask claude-code
curl -fsSL https://claude.ai/install.sh | bash
irm https://claude.ai/install.ps1 | iex
claude --version
claude --help
```

## 基础CLI命令
```bash
claude                    # 启动交互模式
claude "任务描述"         # 执行一次性任务
claude -p "查询"          # 单次查询模式
claude exec "自动化"      # 纯自动化模式
claude -c                # 继续最近对话
claude -r                # 恢复之前对话
claude --new             # 创建新对话
claude --list            # 列出所有会话
claude --delete ID       # 删除指定会话
claude commit            # 智能Git提交
```

## CLI高级选项
```bash
--help / -h              # 显示帮助
--version / -v           # 版本信息
--debug                  # 调试模式
--debug-detailed         # 详细调试
--config / -c 文件       # 指定配置文件
--model / -m 模型名      # 选择AI模型
--profile / -P 配置档案  # 使用配置档案
--log-level 级别         # 设置日志级别
--profile-list           # 列出配置档案
--mcp-list               # 列出MCP服务器
--plugin-list            # 列出已安装插件
--image 图片路径          # 输入图片
-i img1.png,img2.jpg     # 批量图片输入
```

## 内置斜杠命令
### 基本操作
```bash
/help                    # 显示所有命令
/clear                   # 清除对话历史
/exit                    # 退出Claude Code
/config                  # 打开设置界面
/status                  # 查看状态信息
/init                    # 初始化项目配置
/doctor                  # 检查安装健康状态
```

### 账户与模型
```bash
/login                   # 切换/登录账户
/logout                  # 登出当前账户
/model                   # 选择或更改AI模型
/usage                   # 查看使用限制
/cost                    # 显示token使用成本
/permissions             # 查看/更新权限设置
```

### 开发工具
```bash
/memory                  # 编辑记忆文件
/todos                   # 查看待办事项
/context                 # 可视化上下文使用
/review                  # 代码审查工具
/pr_comments             # 查看PR评论
/mcp                     # 管理MCP连接
/rewind                  # 回溯对话和编辑
/output-style            # 设置输出风格
/sandbox                 # 启用沙盒bash工具
/terminal-setup          # 设置终端快捷键
/statusline              # 配置状态行UI
/privacy-settings        # 隐私设置管理
/vim                     # 进入vim编辑模式
```

## 自定义斜杠命令
### 命令定义位置
```
.claude/commands/         # 项目级命令
~/.claude/commands/       # 用户级命令
```

### 参数处理
```bash
$ARGUMENTS               # 所有参数
$1, $2, $3              # 位置参数
$0                      # 命令名称
```

### 特殊语法
```bash
@filename               # 引用文件内容
@*.ext                  # 通配符文件引用
!command                # 执行bash命令
```

### 示例命令(.claude/commands/deploy.md)
```markdown
部署应用到生产环境:
!npm run build &&
!git add . &&
!git commit -m "$ARGUMENTS" &&
!git push origin main
```

## 交互模式
### 基本操作
- 自然语言输入: 直接输入任务描述
- @文件名: 引用文件内容
- /命令: 执行斜杠命令
- Ctrl+C: 中断操作
- Ctrl+D: 退出交互模式

### 快捷功能
- Esc+Esc: 打开回溯菜单
- Tab: 智能补全建议
- ↑/↓: 历史命令导航

## 检查点系统
### 自动管理
- 编辑前自动保存检查点
- 跨会话持久化存储
- 30天自动清理过期检查点
- 智能空间管理

### 手动控制
```bash
/checkpoint             # 手动创建检查点
/checkpoint-list        # 查看所有检查点
/checkpoint-delete ID   # 删除指定检查点
/rewind                 # 命令行恢复
```

### 恢复选项
- 仅恢复对话
- 仅恢复代码
- 同时恢复完整状态

## Hooks事件系统
### 配置文件
```bash
.claude/hooks.json      # 项目hooks配置
~/.claude/hooks.json    # 全局hooks配置
```

### 事件类型
- pre-edit: 文件编辑前触发
- post-edit: 文件编辑后触发
- pre-run: 命令执行前触发
- post-run: 命令执行后触发
- conversation-start: 会话开始时触发
- conversation-end: 会话结束时触发

### 示例配置(.claude/hooks.json)
```json
{
  "pre-edit": {
    "condition": "file.endsWith('.js')",
    "script": "console.log('即将编辑JS文件')"
  }
}
```

## 插件系统
### 插件管理
```bash
/plugin browse          # 浏览可用插件
/plugin add 名称        # 安装插件
/plugin enable 名称     # 启用插件
/plugin disable 名称    # 禁用插件
/plugin uninstall 名称  # 卸载插件
```

### 插件目录结构
```
.claude-plugin/
├── plugin.json          # 插件配置
├── commands/           # 自定义命令
├── agents/             # 智能代理
├── skills/             # 技能脚本
└── hooks/              # 事件钩子
```

## MCP集成
### 管理命令
```bash
/mcp list               # 列出MCP服务器
/mcp add 名称          # 添加MCP服务器
/mcp remove 名称       # 移除MCP服务器
--mcp-list              # CLI查看MCP列表
```

### 热门集成服务
- Google Drive: 云文档访问
- Figma: 设计稿读取
- Slack: 团队通讯集成
- Jira: 项目管理
- GitHub: 代码仓库管理
- Notion: 知识库集成
- Linear: 现代项目管理
- PostgreSQL: 数据库访问

## 实际应用场景
### 功能开发
```bash
添加用户认证系统到Express应用
重构React组件使用TypeScript
为Python计算器函数编写单元测试
实现GraphQL API的CRUD操作
```

### 代码分析与重构
```bash
分析这个项目的架构和技术栈
优化这个复杂的SQL查询
重构递归函数为迭代版本
解释算法的时间和空间复杂度
```

### 调试与修复
```bash
修复用户可以提交空表单的bug
解决TypeScript构建错误
为什么API端点返回500错误
修复CSS在Safari中的显示问题
```

### DevOps与自动化
```bash
为Node.js项目设置Docker容器化
创建GitHub Actions CI/CD流水线
更新所有npm依赖到最新版本
配置生产环境Nginx反向代理
```

## 高级工作流
### Unix哲学组合
```bash
tail -f app.log | claude -p "发现异常立即Slack通知"
git diff | claude -p "翻译新文本为法语并创建PR"
find . -name "*.js" -exec claude -p "优化这个文件" {} \;
```

### CI/CD集成
```bash
# GitHub Actions示例
- name: Claude Code Review
  run: git diff HEAD~1 | claude -p "审查代码变更并生成报告"

# 自动化测试
claude -p "运行测试套件，失败则创建issue"
```

## 最佳实践
### 项目使用
- 在项目根目录启动确保上下文完整
- 使用具体明确的描述提高准确性
- 分层实现复杂功能
- 定期审查生成代码

### 性能优化
- 使用检查点系统安全实验
- 合理配置上下文窗口
- 批量操作替代重复任务
- 利用缓存机制

### 团队协作
- 统一编码规范配置
- 共享自定义命令
- 版本控制Claude Code设置
- 定期知识共享

### 安全注意事项
- 避免提交敏感信息
- MCP插件精确授权
- 定期更新工具和插件
- 重要变更人工复核

## 输出风格配置
### 基础风格模式
```bash
/output-style concise      # 简洁输出模式
/output-style detailed     # 详细输出模式
/output-style code-focused # 代码优先模式
/output-style explanation # 解释详细模式
/output-style summary     # 总结摘要模式
```

### 代码风格设置
```bash
/output-style --javascript google  # JavaScript Google风格
/output-style --python pep8         # Python PEP8风格
/output-style --typescript standard   # TypeScript标准风格
/output-style --json pretty         # JSON美化输出
/output-style --yaml 2spaces        # YAML 2空格缩进
```

### 格式化选项
```bash
--line-width 80         # 设置行宽度限制
--indent-size 4        # 设置缩进大小
--no-comments          # 禁用注释生成
--include-types         # 包含类型注解
--inline-docs          # 行内文档模式
```

### 自定义样式配置
```markdown
# 创建自定义输出样式
/output-style --create my-style
# 配置选项
{
  "mode": "detailed",
  "codeStyle": "google",
  "includeComments": true,
  "lineWidth": 100,
  "language": "javascript"
}
```

## Skills技能系统
### Skill概念
- 专用工具集: 针对特定任务的专业能力
- 可组合执行: 多个技能可组合使用
- 参数化调用: 支持动态参数传递
- 状态保持: 技能间可共享状态

### 内置核心技能
```bash
skill: "pdf"                 # PDF文档处理和分析
skill: "xlsx"                # Excel表格数据处理
skill: "ms-office-suite:pdf"  # Office文档处理
skill: "web-scraping"         # 网页数据抓取
skill: "data-analysis"         # 数据分析和可视化
```

### Skill使用语法
```bash
skill: "skill-name"                    # 调用指定技能
skill: "skill-name" param="value"       # 带参数调用
skill: "skill-name" --option value     # 选项式调用
```

### 自定义Skill结构
```json
# .claude/skills/my-skill/skill.json
{
  "name": "my-custom-skill",
  "description": "自定义技能描述",
  "version": "1.0.0",
  "entry": "main.js",
  "parameters": {
    "input": "required|string",
    "format": "optional|string"
  }
}
```

### Skill开发
```bash
.claude/skills/         # 自定义技能目录
skill.json             # 技能配置文件
main.js               # 技能主逻辑文件
/skill create 名称      # 创建新技能模板
/skill list            # 列出可用技能
```

## 状态行配置
### 基础状态行命令
```bash
/statusline            # 打开状态行配置
/statusline enable     # 启用状态行显示
/statusline disable    # 禁用状态行显示
/statusline reset      # 重置为默认配置
```

### 显示信息配置
```bash
/statusline --show model       # 显示当前模型
/statusline --show tokens      # 显示token使用量
/statusline --show time        # 显示响应时间
/statusline --show memory      # 显示内存使用
/statusline --show git-branch # 显示Git分支
```

### 位置和布局
```bash
/statusline --position top     # 顶部显示
/statusline --position bottom  # 底部显示
/statusline --align left      # 左对齐
/statusline --align right     # 右对齐
/statusline --align center    # 居中对齐
```

### 主题和样式
```bash
/statusline --theme dark      # 深色主题
/statusline --theme light     # 浅色主题
/statusline --theme auto      # 自动主题
/statusline --style minimal   # 极简风格
/statusline --style detailed  # 详细风格
```

### 配置示例
```json
# .claude/statusline.json
{
  "enabled": true,
  "position": "top",
  "show": ["model", "tokens", "time", "git-branch"],
  "theme": "auto",
  "style": "detailed",
  "refresh_rate": 1000
}
```

## 终端设置
### 终端配置基础
```bash
/terminal-setup              # 打开终端配置
/terminal-setup --list       # 列出当前配置
/terminal-setup --reset      # 重置为默认
/terminal-setup --import file.json  # 导入配置
```

### 快捷键配置
```bash
/terminal-setup --bind "Ctrl+P" /previous  # 绑定快捷键
/terminal-setup --unbind "Ctrl+P"          # 解除绑定
/terminal-setup --preset vim               # Vim预设
/terminal-setup --preset emacs             # Emacs预设
```

### 默认快捷键
- Ctrl+C: 中断当前操作
- Ctrl+D: 退出程序
- Ctrl+L: 清屏
- Tab: 自动补全
- ↑/↓: 历史命令导航
- Ctrl+R: 搜索历史
- Esc+Esc: 打开回溯菜单

### 命令别名设置
```bash
/terminal-setup --alias "st" /status      # 创建别名
/terminal-setup --unalias "st"            # 删除别名
/terminal-setup --list-aliases             # 列出所有别名
```

### 主题和外观
```bash
/terminal-setup --theme monokai      # 设置主题
/terminal-setup --font-size 14       # 字体大小
/terminal-setup --cursor block       # 光标样式
/terminal-setup --transparency 0.8   # 透明度
```

### 配置文件示例
```json
# .claude/terminal.json
{
  "theme": "monokai",
  "fontSize": 14,
  "transparency": 0.8,
  "keybindings": {
    "Ctrl+P": "/previous",
    "Ctrl+N": "/next"
  },
  "aliases": {
    "st": "/status",
    "h": "/help"
  }
}
```

## 记忆系统
### 基础记忆命令
```bash
/memory                # 打开记忆编辑器
/memory edit           # 编辑记忆文件
/memory show           # 显示当前记忆
/memory clear          # 清除记忆内容
/memory reload         # 重新加载记忆
```

### 记忆文件结构
```bash
.claude/memory.md      # 项目级记忆文件
~/.claude/memory.md    # 全局记忆文件
# 项目上下文            # 项目信息头部
## 规则               # 通用规则定义
### 专用规则          # 特定内容格式
```

### 记忆语法格式
- # 标题: 记忆分类标题
- 规则描述: 具体规则条目
- ```代码示例```: 代码格式规范
- [link](url): 参考链接
- <!-- comment -->: 注释说明

### 自动记忆识别
```bash
@memory               # 显式调用记忆
自动匹配              # 根据上下文自动引用
#标签                 # 通过标签分类记忆
=优先级               # 设置记忆优先级
```

### 记忆类型
- 永久记忆: 跨会话保持
- 临时记忆: 当前会话有效
- 项目记忆: 特定项目使用
- 用户记忆: 全局个人设置

### 记忆示例
```markdown
# 项目记忆
## 代码规范
- 使用TypeScript严格模式
- 所有函数必须有类型注解
- 变量命名使用camelCase格式

## 项目结构
- src/: 源代码目录
- tests/: 测试文件
- docs/: 项目文档

## 专用规则
### API开发
- 所有API端点必须有错误处理
- 使用统一的响应格式
```javascript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```
```

## AI Agent系统
### Agent概念
- 专业化代理: 针对特定领域的AI代理
- 自主执行: 独立完成复杂任务
- 工具集成: 调用专门的工具和技能
- 状态管理: 维护任务执行状态

### 内置Agent类型
```bash
general-purpose        # 通用问题解决
code-reviewer        # 代码审查专家
test-runner          # 测试执行专家
debug-expert        # 调试问题专家
documentation-writer # 文档编写专家
performance-optimizer # 性能优化专家
```

### Agent调用语法
```bash
/agent use code-reviewer                 # 使用代码审查代理
/agent run test-runner "测试场景"        # 运行测试代理
/agent list                              # 列出可用代理
/agent info 代理名                       # 查看代理信息
```

### 自定义Agent开发
```bash
.claude/agents/         # 自定义代理目录
agent.json             # 代理配置文件
main.js               # 代理主逻辑
tools/                # 代理专用工具
/agent create 名称     # 创建代理模板
```

### Agent配置示例
```json
# .claude/agents/my-agent/agent.json
{
  "name": "my-custom-agent",
  "description": "自定义AI代理",
  "version": "1.0.0",
  "type": "general-purpose",
  "tools": ["file-reader", "web-fetch"],
  "skills": ["data-analysis", "report-generation"],
  "prompt_template": "你是一个专业的{role}...",
  "parameters": {
    "role": "string",
    "task": "string"
  }
}
```

### Agent工作流
- 任务分析: 理解和分解复杂任务
- 工具选择: 自动选择合适的工具
- 执行监控: 实时监控执行进度
- 结果整合: 整合多个工具的输出
- 质量检查: 自动验证结果质量

## 权限管理
### 基础权限命令
```bash
/permissions                   # 打开权限配置
/permissions show             # 显示当前权限
/permissions reset            # 重置权限设置
/permissions import file.json  # 导入权限配置
```

### 文件访问权限
```bash
/permissions allow-read /path/to/dir     # 允许读取目录
/permissions allow-write /path/to/file   # 允许写入文件
/permissions deny /sensitive/path       # 禁止访问路径
/permissions file-extensions .js,.ts,.py # 允许文件类型
```

### 命令执行权限
```bash
/permissions allow-run "npm,git"         # 允许执行命令
/permissions deny-run "rm,sudo"          # 禁止危险命令
/permissions shell-allowed                # 允许Shell访问
/permissions sandbox-only                # 仅沙盒模式
```

### 网络权限
```bash
/permissions allow-domain "github.com"     # 允许域名
/permissions deny-domain "malicious.site" # 禁止域名
/permissions allow-port 80,443            # 允许端口
/permissions network-offline               # 离线模式
```

### MCP权限控制
```bash
/permissions mcp-allow "google-drive"       # 允许MCP服务
/permissions mcp-deny "external-api"        # 禁止MCP服务
/permissions mcp-logs                     # 显示MCP访问日志
```

### 权限配置示例
```json
# .claude/permissions.json
{
  "file_access": {
    "allowed_paths": ["/workspace/src", "/workspace/docs"],
    "denied_paths": ["/workspace/secrets", "/etc"],
    "allowed_extensions": [".js", ".ts", ".py", ".md"]
  },
  "command_execution": {
    "allowed_commands": ["git", "npm", "node"],
    "denied_commands": ["rm", "sudo", "chmod"],
    "shell_access": false
  },
  "network": {
    "allowed_domains": ["github.com", "api.github.com"],
    "denied_domains": ["malicious.site"],
    "allowed_ports": [80, 443]
  },
  "mcp": {
    "allowed_services": ["google-drive"],
    "denied_services": ["external-api"]
  }
}
```

## 隐私设置
### 基础隐私命令
```bash
/privacy-settings          # 打开隐私配置
/privacy-settings show     # 显示当前设置
/privacy-settings reset    # 重置为默认
/privacy-settings export   # 导出隐私设置
```

### 数据保留策略
```bash
/privacy-settings retention 7days    # 保留7天
/privacy-settings retention 30days   # 保留30天
/privacy-settings retention session  # 仅当前会话
/privacy-settings retention permanent # 永久保留
```

### 匿名化选项
```bash
/privacy-settings anonymize-on      # 启用匿名化
/privacy-settings anonymize-off     # 禁用匿名化
/privacy-settings strip-paths       # 移除路径信息
/privacy-settings strip-usernames   # 移除用户名
```

### 对话数据控制
```bash
/privacy-settings no-history        # 不保存对话历史
/privacy-settings local-only        # 仅本地存储
/privacy-settings encrypted       # 加密存储
/privacy-settings auto-cleanup     # 自动清理
```

### 敏感信息保护
```bash
/privacy-settings mask-secrets     # 遮蔽密钥
/privacy-settings detect-pii      # 检测隐私信息
/privacy-settings filter-emails    # 过滤邮箱
/privacy-settings filter-phones    # 过滤电话
```

### 企业隐私合规
```bash
/privacy-settings gdpr-compliant  # GDPR合规
/privacy-settings hipaa-compliant # HIPAA合规
/privacy-settings audit-log       # 启用审计日志
/privacy-settings data-export     # 数据导出权限
```

### 隐私配置示例
```json
# .claude/privacy.json
{
  "data_retention": {
    "conversations": "30days",
    "files": "7days",
    "checkpoints": "permanent"
  },
  "anonymization": {
    "enabled": true,
    "strip_paths": true,
    "strip_usernames": true,
    "mask_secrets": true
  },
  "storage": {
    "local_only": true,
    "encryption": true,
    "auto_cleanup": true
  },
  "sensitive_data": {
    "detect_pii": true,
    "filter_emails": true,
    "filter_phones": true,
    "mask_api_keys": true
  },
  "compliance": {
    "gdpr": true,
    "audit_logging": true
  }
}
```

## 故障排除
### 诊断工具
```bash
/doctor                 # 全面健康检查
--debug                 # 启用调试输出
--log-level debug       # 设置调试日志
claude --version        # 检查版本兼容性
```

### 常见问题
- 连接超时: 检查网络和代理设置
- 认证失败: 使用/login重新认证
- 权限错误: 检查文件和目录权限
- 模型不可用: 使用/model切换模型

### 配置重置
```bash
/config reset           # 重置为默认配置
rm -rf .claude/         # 清理项目配置
rm -rf ~/.claude/       # 重置全局配置
```