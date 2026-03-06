---
title: curl 速查表
lang: bash
version: "8.12.0"
date: 2026-03-06
github: curl/curl
---

# curl 命令行工具速查表

## 🚀 基础请求
---
lang: bash
emoji: 🚀
link: https://curl.se/docs/manual.html
desc: curl 最核心的 HTTP 请求功能
---

- `curl <url>`：发起 GET 请求
- `curl -X POST <url>`：指定请求方法
- `curl -X PUT <url>`：发送 PUT 请求
- `curl -X DELETE <url>`：发送 DELETE 请求
- `curl -X PATCH <url>`：发送 PATCH 请求
- `curl -I <url>`：仅获取响应头
- `curl -i <url>`：显示响应头和响应体
- `curl -v <url>`：显示详细通信过程
- `curl -s <url>`：静默模式（不显示进度）
- `curl -L <url>`：跟随重定向
- `curl --max-redirs <n> <url>`：限制重定向次数

```bash
# 基本 GET 请求
curl https://api.example.com/users

# 跟随重定向并显示响应头
curl -iL https://httpbin.org/redirect/1

# 静默模式获取纯响应内容
curl -s https://api.example.com/data | jq .
```

## 📤 发送数据
---
lang: bash
emoji: 📤
link: https://curl.se/docs/httpscripting.html
desc: 使用 curl 发送各种格式的数据
---

- `curl -d "data" <url>`：发送 POST 数据
- `curl -d @file.json <url>`：从文件读取数据
- `curl --data-urlencode "key=value" <url>`：URL 编码数据
- `curl -F "name=value" <url>`：发送表单数据
- `curl -F "file=@path/to/file" <url>`：上传文件
- `curl -T file.txt <url>`：直接上传文件内容
- `curl --json '{"key":"val"}' <url>`：发送 JSON 数据 (8.5+)

```bash
# 发送表单数据
curl -X POST -d "name=John&age=30" https://api.example.com/users

# 发送 JSON 数据
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"John","age":30}' \
  https://api.example.com/users

# 从文件读取 JSON 数据
curl -X POST \
  -H "Content-Type: application/json" \
  -d @user.json \
  https://api.example.com/users

# 上传文件
curl -F "file=@photo.jpg" \
  -F "description=My photo" \
  https://api.example.com/upload

# 使用 --json 简化 JSON 请求 (curl 8.5+)
curl --json '{"name":"John"}' https://api.example.com/users
```

## 📝 请求头设置
---
lang: bash
emoji: 📝
link: https://curl.se/docs/manpage.html
desc: 自定义 HTTP 请求头
---

- `curl -H "Header: Value" <url>`：添加自定义请求头
- `curl -A "User-Agent" <url>`：设置 User-Agent
- `curl -e "referer" <url>`：设置 Referer
- `curl -b "cookie=data" <url>`：发送 Cookie
- `curl -c cookies.txt <url>`：保存 Cookie 到文件
- `curl -b cookies.txt <url>`：从文件读取 Cookie

```bash
# 设置多个请求头
curl -H "Authorization: Bearer token123" \
  -H "Accept: application/json" \
  -H "X-Custom-Header: value" \
  https://api.example.com/data

# 设置 User-Agent
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  https://example.com

# 保存和复用 Cookie
curl -c cookies.txt https://example.com/login
curl -b cookies.txt https://example.com/profile
```

## 💾 输出控制
---
lang: bash
emoji: 💾
link: https://curl.se/docs/manpage.html
desc: 控制 curl 的输出行为
---

- `curl -o file.txt <url>`：保存响应到指定文件
- `curl -O <url>`：使用远程文件名保存
- `curl -C - -o file.txt <url>`：断点续传
- `curl -# <url>`：显示简单进度条
- `curl --progress-bar <url>`：强制显示进度条
- `curl --create-dirs <url>`：自动创建目录

```bash
# 保存到指定文件
curl -o output.json https://api.example.com/data

# 使用远程原始文件名
curl -O https://example.com/files/document.pdf

# 断点续传下载大文件
curl -C - -O https://example.com/large-file.zip

# 下载到指定目录（自动创建）
curl --create-dirs -o downloads/file.txt https://example.com/file.txt
```

## 🔐 认证授权
---
lang: bash
emoji: 🔐
link: https://curl.se/docs/manpage.html
desc: 各种认证方式
---

- `curl -u user:pass <url>`：HTTP Basic 认证
- `curl --digest -u user:pass <url>`：Digest 认证
- `curl --ntlm -u user:pass <url>`：NTLM 认证
- `curl --negotiate -u : <url>`：SPNEGO/Kerberos
- `curl --oauth2-bearer token <url>`：OAuth2 Bearer Token
- `curl -E cert.pem <url>`：使用客户端证书

```bash
# Basic 认证
curl -u username:password https://api.example.com/private

# 交互式输入密码（更安全）
curl -u username https://api.example.com/private

# Bearer Token 认证
curl -H "Authorization: Bearer <token>" https://api.example.com/data

# 使用客户端证书
curl -E client.pem:password \
  --cacert ca.pem \
  https://secure.example.com/api

# 跳过证书验证（仅开发使用）
curl -k https://self-signed.example.com
```

## ⚡ 高级选项
---
lang: bash
emoji: ⚡
link: https://curl.se/docs/manpage.html
desc: 高级功能和性能优化
---

- `curl --connect-timeout <s> <url>`：连接超时
- `curl --max-time <s> <url>`：最大传输时间
- `curl --retry <n> <url>`：失败重试次数
- `curl --retry-delay <s> <url>`：重试间隔
- `curl --limit-rate <speed> <url>`：限速下载
- `curl -Y <speed> <url>`：最小下载速度
- `curl --compressed <url>`：请求压缩响应
- `curl --http2 <url>`：强制使用 HTTP/2
- `curl --http3 <url>`：尝试使用 HTTP/3

```bash
# 设置超时和重试
curl --connect-timeout 10 \
  --max-time 30 \
  --retry 3 \
  --retry-delay 2 \
  https://api.example.com/data

# 限速下载（避免占用全部带宽）
curl --limit-rate 500K -O https://example.com/large-file.zip

# 请求压缩响应
curl --compressed https://api.example.com/data

# 强制 HTTP/2
curl --http2 https://example.com
```

## 🌐 代理设置
---
lang: bash
emoji: 🌐
link: https://curl.se/docs/manpage.html
desc: 配置代理服务器
---

- `curl -x proxy:port <url>`：使用 HTTP 代理
- `curl -x socks5://proxy:port <url>`：使用 SOCKS5 代理
- `curl --proxy-user user:pass <url>`：代理认证
- `curl --proxy-basic <url>`：Basic 代理认证
- `curl --proxy-digest <url>`：Digest 代理认证
- `curl --noproxy "*" <url>`：禁用代理

```bash
# HTTP 代理
curl -x http://proxy.example.com:8080 https://api.example.com

# SOCKS5 代理
curl -x socks5://localhost:1080 https://api.example.com

# 代理认证
curl -x http://proxy.example.com:8080 \
  --proxy-user username:password \
  https://api.example.com

# 特定主机不走代理
curl -x http://proxy:8080 --noproxy "localhost,*.local" \
  https://api.example.com
```

## 📊 调试诊断
---
lang: bash
emoji: 📊
link: https://curl.se/docs/manpage.html
desc: 调试和诊断网络问题
---

- `curl -v <url>`：详细模式
- `curl --trace - <url>`：完整跟踪输出到 stdout
- `curl --trace trace.txt <url>`：完整跟踪输出到文件
- `curl --trace-ascii - <url>`：ASCII 格式跟踪
- `curl --write-out "%{http_code}" <url>`：自定义输出格式
- `curl -w "@format.txt" <url>`：从文件读取输出格式

```bash
# 详细模式查看请求和响应头
curl -v https://api.example.com/users

# 查看 HTTP 状态码和时间信息
curl -w "\nHTTP Code: %{http_code}\nTime: %{time_total}s\n" \
  https://api.example.com

# 完整跟踪保存到文件
curl --trace debug.log https://api.example.com

# 仅获取状态码
curl -s -o /dev/null -w "%{http_code}" https://api.example.com

# 获取详细的连接信息
curl -w @- -o /dev/null -s https://api.example.com <<'EOF'
DNS: %{time_namelookup}s
Connect: %{time_connect}s
SSL: %{time_appconnect}s
Total: %{time_total}s
EOF
```

## 🔧 FTP/SFTP 操作
---
lang: bash
emoji: 🔧
link: https://curl.se/docs/manual.html
desc: FTP 和 SFTP 文件传输
---

- `curl ftp://user:pass@host/file`：下载 FTP 文件
- `curl -T file ftp://user:pass@host/path/`：上传文件到 FTP
- `curl -l ftp://user:pass@host/`：列出 FTP 目录
- `curl -Q "command" ftp://...`：发送 FTP 命令
- `curl sftp://user@host/file`：SFTP 下载
- `curl --ftp-create-dirs -T file ftp://...`：自动创建目录

```bash
# FTP 下载文件
curl ftp://username:password@ftp.example.com/file.txt -o file.txt

# FTP 上传文件
curl -T localfile.txt ftp://username:password@ftp.example.com/remote/

# 列出 FTP 目录
curl -l ftp://username:password@ftp.example.com/

# SFTP 下载
curl sftp://username@example.com/path/to/file.txt -o file.txt

# FTP 被动模式（解决防火墙问题）
curl --ftp-pasv ftp://username:password@ftp.example.com/file.txt
```

## 🛡️ SSL/TLS 配置
---
lang: bash
emoji: 🛡️
link: https://curl.se/docs/sslcerts.html
desc: SSL/TLS 证书和加密配置
---

- `curl -k <url>`：跳过 SSL 证书验证
- `curl --cacert ca.pem <url>`：指定 CA 证书
- `curl --cert client.pem <url>`：使用客户端证书
- `curl --cert-type P12 <url>`：指定证书类型
- `curl --key key.pem <url>`：指定私钥
- `curl --ciphers <list> <url>`：指定加密套件
- `curl --tlsv1.2 <url>`：强制 TLS 1.2
- `curl --tls-max 1.2 <url>`：设置最大 TLS 版本

```bash
# 使用自签名证书（开发环境）
curl -k https://self-signed.example.com

# 指定 CA 证书验证
curl --cacert /path/to/ca-bundle.crt \
  https://secure.example.com

# 使用客户端证书
curl --cert client.crt --key client.key \
  https://secure.example.com/api

# 使用 P12 证书
curl --cert client.p12:password \
  --cert-type P12 \
  https://secure.example.com

# 强制 TLS 1.3
curl --tlsv1.3 https://secure.example.com
```

## 📋 实用技巧
---
lang: bash
emoji: 📋
link: https://curl.se/docs/manual.html
desc: 日常开发中的实用技巧
---

### 常用组合
- **静默 + 跟随重定向 + 输出到文件**：`curl -sL -o file <url>`
- **仅获取 HTTP 状态码**：`curl -s -o /dev/null -w "%{http_code}" <url>`
- **下载并显示进度**：`curl -# -O <url>`
- **API 测试模板**：`curl -s -H "Accept: application/json" <url> | jq .`

### 性能测试
```bash
# 测试响应时间
for i in {1..10}; do
  curl -s -o /dev/null -w "%{time_total}\n" https://api.example.com
done

# 并行请求测试
seq 1 10 | xargs -n1 -P10 -I{} \
  curl -s -o /dev/null -w "%{http_code}\n" https://api.example.com
```

### 与 jq 配合处理 JSON
```bash
# 格式化 JSON 响应
curl -s https://api.example.com/users | jq .

# 提取特定字段
curl -s https://api.example.com/users | jq '.[0].name'

# 遍历数组
curl -s https://api.example.com/users | jq '.[] | {id, name}'
```

### 保存会话 Cookie
```bash
# 登录并保存 Cookie
curl -c cookies.txt \
  -d "username=admin&password=secret" \
  https://example.com/login

# 使用 Cookie 访问受保护资源
curl -b cookies.txt https://example.com/dashboard
```

## 🌟 新特性 (curl 8.x)
---
lang: bash
emoji: 🌟
link: https://curl.se/changes.html
desc: curl 8.x 版本的新功能
---

- `curl --json '<json>' <url>`：简化 JSON 请求 (8.5.0+)
- `curl --url-query "key=value" <url>`：URL 查询参数 (8.0.0+)
- `curl --rate <speed>`：请求速率限制 (8.0.0+)
- `curl --proxy-http2`：HTTP/2 代理支持
- `curl --http3-only`：仅使用 HTTP/3

```bash
# 简化 JSON POST 请求 (8.5+)
curl --json '{"name":"test","value":123}' \
  https://api.example.com/data

# URL 查询参数（自动编码）
curl --url-query "search=hello world" \
  --url-query "page=1" \
  https://api.example.com/search

# 限制请求速率（每秒 2 个请求）
curl --rate 2/s https://api.example.com/data[1-10]
```
