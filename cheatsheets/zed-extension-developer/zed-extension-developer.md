---
title: Zed 插件开发速查
lang: zh
version: "0.230.2"
date: "2026-04-08"
github: zed-industries/zed
colWidth: 420
---

## 快速定位

Zed 插件是用来扩展 Zed 编辑器功能的 Git 仓库，通过 `extension.toml` 清单文件定义

| 扩展类型 | 说明 | 关键文件 |
|---------|------|---------|
| Language | 语言支持 | `languages/<name>/config.toml` + Tree-sitter |
| Theme | 颜色主题 | `themes/<name>.json` |
| Icon Theme | 文件夹/文件图标 | `icon_themes/<name>.json` |
| Debugger | 调试适配器 (DAP) | Rust 实现 + `extension.toml` 注册 |
| Snippets | 代码片段 | `snippets/<lang>.json` |
| Agent Server | AI 代理 (ACP 协议) | `extension.toml` 注册 |
| MCP Server | MCP 服务器 | Rust 实现 + `extension.toml` 注册 |

**入口动作**：`zed: extensions` → Install Dev Extension → 选择本地目录

---

## 最小工作流

### 1. 环境准备

```bash
# 必须通过 rustup 安装 Rust（Homebrew 安装的不支持 dev extensions）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 验证安装
rustc --version
cargo --version
```

### 2. Fork 并克隆扩展仓库

```bash
# Fork https://github.com/zed-industries/extensions 到个人 GitHub 账户
git clone https://github.com/<your-username>/extensions.git
cd extensions
```

### 3. 本地开发调试

```bash
# 方式一：通过命令面板
# 1. 打开 Extensions 页面
# 2. 点击 "Install Dev Extension"
# 3. 选择包含 extension.toml 的目录

# 方式二：命令行
zed --foreground   # 启动 Zed 并查看详细日志
```

### 4. 排查问题

```bash
# 查看 Zed 日志
zed: open log

# 调试输出（需从命令行启动）
zed --foreground
```

---

## 扩展结构速查

### 基础目录结构

```text
my-extension/
├── extension.toml          # 必须：扩展清单
├── Cargo.toml              # 可选：Rust/WebAssembly 代码
├── src/
│   └── lib.rs              # Rust 入口（使用 zed_extension_api）
└── languages/              # 语言扩展
    └── my-language/
        ├── config.toml
        └── highlights.scm
```

### extension.toml 必填字段

```toml
id = "my-extension"
name = "My extension"
version = "0.0.1"
schema_version = 1
authors = ["Your Name <you@example.com>"]
description = "Example extension"
repository = "https://github.com/your-name/my-zed-extension"
```

---

## 语言扩展

### config.toml 结构

```toml
name = "My Language"           # 显示名称
grammar = "my-language"         # Tree-sitter 语法名称
path_suffixes = ["myl"]         # 关联的文件后缀
line_comments = ["# "]          # 行注释符号
tab_size = 4                    # 缩进大小（默认 4）
hard_tabs = false               # 使用 Tab 缩进（默认 false）
first_line_pattern = "^#!/.*\\n" # 首行匹配正则
debuggers = ["my-debugger"]     # 关联的调试器
```

### Tree-sitter 查询文件

| 文件 | 用途 | 关键捕获 |
|------|------|---------|
| `highlights.scm` | 语法高亮 | `@keyword`, `@string`, `@comment` 等 |
| `brackets.scm` | 括号匹配 | `@open`, `@close` |
| `outline.scm` | 代码大纲 | `@name`, `@item`, `@context` |
| `indents.scm` | 缩进规则 | `@indent`, `@end` |

### highlights.scm 示例

```scheme
(string) @string
(pair
  key: (string) @property.json_key)
(number) @number

; 回退捕获：当主题不支持 @type 时回退到 @variable
(type_identifier) @type @variable
```

### brackets.scm 示例

```scheme
("[" @open "]" @close)
("{" @open "}" @close)
("\"" @open "\"" @close)
```

### 语法高亮捕获类型

| 捕获 | 说明 | 捕获 | 说明 |
|------|------|------|------|
| `@keyword` | 关键字 | `@string` | 字符串 |
| `@comment` | 注释 | `@number` | 数字 |
| `@function` | 函数 | `@type` | 类型 |
| `@variable` | 变量 | `@operator` | 运算符 |
| `@punctuation` | 标点 | `@property` | 属性 |

### 注册语法解析器

```toml
[grammars.gleam]
repository = "https://github.com/gleam-lang/tree-sitter-gleam"
rev = "58b7cac8fc14c92b0677c542610d8738c373fa81"

; 本地开发用 file:// 协议
[grammars.my-lang]
repository = "file:///path/to/local/tree-sitter-grammar"
rev = "HEAD"
```

---

## 主题扩展

### themes 目录结构

```text
my-theme-extension/
├── extension.toml
└── themes/
    └── my-theme.json
```

### Theme JSON 结构

```json
{
  "$schema": "https://zed.dev/schema/themes/v0.2.0.json",
  "name": "My Theme Family",
  "author": "Your Name",
  "themes": [
    {
      "name": "My Theme",
      "appearance": "dark",
      "style": {
        "background": "#1e1e2e",
        "foreground": "#cdd6f4",
        "accent": "#89b4fa",
        "syntax": {
          "keyword": "#cba6f7",
          "string": "#a6e3a1",
          "comment": "#6c7086"
        },
        "editor.background": "#1e1e2e",
        "editor.gutter": "#313244",
        "editor.line_number": "#585b70"
      }
    }
  ]
}
```

### Theme 核心属性

| 类别 | 属性 | 说明 |
|------|------|------|
| 元数据 | `name`, `author` | 主题名称和作者 |
| 外观 | `appearance` | `"light"` 或 `"dark"` |
| 基础 | `background`, `foreground`, `accent` | 主背景、文字、强调色 |
| 语法 | `syntax` 对象 | 语法元素颜色 |
| 编辑器 | `editor.*` | 编辑器特定颜色 |
| 终端 | ANSI 颜色 | 终端配色 |

### 在线设计工具

使用 [Zed Theme Builder](https://zed.dev/theme-builder) 可视化设计主题

---

## Icon Theme 扩展

### icon_themes 目录结构

```text
my-icon-theme/
├── extension.toml
├── icon_themes/
│   └── my-icon-theme.json
└── icons/
    ├── folder.svg
    ├── folder-open.svg
    ├── file.svg
    └── rust.svg
```

### icon_themes JSON 结构

```json
{
  "$schema": "https://zed.dev/schema/icon_themes/v0.3.0.json",
  "name": "My Icon Theme",
  "author": "Your Name",
  "themes": [
    {
      "name": "My Icon Theme",
      "appearance": "dark",
      "directory_icons": {
        "collapsed": "./icons/folder.svg",
        "expanded": "./icons/folder-open.svg"
      },
      "file_stems": {
        "Makefile": "make"
      },
      "file_suffixes": {
        "rs": "rust",
        "mp3": "audio"
      },
      "file_icons": {
        "rust": { "path": "./icons/rust.svg" },
        "default": { "path": "./icons/file.svg" }
      }
    }
  ]
}
```

---

## Snippets 扩展

### 在 extension.toml 中注册

```toml
snippets = ["./snippets/rust.json", "./snippets/typescript.json"]
```

### snippets 文件命名

- 按语言：`rust.json`（Rust 语言）、`typescript.json`（TypeScript）
- 全局可用：`snippets.json`（不依赖当前语言）

### snippet 格式

```json
{
  "for": {
    "prefix": "for",
    "body": "for ${1:item} in ${2:iterable} {\n\t$0\n}",
    "description": "for loop"
  }
}
```

| 字段 | 说明 |
|------|------|
| `prefix` | 触发词 |
| `body` | 展开内容（`${1:default}` 表示占位符） |
| `description` | 说明文字 |

---

## Debugger 扩展

### 在 extension.toml 中注册

```toml
[debug_adapters.my-debug-adapter]
schema_path = "relative/path/to/schema.json"
```

### Rust 实现方法

```rust
impl zed::Extension for MyExtension {
    fn get_dap_binary(
        &mut self,
        adapter_name: String,
        config: DebugTaskDefinition,
        user_provided_debug_adapter_path: Option<String>,
        worktree: &Worktree,
    ) -> Result<DebugAdapterBinary, String> {
        // 返回调试适配器的启动命令和参数
    }

    fn dap_request_kind(
        &mut self,
        _adapter_name: String,
        _config: Value,
    ) -> Result<StartDebuggingRequestArgumentsRequest, String> {
        // 返回启动调试的方式（启动新进程或附加到现有进程）
    }

    fn dap_config_to_scenario(
        &mut self,
        _adapter_name: DebugConfig,
    ) -> Result<DebugScenario, String> {
        // 将通用调试配置转换为适配器专用配置
    }
}
```

### Debug Locator（自动定位）

```toml
[debug_locators.my-debug-locator]
```

```rust
impl zed::Extension for MyExtension {
    fn dap_locator_create_scenario(
        &mut self,
        _locator_name: String,
        _build_task: TaskTemplate,
        _resolved_label: String,
        _debug_adapter_name: String,
    ) -> Option<DebugScenario> {
        // 根据任务自动生成调试场景
    }
}
```

---

## Agent Server 扩展

> 注意：从 v0.221.x 起，推荐使用 ACP Registry 安装外部代理。Agent Server 扩展将在未来废弃。

### extension.toml 配置

```toml
[agent_servers.my-agent]
name = "My Agent"

[agent_servers.my-agent.targets.darwin-aarch64]
archive = "https://github.com/owner/repo/releases/download/v1.0.0/agent-darwin-arm64.tar.gz"
cmd = "./agent"
args = ["--serve"]
sha256 = "e3b0c44298fc1c149afbf4c8996fb924..."

[agent_servers.my-agent.targets.linux-x86_64]
archive = "https://github.com/owner/repo/releases/download/v1.0.0/agent-linux-x64.tar.gz"
cmd = "./agent"
args = ["--serve"]

[agent_servers.my-agent.targets.windows-x86_64]
archive = "https://github.com/owner/repo/releases/download/v1.0.0/agent-windows-x64.zip"
cmd = "./agent.exe"
args = ["--serve"]

; 环境变量（可选）
[agent_servers.my-agent.env]
AGENT_LOG_LEVEL = "info"
```

### 平台目标格式

```text
{os}-{arch}
# os: darwin, linux, windows
# arch: aarch64, x86_64
```

### 环境变量层级

- `agent_servers.<name>.env`：所有平台默认环境变量
- `agent_servers.<name>.targets.<platform>.env`：特定平台覆盖

### 图标规范

- SVG 格式，16x16 边界框
- 使用 [SVGOMG](https://jak楸) 优化
- 避免渐变，保持简洁

### SHA-256 计算

```bash
# macOS / Linux
shasum -a 256 agent-darwin-arm64.tar.gz

# Windows
certutil -hashfile agent-windows-x64.zip SHA256
```

---

## MCP Server 扩展

### 在 extension.toml 中注册

```toml
[context_servers.my-context-server]
```

### Rust 实现

```rust
impl zed::Extension for MyExtension {
    fn context_server_command(
        &mut self,
        context_server_id: &ContextServerId,
        project: &zed::Project,
    ) -> Result<zed::Command> {
        Ok(zed::Command {
            command: get_path_to_context_server_executable()?,
            args: get_args_for_context_server()?,
            env: get_env_for_context_server()?,
        })
    }
}
```

---

## WebAssembly 扩展

### Cargo.toml 配置

```toml
[package]
name = "my-extension"
version = "0.0.1"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
zed_extension_api = "0.1.0"
```

### Rust 入口结构

```rust
use zed_extension_api as zed;

struct MyExtension {
    // 状态字段
}

impl zed::Extension for MyExtension {
    // 实现扩展方法
}

zed::register_extension!(MyExtension);
```

---

## 发布工作流

### 1. 提交 PR

```bash
git checkout -b add-my-extension
git add .
git commit -m "Add my-extension"
git push origin add-my-extension
# 在 GitHub 创建 Pull Request
```

### 2. 审核后合并

Zed 工作人员可能会推送修复到你的 PR 分支以加快流程

### 3. 扩展市场

发布后，用户可通过 `zed: extensions` 安装你的扩展

---

## 常见问题

| 问题 | 解决方案 |
|------|---------|
| Dev extension 不工作 | 确保通过 rustup 安装 Rust |
| 看不到扩展输出 | 使用 `zed --foreground` 查看日志 |
| 已安装发布版又装 dev 版 | 发布版会被临时卸载，标注 "Overridden by dev extension" |
| Tree-sitter 语法不生效 | 检查 `extension.toml` 中 grammar 名称是否匹配 |
| 调试器扩展报错 | 查看 `zed: open log` 获取详细错误信息 |

---

## Quick Ref

```toml
# 最简 extension.toml
id = "my-ext"
name = "My Extension"
version = "0.0.1"
schema_version = 1
```

```toml
# 语言扩展
[grammars.<name>]
repository = "https://github.com/owner/tree-sitter-xxx"
rev = "commit-sha"
```

```toml
# 主题扩展
themes = ["./themes/my-theme.json"]
```

```toml
# 代码片段
snippets = ["./snippets/rust.json"]
```

```toml
# 调试器
[debug_adapters.<name>]
schema_path = "path/to/schema.json"
```

```toml
# Agent Server
[agent_servers.<name>]
[agent_servers.<name>.targets.<platform>]
archive = "url"
cmd = "./binary"
```
