---
title: Zellij 速查表
lang: bash
<<<<<<< HEAD
version: "0.43.1"
date: 2025-08-08
github: zellij-org/zellij
colWidth: 460px
=======
version: "0.44.0"
date: 2026-03-23
github: zellij-org/zellij
colWidth: 360px
>>>>>>> ed1ab08bcd69166d41530080f2c7ca1bd37d72ff
---

# Zellij 速查表

<<<<<<< HEAD
## Cookbook: 先把环境跑顺
---
lang: bash
emoji: 🧭
link: https://zellij.dev/documentation/
desc: Zellij 是终端工作区管理器。先把首次启动、键位预设、主题、鼠标和会话这五条主线跑通，再去记全量快捷键。
---

- 首次启动要么直接进欢迎页，要么先生成默认配置再改 `config.kdl`
- 主题切换看 `options --theme`
- 鼠标切换看 `options --mouse-mode`
- 会话恢复优先看 `session-manager`，CLI 再补 `list-sessions` / `attach`

```bash
# 1. 先起一个可恢复的会话
zellij -l welcome

# 2. 临时切主题
zellij options --theme nord

# 3. 临时开关鼠标
zellij options --mouse-mode true
```

### Recipe: 第一次装好后，先切到自己顺手的键位

- 默认预设更适合直接上手
- `unlock-first` 更适合和其他程序减少冲突
- 如果你想看完整默认配置，先导出一份 `config.kdl` 再改

```bash
zellij setup --dump-config > ~/.config/zellij/config.kdl
```

### Recipe: 需要亮色主题时

- `nord` 是暗色主题
- `solarized-light`、`gruvbox-light`、`tokyo-night-light`、`catppuccin-latte` 是官方内置亮色主题
- `nord-light` 不是当前官方内置名

```bash
zellij options --theme solarized-light
```

### Recipe: 需要恢复旧会话时

- 先看当前会话列表
- 再 attach 到目标会话
- 如果你想“有就接上，没有就新建”，用 `--create-background`

```bash
zellij list-sessions
zellij attach work
zellij attach --create-background work
```

## 快速定位
---
lang: bash
emoji: ⚡
link: https://zellij.dev/documentation/command-line-options.html
desc: 记住四个命令就够开始：`zellij`、`options --theme`、`options --mouse-mode`、`attach`。
---

- `zellij`
- `zellij -l welcome`
- `zellij options --theme nord`
- `zellij options --mouse-mode true`
- `zellij list-sessions`
- `zellij attach <name>`

## 主题切换：暗色和亮色
---
lang: bash
emoji: 🎨
link: https://zellij.dev/documentation/theme-list.html
desc: 主题名必须和内置列表一致，`theme "..."` 和 `options --theme ...` 用的都是这个名字。
---

- `nord`
- `solarized-light`
- `gruvbox-light`
- `tokyo-night-light`
- `catppuccin-latte`
- `tokyo-night`
- `gruvbox-dark`

```bash
# 临时切换
zellij options --theme nord
zellij options --theme solarized-light
```

```kdl
// 持久化：写进 config.kdl
theme "nord"
```

## 鼠标支持
---
lang: bash
emoji: 🖱️
link: https://zellij.dev/documentation/command-line-options.html
desc: `mouse_mode` 默认开启。要暂时把拖拽选择交还给终端，就按住 `Shift`。
---

- `mouse_mode true`：默认开启
- `mouse_mode false`：关闭鼠标事件接管
- `Shift`：临时让终端自己的鼠标选择生效

```kdl
// ~/.config/zellij/config.kdl
mouse_mode true
```

```bash
# 临时开关
zellij options --mouse-mode true
zellij options --mouse-mode false
```

## 按键预设
---
lang: bash
emoji: ⌨️
link: https://zellij.dev/documentation/keybinding-presets.html
desc: 官方文档里的预设重点是 `default` 和 `unlock-first`；`tmux` 是兼容风格，通常靠 `keybinds` 自定义出来。
---

- `default`：默认预设，进 Zellij 后直接可用
- `unlock-first`：先解锁再用，适合减少和其他程序的按键冲突
- `tmux`：tmux 风格的按键习惯，不是独立的官方预设名
- 想重走首次选择流程，通常先把 `~/.config/zellij/config.kdl` 挪走或删掉

```bash
zellij setup --dump-config > ~/.config/zellij/config.kdl
```

## 快捷键：全局与锁定
---
lang: bash
emoji: 🧷
link: https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/config/default.kdl
desc: 先记住会在所有模式里反复用到的全局键。
---

- `Ctrl g`：切到 `Locked`
- `Ctrl q`：退出 Zellij
- `Alt f`：切换浮动 pane
- `Alt n`：新建 pane
- `Alt c`：复制
- `Alt i`：把当前 tab 往左移
- `Alt o`：把当前 tab 往右移
- `Alt h` / `Alt Left`：切到左侧 pane 或 tab
- `Alt l` / `Alt Right`：切到右侧 pane 或 tab
- `Alt j` / `Alt Down`：切到下方 pane
- `Alt k` / `Alt Up`：切到上方 pane
- `Alt =` / `Alt +`：放大
- `Alt -`：缩小
- `Alt [`：切到上一个布局
- `Alt ]`：切到下一个布局
- `Alt p`：切换 pane 组内焦点
- `Alt Shift p`：切换组标记

## 快捷键：模式入口
---
lang: bash
emoji: 🧭
link: https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/config/default.kdl
desc: 这些键负责把你送进具体模式。记住入口，就能把后面的操作拆开记。
---

- `Ctrl p`：进入 `Pane`
- `Ctrl n`：进入 `Resize`
- `Ctrl s`：进入 `Scroll`
- `Ctrl o`：进入 `Session`
- `Ctrl t`：进入 `Tab`
- `Ctrl h`：进入 `Move`
- `Ctrl b`：进入 `Tmux`

## 快捷键：Resize
---
lang: bash
emoji: 🪟
link: https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/config/default.kdl
desc: 调整 pane 大小的键就这些，和 Pane card 分开记更轻。
---

- `Ctrl n`：回到 `Normal`
- `h` / `Left`：向左调大
- `j` / `Down`：向下调大
- `k` / `Up`：向上调大
- `l` / `Right`：向右调大
- `H`：向左调小
- `J`：向下调小
- `K`：向上调小
- `L`：向右调小
- `=` / `+`：整体放大
- `-`：整体缩小

## 快捷键：Pane
---
lang: bash
emoji: 🪟
link: https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/config/default.kdl
desc: 分屏、关闭、全屏、浮动和 pin 都属于 pane 级别操作。
---

- `Ctrl p`：回到 `Normal`
- `h` / `Left`：切到左边 pane
- `j` / `Down`：切到下边 pane
- `k` / `Up`：切到上边 pane
- `l` / `Right`：切到右边 pane
- `p`：循环切焦点
- `n`：新建 pane
- `d`：向下拆分新 pane
- `r`：向右拆分新 pane
- `s`：stacked 布局新 pane
- `x`：关闭当前 pane
- `f`：切换当前 pane 全屏
- `z`：切换 pane 边框
- `w`：切换 floating panes
- `e`：在 embed 和 floating 之间切换
- `c`：重命名 pane
- `i`：切换 pinned

## 快捷键：Tab
---
lang: bash
emoji: 🔀
link: https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/config/default.kdl
desc: tab 切换、重命名、拆分和同步输入，放在一张卡里最顺。
---

- `Ctrl t`：回到 `Normal`
- `r`：重命名 tab
- `h` / `Left` / `Up` / `k`：上一个 tab
- `l` / `Right` / `Down` / `j`：下一个 tab
- `n`：新建 tab
- `x`：关闭 tab
- `s`：切换 tab 同步输入
- `b`：把当前 pane 拆到新 tab
- `[`：把当前 pane 拆到左边新 tab
- `]`：把当前 pane 拆到右边新 tab
- `Tab`：切换 tab
- `1` 到 `9`：直接跳到对应 tab

## 快捷键：Move
---
lang: bash
emoji: ↔️
link: https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/config/default.kdl
desc: pane 只是“看见”的布局，Move 是“搬家”。和 Tab 分开记会更直观。
---

- `Ctrl h`：回到 `Normal`
- `Tab` / `n`：移动 pane
- `p`：反向移动 pane
- `h` / `Left`：左移
- `j` / `Down`：下移
- `k` / `Up`：上移
- `l` / `Right`：右移

## 快捷键：Scroll / Search
---
lang: bash
emoji: 🔎
link: https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/config/default.kdl
desc: 滚动、搜索、确认搜索和重命名冲突，适合一起记。
---

- `Ctrl s`：回到 `Normal`
- `e`：编辑 scrollback
- `s`：进入搜索
- `Ctrl c`：滚到最底部
- `j` / `Down`：向下滚
- `k` / `Up`：向上滚
- `Ctrl f` / `PageDown` / `Right` / `l`：翻页向下
- `Ctrl b` / `PageUp` / `Left` / `h`：翻页向上
- `d`：半页向下
- `u`：半页向上

- `Ctrl s`：回到 `Normal`
- `Ctrl c`：滚回底部
- `j` / `Down`：下一条
- `k` / `Up`：上一条
- `Ctrl s`：回到 `Normal`
- `Ctrl f` / `PageDown` / `Right` / `l`：向下翻页
- `Ctrl b` / `PageUp` / `Left` / `h`：向上翻页
- `d`：半页向下
- `u`：半页向上
- `n`：下一个匹配
- `p`：上一个匹配
- `c`：切换大小写敏感
- `w`：切换 wrap
- `o`：切换 whole word

- `Ctrl c` / `Esc`：回到 `Scroll`
- `Enter`：执行搜索

- `Ctrl c`：取消并回到上层模式
- `Esc`：撤销重命名并返回

## 快捷键：Session
---
lang: bash
emoji: 🧩
link: https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/config/default.kdl
desc: 会话、插件入口和分离动作放在一起看最顺。
---

- `Ctrl o`：回到 `Normal`
- `d`：Detach
- `w`：打开 `session-manager`
- `c`：打开配置相关插件
- `p`：打开插件管理器
- `a`：打开 about
- `s`：打开 share
- `l`：打开 layout manager

## 快捷键：Tmux
---
lang: bash
emoji: 🪤
link: https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/config/default.kdl
desc: 兼容 tmux 习惯的前缀键方案，单独记一组最省脑子。
---

- `Ctrl b`：Tmux 前缀键，回到 `Normal`
- `[`：进入 `Scroll`
- `"`：向下新建 pane
- `%`：向右新建 pane
- `z`：切换当前 pane 全屏
- `c`：新建 tab
- `,`：重命名 tab
- `p`：上一个 tab
- `n`：下一个 tab
- `h` / `j` / `k` / `l`：切焦点
- `o`：切到下一个 pane
- `d`：Detach
- `Space`：切换布局
- `x`：关闭当前 pane

## 会话管理
---
lang: bash
emoji: 🧩
link: https://zellij.dev/tutorials/session-management/
desc: 会话管理最实用的入口是 session manager 和 `attach` / `list-sessions`。先分离，再恢复，是最稳的用法。
---

- 默认键位下，`Ctrl o` + `w`：打开 session manager
- 默认键位下，`Ctrl o` + `d`：分离会话，后台继续跑
- `zellij -l welcome`：直接进欢迎页
- `zellij list-sessions`：查看当前会话
- `zellij attach <name>`：连接到指定会话
- `zellij attach --create-background <name>`：没有会话时后台创建
- `zellij delete-session <name>`：删除已退出的会话

```bash
zellij list-sessions
zellij attach work
zellij attach --create-background work
zellij delete-session work
=======
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
>>>>>>> ed1ab08bcd69166d41530080f2c7ca1bd37d72ff
```
