# Codex CLI 参考文档

## 官方文档链接
- [Codex CLI 主页](https://developers.openai.com/codex/cli) - 基本介绍和快速开始
- [功能特性](https://developers.openai.com/codex/cli/features) - 交互式终端、模型控制等深度功能
- [命令参考](https://developers.openai.com/codex/cli/reference) - 完整的命令和参数文档
- [配置指南](https://developers.openai.com/codex/local-config#cli) - 配置文件和选项详解

## Windows 和 Linux 平台差异

### Windows 平台特点
- **实验性支持**: Windows 支持仍处于实验阶段
- **推荐方式**: 建议在 WSL (Windows Subsystem for Linux) 环境中运行
- **默认模型**: Windows 上默认使用 gpt-5 (而非 macOS/Linux 的 gpt-5-codex)
- **沙盒**: 支持实验性的 Windows 受限令牌沙盒 (`enable_experimental_windows_sandbox`)

### Linux/macOS 平台特点
- **完整支持**: 官方完全支持的平台
- **默认模型**: 默认使用 gpt-5-codex，专为编程优化
- **沙盒**: 使用 Linux Landlock 沙盒，提供更好的隔离

### 安装方式 (通用)
```bash
npm install -g @openai/codex
```

## 核心功能速查

### 基本命令
- `codex` - 启动交互式终端 UI
- `codex exec "任务描述"` - 非交互式执行
- `codex login` - 身份验证
- `codex resume` - 恢复之前的会话

### 重要参数
- `--model gpt-5-codex` - 指定模型
- `--ask-for-approval on-request` - 设置审批策略
- `--sandbox workspace-write` - 设置沙盒模式
- `--cd <path>` - 设置工作目录

### 配置文件位置
`~/.codex/config.toml` - 配置文件路径 (跨平台一致)

## 验证信息
- 文档更新时间: 2024年当前版本
- 官方 GitHub: openai/codex
- 支持计划: ChatGPT Plus/Pro/Business/Edu/Enterprise