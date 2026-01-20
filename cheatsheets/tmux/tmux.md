# tmux Getting Started 速查表

## 基础概念与层级

### 核心层级关系
`Server` (后台服务)
  └── `Session` (会话: 工作区集合)
      └── `Window` (窗口: 类似浏览器 Tab)
          └── `Pane` (面板: 屏幕分割单元)

### 术语说明
- **Server**：tmux 的后台主进程，管理所有的会话。即使关闭终端，Server 仍在运行。
- **Session**：一组窗口的集合，通常对应一个“项目”或“工作流”。
- **Window**：单个可见的屏幕页面，可以填满整个终端，也可以包含多个面板。
- **Pane**：窗口内的矩形分割区域，每个面板运行一个独立的终端/程序。
- **Client**：你当前使用的终端窗口，连接到 tmux Server 的一个会话。

## 快速启动与前缀键

- `tmux` / `tmux new`：创建并进入新会话
- `C-b`：默认前缀键（C=Ctrl，M=Alt）
- `C-b ?`：查看所有默认键绑定说明
- `C-b /`：查看单个键的说明
- `C-b :`：打开命令提示符并执行 tmux 命令

## 会话管理

- `tmux new -s <name>`：创建命名会话
- `tmux new -A -s <name>`：如果会话存在则附加，不存在则创建
- `tmux new -s <ses> -n <win>`：创建会话并指定首个窗口名称
- `tmux attach -t <name>`：连接到会话
- `tmux detach` 或 `C-b d`：从会话分离
- `tmux ls`：列出所有会话
- `C-b s`：显示并选择会话列表（交互式）
- `C-b (` / `C-b )`：切换到上一个 / 下一个会话
- `tmux rename-session -t <old> <new>`：重命名会话
- `tmux kill-session -t <name>`：关闭会话
- `tmux kill-session -a`：关闭除当前会话外的所有会话
- `tmux kill-server`：停止整个 tmux

## 窗口管理

- `C-b c`：新建窗口
- `C-b &`：关闭当前窗口（需确认）
- `C-b n` / `C-b p`：切换到下一个 / 上一个窗口
- `C-b l`：切换到最后活跃的窗口
- `C-b <number>`：按索引切换窗口
- `C-b f`：查找窗口（按名称）
- `C-b ,`：重命名当前窗口
- `tmux new-window -n <name>`：创建并命名窗口
- `tmux swap-window -s <src> -t <dst>`：交换窗口位置
- `tmux move-window -s <src> -t <dst>`：移动窗口
- `tmux move-window -r`：重新编号窗口（移除空隙）

## 面板操作

- `C-b %`：左右分割面板
- `C-b "`：上下分割面板
- `C-b x`：关闭当前面板（需确认）
- `C-b o`：切换到下一个面板
- `C-b ;`：切换到上一个面板
- `C-b {` / `C-b }`：与前/后面板交换位置
- `C-b q`：显示面板编号（输入数字切换）
- `C-b !`：将当前面板拆分为新窗口
- `C-b z`：放大/还原当前面板
- `join-pane -s <src> -t <dst>`：将窗口/面板合并到当前面板
- `setw synchronize-panes`：开启/关闭多面板同步输入
- `C-b M-←/→/↑/↓`：调整面板大小（每次 5 单元格）
- `tmux resize-pane -D 20`：向下调整 20 单元格 (U/D/L/R)

## 布局与导航

- `C-b Space`：循环窗口布局
- `tmux select-layout even-horizontal`：均分左右布局
- `tmux select-layout even-vertical`：均分上下布局
- `tmux select-layout tiled`：网格布局
- `tmux choose-tree`：树形选择会话/窗口/面板
- `C-b t`：显示时钟

## 复制与滚动 (Vi 模式)
需开启 `set -g mode-keys vi`

- **进入与退出**
  - `C-b [`：进入复制模式（可滚动查看历史）
  - `q`：退出复制模式
- **光标移动**
  - `h` / `j` / `k` / `l`：左 / 下 / 上 / 右
  - `w` / `b`：按单词 向后 / 向前 移动
  - `0` / `$`：跳转到 行首 / 行尾
  - `H` / `M` / `L`：跳转到 屏幕 顶部 / 中间 / 底部
  - `g` / `G`：跳转到 缓冲区 顶部 / 底部
  - `C-u` / `C-d`：向上 / 向下 翻半页
  - `C-b` / `C-f`：向上 / 向下 翻全页
- **搜索**
  - `/`：向下搜索
  - `?`：向上搜索
  - `n` / `N`：下一个 / 上一个 匹配项
- **选择与复制**
  - `Space`：开始选择（高亮）
  - `Enter`：复制选中内容并退出
  - `Esc`：清除选择
- **缓冲区操作**
  - `C-b ]`：粘贴缓冲区内容
  - `tmux list-buffers`：列出所有缓冲区
  - `tmux choose-buffer`：选择并粘贴缓冲区
  - `tmux save-buffer <file>`：保存缓冲区到文件
  - `tmux delete-buffer -b <id>`：删除指定缓冲区
  - `tmux capture-pane -p`：抓取当前面板内容

## 命令提示与脚本

- `C-b :`：输入 tmux 命令（如 `split-window`）
- `tmux list-keys -N`：列出所有键绑定
- `tmux info`：显示服务器、会话、窗口、面板等详细信息
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
