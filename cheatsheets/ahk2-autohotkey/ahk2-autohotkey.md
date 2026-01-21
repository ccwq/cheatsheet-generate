# AutoHotkey v2 速查表

## 基础语法 (Basics)

### 脚本头 (Headers)
```autohotkey
; 强制要求 v2 版本
#Requires AutoHotkey v2.0
; 只允许一个实例运行
#SingleInstance Force
; 包含其他脚本
#Include "Lib\MyLib.ahk"
```

### 注释 (Comments)
```autohotkey
; 单行注释
/*
  多行注释
  可以包含多行文本
*/
```

### 热键与热字串 (Hotkeys & Hotstrings)
```autohotkey
; 热键: Ctrl(^) + Alt(!) + s
^!s::
{
    MsgBox "你按下了 Ctrl+Alt+S"
}

; 热字串: 输入 btw 后自动替换 (::)
::btw::by the way

; 带选项的热字串: * (立即触发), ? (即使在单词中也触发)
:*:ftw::for the win
```

## 按键列表 (Key List)

### 修饰符 (Modifiers)
```autohotkey
#   ; Win (Windows 徽标键)
!   ; Alt
^   ; Ctrl
+   ; Shift
&   ; 组合键 (例如: CapsLock & Esc::)
<   ; 左侧键 (例如: <^ 为左 Ctrl)
>   ; 右侧键 (例如: >! 为右 Alt)
*   ; 通配符: 即使按住修饰符也能触发
~   ; 穿透: 不屏蔽按键的原有功能
$   ; 钩子: 强制使用键盘钩子
UP  ; 释放: 在按键弹起时触发
```

### 鼠标 (Mouse)
```autohotkey
LButton    ; 左键
RButton    ; 右键
MButton    ; 中键 (滚轮按下)
XButton1   ; 侧键1 (通常为"后退")
XButton2   ; 侧键2 (通常为"前进")
WheelUp    ; 滚轮向上
WheelDown  ; 滚轮向下
WheelLeft  ; 滚轮向左
WheelRight ; 滚轮向右
```

### 键盘 (Keyboard)
```autohotkey
Space       ; 空格
Tab         ; 制表符
Enter       ; 回车
Escape      ; Esc
Backspace   ; 退格 (BS)
Delete      ; Del
Insert      ; Ins
Home        ; Home
End         ; End
PgUp        ; Page Up
PgDn        ; Page Down
Up, Down, Left, Right ; 方向键
```

### 系统与状态键
```autohotkey
CapsLock    ; 大写锁定
ScrollLock  ; 滚动锁定
NumLock     ; 数字锁定
PrintScreen ; 打印屏幕
CtrlBreak   ; Ctrl+Break
Pause       ; Pause/Break
AppsKey     ; 菜单键 (右 Win 旁)
```

### 数字小键盘 (Numpad)

**NumLock 开启时：**
```autohotkey
Numpad0 - Numpad9
NumpadDot   ; .
NumpadDiv   ; /
NumpadMult  ; *
NumpadAdd   ; +
NumpadSub   ; -
NumpadEnter ; Enter
```

**NumLock 关闭时：**
```autohotkey
NumpadIns   ; 0
NumpadEnd   ; 1
NumpadDown  ; 2
NumpadPgDn  ; 3
NumpadLeft  ; 4
NumpadClear ; 5
NumpadRight ; 6
NumpadHome  ; 7
NumpadUp    ; 8
NumpadPgUp  ; 9
NumpadDel   ; Dot
```

### 多媒体与网络 (Multimedia)
```autohotkey
Volume_Mute      ; 静音
Volume_Down      ; 音量减
Volume_Up        ; 音量加
Media_Next       ; 下一曲
Media_Prev       ; 上一曲
Media_Stop       ; 停止
Media_Play_Pause ; 播放/暂停
Browser_Back     ; 后退
Browser_Forward  ; 前进
Browser_Refresh  ; 刷新
Browser_Home     ; 主页
Launch_Mail      ; 邮件
```

### 游戏手柄 (Joystick)
```autohotkey
Joy1 - Joy32      ; 按键
JoyX, JoyY, JoyZ  ; 轴
JoyPOV            ; 视点帽
```

### 特殊代码 (Special)
```autohotkey
vkXX    ; 虚拟键 (Hex)
scYYY   ; 扫描码 (Hex)
vk41::MsgBox "A键"
sc01E::MsgBox "A键"
```

## 变量与类型 (Variables)

### 赋值 (Assignment)
```autohotkey
; v2 统一使用 := 进行赋值
name := "AutoHotkey"
version := 2.0
result := 1 + 2
```

### 字符串 (Strings)
```autohotkey
str1 := "双引号字符串"
str2 := '单引号字符串'
; 变量插值 (仅在字符串中不支持 %var%，需使用连接或 Format)
text := "Hello " name
text2 := Format("Version: {}", version)
```

### 内置变量 (Built-in)
```autohotkey
A_Clipboard ; 剪贴板内容
A_ScriptDir ; 脚本所在目录
A_UserName  ; 当前用户名
```

## 流程控制 (Control Flow)

### 条件判断 (If/Else)
```autohotkey
if (var = "value") {
    MsgBox "Equal"
} else if (var = "other") {
    MsgBox "Other"
} else {
    MsgBox "None"
}
```

### 循环 (Loops)
```autohotkey
; 普通循环
Loop 3 {
    MsgBox A_Index ; A_Index 为当前循环次数 (1-based)
}

; 文件循环
Loop Files, A_ScriptDir "\*.txt" {
    MsgBox A_LoopFileName
}

; 解析循环
Loop Parse, "one,two,three", "," {
    MsgBox A_LoopField
}
```

## 函数 (Functions)

### 定义与调用
```autohotkey
Add(x, y) {
    return x + y
}

result := Add(5, 10)
```

### 可选参数与默认值
```autohotkey
Greet(name, title := "Mr.") {
    MsgBox "Hello " title " " name
}
```

### 箭头函数 (Fat Arrow)
```autohotkey
Sum := (a, b) => a + b
MsgBox Sum(1, 2)
```

### 引用参数 (ByRef)
```autohotkey
Swap(&a, &b) {
    temp := a
    a := b
    b := temp
}
x := 1, y := 2
Swap(&x, &y)
```

## 对象与映射 (Objects & Maps)

### 数组 (Array)
```autohotkey
arr := [1, 2, 3]
arr.Push(4)
val := arr[1] ; 索引从 1 开始

; 遍历数组
for index, value in arr {
    MsgBox index ": " value
}
```

### 映射 (Map)
```autohotkey
colors := Map("Red", "FF0000", "Blue", "0000FF")
colors["Green"] := "00FF00"
hex := colors["Red"]

; 遍历映射
for key, val in colors {
    MsgBox key "=" val
}
```

### 对象 (Object)
```autohotkey
thing := {kind: "Box", weight: 10}
MsgBox thing.kind
```

## 类定义 (Class Definition)

### 基本语法
```autohotkey
class Hero {
    ; 实例变量
    name := "Unknown"
    
    ; 构造函数
    __New(name) {
        this.name := name
    }
    
    ; 实例方法
    SayHi() {
        MsgBox "Hi, " this.name
    }
}
p1 := Hero("Arthur")
```

### 静态成员与属性
```autohotkey
class App {
    static Version := "1.0"
    
    ; 属性访问器
    Width {
        get => this._w
        set {
            if value > 0
                this._w := value
        }
    }
}
```

## 文件对象 (File Object)

### 打开与读写
```autohotkey
; 打开文件 (r:只读, w:写入, a:追加, rw:读写)
f := FileOpen("test.txt", "w", "UTF-8")
f.Write("Hello World`n")
f.Close()

; 读取内容
f := FileOpen("test.txt", "r")
text := f.Read() ; 读取全部
line := f.ReadLine()
f.Close()
```

### 文件属性与移动
```autohotkey
; 指针操作
f.Pos := 0      ; 移动到开头
pos := f.Pos    ; 获取当前位置
f.Seek(0, 2)    ; 移动到末尾 (Origin: 0=Start, 1=Current, 2=End)

; 编码
f.Encoding := "UTF-8"
```

## 系统交互 (System Interaction)

### 注册表 (Registry)
```autohotkey
; 读取
val := RegRead("HKCU\Software\MyKey", "MyValue", "Default")

; 写入
RegWrite("NewValue", "REG_SZ", "HKCU\Software\MyKey", "MyValue")

; 删除
RegDelete("HKCU\Software\MyKey", "MyValue")
```

### 剪贴板 (Clipboard)
```autohotkey
; 读写文本
A_Clipboard := "New Text"
text := A_Clipboard

; 等待剪贴板包含数据
ClipWait(2) ; 等待 2 秒

; 监听剪贴板变化
OnClipboardChange ClipChanged
ClipChanged(type) {
    MsgBox "Clipboard changed! Type: " type
}
```

### 环境变量与进程
```autohotkey
; 环境变量
path := EnvGet("PATH")
EnvSet("MY_VAR", "123")

; 进程操作
RunWait "notepad.exe" ; 等待关闭
ProcessSetPriority "High"
if ProcessExist("notepad.exe")
    ProcessClose "notepad.exe"
```

## DllCall 调用

### 基础示例 (MessageBox)
```autohotkey
; 调用 Windows API MessageBox
; int MessageBox(HWND hWnd, LPCTSTR lpText, LPCTSTR lpCaption, UINT uType);
DllCall("user32\MessageBox", 
    "Ptr", 0, 
    "Str", "Message Text", 
    "Str", "Title", 
    "UInt", 0)
```

### 获取系统信息
```autohotkey
; 获取屏幕宽度 (SM_CXSCREEN = 0)
w := DllCall("GetSystemMetrics", "Int", 0, "Int")
MsgBox "Screen Width: " w
```

### 结构体传递 (RECT)
```autohotkey
; 预分配内存
rect := Buffer(16, 0)
; 获取窗口矩形
DllCall("GetWindowRect", "Ptr", WinExist("A"), "Ptr", rect)
; 读取数值 (NumGet)
left := NumGet(rect, 0, "Int")
top := NumGet(rect, 4, "Int")
```

## 图形界面 (GUI)

### 创建窗口
```autohotkey
myGui := Gui("+Resize", "My Window Title")
myGui.Opt("+AlwaysOnTop")

; 事件绑定
myGui.OnEvent("Close", (*) => ExitApp())
```

### 添加控件
```autohotkey
myGui.Add("Text",, "Please enter your name:")
myEdit := myGui.Add("Edit", "w200")
myBtn := myGui.Add("Button", "Default", "OK")

; 列表视图
lv := myGui.Add("ListView", "r5 w200", ["Name", "Size"])
lv.Add(, "File1", "10KB")
```

### 事件处理
```autohotkey
myBtn.OnEvent("Click", MyBtn_Click)

MyBtn_Click(*) {
    saved := myEdit.Value
    MsgBox "You entered: " saved
}
```

### 显示
```autohotkey
myGui.Show()
```

## 常用操作 (Common)

### 运行程序
```autohotkey
Run "notepad.exe"
Run "https://www.google.com"
```

### 窗口操作
```autohotkey
if WinExist("Untitled - Notepad")
    WinActivate
else
    Run "Notepad"
```

### 发送按键
```autohotkey
Send "^c" ; 发送 Ctrl+C
SendInput "{Text}Hello World" ; 发送纯文本
```

## v1 vs v2 差异 (Differences)

### 语法变更
- **表达式**: v2 中几乎所有参数都是表达式。不需要 `%var%`，字符串必须加引号。
  - v1: `MsgBox, Text %var%`
  - v2: `MsgBox "Text " var`
- **命令移除**: 传统命令（如 `MsgBox Text`）已移除，全部变为函数（`MsgBox("Text")` 或 `MsgBox "Text"`）。
- **赋值**: 移除了 `=` 赋值，仅保留 `:=`。
- **作用域**: 函数默认不再假定全局变量，需显式声明 `Global` 或使用 `MyVar` (若未定义局部)。

### 数据结构
- v1 的 `Object` 混用了数组和关联数组。
- v2 区分了 `Array` (线性整数索引) 和 `Map` (键值对)。
