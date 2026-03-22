# Browser Use 参考资料索引（refmap）

## 官方入口

- GitHub 仓库：https://github.com/browser-use/browser-use
- 官网（Homepage）：https://browser-use.com
- 文档（Open Source）：https://docs.browser-use.com/open-source/introduction
- Cloud 文档：https://docs.cloud.browser-use.com

## 仓库内关键文档

- README（快速示例与用法概览）：https://github.com/browser-use/browser-use/blob/main/README.md
- CLI 文档（命令、会话、cloud/tunnel/profile 等）：https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/README.md
- 仓库 AGENTS.md（给 coding agent 的提示文本）：https://github.com/browser-use/browser-use/blob/main/AGENTS.md

## 代码入口（读源码时优先看）

- `Agent` 实现：https://github.com/browser-use/browser-use/blob/main/browser_use/agent/service.py
- `BrowserSession`（浏览器会话层）：https://github.com/browser-use/browser-use/blob/main/browser_use/browser/session.py
- `BrowserProfile`（配置项全集）：https://github.com/browser-use/browser-use/blob/main/browser_use/browser/profile.py
- CLI 入口（daemon 架构、命令解析）：https://github.com/browser-use/browser-use/blob/main/browser_use/skill_cli/main.py

## 示例（recipes）

- 表单填充 + 上传文件（apply_to_job）：https://github.com/browser-use/browser-use/blob/main/examples/use-cases/apply_to_job.py
- 购物/比价/信息检索等 use-cases 目录：https://github.com/browser-use/browser-use/tree/main/examples/use-cases

