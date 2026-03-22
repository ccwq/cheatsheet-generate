---
title: Browser Use
lang: python
version: "0.12.3"
date: "2026-03-20"
github: browser-use/browser-use
colWidth: 450px
---

# Browser Use

## 🤖 入口与定位
---
lang: python
emoji: 🤖
link: https://docs.browser-use.com/open-source/introduction
desc: Browser Use 是一套“让 LLM 像人一样操作浏览器”的工具链：Agent 负责规划与决策，BrowserSession 负责本地/Cloud/CDP 会话，Tools/Skills 提供可调用动作；同时提供高性能 CLI（daemon 常驻）。
---

- 适合：表单填充、带登录态的网页操作、网页测试/回归、信息检索与确定性提取（JS）、截图/下载等自动化流程
- 核心对象：`Agent`、`Browser`（`BrowserSession` 别名）、`Tools`

## 📦 安装与初始化（你要求必须包含）
---
lang: bash
emoji: 📦
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: 这里给出最短可用路径：一键安装与手动安装，以及常用的初始化/诊断命令。
---

### 方式 A：一键安装（推荐）

```bash
# macOS / Linux
curl -fsSL https://browser-use.com/cli/install.sh | bash
```

Windows（PowerShell，通过 Git Bash 执行脚本）：

```powershell
& "C:\Program Files\Git\bin\bash.exe" -c 'curl -fsSL https://browser-use.com/cli/install.sh | bash'
```

### 方式 B：手动安装（更可控）

```bash
# 需要 Python >= 3.11
uv pip install browser-use

# 安装 Chromium（Linux 下会安装系统依赖）
browser-use install

# 诊断与交互式设置（可选）
browser-use doctor
browser-use setup
```

### 方式 C：直接使用
```
uvx browser-use
```



### 生成模板（快速起项目）

```bash
browser-use init
browser-use init --list
browser-use init --template basic --output my_script.py --force
```

## 🧠 最小工作流（Python SDK）
---
lang: python
emoji: 🧠
link: https://github.com/browser-use/browser-use
desc: 典型链路：创建浏览器会话 -> 定义任务 -> 选择 LLM -> 运行 agent -> 保存历史（可复跑）。
---

```python
import asyncio
from browser_use import Agent, Browser, ChatBrowserUse


async def main():
    browser = Browser(
        # use_cloud=True,  # 可选：使用 Browser Use Cloud 的“隐身浏览器”
    )

    agent = Agent(
        task="打开 browser-use 仓库，告诉我 star 数（用页面信息回答）",
        llm=ChatBrowserUse(),
        browser=browser,
    )

    history = await agent.run()
    print(history.final_result())


if __name__ == "__main__":
    asyncio.run(main())
```

## 🧰 最小工作流（CLI）
---
lang: bash
emoji: 🧰
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: CLI 通过后台 daemon 让浏览器“常驻”，单条命令延迟很低。基本套路：open -> state -> click/input -> wait -> screenshot -> close。
---

```bash
browser-use --headed open https://example.com
browser-use state
browser-use input 0 "hello"
browser-use keys "Enter"
browser-use wait selector ".success" --timeout 30000
browser-use screenshot out.png --full
browser-use close
```

## 🧩 核心对象速查（SDK API）
---
lang: python
emoji: 🧩
link: https://github.com/browser-use/browser-use/tree/main/browser_use
desc: Agent 负责“规划与决策”，BrowserSession 负责“浏览器连接与状态捕获”，Tools 负责“可调用动作集合（点击/输入/提取/上传等）”。
---

### Agent

- `Agent(task=..., llm=..., browser=..., tools=...)`
- `await agent.run(max_steps=...)` 运行一次任务
- `agent.run_sync()` 同步包装（内部 `asyncio.run`）
- `agent.save_history("AgentHistory.json")` 保存历史（脱敏）
- `await agent.load_and_rerun(history_file=..., variables=...)` 读取历史并复跑（可替换变量）

### Browser / BrowserSession（别名）

- `Browser(...)` 对外 API 等价于 `BrowserSession(...)`
- 常见场景：
  - 本地启动 Chromium
  - 连接现有 Chrome（CDP）
  - 使用 Cloud 浏览器（`use_cloud=True`）

### Tools（动作集合）

```python
from browser_use import Tools

tools = Tools()

# 注册自定义 action：把业务能力变成工具
@tools.action(description="我的自定义工具：返回一个固定值")
async def my_action(browser_session):
    return "ok"
```

## ⚙️ BrowserSession / BrowserProfile 常用配置（API 速查）
---
lang: python
emoji: ⚙️
link: https://github.com/browser-use/browser-use/blob/main/browser_use/browser/profile.py
desc: 只列“最常用、最影响稳定性/权限边界”的配置项；完整字段请直接看 BrowserProfile 源码。
---

| 配置 | 作用 | 备注 |
|---|---|---|
| `headless` | 无头/有头 | 调试建议 `headless=False` |
| `use_cloud` | 使用 Cloud 浏览器 | Cloud 下 `close` 会停止云端浏览器 |
| `cdp_url` | 连接既有浏览器 | 用于接管现有 Chrome |
| `allowed_domains` / `prohibited_domains` | 域名白/黑名单 | 白名单优先 |
| `block_ip_addresses` | 禁止访问 IP URL | 会同时禁 localhost/私网，慎用 |
| `proxy` | 代理设置 | `ProxySettings(server=...)` |
| `enable_default_extensions` | 自动化优化扩展 | `BROWSER_USE_DISABLE_EXTENSIONS=1` 关闭 |
| `cookie_whitelist_domains` | Cookie 扩展白名单 | 防止特定站点被自动点 cookie 弹窗 |
| `cross_origin_iframes` | 跨域 iframe 支持 | 复杂站点建议打开 |
| `auto_download_pdfs` | 自动下载 PDF | 信息提取类任务好用 |

## 🧪 Cookbook：常见任务套路（workflow + 速查卡）
---
lang: text
emoji: 🧪
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: 混合风格要点：先给可执行 workflow，再在关键点嵌入命令/API 速查卡。
---

### C1：先用 CLI 把交互跑通，再搬回 Python 固化

```bash
browser-use --headed open https://example.com
browser-use state
browser-use click 5
browser-use input 3 "hello"
browser-use wait selector ".success" --timeout 30000
browser-use screenshot out.png --full
browser-use close
```

### C2：带登录态站点，优先 `--profile`（最稳）

```bash
browser-use --profile "Default" open https://github.com
browser-use state
```

### C3：需要并行/隔离多个任务，用 `--session`

```bash
browser-use --session work open https://example.com
browser-use --session work state

browser-use --session personal open https://news.ycombinator.com
browser-use --session personal state

browser-use sessions
browser-use close --all
```

### C4：抓取列表数据，优先 `eval` 做“确定性提取”

```bash
browser-use open https://news.ycombinator.com
browser-use eval "Array.from(document.querySelectorAll('.titleline a')).slice(0,5).map(a=>a.textContent)"
```

### C5：长流程（滚动 + 等待 + 断点），用 `python` 子命令脚本化

```bash
browser-use open https://example.com
browser-use python "for _ in range(5): browser.scroll('down', 800); browser.wait(0.5)"
browser-use screenshot scrolled.png --full
```

## 🧾 CLI 命令 API（详细速查）
---
lang: bash
emoji: 🧾
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: 按子命令分组列出 CLI 的“API 面”：flags、命令、关键参数和互斥关系。
---

### 全局 flags（互斥：`--connect`、`--cdp-url`、`--profile`）

```bash
browser-use --headed ...
browser-use --profile "Default" ...
browser-use --connect ...
browser-use --cdp-url http://localhost:9222 ...
browser-use --session work ...
browser-use --json ...
browser-use --mcp
```

### Setup / 诊断 / 模板

```bash
browser-use doctor
browser-use setup
browser-use install
browser-use init --list
browser-use init --template basic --output my_script.py --force
```

### 浏览器控制与会话

```bash
browser-use open <url>
browser-use back
browser-use scroll up|down --amount 500
browser-use switch <tab>
browser-use close-tab [tab]

browser-use sessions
browser-use close
browser-use close --all
```

### 状态 / 截图

```bash
browser-use state
browser-use screenshot [path.png] --full
```

### 交互（依赖 `state` 的 index）

```bash
browser-use click <index>           # 或 click <x> <y>
browser-use type "text"
browser-use input <index> "text"   # click + type
browser-use keys "Enter"
browser-use select <index> "value"
browser-use upload <index> <path>
browser-use hover <index>
browser-use dblclick <index>
browser-use rightclick <index>
```

### 等待（wait）

```bash
browser-use wait selector "css" --timeout 30000 --state visible
browser-use wait selector ".loading" --state hidden
browser-use wait text "Success" --timeout 30000
```

### 获取信息（get）

```bash
browser-use get title
browser-use get html
browser-use get html --selector "h1"
browser-use get text <index>
browser-use get value <index>
browser-use get attributes <index>
browser-use get bbox <index>
```

### JavaScript 提取（eval）

```bash
browser-use eval "document.title"
browser-use eval "Array.from(document.querySelectorAll('a')).slice(0,5).map(a=>a.href)"
```

### Cookies

```bash
browser-use cookies get [--url <url>]
browser-use cookies set <name> <value> --domain .example.com --secure --http-only --same-site Strict
browser-use cookies clear [--url <url>]
browser-use cookies export cookies.json
browser-use cookies import cookies.json
```

### Python 子命令（持久化命名空间 + browser 对象）

```bash
browser-use python "x = 42"
browser-use python "print(x); print(browser.url); print(browser.title)"
browser-use python --vars
browser-use python --reset
browser-use python --file script.py
```

### Cloud API（REST passthrough + cloud connect）

```bash
browser-use cloud login <api-key>          # 或环境变量 BROWSER_USE_API_KEY
browser-use cloud logout
browser-use cloud connect --timeout 120 --proxy-country US

browser-use cloud v2 GET /browsers
browser-use cloud v2 POST /tasks '{"task":"...","url":"https://google.com"}'
browser-use cloud v2 poll <task-id>
browser-use cloud v2 --help
browser-use cloud v3 --help
```

### Tunnel（Cloudflare tunnel）

```bash
browser-use tunnel 3000
browser-use tunnel list
browser-use tunnel stop 3000
browser-use tunnel stop --all
```

### Profile（profile-use 透传）

```bash
browser-use profile
browser-use profile list
browser-use profile sync --all
browser-use profile update
```

## 🛡️ 安全与范围控制（domains / IP / proxy）
---
lang: python
emoji: 🛡️
link: https://github.com/browser-use/browser-use/blob/main/browser_use/browser/profile.py
desc: 真环境里建议显式设置访问边界（域名白名单、禁 IP、代理等），避免越权与误操作。
---

```python
from browser_use import Browser

browser = Browser(
    allowed_domains=["https://github.com", "*.githubusercontent.com"],
    prohibited_domains=["*.doubleclick.net"],
    block_ip_addresses=True,  # 会禁 localhost/私网，慎用
)
```

```python
from browser_use import Browser
from browser_use.browser.profile import ProxySettings

browser = Browser(
    proxy=ProxySettings(
        server="http://proxy.example.com:8080",
        bypass="localhost,127.0.0.1,*.internal",
        username="user",
        password="pass",
    )
)
```

## 🧷 常用 Agent 参数（行为控制）
---
lang: python
emoji: 🧷
link: https://github.com/browser-use/browser-use/blob/main/browser_use/agent/service.py
desc: 这些参数会直接影响“跑得稳不稳、是不是可复现、失败后怎么恢复”。优先把超时、失败次数、规划开关配置清楚。
---

| 参数 | 作用 | 备注 |
|---|---|---|
| `max_failures` | 允许失败次数 | 默认 5 |
| `step_timeout` | 单步超时（秒） | 默认 180 |
| `use_vision` | 是否启用视觉 | `True/False/auto` |
| `enable_planning` | 是否启用规划字段 | Cloud/特定模型可能会禁用 |
| `max_actions_per_step` | 每步最大动作数 | 动作太多更容易跑偏 |
| `sensitive_data` | 脱敏/敏感字段 | 建议统一放这里 |
| `available_file_paths` | 允许上传/读取的文件白名单 | 上传文件必配 |
| `initial_actions` | 预置动作（如先导航） | 适合强制起手式 |
| `directly_open_url` | 自动从 task 提取 URL 并先打开 | 默认开启 |

## 🗂️ CLI 文件布局与环境变量
---
lang: text
emoji: 🗂️
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: 排障常用：确认 session 的 pid/socket 是否残留，以及 Cloud API key 与 home 目录是否正确。
---

常用环境变量：

- `BROWSER_USE_HOME`：CLI 数据目录（默认 `~/.browser-use/`）
- `BROWSER_USE_SESSION`：默认 session 名
- `BROWSER_USE_API_KEY`：Cloud API key（等价于 `cloud login`）
- `BROWSER_USE_DISABLE_EXTENSIONS=1`：禁用自动化扩展

目录（概念示意）：

```text
~/.browser-use/
  config.json         # API key 等
  bin/profile-use     # profile-use 可执行文件（自动下载）
  <session>.pid       # daemon pid（临时）
  <session>.sock      # daemon socket（Windows 上为 tcp 端口映射）
```

## 🧯 常见坑与排障
---
lang: bash
emoji: 🧯
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: 最常见问题不是“代码写错”，而是“环境/会话/网站行为变化”。先用 CLI 快速复现，再回到 Python 里固化。
---

- daemon 配置不一致：同一个 `--session` 内不要混用不同的 `--profile/--cdp-url/--connect`，必要时先 `browser-use close`
- 元素找不到：先 `state` 再 `scroll`，再 `state`；必要时 `--headed` 观察真实行为
- 跨域 iframe：复杂站点建议 `cross_origin_iframes=True`
- `deterministic_rendering=True` 不推荐：容易破站、也更容易被反爬识别

