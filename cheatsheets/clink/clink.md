---
title: Clink 速览
lang: cmd
version: "v1.9.17"
date: 2025-11-18
github: chrisant996/clink
---

# Clink

## 🧩 会话注入与状态确认
---
emoji: 🧩
link: https://chrisant996.github.io/clink/clink.html#using-clink
desc: 在 cmd 会话中启用 Clink，并确认当前会话状态。
---
- `clink inject` : 向当前 `cmd.exe` 会话注入 Clink。
- `clink inject -p <pid>` : 向指定 PID 的 `cmd.exe` 进程注入。
- `clink autorun install` : 设置 `cmd.exe` 启动时自动注入。
- `clink autorun uninstall` : 取消自动注入。
- `clink info` : 查看配置目录、版本、注入状态等信息。

```cmd
REM 在当前 CMD 会话启用 Clink
clink inject

REM 查看关键路径与版本信息
clink info
```

## 🕘 历史搜索与回放
---
emoji: 🕘
link: https://chrisant996.github.io/clink/clink.html#saved-command-history
desc: 基于历史进行增量搜索、过滤与快速复用。
---
### 常用按键
- `Ctrl-R` : 反向增量搜索历史。
- `Ctrl-S` : 正向增量搜索历史。
- `F7` : 打开历史弹窗列表。
- `PgUp` : 仅按当前前缀向后搜索历史。
- `PgDn` : 仅按当前前缀向前搜索历史。

### 典型设置
- `clink set history.max_lines 25000` : 提升历史容量。
- `clink set history.dupe_mode erase_prev` : 去重保留最新记录。

```cmd
REM 查询历史相关设置
clink set history.

REM 调大历史上限
clink set history.max_lines 25000
```

## 🔎 补全机制与触发方式
---
emoji: 🔎
link: https://chrisant996.github.io/clink/clink.html#how-completion-works
desc: 理解 Tab 与交互式补全列表的差异，减少误触和补全偏差。
---
### 触发方式
- `Tab` : 对光标所在单词执行补全。
- `Ctrl-Space` : 打开交互式补全列表并可过滤。
- `Alt-=` : 显示当前候选补全。

### 行为开关
- `clink set exec.enable false` : 关闭首词可执行文件补全。
- `clink set match.substring true` : 前缀失败后启用子串匹配。
- `clink set match.expand_envvars true` : 补全时展开环境变量。

```cmd
REM 关闭首词 executable 补全
clink set exec.enable false

REM 打开子串补全
clink set match.substring true
```

## 💡 自动建议（Autosuggest）
---
emoji: 💡
link: https://chrisant996.github.io/clink/clink.html#gettingstarted_autosuggest
desc: 使用历史与补全生成整行建议，提升重复命令输入效率。
---
- `clink set autosuggest.enable true` : 开启自动建议。
- `clink set autosuggest.enable false` : 关闭自动建议。
- `clink set autosuggest.strategy "match_prev_cmd history completion"` : 设置建议来源顺序。
- `clink set autosuggest.hint false` : 关闭右侧提示文案。

### 快捷键
- `Right` : 插入建议全文。
- `Ctrl-Right` : 插入建议的下一个词片段。
- `Shift-Right` : 插入建议的下一个完整词。
- `F2` : 打开/关闭建议列表。

## ⌨️ 编辑能力与常用热键
---
emoji: ⌨️
link: https://chrisant996.github.io/clink/clink.html#gettingstarted_keybindings
desc: 提供 Readline 风格编辑能力，可在 Bash 与 Windows 键位间切换。
---
- `Alt-H` : 显示当前所有已绑定按键。
- `Alt-?` : 查询某个按键绑定到哪个命令。
- `Ctrl-Z` : 撤销输入编辑。
- `Shift-Arrow` : 在输入区选择文本并直接替换。
- `Alt-.` : 插入上一条命令的最后一个参数。

```cmd
REM 使用 Windows 风格默认键位
clink set clink.default_bindings windows

REM 切回 Bash 风格默认键位
clink set clink.default_bindings bash
```

## ⚙️ 设置系统（clink set）
---
emoji: ⚙️
link: https://chrisant996.github.io/clink/clink.html#clinksettings
desc: 用 `clink set` 查询、筛选和修改 Clink 配置项。
---
- `clink set` : 列出全部设置。
- `clink set <name>` : 查看单个设置当前值。
- `clink set <name> <value>` : 修改设置。
- `clink set --help` : 查看命令参数与说明。

### 高频设置示例
- `clink set clink.logo short` : 缩短启动信息。
- `clink set clink.logo none` : 隐藏启动信息。
- `clink set clink.colorize_input false` : 关闭输入着色。
- `clink set clink.autostart nul` : 禁用自动启动脚本命令。

## 📁 文件位置与启动脚本
---
emoji: 📁
link: https://chrisant996.github.io/clink/clink.html#filelocations
desc: 明确 profile、历史、设置文件位置，便于备份与迁移。
---
- `clink info` : 输出 profile 目录等路径信息。
- `clink_start.cmd` : 注入后首个提示符前自动执行。
- `%USERPROFILE%\.inputrc` : Readline 键位与行为配置。
- `settings` / `.history` : 旧版本迁移时的关键文件。

```cmd
REM 创建并编辑 inputrc
notepad %USERPROFILE%\.inputrc
```

## 🎨 颜色与输入着色
---
emoji: 🎨
link: https://chrisant996.github.io/clink/clink.html#gettingstarted_colors
desc: 配置补全颜色、输入行语义高亮与建议列表配色。
---
- `clink set clink.colorize_input true` : 开启输入语义着色。
- `clink set color.executable "bright green"` : 可执行命令颜色。
- `clink set color.arg "yellow"` : 参数颜色。
- `clink set color.flag "bright cyan"` : 选项参数颜色。

```cmd
REM 查看所有颜色项
clink set color.

REM 修改一项颜色
clink set color.description "bright cyan"
```

## 🧠 Lua 脚本加载与入口
---
emoji: 🧠
lang: lua
link: https://chrisant996.github.io/clink/clink.html#extending-clink-with-lua
desc: 通过 Lua 扩展提示符、补全与输入行为。
---
- `profile.lua` : profile 目录中的优先加载入口脚本。
- `*.lua` : 其余脚本按文件名顺序加载。
- `clink set clink.path "<dir1>;<dir2>"` : 追加脚本加载路径。

```lua
-- profile.lua: 最小 prompt 过滤器示例
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
desc: 使用 argmatcher 为命令定制参数、flag 与上下文补全。
---
- `clink.argmatcher("git")` : 为 `git` 创建/获取补全器。
- `:addarg({...})` : 添加参数候选。
- `:addflags({...})` : 添加 flag 候选。
- `clink.arg.register_parser("foo", parser)` : 注册解析器。

```lua
-- 为 mytool 添加基础参数补全
local m = clink.argmatcher("mytool")

m:addflags("--help", "--verbose")
m:addarg({ "start", "stop", "status" })
```

## 🛠️ 调试与诊断
---
emoji: 🛠️
link: https://chrisant996.github.io/clink/clink.html#debugging-lua-scripts
desc: 在脚本异常或补全行为异常时快速定位问题。
---
- `clink set lua.debug true` : 允许进入 Lua 调试器。
- `clink set lua.break_on_error true` : Lua 报错时自动中断。
- `pause()` : 在 Lua 脚本里主动断点（需启用调试）。
- `clink set cmd.get_errorlevel false` : 出现兼容问题时可尝试关闭隐式 errorlevel 获取。

```lua
-- 在自定义脚本中设置断点
pause()
```

## 🚧 常见问题速解
---
emoji: 🚧
link: https://chrisant996.github.io/clink/clink.html#upgradefrom049
desc: 处理升级迁移、键位冲突、补全异常等常见问题。
---
- `Tab` 行为和预期不一致：检查 `clink.default_bindings` 是否为 `windows` 或 `bash`。
- 升级后历史缺失：对照 `clink info` 的 profile 路径，确认 `settings` 与 `.history` 是否迁移。
- 自动建议干扰输入：关闭 `autosuggest.enable` 或改 `autosuggest.strategy`。
- 命令着色异常：确认 `clink.colorize_input` 与主题相关 `color.*` 设置。
