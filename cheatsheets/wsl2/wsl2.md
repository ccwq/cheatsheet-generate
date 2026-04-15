---
title: WSL2 命令与互操作速查
lang: bash
version: "2.6.3"
date: "2025-12-12"
github: microsoft/WSL
colWidth: 4
desc: 覆盖 WSL2 的高频管理命令、Windows/Linux 互操作、环境变量传递与常见排障路径。
---

## 快速定位
---
lang: bash
link: https://learn.microsoft.com/en-us/windows/wsl/basic-commands
desc: WSL2 适合两类动作：一类是管理发行版和运行时，另一类是在 Windows 与 Linux 之间直接混用命令、路径和环境。
---

- 最短路径：先看“起手工作流”，再按“命令速查”或“互操作 recipes”抄命令
- 如果你是在 PowerShell / CMD 里调用 Linux 命令，优先记住 `wsl <command>`、`wsl -d <Distro> <command>`、`wsl -e <command>`
- 如果你是在维护 WSL 本身，优先记住 `wsl --status`、`wsl --update`、`wsl --shutdown`
- 如果你是在做迁移或清理，优先记住 `--export`、`--import`、`--unregister`

## 起手工作流
---
lang: powershell
link: https://learn.microsoft.com/en-us/windows/wsl/basic-commands
desc: 新机器或新环境里，先确认状态、发行版和默认版本，再决定是直接运行命令，还是进入交互式 shell。
---

```powershell
# 首次安装 WSL
wsl --install

# 查看当前 WSL 状态与默认版本
wsl --status

# 查看发行版及其运行状态
wsl -l -v

# 更新 WSL 运行时
wsl --update

# 进入默认发行版的交互式 shell
wsl
```

### 场景映射

- **我要先装起来**：`wsl --install`
- **我要确认系统现在是什么状态**：`wsl --status`
- **我要看有哪些发行版、谁是默认**：`wsl -l -v`
- **我要更新 WSL 本体**：`wsl --update`
- **我要先进 shell 再手动操作**：直接 `wsl`

## 运行发行版与执行命令
---
lang: powershell
link: https://learn.microsoft.com/en-us/windows/wsl/basic-commands
desc: 这组命令解决“在哪个发行版里，以什么方式，执行哪条 Linux 命令”。
---

### 最常用命令链

```powershell
# 在默认发行版中执行一条命令，执行完返回 Windows
wsl uname -a

# 指定发行版执行
wsl -d Ubuntu uname -a

# 指定用户执行
wsl -d Ubuntu -u root id

# 直接执行程序，不经默认 shell 二次解析
wsl -e sh -lc "uname -a"

# 指定起始目录
wsl --cd ~
wsl --cd /mnt/c/Users/you/project
```

### 参数速查

| 参数 | 作用 | 适用场景 |
| --- | --- | --- |
| `wsl <command>` | 在默认发行版执行单条命令 | PowerShell/CMD 里顺手跑 Linux 工具 |
| `wsl -d <Distro> <command>` | 指定发行版执行 | 多发行版并存 |
| `wsl -u <User>` | 指定 Linux 用户 | 需要 root 或特定用户环境 |
| `wsl -e <command>` | 直接执行程序 | 避免 shell 解析差异 |
| `wsl --cd <Directory>` | 指定 WSL 启动目录 | 切换目录后再执行 |
| `wsl --` | 把后续内容传给默认 shell | 参数里有 `-` 或复杂拼接时 |

### 快速判断

- **只跑一条命令**：`wsl <command>`
- **怕引号或 shell 解析搞乱参数**：改用 `wsl -e`
- **多发行版环境**：显式加 `-d`
- **命令依赖当前目录**：显式加 `--cd`

## 发行版生命周期管理
---
lang: powershell
link: https://learn.microsoft.com/en-us/windows/wsl/basic-commands
desc: 这组命令用于切换 WSL1/WSL2、设置默认发行版、停止实例、清理发行版。
---

```powershell
# 设置默认发行版
wsl --set-default Ubuntu

# 把某个发行版切换到 WSL2
wsl --set-version Ubuntu 2

# 停止某个发行版
wsl --terminate Ubuntu

# 关闭整个 WSL 虚拟机
wsl --shutdown

# 注销发行版（会删除该发行版的数据）
wsl --unregister Ubuntu
```

### 什么时候用哪条

- **刚装完发行版，想切到 WSL2**：`wsl --set-version <Distro> 2`
- **命令卡住或网络状态异常，想重启 WSL**：`wsl --shutdown`
- **只想停掉一个发行版**：`wsl --terminate <Distro>`
- **彻底删掉某个发行版**：`wsl --unregister <Distro>`

## 备份、迁移与磁盘
---
lang: powershell
link: https://learn.microsoft.com/en-us/windows/wsl/basic-commands
desc: 这组命令处理导出/导入发行版和附加磁盘，适合迁移、备份和隔离数据盘。
---

```powershell
# 导出发行版
wsl --export Ubuntu D:\\backup\\ubuntu.tar

# 导入发行版到新位置
wsl --import Ubuntu-Dev D:\\wsl\\ubuntu-dev D:\\backup\\ubuntu.tar --version 2

# 原地导入已有 VHDX
wsl --import-in-place Ubuntu-Data D:\\wsl\\ubuntu-data.vhdx

# 挂载物理磁盘或 VHD
wsl --mount \\\\.\\PHYSICALDRIVE3
```

### 注意点

- `--export` / `--import` 适合迁移发行版、做冷备份
- `--import` 时可以顺手指定 `--version 2`
- `--unregister` 前如果数据重要，先 `--export`
- `--mount` 只在 WSL2 可用，适合直接读取 ext4 磁盘或数据盘

## Windows 与 Linux 互操作 Recipes
---
lang: bash
link: https://learn.microsoft.com/en-us/windows/wsl/filesystems
desc: WSL 的强项不是“开一个 Linux”，而是让 Windows 和 Linux 的命令、文件系统与工具链互相借力。
---

### Windows 里跑 Linux 命令

```powershell
# 直接从当前 Windows 目录调用 Linux 命令
wsl ls -la

# 访问 Windows 路径时改成 /mnt/<drive> 形式
wsl ls -la /mnt/c/Users
```

### Windows 访问 Linux 文件

```powershell
# 资源管理器地址栏可直接输入
\\wsl$

# 指定某个发行版
\\wsl$\Ubuntu\home\you\project
```

### Linux 访问 Windows 文件和 Windows 程序

```bash
# 访问 Windows 文件
cd /mnt/c/Users/you/project

# 从 WSL 打开资源管理器
explorer.exe .

# 从 WSL 调用 VS Code
code .
```

### 经验规则

- Linux 项目文件优先放在 `\\wsl$` 对应的 Linux 文件系统里，性能通常比直接放 `/mnt/c` 更好
- Windows 路径进 WSL 后一般变成 `/mnt/c/...`
- Windows 命令从 WSL 调用时通常保留 `.exe` 后缀更稳，例如 `explorer.exe`

## PATH 与环境变量
---
lang: bash
link: https://learn.microsoft.com/en-us/windows/wsl/filesystems
desc: 非交互式执行、shell 启动文件和 Windows/WSL 变量传递，是最容易把人绕晕的一段；这里给最小可用规则，不硬讲 shell 教科书。
---

### 先记住结论

- `wsl <command>` 是“从 Windows 发起的一次执行”，不要默认它等价于你手工进入交互式 shell 后的环境
- 命令找不到时，先区分是 PATH 问题、shell 初始化问题，还是命令压根没装
- 跨 Windows/WSL 共享自定义环境变量时，优先用 `WSLENV`

### 定位 PATH 问题

```powershell
# 查看 WSL 中的 PATH
wsl printenv PATH

# 通过交互式 bash 查看 PATH
wsl bash -ic 'printenv PATH'

# 查看命令到底在哪
wsl bash -ic 'command -v node'
```

### 常见解决方式

```bash
# 方式 1：需要交互式 shell 初始化时，用 bash -ic
wsl bash -ic 'node -v'

# 方式 2：直接使用绝对路径
wsl /usr/bin/env

# 方式 3：把自定义 PATH 放进你实际使用的 shell 启动文件
```

### 环境变量传递

```powershell
# 查看 WSLENV
wsl printenv WSLENV

# 传一个普通变量给 WSL 使用
setx DEMO_HOME C:\demo
setx WSLENV DEMO_HOME/p
```

- 官方推荐通过 `WSLENV` 控制变量如何在 Windows 与 WSL 间转换
- 不要把“Windows 环境变量自动都能在 WSL 里看到”当成规则，默认只把你确认过的变量当成可用

## 高频排障
---
lang: powershell
link: https://learn.microsoft.com/en-us/windows/wsl/basic-commands
desc: WSL 出问题时，先缩小范围：是发行版、运行时、路径互操作，还是环境差异。
---

### 我应该先查什么

| 现象 | 先执行什么 | 常见原因 |
| --- | --- | --- |
| `wsl` 启动异常 | `wsl --status` | WSL 组件状态异常 |
| 发行版不对 / 默认不对 | `wsl -l -v` | 默认发行版或版本设置不对 |
| 单个发行版卡死 | `wsl --terminate <Distro>` | 实例挂起 |
| 整体网络或挂载异常 | `wsl --shutdown` | 需要重启整套 WSL 虚拟机 |
| 命令找不到 | `wsl bash -ic 'command -v <cmd>'` | PATH 或 shell 初始化差异 |
| 数据迁移前不放心 | `wsl --export <Distro> <File>` | 先做备份 |

### 收尾速记

- **改版本**：`wsl --set-version <Distro> 2`
- **改默认发行版**：`wsl --set-default <Distro>`
- **看状态**：`wsl --status`
- **看列表**：`wsl -l -v`
- **重启 WSL**：`wsl --shutdown`
