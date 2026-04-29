---
title: Xonsh 速查
lang: xonsh
version: "0.23.2"
date: 2026-04-26
github: xonsh/xonsh
colWidth: 460px
---

## 快速定位
---
lang: xonsh
emoji: 🧭
link: https://xon.sh/tutorial.html
desc: Xonsh 不是“长得像 shell 的 Python REPL”，也不是“能跑命令的 Python 脚本”。更实用的理解是：它把 Python 3 和 shell 工作流放进了同一个交互层里。
---

- `xonsh`：进入交互式 shell；语言本体是 Python 3 的超集
- 会话接口用 @ 访问；高频入口主要是 @.env、@.imp、@.lastcmd
- `$VAR`：环境变量读写；和普通 Python 变量不同
- `xontrib`：插件 / 扩展系统；用来补提示、补全、集成功能
- `~/.xonshrc`：最常见的个人配置文件
- 先记两个关键分界：
  - 想把命令结果当字符串 / 对象继续处理，用捕获语法
  - 行里名字都找不到时，xonsh 会优先把它当 subprocess 来解析

```xonsh
# 进入 xonsh
xonsh

# 看会话接口和环境
help(@)
$PATH
@.env.get("HOME")
```

## 安装
---
lang: console
emoji: 📦
link: https://xon.sh/install.html
desc: 官方当前明确建议把 xonsh 当成“终端 profile / 独立环境”来用，而不是直接顶替系统默认登录 shell。安装方式很多，但适合长期使用的并不一样。
---

| 场景 | 方式 | 命令 / 入口 | 备注 |
| --- | --- | --- | --- |
| 通用、最快上手 | `pip` / `uv` / `pipx` | `pip install 'xonsh[full]'` | 适合已有 Python 环境 |
| 独立稳定环境 | `micromamba` | 官方安装脚本 | 官方最推荐的“独立 install”路线 |
| Conda 用户 | `conda` / `mamba` | `conda install xonsh` / `mamba install xonsh` | 适合已有 conda 体系 |
| Windows 无管理员 | 官方脚本 / `xonsh-winget` 安装器 | `install_xonsh.cmd` 或下载 `.exe` | 官方文档特别说明了 Windows 更新版安装流程 |
| Linux 免安装便携 | AppImage | 下载 `xonsh-x86_64.AppImage` | 适合临时使用或便携 |
| CI / 自动化 | 容器 / GitHub Actions | `xonsh/xonsh-interactive` / `xonsh/actions@v1` | 适合流水线 |

```console
# pip / uv / pipx 路线的核心都是装同一个包
pip install 'xonsh[full]'

# 直接装最新仓库代码
pip install 'https://github.com/xonsh/xonsh/archive/main.zip#egg=xonsh[full]'

# conda / mamba
mamba install xonsh
conda install xonsh
```

```console
# Linux / macOS / WSL：官方推荐的独立环境脚本
TARGET_DIR=$HOME/.local/xonsh-env PYTHON_VER=3.11 XONSH_VER='xonsh[full]' \
  /bin/bash -c "$(curl -fsSL https://xon.sh/install/mamba-install-xonsh.sh)"

# Windows：无管理员脚本安装
curl -L -o install_xonsh.cmd https://xon.sh/install/windows_install_xonsh.cmd
install_xonsh.cmd
```

- `当前发布版本`：`0.23.2`
- `发布时间`：`2026-04-26`
- `Python 要求`：`>= 3.11`
- `默认 shell 决策`：官方不推荐直接 `chsh` 替换系统登录 shell

## 最小工作流
---
lang: xonsh
emoji: 🚀
link: https://xon.sh/xonshrc.html
desc: 第一次接手 xonsh，别先研究所有语法。先把“能启动、能改配置、能装扩展、能把命令结果继续交给 Python”这一条最小链路打通。
---

1. 安装并执行 `xonsh` 进入交互环境。
2. 运行 `xonfig web` 或 `xonfig wizard` 生成第一版配置。
3. 把常用变量、提示符和 `xontrib load ...` 固化到 `~/.xonshrc`。
4. 先掌握三件事：`$PATH`、`$()` 捕获、`aliases[...]`。
5. 再把它接进终端 profile、CI 或脚本入口。

```xonsh
# 生成或调整个人配置
xonfig web
xonfig wizard

# 临时加载扩展
xontrib list
xontrib load zoxide

# 重新开 shell 后验证
echo $XONSH_INTERACTIVE
echo $PATH
```

## Recipe：先把 shell 命令和 Python 写在一起
---
lang: xonsh
emoji: 🧩
link: https://xon.sh/tutorial.html#basics
desc: xonsh 的真正价值，不是“Python 也能执行命令”，而是命令结果、字符串处理、对象操作可以直接连起来，不用频繁切回脚本语言。
---

- 直接写 Python：表达式、循环、函数、导入模块都能用
- 直接跑命令：`echo`、`git`、`ls`、`cd` 的心智模型基本延续 shell
- 关键桥梁：
  - `@(expr)`：把 Python 表达式插进命令参数
  - `$()`：捕获命令输出
  - `@.imp`：快速访问 Python 模块

```xonsh
# 普通 Python
1 + 1
name = "xonsh".upper()

# 普通命令
echo hello
cd $HOME

# 把 Python 值插进命令
who = "snail"
echo @(who) > /tmp/@(who)

# 把命令结果喂给 Python
@.imp.json.loads($(echo '{"a": 1}'))
len($(whoami))
```

## Recipe：理解 Python mode 和 subprocess mode
---
lang: xonsh
emoji: 🔀
link: https://xon.sh/tutorial.html#python-mode-vs-subprocess-mode
desc: 这是 xonsh 最值得先搞清楚的判定规则。你可以把它类比成 JS 里同一行代码到底进解释器还是进某个 DSL：词法像，但运行语义不一样。
---

- 对“只有表达式”的一行，xonsh 会先看名字是否已存在
- 如果名字都找不到，会尝试按 subprocess 解析
- 如果 subprocess 解析失败，再退回 Python mode
- 想强制 subprocess，用 `![ ... ]`

```xonsh
# 这里会走 subprocess mode
ls -l

# 先定义变量，再看同一行变成 Python 计算
ls = 44
l = 2
ls -l

# 删除变量后，又会回到 subprocess mode
del ls
del l
ls -l

# 显式要求 subprocess
![ls -l]
```

- 实战建议：
  - 变量名别随手起成 `ls`、`cat`、`time` 这类命令名
  - 一旦你怀疑模式判断出错，先显式写 `![cmd ...]` 或把 Python 部分包进 `@(...)`

## Recipe：环境变量、PATH 和会话对象
---
lang: xonsh
emoji: 🌱
link: https://xon.sh/tutorial.html#environment-variables
desc: 这一段是 xonsh 比传统 shell 更顺手的地方。环境变量不是只能当字符串，而是可以保留 Python 类型；`PATH` 也不是一段难处理的分隔字符串。
---

- `$NAME`：读环境变量
- `$NAME = value`：设置并导出
- `del $NAME`：删除
- `${expr}`：动态拼环境变量名
- `@.env`：直接操作整个环境映射
- `PATH` / `DIRS` 结尾变量会按路径列表处理

```xonsh
# 基本读写
$GOAL = "Master the shell"
print($GOAL)
del $GOAL

# 动态取环境变量
key = "HOME"
${key}

# PATH 是可操作列表
$PATH.append("/opt/mytools/bin")
$PATH.insert(0, "$HOME/.local/bin")
print($PATH)

# 临时覆盖环境
with @.env.swap(SOMEVAR="foo"):
    echo $SOMEVAR
```

```xonsh
# 一次性给子命令加环境变量
$HELLO = "snail" xonsh -c "echo Hello $HELLO"
```

- 高价值结论：
  - `PATH` 在 xonsh 里更像 JS 里的数组，不像 bash 里的原始字符串
  - 未定义环境变量在 subprocess mode 下会变空字符串；在 Python mode 下可能抛 `KeyError`

## Recipe：捕获输出、字符串与嵌套命令
---
lang: xonsh
emoji: 📥
link: https://xon.sh/tutorial.html#captured-subprocess-with-and
desc: 真正常用的是“命令输出如何继续处理”。如果只把 xonsh 当成能跑命令的 REPL，会错过它最顺手的一半。
---

- `$()`：捕获子命令输出，常用来拿字符串结果
- `!()`：完整捕获，返回 `CommandPipeline`，失败也不自动中断
- `@()`：强制把内容按 Python 求值
- 字符串里环境变量会在 subprocess mode 下展开
- `p"..."`：路径字面量，直接返回 `pathlib.Path`

```xonsh
# 抓输出继续处理
user = $(whoami).strip()
print(user)

# 命令中嵌套 Python 表达式
echo @("my home is $HOME")

# 原始字符串 / 格式化字符串 / 路径字面量
echo r"no\\escape"
echo f"{'hello':>10}"
p"/tmp" / "file.txt"

# 失败不抛出，自己判断
if !(ls nofile):
    print("found")
else:
    print("absent")
```

- 什么时候用哪种：
  - 只想拿文本结果时，先用 $()
  - 想自己接管返回码、stdout、stderr 时，用 !()
  - 想避免字符串里的 $HOME 被展开时，包一层 @(...)

## Recipe：别名、函数别名和 `xpip`
---
lang: xonsh
emoji: 🛠️
link: https://xon.sh/tutorial.html#aliases
desc: 别名在 xonsh 里不只是字符串替换。你可以像写 Python 函数那样注册命令入口，这比 bash alias 更像“轻量命令 API”。
---

- `aliases['name'] = '...'`：字符串别名
- `aliases['name'] = ['cmd', 'arg']`：列表别名
- `@aliases.register`：注册 callable alias
- xpip 绑定到当前 xonsh 解释器环境对应的 pip
- `xcontext`：可查看当前 xonsh / Python 解释器上下文，Windows 更新时尤其有用

```xonsh
# 最基础的别名
aliases["e"] = "echo @(2 + 2)"
aliases["ll"] = ["ls", "-la"]

# 注册可调用别名
@aliases.register
def greet(args):
    print("hello,", *args)

greet world
```

```xonsh
# 更新当前 xonsh 环境里的包
xpip install --upgrade xonsh

# 看帮助和源码入口
greet?
greet??
xonfig?
```

- 经验上：
  - 需要参数拼接、条件判断、复用逻辑时，直接上 callable alias
  - 只是命令缩写时，用字符串 / 列表别名就够

## Recipe：把配置固化到 `xonshrc`
---
lang: xonsh
emoji: ⚙️
link: https://xon.sh/xonshrc.html
desc: xonsh 的长期可用性主要取决于配置边界清不清楚。先认住入口文件，再把提示符、变量、扩展和 alias 分开管理。
---

- 个人入口：
  - `~/.xonshrc`
  - `~/.config/xonsh/rc.xsh`
  - `~/.config/xonsh/rc.d/`
- 系统入口：
  - Linux / macOS：`/etc/xonsh/xonshrc`
  - Windows：`%ALLUSERSPROFILE%\\xonsh\\xonshrc`
- 命令行控制：
  - `xonsh --no-rc`
  - `xonsh --rc rc1.xsh rc2.xsh`
  - `xonsh -i script.xsh`

```xonsh
# ~/.xonshrc

# 设置提示符
$PROMPT = "{user}@{hostname}:{cwd} @ "

# 调整 PATH
$PATH.insert(0, "$HOME/.local/bin")

# 加载扩展
xontrib load zoxide

# 注册自定义命令
@aliases.register
def mkcd(args):
    p = args[0]
    mkdir -p @(p)
    cd @(p)
```

```xonsh
# 启动一个不读默认 rc 的干净会话
xonsh --no-rc

# 指定 rc 启动
xonsh --rc ./team.xsh
```

## Recipe：用 `xonfig` 和 `xontrib` 扩展体验
---
lang: xonsh
emoji: 🧪
link: https://xon.sh/xontrib.html
desc: 如果把 `xonshrc` 看成你的本地 wiring，`xonfig` 是配置向导，`xontrib` 则是功能生态。它们是 xonsh 真正形成“可长期使用 shell”的关键。
---

- `xonfig web`：本地起一个页面，挑主题、prompt、xontrib
- `xonfig wizard`：问答式导入已有 shell 设定和环境变量
- `xontrib list`：列出已安装 / 是否已加载
- `xontrib load ...`：运行时加载
- `xontrib unload ...`：卸载当前会话扩展

```xonsh
# 配置入口
xonfig web
xonfig wizard

# 查看和加载扩展
xontrib list
xontrib list --json zoxide
xontrib load zoxide
xontrib unload zoxide
```

```xonsh
# 常见做法：把常用 xontrib 固化到 rc
xontrib load zoxide
xontrib load prompt_starship
```

- 选型建议：
  - 想快速配主题和 prompt，先用 xonfig web
  - 想迁移 bash 或 zsh 习惯，试 xonfig wizard
  - 想增强补全、提示和第三方工具集成，找合适 xontrib

## Quick Ref
---
lang: xonsh
emoji: 📌
link: https://xon.sh/tutorial.html
desc: 这一张适合放在旁边随时扫一眼，记住最常抄的语法、对象和命令。
---

| 项 | 作用 |
| --- | --- |
| `xonsh` | 进入交互式 shell |
| `xonsh -c "..."` | 执行一段 xonsh 代码后退出 |
| `$VAR` / `$VAR = ...` | 读取 / 设置环境变量 |
| `${expr}` | 动态计算环境变量名 |
| `@.env` | 环境映射对象 |
| `@.imp` | 快速导入模块入口 |
| `@.lastcmd` | 上一个命令的运行结果 |
| `@(expr)` | 在命令里执行 Python 表达式 |
| `$()` | 捕获命令输出 |
| `!()` | 返回 `CommandPipeline`，自己处理错误 |
| `![cmd ...]` | 强制 subprocess mode |
| `p"/path"` | 路径字面量 |
| `aliases[...]` | 定义别名 |
| `@aliases.register` | 定义 callable alias |
| `xonfig web` / `xonfig wizard` | 图形 / 问答式配置入口 |
| `xontrib list/load/unload` | 扩展查看 / 加载 / 卸载 |
| `xpip install -U xonsh` | 更新当前 xonsh 环境 |
| `xonsh --no-rc` | 干净启动，不读 rc |
| `~/.xonshrc` | 最常见个人配置文件 |

## 常见决策与坑
---
lang: xonsh
emoji: ⚠️
link: https://xon.sh/install.html
desc: xonsh 最大的坑不是语法多，而是把它误用成“系统默认 POSIX shell”或者“纯 Python 脚本替代品”。边界一旦搞错，后面的体验就会一直别扭。
---

- `不要默认当系统登录 shell`
  - 官方明确说它不是 POSIX-compatible shell
  - 更稳的做法是给终端新建一个 xonsh profile
- `别把模式判定当魔法`
  - 一行到底按 Python 还是 subprocess 执行，取决于名字解析
  - 调不准时就显式写 subprocess 包装语法，比如 ![...] 或 @(...)
- `Windows 更新注意锁文件`
  - 正在运行的 xonsh.exe 不能在当前会话里被 pip 替换
  - 先用 xcontext 看解释器，再退出后从别的终端更新
- `xsh 脚本不等于 bash 脚本`
  - xonsh 能跑很多命令，但不保证 POSIX shell 语法原样兼容
- `先少量 xontrib，再逐步叠加`
  - 启动慢、行为变复杂时，第一怀疑对象通常是扩展或 rc 里的重逻辑
