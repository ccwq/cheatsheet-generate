---
title: OpenCode 速查
lang: bash
version: "latest"
date: 2026-03-06
github: anomalyco/opencode
colWidth: 330px
---

# OpenCode 速查表

## 🚀 快速安装
---
lang: bash
emoji: 🚀
link: https://opencode.ai/docs/zh-cn
---

### 推荐方式（安装脚本）
```bash
# 一键安装
curl -fsSL https://opencode.ai/install | bash

# 验证安装
opencode --version
```

### 包管理器安装
```bash
# npm / Bun / pnpm / Yarn
npm install -g opencode-ai

# Homebrew (macOS/Linux)
brew install anomalyco/tap/opencode

# Arch Linux
sudo pacman -S opencode
paru -S opencode-bin  # AUR 最新版

# Windows - Chocolatey
choco install opencode

# Windows - Scoop
scoop bucket add extras
scoop install extras/opencode

# Mise
mise use -g github:anomalyco/opencode

# Docker
docker run -it --rm ghcr.io/anomalyco/opencode
```

### 桌面应用下载
```bash
# macOS (Apple Silicon)
opencode-desktop-darwin-aarch64.dmg

# macOS (Intel)
opencode-desktop-darwin-x64.dmg

# Windows
opencode-desktop-windows-x64.exe

# Linux
.deb / .rpm / AppImage
```

## ⚙️ 初始化配置
---
lang: bash
emoji: ⚙️
link: https://opencode.ai/docs/zh-cn
---

### 项目初始化
```bash
# 进入项目目录
cd /path/to/project

# 启动 OpenCode
opencode

# 初始化项目（创建 AGENTS.md）
/init
```

### API 密钥配置
```bash
# 方式1: 命令行登录
opencode auth login

# 方式2: TUI 中运行
/connect

# 选择 opencode -> 前往 opencode.ai/auth
# 登录并添加账单信息
# 复制 API 密钥并粘贴
```

### 查看可用模型
```bash
# 在 TUI 中查看免费模型
/models

# 标注 Free 的为免费模型
# - GLM-4.7
# - MiniMax M2.1
```

## 📝 基础使用
---
lang: bash
emoji: 📝
link: https://opencode.ai/docs/zh-cn
---

### 启动与退出
```bash
# 启动 OpenCode（进入 TUI）
opencode

# 指定项目目录启动
opencode -c /path/to/project

# 调试模式启动
opencode -d

# 退出 TUI
/exit
/quit
/q
Ctrl+X Q
```

### 代码讲解
```bash
# 询问代码库问题
How is authentication handled in @packages/functions/src/api/index.ts

# 使用 @ 引用文件
@src/components/Button.tsx 是做什么的
```

### 添加功能
```bash
# 建议先制定计划，再实施
# 切换到计划模式（按 Tab）
# 描述需求后，再切回构建模式（按 Tab）

# 直接添加功能示例
添加用户注册 API，支持邮箱验证
```

### 直接修改
```bash
# 简单修改可直接实施
We need to add authentication to the /settings route.
Take a look at how this is handled in the /notes route
in @packages/functions/src/notes.ts and implement the
same logic in @packages/functions/src/settings.ts
```

## 🔄 撤销与重做
---
lang: bash
emoji: 🔄
link: https://opencode.ai/docs/zh-cn
---

### 撤销修改
```bash
# 撤销上一步操作
/undo

# 快捷键
Ctrl+X U
```

### 重做修改
```bash
# 重做被撤销的操作
/redo

# 快捷键
Ctrl+X R
```

### 工作流示例
```bash
# 1. 请求修改
Can you refactor the function in @packages/functions/src/api/index.ts?

# 2. 不满意结果 -> 撤销
/undo

# 3. 调整提示词重新尝试
Can you refactor the function in @packages/functions/src/api/index.ts with better error handling?
```

### 注意事项
- `/undo` 和 `/redo` 需要项目是 Git 仓库才能回滚文件变更
- 撤销会还原文件修改并重新显示之前的消息

## 📋 计划模式
---
lang: bash
emoji: 📋
link: https://opencode.ai/docs/zh-cn
---

### 模式说明
```bash
# Build 模式（默认）
# - 全权限，可直接编辑文件、执行命令

# Plan 模式（只读规划）
# - 默认拒绝编辑，需要确认
# - 用于安全规划和审查
```

### 切换模式
```bash
# 切换到计划模式（右下角显示模式指示器）
<TAB>

# 描述功能需求
When a user deletes a note, we'd like to flag it as deleted
in the database. Then create a screen that shows all the
recently deleted notes. From this screen, the user can
undelete a note or permanently delete it.
```

### 迭代计划
```bash
# 提供反馈或补充细节
We'd like to design this new screen using a design I've used before.
[Image #1] Take a look at this image and use it as a reference.

# 拖放图片到终端窗口即可扫描
```

### 构建功能
```bash
# 对计划满意后，切回构建模式
<TAB>

# 开始实施
Sounds good! Go ahead and make the changes.
```

## 🛠️ 内置工具
---
lang: bash
emoji: 🛠️
link: https://opencode.ai/docs
---

### 工具列表
```bash
# bash - 执行 shell 命令
git status
npm test

# write/edit/patch - 文件操作
# 创建/修改/打补丁文件

# read - 读取文件内容（支持行范围）

# grep/glob/list - 搜索和列出文件
# 尊重 .gitignore

# webfetch - 抓取网页内容（查文档）

# lsp（实验性）- 代码跳转、悬停提示等

# question - 向你提问确认

# todo - 维护任务清单
```

### 权限控制
```bash
# 在 opencode.json 中控制权限
# allow - 允许
# deny - 拒绝
# ask - 手动确认
```

## ⌨️ Slash 命令
---
lang: bash
emoji: ⌨️
link: https://opencode.ai/docs/tui
---

### 核心配置
```bash
/connect      # 添加或配置 LLM 提供商
/init         # 创建或更新 AGENTS.md（Ctrl+X I）
/models       # 列出可用模型并切换（Ctrl+X M）
```

### 会话管理
```bash
/new          # 开始新会话（/clear, Ctrl+X N）
/sessions     # 列出并切换会话（/resume, /continue, Ctrl+X L）
/share        # 分享当前会话（Ctrl+X S）
/unshare      # 取消分享当前会话
/compact      # 压缩/总结当前会话（/summarize, Ctrl+X C）
```

### 编辑与撤销
```bash
/undo         # 撤销最后操作（Ctrl+X U）
/redo         # 重做已撤销的操作（Ctrl+X R）
```

### 视图与辅助
```bash
/details      # 切换工具执行详情显示（Ctrl+X D）
/thinking     # 切换思考/推理过程可见性
/theme        # 列出并切换主题（Ctrl+X T）
/help         # 显示帮助对话框（Ctrl+X H）
/editor       # 使用外部编辑器撰写消息（Ctrl+X E）
/export       # 导出当前对话为 Markdown（Ctrl+X X）
```

### 退出
```bash
/exit         # 退出 OpenCode
/quit
/q
Ctrl+X Q
```

## 🖥️ CLI 参数
---
lang: bash
emoji: 🖥️
link: https://opencode.ai/docs
---

### 全局参数
```bash
# 显示帮助
opencode --help
opencode -h

# 调试模式
opencode --debug
opencode -d

# 指定工作目录
opencode --cwd /path/to/project
opencode -c /path/to/project

# 非交互模式（直接运行提示）
opencode --prompt "修复这个 bug"
opencode -p "解释代码"

# 输出格式（非交互模式）
opencode -p "解释代码" --output-format json
opencode -p "解释代码" -f json

# 安静模式（隐藏加载动画）
opencode -p "生成 README" --quiet
opencode -p "生成 README" -q
```

### 使用示例
```bash
# 启动交互式 TUI
opencode

# 带调试启动
opencode -d

# 指定项目目录启动
opencode -c ~/my-app

# 非交互单次提示（适合脚本/CI）
opencode -p "添加一个登录接口" -f json

# 快速查询
opencode -p "修复 login 函数中的 bug" -q
```

## 🔗 分享对话
---
lang: bash
emoji: 🔗
link: https://opencode.ai/docs/zh-cn
---

### 生成分享链接
```bash
# 分享当前对话
/share

# 快捷键
Ctrl+X S

# 取消分享
/unshare
```

### 功能说明
- 生成当前对话的链接
- 自动复制到剪贴板
- 可与团队成员分享

## 🎨 个性化配置
---
lang: bash
emoji: 🎨
link: https://opencode.ai/docs/zh-cn
---

### 可配置项
```bash
# 选择主题
/theme
Ctrl+X T

# 自定义快捷键
# 在设置中配置

# 配置代码格式化工具

# 创建自定义命令
```

### 自定义 Slash 命令
```bash
# 创建位置
~/.config/opencode/commands/
# 或项目目录下

# 文件格式: .md
# 示例: prime-context.md

# 自定义命令会覆盖内置命令
```

### 配置文件
```bash
# AGENTS.md - 项目级配置
# 位于项目根目录，帮助 OpenCode 理解项目结构和编码规范

# ~/.opencode.json - 用户级配置
# 高级配置如模型选择等
```

## 💡 使用技巧
---
lang: bash
emoji: 💡
link: https://opencode.ai/docs/zh-cn
---

### 文件引用
```bash
# 使用 @ 符号引用文件
@packages/functions/src/api/index.ts

# 支持相对路径
@./src/components/Button.tsx
```

### 图片输入
```bash
# 拖放图片到终端窗口
# OpenCode 会扫描图片并添加到提示词

# 示例
[Image #1] Take a look at this image and use it as a reference.
```

### 沟通建议
```bash
# 提供足够的细节
# 把 OpenCode 当作团队中的初级开发者
# 明确表达需求和预期结果

# 好的示例
创建一个 Express.js 服务，支持 /hello 路由
返回 JSON { message: 'Hello World' }，并添加 README
```

### 多会话管理
```bash
# 同时开启多个 Agent 处理不同任务
/sessions     # 列出所有会话
/resume       # 恢复之前的会话
```

## 🖥️ 终端要求
---
lang: bash
emoji: 🖥️
link: https://opencode.ai/docs/zh-cn
---

### 推荐终端
- **WezTerm** - 跨平台 GPU 加速终端
- **Alacritty** - 跨平台 OpenGL 终端
- **Ghostty** - Linux 和 macOS 终端
- **Kitty** - Linux 和 macOS GPU 终端

### 前提条件
- 现代终端模拟器
- LLM 提供商的 API 密钥（或使用免费模型）

## 🔌 MCP 与扩展
---
lang: bash
emoji: 🔌
link: https://opencode.ai/docs
---

### MCP 服务器
```bash
# Model Context Protocol 支持扩展
# 可连接数据库等外部工具

# 自定义工具和 MCP 服务器支持扩展
```

### IDE 集成
```bash
# VS Code 扩展
# 搜索 "OpenCode extension"

# 客户端/服务器架构远程控制
```

### oh-my-opencode 扩展
```bash
# 多智能体协作团队
# GitHub: https://github.com/code-yeongyu/oh-my-opencode

# 安装提示词
按照以下说明安装和配置 oh-my-opencode:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md

# 触发关键词
ultrawork 或 ulw

# 示例
ultrawork: 请帮我实现一个 React 组件，支持暗黑模式
```

## 🌐 支持模型
---
lang: bash
emoji: 🌐
link: https://opencode.ai/docs
---

### 免费模型
```bash
# 内置免费模型（无需 API Key）
GLM-4.7
MiniMax M2.1
```

### 商业模型
```bash
# 支持 75+ 家模型提供商
OpenAI GPT 系列
Anthropic Claude 系列
Google Gemini 系列

# 本地模型
Llama 3
```

### Zen 模型集合
```bash
# 由 OpenCode 官方推荐
# 经过测试的高质量模型
# 省去管理多个外部账户的麻烦
```

## 🚀 快速示例
---
lang: bash
emoji: 🚀
link: https://opencode.ai/docs
---

### 创建 Node.js API
```bash
# 1. 新建目录
mkdir my-api && cd my-api

# 2. 初始化
npm init -y

# 3. 启动 OpenCode
opencode

# 4. 输入 /init

# 5. 提问
创建一个 Express.js 服务，支持 /hello 路由
返回 JSON { message: 'Hello World' }，并添加 README
```

### 交互模式（脚本化）
```bash
# 非交互模式运行提示
opencode -p "修复 login 函数中的 bug"
```
