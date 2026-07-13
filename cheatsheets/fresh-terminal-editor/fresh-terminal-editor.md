---
title: Fresh Terminal IDE 速查表
lang: bash
version: "2.3.7"
date: "2026-07-12"
github: nickcis/fresh
colWidth: 360px
desc: Zero-config 终端 IDE，Rust 编写，支持多光标、LSP、Git 集成、SSH 远程编辑、TypeScript 插件，开箱即用。
tags:
  - 开发工具
  - Terminal
  - IDE / 编辑器
  - Rust
  - 开源
  - LSP
  - Git 集成
---

# Fresh Terminal IDE 速查表

> **Fresh** — 零配置终端 IDE。Rust 编写，秒级启动，毫秒级输入响应。Linux / macOS / Windows 全平台支持。

## 快速定位

| 维度 | 内容 |
|---|---|
| 安装 | `curl https://raw.githubusercontent.com/sinelaw/fresh/refs/heads/master/scripts/install.sh | sh` |
| 官网 | [getfresh.dev](https://getfresh.dev) |
| 源码 | [github.com/nickcis/fresh](https://github.com/nickcis/fresh) |
| 语言 | Rust |
| 协议 | Apache-2.0 |
| Stars | ~7,800+ |
| 依赖 | 零依赖（原生二进制） |

## 最短工作流

### 安装（Linux / macOS）

```bash
# 一行安装
curl https://raw.githubusercontent.com/sinelaw/fresh/refs/heads/master/scripts/install.sh | sh

# 安装完成后直接运行
fresh
```

### SSH 远程编辑

```bash
# 直接编辑远程文件（和本地一样流畅）
fresh deploy@prod:/etc/nginx/nginx.conf

# Ctrl+P 模糊搜索远程文件
# 保存通过 SSH diff 传输（只传改动，不传整文件）
```

### 用作 Git 编辑器

```bash
git config --global core.editor "fresh --wait"
# fresh --wait 会阻塞直到文件关闭，适合 commit、rebase 等
```

### Daemon 模式（持久会话）

```bash
# 启动命名守护进程
fresh -a myproject

# 在运行中的 daemon 里打开文件
fresh --cmd daemon open-file myproject src/main.rs:42

# Ctrl+Z 挂起后仍保持连接，断线自动重连
```

## 核心能力

### 🚀 极速启动与响应

- **即时启动**：程序启动时间毫秒级
- **输入无延迟**：输入即显示，无渲染等待
- **内存占用低**：相比 Electron 编辑器节省大量内存
- **多 GB 文件**：打开 GB 级大文件不阻塞 UI
- **SSH 编辑**：只传输 diff，远程大文件小改动仍然流畅

### 🎯 编辑体验

- **多光标编辑**：终端中体验最流畅的多光标
- **多选与宏**：Keyboard macros 支持复杂批量操作
- **块选与排序**：Block selection、sort、case conversion
- **Vim 模式**：可选 Vim keybinding
- **内联诊断**：Inline LSP diagnostics

### 🔍 搜索与替换

- **项目级搜索替换**：Project-wide grep & replace
- **跨未保存缓冲区**：即使文件未保存也能搜到
- **Fuzzy 文件查找**：Ctrl+P 模糊匹配
- **Git Grep**：集成 git grep

### 🔀 Git 集成

- **Split-panel Review**：左面板 staged / unstaged / untracked，右面板选中 diff
- **Hunk 级操作**：stage / unstage / discard 单个 hunk
- **行级注释**：Review notes，导出 Markdown
- **Side-by-side Diff**：文件对比视图
- **Git Gutter**：行号侧边栏显示修改状态
- **Git Log Viewer**：集成 git log

### 🧠 LSP 集成

- **多 LSP 服务**：每种语言可运行多个 LSP（pylsp + pyright）
- **自动检测项目根目录**：通过 Cargo.toml、package.json 等标记
- **开箱即用**：内置配置覆盖 Python / TypeScript / Rust / Go / Java / C/C++ / Ruby / PHP / Bash / Vue / Svelte / Terraform / Haskell / OCaml / Elixir 等
- **跳转到定义 / 引用 / Hover**：支持 node_modules / site-packages / .cargo 等库路径
- **Code Actions**：Workspace edits 支持

### 🧩 TypeScript 插件（QuickJS 沙箱）

- **OXC 编译 + QuickJS VM**：插件编译后运行在嵌入式 QuickJS 虚拟机中
- **沙箱隔离**：安全，不污染主进程
- **零 node_modules**：插件打包在同一二进制内，无需磁盘依赖

### 🎨 主题与定制

- **内置主题**：High-contrast / Gruvbox / Dracula / Nord / Solarized / Tokyo Night 等
- **实时主题编辑器**：「Inspect Theme at Cursor」光标处实时预览
- **状态栏可配置**：通过可视化面板选择元素（{clock}、git branch、LSP status）
- **i18n**：支持日语、韩语、汉语、越南语

### 🔌 高级功能

- **热退出 Hot Exit**：每次修改后持久化，崩溃或重启后恢复所有缓冲区（包括未命名 scratch buffer）
- **自定义快捷键**：Keybinding modes + embedded terminals
- **Package scaffolding**：fresh --init
- **Devcontainer 支持**：开发容器集成
- **编码与 Workspace Trust**：Encoding / Workspace Trust 设置 UI

## 快捷键速查

### 光标与选择

| 快捷键 | 功能 |
|---|---|
| `Ctrl+D` | 选中下一个相同词 |
| `Ctrl+Shift+L` | 多光标：所有选中词进入编辑模式 |
| `Alt+Shift+I` | 块选（Column selection） |
| `Ctrl+Shift+↑/↓` | 上/下添加光标 |
| `Ctrl+A` / `Ctrl+E` | 行首 / 行尾 |

### 文件与导航

| 快捷键 | 功能 |
|---|---|
| `Ctrl+P` | Fuzzy 文件搜索 |
| `Ctrl+G` | 跳转到指定行 |
| `%` | 匹配括号跳转 |
| `Ctrl+R` | 撤销历史（和 forward） |

### 搜索与替换

| 快捷键 | 功能 |
|---|---|
| `Ctrl+F` | 当前文件搜索 |
| `Ctrl+Shift+F` | 项目级搜索 |
| `Ctrl+H` | 替换 |
| `Enter` 在搜索结果 | 下一结果 |

### Git

| 快捷键 | 功能 |
|---|---|
| `Ctrl+Shift+G` | 打开 Git Review 面板 |
| 左侧面板 | Stage / Unstage / Discard hunk |
| 右键 | 行注释 / Review notes |

### LSP

| 快捷键 | 功能 |
|---|---|
| `F12` / `Alt+F12` | 跳转到定义 / 引用 |
| `Ctrl+Space` | 触发 LSP 补全 |
| `Ctrl+K I` | Hover 文档 |

### 通用

| 快捷键 | 功能 |
|---|---|
| `Ctrl+S` | 保存 |
| `Ctrl+W` | 关闭当前标签 |
| `Ctrl+Shift+P` | 命令面板 |
| `Ctrl+,` | 设置面板 |
| `Esc Esc` | 关闭所有 Overlay |

## 配置与初始化

### init.ts（启动脚本）

```typescript
// ~/.config/fresh/init.ts（示例）
import { keymap, init, lsp, git, ui } from "fresh:core";

// 设置主题
ui.theme("dracula");

// 自定义快捷键
keymap.bind("ctrl-s", () => commands.save());

// 启用 LSP
lsp.enable("rust-analyzer");

// 启用 Git gutter
git.enableGutter(true);

// 退出时自动保存所有缓冲区
init({
  autoSave: true,
  hotExit: true,
});
```

### 配置文件路径

| 平台 | 路径 |
|---|---|
| Linux | `~/.config/fresh/` |
| macOS | `~/.config/fresh/` |
| Windows | `%APPDATA%\fresh\` |

### LSP 配置示例

```json
// .vscode/settings.json 或 fresh LSP 配置
{
  "fresh.lsp.pylsp": {
    "plugins": {
      "pylsp_mypy": { "enabled": true },
      "pylsp_rope": { "enabled": false }
    }
  }
}
```

## 场景 Recipes

### 场景 1：日常代码编辑

```bash
# 启动 fresh
fresh

# 打开项目
Ctrl+P → 输入文件名

# 多光标批量修改变量名
Ctrl+D 选中每个出现位置 → 重命名 → Enter

# LSP 跳转到定义
F12

# 保存
Ctrl+S
```

### 场景 2：Git Code Review

```bash
# 用 fresh 替代 git difftool
fresh --wait  # 配合 git rebase -i

# 在 fresh 内打开 Git Review
Ctrl+Shift+G

# 在 diff 面板中：
#   Stage hunk: s
#   Unstage hunk: u
#   Discard: d
#   添加行注释: Ctrl+Enter
#   导出 Review 为 Markdown: Ctrl+E
```

### 场景 3：SSH 远程服务器编辑

```bash
# 编辑远程文件（如 prod 服务器配置）
fresh deploy@prod:/etc/nginx/nginx.conf

# Ctrl+P 打开远程文件搜索
# 修改后 Ctrl+S 保存（只传 diff）

# 编辑大文件（如日志）
fresh prod-server:/var/log/nginx/access.log
# 即使文件几个 GB，编辑小段也不卡
```

### 场景 4：多语言 LSP 开发

```bash
# 打开 Rust + TypeScript 混合项目
fresh .

# Fresh 自动检测：
#   Cargo.toml → Rust LSP (rust-analyzer)
#   package.json → TypeScript LSP (tsserver)
#   pyproject.toml → Python LSP (pylsp)

# 跨语言跳转：F12 自动路由到正确的 LSP
```

## 坑点与排障

### 坑 1：Nerd Font 不显示图标

**现象**：状态栏、git branch 等显示方块或乱码。
**原因**：终端字体不支持 Nerd Font 图标。
**解决**：
```bash
# 终端使用 Nerd Font（如 JetBrains Mono Nerd Font）
# macOS: brew install font-jetbrains-mono-nerd-font
# Linux: 下载 Nerd Font 后 fc-cache -fv
```

### 坑 2：SSH 连接断线后文件未保存

**现象**：SSH 断线重连后发现缓冲区丢失。
**原因**：未开启 Hot Exit 或 daemon 模式。
**解决**：
```bash
# 开启 Hot Exit（默认已开启）
# 用 daemon 模式保持持久连接
fresh -a myproject

# 文件修改后 Ctrl+S 会立即持久化到磁盘
```

### 坑 3：LSP 跳转不到库代码

**现象**：F12 跳转到 node_modules 或 .cargo 报错。
**原因**：LSP 默认不索引库路径。
**解决**：在 LSP 配置中启用库路径：
```json
{
  "fresh.lsp.gotoLibraryPath": true,
  "fresh.lsp.libraryPaths": ["node_modules", ".cargo", "site-packages"]
}
```

### 坑 4：Windows 远程编辑中文文件名乱码

**现象**：通过 SSH 编辑含中文文件名的文件显示乱码。
**原因**：Windows SSH server 默认 GBK 编码。
**解决**：在远程服务器设置 `export LANG=en_US.UTF-8`，或用 Fresh 的 Encoding 设置切换到 UTF-8。

### 坑 5：插件 TypeScript 版本冲突

**现象**：TypeScript 插件加载失败。
**原因**：插件使用 QuickJS 沙箱，有特定 API 版本要求。
**解决**：不要混用不同来源的插件包，使用 `fresh plugins list` 检查已安装插件，确保都是为当前 Fresh 版本编译的。

## 参考链接

| 类型 | 链接 |
|---|---|
| 官网 | [getfresh.dev](https://getfresh.dev) |
| GitHub | [github.com/nickcis/fresh](https://github.com/nickcis/fresh) |
| 文档 | [getfresh.dev/docs](https://getfresh.dev/docs) |
| 安装脚本 | [raw.githubusercontent.com/sinelaw/fresh/master/scripts/install.sh](https://raw.githubusercontent.com/sinelaw/fresh/refs/heads/master/scripts/install.sh) |
| Changelog | [getfresh.dev/blog](https://getfresh.dev/blog) |
| Discord | [discord.gg/fresh](https://discord.gg/fresh) |
