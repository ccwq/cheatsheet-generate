---
title: Codex CLI 速查
lang: bash
version: "0.115.0"
date: 2026-03-16
github: openai/codex
colWidth: 340px
---

# Codex CLI 速查表

## 快速定位
---
lang: bash
emoji: 🚀
link: https://developers.openai.com/codex/cli
---

### 它适合做什么
```bash
# Codex CLI = 终端里的编码代理
# 适合：交互式改代码、非交互执行、代码审查、MCP 集成

# 交互式入口
codex

# 非交互入口
codex exec "修复 tests/auth.spec.ts 里的 flaky case"
```

### 这份 cheatsheet 怎么读
```bash
# 先看 cookbook：选工作流
# 再看快捷键：查交互入口
# 最后看参数 / 命令 / 技巧：查精确用法
```

## Cookbook
---
lang: bash
emoji: 🍳
link: https://developers.openai.com/codex/cli
---

### Recipe 1: 在当前仓库里直接开交互会话
```bash
cd /path/to/repo
codex

# 首句就把目标和限制讲清楚
先阅读仓库结构，再给出修复登录重定向 bug 的计划
不要修改公共 API
```

### Recipe 2: 先保守审查，再放开执行
```bash
# 先只读 + 按需审批，适合陌生仓库
codex --sandbox read-only --ask-for-approval on-request

# 熟悉后再切工作区可写
codex --sandbox workspace-write --ask-for-approval on-request
```

### Recipe 3: 非交互执行，适合脚本或 CI
```bash
# 直接跑一次任务
codex exec "为 src/config.ts 增加环境变量校验"

# 机器可读输出
codex exec --json "概括这个仓库的构建步骤"
```

### Recipe 4: 先做 review，再决定是否让它改
```bash
# 非交互代码审查
codex review

# 或进入交互后触发 review 流程
/review
```

### Recipe 5: 带图和上下文一起开工
```bash
# 把设计图附给初始提示词
codex -i mockup.png "按图实现设置页，保留现有路由结构"

# 多图也可以一起传
codex -i before.png -i after.png "对齐这两张设计差异"
```

### Recipe 6: 会话中途分叉，保留主线
```bash
# 继续最近会话
codex resume --last

# fork 最近会话，试另一条实现路线
codex fork --last

# 适合保留“稳定方案”和“激进重构方案”两条线
```

## 快捷键
---
lang: bash
emoji: ⌨️
link: https://developers.openai.com/codex/cli/slash-commands/
---

### 交互快捷入口
```bash
# Codex CLI 官方当前公开文档重点是 slash commands
# 下列命令可视为交互期的“快捷入口”

/model        # 切换模型
/approvals    # 调整审批策略
/review       # 发起代码审查
/plan         # 先做计划
/logout       # 清除本地登录状态
/quit         # 退出 CLI
/exit         # 退出 CLI
```

### 进入不同工作状态的最快方式
```bash
codex                             # 交互式工作
codex exec "任务"                 # 非交互执行
codex review                      # 非交互代码审查
codex resume --last               # 继续最近会话
codex fork --last                 # 从最近会话分叉
```

## 参数
---
lang: bash
emoji: 🧩
link: https://developers.openai.com/codex/cli/reference
---

### 全局参数
```bash
-c, --config key=value            # 覆盖 config.toml 中的配置
--enable FEATURE                  # 启用功能开关，可重复
--disable FEATURE                 # 关闭功能开关，可重复
-i, --image FILE                  # 给初始提示附图，可重复
-m, --model MODEL                 # 指定模型
--oss                             # 切到本地开源模型 provider
--local-provider PROVIDER         # lmstudio / ollama
-p, --profile NAME                # 选择 config.toml 中的 profile
-s, --sandbox MODE                # read-only / workspace-write / danger-full-access
-a, --ask-for-approval POLICY     # untrusted / on-failure / on-request / never
--full-auto                       # 等价于 on-request + workspace-write
--dangerously-bypass-approvals-and-sandbox
                                  # 跳过审批与沙箱，风险最高
-C, --cd DIR                      # 指定工作目录
--search                          # 启用实时 web search
--add-dir DIR                     # 追加可写目录
--no-alt-screen                   # 禁用 alternate screen
-h, --help                        # 查看帮助
-V, --version                     # 查看版本
```

### 常见参数组合
```bash
# 保守模式：只读 + 按需审批
codex --sandbox read-only --ask-for-approval on-request

# 常规改代码模式
codex --sandbox workspace-write --ask-for-approval on-request

# 快速自动执行
codex --full-auto

# 指定目录和模型
codex -C ~/work/app --model gpt-5-codex

# 开启联网搜索
codex --search
```

## 命令
---
lang: bash
emoji: 🛠️
link: https://developers.openai.com/codex/cli/reference
---

### 核心子命令
```bash
codex exec        # 非交互执行任务
codex review      # 非交互代码审查
codex login       # 登录管理
codex logout      # 删除本地认证
codex resume      # 恢复历史会话
codex fork        # 从历史会话分叉
codex apply       # 把最近一次 diff 应用到工作树
codex mcp         # 管理外部 MCP 服务
codex mcp-server  # 以 MCP server 方式启动 Codex
codex sandbox     # 在 Codex 提供的沙箱里运行命令
codex completion  # 生成 shell 补全脚本
codex cloud       # 浏览 Codex Cloud 任务并应用
codex debug       # 调试工具
codex features    # 查看 feature flags
codex app-server  # 实验性 app server 工具
```

### 自动化高频写法
```bash
codex exec "重构 src/lib/cache.ts"
codex exec --json "总结这个仓库的测试入口"
codex review
codex resume --last
codex fork --last
codex apply
```

## 技巧
---
lang: bash
emoji: 💡
link: https://developers.openai.com/codex/cli/features
---

### 先定执行边界，再谈效果
```bash
# 陌生仓库：先只读
codex --sandbox read-only --ask-for-approval on-request

# 熟悉后：工作区可写
codex --sandbox workspace-write --ask-for-approval on-request

# 极端自动化：仅在外部环境已隔离时使用
codex --dangerously-bypass-approvals-and-sandbox
```

### 配置分层思路
```bash
# profile 负责一类场景
codex --profile work

# 临时覆盖单个配置
codex -c model=\"gpt-5-codex\"
codex -c 'features.search=true'
```

### 多目录 / 联网 / 多模态
```bash
# 主目录外再开放一个可写目录
codex --add-dir ../shared-lib

# 联网搜索只在需要最新资料时打开
codex --search

# 设计图、报错截图直接附给首轮提示
codex -i error.png "分析这张报错截图并给修复方案"
```
