---
title: Context Hub Cookbook
lang: bash
version: 0.1.2
date: 2026-03-13
github: andrewyng/context-hub
colWidth: 520px
---

# Context Hub Cookbook

## 入口与定位
---
lang: bash
link: https://github.com/andrewyng/context-hub
desc: Context Hub 不是“给人直接读的文档站”，而是给编码代理用的文档检索与增量抓取工具。核心价值是用版本化内容替代网页盲搜，并把注释和反馈纳入持续改进回路。
---

- `chub search`：先找可用条目，避免凭印象猜 ID
- `chub get`：按 `id / 语言 / 版本 / 文件` 精准取文档
- `chub annotate`：把本地踩坑结论写回未来会话
- `chub feedback`：把内容质量反馈给维护者
- `chub build`：把你自己的 docs / skills 构建成可检索 registry
- `~/.chub/config.yaml`：定义 registry 来源、信任策略、缓存刷新和反馈开关

```bash
# 最小起手式
npm install -g @aisuite/chub
chub search openai
chub get openai/chat --lang py
```

## 仓库骨架
---
lang: text
desc: 这个仓库把“CLI、文档规范、内容仓库、代理技能”拆开，重点不是命令数量，而是让代理稳定拿到可追溯的上下文。
---

```text
context-hub/
├─ cli/                 chub CLI、本地缓存、搜索、build、feedback 等实现
├─ content/             按 author/docs|skills 组织的 registry 内容
├─ docs/                CLI reference、content guide、BYOD、annotations 等说明
├─ cli/skills/          附带的 agent skill，例如 get-api-docs
└─ README.md            项目定位、快速开始、能力边界
```

- `cli/` 解决“怎么搜、怎么取、怎么缓存、怎么构建”
- `content/` 解决“给代理看的文档长什么样”
- `docs/content-guide.md` 解决“你自己如何产出兼容内容”
- `cli/skills/get-api-docs/SKILL.md` 解决“怎样把 chub 固化成代理行为”

## 起手工作流
---
lang: bash
link: https://github.com/andrewyng/context-hub/blob/main/docs/cli-reference.md
desc: 绝大多数任务都应遵循 search -> get -> use 这条主线。只有遇到缺口时，才进入 annotate / feedback / build 等扩展分支。
---

```bash
# 1. 搜索条目
chub search "stripe payments"

# 2. 按语言获取
chub get stripe/api --lang js

# 3. 有附加文件时只抓需要的部分
chub get stripe/api --file references/errors.md

# 4. 确认要完整上下文时再抓全量
chub get stripe/api --full
```

- 不确定 ID 时，先 `search`，不要直接猜 `author/name`
- 条目只有一种语言时，`get` 会自动推断，不必强行写 `--lang`
- 文档很大时先抓主入口，再按 `--file` 追加，避免浪费上下文窗口

## 高频 Recipes
---
lang: bash
desc: 下面这些 recipe 覆盖 Context Hub 最常见的真实使用场景，比记全命令选项更重要。
---

### Recipe 1：给代理补当前 API 文档
- 何时用：要写第三方 SDK / API 代码，且不能接受训练数据过期
- 最小命令链：`search -> get`

```bash
chub search "openai responses"
chub get openai/chat --lang py
```

- 前置条件：本机已安装 `@aisuite/chub`
- 常见坑：别跳过 `search`，因为同厂商可能有多个 entry，直接猜容易取错

### Recipe 2：只抓需要的参考文件
- 何时用：主文档足够大，但你只缺错误码、进阶参数或某一段示例
- 最小命令链：`get -> 观察 additional files -> --file`

```bash
# 先看主文档尾部列出的 additional files
chub get acme/widgets

# 再按需补抓
chub get acme/widgets --file references/advanced.md
chub get acme/widgets --file advanced.md,errors.md
```

- 前置条件：目标条目确实带参考文件
- 常见坑：`--file` 可以写相对路径名，但最稳妥的做法是直接复制 CLI 输出里的完整路径

### Recipe 3：把本地踩坑写进未来会话
- 何时用：你在真实任务里发现了文档没写清的版本差异、环境坑或项目约束
- 最小命令链：`annotate`

```bash
chub annotate stripe/api "Webhook 验签必须保留 raw body，不能先 parse JSON"
chub annotate stripe/api
chub annotate --list
```

- 前置条件：这是“文档之外的新知识”，而不是正文已经写明的事实
- 常见坑：一条 entry 只有一条 annotation；新 note 会覆盖旧 note

### Recipe 4：把文档质量反馈回作者
- 何时用：文档确实好用，或已经确认它过时 / 不完整 / 示例错误
- 最小命令链：`feedback`

```bash
chub feedback stripe/api up "示例清晰，结构合理"
chub feedback openai/chat down --label outdated --label wrong-examples
chub feedback stripe/api up --agent "claude-code" --model "claude-sonnet-4"
```

- 前置条件：最好先征求用户是否允许发送反馈
- 常见坑：`feedback` 和本地 annotation 不同，它会发给维护者；若不想上报，可关闭 `feedback`

### Recipe 5：把团队私有文档接入同一套检索流
- 何时用：你有内部 API、私有 SDK 或团队工作流，不希望每次手贴进对话
- 最小命令链：`写内容 -> build -> 配置 source -> get`

```text
my-content/
└─ mycompany/
   ├─ docs/
   │  └─ internal-api/
   │     ├─ DOC.md
   │     └─ references/
   │        └─ auth.md
   └─ skills/
      └─ deploy-staging/
         └─ SKILL.md
```

```bash
chub build my-content/ -o .chub-local/
chub get mycompany/internal-api
chub get mycompany/deploy-staging
```

- 前置条件：内容目录符合 `author/docs|skills/...` 结构
- 常见坑：如果私有条目和公共条目 ID 冲突，需要加 `source:` 前缀

## 配置与多源协作
---
lang: yaml
link: https://github.com/andrewyng/context-hub/blob/main/docs/byod-guide.md
desc: 真正把 Context Hub 用起来，关键在于把“公共源 + 私有源 + 信任策略”放进同一份配置，而不是只把它当一个临时搜索 CLI。
---

```yaml
sources:
  - name: community
    url: https://cdn.aichub.org/v1
  - name: internal
    path: /path/to/.chub-local

source: "official,maintainer,community"
refresh_interval: 86400
telemetry: true
feedback: true
```

- `sources`：可同时挂公共 CDN 和本地构建产物
- `source`：控制信任级别过滤
- `refresh_interval`：控制 registry 缓存 TTL
- `feedback: false`：关闭 `chub feedback`
- `CHUB_TELEMETRY=0` / `CHUB_FEEDBACK=0`：可用环境变量临时关闭

```bash
# 多源同名冲突时，显式指定来源
chub get internal:openai/chat
chub get community:openai/chat
```

## 内容模型与构建规则
---
lang: yaml
link: https://github.com/andrewyng/context-hub/blob/main/docs/content-guide.md
desc: 如果你不只是“使用者”，还要维护文档仓库，就必须掌握 DOC.md / SKILL.md frontmatter、语言分层、版本分层和 reference files 的组织规则。
---

```yaml
---
name: widgets
description: "Acme widget API for creating and managing widgets"
metadata:
  languages: "javascript"
  versions: "2.0.0"
  revision: 1
  updated-on: "2026-01-01"
  source: maintainer
  tags: "acme,widgets,api"
---
```

- 单语言文档：`author/docs/entry/DOC.md`
- 多语言文档：`author/docs/entry/javascript/DOC.md`、`python/DOC.md`
- 多版本文档：`author/docs/entry/v1/DOC.md`、`v2/DOC.md`
- 额外参考文件：`references/*.md`
- 技能文件：`author/skills/entry/SKILL.md`

```bash
# 只校验，不产出
chub build my-content/ --validate-only
```

- `versions` 指的是包 / SDK 版本，不是文内单独的 API 日期版本
- 同版本只改内容时，应增加 `revision` 并更新 `updated-on`

## Skills / 注释 / 反馈的协作闭环
---
lang: text
link: https://github.com/andrewyng/context-hub/blob/main/cli/skills/get-api-docs/SKILL.md
desc: Context Hub 真正强的地方，不只是 CLI 命令，而是把它固化为代理习惯，让“先查、再写、再沉淀”成为稳定流程。
---

- `cli/skills/get-api-docs/SKILL.md`：指导代理在调用第三方 API 前先执行 `chub search/get`
- `annotate`：把本地任务经验沉淀到下次 `get`
- `feedback`：把内容问题交还给维护者改进公共文档
- 组合后的闭环是：当前任务更准，下一次任务更快，公共 registry 也逐步变好

```text
search -> get -> 完成任务 -> annotate 本地经验 -> feedback 给维护者
```

## 成本与风险控制
---
lang: bash
desc: Context Hub 的目标不是“抓得越多越好”，而是用最少上下文拿到最可靠内容。真正的风险往往来自抓取策略不当，而不是命令本身。
---

- 优先 `search` 再 `get`，降低取错条目的概率
- 优先主文档 + `--file` 增量抓取，最后才 `--full`
- annotation 只写“新增发现”，不要复制正文
- feedback 涉及外发时，最好先确认用户是否允许
- 私有源与公共源混用时，提前想好命名和冲突策略

```bash
# 离线或预热场景可先下载完整 bundle
chub update --full

# 查看 / 清空本地缓存
chub cache status
chub cache clear
```
