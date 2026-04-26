# WSL2 参考链接

## 官方仓库与发布

- [microsoft/WSL GitHub 仓库](https://github.com/microsoft/WSL)
- [WSL 2.6.3 Release](https://github.com/microsoft/WSL/releases/tag/2.6.3)

## 官方文档

- [Basic commands for WSL](https://learn.microsoft.com/en-us/windows/wsl/basic-commands)
- [Working across Windows and Linux file systems](https://learn.microsoft.com/en-us/windows/wsl/filesystems)
- [WSL Release Notes](https://learn.microsoft.com/en-us/windows/wsl/release-notes)

## 正文关键结论映射

- 安装、状态、更新、关闭：`wsl --install` / `wsl --status` / `wsl --update` / `wsl --shutdown`
- 运行命令与指定发行版：`wsl <command>` / `-d` / `-u` / `-e` / `--cd`
- 生命周期管理：`--set-default` / `--set-version` / `--terminate` / `--unregister`
- 迁移与磁盘：`--export` / `--import` / `--import-in-place` / `--mount`
- 文件系统互操作：`\\wsl$`、`/mnt/c`、从 WSL 调 Windows 程序
- 环境变量传递：`WSLENV`
- shell 启动差异的底层规则参考 Bash 手册：
  [Bash Startup Files](https://www.gnu.org/software/bash/manual/bash.html#Bash-Startup-Files)
