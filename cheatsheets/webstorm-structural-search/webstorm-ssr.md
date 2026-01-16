# WebStorm Structural Search & Replace (SSR) 速查表

## 核心概念
Structural Search (SSR) 允许你基于**代码结构**（语法树）而不是纯文本来搜索和替换代码。
它比正则表达式更强大，因为它理解代码的上下文（如类、方法、变量类型）。

- **模板 (Template)**: 定义代码结构的模式，包含普通代码和**变量**。
- **变量 (Variable)**: 以 `$` 包围的标识符，如 `$var$`，用于匹配代码中的特定部分。
- **修饰符 (Modifier)**: 对变量的约束条件（如文本匹配、类型、计数、脚本）。

## 基础语法

### 变量定义
- `$variable$`: 匹配任意代码节点（表达式、语句、类名等）。
- `"$string$"`: 匹配字符串字面量。
- `/* $comment$ */`: 匹配注释。
- `class $Name$ { $Body$ }`: 匹配类定义。
- `function $foo$($args$) { $stmts$ }`: 匹配函数定义。

### 常用修饰符 (Modifiers)
在 SSR 面板中选中变量可添加修饰符：

- **Text (文本)**: 使用正则表达式约束变量匹配的文本内容。
  - 例如: `^get.*` 匹配以 get 开头的方法名。
  - `[A-Z].*` 匹配大写字母开头的标识符。
- **Count (计数)**: 约束变量出现的次数。
  - `1`: 恰好一次（默认）。
  - `0..1`: 可选。
  - `0..*`: 零次或多次。
  - `1..*`: 一次或多次。
  - 例如：在函数参数 `$args$` 上设置 `0..*` 以匹配任意数量参数。
- **Type (类型)**: 约束变量的类型（适用于强类型语言或推断）。
  - 例如：`String` (Java), `.*Error` (匹配所有 Error 类型)。
- **Reference (引用)**: 约束变量必须是对某个目标的引用。
- **Script (脚本)**: 使用 Groovy 或 BeanShell 编写复杂逻辑。

## 搜索选项
- **Recursive (递归)**: 搜索嵌套结构（如 `foo(foo())`）。
- **Match Case (区分大小写)**: 变量匹配是否区分大小写。
- **File Type (文件类型)**: 指定搜索的语言（JS, TS, Java, HTML 等）。
- **Target (目标)**: 指定哪个变量是搜索结果的焦点（高亮部分）。

## 常见场景示例

### 1. 变量与字面量
#### 查找所有硬编码的字符串
**模板**:
```javascript
"$str$"
```
**变量**:
- `$str$`: Count = `1`

#### 查找特定变量赋值
**模板**:
```javascript
var $x$ = $val$;
```
**变量**:
- `$x$`: Text = `temp.*` (查找以 temp 开头的变量)

### 2. 函数与方法
#### 查找 console.log 调用 (任意参数)
**模板**:
```javascript
console.log($args$);
```
**变量**:
- `$args$`: Count = `0..*`

#### 查找超过 3 个参数的函数定义
**模板**:
```javascript
function $name$($params$) {
  $body$
}
```
**变量**:
- `$params$`: Count = `4..*`

#### 查找特定类的方法调用
**模板**:
```javascript
$instance$.$method$($args$)
```
**变量**:
- `$instance$`: Script = `__context__.type.name == "MyClass"` (假设有类型信息)
或简单的文本约束:
- `$instance$`: Text = `myService`

### 3. 语句与控制流
#### 查找空的 try-catch 块
**模板**:
```javascript
try {
  $tryStmt$;
} catch ($err$) {
}
```
**变量**:
- `$tryStmt$`: Count = `0..*`

#### 查找没有大括号的 if 语句
**模板**:
```javascript
if ($cond$) $stmt$;
```
**变量**:
- `$stmt$`: Script = `!(__context__ instanceof com.intellij.lang.javascript.psi.JSBlockStatement)`
(注: 需要了解底层 PSI 结构，或者简单地搜索非块语句)

### 4. 注释与文档
#### 查找 TODO 注释
**模板**:
```javascript
/* $comment$ */
```
**变量**:
- `$comment$`: Text = `TODO.*`

### 5. HTML/XML/JSX 结构
#### 查找没有 alt 属性的 img 标签
**模板**:
```html
<img $attrs$ />
```
**变量**:
- `$attrs$`: Script = `!__context__.text.contains("alt=")`

## 结构化替换 (Structural Replace)

### 1. 变量重命名与转换 (var -> const)
**搜索**: `var $x$ = $y$;`
**替换**: `const $x$ = $y$;`

### 2. 方法迁移 (参数顺序调整)
**搜索**: `$obj$.make($a$, $b$)`
**替换**: `$obj$.create($b$, $a$)`

### 3. 包含脚本的替换 (转小写)
**搜索**: `class $Name$ {}`
**替换**: `class $Name_Lower$ {}`
**变量**:
- `$Name_Lower$`: Script = `Name.name.toLowerCase()`

### 4. 移除包裹代码 (Unwrap)
**搜索**:
```javascript
(function() {
  $body$
})();
```
**替换**:
```javascript
$body$
```

## 脚本约束 (Script Constraints) 高级用法

SSR 支持 Groovy 脚本进行高级匹配。常用变量：
- `__context__`: 当前匹配的 PSI 节点。
- `match`: 返回 `true` (匹配) 或 `false` (忽略)。

### 常用脚本片段

#### 检查文本内容
```groovy
__context__.text.contains("foo")
```

#### 检查父节点类型 (例如在 if 语句中)
```groovy
import com.intellij.lang.javascript.psi.*
__context__.parent instanceof JSIfStatement
```

#### 长度检查
```groovy
__context__.text.length() > 50
```

#### 检查参数数量 (替代 Count 修饰符)
```groovy
// 在方法调用的 $args$ 变量上
__context__.parent.arguments.length == 3
```

## 最佳实践
- **现有模板 (Existing Templates)**: WebStorm 内置了大量模板，按 `Ctrl+Shift+A` -> `Structural Search` -> `Copy Existing Template` 查看。
- **保存为检查 (Inspection)**: 将 SSR 模板保存为 Inspection，可以在代码编辑器中实时高亮警告，实现自定义 Lint 规则。
- **范围 (Scope)**: 合理设置搜索范围（Project, Module, Directory, Changed Files）以提高性能。
