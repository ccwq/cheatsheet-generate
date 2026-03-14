---
title: Pinokio
lang: bash
version: "v6.0.10"
date: "2026-01-27"
github: pinokiocomputer/pinokio
colWidth: 400px
---

# Pinokio

## 🧭 入口与定位
---
lang: bash
emoji: 🧭
link: https://pinokio.co/docs/#/
desc: Pinokio 把本机变成“Localhost Cloud”，内置运行时、脚本系统、反向代理、终端和 GUI，用 1-click 方式跑本地 AI / Web / CLI 应用。
---

- `定位`：本地优先的应用启动器与自动化运行平台，不是单纯的包管理器，也不是单一 AI 客户端
- `适合做`：安装并运行开源 Web 应用、封装 CLI 工具、把脚本仓库变成可分享的 launcher、让多个 agent 共享同一项目记忆
- `核心入口`：`Discover` 装别人发布的仓库，`Download from URL` 装任意 Git 仓库，`~/pinokio/api` 手写自己的 app，`~/pinokio/plugin` 挂载 CLI 插件

### 一句话判断

- 想把“README + 安装命令 + 启动命令”包装成可点击的本地应用：用 Pinokio
- 想让本地 AI / CLI 能被浏览器、手机和其他 agent 访问：用 Pinokio
- 只想运行单条 shell 命令，不需要 UI、脚本编排和可分享入口：不必上 Pinokio

## 🗂️ 目录骨架与分工
---
lang: text
emoji: 🗂️
link: https://pinokio.co/docs/#/README?id=pinokio-file-system
desc: 先理解 `api / bin / plugin / logs / drive` 的边界，后面写脚本和排错会顺很多。
---

```text
~/pinokio
├── api/         # 每个应用或脚本仓库的主目录
├── bin/         # 共享安装的全局依赖
├── plugin/      # 可复用 CLI / 桌面插件
├── logs/        # 自动化脚本、CLI agent、shell 交互日志
├── drive/       # 独立持久化数据，适合大模型或长期缓存
└── workspaces/  # 工作区
```

### 什么时候放哪

- `api/<app>`：你的 launcher、本地 app、下载下来的 pinokio 仓库
- `plugin/<name>`：希望在多个项目里复用的 CLI 网关
- `drive/`：不希望随着 app 删除或更新一起消失的数据
- `logs/`：给 agent 回看历史、定位错误、跨会话续跑

## 🚀 最短工作流
---
lang: bash
emoji: 🚀
link: https://pinokio.co/docs/#/README?id=use-cases
desc: Cookbook 的默认入口不是学完全部 API，而是先跑通一个应用，再回头补脚本结构。
---

### 路线 A：直接安装别人发布的仓库

1. 打开 `Discover`
2. 选择已收录的脚本仓库，或点 `Download from URL`
3. 进入 app 页面，先点 `install.js/install.json`
4. 再点 `start.js/start.json`
5. 需要重置或升级时，再跑 `reset` / `update`

### 路线 B：自己在 `api/` 里做一个 launcher

1. 在 `~/pinokio/api/<app>` 建目录
2. 写 `pinokio.js` 定义标题、图标、菜单
3. 写 `install.*` 和 `start.*` 脚本
4. 刷新 Pinokio，让侧边栏自动出现菜单项
5. 验证日志、URL、端口和停止动作

## 📦 Recipe：把任意 Git 仓库装进 Pinokio
---
lang: bash
emoji: 📦
link: https://pinokio.co/docs/#/README?id=install-script-from-any-git-url
desc: 当别人给你的是 Git URL 而不是已收录应用时，用这个 recipe 最快。
---

### 适用场景

- 你已经拿到一个 Pinokio 脚本仓库地址
- 仓库还没进官方目录，但你想先本地试跑
- 你想固定某个分支进行测试

### 最小操作链

- 在 `Discover` 页面点 `Download from URL`
- 输入 Git URL，必要时补分支
- 下载完成后先看仓库里的 `pinokio.js`、`install.*`、`start.*`
- 优先跑安装脚本，再跑启动脚本

### 判断标准

- 有 `pinokio.js`：说明仓库已经准备了 UI 入口
- 只有脚本文件没有 `pinokio.js`：会按默认方式把根目录脚本直接列到菜单
- 安装前先看源码：Pinokio 脚本本质上就是可执行自动化脚本

## 🧱 Recipe：最小 launcher 骨架
---
lang: javascript
emoji: 🧱
link: https://pinokio.co/docs/#/README?id=build-ui-with-pinokiojs
desc: 这是自建应用时最常用的骨架，足够覆盖下载、安装、启动和一键入口。
---

```text
/PINOKIO_HOME/api/downloader
├── icon.png
├── download.json
└── pinokio.js
```

```json
{
  "run": [{
    "method": "shell.run",
    "params": {
      "message": "git clone {{input.url}}"
    }
  }]
}
```

```js
module.exports = {
  title: "Download Anything",
  description: "Download a git repository",
  icon: "icon.png",
  menu: [{
    text: "Start",
    href: "download.json",
    params: {
      url: "https://github.com/cocktailpeanut/dalai"
    }
  }]
}
```

### 迁移到真实项目时要补的东西

- `install.js/install.json`：依赖安装
- `start.js/start.json`：启动服务并暴露 URL
- `reset.js`：清空坏状态
- `update.js`：拉新版本并重装必要依赖

## 🔌 Recipe：把 CLI 工具变成 1-click 插件
---
lang: javascript
emoji: 🔌
link: https://pinokio.co/docs/#/README?id=building-a-plugin
desc: 插件适合把通用 CLI 暴露给多个项目，而不是绑死在单个 app 目录里。
---

```text
~/pinokio/plugin
└── crush
    ├── pinokio.js
    └── crush.png
```

```js
module.exports = {
  title: "Crush",
  icon: "crush.png",
  link: "https://github.com/charmbracelet/crush",
  run: [{
    method: "shell.run",
    params: {
      message: "npx -y @charmland/crush",
      path: "{{args.cwd}}",
      input: true
    }
  }]
}
```

### 什么时候选 plugin 而不是 app

- `plugin`：面向多个项目复用，同一个 CLI 到处都要开
- `app`：你在包装某个具体仓库，脚本和 UI 都跟仓库强绑定

### 常见坑

- `path` 没写时，命令默认在当前 app 上下文执行
- `input: true` 才适合交互式 CLI；纯自动化安装流程不要乱开

## 🔁 Recipe：远程脚本编排与资源回收
---
lang: json
emoji: 🔁
link: https://pinokio.co/docs/#/README?id=install-start-and-stop-remote-scripts
desc: 当你想按步骤拉起远程仓库、请求服务、再及时释放显存/内存时，用 `script.start` / `script.stop`。
---

```json
{
  "run": [{
    "method": "script.start",
    "params": {
      "uri": "https://github.com/cocktailpeanutlabs/moondream2.git/install.js"
    }
  }, {
    "method": "script.start",
    "params": {
      "uri": "https://github.com/cocktailpeanutlabs/moondream2.git/start.js"
    }
  }, {
    "method": "script.stop",
    "params": {
      "uri": "https://github.com/cocktailpeanutlabs/moondream2.git/start.js"
    }
  }]
}
```

### 适用场景

- 需要短暂拉起一个 AI 服务，拿到结果后立刻关闭
- 想把安装、启动、调用、停止串成单个流程
- 机器资源有限，不希望服务一直占着 GPU / RAM

### 关键判断

- `script.start`：必要时先下载仓库，再执行目标脚本
- `script.stop`：显式回收长驻服务，避免下一个任务被吃光资源
- `kernel.script.local(...).url`：适合在后续步骤引用已启动脚本暴露的地址

## 🧠 Recipe：利用日志当 agent 共享记忆
---
lang: text
emoji: 🧠
link: https://pinokio.co/docs/#/README?id=universal-agent-memory
desc: Pinokio 的记忆不是数据库，而是项目里的日志文件；这非常适合多 agent 协作与跨会话续跑。
---

- `/logs/api`：安装脚本、启动脚本等自动化日志
- `/logs/dev`：Codex CLI、Claude Code、Gemini CLI 等 agent 的对话与执行记录
- `/logs/shell`：人工 shell 交互

### 高频用法

1. 让一个 agent 先规划和记录
2. 让另一个 agent 读取同项目日志继续实现或修复
3. 出错时直接让 agent 先回看日志，而不是手动复制报错

### 什么时候最有价值

- 你在多端切换，需要跨会话接力
- 你在对比多个 agent 的实现结果
- 你希望项目搬到另一台机器后还能带走上下文

## 🛠️ 核心脚本心智模型
---
lang: json
emoji: 🛠️
link: https://pinokio.co/docs/#/README?id=api
desc: 真正高频不是记住全部 API，而是先理解 `shell.run + 模板变量 + 脚本编排` 这三件事。
---

### 最常用能力

- `shell.run`：运行命令、切换目录、启用 `venv`、控制是否接受输入
- `script.start / stop / restart`：把脚本串成流程，并管理远程或本地子脚本
- `fs.*`：写文件、读文件、下载文件、复制链接
- `notify / log / web.open`：做反馈、调试和 UI 跳转

### 模板变量

- `{{input.xxx}}`：从菜单或上游脚本传参
- `{{args.cwd}}`：当前工作目录
- `{{port}}`：运行期端口
- `{{kernel.*}}`：读取脚本状态、路径、运行信息

```json
{
  "run": [{
    "method": "shell.run",
    "params": {
      "path": "server",
      "venv": "venv",
      "message": "uv pip install -r requirements.txt"
    }
  }]
}
```

## ⚠️ 安全边界与决策规则
---
lang: bash
emoji: ⚠️
link: https://github.com/pinokiocomputer/pinokio#script-policy
desc: Pinokio 提供隔离和审核机制，但脚本依然有执行任意命令的能力，安全判断不能外包。
---

### 先看什么

- 脚本来源是否公开、是否能读源码
- 是否来自 `Discover` 中已审核脚本
- 是否明显越过 `~/pinokio` 隔离目录
- 依赖安装是否落在 app 自己的 `venv` 或 Pinokio 内置环境里

### 文档强调的安全假设

- 脚本可以运行任意命令，所以安装前先看仓库源码
- 内置包管理器默认把内容装进 `~/pinokio/bin`
- 官方审核脚本会重点检查 `path`、`venv` 和第三方包安装位置

### 实战建议

- 第一次运行陌生仓库，先读 `pinokio.js` 和安装脚本
- 把长期数据放 `drive/`，不要混在可重装目录里
- 面向用户分享时，至少补齐 `install/start/update/reset` 四件套
- 如果只是自己本地实验，优先从最小 launcher 做起，再决定要不要发布
