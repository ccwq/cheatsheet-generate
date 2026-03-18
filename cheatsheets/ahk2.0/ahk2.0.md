---
title: AutoHotkey v2.0
lang: autohotkey
version: "2.0.21"
date: "2026-02-09"
github: AutoHotkey/AutoHotkey
colWidth: 360px
---

# AutoHotkey v2.0

## Cookbook
---
lang: autohotkey
emoji: 料理
link: https://www.autohotkey.com/docs/v2/index.htm
desc: 先记住常见工作流，再回头查热键符号和 API。AHK 真正常用的不是“单个函数”，而是“热键 + 条件 + 系统操作”的组合。
---

### 这份 cheatsheet 怎么读

- 先看 `Cookbook`：按场景拿现成套路
- 再看 `快捷键`：查热键符号、按键名、上下文写法
- 然后看 `API`：补常用函数和对象
- 最后看 `脚本`：整理成可维护的 v2 脚本骨架

### Recipe 1: 把 `CapsLock` 改成控制层

```autohotkey
#Requires AutoHotkey v2.0
#SingleInstance Force

; 单击 CapsLock 发 Escape，按住时当作导航层
CapsLock::
{
    KeyWait "CapsLock", "T0.2"
    if ErrorLevel
        return
    Send "{Esc}"
}

CapsLock & h::Send "{Left}"
CapsLock & j::Send "{Down}"
CapsLock & k::Send "{Up}"
CapsLock & l::Send "{Right}"
CapsLock & u::Send "^{Left}"
CapsLock & o::Send "^{Right}"
CapsLock & i::Send "{Home}"
CapsLock & p::Send "{End}"
```

- 适合场景：把方向键和 Home/End 收到主键区
- 关键点：组合键写成 `主键 & 副键`
- 常见坑：`CapsLock` 原始切换行为要自己决定是否保留

### Recipe 2: 用热字串做文本扩展

```autohotkey
#Requires AutoHotkey v2.0

::adr::上海市浦东新区张江高科技园区
::sig::
(
此致
敬礼

张三
)

:*:brb::be right back
:?:ahk2::AutoHotkey v2
```

- `::text::replacement`：标准热字串
- `:*:`：无需结束符，打完立即替换
- `:?:`：允许在单词中间触发
- 适合场景：签名、地址、模板话术、代码片段前缀

### Recipe 3: 一键启动或切换常用应用

```autohotkey
#Requires AutoHotkey v2.0

#n::
{
    if WinExist("ahk_exe notepad.exe")
        WinActivate
    else
        Run "notepad.exe"
}

#e::Run "explorer.exe"
#b::Run "https://www.bing.com"
```

- `WinExist()` + `WinActivate()` 是最常见的“有就切，无就开”
- 标题不稳定时优先用 `ahk_exe` 或 `ahk_class`
- `Run` 既能开程序，也能开 URL

### Recipe 4: 给指定应用做专属快捷键

```autohotkey
#Requires AutoHotkey v2.0

#HotIf WinActive("ahk_exe Code.exe")
!r::Send "^`"
!1::Send "^1"
!2::Send "^2"
#HotIf

#HotIf WinActive("ahk_exe chrome.exe")
!h::Send "^l"
!j::Send "^+{Tab}"
!k::Send "^{Tab}"
#HotIf
```

- `#HotIf` 是 v2 里最重要的上下文入口之一
- 适合场景：VS Code、浏览器、聊天工具、游戏、设计软件
- 规则：作用域结束后记得补一个空的 `#HotIf`

### Recipe 5: 做一个“复制后处理”的剪贴板流

```autohotkey
#Requires AutoHotkey v2.0

^+c::
{
    A_Clipboard := ""
    Send "^c"
    ClipWait 1

    text := Trim(A_Clipboard)
    if !text
        return

    ; 把多余空白压成一行
    text := RegExReplace(text, "\s+", " ")
    A_Clipboard := text
    ToolTip "已清洗剪贴板"
    SetTimer () => ToolTip(), -800
}
```

- 经典链路：`清空剪贴板 -> Send "^c" -> ClipWait -> 处理文本`
- 适合场景：复制网页、PDF、日志、命令输出后二次清洗
- 常见坑：不先清空剪贴板时，`ClipWait` 可能误判为“已复制成功”

### Recipe 6: 做一个轻量 GUI 启动器

```autohotkey
#Requires AutoHotkey v2.0

apps := Map(
    "记事本", "notepad.exe",
    "计算器", "calc.exe",
    "资源管理器", "explorer.exe"
)

#Space::
{
    gui := Gui("+AlwaysOnTop", "启动器")
    gui.SetFont("s10", "Microsoft YaHei UI")
    gui.Add("Text",, "输入应用名")
    input := gui.Add("Edit", "w260")
    btn := gui.Add("Button", "Default w80", "运行")

    btn.OnEvent("Click", (*) => RunSelected())
    input.OnEvent("Enter", (*) => RunSelected())
    gui.OnEvent("Escape", (*) => gui.Destroy())
    gui.Show()

    RunSelected() {
        name := Trim(input.Value)
        if apps.Has(name)
            Run apps[name]
        gui.Destroy()
    }
}
```

- AHK v2 的 GUI 已经是对象风格，不再是老式命令流
- 适合场景：个人启动器、表单采集、批处理入口
- 常见坑：事件回调里引用外部变量时，先保证变量作用域清晰

## 快捷键
---
lang: autohotkey
emoji: 键
link: https://www.autohotkey.com/docs/v2/Hotkeys.htm
desc: 这一部分只解决“热键怎么写”。如果你已经知道目标动作是什么，但总忘记符号、前缀和按键名，就看这里。
---

### 修饰符符号

```autohotkey
#  ; Win
!  ; Alt
^  ; Ctrl
+  ; Shift
&  ; 自定义组合键
<  ; 左侧修饰键
>  ; 右侧修饰键
*  ; 通配，忽略额外修饰键
~  ; 穿透，不屏蔽原按键行为
$  ; 强制使用键盘钩子
Up ; 按键弹起时触发
```

### 最常见写法

```autohotkey
^!s::MsgBox "Ctrl+Alt+S"
#q::Run "notepad.exe"
+Esc::ExitApp
~CapsLock::ToolTip "CapsLock 被按下"
*F1::Send "{Volume_Mute}"
^j Up::MsgBox "Ctrl+J 已抬起"
```

### `#HotIf` 上下文热键

```autohotkey
#HotIf WinActive("ahk_exe notepad.exe")
^d::Send "{End}{Enter}" ; 只在记事本里生效
#HotIf

#HotIf GetKeyState("CapsLock", "P")
h::Send "{Left}"
l::Send "{Right}"
#HotIf
```

- 条件可以是 `WinActive()`、`WinExist()`、`GetKeyState()` 或任意表达式
- 不要忘记在结尾写一个空的 `#HotIf`

### 热字串速记

```autohotkey
::btw::by the way
:*:shrug::¯\_(ツ)_/¯
:?:uuid::550e8400-e29b-41d4-a716-446655440000
:C:addr::上海市浦东新区
```

- `:*:`：立即触发
- `:?:`：允许词中替换
- `:C:`：大小写敏感

### 常用按键名

```autohotkey
Space  Tab  Enter  Escape  Backspace  Delete
Home   End  PgUp   PgDn    Up         Down
Left   Right Insert AppsKey PrintScreen Pause

CapsLock ScrollLock NumLock
LShift RShift LCtrl RCtrl LAlt RAlt

F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12

Numpad0 Numpad1 Numpad2 Numpad3 Numpad4
Numpad5 Numpad6 Numpad7 Numpad8 Numpad9
NumpadDot NumpadAdd NumpadSub NumpadMult
NumpadDiv NumpadEnter

LButton RButton MButton XButton1 XButton2
WheelUp WheelDown WheelLeft WheelRight

Volume_Mute Volume_Down Volume_Up
Media_Play_Pause Media_Next Media_Prev Media_Stop
Browser_Back Browser_Forward Browser_Refresh Browser_Home
```

### 重映射最短写法

```autohotkey
CapsLock::Ctrl
RAlt::AppsKey
XButton1::Browser_Back
XButton2::Browser_Forward
```

- 这种写法适合“一个键等价替换成另一个键”
- 复杂逻辑改用函数体块，更容易维护

### 发送按键的常见模式

```autohotkey
Send "^c"
Send "!{Tab}"
Send "+{End}"
Send "{Text}literal text only"
Send "{Blind}{Ctrl down}a{Ctrl up}"
```

- `Send "{Text}..."` 适合发送纯文本，避免特殊符号被解释
- 需要更高兼容性时优先先测试目标程序是否接受 `Send`

## API
---
lang: autohotkey
emoji: 函
link: https://www.autohotkey.com/docs/v2/lib/index.htm
desc: v2 的核心风格是表达式化和对象化。下面按“输入、窗口、文件、GUI、系统”分组，只留高频 API。
---

### 核心运行时

```autohotkey
MsgBox "hello"
Sleep 500
SetTimer MyTask, 1000
SetTimer MyTask, 0

MyTask() {
    ToolTip FormatTime(, "HH:mm:ss")
}
```

- `MsgBox`：快速提示、确认、报错
- `Sleep`：简单延时
- `SetTimer`：周期任务、一次性 UI 提示、后台轮询

### 输入与自动化

```autohotkey
Send "^c"
Click 100, 200
MouseMove 500, 300, 10
CoordMode "Mouse", "Screen"
CoordMode "Pixel", "Screen"

ih := InputHook("V")
ih.Start()
ih.Wait()
MsgBox ih.Input
```

- `Send`：键盘输入
- `Click` / `MouseMove`：鼠标自动化
- `CoordMode`：决定坐标相对屏幕、窗口还是客户区
- `InputHook`：拦截用户输入，做录制、监听、命令模式

### 窗口与进程

```autohotkey
if WinExist("ahk_exe notepad.exe")
    WinActivate

WinMove 0, 0, 1200, 800, "A"
WinMaximize "A"
WinMinimize "A"
WinClose "A"

Run "notepad.exe"
RunWait "notepad.exe"
pid := ProcessExist("notepad.exe")
if pid
    ProcessClose pid
```

- 窗口类 API 通常支持 `标题 / ahk_exe / ahk_class / ahk_id`
- `RunWait` 适合等外部程序执行完成
- `ProcessExist()` 返回 PID，可直接喂给 `ProcessClose()`

### 剪贴板、字符串与正则

```autohotkey
A_Clipboard := "hello"
ClipWait 1

text := "  AutoHotkey   v2  "
text := Trim(text)
text := StrReplace(text, " ", "-")
text := RegExReplace(text, "-+", "-")
parts := StrSplit(text, "-")
```

- `A_Clipboard`：最常用的内建变量之一
- `Trim` / `StrReplace` / `StrSplit`：字符串处理三件套
- `RegExReplace`：清洗文本、提取片段时很高频

### 文件与路径

```autohotkey
text := FileRead("notes.txt", "UTF-8")
FileAppend "line 1`n", "notes.txt", "UTF-8"
FileDelete "old.log"
DirCreate "output"

for file in DirGetFiles(A_ScriptDir, "*.ahk")
    OutputDebug file
```

- 简单读写优先 `FileRead` / `FileAppend`
- 需要流式读写时再用 `FileOpen()`
- `A_ScriptDir`、`A_Temp`、`A_Desktop` 这类内建路径很常用

### 数组、映射、对象

```autohotkey
arr := ["one", "two", "three"]
arr.Push("four")

conf := Map("theme", "dark", "fontSize", 14)
conf["lang"] := "zh-CN"

user := {name: "Alice", role: "admin"}

for index, value in arr
    OutputDebug index ": " value
```

- `Array`：顺序集合
- `Map`：键值表
- `{}`：对象字面量，适合少量结构化数据

### GUI

```autohotkey
gui := Gui("+Resize", "Demo")
gui.Add("Text",, "用户名")
nameEdit := gui.Add("Edit", "w220")
saveBtn := gui.Add("Button", "Default", "保存")

saveBtn.OnEvent("Click", SaveUser)
gui.OnEvent("Escape", (*) => gui.Destroy())
gui.Show()

SaveUser(*) {
    MsgBox "已保存: " nameEdit.Value
}
```

- `Gui()` 返回对象
- `Add()` 创建控件
- `OnEvent()` 绑定事件
- v2 里 GUI 已经明显偏现代对象式写法

### 系统与底层

```autohotkey
screenWidth := DllCall("GetSystemMetrics", "Int", 0, "Int")
buffer := Buffer(16, 0)
DllCall("GetCursorPos", "Ptr", buffer)
x := NumGet(buffer, 0, "Int")
y := NumGet(buffer, 4, "Int")
```

- `DllCall`：调用 Win32 API
- `Buffer` / `NumGet` / `NumPut`：和结构体、内存块打交道
- 适合场景：AHK 内置 API 不够时补位

### 错误处理

```autohotkey
try {
    text := FileRead("missing.txt", "UTF-8")
} catch Error as err {
    MsgBox "读取失败:`n" err.Message
}
```

- v2 推荐用 `try / catch`
- 遇到文件、正则、窗口匹配失败时都值得显式兜底

## 脚本
---
lang: autohotkey
emoji: 脚
link: https://www.autohotkey.com/docs/v2/Language.htm
desc: 这一部分负责把零散热键和 API 收拢成能长期维护的脚本。重点不是语法全量覆盖，而是可读性、组织方式和 v2 迁移习惯。
---

### 推荐脚本头

```autohotkey
#Requires AutoHotkey v2.0
#SingleInstance Force
#Warn

; 统一坐标系，避免鼠标和窗口行为飘忽
CoordMode "Mouse", "Screen"
CoordMode "ToolTip", "Screen"

Persistent
```

- `#Requires`：明确 v2
- `#SingleInstance Force`：避免重复启动多个实例
- `#Warn`：尽早暴露变量名、作用域等问题

### 函数优先，不要把逻辑都堆在热键里

```autohotkey
#Requires AutoHotkey v2.0

^!n::CreateDailyNote()

CreateDailyNote() {
    dir := A_Desktop "\DailyNotes"
    DirCreate dir

    file := dir "\" FormatTime(, "yyyy-MM-dd") ".md"
    if !FileExist(file)
        FileAppend "# " FormatTime(, "yyyy-MM-dd") "`n", file, "UTF-8"

    Run file
}
```

- 热键只负责入口
- 真正逻辑放函数里，便于复用、调试、测试

### 一个更像“项目”的组织方式

```autohotkey
#Requires AutoHotkey v2.0
#SingleInstance Force

#Include "lib\window.ahk"
#Include "lib\text.ahk"

global App := Map(
    "editor", "Code.exe",
    "browser", "chrome.exe"
)

!1::FocusEditor()
!2::CleanClipboard()
```

- 主文件放入口、热键、全局配置
- `lib/*.ahk` 放窗口工具、文本处理、GUI 组件
- 共享状态尽量集中管理，不要到处隐式 `global`

### v2 语法要点

```autohotkey
name := "AHK"
count := 3

if count > 1 {
    MsgBox name " x " count
}

sum(a, b) {
    return a + b
}

double := (x) => x * 2
```

- 赋值统一用 `:=`
- 表达式化更彻底，字符串要显式加引号
- 支持箭头函数，适合短回调

### v1 升 v2 最常见坑

```autohotkey
; v1 风格，v2 不推荐
; MsgBox, Hello
; StringTrimLeft, out, in, 1

; v2 风格
MsgBox "Hello"
out := SubStr(input, 2)
```

- 旧命令式写法大多已经函数化
- `%var%` 这种旧式插值思路在 v2 里基本退出主舞台
- 数组和映射分开了，不要再把一切都塞进旧式 `Object`

### 完整脚本示例：窗口整理器

```autohotkey
#Requires AutoHotkey v2.0
#SingleInstance Force

apps := [
    "ahk_exe Code.exe",
    "ahk_exe chrome.exe",
    "ahk_exe WindowsTerminal.exe"
]

^!m::TileWindows(apps)

TileWindows(targets) {
    screenW := A_ScreenWidth
    screenH := A_ScreenHeight
    width := Floor(screenW / targets.Length)
    x := 0

    for target in targets {
        if !WinExist(target)
            continue

        WinRestore target
        WinMove x, 0, width, screenH, target
        x += width
    }
}
```

- 这个脚本展示了 `数组 + 函数 + 窗口 API`
- 用它扩展到“双屏布局”“会议模式”“写作模式”会很顺手

### 调试习惯

```autohotkey
OutputDebug "step 1"
ListVars
KeyHistory
```

- `OutputDebug`：配合调试器或日志查看器
- `ListVars`：检查当前变量状态
- `KeyHistory`：查按键识别和键值问题
