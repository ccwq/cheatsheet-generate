---
title: Docker
lang: bash
version: "28.5.1"
date: "2025-12-04"
github: docker/docker-ce
colWidth: 360px
---

# Docker

## CLI 总览
---
emoji: 🧭
link: https://docs.docker.com/reference/cli/docker/
desc: 先看客户端、服务端与当前上下文，再决定后续操作落点。
---
- `docker version` : 查看客户端与服务端版本
- `docker info` : 查看 daemon、存储驱动、镜像源等环境信息
- `docker context ls` : 查看当前可用上下文
- `docker context use default` : 切回默认上下文
- `docker system df` : 查看镜像、容器、卷占用

```bash
# 先确认当前命令打到哪个 daemon
docker context ls
docker context show

# 快速检查环境与磁盘占用
docker version
docker info
docker system df
```

## 镜像获取与标记
---
emoji: 📦
link: https://docs.docker.com/reference/cli/docker/image/
desc: 拉取、打标签、导出导入是镜像流转的基础闭环。
---
- `docker pull nginx:1.29` : 拉取指定标签镜像
- `docker image ls` : 列出本地镜像
- `docker tag app:dev registry.example.com/team/app:2026.03` : 重打标签
- `docker push registry.example.com/team/app:2026.03` : 推送到远端仓库
- `docker image inspect nginx:1.29` : 查看镜像元数据
- `docker image save -o app.tar app:dev` : 导出镜像
- `docker image load -i app.tar` : 导入镜像

```bash
# 拉取后重命名并推送到私有仓库
docker pull node:22-alpine
docker tag node:22-alpine registry.example.com/base/node:22-alpine
docker push registry.example.com/base/node:22-alpine
```

## 构建镜像
---
emoji: 🏗️
link: https://docs.docker.com/build/building/multi-stage/
desc: 常用构建参数、BuildKit 与多阶段构建是日常高频项。
---
- `docker build -t app:dev .` : 在当前目录构建
- `docker build -f docker/prod.Dockerfile -t app:prod .` : 指定 Dockerfile
- `docker build --no-cache -t app:fresh .` : 禁用缓存
- `docker build --build-arg NODE_ENV=production -t app:prod .` : 传入构建参数
- `docker buildx build --platform linux/amd64,linux/arm64 -t repo/app:multi .` : 多平台构建

```dockerfile
# 第一阶段：构建产物
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# 第二阶段：只保留运行时文件
FROM nginx:1.29-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

## Buildx 与 Bake
---
emoji: 🧪
link: https://docs.docker.com/reference/cli/docker/buildx/
desc: 新版构建工作流以 BuildKit 为核心；批量、多平台和远程构建优先走 buildx。
---
- `docker buildx ls` : 查看可用 builder
- `docker buildx create --name multiarch --use` : 创建并启用 builder
- `docker buildx inspect --bootstrap` : 预热并输出 builder 能力
- `docker buildx imagetools inspect repo/app:latest` : 查看多平台镜像清单
- `docker buildx bake` : 按声明式配置批量构建多个目标

```hcl
group "default" {
  targets = ["app"]
}

target "app" {
  context = "."
  dockerfile = "Dockerfile"
  platforms = ["linux/amd64", "linux/arm64"]
  tags = ["registry.example.com/team/app:latest"]
}
```

## 容器启动
---
emoji: 🚀
link: https://docs.docker.com/reference/cli/docker/container/run/
desc: 重点掌握命名、端口、卷、环境变量、重启策略与后台运行。
---
- `docker run --name web -d -p 8080:80 nginx:1.29` : 后台启动并映射端口
- `docker run --rm -it alpine sh` : 启动临时交互容器
- `docker run -v ${PWD}:/workspace -w /workspace node:22 pnpm test` : 挂载当前目录执行命令
- `docker run --env-file .env app:dev` : 从文件注入环境变量
- `docker run --restart unless-stopped redis:7` : 设置自动重启策略

```bash
# 本地开发容器
docker run \
  --name api-dev \
  --detach \
  --publish 3000:3000 \
  --env-file .env.local \
  --volume ${PWD}:/app \
  --workdir /app \
  node:22-alpine \
  sh -lc "corepack enable && pnpm dev --host 0.0.0.0"
```

## 容器生命周期
---
emoji: 🔄
link: https://docs.docker.com/reference/cli/docker/container/
desc: 用 start stop restart rm prune 形成清晰的生命周期操作链。
---
- `docker ps` : 查看运行中的容器
- `docker ps -a` : 查看全部容器
- `docker start web` : 启动已存在容器
- `docker stop web` : 停止容器
- `docker restart web` : 重启容器
- `docker rm web` : 删除已停止容器
- `docker rm -f web` : 强制删除运行中的容器
- `docker container prune` : 清理已停止容器

```bash
# 只清理 exited 容器
docker ps -a --filter "status=exited"
docker container prune --force
```

## 进入容器与观测
---
emoji: 🔍
link: https://docs.docker.com/reference/cli/docker/container/exec/
desc: 进入容器、看日志、拷文件、查进程与资源，是排障最常见路径。
---
- `docker exec -it web sh` : 进入容器 shell
- `docker logs -f --tail 200 web` : 实时查看最后 200 行日志
- `docker inspect web` : 查看容器详细配置
- `docker cp web:/usr/share/nginx/html ./html` : 从容器复制文件
- `docker stats web` : 查看资源占用
- `docker top web` : 查看容器进程

```bash
# 直接拿容器 IP 与挂载信息
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' web
docker inspect -f '{{json .Mounts}}' web
```

## 网络与卷
---
emoji: 🌐
link: https://docs.docker.com/engine/network/
desc: 自定义网络和命名卷是服务编排的基础设施层。
---
- `docker network ls` : 列出网络
- `docker network create app-net` : 创建桥接网络
- `docker network connect app-net web` : 将容器接入网络
- `docker volume ls` : 列出卷
- `docker volume create pgdata` : 创建命名卷
- `docker volume inspect pgdata` : 查看卷详情
- `docker volume prune` : 清理未使用卷

```bash
# 创建隔离网络并挂卷运行数据库
docker network create app-net
docker volume create pgdata
docker run -d --name postgres \
  --network app-net \
  --volume pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:17
```

## Compose 日常
---
emoji: 🧩
link: https://docs.docker.com/reference/cli/docker/compose/
desc: Compose 负责多容器开发与测试环境的启动、变更与校验。
---
- `docker compose up -d` : 后台启动全部服务
- `docker compose up --build` : 构建后再启动
- `docker compose down` : 停止并移除服务
- `docker compose down -v` : 连同卷一起删除
- `docker compose logs -f api` : 查看指定服务日志
- `docker compose exec api sh` : 进入服务容器
- `docker compose config` : 展开并校验配置
- `docker compose --profile jobs up` : 按 profile 启动部分服务

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - redis

  redis:
    image: redis:7
```

## Dockerfile 关键指令
---
emoji: 📝
link: https://docs.docker.com/reference/dockerfile/
desc: 常用指令与缓存顺序决定镜像是否可维护、可复用、可加速。
---
- `FROM` : 设定基础镜像
- `WORKDIR` : 设定工作目录
- `COPY` : 复制上下文文件
- `RUN` : 在构建阶段执行命令
- `ENV` : 写入运行时环境变量
- `ARG` : 定义构建参数
- `EXPOSE` : 说明监听端口
- `ENTRYPOINT` : 固定入口命令
- `CMD` : 提供默认参数
- `HEALTHCHECK` : 定义健康检查

```dockerfile
FROM python:3.13-slim
WORKDIR /srv/app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PYTHONUNBUFFERED=1
EXPOSE 8000
HEALTHCHECK CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')"
CMD ["python", "-m", "app"]
```

## 清理与过滤
---
emoji: 🧹
link: https://docs.docker.com/reference/cli/docker/system/prune/
desc: 过滤器和 prune 能避免误删，也能快速回收磁盘。
---
- `docker image prune` : 清理悬空镜像
- `docker image prune -a` : 清理未被容器使用的镜像
- `docker network prune` : 清理未使用网络
- `docker system prune` : 一次清理未使用资源
- `docker system prune -a --volumes` : 连同未使用卷一起清理
- `docker ps --filter "status=running"` : 按条件过滤容器
- `docker image ls --filter "reference=node:*"` : 过滤镜像列表

```bash
# 删除 24 小时前退出的容器
docker container prune --force --filter "until=24h"

# 只看某个 compose 项目的容器
docker ps --filter "label=com.docker.compose.project=myapp"
```

## 代理与镜像源
---
emoji: 🚥
link: https://docs.docker.com/engine/daemon/proxy/
desc: 镜像源配置作用于 daemon，HTTP 代理同时影响 build 与 push。
---
- `registry-mirrors` : 配置 daemon 镜像加速地址
- `HTTP_PROXY` : 构建和拉取外网资源时的代理
- `NO_PROXY` : 排除内网、localhost 与私有仓库
- `docker info` : 验证镜像源与代理是否生效

```json
{
  "registry-mirrors": [
    "https://mirror.example.com"
  ]
}
```

```ini
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1,registry.internal"
```

## 常见排障
---
emoji: 🩺
link: https://docs.docker.com/engine/containers/run/
desc: 先定位容器是否启动、端口是否映射、健康检查是否通过，再追日志。
---
- `docker ps -a` : 先看容器是否不断退出
- `docker logs <container>` : 优先看应用日志
- `docker inspect <container>` : 看环境变量、挂载、健康状态
- `docker port <container>` : 校验端口映射
- `docker events` : 观察容器实时事件流

```bash
# 连续排查容器退出
docker ps -a --filter "name=api"
docker logs api --tail 200
docker inspect -f '{{json .State.Health}}' api
docker port api
```

## 版本与 API 协商
---
emoji: 🔢
link: https://docs.docker.com/reference/cli/docker/version/
desc: 新版 Docker CLI 会和目标 Engine 自动协商 API 版本，远端 context 和旧集群排障时尤其重要。
---
- `docker version` : 同时查看 Client 与 Server 版本
- `docker version --format '{{.Server.Version}}'` : 只看服务端版本
- `docker version --format '{{.Client.APIVersion}}'` : 查看协商后的 API 版本
- `DOCKER_API_VERSION=1.50` : 临时覆盖 API 版本协商结果

```bash
# 远端 context 排障时先核对版本
docker context use remote-test-server
docker version
docker version --format '{{.Client.APIVersion}}'
```
