# Gemini CLI 全面速查表

## 1. 安装与认证 (Installation & Auth)

### 安装
- `npm install -g @google/gemini-cli`：全局安装
- `npx @google/gemini-cli`：一次性运行

### 认证模式
- **OAuth (Google 账号)**：
  - `gemini auth`
  - 限制：60 RPM / 1000 RPD (免费)。不支持 Token Caching。
- **API Key**：
  - `export GEMINI_API_KEY=...`
  - 限制：100 RPD (免费层)。支持 Token Caching。
- **Vertex AI**：
  - `export GOOGLE_GENAI_USE_VERTEXAI=true`
  - `export GOOGLE_CLOUD_PROJECT=...`
  - `export GOOGLE_API_KEY=...` (ADC 或 API Key)

## 2. 核心交互 (Core Interaction)

### 启动命令
- `gemini`：默认启动
- `gemini -i "prompt"`：带初始提示词
- `gemini --resume [id]`：恢复会话
- `gemini --sandbox`：沙盒模式启动

### 会话命令 (Slash Commands)
- `/clear`：清屏
- `/model [name]`：切换模型
- `/stats`：查看 Token 统计
- `/session list`：列出会话
- `/session delete [id]`：删除会话

## 3. 配置管理 (Configuration)

### 配置文件优先级
`.gemini/settings.json` (项目) > `~/.gemini/settings.json` (用户) > 系统默认

### 关键配置项 (`settings.json`)
```json
{
  "ui": { "theme": "dark", "showLineNumbers": true },
  "general": { "checkpointing": { "enabled": true } },
  "security": { "folderTrust": { "enabled": true } },
  "context": { "includeDirectories": ["src"] }
}
```

### 环境变量
- `GEMINI_API_ENDPOINT`：自定义 API Base URL
- `GEMINI_SYSTEM_MD`：覆盖默认 System Prompt
- `GEMINI_DEBUG`：开启调试日志

## 4. 自动化与脚本 (Automation)

### Headless 模式
- `gemini -p "分析代码" --output-format json`
- `gemini -p "监控" --output-format stream-json`

### 管道操作
- `git diff | gemini "生成 commit message"`
- `cat log.txt | gemini "查找错误"`

### 自定义命令 (`.toml`)
路径：`~/.gemini/commands/`
```toml
prompt = """
分析代码复杂度：
@{src/main.py}
"""
```

## 5. 内置工具 (Built-in Tools)

### 文件与系统
- **File System**：`read_file`, `write_file`, `list_directory`
- **Shell**：`run_shell_command` (支持交互式)
- **Search**：`google_web_search`

### 记忆与管理
- **Memory**：`save_memory` (长期记忆)
- **Todos**：`write_todos` (任务管理)

## 6. 扩展能力 (Extensibility)

### MCP (Model Context Protocol)
在 `settings.json` 中配置：
```json
"mcpServers": {
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"]
  }
}
```

### Hooks (生命周期钩子)
拦截工具调用或模型响应：
- `BeforeTool`
- `AfterTool`
- `BeforeModel`

## 7. 高级特性 (Advanced)

### Checkpointing (检查点)
- 作用：文件修改前自动快照
- 命令：`/restore` 回滚
- 配置：`"checkpointing": { "enabled": true }`

### Token Caching (缓存)
- 作用：缓存长上下文，降低成本
- 条件：仅限 API Key 模式，前缀匹配自动触发

### Sandbox (沙盒)
- 作用：在隔离容器中运行工具
- 配置：`.gemini/sandbox.Dockerfile`

## 8. 安全与合规 (Security)

### Trusted Folders (受信任文件夹)
- 防止在未授权目录执行危险操作
- 配置：`security.folderTrust`

### 隐私
- Telemetry：默认为 Google 收集使用数据
- 禁用：`gemini --no-telemetry` 或配置 `usageStatisticsEnabled: false`

## 9. 配置文件解析 (Config Parsing)

### 设置加载优先级 (低 -> 高)
1. **默认值**：内置默认配置
2. **系统默认**：`/etc/gemini-cli/system-defaults.json`
3. **用户配置**：`~/.gemini/settings.json`
4. **项目配置**：`.gemini/settings.json`
5. **环境变量**：系统及 `.env` 文件 (自动加载)
6. **命令行参数**：如 `--model` (最高优先级)

### 上下文文件 (GEMINI.md) 组装逻辑
CLI 会自动搜索并拼接以下路径的 `GEMINI.md`：
1. **全局上下文**：`~/.gemini/GEMINI.md`
2. **父级目录**：从根目录到当前目录的所有父级
3. **当前目录**：当前工作目录
4. **子目录**：当前目录下的子目录 (默认最大深度 200)

### 忽略规则 (.geminiignore)
- 作用：排除不需要被 CLI 读取或索引的文件/目录
- 语法：同 `.gitignore`
- 优先级：`.geminiignore` > `.gitignore`

## 10. 配置字段详解 (Settings Reference)

以下是 `settings.json` 的核心字段解释。

### General (通用)
```json
"general": {
  // 启用预览功能 (如新模型)
  "previewFeatures": false,
  // 禁用自动更新检查
  "disableAutoUpdate": false,
  // 检查点功能 (重要)
  "checkpointing": {
    "enabled": false // 启用后可使用 /restore 回滚文件修改
  },
  // 会话保留策略
  "sessionRetention": {
    "enabled": false,
    "maxAge": "30d" // 保留时长: 30d, 7d, 24h
  }
}
```

### UI (界面)
```json
"ui": {
  // 界面主题: "dark", "light", "dracula" 等
  "theme": "undefined", 
  // 隐藏窗口标题栏 (重启生效)
  "hideWindowTitle": false,
  // 显示行号 (默认开启)
  "showLineNumbers": true,
  // 显示生成内容的引用来源
  "showCitations": false,
  // 使用备用屏幕缓冲区 (保留 Shell 历史)
  "useAlternateBuffer": false
}
```

### Context (上下文)
```json
"context": {
  // 上下文文件名 (默认 GEMINI.md)
  "fileName": "GEMINI.md",
  // 包含的额外目录列表
  "includeDirectories": [],
  "fileFiltering": {
    // 遵守 .gitignore
    "respectGitIgnore": true,
    // 遵守 .geminiignore
    "respectGeminiIgnore": true,
    // 禁用模糊搜索 (提高精确度)
    "disableFuzzySearch": false
  }
}
```

### Tools (工具)
```json
"tools": {
  // 沙盒模式: true 启用, 或指定配置文件路径
  "sandbox": undefined,
  // 自动批准只读或安全工具的调用
  "autoAccept": false,
  // 使用 ripgrep 进行快速搜索 (推荐开启)
  "useRipgrep": true,
  // Shell 设置
  "shell": {
    // 启用交互式 Shell (node-pty)
    "enableInteractiveShell": true,
    // 无输出超时时间 (秒)
    "inactivityTimeout": 300
  },
  // 允许绕过确认的工具列表
  "allowed": ["run_shell_command(git status)"]
}
```

### Security (安全)
```json
"security": {
  // 禁用 YOLO (自动批准) 模式
  "disableYoloMode": false,
  // 文件夹信任设置
  "folderTrust": {
    "enabled": false // 启用后需显式信任目录才能写文件
  },
  // 环境变量脱敏 (防止密钥泄露)
  "environmentVariableRedaction": {
    "enabled": false,
    "blocked": ["MY_SECRET_KEY"]
  }
}
```

### Model (模型)
```json
"model": {
  // 默认使用的模型名称
  "name": "gemini-2.0-flash",
  // 触发上下文压缩的阈值 (0.0-1.0)
  "compressionThreshold": 0.5
}
```

### MCP Servers (扩展)
```json
"mcpServers": {
  "github": {
    // 启动 MCP 服务器的命令
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    // 环境变量
    "env": { "GITHUB_TOKEN": "..." }
  }
}
```