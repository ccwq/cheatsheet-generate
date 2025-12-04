# 正则表达式速查表

## 基本语法
- `.`：匹配任意单个字符（除换行符）
- `\d`：匹配数字 [0-9]
- `\D`：匹配非数字 [^0-9]
- `\w`：匹配字母、数字、下划线 [a-zA-Z0-9_]
- `\W`：匹配非字母、数字、下划线 [^a-zA-Z0-9_]
- `\s`：匹配空白字符（空格、制表符、换行符等）
- `\S`：匹配非空白字符
- `[abc]`：匹配方括号内任意一个字符
- `[^abc]`：匹配除方括号内字符外的任意字符
- `[a-z]`：匹配小写字母范围
- `[A-Z]`：匹配大写字母范围
- `[0-9]`：匹配数字范围

### 示例
```javascript
const regex = /\d+/; // 匹配一个或多个数字
const str = "123abc"; 
console.log(regex.test(str)); // true
console.log(str.match(regex)); // ["123"]
```

## 量词
- `*`：匹配前面的字符 0 次或多次
- `+`：匹配前面的字符 1 次或多次
- `?`：匹配前面的字符 0 次或 1 次（可选）
- `{n}`：匹配前面的字符恰好 n 次
- `{n,}`：匹配前面的字符至少 n 次
- `{n,m}`：匹配前面的字符 n 到 m 次
- `*?`：非贪婪匹配，尽可能少匹配
- `+?`：非贪婪匹配，尽可能少匹配
- `??`：非贪婪匹配，尽可能少匹配
- `{n,m}?`：非贪婪匹配，尽可能少匹配

### 示例
```javascript
// 贪婪匹配 vs 非贪婪匹配
const greedy = /a.*b/;
const lazy = /a.*?b/;
const str = "a123b456b";
console.log(str.match(greedy)); // ["a123b456b"]
console.log(str.match(lazy)); // ["a123b"]
```

## 锚点
- `^`：匹配字符串开头
- `$`：匹配字符串结尾
- `\b`：匹配单词边界
- `\B`：匹配非单词边界

### 示例
```javascript
// 匹配整个字符串
const regex = /^\d+$/;
console.log(regex.test("123")); // true
console.log(regex.test("123abc")); // false

// 匹配单词边界
const wordRegex = /\bcat\b/;
console.log(wordRegex.test("cat")); // true
console.log(wordRegex.test("category")); // false
```

## 分组与引用
- `(abc)`：捕获组，匹配 abc 并记住匹配项
- `(?:abc)`：非捕获组，匹配 abc 但不记住匹配项
- `\1, \2, ...`：反向引用，引用之前的捕获组
- `(?<name>abc)`：命名捕获组
- `\k<name>`：命名反向引用

### 示例
```javascript
// 捕获组与反向引用
const regex = /(\w+)\s+\1/;
console.log(regex.test("hello hello")); // true
console.log(regex.test("hello world")); // false

// 命名捕获组
const namedRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = "2023-12-25".match(namedRegex);
console.log(match.groups); // { year: "2023", month: "12", day: "25" }
```

## 断言
- `(?=abc)`：正向先行断言，匹配后面是 abc 的位置
- `(?!abc)`：负向先行断言，匹配后面不是 abc 的位置
- `(?<=abc)`：正向后行断言，匹配前面是 abc 的位置
- `(?<!abc)`：负向后行断言，匹配前面不是 abc 的位置

### 示例
```javascript
// 正向先行断言：匹配后面是 "@gmail.com" 的邮箱
const gmailRegex = /\w+(?=@gmail\.com)/;
console.log("user@gmail.com".match(gmailRegex)); // ["user"]

// 负向先行断言：匹配后面不是 "@gmail.com" 的邮箱
const nonGmailRegex = /\w+(?!@gmail\.com)/;
console.log("user@outlook.com".match(nonGmailRegex)); // ["user"]

// 正向后行断言：匹配前面是 "https://" 的域名
const domainRegex = /(?<=https:\/\/)\w+\.\w+/;
console.log("https://example.com".match(domainRegex)); // ["example.com"]
```

## 修饰符
- `g`：全局匹配，找到所有匹配项
- `i`：忽略大小写
- `m`：多行匹配，使 ^ 和 $ 匹配每行的开头和结尾
- `s`：dotAll 模式，使 . 匹配包括换行符在内的所有字符
- `u`：Unicode 模式，正确处理 Unicode 字符
- `y`：粘性匹配，仅从目标字符串的当前位置开始匹配

### 示例
```javascript
// 全局匹配所有数字
const regex = /\d+/g;
const str = "123abc456def789";
console.log(str.match(regex)); // ["123", "456", "789"]

// 忽略大小写
const caseInsensitive = /hello/i;
console.log(caseInsensitive.test("Hello")); // true
console.log(caseInsensitive.test("HELLO")); // true
```

## JavaScript 正则方法

### RegExp 对象方法
- `test()`：测试字符串是否匹配，返回布尔值
- `exec()`：执行匹配，返回匹配结果数组或 null

### String 对象方法
- `match()`：获取匹配结果数组
- `matchAll()`：获取所有匹配结果的迭代器
- `search()`：查找匹配位置，返回索引或 -1
- `replace()`：替换匹配项，返回新字符串
- `split()`：根据匹配分割字符串，返回数组

### 示例
```javascript
// RegExp.test()
const regex = /\d+/;
console.log(regex.test("123")); // true

// String.replace()
const replaceRegex = /\d+/g;
const replaceStr = "I have 3 apples and 5 oranges";
console.log(replaceStr.replace(replaceRegex, "many")); // "I have many apples and many oranges"
```

## 高级技巧

### 密码强度验证
```javascript
// 至少8个字符，包含大小写字母、数字和特殊字符
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
console.log(passwordRegex.test("Password123!")); // true
```

### 邮箱验证
```javascript
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log(emailRegex.test("user@example.com")); // true
```

### 复杂替换
```javascript
// 驼峰命名转短横线命名
const camelToKebab = (str) => str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
console.log(camelToKebab("helloWorld")); // "hello-world"

// 首字母大写
const capitalize = (str) => str.replace(/\b\w/g, (match) => match.toUpperCase());
console.log(capitalize("hello world javascript")); // "Hello World Javascript"
```

## 常见问题与注意事项
- 正则表达式中的特殊字符需要转义：`\^$.*+?()[]{}|`
- 使用 `RegExp.prototype.exec()` 时，全局匹配需要循环调用
- 避免过度使用复杂正则表达式，考虑可读性和性能
- 注意贪婪匹配与非贪婪匹配的区别
- 使用命名捕获组可以提高代码可读性
- 正则表达式不是万能的，某些情况下使用字符串方法更高效

### 示例：全局匹配循环
```javascript
const globalRegex = /\w+/g;
const globalStr = "hello world javascript";
let match;
while ((match = globalRegex.exec(globalStr)) !== null) {
  console.log(`匹配到: ${match[0]}, 索引: ${match.index}`);
}
```

## 正则表达式工具
- **Regex101**：在线正则表达式测试工具，支持多种语言
- **RegExr**：可视化正则表达式编辑器，包含示例和参考
- **Debuggex**：正则表达式可视化工具，帮助理解复杂正则