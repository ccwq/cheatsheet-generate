---
title: PM2
lang: bash
version: "6.0.8"
date: "2026-01-09"
github: Unitech/pm2
colWidth: 360px
---

# PM2

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
desc: `startup` 生成系统服务定义，`save` 保存当前进程列表。
---
- `pm2 startup` : 生成自启动命令
- `pm2 save` : 保存当前进程清单
- `pm2 resurrect` : 从保存的清单恢复
- `pm2 unstartup` : 移除自启动

```bash
# 常见上线顺序
pm2 startup
pm2 save
pm2 resurrect
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
- 集群 reload 不生效时，确认应用是否支持优雅退出
- watch 误触发时，缩小监听目录并加 `ignore_watch`
- 容器里不要用 `pm2 start ... --no-daemon`，优先用 `pm2-runtime`
