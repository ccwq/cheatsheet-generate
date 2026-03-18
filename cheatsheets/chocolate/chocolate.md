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
desc: Chocolatey 适合按“装软件、批量升级、锁版本、迁移机器、接私有源”这些 Windows 运维场景来用，前半部分先看 cookbook，后半部分再查完整命令 API。
---
- 安装软件：`choco install`
- 升级软件：`choco upgrade`
- 搜包和查详情：`choco search` / `choco info`
- 锁版本：`choco pin`
- 管源：`choco source`
- 导出环境：`choco export`

## 起手式：把常用软件一次装齐
---
emoji: 🚀
link: https://docs.chocolatey.org/en-us/choco/commands/install/
desc: 新机器初始化时，先走批量安装，再单独处理少数带 GUI 参数或企业定制参数的软件。
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
emoji: 🔄
link: https://docs.chocolatey.org/en-us/choco/commands/upgrade/
desc: 生产环境更常见的做法不是“全升”，而是先筛查，再排除基础依赖或已锁版的软件。
---
- `choco outdated`：先看哪些包有更新
- `choco upgrade all -y`：升级全部
- `choco upgrade all --except="'git,nodejs'" -y`：排除关键包
- `choco pin add -n=git`：先把关键包锁住

```bash
choco outdated
choco pin add -n=git
choco upgrade all --except="'git,nodejs'" -y
```

## Recipe：安装前先查包、看版本、看依赖
---
emoji: 🔎
link: https://docs.chocolatey.org/en-us/choco/commands/search/
desc: 装错包或装到错误版本，通常是因为没有先确认包名、版本策略和来源。
---
- `choco search git`：搜索包
- `choco search git --exact`：精确搜索
- `choco info git`：查看包详情
- `choco list -lo`：查看本机已安装包
- `choco outdated`：查看哪些包落后

## Recipe：给企业环境加私有源
---
emoji: 🏢
link: https://docs.chocolatey.org/en-us/choco/commands/source/
desc: 企业环境常见路径是“加内网源 -> 禁用默认源 -> 从私有源安装”，必要时再补 API Key 和代理。
---
- `choco source list`：列出现有源
- `choco source add -n=corp -s=https://repo.example/choco`：添加私有源
- `choco source disable -n=chocolatey`：禁用社区默认源
- `choco install pkg -s="'corp'"`：指定源安装

```bash
choco source add -n=corp -s=https://repo.example/choco
choco source disable -n=chocolatey
choco install git -s="'corp'" -y
```

## Recipe：导出一台机器的软件清单，再迁到另一台
---
emoji: 📋
link: https://docs.chocolatey.org/en-us/choco/commands/export/
desc: 重装系统、批量发新机或给同事复制环境时，这条 workflow 很实用。
---
- `choco export -o=packages.config`：导出包清单
- `choco install packages.config -y`：按清单恢复
- 迁移前先手工排除不该复制的机器专属软件

```bash
choco export -o=packages.config
choco install packages.config -y
```

## Recipe：把安装行为写进初始化脚本
---
emoji: 🧩
link: https://docs.chocolatey.org/en-us/choco/commands/config/
desc: 稳定环境通常会把 `source`、`config`、`feature` 和安装动作一起收进 bootstrap 脚本。
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
desc: Chocolatey 的常见问题通常不在命令本身，而在权限、源、代理、证书和安装参数。
---
- 大多数命令需要管理员权限终端执行
- `upgrade all` 前先看 `outdated`，不要盲升基础软件
- 企业内网往往要同时配置代理、证书和私有源
- 某些安装包还要额外补 `--install-arguments`
- 遇到 `3010` 通常表示安装成功但需要重启，不是普通失败

## 完整 API：总入口
---
emoji: 📚
link: https://docs.chocolatey.org/en-us/choco/commands/
desc: 这部分放在最后，专门做完整命令索引。先记住全局参数，再按“装包、查包、管源、打包发布、系统配置”分组查命令。
---
- 基本形态：`choco <command> [subject] [options]`
- 查看命令帮助：`choco <command> --help`
- 打开在线帮助：`choco <command> --help --online`
- 脚本里优先写完整参数名，避免短参数歧义
- 自动化环境里通常显式加 `-y`

```bash
choco install git -y --no-progress
choco source list
choco push pkg.1.0.0.nupkg --source="'https://repo.example/api/v2/'"
```

## API：全局参数
---
emoji: ⚙️
link: https://docs.chocolatey.org/en-us/choco/commands/
desc: 这些参数几乎所有命令都能用，写脚本和排查问题时最常见。
---
- `-h`, `--help`, `-?`：显示帮助
- `--online`：结合 `--help` 打开在线文档
- `-y`, `--yes`, `--confirm`：自动确认
- `-d`, `--debug`：输出调试日志
- `-v`, `--verbose`：输出详细日志
- `--trace`：输出更细的跟踪日志
- `--noop`, `--whatif`：只演练不执行
- `-r`, `--limit-output`：输出更适合脚本解析
- `--no-progress`：关闭进度条，CI 常用
- `--timeout=<seconds>`：覆盖默认超时
- `--source="'...'"`：指定包源
- `--proxy="'...'"` / `--proxy-user` / `--proxy-password`：代理参数

## API：包生命周期命令
---
emoji: 📦
link: https://docs.chocolatey.org/en-us/choco/commands/
desc: 从安装、升级、卸载到锁版和导出，这组命令覆盖大部分日常机器管理动作。
---
- `install`：安装一个或多个包
- `upgrade`：升级包，也常作为“安装或升级”
- `uninstall`：卸载包
- `outdated`：查看可升级包
- `pin`：给包加锁，阻止升级
- `list`：列出本地已安装包
- `export`：导出本机安装清单
- `optimize`：优化安装占用，减少磁盘空间

```bash
choco upgrade all -y
choco uninstall git -y
choco pin add -n=git
choco export -o=packages.config
```

## API：查询、源与仓库交互
---
emoji: 🔍
link: https://docs.chocolatey.org/en-us/choco/commands/
desc: 这一组用于查包、看详情、管理源，以及和 NuGet/API 仓库交互。
---
- `search`：搜索远端包
- `find`：`search` 的别名
- `info`：查看包详情，确认版本、依赖、来源
- `source`：新增、删除、启用、禁用、列出源
- `sources`：`source` 的别名
- `apikey`：保存、读取、删除某个源的 API Key
- `setapikey`：`apikey` 的别名
- `download`：下载包，也可用于 internalize 远端资源
- `push`：把打好的包推送到源

```bash
choco search git --exact
choco info git
choco source add -n=corp -s="'https://repo.example/api/v2/'"
choco apikey add --source="'https://repo.example/api/v2/'" --key="'TOKEN'"
```

## API：打包与仓库维护
---
emoji: 🧱
link: https://docs.chocolatey.org/en-us/choco/commands/
desc: 如果不只是“用包”，而是要“做包、改包、发包”，主要看这一组。
---
- `new`：生成新包模板
- `pack`：把 nuspec 和脚本打成 `nupkg`
- `template`：查看已安装模板信息
- `templates`：`template` 的别名
- `convert`：在不同包类型之间转换
- `sync` / `synchronize`：同步系统已装软件并生成缺失包
- `rule`：查看已实现的包规则

```bash
choco new mytool
choco pack
choco push mytool.1.0.0.nupkg --source="'https://repo.example/api/v2/'"
```

## API：配置、功能与系统命令
---
emoji: 🛠️
link: https://docs.chocolatey.org/en-us/choco/commands/
desc: 这组命令更偏“系统级控制面”，适合放进初始化脚本和问题排查流程。
---
- `config`：查看和修改 Chocolatey 配置
- `feature` / `features`：查看和切换特性开关
- `cache`：管理本地 HTTP 缓存
- `help`：顶层帮助入口
- `support`：输出支持与诊断信息
- `license`：显示许可证信息

```bash
choco config list
choco config set cacheLocation C:\choco-cache
choco feature enable -n=allowGlobalConfirmation
choco cache remove --all
```

## API：别名与弃用命令
---
emoji: 🧭
link: https://docs.chocolatey.org/en-us/choco/commands/
desc: 迁移旧脚本时有用；新脚本尽量写主命令名，不依赖旧别名。
---
- `find` -> `search`
- `sources` -> `source`
- `features` -> `feature`
- `setapikey` -> `apikey`
- `templates` -> `template`
- `synchronize` -> `sync`
- `unpackself`：已弃用，文档标注将在 `v3.0.0` 移除
