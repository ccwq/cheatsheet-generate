---
title: Podman Cookbook
lang: bash
version: "unknown"
date: "2026-03-18"
github: containers/podman
colWidth: 420px
---

# Podman Cookbook

## 入口与定位
---
lang: bash
link: https://docs.podman.io/
desc: 可以把 Podman 理解成“更偏 Linux 原生、支持 rootless 的容器工具箱”。日常入口还是 `run/build/exec/logs` 这条线，但它把 pod、systemd、Kubernetes YAML 和 CDI 设备接入放得更前。
---

- **适合场景**: 本机开发容器、CI 构建、无 daemon 的单机运行、rootless 多用户环境、把 GPU/volume/network 组合成可复用工作流
- **你这次要记住的主线**: 先确认运行时和设备可见，再跑通 `run -> inspect -> logs -> exec -> stop/rm`
- **WSL + NVIDIA 场景**: 如果你在 WSL2 里直接跑 Podman，先验证宿主 Windows 驱动已经把 CUDA 暴露进 WSL，再考虑容器里的 `CDI` / `nvidia-container-toolkit`

```bash
# 先看 Podman 打到哪里、当前是不是 rootless
podman version
podman info
podman system connection list

# 快速确认容器、镜像、pod、卷
podman ps -a
podman images
podman pod ps
podman volume ls
```

## 起手式：先把环境和 GPU 看通
---
lang: bash
link: https://docs.nvidia.com/cuda/wsl-user-guide/index.html
desc: 在 WSL 里跑带 GPU 的容器，第一步不是直接 `podman run`，而是先确认 WSL 里能看到 NVIDIA 设备，再确认容器运行时能通过 CDI 暴露 GPU。
---

```bash
# 1. 在 WSL 发行版里先确认驱动透传正常
nvidia-smi

# 2. 确认 Podman 基本环境
podman info

# 3. 检查 CDI 设备声明是否存在
podman info --format "{{.Host.CDI.Devices}}"
podman info --format "{{.Host.OCIRuntime.Name}}"

# 4. 用最小 CUDA 镜像验证容器内能看到 GPU
podman run --rm \
  --device nvidia.com/gpu=all \
  docker.io/nvidia/cuda:12.4.1-base-ubuntu22.04 \
  nvidia-smi
```

- `nvidia-smi` 在 WSL 里先失败: 先修 Windows 侧 NVIDIA 驱动和 WSL GPU 支持，不要先怀疑 Podman
- `--device nvidia.com/gpu=all`: 这是 CDI 写法，适合 Podman 新版 GPU 暴露
- `podman info --format "{{.Host.CDI.Devices}}"` 为空: 通常说明 CDI spec 没生成，优先检查 `nvidia-ctk cdi generate`

## Recipe：在 WSL 中启用 NVIDIA 给 Podman 用
---
lang: bash
link: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html
desc: 这条链路解决的是“WSL 里 Podman 容器怎么拿到 GPU”。重点不是装一堆包，而是保证 `nvidia-container-toolkit` 已装好，并把 CDI 描述文件生成到 Podman 能识别的位置。
---

```bash
# 安装后，先生成或刷新 CDI 描述
sudo nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml

# 看看有哪些可用设备名
grep "name:" /etc/cdi/nvidia.yaml

# Podman 侧验证 CDI 设备已被识别
podman info --format "{{.Host.CDI.Devices}}"

# 指定全部 GPU
podman run --rm \
  --device nvidia.com/gpu=all \
  docker.io/nvidia/cuda:12.4.1-base-ubuntu22.04 \
  nvidia-smi

# 或者只给某一块 GPU
podman run --rm \
  --device nvidia.com/gpu=0 \
  docker.io/nvidia/cuda:12.4.1-base-ubuntu22.04 \
  nvidia-smi
```

- `nvidia-ctk cdi generate` 后换卡、升级驱动、设备拓扑变化: 建议重新生成一次
- rootless 场景遇到权限或设备不可见: 先用 rootful 跑通，再回头收窄权限
- 在 WSL 里做推理服务: 通常更关心“容器内能否跑通 CUDA”而不是图形栈

## Recipe：用 Podman 跑一个最小容器
---
lang: bash
link: https://docs.podman.io/en/latest/markdown/podman-run.1.html
desc: 当你只是想确认端口、卷、环境变量和生命周期是否都正常，先从一个可观测的最小容器起步，不要一上来就跑复杂服务。
---

```bash
# 后台启动并暴露端口
podman run -d \
  --name web \
  -p 8080:80 \
  docker.io/library/nginx:1.29

# 看状态和端口
podman ps
podman port web

# 追日志和进入容器
podman logs -f --tail 100 web
podman exec -it web sh

# 收尾
podman stop web
podman rm web
```

- `--rm`: 临时调试容器更顺手，退出即删
- `-p 8080:80`: Podman 默认不会替你猜端口映射
- `podman exec -it`: 优先用于排路径、环境变量、启动命令，不要拿来替代正常镜像构建

## Recipe：挂目录做本地开发
---
lang: bash
link: https://docs.podman.io/en/latest/markdown/podman-run.1.html
desc: 开发态最常见的是把本地代码挂进容器。Podman 下要额外留意 SELinux 标签和工作目录，否则“挂进去了但程序读不到”会很像玄学。
---

```bash
# 在 Linux / WSL 文件系统里做开发挂载
podman run --rm -it \
  --name py-dev \
  -v "$PWD":/workspace:Z \
  -w /workspace \
  docker.io/library/python:3.12-slim \
  bash

# 需要环境变量时直接补
podman run --rm -it \
  -v "$PWD":/workspace:Z \
  -w /workspace \
  -e HF_HOME=/workspace/.cache/huggingface \
  docker.io/library/python:3.12-slim \
  python -V
```

- `:Z`: 单容器独占挂载，SELinux 环境下常用
- `:z`: 多容器共享挂载时更常见
- WSL 里优先把项目放在 Linux 文件系统而不是 `/mnt/c/...`: I/O 和权限体验通常更稳定

## Recipe：以 vLLM 为例部署 OpenAI 兼容推理服务
---
lang: bash
link: https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html
desc: 这是这份 cheatsheet 的核心示例。目标是在 WSL 里用 Podman 调起带 GPU 的 vLLM 服务，并对外暴露 OpenAI 兼容接口，方便本地 SDK、curl 或上层网关直连。
---

```bash
# 先准备模型缓存目录，避免每次重拉
mkdir -p "$HOME/.cache/huggingface"

# 示例：以 Qwen 系列模型为例启动 OpenAI 兼容服务
podman run -d \
  --name vllm-qwen \
  --device nvidia.com/gpu=all \
  --shm-size=16g \
  -p 8000:8000 \
  -e HUGGING_FACE_HUB_TOKEN=$HUGGING_FACE_HUB_TOKEN \
  -v "$HOME/.cache/huggingface":/root/.cache/huggingface:Z \
  docker.io/vllm/vllm-openai:latest \
  --model Qwen/Qwen2.5-7B-Instruct \
  --host 0.0.0.0 \
  --port 8000 \
  --dtype auto \
  --max-model-len 8192
```

```bash
# 看启动过程，第一次通常会先下载模型
podman logs -f --tail 200 vllm-qwen

# 容器内确认服务参数
podman inspect vllm-qwen

# 进容器排查 huggingface 缓存、CUDA、启动参数
podman exec -it vllm-qwen bash
```

```bash
# OpenAI 兼容接口测试
curl http://127.0.0.1:8000/v1/models

curl http://127.0.0.1:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-7B-Instruct",
    "messages": [
      {"role": "system", "content": "你是一个简洁的中文助手。"},
      {"role": "user", "content": "用一句话说明 Podman 和 Docker 的差异。"}
    ],
    "temperature": 0.2
  }'
```

- 第一次启动慢: 常见原因是拉镜像、下模型、预热显存，不一定是卡死
- `--shm-size=16g`: 大模型推理常见保底项，太小容易出共享内存相关问题
- 如果你只想本机调用: `-p 127.0.0.1:8000:8000` 会更收敛
- 真正要上线前: 先用定长 prompt 做一次吞吐和显存压测，再决定 `--tensor-parallel-size`、量化或更小模型

## Recipe：把 vLLM 服务放进 pod
---
lang: bash
link: https://docs.podman.io/en/latest/markdown/podman-pod.1.html
desc: 当你准备在同一台机器上再挂一个网关、日志侧车或 exporter，Pod 比一堆散落容器更容易维护网络和生命周期。
---

```bash
# 先建 pod，共享网络命名空间
podman pod create --name llm-stack -p 8000:8000

# 把 vLLM 放进去
podman run -d \
  --pod llm-stack \
  --name vllm-qwen \
  --device nvidia.com/gpu=all \
  --shm-size=16g \
  -v "$HOME/.cache/huggingface":/root/.cache/huggingface:Z \
  docker.io/vllm/vllm-openai:latest \
  --model Qwen/Qwen2.5-7B-Instruct \
  --host 0.0.0.0 \
  --port 8000

# 看 pod 和容器
podman pod ps
podman ps --pod
```

- `podman pod create`: 适合“多个容器像一个应用一起跑”
- 后面如果加反向代理: 直接再 `podman run --pod llm-stack ...`
- GPU 仍然是给具体容器，不是给 pod 本身

## Recipe：构建你自己的推理镜像
---
lang: dockerfile
link: https://docs.podman.io/en/latest/markdown/podman-build.1.html
desc: 当你要把模型下载逻辑、依赖版本、启动脚本固定下来，就该从“临时 run”切到“可复现镜像”。
---

```dockerfile
FROM docker.io/vllm/vllm-openai:latest

# 放你自己的启动脚本或额外依赖
WORKDIR /app
COPY serve.sh /app/serve.sh
RUN chmod +x /app/serve.sh

ENTRYPOINT ["/app/serve.sh"]
```

```bash
# 构建
podman build -t local/vllm-qwen:dev .

# 运行
podman run --rm \
  --device nvidia.com/gpu=all \
  -p 8000:8000 \
  local/vllm-qwen:dev
```

- `podman build` 默认找 `Containerfile` / `Dockerfile`
- 有私有基础镜像时: 先 `podman login`
- 需要多架构: 转到 `manifest` 工作流，而不是在单条 `build` 上硬拼

## 排查链路：服务起不来时先看哪里
---
lang: bash
link: https://docs.podman.io/en/latest/markdown/podman-inspect.1.html
desc: 排错不要一上来盲改参数。先判断是镜像问题、设备问题、端口问题、模型下载问题，还是应用自身退出。
---

```bash
# 1. 先看容器是不是在重启或已退出
podman ps -a

# 2. 看最近日志
podman logs --tail 200 vllm-qwen

# 3. 看退出码、挂载、环境变量、设备
podman inspect vllm-qwen

# 4. 看端口是否映射
podman port vllm-qwen

# 5. 看资源占用
podman stats
```

- 退出码 `125`: 通常是 Podman 命令本身参数或运行环境有问题
- 退出码 `126`: 命令找到了但不能执行
- 退出码 `127`: 容器入口命令不存在
- 其他退出码: 多半是容器内应用自己退出，回到应用日志看

## 常见坑
---
lang: bash
link: https://docs.podman.io/en/latest/markdown/podman.1.html
desc: 下面这些问题在 Podman 场景里出现频率很高，尤其是 rootless、WSL、挂载目录和 GPU 叠在一起时。
---

- **GPU 不可见**: 先在 WSL 主机里跑 `nvidia-smi`，再在容器里跑；不要跳过主机侧验证
- **CDI 设备为空**: 重新执行 `sudo nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml`
- **挂载目录权限怪异**: 优先把代码和缓存放在 WSL Linux 文件系统内，再用 `:Z` / `:z`
- **端口已占用**: 先 `ss -ltnp | grep 8000`，再决定换端口还是清理旧进程
- **模型下载失败**: 先看 `HUGGING_FACE_HUB_TOKEN`、代理、DNS，再看镜像内 CA/证书
- **rootless 下网络或设备行为不一致**: 先切 rootful 复现，确认不是权限层拦住

## API / 命令技巧：运行与生命周期
---
lang: bash
link: https://docs.podman.io/en/latest/markdown/podman-run.1.html
desc: 前面是 cookbook，下面这部分保留成“需要时马上翻”的命令面速查，重点放高频参数和默认行为差异。
---

- `启动后台容器: podman run -d --name app -p 8000:8000 image`
- `一次性调试: podman run --rm -it image sh`
- `注入环境文件: podman run --env-file .env image`
- `绑定目录: podman run -v "$PWD":/app:Z image`
- `进入容器: podman exec -it app bash`
- `追日志: podman logs -f --tail 200 app`
- `重启容器: podman restart app`
- `停止并删除: podman stop app && podman rm app`
- `看退出状态: podman inspect -f "{{.State.ExitCode}}" app`

## API / 命令技巧：镜像与构建
---
lang: bash
link: https://docs.podman.io/en/latest/markdown/podman-build.1.html
desc: 这里记的是镜像流转最常用的动作。真正高频的是 `pull/tag/push/build/image inspect/save/load` 这几个。
---

- `拉镜像: podman pull docker.io/library/nginx:1.29`
- `列镜像: podman images`
- `重打标签: podman tag app:dev registry.example.com/team/app:2026.03`
- `推镜像: podman push registry.example.com/team/app:2026.03`
- `本地构建: podman build -t app:dev .`
- `指定文件构建: podman build -f Containerfile.cuda -t app:cuda .`
- `查镜像详情: podman image inspect app:dev`
- `导出导入: podman save -o app.tar app:dev && podman load -i app.tar`

## API / 命令技巧：Pod / 网络 / 卷
---
lang: bash
link: https://docs.podman.io/en/latest/markdown/podman-pod.1.html
desc: Podman 的 pod 能力值得单独记住。它不是 Kubernetes，但很适合本机把一组相关容器捆成一个运行单元。
---

- `创建 pod: podman pod create --name app-pod -p 8080:80`
- `查看 pod: podman pod ps`
- `删除 pod: podman pod rm -f app-pod`
- `创建网络: podman network create app-net`
- `查看网络: podman network ls`
- `创建卷: podman volume create model-cache`
- `查看卷: podman volume inspect model-cache`
- `清理未用卷: podman volume prune`

## API / 命令技巧：生成 systemd / kube
---
lang: bash
link: https://docs.podman.io/en/latest/markdown/podman-generate-systemd.1.html
desc: 当你要把一次成功的本地运行变成“可重启、可托管、可迁移”的定义时，`generate` 系列命令很省时间。
---

```bash
# 生成 systemd 单元
podman generate systemd --name vllm-qwen --files --new

# 生成 Kubernetes YAML
podman generate kube llm-stack > llm-stack.yaml

# 用 YAML 回放
podman play kube llm-stack.yaml
```

- `generate systemd`: 适合单机托管
- `generate kube`: 适合把本地成功配置固化成清单
- `play kube`: 更像“Podman 理解的一份 Kube YAML”，不是完整 Kubernetes 控制面

## API / 命令技巧：清理与空间回收
---
lang: bash
link: https://docs.podman.io/en/latest/markdown/podman-system-prune.1.html
desc: 调模型、切镜像、反复试容器时，磁盘很快被吃满。清理动作最好带过滤条件，不要无脑全删。
---

```bash
# 看整体占用
podman system df

# 清理已停止容器
podman container prune -f

# 清理悬空镜像
podman image prune -f

# 全量清理未使用资源
podman system prune -a -f
```

- 做模型服务时，最占空间的通常不是容器层，而是模型缓存和基础镜像
- `system prune -a`: 会删掉未被容器引用的镜像，别在还没打标签前乱用
