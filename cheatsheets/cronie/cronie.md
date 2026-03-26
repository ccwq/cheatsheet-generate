---
title: Cronie 速查 + Cookbook
lang: bash
version: 1.7.2
date: 2024-04-08
github: cronie-crond/cronie
colWidth: 500px
---

# Cronie 速查 + Cookbook

## cron 语法详解
---
emoji: 🧩
link: https://github.com/cronie-crond/cronie/blob/master/man/crontab.5
desc: 先把 cron 表达式本身讲透：字段顺序、可用取值、范围 / 列表 / 步进 / 随机、以及 `@daily` 这类别名。后面的 recipes 都建立在这块语法上。
---

### 一行 cron 的结构

```bash
# 用户 crontab
分钟 小时 日 月 星期 命令

# 系统 crontab / etc/cron.d
分钟 小时 日 月 星期 用户 命令
```

- 用户 crontab 只有 5 个时间字段，后面直接跟命令。
- 系统 crontab 和 `/etc/cron.d/` 多一个 `user` 字段，必须写清楚由谁执行。
- `cron` 每分钟检查一次是否匹配当前时间。

### 五个字段分别表示什么

- `minute`：`0-59`
- `hour`：`0-23`
- `day of month`：`1-31`
- `month`：`1-12`，也可以用 `jan-dec`
- `day of week`：`0-7`，`0` 和 `7` 都表示周日，也可以用 `sun-sat`

### 最基础的写法

```bash
0 3 * * * /usr/local/bin/job.sh
```

- `0` 分钟：整点触发。
- `3` 小时：凌晨 3 点。
- `* * *`：每月、每周都不限制。

### 常用语法符号

- `*`：全部取值。
- `1-5`：范围，包含两端。
- `1,2,5`：列表，多个值并列。
- `*/2`：步进，表示“每 2 个单位一次”。
- `jan-mar` / `mon-fri`：名字写法，可读性更高。
- `~`：范围内随机取值，解析表时就确定。

### 典型例子

```bash
# 每 5 分钟一次
*/5 * * * * /usr/local/bin/poll.sh

# 每天 2:30
30 2 * * * /usr/local/bin/nightly.sh

# 工作日 9 点
0 9 * * 1-5 /usr/local/bin/workday.sh

# 每月 1 号 0 点
0 0 1 * * /usr/local/bin/monthly.sh

# 每周一到周五 18:00
0 18 * * mon-fri /usr/local/bin/close-day.sh
```

### `day of month` 和 `day of week` 的关系

- 这两个字段是“或”关系，不是“且”关系。
- 也就是说，只要其中一个字段匹配，任务就会触发。
- 例如 `0 0 1 * mon` 会在每个月 1 号，或者每周一执行。

### 特殊别名

- `@reboot`：开机后执行一次
- `@hourly`：每小时执行一次
- `@daily`：每天执行一次
- `@weekly`：每周执行一次
- `@monthly`：每月执行一次
- `@yearly` / `@annually`：每年执行一次

```bash
@daily /usr/local/bin/daily.sh
@reboot /usr/local/bin/init.sh
```

### 变量写法

```bash
MAILTO=ops@example.com
CRON_TZ=Asia/Shanghai
RANDOM_DELAY=15
```

- `MAILTO` 控制任务输出邮件收件人。
- `CRON_TZ` 只影响当前表的时间解释。
- `RANDOM_DELAY` 会给任务增加随机延迟上限。

## 快速定位
---
emoji: ⏱️
link: https://github.com/cronie-crond/cronie
desc: Cronie 是 Linux 上的 cron/anacron 工具集。`crond` 负责按分钟调度，`crontab` 负责用户表和系统表，`anacron` 负责“机器不常在线也别漏跑”，`cronnext` 负责查下一次执行时间。先按场景选入口，再回到速查卡抄参数。
---

- 适合定时任务、日志轮转、备份、清理、同步、巡检这类“按时间触发”的系统任务。
- 适合需要区分用户 crontab、系统 crontab、`/etc/cron.d/`、`/etc/anacrontab` 的场景。
- 如果机器并非 24/7 在线，优先考虑 `anacron`，不要只靠 `crond`。

## 入口分工
---
emoji: 🧭
link: https://github.com/cronie-crond/cronie/blob/master/README
desc: 先分清四个入口，再决定你要查的是守护进程、表文件、补跑机制，还是下一次执行时间。
---

- `crond`：守护进程，负责扫描并执行任务。
- `crontab`：维护用户 crontab，支持查看、编辑、删除、校验。
- `anacron`：按“天”级别补跑任务，适合非连续开机设备。
- `cronnext`：计算下一次会执行的 job，适合排障和预估窗口。
- `crontab -T`：只做语法检查，不安装。
- `crond -c` / `crontab -n`：集群共享 spool 时的 host 选择相关能力。

## 最小工作流
---
emoji: 🚀
link: https://github.com/cronie-crond/cronie/blob/master/man/crontab.1
desc: 先把“启动守护进程 -> 写表 -> 校验 -> 观察下一次执行”这条链跑通，再决定要不要引入系统表、cron.d 或 anacron。
---

```bash
# 1) 确认守护进程在跑
systemctl start crond
systemctl status crond

# 2) 先读再改当前用户表
crontab -l
crontab -e

# 3) 先校验，再安装
crontab -T ./my.crontab

# 4) 预估下一次执行时间
cronnext -l
```

```bash
# /etc/cron.d/ 示例
# 5 个时间字段 + 用户名 + 命令
SHELL=/bin/bash
MAILTO=root
0 2 * * * root /usr/local/bin/backup.sh
```

## 高频 Recipes
---
emoji: 🍳
link: https://github.com/cronie-crond/cronie/blob/master/man/crontab.5
desc: 这里按“今天真会遇到的事情”组织：用户任务、系统任务、离线补跑、下一次执行时间、集群共享。
---

### 1. 给某个用户加一个每天任务

```bash
crontab -e
```

```bash
MAILTO=ops@example.com
0 3 * * * /usr/local/bin/daily-report.sh
```

- 用 `MAILTO=""` 可以禁用邮件。
- `MAILFROM` 可以改发件人，且会继承 `crond` 进程环境里的值。

### 2. 写系统级任务，不碰用户表

```bash
# /etc/cron.d/cleanup
SHELL=/bin/bash
PATH=/usr/sbin:/usr/bin:/bin
0 */6 * * * root /usr/local/bin/cleanup.sh
```

- `/etc/cron.d/` 里的每条记录都要写用户名。
- 这类任务更适合做系统级运维脚本。

### 3. 机器不常在线时，用 anacron 补跑

```bash
anacron -s
```

```bash
# /etc/anacrontab
SHELL=/bin/sh
PATH=/sbin:/bin:/usr/sbin:/usr/bin
1   5   cron.daily   run-parts /etc/cron.daily
7   10  cron.weekly  run-parts /etc/cron.weekly
@monthly 15 cron.monthly run-parts /etc/cron.monthly
```

- `anacron` 以“天”为周期，不管你精确错过了几点。
- 适合每天/每周/每月这类 housekeeping 任务。

### 4. 想知道下一次到底什么时候跑

```bash
cronnext -l
cronnext -j backup -l
cronnext -s -c
```

- `-j` 用子串过滤 job。
- `-l` 打印完整 entry。
- `-c` 列出每条任务的下一次执行时间。

### 5. 集群共享 `/var/spool/cron`

```bash
crond -c
crontab -n node-a
crontab -c
```

- `-c` 开启 cluster support。
- `crontab -n` 选择哪个 host 跑共享 spool 里的任务。
- `/etc/crontab` 和 `/etc/cron.d/` 不受这个开关影响。

## 速查卡
---
emoji: 🧾
link: https://github.com/cronie-crond/cronie/blob/master/README
desc: 只保留最常抄的命令、参数和语法规则。遇到复杂场景，先回上面的 recipes。
---

### `crontab` 常用命令

- `crontab -l`：查看当前表。
- `crontab -e`：编辑当前表。
- `crontab -r`：删除当前表。
- `crontab -i -r`：删除前确认。
- `crontab -T file`：测试语法，不安装。
- `crontab -u user`：操作指定用户的表。
- `crontab -s`：编辑前加上当前 SELinux 上下文。
- `crontab -n [hostname]`：为 cluster 选择运行 host。
- `crontab -c`：查询当前 cluster 选择的 host。

### `crond` 常用参数

- `crond -n`：前台运行。
- `crond -f`：同 `-n`。
- `crond -s`：把 job 输出发到 syslog。
- `crond -m <mail command>`：指定邮件发送命令。
- `crond -i`：禁用 inotify。
- `crond -p`：允许接受任意用户写的 crontab。
- `crond -P`：不重置 `PATH`，沿用环境变量。
- `crond -c`：启用 cluster support。
- `crond -V`：显示版本。

### cron 表达式

- 顺序是 `minute hour day-of-month month day-of-week command`。
- `*`：全部取值。
- `1-5`：范围。
- `1,2,5`：列表。
- `*/2`：步进。
- `jan-mar` / `mon,wed,fri`：月份或星期名。
- `~`：在范围内随机取值，启动时就确定。
- `@reboot` / `@hourly` / `@daily` / `@weekly` / `@monthly` / `@yearly`：快捷写法。

### 常见环境变量

- `SHELL`：默认 shell，默认 `/bin/sh`。
- `HOME` / `LOGNAME`：从账号信息继承，`LOGNAME` 不能改。
- `MAILTO`：结果邮件发送目标。
- `MAILFROM`：邮件发件人，可从 `crond` 进程环境继承。
- `CRON_TZ`：当前表使用的时区。
- `RANDOM_DELAY`：随机延迟上限，daemon 启动时固定随机系数。
- `MLS_LEVEL`：SELinux 多级上下文。
- `XDG_SESSION_CLASS`：PAM/systemd session class。

## 决策与坑
---
emoji: ⚠️
link: https://github.com/cronie-crond/cronie/blob/master/man/cron.8
desc: 最容易出问题的不是命令本身，而是“你以为 cron 会自动理解你的意图”。下面这些点值得优先记住。
---

- `day of month` 和 `day of week` 是“或”关系，不是“且”关系。
- DST 跳过的不存在时间不会触发，重复出现的时间可能跑两次。
- `MAILTO=""` 是禁用邮件，不是空地址转发。
- `MAILFROM` 如果不显式设置，会用执行用户。
- root 的 crontab entry 如果首字符是 `-`，可以压掉 syslog 记录。
- crontab 文件末尾缺少换行会被视为损坏，建议始终保留换行。
- `crontab -T` 发现第一个错误就会停，不会一次报完所有问题。
