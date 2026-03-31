---
title: Docker
lang: bash
version: "29.2.1"
date: "2026-03-30"
github: docker/docker-ce
colWidth: 360px
---

# Docker

## 总览
--- 
emoji: 🐳
link: https://docs.docker.com/reference/cli/docker/
desc: 先确认客户端、服务端和当前 context，再决定是查镜像、跑容器、看 Compose，还是追 Dockerfile。
---
- `docker version` : 查看 Client / Server 版本
- `docker info` : 查看 daemon、存储驱动、镜像源和运行环境
- `docker context ls` : 查看可用上下文
- `docker context use default` : 切回默认上下文
- `docker system df` : 查看镜像、容器、卷占用

```bash
# 先确认命令打到哪个 daemon
docker context show
docker version
docker info
```

## 镜像
--- 
emoji: 🖼️
link: https://docs.docker.com/reference/cli/docker/image/
desc: 镜像流转、打标、导入导出是最常见的仓库操作。
---
- `docker pull nginx:1.29` : 拉取指定标签镜像
- `docker image ls` : 列出本地镜像
- `docker tag app:dev registry.example.com/team/app:2026.03` : 重打标签
- `docker push registry.example.com/team/app:2026.03` : 推送到远端仓库
- `docker image inspect nginx:1.29` : 查看镜像元数据
- `docker image save -o app.tar app:dev` : 导出镜像
- `docker image load -i app.tar` : 导入镜像

```bash
# 拉取后重命名，再推到私有仓库
docker pull node:22-alpine
docker tag node:22-alpine registry.example.com/base/node:22-alpine
docker push registry.example.com/base/node:22-alpine
```

## 构建
--- 
emoji: 🏗️
link: https://docs.docker.com/build/building/multi-stage/
desc: 构建参数、缓存和多阶段构建决定镜像是否可复用、可发布、可维护。
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

## Buildx
--- 
emoji: 🧰
link: https://docs.docker.com/reference/cli/docker/buildx/
desc: Buildx 适合批量构建、多平台发布和更复杂的 BuildKit 工作流。
---
- `docker buildx ls` : 查看可用 builder
- `docker buildx create --name multiarch --use` : 创建并启用 builder
- `docker buildx inspect --bootstrap` : 预热并查看能力
- `docker buildx imagetools inspect repo/app:latest` : 查看多平台镜像清单
- `docker buildx bake` : 按配置批量构建多个目标

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
desc: 命名、端口、卷、环境变量和重启策略，决定容器能不能稳定跑起来。
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

## 生命周期
--- 
emoji: 🔄
link: https://docs.docker.com/reference/cli/docker/container/
desc: start / stop / restart / rm / prune 形成清晰的容器生命周期操作链。
---
- `docker ps` : 查看运行中的容器
- `docker ps -a` : 查看全部容器
- `docker start web` : 启动已有容器
- `docker stop web` : 停止容器
- `docker restart web` : 重启容器
- `docker rm web` : 删除已停止容器
- `docker rm -f web` : 强制删除运行中容器
- `docker container prune` : 清理已停止容器

```bash
# 只清理 exited 容器
docker ps -a --filter "status=exited"
docker container prune --force
```

## 观测
--- 
emoji: 👀
link: https://docs.docker.com/reference/cli/docker/container/exec/
desc: 进容器、看日志、拷文件、查进程和资源，都是定位故障的高频路径。
---
- `docker exec -it web sh` : 进入容器 shell
- `docker logs -f --tail 200 web` : 实时查看最近日志
- `docker inspect web` : 查看容器配置和状态
- `docker cp web:/usr/share/nginx/html ./html` : 拷贝容器文件
- `docker stats web` : 查看资源占用
- `docker top web` : 查看容器进程

```bash
# 直接拿容器 IP 和挂载信息
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
# 创建隔离网络并挂载卷运行数据库
docker network create app-net
docker volume create pgdata
docker run -d --name postgres \
  --network app-net \
  --volume pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:17
```

## Compose 快速查
--- 
emoji: 🧩
link: https://docs.docker.com/reference/cli/docker/compose/
desc: Compose 负责把多容器应用拆成服务、网络、卷和启动顺序。
---
- `docker compose up -d` : 后台启动全部服务
- `docker compose up --build` : 构建后再启动
- `docker compose down` : 停止并移除服务
- `docker compose down -v` : 连同卷一起删除
- `docker compose logs -f api` : 查看指定服务日志
- `docker compose exec api sh` : 进入服务容器
- `docker compose config` : 展开并校验配置
- `docker compose --profile jobs up` : 只启动指定 profile

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

## Compose Cookbook
--- 
emoji: 🧭
link: https://docs.docker.com/reference/compose-file/
desc: 先按场景搭骨架，再把服务、健康检查和启动顺序补齐。
---

### 开发栈
- 入口：一个 `compose.yaml` 同时起 API、Redis、Postgres。
- 目标：本地开发、联调和演示环境尽量同构。
- 要点：把代码挂载进 `api`，把数据库数据放进命名卷。

```yaml
services:
  api:
    build: .
    command: pnpm dev --host 0.0.0.0
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    working_dir: /app
    depends_on:
      - redis
      - db

  redis:
    image: redis:7

  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### 一次性任务
- 入口：只临时跑迁移、测试或生成任务。
- 目标：执行完就退出，不污染常驻服务。
- 要点：用 `docker compose run --rm`，不要把任务容器长时间留在后台。

```bash
# 跑一次数据库迁移
docker compose run --rm api pnpm db:migrate

# 跑一次测试
docker compose run --rm api pnpm test
```

### 排障
- 入口：服务起不来、依赖连不上、配置没生效。
- 目标：先看配置，再看状态，最后看日志。
- 要点：`config`、`ps`、`logs` 的顺序比直接重启更稳。

```bash
docker compose config
docker compose ps
docker compose logs -f --tail 200 api
```

## Dockerfile 快速查
--- 
emoji: 📄
link: https://docs.docker.com/reference/dockerfile/
desc: Dockerfile 的核心是镜像分层、缓存命中和运行时最小化。
---
- `FROM` : 指定基础镜像
- `WORKDIR` : 指定工作目录
- `COPY` : 复制文件
- `RUN` : 在构建阶段执行命令
- `ENV` : 写入运行时环境变量
- `ARG` : 定义构建参数
- `EXPOSE` : 声明监听端口
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

## Dockerfile Cookbook
--- 
emoji: 🛠️
link: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
desc: 先解决“怎么构建更快”，再解决“怎么运行更稳”。
---

### 多阶段构建
- 入口：编译产物和运行时镜像分开。
- 目标：减小体积，减少攻击面。
- 要点：构建依赖只留在 builder 阶段。

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:1.29-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 缓存优化
- 入口：依赖安装慢、改一行代码就全量重装。
- 目标：把变化频率最低的文件先复制进去。
- 要点：先复制 lockfile 和 manifest，再复制源码。

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
CMD ["pnpm", "start"]
```

### 非 root 运行
- 入口：服务对外暴露、镜像需要更小权限。
- 目标：默认不用 root 用户跑应用。
- 要点：创建专用用户后切换。

```dockerfile
FROM alpine:3.21
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --chown=app:app . .
USER app
CMD ["./app"]
```

### 调试和体检
- 入口：镜像偶发启动失败、健康检查不通过。
- 目标：把问题尽量暴露在构建和启动阶段。
- 要点：补 `HEALTHCHECK`，必要时加一个临时调试目标。

```dockerfile
FROM alpine:3.21
RUN apk add --no-cache curl
HEALTHCHECK CMD curl -fsS http://127.0.0.1:8080/health || exit 1
```

## API 与版本
--- 
emoji: 🔗
link: https://docs.docker.com/reference/api/engine/
desc: 需要直接打 daemon、锁定 API 版本，或核对 Compose / Dockerfile 参考时，先看这一组入口。
---
- `docker version` : 同时查看 Client / Server 版本
- `docker version --format '{{.Server.Version}}'` : 只看服务端版本
- `docker version --format '{{.Client.APIVersion}}'` : 查看协商后的 API 版本
- `DOCKER_API_VERSION=1.53` : 临时覆盖 API 版本协商
- `docker compose version` : 查看 Compose 插件版本
- `curl --unix-socket /var/run/docker.sock http://localhost/version` : 直接查询 Engine API

```bash
# 远端 context 排障时先核对版本
docker context use remote-test-server
docker version
docker compose version
```

## 清理
--- 
emoji: 🧹
link: https://docs.docker.com/reference/cli/docker/system/prune/
desc: prune 能快速回收空间，但要先分清镜像、卷和网络是否还能复用。
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

