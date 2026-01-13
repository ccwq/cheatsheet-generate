# ast-grep 语法速查表

## 模式语法

### 模式匹配
ast-grep 使用模式代码构建 AST 树并匹配目标代码，模式可以搜索完整的语法树，因此也能匹配嵌套表达式。

示例：`a + 1` 可匹配：
- `const b = a + 1`
- `funcCall(a + 1)`
- `deeplyNested({ target: a + 1 })`

**注意**：模式代码必须是 tree-sitter 可以解析的有效代码。

### 元变量
元变量用于匹配模式中的子表达式，以 `$` 开头，后跟大写字母 A-Z、下划线 `_` 或数字 1-9。

**有效元变量**：`$META`, `$META_VAR`, `$META_VAR1`, `$_`, `$_123`

**无效元变量**：`$invalid`, `$Svalue`, `$123`, `$KEBAB-CASE`, `$`

`$META_VARIABLE` 是通配符表达式，可以匹配任何单个 AST 节点，类似于正则表达式的 `.`，但不是文本匹配。

示例：`console.log($GREETING)` 可匹配：
- `console.log('Hello World')`
- `console.log('Also matched!')`

不匹配：
- `console.log()`（参数不匹配）
- `console.log(a, b)`（参数过多）

### 多元变量
使用 `$$$` 匹配零个或多个 AST 节点，包括函数参数、参数或语句。

**函数参数示例**：`console.log($$$)` 可匹配：
- `console.log()`（零个节点）
- `console.log('hello world')`（一个节点）
- `console.log('debug: ', key, value)`（多个节点）
- `console.log(...args)`（展开运算符）

**函数参数示例**：`function $FUNC($$$ARGS) { $$$ }` 可匹配：
- `function foo(bar) { return bar }`
- `function noop() {}`
- `function add(a, b, c) { return a + b + c }`

### 元变量捕获
相同名称的元变量匹配相同内容，类似于正则表达式的捕获组。

示例：`$A == $A` 可匹配：
- `a == a`
- `1 + 1 == 1 + 1`

不匹配：
- `a == b`
- `1 + 1 == 2`

### 非捕获匹配
以下划线开头的元变量不会被捕获，可用于微优化模式匹配速度。

示例：`$_FUNC($_FUNC)` 可匹配所有带一个参数或展开调用的函数调用，即使两个 `$_FUNC` 匹配不同内容。

## 原子规则

原子规则定义最基本的匹配规则，确定语法节点是否匹配规则。有五种原子规则：`pattern`、`kind`、`regex`、`nthChild` 和 `range`。

### pattern
根据模式语法匹配单个语法节点。

```yaml
rule:
  pattern: console.log($GREETING)
```

默认情况下，字符串模式会被解析并作为一个整体进行匹配。

#### Pattern Object
当简单字符串模式无法选择特定代码时，可以使用对象指定在更大上下文中的子语法节点。

```yaml
pattern:
  selector: field_definition
  context: class A { $FIELD = $INIT }
```

**属性**：
- `context`（必需）：定义周围代码以解决语法歧义
- `selector`（可选）：定义作为模式实际匹配器的子语法节点类型
- `strictness`（可选）：定义模式与节点匹配的严格程度

#### strictness
控制模式匹配策略，从最严格到最宽松：

- `cst`：模式和目标代码中的所有节点必须匹配，不跳过任何节点
- `smart`：模式中的所有节点必须匹配，但会跳过目标代码中的未命名节点（默认行为）
- `ast`：仅匹配模式和目标代码中的命名 AST 节点，跳过所有未命名节点
- `relaxed`：匹配模式和目标代码中的命名 AST 节点，忽略注释和未命名节点
- `signature`：仅匹配命名 AST 节点的类型，忽略注释、未命名节点和文本

### kind
指定 tree-sitter 解析器定义的 AST 节点类型。

```yaml
rule:
  kind: field_definition
```

可匹配：
```javascript
class Test {
  a = 123  // 匹配此行
}
```

**适用场景**：
- 模式代码解析有歧义（如 JavaScript 中的 `{}` 可以是对象或代码块）
- 难以枚举某种 AST 节点类型的所有模式
- 模式仅在特定上下文中出现

### regex
使用正则表达式匹配节点文本内容。

```yaml
rule:
  regex: 'prototype'
```

匹配文本内容包含 'prototype' 的节点。

### nthChild
匹配第 N 个子节点。

```yaml
rule:
  pattern: $A
  nthChild:
    position: 1
    of: expression_statement
```

匹配作为 `expression_statement` 第二个子节点（位置从 0 开始）的节点。

### range
匹配特定行范围内的节点。

```yaml
rule:
  pattern: $A
  range:
    start: 10
    end: 20
```

匹配位于第 10 到 20 行之间的节点。

也可以仅指定开始行：
```yaml
rule:
  range:
    start: 100
```

## 关系规则

关系规则基于周围节点过滤目标节点。ast-grep 支持四种关系规则：`inside`、`has`、`follows` 和 `precedes`。

### inside
目标节点必须在满足子规则的节点内部。

```yaml
rule:
  pattern: await $PROMISE
  inside:
    kind: for_in_statement
    stopBy: end
```

匹配在 `for_in_statement` 内部的 `await` 表达式。

### has
目标节点必须包含子规则指定的子节点。

```yaml
rule:
  kind: pair
  has:
    field: key
    regex: 'prototype'
```

匹配包含 key 为 'prototype' 的 pair 节点。

### follows
目标节点必须跟随子规则指定的节点。

```yaml
pattern: console.log('hello');
follows:
  pattern: console.log('world');
```

仅匹配在 `console.log('world')` 之后的 `console.log('hello')`。

### precedes
目标节点必须前置于子规则指定的节点。

```yaml
pattern: console.log('world');
precedes:
  pattern: console.log('hello');
```

匹配在 `console.log('hello')` 之前的 `console.log('world')`。

### stopBy
控制关系规则的搜索范围。

- `stopBy: end`：搜索直到到达根节点、叶节点或首尾兄弟节点
- `stopBy: neighbor`（默认）：仅匹配直接子节点
- `stopBy: 自定义规则`：当遇到匹配自定义规则的节点时停止搜索

```yaml
inside:
  stopBy:
    kind: function
  pattern: function test($$$) { $$$ }
```

查找在名为 test 的函数内部的节点，当遇到任何 function 节点时停止搜索。

### field
指定节点的特定字段进行匹配。

```yaml
kind: pair
has:
  field: key
  regex: 'prototype'
```

匹配 key 字段为 'prototype' 的 pair 节点，而非包含 'prototype' 文本的任意子节点。

## 组合规则

使用逻辑运算符组合多个规则。

### any
满足任意一个子规则即可匹配。

```yaml
rule:
  pattern: await $PROMISE
  inside:
    any:
      - kind: for_in_statement
      - kind: for_statement
      - kind: while_statement
      - kind: do_statement
```

匹配在任意一种循环内部的 `await` 表达式。

### all
必须满足所有子规则才能匹配。

```yaml
rule:
  all:
    - pattern: console.log($$$)
    - inside:
        kind: function_declaration
```

匹配既是 `console.log` 又在函数声明内部的节点。

### not
排除匹配特定规则的节点。

```yaml
rule:
  pattern: console.log($$$)
  not:
    inside:
      kind: function_declaration
```

匹配不在函数声明内部的 `console.log`。

### matches
使用外部规则匹配节点。

```yaml
rule:
  matches: my-rule-id
```

匹配由 `my-rule-id` 定义的规则。

## 编写规则技巧

1. **使用 pattern 对象解决歧义**：当简单字符串模式无法解析时，提供上下文帮助解析器
2. **选择合适的 strictness**：根据需求选择严格度级别
3. **组合关系规则**：可以嵌套使用关系规则进行精确匹配
4. **复用规则**：使用 `matches` 规则复用已定义的规则
5. **元变量在 fix 中使用**：关系规则中捕获的元变量可在 fix 中使用