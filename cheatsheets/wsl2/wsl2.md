---
title: WSL2 命令速查
lang: bash
version: "1.0"
date: "2026-04-15"
github: microsoft/WSL
colWidth: 4
desc: 在 Windows 中高效使用 WSL2 的核心命令、PATH 差异解决方案与互操作技巧。
---

## 快速定位
---
lang: bash
desc: WSL2 是 Windows Subsystem for Linux 2，让你在 Windows 上无缝运行 Linux 环境。常用于在 Windows 开发中调用 Linux 工具链。
---

- 核心场景：在 Windows CMD/PowerShell 中直接调用 Linux 命令
- 与 Windows 互操作：`\\wsl$\` 访问 Linux 文件，WSL IP 可从 Windows 访问
- 入口命令：`wsl`（交互式）、`wsl <命令>`（非交互式）

## 在 Windows 中非交互式执行 WSL2 命令
---
lang: bash
desc: 从 CMD、PowerShell 或脚本直接调用 WSL2 中的 Linux 命令，执行完毕自动返回 Windows。
---

### 基本语法

```powershell
# 在默认发行版执行一条命令后返回
wsl uname
# 输出: Linux

wsl uname -a
# 输出: Linux DESKTOP-XXX 5.15.xxx-microsoft-standard-WSL2 ...
```

### 常用方式

```powershell
# 指定发行版执行（非默认）
wsl -d Ubuntu uname -a

# 查看当前默认发行版
wsl -l -v

# 设置默认发行版
wsl --set-default Ubuntu
```

### 在 CMD / PowerShell / 脚本中调用

```powershell
# PowerShell
$result = wsl uname -a
Write-Output $result

# CMD
for /f %i in ('wsl uname -r') do echo %i
```

### 关键参数

| 参数 | 说明 |
|------|------|
| `wsl <命令>` | 在默认发行版执行命令后返回 |
| `wsl -d <名称> <命令>` | 指定发行版执行 |
| `wsl -e <命令>` | 明确指定要执行的程序（避免 shell 解析） |
| `wsl --` | 分隔符，后面的内容原样传给 Linux shell |

> **注意**：不加任何命令的 `wsl` 会进入交互式 shell，加上命令后执行完即退出。

---

## 根本原因：环境变量 PATH 不同
---
lang: bash
desc: 为什么同样一条命令，交互式能找到但非交互式找不到？根源在 PATH。
---

### 交互式 vs 非交互式的差异

当你执行 `wsl`（交互式）时，会加载完整的 shell 初始化文件：

```
~/.bashrc  →  ~/.bash_profile  →  /etc/profile  →  /etc/profile.d/*
```

当你执行 `wsl x`（非交互式）时，**这些文件都不会加载**，PATH 是最小化的系统默认值。

### 验证问题所在

```bash
# 比较两种模式的 PATH
wsl echo $PATH          # 非交互式的 PATH（很短）
wsl bash -ic 'echo $PATH'  # 交互式的 PATH（完整）

# 查看命令 x 在哪里
wsl which x             # 可能找不到
wsl bash -ic 'which x' # 能找到，说明问题在 PATH
```

### 解决方案

**方法 1：强制加载交互式环境（最简单）**

```bash
wsl bash -ic 'x'
# -i = interactive, -c = 执行命令
```

**方法 2：使用绝对路径**

```bash
# 先找到 x 的位置
wsl bash -ic 'which x'   # 假设输出 /usr/local/bin/x

# 然后直接用绝对路径
wsl /usr/local/bin/x
```

**方法 3：在 `~/.bashrc` 末尾加入 PATH（一劳永逸）**

```bash
# 在 WSL 中编辑
echo 'export PATH="$PATH:/usr/local/bin"' >> ~/.bashrc
```

### 为什么 `uname` 不受影响？

`uname` 位于 `/usr/bin/uname`，这个路径**始终在默认 PATH 中**，所以任何模式都能找到。

而你的 `x` 命令可能安装在：

- `/usr/local/bin` — 不一定在非交互式 PATH 中
- `~/bin` 或 `~/.local/bin` — 几乎肯定不在
- 某个通过 `.bashrc` 添加的自定义路径

---

## WSL2 与 Windows 互操作
---
lang: bash
desc: WSL2 与 Windows 之间的高频互操作场景。
---

### 在 Windows 中访问 Linux 文件

```powershell
# 通过 \\wsl$\ 路径直接访问
\\wsl$\Ubuntu\home\username\project

# 在 PowerShell 中切换到 Linux home
cd \\wsl$\Ubuntu\home
```

### 在 Linux 中访问 Windows 文件

```bash
# 挂载的 Windows 驱动器在 /mnt/ 下
ls /mnt/c/Users/

# 通过 $MACHINE_NAME 访问 Windows 主机
ping host.docker.internal
```

### 环境变量传递

```powershell
# Windows → WSL：Windows 环境变量自动可见
wsl echo $PATH

# WSL → Windows：需要手动引用
wsl echo $WIN_HOME  # 需要在 WSL 中先定义
```

---

## 核心场景小贴士
---
lang: bash
desc: 不想背命令时，记住下面这些场景映射就够了。
---

- **在 PowerShell 里调用 Linux 命令**：直接 `wsl <命令>`，无需进入 WSL
- **命令找不到时报错**：先用 `wsl bash -ic 'which <命令>'` 确认路径，再用 `wsl <绝对路径>` 执行
- **需要完整 shell 环境**：用 `wsl bash -ic '<命令>'` 强制走交互式加载
- **修改 WSL 命令永久生效**：把 export 写入 `~/.bashrc`
- **跨系统编辑 Windows 文件**：在 WSL 里用 `code /mnt/c/...` 打开 VS Code
