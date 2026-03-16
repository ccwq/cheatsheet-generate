---
title: Clink Cookbook
lang: cmd
version: "v1.9.17"
date: "2026-02-24"
github: "chrisant996/clink"
colWidth: 420px
---

# Clink Cookbook

## 快速定位
---
emoji: 🧭
link: https://chrisant996.github.io/clink/clink.html
desc: Clink 不是另一个 shell，而是把 cmd.exe 强化成带有 Readline 编辑、历史、补全、自动建议和 Lua 扩展能力的工作台。先记入口，再记 recipe。
---
- `clink inject` : 进入当前窗口后立即启用 Clink。
- `clink autorun install` : 让后续打开的 cmd.exe 自动注入。
- `clink info` : 查看版本、profile 路径、脚本目录和运行状态。
- `clink set` : 查看全部设置项，适合先搜索再改。
- `clink reload` : 改完 Lua 脚本后原地重载，不必重开会话。

```cmd
REM 进入 cmd.exe 后的最小起手式
clink inject
clink info
```

## 起手工作流
---
emoji: 🚀
link: https://chrisant996.github.io/clink/clink.html#using-clink
desc: 第一次接管某台 Windows 开发机时，优先按“注入 -> 看路径 -> 开启高频能力 -> 验证按键”这条线走，而不是先改大量配置。
---
- `clink inject` : 先接管当前 cmd 会话。
- `clink info` : 再看 profile 路径和脚本目录。
- `clink set history.shared true` : 打开跨窗口共享历史。
- `clink set autosuggest.enable true` : 打开自动建议。
- `clink set clink.default_bindings windows` : 先切到熟悉键位。
- `Ctrl-R` : 验证历史搜索已生效。
- `Tab` : 验证补全已生效。
- `Right` : 验证自动建议已生效。

```cmd
REM 接管新机器时的低风险初始化
clink inject
clink set history.shared true
clink set autosuggest.enable true
clink set clink.default_bindings windows
clink info
```

## Recipe：让 cmd 变成可长期使用的主力终端
---
emoji: 🪝
link: https://chrisant996.github.io/clink/clink.html#using-clink
desc: 适用于你打算长期把 cmd.exe 当入口，而不是只临时开一两个会话。关键是自动注入和收尾排查。
---
- `clink autorun install` : 安装自动注入，适合作为长期主力终端的起手式。
- `clink info` : 重新打开一个 cmd.exe 后先用它验证是否真的生效。
- `clink autorun uninstall` : 不再需要时回退到原生 cmd.exe。
- `cmd.exe` : Clink 只增强它；PowerShell 不会直接得到同样行为。

```cmd
REM 安装自动注入
clink autorun install

REM 排查当前终端是否真的进入了 Clink
clink info

REM 不再需要时回退
clink autorun uninstall
```

## Recipe：把历史记录变成“跨窗口可回放”的命令库
---
emoji: 🕘
link: https://chrisant996.github.io/clink/clink.html#saved-command-history
desc: 适用于你经常开多个 cmd 窗口、重复敲构建命令、需要按前缀回放老命令。重点不是保存历史，而是让历史可检索、可共享、不过度重复。
---
- `Ctrl-R` : 反向增量搜索历史
- `Ctrl-S` : 正向增量搜索历史
- `F7` : 打开历史列表
- `PgUp` : 基于当前前缀向后检索历史
- `PgDn` : 基于当前前缀向前检索历史
- `clink set history.shared true` : 多窗口共享历史
- `clink set history.dupe_mode erase_prev` : 重复命令只保留最新一条
- `clink set history.max_lines 25000` : 扩大历史容量

```cmd
REM 适合长期开发机的历史配置
clink set history.shared true
clink set history.dupe_mode erase_prev
clink set history.max_lines 25000
```

## Recipe：把补全从“能用”调到“顺手”
---
emoji: 🔎
link: https://chrisant996.github.io/clink/clink.html#how-completion-works
desc: 当你已经有 Tab 补全，但候选太多、首词干扰太重或文件补全总在抢焦点时，用这组设置做微调。
---
- `Tab` : 对当前单词执行补全
- `Ctrl-Space` : 打开交互式候选列表
- `Alt-=` : 先看当前候选，不急着插入
- `clink set exec.enable false` : 不想让首词总去匹配可执行文件时关闭
- `clink set match.substring true` : 前缀没命中时再用子串匹配
- `clink set match.ignore_case true` : 大小写不敏感

```cmd
REM 降低“首词补全过度积极”的干扰
clink set exec.enable false
clink set match.substring true
clink set match.ignore_case true
```

## Recipe：让自动建议更像“续写”而不是“打扰”
---
emoji: 💡
link: https://chrisant996.github.io/clink/clink.html#gettingstarted_autosuggest
desc: 自动建议最适合高频、长命令和重复参数场景；如果建议太吵，就优先调来源顺序和提示样式，而不是马上全关。
---
- `clink set autosuggest.enable true` : 开启自动建议
- `clink set autosuggest.strategy "match_prev_cmd history completion"` : 优先复用上一条命令上下文，再看历史和补全
- `clink set autosuggest.hint false` : 只保留建议内容，不显示额外提示文案
- `Right` : 接受整条建议
- `Ctrl-Right` : 接受下一个词段
- `Shift-Right` : 接受下一个完整单词
- `F2` : 切换建议列表显示

```cmd
REM 保留建议能力，但尽量少打扰
clink set autosuggest.enable true
clink set autosuggest.strategy "match_prev_cmd history completion"
clink set autosuggest.hint false
```

## Recipe：按自己的肌肉记忆切换编辑模式
---
emoji: ⌨️
link: https://chrisant996.github.io/clink/clink.html#gettingstarted_keybindings
desc: Clink 的高价值不只是补全，还有 Readline 风格编辑。先决定你是更接近 Windows 原生键位，还是更接近 Bash/Readline 习惯。
---
- `clink set clink.default_bindings windows` : 更接近 Windows 用户习惯
- `clink set clink.default_bindings bash` : 更接近 Bash/Readline
- `Alt-H` : 查看当前键位绑定表
- `Alt-?` : 查询某个按键绑定到什么命令
- `Ctrl-Z` : 撤销当前输入编辑
- `Alt-.` : 插入上一条命令的最后一个参数

```cmd
REM 先切到熟悉的键位，再决定是否细调 inputrc
clink set clink.default_bindings bash
```

## Recipe：先用 `clink set` 管控行为，再碰 Lua
---
emoji: ⚙️
link: https://chrisant996.github.io/clink/clink.html#clinksettings
desc: 多数日常调整不需要写脚本。先通过设置项拿到 80% 的收益，只有在提示符、补全逻辑、事件处理超出设置能力时再上 Lua。
---
- `clink set` : 列出全部设置
- `clink set <name>` : 查看单项值
- `clink set <name> <value>` : 修改设置
- `clink set <name> unset` : 回到默认值
- 常见起手项：
- `clink set clink.logo short`
- `clink set clink.logo none`
- `clink set clink.colorize_input true`
- `clink set clink.autostart nul`

```cmd
REM 把启动信息降噪，把输入着色打开
clink set clink.logo short
clink set clink.colorize_input true
```

## Recipe：定位 profile、inputrc 和启动脚本
---
emoji: 📁
link: https://chrisant996.github.io/clink/clink.html#filelocations
desc: 迁移环境、排查脚本冲突、备份配置时，先找落盘文件。Clink 的很多问题本质上都是“改错了文件”。
---
- `clink info` : 先看 profile 路径和脚本搜索目录
- `clink_start.cmd` : 每次注入后、出现首个提示符前执行
- `%USERPROFILE%\\.inputrc` : Readline 风格键位与编辑行为
- `profile.lua` : 自定义 Lua 入口，优先级高
- 历史与 settings 文件：升级、备份、迁移时都要一起处理

```cmd
REM 先找到配置文件，再决定改 inputrc 还是 Lua
clink info
notepad %USERPROFILE%\.inputrc
```

## Recipe：做最小 Lua 定制，不要一开始就写成框架
---
emoji: 🧠
lang: lua
link: https://chrisant996.github.io/clink/clink.html#extending-clink-with-lua
desc: Clink 的 Lua 层适合做提示符过滤、补全增强和少量行为注入。建议先做一个最小 `profile.lua`，确认加载链和重载链都通，再逐步扩。
---
- `profile.lua` : 最稳的入口文件
- `clink set clink.path "<dir1>;<dir2>"` : 增加自定义脚本目录
- `clink reload` : 修改后立即重载
- 自定义 prompt : 这是最常见的 Lua 使用入口
- 设置项能力不够时 : 再进入 Lua 层写命令级补全逻辑
- 输入或补全过程规则 : 需要插入行为时再进入 Lua 层

```lua
-- profile.lua：新版写法用 clink.promptfilter()
local pf = clink.promptfilter(10)
function pf:filter(prompt)
    return "[dev] " .. prompt
end
```

## Recipe：把自定义 Lua scripts 接进 Clink
---
emoji: 🗂️
lang: lua
link: https://chrisant996.github.io/clink/clink.html#location-of-lua-scripts
desc: 自定义脚本最容易踩坑的不是语法，而是“脚本到底放哪才会被加载”。这一张卡把官方支持的加载方式一次列全。
---
- `clink.path` : 第一优先级的脚本目录列表，多个目录用分号分隔
- 默认脚本目录 : 当 clink.path 没设置时，Clink 会使用 DLL 目录和 profile 目录
- `%CLINK_PATH%` : 可以用环境变量追加脚本目录
- `clink installscripts <dir>` : 把目录注册到系统级脚本搜索路径
- `clink uninstallscripts <dir>` : 取消注册 installscripts 路径
- `completions\` : v1.3.23+ 可放按需加载的补全脚本，避免启动时全量载入
- `clink info` : 当前会话实际扫描到哪些脚本路径，以它为准

```cmd
REM 方式 1：直接设置脚本目录
clink set clink.path "%USERPROFILE%\\clink;%USERPROFILE%\\dotfiles\\clink"

REM 方式 2：用环境变量追加目录
set CLINK_PATH=%USERPROFILE%\company-clink

REM 方式 3：注册系统级脚本目录
clink installscripts "D:\shared\clink-scripts"

REM 最终确认当前会话实际加载路径
clink info
```

## Recipe：组织自定义脚本目录
---
emoji: 🧱
lang: text
link: https://chrisant996.github.io/clink/clink.html#location-of-lua-scripts
desc: 目录结构越早定清楚，后面越不容易把 prompt、补全和实验脚本揉成一团。推荐把“启动即加载”和“按需补全”分开。
---

```text
%USERPROFILE%\clink\
├─ profile.lua          启动入口
├─ prompt.lua           提示符过滤器
├─ hooks.lua            onbeginedit / onendedit 一类事件
├─ utils.lua            公共函数
└─ completions\
   ├─ git-extra.lua     仅在补全需要时加载
   └─ mytool.lua
```

- `profile.lua` : 作为总入口，负责 require 其他模块
- `completions\` : 只放 argmatcher 一类补全脚本
- `utils.lua` : 放字符串处理、路径拼接、外部命令封装
- 一个脚本只管一类职责 : 方便 reload 和排障

## Recipe：写第一版 Lua script
---
emoji: ✍️
lang: lua
link: https://chrisant996.github.io/clink/clink.html#writing-lua-scripts
desc: Clink 加载 Lua 的方式很直接: 发现脚本就执行。理解“顶层代码立即执行，函数等你注册后再被回调”这一点，基本就能开始写了。
---
- `Lua 5.2` : Clink 当前使用的 Lua 版本
- 顶层代码 : 脚本加载时立即执行
- 函数注册 : prompt、补全、事件这类逻辑通常先定义函数，再交给 Clink
- `require` : 适合拆模块，但入口最好仍由 profile.lua 统一调度
- `local` : 默认优先用 local，避免污染全局

```lua
-- profile.lua：最小可运行示例
local M = {}

local function hello()
    print("clink script loaded")
end

hello()

return M
```

## Recipe：Lua 语法概要
---
emoji: 📘
lang: lua
link: https://chrisant996.github.io/clink/clink.html#writing-lua-scripts
desc: 写 Clink 脚本不需要先把 Lua 学成体系。先会变量、函数、表、字符串拼接和冒号方法调用，就能覆盖大多数定制需求。
---
- `local x = 1` : 定义局部变量
- `local function f()` : 定义函数
- `{}` : Lua 的 table，同一套结构同时承担对象和数组角色
- `..` : 字符串拼接
- `obj:method()` : 冒号调用，会自动传 self
- `if ... then ... end` : 条件判断
- `for _, v in ipairs(t) do` : 遍历顺序数组

```lua
local colors = {
    ok = "\x1b[92m",
    reset = "\x1b[m",
}

local function add_prefix(text)
    return colors.ok .. "[ok] " .. colors.reset .. text
end
```

## Recipe：重载脚本与调试迭代
---
emoji: 🔄
lang: lua
link: https://chrisant996.github.io/clink/clink.html#customisingtheprompt
desc: 写 Clink 脚本时，最重要的工作流不是“写很多”，而是“改一点，立刻 reload 验证”。官方支持按键和 API 两种重载方式。
---
- `Ctrl-x Ctrl-r` : 默认触发 clink-reload，重载配置和 Lua scripts
- `clink reload` : 命令行里主动重载
- `clink.reload()` : 在脚本或命令里主动触发 reload
- 新开一个 Clink 会话 : 最保守的全量验证方式
- `clink info` : reload 后再次确认脚本路径和 profile 是否正确

```cmd
REM 外层工作流：改脚本 -> 重载 -> 验证
notepad D:\clink\profile.lua
clink reload
clink info
```

```lua
-- 某些场景下也可以在脚本里主动要求重载
clink.reload()
```

## Recipe：常用脚本接口先记这些
---
emoji: 🧰
lang: lua
link: https://chrisant996.github.io/clink/clink.html#lua-api-reference
desc: 先掌握这几类接口就够写出大多数实用脚本。顺序建议是 promptfilter -> 生命周期事件 -> argmatcher -> Lua 标准库。
---
- `clink.promptfilter()` : 注册新版 prompt 过滤器
- `clink.onbeginedit()` : 每次进入输入编辑前触发
- `clink.onendedit()` : 每次结束输入编辑后触发
- `clink.argmatcher()` : 给命令挂自定义补全
- `clink.reload()` : 触发重载
- `os.getcwd()` : 获取当前目录
- `os.getenv()` : 读取环境变量
- `io.popen()` : 调外部命令并读输出

```lua
local pf = clink.promptfilter(30)
function pf:filter(prompt)
    return os.getcwd() .. " > "
end

local function before_edit()
    -- 这里适合做轻量初始化
end

clink.onbeginedit(before_edit)
```

## Recipe：按场景选加载方式
---
emoji: 🛣️
lang: text
link: https://chrisant996.github.io/clink/clink.html#location-of-lua-scripts
desc: 同样是“让脚本生效”，不同入口适合的场景不一样。按下面的决策规则选，后面维护成本会低很多。
---
- `profile.lua` : 你自己的主入口，最适合个人长期配置
- `clink.path` : 需要精确控制脚本目录优先级时选它
- `%CLINK_PATH%` : 适合临时注入或跟随外部环境切换
- `clink installscripts` : 适合包管理器、团队共享脚本、系统级注册
- `completions\` : 只想按需加载补全，不想拖慢启动时选它
- 一个仓库多个脚本目录 : 先统一由 profile.lua 接管，再逐步拆分

## Recipe：给自家命令补全，优先写 argmatcher
---
emoji: 🧱
lang: lua
link: https://chrisant996.github.io/clink/clink.html#argument-completion
desc: 如果只是想让内部工具、脚本命令、子命令和 flags 变得可补全，不要一上来写复杂解析器；先用 argmatcher 把主路径铺平。
---
- `clink.argmatcher("mytool")` : 获取某个命令的补全器
- `:addarg({...})` : 添加位置参数候选
- `:addflags({...})` : 添加 flag 候选
- `:nofiles()` : 禁止当前位置退回文件补全
- 公司内部 CLI : 很适合先用 argmatcher 起一版
- 多子命令脚本 : 能快速把主路径铺平
- 固定枚举参数工具 : 最省成本

```lua
-- 为 mytool 建一个够用的第一版补全
local m = clink.argmatcher("mytool")

m:addflags("--help", "--verbose", "--json")
m:addarg({ "start", "stop", "status", "doctor" })
```

## Recipe：脚本和补全出了问题，按这个顺序诊断
---
emoji: 🛠️
lang: lua
link: https://chrisant996.github.io/clink/clink.html#debugging-lua-scripts
desc: Lua 侧问题最怕“脚本有没有加载、补全在哪一层被覆盖、错误是不是被吞了”这三件事分不清。诊断时按固定顺序走，效率最高。
---
- 先用 clink info 确认当前 profile 和脚本目录
- 再执行 clink reload 触发一次完整重载
- 然后打开 clink set lua.debug true
- 报错时再打开 clink set lua.break_on_error true
- 在怀疑位置插入 pause() 断点
- 遇到兼容问题时，再试 clink set cmd.get_errorlevel false

```lua
-- 临时断点：确认脚本是否执行到这里
pause()
```

## 常见决策与坑
---
emoji: 🚧
link: https://chrisant996.github.io/clink/clink.html#upgradefrom049
desc: Cookbook 模式下最该记的是判断规则，而不是零散参数。下面这些判断点决定你该改设置、改键位，还是改脚本。
---
- Tab 行为不对时，先检查 clink.default_bindings
- 历史没有共享时，先检查 history.shared
- 自动建议太烦时，先调 autosuggest.strategy
- 不想看提示文案时，再调 autosuggest.hint
- 输入没有着色时，先检查 clink.colorize_input
- 升级后行为突变时，优先核对 profile.lua
- 键位异常或编辑行为异常时，优先核对 .inputrc
- 在线文档页头仍可能显示旧版本号，版本字段以 GitHub release v1.9.17 为准
