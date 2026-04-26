---
title: Git Worktree 速查
lang: bash
version: 2.53.0
date: 2026-04-20
github: git/git
colWidth: 400px
---

# Git Worktree

## 🧭 快速定位
---
emoji: 🧭
link: https://git-scm.com/docs/git-worktree
desc: 一眼找到最常用的 worktree 命令
---

- `git worktree add <path> -b <branch>` : 创建新 worktree + 新分支
- `git worktree list` : 查看所有 worktree
- `git worktree remove <path>` : 删除 worktree
- `git worktree lock <path> -m "reason"` : 锁定防止误删
- `git worktree prune` : 清理失效引用

```bash
# 最短起手：开一个 worktree 到 ../repo-hotfix，分支名 fix/login-500
git worktree add ../repo-hotfix -b fix/login-500

# 查看当前所有 worktree
git worktree list
```

**心法比喻**: worktree 像"同时打开多个 VS Code 窗口"；stash 像"把当前窗口收缩到后台任务栏"。

## 🌳 概念引入
---
emoji: 🌳
link: https://git-scm.com/docs/git-worktree
desc: 什么是 worktree，与 stash、clone 的核心区别
---

Worktree（工作树）允许同一仓库拥有**多个独立工作区目录**，每个目录可绑定不同分支，且**共享同一个 .git 对象库**。

### 核心特性

- **多目录并行**：同一仓库开多个工作目录
- **资源高效**：共享 .git，不重复占用磁盘
- **分支隔离**：每个 worktree 独立分支，互不干扰

### vs 对比

| 维度 | worktree | stash | clone |
|------|----------|-------|-------|
| 磁盘占用 | 共享 .git | 无额外目录 | 全量复制 .git |
| 切换速度 | 秒级目录切换 | 需 pop | 需 checkout |
| 适用场景 | 长期并行分支 | 临时寄存 | 完全隔离环境 |
| 保留状态 | 完全保留 | 寄存临时状态 | 完全独立 |

### 限制与前提

- 裸露分支（bare branch）不能作为 worktree 目标，如 `HEAD` 本身的分支
- 同一分支只能有一个 worktree
- worktree 目录不能嵌套在其他 worktree 目录内
- worktree 数量受限于仓库分支数

## 起手工作流
---
emoji: 🚀
link: https://git-scm.com/docs/git-worktree
desc: 从零创建一个新 worktree 并开始工作
---

**最小命令链**：

```bash
# 1. 基于远端 main 新建 worktree + 新分支
git worktree add ../repo-feature -b feat/xxx origin/main

# 2. 进入 worktree 开始工作
cd ../repo-feature

# 3. 正常提交，worktree 与主仓库共享历史
git add .
git commit -m "feat: ..."

# 4. 用完后切回主仓库删除 worktree
cd ..
git worktree remove ../repo-feature
```

## Recipe 1 — 并行多分支开发
---
emoji: ⚡
link: https://git-scm.com/docs/git-worktree
desc: 同时在 feat 和 review 分支上工作，互不干扰
---

**场景**: 同时在 feat/xxx 和 review/xxx 两个分支上工作，互不干扰。

```bash
# 在主仓库开一个 worktree 做 code review
git worktree add ../repo-review -b review/login-500 origin/main

# 两个目录完全独立，可同时打开、分别提交
# 主仓库在 feat/login-form，../repo-review 在 review/login-500
```

**注意点**:
- worktree 目录不能嵌套在其他 worktree 目录内
- 同一分支只能有一个 worktree

## Recipe 2 — 热修切入与切回
---
emoji: 🚑
link: https://git-scm.com/docs/git-worktree
desc: 从 feat 分支临时切去修 bug，再切回来继续
---

**场景**: feat 分支写到一半，要临时去修线上 bug。worktree 比 stash 更稳，适合停留时间长的任务。

```bash
# 切到主仓库开 hotfix worktree
git worktree add ../repo-hotfix -b fix/login-500

# 在 ../repo-hotfix 里修 bug、提交、推送
cd ../repo-hotfix
git commit -m "fix: handle empty login payload"
git push -u origin fix/login-500

# 修完后删除 worktree，回到原分支继续
git worktree remove ../repo-hotfix

# 回到原分支继续 feat
cd ../feat-login-form
```

**注意点**:
- 删除前确认没有未合并的重要变更
- 如果 worktree 有未提交的变更，`remove` 会失败，加 `--force` 可强制删除

## Recipe 3 — Monorepo 解耦
---
emoji: 🏗️
link: https://git-scm.com/docs/git-worktree
desc: 大型仓库里各子项目独立工作区
---

**场景**: 大型仓库里各子项目（packages/a、packages/b）需要独立工作区，互不干扰 node_modules 和构建产物。

```bash
# 给 packages/frontend 开独立 worktree
git worktree add packages/frontend -b feat/ui-redesign

# packages/frontend 里有自己的 package.json、独立的 node_modules
# 所有 worktree 共享同一个 .git，commit 历史完全一致
```

**为什么不用 clone？**
- clone 需要完整复制 .git，磁盘占用翻倍
- worktree 共享 .git，多个子项目同时工作但历史完全一致

**注意点**:
- worktree 数量受限于仓库分支数
- 子项目路径本身就是 worktree 目录，不能再在其下创建另一个 worktree

## Recipe 4 — 清理与维护
---
emoji: 🧹
link: https://git-scm.com/docs/git-worktree
desc: worktree 用完后正确删除和清理
---

**场景**: worktree 用完后要正确删除，不留垃圾目录。

```bash
# 正常删除（会检查未提交变更）
git worktree remove ../repo-xxx

# 强制删除（有未提交变更但不关心）
git worktree remove --force ../repo-xxx

# 记录删除原因（Git 2.40+）
git worktree remove ../repo-xxx --reason "已完成 hotfix，目录不再需要"

# 清理失效的 worktree 引用（目录已被手动删除）
git worktree prune

# 锁定 worktree，防止意外修改或删除
git worktree lock ../repo-xxx -m "等待 code review"
git worktree unlock ../repo-xxx
```

**注意点**:
- 删除前确认没有未合并的工作
- `prune` 只清理引用，不删除实际目录
- **锁定场景**：等 code review 时、协作者临时离开、怕误操作时使用

## 命令速查
---
emoji: 📚
link: https://git-scm.com/docs/git-worktree
desc: 完整命令索引
---

### 查看

| 命令 | 说明 |
|------|------|
| `git worktree list` | 列出所有 worktree，含路径+分支+状态 |
| `git worktree list --porcelain` | 机器友好的输出格式 |

**`list` 输出格式示例**：

```
/path/to/main-branch  abc1234 [main]
/path/to/repo-hotfix  def5678 [fix/login-500]
/path/to/repo-review  (detached)
```

### 创建

| 命令 | 说明 |
|------|------|
| `git worktree add <path> -b <branch>` | 新目录 + 新分支 |
| `git worktree add <path> <commit>` | 检出到具体 commit |
| `git worktree add <path> -b <branch> origin/main` | 基于远端分支创建 |

### 删除

| 命令 | 说明 |
|------|------|
| `git worktree remove <path>` | 安全删除（检查未提交变更） |
| `git worktree remove --force <path>` | 强制删除 |
| `git worktree remove <path> --reason "..."` | 记录删除原因（2.40+） |

### 锁定与移动

| 命令 | 说明 |
|------|------|
| `git worktree lock <path> -m "reason"` | 锁定防止修改/删除 |
| `git worktree unlock <path>` | 解除锁定 |
| `git worktree move <old> <new>` | 移动 worktree 目录（2.40+） |

### 清理与修复

| 命令 | 说明 |
|------|------|
| `git worktree prune` | 清理失效 worktree 引用 |
| `git worktree repair` | 修复 worktree 配置错误 |

## 常见报错处理
---
emoji: ⚠️
link: https://git-scm.com/docs/git-worktree
desc: 常见错误与解决方案
---

| 报错 | 原因 | 解决方案 |
|------|------|----------|
| `fatal: '<path>' is already a worktree` | 目录已是 worktree 或仓库子目录 | 检查路径是否正确 |
| `fatal: cannot lock worktree` | worktree 已被锁定 | `git worktree unlock <path>` |
| `fatal: invalid reference: <branch>` | 分支或 commit 不存在 | 检查分支名或 commit hash |
| `fatal: '<path>' is a bare repository` | 目录本身是 bare clone | 换一个普通目录路径 |
| `fatal: no such ref: '<branch>'` | 指定分支在远端不存在 | 先 `git fetch origin` 更新远端引用 |
| `fatal: '<branch>' already exists` | 新分支名与现有分支重名 | 换一个分支名 |
