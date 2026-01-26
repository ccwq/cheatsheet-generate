# Obsidian Dataview Cheatsheet

Dataview 是 Obsidian 的实时索引和查询引擎，通过元数据实现笔记的查询、过滤、排序和分组。

## 元数据 (Metadata)

Dataview 索引特定数据，定义方式如下：

### Frontmatter (YAML)
位于笔记顶部，用 `---` 包裹。

```yaml
---
author: "Edgar Allan Poe"
published: 1845-01-01
tags: [poems, horror]
rating: 5
price: 19.99
contact:
  email: "test@example.com"
---
```

### 行内字段 (Inline Fields)
格式为 `Key:: Value`，可位于笔记任意位置。

```
Basic Field:: Some random Value
I would rate this a [rating:: 9]!
This will not show the (longKeyIDontNeedWhenReading:: key).
```

### 列表/任务字段
使用方括号语法为列表项或任务添加元数据。

```markdown
- [ ] 给 David 发邮件 [due:: 2024-12-31]
- 购买 [quantity:: 5] 苹果
```

### 隐式字段 (Implicit Fields)
Dataview 自动索引的文件信息：

```
file.name        - 文件名 (不含扩展)
file.folder      - 父文件夹路径
file.path        - 完整路径
file.link        - 文件链接对象
file.ext         - 扩展名 (.md)
file.size        - 大小 (字节)
file.aliases     - 别名数组
file.cday        - 创建日期 (日粒度)
file.mday        - 修改日期 (日粒度)
file.ctime       - 创建时间 (datetime)
file.mtime       - 修改时间 (datetime)
file.day         - 自动提取的日期
file.tags        - 所有标签 (含嵌套展开)
file.etags       - 显式标签 (仅 #tag)
file.outlinks    - 出链数组
file.inlinks     - 入链数组
file.lists       - 所有列表项
file.tasks       - 所有任务
```

> **提示**：嵌套字段用点号访问 `contact.email`，数组索引用 `tags[0]`

### 任务专用字段 (Task Fields)
在 `TASK` 查询或 `file.tasks` 中可用：

```
completed       - 是否完成 (true/false)
fullyCompleted  - 及其子任务是否全部完成
status          - 任务状态字符 (x, -, >)
text            - 任务文本
line            - 行号
section         - 任务所在标题的链接
outlinks        - 任务文本中的出链
due             - 截止日期
```

## FROM 数据源

指定查询范围，支持多种来源：

```sql
FROM #tag                   "标签及其子标签"
FROM #tag AND -"exclude"    "排除文件夹"
FROM "folder/"              "文件夹及其子文件夹"
FROM [[note]]               "指定页面"
FROM outgoing([[note]])     "note 链接出的页面"
FROM incoming([[note]])     "链接到 note 的页面"
FROM #a AND #b              "同时满足"
FROM #a OR #b               "满足任一"
FROM ("path/" OR [[Note]]) AND -#archive
```

## 查询语法 (DQL Structure)

DQL (Dataview Query Language) 遵循类似 SQL 的结构：

```sql
TABLE file.day, (price * 0.8) AS "Discount"
FROM "Books"
WHERE rating >= 4
SORT file.day DESC
```

### 操作符与字面量

- **比较**: `=`, `!=`, `<`, `>`, `<=`, `>=`
- **逻辑**: `&` (与), `|` (或), `!` (非)
- **算术**: `+`, `-`, `*`, `/`

### 日期简写

```
date(today)     - 今天
date(yesterday) - 昨天
date(tomorrow)  - 明天
date(now)       - 当前时刻
date(sow)       - 本周初 (Start of Week)
date(eom)       - 本月末 (End of Month)
date(som)       - 本月初 (Start of Month)
```

## 查询类型 (Query Types)

- **TABLE**：表格视图，自定义列
  ```sql
  TABLE author, published, rating AS "Score"
  FROM #books
  WHERE rating >= 4
  ```

- **LIST**：列表视图
  ```sql
  LIST file.link
  FROM #projects
  WHERE !completed
  ```

- **TASK**：任务视图
  ```sql
  TASK
  FROM #work
  WHERE !completed AND due <= date(today)
  ```

- **CALENDAR**：日历视图
  ```sql
  CALENDAR file.cday
  FROM #journal
  ```

## 数据命令 (Data Commands)

按顺序执行，用于筛选、排序、分组。

### WHERE (筛选)

```sql
WHERE !completed           "不存在或为空"
WHERE completed            "存在且为真"
WHERE due AND due < date(today)
WHERE file.mtime >= date(today) - dur(7 days)
WHERE contains(tags, "work")
WHERE icontains(author, "john")
```

### SORT (排序)

```sql
SORT file.ctime DESC       "降序"
SORT rating ASC, file.name ASC
```

### LIMIT (限制)

```sql
LIMIT 10
```

### FLATTEN (扁平化)

将数组字段拆分为多行：

```sql
FLATTEN authors
FLATTEN file.tags AS tag
FLATTEN list(1,2,3) AS num
```

### GROUP BY (分组)

按字段分组，每组创建 `rows` 数组：

```sql
GROUP BY file.folder
SORT rows.file.ctime DESC

"分组后聚合"
GROUP BY author
FLATTEN length(rows) AS "count"
FLATTEN sum(rows.rating) AS "total"
FLATTEN average(rows.rating) AS "avg"
SORT count DESC
```

> **注意**：分组后通过 `rows` 访问原始字段

## 表达式与类型处理

### 字段不存在/空值处理

```sql
WHERE !field              "不存在或空值"
WHERE field               "存在且非空"
WHERE default(rating, 0) >= 3
WHERE field != ""
```

### 日期与时长运算

```sql
WHERE file.day >= date(sow) - dur(7 days)
WHERE due + dur(1 day) <= date(today)
WHERE striptime(due) = striptime(date(today))
WHERE dateformat(due, "yyyy-MM") = "2024-01"
```

### 字符串操作

```sql
WHERE contains(title, "Note")
WHERE regexmatch("^\\d{4}", file.name)
WHERE lower(author) = lower("JOHN")
WHERE split(tags, "/")[0] = "work"
```

### 链接与列表

```sql
WHERE contains(file.outlinks, [[Target]])
WHERE meta(link).path = "path/to/note"
WHERE length(file.tags) > 0
```

## 函数 (Functions)

### 构造函数

```
object(key, val, ...)  - 创建对象
list(val1, val2, ...)  - 创建列表
date("YYYY-MM-DD")     - 解析日期
dur("1 day")           - 解析时长
link(path, [display])  - 创建链接
choice(bool, left, right)  - If-Else 逻辑
```

### 数值与统计

```
round(num, [digits])   - 四舍五入
min(a, b), max(a, b)   - 最值
sum(array)             - 求和
average(array)         - 平均值
length(array)          - 长度
```

### 字符串

```
contains(str, val)     - 包含 (大小写敏感)
icontains(str, val)    - 包含 (忽略大小写)
replace(str, p, r)     - 替换
split(str, delim)      - 分割
regexmatch(p, str)     - 正则匹配
lower(str), upper(str) - 大小写转换
```

### 日期格式化

```
dateformat(date, "yyyy-MM-dd")
dateformat(date, "HH:mm")
dateformat(date, "cccc")    - 星期几
striptime(date)             - 去除时间部分
```

## TASK 场景模板

### 常用模板

```sql
"未完成任务"
TASK WHERE !completed

"逾期任务"
TASK WHERE !completed AND due < date(today)

"最近到期"
TASK WHERE due AND due >= date(sow)
SORT due ASC

"按项目分组统计"
TASK FROM #projects
GROUP BY section
FLATTEN length(rows) AS "count"
SORT count DESC
```

### 状态筛选

```sql
TASK WHERE status = ">"   "进行中"
TASK WHERE status = "-"   "待办"
TASK WHERE status = "x"   "已完成"
```

## 行内查询 (Inline)

### 行内表达式

```markdown
共有 = dv.pages("#books").length 本书
评分: = this.rating
更新时间: = dateformat(this.file.mtime, "yyyy-MM-dd")
```

### 内联 DQL 块

```markdown
```dataview
LIST file.link
FROM #projects
LIMIT 5
```
```

## DataviewJS

JavaScript 高级查询：

```dataviewjs
let pages = dv.pages("#book");

// 表格: 链接与评分
dv.table(
  ["File", "Rating"],
  pages.map(p => [p.file.link, p.rating])
);

// 任务: 未完成且过期
dv.taskList(
  pages.file.tasks
  .where(t => !t.completed && t.due < dv.date("today"))
);
```

### 常用 API

```
dv.pages("#tag")       - 查询页面
dv.page(path)          - 单个页面
dv.current()           - 当前文件
dv.table(headers, rows) - 表格
dv.list(array)         - 列表
dv.taskList(tasks)     - 任务列表
```

## DataArray 链式操作

```javascript
dv.pages("#book")
  .where(p => p.rating >= 4)
  .sort(p => p.published, "desc")
  .map(p => [p.file.link, p.rating])

// 按标签分组统计
dv.pages("#note")
  .flatten(p => p.tags)
  .groupBy(t => t)
  .sort(g => g.rows.length, "desc")
  .forEach(g => {
    dv.header(3, g.key + ": " + g.rows.length);
  });
```

### 常用方法

- `.where(predicate)` - 过滤
- `.sort(field, [order])` - 排序
- `.map(func)` - 映射
- `.flatten(arrayField)` - 展开数组
- `.groupBy(field)` - 分组
- `.length` - 长度
- `.first(n)` - 取前 n 条
- `.array` - 转为普通数组

## 调试与排错

### 常用调试技巧

```sql
"查看实际字段值"
TABLE field1, field2
FROM [[CurrentPage]]

"检查字段是否存在"
TABLE file.name, field
WHERE file.name = [[CurrentPage]].file.name
```

### 常见问题

| 问题 | 解决方案 |
|-----|---------|
| 无结果 | 检查字段名拼写、类型是否匹配 |
| 日期比较失败 | 用 `striptime()` 去除时间部分 |
| 空值问题 | 用 `default(field, value)` |
| 数组包含 | 用 `contains()` 而不是 `=` |

### 类型转换

```
date(string)   - 字符串转日期
number(string) - 字符串转数字
string(any)    - 任意转字符串
```
