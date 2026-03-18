---
title: Git
lang: bash
version: "2.53.0"
date: "2026-02-02"
github: git/git
colWidth: 400px
---

# Git

## 快速定位
---
emoji: 🧭
link: https://git-scm.com/docs/git/2.53.0.html
desc: Git 可以类比成“代码时间线 + 工作区操作台”。上半部分先给 cookbook 场景打法，下半部分再给完整 cheatsheet，适合先找套路，再查细节。
---
- `工作区 working tree` : 你当前正在改的文件现场
- `暂存区 index` : 准备放进下一次提交的内容
- `提交 commit` : 一个可追踪、可审查、可回滚的历史节点
- `分支 branch` : 一条独立推进的开发线
- `远端 remote` : 团队共享仓库入口，默认名通常是 origin
- `git status -sb` : 开工第一眼，先看分支和改动状态
- `git log --oneline --graph --decorate -20` : 第二眼，先看最近历史结构
- `现代入口 switch/restore` : Git 2.23+ 推荐；老项目里仍会见到 checkout

```bash
# 开工前先看工作台和时间线
git status -sb
git branch --show-current
git log --oneline --graph --decorate -20
```

### 心法
- `status` 像前端里的 Elements 面板，先看现状再动手
- `diff` 像代码 review 视角，专门看你到底改了什么
- `log` / `reflog` 像时间轴，一个看正式历史，一个看操作轨迹

## 起手工作流
---
emoji: 🚀
link: https://git-scm.com/docs/gittutorial
desc: 新仓库的起手式要尽量短。目标不是“学完 Git”，而是先让仓库可提交、可同步、可按分支干活。
---
- `git init` : 初始化当前目录为仓库
- `git clone <url>` : 从远端克隆完整仓库
- `git config --global user.name "Your Name"` : 设置作者名
- `git config --global user.email "you@example.com"` : 设置作者邮箱
- `git branch -M main` : 统一默认分支名
- `git remote add origin <url>` : 给本地仓库补远端
- `git push -u origin main` : 第一次推送并建立 upstream

```bash
# 本地已有项目，接入 Git
git init
git add .
git commit -m "chore: bootstrap project"
git branch -M main
git remote add origin https://github.com/your-org/your-repo.git
git push -u origin main
```

## Recipe 1：新功能分支从零到可提交
---
emoji: 🌿
link: https://git-scm.com/docs/giteveryday
desc: 这是最常见的一条主线：更新主线、开功能分支、边改边看、按逻辑拆提交，然后把分支推上去等评审。
---
- `git fetch origin` : 先拿远端最新状态，但先不改当前工作区
- `git switch main` : 回到主线
- `git pull --ff-only` : 快进更新，避免无意生成 merge commit
- `git switch -c feat/xxx` : 基于最新主线开任务分支
- `git add -p` : 按 hunk 精细暂存，适合拆提交
- `git commit -m "feat: ..."` : 提交一个明确阶段结果
- `git push -u origin feat/xxx` : 首次推分支

```bash
git fetch origin
git switch main
git pull --ff-only
git switch -c feat/login-form
git status -sb
git diff
git add -p
git commit -m "feat: add login form validation"
git push -u origin feat/login-form
```

## Recipe 2：手上写一半，突然要插队修 Bug
---
emoji: 🚑
link: https://git-scm.com/docs/git-stash
desc: 这时 Git 更像临时寄存柜。先把当前现场收好，再切去修线上问题；修完再回来继续，不要硬把两件事揉成一个提交。
---
- `git stash push -m "wip: xxx"` : 临时寄存当前工作区和暂存区
- `git stash push --staged` : 只寄存 staged 的部分
- `git stash list` : 看可恢复的现场列表
- `git switch -c fix/xxx` : 新开热修分支
- `git stash pop` : 取回并删除最近 stash
- `git stash apply stash@{1}` : 只恢复，不删除
- `git worktree add ../repo-hotfix -b fix/xxx origin/main` : 长时间并行任务时，比 stash 更稳

```bash
git status -sb
git stash push -m "wip: login form"
git switch main
git pull --ff-only
git switch -c fix/login-500
git add .
git commit -m "fix: handle empty login payload"
git push -u origin fix/login-500
git switch feat/login-form
git stash pop
```

## Recipe 3：把提交历史整理成评审友好的样子
---
emoji: ✂️
link: https://git-scm.com/docs/git-rebase
desc: 评审看的是“故事线”，不是你开发时的慌乱轨迹。提交前把粒度、顺序和 message 整理干净，review 和回滚都会轻松很多。
---
- `git commit --amend` : 改上一条提交的内容或 message
- `git restore --staged <file>` : 把文件从暂存区拿下来
- `git rebase -i origin/main` : 交互式整理多个提交
- `squash` / `fixup` : 折叠零碎补丁
- `reword` : 只改提交说明
- `git push --force-with-lease` : 改写历史后再安全推远端

```bash
git add src/auth/login.js
git commit --amend --no-edit
git fetch origin
git rebase -i origin/main
git push --force-with-lease
```

## Recipe 4：同步远端而不把历史搞乱
---
emoji: 🔄
link: https://git-scm.com/docs/gitworkflows
desc: 日常同步的重点不是“拉一下”，而是先看远端变了什么，再决定是快进、rebase，还是明确做 merge。
---
- `git fetch origin` : 更新远端跟踪分支，但不改当前分支
- `git log --oneline --graph HEAD..origin/main` : 看远端比我多了什么
- `git log --oneline --graph origin/main..HEAD` : 看我本地领先哪些提交
- `git rebase origin/main` : 功能分支追主线时常用
- `git pull --rebase` : fetch + rebase 合并成一步
- `git merge --no-ff feature-x` : 需要保留 merge 节点时显式使用

```bash
git fetch origin
git log --oneline --graph --decorate HEAD..origin/main
git rebase origin/main
```

## Recipe 5：撤销、回滚、救援
---
emoji: 🧯
link: https://git-scm.com/docs/git-reset
desc: Git 的撤销分三层：撤工作区、撤暂存区、撤历史。先分清你想救的是“文件内容”还是“提交记录”，命令才不会用反。
---
- `git restore <file>` : 丢弃工作区对文件的未暂存修改
- `git restore --staged <file>` : 从暂存区拿下来，但保留工作区内容
- `git reset --soft HEAD~1` : 撤销最近提交，保留 staged 状态
- `git reset --mixed HEAD~1` : 撤销最近提交，改动回到工作区
- `git revert <commit>` : 用新提交回滚旧提交，适合公共分支
- `git reflog` : 后悔药入口，找回 reset/rebase 前的位置

```bash
git reset --soft HEAD~1
git revert abc1234
git reflog
git reset --hard HEAD@{2}
```

## Recipe 6：发版、打标签、摘补丁
---
emoji: 📦
link: https://git-scm.com/docs/git-tag
desc: 这组动作通常出现在发布和补丁回迁。核心目标是让版本点可追踪、补丁可定向搬运，而不是手工复制代码。
---
- `git tag -a v1.8.0 -m "release: v1.8.0"` : 创建附注标签
- `git push origin v1.8.0` : 单独推标签
- `git push --tags` : 批量推所有本地标签
- `git cherry-pick <commit>` : 把某次提交摘到当前分支
- `git cherry-pick -x <commit>` : 补丁回迁时保留来源
- `git branch --contains <commit>` : 检查某提交已在哪些分支里

```bash
git switch main
git pull --ff-only
git tag -a v1.8.0 -m "release: v1.8.0"
git push origin main
git push origin v1.8.0
git switch release/1.8
git cherry-pick -x abc1234
```

## 命令速查总览
---
emoji: 📚
link: https://git-scm.com/cheat-sheet.pdf
desc: 下面进入完整 cheatsheet。这里不再按场景讲故事，而是按职责分组，方便你像查 API 一样快速定位具体命令。
---
- `配置与身份` : config、作者信息、默认行为
- `仓库入口` : 仓库初始化、克隆和远端配置
- `看状态` : 工作区、暂存区和提交差异
- `做提交` : 暂存、提交、补提和改写上一条提交
- `分支协作` : 分支创建、切换、合并、变基
- `同步远端` : 抓取、拉取、推送
- `救现场` : 临时寄存、并行工作树、恢复、重置、reflog
- `排障发布` : 日志、追责、二分、标签、补丁搬运

## 配置与身份
---
emoji: ⚙️
link: https://git-scm.com/docs/git-config
desc: 身份、编辑器、默认分支、pull/push 策略、alias 基本都归 `git config` 管。先把这些基础偏好配好，后面命令会顺手很多。
---
- `git config --global user.name "Your Name"` : 设置全局作者名
- `git config --global user.email "you@example.com"` : 设置全局作者邮箱
- `git config --global init.defaultBranch main` : 新仓库默认分支默认用 main
- `git config --global core.editor "code --wait"` : 设置提交信息编辑器
- `git config --global pull.rebase true` : 让 pull 默认走 rebase
- `git config --global rebase.autoStash true` : rebase 前自动 stash 工作区
- `git config --global fetch.prune true` : fetch 时顺手清理已删除远端分支
- `git config --global push.autoSetupRemote true` : 首次推分支自动建立 upstream
- `git config --global --list` : 查看当前生效配置
- `git config --show-origin --list` : 连配置来源文件一起看
- `git config --local user.email "team@example.com"` : 只改当前仓库本地配置

```bash
git config --global alias.st "status -sb"
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.unstage "restore --staged --"
```

## 仓库初始化与克隆
---
emoji: 🏗️
link: https://git-scm.com/docs/git-clone
desc: 初始化、克隆、浅克隆、指定分支、带子模块拉取，都属于仓库入口层操作。
---
- `git init` : 初始化普通仓库
- `git init --bare repo.git` : 初始化裸仓库
- `git clone <url>` : 克隆完整仓库
- `git clone -b <branch> <url>` : 克隆并直接切到指定分支
- `git clone --depth 1 <url>` : 浅克隆，仅拉最近历史
- `git clone --filter=blob:none <url>` : 部分克隆，省流量
- `git clone --recurse-submodules <url>` : 克隆时递归拉子模块
- `git remote -v` : 查看远端列表
- `git remote add origin <url>` : 添加远端
- `git remote set-url origin <new-url>` : 修改远端地址
- `git remote rename origin upstream` : 重命名远端
- `git rev-parse --show-toplevel` : 看仓库根目录

## 状态、差异与选择性暂存
---
emoji: 🔎
link: https://git-scm.com/docs/git-status
desc: 这组命令专门回答两个问题：我现在改了什么，以及这些改动分别停在工作区、暂存区还是历史里。
---
- `git status` : 查看完整状态
- `git status -sb` : 简洁状态，最常用
- `git diff` : 工作区 vs 暂存区
- `git diff --staged` : 暂存区 vs `HEAD`
- `git diff HEAD` : 工作区整体 vs `HEAD`
- `git diff --stat` : 只看变更统计
- `git diff --name-only` : 只看改了哪些文件
- `git add <file>` : 暂存指定文件
- `git add .` : 暂存当前目录下新增和修改
- `git add -A` : 暂存所有改动，包括删除
- `git add -u` : 只暂存已跟踪文件的改动
- `git add -p` : 交互式按块暂存
- `git restore --staged <file>` : 取消暂存
- `git restore <file>` : 丢弃工作区未暂存修改

| `git status -s` 标记 | 含义 |
| --- | --- |
| `M` | 已修改 |
| `A` | 新增 |
| `D` | 删除 |
| `R` | 重命名 |
| `??` | 未跟踪文件 |

## 提交与历史
---
emoji: 💾
link: https://git-scm.com/docs/git-commit
desc: `add` 决定进不进下一次提交，`commit` 决定怎么把它写进历史。高质量提交的核心不是命令多，而是粒度干净。
---
- `git commit -m "feat: ..."` : 创建提交
- `git commit -am "fix: ..."` : 已跟踪文件可直接 add+commit
- `git commit --amend` : 修改最近一次提交
- `git commit --amend --no-edit` : 不改 message，只补内容
- `git commit --allow-empty -m "chore: trigger"` : 建一个空提交
- `git commit --fixup <commit>` : 配合 autosquash 整理历史
- `git log` : 标准历史
- `git log --oneline --graph --decorate --all` : 图形化最常用组合
- `git log -n 20` : 只看最近 20 条
- `git log --stat` : 连文件统计一起看
- `git log -p` : 连 patch 一起看
- `git log --author="name"` : 按作者筛
- `git log --since="2 weeks ago"` : 按时间筛
- `git log -- <path>` : 只看某文件/目录历史
- `git show <commit>` : 看某次提交的 patch
- `git show <commit>:path/to/file` : 看某次提交里的文件内容

## 分支、切换、合并、变基
---
emoji: 🌲
link: https://git-scm.com/docs/git-branch
desc: 这组命令解决“我在哪条线开发”和“我要把哪条线并进来”。现代 Git 推荐把切分支和恢复文件从 `checkout` 里拆开理解。
---
- `git branch` : 列本地分支
- `git branch -a` : 列本地 + 远端分支
- `git branch -r` : 只列远端分支
- `git branch <name>` : 创建分支
- `git branch -m <new-name>` : 重命名当前分支
- `git branch -d <name>` : 删除已合并分支
- `git branch -D <name>` : 强制删除分支
- `git switch <branch>` : 切换分支
- `git switch -c <branch>` : 创建并切换
- `git switch -` : 回到上一个分支
- `git checkout <branch>` : 老写法，仍常见
- `git merge <branch>` : 合并指定分支
- `git merge --no-ff <branch>` : 即使能快进也保留 merge commit
- `git merge --squash <branch>` : 把多个提交压成一个再提交
- `git merge --abort` : 放弃当前 merge
- `git rebase <branch>` : 把当前分支变基到目标分支
- `git rebase -i HEAD~5` : 交互式整理最近 5 个提交
- `git rebase --continue` : 冲突解决后继续
- `git rebase --abort` : 取消本次 rebase
- `git rebase --skip` : 跳过当前提交

| `rebase -i` 动作 | 含义 |
| --- | --- |
| `pick` | 保留提交 |
| `reword` | 只改提交说明 |
| `edit` | 停下来手动修改 |
| `squash` | 合并并保留说明 |
| `fixup` | 合并并丢弃说明 |
| `drop` | 删除提交 |

## 远端、抓取、拉取、推送
---
emoji: ☁️
link: https://git-scm.com/docs/git-fetch
desc: fetch、pull、push 三件事别混成一件。`fetch` 只是更新远端跟踪信息，`pull` 会把变化拉进当前分支，`push` 则把你的结果发出去。
---
- `git fetch` : 拉取所有远端更新到本地跟踪分支
- `git fetch origin main` : 只拉某远端某分支
- `git fetch --prune` : 同步并清理已删除远端分支
- `git pull` : fetch + merge
- `git pull --ff-only` : 只允许快进
- `git pull --rebase` : fetch + rebase
- `git push` : 推到默认 upstream
- `git push origin <branch>` : 推指定分支
- `git push -u origin <branch>` : 首次推并设置 upstream
- `git push --force-with-lease` : 安全强推
- `git push origin --delete <branch>` : 删除远端分支
- `git remote show origin` : 查看远端详细信息

## stash、worktree、恢复与重置
---
emoji: 🧰
link: https://git-scm.com/docs/git-worktree
desc: 这组命令负责“腾现场”和“救现场”。`stash` 适合短暂寄存，`worktree` 适合并行长期开发，`restore` / `reset` / `reflog` 负责救火。
---
- `git stash` : 快速寄存当前工作
- `git stash push -m "wip: xxx"` : 带说明寄存
- `git stash push -u` : 连未跟踪文件一起寄存
- `git stash list` : 查看 stash 列表
- `git stash show -p stash@{0}` : 看 stash patch
- `git stash apply` : 应用但不删除
- `git stash pop` : 应用并删除
- `git stash drop stash@{0}` : 删除一条 stash
- `git worktree list` : 查看额外工作树
- `git worktree add ../repo-hotfix -b fix/login-500 origin/main` : 新开一个目录并切到新分支
- `git worktree remove ../repo-hotfix` : 删除工作树
- `git reset --soft HEAD~1` : 撤销最近提交，保留 staged
- `git reset --mixed HEAD~1` : 撤销最近提交，改动回工作区
- `git reset --hard HEAD~1` : 彻底回滚到上一提交，危险
- `git revert <commit>` : 新建反向提交
- `git reflog` : 查看本地引用移动历史

| reset 模式 | 提交指针 | 暂存区 | 工作区 |
| --- | --- | --- | --- |
| `--soft` | 回退 | 保留 | 保留 |
| `--mixed` | 回退 | 重置 | 保留 |
| `--hard` | 回退 | 重置 | 重置 |

## 标签、补丁、排障与仓库卫生
---
emoji: 🛠️
link: https://git-scm.com/docs/git-tag
desc: 这组属于“发布与维护层”。包括版本标签、补丁搬运、责任定位、子模块、忽略规则和清理命令。
---
- `git tag` : 列所有标签
- `git tag -a v1.0.0 -m "release: v1.0.0"` : 创建附注标签
- `git push origin v1.0.0` : 推单个标签
- `git push --tags` : 推全部标签
- `git cherry-pick <commit>` : 摘一条提交到当前分支
- `git cherry-pick -x <commit>` : 在提交说明里写入来源
- `git blame <file>` : 看每行最后修改提交
- `git grep -n "keyword"` : 在仓库里搜关键字
- `git bisect start` : 开始二分
- `git bisect good <commit>` : 标记好版本
- `git bisect bad <commit>` : 标记坏版本
- `git bisect reset` : 结束二分
- `git submodule update --init --recursive` : 初始化并更新子模块
- `git check-ignore -v <file>` : 看某文件为什么被忽略
- `git clean -fdn` : 预览将删除的未跟踪文件
- `git clean -fd` : 删除未跟踪文件和目录
- `git archive --format=zip HEAD -o repo.zip` : 导出当前源码快照

```bash
# 常见 .gitignore
node_modules/
dist/
.env.local
*.log
coverage/
```
