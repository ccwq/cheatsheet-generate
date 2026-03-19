---
title: OpenCode 速查
lang: bash
version: "1.2.27"
date: 2026-03-16
github: anomalyco/opencode
colWidth: 340px
---

# OpenCode 速查表

## 快速定位
---
lang: bash
emoji: 🚀
link: https://opencode.ai/docs/zh-cn
---

### 它适合做什么
```bash
# OpenCode = 终端里的 AI 编码代理
# 适合：读代码、改代码、规划任务、跑命令、管理会话

# 交互式入口
opencode

# 单次执行入口
opencode run "修复登录表单的校验逻辑"
```

### 这份 cheatsheet 怎么读
```bash
# 先看 cookbook：按场景起手
# 再看快捷键：高频操作更快
# 最后查参数 / 命令 / 技巧：补细节
```

## Cookbook
---
lang: bash
emoji: 🍳
link: https://opencode.ai/docs/zh-cn
---

### Recipe 1: 进仓库后先建立项目上下文
```bash
cd /path/to/repo
opencode

# 在 TUI 里初始化项目说明
/init

# 然后补一句明确任务
请先阅读仓库结构，说明构建入口、测试方式和关键目录
```

### Recipe 2: 先规划再动手，适合中等以上改动
```bash
# 进入 TUI 后先切到计划模式
<TAB>

# 把需求写成结果导向，而不是只报错
我要给用户设置页增加邮箱修改能力，先输出实施计划和风险点

# 确认计划后切回构建模式再执行
<TAB>
开始修改
```

### Recipe 3: 带文件上下文提问，减少来回解释
```bash
# 用 @ 文件路径把上下文直接喂给模型
@src/routes/settings.ts 解释这段路由逻辑

# 让它按已有实现做镜像改造
参考 @src/routes/notes.ts 的鉴权方式
给 @src/routes/settings.ts 补同样的逻辑
```

### Recipe 4: 单次命令模式，适合脚本或快速验证
```bash
# 不进 TUI，直接执行一条任务
opencode run "生成当前仓库的 README 草稿"

# 或者用 prompt 参数起一个一次性会话
opencode --prompt "检查这个仓库里未使用的环境变量"
```

### Recipe 5: 改坏了就回滚，再细化提示词
```bash
# 在 TUI 里撤销最后一次变更
/undo

# 然后用更明确的约束重做
重做一次，但不要修改 API 返回结构，只调整表单校验

# 需要时再前进
/redo
```

### Recipe 6: 多会话并行处理不同问题
```bash
# 新开会话处理另一个任务
/new

# 在不同会话之间切换
/sessions

# 适合把“重构”和“排查 bug”拆开，避免上下文污染
```

## 快捷键
---
lang: bash
emoji: ⌨️
link: https://opencode.ai/docs/zh-cn/tui/
---

### 高频快捷键
```bash
Ctrl+X I  # /init，创建或更新 AGENTS.md
Ctrl+X M  # /models，查看或切换模型
Ctrl+X N  # /new，开始新会话
Ctrl+X L  # /sessions，切换历史会话
Ctrl+X S  # /share，分享当前会话
Ctrl+X C  # /compact，压缩当前上下文
Ctrl+X D  # /details，切换执行细节视图
Ctrl+X E  # /editor，外部编辑器写长消息
Ctrl+X T  # /theme，切换主题
Ctrl+X H  # /help，打开命令面板 / 帮助
Ctrl+X U  # /undo，撤销最后一步
Ctrl+X R  # /redo，重做已撤销操作
Ctrl+X X  # /export，导出会话
Ctrl+X Q  # /quit，退出 OpenCode
```

### 高频 slash commands
```bash
/init
/models
/new
/sessions
/share
/compact
/details
/theme
/help
/undo
/redo
/export
/quit
```

## 参数
---
lang: bash
emoji: 🧩
link: https://opencode.ai/docs/cli
---

### 全局参数
```bash
-h, --help              # 查看帮助
-v, --version           # 查看版本
--print-logs            # 把日志打印到 stderr
--log-level LEVEL       # DEBUG / INFO / WARN / ERROR
--port N                # 服务监听端口
--hostname HOST         # 服务监听地址
--mdns                  # 开启 mDNS 服务发现
--mdns-domain NAME      # 自定义 mDNS 域名
--cors DOMAIN           # 追加允许的 CORS 域名
-m, --model MODEL       # 指定模型，格式 provider/model
-c, --continue          # 继续最近一次会话
-s, --session ID        # 继续指定会话
--fork                  # 继续会话时 fork 一个分支会话
--prompt TEXT           # 直接带初始提示词
--agent NAME            # 指定 agent
```

### 常见参数组合
```bash
# 直接在指定项目中启动
opencode ~/work/my-app

# 带模型启动
opencode -m openai/gpt-5

# 接着上次会话继续
opencode --continue

# 在指定会话上继续
opencode --session abc123

# fork 一份新分支继续试验
opencode --session abc123 --fork
```

## 命令
---
lang: bash
emoji: 🛠️
link: https://opencode.ai/docs/zh-cn
---

### 主命令与子命令
```bash
opencode [project]         # 启动 TUI
opencode run [message..]   # 运行一次任务
opencode auth              # 管理认证
opencode agent             # 管理 agents
opencode session           # 管理会话
opencode models            # 列出模型
opencode mcp               # 管理 MCP 服务
opencode acp               # 启动 ACP 服务
opencode serve             # 启动无头服务
opencode web               # 启动 Web 界面
opencode attach <url>      # 连接到运行中的服务
opencode export [session]  # 导出会话 JSON
opencode import <file>     # 导入会话 JSON / URL
opencode pr <number>       # 拉取 GitHub PR 后进入 OpenCode
opencode github            # GitHub agent 相关操作
opencode stats             # 查看 token / cost 统计
opencode debug             # 调试工具
opencode db                # 数据库工具
opencode upgrade [target]  # 升级到最新或指定版本
opencode uninstall         # 卸载 OpenCode
opencode completion        # 生成 shell 补全脚本
```

### TUI 内高频命令
```bash
/init
/models
/new
/sessions
/share
/compact
/details
/theme
/undo
/redo
/export
/quit
```

## 技巧
---
lang: bash
emoji: 💡
link: https://opencode.ai/docs/zh-cn/tui/
---

### 提示词写法
```bash
# 好提示词 = 目标 + 约束 + 参考实现
把 @src/api/user.ts 里的更新逻辑抽成 service
保持原有 HTTP 返回结构
参考 @src/api/note.ts 的错误处理方式
```

### 会话管理技巧
```bash
# 长会话变重时先 compact
/compact

# 要对外同步进度时分享当前会话
/share

# 需要留档时导出
/export
```

### 风险控制
```bash
# 大改动先切计划模式
<TAB>

# 不满意先 /undo，再补充更细的限制
/undo

# 不同任务分不同 session，避免上下文串味
/sessions
```
