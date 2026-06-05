---
title: PM2
lang: bash
version: "7.0.1"
date: "2026-05-02"
github: Unitech/pm2
colWidth: 360px
---

# PM2

## 安装与平台差异
---
emoji: 🧰
link: https://pm2.keymetrics.io/docs/usage/quick-start/
desc: 先装 PM2，再决定是否需要开机自启。`pm2 startup` 只适用于 Linux / macOS 的 init 系统，Windows 要走社区方案。
---
| 平台 / 目标 | 安装方式 | 自启动方式 |
|---|---|---|
| Linux / macOS | `npm install pm2 -g` | `pm2 startup` + `pm2 save` |
| Windows 开发机 | `npm install pm2 -g` | `pm2-windows-startup` + `pm2 save` |
| Windows 服务端 | `npm install pm2 -g` | 优先看 `pm2-installer`；`pm2-windows-service` 已废弃 |

```bash
# 基础安装
npm install pm2 -g

# 装完先确认 CLI 可用
pm2 -v
pm2 ping
```

## 进程清单与状态
---
emoji: 📋
link: https://pm2.keymetrics.io/docs/usage/process-management/
desc: 先看列表、再看详情、最后再操作，是最稳妥的日常顺序。
---
- `pm2 list` : 查看全部进程
- `pm2 status` : `list` 别名
- `pm2 jlist` : 以 JSON 输出列表
- `pm2 prettylist` : 结构化查看进程信息
- `pm2 describe <app>` : 查看某个进程完整详情
- `pm2 monit` : 打开实时监控面板

```bash
# 先确认进程名、ID、模式与状态
pm2 list
pm2 describe api
pm2 monit
```

## 启动与命名
---
emoji: 🚀
link: https://pm2.keymetrics.io/docs/usage/quick-start/
desc: 用脚本、解释器参数、环境变量和名称来规范启动行为。
---
- `pm2 start app.js --name api` : 启动并命名
- `pm2 start server.js --watch` : 监听文件变动自动重启
- `pm2 start worker.js --time` : 日志带时间戳
- `pm2 start ./dist/main.js --max-memory-restart 512M` : 超内存自动重启
- `pm2 start ./script.sh --interpreter bash` : 指定解释器
- `pm2 start app.js -- --port 3000` : 向应用透传参数

```bash
# 生产环境常见启动方式
pm2 start ./dist/server.js \
  --name api \
  --env production \
  --time \
  --max-memory-restart 512M
```

## 生命周期操作
---
emoji: 🔄
link: https://pm2.keymetrics.io/docs/usage/process-management/
desc: restart、reload、stop、delete 是最常用的四件套。
---
- `pm2 restart <app>` : 重启目标进程
- `pm2 reload <app>` : 零停机重载，适合集群模式
- `pm2 stop <app>` : 停止但保留定义
- `pm2 delete <app>` : 删除进程定义
- `pm2 restart all` : 重启全部进程
- `pm2 delete all` : 删除全部进程
- `pm2 reset <app>` : 重置重启次数等元信息

```bash
# 发布后无中断重载
pm2 reload api
pm2 describe api
```

## 日志管理
---
emoji: 🪵
link: https://pm2.keymetrics.io/docs/usage/log-management/
desc: PM2 默认拆分 out / err 日志，追问题时优先定向看单个进程。
---
- `pm2 logs` : 查看全部实时日志
- `pm2 logs api --lines 200` : 查看指定进程最近 200 行
- `pm2 logs --err` : 只看错误日志
- `pm2 flush` : 清空日志
- `pm2 reloadLogs` : 重载日志文件句柄
- `pm2 install pm2-logrotate` : 安装日志轮转模块

```bash
# 只盯住一个服务的错误
pm2 logs api --err --lines 100
```

## 集群与扩缩容
---
emoji: 🧬
link: https://pm2.keymetrics.io/docs/usage/cluster-mode/
desc: CPU 密集或无状态 Web 服务优先考虑 cluster，并用 reload 做平滑更新。
---
- `pm2 start app.js -i max` : 以 CPU 核数启动集群
- `pm2 start app.js -i 4` : 指定实例数
- `pm2 scale api 6` : 扩容或缩容到指定实例数
- `pm2 reload api` : 集群模式零停机重载
- `pm2 show api` : 查看实例分布和模式

```javascript
module.exports = {
  apps: [
    {
      name: "api",
      script: "./dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "512M"
    }
  ]
};
```

## Ecosystem 配置
---
emoji: 🧩
link: https://pm2.keymetrics.io/docs/usage/application-declaration/
desc: 复杂项目不要堆命令行参数，统一落到 ecosystem 文件里。
---
- `pm2 start ecosystem.config.js` : 按配置文件启动
- `pm2 restart ecosystem.config.js --only api` : 只重启指定 app
- `pm2 reload ecosystem.config.js --only api` : 只热重载指定 app
- `pm2 delete ecosystem.config.js` : 删除该配置下的进程

```javascript
module.exports = {
  apps: [
    {
      name: "api",
      script: "./dist/server.js",
      cwd: "/srv/myapp",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8080
      }
    }
  ]
};
```

## 环境变量与发布环境
---
emoji: 🌍
link: https://pm2.keymetrics.io/docs/usage/environment/
desc: 把环境差异收敛到 ecosystem 的 `env` / `env_production`，不要散落在命令里。
---
- `--env production` : 选用 `env_production`
- `env` : 默认环境变量
- `env_staging` : 自定义环境组
- `appendEnvToName` : 把环境名追加到进程名

```javascript
module.exports = {
  apps: [
    {
      name: "api",
      script: "./dist/server.js",
      appendEnvToName: true,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
```

## Watch 与自动重启
---
emoji: 👀
link: https://pm2.keymetrics.io/docs/usage/watch-and-restart/
desc: watch 很适合开发环境，生产环境要控制监听范围，避免频繁抖动。
---
- `pm2 start app.js --watch` : 监听文件变化
- `--ignore-watch="node_modules logs"` : 忽略目录
- `watch_delay` : 避免频繁连续重启
- `restart_delay` : 重启之间增加延迟
- `max_restarts` : 限制重启次数

```javascript
module.exports = {
  apps: [
    {
      name: "api-dev",
      script: "./src/server.js",
      watch: ["src"],
      ignore_watch: ["node_modules", "logs"],
      watch_delay: 500
    }
  ]
};
```

## 开机自启动与持久化
---
emoji: 💾
link: https://pm2.keymetrics.io/docs/usage/startup/
desc: `pm2 startup` 原生只会探测 systemd、upstart、launchd、openrc 等 init 系统；Windows 不在这条链路里，必须改走社区工具。
---
- `pm2 startup` : 为 Linux / macOS 生成自启动命令
- `pm2 save` : 保存当前进程清单
- `pm2 resurrect` : 从保存的清单恢复
- `pm2 unstartup` : 移除 Linux / macOS 自启动

```bash
# Linux / macOS 常见上线顺序
pm2 startup
pm2 save
pm2 resurrect
```

### Windows 自启动

Windows 上不要直接把 `pm2 startup` 当成可用方案。PM2 源码里的 `detectInitSystem()` 只检测 `systemctl`、`update-rc.d`、`chkconfig`、`rc-update`、`launchctl`、`sysrc`、`rcctl`、`svcadm`，没有 Windows 分支。

#### 方案 1：`pm2-windows-startup`

- 适合个人开发机、轻量常驻服务
- 原理是写注册表启动项，登录后自动拉起 PM2
- 关键动作仍然是 `pm2 save`，不保存进程列表就不会恢复应用

```bash
npm install pm2-windows-startup -g
pm2-startup install

pm2 start app.js --name my-app
pm2 save

# 验证
pm2 ls

# 卸载
pm2-startup uninstall
```

#### 方案 2：`pm2-installer` / 历史方案 `pm2-windows-service`

- 官方 startup 文档的 Windows 提示已指向 `pm2-installer`
- `pm2-windows-service` 仓库现在已标记 `DEPRECATED`，只适合作为历史兼容信息，不应再写成首选方案
- 如果你必须把 PM2 跑成真正的 Windows Service，先验证维护状态、服务账号、`PM2_HOME`、管理员权限与可写目录

| 方案 | 原理 | 是否需登录桌面 | 现状 |
|---|---|:---:|---|
| `pm2-windows-startup` | 注册表启动项 | 是 | 当前更轻量、可用 |
| `pm2-installer` | Windows 兼容启动封装 | 否 / 视配置而定 | 官方文档当前指向它 |
| `pm2-windows-service` | Windows Service | 否 | 已废弃，不建议新上 |

> ⚠️ 无论哪种 Windows 方案，`pm2 save` 都是必做步骤；它会把当前进程列表写到 `~/.pm2/dump.pm2`，后续恢复靠的就是这个文件。

## 高频命令速用
---
emoji: ⚡
link: https://pm2.keymetrics.io/docs/usage/process-management/
desc: 如果你只想覆盖日常 95% 的使用面，这 12 个命令基本够了。先记 `start / restart / reload / logs / save` 这一组。
---

### 1. `pm2 start`

启动应用程序。

| 参数 | 说明 |
|---|---|
| `--name <n>` | 指定进程名称 |
| `-i <num>` | 启动实例数，进入 cluster 模式 |
| `--watch` | 文件变更自动重启 |
| `--max-memory-restart <size>` | 内存超限自动重启，如 `500M` |

```bash
pm2 start app.js --name api -i 4
```

### 2. `pm2 stop`

停止进程，但保留在 PM2 列表中，后续还能 `restart`。

```bash
pm2 stop <name|id|all>
```

### 3. `pm2 restart`

强制重启进程，会短暂中断服务。

```bash
pm2 restart <name|id|all>
```

### 4. `pm2 reload`

零停机重载，只对 cluster 模式真正有意义。

```bash
pm2 reload <name|all>
```

### 5. `pm2 delete`

停止并从列表中移除进程定义，之后需要重新 `start`。

```bash
pm2 delete <name|id|all>
```

### 6. `pm2 list` / `pm2 ls`

查看所有进程状态。

| 参数 | 说明 |
|---|---|
| `--sort <field>` | 按字段排序，如 `memory`、`cpu` |

### 7. `pm2 logs`

查看日志。

| 参数 | 说明 |
|---|---|
| `--lines <n>` | 显示最近 n 行 |
| `--err` | 仅显示错误日志 |
| `--out` | 仅显示标准输出日志 |

```bash
pm2 logs api --lines 50 --err
```

### 8. `pm2 describe`

查看单个进程详情，例如路径、重启次数、运行时间、环境变量、内存限制。

```bash
pm2 describe <name|id>
```

### 9. `pm2 monit`

打开实时监控面板，同时看 CPU、内存、日志。

```bash
pm2 monit
```

### 10. `pm2 scale`

动态调整 cluster 实例数。

```bash
pm2 scale <name> <num>
pm2 scale <name> +3
```

### 11. `pm2 save`

保存当前进程列表到 `~/.pm2/dump.pm2`，开机恢复和服务恢复都依赖它。

```bash
pm2 save
```

### 12. `pm2 startup`

生成系统开机自启脚本，但原生不支持 Windows。

```bash
pm2 startup
pm2 unstartup
```

## 速查表
---
emoji: 🗂️
link: https://pm2.keymetrics.io/docs/usage/quick-start/
desc: 临时忘命令时先看这张表；要知道适用边界，再回上面的对应章节。
---
| 命令 | 一句话 | 会中断服务？ |
|---|---|:---:|
| `start` | 启动 | — |
| `stop` | 暂停，可恢复 | 是 |
| `restart` | 强制重启 | 是 |
| `reload` | 零停机重载 | 否 |
| `delete` | 彻底移除 | 是 |
| `list` | 看状态 | 否 |
| `logs` | 看日志 | 否 |
| `describe` | 看详情 | 否 |
| `monit` | 实时监控 | 否 |
| `scale` | 调整实例数 | 否 |
| `save` | 持久化进程列表 | 否 |
| `startup` | 配置开机自启 | 否 |

## 优雅启动与停止
---
emoji: 🤝
link: https://pm2.keymetrics.io/docs/usage/signals-clean-restart/
desc: 最新官方文档把 graceful reload、wait-ready、kill-timeout 和 Windows 消息退出收敛到同一组能力。
---
- `pm2 reload api` : 对支持优雅退出的服务做平滑重载
- `pm2 start app.js --wait-ready` : 等待应用显式发送 ready
- `pm2 start app.js --listen-timeout 8000` : 放宽启动等待
- `pm2 start app.js --kill-timeout 3000` : 放宽停止等待
- `pm2 start app.js --shutdown-with-message` : Windows 下用消息而不是 Unix 信号

```javascript
process.on("SIGINT", async () => {
  await server.close();
  process.exit(0);
});

process.send?.("ready");
```

## Docker 与 pm2-runtime
---
emoji: 🐳
link: https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/
desc: 在容器里优先使用 `pm2-runtime`，它更符合单进程容器语义。
---
- `pm2-runtime ecosystem.config.js --env production` : 在容器中以前台方式运行
- `pm2-runtime start app.js -i max` : 容器内启动 cluster
- `kill_timeout` : 容器停止时留给应用清理的时间

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --prod
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
```

## 监控与诊断
---
emoji: 🩺
link: https://pm2.keymetrics.io/docs/usage/monitoring/
desc: 出现重启风暴、内存飙升、请求抖动时，先看 describe 和 monit。
---
- `pm2 show <app>` : 查看 CPU、内存、重启次数
- `pm2 env <id>` : 查看某个进程的环境变量
- `pm2 ping` : 检查 PM2 daemon 是否可用
- `pm2 report` : 生成诊断报告
- `pm2 trigger <app> <action>` : 调用自定义 action

```bash
# 排查某个实例频繁重启
pm2 show api
pm2 logs api --err --lines 200
pm2 env 0
```

## 常见排障
---
emoji: 🧯
link: https://pm2.keymetrics.io/docs/usage/process-management/
desc: 先确认脚本路径、cwd、环境变量，再看日志与重启策略。
---
- 反复重启时先检查 `cwd`、启动命令、环境变量和端口占用
- 集群 reload 不生效时，确认应用是否支持优雅退出与 `wait_ready`
- watch 误触发时，缩小监听目录并加 `ignore_watch`
- 容器里不要用 `pm2 start ... --no-daemon`，优先用 `pm2-runtime`

## 🧾 版本变更
---
link: https://github.com/Unitech/pm2/releases
desc: 按官方发布说明整理本次跨版本更新中对速查用户最重要的变化。
---

### v7.0.1

- 修复 Windows `cmd.exe` 下的 `pm2.cmd` 启动回归，避免 shebang 解释错误
- 修复非 Node 解释器在部分 Ubuntu 路径上的误判问题
- `pm2 describe` 现在会显示 `max_memory_restart`

### v7.0.0

- 破坏性变化：要求 Node.js `>= 18`，不再支持 Node 16
- 新增 Bun runtime 支持，CLI 和内部依赖也做了较大重构
- 修复多个 Windows 相关问题，包括 `os.homedir()` 路径处理和 TreeKill 一致性
- `pm2 serve` 新增 `--ftp` 目录列表能力
