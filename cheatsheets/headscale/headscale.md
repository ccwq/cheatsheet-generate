---
title: Headscale 速查表
lang: bash
version: "0.28.0"
date: 2026-02-04
github: juanfont/headscale
colWidth: 460px
---

## 🧭 快速定位
---
lang: bash
emoji: 🧭
link: https://headscale.net/
desc: Headscale 是开源自托管的 Tailscale 控制服务器，用自己的服务器替代 Tailscale 官方服务。
---

- **一句话定位**：把 Tailscale 的控制端跑在自己服务器上，不依赖官方云服务
- **解决的问题**：数据自主、成本可控、不被 Tailscale 官方策略限制
- **典型场景**：私有 VPN、内网穿透、多云互通、团队网络
- **入口命令**：`headscale`
- **默认配置**：`/etc/headscale/config.yaml`
- **默认端口**：HTTP 8080，GRPC 9090

## 🚀 最小可运行实例
---
lang: bash
emoji: 🚀
link: https://headscale.net/installation/
desc: 用 Docker 快速起一个可用的 Headscale 服务，三行命令搞定基础部署。
---

### Docker 一键启动

```bash
# 创建配置目录
mkdir -p /etc/headscale
# 拉取官方配置模板
curl -L https://headscale.net/config -o /etc/headscale/config.yaml

# 启动容器（需要预先配置 config.yaml）
docker run -d \
  --name headscale \
  --restart always \
  -v /etc/headscale:/etc/headscale \
  -p 8080:8080 \
  -p 9090:9090 \
  ghcr.io/juanfont/headscale:0.28.0
```

### 初始化数据库

```bash
docker exec headscale headscale nodes init
```

### 创建预共享密钥（可选）

```bash
docker exec headscale headscale preauthkeys create \
  --expiration 24h \
  --prefix "dev-"
```

## 📡 节点注册与管理
---
lang: bash
emoji: 📡
link: https://headscale.net/running-headscale-docker/
desc: 节点（client）通过 `tailscale up` 连接 Headscale，认证方式支持 CLI 交互和预共享密钥两种。
---

### 预共享密钥方式注册（推荐自动化场景）

```bash
# 服务器端：创建带过期时间的密钥
docker exec headscale headscale preauthkeys create \
  --expiration 24h \
  --prefix "prod-"

# 客户端：使用密钥连接
tailscale up \
  --login-server http://<your-headscale-ip>:8080 \
  --authkey <generated-key> \
  --hostname my-server
```

### 手动认证方式（首次连接）

```bash
# 服务器端：查看待认证节点
docker exec headscale headscale nodes list

# 客户端：触发注册
tailscale up --login-server http://<your-headscale-ip>:8080

# 服务器端：用 verbose key 授权
docker exec headscale headscale nodes approve <node-key>
```

### 查看节点

```bash
# 列出所有节点
docker exec headscale headscale nodes list

# 查看单个节点详情
docker exec headscale headscale nodes show <node-id>

# 查看节点 IP
docker exec headscale headscale nodes list -o json | jq '.[] | {name, ip: .ip_addresses[0]}'
```

### 删除节点

```bash
docker exec headscale headscale nodes delete <node-id>
```

## 🔐 ACL 策略
---
lang: bash
emoji: 🔐
link: https://headscale.net/config/#acl
desc: Headscale 使用 Tailscale ACL JSON 格式控制网络访问策略，按组、用户、标签分配权限。
---

### 查看当前 ACL

```bash
docker exec headscale headscale acl list
```

### 导入 ACL 策略

```bash
# 直接粘贴 JSON 策略
docker exec headscale headscale acl import << 'EOF'
{
  "acls": [
    {"action": "accept", "src": ["group:admin"], "dst": ["*:*"]}
  ]
}
EOF
```

### 测试 ACL 规则

```bash
# 模拟两节点间是否可以访问
docker exec headscale headscale acl check \
  --from <node1-ip> \
  --to <node2-ip> \
  --port 22
```

### ACL 常用结构

```json
{
  "acls": [
    { "action": "accept", "src": ["group:admin"], "dst": ["*:*"] },
    { "action": "accept", "src": ["tag:web"], "dst": ["tag:db:22"] },
    { "action": "accept", "src": ["10.1.0.0/16"], "dst": ["10.2.0.0/16:*"] }
  ],
  "groups": {
    "group:admin": ["user@example.com"]
  },
  "tagOwners": {
    "tag:web": ["group:admin"],
    "tag:db": ["group:admin"]
  }
}
```

## 🌐 路由与出口节点
---
lang: bash
emoji: 🌐
link: https://headscale.net/running-headscale-service/
desc: 设置出口节点（Exit Node）让流量走 Headscale 节点；设置子网路由让 Tailscale 网络覆盖内网段。
---

### 子网路由

```bash
# 启用子网路由（节点侧）
tailscale up --advertise-routes=10.0.0.0/24

# 服务器端：批准路由
docker exec headscale headscale routes list
docker exec headscale headscale routes enable <route-id>
```

### 出口节点

```bash
# 节点侧：申请出口节点
tailscale up --advertise-exit-node

# 服务器端：批准出口节点
docker exec headscale headscale nodes register \
  --user <user-id> \
  --node <node-id>

# 客户端：使用出口节点
tailscale up --exit-node <exit-node-ip>
```

## 🔧 日常维护
---
lang: bash
emoji: 🔧
link: https://headscale.net/
desc: 日常巡检、排障和版本升级的常用命令。
---

### 日志查看

```bash
# 容器日志
docker logs -f headscale

# 实时 tailscale 状态
tailscale status
```

### 用户管理

```bash
# 创建用户
docker exec headscale headscale users create myuser

# 列出用户
docker exec headscale headscale users list

# 为用户创建预共享密钥
docker exec headscale headscale preauthkeys create \
  --user myuser \
  --expiration 72h
```

### 启用 DERP 中继（可选）

```yaml
# config.yaml 中配置
derp:
  server:
    enabled: true
    region_code: "my-derp"
    region_name: "My DERP"
  urls:
    - https://controlplane.tailscale.com/derpmap/default
```

### 版本升级

```bash
# 拉取新镜像
docker pull ghcr.io/juanfont/headscale:0.29.0

# 重启容器
docker stop headscale
docker rm headscale
# 重新运行启动命令
docker run -d --name headscale ...
```

## 💡 常见场景小贴士
---
lang: bash
emoji: 💡
desc: 记住这些场景映射，关键时刻不迷路。
---

- **新机器接入**：先 `preauthkeys create`，再 `tailscale up --authkey <key>`
- **多节点批量注册**：用命名空间（namespace）+ 预共享密钥，隔离不同环境
- **排障第一步**：`tailscale status` 和 `docker logs headscale` 一起看
- **内网不通**：先确认 ACL 是否放行，再看节点是否在同一个 namespace
- **出口流量不稳定**：换用自建 DERP 或使用 Tailscale 官方 DERP
- **迁移数据**：`/var/lib/headscale/db.sqlite` 备份即可迁移整个实例
