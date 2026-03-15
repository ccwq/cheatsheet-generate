---
title: bb-browser 速查表
lang: bash
version: "0.5.2"
date: 2026-03-15
github: epiral/bb-browser
colWidth: 420px
---

## 定位与入口
---
lang: markdown
link: https://github.com/epiral/bb-browser
desc: bb-browser 把“你真实浏览器里的登录态”暴露给 CLI 和 MCP，让 Agent 直接复用人类浏览器，而不是重做一套 API/爬虫链路。
---

- 核心定位：浏览器自动化 + 带登录态的数据访问 + 面向 AI Agent 的 CLI/MCP 接口
- 适用场景：跨站检索、内容抓取、已登录站点数据读取、网页交互自动化、让 Agent 自主反向适配新网站
- 两条主线：`site` 走结构化站点适配器，`open/snapshot/click/fetch/...` 走通用浏览器控制
- 运行形态：CLI -> daemon -> Chrome Extension -> 真实 Chrome；也支持 `--mcp` 接入 Claude Code / Cursor
- 版本说明：最新 GitHub Release 是 `v0.5.2`（2026-03-15），主分支 `package.json` 当前已到 `0.6.0`

## 最小工作流
---
lang: bash
link: https://github.com/epiral/bb-browser#quick-start
desc: 先区分你要的是“站点数据接口”还是“浏览器动作控制”，再决定从 `site` 还是通用命令起步。
---

```bash
# 安装
npm install -g bb-browser

# 拉取社区 adapter
bb-browser site update

# 看哪些站点最值得先用
bb-browser site recommend

# 直接跑一个站点能力
bb-browser site zhihu/hot

# 进入浏览器控制路径
bb-browser open https://example.com
bb-browser snapshot -i
```

### 选择建议
- 已有 adapter、目标是拿结构化数据：优先 `site`
- 目标是点页面、填表单、抓当前 DOM：优先通用浏览器命令
- 在 OpenClaw 里使用：优先追加 `--openclaw`
- 在 AI 工具里做标准化接入：优先 `--mcp`

## site 命令工作流
---
lang: bash
link: https://github.com/epiral/bb-browser#36-platforms-103-commands
desc: `site` 是 bb-browser 的最高频入口，把各站点能力包装成统一 CLI，输出通常可直接接 `--json` 和 `--jq`。
---

```bash
# 查看全部 adapter
bb-browser site list

# 看某个 adapter 的参数、示例、域名
bb-browser site info xueqiu/stock

# 典型检索
bb-browser site twitter/search "AI agent"
bb-browser site stackoverflow/search "async"
bb-browser site arxiv/search "transformer"

# 结构化输出 + 过滤
bb-browser site xueqiu/hot-stock 5 --json
bb-browser site xueqiu/hot-stock 5 --jq '.items[] | {name, changePercent}'

# 适配 OpenClaw
bb-browser site reddit/hot --openclaw
```

### 高价值习惯
- 先 `site info <name>`，再决定参数和返回结构
- 默认把 `--json` 当成自动化脚本入口
- 只需要结果子集时，直接用 `--jq` 收敛输出
- 遇到“明明登录了却拿不到数据”，优先检查当前浏览器是否真的有该站点登录态

## 浏览器交互工作流
---
lang: bash
link: https://github.com/epiral/bb-browser#also-a-full-browser-automation-tool
desc: 通用命令适合没有现成 adapter 的页面任务，尤其是 snapshot -> ref -> interaction 这一套交互链。
---

```bash
# 打开页面并读取可交互节点
bb-browser open https://example.com
bb-browser snapshot -i

# 用 ref 做交互
bb-browser click @3
bb-browser fill @5 "hello"
bb-browser type @5 " world"
bb-browser press Enter

# 读取页面信息
bb-browser get title
bb-browser get url
bb-browser screenshot

# 在页面上下文执行 JS / 带登录态 fetch
bb-browser eval "document.title"
bb-browser fetch https://www.reddit.com/api/me.json --json
```

### 常用组合
- 探索页面：`open` -> `snapshot -i` -> `click/fill/type`
- 拿页面上下文数据：`open` -> `eval` 或 `get`
- 站点接口试探：`open` -> `fetch <url> --json`
- 多标签页并发：给命令追加 `--tab <id>`

## 逆向与适配器开发
---
lang: bash
link: https://github.com/epiral/bb-browser#10-minutes-to-add-any-website
desc: bb-browser 的核心扩展能力是把新网站快速变成 adapter；关键动作是抓包、验证认证方式、再写单文件适配器。
---

```bash
# 清理并重新抓接口
bb-browser network clear --tab 1
bb-browser refresh --tab 1
bb-browser network requests --filter "api" --with-body --json --tab 1

# 测 direct fetch 是否成立
bb-browser eval "fetch('/api/endpoint',{credentials:'include'}).then(r=>r.json())" --tab 1

# 查看完整开发说明
bb-browser guide
```

### Tier 判断
- Tier 1：只靠 Cookie，通常最简单，适合 Reddit / GitHub 这类站点
- Tier 2：还要 Bearer 或 CSRF token，需要把页面已有认证头补齐
- Tier 3：需要页面内部模块、Webpack 注入或状态容器调用，复杂度最高

## MCP 与服务形态
---
lang: json
link: https://github.com/epiral/bb-browser#mcp-claude-code--cursor
desc: 想让 AI 工具把 bb-browser 当成 MCP server 使用时，最小配置就是 `npx -y bb-browser --mcp`。
---

```json
{
  "mcpServers": {
    "bb-browser": {
      "command": "npx",
      "args": ["-y", "bb-browser", "--mcp"]
    }
  }
}
```

```bash
# 前台启动 daemon
bb-browser daemon

# 只监听 IPv4
bb-browser daemon --host 127.0.0.1

# 允许远程网络访问
bb-browser daemon --host 0.0.0.0

# 检查与停止
bb-browser status
bb-browser stop
```

### 什么时候用哪种形态
- 给 Claude Code / Cursor：`--mcp`
- 本机手工调试：CLI + daemon
- OpenClaw：`site ... --openclaw`
- 远程机器经 Tailscale / ZeroTier 访问：daemon 绑定 `0.0.0.0`

## 高价值选项
---
lang: bash
link: https://github.com/epiral/bb-browser#also-a-full-browser-automation-tool
desc: 大多数自动化脚本真正常用的是少量全局开关，而不是把所有命令背下来。
---

```bash
--json             # 输出 JSON，便于脚本消费
--jq '<expr>'      # 就地过滤 JSON
--tab <id>         # 指定标签页
--openclaw         # 走 OpenClaw 内置浏览器
--mcp              # 启动 MCP server
-i / --interactive # snapshot 只保留可交互节点
-c / --compact     # snapshot 压缩空结构
-d / --depth <n>   # snapshot 限制深度
-s / --selector    # snapshot 只看局部 DOM
```

## 常见坑位
---
lang: markdown
link: https://github.com/epiral/bb-browser#chrome-extension-standalone-mode
desc: 真正容易出错的地方通常不是命令本身，而是“运行形态”和“认证上下文”不匹配。
---

- `site` 失败先别怀疑命令，先确认该站点在你的真实浏览器里已经登录
- 不走 OpenClaw 时，独立模式通常需要先装 Chrome Extension
- 抓接口时别忘了 `--with-body`，否则关键请求细节不完整
- 自动化脚本里尽量默认使用 `--json`，避免依赖人类可读输出格式
- 发布版和主分支版本可能不同；做环境记录时优先记你实际安装或 release 使用的版本
