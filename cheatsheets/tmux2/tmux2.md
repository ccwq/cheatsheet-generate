---
title: tmux2 速查表
lang: bash
version: "3.6a"
date: 2026-03-05
github: tmux/tmux
---

## 🧭 架构与层级
---
lang: bash
emoji: 🧭
link: https://github.com/tmux/tmux/wiki/Getting-Started#basic-concepts
desc: 理解 tmux 的"套娃"架构是掌握它的核心
---

- `Server`：后台主进程，管理所有会话，断开终端后仍运行
- `Session`：会话，对应一个"项目/工作流"，包含多个窗口
- `Window`：窗口，类似浏览器 Tab，包含多个面板
- `Pane`：面板，最小操作单元，运行终端程序
- `Client`：客户端，连接到 Server 的终端窗口

```bash
# 层级关系图示
Server (后台进程)
└── Session (工作区)
    └── Window (页面)
        └── Pane (终端)
```

## 🚀 会话管理
---
lang: bash
emoji: 🚀
link: https://github.com/tmux/tmux/wiki/Getting-Started#creating-sessions
desc: 创建、连接、分离和切换会话
---

### 创建与命名
- `tmux new`：创建并进入新会话
- `tmux new -s <name>`：创建命名会话
- `tmux new -A -s <name>`：会话存在则附加，不存在则创建
- `tmux new -s <ses> -n <win>`：创建会话并指定首个窗口名称
- `tmux new -s work -n monitor top`：创建会话并运行 top

### 连接与分离
- `tmux attach`：连接到最近会话
- `tmux attach -t <name>`：连接到指定会话
- `tmux attach -d -t <name>`：连接并分离其他客户端
- `C-b d`：分离当前会话

### 列表与切换
- `tmux ls`：列出所有会话
- `C-b s`：交互式会话列表
- `C-b :`：重命名当前会话
- `C-b (`：切换到上一个会话
- `C-b )`：切换到下一个会话

### 交互式列表状态
- `C-b s`：进入
- `x [y]`: 关闭
- `t [y]`: 选择关闭
- `:new -s <name>`：新建会话（交互模式）

### 管理与删除
- `C-b :new [Enter]`：新建会话（交互模式）
- `C-b :new -s foo [Enter]`：新建会话（交互模式）
- `C-b $`：重命名会话
- `tmux rename-session -t <old> <new>`：重命名会话
- `tmux kill-session -t <name>`：关闭指定会话
- `tmux kill-session -a`：关闭除当前外的所有会话
- `tmux kill-server`：停止整个 tmux 服务器

## 🪟 窗口操作
---
lang: bash
emoji: 🪟
link: https://github.com/tmux/tmux/wiki/Getting-Started#creating-new-windows
desc: 创建、切换和管理窗口
---

### 创建与关闭
- `C-b c`：新建窗口
- `C-b &`：关闭当前窗口（需确认）
- `tmux new-window -n <name>`：创建并命名窗口

### 切换窗口
- `C-b n`：下一个窗口
- `C-b p`：上一个窗口
- `C-b l`：最后活跃的窗口
- `C-b <number>`：切换到编号窗口（0-9）
- `C-b '`：输入窗口编号切换
- `C-b f`：查找窗口（按名称）

### 窗口管理
- `C-b w`：列举所有会话和window
- `C-b ,`：重命名当前窗口
- `tmux swap-window -s <src> -t <dst>`：交换窗口位置
- `tmux move-window -s <src> -t <dst>`：移动窗口
- `tmux move-window -r`：重新编号窗口（移除空隙）
- `C-b .`：修改窗口索引号

## 📐 面板操作
---
lang: bash
emoji: 📐
link: https://github.com/tmux/tmux/wiki/Getting-Started#splitting-the-window
desc: 分割、切换和调整面板
---

### 分割面板
- `C-b %`：左右分割（水平分割）
- `C-b "`：上下分割（垂直分割）
- `tmux split-window -h`：水平分割（左右）
- `tmux split-window -v`：垂直分割（上下）
- `tmux split-window -h top`：分割并运行命令

### 切换面板
- `C-b ←/→/↑/↓`：方向键切换面板
- `C-b o`：切换到下一个面板
- `C-b ;`：切换到上一个面板
- `C-b q`：显示面板编号，输入数字快速切换
- `C-b {`：与上一个面板交换位置
- `C-b }`：与下一个面板交换位置

### 调整大小
- `C-b C-←/→/↑/↓`：微调面板大小（每次 1 单元格）
- `C-b M-←/→/↑/↓`：粗调面板大小（每次 5 单元格）
- `tmux resize-pane -D 20`：向下调整 20 单元格
- `tmux resize-pane -U 10`：向上调整 10 单元格
- `tmux resize-pane -L 5`：向左调整 5 单元格
- `tmux resize-pane -R 5`：向右调整 5 单元格

### 面板管理
- `C-b x`：关闭当前面板（需确认）
- `C-b !`：将面板拆分为新窗口
- `C-b z`：放大/还原面板（zoom）
- `tmux join-pane -s <src> -t <dst>`：合并面板
- `tmux break-pane`：将面板拆分为独立窗口

## 🎨 布局管理
---
lang: bash
emoji: 🎨
link: https://github.com/tmux/tmux/wiki/Getting-Started#window-layouts
desc: 预设布局与自定义布局
---

### 预设布局
- `C-b Space`：循环切换预设布局
- `C-b M-1`：even-horizontal（水平均分）
- `C-b M-2`：even-vertical（垂直均分）
- `C-b M-3`：main-horizontal（主面板在上）
- `C-b M-4`：main-vertical（主面板在左）
- `C-b M-5`：tiled（网格平铺）

### 自定义布局
- `tmux select-layout even-horizontal`：选择水平均分布局
- `tmux select-layout even-vertical`：选择垂直均分布局
- `tmux select-layout tiled`：选择网格布局
- `C-b t`：显示时钟

## 📋 复制与粘贴（Vi 模式）
---
lang: bash
emoji: 📋
link: https://github.com/tmux/tmux/wiki/Getting-Started#copy-and-paste
desc: 文本选择、复制和粘贴操作
---

### 进入与退出
- `C-b [`：进入复制模式（可滚动查看历史）
- `q`：退出复制模式
- `C-b ]`：粘贴最近缓冲区内容

### 光标移动（Vi 模式）
- `h` / `j` / `k` / `l`：左 / 下 / 上 / 右
- `w` / `b`：下一个 / 上一个 单词
- `0` / `$`：行首 / 行尾
- `H` / `M` / `L`：屏幕顶部 / 中间 / 底部
- `g` / `G`：缓冲区顶部 / 底部
- `C-u` / `C-d`：向上 / 向下 翻半页
- `C-b` / `C-f`：向上 / 向下 翻全页

### 搜索与选择
- `/`：向下搜索
- `?`：向上搜索
- `n` / `N`：下一个 / 上一个 匹配项
- `Space`：开始选择文本
- `Enter`：复制选中内容并退出
- `Esc`：清除选择

### 缓冲区管理
- `C-b =`：打开缓冲区列表（可视化选择）
- `tmux list-buffers`：列出所有缓冲区
- `tmux choose-buffer`：选择并粘贴缓冲区
- `tmux save-buffer <file>`：保存缓冲区到文件
- `tmux load-buffer <file>`：从文件加载缓冲区
- `tmux delete-buffer -b <id>`：删除指定缓冲区
- `tmux capture-pane -p`：抓取当前面板内容

## 🔧 命令模式
---
lang: bash
emoji: 🔧
link: https://github.com/tmux/tmux/wiki/Getting-Started#the-command-prompt
desc: 命令提示符与脚本执行
---

### 命令提示符
- `C-b :`：打开命令提示符（输入 tmux 命令）
- 命令序列：用 `;` 分隔多个命令

```bash
# 示例：在命令提示符中
:split-window -h top
:neww -n mywindow
:swap-pane -s 0 -t 1
```

### 常用命令
- `tmux list-keys -N`：列出所有键绑定（带描述）
- `tmux info`：显示服务器详细信息
- `tmux show-options -g`：查看全局选项
- `tmux set-option -g <opt> <val>`：设置全局选项
- `tmux run-shell '<cmd>'`：运行外部命令

### 标记面板
- `C-b m`：标记/取消标记当前面板（绿色边框）
- `C-b M`：清除所有标记
- `:swap-pane`：交换活动面板与标记面板
- `:swap-window`：交换当前窗口与标记面板所在窗口

## 🖱️ 鼠标支持
---
lang: bash
emoji: 🖱️
link: https://github.com/tmux/tmux/wiki/Getting-Started#using-the-mouse
desc: 启用鼠标进行面板切换和文本选择
---

### 启用鼠标
```bash
# 在 ~/.tmux.conf 中添加
set -g mouse on

# 或通过命令提示符临时启用
:set -g mouse on
```

### 鼠标操作
- 左键点击面板：切换活动面板
- 左键点击窗口名：切换窗口
- 左键拖拽边框：调整面板大小
- 左键拖拽选择文本：复制到缓冲区
- 右键点击面板：打开菜单（含常用命令）

## ⚙️ 配置文件
---
lang: bash
emoji: ⚙️
link: https://github.com/tmux/tmux/wiki/Getting-Started#the-configuration-file
desc: ~/.tmux.conf 常用配置片段
---

### 基础配置
```bash
# 修改前缀键为 C-a
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# 启用鼠标支持
set -g mouse on

# 使用 vi 风格按键
set -g mode-keys vi
set -g status-keys vi

# 状态栏位置
set -g status-position top

# 减少延迟
set -sg escape-time 0

# 历史记录行数
set -g history-limit 50000
```

### 窗口与面板编号
```bash
# 从 1 开始编号（而非 0）
set -g base-index 1
setw -g pane-base-index 1

# 关闭窗口时自动重新编号
set -g renumber-windows on
```

### 分屏快捷键（更直观）
```bash
# 使用 | 和 - 分屏
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"

# 新窗口保持当前路径
bind c new-window -c "#{pane_current_path}"
```

### 快速重载配置
```bash
# 按 C-b r 重载配置
bind r source-file ~/.tmux.conf \; display-message "配置已重载"
```

## 🎯 高级技巧
---
lang: bash
emoji: 🎯
link: https://github.com/tmux/tmux/wiki/Advanced-Use
desc: 提升效率的高级操作
---

### 同步面板输入
```bash
# 开启所有面板同步输入（批量执行命令）
:setw synchronize-panes on

# 关闭同步
:setw synchronize-panes off
```

### 会话持久化脚本
```bash
# 创建开发环境的会话脚本
tmux new-session -s dev -n editor -d
tmux send-keys -t dev:editor 'vim' C-m
tmux new-window -t dev -n server
tmux send-keys -t dev:server 'npm run dev' C-m
tmux split-window -v -t dev:server
tmux send-keys -t dev:server.1 'npm test' C-m
tmux attach -t dev
```

### 查找与过滤
- `C-b f`：查找窗口（按名称或内容）
- `C-b w`：树形选择窗口和面板
- `C-b D`：选择并分离其他客户端

### 状态栏自定义
```bash
# 状态栏样式
set -g status-style bg=black,fg=green

# 左侧状态栏
set -g status-left "#[fg=green]#S #[fg=yellow]#I:#P"

# 右侧状态栏
set -g status-right "#[fg=cyan]%H:%M #[fg=white]%d-%b-%y"

# 窗口列表样式
set -g window-status-current-style fg=black,bg=green
```

### 嵌套 tmux 会话
```bash
# 在远程 tmux 中发送本地 tmux 前缀键
# 连续按两次前缀键
C-b C-b    # 发送 C-b 到内层 tmux

# 或配置不同前缀键
# 本地: C-a，远程: C-b
```

## 🔍 调试与故障排除
---
lang: bash
emoji: 🔍
link: https://github.com/tmux/tmux/wiki/FAQ
desc: 常见问题与解决方案
---

### 查看状态
- `tmux info`：查看服务器详细信息
- `tmux list-sessions`：列出所有会话
- `tmux list-clients`：列出所有客户端
- `C-b ?`：查看所有键绑定

### 常见问题
```bash
# 分离所有其他客户端
tmux attach -d -t <session>

# 强制杀死 tmux 服务器
tmux kill-server

# 修复颜色显示
set -g default-terminal "tmux-256color"

# 解决剪贴板问题（需要 xclip）
bind C-c run-shell "tmux save-buffer - | xclip -i -sel clipboard"
bind C-v run-shell "xclip -o -sel clipboard | tmux load-buffer -"
```

### 性能优化
```bash
# 减少状态栏刷新频率（默认 15 秒）
set -g status-interval 5

# 禁用活动监控
set -g monitor-activity off

# 禁用可视通知
set -g visual-activity off
```

## 📚 快捷键速查
---
lang: bash
emoji: 📚
link: https://github.com/tmux/tmux/wiki/Getting-Started#help-keys
desc: 最常用快捷键一览表
---

### 会话操作
- `C-b d`：分离会话
- `C-b s`：会话列表
- `C-b $`：重命名会话

### 窗口操作
- `C-b c`：新建窗口
- `C-b n`：下一个窗口
- `C-b p`：上一个窗口
- `C-b &`：关闭窗口
- `C-b ,`：重命名窗口

### 面板操作
- `C-b %`：左右分屏
- `C-b "`：上下分屏
- `C-b x`：关闭面板
- `C-b z`：放大/还原面板
- `C-b ←/→/↑/↓`：切换面板

### 复制模式
- `C-b [`：进入复制模式
- `C-b ]`：粘贴
- `C-b =`：缓冲区列表

### 其他
- `C-b ?`：键绑定帮助
- `C-b :`：命令提示符
- `C-b t`：显示时钟
