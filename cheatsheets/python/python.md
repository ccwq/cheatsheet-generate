---
title: Python 管理与环境指南
lang: bash
version: "3.12"
date: 2026-04-16
github: python/cpython
colWidth: 340px
---

## 🐍 Recipe 1: Python 与 Pip 关系

### 核心定位

| 组件 | 职责 | 本质 |
|------|------|------|
| Python | 引擎（解释器） | 运行代码的核心程序 |
| pip | 包管理器 | 从 PyPI 下载并安装第三方库的 Python 包 |

* Action: pip 本身也是一个 Python 包，通过 `python -m pip` 调用比直接用 `pip` 更安全，能确保使用特定 Python 版本对应的 pip。

---

## 🛠️ Recipe 2: 修复 "Pip Not Found"

如果 `python` 可用但 `pip` 报 "command not found"，通常是 Scripts 文件夹未加入 PATH。

### 方案一：快速修复

```bash
py -m pip --version
```

### 方案二：重新安装 pip

```bash
python -m ensurepip --upgrade
```

### 方案三：永久修复 — 手动添加 Scripts 到 PATH

1. 找到 Python 安装目录（例如 `%LocalAppData%\Programs\Python\Python312`）
2. 找到 `Scripts` 子文件夹
3. 添加到 **环境变量 → 用户变量 → Path**

---

## 📂 Recipe 3: Python 目录结构解析

标准 Windows 安装目录（例如 `C:\Python312\`）结构：

| 目录/文件 | 作用 |
|-----------|------|
| `python.exe` | 核心引擎（解释器） |
| `Lib\` | 标准库（os、sys、math 等预装工具） |
| `Lib\site-packages\` | pip 安装第三方库的位置（requests、pandas 等） |
| `Scripts\` | 可执行工具（pip.exe、black.exe、pytest.exe） |
| `Include\` | C 头文件，用于编译 Python 扩展 |

---

## 🗺️ Recipe 4: PATH vs. PYTHONPATH

| 变量 | 作用 | 使用场景 |
|------|------|----------|
| Path | 告诉 Windows 在哪找 `.exe` 文件 | 输入 `python` 或 `pip` 命令 |
| PYTHONPATH | 告诉 Python 在哪找 `.py` 模块 | 仅用于自定义/本地模块（非常规场景） |

> Pro Tip: 基本工作中几乎不需要手动设置 PYTHONPATH，pip 会自动管理 site-packages 内的搜索路径。

---

## 🌟 Recipe 5: 虚拟环境（最佳实践）

避免污染全局 PATH，推荐使用虚拟环境：

```bash
# 创建虚拟环境
python -m venv .venv

# 激活（Windows）
.\.venv\Scripts\activate
```

> 这会在项目文件夹内创建独立的"微型"目录结构，保持全局环境整洁。

---

## 📦 Recipe 6: uv 全局能力

`uv` 是一个用 Rust 编写的极速 Python 包管理器，与 pipx 协同工作。

### ~/.local/bin 是什么？

在 Windows 上，`~/.local/bin`（即 `C:\Users\用户名\.local\bin`）是跨平台开发工具写入的类 Unix 风格路径。

### 哪些软件会写入此目录？

| 软件 | 说明 |
|------|------|
| pipx | Python 终端应用安装工具，默认将可执行文件放在此目录 |
| Claude Code | Anthropic CLI 工具安装位置 |
| 跨平台安装脚本 | Rust、Node.js 等工具的快捷安装脚本 |

### 为什么不在系统 PATH 中？

- Windows 标准用户程序目录是 `%APPDATA%\Python\Scripts` 或 `%LOCALAPPDATA%\Programs`
- `~/.local/bin` 是 Linux 习惯，Windows 本身不识别
- 安装程序为避免破坏 shell 配置，不会自动修改 PATH

### 解决方案

#### 自动修复（pipx）

```bash
pipx ensurepath
```

#### 手动添加

1. 右键"此电脑" → "属性" → "高级系统设置" → "环境变量"
2. 在"用户变量"中找到 `Path`，点击"编辑"
3. 新建，输入 `%USERPROFILE%\.local\bin`
4. 重启终端

---

## 🔧 Recipe 7: Python 环境变量速查

| 变量 | 作用 | 常见值 |
|------|------|--------|
| PATH | 查找 python.exe、pip.exe 等可执行文件 | `C:\Python312\;C:\Python312\Scripts\` |
| PYTHONPATH | Python 导入模块的搜索路径 | `C:\MyModules\` |
| PYTHONHOME | Python 安装根目录 | `C:\Python312\` |
| PYTHONCASEOK | 忽略模块名大小写（Windows 用） | `1` |

---

## ⚡ Recipe 8: 高频命令速查

| 操作 | 命令 |
|------|------|
| 检查 Python 版本 | `python --version` |
| 检查 pip 版本 | `python -m pip --version` |
| 安装包 | `python -m pip install 包名` |
| 升级 pip | `python -m pip install --upgrade pip` |
| 列出已安装包 | `pip list` |
| 创建虚拟环境 | `python -m venv .venv` |
| 激活虚拟环境 | `.\.venv\Scripts\activate` |
| 导出依赖 | `pip freeze > requirements.txt` |
| 从文件安装 | `pip install -r requirements.txt` |
