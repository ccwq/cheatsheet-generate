---
title: rclone 命令速查
lang: bash
version: "1.73.5"
date: "2026-04-19"
github: rclone/rclone
colWidth: 360px
---

# rclone 命令速查

## 一眼入口
---
emoji: 🧭
link: https://rclone.org/
desc: rclone 是 “rsync for cloud storage”，适合做云盘迁移、同步、挂载和校验。
---

### 最短路径

```bash
rclone config
rclone lsd remote:
rclone copy ./data remote:backup
rclone sync ./data remote:mirror
```

### 你先记住这 4 个动作

| 目标 | 命令 |
|------|------|
| 只补新增或变更文件 | `copy` |
| 让目标和源完全一致 | `sync` |
| 双向保持一致 | `bisync` |
| 先比对再操作 | `check` |

## 远端概念
---
emoji: ☁️
link: https://rclone.org/docs/
desc: rclone 把本地目录、云盘、对象存储和协议端点统一成 remote。
---

### 路径写法

| 写法 | 含义 |
|------|------|
| `local/path` | 本地路径 |
| `remote:` | 远端根目录 |
| `remote:dir/file.txt` | 远端某个路径 |
| `remote1:dir remote2:dir` | 远端之间复制或同步 |

### 先看远端

```bash
rclone listremotes
rclone lsd remote:
rclone ls remote:bucket
rclone lsl remote:bucket
```

## 高频命令
---
emoji: ⚙️
link: https://rclone.org/commands/
desc: 常用命令按“复制、同步、移动、校验、挂载、服务”来记最省脑。
---

### 复制与同步

```bash
rclone copy ./data remote:backup
rclone copy --progress ./data remote:backup
rclone sync ./data remote:mirror
rclone sync --dry-run ./data remote:mirror
```

### 双向同步

```bash
rclone bisync ./left remote:shared
rclone bisync --resync ./left remote:shared
```

### 移动与清理

```bash
rclone move ./data remote:archive
rclone delete remote:trash
rclone purge remote:empty-dir
```

### 比对与校验

```bash
rclone check ./data remote:backup
rclone checksum ./data remote:backup
rclone size remote:backup
```

## 场景套路
---
emoji: 🧰
link: https://rclone.org/overview/
desc: 把 rclone 当成工作流工具用，通常比记零散命令更稳。
---

### 1. 首次接入一个云盘

```bash
rclone config
rclone listremotes
rclone lsd remote:
```

### 2. 迁移一个目录到云端

```bash
rclone copy -P ./project remote:backup/project
rclone copy -P --dry-run ./project remote:backup/project
```

### 3. 维护镜像备份

```bash
rclone sync -P ./project remote:mirror/project
```

### 4. 需要双向协作目录

```bash
rclone bisync -P ./shared remote:team/shared
```

### 5. 让本地程序把远端当磁盘用

```bash
rclone mount remote:bucket /mnt/bucket
```

### 6. 对外提供文件服务

```bash
rclone serve web remote:bucket
rclone serve ftp remote:bucket
rclone serve sftp remote:bucket
```

## 过滤与风险
---
emoji: 🛡️
link: https://rclone.org/filtering/
desc: 先做过滤，再做删除类操作，能少踩很多坑。
---

### 常用保护参数

```bash
rclone sync --dry-run ./data remote:mirror
rclone sync --progress ./data remote:mirror
rclone sync --exclude "*.log" ./data remote:mirror
rclone sync --filter-from filters.txt ./data remote:mirror
```

### 过滤文件示例

```text
- *.log
- node_modules/**
+ important.txt
```

### 删除前先确认

| 场景 | 建议 |
|------|------|
| 第一次跑同步 | 先加 `--dry-run` |
| 会删远端文件 | 先加 `--progress` 和 `--dry-run` |
| 规则很多 | 用 `--filter-from` |
| 需要反复跑 | 先固定过滤文件，再自动化 |

## 速查表
---
emoji: 📋
desc: 常见命令和用途快速对照。
---

| 命令 | 用途 |
|------|------|
| `config` | 配置 remote |
| `listremotes` | 查看所有 remote |
| `lsd` | 列目录 |
| `ls` / `lsl` | 列文件 |
| `copy` | 复制新增/变更 |
| `sync` | 双端镜像 |
| `bisync` | 双向同步 |
| `move` | 复制后删除源 |
| `check` | 校验一致性 |
| `mount` | 挂载远端 |
| `serve` | 提供文件服务 |

