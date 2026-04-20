# Git Worktree 速查 — 设计文档

## 概述

**目标**: 创建独立专题 `cheatsheets/git-worktree/`，同步增强 `git.md` 中的 worktree 入口
**定位**: 混合定位（初中级理解概念，高级参考命令）
**结构**: Recipe 驱动 + 命令总览

---

## 一、概念引入

### 什么是 Worktree

Worktree（工作树）允许同一仓库拥有**多个独立工作区目录**，每个目录可绑定不同分支，且**共享同一个 .git 对象库**。

**核心特性**:
- 多目录并行：同一仓库开多个工作目录
- 资源高效：共享 .git，不重复占用磁盘
- 分支隔离：每个 worktree 独立分支，互不干扰

### vs 对比

| 维度 | worktree | stash | clone |
|------|----------|-------|-------|
| 磁盘占用 | 共享 .git | 无额外目录 | 全量复制 .git |
| 切换速度 | 秒级目录切换 | 需 pop | 需 checkout |
| 适用场景 | 长期并行分支 | 临时寄存 | 完全隔离环境 |
| 保留状态 | 完全保留 | 寄存临时状态 | 完全独立 |

**心法比喻**: worktree 像"同时打开多个 VS Code 窗口"；stash 像"把当前窗口收缩到后台任务栏"。

---

## 二、Recipe 场景

### R1 — 并行多分支开发

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

---

### R2 — 热修切入与切回

**场景**: feat 分支写到一半，要临时去修线上 bug。

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
- 用 worktree 代替 stash，适合停留时间长的任务
- 删除前确认没有未合并的重要变更

---

### R3 — Monorepo 解耦

**场景**: 大型仓库里各子项目（packages/a、packages/b）需要独立工作区。

```bash
# 给 packages/frontend 开独立 worktree
git worktree add packages/frontend -b feat/ui-redesign

# packages/frontend 里有自己的 package.json、独立的 node_modules
# 所有 worktree 共享同一个 .git，commit 历史完全一致
```

**注意点**:
- worktree 数量受限于仓库分支数
- 适合需要长期在特定子目录分支上工作的场景

---

### R4 — 清理与维护

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

---

## 三、命令速查总览

| 分组 | 命令 | 说明 |
|------|------|------|
| **查看** | `git worktree list` | 列出所有 worktree，含路径+分支+状态 |
| **查看** | `git worktree list --porcelain` | 机器友好的输出格式 |
| **创建** | `git worktree add <path> -b <branch>` | 新目录 + 新分支 |
| **创建** | `git worktree add <path> <commit>` | 检出到具体 commit |
| **创建** | `git worktree add <path> -b <branch> origin/main` | 基于远端分支创建 |
| **删除** | `git worktree remove <path>` | 安全删除（检查未提交变更） |
| **删除** | `git worktree remove --force <path>` | 强制删除 |
| **删除** | `git worktree remove <path> --reason "..."` | 记录删除原因（2.40+） |
| **锁定** | `git worktree lock <path> -m "reason"` | 锁定防止修改/删除 |
| **解锁** | `git worktree unlock <path>` | 解除锁定 |
| **移动** | `git worktree move <old> <new>` | 移动 worktree 目录（2.40+） |
| **清理** | `git worktree prune` | 清理失效 worktree 引用 |
| **修复** | `git worktree repair` | 修复 worktree 配置错误 |

### 常见报错处理

| 报错 | 原因 | 解决方案 |
|------|------|----------|
| `fatal: '<path>' is already a worktree` | 目录已是 worktree 或仓库子目录 | 检查路径是否正确 |
| `fatal: cannot lock worktree` | worktree 已被锁定 | `git worktree unlock <path>` |
| `fatal: invalid reference: <branch>` | 分支或 commit 不存在 | 检查分支名或 commit hash |

---

## 四、git.md 增强方案

### Recipe 2 增强

在 git.md 的 **Recipe 2（手上写一半，突然要插队修 Bug）** 中，增加 worktree 作为 stash 的替代方案：

在现有 stash 命令序列后补充：
```bash
# 长时间并行任务时，worktree 比 stash 更稳
git worktree add ../repo-hotfix -b fix/xxx origin/main
# ... 在 ../repo-hotfix 修复 bug ...
git worktree remove ../repo-hotfix  # 用完后清理
```

### 命令总览增强

在 git.md 的 **stash、worktree、恢复与重置** section 中，将 worktree 条目从 3 行扩展为完整条目，涵盖：list / add / remove / lock / unlock / prune。

---

## 五、文件结构

```
cheatsheets/
  git-worktree/
    git-worktree.md    # 主 cheatsheet 文件
    refmap.md          # 关联索引

cheatsheets/git/git.md  # 增强现有 worktree 条目
```

---

## 六、设计决策

1. **独立专题而非合并到 git.md**：worktree 场景丰富，独立成篇更易检索
2. **Recipe 驱动结构**：与项目 git.md 风格统一，读者可选深度
3. **增强 git.md 入口**：确保从 git.md 能找到 worktree 专题
4. **命令完整覆盖**：涵盖 2.40+ 新增的 `--reason` 和 `move` 命令
