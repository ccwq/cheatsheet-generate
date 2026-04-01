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

### 最短入口

```bash
zellij                      # 启动默认 session
zellij -l welcome           # 启动欢迎界面选择 session
zellij attach my-session    # 连接到已有 session
```

### 入口模式

| 快捷键 | 模式 | 用途 |
|--------|------|------|
| `Ctrl+g` | locked | 锁定/解锁，切换到 Normal |
| `Ctrl+p` | pane | 新建、拆分、关闭 pane |
| `Ctrl+t` | tab | 新建、关闭、切换 tab |
| `Ctrl+n` | resize | 调整 pane 大小 |
| `Ctrl+s` | scroll/search | 滚动和搜索输出 |
| `Ctrl+o` | session | 分离会话、session 管理 |
| `Ctrl+h` | move | 移动 pane 或 tab |
| `Ctrl+b` | tmux | tmux 兼容键位 |

### 全局高频键

| 快捷键 | 动作 |
|--------|------|
| `Ctrl+q` | 退出 Zellij（注意不是 detach） |
| `Alt+n` | 新建 pane |
| `Alt+f` | 切换浮动 pane |
| `Alt+=` / `Alt+-` | 调整 pane 大小 |
| `Alt+h/j/k/l` | 在 pane 或 tab 间移动焦点 |

## 会话管理

### Session 命令行

```bash
zellij                           # 启动新 session（随机名称）
zellij -s my-session             # 启动命名 session
zellij -l compact                # 使用指定布局启动
zellij -l welcome                # 欢迎界面选择 session
zellij attach my-session         # 连接到已有 session
zellij attach -c my-session      # 不存在则创建
zellij list-sessions             # 列出所有 session
zellij delete-session my-session # 删除 session
zellij -c /path/to/config.kdl   # 使用指定配置文件
```

### Session 生命周期

```bash
zellij options --sessionSerialization false  # 禁用 session 恢复
zellij action save-session                  # 手动保存 session 状态
zellij action rename-session "new-name"      # 重命名 session
zellij action detach                         # 分离当前 session
```

## Pane 操作

### Pane 模式 (Ctrl+p)

| 快捷键 | 动作 |
|--------|------|
| `n` | 新建 pane |
| `d` | 向下拆分 |
| `r` | 向右拆分 |
| `s` | stacked pane（堆叠） |
| `x` | 关闭当前 pane |
| `f` | 全屏切换 |
| `z` | 切换 pane frames |
| `w` | 切换 floating panes |
| `e` | embed/floating 切换 |
| `c` | 重命名 pane |
| `i` | pin/unpin 当前 pane |

### 新建 Pane CLI

```bash
zellij action new-pane                              # 默认 shell 新建 pane
zellij action new-pane -d right                    # 向右拆分
zellij action new-pane -d down                     # 向下拆分
zellij action new-pane -f                          # 新建浮动 pane
zellij action new-pane -- htop                     # 执行命令
zellij action new-pane --name "log" -- tail -f /var/log/syslog
zellij action new-pane -d right -- cwd /project    # 指定工作目录
zellij action new-pane --stacked                   # 堆叠模式
zellij action new-pane --in-place -- htop          # 替换当前 pane
```

### Pane 快捷操作

```bash
Alt+n         # 新建 pane
Alt+f         # 切换 floating panes
Alt+h/j/k/l   # 在 pane 间移动焦点
Alt+= / Alt+- # 调整当前 pane 大小
Alt+p         # 切换 pane group
Alt+Shift+p   # 切换 group marking
```

### Pane 管理 CLI

```bash
zellij action close-pane                      # 关闭当前 pane
zellij action close-pane --pane-id terminal_3 # 关闭指定 pane
zellij action move-focus left                 # 移动焦点
zellij action move-pane right                 # 移动 pane 位置
zellij action resize left                     # 调整大小
zellij action rename-pane "worker"            # 重命名
zellij action toggle-fullscreen               # 全屏切换
zellij action toggle-pane-embed-or-floating   # 切换 embed/floating
```

## Tab 操作

### Tab 模式 (Ctrl+t)

| 快捷键 | 动作 |
|--------|------|
| `n` | 新建 tab |
| `x` | 关闭 tab |
| `r` | 重命名 tab |
| `h/j/k/l` | 切换 tab |
| `1-9` | 直接跳转 |
| `Tab` | 切换到上一个 tab |
| `s` | 同步 panes |
| `b` | break pane 到新 tab |
| `[` / `]` | 向左/右移动 tab |

### Tab CLI

```bash
zellij action new-tab                           # 新建 tab
zellij action new-tab --name "dev"              # 命名 tab
zellij action new-tab -l /path/to/layout.kdl   # 使用布局
zellij action new-tab --cwd /project           # 指定工作目录
zellij action new-tab -- htop                  # 执行命令
zellij action close-tab                        # 关闭当前 tab
zellij action close-tab --tab-id 3             # 关闭指定 tab
zellij action go-to-tab 1                      # 跳转到 tab 1
zellij action go-to-tab-name "dev"            # 按名称跳转
zellij action rename-tab "production"          # 重命名
zellij action move-tab right                   # 移动 tab 位置
```

## 滚动与搜索

### Scroll/Search 模式 (Ctrl+s)

| 快捷键 | 动作 |
|--------|------|
| `j/Down` | 向下滚动 |
| `k/Up` | 向上滚动 |
| `Ctrl+f/PgDn` | 下一页 |
| `Ctrl+b/PgUp` | 上一页 |
| `d` | 半页向下 |
| `u` | 半页向上 |
| `e` | 编辑 scrollback |
| `s` | 进入搜索 |
| `Ctrl+c` | 回到底部 |

### 搜索操作

| 快捷键 | 动作 |
|--------|------|
| `n` | 向下查找 |
| `p` | 向上查找 |
| `c` | 切换大小写敏感 |
| `w` | 切换整词匹配 |
| `Esc` | 退出搜索 |

### Scrollback CLI

```bash
zellij action dump-screen                       # 导出当前屏幕
zellij action dump-screen --full                # 导出完整 scrollback
zellij action dump-screen --pane-id terminal_3  # 导出指定 pane
zellij action dump-screen --path /tmp/dump.txt  # 保存到文件
zellij action dump-screen --ansi                # 保留 ANSI 颜色
zellij action edit-scrollback                   # 用编辑器打开 scrollback
zellij action scroll-down                        # 滚动
zellij action scroll-to-bottom                   # 滚到底部
```

## Session 模式 (Ctrl+o)

| 快捷键 | 动作 |
|--------|------|
| `d` | detach 当前 session |
| `w` | 打开 session manager |
| `c` | 打开配置 |
| `p` | 打开插件管理器 |
| `a` | about |
| `s` | 分享 session |
| `l` | 布局管理器 |

## Tmux 兼容模式 (Ctrl+b)

| 快捷键 | 动作 |
|--------|------|
| `"` | 向下拆分 |
| `%` | 向右拆分 |
| `c` | 新建 tab |
| `n` | 下一个 tab |
| `p` | 上一个 tab |
| `x` | 关闭 pane |
| `Space` | 循环切换布局 |
| `z` | 全屏 |

## 布局 (Layout)

### 内置布局

```bash
zellij -l compact       # 紧凑布局
zellij -l default      # 默认布局
zellij -l welcome      # 欢迎界面
```

### 布局管理

```bash
zellij action override-layout /path/to/layout.kdl    # 覆盖当前布局
zellij action dump-layout                            # 导出当前布局
zellij setup --dump-config > ~/.config/zellij/config.kdl  # 导出默认配置
```

### 布局文件示例 (KDL)

```kdl
layout {
    pane split_direction="vertical" {
        pane edit="src/main.rs"
        pane split_direction="horizontal" {
            pane command="cargo" { args "check"; }
            pane command="cargo" { args "run"; }
            pane command="cargo" { args "test"; }
        }
    }
    pane size=1 borderless=true {
        plugin location="zellij:compact-bar"
    }
}
```

## 浮动 Pane 与堆叠

### 浮动 Pane 操作

```bash
zellij action new-pane -f                          # 新建浮动 pane
zellij action new-pane -f --x 10 --y 20 --width 50% --height 30%
zellij action toggle-floating-panes                # 切换浮动 pane 可见性
zellij action show-floating-panes                  # 显示浮动 pane
zellij action hide-floating-panes                 # 隐藏浮动 pane
zellij action change-floating-pane-coordinates --pane-id terminal_1 --x 10 --y 10 --width 20 --height 20
```

### 堆叠 Pane

```bash
zellij action new-pane --stacked                  # 新建堆叠 pane
zellij action stack-panes -- terminal_1 plugin_1 terminal_2  # 手动堆叠
```

## 场景套路

### 项目多任务流

```bash
# 起手：创建一个项目 session
zellij -s myproject -l compact

# Ctrl+t -> n  新建项目 tab
# Ctrl+p -> d  拆分为编辑区和命令区
# Ctrl+p -> r  继续拆分

# 各司其职
# - 左侧：编辑器 (vim)
# - 右上方：cargo check
# - 右下方：测试输出
```

### 临时监控任务

```bash
# Ctrl+o -> w  打开 session manager
# 新建一个 "monitor" tab

# Ctrl+p -> n   新建 pane
# Alt+n         新建浮动 pane 运行 htop

# Ctrl+s -> e  编辑 scrollback 保存重要日志
```

### Session 持久化恢复

```bash
# 确保配置开启 session serialization
# 在 config.kdl 中：
# session_serialization true

# 工作完毕后
# Ctrl+o -> r  重命名 session 为 "debug-2024"
# Ctrl+q  退出

# 下次回来
zellij -l welcome
# 选择 "debug-2024" 按 Enter 恢复
```

### 自动化脚本场景

```bash
#!/bin/bash
SESSION="build-pipeline"
zellij attach --create-background "$SESSION"

# 运行构建（阻塞直到成功）
BUILD_PANE=$(zellij --session "$SESSION" action new-pane --block-until-exit-success --name "build" -- cargo build --release)

# 等待并获取结果
zellij --session "$SESSION" action dump-screen --pane-id "$BUILD_PANE" --full
```

### Tmux 用户迁移

```bash
# 先用 Ctrl+b 兼容模式保持手感
# 核心映射：
Ctrl+b -> d      # detach (同 tmux)
Ctrl+b -> "      # split down
Ctrl+b -> %      # split right
Ctrl+b -> z      # fullscreen
Ctrl+b -> c      # new tab
Ctrl+b -> Space  # cycle layouts

# 熟练后逐步迁移到原生模式：
# Ctrl+p -> d/r  替代 Ctrl+b -> "/%
# Alt+n           替代 Ctrl+b -> c 新建 pane
```

## 快捷命令别名

安装 shell 补全后可使用别名：

```bash
zr tail -f /path/to/log    # 新 pane 跟踪文件
zrf htop                    # 浮动 pane 运行 htop
ze ./main.rs               # 编辑器打开文件
```

生成补全：

```bash
zellij setup --generate-completion fish >> ~/.config/fish/config.fish
zellij setup --generate-completion bash >> ~/.bashrc
zellij setup --generate-completion zsh >> ~/.zshrc
```

## 配置速查

### 常用配置项 (config.kdl)

```kdl
default_mode "normal"
default_layout "compact"
pane_frames true
mouse_mode true
session_serialization true
simplified_ui false
```

### 启动选项

```bash
zellij options --theme dracula           # 设置主题
zellij options --mouse-mode true         # 启用鼠标
zellij options --pane-frames false       # 隐藏 pane 边框
zellij options --default-shell bash      # 默认 shell
zellij options --default-layout compact   # 默认布局
zellij options --scroll-buffer-size 10000 # scrollback 大小
zellij options --copy-clipboard system   # 剪贴板目标
zellij options --copy-on-select true     # 选择即复制
```

## 结构与概念

```text
Session  = 一整组可恢复的工作状态
Tab      = 一个工作面板 / 任务分组
Pane     = 终端窗口里的最小运行单元
Floating = 临时浮窗（可隐藏/显示）
Layout   = pane 的预设组织方式
Plugin   = tab bar / status bar / session manager 等扩展
```

## 快速记忆

```bash
# 模式切换
Ctrl+g   # 锁定 / 解锁
Ctrl+p   # pane 模式
Ctrl+t   # tab 模式
Ctrl+n   # resize 模式
Ctrl+s   # scroll/search 模式
Ctrl+o   # session 模式
Ctrl+h   # move 模式
Ctrl+q   # quit 退出

# 核心操作
Alt+n    # 新建 pane
Alt+f    # 浮动 pane
zellij action new-tab     # 新建 tab
zellij action detach      # 分离 session
```
