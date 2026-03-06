---
title: Clink 速查
lang: cmd
version: "v1.9.17"
date: "2025-11-18"
github: "chrisant996/clink"
---

# Clink

## 🧩 注入与会话管理
---
emoji: 🧩
link: https://chrisant996.github.io/clink/clink.html#using-clink
desc: 在 cmd.exe 会话中启用、取消或诊断 Clink 注入状态。
---
- `clink inject` : 注入当前 cmd 会话。
- `clink inject -p <pid>` : 注入指定 PID 的 cmd 进程。
- `clink autorun install` : 安装 cmd 启动自动注入。
- `clink autorun uninstall` : 卸载自动注入。
- `clink info` : 查看版本、profile 路径和运行状态。

```cmd
REM 注入当前会话
clink inject

REM 查看诊断信息
clink info
```

## 🕘 历史记录与增量搜索
---
emoji: 🕘
link: https://chrisant996.github.io/clink/clink.html#saved-command-history
desc: 使用历史持久化、按前缀搜索与增量检索提升回放效率。
---
### 常用按键
- `Ctrl-R` : 反向增量搜索历史。
- `Ctrl-S` : 正向增量搜索历史。
- `F7` : 打开历史弹窗列表。
- `PgUp` : 按当前前缀向后检索历史。
- `PgDn` : 按当前前缀向前检索历史。

### 常用设置
- `clink set history.max_lines 25000` : 扩大历史条目上限。
- `clink set history.dupe_mode erase_prev` : 重复命令保留最新项。
- `clink set history.shared true` : 多窗口共享历史。

## 🔎 补全机制与触发键
---
emoji: 🔎
link: https://chrisant996.github.io/clink/clink.html#how-completion-works
desc: 区分单词补全与交互列表补全，并控制补全匹配策略。
---
- `Tab` : 对光标所在单词执行补全。
- `Ctrl-Space` : 打开交互式补全列表。
- `Alt-=` : 列出当前候选项。
- `clink set exec.enable false` : 关闭首词可执行文件补全。
- `clink set match.substring true` : 前缀失败后启用子串匹配。
- `clink set match.ignore_case true` : 启用大小写不敏感匹配。

```cmd
REM 关闭首词 executable 补全
clink set exec.enable false

REM 开启子串与忽略大小写
clink set match.substring true
clink set match.ignore_case true
```

## 💡 自动建议（Autosuggest）
---
emoji: 💡
link: https://chrisant996.github.io/clink/clink.html#gettingstarted_autosuggest
desc: 基于历史和补全生成整行建议，支持按词逐段采纳。
---
- `clink set autosuggest.enable true` : 开启自动建议。
- `clink set autosuggest.enable false` : 关闭自动建议。
- `clink set autosuggest.strategy "match_prev_cmd history completion"` : 设置建议来源顺序。
- `clink set autosuggest.hint false` : 关闭右侧提示文案。

### 采纳快捷键
- `Right` : 插入整条建议。
- `Ctrl-Right` : 插入建议的下一个词段。
- `Shift-Right` : 插入建议的下一个完整词。
- `F2` : 切换建议列表显示。

## ⌨️ 编辑能力与键位切换
---
emoji: ⌨️
link: https://chrisant996.github.io/clink/clink.html#gettingstarted_keybindings
desc: 提供 Readline 风格编辑命令，并支持 Bash/Windows 键位方案。
---
- `Alt-H` : 显示当前键位绑定表。
- `Alt-?` : 查询某个按键绑定到的命令。
- `Ctrl-Z` : 撤销输入编辑。
- `Alt-.` : 插入上一条命令的最后一个参数。
- `clink set clink.default_bindings windows` : 切换 Windows 风格键位。
- `clink set clink.default_bindings bash` : 切换 Bash 风格键位。

## ⚙️ 设置系统（clink set）
---
emoji: ⚙️
link: https://chrisant996.github.io/clink/clink.html#clinksettings
desc: 用 clink set 查看、修改和恢复配置项。
---
- `clink set` : 列出全部设置。
- `clink set <name>` : 查看单项设置值。
- `clink set <name> <value>` : 修改设置。
- `clink set <name> unset` : 恢复默认。
- `clink set --help` : 查看完整帮助。

### 高频设置
- `clink set clink.logo short` : 使用短启动信息。
- `clink set clink.logo none` : 不显示启动信息。
- `clink set clink.colorize_input false` : 关闭输入着色。
- `clink set clink.autostart nul` : 禁用自动启动命令。

## 📁 文件位置与启动脚本
---
emoji: 📁
link: https://chrisant996.github.io/clink/clink.html#filelocations
desc: 快速定位 profile、历史与 inputrc，便于迁移和备份。
---
- `clink info` : 输出 profile 目录等关键路径。
- `clink_start.cmd` : 注入后首次提示符前自动执行。
- `%USERPROFILE%\.inputrc` : Readline 键位与行为配置文件。
- `settings` 与 `.history` : 升级迁移时的关键文件。

```cmd
REM 编辑 inputrc
notepad %USERPROFILE%\.inputrc
```

## 🎨 颜色与输入着色
---
emoji: 🎨
link: https://chrisant996.github.io/clink/clink.html#gettingstarted_colors
desc: 调整命令、参数、标志和建议文本的颜色表现。
---
- `clink set clink.colorize_input true` : 开启输入语义着色。
- `clink set color.executable "bright green"` : 可执行命令颜色。
- `clink set color.arg "yellow"` : 参数颜色。
- `clink set color.flag "bright cyan"` : 选项颜色。
- `clink set color.unrecognized "red"` : 未识别命令颜色。

## 🧠 Lua 扩展入口
---
emoji: 🧠
lang: lua
link: https://chrisant996.github.io/clink/clink.html#extending-clink-with-lua
desc: 通过 Lua 脚本定制提示符、补全与输入行为。
---
- `profile.lua` : profile 目录优先加载入口脚本。
- `*.lua` : 按文件名顺序加载其余脚本。
- `clink set clink.path "<dir1>;<dir2>"` : 增加脚本搜索路径。
- `clink reload` : 不重启会话重载 Lua 脚本。

```lua
-- profile.lua: 最小提示符过滤示例
local function prompt_filter(prompt)
    return "[dev] " .. prompt
end

clink.prompt.register_filter(prompt_filter, 10)
```

## 🧱 参数补全（Argmatcher）
---
emoji: 🧱
lang: lua
link: https://chrisant996.github.io/clink/clink.html#argument-completion
desc: 为命令定义子命令、参数和 flags 的上下文补全。
---
- `clink.argmatcher("mytool")` : 创建或获取命令补全器。
- `:addarg({...})` : 添加位置参数候选。
- `:addflags({...})` : 添加 flags 候选。
- `:nofiles()` : 禁止该位置回退到文件补全。

```lua
-- 为 mytool 定义基础补全
local m = clink.argmatcher("mytool")

m:addflags("--help", "--verbose")
m:addarg({ "start", "stop", "status" })
```

## 🛠️ 调试与诊断
---
emoji: 🛠️
link: https://chrisant996.github.io/clink/clink.html#debugging-lua-scripts
desc: 在脚本报错、补全异常或行为不符预期时快速定位问题。
---
- `clink set lua.debug true` : 启用 Lua 调试器。
- `clink set lua.break_on_error true` : 报错时自动中断。
- `pause()` : 在 Lua 脚本里主动打断点。
- `clink set cmd.get_errorlevel false` : 兼容性问题时可临时关闭隐式 errorlevel 获取。

```lua
-- 调试断点示例
pause()
```

## 🚧 常见问题
---
emoji: 🚧
link: https://chrisant996.github.io/clink/clink.html#upgradefrom049
desc: 快速处理键位差异、历史迁移与自动建议干扰。
---
- `clink set clink.default_bindings windows` : Tab 行为不符合预期时先检查键位方案。
- `clink info` : 升级后历史缺失时先核对 profile 路径。
- `clink set autosuggest.enable false` : 自动建议干扰输入时可先关闭。
- `clink set clink.colorize_input true` : 输入未着色时确认总开关。
