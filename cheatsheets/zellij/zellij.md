---
title: Zellij 速查表
lang: bash
version: "0.44.0"
date: 2026-03-23
github: zellij-org/zellij
colWidth: 360px
---

# Zellij 速查表

## 一眼入口

- 最短入口：`zellij`
- 入口模式：
  - `Ctrl+g` 锁定 / 解锁
  - `Ctrl+p` pane
  - `Ctrl+t` tab
  - `Ctrl+n` resize
  - `Ctrl+s` scroll / search
  - `Ctrl+o` session
  - `Ctrl+h` move
  - `Ctrl+b` tmux 兼容
- 全局高频键：
  - `Ctrl+q` 退出
  - `Alt+n` 新建 pane
  - `Alt+f` 切换 floating panes
  - `Alt+=` / `Alt+-` 调整大小
  - `Alt+h/j/k/l` 在 pane 或 tab 间移动

```text
Normal
├─ Ctrl+p -> Pane
├─ Ctrl+t -> Tab
├─ Ctrl+n -> Resize
├─ Ctrl+s -> Scroll/Search
├─ Ctrl+o -> Session
├─ Ctrl+h -> Move
└─ Ctrl+b -> Tmux
```

## 最短上手

```bash
zellij

# Ctrl+p -> n 新建 pane
# Ctrl+t -> n 新建 tab
# Ctrl+o -> d detach 会话
```

- `Ctrl+g` 是回到 Normal 的保险键
- `Ctrl+q` 是退出，不是 detach
- 从 tmux 迁移时可以先用 `Ctrl+b`

## Pane

```bash
Ctrl+p

n  # 新建 pane
d  # 向下拆分
r  # 向右拆分
s  # stacked pane
x  # 关闭当前 pane
f  # 当前 pane 全屏
z  # 切换 pane frames
w  # 切换 floating panes
e  # 在 embed / floating 间切换
c  # 重命名 pane
i  # pin / unpin 当前 pane
```

```bash
Alt+n         # 新建 pane
Alt+f         # 切换 floating panes
Alt+h/j/k/l   # 在 pane 或 tab 间移动
Alt+= / Alt+- # 调整当前 pane 大小
Alt+p         # 切换 pane group
Alt+Shift+p   # 切换 group marking
```

## Tab 与 Session

```bash
Ctrl+t

n       # new tab
x       # close tab
r       # rename tab
h/j/k/l # 切换 tab
1..9    # 直接跳转
Tab     # 切换 tab
s       # sync active tab
b       # break pane
[       # break left
]       # break right
```

```bash
Ctrl+o

d  # detach
w  # session-manager
c  # configuration
p  # plugin-manager
a  # about
s  # share
l  # layout-manager
```

```bash
Ctrl+b
"     # split down
%     # split right
c     # 新建 tab
n     # 下一个 tab
p     # 上一个 tab
x     # 关闭当前 pane
Space # 切换预设 layout
```

## 滚动与搜索

```bash
Ctrl+s

e             # 编辑 scrollback
s             # 进入搜索输入
Ctrl+c        # 回到底部
j / Down      # 向下滚动
k / Up        # 向上滚动
Ctrl+f / PgDn # 下一页
Ctrl+b / PgUp # 上一页
d             # 半页向下
u             # 半页向上
```

```bash
Ctrl+s
s       # 开始搜索
n       # 向下找
p       # 向上找
c       # 切换大小写敏感
w       # 切换整词匹配
o       # 切换整词 / wrap 选项
Esc     # 退出到 Normal
```

## 场景套路

### 临时查看输出

```bash
Ctrl+s
Ctrl+g
```

- 先滚动，再搜索，再回到底部

### 一个项目一个 tab

```bash
Ctrl+t -> n
Ctrl+p -> n
Ctrl+p -> r
```

- tab 放项目，pane 放角色

### 临时只看一个 pane

```bash
Ctrl+p
f
Ctrl+p
f
```

- 适合调试、读报错、演示

### 保留 tmux 手感

```bash
Ctrl+b
"     # split down
%     # split right
Space # cycle layouts
z     # full screen
```

## 结构与配置

```text
Session  = 一整组可恢复的工作状态
Tab      = 一个工作面板 / 任务分组
Pane     = 终端窗口里的最小运行单元
Floating = 临时浮窗
Layout   = pane 的预设组织方式
Plugin   = tab bar / status bar / session manager 等扩展
```

```kdl
default_mode "normal"
default_layout "compact"
pane_frames true
mouse_mode true
session_serialization false
stacked_resize true
```

- `default_layout`：调整启动后的初始布局
- `pane_frames`：增强 pane 边界感
- `session_serialization`：重启后恢复 session
- `mouse_mode`：启用鼠标交互，但可能影响复制

## 快速记忆

```bash
Ctrl+g   # 锁定 / 解锁
Ctrl+p   # pane
Ctrl+t   # tab
Ctrl+n   # resize
Ctrl+s   # scroll/search
Ctrl+o   # session
Ctrl+h   # move
Ctrl+q   # quit
```
