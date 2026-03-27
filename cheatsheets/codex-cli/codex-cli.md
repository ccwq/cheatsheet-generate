---
title: Codex CLI 速查
lang: bash
version: "0.117.0"
date: 2026-03-26
github: openai/codex
colWidth: 340px
---

# Codex CLI 速查表

## 快速定位 / 一眼入口
---
lang: bash
emoji: 🚀
link: https://developers.openai.com/codex/cli
---

### 这是什么，先从哪开始
```bash
# Codex CLI = 终端里的编码代理
# 适合：读仓库、改代码、做 review、跑非交互任务、接 MCP

# 最短起手式：先在仓库根目录开交互会话
cd /path/to/repo
codex

# 首轮提示要同时说明目标、限制、验收口径
先读项目结构
修复登录跳转循环
不要改公开 API
最后跑相关测试
```

### 先选哪条工作流
```bash
# 要边聊边推进：交互模式
codex

# 要一次性执行并拿结果：非交互模式
codex exec "为 src/config.ts 增加环境变量校验"

# 要先看风险和改动建议：review 模式
codex review

# 要接着上次上下文继续干：resume
codex resume --last
```

## 最小工作流
---
lang: bash
emoji: 🧭
link: https://developers.openai.com/codex/cli/features
---

### 从陌生仓库到稳定产出
```bash
# 1) 第一次进仓库，先保守探路
codex --sandbox read-only --ask-for-approval on-request

# 2) 确认范围后，切到可写工作区
codex --sandbox workspace-write --ask-for-approval on-request

# 3) 需要自动跑完一轮时，再用非交互执行
codex exec "补齐 docs 生成脚本的错误处理并跑测试"

# 4) 结果满意，再把最近一次 patch 应用到工作树
codex apply
```

### 速查：常见目标对应入口
```bash
读代码 / 问问题        -> codex
一次性改代码           -> codex exec "任务"
先做代码审查           -> codex review
继续最近会话           -> codex resume --last
从最近会话分叉方案      -> codex fork --last
看云端任务并拉回结果     -> codex cloud
```

## 高频场景 Recipes
---
lang: bash
emoji: 🍳
link: https://developers.openai.com/codex/cli
---

### Recipe 1：先摸清仓库，再动手改
```bash
# 先限制能力，避免在陌生仓库里直接落盘
codex --sandbox read-only --ask-for-approval on-request

# 首轮提示给“阅读顺序 + 输出格式”
先看 package.json、src、tests 三块
总结构建、测试和入口文件
然后给出修复方案，不要直接改代码
```

### Recipe 2：单次自动执行，适合脚本或 CI
```bash
# 跑一次就退出
codex exec "为 scripts/release.js 增加重试逻辑"

# 要给机器消费时输出 JSON
codex exec --json "总结这个仓库的构建步骤"

# 如果只需要最后一条答复，适合脚本取值
codex exec --output-last-message "列出这个项目的环境变量"
```

### Recipe 3：先 review，再决定是否让它改
```bash
# 非交互审查当前工作树
codex review

# 交互期也可以随时切 review 视角
/review

# review 之后常见动作
/diff
/status
```

### Recipe 4：保留主线，分叉试两种实现
```bash
# 回到最近一次上下文
codex resume --last

# 从最近会话分叉，适合试激进方案
codex fork --last

# 一个保守修补，一个做结构重构
# 最后比较 diff 再决定留哪条线
```

### Recipe 5：带图、带目录、带联网资料一起开工
```bash
# 附设计图或报错截图给首轮提示
codex -i mockup.png "按图实现设置页，保留现有路由结构"

# 额外开放一个共享目录
codex --add-dir ../shared-lib

# 需要最新资料时再开 web search
codex --search
```

### Recipe 6：把 Codex 接进外部工具链
```bash
# 管理 MCP 服务
codex mcp

# 把 Codex 作为 MCP server 跑起来
codex mcp-server

# 查看云端任务，必要时把结果应用到本地
codex cloud
```

## Quick Ref / 命令速查
---
lang: bash
emoji: 🛠️
link: https://developers.openai.com/codex/cli/reference
---

### 核心入口
```bash
codex           # 交互式工作
codex exec      # 非交互执行任务
codex review    # 非交互代码审查
codex resume    # 恢复历史会话
codex fork      # 从历史会话分叉
codex apply     # 把最近一次 patch 应用到工作树
```

### 扩展入口
```bash
codex login       # 登录
codex logout      # 清理本地认证
codex mcp         # 管理 MCP 服务
codex mcp-server  # 以 MCP server 方式启动 Codex
codex sandbox     # 在 Codex 沙箱里运行命令
codex completion  # 生成 shell 补全
codex cloud       # 浏览 Codex Cloud 任务
codex features    # 查看 feature flags
codex debug       # 输出调试信息
codex app-server  # 实验性 app server 工具
```

### 高频全局参数
```bash
-m, --model MODEL                 # 指定模型
-p, --profile NAME                # 选择 config.toml 里的 profile
-c, --config key=value            # 临时覆盖配置
-s, --sandbox MODE                # read-only / workspace-write / danger-full-access
-a, --ask-for-approval POLICY     # untrusted / on-failure / on-request / never
--full-auto                       # 常用自动化组合
--search                          # 启用联网搜索
-i, --image FILE                  # 给首轮提示附图，可重复
-C, --cd DIR                      # 指定工作目录
--add-dir DIR                     # 额外开放可写目录
--enable FEATURE                  # 打开 feature flag
--disable FEATURE                 # 关闭 feature flag
--oss                             # 切到本地开源模型 provider
--local-provider PROVIDER         # lmstudio / ollama
--no-alt-screen                   # 禁用 alternate screen
-h, --help                        # 查看帮助
-V, --version                     # 查看版本
```

### 最常抄的命令组合
```bash
# 常规改代码
codex --sandbox workspace-write --ask-for-approval on-request

# 保守阅读
codex --sandbox read-only --ask-for-approval on-request

# 快速自动执行
codex --full-auto

# 指定目录 + 指定模型
codex -C ~/work/app --model gpt-5-codex

# 临时改配置
codex -c model=\"gpt-5-codex\" -c 'features.search=true'
```

## Slash Commands / 交互速记
---
lang: bash
emoji: ⌨️
link: https://developers.openai.com/codex/cli/slash-commands/
---

### 会话里最常用的 slash commands
```bash
/model         # 切模型
/status        # 看当前上下文、token、模式等状态
/diff          # 看当前建议改动
/review        # 进入审查视角
/plan          # 先出计划再执行
/approvals     # 调整审批策略
/compact       # 压缩上下文，适合长会话
/logout        # 清除本地登录状态
/quit          # 退出 CLI
/exit          # 退出 CLI
```

### 什么时候用这些命令
```bash
任务刚开始不清楚范围      -> /plan
想确认改了什么            -> /diff
想确认当前模式和上下文     -> /status
会话太长、上下文太重       -> /compact
准备切模型或切策略         -> /model /approvals
```

## 决策点 / 常见坑
---
lang: bash
emoji: ⚖️
link: https://developers.openai.com/codex/cli/features
---

### 沙箱和审批怎么选
```bash
# 陌生仓库 / 高风险目录
codex --sandbox read-only --ask-for-approval on-request

# 常规开发默认档
codex --sandbox workspace-write --ask-for-approval on-request

# 失败才申请更高权限
codex --sandbox workspace-write --ask-for-approval on-failure

# 只有外部环境已经隔离好时才考虑
codex --dangerously-bypass-approvals-and-sandbox
```

### 配置分层别混用
```bash
# profile 管“长期场景”
codex --profile work

# -c 管“当前这一轮临时覆盖”
codex -c model=\"gpt-5-codex\"
codex -c 'features.search=true'

# 经验规则：
# profile 像前端项目里的环境文件
# -c 像你在命令行里临时塞一个 override
```

### 会话管理要点
```bash
# 最近会话继续做
codex resume --last

# 保留主线，再开一条实验分支
codex fork --last

# 长会话先 compact，再继续追问
/compact
```

## 排障 / 收尾动作
---
lang: bash
emoji: 🩺
link: https://developers.openai.com/codex/local-config#cli
---

### 出问题先查这几项
```bash
# 看版本
codex --version

# 看当前可用 feature flags
codex features

# 看调试信息
codex debug

# shell 补全失效时重新生成
codex completion powershell
codex completion bash
codex completion zsh
```

### 收尾动作速记
```bash
# 把最近一次 patch 应回工作树
codex apply

# 退出当前会话
/quit

# 需要清理认证再重新登录
codex logout
codex login
```
