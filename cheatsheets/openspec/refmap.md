# OpenSpec/Codex 参考文档

## 官方资源
- OpenAI Codex官方文档: https://platform.openai.com/docs/codex
- NPM包页面: https://www.npmjs.com/package/@openai/codex
- GitHub仓库: https://github.com/openai/codex-cli

## 安装和配置
### 安装方法
- NPM全局安装: `npm install -g @openai/codex`
- Homebrew安装: `brew install codex`
- 安装验证: `codex --version`

### 配置文件位置
- 主配置: `~/.codex/config.toml`
- 全局AI指令: `~/.codex/AGENTS.md`
- 项目级指令: `./AGENTS.md`

## 核心功能参考
### 命令行界面
- 交互式TUI: `codex`
- 带提示启动: `codex "任务描述"`
- 非交互模式: `codex exec "任务"`

### 会话管理
- 会话选择器: `codex resume`
- 恢复最近: `codex resume --last`
- 指定会话: `codex resume <session-id>`

## 高级特性
### MCP (Model Context Protocol)
- 服务器管理: `codex mcp add/list/remove`
- 客户端配置: config.toml中的[mcp_servers]节
- MCP检查器: `npx @modelcontextprotocol/inspector codex mcp`

### 沙盒安全
- 只读模式: `--sandbox read-only`
- 工作区可写: `--sandbox workspace-write`
- 完全访问: `--sandbox danger-full-access`

### 审批策略
- 不可信命令: `--ask-for-approval untrusted`
- 失败时审批: `--ask-for-approval on-failure`
- 按需审批: `--ask-for-approval on-request`
- 从不审批: `--ask-for-approval never`

## 模型配置
### 支持的模型
- 默认模型: o3 (gpt-5-codex)
- 模型提供商: openai, ollama等
- 推理努力: minimal/low/medium/high
- 输出详细: low/medium/high

### 配置示例
```toml
[model_providers.openai-chat-completions]
name = "OpenAI using Chat Completions"
base_url = "https://api.openai.com/v1"
env_key = "OPENAI_API_KEY"
```

## 开发工具集成
### Shell补全
- Bash: `codex completion bash`
- Zsh: `codex completion zsh`
- Fish: `codex completion fish`

### 文件操作
- 模糊搜索: 输入@触发
- 图像输入: `-i image.png`
- 多图像: `--image img1.png,img2.jpg`

## 调试和监控
### 日志系统
- 日志位置: `~/.codex/log/codex-tui.log`
- 实时监控: `tail -F ~/.codex/log/codex-tui.log`
- 调试级别: `RUST_LOG=codex_core=debug,codex_tui=info codex`

### 平台支持
- macOS: Apple Seatbelt沙盒
- Linux: Landlock/seccomp API
- Docker: 可能需要特殊配置

## 环境策略
### 变量控制
- 继承策略: all/core/none
- 排除规则: 默认排除KEY/SECRET/TOKEN
- 包含限制: `include_only = ["PATH", "HOME"]`

### 网络配置
- 请求重试: `request_max_retries = 4`
- 流重连: `stream_max_retries = 10`
- 超时设置: `stream_idle_timeout_ms = 300000`

## 社区和生态
### MCP服务器生态
- 文件系统: @modelcontextprotocol/server-filesystem
- GitHub集成: @modelcontextprotocol/server-github
- 更多服务器: MCP官方仓库

### 工具对比
- 与Claude Code: 不同的安装和配置方式
- 与Cursor: 类似的AI集成但不同的CLI命令
- 与CodeBuddy: 共享某些MCP协议特性