# pnpm 速查要点

- 链接存储：通过内容寻址 store 复用依赖，减少磁盘占用
- 安装命令：add / install / update / remove，对应 npm 语义但行为更安全
- 工作区：pnpm-workspace.yaml 管理多包仓库，支持 filter / -r 递归执行
- 脚本与 CLI：pnpm run、pnpm dlx、pnpm exec 统一执行各类脚本与工具
- store 管理：store path / prune / status 观察与清理共享依赖仓库
- 兼容生态：支持 npm registry、lockfile、engine 条件等，与现有 Node 工具链兼容
 - 高级管理：import/fetch/prune/rebuild/env 用于迁移、预拉取与原生模块修复
