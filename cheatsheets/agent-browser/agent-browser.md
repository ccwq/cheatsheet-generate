# Agent Browser 速查表

## 快速开始

```bash
agent-browser open <url>        # 打开页面
agent-browser snapshot -i       # 获取交互元素（带 refs）
agent-browser click @e1         # 通过 ref 点击元素
agent-browser fill @e2 "text"   # 填写输入框
agent-browser close             # 关闭浏览器
```

## 核心工作流

1. 导航: `agent-browser open <url>`
2. 快照: `agent-browser snapshot -i` (返回带 @ref 的元素)
3. 使用快照中的 refs 交互
4. 导航或 DOM 变化后重新快照

## 导航命令

```bash
agent-browser open <url>      # 导航到 URL (别名: goto, navigate)
                              # 支持: https://, http://, file://, about:, data://
                              # 未指定协议时自动添加 https://
agent-browser back            # 后退
agent-browser forward         # 前进
agent-browser reload          # 刷新页面
agent-browser close           # 关闭浏览器 (别名: quit, exit)
agent-browser connect 9222    # 通过 CDP 端口连接浏览器
```

## 快照分析

```bash
agent-browser snapshot            # 完整可访问树
agent-browser snapshot -i         # 仅交互元素（推荐）
agent-browser snapshot -c         # 紧凑输出
agent-browser snapshot -d 3       # 限制深度到 3
agent-browser snapshot -s "#main" # 限定到 CSS 选择器范围
```

## 交互操作（使用快照中的 @refs）

```bash
# 点击
agent-browser click @e1           # 单击
agent-browser dblclick @e1        # 双击
agent-browser focus @e1           # 聚焦元素
agent-browser hover @e1           # 悬停

# 填写
agent-browser fill @e2 "text"     # 清空后输入
agent-browser type @e2 "text"     # 输入不先清空
agent-browser press Enter         # 按键 (别名: key)
agent-browser press Control+a     # 组合键
agent-browser keydown Shift       # 按下按键
agent-browser keyup Shift         # 释放按键

# 表单
agent-browser check @e1           # 选中复选框
agent-browser uncheck @e1         # 取消选中
agent-browser select @e1 "value"  # 下拉选项选择
agent-browser select @e1 "a" "b"  # 多选
agent-browser upload @e1 file.pdf # 上传文件

# 滚动
agent-browser scroll down 500     # 滚动页面 (默认: down 300px)
agent-browser scrollintoview @e1  # 滚动元素到视图 (别名: scrollinto)
agent-browser drag @e1 @e2        # 拖拽
```

## 获取信息

```bash
agent-browser get text @e1        # 元素文本
agent-browser get html @e1        # 元素 HTML
agent-browser get value @e1       # 输入值
agent-browser get attr @e1 href   # 属性值
agent-browser get title           # 页面标题
agent-browser get url             # 当前 URL
agent-browser get count ".item"   # 匹配元素数量
agent-browser get box @e1         # 边界框
agent-browser get styles @e1      # 计算样式（字体、颜色、背景等）
```

## 检查状态

```bash
agent-browser is visible @e1      # 是否可见
agent-browser is enabled @e1      # 是否可用
agent-browser is checked @e1      # 是否已选中
```

## 截图与 PDF

```bash
agent-browser screenshot          # 截图到 stdout
agent-browser screenshot path.png # 保存到文件
agent-browser screenshot --full   # 全页截图
agent-browser pdf output.pdf      # 保存为 PDF
```

## 视频录制

```bash
agent-browser record start ./demo.webm    # 开始录制（使用当前 URL + 状态）
agent-browser click @e1                   # 执行操作
agent-browser record stop                 # 停止并保存视频
agent-browser record restart ./take2.webm # 停止当前 + 开始新录制
```

录制会创建新上下文但保留会话的 cookies/storage。若未提供 URL，自动回到当前页面。为录制流畅演示，先探索后录制。

## 等待

```bash
agent-browser wait @e1                     # 等待元素
agent-browser wait 2000                    # 等待毫秒数
agent-browser wait --text "Success"        # 等待文本 (or -t)
agent-browser wait --url "**/dashboard"    # 等待 URL 模式 (or -u)
agent-browser wait --load networkidle      # 等待网络空闲 (or -l)
agent-browser wait --fn "window.ready"     # 等待 JS 条件 (or -f)
```

## 鼠标控制

```bash
agent-browser mouse move 100 200      # 移动鼠标
agent-browser mouse down left         # 按下按钮
agent-browser mouse up left           # 释放按钮
agent-browser mouse wheel 100         # 滚轮
```

## 语义定位器（除 refs 外的替代方案）

```bash
agent-browser find role button click --name "Submit"
agent-browser find text "Sign In" click
agent-browser find text "Sign In" click --exact      # 仅精确匹配
agent-browser find label "Email" fill "user@test.com"
agent-browser find placeholder "Search" type "query"
agent-browser find alt "Logo" click
agent-browser find title "Close" click
agent-browser find testid "submit-btn" click
agent-browser find first ".item" click
agent-browser find last ".item" click
agent-browser find nth 2 "a" hover
```

## 浏览器设置

```bash
agent-browser set viewport 1920 1080          # 设置视口大小
agent-browser set device "iPhone 14"          # 模拟设备
agent-browser set user-agent "custom"         # 自定义 User-Agent
agent-browser set geolocation 37.7 -122.4     # 设置地理位置
agent-browser set timezone "America/LA"       # 设置时区
agent-browser set locale "ja-JP"              # 设置语言环境
agent-browser set permissions geolocation     # 权限设置
agent-browser set extra-http-headers          # 额外 HTTP 头
```

## 网络模拟与拦截

```bash
# 离线模式
agent-browser network offline
agent-browser network online

# 速度模拟
agent-browser network slow "offline"
agent-browser network slow "good3g"
agent-browser network slow "wifi"
agent-browser network fast

# 请求拦截
agent-browser network route "**/api/*" --status 200 --body '{"mock":true}'
agent-browser network route "**/api/*" --file mock.json
agent-browser network route "**/api/*" --abort
agent-browser network unroute "**/api/*"
agent-browser network requests
agent-browser network requests --filter api
```

## 标签页与窗口

```bash
agent-browser tab                 # 列出标签
agent-browser tab new [url]       # 新标签
agent-browser tab 2               # 按索引切换
agent-browser tab close           # 关闭当前
agent-browser tab close 2         # 按索引关闭
agent-browser window new          # 新窗口
```

## 框架

```bash
agent-browser frame "#iframe"     # 切换到 iframe
agent-browser frame main          # 回到主框架
```

## 对话框

```bash
agent-browser dialog accept [text]  # 接受对话框
agent-browser dialog dismiss        # 拒绝对话框
```

## JavaScript

```bash
agent-browser eval "document.title"   # 执行 JS
```

## 全局选项

```bash
agent-browser --session <name> ...    # 隔离浏览器会话
agent-browser --json ...              # JSON 输出
agent-browser --headed ...            # 显示浏览器窗口（非无头模式）
agent-browser --full ...              # 全页截图 (-f)
agent-browser --cdp <port> ...        # 通过 CDP 端口连接
agent-browser -p <provider> ...       # 云浏览器提供商 (--provider)
agent-browser --proxy <url> ...       # 使用代理服务器
agent-browser --headers <json> ...    # 针对 URL 源的 HTTP 头
agent-browser --executable-path <p>   # 自定义浏览器路径
agent-browser --extension <path> ...  # 加载扩展（可重复）
agent-browser --help                  # 显示帮助 (-h)
agent-browser --version               # 显示版本 (-V)
agent-browser <command> --help        # 命令详细帮助
```

## 代理支持

```bash
agent-browser --proxy http://proxy.com:8080 open example.com
agent-browser --proxy http://user:pass@proxy.com:8080 open example.com
agent-browser --proxy socks5://proxy.com:1080 open example.com
```

## 环境变量

```bash
AGENT_BROWSER_SESSION="mysession"            # 默认会话名
AGENT_BROWSER_EXECUTABLE_PATH="/path/chrome" # 自定义浏览器路径
AGENT_BROWSER_EXTENSIONS="/ext1,/ext2"       # 扩展路径，逗号分隔
AGENT_BROWSER_PROVIDER="browserbase"         # 云浏览器提供商
AGENT_BROWSER_STREAM_PORT="9223"             # WebSocket 流端口
AGENT_BROWSER_HOME="/path/to/agent-browser"  # 自定义安装位置（daemon.js）
```

## 示例：表单提交

```bash
agent-browser open https://example.com/form
agent-browser snapshot -i
# 输出显示: textbox "Email" [ref=e1], textbox "Password" [ref=e2], button "Submit" [ref=e3]

agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3
agent-browser wait --load networkidle
agent-browser snapshot -i  # 检查结果
```

## 示例：认证状态保存

```bash
# 一次登录
agent-browser open https://app.example.com/login
agent-browser snapshot -i
agent-browser fill @e1 "username"
agent-browser fill @e2 "password"
agent-browser click @e3
agent-browser wait --url "**/dashboard"
agent-browser state save auth.json

# 后续会话：加载保存的状态
agent-browser state load auth.json
agent-browser open https://app.example.com/dashboard
```

## 会话（并行浏览器）

```bash
agent-browser --session test1 open site-a.com
agent-browser --session test2 open site-b.com
agent-browser session list
```

## JSON 输出（供解析）

```bash
agent-browser snapshot -i --json
agent-browser get text @e1 --json
```

## 调试

```bash
agent-browser --headed open example.com   # 显示浏览器窗口
agent-browser --cdp 9222 snapshot         # 通过 CDP 端口连接
agent-browser connect 9222                # 替代方案: connect 命令
agent-browser console                     # 查看控制台消息
agent-browser console --clear             # 清空控制台
agent-browser errors                      # 查看页面错误
agent-browser errors --clear              # 清空错误
agent-browser highlight @e1               # 高亮元素
agent-browser trace start                 # 开始录制 trace
agent-browser trace stop trace.zip        # 停止并保存 trace
agent-browser record start ./debug.webm   # 从当前页录制视频
agent-browser record stop                 # 保存录制
```
