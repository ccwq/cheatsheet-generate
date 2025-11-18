仅包含使用：

- run/exec/logs/stats/inspect/stop/rm/prune 核心命令；--restart、-p、-v :Z。
- build：`podman build -t repo:tag -f Containerfile .`；manifest 创建/推送多架构。
- pod/network/volume：`podman pod create`、`podman network create`、`podman volume create`。
- 生成：`podman generate systemd|kube`；编排 `podman play kube`。
- 平台：rootless 需 subuid/subgid；macOS/Windows 使用 `podman machine`。
- 退出码：125/126/127；其余沿用容器内命令退出码。
