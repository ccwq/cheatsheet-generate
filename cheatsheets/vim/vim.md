---
title: Vim 速查
lang: bash
version: "9.1"
date: 2026-04-02
github: vim/vim
colWidth: 380px
---

# Vim 速查

## 快捷键: 快速退出 ZZ / ZQ
---
lang: bash
link: https://vimhelp.org/quickref.txt.html
desc: ZZ 和 ZQ 是 Vim 最被低估的两个内置快捷键——无需进入命令模式，直接在普通模式按两键完成保存退出或强制退出。
---

- `ZZ`: 保存并退出（等价于 `:wq`）
- `ZQ`: 放弃修改并退出（等价于 `:q!`）

```bash
# 普通模式直接按，不用输入冒号
ZZ    # 保存 + 退出
ZQ    # 强制退出 + 放弃修改
```

## Cookbook: 起手式
---
lang: bash
link: https://vimhelp.org/usr_02.txt.html
desc: 把 Vim 当成键盘优先的文本工作台。先记住进入、修改、退出三步，后面的命令都在这个循环里展开。
---

- `vim file.txt`: 打开文件
- `vim +12 file.txt`: 打开文件并跳到第 12 行
- `vim +/keyword file.txt`: 打开文件并搜索 keyword
- `i`: 在光标前进入插入模式
- `a`: 在光标后进入插入模式
- `o`: 在下方新开一行并进入插入模式
- `Esc`: 回到普通模式
- `:w`: 保存
- `:wq`: 保存并退出
- `:q!`: 放弃修改并退出

```bash
# 最小工作流
vim app.js
i
# 输入内容
Esc
:wq
```

## Cookbook: 移动和选中
---
lang: bash
link: https://vimhelp.org/usr_03.txt.html
desc: Vim 的效率来自按词、按行、按屏移动，而不是一格一格挪光标。
---

- `h`: 左移
- `j`: 下移
- `k`: 上移
- `l`: 右移
- `w`: 跳到下一个单词开头
- `b`: 跳到上一个单词开头
- `e`: 跳到单词结尾
- `0`: 跳到行首
- `^`: 跳到非空行首
- `$`: 跳到行尾
- `gg`: 跳到文件开头
- `G`: 跳到文件结尾
- `:42`: 跳到第 42 行
- `Ctrl+d`: 向下滚动半屏
- `Ctrl+u`: 向上滚动半屏
- `v`: 字符选中
- `V`: 按行选中
- `Ctrl+v`: 块选中

```bash
# 找函数并选中附近几行
/function
n
V
5j
```

## Cookbook: 高频编辑
---
lang: bash
link: https://vimhelp.org/change.txt.html
desc: 最常用的是删、改、复制、重复。记住动作和范围的组合，比死记命令表更有效。
---

- `x`: 删除当前字符
- `dd`: 删除整行
- `dw`: 删除到词尾
- `D`: 删除到行尾
- `yy`: 复制当前行
- `p`: 在后方粘贴
- `u`: 撤销
- `Ctrl+r`: 重做
- `.`: 重复上一次修改
- `ciw`: 修改当前单词
- `C`: 修改到行尾
- `>>`: 当前行右缩进
- `<<`: 当前行左缩进
- `gg=G`: 格式化整个文件

```bash
# 连续修改多个同名变量
/old_name
ciwnew_name
Esc
n
.
```

## Cookbook: 搜索和批量处理
---
lang: bash
link: https://vimhelp.org/usr_12.txt.html
desc: 先搜索确认范围，再决定是替换、确认替换，还是录宏。不要一上来就全量改。
---

- `/pattern`: 向下搜索
- `?pattern`: 向上搜索
- `n`: 下一个匹配
- `N`: 上一个匹配
- `*`: 向下搜索当前词
- `#`: 向上搜索当前词
- `:s/old/new/g`: 替换当前行
- `:%s/old/new/g`: 替换整个文件
- `:%s/old/new/gc`: 替换整个文件并逐个确认
- `qa`: 开始录制宏到寄存器 a
- `q`: 结束录制宏
- `@a`: 执行寄存器 a 的宏

```bash
# 先确认再替换
/TODO
n
:%s/TODO/DONE/gc
```

## Cookbook: 多文件和跳转
---
lang: bash
link: https://vimhelp.org/windows.txt.html
desc: 实际写代码时，经常要在多个文件、多个窗口和几个关键位置之间来回切换。
---

- `:e other.txt`: 打开另一个文件
- `:sp`: 水平分屏
- `:vsp`: 垂直分屏
- `Ctrl+w h`: 切到左侧窗口
- `Ctrl+w l`: 切到右侧窗口
- `Ctrl+w =`: 平衡窗口大小
- `:tabnew`: 新建标签页
- `gt`: 下一个标签页
- `gT`: 上一个标签页
- `ma`: 设置标记 a
- `` `a ``: 跳回标记 a 的精确位置
- `Ctrl+o`: 回到上一个跳转位置

```bash
# 左右对照两个文件
:vsp config.example.yml
Ctrl+w l
/timeout
Ctrl+w h
/timeout
```

## 快捷键: 折叠
---
lang: bash
link: https://vimhelp.org/fold.txt.html
desc: 代码块折叠是阅读大文件的利器，折叠命令覆盖开、关、嵌套和导航。
---

- `za`: 打开/关闭当前折叠
- `zA`: 递归切换当前折叠
- `zo`: 打开当前折叠
- `zO`: 递归打开当前折叠
- `zc`: 关闭当前折叠
- `zC`: 递归关闭当前折叠
- `zM`: 关闭所有折叠
- `zR`: 打开所有折叠
- `zm`: 增加折叠层级（更多折叠）
- `zr`: 减少折叠层级（更少折叠）
- `zd`: 删除当前折叠
- `zE`: 删除窗口内所有折叠
- `zj`: 跳到下一个折叠处
- `zk`: 跳到上一个折叠处
- `[z`: 跳到当前折叠的开头
- `]z`: 跳到当前折叠的结尾
- `z=`: 显示折叠建议（需要 manual fold 或基于缩进）

```bash
# 快速折叠/展开当前区块
za

# 关闭所有折叠专注顶部
zM

# 打开所有折叠
zR
```

## 快捷键: 大小写与数字
---
lang: bash
link: https://vimhelp.org/change.txt.html
desc: 大小写切换和数字增删是高频操作，gU/gu 比手动重打快得多。
---

- `g~`: 反转当前字符大小写
- `gUU`: 当前行转大写
- `guu`: 当前行转小写
- `gUaw`: 当前单词转大写
- `guaw`: 当前单词转小写
- `Ctrl+a`: 数字加 1
- `Ctrl+x`: 数字减 1
- `5Ctrl+a`: 数字加 5
- `10Ctrl+x`: 数字减 10
- `ga`: 显示光标处字符的 ASCII/Unicode 值
- `g8`: 显示光标处 UTF-8 字节序列

```bash
# 快速递增数字
Ctrl+a
10Ctrl+x

# 整行转大写
gUU
```

## 快捷键: 光标屏幕定位
---
lang: bash
link: https://vimhelp.org/scroll.txt.html
desc: zt/zz/zb 把当前行定位到屏幕顶部/中部/底部，比滚屏再校准更直接。
---

- `zt`: 当前行移到屏幕顶部
- `zz`: 当前行移到屏幕中部
- `zb`: 当前行移到屏幕底部
- `z.`: 重画并将光标行放到屏幕中部（等价 zz）
- `z-`: 重画并将光标行放到屏幕底部（等价 zb）
- `z<CR>`: 重画并将光标行放到屏幕顶部（等价 zt）
- `Ctrl+y`: 向上滚动一行（保持光标位置）
- `Ctrl+e`: 向下滚动一行

```bash
# 搜索匹配后快速将匹配行居中
/TODO
zz
```

## 快捷键: 寄存器与粘贴
---
lang: bash
link: https://vimhelp.org/change.txt.html
desc: Vim 有多个寄存器，复制删除默认到 " 寄存器，系统粘贴板是 + 或 *。
---

- `:reg`: 查看所有寄存器内容
- `"ay`: 复制到寄存器 a
- `"bdd`: 删除到寄存器 b
- `"ap`: 粘贴寄存器 a 的内容
- `"+y`: 复制到系统粘贴板（需要 +clipboard 支持）
- `"+p`: 粘贴系统粘贴板内容
- `gp`: 粘贴并把光标移到新内容之后
- `gP`: 在前方粘贴并把光标移到新内容之后
- `:ls`: 列出所有缓冲区

```bash
# 查看寄存器
:reg

# 复制到命名寄存器 a
"ayy

# 粘贴并移动光标到内容之后
gp
```

## 快捷键: 启动与多文件
---
lang: bash
link: https://vimhelp.org/starting.txt.html
desc: Vim 支持启动时直接分屏、打开多个文件、进入标签页，适合脚本和快速对比。
---

- `vim -o file1 file2`: 水平分屏打开多个文件
- `vim -O file1 file2`: 垂直分屏打开多个文件
- `vim -p file1 file2`: 多标签页打开（Vim 7+）
- `vim -d file1 file2`: Diff 模式打开两文件对比
- `:args`: 显示参数列表
- `:next`: 下一个文件（参数列表）
- `:prev`: 上一个文件
- `:argdo {cmd}`: 对参数列表所有文件执行命令
- `:bufdo {cmd}`: 对所有缓冲区执行命令
- `:all`: 为参数列表每个文件开窗口
- `Ctrl+w T`: 将当前窗口移到新标签页

```bash
# 垂直分屏对比两个配置
vim -O config.yml config.example.yml

# Diff 模式对比
vim -d old.txt new.txt
```

## Cookbook: 常见场景
---
lang: bash
link: https://vimhelp.org/quickref.txt.html
desc: 不想背完整体系时，先记住这些直接可用的高频动作。
---

- `ciw`: 改当前单词
- `C`: 改到行尾
- `yyp`: 复制当前行并在下方插入
- `V`: 选中当前行
- `>`: 右移选中的代码
- `gg=G`: 全文件格式化
- `*`: 搜索当前变量下一处
- `ci(`: 修改括号内内容
- `g;`: 回到最近一次修改位置
- `.`: 再执行一次刚才的修改

## 快捷键: 模式和退出
---
lang: bash
link: https://vimhelp.org/quickref.txt.html
desc: 这组是最早要形成肌肉记忆的按键。
---

- `i`: 在光标前插入
- `a`: 在光标后插入
- `I`: 在行首插入
- `A`: 在行尾插入
- `o`: 下方开新行并插入
- `O`: 上方开新行并插入
- `s`: 删除当前字符后插入
- `S`: 删除当前行后插入
- `Esc`: 回普通模式
- `:w`: 保存
- `:wq`: 保存退出
- `:q!`: 强制退出

## 快捷键: 移动
---
lang: bash
link: https://vimhelp.org/usr_03.txt.html
desc: 建议按字符、单词、行、文件四层去记。
---

- `h j k l`: 基础四向移动
- `w b e ge`: 按单词移动
- `0 ^ $ g_`: 行首、非空行首、行尾、非空行尾
- `f{char}`: 向前跳到字符
- `F{char}`: 向后跳到字符
- `t{char}`: 向前跳到字符前
- `gg`: 文件头
- `G`: 文件尾
- `H`: 屏幕顶部
- `M`: 屏幕中部
- `L`: 屏幕底部
- `Ctrl+f`: 下一页
- `Ctrl+b`: 上一页
- `%`: 括号配对跳转

## 快捷键: 编辑
---
lang: bash
link: https://vimhelp.org/change.txt.html
desc: 这组覆盖最常见的文本修改动作。
---

- `x X`: 删除当前字符或前一个字符
- `dd D`: 删除整行或删除到行尾
- `cw cc C`: 改单词、改整行、改到行尾
- `r R`: 替换一个字符或进入替换模式
- `yy yw y$`: 复制整行、复制到词尾、复制到行尾
- `p P`: 向后或向前粘贴
- `u Ctrl+r .`: 撤销、重做、重复上次修改
- `>> << ==`: 缩进、反缩进、自动缩进当前行

## 快捷键: 文本对象
---
lang: bash
link: https://vimhelp.org/textobjects.txt.html
desc: 文本对象是 Vim 提速最明显的一组能力。
---

- `iw aw`: 当前词，或带两边空格的整个词
- `ip ap`: 当前段落，或整个段落
- `i" a"`: 双引号内，或包含双引号
- `i' a'`: 单引号内，或包含单引号
- `i( a(`: 圆括号内，或包含圆括号
- `i[ a[`: 方括号内，或包含方括号
- `i{ a{`: 花括号内，或包含花括号
- `diw ciw yiw`: 删除、修改、复制当前词
- `ci" da(`: 修改引号内内容，删除整组括号内容

## 快捷键: 搜索窗口宏
---
lang: bash
link: https://vimhelp.org/windows.txt.html
desc: 这组用于跨位置、跨窗口、跨重复动作地工作。
---

- `/pattern`: 向下搜索
- `?pattern`: 向上搜索
- `n N`: 下一个和上一个匹配
- `ma mb`: 设置标记 a 和 b
- `` `a ``: 跳到标记 a 的精确位置
- `'a`: 跳到标记 a 所在行
- `qa`: 录制宏到寄存器 a
- `@a`: 执行寄存器 a 的宏
- `:sp :vsp`: 水平分屏和垂直分屏
- `Ctrl+w w`: 切到下一个窗口
- `:tabnew gt gT`: 新标签页，下一个标签页，上一个标签页

## 常见问题: 为什么字母没有输入到文件里
---
lang: bash
link: https://vimhelp.org/usr_02.txt.html
desc: 通常是因为你还在普通模式。普通模式下按键会被当成命令。
---

- `i`: 在光标前进入插入模式
- `a`: 在光标后进入插入模式
- `o`: 新开一行并进入插入模式
- `Esc`: 输入结束后回普通模式
- `-- INSERT --`: 左下角看到这个提示，说明已经在插入模式

## 常见问题: 保存或退出时报错怎么办
---
lang: bash
link: https://vimhelp.org/editing.txt.html
desc: 先区分是权限问题，还是缓冲区中还有未处理的修改。
---

- `:q!`: 放弃修改并退出
- `:wq`: 保存并退出
- `:w`: 只保存不退出
- `:w !sudo tee %`: 无权限写入时可借助 sudo 保存

## 常见问题: 粘贴后缩进乱了怎么办
---
lang: bash
link: https://vimhelp.org/options.txt.html
desc: 多数情况下是自动缩进影响了终端粘贴结果。
---

- `:set paste`: 临时启用粘贴模式
- `:set nopaste`: 粘贴结束后关闭粘贴模式
- `gg=G`: 重新格式化当前文件
- `:set ts? sw? et?`: 查看缩进相关选项

## 常见问题: 搜索大小写不符合预期
---
lang: bash
link: https://vimhelp.org/pattern.txt.html
desc: 搜索大小写同时受选项和搜索模式影响。
---

- `:set ignorecase`: 默认忽略大小写
- `:set smartcase`: 模式含大写字母时自动区分大小写
- `/\\cpattern`: 当前搜索强制忽略大小写
- `/\\Cpattern`: 当前搜索强制区分大小写

## 常见问题: 宏和替换该怎么选
---
lang: bash
link: https://vimhelp.org/repeat.txt.html
desc: 规则固定就用替换，步骤复杂或每行略有差异就用宏。
---

- `:s`: 当前行做替换
- `:%s`: 全文件做替换
- `:%s/foo/bar/gc`: 全文件替换并逐个确认
- `qa`: 录制一段宏
- `@a`: 执行寄存器 a 中的宏
- `.`: 重复最近一次修改
