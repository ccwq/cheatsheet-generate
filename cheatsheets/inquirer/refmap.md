# Inquirer.js 参考资源

## 官方入口

- [NPM 包页](https://www.npmjs.com/package/inquirer) - 当前主包说明、安装方式与版本信息
- [GitHub 仓库](https://github.com/SBoudrias/Inquirer.js) - 官方源码仓库
- [主 README](https://github.com/SBoudrias/Inquirer.js/blob/main/packages/inquirer/README.md) - `inquirer` 的官方说明，含 legacy 定位、question 对象与 prompt 类型
- [官方示例目录](https://github.com/SBoudrias/Inquirer.js/tree/main/packages/inquirer/examples) - 常见 prompt 场景示例

## 新旧 API 分界

- [@inquirer/prompts](https://www.npmjs.com/package/@inquirer/prompts) - 官方推荐的新 prompt API 包
- [Packages 目录](https://github.com/SBoudrias/Inquirer.js/tree/main/packages) - Monorepo 下各子包关系，包括 `@inquirer/prompts`、`@inquirer/core`
- [@inquirer/core](https://github.com/SBoudrias/Inquirer.js/tree/main/packages/core) - 自定义 prompt 与底层构建能力

## 本 cheatsheet 对应来源映射

- `快速定位 / 一眼入口`：NPM 包页与主 README 顶部的 legacy 说明、安装入口
- `最小工作流`：主 README 中 `inquirer.prompt()`、Question 对象与常用字段
- `高频场景 Recipes`：官方 examples 目录 + README 中 question / choices / when / validate 说明
- `Quick Ref / 题型与配置速查`：README 的 Prompt Types、Question Object、Separator 说明
- `迁移与常见坑`：主 README 对 `@inquirer/prompts` 的推荐说明 + 新包包页

## 补充说明

- `search-list`、`autocomplete` 这类能力常见于插件生态，不属于 `inquirer` 内建 prompt 类型；若使用，需要单独核对对应插件仓库
- `inquirer` 仍在维护，但官方已明确建议现代新代码优先采用 `@inquirer/prompts`
