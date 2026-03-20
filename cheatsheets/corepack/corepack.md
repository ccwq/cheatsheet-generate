---
title: corepack 速查
lang: bash
version: "0.34.6"
date: "2026-01-23"
github: nodejs/corepack
colWidth: 400px
---

# corepack

## 快速定位
---
lang: bash
emoji: 📦
link: https://github.com/nodejs/corepack#readme
desc: Corepack 是 Node.js 生态里的包管理器代理层。它不替代 pnpm / Yarn / npm，而是帮项目把“该用哪个包管理器、该用哪个版本”钉住并自动拉起。
---

### 一眼先记住

- `corepack enable` : 在系统里放好 `yarn` / `pnpm` shim
- `corepack use pnpm@10` : 给当前项目写入 `packageManager` 并执行安装
- `corepack install` : 按当前项目声明的包管理器下载并安装
- `corepack up` : 升到当前大版本线的最新版本
- `corepack pack -o ./corepack.tgz` : 提前打离线包
- `corepack install -g --cache-only ./corepack.tgz` : 在离线环境灌入缓存

```bash
corepack enable

cd my-project
corepack use pnpm@10
pnpm install
```

### 它解决的不是“安装依赖”，而是“统一包管理器版本”

- 项目里写 `packageManager` 后，团队成员不用手动对齐 pnpm / Yarn 版本
- 同一个仓库能明确拒绝错误的包管理器，避免 `yarn.lock` / `pnpm-lock.yaml` 被串坏
- 在 CI、容器、离线环境里，可以提前把包管理器本身缓存好

## 最小工作流
---
lang: json
emoji: 🚀
link: https://github.com/nodejs/corepack#when-authoring-packages
desc: 新项目或老项目接入 Corepack 时，最短路径通常是“启用 shim -> 写 packageManager -> 正常用 pnpm / yarn 命令”。Corepack 介入点很薄，但版本约束很关键。
---

### 1. 启用命令入口

```bash
corepack enable
```

### 2. 给项目锁定包管理器版本

```bash
# 给当前项目写入 packageManager，并触发一次安装
corepack use pnpm@10
```

### 3. 之后直接用原生命令

```bash
pnpm install
pnpm run dev
```

### package.json 最小示例

```json
{
  "packageManager": "pnpm@10.32.1"
}
```

### 什么时候该再加 hash

- 团队想进一步约束供应链完整性
- 需要把版本和校验值一起固定，减少“同名版本来源不一致”的风险

```json
{
  "packageManager": "yarn@3.2.3+sha224.953c8233f7a92884eee2de69a1b92d1f2ec1655e66d08071ba9a02fa"
}
```

## 高频场景 Recipes
---
lang: bash
emoji: 🍳
link: https://github.com/nodejs/corepack#usage
desc: Corepack 最常见的场景不是单独执行自己，而是嵌在“项目初始化、团队协作、CI 镜像、离线环境”这些工作流里。先按场景找路，再抄命令。
---

### 场景 1：给现有 pnpm 项目补上版本钉子

- 适合仓库已经在用 pnpm，但大家本地版本飘来飘去
- 目标是让仓库显式声明 `packageManager`

```bash
corepack enable
corepack use pnpm@10
pnpm install
```

### 场景 2：仓库明明写了 pnpm，你却误敲了 yarn

- Corepack 会拦住错误的包管理器
- 这类限制正是它的价值，不建议为了省事直接关掉

```bash
# 在 packageManager 指向 pnpm 的仓库里
yarn install

# 正确做法
pnpm install
```

### 场景 3：CI / 容器里减少首次下载抖动

- 先把包管理器缓存打包到产物
- 构建节点再从本地包恢复，不依赖运行时联网

```bash
# 联网环境里先打包
corepack pack pnpm@10 -o ./.cache/corepack-pnpm10.tgz

# 离线或受限环境里恢复
corepack install -g --cache-only ./.cache/corepack-pnpm10.tgz
pnpm install --frozen-lockfile
```

### 场景 4：升级项目到同一大版本的最新发行

- 只想跟进当前 major 线，比如 `pnpm@10.x`
- 不想一脚跨到新 major

```bash
corepack up
```

### 场景 5：明确切到新 major 或新管理器

- 这种情况用 `up` 不够，要显式 `use`
- `use` 会改 `packageManager`，所以要把变更一起提交

```bash
corepack use pnpm@latest

# 或者从 Yarn 切到 pnpm
corepack use pnpm@10
```

## 命令速查
---
lang: bash
emoji: ⚡
link: https://github.com/nodejs/corepack#utility-commands
desc: 下面这组命令就是日常最常抄的 Corepack 面板。可以把它理解成“包管理器版本路由器”的操作台。
---

### 核心命令

- `corepack enable [name]` : 创建指定包管理器的 shim；不带参数时尽量都启用
- `corepack disable [name]` : 移除 shim
- `corepack install` : 下载并安装当前项目声明的包管理器
- `corepack install -g pnpm@10` : 安装并设为系统级默认版本
- `corepack use pnpm@10` : 写入当前项目的 `packageManager` 并执行安装
- `corepack up` : 升级当前项目包管理器到同 major 最新版
- `corepack pack pnpm@10 -o ./corepack.tgz` : 下载并打成离线档案
- `corepack cache clean` : 清理 `COREPACK_HOME` 缓存
- `corepack pnpm@10.32.1 install` : 强制用某个版本执行一次命令

```bash
# 只启用 pnpm / yarn
corepack enable pnpm yarn

# 给项目拉取 packageManager 指定的版本
corepack install

# 系统外部默认走 pnpm 10
corepack install -g pnpm@10

# 排查回归时用指定版本跑一次
corepack pnpm@10.32.1 install
```

### `use`、`install`、`up` 怎么选

- `corepack use ...` : 改项目声明，适合初始化或显式升级
- `corepack install` : 不改声明，只把当前项目需要的版本装下来
- `corepack up` : 只在当前 major 线上追最新

### `enable` 和 `install -g` 的差别

- `enable` 重点是把入口命令挂到 PATH 附近
- `install -g` 重点是准备系统级默认版本
- 常见顺序是先 `enable`，再按项目 `use` / `install`

## 项目声明速查
---
lang: json
emoji: 🧾
link: https://github.com/nodejs/corepack#devenginespackagemanager
desc: Corepack 真正依赖的是项目声明，而不是全局状态。优先记住 `packageManager`；`devEngines.packageManager` 更像额外校验层。
---

### `packageManager`

- 必须是明确版本，不能只写名字
- 允许 `yarn`、`npm`、`pnpm`
- 可以附加 hash
- 也可以指向 `.js` 或 `.tgz` URL，但这是高级用法

```json
{
  "packageManager": "pnpm@10.32.1"
}
```

### `devEngines.packageManager`

- 用来校验开发环境是否匹配
- 可选 `onFail: ignore | warn | error`
- 如果顶层 `packageManager` 缺失，它也能兜底，但必须写具体版本

```json
{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "10.32.1",
      "onFail": "error"
    }
  }
}
```

## 离线、代理与缓存
---
lang: bash
emoji: 🌐
link: https://github.com/nodejs/corepack#offline-workflow
desc: Corepack 本身会去 npm registry 拉包管理器发行包，所以内网、代理、CI 冷启动最容易出问题。这里优先记缓存与网络开关。
---

### 最小离线流程

```bash
# 在能联网的机器上准备档案
corepack pack yarn@stable -o ./corepack-yarn.tgz

# 在目标机器上仅从离线档案安装缓存
corepack install -g --cache-only ./corepack-yarn.tgz
```

### 常见环境变量

- `COREPACK_HOME` : Corepack 缓存目录
- `COREPACK_ENABLE_NETWORK=0` : 禁止联网，要求你自己预热缓存
- `COREPACK_DEFAULT_TO_LATEST=0` : 不再自动查远端最新版本
- `COREPACK_ENABLE_AUTO_PIN=1` : 发现项目没写 `packageManager` 时自动补写
- `COREPACK_NPM_REGISTRY` : 指定拉包管理器时使用的 registry
- `HTTP_PROXY` / `HTTPS_PROXY` / `NO_PROXY` : 代理设置

```bash
# 受限环境里显式关闭网络
$env:COREPACK_ENABLE_NETWORK="0"
corepack install
```

## Windows / Node 版本分支
---
lang: powershell
emoji: 🪟
link: https://github.com/nodejs/corepack#default-installs
desc: Windows 和 Node 版本差异是 Corepack 最常见的两类“明明命令没错却跑不通”。尤其 Node 25 起不再随 Node 默认分发 Corepack，要单独注意。
---

### Node 版本要点

- Node.js `14.19.0` 到 `<25.0.0` 默认随 Node 分发 Corepack
- Node.js `25.0.0` 起不能再默认假设系统里自带 Corepack
- 当前 npm 包 `corepack@0.34.6` 的 `engines` 要求：`^20.10.0 || ^22.11.0 || >=24.0.0`

### Windows 常见处理

- 如果是 Node 的 `.msi` 安装带来的 Corepack，想改用 npm 最新版，可能要先在 Windows 的 Node 安装功能里把 Corepack 组件移除
- PowerShell 下如果二进制所在目录不可写，可以用函数别名兜底

```powershell
function pnpm { corepack pnpm @args }
function yarn { corepack yarn @args }
function npm { corepack npm @args }
```

## 排障速记
---
lang: bash
emoji: 🛠️
link: https://github.com/nodejs/corepack#troubleshooting
desc: Corepack 的问题大多不是“命令语法错”，而是 shim 没放好、项目声明冲突、网络拉取失败、或者缓存不一致。排障时先判断问题落在哪一层。
---

### 高频症状与处理

- `pnpm` / `yarn` 命令找不到 : 先跑 `corepack enable`
- 仓库里写的是 pnpm，却被拒绝执行 yarn : 不是 bug，说明项目声明生效
- 冷启动一直卡下载 : 检查代理、registry、DNS，再考虑先 `pack`
- 想看更细日志 : `DEBUG=corepack`
- 缓存脏了或装错版本 : `corepack cache clean`

```bash
# Linux / macOS
DEBUG=corepack corepack install

# PowerShell
$env:DEBUG="corepack"
corepack install

# 清缓存后重装
corepack cache clean
corepack install
```

### Quick Ref

- “给项目定版本” 用 `corepack use`
- “按项目声明装下来” 用 `corepack install`
- “同 major 升级” 用 `corepack up`
- “离线预热” 用 `corepack pack` + `corepack install -g --cache-only`
- “命令找不到” 先怀疑 `corepack enable`
