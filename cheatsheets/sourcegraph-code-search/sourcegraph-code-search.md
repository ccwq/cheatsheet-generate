# Sourcegraph Code Search 查询速查

## 搜索模式
- Sourcegraph 默认用 `patternType:keyword`（关键词搜索），空格隔开的词可以任意顺序匹配。按下页面右上角的 `Aa` 按钮即可切换大小写敏感（`case:yes`）。
- `"(foo bar)"` 精确短语；`/foo.*bar/` 是 RE2 正则表达式；也可以通过 `(.*)` 按钮或 `patternType:regexp` 明确切到正则模式，`patternType:structural` 则开启结构化查询（需传递 `structural` 模式的抽象语法树语法）。
- `/.../` 的作用是让 Sourcegraph 将斜线内当成正则，免去 `\` 逃逸空格；想让保留字原样出现，可用 `content:"repo:sourcegraph"`。
- `structural` 适用于需要对 AST 结构进行模式匹配，例如 `patternType:structural ` + `structural:{pattern}`。相比之下，`patternType:regexp` 走 RE2；`patternType:keyword` 走分词，适合日常关键词。
- 推荐组合：

```bash
# 匹配同时包含 foo 和 bar
foo bar

# 精确短语
"foo \"bar\""

# 交叉正则
/foo\s+bar/i

# 直接搜索包含 repo:sourcegraph 的字面文本
repo:sourcegraph content:"repo:sourcegraph"

# 可选 patternType
context:global fmt.Errorf patternType:regexp
context:@me panic patternType:structural
```

## Search Context（搜索上下文）
- 默认在当前 Sourcegraph 上下文运行，若要跨项目或跨团队使用 GCX，可加上 `context:global`；`context:@<用户名>` 和 `context:@<team>` 搜索私有或团队上下文。
- Search Context 用于画定可见仓库集，并可与 repo/file 过滤器组合。不指定时 Sourcegraph 会使用当前选定的上下文，上方导航 `Contexts` 下拉可选。
- URL 示例：`https://sourcegraph.com/search?q=context:global+repo:sourcegraph/sourcegraph+timeout:15s`。

## 通用过滤器（All searches）
- `repo:` 通过正则锁定仓库，也可与 `rev:`/`context:` 搭配；`-repo:` 排除。
- `file:`/`-file:` 控制路径，默认非锚定，全匹配可用 `^README.md$`，也可以 `file:has.filename` 之类的谓词。
- `language:`/`-language:` 过滤语言；`fork:`、`archived:`、`visibility:` 控制仓库状态；`select:`（如 `select:repo`、`select:file`、`select:commit.diff.added`）返还不同 result type。
- `type:` 影响搜索 type：`type:file`/`type:path`（文件路径）、`type:repo`（仓库名）、`type:symbol[.kind]`（符号）、`type:commit`/`type:diff`（提交/差异）、`type:content`（正文），也能与 `select:` 一起用来缩小响应。
- `patternType:` 显式指定 `keyword`/`regexp`/`structural`，`case:yes` 强制大小写敏感；`timeout:`（默认 10s）与 `count:` 控制结果大小。
- `repo:has.*` 与 `file:has.*`：
  - `repo:has.meta(key:value)`、`repo:has.meta(key)`、`repo:has.meta(key:)`：按仓库 metadata 过滤，例如 `repo:has.meta(owning-team:security)`。
  - `repo:has.path(regexp)`：只在包含匹配路径的仓库中搜索，例 `repo:has.path(\.py) file:Dockerfile pip`。
  - `repo:has.topic(topic)` 依据 GitHub/GitLab topic。
  - `repo:has.commit.after(<duration>)`：过滤最近有提交的仓库。
  - `repo:has.file(path-regexp)` / `repohasfile`：测试是否包含某路径。

```bash
repo:gorilla/mux testroute
file:\.js$ httptest
language:typescript encoding
select:repo fmt.Errorf
repo:sourcegraph rev:v3.14.0 mux
repo:sourcegraph count:1000 timeout:15s func
```

## 布尔与分组
- 使用 `AND`/`OR`/`NOT` 或小写 `and`/`or`，AND 优先级高于 OR。
- `NOT` 等价 `-`（可搭配 `file:`、`content:` 等过滤）。
- 括号控制作用域：`a and (b or c) and d`，若想让 `file:` 覆盖整个子表达式，显式包起 `file:main.c (char c or (int i and int j))`。

```bash
foo AND bar OR baz    # 等价 (foo AND bar) OR baz
panic NOT ever        # 等价 panic AND NOT ever
file:main.c (char c or (int i and int j))
```

## 仓库与修订
- `repo:` 也是查询入口，单独的 `repo:` 会列出满足路径的仓库；`|` 表示并集、`-repo:` 排除实际匹配。
- `repo:<path>@<revision>` 可以指定分支/tag/commit，`rev:<revision>` 只能与 `repo:` 联用且不可重复；若想同时看多个 revision，请使用 glob `@*refs/heads/*` 或 `@*refs/tags/*`。Sourcegraph 会自动补全缺失的 `/*`。
- `@*refs/heads/*:*!refs/heads/release*` 等 `@...:*!...` 语法支持排除特定 refs；`^` 则代表集合差，如 `repo:foo@main:^3.15` 表示主分支去掉 3.15 可达提交。
- `rev:at.time("3 days ago")` 等时间限定式仅在 Sourcegraph 5.4+ 可用，可配合 `type:commit`/`type:diff` 观察特定历史范围。

```bash
repo:foo repo:bar          # 同时包含 foo 和 bar 的仓库
repo:foo|bar                # foo 或 bar
repo:myteam/abc@main:^fixme type:commit
repo:docker@*refs/tags/*
```

## 提交与差异过滤
- `type:diff`/`type:commit` 用于查看变更或具体提交；`repo:vscode@*refs/heads/:^refs/heads/master type:diff task` 反映未合并的差异。
- `author:`/`-author:`（匹配 `Full Name <email>`，可用 `author:example.com>$` 或 `author:@SourcegraphUserName`）、`committer:` 类似。
- `before:`/`after:` 控制提交日期，`message:`/`-message:` 针对提交信息。

```bash
type:diff func author:nick
type:commit test message:"refactor"
before:"last thursday" after:"6 weeks ago"
```

## 使用建议
1. 想要跳过代码语法解析，优先 `content:"..."` + `patternType:keyword`（或 `patternType:regexp`）。
2. `select:repo`、`select:commit.diff.added` 可快速提取路径或新增片段，结合 `case:yes` 提升精度。
3. 大量结果可用 `count:1000`/`count:all`，必要时调整 `timeout:` 获取全量。
4. `repo:has.meta/has.path/has.topic/has.commit.after` 与 `file:has.*` 适合精细筛选组织、贡献者、文件特性。
5. 组合 `repo:` + `file:` + 布尔 + 日期/作者过滤，精确定位跨仓库的变更痕迹。
