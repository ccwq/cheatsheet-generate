---
title: Lazygit 速查
lang: bash
version: "0.40.2"
date: 2026-03-11
github: jesseduffield/lazygit
colWidth: 420px
---

## 📦 安装

---

emoji: 📦
link: https://github.com/jesseduffield/lazygit#installation
desc: 多平台安装方式

---

### macOS

- `brew install lazygit` : 使用 Homebrew

### Windows

- `scoop install lazygit` : 使用 Scoop
- `winget install lazygit` : 使用 Winget
- `choco install lazygit` : 使用 Chocolatey

### Linux

- `sudo pacman -S lazygit` : Arch Linux
- `dnf copr enable atim/lazygit` & `dnf install lazygit` : Fedora
- `go install github.com/jesseduffield/lazygit@latest` : 使用 Go (需要 Go 环境)

## 🧭 全局操作

---

emoji: 🧭
link: https://github.com/jesseduffield/lazygit/blob/master/docs/keybindings/Keybindings_en.md
desc: 通用导航与控制

---

- `q` : 退出程序
- `x` : 打开当前面板菜单
- `1` - `5` : 跳转面板 (状态/文件/分支/提交/贮藏)
- `[` / `]` : 面板内切换标签页
- `ctrl+p` : 打开面板选择器
- `?` : 查看全部快捷键
- `tab` : 切换子视图 (如暂存/未暂存)
- `0` : 快速聚焦主视图

## 📁 文件面板 (Files)

---

emoji: 📁
link: https://github.com/jesseduffield/lazygit/blob/master/docs/keybindings/Keybindings_en.md#files-panel
desc: 管理暂存、提交与变更

---

- `space` : 切换文件暂存状态
- `a` : 全选/全不选文件
- `c` : 提交变更
- `C` : 使用外部编辑器提交
- `d` : 放弃文件变更菜单
- `e` : 编辑文件
- `o` : 打开文件
- `f` : 获取远程更新 (Fetch)
- `p` : 拉取更新 (Pull)
- `P` : 推送更新 (Push)
- `s` : 快捷贮藏全部变更 (Stash All)
- `S` : 贮藏选项菜单

## 🌿 分支面板 (Branches)

---

emoji: 🌿
link: https://github.com/jesseduffield/lazygit/blob/master/docs/keybindings/Keybindings_en.md#branches-panel
desc: 分支管理与集成

---

- `space` : 检出选定分支
- `n` : 创建新分支
- `d` : 删除分支
- `m` : 合并到当前分支
- `M` : 变基 (Rebase) 当前分支
- `R` : 重命名分支
- `F` : 强制检出 (Force checkout)
- `w` : 打开工作树 (Worktree) 菜单

## 📝 提交面板 (Commits)

---

emoji: 📝
link: https://github.com/jesseduffield/lazygit/blob/master/docs/keybindings/Keybindings_en.md#commits-panel
desc: 历史审计与交互式变基

---

- `s` : 压缩提交 (Squash)
- `f` : 修正提交 (Fixup)
- `r` : 修改提交信息 (Reword)
- `A` : 修补最后一次提交 (Amend)
- `v` : 撤销选定提交 (Revert)
- `g` : 重置到该提交 (Reset)
- `t` : 拣选提交 (Cherry-pick)
- `L` : 查看日志 (Log)
- `i` : 开始交互式变基 (Interactive Rebase)
- `ctrl+j` / `ctrl+k` : 移动提交位置 (变基中)
- `b` : 打开 Bisect (二分查找) 菜单

## ⚡ 交互式变基详情

---

emoji: ⚡
desc: 在提交面板中的高级操作

---

- `s` : **Squash** - 合并到下方提交并保留信息
- `f` : **Fixup** - 合并到下方提交并丢弃信息
- `d` : **Drop** - 删除该提交
- `r` : **Reword** - 重写提交信息
- `p` : **Pick** - 标记为拾取 (恢复删除或暂停的变基)
- `A` : **Amend** - 使用暂存区修改该提交
- `S` : **Autosquash** - 自动应用所有 fixup! 提交

## 🔍 块/行级暂存 (Patch Building)

---

emoji: 🔍
desc: 在文件上按回车进入细节视图

---

- `enter` : 进入文件细节视图
- `space` : 暂存/取消暂存选中的行/块
- `a` : 切换 块(Hunk) / 行(Line) 选择模式
- `v` : 开启范围选择模式
- `d` : 放弃选中的修改
- `E` : 在外部编辑器中编辑该块

## 🤝 冲突解决

---

emoji: 🤝
desc: 优雅处理合并冲突

---

- `space` : 选择当前版本的代码块
- `b` : 保留双方修改 (Pick Both)
- `up` / `down` : 在冲突间跳转
- `M` : 更多合并选项菜单
- `z` : 撤销上一个冲突选择

## 🛠️ 主界面/导航

---

emoji: 🛠️
desc: 通用操作与视口控制

---

- `z` : 撤销操作 (Undo) - 基于 Reflog
- `Z` : 重做操作 (Redo)
- `H` / `L` : 左右滚动主视图
- `ctrl+u` / `ctrl+d` : 向上/下滚动
- `/` : 在当前面板内搜索
- `ctrl+s` : 打开高级过滤 (Author, Path, Message)

## ⚙️ 常用自定义命令

---

emoji: ⚙️
link: https://github.com/jesseduffield/lazygit/wiki/Custom-Commands-Compendium
desc: config.yml 实用配置

---

```yaml
customCommands:
  - key: "f"
    context: "files"
    command: "git difftool {{.SelectedFile.Name}}"
    description: "使用工具对比"
  - key: "b"
    context: "branches"
    command: "git checkout {{.SelectedBranch.Name}} -- {{.SelectedFile.Name}}"
    description: "从分支检出该文件"
```
