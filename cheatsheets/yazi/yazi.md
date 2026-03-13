---
title: Yazi 速查
lang: bash
version: v26.1.22
date: 2026-03-13
github: sxyazi/yazi
colWidth: 380px
---

# Yazi 速查

## 🚀 启动和退出
---
lang: bash
emoji: 🚀
link: https://yazi-rs.github.io/docs/quick-start
desc: 启动 Yazi 并获取帮助。
---

- `yazi` : 启动 Yazi
- `y` : 使用 shell wrapper（推荐）
- `q` : 退出 Yazi
- `Q` : 退出但不改变目录
- `F1` 或 `~` : 打开帮助菜单

---

## 📁 浏览文件和目录
---
lang: bash
emoji: 📁
link: https://yazi-rs.github.io/docs/quick-start
desc: 在文件管理器中导航。
---

### Vim 风格导航

- `h` : 退到上级目录
- `j` : 光标下移
- `k` : 光标上移
- `l` : 进入光标所在目录

### 方向键

- `← ↓ ↑ →` : 也可以使用方向键

### 快速跳转

- `g g` : 跳到顶部
- `G` : 跳到底部
- `K` : 向上移动 5 行
- `J` : 向下移动 5 行

---

## ✋ 选择文件
---
lang: bash
emoji: ✋
link: https://yazi-rs.github.io/docs/quick-start
desc: 单选、多选、全选操作。
---

### 单选/取消

- `Space` : 切换选择当前文件

### 批量选择

- `v` : 进入可视模式（追加选择）
- `V` : 进入可视模式（替换选择）
- `Ctrl+a` : 选择所有文件
- `Ctrl+r` : 反向选择所有文件
- `Esc` : 取消选择

---

## 📂 打开文件和目录
---
lang: bash
emoji: 📂
link: https://yazi-rs.github.io/docs/quick-start
desc: 打开文件、目录、应用程序。
---

### 打开文件

- `Enter` : 打开选中的文件
- `o` : 交互式选择打开方式
- `O` : 始终交互式选择
- `Shift+Enter` : 交互式打开（某些终端）

### 目录操作

- `Tab` : 显示文件信息

---

## 📋 复制和粘贴文件
---
lang: bash
emoji: 📋
link: https://yazi-rs.github.io/docs/quick-start
desc: 剪贴板操作。
---

- `y` : 复制（Yank）选中的文件
- `x` : 剪切选中的文件
- `p` : 粘贴文件
- `P` : 粘贴（覆盖已存在的文件）
- `X` : 取消 yank 状态

---

## 🗑️ 删除文件
---
lang: bash
emoji: 🗑️
link: https://yazi-rs.github.io/docs/quick-start
desc: 移动到回收站或永久删除。
---

- `d` : 移动到回收站
- `D` : 永久删除（需确认）

---

## ✏️ 重命名和创建文件
---
lang: bash
emoji: ✏️
link: https://yazi-rs.github.io/docs/quick-start
desc: 新建和重命名操作。
---

- `a` : 创建文件（末尾加 / 创建目录）
- `r` : 重命名选中的文件

---

## 🔗 创建链接
---
lang: bash
emoji: 🔗
link: https://yazi-rs.github.io/docs/quick-start
desc: 创建符号链接和硬链接。
---

- `-` : 创建符号链接（绝对路径）
- `_` : 创建符号链接（相对路径）
- `Ctrl+-` : 创建硬链接

---

## 📋 复制路径
---
lang: bash
emoji: 📋
link: https://yazi-rs.github.io/docs/quick-start
desc: 快速复制路径到剪贴板。
---

- `c c` : 复制文件路径
- `c d` : 复制目录路径
- `c f` : 复制文件名
- `c n` : 复制不带扩展名的文件名

---

## 🔍 搜索和过滤文件
---
lang: bash
emoji: 🔍
link: https://yazi-rs.github.io/docs/quick-start
desc: 查找和筛选文件。
---

### 过滤

- `f` : 过滤文件（实时）

### 查找（增量搜索）

- `/` : 查找下一个
- `?` : 查找上一个
- `n` : 下一个匹配
- `N` : 上一个匹配

### 搜索（使用 fd/rg）

- `s` : 按名称搜索（fd）
- `S` : 按内容搜索（ripgrep）
- `Ctrl+s` : 取消搜索

---

## 🗂️ 排序文件
---
lang: bash
emoji: 🗂️
link: https://yazi-rs.github.io/docs/quick-start
desc: 按不同条件排序。
---

- `, m` : 按修改时间排序
- `, M` : 按修改时间倒序
- `, b` : 按创建时间排序
- `, B` : 按创建时间倒序
- `, e` : 按扩展名排序
- `, E` : 按扩展名倒序
- `, a` : 按字母排序
- `, A` : 按字母倒序
- `, n` : 按自然排序
- `, N` : 按自然排序倒序
- `, s` : 按大小排序
- `, S` : 按大小倒序
- `, r` : 随机排序

---

## 🗃️ 多标签页
---
lang: bash
emoji: 🗃️
link: https://yazi-rs.github.io/docs/quick-start
desc: 管理多个标签页。
---

### 创建标签页

- `t` : 创建新标签页（当前目录）

### 切换标签页

- `1-9` : 切换到第 N 个标签
- `[` : 切换到上一个标签
- `]` : 切换到下一个标签

### 交换标签页

- `{` : 与上一个标签交换
- `}` : 与下一个标签交换

### 关闭标签页

- `Ctrl+c` : 关闭当前标签

---

## 💻 执行 Shell 命令
---
lang: bash
emoji: 💻
link: https://yazi-rs.github.io/docs/quick-start
desc: 在 Yazi 中运行命令。
---

- `;` : 执行 shell 命令（阻塞）
- `:` : 执行 shell 命令（阻塞）

---

## 👁️ 显示隐藏文件
---
lang: bash
emoji: 👁️
link: https://yazi-rs.github.io/docs/quick-start
desc: 切换隐藏文件显示。
---

- `z` : 显示/隐藏隐藏文件

---

## 🔧 常用配置和技巧
---
lang: bash
emoji: 🔧
link: https://yazi-rs.github.io
desc: 提升效率的技巧。
---

### Shell wrapper

```bash
function y() {
    local tmp="$(mktemp -t "yazi-cwd.XXXXXX")"
    cwd
    command yazi "$@" --cwd-file="$tmp"
    IFS= read -r -d '' cwd < "$tmp"
    [ "$cwd" != "$PWD" ] && [ -d "$cwd" ] && builtin cd -- "$cwd"
    rm -f -- "$tmp"
}
```

### 快速跳转

- `z` : 通过 zoxide 跳转
- `Z` : 通过 fzf 跳转
- `g Space` : 交互式选择目录
