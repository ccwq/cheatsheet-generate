---
title: Yazi 速查
lang: bash
version: v26.1.22
date: 2026-03-13
github: sxyazi/yazi
colWidth: 380px
---

# Yazi 速查

## 一眼入口

### 最短入口

```bash
yazi               # 启动 Yazi
y                  # 使用 shell wrapper（推荐），退出后自动 cd
q                  # 退出 Yazi
Q                  # 退出但不改变目录
F1 或 ~            # 打开帮助菜单
```

### 入口模式

| 快捷键 | 动作 |
|--------|------|
| `.` | 切换隐藏文件显示 |
| `f` | 过滤文件（实时搜索） |
| `Ctrl+u/d` | 上/下半页滚动 |
| `Ctrl+b/f` | 上/下整页滚动 |

## 安装与配置

### Linux

```bash
# Arch Linux
pacman -S yazi

# Fedora (COPR)
sudo dnf copr enable varlad/yazi
sudo dnf install yazi

# 其他发行版 - 下载二进制
tar -xvf yazi-x86_64-unknown-linux-musl.tar.gz
chmod +x yazi
sudo mv yazi /usr/local/bin/
```

### macOS

```bash
brew install yazi
```

### Windows

```bash
# Scoop
scoop install yazi

# 或下载 .exe 到 PATH
```

### cargo 安装

```bash
cargo install --locked yazi
```

### 配置文件位置

```bash
# 配置文件目录
~/.config/yazi/          # Linux/macOS
%AppData%\yazi\config\   # Windows

# 导出默认配置
yazi --dump-config

# 自定义配置目录
YAZI_CONFIG_HOME=~/.config/yazi-alt yazi
```

### Shell Wrapper（重要！）

Shell wrapper 让退出 Yazi 时自动 cd 到目录：

```bash
# Bash / Zsh
function y() {
    local tmp="$(mktemp -t "yazi-cwd.XXXXXX")"
    command yazi "$@" --cwd-file="$tmp"
    IFS= read -r -d '' cwd < "$tmp"
    [ "$cwd" != "$PWD" ] && [ -d "$cwd" ] && builtin cd -- "$cwd"
    rm -f -- "$tmp"
}
```

## 浏览和导航

### Vim 风格导航

| 快捷键 | 动作 |
|--------|------|
| `h` | 退到上级目录 |
| `j` / `↓` | 光标下移 |
| `k` / `↑` | 光标上移 |
| `l` | 进入光标所在目录 |

### 快速跳转

| 快捷键 | 动作 |
|--------|------|
| `g g` | 跳到列表顶部 |
| `G` | 跳到列表底部 |
| `H` | 回到上一个目录 |
| `L` | 前进到下一个目录 |

### 目录快速跳转

| 快捷键 | 动作 |
|--------|------|
| `~` | 跳转到 home |
| `g h` | 跳转到 home |
| `g c` | 跳转到 ~/.config |
| `g d` | 跳转到 ~/Downloads |
| `g Space` | 交互式选择目录 |
| `z` | 通过 fzf 跳转（需安装 fzf） |
| `Z` | 通过 zoxide 跳转（需安装 zoxide） |

## 选择操作

### 选择文件

| 快捷键 | 动作 |
|--------|------|
| `Space` | 切换选择当前文件 |
| `v` | 进入可视模式（追加选择） |
| `V` | 进入可视模式（替换选择） |
| `Ctrl+a` | 选择所有文件 |
| `Ctrl+r` | 反向选择所有文件 |
| `Esc` | 取消选择 |

### 复制和粘贴

| 快捷键 | 动作 |
|--------|------|
| `y` | 复制（Yank）选中的文件 |
| `x` | 剪切选中的文件 |
| `p` | 粘贴文件 |
| `P` | 粘贴（覆盖已存在的文件） |
| `Y` / `X` | 取消 yank 状态 |

### 文件操作

| 快捷键 | 动作 |
|--------|------|
| `a` | 创建文件（末尾加 `/` 创建目录） |
| `r` | 重命名选中的文件 |
| `d` | 移动到回收站 |
| `D` | 永久删除（需确认） |
| `-` | 创建符号链接（绝对路径） |
| `_` | 创建符号链接（相对路径） |
| `Ctrl+-` | 创建硬链接 |

### 复制路径

| 快捷键 | 动作 |
|--------|------|
| `c c` | 复制文件路径 |
| `c d` | 复制目录路径 |
| `c f` | 复制文件名 |
| `c n` | 复制不带扩展名的文件名 |

## 搜索和过滤

### 过滤和查找

| 快捷键 | 动作 |
|--------|------|
| `f` | 过滤文件（实时） |
| `/` | 查找下一个 |
| `?` | 查找上一个 |
| `n` | 下一个匹配 |
| `N` | 上一个匹配 |
| `Ctrl+s` | 取消搜索 |

### 搜索（需安装 fd/rg）

| 快捷键 | 动作 |
|--------|------|
| `s` | 按名称搜索（fd） |
| `S` | 按内容搜索（ripgrep） |

## 排序

| 快捷键 | 动作 |
|--------|------|
| `, m` | 按修改时间排序 |
| `, M` | 按修改时间倒序 |
| `, b` | 按创建时间排序 |
| `, B` | 按创建时间倒序 |
| `, e` | 按扩展名排序 |
| `, E` | 按扩展名倒序 |
| `, a` | 按字母排序 |
| `, A` | 按字母倒序 |
| `, n` | 按自然排序 |
| `, N` | 按自然排序倒序 |
| `, s` | 按大小排序 |
| `, S` | 按大小倒序 |
| `, r` | 随机排序 |

## 标签页

| 快捷键 | 动作 |
|--------|------|
| `t` | 创建新标签页（当前目录） |
| `1-9` | 切换到第 N 个标签 |
| `[` | 切换到上一个标签 |
| `]` | 切换到下一个标签 |
| `{` | 与上一个标签交换 |
| `}` | 与下一个标签交换 |
| `Ctrl+c` | 关闭当前标签 |

## 打开和预览

### 打开文件

| 快捷键 | 动作 |
|--------|------|
| `Enter` | 打开选中的文件 |
| `o` | 交互式选择打开方式 |
| `O` | 始终交互式选择 |
| `Tab` | 显示文件信息（spot） |

### 预览操作

| 快捷键 | 动作 |
|--------|------|
| `K` | 预览向上滚动 5 行 |
| `J` | 预览向下滚动 5 行 |
| `Ctrl+u/d` | 上/下半页滚动 |
| `Ctrl+b/f` | 上/下整页滚动 |

## Shell 和任务

| 快捷键 | 动作 |
|--------|------|
| `;` | 执行 shell 命令（交互） |
| `:` | 执行 shell 命令（阻塞直到完成） |
| `w` | 显示任务管理器 |

## 显示模式

### 行模式（Linemode）

| 快捷键 | 动作 |
|--------|------|
| `m s` | 显示文件大小 |
| `m p` | 显示权限 |
| `m b` | 显示创建时间 |
| `m m` | 显示修改时间 |
| `m o` | 显示所有者 |
| `m n` | 关闭行模式 |

## 常用配置

```bash
# yazi.toml 示例
[mgr]
show_hidden = true        # 默认显示隐藏文件

[preview]
image_delay = 0           # 预览图片延迟（高性能终端设为0）
```

## ya CLI 工具

```bash
# 插件管理
ya pkg add owner/plugin       # 安装插件
ya pkg add owner/repo:subdir  # 安装子目录插件
ya pkg delete owner/plugin    # 删除插件
ya pkg list                   # 列出已安装插件
ya pkg install                # 从 package.toml 安装所有插件
ya pkg upgrade                # 升级所有插件

# DDS 消息
ya emit cd /path             # 发送 cd 事件
```

## 进阶技巧

### 快速创建文件/目录

```bash
a filename.txt       # 创建文件
a dirname/           # 创建目录
```

### 批量重命名

按 `r` 后会打开编辑器，修改后保存批量重命名。

### 书签跳转

```bash
g Space  # 交互式选择历史目录
z        # 通过 fzf 跳转（需安装 fzf）
Z        # 通过 zoxide 跳转（需安装 zoxide）
```
