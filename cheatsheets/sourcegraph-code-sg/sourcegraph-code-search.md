---
title: Sourcegraph Code Search Cookbook
lang: bash
version: 6.10
date: 2026-03-18
github: sourcegraph/sourcegraph
colWidth: 540px
---

# Sourcegraph Code Search Cookbook

## 入口与定位
---
lang: bash
link: https://sourcegraph.com/docs/code-search/queries
desc: 可以把 Sourcegraph 搜索理解成“带过滤器、结果类型和代码结构意识的全局代码检索台”。实战里通常不是一上来写复杂正则，而是先缩小仓库范围，再选搜索模式，最后提取你真正要看的结果。
---

- **先记住三件事**：`repo:` 管范围，`patternType:` 管匹配方式，`select:` / `type:` 管返回结果形态。
- **最常见的起手式**：先用 `repo:`、`file:`、`language:` 把噪音压下去，再决定是关键词、正则还是结构化搜索。
- **搜索模式选择**：
  - `patternType:keyword`：默认模式，适合高频文本检索。
  - `patternType:regexp`：需要 RE2 正则时用。
  - `patternType:structural`：想按代码结构找调用、参数、包裹关系时用。
- **结果类型选择**：
  - `type:content`：看正文命中。
  - `type:path` / `type:repo`：只看文件或仓库。
  - `type:symbol`：找定义、方法、类、接口。
  - `type:commit` / `type:diff`：查历史和改动。

```bash
# 最小可用搜索：先限定仓库，再搜关键词
repo:sourcegraph/sourcegraph zoekt

# 先限定语言和路径，再搜函数名
repo:sourcegraph/sourcegraph language:go file:^cmd/ fmt.Errorf

# 明确告诉 Sourcegraph 你要用正则
repo:sourcegraph/sourcegraph patternType:regexp /New.*Client/
```

## 起手工作流
---
lang: bash
desc: 当你只知道一个模糊线索时，按“先收范围、再提精度、最后抽结果”的顺序走，搜索会稳定很多。
---

- `先收范围：repo:myorg/monorepo file:^packages/ language:typescript`
  先把仓库、目录和语言卡住，避免后面所有技巧都淹没在噪音里。
- `再定模式：patternType:keyword | regexp | structural`
  关键词适合粗找，正则适合文本模式，结构化适合代码形态。
- `最后抽结果：select:repo | select:file | type:symbol`
  当你不是要看正文，而是要看“哪些仓库/文件/符号受影响”时，用结果提取会更快。

```bash
# 场景：只知道某个配置键名，先全局粗找
repo:myorg/ language:yaml timeout:20s payment_provider

# 场景：已经知道可能在后端，继续收窄
repo:myorg/backend language:go file:^internal/ payment_provider

# 场景：最后只想知道涉及哪些文件
repo:myorg/backend language:go file:^internal/ payment_provider select:file
```

## 范围控制技巧
---
lang: bash
desc: 搜索质量通常首先取决于范围控制，而不是正则写得多花。先把仓库、分支、路径、语言收准，后面的匹配才有意义。
---

- `仓库过滤：repo:sourcegraph/sourcegraph`
  支持正则，也支持多个 `repo:` 叠加。
- `排除仓库：-repo:^github.com/myorg/legacy`
  老仓库、镜像仓库、样例仓库要尽早排除。
- `路径过滤：file:^src/ | -file:(^dist/|^vendor/)`
  `file:` 匹配路径，不是文件内容。
- `语言过滤：language:go | language:typescript`
  多语言 monorepo 里非常有用。
- `修订范围：repo:foo@main | repo:foo@*refs/tags/*`
  想看某个分支、标签或 refs 集合时直接写在 `repo:` 后面。
- `上下文过滤：context:global | context:@me | context:@team/search`
  Search Context 适合把一组仓库预先打包。

```bash
# 搜某团队全部 Go 服务，但排除生成代码和 vendor
context:@platform/backend language:go -file:(^vendor/|^gen/) grpc.Dial

# 搜指定标签范围
repo:sourcegraph/sourcegraph@*refs/tags/* type:diff executor

# 只在带 package.json 的仓库中搜索
repo:has.file(^package\.json$) react-router
```

## 模式与语法技巧
---
lang: bash
desc: 真正常用的不是“记住所有语法”，而是知道什么时候切换 keyword、regexp、structural，以及如何避免过滤器和正文互相冲突。
---

- `关键词模式：foo bar`
  默认是 `patternType:keyword`，空格分词通常表示都要出现。
- `精确短语："foo bar"`
  需要保留顺序和空格时用引号。
- `正则模式：/.../`
  斜杠包裹会按 RE2 正则解析，也可显式写 `patternType:regexp`。
- `大小写敏感：case:yes`
  默认通常不区分大小写，需要精确匹配时加上。
- `按字面搜索保留词：content:"repo:sourcegraph"`
  当正文里就有 `repo:`、`file:` 这类词，必须用 `content:` 防止被当过滤器。
- `结构化搜索：patternType:structural`
  想找“某函数包住某调用”“某 API 的参数排列”时更稳。

```bash
# 关键词：同时包含两个词
auth token

# 精确短语
"invalid token"

# 正则：查所有 get/set 风格方法
patternType:regexp /(?:get|set)[A-Z]\w+/

# literal 搜索，避免 repo: 被当成过滤器
content:"repo:sourcegraph"

# 结构化：找 Go 中包着 fmt.Errorf 的 return
repo:myorg/backend language:go patternType:structural 'return fmt.Errorf(:[args])'
```

## 布尔组合与排除
---
lang: bash
desc: 当一个线索不够时，用布尔组合表达“必须出现”“二选一”“明确排除”，比堆复杂正则更易读也更易维护。
---

- `AND`
  默认可理解为交集，高优先级高于 `OR`。
- `OR`
  适合表达多种实现、多种命名。
- `NOT` 或前缀 `-`
  用来排除误命中目录、测试桩、文档样例。
- `(...)`
  复杂组合时必须加括号，不要赌默认优先级。

```bash
# 要么 http.NewRequest 要么 NewRequestWithContext
repo:myorg/ language:go (http.NewRequest OR NewRequestWithContext)

# 查真实调用点，排除测试和 mock
repo:myorg/ language:go payment NOT file:_test\.go$ NOT mock

# 查配置分支
repo:myorg/frontend file:^src/ (SENTRY_DSN OR DATADOG_CLIENT_TOKEN) -file:\.snap$
```

## 结果提取与导航
---
lang: bash
desc: 很多时候你不是想“看命中内容”，而是想快速拿到仓库名单、文件名单、符号清单或差异片段。这时 `select:` 和 `type:` 比继续收缩正文更高效。
---

- `select:repo`
  先看哪些仓库命中，适合跨组织排查。
- `select:file`
  直接拿文件清单，适合批量修复前估算影响面。
- `type:path`
  找文件路径而不是正文内容。
- `type:symbol`
  找函数、方法、类、接口、变量等符号。
- `type:commit` / `type:diff`
  搜提交和变更，不搜当前文件内容。
- `select:commit.diff.added`
  只提取新增 diff 片段，适合查某类新引入问题。

```bash
# 哪些仓库还在用旧 SDK
context:global "legacy-sdk" select:repo

# 哪些文件声明了这个环境变量
repo:myorg/ file:\.(ts|tsx|js)$ NEXT_PUBLIC_API_BASE select:file

# 找某个符号定义
repo:myorg/backend type:symbol Handler

# 只看新增的 panic
repo:myorg/ type:diff select:commit.diff.added panic
```

## 常见 Recipes
---
lang: bash
desc: 下面这些是 Sourcegraph 最常见的实战套路。记住场景到查询的映射，比死背全部语法更有用。
---

- **找某个能力在哪些服务里实现**

```bash
context:@platform/backend language:go (RegisterRoutes OR grpc.NewServer) select:repo
```

- **找某个配置从前端一路传到后端**

```bash
# 前端入口
repo:myorg/web file:^src/ language:typescript "checkoutTimeout"

# 后端消费
repo:myorg/api language:go "checkoutTimeout"
```

- **找最近谁引入了危险调用**

```bash
repo:myorg/ type:diff after:"30 days ago" (exec.Command OR os/exec) select:commit.diff.added
```

- **只看某类文件是否存在，而不看正文**

```bash
repo:has.file(^Dockerfile$) select:repo
repo:has.path(^\.github/workflows/) select:repo
```

- **找某个 API 的全部调用点，但排除定义**

```bash
repo:myorg/sdk language:typescript createClient -file:(index\.ts$|types\.ts$)
```

- **查重构是否还遗留旧命名**

```bash
repo:myorg/ ("OldBillingService" OR oldBillingService) -file:(CHANGELOG|README)
```

## 提交与历史排查
---
lang: bash
desc: 当你怀疑问题是“最近改出来的”，直接切到 `type:commit` 或 `type:diff`，通常比在当前代码里猜更快。
---

- `author:` / `committer:`
  想按人筛提交时用。
- `before:` / `after:`
  想框定时间窗口时用。
- `message:`
  按提交信息找大重构、回滚、迁移。
- `repo:foo@main:^release`
  看两个修订集合的差异范围。

```bash
# 最近两周谁改过认证逻辑
repo:myorg/ type:commit after:"14 days ago" auth author:alice

# 查带 rollback 的历史提交
repo:myorg/ type:commit message:rollback

# 查主分支相对 release 分支的差异里是否出现这个关键词
repo:myorg/service@main:^release type:diff payment
```

## 高频语法速记
---
lang: bash
desc: 这一段不是完整手册，只保留最值得背下来的语法骨架，方便你在页面里快速扫一眼再开搜。
---

- `repo:REGEXP`：按仓库过滤
- `file:REGEXP`：按路径过滤
- `language:NAME`：按语言过滤
- `content:"literal"`：按字面内容过滤
- `patternType:keyword|regexp|structural`：切换匹配模式
- `type:content|path|repo|symbol|commit|diff`：切换结果类型
- `select:repo|file|commit.diff.added`：提取结果形态
- `case:yes`：大小写敏感
- `count:1000` / `timeout:20s`：放宽结果数和超时
- `context:global`：切换搜索上下文
- `repo:has.file(...)` / `repo:has.path(...)`：按仓库内文件特征过滤

## 常见坑与排障
---
lang: bash
desc: Sourcegraph 查不准时，通常不是“功能不行”，而是查询的层级混了。优先检查过滤器冲突、结果类型和搜索模式。
---

- **把过滤器词当正文搜了**
  例如你真的想搜 `repo:foo` 这串文本，要写 `content:"repo:foo"`。
- **该用 `type:symbol` 时还在硬搜正文**
  找定义、方法、类名时，先试 `type:symbol`。
- **该用 `select:file` 时还在看几百条正文**
  你如果只是想知道影响面，直接抽文件列表。
- **在超大仓库里直接上复杂正则**
  先用 `repo:`、`file:`、`language:` 缩小范围，再开正则。
- **结构化搜索没命中就怀疑语法错**
  先确认语言识别、代码形态和占位模式是否真的匹配目标代码。

```bash
# 误写：repo:sourcegraph    # 这是过滤器
# 正写：content:"repo:sourcegraph"

# 想看有哪些文件命中，不要继续刷正文
repo:myorg/ language:go context.Context select:file

# 超大仓库先收范围再正则
repo:myorg/ file:^internal/ patternType:regexp /New[A-Z]\w+Client/
```

## 核心场景小抄
---
lang: bash
desc: 不想每次都从头拼查询时，直接套下面这些模板，再按你的仓库名、路径和语言替换即可。
---

- 查实现入口：`repo:<repo> file:^<dir>/ language:<lang> <keyword>`
- 查调用点：`repo:<repo> language:<lang> <symbol> -file:_test\.go$`
- 查定义：`repo:<repo> type:symbol <symbol>`
- 查影响文件：`repo:<repo> <keyword> select:file`
- 查影响仓库：`context:<ctx> <keyword> select:repo`
- 查最近变更：`repo:<repo> type:diff after:"30 days ago" <keyword>`
- 查新增风险：`repo:<repo> type:diff select:commit.diff.added <keyword>`
