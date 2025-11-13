# Codex CLI 指令集

## 基础命令
`codex` - 启动交互式终端UI
`codex exec "任务"` - 非交互执行
`codex login` - 身份验证
`codex resume` - 恢复会话

## 核心参数
`--model gpt-5-codex` - 指定模型
`--ask-for-approval on-request` - 审批策略
`--sandbox workspace-write` - 沙盒模式
`--cd /path` - 工作目录
`-i img.png` - 附加图片

## 模型选择
`gpt-5-codex` - 编程优化(Linux/macOS默认)
`gpt-5-codex-mini` - 成本优化(4x用量)
`gpt-5` - 通用模型(Windows默认)
`--oss` - 本地开源模型

## 审批模式
`untrusted` - 全部审批
`on-failure` - 失败时审批
`on-request` - 按需审批
`never` - 无审批

## 沙盒级别
`read-only` - 只读
`workspace-write` - 工作区写入
`danger-full-access` - 完全访问

## 会话管理
`resume --last` - 最近会话
`resume SESSION_ID` - 指定会话
`/model` - 切换模型
`/approvals` - 切换审批
`/review` - 代码审查
`/plan` - 制定计划

## 自动化
`exec --json` - JSON输出
`exec -` - 标准输入
`exec resume --last "指令"` - 恢复执行
`--full-auto` - 自动化预设

## 配置
`~/.codex/config.toml` - 配置文件
`--profile name` - 配置组
`--config key=value` - 临时覆盖
`[features]` - 功能特性开关

## Shell集成
`completion bash|zsh|fish|powershell` - 补全脚本
`eval "$(codex completion zsh)"` - Zsh设置

## 云服务
`cloud exec --env ENV_ID "任务"` - 云端任务
`apply TASK_ID` - 应用变更
`--attempts N` - 多次尝试

## MCP
`mcp list|add|remove` - 管理服务器
`mcp-server` - 作为MCP服务
`mcp login name` - OAuth认证

## 平台差异
Windows: 实验性支持，推荐WSL，默认gpt-5
Linux/macOS: 完全支持，默认gpt-5-codex

## 调试
`--version` - 版本检查
`login status` - 登录状态
`~/.codex/sessions/` - 会话日志