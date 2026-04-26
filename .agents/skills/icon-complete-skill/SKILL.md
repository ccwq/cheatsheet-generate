---
name: icon-complete-skill
description: 为本仓库的 cheatsheets 条目补齐、替换、批量整理导航图标的技能。仅用于本项目 `cheatsheets/主题目录/icon.png` 的生成与维护；当用户提到补图标、替换品牌图标、统一图标风格、修复导航页未显示 icon、批量补 icon.png 时使用。
---

# icon-complete-skill

为本仓库内的 cheatsheet 条目处理 `icon.png`，并保证导览页能正确加载。

## 输出边界

- 只处理 `cheatsheets/<topic>/icon.png`
- 用户只要求补图标时，不改 `<topic>.md`、`meta.yml`、`refmap.md`
- 图标不存在时才新增；用户要求替换时才覆盖
- 图标业务规则、导航页联动和尺寸约束见 `references/icon-flow.md`

## 执行流程

1. 先确认目标目录存在，并检查是否已有 `icon.png`
2. 优先寻找品牌/项目图标；找不到再退回语义图标或缩写图标
3. 生成透明底 PNG，并写入 `cheatsheets/<topic>/icon.png`
4. 若新增或替换了图标，执行 `npm run build:nav`
5. 批量处理时，只改用户指定范围或缺失项

## 自检

- 文件名固定为 `icon.png`
- 输出位置固定为 `cheatsheets/<topic>/`
- 未误改正文与元数据文件
- 已在需要时重建导航页
