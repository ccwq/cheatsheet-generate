# PM2 参考资源

## 官方文档
- [PM2 Docs 总入口](https://pm2.keymetrics.io/docs/)
- [Quick Start](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Process Management](https://pm2.keymetrics.io/docs/usage/process-management/)
- [Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
- [Application Declaration](https://pm2.keymetrics.io/docs/usage/application-declaration/)
- [Log Management](https://pm2.keymetrics.io/docs/usage/log-management/)
- [Environment Variables](https://pm2.keymetrics.io/docs/usage/environment/)
- [Watch and Restart](https://pm2.keymetrics.io/docs/usage/watch-and-restart/)
- [Startup Script Generator](https://pm2.keymetrics.io/docs/usage/startup/)
- [Graceful Start / Shutdown](https://pm2.keymetrics.io/docs/usage/signals-clean-restart/)
- [Docker Integration](https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/)
- [Monitoring](https://pm2.keymetrics.io/docs/usage/monitoring/)

## 官方仓库与包
- [Unitech/pm2](https://github.com/Unitech/pm2)
- [PM2 Releases](https://github.com/Unitech/pm2/releases)
- [npm: pm2](https://www.npmjs.com/package/pm2)

## Windows 自启动
- [PM2 Startup Script Generator](https://pm2.keymetrics.io/docs/usage/startup/) - 官方 startup 文档，Windows 部分会指向社区方案
- [PM2 Startup.js](https://github.com/Unitech/pm2/blob/master/lib/API/Startup.js) - `detectInitSystem()` 仅检测 Linux / macOS / BSD init 系统
- [pm2-windows-startup](https://github.com/marklagendijk/node-pm2-windows-startup) - 注册表开机启动项方案
- [pm2-installer](https://github.com/jessety/pm2-installer) - 官方文档当前给出的 Windows 兼容启动封装
- [pm2-windows-service](https://github.com/jon-hall/pm2-windows-service) - 历史 Windows Service 方案，仓库已标记 deprecated

## 相关工具
- [pm2-logrotate](https://github.com/keymetrics/pm2-logrotate)
- [PM2 Plus / PM2.io](https://app.pm2.io/)
