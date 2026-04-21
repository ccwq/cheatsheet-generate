---
title: Git 核心命令指南
lang: bash
version: "1.0.0"
date: "2026-04-21"
github: git/git
colWidth: 400px
---

# Git 核心命令指南

## 概念入门
---
emoji: 🧭
link: https://git-scm.com/book/zh/v2/Git-基础-Git-工作原理
desc: 先理解 Git 的快照模型，再学命令会事半功倍。
---

### Git 快照模型

Git 不是保存文件的差异，而是保存文件的完整快照。每次提交是对整个仓库的一次拍照。

- `工作区 working tree`：你当前编辑的文件
- `暂存区 index/staged`：已标记要提交的文件
- `仓库 repository`：所有提交历史

### 指针与引用

| 引用 | 含义 |
|------|------|
| HEAD | 指向当前分支的最新提交 |
| origin/main | 远程跟踪分支 |
| main | 本地分支 |

### 命令职责对照

| 命令 | 核心职责 |
|------|---------|
| fetch | 更新远程跟踪分支 |
| pull | 获取 + 合并远程提交 |
| push | 上传本地提交 |
| merge | 合并两个分支 |
| rebase | 变基，重写提交历史 |
| checkout/switch | 切换分支 |
| reset | 重置 HEAD 位置 |

## fetch 与 pull
---
emoji: ☁️
link: https://git-scm.com/docs/git-fetch
desc: fetch 和 pull 很容易混淆。关键区别是 fetch 不动本地分支，pull 会直接合并。
---

### fetch：只看不动

```bash
git fetch origin        # 获取所有远程分支更新
git fetch origin main  # 只获取 main 分支
git fetch --prune       # 清理已删除的远程分支
```

### pull = fetch + merge

```bash
git pull                # 默认 fetch + merge
git pull --ff-only      # 只允许快进，有冲突则失败
git pull --rebase       # fetch + rebase，保持线性历史
```

### 场景选择

| 场景 | 推荐 |
|------|------|
| 查看远程更新，不急着合并 | `git fetch` |
| 本地分支落后远程，需要快进 | `git pull --ff-only` |
| 保持线性历史，减少 merge 节点 | `git pull --rebase` |
| 不确定有没有冲突 | 先 `git fetch`，再看 `git log` |

## merge
---
emoji: 🔀
link: https://git-scm.com/docs/git-merge
desc: merge 把两条分支合并成一条。根据分支关系不同，合并类型也不同。
---

### 三种合并类型

**1. Fast-forward（快进）**
当分支没有分叉时，Git 直接把指针前移。

```bash
git checkout feature
git merge main  # 快进到 main
```

**2. 递归合并**
有分叉时创建 merge commit。

```bash
git merge main  # 创建合并提交
```

**3. 快进失败**
无法快进时，Git 会创建 merge commit。

### 常用选项

```bash
git merge --no-ff <branch>   # 即使能快进也创建 merge commit
git merge --squash <branch>  # 压扁所有提交为一个
git merge --abort            # 放弃当前合并
```

### 冲突处理

1. 查看冲突文件：`git status`
2. 手动编辑冲突内容
3. `git add <file>` 标记已解决
4. `git commit` 完成合并

### 黄金法则

> 不要在公共分支（main/develop）上 merge 功能分支。先 rebase 再 merge 可以保持线性历史。

## rebase
---
emoji: ✂️
link: https://git-scm.com/docs/git-rebase
desc: rebase 会重写提交历史，把当前分支的提交"复制"到目标分支之上。
---

### 基本 rebase

```bash
git checkout feature
git rebase main  # 把 feature 变基到 main
```

### rebase vs merge 对比

| 维度 | rebase | merge |
|------|--------|-------|
| 历史 | 线性、干净 | 有 merge 节点 |
| 提交 | 重写 | 保留原样 |
| 适用 | 个人分支整理 | 公共分支 |
| 风险 | 只能用于私有分支 | 安全 |

### 交互式 rebase

```bash
git rebase -i HEAD~5  # 整理最近 5 个提交
```

| 动作 | 效果 |
|------|------|
| pick | 保留提交 |
| reword | 只改提交说明 |
| squash | 合并，保留说明 |
| fixup | 合并，丢弃说明 |
| drop | 删除提交 |

### 黄金法则

> **永远不要在公共分支上 rebase。** 已推送的提交如果被其他人基于它工作，rebase 会导致历史错乱。

### 安全推送

```bash
git push --force-with-lease  # 比 --force 更安全
```

### 撤销 rebase

```bash
git reflog                      # 查看 rebase 前的 HEAD 位置
git reset --hard HEAD@{1}       # 恢复到 rebase 前
```

## 压缩合并
---
emoji: 📦
link: https://git-scm.com/docs/git-merge
desc: 把多个提交合并成一个的操作。适用于整理提交历史、清理零散补丁、合并功能分支。
---

### git merge --squash

把指定分支的所有提交压缩成一个 merge commit，合并到当前分支。

```bash
git checkout main
git merge --squash feature/login   # 把 feature 分支所有提交压成一个
git commit -m "feat: add login feature"  # 手动写一个清晰的提交说明
```

**原理：**
- 所有来自 feature 分支的改动保留，但提交历史被压缩成一条
- 原分支的提交不会被保留在当前分支的历史里
- 自动生成一个待提交的 merge commit，你需要手动写 message

**使用场景：**

| 场景 | 说明 |
|------|------|
| 功能分支开发完毕 | 把零碎的开发提交合并成一个大提交 |
| 合并他人的 PR | 把多个人提交的补丁压成一个清晰的提交 |
| 代码审查后合并 | 审查过程中的小改动不需要保留在历史里 |

**常见误区：**

| 误区 | 正确做法 |
|------|---------|
| squash 后忘记提交 | merge --squash 后必须 git commit 才能完成 |
| 误以为是 rebase | --squash 是 merge 的一种，不会改写历史 |
| 想保留多个提交 | squash 会把所有提交合成一个 |

**撤销方法：**

```bash
# 如果还没提交，直接 reset
git reset --hard HEAD~1

# 如果已经提交，用 revert 创建反向提交
git revert -m 1 HEAD
```

### git rebase -i squash / fixup

在交互式变基中，把多个连续的提交合并成一个。

```bash
git rebase -i HEAD~5  # 整理最近 5 个提交
```

**squash vs fixup 对比：**

| 动作 | commit message | 改动合并方式 |
|------|---------------|-------------|
| squash | 合并后需要写新 message | 保留所有改动 + message |
| fixup | 直接丢弃后面的 message | 保留所有改动，自动用第一个 message |

**squash 示例：**

```bash
# 在编辑器里把要合并的提交改成 squash
pick abc1234 feat: add login form
squash def5678 fix typo in form
squash 9123abc fix lint
```

编辑器会弹出让你写新的 commit message，保存后三个提交会合并成一个。

**fixup 示例：**

```bash
# fixup 会自动用第一个提交的消息，不需要写新 message
pick abc1234 feat: add login form
fixup def5678 fix typo
fixup 9123abc fix lint
```

**常见误区：**

| 误区 | 正确做法 |
|------|---------|
| 在已推送的分支上 squash | 不要在公共分支上操作，会改写历史 |
| squash 后发现有问题 | 用 `git rebase --abort` 取消，或 `git reflog` 恢复 |
| 把不相关的提交 squash 在一起 | 只合并逻辑上相关的提交 |

**撤销方法：**

```bash
# 在 rebase 过程中取消
git rebase --abort

# rebase 完成后，用 reflog 恢复
git reflog
git reset --hard HEAD@{1}  # 恢复到 rebase 前
```

### 两种方式对比

| 维度 | merge --squash | rebase -i squash/fixup |
|------|---------------|----------------------|
| 目的 | 合并两个分支时压缩历史 | 整理本地多个提交 |
| 结果 | 一个 merge commit | 线性历史，无 merge 节点 |
| 是否改写历史 | 否，保留原提交 | 是，改写提交历史 |
| 适用分支 | 任何分支 | **只能用于本地、未推送的分支** |
| 操作时机 | 合并时 | 任何时候 |
| 撤销难度 | 简单（reset 或 revert） | 复杂（需要 reflog） |

**选择建议：**

- 合并功能分支 → 用 `merge --squash`
- 整理本地提交历史 → 用 `rebase -i`
- 不确定时，优先用 `merge --squash`，更安全

## checkout、switch 与 restore
---
emoji: 🔄
link: https://git-scm.com/docs/git-switch
desc: Git 2.23 把 checkout 的职责拆成了 switch（切换分支）和 restore（恢复文件）。
---

### 老式 checkout（仍有见到）

```bash
git checkout main        # 切换分支
git checkout -- file.txt # 丢弃文件修改
```

### 现代 switch（推荐）

```bash
git switch main          # 切换到 main
git switch -c feat/xxx   # 创建并切换
git switch -            # 回到上一个分支
```

### restore（Git 2.23+）

```bash
git restore file.txt           # 丢弃工作区修改
git restore --staged file.txt  # 取消暂存
git restore --source=HEAD~1 file.txt  # 从指定提交恢复
```

### 职责对照

| 命令 | 职责 |
|------|------|
| git checkout | 切换分支 + 恢复文件（老式） |
| git switch | 只切换分支 |
| git restore | 只恢复文件 |

## reset
---
emoji: ⏪
link: https://git-scm.com/docs/git-reset
desc: reset 用于移动 HEAD 指针，配合不同模式可以控制暂存区和工作区的状态。
---

### 三种模式对比

| 模式 | HEAD | 暂存区 | 工作区 | 常见用途 |
|------|------|--------|--------|---------|
| --soft | 回退 | 保留 | 保留 | 撤销提交，保留暂存 |
| --mixed | 回退 | 重置 | 保留 | 取消暂存，把改动放回工作区 |
| --hard | 回退 | 重置 | 重置 | 彻底回滚，危险 |

### 常用场景

```bash
# 撤销最近提交，保留暂存（可以重新提交）
git reset --soft HEAD~1

# 取消暂存，把改动放回工作区
git reset --mixed HEAD~1

# 彻底回滚（危险！）
git reset --hard HEAD~1
```

### reflog 后悔药

```bash
git reflog                        # 查看所有操作历史
git reflog --date=relative        # 显示相对时间
git reset --hard HEAD@{2}         # 恢复到某个操作前
```

### revert vs reset

| 场景 | 推荐 | 原因 |
|------|------|------|
| 撤销已推送的公共提交 | `git revert` | 不改历史，安全 |
| 撤销未推送的本地提交 | `git reset` | 不用生成反向提交 |

## push
---
emoji: ⬆️
link: https://git-scm.com/docs/git-push
desc: push 把本地提交上传到远程仓库。
---

### 基本用法

```bash
git push                          # 推送到默认 upstream
git push origin main              # 推送到指定远端分支
git push -u origin feature        # 首次推送，建立 upstream
git push --force-with-lease       # 安全强推
```

### force-with-lease vs force

| 命令 | 安全性 |
|------|--------|
| `--force` | 危险，可能覆盖他人推送 |
| `--force-with-lease` | 更好，如果远程有更新会拒绝 |

### 删除远程分支

```bash
git push origin --delete old-branch
```

### 设置默认行为

```bash
git config --global push.autoSetupRemote true  # 首次 push 自动建立 upstream
```

## 速查对照表
---
emoji: 📋
desc: 快速查找各命令的核心参数和用法。
---

### reset 三兄弟

| 命令 | HEAD | 暂存区 | 工作区 |
|------|------|--------|--------|
| `reset --soft HEAD~1` | 回退 | 保留 | 保留 |
| `reset --mixed HEAD~1` | 回退 | 重置 | 保留 |
| `reset --hard HEAD~1` | 回退 | 重置 | 重置 |

### pull 策略

| 命令 | 效果 |
|------|------|
| `pull` | fetch + merge |
| `pull --ff-only` | 只接受快进，有冲突则失败 |
| `pull --rebase` | fetch + rebase |

### rebase -i 动作

| 动作 | 效果 |
|------|------|
| pick | 保留 |
| reword | 改 message |
| squash | 合并，保留 message |
| fixup | 合并，丢弃 message |
| drop | 删除 |

### checkout / switch / restore

| 场景 | 命令 |
|------|------|
| 切换分支 | `switch <branch>` |
| 创建并切换 | `switch -c <branch>` |
| 恢复文件（丢弃修改） | `restore <file>` |
| 取消暂存 | `restore --staged <file>` |