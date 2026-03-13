# tag-policy

## 标签文件位置

- 分组定义：`tags/tags-define.yml`
- 图标映射：`tags/tags-icon.yml`
- 条目使用：`cheatsheets/<topic>/meta.yml`

## 核心判断顺序

1. 先判断工具类型
2. 再判断平台 / 领域
3. 再补使用阶段
4. 最后补交互形态

## 常见归一化示例

- `Automation` -> `自动化工具`
- `CLI` -> `CLI 工具` 或 `命令行` 或 `CLI / Terminal`
- `Test` -> `测试`
- `Extension` -> `插件`
- `Web` -> `Web 前端`
- `Framework` -> `框架`
- `Library` -> `库 / SDK`

## 新标签命名要求

- 优先中文
- 命名简短稳定
- 能被多个 cheatsheet 复用
- 尽量放入现有四大分组之一

## 何时不要新增标签

- 只是某个项目的局部功能
- 只是正文中的关键词
- 能被已有标签组合表达
- 只会在一个条目里出现
