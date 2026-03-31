---
title: ssh 命令速查表
lang: bash
version: "OpenSSH_for_Windows_9.5p2"
date: 2026-03-30
github: openssh/openssh-portable
colWidth: 360px
---

# ssh 命令速查表

## 一眼入门
---
emoji: 🔑
link: https://man.openbsd.org/ssh
desc: `ssh` 是远程登录、远程执行、端口转发、跳板机连接的统一入口。
---

- `ssh user@host`：默认端口 22，使用当前私钥集合尝试登录
- `ssh -p 2222 user@host`：指定端口
- `ssh -i ~/.ssh/id_ed25519 user@host`：指定身份文件
- `ssh -l user host`：单独指定登录用户
- `ssh host "uname -a"`：登录后执行单条命令
- `ssh -t host "sudo systemctl restart app"`：强制分配 TTY，适合需要交互的远端命令
- `ssh -N host`：只建立连接，不执行远端命令
- `ssh -T host`：禁止分配 TTY，适合转发与管道任务
- `ssh -v/-vv/-vvv host`：递增调试输出
- `ssh -o Option=Value host`：临时覆盖配置

```bash
ssh user@prod.example.com
ssh -p 2222 user@10.0.0.12 "hostname && uptime"
ssh -i ~/.ssh/prod_ed25519 -t admin@server "sudo journalctl -u app -n 100"
```

## 身份与会话
---
emoji: 🪪
link: https://man.openbsd.org/ssh_config.5
desc: 这一组参数决定“用谁连、怎么连、连上后做什么”。
---

- `ssh -l user host`：指定登录用户
- `ssh -i key.pem host`：指定私钥
- `ssh -o IdentitiesOnly=yes host`：只使用指定密钥，避免客户端乱试
- `ssh -o PreferredAuthentications=publickey host`：优先使用公钥
- `ssh -o PubkeyAuthentication=no host`：临时关闭公钥认证
- `ssh -o PasswordAuthentication=no host`：禁止密码登录
- `ssh -o BatchMode=yes host`：非交互模式，脚本里避免卡住
- `ssh -A host`：转发本地 agent 到远端
- `ssh -a host`：禁止 agent 转发
- `ssh -C host`：启用压缩
- `ssh -n host cmd`：把 stdin 重定向到 `/dev/null`，避免占用终端
- `ssh -f host cmd`：后台执行，常与 `-N` 搭配
- `ssh -q host`：安静模式
- `ssh -o ConnectTimeout=10 host`：连接超时
- `ssh -o ServerAliveInterval=30 -o ServerAliveCountMax=3 host`：保活与断线检测

## 端口转发
---
emoji: 🧭
link: https://man.openbsd.org/ssh
desc: 端口转发把 SSH 变成“隧道工具”，本地转发、远程转发、动态代理都在这里。
---

- `ssh -L 127.0.0.1:5432:db.internal:5432 host`：本地转发
- `ssh -R 8080:127.0.0.1:3000 host`：远程转发，绑定到远端回环地址
- `ssh -D 127.0.0.1:1080 host`：动态转发，提供 SOCKS 代理
- `ssh -N -L ... host`：只建隧道，不开 shell
- `ssh -N -R ... host`：只暴露远端监听口
- `ssh -g -L ...`：允许远端主机访问本地转发端口
- `ssh -R 0.0.0.0:8080:127.0.0.1:3000 host`：让远端所有网卡都可访问，通常还需要服务器端 `GatewayPorts`
- `ssh -W host:port jump`：通过标准输入输出透传到后端，常用于代理链

```bash
# 把本地 5432 转到内网数据库
ssh -N -L 127.0.0.1:5432:10.0.2.15:5432 bastion

# 用 SSH 提供本地 SOCKS5 代理
ssh -N -D 127.0.0.1:1080 jump-host

# 把本机 3000 暴露给远端服务器
ssh -N -R 8080:127.0.0.1:3000 host
```

## 跳板与代理链
---
emoji: 🪜
link: https://man.openbsd.org/ssh_config.5
desc: 先穿过堡垒机，再到目标机，是最常见的生产连接方式。
---

- `ssh -J bastion target`：直接指定跳板机
- `ssh -J user@bastion:2222 user@target`：跳板也可自定义用户和端口
- `ssh -o ProxyJump=bastion target`：用配置项写法
- `ssh -o ProxyCommand="ssh -W %h:%p bastion" target`：老版本兼容写法
- `ssh -W target:22 bastion`：让跳板机只负责转发，不开交互 shell
- `ssh -J bastion target "cmd"`：跳板后执行命令

```bash
ssh -J jump.example.com admin@10.10.0.25
ssh -o ProxyJump=bastion admin@10.10.0.25 "uptime"
```

## 配置文件
---
emoji: ⚙️
link: https://man.openbsd.org/ssh_config.5
desc: `~/.ssh/config` 让常用主机名、密钥、跳板、转发规则固定下来。
---

- `Host alias`：匹配主机别名
- `HostName 10.0.0.25`：真正的目标地址
- `User admin`：默认登录用户
- `Port 2222`：默认端口
- `IdentityFile ~/.ssh/prod_ed25519`：默认密钥
- `ProxyJump bastion`：默认跳板
- `ForwardAgent yes`：默认 agent 转发
- `ServerAliveInterval 30`：保活
- `ControlMaster auto`：开启连接复用
- `ControlPath ~/.ssh/cm-%r@%h:%p`：复用控制 socket
- `ControlPersist 10m`：后台保持复用连接
- `StrictHostKeyChecking yes|no|ask`：主机指纹校验策略
- `StrictHostKeyChecking accept-new`：新版本常用的折中策略
- `UserKnownHostsFile ~/.ssh/known_hosts`：指定已知主机文件
- `Include ~/.ssh/config.d/*.conf`：拆分配置

```bash
Host prod
  HostName 10.0.0.25
  User admin
  Port 2222
  IdentityFile ~/.ssh/prod_ed25519
  ProxyJump bastion
  ServerAliveInterval 30
  ControlMaster auto
  ControlPath ~/.ssh/cm-%r@%h:%p
  ControlPersist 10m
```

## 密钥与主机
---
emoji: 🗝️
link: https://man.openbsd.org/ssh-keygen.1
desc: 登录体验和安全边界，基本都由密钥体系决定。
---

- `ssh-keygen -t ed25519 -C "you@example.com"`：生成主密钥
- `ssh-keygen -f ~/.ssh/id_ed25519 -p`：修改密钥口令
- `ssh-keygen -y -f ~/.ssh/id_ed25519`：从私钥导出公钥
- `ssh-keygen -lf ~/.ssh/id_ed25519.pub`：查看指纹
- `ssh-keygen -R host`：从 `known_hosts` 删除旧指纹
- `ssh-keygen -F host`：在 `known_hosts` 中查找
- `ssh-keyscan host`：抓取远端公钥指纹
- `ssh-agent`：启动 agent
- `ssh-add ~/.ssh/id_ed25519`：把私钥加入 agent
- `ssh-add -l`：查看 agent 中的密钥
- `ssh-add -D`：清空 agent
- `ssh-add -t 1h key`：设定密钥有效期

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-add -l
ssh-keygen -lf ~/.ssh/id_ed25519.pub
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
```

## 场景 1：第一次连生产机
---
emoji: 🚪
link: https://man.openbsd.org/ssh
desc: 目标是“第一次能连上、第二次能稳定连上”，而不是单纯输一条命令。
---

- 先确认网络与端口：`ssh -v -p 22 user@host`
- 第一次看到主机指纹时，核对 fingerprint 再接受
- 固定密钥到 `~/.ssh/config`，别每次手敲 `-i`
- 密钥尽量用 `ed25519`，并设置口令
- 服务器端只保留必要的 `authorized_keys`

```bash
ssh-keygen -t ed25519 -C "laptop"
cat ~/.ssh/id_ed25519.pub | ssh user@host 'umask 077; mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'
ssh user@host
```

## 场景 2：通过堡垒机进内网
---
emoji: 🪜
link: https://man.openbsd.org/ssh_config.5
desc: 最常见的生产路径：先到跳板，再到目标，必要时把转发也一起带上。
---

- 最短命令：`ssh -J bastion target`
- 固定到配置：`ProxyJump bastion`
- 如果只想转发不想开 shell，用 `-W`
- 跳板上不要转发多余 agent，除非确实需要

```bash
ssh -J admin@bastion.example.com:2222 admin@10.0.1.8
ssh -o ProxyJump=admin@bastion.example.com:2222 admin@10.0.1.8 "uptime"
```

## 场景 3：用 SSH 做内网访问入口
---
emoji: 🧪
link: https://man.openbsd.org/ssh
desc: 让 SSH 充当临时网络入口，常见于数据库、Redis、K8s API、内网 HTTP 服务。
---

- `-L` 适合“本地应用访问远端内网服务”
- `-R` 适合“远端临时访问本地开发服务”
- `-D` 适合“浏览器/工具走 SOCKS 代理”
- `-N` 常与转发一起使用
- `-g` 会把本地转发口暴露给外部，风险更高

```bash
# 本地访问内网数据库
ssh -N -L 127.0.0.1:5432:db.internal:5432 bastion

# 让远端能访问你本机的开发服务
ssh -N -R 8080:127.0.0.1:3000 host

# 给浏览器挂 SOCKS5 代理
ssh -N -D 127.0.0.1:1080 proxy-host
```

## 场景 4：排错
---
emoji: 🧯
link: https://man.openbsd.org/ssh
desc: 遇到连不上，先分清是认证、主机密钥、网络，还是远端 shell 问题。
---

- `ssh -vvv host`：看握手细节
- `ssh -G host`：展开最终生效配置
- `ssh -Q key`：列出支持的 key 算法
- `ssh -Q cipher`：列出支持的加密算法
- `ssh -Q mac`：列出支持的 MAC
- `ssh -o PreferredAuthentications=publickey -o PubkeyAuthentication=yes host`：强制公钥路径
- `ssh -o IdentitiesOnly=yes -i key host`：只试这把钥匙
- `ssh-keygen -R host`：主机指纹冲突时先清理旧记录
- `ssh -o HostKeyAlgorithms=ssh-ed25519 host`：仅在兼容老旧设备时使用
- `ssh -o KexAlgorithms=curve25519-sha256 host`：仅在老设备握手失败时再考虑

## 常见坑
---
emoji: ⚠️
link: https://man.openbsd.org/ssh
desc: 这些问题最常见，也最容易误判成“SSH 坏了”。
---

- `Permission denied (publickey)`：通常是用户不对、密钥没进 `authorized_keys`、私钥没加载，或者权限过宽
- `Host key verification failed`：`known_hosts` 里旧指纹冲突，先核对再删
- `Connection timed out`：端口没通、ACL/安全组拦了、跳板机不可达
- `Pseudo-terminal will not be allocated`：远端命令不需要交互，或你用了 `-T`
- `stdin: is not a tty`：需要交互的命令缺少 `-t`
- `REMOTE HOST IDENTIFICATION HAS CHANGED!`：先确认服务器是否重装或 DNS/路由是否被劫持
- 长连任务建议加 `ServerAliveInterval` 和 `ControlPersist`
- 自动化脚本建议加 `BatchMode=yes`，避免卡在密码提示上

```bash
ssh -o BatchMode=yes -o ConnectTimeout=5 host "true"
ssh -o StrictHostKeyChecking=ask host
```

## 一屏总结
---
emoji: 🧾
link: https://man.openbsd.org/ssh
desc: 如果只记 8 条，先记这 8 条。
---

- `ssh user@host`：最基础登录
- `ssh -J bastion target`：跳板机
- `ssh -L local:remote`：本地转发
- `ssh -R remote:local`：远程转发
- `ssh -D port host`：SOCKS 代理
- `ssh -N`：只建隧道
- `ssh -G host`：展开配置
- `ssh-keygen -t ed25519`：生成密钥
