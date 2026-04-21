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