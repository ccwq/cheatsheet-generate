---
title: Chocolatey CLI
lang: bash
version: "2.6.0"
date: "2025-12-01"
github: chocolatey/choco
colWidth: 360px
---

# Chocolatey CLI

## 快速定位 / 入口
---
emoji: 🍫
link: https://docs.chocolatey.org/en-us/choco/commands/
desc: Chocolatey 更适合按“装软件、批量升级、锁版本、迁机器、接私有源”这些 Windows 运维场景来用。
---
- 安装软件：`choco install`
- 升级软件：`choco upgrade`
- 搜包查详情：`choco search` / `choco info`
- 锁版：`choco pin`
- 管源：`choco source`
- 导出环境：`choco export`

## 起手式：把常用软件一次装齐
---
emoji: 📦
link: https://docs.chocolatey.org/en-us/choco/commands/install/
desc: 新机器初始化时，先走批量安装，再单独处理少数带 GUI 参数的软件。
---
- `choco install git nodejs vscode -y`：批量安装
- `--version=...`：锁定安装版本
- `--params '\"...\"'`：透传安装参数
- `-y`：避免交互阻塞

```bash
choco install git nodejs vscode 7zip -y
choco install googlechrome -y
```

## Recipe：批量升级，但排除关键包
---
emoji: ⬆️
link: https://docs.chocolatey.org/en-us/choco/commands/upgrade/
desc: 生产环境最常见的做法不是“全升”，而是先筛查、再排除核心依赖升级。
---
- `choco outdated`：先看哪些包有更新
- `choco upgrade all -y`：升级全部
- `choco upgrade all --except="'git,nodejs'" -y`：排除关键包
- `choco pin add -n=git`：把关键包锁住

```bash
choco outdated
choco pin add -n=git
choco upgrade all --except="'git,nodejs'" -y
```

## Recipe：安装前先查包、看版本、看依赖
---
emoji: 🔎
link: https://docs.chocolatey.org/en-us/choco/commands/search/
desc: 安装失败或装错包，很多时候是因为没先确认包名和版本策略。
---
- `choco search git`：搜索
- `choco search git --exact`：精确查找
- `choco info git`：看详情
- `choco list -lo`：本机已安装包
- `choco outdated`：看哪些包落后

## Recipe：给企业环境加私有源
---
emoji: 🌐
link: https://docs.chocolatey.org/en-us/choco/commands/source/
desc: 企业场景里通常是“加内网源 -> 禁默认源 -> 从私有源安装”。
---
- `choco source list`：列出现有源
- `choco source add -n=corp -s=https://repo.example/choco`：加私有源
- `choco source disable -n=chocolatey`：禁用社区默认源
- `choco install pkg -s="'corp'"`：指定源安装

```bash
choco source add -n=corp -s=https://repo.example/choco
choco source disable -n=chocolatey
choco install git -s="'corp'" -y
```

## Recipe：导出一台机器的软件清单，再迁到另一台
---
emoji: 🧾
link: https://docs.chocolatey.org/en-us/choco/commands/export/
desc: 重装系统或给同事复制环境时，这条 workflow 最实用。
---
- `choco export -o=packages.config`：导出包列表
- `choco install packages.config -y`：按配置恢复
- 迁移前先手工排除不该复制的机器专属软件

```bash
choco export -o=packages.config
choco install packages.config -y
```

## Recipe：把安装行为写进初始化脚本
---
emoji: ⚙️
link: https://docs.chocolatey.org/en-us/choco/commands/config/
desc: 稳定环境通常会把 source、config、feature 一起写进 bootstrap 脚本。
---
- `choco config set cacheLocation C:\choco-cache`：固定缓存目录
- `choco feature enable -n=allowGlobalConfirmation`：全局自动确认
- `choco cache remove --all`：清理缓存
- `--no-progress`：CI 输出更干净

```bash
choco feature enable -n=allowGlobalConfirmation
choco config set cacheLocation C:\choco-cache
choco install git vscode -y --no-progress
```

## 常见坑 / 决策规则
---
emoji: ⚠️
link: https://docs.chocolatey.org/en-us/choco/troubleshooting/
desc: Chocolatey 的大部分问题都不是命令本身，而是权限、源、代理和安装包静默参数。
---
- 大多数命令要用管理员权限终端执行
- `upgrade all` 前先看 `outdated`，不要盲升基础软件
- 企业内网通常要同时配置代理、证书和私有源
- 某些安装包还要补 `--install-arguments`
- 遇到 `3010` 表示安装成功但需要重启，不是普通失败
