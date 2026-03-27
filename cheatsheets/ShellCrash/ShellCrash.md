---
title: ShellCrash 速查 + Cookbook
lang: bash
version: "1.9.4"
date: 2026-02-15
github: juewuy/ShellCrash
colWidth: 420px
---
# ShellCrash 速查 + Cookbook

## 快速定位
---
lang: bash
emoji: 🚦
link: https://github.com/juewuy/ShellCrash
desc: ShellCrash 是面向 Linux / OpenWrt / 路由器 / Docker 环境的代理与流量转发管理脚本，核心价值不是“单条命令很多”，而是把内核管理、配置导入、模式切换、面板、定时任务和维护动作收拢到一套 Shell 菜单里。
---
### 它最适合解决什么问题？
- 在 Shell 环境里部署和管理 `mihomo` / `sing-box` 内核。
- 把“订阅导入、配置检查、规则更新、面板管理、开机自启”放在同一条工作流里。
- 在路由器、本机、保守模式、Docker 等不同运行环境之间切换。

### 最短路径
```bash
# 进入交互菜单
crash

# 看命令帮助
crash -h

# 直接启动 / 停止服务
crash -s start
crash -s stop

# 调试启动脚本
crash -d
```

### 顶层菜单怎么理解？
- `1` 启动服务：配置差不多就绪后直接起服务。
- `2` 设置：处理运行模式、端口、DNS、转发相关基础项。
- `4` 自启动：解决开机自启、守护、启动脚本问题。
- `5` 任务：定时更新、周期维护、自动任务。
- `6` 核心配置：内核、配置文件、订阅与配置检查的主入口。
- `7` 网关：适合路由器/旁路由场景的网关类设置。
- `8` 工具：附加工具与实用脚本入口。
- `9` 更新：更新脚本、切换版本、维护组件。

## 最小工作流
---
lang: bash
emoji: 🧭
link: https://raw.githubusercontent.com/juewuy/ShellCrash/dev/scripts/menu.sh
desc: 真正高频的使用路径是“进菜单 -> 导入或整理配置 -> 选内核和模式 -> 启动 -> 看状态/面板 -> 打开定时任务”，不是一开始就深挖细节。
---
### 第一次装好之后先做什么？
1. 运行 `crash` 进入主菜单。
2. 先去 `6 核心配置`，确认使用 `mihomo` 还是 `sing-box`，并导入订阅或配置文件。
3. 再去 `2 设置` 处理运行模式、端口、DNS 与转发项。
4. 回主菜单执行 `1 启动服务`。
5. 能跑通后再去 `4 自启动` 与 `5 任务` 收尾。

### 最小闭环检查
```bash
# 看帮助是否正常
crash -h

# 直接拉起服务
crash -s start

# 需要停服务时
crash -s stop

# 仅初始化环境或补充启动文件
start.sh init
```

### 如果你是不同设备，入口重点不同
- 路由器 / OpenWrt 场景，优先关注 `7 网关`、`2 设置`、`4 自启动`。
- 普通 Linux 主机场景，优先关注 `6 核心配置`、`2 设置`、`5 任务`。
- Docker：重点是容器网络、持久化目录、内核与配置挂载是否完整。
- 老旧设备 / 第三方固件：优先确认是否需要“保守模式”，再谈规则和高级功能。

## 高频场景 Recipes
---
lang: bash
emoji: 🧩
link: https://raw.githubusercontent.com/juewuy/ShellCrash/dev/README_CN.md
desc: ShellCrash 更像“场景驱动工具箱”。下面按实际动作组织，而不是按脚本目录平铺。
---
### 场景 1：先把服务跑起来
- 入口命令是 `crash`。
- 主路径通常是 `6 核心配置` -> `2 设置` -> `1 启动服务`。
- 判断标准：服务能启动，面板可访问，流量按预期接管或转发。

### 场景 2：切换内核或修配置
- 主要入口在 `6 核心配置`。
- 适用时机：订阅能拉到但运行异常、某些规则或语法不兼容、你需要从 `mihomo` 切到 `sing-box`。
- 先做什么：先切内核，再跑配置检查，再重启服务。

### 场景 3：把它变成稳定旁路由 / 网关
- 常用组合入口是 `7 网关` + `2 设置` + `4 自启动`。
- 适用时机：ShellCrash 跑在路由器、旁路由、小主机、软路由里，需要长期在线。
- 收尾动作：确认自启动、任务计划、端口不冲突、规则会自动更新。

### 场景 4：需要可视化面板
- 适用时机：你要看连接、策略组、规则命中和流量，不想只盯着终端。
- 典型动作：先让服务稳定运行，再安装或切换本地 Dashboard。
- 注意：面板能打开，不等于配置正确；面板打不开，先排查端口、目录和服务状态。

### 场景 5：准备长期维护
- 维护主入口通常是 `5 任务` + `9 更新`。
- 适用时机：订阅和规则需要定时刷新，或者你要周期性更新脚本/内核。
- 核心动作：把“自动更新”与“手动更新”分开，先验证一次手动链路，再上定时任务。

### 速查：场景到菜单
| 目标 | 先看哪里 | 再看哪里 |
| --- | --- | --- |
| 导入订阅 / 配置 | `6 核心配置` | `1 启动服务` |
| 切换运行模式 | `2 设置` | `1 启动服务` |
| 做开机自启 | `4 自启动` | `crash -s start` |
| 配自动更新 | `5 任务` | `9 更新` |
| 看网关相关 | `7 网关` | `2 设置` |
| 停服务排障 | `3 停止服务` | `crash -d` |

## 入口、命令与菜单速查
---
lang: bash
emoji: 📌
link: https://raw.githubusercontent.com/juewuy/ShellCrash/dev/scripts/menu.sh
desc: ShellCrash 的命令行接口本身不算多，高频主要是 `crash` 入口、`-s start/stop`、调试与卸载；其余动作大多通过菜单完成。
---
### 命令速查
```bash
# 进入主菜单
crash

# 简洁界面
crash -l

# 帮助
crash -h

# 启动 / 停止服务
crash -s start
crash -s stop

# 调试模式
crash -d

# 卸载
crash -u

# 初始化
crash -i
start.sh init
```

### 菜单地图
```text
1 启动服务
2 设置
3 停止服务
4 自启动
5 任务
6 核心配置
7 网关
8 工具
9 更新
0 退出
```

### 你什么时候优先用命令，而不是菜单？
- 自动化脚本里如果只需要启停服务，直接用 `crash -s start|stop`。
- 需要确认安装是否正常时，先用 `crash -h`。
- 启动链路有问题时，用 `crash -d` 生成调试信息。
- 大部分配置变更：还是回到交互菜单更稳。

## 运行模式与环境决策
---
lang: bash
emoji: 🌐
link: https://raw.githubusercontent.com/juewuy/ShellCrash/dev/README_CN.md
desc: ShellCrash 的难点通常不在“命令记不住”，而在“这台设备该跑哪种模式、依赖是否满足、什么时候需要保守模式或 Docker”。
---
### 常见决策
- 路由器 / OpenWrt：优先把它当网关类工具来配置，重点是流量接管、自启动、防火墙规则。
- Linux 主机：更像本机代理服务，优先看内核、配置文件和服务启停。
- 如果依赖不全，比如没有 `iptables` / `nftables`，很多场景只能退回纯净模式。
- 老旧或兼容性差的固件：优先考虑保守模式，再逐步开启额外能力。

### 依赖速查
| 组件 | 必要性 | 影响 |
| --- | --- | --- |
| `curl` / `wget` | 必须 | 订阅、在线安装、更新都依赖它 |
| `iptables` / `nftables` | 很重要 | 缺少时只能跑纯净模式或能力受限 |
| `crontab` | 较低 | 没它就没法稳定跑定时任务 |
| `net-tools` | 较低 | 端口检测和一些兼容逻辑会受影响 |
| `ubus` / `iproute` 相关工具 | 视环境而定 | 路由器上本机地址识别更依赖它们 |

### Quick Ref
```bash
# 先确认帮助与入口正常
crash -h

# 初始化启动环境
crash -i

# 起服务
crash -s start

# 停服务
crash -s stop
```

## 更新、任务与维护收尾
---
lang: bash
emoji: 🔁
link: https://github.com/juewuy/ShellCrash/releases
desc: ShellCrash 适合长期运行，所以“更新、任务、自启动、调试”不是边角料，而是日常维护主线。
---
### 维护顺序
1. 先确认当前配置能正常启动。
2. 再配置 `4 自启动`，保证重启后能拉起。
3. 然后配置 `5 任务`，让订阅、规则、更新动作自动化。
4. 最后再考虑 `9 更新` 与版本回退策略。

### 1.9.4 这一版值得关注的点
- 新增 TG 控制机器人，可做服务管理、日志查看、配置文件上传下载、备份还原等。
- 新增自定义公网 `vmess` / `ss` 入站能力。
- 新增 Tailscale / WireGuard 内网穿透入口。
- 支持更细的 DNS 劫持端口与更多内核版本分支选择。
- 强化自启检测、版本回退与守护逻辑。

### 维护动作速查
```bash
# 停掉当前服务后再做大改动
crash -s stop

# 改完再重新拉起
crash -s start

# 启动链路异常时跑调试
crash -d
```

## 排障与常见坑
---
lang: bash
emoji: 🛠
link: https://juewuy.github.io/chang-jian-wen-ti/
desc: 真正常见的问题大多集中在端口冲突、依赖缺失、配置格式不兼容、自启动失败和运行模式选错，而不是脚本本身“不会用”。
---
### 最常见的排障顺序
1. `crash -h` 是否能正常返回。
2. `crash -s stop` 后重新 `crash -s start`。
3. 回菜单看 `6 核心配置`，确认内核与配置类型是否匹配。
4. 回菜单看 `2 设置` / `7 网关`，确认模式、端口、DNS 没配反。
5. 仍有问题时执行 `crash -d`。

### 高概率问题
- 面板打不开：先查服务是不是起来了，再查端口和 Dashboard 目录。
- 订阅能导入但不能启动：优先怀疑内核与配置语法不兼容。
- 重启后失效：优先检查 `4 自启动`，再看系统服务或固件启动脚本。
- 规则或订阅总是过期：优先补 `5 任务`，不要只靠手工更新。
- 路由器场景异常：先怀疑网关模式、防火墙规则和 LAN 口识别。

### 调试速记
```bash
# 基础帮助
crash -h

# 调试启动链路
crash -d

# 初始化执行环境
crash -i

# 手动启停
crash -s stop
crash -s start
```

## Quick Ref
---
lang: bash
emoji: 🧷
link: https://github.com/juewuy/ShellCrash/releases
desc: 保留真正高频的入口、动作和判断顺序，适合临时抄命令与回忆菜单方向。
---
### 入口命令
```bash
crash
crash -l
crash -h
crash -i
crash -d
crash -u
```

### 服务动作
```bash
crash -s start
crash -s stop
start.sh init
```

### 菜单优先级
```text
6 核心配置   -> 处理内核 / 订阅 / 配置
2 设置       -> 处理模式 / 端口 / DNS / 转发
1 启动服务   -> 验证能否跑通
4 自启动     -> 做开机拉起
5 任务       -> 配自动更新
9 更新       -> 升级、回退、维护
7 网关       -> 路由器 / 旁路由重点入口
```

### 最小排障链
```bash
crash -h
crash -s stop
crash -s start
crash -d
```
