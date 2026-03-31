---
title: Oh My Zsh 速查
lang: bash
version: unknown
date: "2026-03-31"
github: ohmyzsh/ohmyzsh
colWidth: 360px
---

# Oh My Zsh / OMZ

## 一眼入口
---
emoji: 🚀
link: https://ohmyz.sh/
desc: OMZ 是 Zsh 配置框架，不是 Zsh 本体。先装 Zsh，再装 OMZ；Windows 只能走 WSL 或 Cygwin。Git Bash 可以作为 Windows 终端入口，但不能单独承载 OMZ。
---
- `zsh --version` 先确认 Zsh 是否已安装
- `echo $SHELL` 先确认默认 shell 是否已经切到 Zsh
- `curl` / `wget` 都是官方最短安装链
- `omz update` / `omz reload` 是日常维护入口
- `ZSH_THEME` / `plugins` / `ZSH_CUSTOM` 是最常改的三个点

```bash
# 官方安装：curl 或 wget 二选一
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

### Windows / Git Bash 说明
- Git for Windows 提供的是 Git Bash，也就是 BASH emulation
- OMZ 依赖 Zsh，所以 Git Bash 不能直接当作 OMZ 的运行环境
- 官方对 Windows 的建议是 `WSL` 或 `Cygwin`
- 如果你只是想保留 Git Bash 作为终端外壳，可以先安装 [Git for Windows](https://gitforwindows.org/)

## 各平台安装 Zsh
---
emoji: 🧩
link: https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH
desc: 先把 Zsh 装好，再把它设成默认 shell。OMZ 只是围绕 Zsh 的配置框架。
---

### macOS
```bash
# 先确认系统是否已经带了 Zsh
zsh --version

# 通过 Homebrew 安装
brew install zsh

# 切换默认 shell
chsh -s "$(which zsh)"
```

### Ubuntu / Debian / WSL
```bash
sudo apt install zsh
chsh -s "$(which zsh)"
```

### Fedora / RHEL
```bash
sudo dnf install zsh

chsh -s "$(which zsh)"
```

### Arch / Manjaro
```bash
sudo pacman -S zsh
chsh -s "$(which zsh)"
```

### openSUSE
```bash
sudo zypper install zsh
```

### FreeBSD / OpenBSD / Alpine / Void / MSYS2 / Termux
```bash
# FreeBSD
sudo pkg install zsh

# OpenBSD
pkg_add zsh

# Alpine
apk add zsh

# Void
xbps-install zsh

# MSYS2
pacman -S zsh

# Termux
pkg install zsh
```

## 最小配置
---
emoji: ⚙️
link: https://github.com/ohmyzsh/ohmyzsh/wiki/Customization
desc: 真正高频的是 `.zshrc` 里的四个变量：ZSH、ZSH_THEME、plugins、ZSH_CUSTOM。
---

```bash
# ~/.zshrc
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)
source "$ZSH/oh-my-zsh.sh"
```

- `ZSH_THEME=""` 可以关闭主题
- `ZSH_THEME="random"` 每次随机一个主题
- `plugins` 里的元素用空格分隔，不要写逗号
- `ZSH_CUSTOM` 默认指向 `custom/`，自定义内容优先级最高

## 高频玩法
---
emoji: 🛠️
link: https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins
desc: 这部分按“最常改什么”来排，而不是按文档目录平铺。
---

### 开关主题
```bash
# 默认主题
ZSH_THEME="robbyrussell"

# 关闭主题
ZSH_THEME=""

# 随机主题
ZSH_THEME="random"
```

### 开启插件
```bash
# 插件名直接写进数组
plugins=(rails git ruby)
```

### 加一个自定义插件
```bash
# ~/.zshrc
plugins=(git foobar)

# 文件树
# $ZSH_CUSTOM/plugins/foobar/foobar.plugin.zsh
```

### 自定义主题
```bash
# 文件树
# $ZSH_CUSTOM/themes/my_awesome_theme.zsh-theme

ZSH_THEME="my_awesome_theme"
```

### 覆盖内置内容
```bash
# 自定义函数或变量放到这里
# $ZSH_CUSTOM/my_patches.zsh
```

## 更新与维护
---
emoji: 🔄
link: https://github.com/ohmyzsh/ohmyzsh/wiki/FAQ
desc: 更新、重载、卸载都很短，关键是别把“改配置”和“重启 shell”混成一件事。
---

```bash
# 手动更新
omz update

# 重载当前 zsh 会话
omz reload

# 或者直接重开一个 zsh
exec zsh

# 卸载
uninstall_oh_my_zsh
```

- 自动化脚本里也可以直接跑 `"$ZSH/tools/upgrade.sh"`
- 如果更新前后 completion 异常，优先重置缓存

## 排障速记
---
emoji: 🧯
link: https://github.com/ohmyzsh/ohmyzsh/wiki/FAQ
desc: 先看安装前提，再看字体和 completion 缓存，最后才怀疑 OMZ 本身。
---

### 安装器超时
```bash
# 官方镜像
sh -c "$(curl -fsSL https://install.ohmyz.sh)"
```

### 符号乱码 / 提示符异常
- 先装 Nerd Font 或 Powerline Font
- 很多主题需要这些字体才能正常显示特殊符号

### 补全缓存出问题
```bash
# 删除补全缓存
rm "$ZSH_COMPDUMP"

# 重开 zsh
exec zsh
```

### Windows 直接装不上
- 这是预期行为，不是安装器坏了
- 先选 `WSL` 或 `Cygwin`，再在里面装 Zsh 和 OMZ
