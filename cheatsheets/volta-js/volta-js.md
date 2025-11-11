# Volta.js Node版本管理器

> 基于 `cheatsheets/volta-js/volta-js.html` 梳理，面向大模型提示与自动化生成场景优化，便于按章节引用。

## 快速索引
- [基础命令](#基础命令)
- [项目管理](#项目管理)
- [包管理](#包管理)
- [工作原理](#工作原理)
- [常用场景](#常用场景)
- [故障排除](#故障排除)
- [最佳实践](#最佳实践)
- [高级用法](#高级用法)
- [工具对比](#工具对比)
- [企业应用](#企业应用)
- [资源链接](#资源链接)
- [钩子机制](#钩子机制)
- [包二进制管理](#包二进制管理)
- [安装器配置](#安装器配置)
- [工作区管理](#工作区管理)
- [pnpm支持](#pnpm支持)
- [卸载方法](#卸载方法)


## 基础命令 [🔗](https://docs.volta.sh/guide/getting-started)

### 版本安装
- `volta install node` - 安装最新稳定版
- `volta install node@22.5.1` - 安装指定版本
- `volta install node@lts` - 安装最新LTS版本
- `volta install npm/yarn/pnpm` - 安装包管理器

### 版本管理
- `volta fetch node@18` - 下载但不激活
- `volta list` - 列出已安装版本
- `volta list all` - 列出所有可用版本
- `volta list --default` - 显示默认版本

## 项目管理 [🔗](https://docs.volta.sh/guide/getting-started)

### 版本锁定
- `volta pin node@18` - 锁定Node版本
- `volta pin npm@9` - 锁定npm版本
- `volta pin yarn@1.22` - 锁定Yarn版本
- `volta pin pnpm@8` - 锁定pnpm版本

### 配置存储
版本信息保存在package.json的volta字段中

## 包管理 [🔗](https://docs.volta.sh/guide/getting-started)

### 全局包
- `volta install typescript` - 安装全局包
- `volta uninstall typescript` - 卸载全局包
- `volta list` - 列出已安装全局包

### 项目依赖
- `volta pin @types/node@20` - 锁定包版本
- `volta pin typescript@latest` - 使用最新版本


## 工作原理 [🔗](https://docs.volta.sh/guide/understanding)

### 版本检测机制
1. 自动检测package.json
2. 读取volta字段配置
3. 自动切换版本

### 版本优先级
1. 项目级版本（package.json volta字段）
2. 用户默认版本
3. 系统安装版本

### 工具隔离
- 每个Node版本独立包环境
- 全局包与Node版本绑定
- 避免版本冲突

## 常用场景

### 新项目设置
```bash
cd my-project
volta pin node@18
volta pin npm@9
npm install
```

### 旧项目维护
```bash
cd legacy-project
volta pin node@14
npm install
npm run dev
```

### 团队协作
- 提交volta配置到git
- 团队成员自动使用相同版本
- 避免"在我机器上能运行"问题

## 故障排除

### 常见问题
- `command not found: volta` - 检查PATH配置
- `permission denied` - 检查文件权限
- `network error` - 检查网络或代理

### 调试命令
- `volta --version` - 检查Volta版本
- `volta which node` - 查看当前Node路径
- `volta list --current` - 查看当前激活版本


## 最佳实践

### 版本选择原则
- 新项目使用最新LTS版本
- 维护项目保持原有版本
- 定期更新安全补丁版本

### 项目配置示例
```json
{
  "volta": {
    "node": "18.17.0",
    "npm": "9.6.7"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### CI/CD集成
- 构建脚本中安装Volta
- 使用volta安装指定版本
- 确保构建环境一致性

## 高级用法

### 版本切换
- `volta use node@16` - 临时切换版本
- `volta use node@14 yarn@1.22` - 切换多个工具版本

### 自定义配置
```bash
export VOLTA_HOME="$HOME/.custom-volta"
export PATH="$VOLTA_HOME/bin:$PATH"
```

### 代理设置
```bash
export https_proxy=http://proxy.company.com:8080
export http_proxy=http://proxy.company.com:8080
volta install node@18
```

## 工具对比

### Volta vs nvm
- **性能**：Volta启动更快，更轻量
- **项目管理**：Volta支持项目级版本锁定
- **包管理**：Volta更好的全局包管理
- **跨平台**：Volta原生支持Windows

### Volta vs fnm
- **安装方式**：Volta集成度更高
- **配置**：Volta配置更简单
- **生态**：Volta支持更多包管理器

## 企业应用

### 团队标准化
- 统一开发环境版本
- 简化新人上手流程
- 减少环境相关问题

### CI/CD集成示例
```yaml
# GitHub Actions
- name: Install Volta
  run: curl https://get.volta.sh | bash
- name: Install Node
  run: volta install node@18
```

### 安全考虑
- 锁定版本避免意外更新
- 隔离包环境防止冲突
- 支持离线安装和缓存

## 钩子机制

### 配置位置
- 全局配置：`~/.volta/hooks.json`（Linux/MacOS）
- 项目配置：`<PROJECT_ROOT>/.volta/hooks.json`

### 钩子类型
- `prefix`：URL 前缀替换
- `template`：URL 模板替换
- `bin`：外部脚本调用

### 配置示例
```json
{
  "node": {
    "index": { "bin": "/usr/local/node-lookup" },
    "latest": { "prefix": "http://example.com/node/" },
    "distro": { "template": "http://example.com/{{os}}/{{arch}}/node-{{version}}.tar.gz" }
  }
}
```

## 包二进制管理

### 自定义下载位置
- 创建 `~/.npmrc` 文件
- 支持内部仓库和私有 repo

### Node 版本固定
- Volta 0.9.0+：固定到当前默认 Node 版本
- 使用 `volta run --node 15 npm i -g ember-cli` 指定版本

### 引擎要求
- 根据 package.json 中的 engines 字段确定版本
- 优先选择满足要求的最新 LTS 版本

## 安装器配置

### 跳过自动设置
```bash
curl https://get.volta.sh | bash -s -- --skip-setup
```

### 安装旧版本
```bash
curl https://raw.githubusercontent.com/volta-cli/volta/.../dev/unix/volta-install.sh | bash -s -- --version 1.0.8
```

### 自定义安装
- 分发二进制文件到目标机器
- 添加 shim 目录到 PATH
- 可选：设置自定义 VOLTA_HOME

## 工作区管理

### 扩展配置
```json
{
  "volta": {
    "extends": "../path/to/root/package.json"
  }
}
```

### 工具固定
- `volta pin` 添加到最近的 package.json
- 根目录配置需在工作区根目录运行

### 项目本地依赖
- 在每个 extends 指向的文件位置查找
- 检测 node_modules/.bin 中的本地依赖

## pnpm支持

### 安装 pnpm
- `volta install pnpm`：安装 pnpm
- `volta pin pnpm@8`：为项目锁定版本

### 使用 pnpm
- 自动管理 pnpm 版本
- 与 Node 版本绑定
- 支持工作区项目

### 最佳实践
- 在团队项目中统一 pnpm 版本
- 结合 volta 字段确保一致性

## 卸载方法

### Unix 卸载
```bash
rm -rf ~/.volta
```
- 删除 ~/.volta 目录
- 编辑 shell 配置文件移除 Volta 相关行

### Windows 卸载
- 开始 > 设置 > 应用
- 选择 Volta 并点击卸载

## 资源链接

### 官方资源
- 官方网站：https://volta.sh
- 官方文档：https://docs.volta.sh
- GitHub仓库：https://github.com/volta-cli/volta

### 社区资源
- 用户案例：https://volta.sh/love
- 官方博客：https://volta.sh/blog
- 社区讨论：https://github.com/volta-cli/volta/discussions

### 相关工具
- Node.js：https://nodejs.org
- npm：https://npmjs.com
- Yarn：https://yarnpkg.com