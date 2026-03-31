---
title: Oh My Bash 速查
lang: bash
version: 05e6d038
date: 2026-03-01
github: ohmybash/oh-my-bash
colWidth: 420px
---

# Oh My Bash 速查

## 定位与价值
---
emoji: 🧠
link: https://github.com/ohmybash/oh-my-bash#oh-my-bash
desc: 先把它当成 Bash 的配置层来看：它负责把主题、插件、别名、补全和自定义目录统一接管，适合在 Git Bash 里做增强。
---

- `oh-my-bash` : Bash 配置框架，不是 Bash 本体
- `主题 / 插件 / 别名 / 补全 / 自定义` : 收拢到一套可迁移的入口里
- `~/.bashrc` / `~/.bash_profile` : 安装后会接管 Bash 的加载链，Windows 的 Git Bash 还要关注这两个入口
- `dotfiles 管理` : 适合想要更清晰的提示符、更少的重复输入、以及更统一配置的人
- `激活成功` : 最直观的变化就是主题、别名和补全开始生效

```bash
# 先找入口，再谈功能
echo "$OSH"
echo "$OSH_THEME"
```

## 快速定位
---
emoji: 🧭
link: https://github.com/ohmybash/oh-my-bash
desc: Oh My Bash 是 Bash 配置框架，核心就是主题、插件、别名、补全和更新。先记住它主要靠 `~/.bashrc` 驱动。
---

- `OSH` : Oh My Bash 安装目录，默认是 `~/.oh-my-bash`
- `OSH_THEME` : 当前主题名，默认模板是 `font`
- `plugins` : 需要加载的插件数组
- `aliases` : 需要加载的别名包数组
- `completions` : 需要加载的补全数组
- `source "$OSH"/oh-my-bash.sh` : 真正启动 Oh My Bash 的入口
- `upgrade_oh_my_bash` : 手动更新
- `uninstall_oh_my_bash` : 卸载并回退配置

```bash
echo "$OSH"
echo "$OSH_THEME"
type upgrade_oh_my_bash
type uninstall_oh_my_bash
```

## 安装
---
emoji: 📦
link: https://github.com/ohmybash/oh-my-bash#basic-installation
desc: 安装只需一行命令，脚本会自动备份原有 `.bashrc` 并写入新配置。安装前确认已有 `bash`、`git`、`curl` 或 `wget`。
---

- `bash -c "$(curl -fsSL ...)"` : 通过 curl 安装（推荐）
- `bash -c "$(wget -qO- ...)"` : 无 curl 时用 wget 替代
- `~/.bashrc.omb-backup-*` : 安装时自动备份的原始配置
- `OSH_THEME` : 安装后在 `~/.bashrc` 里改这一行就可以换主题
- 离线安装 : 先 `git clone` 仓库，再手动追加 `source` 入口

```bash
# curl 安装
bash -c "$(curl -fsSL https://raw.githubusercontent.com/ohmybash/oh-my-bash/master/tools/install.sh)"

# wget 安装
bash -c "$(wget -qO- https://raw.githubusercontent.com/ohmybash/oh-my-bash/master/tools/install.sh)"

# 离线 / 指定目录安装
OSH=~/.oh-my-bash git clone https://github.com/ohmybash/oh-my-bash.git "$OSH"
# 然后手动在 ~/.bashrc 追加：
# export OSH="$HOME/.oh-my-bash"
# source "$OSH/oh-my-bash.sh"
```

## Windows / Git Bash 起手
---
emoji: 🪟
link: https://github.com/ohmybash/oh-my-bash#basic-installation
desc: 在 Windows 上，最稳的用法是把 Git Bash 当成 Bash 环境来处理：改 `~/.bashrc`，确保 `~/.bash_profile` 会再转到它。
---

- Git Bash 里主要看 `~/.bashrc` 和 `~/.bash_profile`
- 如果 `~/.bash_profile` 已存在，记得让它执行 `source ~/.bashrc`
- Windows 路径写成 `/c/Users/<name>/...`，不要写成 `C:\...`
- 打开配置可以直接用 `notepad.exe ~/.bashrc` 或 `code ~/.bashrc`
- 如果主题符号乱码，先换终端字体，再判断是不是主题不兼容
- 推荐终端 : Windows Terminal + Git Bash profile，比默认 mintty 更稳

```bash
# ~/.bash_profile
if [[ -f ~/.bashrc ]]; then
  source ~/.bashrc
fi
```

```bash
# Windows 路径和 Unix 路径互转
cygpath -u 'C:\Users\me\Downloads'
cygpath -w '/c/Users/me/.oh-my-bash'
```

## 安装后验证 / 激活检查
---
emoji: ✅
link: https://github.com/ohmybash/oh-my-bash#basic-installation
desc: 安装后不要先看目录，先看加载链。只要主题变量、更新命令和启动文件链都能读出来，基本就算激活成功。
---

- `test -d ~/.oh-my-bash` : 目录存在，说明文件已落地
- `echo "$OSH"` : 应该输出安装目录
- `echo "$OSH_THEME"` : 当前主题变量已读入
- `type upgrade_oh_my_bash` : 更新命令可用，说明框架脚本已加载
- `type uninstall_oh_my_bash` : 卸载命令可用，说明脚本已注入当前 shell
- `declare -p plugins aliases completions 2>/dev/null` : 检查常用数组是否已读入
- `grep -nE 'source ~/.bashrc|\\. ~/.bashrc' ~/.bash_profile ~/.bashrc 2>/dev/null` : Git Bash 的启动链检查
- `exec bash` : 重启当前 shell 再看一次最终效果

```bash
# 基本验证
test -d ~/.oh-my-bash && echo "installed"
echo "$OSH"
echo "$OSH_THEME"
type upgrade_oh_my_bash
type uninstall_oh_my_bash

# Git Bash 启动链
grep -nE 'source ~/.bashrc|\. ~/.bashrc' ~/.bash_profile ~/.bashrc 2>/dev/null

# 重新加载后再确认
source ~/.bashrc
```

## 最小工作流
---
emoji: 🚀
link: https://github.com/ohmybash/oh-my-bash#using-oh-my-bash
desc: 第一次接手一台机器时，不要先改很多模块，先确认加载链、主题和一个插件能不能正常工作。
---

1. 打开 Git Bash。
2. 检查 `~/.bashrc` 是否已加载 Oh My Bash。
3. 只改最少的 `OSH_THEME`、`plugins`、`aliases`。
4. 重新打开终端或执行 `source ~/.bashrc`。
5. 再验证 `upgrade_oh_my_bash`、`alias`、`type` 是否可用。

```bash
source ~/.bashrc
alias
declare -p OSH_THEME plugins aliases completions 2>/dev/null
```

## 主题切换
---
emoji: 🎨
link: https://github.com/ohmybash/oh-my-bash#themes
desc: 主题是最容易立刻看到效果的部分。Windows 下优先选稳定主题，追求花哨前先确认字体支持。
---

- `OSH_THEME="font"` : 默认主题，最稳
- `OSH_THEME="random"` : 每次随机一个主题
- `OMB_THEME_RANDOM_CANDIDATES=(...)` : 只从指定列表里随机
- `OMB_THEME_RANDOM_IGNORED=(...)` : 排除不想要的主题
- `OMB_THEME_RANDOM_SELECTED` : 当前随机到的主题名
- `agnoster` : 常见漂亮主题，但通常需要 Powerline / Nerd Font
- 查看所有内置主题 : `ls "$OSH/themes"`
- 预览主题效果 : 直接 `OSH_THEME=xxx source ~/.bashrc`，不用重开终端

```bash
# 主题切换：稳妥起步
OSH_THEME="font"

# 主题切换：随机，但限制候选
OSH_THEME="random"
OMB_THEME_RANDOM_CANDIDATES=("font" "powerline-light" "minimal")
OMB_THEME_RANDOM_IGNORED=("powerbash10k" "wanelo")
```

```bash
# 快速预览所有主题（循环切换，每次回车换下一个）
for theme in "$OSH"/themes/*/; do
  t=$(basename "$t")
  echo ">>> $t"
  OSH_THEME="$t" source ~/.bashrc
  read -r
done
```

## 插件 / 别名 / 补全
---
emoji: 🧩
link: https://github.com/ohmybash/oh-my-bash#plugins
desc: 这三类东西决定你日常是否顺手。顺序建议是先补全，再插件，最后别名，避免一口气加载太多拖慢启动。
---

- `completions=(git composer ssh)` : 按需加载补全
- `aliases=(general)` : 加载别名包
- `plugins=(git bashmarks)` : 加载插件包
- `custom/completions/` : 自定义补全目录
- `custom/aliases/` : 自定义别名目录
- `custom/plugins/` : 自定义插件目录
- `custom/themes/` : 自定义主题目录
- 查看所有内置插件 : `ls "$OSH/plugins"`
- 查看所有内置别名包 : `ls "$OSH/aliases"`
- 查看所有内置补全包 : `ls "$OSH/completions"`

```bash
# 典型配置
completions=(
  git
  composer
  ssh
)

aliases=(
  general
)

plugins=(
  git
  bashmarks
)
```

```bash
# 条件加载：只在 SSH 会话里启用某个插件
[ "$SSH_TTY" ] && plugins+=(tmux-autoattach)

# 查看某个别名包里定义了哪些别名
cat "$OSH/aliases/general.aliases.sh"

# 查看某个插件提供了什么函数
grep -E '^function |^[a-z_]+\(\)' "$OSH/plugins/git/git.plugin.sh"
```

## 常用内置别名（general）
---
emoji: ✂️
link: https://github.com/ohmybash/oh-my-bash/blob/master/aliases/general.aliases.sh
desc: `aliases=(general)` 是最常用的别名包，涵盖导航、列目录、权限、进程等日常操作。了解它能避免重复定义。
---

- `..` / `...` / `....` : 向上跳 1 / 2 / 3 层目录
- `ll` : `ls -lh`
- `la` : `ls -lAh`
- `lx` : 按扩展名排序列目录
- `lk` : 按文件大小排序
- `lt` : 按修改时间排序
- `md` : `mkdir -p`
- `rd` : `rmdir`
- `please` : `sudo`（复用上一条命令时加 sudo）
- `h` : `history`
- `j` : `jobs -l`

```bash
# 这些是 general 别名包给你的，不用自己写
..        # cd ..
...       # cd ../..
ll        # ls -lh
la        # ls -lAh
md foo    # mkdir -p foo
please    # sudo !!
h | grep ssh
```

## 常用内置别名（git）
---
emoji: 🌿
link: https://github.com/ohmybash/oh-my-bash/blob/master/aliases/general.aliases.sh
desc: `aliases=(general)` 里也包含 Git 简写；如果还加载了 `plugins=(git)`，会有更多函数可用。高频操作可以节省大量键入。
---

- `g` : `git`
- `ga` : `git add`
- `gaa` : `git add --all`
- `gc` : `git commit`
- `gcm` : `git commit -m`
- `gco` : `git checkout`
- `gcb` : `git checkout -b`
- `gd` : `git diff`
- `gds` : `git diff --staged`
- `gl` : `git pull`
- `gp` : `git push`
- `gst` : `git status`
- `glg` : `git log --oneline --graph --decorate`

```bash
# 日常 git 流程极简版
gaa
gcm "fix: typo"
gp
```

## 提示符变量（Prompt）
---
emoji: 💬
link: https://github.com/ohmybash/oh-my-bash/wiki/Prompt-variables
desc: Oh My Bash 主题通过一组 `OMB_PROMPT_*` 变量控制提示符内容的显示与隐藏，改这些变量比直接改主题文件更安全。
---

- `OMB_PROMPT_SHOW_PYTHON_VENV=true` : 显示 Python 虚拟环境名
- `OMB_PROMPT_SHOW_SPACK_ENV=true` : 显示 Spack 环境名
- `OMB_PROMPT_SHOW_RUBY_GEMSET=true` : 显示 RVM gemset（部分主题支持）
- `OMB_PROMPT_SHOW_NVM_VERSION=true` : 显示 Node 版本（部分主题支持）
- `OMB_PROMPT_SHOW_AWS_VAULT=true` : 显示 aws-vault profile（部分主题支持）
- `OMB_USE_SUDO=true` : 允许 Oh My Bash 内部命令在需要时使用 sudo
- `OMB_TERM_USE_TPUT=true` : 用 tput 代替转义序列初始化颜色，可降低开销

```bash
# 在 ~/.bashrc 里，放在 source oh-my-bash.sh 之前生效
export OMB_PROMPT_SHOW_PYTHON_VENV=true
export OMB_PROMPT_SHOW_SPACK_ENV=false
export OMB_TERM_USE_TPUT=true
```

## 自定义与覆盖
---
emoji: 🛠️
link: https://github.com/ohmybash/oh-my-bash#customization-of--plugins-and-themes
desc: 真正适合长期用的做法，是把个性化内容放进 `custom/`，而不是直接改上游模块。这样升级时冲突最少。
---

- `OSH_CUSTOM` : 自定义目录根路径
- 同名模块优先 : `custom/` 里的同名文件会覆盖内置模块
- `theme/plugin/alias/completion` : 都可以按同样思路覆盖
- 先复制再改 : 适合想保留上游更新能力的场景
- `custom/` 里可以直接放 `.sh` 文件 : 会被自动 source，适合放全局函数和环境变量

```bash
# 自定义目录放到 dotfiles 里
export OSH_CUSTOM="$HOME/.dotfiles/oh-my-bash-custom"

# 覆盖主题
mkdir -p "$OSH_CUSTOM/themes"
cp -r "$OSH/themes/agnoster" "$OSH_CUSTOM/themes/"

# 新建全局自定义脚本（会被自动 source）
cat > "$OSH_CUSTOM/my-exports.sh" << 'EOF'
export EDITOR=vim
export HISTSIZE=50000
export HISTFILESIZE=100000
EOF
```

```text
$OSH_CUSTOM/
├─ themes/
├─ plugins/
├─ aliases/
├─ completions/
└─ my-exports.sh   ← 任意 .sh 文件都会被自动加载
```

## 更新 / 卸载 / 迁移
---
emoji: 🔄
link: https://github.com/ohmybash/oh-my-bash#getting-updates
desc: 更新和卸载都不复杂，关键是先确认你有没有把本地改动放在 `custom/`，否则升级时容易被覆盖。
---

- `upgrade_oh_my_bash` : 手动更新到最新提交
- `DISABLE_UPDATE_PROMPT=true` : 关闭升级提示
- `DISABLE_AUTO_UPDATE=true` : 关闭自动更新检查
- `UPDATE_OSH_DAYS=13` : 调整检查间隔（天数）
- `uninstall_oh_my_bash` : 回滚并删除安装
- 迁移到新机器 : 只需复制 `~/.bashrc` 和 `$OSH_CUSTOM` 目录，再重新安装框架本体

```bash
# 手动更新
upgrade_oh_my_bash

# 关闭自动检查
DISABLE_AUTO_UPDATE=true

# 迁移：打包自定义配置
tar czf omb-custom.tar.gz ~/.bashrc "$OSH_CUSTOM"
```

## 性能调优
---
emoji: ⚡
link: https://github.com/ohmybash/oh-my-bash/wiki/Performance
desc: 启动慢几乎都是插件和补全太多导致的。先用 `time` 或 `bash -i -c exit` 测基线，再逐步排除。
---

- `time bash -i -c exit` : 测量 Bash 启动耗时，基线应在 200ms 以内
- `DISABLE_AUTO_UPDATE=true` : 更新检查会在后台加一次网络请求
- 少加补全 : `completions` 是最常见的启动杀手，只留必要的
- `OMB_TERM_USE_TPUT=true` : 降低终端颜色初始化成本
- 避免在插件里执行外部命令 : `$(git status)` 每次刷新提示符都会 fork 一个进程
- 关闭 dirty 检查 : 大仓库里 git dirty 状态检测极慢，主题通常有开关变量

```bash
# 测基线
time bash -i -c exit

# 二分法定位慢在哪一段
# 注释掉一半 plugins，再测；缩小范围直到找到元凶
time bash -i -c exit

# 关闭 git dirty 检测（以 powerline 主题为例）
OMB_THEME_POWERLINE_DISABLE_GIT_STATUS=true
```

## 常见坑
---
emoji: ⚠️
link: https://github.com/ohmybash/oh-my-bash#installation-problems
desc: 大多数问题都不是"框架坏了"，而是启动文件链、字体、路径和模块选择出了问题。
---

- `~/.bash_profile` 没有 source `~/.bashrc` : Git Bash 里最常见
- 主题乱码 : 先换字体（推荐 Nerd Font / Cascadia Code PL），再换主题
- 启动慢 : 少加载插件和补全，用 `time bash -i -c exit` 定位
- 找不到命令 : 检查 `PATH` 是否被你自己的 `.bashrc` 改坏
- 仓库状态太慢 : 关闭过重的 dirty 检查
- `OSH_CUSTOM` 里的 `.sh` 没被加载 : 文件名里不能有空格，扩展名必须是 `.sh`
- 升级后主题样式变了 : 检查是否直接改了 `$OSH/themes/` 下的文件，改动被覆盖了
- 多个 Bash 版本冲突 : `echo "$BASH_VERSION"` 确认当前用的是哪个
- `complete` 补全没生效 : 检查 `completions` 数组是否写在 `source oh-my-bash.sh` 之前

```bash
# 排查顺序
echo "$0"
echo "$BASH_VERSION"
echo "$OSH"
echo "$OSH_THEME"
echo "$OSH_CUSTOM"
source ~/.bashrc
```

## Quick Ref
---
emoji: 📌
link: https://github.com/ohmybash/oh-my-bash
desc: 适合日常查阅的高频项汇总，先看这一张就能大致判断该改哪一段。
---

| 项 | 作用 |
| --- | --- |
| `OSH_THEME` | 切换主题 |
| `plugins` | 启用插件 |
| `aliases` | 启用别名包 |
| `completions` | 启用补全包 |
| `OSH_CUSTOM` | 覆盖内置模块 |
| `DISABLE_AUTO_UPDATE` | 关闭自动更新 |
| `DISABLE_UPDATE_PROMPT` | 关闭更新提示 |
| `UPDATE_OSH_DAYS` | 更新检查间隔（天） |
| `OMB_USE_SUDO` | 控制内部是否使用 sudo |
| `OMB_PROMPT_SHOW_PYTHON_VENV` | 显示/隐藏 Python 虚拟环境 |
| `OMB_PROMPT_SHOW_SPACK_ENV` | 显示/隐藏 Spack 环境 |
| `OMB_TERM_USE_TPUT` | 降低终端颜色初始化成本 |
| `OMB_THEME_RANDOM_CANDIDATES` | 随机主题候选列表 |
| `OMB_THEME_RANDOM_IGNORED` | 随机主题排除列表 |
| `OMB_THEME_RANDOM_SELECTED` | 当前随机到的主题名 |
| `upgrade_oh_my_bash` | 手动更新框架 |
| `uninstall_oh_my_bash` | 卸载并回退配置 |
