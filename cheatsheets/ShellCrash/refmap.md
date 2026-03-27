# ShellCrash 参考映射

## 官方入口
- [GitHub 仓库](https://github.com/juewuy/ShellCrash) - 项目主页，适合回到总入口定位源码、Issue 与 Release。
- [中文 README](https://github.com/juewuy/ShellCrash/blob/dev/README_CN.md) - 中文概览、设备支持、安装入口与基础使用说明。
- [英文 README](https://github.com/juewuy/ShellCrash/blob/dev/README.md) - 与中文文档互补，便于交叉确认描述。
- [Releases](https://github.com/juewuy/ShellCrash/releases) - 版本发布、更新说明、历史变更与下载产物。

## 入口与菜单
- [scripts/menu.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/menu.sh) - `crash` 主入口、参数开关、顶层菜单映射与调试入口。
- [install.sh](https://github.com/juewuy/ShellCrash/blob/dev/install.sh) - 中文安装脚本入口。
- [install_en.sh](https://github.com/juewuy/ShellCrash/blob/dev/install_en.sh) - 英文安装脚本入口。
- [version](https://github.com/juewuy/ShellCrash/blob/dev/version) - 当前开发分支版本号文件。

## 运行与启动链路
- [scripts/start.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/start.sh) - 服务启停主脚本。
- [scripts/starts](https://github.com/juewuy/ShellCrash/tree/dev/scripts/starts) - 启动链路、检查逻辑、防火墙、兼容模式与系统服务文件集合。
- [scripts/starts/fw_iptables.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/starts/fw_iptables.sh) - `iptables` 路径下的防火墙与转发逻辑。
- [scripts/starts/fw_nftables.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/starts/fw_nftables.sh) - `nftables` 路径下的防火墙与转发逻辑。
- [scripts/starts/check_network.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/starts/check_network.sh) - 启动前网络环境检查。

## 菜单功能模块
- [scripts/menus](https://github.com/juewuy/ShellCrash/tree/dev/scripts/menus) - 交互菜单全集。
- [scripts/menus/2_settings.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/menus/2_settings.sh) - 运行模式、端口、DNS、转发等基础设置。
- [scripts/menus/4_setboot.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/menus/4_setboot.sh) - 开机自启与守护相关入口。
- [scripts/menus/5_task.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/menus/5_task.sh) - 定时任务与自动更新入口。
- [scripts/menus/6_core_config.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/menus/6_core_config.sh) - 内核选择、配置与订阅主入口。
- [scripts/menus/7_gateway.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/menus/7_gateway.sh) - 路由器 / 网关类场景入口。
- [scripts/menus/8_tools.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/menus/8_tools.sh) - 附加工具入口。
- [scripts/menus/9_upgrade.sh](https://github.com/juewuy/ShellCrash/blob/dev/scripts/menus/9_upgrade.sh) - 更新、回退与维护入口。

## 相关资源
- [Docker Hub](https://hub.docker.com/r/juewuy/shellcrash) - Docker 镜像入口。
- [常见问题](https://juewuy.github.io/chang-jian-wen-ti/) - FAQ 与常见故障定位入口。
- [本地安装教程](https://juewuy.github.io/bdaz) - 无法在线安装时的替代路径。
- [Telegram 讨论组](https://t.me/ShellClash) - 使用交流与反馈入口。

## 版本备注
- 本条目正文以 GitHub 最新正式 Release `1.9.4` 为准，发布时间为 `2026-02-15`。
- 当前 `dev` 分支版本文件显示为 `1.9.5alpha12`，说明仓库主线已继续向下一个开发版本演进；若菜单或功能细节与正式版有差异，优先以 Release 页面核对。
