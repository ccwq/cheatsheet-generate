---
title: tmux 速查表
lang: bash
version: "3.6a"
date: 2026-03-18
github: tmux/tmux
colWidth: 500px
---

## 快速定位
---
lang: bash
emoji: 🧭
link: https://github.com/tmux/tmux/wiki/Getting-Started
desc: tmux 就像给终端加了一层“可断线重连的工作区管理器”。如果你最常遇到的是鼠标复制失效、分屏后复制乱掉或剪贴板不同步，先看下面这组 cookbook。
---

- 典型入口：`tmux new -A -s work`
- 最常见困惑：开了 `set -g mouse on` 之后，终端原本的系统级鼠标选中会被 tmux 接管
- 先记结论：
  - 想临时沿用终端自己的复制，按住修饰键拖拽
  - 想保留 tmux 鼠标能力，就进入复制模式再复制
  - 分屏复制容易乱时，先 `C-b z` 放大当前 pane

## Cookbook：鼠标复制失效先怎么判断
---
lang: bash
emoji: 🖱️
link: https://github.com/tmux/tmux/wiki/Using-the-mouse
desc: 当你在 tmux 里突然不能像平时那样拖选复制，十有八九不是终端坏了，而是 tmux 把鼠标事件接管了。
---

- 根因判断：如果配置里有 `set -g mouse on`，鼠标拖动通常不再是“系统级选中”，而会变成 tmux 内部的选择或复制动作
- 默认行为变化：
  - 终端模拟器原本负责的拖拽选中，被 tmux 拦下来处理
  - 选中的内容默认进 tmux buffer，而不是系统剪贴板
- 快速排查：

```bash
# 看当前是否开启鼠标模式
tmux show -g mouse

# 看当前是否尝试写系统剪贴板
tmux show -s set-clipboard
```

## Recipe：临时绕过 tmux，直接走系统复制
---
lang: bash
emoji: ⚡
link: https://github.com/tmux/tmux/wiki/Clipboard
desc: 这条路线最快，适合你只是临时想拖一段日志、报错或命令输出到系统剪贴板，不想改配置。
---

- `macOS/iTerm2/Terminal：按住 Option 再拖拽`
- `Windows/PowerShell/CMD/MobaXterm：按住 Shift 再拖拽`
- `Linux/GNOME Terminal/xterm：按住 Shift 再拖拽`
- 使用场景：你只是偶尔复制一段文本，不想影响现有鼠标切 pane、改尺寸、点窗口标签这些操作
- 风险点：不同终端可能对修饰键有自己的快捷键占用，但“按住修饰键绕过 tmux”这条思路基本一致

## Recipe：关闭鼠标模式，回到传统复制
---
lang: bash
emoji: 📴
link: https://github.com/tmux/tmux/wiki/Using-the-mouse
desc: 如果你更依赖终端自己的拖拽复制，而不是 tmux 的鼠标切 pane / 调整布局，可以直接把 mouse mode 关掉。
---

```bash
# 当前会话里临时关闭
tmux set -g mouse off

# 改完配置后重载
tmux source-file ~/.tmux.conf
```

```bash
# ~/.tmux.conf
set -g mouse off
```

- 适合场景：你的主要诉求是“像普通终端那样拖选复制”
- 代价：pane 点击切换、鼠标拖动改大小、滚轮滚历史这些 tmux 鼠标能力会一起弱化或失效

## Recipe：保留鼠标能力，但改用 tmux 复制模式
---
lang: bash
emoji: 📋
link: https://github.com/tmux/tmux/wiki/Getting-Started#copy-and-paste
desc: 如果你想保留 mouse mode，就不要再把复制理解成“终端在选字”，而要理解成“tmux 自己在做复制”。
---

- 起手动作：`C-b [` 进入复制模式
- 选择流程：
  - `方向键 / PgUp / PgDn / 鼠标滚轮` 找到目标区域
  - `Space` 开始选择
  - `Enter` 结束选择并复制
- 默认去向：复制结果先进 tmux buffer，不会天然同步到系统剪贴板
- 要同步到系统剪贴板时，通常要再配：
  - `set -s set-clipboard on`
  - 或终端支持 `OSC52`
  - 或外部工具如 `xclip` / `xsel`
  - 或插件如 `tmux-yank`

## Recipe：分屏复制乱掉时先放大当前 pane
---
lang: bash
emoji: 🔍
link: https://github.com/tmux/tmux/wiki/Getting-Started#splitting-the-window
desc: 多 pane 场景里，复制常见问题不是“不能选”，而是跨 pane 看着容易乱。最稳的办法是先把当前 pane 单独放大。
---

- `C-b z`：最大化当前 pane
- 在放大后的 pane 里完成复制
- 再按一次 `C-b z`：恢复原布局
- 适合场景：日志很多、分屏密集、拖选时容易跨 pane 或视觉干扰很强

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
- `C-b $`：重命名当前会话
- `C-b (`：切换到上一个会话
- `C-b )`：切换到下一个会话

### 交互式列表状态
- `C-b s`：进入交互列表状态
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

### 和系统剪贴板的边界
- `tmux buffer`：tmux 自己的复制缓冲区
- `system clipboard`：操作系统级剪贴板
- 默认情况下，这两者不是同一个东西
- 如果你在 tmux 里复制后，外部应用里粘贴不到，优先检查 `set-clipboard`、终端 OSC52 支持或 `xclip/xsel/pbcopy`

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
link: https://github.com/tmux/tmux/wiki/Using-the-mouse
desc: 启用鼠标进行 pane 切换、尺寸调整与 tmux 内部文本选择
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
- 左键拖拽选择文本：通常进入 tmux 内部选择/复制逻辑，而不是终端原生系统选中
- 右键点击面板：打开菜单（含常用命令）

### 什么时候别开
- 你主要依赖终端原生拖拽复制时
- 你所在终端对修饰键绕过支持不好时
- 你更在意“复制到系统剪贴板立即可用”，而不是 tmux 内部交互

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

## 🎯 目标语法与定位
---
lang: bash
emoji: 🎯
link: https://github.com/tmux/tmux/wiki/Formats
desc: 掌握 target 语法，精准操作会话/窗口/面板
---

### 常见 target 写法
- `session`：会话名，例如 `work`
- `session:window`：窗口目标，例如 `work:2`、`work:editor`
- `session:window.pane`：面板目标，例如 `work:2.1`
- `:window`：当前会话中的窗口，例如 `:1`
- `%pane_id`：面板唯一 ID，例如 `%3`

### 精准定位示例
```bash
# 向指定面板发送命令
tmux send-keys -t work:editor.1 'npm run dev' C-m

# 在指定窗口创建面板并运行命令
tmux split-window -t work:server -v 'htop'

# 关闭指定窗口
tmux kill-window -t work:logs

# 切换客户端到指定会话
tmux switch-client -t work
```

### 常用列表命令
- `tmux list-sessions`：列出会话
- `tmux list-windows -t <session>`：列出会话内窗口
- `tmux list-panes -a`：列出所有面板
- `tmux display-message -p '#S:#I.#P'`：打印当前定位信息

## 🧩 格式化字符串与状态栏变量
---
lang: bash
emoji: 🧩
link: https://github.com/tmux/tmux/wiki/Formats
desc: 用 format 变量构建动态状态栏与脚本输出
---

### 高频 format 变量
- `#{session_name}`：会话名
- `#{window_index}` / `#{window_name}`：窗口编号 / 名称
- `#{pane_index}` / `#{pane_id}`：面板编号 / 唯一 ID
- `#{pane_current_path}`：当前面板路径
- `#{pane_current_command}`：当前前台命令

### 状态栏实战
```bash
# 左侧显示: 会话名 + 窗口 + 面板
set -g status-left '#[fg=green]#S #[fg=yellow]#I.#P'

# 右侧显示: 命令 + 路径
set -g status-right '#[fg=cyan]#{pane_current_command} #[fg=white]#{pane_current_path}'
```

### 调试 format
```bash
# 直接在终端打印 format 结果
tmux display-message -p 'session=#{session_name} window=#{window_name} pane=#{pane_id}'
```

## 🤖 自动化与 Control Mode
---
lang: bash
emoji: 🤖
link: https://github.com/tmux/tmux/wiki/Control-Mode
desc: 用脚本和控制模式批量编排 tmux 工作流
---

### 批量编排会话
```bash
# 无界面启动一个完整开发会话
tmux new-session -d -s app -n editor
tmux send-keys -t app:editor 'nvim' C-m
tmux new-window -t app -n api
tmux send-keys -t app:api 'pnpm dev' C-m
tmux new-window -t app -n logs
tmux send-keys -t app:logs 'tail -f /var/log/app.log' C-m
tmux attach -t app
```

### 条件执行与外壳命令
```bash
# 条件判断（在 tmux 命令行中执行）
if-shell '[ -f ~/.tmux.conf ]' 'display-message "配置存在"' 'display-message "配置缺失"'

# 执行外部 shell 命令并提示
run-shell 'date > /tmp/tmux-last-run.txt'
display-message "外部命令已执行"
```

### Control Mode 入口
- `tmux -C attach -t <session>`：以控制模式连接
- `tmux -C new -s <name>`：以控制模式创建会话
- 适用场景：IDE 集成、自动化测试驱动、远程会话编排

## 🪄 Popup 与临时任务
---
lang: bash
emoji: 🪄
link: https://github.com/tmux/tmux/wiki/Advanced-Use
desc: 使用弹窗执行临时命令，避免打断当前布局
---

### 打开弹窗
- `C-b :display-popup`：打开空弹窗
- `C-b :display-popup -E htop`：弹窗执行命令并自动退出
- `C-b :display-popup -w 80% -h 70% -E btop`：指定弹窗尺寸

### 常见场景
```bash
# 临时看 git 历史，不打乱当前 pane 布局
tmux display-popup -E 'git log --oneline --graph --decorate -n 30'

# 临时执行交互式命令
tmux display-popup -E 'lazygit'
```

## 🧪 Hooks 事件驱动
---
lang: bash
emoji: 🧪
link: https://github.com/tmux/tmux/wiki/Advanced-Use
desc: 用 hook 在会话创建、窗口切换等事件触发自动动作
---

### 常见 hook
- `client-attached`：客户端连接后触发
- `session-created`：会话创建后触发
- `window-linked`：窗口链接后触发
- `pane-died`：面板进程退出后触发

### 配置示例
```bash
# 客户端连接时给出提示
set-hook -g client-attached 'display-message "客户端已连接: #S"'

# 会话创建时自动提示
set-hook -g session-created 'display-message "新会话: #S"'

# 取消某个 hook
set-hook -gu client-attached
```

## 📎 剪贴板集成（OSC52）
---
lang: bash
emoji: 📎
link: https://github.com/tmux/tmux/wiki/Clipboard
desc: 在 SSH/远程场景下提高复制到系统剪贴板的成功率
---

### 推荐配置
```bash
# 允许 tmux 通过终端能力写入系统剪贴板
set -s set-clipboard on

# 复制模式下进入 Vi 键位
set -g mode-keys vi
```

```bash
# Linux 下也可显式接外部剪贴板工具
bind-key -T copy-mode-vi Enter send-keys -X copy-pipe-and-cancel "xclip -selection clipboard -in"
```

### 诊断思路
- 先检查终端是否支持 OSC52（iTerm2、kitty、新版 WezTerm 等）
- SSH 跳板较多时优先用 OSC52，避免依赖远端 `xclip`
- 若复制异常，先执行 `tmux show -s set-clipboard` 确认状态

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

## 🔧 高级技巧 2
---
lang: bash
emoji: 🔧
link: https://github.com/tmux-plugins/tpm
desc: 把插件管理和会话持久化收束到文末，便于直接复制配置和按键。
---

### 插件管理和持久化配置
```bash
# 安装 TPM
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```
复制内容到配置文件 ```~/.tmux.conf```
```bash
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @continuum-restore 'on'
run '~/.tmux/plugins/tpm/tpm'
```

重载配置
```bash
tmux source-file ~/.tmux.conf
```
- `Prefix + I`：安装新列出的插件并刷新环境
- `Prefix + U`：更新所有插件
- `Prefix + Alt + u`：卸载不在列表中的插件
- `TMUX environment reloaded`：通常表示 TPM 安装流程已完成
- 
插件说明
- `tmux-resurrect`：负责保存和恢复 tmux 会话、窗口与布局
- `tmux-continuum`：负责自动保存，并在 tmux 启动时自动恢复
- 需要稳定复用工作区时，这两个插件通常一起用
