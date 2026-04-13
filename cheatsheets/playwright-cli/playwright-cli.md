---
title: "@playwright/cli / playwright-cli"
lang: bash
version: "0.1.7"
date: 2026-04-12
github: microsoft/playwright-cli
colWidth: 340px
---

# @playwright/cli / playwright-cli

## 快速定位
---
lang: bash
emoji: 🧭
link: https://playwright.dev/docs/getting-started-cli
desc: `@playwright/cli` 安装后暴露的命令是 `playwright-cli`。它更像“面向 coding agent 的浏览器交互 CLI”，核心链路是 `open -> snapshot -> click/fill/eval -> screenshot/pdf`，不要和 `npx playwright test` 那套测试 runner CLI 混淆。
---

- 适合场景：让 agent 驱动真实浏览器、做页面交互、抓取状态、录屏、录 trace、管理会话
- 最短路径：安装 CLI -> `open` 页面 -> `snapshot` 拿 ref -> `click/fill` 操作 -> `screenshot` / `pdf` / `state-save`
- 默认命令名：`playwright-cli`
- 当前核对版本：`0.1.7`
- 版本发布时间：`2026-04-12`
- 官方仓库：`microsoft/playwright-cli`

```bash
# 全局安装
npm install -g @playwright/cli@latest

# 看帮助
playwright-cli --help

# 最小链路
playwright-cli open https://example.com
playwright-cli snapshot
playwright-cli click e15
playwright-cli screenshot
```

## 安装与最小工作流
---
lang: bash
emoji: 🚀
link: https://github.com/microsoft/playwright-cli
desc: 先把工具装起来，再按“打开页面 -> 获取引用 -> 操作页面 -> 导出结果”走。它很像给浏览器包了一层命令行状态机，每次命令都在同一个 browser session 里继续推进。
---

### 安装与帮助
```bash
# 全局安装
npm install -g @playwright/cli@latest

# 查看版本和帮助
playwright-cli --version
playwright-cli --help
playwright-cli --help open
playwright-cli --help snapshot

# 只临时执行
npx @playwright/cli@latest --help
```

### 安装 skill
```bash
# 给 Claude / agents 安装本地 skills
playwright-cli install --skills
playwright-cli install --skills=claude
playwright-cli install --skills=agents
```

### 标准起手式
```bash
# 1. 打开页面
playwright-cli open https://demo.playwright.dev/todomvc/

# 2. 拿页面快照，获取 e15 / e21 这类元素引用
playwright-cli snapshot

# 3. 交互
playwright-cli click e15
playwright-cli type "Buy groceries"
playwright-cli press Enter

# 4. 导出结果
playwright-cli screenshot
playwright-cli state-save auth.json
```

### 什么时候该重新 snapshot
- 页面跳转后
- 点击后 DOM 大改或弹窗出现后
- 切 tab / 切 session 后
- 你手里的 `e15` 这类 ref 已经失效时

## 不要混淆
---
lang: bash
emoji: ⚠️
link: https://playwright.dev/docs/test-cli
desc: 这张卡专门解决最常见误解。`playwright-cli` 和 `npx playwright` 都来自 Playwright 生态，但用途不同，命令面也不同。
---

| 主题 | `playwright-cli` | `npx playwright` |
| --- | --- | --- |
| 包 | `@playwright/cli` | `playwright` / `@playwright/test` |
| 入口 | `playwright-cli` | `npx playwright ...` |
| 核心目标 | 给 agent / 人类做浏览器交互与会话控制 | 跑测试、录制脚本、看报告、合并报告 |
| 典型命令 | `open` `snapshot` `click` `state-save` | `test` `codegen` `show-report` `merge-reports` |
| 更像什么 | 浏览器自动化 shell | 测试 runner CLI |

```bash
# 这是 @playwright/cli
playwright-cli open https://example.com
playwright-cli snapshot

# 这是传统 Playwright 测试 CLI
npx playwright test
npx playwright codegen
```

- 如果你要“让 agent 连续操作浏览器”，主入口是 `playwright-cli`
- 如果你要“跑测试套件 / 录制 spec / 看 html report”，主入口是 `npx playwright`

## 会话与浏览器启动
---
lang: bash
emoji: 🗂️
link: https://github.com/microsoft/playwright-cli
desc: 这个 CLI 的关键能力之一是 session。你可以把它理解成“给不同任务开不同浏览器工作区”，每个 session 都保留自己的 cookies、storage、tabs 和页面状态。
---

### 基础启动
```bash
# 默认 headless
playwright-cli open https://playwright.dev

# 有头模式
playwright-cli open https://playwright.dev --headed

# 指定浏览器 / channel
playwright-cli open https://playwright.dev --browser=chrome
playwright-cli open https://playwright.dev --browser=msedge
playwright-cli open https://playwright.dev --browser=firefox
playwright-cli open https://playwright.dev --browser=webkit
```

### 持久化与 profile
```bash
# 关闭浏览器即丢失 profile
playwright-cli open https://example.com

# 持久化 profile 到磁盘
playwright-cli open https://example.com --persistent

# 指定 profile 目录
playwright-cli open https://example.com --profile=.playwright/profiles/demo
```

### 多 session
```bash
# 默认 session
playwright-cli open https://playwright.dev

# 命名 session
playwright-cli -s=todo open https://demo.playwright.dev/todomvc/
playwright-cli -s=docs open https://playwright.dev

# 查看、关闭、强杀
playwright-cli list
playwright-cli close-all
playwright-cli kill-all
```

### 会话环境变量
```bash
# 让 agent 进程默认绑定某个 session
set PLAYWRIGHT_CLI_SESSION=todo-app
playwright-cli open https://example.com
```

- `-s=name`：当前命令发给指定 session
- `--persistent`：跨浏览器重启也保留数据
- `delete-data`：删除当前 session 的数据目录

## 页面交互主链
---
lang: bash
emoji: 🖱️
link: https://github.com/microsoft/playwright-cli
desc: 日常最常用的一组命令。先用 `snapshot` 拿元素 ref，再围绕 ref 做点击、填写、悬停、拖拽。比盲写 selector 更稳，也更适合 agent。
---

### 导航与打开
```bash
playwright-cli open https://example.com
playwright-cli goto https://example.com/dashboard
playwright-cli go-back
playwright-cli go-forward
playwright-cli reload
playwright-cli close
```

### snapshot 与元素 ref
```bash
# 全页快照
playwright-cli snapshot

# 存到文件
playwright-cli snapshot --filename=page.md

# 只截某个根元素
playwright-cli snapshot "#main"

# 限制深度，减少噪音
playwright-cli snapshot --depth=4

# 对某个已有 ref 再局部快照
playwright-cli snapshot e34
```

### 核心交互
```bash
playwright-cli click e15
playwright-cli dblclick e15
playwright-cli hover e15
playwright-cli fill e22 "user@example.com"
playwright-cli type "hello world"
playwright-cli select e31 value-a
playwright-cli check e40
playwright-cli uncheck e40
playwright-cli drag e12 e33
playwright-cli upload ./fixtures/demo.pdf
```

### 直接用 selector / locator
```bash
# CSS selector
playwright-cli click "#main > button.submit"

# Playwright locator
playwright-cli click "getByRole('button', { name: 'Submit' })"
playwright-cli click "getByTestId('submit-button')"
```

- 优先级建议：`ref` > 语义 locator > CSS selector
- `fill`：更像“清空后再填入”
- `type`：更像“往当前可编辑元素键入”

## 键盘、鼠标、标签页
---
lang: bash
emoji: ⌨️
link: https://github.com/microsoft/playwright-cli
desc: 这一组适合处理复杂交互，例如键盘快捷键、拖动、滚轮、弹窗和多标签页切换。前端开发里可以把它类比成把 DevTools 的手工操作拆成一串可重复命令。
---

### 键盘
```bash
playwright-cli press Enter
playwright-cli press ArrowLeft
playwright-cli keydown Shift
playwright-cli keyup Shift
```

### 鼠标
```bash
playwright-cli mousemove 320 480
playwright-cli mousedown left
playwright-cli mouseup left
playwright-cli mousewheel 0 600
```

### 对话框
```bash
playwright-cli dialog-accept
playwright-cli dialog-accept "yes"
playwright-cli dialog-dismiss
```

### 标签页
```bash
playwright-cli tab-list
playwright-cli tab-new https://example.com
playwright-cli tab-select 1
playwright-cli tab-close 1
```

### 窗口尺寸
```bash
playwright-cli resize 1440 900
playwright-cli resize 390 844
```

## 存储、网络与导出
---
lang: bash
emoji: 💾
link: https://github.com/microsoft/playwright-cli
desc: 这部分决定你能不能把“登录态、网络限制、截图产物”稳定带到下一轮自动化里。最常用的是 `state-save/state-load`、cookies、本地存储和截图 / pdf。
---

### Storage State
```bash
# 保存整份认证状态
playwright-cli state-save auth.json

# 载入认证状态
playwright-cli state-load auth.json
```

### Cookie
```bash
playwright-cli cookie-list
playwright-cli cookie-get sessionid
playwright-cli cookie-set theme dark
playwright-cli cookie-delete theme
playwright-cli cookie-clear
```

### localStorage / sessionStorage
```bash
playwright-cli localstorage-list
playwright-cli localstorage-get token
playwright-cli localstorage-set theme dark
playwright-cli localstorage-delete theme
playwright-cli localstorage-clear

playwright-cli sessionstorage-list
playwright-cli sessionstorage-get draft
playwright-cli sessionstorage-set draft hello
playwright-cli sessionstorage-clear
```

### 网络控制
```bash
# 列出记录到的网络请求
playwright-cli network

# Mock / 解除 mock
playwright-cli route "**/api/**"
playwright-cli route-list
playwright-cli unroute

# 切离线 / 在线
playwright-cli network-state-set offline
playwright-cli network-state-set online
```

### 导出结果
```bash
playwright-cli screenshot
playwright-cli screenshot e15
playwright-cli pdf
```

- `state-save` 很适合把登录态从一轮任务复用到下一轮
- `network-state-set offline` 适合快速验证离线 fallback
- `screenshot [target]` 和 `pdf` 是最轻量的交付物

## 调试、监控与 DevTools
---
lang: bash
emoji: 🔍
link: https://github.com/microsoft/playwright-cli
desc: 当自动化看起来“像是卡住了”时，先用 `show` 看 session，再用 `console`、`network`、`eval`、`tracing-*` 缩小问题范围。排障顺序固定下来，效率会高很多。
---

### 监控 session
```bash
# 打开 dashboard
playwright-cli show
```

### Console / JS / 请求
```bash
playwright-cli console
playwright-cli console warning
playwright-cli network
playwright-cli eval "() => document.title"
playwright-cli eval "(el) => el.textContent" e15
playwright-cli run-code "await page.goto('https://example.com')"
```

### Trace / Video
```bash
playwright-cli tracing-start
playwright-cli tracing-stop
playwright-cli video-start
playwright-cli video-chapter "after-login"
playwright-cli video-stop
```

### 调试执行
```bash
playwright-cli pause-at tests/login.spec.ts:42
playwright-cli resume
playwright-cli step-over
```

- `show`：更像 session dashboard，可观察 agent 在后台做什么
- `eval`：做只读探查最轻，适合临时取属性、文本、状态
- `run-code`：直接执行 Playwright 代码片段，能力最强，也最容易把会话改坏

## 配置文件与环境变量
---
lang: json
emoji: ⚙️
link: https://github.com/microsoft/playwright-cli
desc: 配置文件本质上是把常用启动参数、上下文选项和输出策略固化下来。类比前端工程里的 `vite.config` 或 `playwright.config`，避免每次命令都手写一大串 flag。
---

### 配置文件位置
```bash
# 显式指定
playwright-cli --config .playwright/cli.config.json open https://example.com

# 默认位置
.playwright/cli.config.json
```

### 最小配置示例
```json
{
  "browser": {
    "browserName": "chromium",
    "userDataDir": ".playwright/profile",
    "launchOptions": {
      "channel": "chrome",
      "headless": false
    },
    "contextOptions": {
      "viewport": { "width": 1440, "height": 900 }
    }
  },
  "outputDir": ".playwright/output",
  "outputMode": "file",
  "console": {
    "level": "warning"
  },
  "timeouts": {
    "action": 5000,
    "navigation": 60000
  },
  "testIdAttribute": "data-testid"
}
```

### 常看字段
- `browser.browserName`：`chromium` / `firefox` / `webkit`
- `browser.userDataDir`：持久化 profile 目录
- `browser.launchOptions`：`channel`、`headless`、`executablePath` 等
- `browser.contextOptions`：`viewport`、权限、UA、locale 等
- `browser.cdpEndpoint`：连已有 Chromium 会话
- `outputDir` / `outputMode`：产物目录与输出方式
- `network.allowedOrigins` / `blockedOrigins`：网络放行和限制
- `timeouts.action` / `timeouts.navigation`：默认超时
- `allowUnrestrictedFileAccess`：文件上传 / `file://` 等边界开关

### 高频环境变量
```bash
PLAYWRIGHT_CLI_SESSION=todo-app
PLAYWRIGHT_MCP_BROWSER=chrome
PLAYWRIGHT_MCP_HEADLESS=false
PLAYWRIGHT_MCP_CDP_ENDPOINT=http://127.0.0.1:9222
PLAYWRIGHT_MCP_OUTPUT_DIR=.playwright/output
PLAYWRIGHT_MCP_PROXY_SERVER=http://127.0.0.1:7897
PLAYWRIGHT_MCP_TIMEOUT_ACTION=8000
PLAYWRIGHT_MCP_VIEWPORT_SIZE=1280x720
```

- 变量名前缀虽然是 `PLAYWRIGHT_MCP_*`，但 README 明确它们也是这套 CLI 的配置入口
- 长期固定参数优先写进配置文件；临时调试再用 env 覆盖

## 高频 Recipes
---
lang: bash
emoji: 🧪
link: https://playwright.dev/docs/getting-started-cli
desc: 下面这些 recipe 覆盖最常见的真实任务：临时探查页面、带登录态继续跑、连接已有浏览器、离线验证、交付截图和 PDF。混合风格文档的价值就在这里，不只是列命令，而是告诉你什么时候组合哪一组命令。
---

### Recipe 1：临时探查一个页面
```bash
playwright-cli open https://example.com --headed
playwright-cli snapshot
playwright-cli eval "() => document.title"
playwright-cli screenshot
```

适合：
- 快速看页面结构
- 让 agent 拿到第一轮元素 ref

### Recipe 2：录一个可复用登录态
```bash
playwright-cli open https://github.com/login --persistent
playwright-cli snapshot
# 后续人工或 agent 完成登录动作
playwright-cli state-save auth.json
```

后续复用：
```bash
playwright-cli open https://github.com
playwright-cli state-load auth.json
playwright-cli reload
```

### Recipe 3：给不同任务分不同 session
```bash
playwright-cli -s=docs open https://playwright.dev
playwright-cli -s=app open https://example.com/app --persistent
playwright-cli list
playwright-cli show
```

适合：
- 一个 session 看文档，一个 session 操作业务系统
- 避免 cookies / localStorage 串味

### Recipe 4：连接已有浏览器或远程端点
```bash
# 通过配置文件写 CDP
playwright-cli --config .playwright/cli.config.json open https://example.com
```

配置里常见写法：
```json
{
  "browser": {
    "cdpEndpoint": "http://127.0.0.1:9222"
  }
}
```

适合：
- 复用已打开浏览器
- 让 agent 接管已有 Chromium 会话

### Recipe 5：做离线 / mock / 截图交付
```bash
playwright-cli open https://example.com
playwright-cli route "**/api/**"
playwright-cli network-state-set offline
playwright-cli snapshot
playwright-cli screenshot
```

适合：
- 验证前端离线文案
- 做快速演示图

## Quick Ref
---
lang: bash
emoji: 📌
link: https://github.com/microsoft/playwright-cli
desc: 最后这张卡只保留高频命令速记。忘了全流程时回上面，临时抄命令时直接看这里。
---

### 启动与会话
```bash
playwright-cli open [url]
playwright-cli open [url] --headed
playwright-cli open [url] --browser=chrome
playwright-cli open [url] --persistent
playwright-cli open [url] --profile=<dir>
playwright-cli list
playwright-cli close-all
playwright-cli kill-all
```

### 页面与元素
```bash
playwright-cli snapshot [element]
playwright-cli snapshot --filename=page.md
playwright-cli snapshot --depth=4
playwright-cli click <target>
playwright-cli fill <target> <text>
playwright-cli type <text>
playwright-cli hover <target>
playwright-cli drag <start> <end>
playwright-cli upload <file>
```

### 导航与标签页
```bash
playwright-cli goto <url>
playwright-cli go-back
playwright-cli go-forward
playwright-cli reload
playwright-cli tab-list
playwright-cli tab-new [url]
playwright-cli tab-select <index>
playwright-cli tab-close [index]
```

### 存储与导出
```bash
playwright-cli state-save [file]
playwright-cli state-load <file>
playwright-cli cookie-list
playwright-cli localstorage-list
playwright-cli sessionstorage-list
playwright-cli screenshot [target]
playwright-cli pdf
```

### 调试与可视化
```bash
playwright-cli show
playwright-cli console [level]
playwright-cli network
playwright-cli eval <func> [element]
playwright-cli run-code <code>
playwright-cli tracing-start
playwright-cli tracing-stop
playwright-cli video-start [file]
playwright-cli video-stop
```

## 决策点与常见坑
---
lang: bash
emoji: 🩹
link: https://github.com/microsoft/playwright-cli
desc: 真正容易踩坑的地方，不是命令拼写，而是会话边界、ref 生命周期、持久化策略和工具混淆。先把这些规则立住，后面的命令基本都顺。
---

- 先判断你要的是 `playwright-cli` 还是 `npx playwright`
- ref 不是永久 ID；页面结构变了就应该重新 `snapshot`
- 默认 session 数据在内存里，关闭浏览器就丢；需要长期复用时开 `--persistent`
- `run-code` 权限最大，适合“最后手段”，不要拿它代替常规命令
- 要复用登录态，优先 `state-save/state-load`，其次才是直接改 cookies / localStorage
- 多任务并行时优先用 `-s=name` 分会话，不要把所有流程挤进一个默认 session
- 需要稳定输出产物时，把 `outputDir`、`outputMode` 和截图/trace/video 策略写进配置文件
