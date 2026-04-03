---
title: Agent Browser 速查表
lang: bash
version: "0.24.0"
date: 2026-04-03
github: vercel-labs/agent-browser
colWidth: 340px
---

# Agent Browser 速查表

## 快速定位
---
lang: bash
emoji: 🧭
link: https://github.com/vercel-labs/agent-browser
desc: 面向 AI agent 的浏览器自动化 CLI。核心思路是先打开页面，再通过 snapshot 拿到 `@e1` 这类引用，后续点击、填写、提取信息都围绕这些 ref 展开。
---

- 适合场景：网页测试、表单自动化、数据抓取、截图、录屏、CDP 连接现有浏览器
- 核心链路：`open -> snapshot -i -> click/fill/get -> wait -> screenshot/pdf`
- 最新核对版本：`0.24.0`
- 官方仓库：`vercel-labs/agent-browser`

```bash
agent-browser open https://example.com
agent-browser snapshot -i
agent-browser click @e1
agent-browser fill @e2 "user@example.com"
agent-browser wait --load networkidle
agent-browser screenshot result.png
```

## 起手工作流
---
lang: bash
emoji: 🚀
link: https://www.npmjs.com/package/agent-browser
desc: 可以把它类比成“浏览器版命令行状态机”。先把页面状态拿到手，再继续发命令，不要跳过 snapshot 直接盲点。
---

### 安装与帮助
```bash
npx agent-browser --help
npx agent-browser install
agent-browser --version
agent-browser <command> --help
```

### 标准操作顺序
```bash
# 1. 打开页面
agent-browser open example.com

# 2. 获取可交互元素
agent-browser snapshot -i

# 3. 根据 ref 操作
agent-browser fill @e2 "hello"
agent-browser click @e3

# 4. 等待页面稳定
agent-browser wait --load networkidle

# 5. 再次抓取新状态
agent-browser snapshot -i
```

### 连接已打开的浏览器
```bash
# Chrome / Edge 开启远程调试端口后连接
agent-browser --cdp 9222 snapshot

# 或者先建立连接，再继续操作
agent-browser connect 9222
agent-browser snapshot -i
```

## 页面打开与快照
---
lang: bash
emoji: 📸
link: https://github.com/vercel-labs/agent-browser
desc: `snapshot` 是这个工具最关键的一步。页面跳转、DOM 大改、弹窗出现以后，通常都要重新做一次快照。
---

### 导航
```bash
agent-browser open <url>
agent-browser back
agent-browser forward
agent-browser reload
agent-browser close
```

### 快照选项
```bash
agent-browser snapshot
agent-browser snapshot -i
agent-browser snapshot -c
agent-browser snapshot -d 3
agent-browser snapshot -s “#main”
```

- `-i`：只保留交互元素，日常最常用
- `-c`：压缩空结构，适合减少输出噪音
- `-s`：只分析某个局部区域，适合大页面
- `-d`：深度抓取延迟（毫秒）
- `-C`：已废弃（cursor-interactive 元素现已默认包含）

## 交互命令
---
lang: bash
emoji: 🖱️
link: https://github.com/vercel-labs/agent-browser
desc: ref 交互比 CSS 选择器更稳，尤其适合给 agent 用。只有在 snapshot 不方便时，再退回 `find` 或普通 selector。
---

### 常见点击与输入
```bash
agent-browser click @e1
agent-browser dblclick @e1
agent-browser hover @e1
agent-browser focus @e1

agent-browser fill @e2 "text"
agent-browser type @e2 "text"
agent-browser press Enter
agent-browser press Control+a
```

### 表单与拖拽
```bash
agent-browser check @e1
agent-browser uncheck @e1
agent-browser select @e1 "value"
agent-browser select @e1 "a" "b"
agent-browser upload @e1 ./file.pdf
agent-browser drag @e1 @e2
agent-browser download @e3 ./report.pdf
```

### 滚动与鼠标
```bash
agent-browser scroll down 500
agent-browser scroll right 240
agent-browser scrollintoview @e1

agent-browser mouse move 100 200
agent-browser mouse down left
agent-browser mouse up left
agent-browser mouse wheel 600
```

### 语义定位
```bash
agent-browser find role button click --name "Submit"
agent-browser find text "Sign In" click
agent-browser find label "Email" fill "user@test.com"
agent-browser find placeholder "Search" type "agent-browser"
agent-browser find testid "submit-btn" click
agent-browser find nth 2 "a" hover
```

## 抓取与状态检查
---
lang: bash
emoji: 🔎
link: https://github.com/vercel-labs/agent-browser
desc: `get` 像在 DOM 上做只读查询，`is` 像布尔断言。写自动化脚本时，常见模式是先 `wait`，再 `get` 或 `is`。
---

### 读取页面信息
```bash
agent-browser get text @e1
agent-browser get html @e1
agent-browser get value @e1
agent-browser get attr @e1 href
agent-browser get title
agent-browser get url
agent-browser get count ".item"
agent-browser get box @e1
agent-browser get styles @e1
```

### 状态判断
```bash
agent-browser is visible @e1
agent-browser is enabled @e1
agent-browser is checked @e1
```

### 等待页面稳定
```bash
agent-browser wait @e1
agent-browser wait 1500
agent-browser wait --text "Success"
agent-browser wait --url "**/dashboard"
agent-browser wait --load networkidle
agent-browser wait --fn "window.appReady === true"
```

## 键盘、剪贴板与 Diff
---
lang: bash
emoji: ⌨️
link: https://github.com/vercel-labs/agent-browser
desc: 不依赖元素引用的全局操作，以及快照/截图对比能力。
---

### 纯键盘输入
```bash
agent-browser keyboard type "hello world"
agent-browser keyboard inserttext "hello"
```

### 剪贴板操作
```bash
agent-browser clipboard read
agent-browser clipboard write "text to copy"
agent-browser clipboard copy @e1
agent-browser clipboard paste
```

### Diff 对比
```bash
agent-browser diff snapshot
agent-browser diff screenshot --baseline
agent-browser diff url <url1> <url2>
```

### 性能分析
```bash
agent-browser profiler start
agent-browser profiler stop profile.json
```

### HAR 抓包
```bash
agent-browser network har start
agent-browser network har stop output.har
```

## 认证保险库
---
lang: bash
emoji: 🔐
link: https://github.com/vercel-labs/agent-browser
desc: 保存和复用登录凭证，支持密码管理和自动填充。
---

```bash
agent-browser auth save myapp --url https://example.com --username user --password pass
agent-browser auth login myapp
agent-browser auth list
agent-browser auth show myapp
agent-browser auth delete myapp
```

## 批量执行与动作确认
---
lang: bash
emoji: 📋
link: https://github.com/vercel-labs/agent-browser
desc: 批量执行命令和动作确认流程。
---

### 批量执行
```bash
agent-browser batch [--bail]
# 输入 JSON 数组命令
echo '[["open","example.com"],["snapshot","-i"]]' | agent-browser batch
```

### 动作确认
```bash
agent-browser confirm <id>
agent-browser deny <id>
```

## 会话、存储与网络
---
lang: bash
emoji: 🗂️
link: https://github.com/vercel-labs/agent-browser
desc: 会话相关功能决定了“状态能不能复用”。需要保留登录态时，优先考虑 `--profile` 或 `--state`，而不是每次重登。
---

### 会话与标签页
```bash
agent-browser --session qa open site-a.com
agent-browser --session qa snapshot -i
agent-browser session
agent-browser session list
agent-browser close --all

agent-browser tab
agent-browser tab new https://example.com
agent-browser tab 2
agent-browser tab close
```

### Cookies 与 Storage
```bash
agent-browser cookies
agent-browser cookies set token abc123 --url https://example.com
agent-browser cookies clear

agent-browser storage local
agent-browser storage local auth
agent-browser storage local set theme dark
agent-browser storage local clear
```

### 浏览器设置
```bash
agent-browser set viewport 1440 900
agent-browser set device "iPhone 12"
agent-browser set geo 37.7749 -122.4194
agent-browser set offline on
agent-browser set headers '{"X-Test":"1"}'
agent-browser set credentials admin secret123
agent-browser set media dark
agent-browser set media light reduced-motion
```

### 网络拦截
```bash
agent-browser network route "**/api/*" --abort
agent-browser network route "**/data.json" --body '{"mock":true}'
agent-browser network requests
agent-browser network requests --filter "api"
agent-browser network requests --type xhr
agent-browser network requests --method POST
agent-browser network requests --status 200
agent-browser network request <requestId>
agent-browser network requests --clear
agent-browser network unroute
```

## 仪表板、流与 Dialog
---
lang: bash
emoji: 📊
link: https://github.com/vercel-labs/agent-browser
desc: v0.23+ 新增可视化仪表板和 WebSocket 流管理。dialog 命令用于检查和处理 JavaScript 弹窗。
---

### 可视化仪表板
```bash
agent-browser dashboard start
agent-browser dashboard stop
agent-browser dashboard install
```

### WebSocket 流管理
```bash
agent-browser stream enable
agent-browser stream disable
agent-browser stream status
```

### Dialog 处理
```bash
agent-browser dialog status
agent-browser --no-auto-dialog open example.com
```

- `--no-auto-dialog`：禁用自动接受 alert/beforeunload
- 自动 dialog 接受默认开启，防止弹窗阻塞
- `--auto-connect`：自动发现并连接已运行的 Chrome，复用其认证状态（Tip: `agent-browser --auto-connect state save ./auth.json`）

## 调试、截图与录制
---
lang: bash
emoji: 🛠️
link: https://github.com/vercel-labs/agent-browser
desc: 这部分适合排查“为什么 agent 没点对”“为什么页面状态不对”。思路和前端排查问题很像，先看页面表现，再看控制台和 trace。
---

### 截图与 PDF
```bash
agent-browser screenshot
agent-browser screenshot page.png
agent-browser screenshot --full
agent-browser pdf page.pdf
```

### 调试命令
```bash
agent-browser console
agent-browser console --clear
agent-browser errors
agent-browser errors --clear
agent-browser highlight @e1
agent-browser eval "document.title"
```

### Trace 与录屏
```bash
agent-browser trace start
agent-browser trace stop trace.zip

agent-browser record start ./demo.webm
agent-browser click @e1
agent-browser record stop
```

## 全局选项与环境变量
---
lang: bash
emoji: ⚙️
link: https://www.npmjs.com/package/agent-browser
desc: 全局选项主要控制浏览器来源、状态复用和输出格式。脚本场景里最常见的是 `--json`、`--session`、`--profile`、`--cdp`。
---

### 常用全局选项
```bash
agent-browser --json snapshot -i
agent-browser --headed open example.com
agent-browser --session test open example.com
agent-browser --profile ~/.browser-profile open example.com
agent-browser --state ./auth.json open example.com
agent-browser --auto-connect open example.com
agent-browser --proxy http://127.0.0.1:7890 open example.com
agent-browser --proxy-bypass "localhost,*.internal.com" open example.com
agent-browser --ignore-https-errors open https://localhost:8443
agent-browser --allow-file-access open file:///tmp/demo.html
agent-browser --user-agent "Custom UA" open example.com
agent-browser --args "--no-sandbox,--disable-blink-features=AutomationControlled" open example.com
agent-browser --no-auto-dialog open example.com
agent-browser --idle-timeout 10s open example.com
agent-browser --with-deps install
agent-browser --annotate screenshot annotated.png
agent-browser --extension ./my-extension open example.com
agent-browser --color-scheme dark open example.com
agent-browser --download-path ~/Downloads open example.com
agent-browser --engine lightpanda open example.com
agent-browser --debug open example.com
```

### Provider 相关
```bash
agent-browser -p browserbase open example.com
agent-browser -p browseruse open example.com
agent-browser -p browserless open example.com
agent-browser -p kernel open example.com
agent-browser -p agentcore open example.com

# iOS 模拟器场景
agent-browser -p ios open example.com
agent-browser -p ios --device "iPhone 15 Pro" open example.com
```

### 环境变量
```bash
AGENT_BROWSER_SESSION=qa
AGENT_BROWSER_PROFILE=./.browser-profile
AGENT_BROWSER_STATE=./auth.json
AGENT_BROWSER_SESSION_NAME=myapp
AGENT_BROWSER_EXECUTABLE_PATH=/path/to/chrome
AGENT_BROWSER_PROVIDER=browserbase
AGENT_BROWSER_STREAM_PORT=9223
AGENT_BROWSER_IOS_DEVICE="iPhone 15 Pro"
AGENT_BROWSER_IOS_UDID=<simulator-udid>
AGENT_BROWSER_NO_AUTO_DIALOG=1
AGENT_BROWSER_AUTO_CONNECT=1
AGENT_BROWSER_IDLE_TIMEOUT_MS=60000
AGENT_BROWSER_DEFAULT_TIMEOUT=25000
AGENT_BROWSER_COLOR_SCHEME=dark
AGENT_BROWSER_DOWNLOAD_PATH=~/Downloads
AGENT_BROWSER_ENGINE=chrome
AGENT_BROWSER_DEBUG=1
# 标准代理环境变量（v0.22.2+）
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
ALL_PROXY=socks5://127.0.0.1:7890
# AgentCore provider（v0.24.0+）
AGENTCORE_REGION=us-west-2
AGENTCORE_PROFILE_ID=<profile-id>
AGENTCORE_BROWSER_ID=<browser-id>
# 状态加密（可选）
AGENT_BROWSER_ENCRYPTION_KEY=<64-char-hex-key>
AGENT_BROWSER_STATE_EXPIRE_DAYS=30
```

## 高频 Recipes
---
lang: bash
emoji: 🧪
link: https://github.com/vercel-labs/agent-browser
desc: 下面这些组合更接近真实使用。不要把命令拆开死记，记“套路”更高效，就像前端里你记的是调试链路，不是单个 API 名字。
---

### 登录后复用状态
```bash
# 首次登录
agent-browser open https://app.example.com/login
agent-browser snapshot -i
agent-browser fill @e1 "username"
agent-browser fill @e2 "password"
agent-browser click @e3
agent-browser wait --url "**/dashboard"

# 后续执行直接复用 profile
agent-browser --profile ./.agent-browser-profile open https://app.example.com/dashboard
```

### 连接本地 Chrome 做人工接管
```bash
# 先用远程调试端口启动 Chrome / Edge
chrome.exe --remote-debugging-port=9222

# 再由 agent-browser 接管
agent-browser --cdp 9222 snapshot -i
agent-browser click @e1
agent-browser screenshot attached.png
```

### 抓取列表页文本
```bash
agent-browser open https://example.com/list
agent-browser wait --load networkidle
agent-browser snapshot -i -c
agent-browser get count ".item"
agent-browser get text @e4
```
