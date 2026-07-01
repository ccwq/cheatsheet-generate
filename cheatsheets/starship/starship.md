---
title: Starship 提示符配置速查表
lang: zh-CN
version: "1.26.0"
date: "2026-07-01"
github: starship/starship
colWidth: 420px
desc: Starship 跨 shell 提示符的 cookbook + cheatsheet 速查：先给最短上手，再覆盖配置文件、常用模块、快捷模板和常见坑。
tags:
  - CLI 工具
  - CLI / Terminal
  - 开发
  - Rust
  - 命令行
---

# Starship 提示符配置速查表

## 快速定位
> 这是一个什么：跨 shell、跨系统的极速提示符，重点是“配置一份 `starship.toml`，各个 shell 统一用”。
> 先从哪开始：先把 shell init 接上，再改 `format`、`character`、`directory`、`git_branch`、`git_status` 这几个最常看的模块。

| 目标 | 最短入口 | 说明 |
|---|---|---|
| 安装 | `curl -sS https://starship.rs/install.sh | sh` | Linux / macOS 常用 |
| Bash 接入 | `eval "$(starship init bash)"` | 写进 `~/.bashrc` |
| Zsh 接入 | `eval "$(starship init zsh)"` | 写进 `~/.zshrc` |
| Fish 接入 | `starship init fish | source` | 写进 `~/.config/fish/config.fish` |
| PowerShell 接入 | `Invoke-Expression (&starship init powershell)` | 写进 `$PROFILE` |
| 查看配置 | `~/.config/starship.toml` | 默认配置文件 |
| 改配置路径 | `STARSHIP_CONFIG=...` | 适合多配置切换 |

## 一句话架构
- Starship 的本质不是“主题包”，而是一个**按模块拼装的提示符渲染器**。
- 你要控制的核心只有三层：**全局格式**、**模块显示规则**、**模块样式**。
- 最常见的提效方式不是堆模块，而是把没用的模块关掉，把高频模块放到最顺手的位置。

## 最短上手流
```bash
# 1) 安装
curl -sS https://starship.rs/install.sh | sh

# 2) 任选 shell 初始化（以 bash 为例）
echo 'eval "$(starship init bash)"' >> ~/.bashrc
source ~/.bashrc

# 3) 创建配置
mkdir -p ~/.config && touch ~/.config/starship.toml
```

### 最小可用配置
```toml
# ~/.config/starship.toml
"$schema" = 'https://starship.rs/config-schema.json'
add_newline = false
scan_timeout = 20
command_timeout = 800
format = '$directory$git_branch$git_status$line_break$character'
right_format = '$time'

[character]
success_symbol = '[➜](bold green)'
error_symbol = '[➜](bold red)'
vimcmd_symbol = '[❮](bold purple)'

[directory]
truncation_length = 3
truncate_to_repo = true
```

## 配置文件基础
### 路径与切换
- 默认配置文件：`~/.config/starship.toml`
- 自定义路径：`STARSHIP_CONFIG=/path/to/starship.toml`
- 改完配置后，通常需要**重新加载 shell** 或直接新开一个终端窗口

### 最常调的全局项
| 项 | 默认值 | 适合怎么改 |
|---|---|---|
| `format` | 见文档 | 规定左侧提示符的模块顺序 |
| `right_format` | 空 | 把时间、耗时、状态放右侧 |
| `add_newline` | `true` | 想更紧凑就设 `false` |
| `scan_timeout` | `30` | 目录扫描太慢时可适当调大 |
| `command_timeout` | `500` | 模块命令执行超时，慢盘 / 慢仓库可调大 |
| `palette` | 空 | 给自定义颜色名指定调色板 |
| `follow_symlinks` | `true` | 网络盘 / 链接目录场景可考虑关掉 |

### format 的理解
- `format` 是整条提示符的骨架。
- 想保留默认模块时，可以用 `$all`。
- 想把目录放第二行，可以把 `line_break` 插进去。

```toml
format = '$all$line_break$character'
# 或者更克制一点
format = '$directory$git_branch$git_status$line_break$character'
```

## 高频模块速查
### 1. character：最后那个提示符
```toml
[character]
success_symbol = '[➜](bold green)'
error_symbol = '[✗](bold red)'
vimcmd_symbol = '[❮](bold purple)'
```
- 这是你最容易感知到的“最后一笔”。
- 颜色最好能一眼区分成功 / 失败 / vim 模式。

### 2. directory：当前目录
```toml
[directory]
truncation_length = 3
truncate_to_repo = true
style = 'bold cyan'
read_only = ' 🔒'
```
- 常用来控制路径长度，避免 prompt 太长。
- `truncate_to_repo = true` 很适合进仓库后只看 repo 内相对路径。

### 3. git_branch / git_status：仓库状态
```toml
[git_branch]
symbol = ' '
format = '[$symbol$branch]($style) '
style = 'bold purple'

[git_status]
format = '([$all_status$ahead_behind]($style) )'
style = 'bold yellow'
```
- `git_branch` 负责“你在哪个分支”。
- `git_status` 负责“干净不干净、有没有 ahead/behind”。
- 仓库工作流里，这两个通常是最值得保留的模块。

### 4. cmd_duration：慢命令耗时
```toml
[cmd_duration]
min_time = 2_000
show_milliseconds = false
format = 'took [$duration]($style) '
style = 'bold yellow'
```
- 适合在你只关心“这个命令有没有拖慢”时打开。
- 太短的命令不必刷屏。

### 5. package / nodejs / python / rust：语言与项目识别
```toml
[package]
disabled = true

[nodejs]
format = 'via [Node.js $version](bold green) '

[python]
format = 'via [Python $version( \($virtualenv\))](yellow bold) '
pyenv_version_name = true

[rust]
format = 'via [Rust $version](bold red) '
```
- `package` 在很多仓库里容易显得噪音大，常见做法是直接关掉。
- `python` / `rust` / `nodejs` 更适合在项目根目录显示版本。
- Python 虚拟环境激活时，Starship 能把虚拟环境名一起带出来。

### 6. hostname / username / shell：远程与环境提示
```toml
[hostname]
ssh_only = true
format = '[$hostname](bold green) '

[username]
disabled = false
show_always = false

[shell]
disabled = false
format = '[$indicator]($style) '
```
- `hostname` 常用于 SSH 场景，避免本地 prompt 太长。
- `shell` 可用来标识当前 shell，但默认是关闭的。

### 7. time / status / jobs：右侧信息更适合放这里
```toml
[time]
disabled = false
format = '[$time]($style) '
style = 'dimmed white'

[status]
disabled = false
format = '[$symbol$status]($style) '

[jobs]
number_threshold = 1
symbol_threshold = 1
```
- `time` 很适合放 `right_format`。
- `status` 适合失败态提示，但别把它变成信息噪音源。
- `jobs` 适合后台任务很多的人。

## 常用 prompt 模板
### 模板 A：最清爽的开发 prompt
```toml
add_newline = false
format = '$directory$git_branch$git_status$line_break$character'

[package]
disabled = true
[python]
disabled = true
[rust]
disabled = true
[nodejs]
disabled = true
```
适合：只想看目录、分支、状态，不想被语言版本打扰。

### 模板 B：项目型工作台
```toml
format = '$directory$git_branch$git_status$line_break$cmd_duration$character'
right_format = '$time'

[cmd_duration]
min_time = 1_500
```
适合：写代码、跑测试、看耗时，右侧补时间。

### 模板 C：SSH / 运维场景
```toml
format = '$username$hostname$directory$git_branch$line_break$character'

[hostname]
ssh_only = true

[time]
disabled = false
```
适合：远程服务器上工作，先看是谁、在哪台机器上。

## 高级一点但仍常用的调整
### 让 prompt 更短
- 调小 `directory.truncation_length`
- 关闭不常看的语言模块
- 把耗时、时间、状态挪到 `right_format`
- 用 `line_break` 把信息分层

### 让 prompt 更稳
- 确认终端里装了 **Nerd Font**，否则图标可能变方块
- 目录慢时调大 `scan_timeout`
- 慢命令多时调大 `command_timeout`
- 网络盘或链接目录多时，必要时考虑 `follow_symlinks = false`

### 让 prompt 更像“工作台”而不是“装饰品”
- 保留：`directory`、`git_branch`、`git_status`、`character`
- 选择性保留：`cmd_duration`、`time`、`status`
- 默认关闭：`package`、`shell`、`hostname`（除非你真会看）

## 常见坑
1. **图标变方块**：终端没开 Nerd Font。
2. **改了配置没变化**：shell 没重新加载，或者改错了 `STARSHIP_CONFIG`。
3. **提示符太长**：没裁短 `directory`，或者模块开太多。
4. **模块不显示**：Starship 依赖文件/目录触发条件，先确认项目根目录是否真的有对应标记文件。
5. **开机就卡**：通常是 `scan_timeout` / `command_timeout` / 目录很重，需要收紧模块。

## 速记版
- **先接 shell init，再改 `starship.toml`**
- **最常保留：`directory + git_branch + git_status + character`**
- **最常放右侧：`time + status + cmd_duration`**
- **最常关闭：`package`**
- **想短就裁目录，想稳就调超时，想美就先换 Nerd Font**
