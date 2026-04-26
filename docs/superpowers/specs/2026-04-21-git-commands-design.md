# Git Commands 学习型指南设计

## 目标

创建 `cheatsheets/git-commands/` 独立目录，生成一份面向入门到进阶用户的 Git 核心命令学习指南，重点覆盖 rebase、merge、fetch、pull、push、checkout、reset 七个命令。

## 目录结构

```
cheatsheets/
  └── git-commands/
        ├── meta.yml          # 文档元数据
        └── git-commands.md   # 主内容
```

## 内容大纲

### 1. 概念入门
- Git 快照模型 vs 传统差异模型
- 指针与引用的关系（HEAD、branch、remote）
- 工作区 / 暂存区 / 仓库 三层结构

### 2. fetch 与 pull
- fetch：只更新远程跟踪分支，不动本地分支
- pull = fetch + merge（默认）
- pull --ff-only：只允许快进
- pull --rebase：保持线性历史
- 适用场景对比表

### 3. merge
- fast-forward（无实际合并提交）
- 递归合并（创建 merge commit）
- 快进失败时的处理方式
- 冲突处理流程
- merge 黄金法则

### 4. rebase
- 原理：重写提交历史
- rebase vs merge 对比图示
- 交互式 rebase（-i）：pick / squash / fixup / reword / drop
- rebase 黄金法则：不要在公共分支上 rebase
- force-with-lease 安全推送

### 5. checkout 与 switch
- checkout 历史遗留职责（切换分支 + 恢复文件）
- switch（Git 2.23+）：职责分离
- restore：专门恢复文件

### 6. reset
- 三种模式：--soft / --mixed / --hard
- 使用场景对比表
- reflog 后悔药

### 7. push
- 首次推送与 upstream
- push --force-with-lease vs --force
- 删除远程分支

### 8. 速查对照表
- 各命令核心参数对比

## 迁移声明

在 `cheatsheets/git/git.md` 中，涉及这些命令的章节末尾添加：

```markdown
> 这部分内容已迁移至 [git-commands](../git-commands/) 完整学习指南
```

## 设计原则

- 入门友好：用类比和图示解释概念
- 进阶实用：场景对比、注意事项、高级用法
- 每节包含一个以上实际可用命令示例
