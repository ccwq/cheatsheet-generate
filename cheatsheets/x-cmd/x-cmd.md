# x-cmd 命令行增强工具

x-cmd 高效命令行工具，统一调用外部命令，支持批量和灵活扩展。

## 安装
npm install -g x-cmd
或使用 yarn/pnpm 安装

## 基本格式
x-cmd <模块> [子命令] [参数] [选项]

## 核心模块
- git：Git操作（clone/pull/push/branch/stash）
- npm：Node.js包管理
- fs：文件批量操作（copy/move/rm/touch/find）
- shell：执行Shell脚本，支持变量展开
- http：HTTP请求（download/get/post/put/delete）
- json：JSON格式化/查询/比较/转换
- regex：正则查找替换/批量处理
- tools：辅助工具（uuid/date/base64/hash）
- docker：Docker容器管理
- k8s：Kubernetes集群管理

## 通用选项
- -h/--help：帮助
- -v/--version：版本
- --dry-run：预览执行
- -q/--quiet：静默输出
- -d 变量=值1,值2：批量展开
- --concurrency：并发数
- --timeout：超时时间
- --verbose：详细输出

## 高级功能
- 管道操作：x-cmd cmd1 | x-cmd cmd2
- 条件执行：--then/--else
- 变量嵌套：{user}/{home}
- 环境变量注入

## 配置文件
~/.xcmddrc 全局配置，.xcmddrc 项目配置
支持别名、默认值、环境变量

## 最佳实践
使用--dry-run预览，配置alias简化调用，合理设置--concurrency控制并发，避免敏感信息命令行传递。