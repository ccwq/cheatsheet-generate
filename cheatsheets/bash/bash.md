---
title: Bash
lang: bash
version: "5.2"
date: "2026-03-13"
github: bminor/bash
colWidth: 380px
---

# Bash

## 🚀 脚本骨架与变量
---
lang: bash
emoji: 🚀
link: https://www.gnu.org/software/bash/manual/bash.html#Shell-Parameters
desc: 先掌握脚本头、变量、数组和参数展开，后面的条件、函数和管道都会顺很多。
---

### 常用写法

- `#!/usr/bin/env bash` : 更通用的 shebang
- `VAR="hello"` : 变量赋值，等号两边不能有空格
- `readonly CONST="x"` : 定义只读变量
- `unset VAR` : 删除变量
- `${name}` : 推荐的变量展开写法
- `${arr[@]}` : 取数组全部元素

```bash
#!/usr/bin/env bash

name="world"
readonly app_env="prod"
arr=(one two three)

echo "hello ${name}"
echo "first: ${arr[0]}"
echo "count: ${#arr[@]}"
```

## 🔀 条件判断与分支
---
lang: bash
emoji: 🔀
link: https://www.gnu.org/software/bash/manual/bash.html#Conditional-Constructs
desc: Bash 的判断分散在字符串、数值、文件测试和模式匹配几类里，速查时最好分开记。
---

### 数值比较

- `-eq / -ne` : 等于 / 不等于
- `-gt / -ge` : 大于 / 大于等于
- `-lt / -le` : 小于 / 小于等于

### 字符串与文件

- `=` `!=` : 字符串相等 / 不等
- `-z / -n` : 为空 / 非空
- `-f / -d / -e` : 文件 / 目录 / 存在
- `-r / -w / -x` : 可读 / 可写 / 可执行

### 模式与正则

- `[[ "$file" == *.txt ]]` : 通配符匹配
- `[[ "$str" =~ ^re.+$ ]]` : 正则匹配

```bash
if [[ -f "$file" && "$file" == *.sh ]]; then
  echo "shell script"
elif [[ -d "$file" ]]; then
  echo "directory"
else
  echo "unknown"
fi

case "$mode" in
  dev) echo "debug on" ;;
  prod) echo "strict mode" ;;
  *) echo "fallback" ;;
esac
```

## 🔁 循环与输入读取
---
lang: bash
emoji: 🔁
link: https://www.gnu.org/software/bash/manual/bash.html#Looping-Constructs
desc: `for` 适合枚举，`while read` 适合逐行处理文件或管道输入。
---

### 循环模板

- `for i in {1..5}` : 范围遍历
- `for f in *.txt` : 文件匹配遍历
- `while read -r line` : 逐行读取，避免转义被吞

```bash
for i in {1..3}; do
  echo "task ${i}"
done

while read -r line; do
  echo "line => ${line}"
done < file.txt
```

## 🧱 函数与返回值
---
lang: bash
emoji: 🧱
link: https://www.gnu.org/software/bash/manual/bash.html#Shell-Functions
desc: Bash 函数返回的是状态码；如果你想返回字符串，通常用 `echo` 搭配命令替换。
---

### 核心规则

- `function fn() { ... }` 或 `fn() { ... }` : 都可用
- `local var="$1"` : 函数内部优先用局部变量
- `return 0` : 返回状态码，不返回字符串
- `result=$(fn)` : 捕获函数输出

```bash
greet() {
  local who="${1:-guest}"
  echo "hello ${who}"
}

validate_port() {
  local port="$1"
  [[ "$port" =~ ^[0-9]+$ ]] || return 1
  (( port > 0 && port < 65536 ))
}

message=$(greet "codex")
validate_port 3000
```

## 📥 输入输出与重定向
---
lang: bash
emoji: 📥
link: https://www.gnu.org/software/bash/manual/bash.html#Redirections
desc: 重定向是 Shell 脚本的基础能力，日志、错误处理、here-doc 都依赖它。
---

### 常用操作

- `read -p "提示" var` : 读取用户输入
- `read -s -p "密码" pass` : 静默输入
- `>` `>>` : 覆盖 / 追加
- `2>&1` : 把标准错误并到标准输出
- `&> /dev/null` : 丢弃全部输出
- `cat <<EOF` : Here Document
- `cat <<< "text"` : Here String

```bash
read -p "name: " user
printf "%-10s %5d\n" "$user" 42

cat <<EOF > app.conf
user=${user}
mode=dev
EOF
```

## ✂️ 字符串与参数展开
---
lang: bash
emoji: ✂️
link: https://www.gnu.org/software/bash/manual/bash.html#Shell-Parameter-Expansion
desc: 这一块最容易靠复制粘贴，速查页适合记住“长度、截取、替换、去前后缀”四组动作。
---

- `${#str}` : 字符串长度
- `${str:pos}` : 从 `pos` 截到结尾
- `${str:pos:len}` : 截取指定长度
- `${str/pat/repl}` : 替换第一个
- `${str//pat/repl}` : 替换全部
- `${str#pat}` / `${str##pat}` : 去掉开头最短 / 最长匹配
- `${str%pat}` / `${str%%pat}` : 去掉结尾最短 / 最长匹配

```bash
path="src/app/main.ts"

echo "${#path}"
echo "${path:4:3}"
echo "${path/main/index}"
echo "${path#src/}"
echo "${path%.ts}"
```

## ⚙️ 进程、作业与退出码
---
lang: bash
emoji: ⚙️
link: https://www.gnu.org/software/bash/manual/bash.html#Job-Control-Basics
desc: 写自动化脚本时，后台任务、等待和退出状态是最常见的故障点。
---

- `command &` : 放到后台执行
- `jobs` : 查看后台任务
- `fg %1` / `bg %1` : 前台 / 后台继续
- `wait` : 等待所有子任务结束
- `$?` : 上一个命令的退出状态
- `diff <(cmd1) <(cmd2)` : 进程替换

```bash
long_task_a &
long_task_b &
wait

if [[ $? -eq 0 ]]; then
  echo "all tasks done"
fi
```

## 🧰 常用内建与外部命令
---
lang: bash
emoji: 🧰
link: https://www.gnu.org/software/bash/manual/bash.html#Bash-Builtins
desc: 这部分用来补足脚本工程化常见手法，避免每次都去翻手册。
---

### Bash 内建

- `pushd /path` `popd` : 目录栈切换
- `dirs -v` : 查看目录栈
- `read -ra arr <<< "a b c"` : 分割成数组
- `getopts` : 解析短参数
- `shopt -s nullglob` : 空匹配时不保留字面量

### 外部命令高频组合

- `find . -name "*.txt" -type f` : 按名称查文件
- `find . -name "*.log" | xargs rm` : 管道到 `xargs`
- `sed -n '1,5p' file` : 打印指定行
- `awk '{print $1, $3}' file` : 列处理
- `grep -r "pattern" .` : 递归搜索

```bash
while getopts "ab:c" opt; do
  case "$opt" in
    a) flag_a=1 ;;
    b) value_b="$OPTARG" ;;
    *) exit 1 ;;
  esac
done
```

## ✅ 最佳实践
---
lang: bash
emoji: ✅
link: https://www.gnu.org/software/bash/manual/bash.html
desc: 能显著减少线上脚本事故的，不是更炫的语法，而是几条稳定的工程约束。
---

- `set -euo pipefail` : 开启严格模式
- `trap '...' ERR` : 打印错误上下文
- `bash -x script.sh` : 调试执行过程
- `[[ ... ]]` 优于 `[ ... ]` : 语义更现代，坑更少
- 所有变量都加双引号，除非你明确需要单词分割

```bash
#!/usr/bin/env bash
set -euo pipefail

trap 'echo "error on line $LINENO"' ERR

main() {
  local name="${1:-world}"
  echo "hello ${name}"
}

main "$@"
```
