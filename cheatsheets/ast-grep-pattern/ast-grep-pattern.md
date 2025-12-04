# AST-grep 模式语法策略

## 模式匹配
- 所有 pattern 都是可被 tree-sitter 解析的代码，必要时切换对象式 pattern 补充 kind/field。
- 模式直接匹配 AST 子树，天然跳过注释与字面量内部文本。
- 使用 playground 校验解析，定位无法匹配的原因。

## 元变量
- 以 <code>$</code> + 大写字母/数字/下划线命名，单个元变量仅匹配一个 named 节点。
- 复用元变量名即可断言节点内容相同；结合 constraints 进一步限定 kind、text。
- 以 <code>$_</code> 前缀定义非捕获元变量，用于只匹配不引用的场景。

## 多元变量 $$$
- <code>$$$</code> 匹配零个或多个节点，可命名为 <code>$$$ARGS</code>、<code>$$$BODY</code>。
- 常用于函数参数、语句块、对象字段；rewrite 时按原顺序展开。

## 函数调用与签名
- 调用：<code>console.log($$$ARGS)</code> 捕获任意参数列表，含展开参数。
- 定义：<code>function $FUNC($$$ARGS) { $$$BODY }</code> 同时获取函数名、参数、函数体。
- 可在 where/constraints 中基于捕获结果检查数量、文本或子模式。

## 捕获控制
- <code>$$VAR</code> 用于捕获 unnamed 节点（如运算符、标点）。
- 非捕获元变量不进入 captures，提高性能并避免 rewrite 误用。

## 与规则配合
- 当 pattern 无法表达上下文时，使用 rule 文件补充 kind、relational、contextual information。
- 在 YAML 中使用对象模式可避免多行缩进产生歧义。
- 结合 relational rule 处理跨节点关系，例如“变量声明后立即比较”。

## 调试要点
- Playground 中检查 AST 节点名称，确认 named/unnamed 分类。
- 对性能敏感的匹配优先使用非捕获或 constraints，减少 HashMap 保存。
- 通过 catalog 示例复用成熟模式，并根据语言差异调整。

## 规则速查（官方 Rule Cheat Sheet 精要）

### 原子规则 Atomic
- `pattern`：直接用模式代码匹配 AST 结构，例如：

```yaml
pattern: console.log($ARG)
```

  上述规则只命中恰好 1 个参数的 `console.log` 调用；注释与字符串内部文本不会被捕获。
- `context` + `selector`：当代码片段有多种解析方式时，先借助 `context` 让 tree-sitter 正确解析，再用 `selector` 指定目标节点：

```yaml
pattern:
  context: '{ key: value }'
  selector: pair
```

- `kind`：按节点类型精确匹配，例如 `kind: if_statement`。
- `regex`：用 Rust 正则限定文本内容：

```yaml
regex: ^regex.+$
```

- `nthChild`：按 1-based 序号锁定兄弟节点，可结合 `reverse` 倒序计数、`ofRule` 过滤匹配域：

```yaml
nthChild:
  position: 2
  reverse: true
  ofRule:
    kind: argument_list
```

- `range`：通过字符区间定位节点，起止均为 0-based：

```yaml
range:
  start: { line: 0, column: 0 }
  end: { line: 0, column: 13 }
```

### 关系规则 Relational
- `inside`：目标节点需位于某个匹配祖先之内，例如：

```yaml
inside:
  kind: function_declaration
```

  若增加 `stopBy: end`，会一直搜索到当前函数尾部。
- `has`：要求目标节点包含特定子节点；可用 `field` 聚焦语义字段：

```yaml
has:
  kind: statement_block
  field: body
```

- `precedes` / `follows`：断言先后关系，常与模式串组合验证结构顺序：

```yaml
precedes:
  pattern: function $FUNC() { $$ }

follows:
  pattern: let $X = 10;
```

### 组合规则 Composite
- `all`：目标节点必须满足列表中全部子规则：

```yaml
all:
  - pattern: const $VAR = $VALUE
  - has: { kind: string_literal }
```

- `any`：满足任意一个即可：

```yaml
any:
  - pattern: let $X = $Y
  - pattern: const $X = $Y
```

- `not`：排除特定子规则：

```yaml
not:
  pattern: console.log($$)
```

- `matches`：调用某个 Utility 规则，实现模块化复用：

```yaml
matches: is-function-call
```

### Utility 规则
- 本地复用：在当前配置文件的 `utils` 段定义，可直接被同文件内 `matches` 引用：

```yaml
rules:
  - id: find-my-pattern
    rule:
      matches: my-local-check

utils:
  my-local-check:
    kind: identifier
    regex: '^my'
```

- 全局复用：将规则拆到 `utilsDirs` 目录的独立 YAML 文件，供整个项目引用：

```yaml
# utils/my-global-check.yml
id: my-global-check
language: javascript
rule:
  kind: variable_declarator
  has:
    kind: number_literal
```

## Rewrite / Fix 实操

### CLI 快速替换
- `ast-grep run --pattern 'foo' --rewrite 'bar' --lang python` 可直接给出 diff，配合 `--interactive` 确认、`-U/--update-all` 自动接受。
- 适合大批量相同替换，规则简单但无法跨节点使用约束。

### YAML fix 模板
- 在 rule 文件中写 `fix`，即可用模式匹配 + 模板输出的方式完成精准重写，适合函数重命名、调用替换等：

```yaml
id: change_func
language: python
rule:
  pattern: |
    def foo($X):
      $$$BODY
fix: |-
  def baz($X):
    $$$BODY

---

id: change_call
rule:
  pattern: foo($X)
fix: baz($X)
```

  多条规则用 `---` 分隔；`$X`、`$$$BODY` 会在 fix 中展开原始 AST。

### 元变量与 fix 的注意事项
- 元变量在 fix 中等价于“捕获组”，可以对调、重排，例如：

```yaml
pattern: $X = $Y
fix: $Y = $X
```

- 无匹配的元变量会被替换为 `''`；想在变量后追加以大写字母开头的后缀时，需借助 transform（否则 `$VARName` 会被解析成 `$VARN` + `ame`）。

### 缩进与上下文
- fix 内容的缩进相对原节点保持不变；如果目标节点位于更深层级，最终输出会再叠加原本的缩进。
- 例如把 `b = lambda: 123` 改写为 `def b(): return 123` 时，`return` 前的两个空格会在任何位置被准确保留。

### 扩展匹配范围（FixConfig）
- 当需要连同分隔符等“邻接 trivia”一起删除，可使用对象形式 fix：

```yaml
rule:
  kind: pair
  has:
    field: key
    regex: Remove
fix:
  template: ''
  expandEnd:
    regex: ','
```

- `template` 等价于字符串版 fix，`expandStart` / `expandEnd` 接受子规则，沿匹配范围的起止持续扩张直到规则不满足，用于去掉尾随逗号、前置空格等。

### 进阶能力
- fix 还支持 transform/rewriter，对捕获内容进行大小写转换、子串替换、正则处理等，可查阅 Rewrite Code + Transform 文档。
- 更复杂的真实场景可参考官方 Catalog；欢迎整理后纳入自身 cheatsheet 以便复用。
