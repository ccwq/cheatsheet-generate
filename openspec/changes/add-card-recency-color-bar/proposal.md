## Why

当前导览页卡片在视觉上缺少对内容新旧程度的直观表达，用户需要逐个阅读日期信息才能判断哪些 cheatsheet 较新、哪些相对陈旧，筛选成本偏高。现在补充基于时间顺序的颜色映射与底部色条，可以在不打断现有浏览流程的前提下，快速强化列表页的信息层级与可扫描性。

## What Changes

- 为导览页卡片增加基于时间顺序的视觉映射，使较新的条目呈现更偏绿色的提示，较旧的条目呈现更偏灰色的提示。
- 在每张卡片底部增加一条用于表达新旧程度的 bar，而不是改动卡片主体结构，降低对现有布局与可读性的干扰。
- 统一定义时间数据到视觉强度的映射规则，确保“最新”与“最旧”之间存在连续、稳定、可解释的梯度表现。
- 处理缺失日期、无效日期或同日期条目等边界情况，保证导览页在异常元数据下仍能稳定展示。

## Capabilities

### New Capabilities
- `navigation-card-recency-indicator`: 为导览页卡片提供基于更新时间排序的底部色条与颜色梯度映射能力，覆盖数据解析、归一化排序与视觉输出规则。

### Modified Capabilities
- 无

## Impact

- 影响导览页卡片的数据增强与排序辅助逻辑，主要涉及 [assets/nav.js](E:/project/self.project/cheatsheet-generate/assets/nav.js) 中的卡片 dataset 处理与渲染增强流程。
- 影响导览页卡片样式体系，主要涉及 [assets/nav.css](E:/project/self.project/cheatsheet-generate/assets/nav.css) 以及可能的设计变量文件。
- 依赖现有 cheatsheet `meta.yml` 中的 `date` 字段质量；对于缺失或异常值，需要定义回退策略。
- 不涉及外部 API、发布流程或 cheatsheet 内容结构变更，但会改变导览页卡片的视觉反馈方式。
