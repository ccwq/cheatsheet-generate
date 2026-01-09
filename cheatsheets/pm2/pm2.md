# PM2 进程管理速查表

PM2 是一个守护进程管理器，用于管理和保持应用程序在线运行。

## 安装

```bash
# 通过 NPM 安装
npm install pm2@latest -g

# 通过 Yarn 安装
yarn global add pm2
```

## 启动应用

### 基本启动
```bash
# 启动 Node.js 应用
pm2 start app.js

# 启动脚本文件
pm2 start bashscript.sh

# 监视模式启动
pm2 start python-app.py --watch

# 启动二进制文件并传递参数
pm2 start binary-file -- --port 1520
```

### 启动选项
```bash
pm2 start app.js --name <app_name>              # 指定应用名称
pm2 start app.js --watch                         # 监视文件变化
pm2 start app.js --max-memory-restart 200MB      # 内存超限重启
pm2 start app.js --log <log_path>                # 指定日志文件
pm2 start app.js -- arg1 arg2 arg3               # 传递额外参数
pm2 start app.js --restart-delay <delay_ms>      # 重启延迟
pm2 start app.js --time                          # 日志带时间戳
pm2 start app.js --no-autorestart                # 不自动重启
pm2 start app.js --cron <cron_pattern>           # 定时重启
pm2 start app.js --no-daemon                     # 不以守护进程运行
```

## 进程管理

```bash
pm2 restart app_name      # 重启应用
pm2 reload app_name       # 零停机重载
pm2 stop app_name         # 停止应用
pm2 delete app_name       # 删除应用

pm2 restart all           # 重启所有
pm2 reload all            # 零停机重载所有
pm2 stop all              # 停止所有
pm2 delete all            # 删除所有

pm2 stop 0                # 停止指定 ID 进程
pm2 restart 0             # 重启指定 ID 进程
pm2 delete 0              # 删除指定 ID 进程
```

## 状态查看

```bash
pm2 list          # 列出所有进程状态
pm2 ls             # list 的别名
pm2 status         # status 的别名
pm2 jlist          # 输出 JSON 格式列表
pm2 prettylist     # 输出美化 JSON 格式
pm2 describe 0     # 显示指定进程详细信息
pm2 monit          # 实时监控所有进程
```

## 日志管理

```bash
pm2 logs               # 实时显示日志
pm2 logs --lines 200   # 显示最近 200 行日志
pm2 logs --raw         # 原始日志输出
pm2 flush              # 清空所有日志
pm2 reloadLogs         # 重载日志
```

## Cluster 集群模式

```bash
# 启动集群模式（最大进程数）
pm2 start app.js -i max

# 启动指定数量进程
pm2 start app.js -i 4

# 扩容进程
pm2 scale app +3       # 增加 3 个 worker
pm2 scale app 2        # 扩容/缩容到 2 个 worker
```

## 生态系统配置

```bash
# 生成配置文件
pm2 ecosystem

# 使用配置文件启动
pm2 start ecosystem.config.js
```

### 配置文件示例
```javascript
module.exports = {
  apps: [{
    name: "app",
    script: "./app.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production"
    },
    watch: true,
    ignore_watch: ["node_modules", "logs"],
    max_memory_restart: "500M",
    log_date_format: "YYYY-MM-DD HH:mm:ss"
  }]
};
```

## 开机自启动

```bash
# 生成启动脚本
pm2 startup

# 保存当前进程列表
pm2 save

# 禁用启动脚本
pm2 unstartup
```

## 文件监听

```bash
# 启动文件监视
pm2 start app.js --watch --ignore-watch="node_modules"

# 忽略多个目录
pm2 start app.js --watch --ignore-watch="node_modules,logs,tmp"
```

## 更新 PM2

```bash
# 安装最新版本
npm install pm2@latest -g

# 更新内存中的 PM2
pm2 update

# 检查 PM2 版本
pm2 -v
```

## 其他命令

```bash
pm2 reset <app_name>    # 重置元数据（重启时间等）
pm2 ping                # 检查 PM2 守护进程状态
pm2 sendSignal SIGUSR2 my-app  # 发送系统信号
pm2 updatePM2           # 更新内存中的 PM2
pm2 plus                # 打开 PM2 Plus 监控面板
```

## 环境变量

```bash
# 使用特定环境启动
pm2 start app.js --env production

# 在配置文件中定义
module.exports = {
  apps: [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 8080
    }
  }]
};
```

## 日志轮转

```bash
# 安装日志轮转模块
pm2 install pm2-logrotate

# 配置日志轮转
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

## 进程监控

```bash
# 实时监控
pm2 monit

# Web 监控
pm2 plus

# 查看进程详细信息
pm2 show <app_name>
pm2 info <app_name>
```

## 故障排查

```bash
# 查看错误日志
pm2 logs --err

# 查看特定应用日志
pm2 logs <app_name>

# 清除日志
pm2 flush

# 重置重启计数
pm2 reset <app_name>

# 查看进程详细信息
pm2 describe <app_name>
```