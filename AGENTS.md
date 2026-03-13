# Cheatsheet Generate 项目规范与指南

## 基础
这是一个根据用户提供主题生成 Cheatsheet 的项目

首先识别用户意图, 如果用户给出主题或者生成之类的要求, 就要创建cheatsheet
此时直接调用skill: cheatsheet-maker来完成后续工作
如果用户要求补标签、核查标签、统一标签体系或新增标签, 直接调用skill: tag-ci

## 工程约定

### 代码风格与注释
- 用户主语为中文，注释与文档优先中文
- 适度注释关键分支与逻辑，模板中可用简短行内注释
- 避免引入重量级依赖；以原生能力为先


## 运行与发布

### 开发和预览
使用npm run preview开启预览服务, 服务端口为36715, 成功后打开浏览器访问 `http://localhost:36715`
使用skill:agent-browser  执行浏览器操作, 务必为agent-browser加上参数 --cdp=9222执行所有操作,  如果连接浏览器失败, 停下来告诉我错误信息和需要我进行的操作

开发功能完成之后, 使用预览服务进行验证和测试


### 生成导览页
- 生成命令：`pnpm run build`（或 `npm run build`）
- 产物：`index.html`

### GitHub Pages
- Pages 源为 "Deploy from a branch"，分支 `main`，目录 `/(root)`
- 站点路径形如：`https://<user>.github.io/<repo>/`
- 模板中复制链接逻辑已兼容子路径部署

