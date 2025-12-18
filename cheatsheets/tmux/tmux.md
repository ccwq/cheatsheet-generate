# tmux Getting Started 速查表

## 基础概念

- **Server**：tmux 在后台运行的主进程，保存所有状态
- **Client**：外部终端中的 tmux 客户端，用于连接到 server
- **Session**：窗口集合，具备唯一名称
- **Window**：会话中的“标签页”，由多个 pane 组成
- **Pane**：窗口内的分割区域，运行具体程序
- **Current window / Active pane**：当前输入目标

## 快速启动与前缀键

- `tmux` / `tmux new`：创建并进入新会话
- `C-b`：默认前缀键（C=Ctrl，M=Alt）
- `C-b ?`：查看所有默认键绑定说明
- `C-b /`：查看单个键的说明
- `C-b :`：打开命令提示符并执行 tmux 命令

## 会话管理

- `tmux new -s <name>`：创建命名会话
- `tmux attach -t <name>`：连接到会话
- `tmux detach` 或 `C-b d`：从会话分离
- `tmux ls`：列出所有会话
- `tmux rename-session -t <old> <new>`：重命名会话
- `tmux kill-session -t <name>`：关闭会话
- `tmux kill-server`：停止整个 tmux

## 窗口管理

- `C-b c`：新建窗口
- `C-b n` / `C-b p`：切换到下一个 / 上一个窗口
- `C-b <number>`：按索引切换窗口
- `C-b ,`：重命名当前窗口
- `tmux new-window -n <name>`：创建并命名窗口
- `tmux swap-window -s <src> -t <dst>`：交换窗口位置
- `tmux move-window -s <src> -t <dst>`：移动窗口

## 面板操作

- `C-b %`：左右分割面板
- `C-b "`：上下分割面板
- `C-b o`：切换到下一个面板
- `C-b ;`：切换到上一个面板
- `C-b {` / `C-b }`：与前/后面板交换位置
- `C-b z`：放大/还原当前面板
- `C-b M-←/→/↑/↓`：调整面板大小

## 布局与导航

- `C-b Space`：循环窗口布局
- `tmux select-layout even-horizontal`：均分左右布局
- `tmux select-layout even-vertical`：均分上下布局
- `tmux select-layout tiled`：网格布局
- `tmux choose-tree`：树形选择会话/窗口/面板
- `tmux find-window <pattern>`：按名称查找窗口

## 复制与滚动

- `C-b [`：进入复制模式（可滚动查看历史）
- `C-b ]`：粘贴缓冲区内容
- `tmux show-buffer`：查看当前缓冲区
- `tmux save-buffer <file>`：保存缓冲区到文件
- `tmux capture-pane -p`：抓取当前面板内容

## 命令提示与脚本

- `C-b :`：输入 tmux 命令（如 `split-window`）
- `tmux list-keys -N`：列出所有键绑定
- `tmux show-options -g`：查看全局选项
- `tmux set-option -g <option> <value>`：设置全局选项
- `tmux run-shell '<cmd>'`：运行外部命令

## 常用配置片段（~/.tmux.conf）

- 修改前缀键：
  - `set -g prefix C-a`
  - `unbind C-b`
  - `bind C-a send-prefix`
- 状态栏位置与样式：
  - `set -g status-position top`
  - `set -g status-style bg=red`
  - `set -g status-right '%H:%M'`
- 使用 vi 风格按键：
  - `set -g mode-keys vi`
  - `set -g status-keys vi`
- 鼠标支持：
  - `set -g mouse on`
