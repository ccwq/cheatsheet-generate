# Starship 参考资源

## 官方入口
- [GitHub 仓库](https://github.com/starship/starship) - 源码、README、发布说明
- [官网](https://starship.rs/) - 项目首页
- [配置文档（中文）](https://starship.rs/zh-CN/config/) - 本次 cheatsheet 的主要参考
- [配置文档（英文）](https://starship.rs/config/) - 英文原版配置说明
- [安装文档](https://starship.rs/install/) - 各平台安装方式
- [高级配置](https://starship.rs/zh-CN/advanced-config/) - format 语法、样式字符串、条件格式

## 高价值模块
- [character](https://starship.rs/zh-CN/config/#character) - 提示符末尾符号
- [directory](https://starship.rs/zh-CN/config/#directory) - 当前目录与截断
- [git_branch](https://starship.rs/zh-CN/config/#git-branch) - Git 分支
- [git_status](https://starship.rs/zh-CN/config/#git-status) - Git 工作区状态
- [cmd_duration](https://starship.rs/zh-CN/config/#cmd-duration) - 命令耗时
- [package](https://starship.rs/zh-CN/config/#package) - 项目包版本
- [python](https://starship.rs/zh-CN/config/#python) - Python/虚拟环境
- [rust](https://starship.rs/zh-CN/config/#rust) - Rust 版本
- [hostname](https://starship.rs/zh-CN/config/#hostname) - 主机名 / SSH
- [time](https://starship.rs/zh-CN/config/#time) - 时间显示
- [status](https://starship.rs/zh-CN/config/#status) - 上一个命令的退出状态
- [shell](https://starship.rs/zh-CN/config/#shell) - 当前 shell 标识
- [jobs](https://starship.rs/zh-CN/config/#jobs) - 后台任务数量
- [fill](https://starship.rs/zh-CN/config/#fill) - 自动填充对齐

## 学习顺序建议
1. 先看配置文件路径与 `format`
2. 再看 `character`、`directory`、`git_branch`、`git_status`
3. 需要工程化提示时再加 `cmd_duration`、`time`、`status`
4. 想做语言自动识别时再启用 `python`、`rust`、`nodejs`
