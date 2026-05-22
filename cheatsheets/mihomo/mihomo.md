---
title: mihomo 配置速查
lang: yaml
version: v1.19.25
date: 2026-05-16
github: MetaCubeX/mihomo
colWidth: 340px
---

## 快速定位

mihomo 是 MetaCubeX 的核心代理引擎，支持多种代理协议与路由规则。

### 安装方式

| 系统 | 安装命令 |
| --- | --- |
| Linux/macOS | `curl -Ls https://raw.githubusercontent.com/MetaCubeX/mihomo/master/release inst.sh \| sh` |
| Windows | 从 [GitHub Releases](https://github.com/MetaCubeX/mihomo/releases) 下载 `.zip` 包 |
| Docker | `docker pull metacubex/mihomo` |
| OpenWrt | 通过 `ShellCrash` 管理器安装 |

### 最小配置

```yaml
mixed-port: 7890
allow-lan: false
mode: rule
log-level: info
dns:
  enable: true
  listen: 0.0.0.0:53
  enhanced-mode: fake-ip
  nameserver:
    - https://doh.pub/dns-query
proxies:
  - name: "example"
    type: vmess
    server: example.com
    port: 443
    uuid: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    alterId: 0
    cipher: auto
proxy-groups:
  - name: auto
    type: select
    proxies:
      - example
rules:
  - MATCH,auto
```

## DNS 配置
---
lang: yaml
desc: DNS 是代理分流的核心，控制域名解析与污染判断
---

### 核心参数

| 参数 | 说明 |
| --- | --- |
| `enable` | 是否启用 DNS；false 则使用系统 DNS |
| `enhanced-mode` | `fake-ip`（推荐）或 `redir-host` |
| `fake-ip-range` | 假 IP 范围，默认 `198.18.0.1/16` |
| `cache-algorithm` | 缓存算法：`lru` 或 `arc` |

### nameserver-policy 域名分流

```yaml
nameserver-policy:
  '+.arpa': 10.0.0.1                    # 内网用专用 DNS
  '+.cn': https://doh.pub/dns-query      # 国内域名走国内 DNS
  '+.google.com': 8.8.8.8               # 指定域名走特定 DNS
```

### fallback-filter 污染判断

```yaml
fallback-filter:
  geoip: true
  geoip-code: CN
  geosite: [gfw]
  ipcidr: [240.0.0.0/4]
  domain: ['+.google.com', '+.facebook.com']
```

### DNS 附加参数

```yaml
nameserver:
  - 'https://8.8.8.8/dns-query#proxy&skip-cert-verify=true'
  # #proxy     指定代理出口
  # #eth0      指定网络接口
  # #RULES     按规则路由
  # h3         强制 HTTP/3
  # ecs=1.2.3.4/24   设置 EDNS Client Subnet
  # disable-ipv6     丢弃 AAAA 响应
```

## 入站配置
---
lang: yaml
desc: 入站协议决定客户端如何连接 mihomo
---

### mixed-port（混合代理）

```yaml
mixed-port: 7890        # 同时支持 HTTP/SOCKS5
allow-lan: true          # 允许局域网连接
```

### tun（透明代理）

```yaml
tun:
  enable: true
  stack: system           # system | gvisor | lwip
  dns-hijack:
    - 8.8.8.8:53
    - tcp://8.8.8.8:53
  auto-detect-interface: true
  auto-route: true
  mtu: 9000
  inet4-address: 172.19.0.1/16
  inet6-address: fdfe:dcba:9876::1/126
```

### redir-port / tproxy-port

```yaml
redir-port: 7891         # Linux REDIRECT 重定向
tproxy-port: 7892        # Linux TPROXY 透明代理
```

## 代理协议
---
lang: yaml
desc: 支持 20+ 种代理协议，按场景选择
---

### 通用字段

| 字段 | 说明 |
| --- | --- |
| `name` | 节点名称，必须唯一 |
| `type` | 代理类型 |
| `server` | 服务器地址 |
| `port` | 端口 |
| `ip-version` | `dual`/`ipv4`/`ipv6` |
| `udp` | 启用 UDP |
| `tfo` | TCP Fast Open |
| `mptcp` | TCP Multi-Path |
| `dialer-proxy` | 父级代理 |

### VMess

```yaml
- name: vmess-example
  type: vmess
  server: example.com
  port: 443
  uuid: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  alterId: 0
  cipher: auto
  tls: true
  sni: example.com
  alpn: [h2, http/1.1]
```

### VLESS

```yaml
- name: vless-example
  type: vless
  server: example.com
  port: 443
  uuid: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  flow: xtls-rprx-vision
  tls: true
  sni: example.com
```

### Trojan

```yaml
- name: trojan-example
  type: trojan
  server: example.com
  port: 443
  password: your-password
  sni: example.com
  udp: true
```

### Shadowsocks 2022

```yaml
- name: ss2022-example
  type: ss
  server: example.com
  port: 443
  password: your-password
  cipher: 2022-blake3-aes-256-gcm
```

### Hysteria2

```yaml
- name: hysteria2-example
  type: hysteria2
  server: example.com
  port: 443
  password: your-password
  up: 100
  down: 100
  sni: example.com
```

### TUIC

```yaml
- name: tuic-example
  type: tuic
  server: example.com
  port: 443
  token: your-token
  uuid: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  password: your-password
  sni: example.com
```

### WireGuard

```yaml
- name: wg-example
  type: wireguard
  server: example.com
  port: 51820
  private-key: your-private-key
  peer-public-key: peer-public-key
  local-address: [10.0.0.2/32]
  peers:
    - allowed-ips: [0.0.0.0/0]
      endpoint: example.com:51820
```

### Stream Multiplexing（多路复用）

```yaml
smux:
  enabled: true
  protocol: h2mux      # smux | yamux | h2mux
  max-connections: 4
  min-streams: 4
  max-streams: 0
  padding: true
  brutal-opts:
    enabled: true
    up: 50
    down: 100           # Mbps
```

## 代理组
---
lang: yaml
desc: 策略组用于管理节点选择与故障转移
---

### 类型

| 类型 | 说明 |
| --- | --- |
| `select` | 手动选择 |
| `url-test` | 自动选择最快节点 |
| `fallback` | 自动回退到下一个可用节点 |
| `load-balance` | 负载均衡 |

### select（手动选择）

```yaml
proxy-groups:
  - name: proxy
    type: select
    proxies:
      - DIRECT
      - vmess-example
      - trojan-example
```

### url-test（自动测速）

```yaml
  - name: auto
    type: url-test
    proxies:
      - vmess-example
      - ss-example
    url: 'https://www.gstatic.com/generate_204'
    interval: 300
    lazy: true
    expected-status: 204
```

### fallback（故障转移）

```yaml
  - name: fallback
    type: fallback
    proxies:
      - primary-node
      - backup-node
    url: 'https://www.gstatic.com/generate_204'
    interval: 300
    lazy: false
    expected-status: 200/302/400-503
```

### load-balance（负载均衡）

```yaml
  - name: lb
    type: load-balance
    proxies:
      - node1
      - node2
    url: 'https://www.gstatic.com/generate_204'
    interval: 300
    lazy: true
```

### include-all 与 filter

```yaml
  - name: all-nodes
    type: select
    include-all: true          # 引入所有出站代理
    filter: "(?i)港|hk"        # 按名称过滤
    exclude-filter: "美国"     # 排除特定名称
    exclude-type: "Shadowsocks|Http"  # 按类型排除
```

## 路由规则
---
lang: yaml
desc: 规则决定流量走哪个出口
---

### 规则类型

| 规则 | 说明 |
| --- | --- |
| `DOMAIN` | 精确匹配域名 |
| `DOMAIN-SUFFIX` | 域名后缀 |
| `DOMAIN-KEYWORD` | 域名关键字 |
| `DOMAIN-WILDCARD` | 通配符 `*` `?` |
| `DOMAIN-REGEX` | 正则表达式 |
| `GEOSITE` | geosite 集合 |
| `IP-CIDR` | IP 范围 |
| `GEOIP` | 国家代码 |
| `DST-PORT` | 目标端口 |
| `SRC-PORT` | 源端口 |
| `PROCESS-NAME` | 进程名 |
| `RULE-SET` | 规则集合 |
| `AND/OR/NOT` | 逻辑组合 |
| `MATCH` | 兜底规则 |

### 基础规则

```yaml
rules:
  - DOMAIN,ad.com,REJECT
  - DOMAIN-SUFFIX,google.com,proxy
  - DOMAIN-KEYWORD,facebook,proxy
  - DOMAIN-WILDCARD,*.google.com,proxy
  - DOMAIN-REGEX,^abc.*com$,proxy

  - GEOSITE,youtube,proxy
  - GEOSITE,gfw,proxy

  - IP-CIDR,192.168.0.0/16,DIRECT,no-resolve
  - IP-CIDR6,2620:0:2d0:200::7/32,auto
  - GEOIP,CN,DIRECT
  - GEOIP,HK,proxy

  - DST-PORT,80,DIRECT
  - DST-PORT,443,proxy
  - SRC-PORT,7777,DIRECT

  - PROCESS-NAME,curl,DIRECT
  - PROCESS-PATH,/usr/bin/wget,proxy

  - NETWORK,udp,proxy

  - RULE-SET,provider-name,proxy
```

### 逻辑规则

```yaml
  - AND,((DOMAIN,baidu.com),(NETWORK,UDP)),DIRECT
  - OR,((NETWORK,UDP),(DOMAIN,baidu.com)),REJECT
  - NOT,((DOMAIN,baidu.com)),proxy
```

### 规则附加参数

```yaml
  - IP-CIDR,8.8.8.0/24,proxy,no-resolve
  # no-resolve  域名规则跳过 DNS 解析
  # src         将目标 IP 匹配转为来源 IP 匹配
```

### 兜底规则

```yaml
  - MATCH,auto
```

## 规则集合

```yaml
rule-providers:
  reject:
    type: http
    behavior: domain
    url: "https://example.com/ruleset/deny.yaml"
    path: ./ruleset/reject.yaml
    interval: 86400

  proxy:
    type: http
    behavior: ipcidr
    url: "https://example.com/ruleset/proxy.yaml"
    path: ./ruleset/proxy.yaml
    interval: 86400

rules:
  - RULE-SET,reject,REJECT
  - RULE-SET,proxy,proxy
  - GEOIP,CN,DIRECT
  - MATCH,auto
```

## 代理集合

```yaml
proxy-providers:
  my-provider:
    type: http
    url: "https://example.com/proxies.yaml"
    path: ./proxies/my-provider.yaml
    interval: 3600
    filter: "港|HK"
    include-all-proxies: false

proxy-groups:
  - name: provider-group
    type: select
    use:
      - my-provider
```

## 全局配置

```yaml
# 日志
log-level: info           # silent | error | warning | info | debug
log-format: json          # json | text

# HTTP/SOCKS5 代理端口
mixed-port: 7890
# authentication:          # 用户名密码认证
#   - username: password

# 允许局域网连接
allow-lan: true
bind-address: "*"         # 监听地址

# 运行模式
mode: rule               # rule | global | direct | script
# script:
#   path: ./script.js

# DNS 服务器
dns:
  enable: true
  listen: 0.0.0.0:1053
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  nameserver:
    - https://doh.pub/dns-query
  fallback:
    - tls://8.8.4.4
    - https://1.1.1.1/dns-query

# 外部控制 API
external-controller: 0.0.0.0:9090
# external-ui: ./ui
# secret: your-secret

# 路由表（Linux）
# routing-mark: 11451

# 自动重载
# file-path: ./config.yaml
# interval: 3600
```

## 快速命令
---
lang: text
desc: 常用操作命令速查
---

- 查看配置是否有效 : `mihomo -t -c config.yaml`
- 指定配置文件启动 : `mihomo -c config.yaml`
- 守护进程运行 : `mihomo -c config.yaml -d`
- 测试 DNS 解析 : `dig @127.0.0.1 -p 1053 google.com`
- 清理 DNS 缓存 : 通过 API `DELETE /cache/dns`