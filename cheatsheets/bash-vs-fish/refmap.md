参考与核对（官方手册）

- Bash Reference Manual（5.3）：https://www.gnu.org/software/bash/manual/
  - Command Line Editing（Readline）: html_node/Command-Line-Editing.html
  - Shell Parameter Expansion: html_node/Shell-Parameter-Expansion.html
  - Redirections: html_node/Redirections.html
  - Process Substitution: html_node/Process-Substitution.html
  - Arrays: html_node/Arrays.html
  - Conditional Constructs: html_node/Conditional-Constructs.html
  - Bash Conditional Expressions: html_node/Bash-Conditional-Expressions.html
  - The Set Builtin: html_node/The-Set-Builtin.html
  - Bash Builtin Commands: html_node/Bash-Builtins.html
  - Job Control: html_node/Job-Control.html
  - Shell Options（shopt）: html_node/The-Shopt-Builtin.html
  
- Fish Shell Documentation（current）：https://fishshell.com/docs/current/
  - Tutorial
  - Commands
  - Language
  - Variables
  - Functions
  - Completion
  - Abbreviations

说明

- 本页内容已对照上述章节进行审查：
  - 修正了“命令行编辑”中混入的 Vim 查找/替换指令（不属于 Bash/Readline）。
  - 补充了参数展开的默认/赋值/报错/替代、前后缀剥离、全局替换与大小写变换等。
  - 补充了 extglob/globstar、进程替换、Here 文档/Here 字符串与 pipefail。
  - 区分了 [ ] 与 [[ ]] 的语义差异（路径名展开与分词行为）。
