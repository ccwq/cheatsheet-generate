---
title: Git
lang: bash
version: "2.53.0"
date: "2026-03-23"
github: git/git
colWidth: 400px
---

# Git

## 命令速查总览
---
emoji: 📚
link: https://git-scm.com/cheat-sheet.pdf
desc: 完整 cheatsheet，按职责分组，方便你像查 API 一样快速定位具体命令。
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
desc: 身份、编辑器、默认分支、pull/push 策略、alias 基本都归 `git config` 管。
---

### 用户身份

- `git config --global user.name "Your Name"` : 设置全局作者名
- `git config --global user.email "you@example.com"` : 设置全局作者邮箱
- `git config --local user.email "team@example.com"` : 只改当前仓库本地配置
- `git config --global --list` : 查看当前生效配置
- `git config --show-origin --list` : 连配置来源文件一起看
- `git config --list --show-scope` : 显示配置作用域（global/local/system）
- `git config --edit` : 编辑全局配置
- `git config --global --unset user.name` : 删除某项配置
- `git config --global --unset-all` : 删除某项所有配置

### 编辑器与行为

- `git config --global core.editor "code --wait"` : 设置提交信息编辑器
- `git config --global --edit` : 编辑配置文件
- `git config --global core.autocrlf true` : Windows 自动转换 CRLF
- `git config --global core.autocrlf input` : Unix/Mac 保留 LF

### Git 默认行为

- `git config --global init.defaultBranch main` : 新仓库默认分支用 main
- `git config --global pull.rebase false` : pull 默认走 merge
- `git config --global pull.rebase true` : pull 默认走 rebase
- `git config --global rebase.autoStash true` : rebase 前自动 stash 工作区
- `git config --global fetch.prune true` : fetch 时顺手清理已删除远端分支
- `git config --global push.autoSetupRemote true` : 首次推分支自动建立 upstream

### Alias 常用配置

```bash
git config --global alias.st "status -sb"
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.unstage "restore --staged --"
git config --global alias.visual "log --oneline --graph"
git config --global alias.amend "commit --amend --no-edit"
```

## 仓库初始化与克隆
---
emoji: 🏗️
link: https://git-scm.com/docs/git-clone
desc: 初始化、克隆、浅克隆、指定分支、带子模块拉取。
---

### git init

- `git init` : 初始化普通仓库
- `git init --bare repo.git` : 初始化裸仓库（无工作区）
- `git init -b main` : 初始化并设置默认分支为 main（Git 2.28+）
- `git init --initial-branch=main` : 同上，完整写法

### git clone

- `git clone <url>` : 克隆完整仓库到当前目录
- `git clone <url> <dir>` : 克隆到指定目录
- `git clone -b <branch> <url>` : 克隆并直接切到指定分支
- `git clone --depth 1 <url>` : 浅克隆，仅拉最近历史
- `git clone --depth 1 <url> --branch <tag>` : 浅克隆指定 tag
- `git clone --filter=blob:none <url>` : 部分克隆，只下载必要对象
- `git clone --single-branch <url>` : 只克隆单个分支历史
- `git clone --no-checkout <url>` : 克隆但不检出任何分支
- `git clone --recurse-submodules <url>` : 克隆时递归拉子模块

### git remote

- `git remote -v` : 查看远端列表（含 URL）
- `git remote add origin <url>` : 添加远端
- `git remote set-url origin <new-url>` : 修改远端地址
- `git remote rename origin upstream` : 重命名远端
- `git remote remove origin` : 删除远端
- `git remote show origin` : 查看远端详细信息
- `git remote prune origin` : 清理已删除的远端分支引用
- `git remote get-url origin` : 只看远端 URL
- `git remote set-url origin <url> --push` : 只修改 push URL

### 仓库信息

- `git rev-parse --show-toplevel` : 看仓库根目录
- `git rev-parse --git-dir` : 看 .git 目录位置
- `git remote get-url --push origin` : 查看 push URL

## 状态、差异与选择性暂存
---
emoji: 🔎
link: https://git-scm.com/docs/git-status
desc: 工作区、暂存区和提交差异。
---

### git status

- `git status` : 查看完整状态
- `git status -sb` : 简洁状态，最常用
- `git status --short` : 同 -s，简洁格式
- `git status -u` : 显示未跟踪文件详情
- `git status --ignored` : 同时显示被忽略的文件

| `git status -s` 标记 | 含义 |
| --- | --- |
| `M` | 已修改（工作区） |
| `MM` | 已修改并已暂存 |
| `A` | 新增（已暂存） |
| `D` | 删除（已暂存） |
| `R` | 重命名 |
| `??` | 未跟踪文件 |
| `!!` | 被忽略的文件 |

### git diff

- `git diff` : 工作区 vs 暂存区
- `git diff --staged` : 暂存区 vs HEAD
- `git diff HEAD` : 工作区整体 vs HEAD
- `git diff <commit>` : 工作区 vs 指定提交
- `git diff <commit> <commit>` : 两提交对比
- `git diff <branch> <branch>` : 两分支对比
- `git diff --stat` : 只看变更统计
- `git diff --name-only` : 只看改了哪些文件
- `git diff --name-status` : 显示 A/M/D 等状态
- `git diff --compact-summary` : 显示文件统计摘要
- `git diff -w` : 忽略空白字符差异
- `git diff --exit-code` : 相同返回 0，不同返回 1
- `git diff -b` : 忽略空白字符数量变化

### git add

- `git add <file>` : 暂存指定文件
- `git add .` : 暂存当前目录下新增和修改
- `git add -A` : 暂存所有改动，包括删除
- `git add -u` : 只暂存已跟踪文件的改动
- `git add -p` : 交互式按块暂存
- `git add -N <file>` : 标记文件为 intent-to-add（后续可单独 commit）
- `git add -v` : 显示详细操作信息
- `git add --dry-run <file>` : 预览但不实际暂存

### git restore / git checkout

- `git restore <file>` : 丢弃工作区未暂存修改
- `git restore --staged <file>` : 取消暂存，保留工作区内容
- `git restore -S <file>` : 同 --staged
- `git restore --source=HEAD~1 <file>` : 从指定提交恢复文件
- `git restore --source=HEAD -- path/to/file` : 恢复到 HEAD 版本
- `git checkout -- <file>` : 丢弃工作区修改（老写法）
- `git checkout <branch> -- <file>` : 从某分支恢复文件到工作区

## 提交与历史
---
emoji: 💾
link: https://git-scm.com/docs/git-commit
desc: add 决定进不进下一次提交，commit 决定怎么把它写进历史。
---

### git commit

- `git commit -m "feat: ..."` : 创建提交
- `git commit -am "fix: ..."` : 已跟踪文件可直接 add+commit
- `git commit --amend` : 修改最近一次提交
- `git commit --amend --no-edit` : 不改 message，只补内容
- `git commit --amend -m "new message"` : 改 message
- `git commit --allow-empty -m "chore: trigger"` : 建一个空提交
- `git commit --dry-run` : 预览提交结果，不实际提交
- `git commit --verbose` : 显示提交详情
- `git commit --signoff` : 添加 Signed-off-by 行
- `git commit -S<GPG-key>` : GPG 签名提交
- `git commit --fixup <commit>` : 创建 fixup 提交（需配合 --autosquash）
- `git commit --squash <commit>` : 创建 squash 提交
- `git commit --no-verify` : 跳过 hook 验证

### git log

- `git log` : 标准历史
- `git log --oneline` : 单行简洁格式
- `git log --oneline --graph` : 图形化分支历史
- `git log --oneline --graph --decorate` : 加分支名装饰
- `git log --oneline --graph --decorate --all` : 显示所有分支
- `git log -n 20` : 只看最近 20 条
- `git log --stat` : 连文件统计一起看
- `git log -p` : 连 patch 一起看
- `git log -p <file>` : 看某文件的改动历史
- `git log --author="name"` : 按作者筛选
- `git log --since="2 weeks ago"` : 按时间筛选
- `git log --until="2024-01-01"` : 截止时间
- `git log --after="2024-01-01"` : 起始时间
- `git log -- <path>` : 只看某文件/目录历史
- `git log --follow <file>` : 追踪文件重命名历史
- `git log --diff-filter=M -- <path>` : 只显示 M（修改）的提交
- `git log --diff-filter=A -- <path>` : 只显示 A（新增）的提交
- `git log --grep="keyword"` : 按提交 message 搜索
- `git log --format="%h %an %s"` : 自定义输出格式
- `git log --name-only` : 只显示变更文件名
- `git log --name-status` : 显示变更文件的状态（A/M/D）

### git show

- `git show <commit>` : 看某次提交的 patch
- `git show <commit> --stat` : 看提交统计
- `git show <commit>:path/to/file` : 看某次提交里的文件内容
- `git show :/<message>` : 通过 message 找提交

### git shortlog

- `git shortlog` : 按作者分组统计提交数
- `git shortlog -sn` : 只显示提交数和作者名
- `git shortlog --since="2 weeks ago"` : 按时间筛选

### git describe

- `git describe` : 输出版本描述（基于最近 tag）
- `git describe --tags` : 基于所有标签
- `git describe --always` : 即使没有 tag 也显示
- `git describe --abbrev=7` : 缩短 commit hash 长度

## 分支、切换、合并、变基
---
emoji: 🌲
link: https://git-scm.com/docs/git-branch
desc: 分支创建、切换、合并、变基。
---

### git branch

- `git branch` : 列本地分支
- `git branch -a` : 列本地 + 远端分支
- `git branch -r` : 只列远端分支
- `git branch <name>` : 创建分支
- `git branch -m <new-name>` : 重命名当前分支
- `git branch -m <old> <new>` : 重命名指定分支
- `git branch -d <name>` : 删除已合并分支
- `git branch -D <name>` : 强制删除分支
- `git branch -f <branch> <commit>` : 强制重置分支到某提交
- `git branch -l <branch>` : 创建并开启 reflog
- `git branch -vv` : 查看分支追踪关系
- `git branch --track <branch> origin/main` : 创建追踪分支
- `git branch --no-track <branch>` : 不追踪远程分支
- `git branch --contains <commit>` : 检查某提交在哪些分支
- `git branch --merged` : 显示已合并到当前分支的
- `git branch --no-merged` : 显示未合并到当前分支的

### git switch（Git 2.23+）

- `git switch <branch>` : 切换分支
- `git switch -c <branch>` : 创建并切换
- `git switch -C <branch>` : 强制创建并切换（覆盖）
- `git switch -` : 回到上一个分支
- `git switch --orphan <branch>` : 创建孤儿分支（无历史）
- `git switch --detach <branch>` : 以 detached HEAD 状态检出

### git checkout（老式）

- `git checkout <branch>` : 切换分支
- `git checkout -b <branch>` : 创建并切换
- `git checkout --detach <branch>` : detached HEAD 状态检出
- `git checkout -` : 回到上一个分支

### git merge

- `git merge <branch>` : 合并指定分支
- `git merge --no-ff <branch>` : 即使能快进也创建 merge commit
- `git merge --ff <branch>` : 只做快进，不创建 commit
- `git merge --squash <branch>` : 压扁所有提交为一个 merge commit
- `git merge --abort` : 放弃当前合并
- `git merge --continue` : 冲突解决后继续合并
- `git merge --no-commit <branch>` : 合并但不自动提交（保留工作进度）
- `git merge -m "message"` : 指定 merge commit message
- `git merge --edit` : 合并后编辑 message
- `git merge --no-edit` : 不编辑，自动完成

### git rebase

- `git rebase <branch>` : 把当前分支变基到目标分支
- `git rebase -i HEAD~5` : 交互式整理最近 5 个提交
- `git rebase -i <branch>` : 交互式整理从分叉点至今的提交
- `git rebase --onto <new> <old>` : 从 old 变基到 new
- `git rebase --continue` : 冲突解决后继续
- `git rebase --abort` : 取消本次 rebase
- `git rebase --skip` : 跳过当前提交
- `git rebase --autosquash` : 自动应用 fixup/squash 标记
- `git rebase --no-autosquash` : 禁用自动 squash
- `git rebase -p` : 保留 merge commit（不推荐）
- `git rebase -x <cmd>` : 每个提交执行命令

| rebase -i 动作 | 效果 |
| --- | --- |
| `pick` | 保留提交 |
| `reword` | 只改提交说明 |
| `edit` | 停下来手动修改 |
| `squash` | 合并，保留说明 |
| `fixup` | 合并，丢弃说明 |
| `drop` | 删除提交 |

> 这部分内容已迁移至 [git-commands](../git-commands/) 完整学习指南，包含更详细的 merge/rebase 概念对比和场景选择。

## 远端、抓取、拉取、推送
---
emoji: ☁️
link: https://git-scm.com/docs/git-fetch
desc: fetch、pull、push 三件事别混成一件。
---

### git fetch

- `git fetch` : 拉取所有远端更新到本地跟踪分支
- `git fetch origin` : 只从 origin 拉取
- `git fetch origin main` : 只拉某远端某分支
- `git fetch --prune` : 同步并清理已删除远端分支
- `git fetch --tags` : 拉取所有标签
- `git fetch --no-tags` : 不拉取标签
- `git fetch --depth=10` : 限制拉取深度
- `git fetch --deepen=10` : 深化浅克隆
- `git fetch --unshallow` : 把浅克隆转完整
- `git fetch --all` : 拉取所有远端
- `git fetch origin +<branch>` : 强制更新分支

### git pull

- `git pull` : fetch + merge
- `git pull --ff-only` : 只允许快进，有冲突则失败
- `git pull --rebase` : fetch + rebase
- `git pull --no-rebase` : 强制 merge
- `git pull --autostash` : rebase 前自动 stash
- `git pull --no-autostash` : 禁用自动 stash
- `git pull --edit` : 拉取后编辑 commit message
- `git pull --no-edit` : 不编辑，自动完成 merge

### git push

- `git push` : 推到默认 upstream
- `git push origin <branch>` : 推指定分支
- `git push -u origin <branch>` : 首次推并建立 upstream
- `git push --set-upstream-to=origin/main` : 修改上游分支
- `git push --force-with-lease` : 安全强推
- `git push --force-with-lease origin <branch>` : 对指定分支安全强推
- `git push --force` : 强制推送（危险）
- `git push --tags` : 推送所有标签
- `git push origin --delete <branch>` : 删除远端分支
- `git push -d origin <branch>` : 同上，简写
- `git push --dry-run` : 预览推送结果
- `git push --follow-tags` : 推送时自动推送关联标签
- `git push --atomic` : 原子性推送（全部成功或全部失败）
- `git push origin +main` : 强制推送（覆盖远端 main）

### git remote

- `git remote show origin` : 查看远端详细信息

## stash、worktree、恢复与重置
---
emoji: 🧰
link: https://git-scm.com/docs/git-worktree
desc: stash 适合短暂寄存，worktree 适合并行长期开发，reset/revert/reflog 负责救火。
---

### git stash

- `git stash` : 快速寄存当前工作
- `git stash push -m "wip: xxx"` : 带说明寄存
- `git stash push -u` : 连未跟踪文件一起寄存
- `git stash push --staged` : 只寄存 staged 的部分
- `git stash -k` : 寄存并保持暂存区不变
- `git stash --keep-index` : 同 -k
- `git stash list` : 查看 stash 列表
- `git stash show` : 查看最近一条 stash 统计
- `git stash show -p stash@{0}` : 看 stash patch
- `git stash apply` : 应用但不删除
- `git stash apply stash@{1}` : 应用指定 stash
- `git stash pop` : 应用并删除最近 stash
- `git stash pop stash@{2}` : 应用并删除指定 stash
- `git stash drop stash@{0}` : 删除一条 stash
- `git stash clear` : 清空所有 stash
- `git stash branch <name>` : 从 stash 创建新分支

### git worktree

- `git worktree list` : 列出所有 worktree
- `git worktree list --porcelain` : 机器友好的输出格式
- `git worktree add <path> -b <branch>` : 新目录 + 新分支
- `git worktree add <path> -b <branch> origin/main` : 基于远端分支创建
- `git worktree add <path> <commit>` : 检出到具体 commit
- `git worktree remove <path>` : 安全删除（检查未提交变更）
- `git worktree remove --force <path>` : 强制删除
- `git worktree remove <path> --reason "..."` : 记录删除原因（2.40+）
- `git worktree lock <path> -m "reason"` : 锁定防止修改/删除
- `git worktree unlock <path>` : 解除锁定
- `git worktree move <old> <new>` : 移动 worktree 目录（2.40+）
- `git worktree prune` : 清理失效 worktree 引用
- `git worktree repair` : 修复 worktree 配置错误

### git reset

- `git reset --soft HEAD~1` : 撤销最近提交，保留 staged
- `git reset --mixed HEAD~1` : 撤销最近提交，改动回工作区
- `git reset --hard HEAD~1` : 彻底回滚到上一提交（危险）
- `git reset --soft <commit>` : 重置到指定提交
- `git reset --mixed <commit>` : 默认行为
- `git reset --hard <commit>` : 危险
- `git reset HEAD -- <file>` : 取消暂存某文件
- `git reset --merge HEAD~1` : 重置并保留 merge 状态

| reset 模式 | HEAD | 暂存区 | 工作区 |
| --- | --- | --- | --- |
| `--soft` | 回退 | 保留 | 保留 |
| `--mixed` | 回退 | 重置 | 保留 |
| `--hard` | 回退 | 重置 | 重置 |

### git revert

- `git revert <commit>` : 新建反向提交，回滚指定提交
- `git revert -n <commit>` : 回滚但不自动提交
- `git revert --no-edit` : 不编辑 message
- `git revert -m 1 <merge-commit>` : 回滚 merge commit

### git reflog

- `git reflog` : 查看本地引用移动历史
- `git reflog --date=relative` : 显示相对时间
- `git reflog --all` : 查看所有引用的 reflog
- `git reflog expire` : 清理过期的 reflog 条目
- `git reflog show HEAD` : 只看 HEAD 的 reflog

## 标签、补丁、排障与仓库卫生
---
emoji: 🛠️
link: https://git-scm.com/docs/git-tag
desc: 版本标签、补丁搬运、责任定位、忽略规则和清理命令。
---

### git tag

- `git tag` : 列所有标签
- `git tag -l "v1.*"` : 列出匹配模式的标签
- `git tag --list "v1.*"` : 同 -l
- `git tag -a v1.0.0 -m "release: v1.0.0"` : 创建附注标签
- `git tag -a v1.0.0 <commit>` : 给指定提交打标签
- `git tag -s v1.0.0 -m "signed"` : 创建 GPG 签名标签
- `git tag -d v1.0.0` : 删除本地标签
- `git tag --delete v1.0.0` : 同 -d
- `git tag -v v1.0.0` : 验证签名标签
- `git tag --points-at <commit>` : 显示某提交上的所有标签
- `git tag --sort=version:refname` : 按版本排序
- `git push origin v1.0.0` : 推单个标签
- `git push origin --delete v1.0.0` : 删除远端标签
- `git push --tags` : 推所有标签
- `git push origin --follow-tags` : 只推带注释的标签

### git cherry-pick

- `git cherry-pick <commit>` : 摘一条提交到当前分支
- `git cherry-pick -x <commit>` : 保留来源信息
- `git cherry-pick -n <commit>` : 摘取但不要自动提交
- `git cherry-pick --no-commit <commit>` : 同 -n
- `git cherry-pick --quit` : 放弃继续 cherry-pick
- `git cherry-pick --continue` : 解决冲突后继续
- `git cherry-pick --abort` : 取消并恢复到之前状态
- `git cherry-pick <commit-A>..<commit-B>` : 摘取 A 到 B 之间的所有提交（不含 A）
- `git cherry-pick <commit-A>^..<commit-B>` : 摘取 A 到 B 之间的所有提交（含 A）

### git blame

- `git blame <file>` : 看每行最后修改提交
- `git blame -L <start>,<end> <file>` : 只看指定行范围
- `git blame -l` : 显示完整 commit hash
- `git blame -t` : 显示时间戳
- `git blame --ignore-rev <commit>` : 忽略某次修订的修改
- `git blame --ignore-revs-file <file>` : 从文件读取忽略列表

### git grep

- `git grep "keyword"` : 在仓库里搜索
- `git grep -n "keyword"` : 显示行号
- `git grep -c "keyword"` : 显示每个文件的匹配数
- `git grep -l "keyword"` : 只显示文件名
- `git grep -i "keyword"` : 忽略大小写
- `git grep -v "keyword"` : 反向匹配
- `git grep -E "pattern"` : 扩展正则
- `git grep -G "pattern"` : 基本正则
- `git grep --name-only` : 只显示文件名
- `git grep --count` : 同 -c
- `git grep -p <pattern> -- <path>` : 只在指定路径搜索
- `git grep -W` : 显示匹配的完整单词

### git bisect

- `git bisect start` : 开始二分定位
- `git bisect good <commit>` : 标记好版本
- `git bisect bad <commit>` : 标记坏版本
- `git bisect bad` : 默认 HEAD 为坏版本
- `git bisect reset` : 结束二分
- `git bisect skip` : 跳过当前提交
- `git bisect --first-parent` : 只沿第一父链搜索
- `git bisect --no-checkout` : 不检出，直接指定 good/bad

### git clean

- `git clean -fdn` : 预览将删除的未跟踪文件
- `git clean -fd` : 删除未跟踪文件和目录
- `git clean -n` : 同 --dry-run，预览
- `git clean --dry-run` : 预览但不删除
- `git clean -f` : 删除未跟踪文件
- `git clean -df` : 删除文件和目录
- `git clean -x` : 包含被 .gitignore 忽略的文件
- `git clean -X` : 只删除被忽略的文件
- `git clean -q` : 静默模式
- `git clean -e <pattern>` : 排除匹配的文件

### .gitignore

```bash
# 常见 .gitignore
node_modules/
dist/
.env.local
*.log
coverage/
.DS_Store
*.swp
```

- `git check-ignore -v <file>` : 看某文件为什么被忽略
- `git add -f <file>` : 强制添加被忽略的文件

### git archive

- `git archive HEAD --format=zip -o repo.zip` : 导出当前源码快照
- `git archive --format=tar.gz HEAD -o repo.tar.gz` : 导出 tar.gz
- `git archive v1.0.0 | tar -xzf -` : 导出指定 tag

### git verify-commit

- `git verify-commit <commit>` : 验证 commit 的 GPG 签名

### git verify-tag

- `git verify-tag <tag>` : 验证 tag 的 GPG 签名
