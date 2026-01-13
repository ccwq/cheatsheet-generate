# ast-grep 语法速查表提示词

## 模式语法

### 元变量
- `$VAR`：匹配单个 AST 节点，VAR 为大写字母、下划线或数字
- `$$$VAR`：匹配零或多个 AST 节点
- `$_VAR`：非捕获元变量，不记录匹配内容

### 模式匹配
- 模式代码须为 tree-sitter 可解析的有效代码
- 模式可匹配嵌套表达式，如 `a + 1` 匹配 `funcCall(a + 1)`

### 元变量捕获
- 同名元变量匹配相同内容：`$A == $A` 匹配 `a == a`，不匹配 `a == b`
- 下划线开头元变量不捕获，优化性能

## 原子规则

### pattern
- 字符串模式：`pattern: console.log($GREETING)`
- 对象模式：
  ```yaml
  pattern:
    selector: field_definition
    context: class A { $FIELD = $INIT }
    strictness: smart  # cst/smart/ast/relaxed/signature
  ```

### kind
- 指定 AST 节点类型：`kind: if_statement`
- 常用：`if_statement`, `expression`, `function_declaration`, `class_declaration`

### regex
- 匹配节点文本：`regex: 'prototype'`

### nthChild
- 匹配第 N 个子节点：
  ```yaml
  nthChild:
    position: 1
    of: expression_statement
  ```

### range
- 匹配行范围：
  ```yaml
  range:
    start: 10
    end: 20
  ```

## 关系规则

### inside
- 目标在指定节点内：
  ```yaml
  inside:
    kind: for_in_statement
    stopBy: end  # end/neighbor/自定义规则
  ```

### has
- 目标包含指定子节点：
  ```yaml
  has:
    field: key
    regex: 'prototype'
  ```

### follows
- 目标跟随指定节点：
  ```yaml
  follows:
    pattern: console.log('world');
  ```

### precedes
- 目标前置于指定节点：
  ```yaml
  precedes:
    pattern: console.log('hello');
  ```

## 组合规则

### any
- 满足任一条件：
  ```yaml
  any:
    - kind: for_statement
    - kind: while_statement
  ```

### all
- 满足所有条件：
  ```yaml
  all:
    - pattern: console.log($$$)
    - inside:
        kind: function_declaration
  ```

### not
- 排除匹配：
  ```yaml
  not:
    inside:
      kind: test_block
  ```

### matches
- 引用外部规则：`matches: rule-id`

## 技巧

- 用 pattern 对象解决解析歧义
- 选合适 strictness：smart 默认，cst 最严，signature 最宽
- 嵌套关系规则精确匹配
- 元变量可在 fix 中复用