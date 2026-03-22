---
title: Browser Use
lang: python
version: "0.12.3"
date: "2026-03-20"
github: browser-use/browser-use
colWidth: 420px
---

# Browser Use

## 🤖 入口与定位
---
lang: python
emoji: 🤖
link: https://docs.browser-use.com/open-source/introduction
desc: Browser Use 是一个让 LLM “像人一样”操作浏览器的 Python 库，提供 Agent + BrowserSession（本地/Cloud/CDP）+ Tools/Skills 的组合，用自然语言任务驱动点击、输入、滚动、提取信息等动作。
---

- 适合：表单填充、带登录态的网页操作、网页测试与回归、信息检索与结构化提取、截图/下载等自动化流程
- 你会用到的 3 个核心对象：`Agent`、`Browser`（其实是 `BrowserSession` 的别名）、`Tools`

## 🧠 最小工作流（Python）
---
lang: python
emoji: 🧠
link: https://github.com/browser-use/browser-use
desc: 典型链路：创建浏览器会话 -> 定义任务 -> 选择 LLM -> 运行 agent -> 持久化历史（可复跑）。
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

## 🧩 核心对象速查
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

- `Browser(...)` 在对外 API 上等价于 `BrowserSession(...)`
- 支持：
  - 本地启动 Chromium
  - 连接现有 Chrome（CDP）
  - 使用 Cloud 浏览器（`use_cloud=True`）

### Tools（动作集合）

```python
from browser_use import Tools

tools = Tools()

# 你也可以注册自定义 action（把业务能力变成工具）
@tools.action(description="我的自定义工具：返回一个固定值")
async def my_action(browser_session):
    return "ok"
```

## 🧪 Recipe：表单填充（含上传文件）
---
lang: python
emoji: 🧪
link: https://github.com/browser-use/browser-use/blob/main/examples/use-cases/apply_to_job.py
desc: 实战建议：把“待填数据”结构化，强调逐字段推进；文件上传用 `available_file_paths` 控制可访问路径。
---

```python
import asyncio
from browser_use import Agent, Browser, ChatOpenAI


async def main():
    llm = ChatOpenAI(model="o3")
    resume_path = r"D:\data\resume.pdf"

    task = """
目标：填写并提交一个工作申请表单。
要求：
- 从上到下填写，不要跳字段后面再补
- 遇到弹窗先关闭
- 简单字段用 input_text / click 等动作
- 需要上传简历时，使用上传动作
"""

    agent = Agent(
        task=task,
        llm=llm,
        browser=Browser(cross_origin_iframes=True),
        available_file_paths=[resume_path],
    )
    history = await agent.run()
    print(history.final_result())


if __name__ == "__main__":
    asyncio.run(main())
```

## 🔐 Recipe：带登录态（复用本机 Chrome Profile）
---
lang: python
emoji: 🔐
link: https://github.com/browser-use/browser-use/tree/main/browser_use/skill_cli
desc: 如果站点需要登录（Gmail/GitHub/内部系统），最稳的方式通常是“连接真实 Chrome + 现有 Profile”；CLI 更方便快速验证。
---

```bash
# 使用真实 Chrome 的 Default Profile（通常已有 cookies / 登录态）
browser-use --profile "Default" open https://github.com
browser-use state
```

如果你需要在 Python 中以“真实 Profile”运行，重点参数在 `BrowserSession/BrowserProfile`（如 `executable_path`、`user_data_dir`、`profile_directory`）。

## ☁️ Recipe：用 Cloud 浏览器跑“更像真人”的环境
---
lang: bash
emoji: ☁️
link: https://docs.cloud.browser-use.com
desc: Cloud 模式会帮你拉起云端浏览器并通过 CDP 连接；适合规模化、反爬更强或需要“干净环境”的场景。
---

```bash
# 1) 登录（或设置环境变量 BROWSER_USE_API_KEY）
browser-use cloud login <api-key>

# 2) 连接云端浏览器（会输出 live_url / cdp_url）
browser-use cloud connect

# 3) 像本地一样操作
browser-use open https://example.com
browser-use state

# 4) close 会同时断开并停止云端浏览器
browser-use close
```

## 🔌 Recipe：连接现有 Chrome（CDP）
---
lang: bash
emoji: 🔌
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: 本地已有 Chrome（带扩展/登录态）时，用 CDP 接管通常更贴近日常环境；CLI 提供 `--connect` 自动发现。
---

```bash
# 自动发现本机 Chrome 的 CDP 端点并连接
browser-use --connect open https://example.com

# 或明确指定 CDP URL（http:// 或 ws://）
browser-use --cdp-url http://localhost:9222 open https://example.com
```

## 🛡️ 安全与范围控制（domains / IP / proxy）
---
lang: python
emoji: 🛡️
link: https://github.com/browser-use/browser-use/tree/main/browser_use/browser
desc: 真实环境里要把“能访问哪些域名、是否允许 IP URL、是否走代理”等约束收紧，避免越权与误操作。
---

```python
from browser_use import Browser

browser = Browser(
    allowed_domains=["https://github.com", "*.githubusercontent.com"],
    prohibited_domains=["*.doubleclick.net"],
    block_ip_addresses=True,  # 阻止直接访问 IP（包含 localhost/私网，慎用）
)
```

代理（结构化参数）：

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
| `directly_open_url` | 自动从 task 里提取 URL 并先打开 | 默认开启 |

## 🧰 browser-use CLI 速查（持久化会话）
---
lang: bash
emoji: 🧰
link: https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
desc: CLI 由后台 daemon 维持浏览器，交互延迟很低。基本套路：open -> state -> click/input -> wait -> screenshot。
---

```bash
# 诊断 / 初始化（只保留最小入口，完整安装细节看 refmap）
browser-use doctor
browser-use setup

# 开页 + 获取可点击元素索引
browser-use open https://example.com
browser-use state

# 交互（用 state 返回的 index）
browser-use click 5
browser-use input 3 "hello"
browser-use keys "Enter"
browser-use scroll down --amount 800
browser-use wait selector ".toast-success" --timeout 30000
browser-use screenshot out.png --full

# 会话管理
browser-use sessions
browser-use --session work open https://example.com
browser-use --session work close
browser-use close --all
```

### CLI 全局模式选择（互斥）

- `--profile`：用真实 Chrome Profile（推荐做带登录态的任务）
- `--connect`：自动发现并连接已有 Chrome（CDP）
- `--cdp-url`：指定 CDP URL 连接

## 🧯 常见坑与排障
---
lang: bash
emoji: 🧯
link: https://github.com/browser-use/browser-use/tree/main/browser_use/skill_cli
desc: 这类项目最常见的问题不是“代码写错”，而是“环境/会话/网站行为变化”。先用 CLI 快速复现再回到 Python 里固化。
---

- daemon 配置不一致：同一个 `--session` 里不要混用不同的 `--profile/--cdp-url/--connect`，必要时先 `browser-use close`
- 元素找不到：先 `state` 再决定 `scroll`，再 `state`
- 跨域 iframe：需要时在 Python 里启用 `cross_origin_iframes=True`
- `deterministic_rendering=True` 不推荐：容易破站、也更容易被反爬识别

