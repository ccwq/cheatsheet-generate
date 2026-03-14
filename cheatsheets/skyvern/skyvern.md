---
title: Skyvern 速查表
lang: markdown
version: "v1.0.24"
date: 2026-03-13
github: skyvern-ai/skyvern
colWidth: 420px
---

## 🧭 定位与入口
---
lang: markdown
emoji: 🧭
link: https://github.com/Skyvern-AI/skyvern
desc: Skyvern 同时提供云端浏览器自动化、Playwright 风格 SDK、工作流编排和 MCP 接入，不只是一个单点爬虫工具。
---

- 核心定位：用 LLM + 计算机视觉执行浏览器工作流，减少对脆弱 XPath / CSS 选择器的依赖
- 两条主要使用路径：直接跑 `task` / SDK 调用，或把流程沉淀成可复用 `workflow`
- 三个常见入口：Cloud API、Python / TypeScript SDK、MCP Server
- 适用场景：表单填写、登录后抓取、跨页面多步操作、文件下载、结构化提取
- 不适合只靠固定 DOM 规则就能稳定完成的极简脚本，那类场景普通 Playwright 往往更便宜

## 🚀 最小上手路径
---
lang: bash
emoji: 🚀
link: https://docs.skyvern.com/getting-started/quickstart
desc: 先区分你是要“马上跑一次任务”、 “长期复用代码”，还是“交给 AI 编码工具调用”。
---

```bash
# Python SDK
pip install skyvern

# TypeScript SDK
npm install @skyvern/client

# 本地初始化 / 启动
skyvern quickstart
skyvern run server
```

### 入口选择
- 快速验证能力：直接跑 Cloud API / SDK 的 `run_task`
- 需要本地浏览器或内网站点：`skyvern quickstart` 后连本地 `http://localhost:8000`
- 想让 Claude Code / Codex / Cursor 直接操作浏览器：优先走 MCP
- 需要稳定复用和多步编排：改成 workflow，而不是把所有逻辑堆进一个 prompt

## 🤖 SDK 核心动作
---
lang: python
emoji: 🤖
link: https://github.com/Skyvern-AI/skyvern#sdk
desc: Skyvern 的 SDK 设计重点不是替代 Playwright，而是在 Playwright 页面对象上叠加 AI 动作和工作流能力。
---

```python
from skyvern import Skyvern

skyvern = Skyvern(api_key="YOUR_SKYVERN_API_KEY")
browser = await skyvern.launch_cloud_browser()
page = await browser.get_working_page()

await page.goto("https://example.com")
await page.click("#login-button")
await page.click(prompt="点击登录按钮")
await page.agent.run_task("登录后打开账单页面并提取最近 3 条记录")

result = await page.extract(
    prompt="提取订单号和金额",
    schema={"order_id": "string", "amount": "number"},
)
```

### 记住这几组能力
- `page.act(prompt)`：自然语言执行动作
- `page.extract(prompt, schema)`：结构化提取
- `page.validate(prompt)`：判断页面状态，返回布尔值
- `page.prompt(prompt, schema)`：把页面上下文喂给模型做任意推理
- `page.agent.*`：更高阶的任务、登录、下载文件、运行 workflow

### 三种交互方式
- 纯 Playwright：`page.click("#submit")`
- 纯 AI：`page.click(prompt="点击绿色提交按钮")`
- 选择器优先，失败时回退 AI：同时提供 selector 和 prompt

## 🧱 工作流块怎么选
---
lang: yaml
emoji: 🧱
link: https://docs.skyvern.com/multi-step-automations/workflow-blocks-reference
desc: 工作流设计的关键不是“块越多越好”，而是让每个块承担单一职责，便于重跑、调试和复用。
---

```yaml
- block_type: navigation
  label: open_portal
  url: "https://portal.example.com"
  navigation_goal: |
    登录后进入发票页面。
    COMPLETE when invoices page is visible.

- block_type: extraction
  label: extract_invoices
  data_extraction_goal: 提取发票编号、日期、金额
  data_schema:
    type: array
    items:
      type: object
      properties:
        invoice_id: { type: string }
        date: { type: string }
        amount: { type: number }

- block_type: for_loop
  label: loop_invoices
  loop_over: "{{extract_invoices_output}}"
```

### 高频块选择
- `navigation`：从一个页面目标出发，让代理完成一串动作
- `action`：只做单个页面动作，适合补点击、补下载
- `extraction`：只取数据，不改页面状态
- `login`：复用已存凭据处理认证
- `task_v2`：想少写结构、快速描述任务时优先
- `conditional` / `validation`：把成功条件、失败分支写清楚
- `for_loop`：批量处理列表结果
- `http_request` / `code`：补 API 调用或数据变换，不要滥用

### 设计规则
- `label` 要稳定，后续引用输出靠 `{{label_output}}`
- `navigation_goal` 最好同时写清 `COMPLETE` / `TERMINATE` 条件
- 页面操作和数据提取尽量拆开，失败时更容易定位
- 复杂登录、文件处理、邮件发送，优先交给专门 block

## 🔁 浏览器会话复用
---
lang: python
emoji: 🔁
link: https://docs.skyvern.com/sdk-reference/browser-sessions
desc: 需要跨多个任务保留登录态、Cookie 和 Local Storage 时，不要反复开新任务，直接上 browser session。
---

```python
session = await client.create_browser_session(timeout=60)

await client.run_task(
    prompt="登录系统",
    url="https://app.example.com/login",
    browser_session_id=session.browser_session_id,
    wait_for_completion=True,
)

result = await client.run_task(
    prompt="打开账单页并提取最近 10 条账单",
    browser_session_id=session.browser_session_id,
    wait_for_completion=True,
)

await client.close_browser_session(session.browser_session_id)
```

### 什么时候该用 session
- 一次任务要拆成多段执行
- 登录昂贵，反复重登成本高
- 需要复用同一浏览器里的 Cookie、存储和页面状态
- 想把云端浏览器挂给 CLI / MCP / SDK 多端共用

### 注意点
- `close_browser_session` 后状态不会保留
- 长流程要显式设置 `timeout`
- 如果只是一次性任务，不要为了“高级”而强行引入 session

## 🧰 CLI 与 MCP 常用路径
---
lang: bash
emoji: 🧰
link: https://docs.skyvern.com/going-to-production/cli
desc: CLI 更适合人和脚本，MCP 更适合 AI 助手；两者共用同一套底层能力。
---

```bash
# 服务
skyvern run server
skyvern run mcp
skyvern status

# 浏览器会话
skyvern browser session create
skyvern browser session list
skyvern browser session close

# 浏览器动作
skyvern browser navigate --url https://example.com
skyvern browser act --prompt "点击登录按钮"
skyvern browser extract --prompt "提取全部商品名和价格"

# 工作流
skyvern workflow list
skyvern workflow create --file workflow.json
skyvern workflow run --workflow-id wpid_xxx
skyvern workflow status --run-id wr_xxx
```

### MCP 常用配置思路
- 云端优先：直接把 `https://api.skyvern.com/mcp/` 配给 Claude Code / Codex / Cursor
- 本地自托管：用 `python -m skyvern run mcp`，并传 `SKYVERN_BASE_URL` 和 `SKYVERN_API_KEY`
- 已有配置要切换 key / base URL：用 `skyvern mcp switch`

### 典型分工
- Shell / CI：CLI
- AI 编码工具调用浏览器：MCP
- 业务逻辑沉淀：workflow
- 页面细粒度控制：SDK

## ⚠️ 决策与坑位
---
lang: markdown
emoji: ⚠️
link: https://github.com/Skyvern-AI/skyvern/releases/tag/v1.0.24
desc: Skyvern 能力强，但成本和稳定性取决于你是否把任务拆对、条件写清、入口选对。
---

- 别把所有目标塞进一个超长 prompt：多步任务优先拆成 workflow
- 能用 `schema` 就别只要自由文本：结构化输出更利于后处理和校验
- 需要长期维护时，优先写 `validation`、`conditional`、错误码映射，而不是等失败后人工猜原因
- 页面状态要复用时用 browser session；只跑一次时直接 `run_task` 更省
- 本地和云端 API 形态基本一致；开发期可本地调试，稳定后再切云端
- 最新公开版本已到 `v1.0.24`，选型时要关注 release 中对 workflow / MCP / browser session 的变更
