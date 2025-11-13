# OpenSpec/Codex Agent 提示词

## 基础命令
- codex: 启动交互式TUI
- codex "任务": 带初始提示启动
- codex exec "任务": 非交互式自动化模式

## 会话管理
- codex resume: 打开会话选择器
- codex resume --last: 恢复最近会话
- codex resume [session-id]: 恢复指定会话

## 命令行选项
- --model/-m MODEL: 指定模型
- --ask-for-approval/-a POLICY: 设置审批策略
- --sandbox MODE: 沙盒模式
- --full-auto: 全自动模式
- --cd/-c DIR: 指定工作目录

## 沙盒模式
- read-only: 只读访问
- workspace-write: 工作区可写
- danger-full-access: 完全访问

## 审批策略
- untrusted: 不可信命令需审批
- on-failure: 失败时需审批
- on-request: 按需审批
- never: 从不审批

## 配置文件
- ~/.codex/config.toml: 主配置文件
- ~/.codex/AGENTS.md: 全局指令
- ./AGENTS.md: 项目级指令

## 模型配置
- model: o3 (默认) / gpt-5-codex
- model_provider: openai (默认)
- model_reasoning_effort: minimal/low/medium/high
- model_reasoning_summary: auto/concise/detailed/none
- model_verbosity: low/medium/high

## MCP集成
- codex mcp add NAME -- COMMAND: 添加服务器
- codex mcp list: 列出服务器
- codex mcp remove NAME: 删除服务器
- codex mcp: 启动MCP服务器模式

## 实用功能
- codex completion bash/zsh/fish: 生成shell补全
- @文件名: 模糊文件搜索
- -i image.png: 单图像输入
- --image img1.png,img2.jpg: 多图像输入

## 调试工具
- codex debug seatbelt [COMMAND]: macOS沙盒测试
- codex debug landlock [COMMAND]: Linux沙盒测试
- tail -F ~/.codex/log/codex-tui.log: 监控日志
- RUST_LOG=debug codex: 调试日志级别

## 环境策略
- inherit: all/core/none
- exclude: 排除的环境变量模式
- include_only: 仅允许的环境变量
- set: 设置的环境变量

## 常用组合示例
- codex --full-auto "更新版本日志": CI/CD自动化
- codex --sandbox read-only --ask-for-approval on-request: 安全浏览
- codex --profile full_auto: 使用配置档案