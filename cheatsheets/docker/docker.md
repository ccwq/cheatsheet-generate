# Docker CLI 速查表

## 基本命令

- `docker --help`：显示 Docker CLI 帮助信息
- `docker version`：显示 Docker 版本信息
- `docker info`：显示 Docker 系统信息
- `docker login`：登录 Docker 仓库
- `docker logout`：退出 Docker 仓库
- `docker search <keyword>`：搜索 Docker 镜像

## 镜像管理

- `docker images`：列出本地镜像
- `docker images -a`：列出所有镜像（包括中间层）
- `docker pull <image>`：拉取镜像
- `docker push <image>`：推送镜像
- `docker rmi <image>`：删除镜像
- `docker rmi -f <image>`：强制删除镜像
- `docker rmi $(docker images -q)`：删除所有镜像
- `docker build <path>`：构建镜像
  - `-t`：指定镜像名称和标签
  - `-f`：指定 Dockerfile 路径
  - `--no-cache`：不使用缓存
- `docker tag <image> <tag>`：为镜像打标签
- `docker inspect <image>`：查看镜像详细信息
- `docker history <image>`：查看镜像构建历史
- `docker save <image> -o <file>`：将镜像保存为文件
- `docker load -i <file>`：从文件加载镜像
- `docker image prune`：清理未使用的镜像
  - `-a`：清理所有未使用的镜像
  - `--force`：强制清理

## 容器管理

- `docker ps`：列出运行中的容器
- `docker ps -a`：列出所有容器
- `docker ps -q`：只列出容器 ID
- `docker run <image>`：运行容器
  - `-d`：后台运行
  - `-it`：交互式终端
  - `--name`：指定容器名称
  - `-p`：端口映射（如 -p 8080:80）
  - `-v`：挂载卷（如 -v ./data:/app/data）
  - `--network`：指定网络
  - `--env`：设置环境变量
  - `--restart`：容器重启策略
- `docker start <container>`：启动容器
- `docker start $(docker ps -a -q)`：启动所有容器
- `docker stop <container>`：停止容器
- `docker stop $(docker ps -q)`：停止所有运行中的容器
- `docker restart <container>`：重启容器
- `docker rm <container>`：删除容器
- `docker rm -f <container>`：强制删除容器
- `docker rm $(docker ps -a -q)`：删除所有容器
- `docker rename <old-name> <new-name>`：重命名容器
- `docker update <container>`：更新容器配置
  - `--cpus`：CPU 限制
  - `--memory`：内存限制
  - `--restart`：重启策略
- `docker container prune`：清理停止的容器

## 容器交互

- `docker exec -it <container> <command>`：在容器中执行命令
  - `-d`：后台执行
  - `--user`：指定用户
- `docker logs <container>`：查看容器日志
  - `-f`：实时跟踪日志
  - `--tail <n>`：显示最后 n 行
  - `--since <time>`：显示指定时间之后的日志
- `docker inspect <container>`：查看容器详细信息
- `docker inspect -f '{{.NetworkSettings.IPAddress}}' <container>`：获取容器 IP 地址
- `docker cp <container>:<path> <host-path>`：从容器复制文件到主机
- `docker cp <host-path> <container>:<path>`：从主机复制文件到容器
- `docker stats <container>`：查看容器资源使用情况
- `docker top <container>`：查看容器内运行的进程
- `docker attach <container>`：连接到正在运行的容器
- `docker wait <container>`：等待容器停止

## 网络管理

- `docker network ls`：列出网络
- `docker network create <network>`：创建网络
  - `--driver`：指定网络驱动（如 bridge、overlay、macvlan）
  - `--subnet`：指定子网
  - `--gateway`：指定网关
- `docker network rm <network>`：删除网络
- `docker network rm $(docker network ls -q)`：删除所有网络
- `docker network inspect <network>`：查看网络详细信息
- `docker network connect <network> <container>`：将容器连接到网络
- `docker network disconnect <network> <container>`：将容器从网络断开
- `docker network prune`：清理未使用的网络

## 卷管理

- `docker volume ls`：列出卷
- `docker volume create <volume>`：创建卷
  - `--driver`：指定卷驱动
  - `--opt`：指定卷选项
- `docker volume rm <volume>`：删除卷
- `docker volume rm $(docker volume ls -q)`：删除所有卷
- `docker volume inspect <volume>`：查看卷详细信息
- `docker volume prune`：清理未使用的卷

## Dockerfile 指令

- `FROM`：指定基础镜像
  - 示例：`FROM ubuntu:22.04`
- `MAINTAINER`：指定维护者信息
  - 示例：`MAINTAINER name <email>`
- `RUN`：执行命令
  - 示例：`RUN apt-get update && apt-get install -y nginx`
- `COPY`：复制文件到镜像
  - 示例：`COPY . /app`
- `ADD`：复制文件到镜像（支持 URL 和压缩包）
  - 示例：`ADD https://example.com/file.tar.gz /app`
- `WORKDIR`：设置工作目录
  - 示例：`WORKDIR /app`
- `ENV`：设置环境变量
  - 示例：`ENV NODE_ENV production`
- `EXPOSE`：声明容器端口
  - 示例：`EXPOSE 80 443`
- `CMD`：设置容器启动命令
  - 示例：`CMD ["node", "app.js"]`
- `ENTRYPOINT`：设置容器入口点
  - 示例：`ENTRYPOINT ["node"]`
- `VOLUME`：创建挂载点
  - 示例：`VOLUME ["/data"]`
- `USER`：指定运行容器的用户
  - 示例：`USER node`
- `ARG`：定义构建参数
  - 示例：`ARG VERSION=1.0.0`
- `ONBUILD`：设置触发指令
  - 示例：`ONBUILD COPY . /app`

## Docker Compose

- `docker compose up`：启动服务
  - `-d`：后台运行
  - `--build`：构建镜像
  - `--no-deps`：不启动依赖服务
  - `--scale <service>=<replicas>`：设置服务副本数
- `docker compose down`：停止服务
  - `-v`：删除卷
  - `--rmi all`：删除所有镜像
  - `--remove-orphans`：删除孤立容器
- `docker compose ps`：列出服务
- `docker compose logs`：查看服务日志
  - `-f`：实时跟踪日志
  - `--tail <n>`：显示最后 n 行
- `docker compose build`：构建服务镜像
  - `--no-cache`：不使用缓存
  - `--pull`：拉取最新基础镜像
- `docker compose exec <service> <command>`：在服务容器中执行命令
- `docker compose start <service>`：启动服务
- `docker compose stop <service>`：停止服务
- `docker compose restart <service>`：重启服务
- `docker compose rm <service>`：删除服务容器
- `docker compose scale <service>=<replicas>`：扩展服务
- `docker compose config`：验证 Compose 文件

## Docker Swarm

- `docker swarm init`：初始化 Swarm
  - `--advertise-addr`：指定广告地址
- `docker swarm join`：加入 Swarm
  - `--token`：指定加入令牌
  - `--advertise-addr`：指定广告地址
- `docker swarm join-token`：管理 Swarm 加入令牌
- `docker swarm leave`：离开 Swarm
  - `--force`：强制离开
- `docker swarm update`：更新 Swarm 配置
- `docker node ls`：列出 Swarm 节点
- `docker node inspect <node>`：查看节点详细信息
- `docker node update`：更新节点配置
- `docker node rm <node>`：删除节点
- `docker service ls`：列出服务
- `docker service create`：创建服务
  - `--name`：指定服务名称
  - `--replicas`：指定副本数
  - `--publish`：发布端口
- `docker service inspect <service>`：查看服务详细信息
- `docker service scale <service>=<replicas>`：扩展服务
- `docker service update`：更新服务配置
- `docker service rm <service>`：删除服务

## 实用技巧和最佳实践

### 容器管理
- **容器命名规范**：使用有意义的名称，如 `app-web-1`
- **资源限制**：为容器设置 CPU 和内存限制
  - 示例：`docker run --cpus=1 --memory=512m <image>`
- **清理策略**：定期清理未使用的容器、镜像和卷
  - 示例：`docker system prune -af`

### 镜像管理
- **镜像标签管理**：使用语义化版本号，避免使用 `latest`
- **多阶段构建**：减少镜像大小
  - 示例：
    ```dockerfile
    FROM golang:alpine AS builder
    ...
    FROM alpine
    COPY --from=builder /app /app
    ```
- **镜像扫描**：使用 `docker scan <image>` 扫描镜像漏洞

### 日志和监控
- **日志管理**：使用集中式日志系统，如 ELK 或 Loki
- **健康检查**：在 Dockerfile 中添加 HEALTHCHECK 指令
  - 示例：`HEALTHCHECK CMD curl -f http://localhost/ || exit 1`

### 网络和存储
- **网络隔离**：为不同服务创建独立网络
- **卷管理**：使用命名卷而非匿名卷

### 环境和配置
- **环境变量**：使用 `.env` 文件管理环境变量
- **容器编排**：对于生产环境，使用 Kubernetes 或 Docker Swarm

### 安全最佳实践
- **最小权限原则**：使用非 root 用户运行容器
- **镜像签名**：使用 Docker Content Trust 签名镜像
- **定期更新**：定期更新基础镜像和依赖

## 系统管理

- `docker system df`：显示 Docker 系统磁盘使用情况
- `docker system prune`：清理未使用的资源
  - `-a`：清理所有未使用的资源
  - `--volumes`：清理未使用的卷
  - `--force`：强制清理
- `docker system events`：监听 Docker 系统事件
- `docker system info`：显示 Docker 系统信息