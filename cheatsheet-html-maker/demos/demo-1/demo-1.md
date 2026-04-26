---
title: acme.sh Cookbook
lang: bash
version: 3.0.9
date: 2026-03-17
github: acmesh-official/acme.sh
colWidth: 400px
---

# acme.sh Cookbook

## 入口与定位
---
lang: bash
link: https://github.com/acmesh-official/acme.sh
desc: 纯 Shell 编写的 ACME 客户端，用于自动化获取、续期、安装 SSL/TLS 证书。无需 Python，兼容 Bash/dash/sh，支持 ECDSA 证书和通配符。
colspan: 3
---

- **解决的问题**：自动化管理 Let's Encrypt、ZeroSSL 等 CA 的证书生命周期
- **核心优势**：
  - 纯 Shell，无依赖
  - 支持 80+ DNS Provider API 自动验证
  - 默认 ECC 证书，可选 RSA
  - 自动续期（默认 60 天）
  - 不需要 root 权限

## 安装与初始化
---
lang: bash
desc: 安装只有 3 步：下载、安装、验证。安装后会自动创建 cron job 用于续期。
colspan: 1
---

```bash
# 方式一：一键安装（推荐）
curl https://get.acme.sh | sh -s email=your@email.com

# 方式二：Wget 安装
wget -O - https://get.acme.sh | sh -s email=your@email.com

# 方式三：手动安装
git clone https://github.com/acmesh-official/acme.sh.git
cd acme.sh
./acme.sh --install -m your@email.com
```

- 安装后：`~/.acme.sh/` 存放所有证书和配置
- 自动创建 alias：`acme.sh=~/.acme.sh/acme.sh`
- 自动创建每日 cron job 检查续期

```bash
# 手动更新到最新版本
acme.sh --upgrade

# 开启自动升级
acme.sh --upgrade --auto-upgrade
```

## 验证方式选择
---
lang: text
desc: 根据你的环境选择合适的验证方式。DNS 模式最通用，Webroot 适合有现成网站的场景。
colspan: 1
---

| 模式 | 适用场景 | 需要端口 |
|------|---------|---------|
| Webroot | 有现成网站目录 | 无 |
| Standalone | 无网站，仅有服务器 | 80 (TCP) |
| TLS-ALPN | 无网站，仅有服务器 | 443 (TCP) |
| DNS | 任何场景，特别是通配符 | 无 |
| Apache / Nginx | 正在运行对应 Web 服务器 | 无 |

## Webroot 模式
---
lang: bash
desc: 适用于已有 Web 服务器的场景。acme.sh 会把验证文件写到网站根目录，CA 通过 HTTP 访问验证。
---

```bash
# 单域名
acme.sh --issue -d example.com -w /home/wwwroot/example.com

# 多域名（同一证书）
acme.sh --issue -d example.com -d www.example.com -d cp.example.com -w /home/wwwroot/example.com

# 通配符（需要 DNS API）
acme.sh --issue -d example.com -d '*.example.com' --dns dns_cf
```

## Standalone 模式
---
lang: bash
desc: 无需 Web 服务器，acme.sh 内置临时 Web Server 监听 80 端口完成验证。
---

```bash
# HTTP 验证（需要 80 端口）
acme.sh --issue --standalone -d example.com -d www.example.com

# TLS-ALPN 验证（需要 443 端口）
acme.sh --issue --alpn -d example.com -d www.example.com
```

## DNS 模式（最通用）
---
lang: bash
desc: 通过 DNS TXT 记录验证，支持 80+ DNS Provider。最适合通配符证书和无法开放端口的场景。
---

### Cloudflare 示例

```bash
# 设置 API Token（推荐）
export CF_Token="your_cloudflare_token"
export CF_Account_ID="your_account_id"

# 颁发证书
acme.sh --issue --dns dns_cf -d example.com -d '*.example.com'
```

### 常用 DNS Provider

```bash
# Cloudflare
export CF_Token="xxx"
--dns dns_cf

# DNSPod
export DP_Id="id"
export DP_Key="key"
--dns dns_dp

# AWS Route53
export AWS_ACCESS_KEY_ID="xxx"
export AWS_SECRET_ACCESS_KEY="xxx"
--dns dns_aws

# Aliyun
export Ali_Key="xxx"
export Ali_Secret="xxx"
--dns dns_ali

# DigitalOcean
export DO_API_KEY="xxx"
--dns dns_dgon
```

### DNS 手动模式（无法自动时）

```bash
# 手动添加 TXT 记录
acme.sh --issue --dns -d example.com

# 按提示添加 DNS 记录后，手动续期
acme.sh --renew -d example.com

# ⚠️ 警告：手动模式无法自动续期！
```

## 证书安装到服务器
---
lang: bash
desc: 证书生成后，必须用 --install-cert 复制到目标路径。不要直接使用 ~/.acme.sh/ 下的文件！
colspan: 2
---

```bash
# 安装到 Nginx
acme.sh --install-cert -d example.com \
  --key-file /etc/nginx/ssl/example.com.key \
  --fullchain-file /etc/nginx/ssl/example.com.fullchain.pem \
  --reloadcmd "systemctl reload nginx"

# 安装到 Apache
acme.sh --install-cert -d example.com \
  --cert-file /etc/apache2/ssl/example.com.crt \
  --key-file /etc/apache2/ssl/example.com.key \
  --fullchain-file /etc/apache2/ssl/example.com.fullchain.pem \
  --reloadcmd "systemctl reload apache2"
```

- `--reloadcmd` 关键：续期后自动重载服务，否则用户看不到新证书！

## 证书续期
---
lang: bash
desc: acme.sh 默认 60 天自动续期。也可以手动强制续期。
---

```bash
# 手动续期指定域名
acme.sh --renew -d example.com

# 强制续期（忽略证书有效期）
acme.sh --renew -d example.com --force

# 手动触发所有证书检查
acme.sh --cron

# 列出所有证书
acme.sh --list

# 移除证书（停止续期）
acme.sh --remove -d example.com
```

## 证书类型选择
---
lang: text
desc: 默认 ECDSA（更小、更安全）。根据需求选择密钥长度。
---

| 参数 | 类型 | 推荐场景 |
|------|------|---------|
| `ec-256` | ECDSA P-256 | 默认，移动端兼容性好 |
| `ec-384` | ECDSA P-384 | 高安全要求 |
| `ec-521` | ECDSA P-521 | 最高安全要求 |
| `4096` | RSA 4096-bit | 兼容老旧系统 |

```bash
# ECDSA 证书（默认）
acme.sh --issue -d example.com --keylength ec-256

# RSA 证书
acme.sh --issue -d example.com --keylength 4096
```

## 切换 CA
---
lang: bash
desc: acme.sh 默认使用 ZeroSSL，可切换到 Let's Encrypt、Google Public CA 等。
---

```bash
# 切换到 Let's Encrypt
acme.sh --set-default-ca --server letsencrypt

# 切换到 ZeroSSL（默认）
acme.sh --set-default-ca --server zerossl

# 使用 Google Public CA
acme.sh --set-default-ca --server google

# 查看支持的 CA 列表
acme.sh --server list
```

## 常见场景 Recipes
---
lang: bash
desc: 直接复制这些模板到你的项目中使用。
colspan: 2
---

### 场景一：Nginx 站点 + 单域名

```bash
# 1. 获取证书
acme.sh --issue -d example.com -w /var/www/html

# 2. 安装证书
acme.sh --install-cert -d example.com \
  --key-file /etc/nginx/ssl/example.com.key \
  --fullchain-file /etc/nginx/ssl/example.com.pem \
  --reloadcmd "nginx -s reload"
```

### 场景二：Nginx 站点 + 通配符

```bash
# 1. 配置 Cloudflare
export CF_Token="xxx"

# 2. 获取通配符证书
acme.sh --issue --dns dns_cf -d example.com -d '*.example.com'

# 3. 安装
acme.sh --install-cert -d example.com \
  --key-file /etc/nginx/ssl/example.com.key \
  --fullchain-file /etc/nginx/ssl/example.com.pem \
  --reloadcmd "nginx -s reload"
```

### 场景三：Docker 中使用

```bash
# 在 Docker 中运行
docker run --rm -it \
  -v "$(pwd)/acme.sh":/acme.sh \
  -e CF_Token="xxx" \
  neilpang/acme.sh \
  --issue --dns dns_cf -d example.com -d '*.example.com'

# 复制证书到宿主机
docker run --rm -it \
  -v "$(pwd)/acme.sh":/acme.sh \
  -v "$(pwd)/certs":/certs \
  neilpang/acme.sh \
  --install-cert -d example.com \
  --cert-file /certs/cert.pem \
  --key-file /certs/key.pem
```

### 场景四：多域名证书

```bash
# 3 个域名同一证书
acme.sh --issue \
  -d example.com \
  -d www.example.com \
  -d mail.example.com \
  -w /home/wwwroot/example.com
```

## 常见坑
---
lang: bash
desc: 这些问题新手容易遇到，提前避开省时间。
---

### 1. 端口被占用

```bash
# Standalone 报 "Port 80 is already used"
# 方案：先停掉占用 80 端口的服务，或改用 Webroot 模式
lsof -i :80
```

### 2. 续期后服务没重载

```bash
# 原因：--reloadcmd 写错了
# 检查：手动执行 reloadcmd 确认路径正确
systemctl reload nginx
```

### 3. DNS API 权限不足

```bash
# Cloudflare: Token 需要 Zone > DNS > Edit 权限
# AWS: 需要 Route53 权限
# 检查日志：tail -f /var/log/acme.sh/log
```

### 4. 证书路径找不到

```bash
# 不要直接用 ~/.acme.sh/example.com/ 下的文件！
# 必须用 --install-cert 复制到目标位置
# 原因：内部文件结构可能变化
```

### 5. 泛域名 + 多域名混合

```bash
# 正确：一起申请
acme.sh --issue --dns dns_cf \
  -d example.com \
  -d '*.example.com' \
  -d www.example.com

# ❌ 错误：分开申请会导致验证顺序问题
```

## Docker 部署 Checklist
---
lang: bash
desc: 在 CI/CD 中使用 acme.sh 时，按这个清单检查。
---

```bash
# ✅ 检查清单
# 1. DNS API Token 已设置
# 2. 证书目录已挂载（-v）
# 3. reloadcmd 在宿主机执行（不在容器内）
# 4. 确认 60 天内至少运行过一次 --cron

# 推荐：使用 DNS 自动验证，兼容任何服务器
```

## 进阶：使用已有 CSR
---
lang: bash
desc: 如果已有私钥或 CSR，可以复用。
---

```bash
# 使用已有 CSR
acme.sh --issue --csr /path/to/example.com.csr -d example.com

# 指定已有私钥
acme.sh --issue -d example.com --key-file /path/to/key.pem
```

## 通知配置
---
lang: bash
desc: 配置证书续期或错误的通知渠道。
---

```bash
# 邮件通知
acme.sh --notify --notifymail mail@example.com

# Webhook 通知
# 参考：https://github.com/acmesh-official/acme.sh/wiki/notify
```
