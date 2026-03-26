---
title: Browser Use
lang: python
version: "0.12.5"
date: "2026-03-25"
github: browser-use/browser-use
colWidth: 450px
---

# Browser Use

## 一眼入口
---
lang: text
emoji: 🤖
link: https://docs.browser-use.com/open-source/introduction
desc: Browser Use 是一套把 LLM 连接到真实浏览器的工具链。最常见的落点是：Python SDK 里写 agent，CLI 里快速试流程，Cloud / CDP / profile 场景里接入真实会话。
---

- 你通常先选一条路：`Python SDK` 写自动化逻辑，`CLI` 做交互验证，`Cloud/CDP/Profile` 接真实浏览器
- 核心对象分工：
  - `Agent` 负责规划
  - `Browser` / `BrowserSession` 负责会话
  - `Tools` 负责动作扩展
- 最新版本：`0.12.5`

## 最短路径
---
lang: text
emoji: 🧭
link: https://github.com/browser-use/browser-use
desc: 先把最小闭环跑通，再决定是否切到 Cloud、CDP、profile 或自定义 tools。
---

1. 先用 CLI 打开页面，确认站点能正常交互
2. 再用 Python SDK 固化任务逻辑
3. 最后按需接入 Cloud、现有 Chrome、登录态 profile 或自定义工具

```bash
browser-use --headed open https://example.com
browser-use state
browser-use click 3
browser-use input 3 "hello"
browser-use wait selector ".success" --timeout 30000
browser-use screenshot out.png --full
browser-use close
```

## Python 起手式
---
lang: python
emoji: 🧠
link: https://github.com/browser-use/browser-use/blob/main/README.md
desc: 标准做法是创建 `Browser`，再创建 `Agent`。如果你要接 Cloud 或现有 Chrome，可以在这里切换会话来源。
---

```python
import asyncio
from browser_use import Agent, Browser, ChatBrowserUse


async def main():
    browser = Browser(
        # use_cloud=True,  # 云端浏览器
        # headless=False,  # 本地调试更直观
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

## CLI 起手式
---
lang: bash
emoji: 🧰
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: CLI 适合快速试站点、看页面状态、定位交互失败原因。常用套路是 open -> state -> click/input -> wait -> screenshot -> close。
---

```bash
browser-use open https://example.com
browser-use state
browser-use click 5
browser-use input 3 "hello"
browser-use wait selector ".success" --timeout 30000
browser-use screenshot out.png --full
browser-use close
```

## 什么时候选哪条路
---
lang: text
emoji: 🎯
link: https://docs.browser-use.com/open-source/customize/agent/basics
desc: 先选执行环境，再选 API 风格。这个决策比一开始纠结参数更重要。
---

- `Python SDK`：要写长期任务、复用逻辑、接自定义工具时用
- `CLI`：要验证页面行为、调试选择器、看 state / screenshot 时用
- `Cloud`：要远程浏览器、共享环境、代理控制或在线会话时用
- `CDP`：要接管现有 Chrome/Chromium 时用
- `profile`：要复用登录态或隔离工作/个人环境时用

## 核心对象速查
---
lang: python
emoji: 🧩
link: https://github.com/browser-use/browser-use/tree/main/browser_use
desc: 这几类对象基本覆盖了大多数用法。
---

### Agent

- `Agent(task=..., llm=..., browser=..., tools=...)`
- `await agent.run(max_steps=...)`
- `agent.run_sync()`
- `agent.save_history("AgentHistory.json")`
- `await agent.load_and_rerun(history_file=..., variables=...)`

### Browser / BrowserSession

- `Browser(...)` 是常用入口，很多场景下可视为 `BrowserSession(...)` 的对外封装
- 常见来源：本地启动
- 常见来源：`use_cloud=True`
- 常见来源：`cdp_url=...`
- 常见来源：`profile_id=...`
- 常见来源：`Browser.from_system_chrome()`
- 调试时优先保留 `headless=False`

### Tools

```python
from browser_use import Tools

tools = Tools()


@tools.action(description="返回一个固定值")
async def my_action(browser_session):
    return "ok"
```

## BrowserProfile 速查
---
lang: python
emoji: ⚙️
link: https://github.com/browser-use/browser-use/blob/main/browser_use/browser/profile.py
desc: 只保留最影响稳定性和边界的字段。完整字段仍以源码为准。
---

| 配置 | 作用 | 备注 |
|---|---|---|
| `headless` | 无头/有头 | 调试建议 `False` |
| `use_cloud` | 使用 Cloud 浏览器 | 适合远程会话 |
| `cloud_profile_id` | 复用云端 profile | 适合登录态任务 |
| `cloud_proxy_country_code` | 云端代理国家 | 可用于地域/反爬场景 |
| `cloud_timeout` | 云端会话时长 | 单位分钟 |
| `storage_state` | 本地存储态文件 | 适合 CI / headless |
| `cdp_url` | 接管现有浏览器 | 连接本地 Chrome/Chromium |
| `allowed_domains` / `prohibited_domains` | 域名白/黑名单 | 白名单优先 |
| `block_ip_addresses` | 禁止访问 IP URL | 会影响 localhost/私网 |
| `proxy` | 代理设置 | 用 `ProxySettings` |
| `enable_default_extensions` | 自动化扩展 | `BROWSER_USE_DISABLE_EXTENSIONS=1` 可关 |
| `cookie_whitelist_domains` | Cookie 扩展白名单 | 减少弹窗干扰 |
| `cross_origin_iframes` | 跨域 iframe 支持 | 复杂站点常用 |
| `auto_download_pdfs` | 自动下载 PDF | 文档抓取更省事 |

## 真实浏览器 / 认证态
---
lang: python
emoji: 🔐
link: https://docs.browser-use.com/customize/browser/authentication
desc: 新版官方更强调“先用已登录 Chrome 跑通，再决定要不要导出存储态”。这通常比手填账号密码稳定。
---

### 直接接管本机 Chrome

```python
from browser_use import Agent, Browser, ChatBrowserUse


browser = Browser.from_system_chrome()
agent = Agent(
    task="查看我的 GitHub 通知并总结未读消息",
    browser=browser,
    llm=ChatBrowserUse(),
)
```

### 导出存储态，再在 headless/CI 中复用

```python
import asyncio
from browser_use import Browser


async def main():
    browser = Browser.from_system_chrome()
    await browser.start()
    await browser.export_storage_state("auth.json")
    await browser.stop()


asyncio.run(main())
```

```python
from browser_use import Agent, Browser, ChatBrowserUse


browser = Browser(storage_state="auth.json")
agent = Agent(
    task="查看我的通知",
    browser=browser,
    llm=ChatBrowserUse(),
)
```

### 选 Chrome profile

```python
from browser_use import Browser


profiles = Browser.list_chrome_profiles()
for p in profiles:
    print(p["directory"], p["name"])

browser = Browser.from_system_chrome(profile_directory="Profile 5")
```

## Cookbook：常见工作流
---
lang: text
emoji: 🧪
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: 混合风格的重点不是“堆清单”，而是给你可以直接照抄的场景套路。
---

### 登录态站点

先用 profile 保住登录态，再把稳定流程搬回 SDK。

```bash
browser-use --profile "Default" open https://github.com
browser-use state
```

### 现有 Chrome 接管

先连 CDP，再做页面操作，适合你已经手动登录好的浏览器。

```bash
browser-use --cdp-url http://localhost:9222 open https://example.com
browser-use state
browser-use click 4
```

### 多任务隔离

一个 session 对应一个上下文。工作流并行时，不要混用同一个 session。

```bash
browser-use --session work open https://example.com
browser-use --session work state

browser-use --session personal open https://news.ycombinator.com
browser-use --session personal state

browser-use sessions
browser-use close --all
```

### 确定性提取

抓列表、标题、链接时，优先用 `eval` 或 `get html`，少依赖逐步点击。

```bash
browser-use open https://news.ycombinator.com
browser-use eval "Array.from(document.querySelectorAll('.titleline a')).slice(0,5).map(a=>a.textContent)"
```

### 长流程脚本化

滚动、等待、重复动作多时，用 `python` 子命令收口。

```bash
browser-use open https://example.com
browser-use python "for _ in range(5): browser.scroll('down', 800); browser.wait(0.5)"
browser-use screenshot scrolled.png --full
```

### Cloud 快速起手

Cloud 场景下，优先走 `@sandbox(...)`，再通过 `cloud_profile_id` 复用登录态。

```python
import asyncio
from browser_use import Browser, sandbox, ChatBrowserUse
from browser_use.agent.service import Agent


@sandbox(cloud_profile_id="your-profile-id")
async def main(browser: Browser):
    agent = Agent(
        task="打开一个网站并提取信息",
        browser=browser,
        llm=ChatBrowserUse(),
    )
    await agent.run()


asyncio.run(main())
```

## CLI 速查
---
lang: bash
emoji: 🧾
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: 常用子命令按功能分组。你不需要把它们全记住，先记住 `open/state/click/input/wait/screenshot/close`。
---

### 全局入口

```bash
browser-use --headed ...
browser-use --profile "Default" ...
browser-use --connect ...
browser-use --cdp-url http://localhost:9222 ...
browser-use --session work ...
browser-use --json ...
browser-use --mcp
```

### 诊断 / 初始化

```bash
browser-use doctor
browser-use setup
browser-use install
browser-use init --list
browser-use init --template basic --output my_script.py --force
```

### 浏览器控制

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

### 交互

```bash
browser-use click <index>
browser-use type "text"
browser-use input <index> "text"
browser-use keys "Enter"
browser-use select <index> "value"
browser-use upload <index> <path>
browser-use hover <index>
browser-use dblclick <index>
browser-use rightclick <index>
```

### 等待 / 提取

```bash
browser-use wait selector "css" --timeout 30000 --state visible
browser-use wait selector ".loading" --state hidden
browser-use wait text "Success" --timeout 30000
browser-use get title
browser-use get html
browser-use get html --selector "h1"
browser-use get text <index>
browser-use get value <index>
browser-use get attributes <index>
browser-use get bbox <index>
browser-use eval "document.title"
```

### Cookies / Python

```bash
browser-use cookies get [--url <url>]
browser-use cookies set <name> <value> --domain .example.com --secure --http-only --same-site Strict
browser-use cookies clear [--url <url>]
browser-use cookies export cookies.json
browser-use cookies import cookies.json
browser-use python "x = 42"
browser-use python "print(x); print(browser.url); print(browser.title)"
browser-use python --vars
browser-use python --reset
browser-use python --file script.py
```

### Cloud / Tunnel / Profile

```bash
browser-use cloud login <api-key>
browser-use cloud logout
browser-use cloud connect --timeout 120 --proxy-country US
browser-use cloud v2 GET /browsers
browser-use cloud v2 POST /tasks '{"task":"...","url":"https://google.com"}'
browser-use cloud v2 poll <task-id>
browser-use cloud v2 --help
browser-use cloud v3 --help
browser-use tunnel 3000
browser-use tunnel list
browser-use tunnel stop 3000
browser-use tunnel stop --all
browser-use profile
browser-use profile list
browser-use profile sync --all
browser-use profile update
```

## Cloud 记忆点
---
lang: text
emoji: ☁️
link: https://docs.cloud.browser-use.com
desc: Cloud 适合远程浏览器和可复用会话。你只要记住三件事：登录、连接、管理 profile。
---

- 登录：`browser-use cloud login <api-key>`
- 连接：`browser-use cloud connect ...`
- 复用登录态：`browser-use --profile ...`
- 复用登录态：`cloud_profile_id`
- 也可以先同步本机 cookies，再跑云端
- 进阶参数：`cloud_proxy_country_code`
- 进阶参数：`cloud_timeout`
- 版本：官方当前 release / PyPI 都是 `0.12.5`

## 常用 Agent 参数
---
lang: python
emoji: 🧷
link: https://github.com/browser-use/browser-use/blob/main/browser_use/agent/service.py
desc: 这些参数最影响稳定性、失败恢复和成本控制。
---

| 参数 | 作用 | 备注 |
|---|---|---|
| `max_failures` | 允许失败次数 | 默认 5 |
| `step_timeout` | 单步超时（秒） | 默认 180 |
| `use_vision` | 是否启用视觉 | `True/False/auto` |
| `enable_planning` | 是否启用规划 | 某些模型/云场景会关 |
| `max_actions_per_step` | 每步最大动作数 | 太多会跑偏 |
| `sensitive_data` | 敏感字段 | 建议统一放这里 |
| `available_file_paths` | 文件白名单 | 上传必配 |
| `initial_actions` | 预置动作 | 适合强制起手式 |
| `directly_open_url` | 自动从任务中打开 URL | 默认开启 |

## 常见坑
---
lang: text
emoji: 🧯
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: 多数问题不是 agent 不行，而是会话、权限、页面结构变了。
---

- 同一个 `--session` 不要混用不同的 `--profile`、`--cdp-url`、`--connect`
- 找不到元素时，先 `state` 再 `scroll`，再 `state`
- 复杂站点优先 `--headed`
- 跨域 iframe 多时，打开 `cross_origin_iframes=True`
- 不建议默认开 `deterministic_rendering=True`
