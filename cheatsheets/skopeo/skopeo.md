---
title: Skopeo
lang: bash
version: "1.22.0"
date: "2026-02-11"
github: containers/skopeo
colWidth: 360px
---

# Skopeo

## 总览
---
emoji: 🐿️
link: https://github.com/containers/skopeo
desc: 不经过 `docker daemon` 直接检查、复制、同步和校验镜像；先看 `inspect`，再决定要不要搬运。
---
- `skopeo inspect docker://quay.io/org/app:tag` : 先看镜像元数据、digest、架构和标签
- `skopeo copy docker://src/app:tag docker://dst/app:tag` : 直接在仓库之间搬运镜像
- `skopeo sync --src yaml --dest docker images.yaml registry.example.com/library` : 批量同步镜像
- `skopeo list-tags docker://quay.io/org/app` : 查看仓库里有哪些 tag

```bash
# 最短路径：先检查，再复制
skopeo inspect docker://quay.io/org/app:tag
skopeo copy docker://quay.io/org/app:tag docker://registry.example.com/team/app:tag
```

## 镜像检查
---
emoji: 🔎
link: https://github.com/containers/skopeo/blob/main/docs/skopeo-inspect.1.md
desc: 先确认 manifest、digest、架构和标签，避免盲拷贝。
---
- `skopeo inspect docker://registry.fedoraproject.org/fedora:latest` : 查看镜像基本信息
- `skopeo inspect --raw docker://quay.io/org/app:tag` : 直接拿原始 manifest
- `skopeo list-tags docker://quay.io/org/app` : 列出仓库标签
- `skopeo manifest-digest manifest.json` : 计算 manifest digest，方便做离线校验

```bash
# 检查单个镜像时最常用的一组动作
skopeo inspect docker://quay.io/library/nginx:latest
skopeo inspect --raw docker://quay.io/library/nginx:latest | jq .
```

## 镜像搬运
---
emoji: 🚚
link: https://github.com/containers/skopeo/blob/main/docs/skopeo-copy.1.md
desc: 单镜像复制、跨仓库重打标签、从本地镜像导出到远端仓库都用这条链路。
---
- `skopeo copy docker://src/app:tag docker://dst/app:tag` : 仓库到仓库直接复制
- `skopeo copy --all docker://src/app:tag docker://dst/app:tag` : 连同多架构清单一起复制
- `skopeo copy --src-creds USER:PASS --dest-creds USER:PASS ...` : 复制私有仓库时带账号密码
- `skopeo copy docker-daemon:debian:10-slim docker://registry.example.com/base/debian:10-slim` : 从本地 Docker daemon 读镜像
- `skopeo copy oci:/tmp/oci:latest docker://registry.example.com/team/app:latest` : 从 OCI layout 复制出去

```bash
# 迁移私有镜像的典型链路
skopeo inspect docker://src.example.com/team/app:1.0
skopeo copy \
  --src-creds USER:PASS \
  --dest-creds USER:PASS \
  docker://src.example.com/team/app:1.0 \
  docker://dst.example.com/team/app:1.0
```

## 同步与镜像仓
---
emoji: 🪞
link: https://github.com/containers/skopeo/blob/main/docs/skopeo-sync.1.md
desc: 适合镜像站、离线仓库和镜像镜像同步，核心是先定义源，再定义目标。
---
- `skopeo sync --src yaml --dest docker images.yaml registry.example.com/library` : 按 YAML 批量同步
- `skopeo sync --keep-going ...` : 遇到单个镜像失败时继续处理后续项
- `skopeo sync --src-creds USER:PASS --dest-creds USER:PASS ...` : 同步私仓镜像
- `skopeo sync --src docker --dest docker registry.example.com/src registry.example.com/dst` : 从 Docker registry 源同步

```yaml
# images.yaml
quay.io:
  images:
    library/nginx:
      - latest
    library/busybox:
      - latest
```

```bash
# 批量同步到目标仓库
skopeo sync --src yaml --dest docker images.yaml registry.example.com/library
```

## 认证与信任
---
emoji: 🔐
link: https://github.com/containers/skopeo/blob/main/docs/skopeo-login.1.md
desc: 登录信息默认进 `containers/auth.json`；自签名仓库要先分清是认证问题还是 TLS 信任问题。
---
- `skopeo login registry.example.com` : 登录仓库
- `skopeo logout registry.example.com` : 清理登录信息
- `skopeo copy --authfile ~/.config/containers/auth.json ...` : 显式指定认证文件
- `skopeo copy --src-tls-verify=false --dest-tls-verify=false ...` : 仅在测试或内网自签名证书下使用

```bash
# 先登录，再复用同一个 authfile 做 copy / sync
skopeo login registry.example.com
skopeo copy --authfile ~/.config/containers/auth.json \
  docker://registry.example.com/team/app:tag \
  docker://mirror.example.com/team/app:tag
```

## 签名与摘要
---
emoji: ✍️
link: https://github.com/containers/skopeo/blob/main/docs/skopeo-standalone-sign.1.md
desc: 适合供应链校验、离线签名和只验证不拉取的场景。
---
- `skopeo manifest-digest manifest.json` : 计算镜像清单摘要
- `skopeo standalone-sign ...` : 对离线 manifest 做签名
- `skopeo standalone-verify ...` : 验证离线签名

```bash
# 先拿 digest，再做签名校验链
skopeo inspect --raw docker://quay.io/library/nginx:latest > manifest.json
skopeo manifest-digest manifest.json
```

## 常见坑
---
emoji: ⚠️
link: https://github.com/containers/skopeo
desc: Skopeo 很强，但它只负责仓库间操作，不会替你处理所有镜像运行时问题。
---
- 多架构镜像默认不要想当然，搬运时优先确认是否要加 `--all`
- 先 `inspect` 再 `copy`，不要盲拷带权限的私仓镜像
- `docker-daemon:` 只能读本地 daemon 里已经存在的镜像
- `sync` 的目标路径通常要带上库名或命名空间，别直接塞到仓库根目录
- `src` / `dest` 的 TLS 和认证要分开排查

```bash
# 排障三连
skopeo inspect docker://quay.io/library/nginx:latest
skopeo inspect --raw docker://quay.io/library/nginx:latest | jq .
skopeo list-tags docker://quay.io/library/nginx
```
