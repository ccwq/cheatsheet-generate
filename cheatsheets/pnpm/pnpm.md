---
title: pnpm 速查
lang: bash
version: "10.32.1"
date: "2026-03-11"
github: pnpm/pnpm
colWidth: 380px
---

# pnpm

## 上手 Cookbook：新机器到可工作项目
---
lang: bash
emoji: 🍳
link: https://pnpm.io/installation
desc: 适合刚切到 pnpm，或者新开一台机器时快速走通。顺序通常是确认 pnpm 可用、完成 setup、安装依赖、启动脚本、需要时补全局工具。
---

### 最短路径

- `pnpm --version` : 先确认命令可用
- `pnpm setup` : 初始化 `PNPM_HOME` 与 PATH，给全局命令铺路
- `pnpm install` : 安装项目依赖
- `pnpm run dev` : 启动项目脚本
- `pnpm add -g typescript` : 需要全局工具时再装

```bash
pnpm --version
pnpm setup

cd my-project
pnpm install
pnpm run dev

# 需要全局 CLI 时再补
pnpm add -g typescript
```

### 什么时候这样走

- 新机器第一次使用 pnpm
- 项目已经有 `package.json` / `pnpm-lock.yaml`
- 你只想尽快把项目跑起来，不想先看完整命令清单

## 快速定位
---
lang: bash
emoji: 📦
link: https://pnpm.io/
desc: pnpm 的核心价值是内容寻址 store、严格依赖边界和对 monorepo 的原生支持。日常使用时先掌握安装、脚本执行、workspace 过滤，再看 store 与部署命令。
---

### 先记住

- `pnpm add foo` : 安装并写入依赖
- `pnpm install` : 按 lockfile 同步依赖
- `pnpm run dev` : 运行 package.json 脚本
- `pnpm exec eslint .` : 用项目内 CLI 执行命令
- `pnpm dlx create-vite@latest app` : 临时下载并执行 CLI
- `pnpm -r test` : 在 workspace 递归执行脚本
- `pnpm --filter web build` : 只对指定包执行命令

```bash
pnpm add react
pnpm install --frozen-lockfile
pnpm run dev
pnpm exec tsc -b
pnpm dlx create-vite@latest my-app
pnpm -r lint
pnpm --filter ./packages/web test
```

## 安装与依赖变更
---
lang: bash
emoji: ➕
link: https://pnpm.io/cli/add
desc: `add`、`remove`、`update` 覆盖大多数依赖变更场景。相比 npm，pnpm 更强调显式写入和 workspace 范围控制。
---

### 常用写法

- `pnpm add lodash` : 安装生产依赖
- `pnpm add -D typescript vitest` : 安装开发依赖
- `pnpm add -O esbuild` : 安装 optionalDependencies
- `pnpm add -g npm-check-updates` : 全局安装工具
- `pnpm remove lodash` : 删除依赖
- `pnpm update` : 更新符合 semver 范围的依赖
- `pnpm update -L` : 忽略范围，升级到最新版本
- `pnpm up -r` : 在 workspace 递归更新

```bash
# 安装到当前包
pnpm add axios zod

# 安装到工作区根
pnpm add -Dw typescript eslint prettier

# 仅更新某个包
pnpm update react react-dom

# 升级到最新版
pnpm update -L eslint
```

## 锁文件与安装策略
---
lang: bash
emoji: 🔒
link: https://pnpm.io/cli/install
desc: 团队协作时重点看 lockfile 是否允许变更，以及 CI 是否要求完全按锁文件安装。`install` 的几个开关直接决定构建是否可复现。
---

### 常用策略

- `pnpm install` : 安装并在需要时更新 `pnpm-lock.yaml`
- `pnpm install --frozen-lockfile` : 禁止修改 lockfile，CI 常用
- `pnpm install --lockfile-only` : 只更新 lockfile，不落地 `node_modules`
- `pnpm install --offline` : 只使用本地 store
- `pnpm install --prod` : 只安装生产依赖
- `pnpm install --ignore-scripts` : 跳过生命周期脚本

```bash
# CI / 发布前校验
pnpm install --frozen-lockfile

# 先更新锁文件，再交给镜像构建
pnpm install --lockfile-only

# 离线环境复用已拉取依赖
pnpm install --offline --frozen-lockfile
```

## 脚本执行与临时 CLI
---
lang: bash
emoji: ▶️
link: https://pnpm.io/cli/run
desc: `run`、`exec`、`dlx` 分工很清楚。脚本走 `run`，项目依赖内的二进制走 `exec`，一次性脚手架或工具走 `dlx`。
---

### 怎么选

- `pnpm run build` : 运行 scripts 中的命令
- `pnpm test -- --watch` : 透传参数给脚本
- `pnpm exec vite --host` : 直接调用本地依赖的可执行文件
- `pnpm dlx cowsay hello` : 临时执行远程包
- `pnpm create vite` : create 类脚手架的常见入口

```bash
pnpm run dev -- --open
pnpm exec eslint src --fix
pnpm dlx degit user/template my-app
pnpm create next-app@latest
```

## 工作区与递归执行
---
lang: yaml
emoji: 🧩
link: https://pnpm.io/workspaces
desc: pnpm 的 workspace 是 monorepo 主场。目录匹配写在 `pnpm-workspace.yaml`，批量脚本通常用 `-r` 或 `--filter` 组合。
---

### 基本结构

```yaml
packages:
  - apps/*
  - packages/*
  - tooling/*
```

### 常用命令

- `pnpm -r install` : 给所有 workspace 包安装依赖
- `pnpm -r build` : 对所有包执行 `build`
- `pnpm -r --parallel dev` : 并行跑多个开发服务
- `pnpm -r --stream test` : 实时输出各包日志
- `pnpm -r --workspace-concurrency=3 build` : 控制并发数

```bash
pnpm -r build
pnpm -r --parallel dev
pnpm -r --stream lint
```

## Filter 精确命中包
---
lang: bash
emoji: 🎯
link: https://pnpm.io/filtering
desc: 复杂 monorepo 里最常用的是 `--filter`。它可以按包名、目录、依赖关系和变更范围缩小执行面。
---

### 高频模式

- `pnpm --filter web build` : 只构建 `web`
- `pnpm --filter web... test` : `web` 及其依赖一起执行
- `pnpm --filter ...web test` : `web` 以及依赖它的包
- `pnpm --filter ./apps/* lint` : 按目录模式筛选
- `pnpm --filter "[origin/main]" test` : 只对变更包执行
- `pnpm --filter "...[origin/main]" build` : 变更包及其下游一起执行

```bash
pnpm --filter @acme/web build
pnpm --filter @acme/web... test
pnpm --filter ...@acme/ui lint
pnpm --filter "[HEAD~1]" test
```

## Store、缓存与部署
---
lang: bash
emoji: 🚚
link: https://pnpm.io/cli/store
desc: pnpm 真正省空间的关键在 store。CI 和容器场景则常配合 `fetch`、`deploy`、`prune` 做预拉取和最小产物输出。
---

### Store 管理

- `pnpm store path` : 查看 store 路径
- `pnpm store status` : 检查 store 中的包是否被改动
- `pnpm store prune` : 清理未被引用的包
- `pnpm cache delete` : 删除缓存条目

### 构建与发布场景

- `pnpm fetch` : 仅按 lockfile 预拉取依赖
- `pnpm prune --prod` : 裁剪为生产依赖
- `pnpm deploy --filter api dist` : 导出目标包的可部署目录
- `pnpm rebuild` : 重新编译原生模块

```bash
pnpm store path
pnpm store prune

# 容器中先利用 lockfile 拉依赖
pnpm fetch --prod
pnpm install --offline --prod --frozen-lockfile

# 导出单个 workspace 包
pnpm deploy --filter @acme/api dist/api
```

## 配置、镜像与版本锁定
---
lang: json
emoji: ⚙️
link: https://pnpm.io/npmrc
desc: 日常最常碰到的是 registry、store 目录、严格 peer 依赖，以及通过 `packageManager` 锁住团队使用的 pnpm 版本。
---

### 常用命令

- `pnpm config get registry` : 查看当前镜像
- `pnpm config set registry https://registry.npmjs.org` : 切换镜像
- `pnpm config set store-dir .pnpm-store` : 指定 store 目录
- `pnpm config set strict-peer-dependencies false` : 临时放宽 peer 校验

### package.json 推荐字段

```json
{
  "packageManager": "pnpm@10.32.1",
  "engines": {
    "node": ">=18"
  }
}
```

### .npmrc 常见配置

```properties
registry=https://registry.npmjs.org/
auto-install-peers=true
strict-peer-dependencies=true
prefer-frozen-lockfile=true
```

## 最小 Setup 与全局包
---
lang: bash
emoji: 🌍
link: https://pnpm.io/cli/setup
desc: 这部分只保留最小入口。`pnpm setup` 负责准备全局命令所需的 home 目录与 PATH；如果你要 `pnpm add -g`，先确认 setup 已完成。
---

### 什么时候需要

- `pnpm add -g <pkg>` 之前，尤其是新机器或新 shell 环境
- 全局包已经安装，但命令找不到时
- 刚用独立安装脚本装完 pnpm，想让全局命令立即可用时

### 最小命令

- `pnpm setup` : 创建 pnpm CLI home、复制可执行文件，并更新 shell 配置把 `PNPM_HOME` 加到 `PATH`
- `pnpm add -g typescript` : 全局安装包
- `pnpm remove -g typescript` : 卸载全局包
- `pnpm bin -g` : 查看全局可执行文件目录
- `pnpm root -g` : 查看全局模块目录

```bash
# 先完成全局命令初始化
pnpm setup

# 再安装全局工具
pnpm add -g typescript eslint

# 检查全局 bin / 模块目录
pnpm bin -g
pnpm root -g
```

### 常见排障

- `command not found` / `不是内部或外部命令` : 先重新打开 shell，再执行 `pnpm setup`
- 全局包已装但命令不可用 : 检查 `pnpm bin -g` 输出的目录是否在 `PATH`
- 想看全局包装到了哪里 : 用 `pnpm root -g` 看模块目录，用 `pnpm bin -g` 看可执行文件目录

## 排障与迁移
---
lang: bash
emoji: 🛠️
link: https://pnpm.io/cli/import
desc: 大多数问题都和严格依赖、peer 冲突、旧锁文件迁移有关。先定位是 lockfile 问题、store 问题，还是 workspace 过滤范围不对。
---

### 高频处理

- `pnpm import` : 从 npm/yarn lockfile 迁移到 pnpm lockfile
- `pnpm why react` : 看依赖从哪里引入
- `pnpm list --depth 0` : 快速看顶层依赖
- `pnpm outdated` : 查看可升级依赖
- `pnpm doctor` : 检查环境问题
- `pnpm env use --global lts` : 切换 Node 版本

```bash
# 从 package-lock.json / yarn.lock 迁移
pnpm import

# 查谁依赖了某个包
pnpm why react

# 原生模块安装失败时
pnpm rebuild
```
