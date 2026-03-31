---
title: Neovim 速查 + Cookbook
lang: bash
version: "0.12.0"
date: "2026-03-29"
github: neovim/neovim
colWidth: 420px
---

# Neovim 速查 + Cookbook

## 快速定位
---
lang: bash
emoji: 🔎
link: https://neovim.io/doc/user/quickref.html
desc: Neovim 是基于模式的终端编辑器。先记住“打开文件 -> 进普通模式 -> 移动 -> 修改 -> 保存退出”这个循环，再扩展到窗口、搜索、宏和终端。
---

- 最短路径就是 `nvim file.txt`、`Esc`、`w/b/gg/G`、`i/a/o`、`:wq`
- 三个核心模式是普通、插入、可视
- Neovim 常用额外入口有 `:terminal`、`Ctrl-\ Ctrl-n`、`Ctrl-\ Ctrl-o`、`:checkhealth`、`:lua`
- 不确定时先查 `:help {topic}`、`:help index`、`K`

```bash
# 最小工作流
nvim app.js
Esc
/TODO
ciwDONE
Esc
:wq
```

## Cookbook: 起手式
---
lang: bash
emoji: ⚡
link: https://neovim.io/doc/user/usr_02.html
desc: 先把“进入、移动、修改、保存”跑顺。大多数编辑动作都能在这条回路里完成。
---

- `nvim file.txt`: 打开文件
- `nvim +12 file.txt`: 打开后跳到第 12 行
- `nvim +/keyword file.txt`: 打开后直接搜索关键字
- `Esc`: 回到普通模式
- `i` / `a` / `I` / `A`: 在光标前、后、行首、行尾进入插入模式
- `o` / `O`: 在下方、上方新开一行并进入插入模式
- `:w` / `:wq` / `:q` / `:q!`: 保存、保存退出、退出、强制退出

```bash
# 先开文件，再改，再存
nvim src/main.ts
/name
ciwuserName
Esc
:w
```

## Cookbook: 高频套路
---
lang: bash
emoji: 🧭
link: https://neovim.io/doc/user/motion.html
desc: 这几类场景最常见：改一个词、改一段、搜后批量替换、多文件对照、打开终端再返回。
---

- `/old` -> `ciwnew` -> `Esc`: 改一个词
- `C`: 改到行尾
- `yy`: 复制当前行
- `p` / `P`: 粘贴当前行
- `V` -> `>` / `<`: 选中后整体缩进
- `/pattern` -> `n` -> `.`: 搜索后继续修改
- `:vsp other.ts` -> `Ctrl-w l` -> `Ctrl-w h`: 多文件对照
- `:terminal`: 进入终端
- `Ctrl-\ Ctrl-n`: 从终端回普通模式
- `Ctrl-\ Ctrl-o`: 在终端里临时执行一次普通模式命令

```bash
# 批量改同一类词
/old_name
ciwnew_name
Esc
n
.
```

```bash
# 左右对照两个文件
:vsp config.example.yml
Ctrl-w l
/timeout
Ctrl-w h
/timeout
```

## Cookbook: 搜索、替换、宏
---
lang: bash
emoji: 🔍
link: https://neovim.io/doc/user/repeat.html
desc: 先缩小范围，再批量修改。规则固定用替换，步骤复杂用宏。
---

- `/pattern` / `?pattern`: 向下、向上搜索
- `n` / `N`: 下一个、上一个匹配
- `*` / `#`: 搜索当前词的下一个、上一个匹配
- `:%s/old/new/g`: 全文件替换
- `:%s/old/new/gc`: 全文件逐个确认替换
- `:g/pattern/cmd`: 对匹配行执行命令
- `:v/pattern/cmd`: 对不匹配行执行命令
- `qa ... q`: 录制寄存器 `a` 的宏
- `@a`: 执行寄存器 `a` 的宏
- `@@`: 重复上一次宏
- `.`: 重复上一次修改

```bash
# 先确认，再替换
/TODO
n
:%s/TODO/DONE/gc
```

## 常见坑
---
lang: bash
emoji: 🧪
link: https://neovim.io/doc/user/faq.html
desc: 出问题先看模式、帮助、健康检查和最近消息。多数异常都能快速定位。
---

- `i`: 多半还在普通模式，按它进插入模式
- `:set clipboard?`: 先查剪贴板状态，再看终端 OSC52 和系统剪贴板能力
- `nvim --clean`: 先试最小配置
- `nvim -u NONE`: 先排除用户配置
- `:checkhealth`: 看诊断入口
- `:messages`: 看最近提示
- `Ctrl-g`: 看当前文件和光标位置
- `:help {topic}` / `:help index`: 查帮助

## 快捷键：模式切换
---
lang: bash
emoji: ⌨️
link: https://neovim.io/doc/user/intro.html
desc: 先把普通、插入、可视和终端模式的边界记牢。模式切错时，很多“按键没反应”其实只是命令被当成了输入。
---

- `Esc`: 回到普通模式
- `i` / `a`: 在光标前、后进入插入模式
- `I` / `A`: 在行首、行尾进入插入模式
- `o` / `O`: 在下方、上方新开一行并进入插入模式
- `s` / `S`: 删除字符、删除整行后进入插入模式
- `R`: 进入覆盖模式
- `v` / `V` / `Ctrl-v`: 字符、行、块可视模式
- `gv`: 重新选中上一次可视选择
- `Ctrl-\ Ctrl-n`: 从终端模式回到普通模式
- `Ctrl-\ Ctrl-o`: 在终端模式下执行一次普通模式命令

## 快捷键：基础移动
---
lang: bash
emoji: 🧭
link: https://neovim.io/doc/user/motion.html
desc: 移动决定了后面的编辑范围。把字、词、行、屏、文件这五层记住，后面会顺很多。
---

- `h` / `j` / `k` / `l`: 左、下、上、右
- `w` / `W`: 到下一个单词、WORD 开头
- `b` / `B`: 到上一个单词、WORD 开头
- `e` / `E`: 到单词、WORD 结尾
- `ge` / `gE`: 到上一个单词、WORD 结尾
- `0` / `^` / `$` / `g_`: 行首、非空行首、行尾、非空行尾
- `gg` / `G`: 文件头、文件尾
- `H` / `M` / `L`: 屏幕顶部、中部、底部
- `f{char}` / `F{char}`: 向前、向后跳到字符
- `t{char}` / `T{char}`: 向前、向后跳到字符前一位
- `;` / `,`: 重复上一次 `fFtT`
- `%`: 跳到括号配对
- `(` / `)`: 跳到前一个、后一个句子
- `{` / `}`: 跳到前一个、后一个段落
- `Ctrl-d` / `Ctrl-u`: 向下、向上翻半屏
- `Ctrl-f` / `Ctrl-b`: 向下、向上翻整屏
- `Ctrl-e` / `Ctrl-y`: 向下、向上滚一行
- `zz` / `zt` / `zb`: 当前行居中、置顶、置底

## 快捷键：编辑与删除
---
lang: bash
emoji: ✏️
link: https://neovim.io/doc/user/change.html
desc: 这张卡覆盖最常见的文本修改动作，优先记删除、修改、撤销、重复和缩进。
---

- `x` / `X`: 删除光标处、前一个字符
- `dd`: 删除整行
- `D`: 删除到行尾
- `dw` / `db`: 删除到下一个、上一个单词边界
- `diw` / `daw`: 删除当前单词、当前单词含空格
- `cw` / `cW`: 修改当前单词、WORD
- `ciw` / `caw`: 修改当前单词、当前单词含空格
- `cc`: 修改整行
- `C`: 修改到行尾
- `r{char}`: 替换单个字符
- `R`: 覆盖模式
- `J` / `gJ`: 连接行，保留或不保留空格
- `u`: 撤销
- `Ctrl-r`: 重做
- `.`: 重复上一次修改
- `~`: 切换字符大小写
- `gu` / `gU`: 转小写、转大写
- `g~`: 反转大小写
- `>>` / `<<`: 当前行右移、左移
- `==`: 自动缩进当前行
- `=ap`: 自动缩进当前段落

## 快捷键：复制与寄存器
---
lang: bash
emoji: 📋
link: https://neovim.io/doc/user/change.html
desc: 复制粘贴不只是 `y` 和 `p`。寄存器、黑洞寄存器和系统剪贴板一起记，效率会高很多。
---

- `y` / `yy`: 复制选中内容、复制当前行
- `Y`: 复制当前行到行尾
- `p` / `P`: 在后方、前方粘贴
- `gp` / `gP`: 粘贴后把光标放到粘贴内容后、前
- `"{reg}`: 选择寄存器
- `"+y` / `"+p`: 复制到、粘贴自系统剪贴板
- `"*y` / `"*p`: 复制到、粘贴自主剪贴板
- `"_d`: 丢弃到黑洞寄存器
- `:reg`: 查看寄存器

## 快捷键：可视模式
---
lang: bash
emoji: 🧱
link: https://neovim.io/doc/user/visual.html
desc: 当修改范围不是单点，而是一块区域时，就切到可视模式。
---

- `v` / `V` / `Ctrl-v`: 字符、行、块选择
- `o`: 在可视选择的另一端跳转
- `O`: 在块选择中切换另一角
- `d` / `y` / `c`: 删除、复制、修改选中内容
- `>` / `<`: 右移、左移选中内容
- `=`: 自动缩进选中内容
- `r{char}`: 用单个字符替换选区
- `~`: 切换选区大小写
- `gv`: 重新选中上一次可视选择

## 快捷键：搜索与替换
---
lang: bash
emoji: 🔍
link: https://neovim.io/doc/user/pattern.html
desc: 先搜索，再替换；先确认范围，再批量改。规则固定就用替换，变化多就用宏。
---

- `/pattern` / `?pattern`: 向下、向上搜索
- `n` / `N`: 下一个、上一个匹配
- `*` / `#`: 搜索当前词的下一个、上一个匹配
- `g*` / `g#`: 搜索当前词的部分匹配
- `:noh`: 取消搜索高亮
- `:s/old/new/`: 替换当前行
- `:%s/old/new/g`: 替换整个文件
- `:%s/old/new/gc`: 替换整个文件并逐个确认
- `:g/pattern/d`: 删除匹配行
- `:v/pattern/d`: 删除不匹配行
- `&`: 重复上一次替换
- `g&`: 对整文件重复上一次替换
- `qa ... q`: 录制寄存器 `a` 的宏
- `@a`: 执行寄存器 `a` 的宏
- `@@`: 重复上一次宏

## 快捷键：标记与跳转
---
lang: bash
emoji: 🎯
link: https://neovim.io/doc/user/motion.html
desc: 标记和跳转适合在大文件、跨文件和多次修改之间来回切换。
---

- `m{a-zA-Z}`: 设置标记
- `` `{mark}` ``: 精确跳到标记位置
- `'a`: 跳到标记所在行，精确位置用 `` `{mark}` ``
- `''`: 返回上一个跳转位置
- `Ctrl-o`: 回到上一个跳转位置
- `Ctrl-i`: 前进到下一个跳转位置
- `g;` / `g,`: 跳到上一个、下一个修改位置
- `:marks`: 查看标记
- `:jumps`: 查看跳转历史
- `:changes`: 查看修改历史
- `gf`: 打开光标下的文件名
- `gF`: 打开光标下的文件名并跳到行号
- `Ctrl-]`: 跳转到标签定义
- `Ctrl-t`: 返回标签栈上一层
- `K`: 打开光标下单词的帮助

## 快捷键：文本对象
---
lang: bash
emoji: 🧩
link: https://neovim.io/doc/user/usr_04.html
desc: 文本对象是 Neovim 最值得记的一层能力，适合把操作直接作用在“词、句、段、括号块”上。
---

- `iw` / `aw`: 当前单词、当前单词含空格
- `iW` / `aW`: 当前 WORD、当前 WORD 含空格
- `is` / `as`: 当前句子、当前句子含空格
- `ip` / `ap`: 当前段落、当前段落含空格
- `i"` / `a"`: 双引号内、包含双引号
- `i'` / `a'`: 单引号内、包含单引号
- `i(` / `a(`: 圆括号内、包含圆括号
- `i[` / `a[`: 方括号内、包含方括号
- `i{` / `a{`: 花括号内、包含花括号
- `i<` / `a<`: 尖括号内、包含尖括号
- `ciw` / `diw` / `yiw`: 修改、删除、复制当前单词
- `cit` / `cat`: 修改、删除 HTML/XML 标签内内容

## 快捷键：窗口、分屏、标签、缓冲区
---
lang: bash
emoji: 🪟
link: https://neovim.io/doc/user/windows.html
desc: 多文件工作时，真正省时间的是窗口、标签和缓冲区之间的切换。
---

- `:sp` / `:vsp`: 水平、垂直分屏
- `Ctrl-w s` / `Ctrl-w v`: 水平、垂直分屏
- `Ctrl-w w`: 切到下一个窗口
- `Ctrl-w h` / `j` / `k` / `l`: 切到左、下、上、右窗口
- `Ctrl-w t` / `Ctrl-w b`: 切到最上、最下窗口
- `Ctrl-w c`: 关闭当前窗口
- `Ctrl-w o`: 只保留当前窗口
- `Ctrl-w x`: 交换当前窗口与下一个窗口
- `Ctrl-w =`: 平衡所有窗口大小
- `Ctrl-w +` / `Ctrl-w -`: 增加、减少窗口高度
- `Ctrl-w >` / `Ctrl-w <`: 增加、减少窗口宽度
- `Ctrl-w H` / `J` / `K` / `L`: 把当前窗口移到最左、最下、最上、最右
- `Ctrl-w r`: 与下一个窗口交换位置
- `Ctrl-w T`: 把当前窗口移到新标签页
- `:tabnew` / `:tabedit`: 新建标签页、在标签页中打开文件
- `gt` / `gT`: 下一个、上一个标签页
- `:tabnext` / `:tabprev`: 切到下一个、上一个标签页
- `:tabclose`: 关闭当前标签页
- `:tabonly`: 只保留当前标签页
- `:ls` / `:buffers`: 查看缓冲区
- `:b {nr|name}`: 切换缓冲区
- `:bn` / `:bp`: 下一个、上一个缓冲区
- `:bd`: 关闭当前缓冲区

## 快捷键：宏与批量
---
lang: bash
emoji: 🧮
link: https://neovim.io/doc/user/repeat.html
desc: 规则固定时优先替换，步骤复杂或每行略有差异时就录宏。
---

- `qa ... q`: 录制寄存器 `a` 的宏
- `q`: 结束录制
- `@a`: 执行寄存器 `a` 的宏
- `@@`: 重复上一次宏
- `:normal {cmd}`: 对选中范围执行普通模式命令
- `:global /pattern/ {cmd}`: 对匹配行批量执行命令

## 快捷键：命令行、终端、Neovim 特有
---
lang: bash
emoji: 🛠️
link: https://neovim.io/doc/user/cmdline.html
desc: 这一组是 Neovim 相比传统 Vim 更常用的入口，尤其是终端、健康检查和 Lua 配置。
---

- `:`: 进入 Ex 命令行
- `q:` / `q/`: 打开命令、搜索历史窗口
- `Ctrl-b` / `Ctrl-e`: 命令行首尾
- `Ctrl-u` / `Ctrl-w`: 清除到开头、删掉前一个词
- `Ctrl-r {reg}`: 在命令行插入寄存器内容
- `Tab` / `Ctrl-d`: 补全、列出补全
- `:terminal`: 打开内置终端
- `:checkhealth`: 运行健康检查
- `:messages`: 查看最近消息
- `:scriptnames`: 查看已加载脚本
- `:source %`: 重新加载当前脚本
- `:luafile %`: 重新执行当前 Lua 文件
- `nvim --clean`: 用最小配置启动
- `nvim -u NONE`: 不加载用户配置启动
