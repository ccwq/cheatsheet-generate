# Commander.js 参考资源

## 官方入口

- [GitHub 仓库](https://github.com/tj/commander.js) - 官方源码仓库
- [README](https://github.com/tj/commander.js#readme) - 官方主文档，含 quick start、options、commands、help、error 行为
- [NPM 包页](https://www.npmjs.com/package/commander) - 版本、安装方式与包简介
- [中文文档](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md) - 官方仓库内的中文说明

## 本 cheatsheet 对应来源映射

- `快速定位 / 一眼入口`：README 顶部定位说明 + NPM 包页
- `最小工作流`：Quick Start、Options、Commands、Action handler 说明
- `高频场景 Recipes`：README 中 `requiredOption`、boolean / negatable options、custom processing、global options、help / error 相关章节
- `Quick Ref / 命令骨架速查`：README 的 Commands、Options、Help、Output、Stand-alone executable subcommands
- `设计建议与常见坑`：基于官方命令模型整理出的工程化使用建议

## 关键章节

- [Quick start](https://github.com/tj/commander.js#quick-start)
- [Commands](https://github.com/tj/commander.js#commands)
- [Options](https://github.com/tj/commander.js#options)
- [Custom option processing](https://github.com/tj/commander.js#custom-option-processing)
- [Help](https://github.com/tj/commander.js#display-help-from-code)
- [Override exit and output handling](https://github.com/tj/commander.js#override-exit-and-output-handling)
- [Stand-alone executable subcommands](https://github.com/tj/commander.js#stand-alone-executable-subcommands)

## 补充说明

- `commander` 当前稳定版为 `14.0.3`，包页声明 Node.js 要求 `>=20`
- 若你的 CLI 已经进入复杂交互阶段，通常不是继续堆 `option()`，而是把参数解析交给 `commander`、把交互收集交给 `inquirer`
