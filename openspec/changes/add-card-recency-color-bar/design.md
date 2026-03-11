## Context

当前导览页的卡片数据在生成阶段由 [scripts/generate-nav.js](E:/project/self.project/cheatsheet-generate/scripts/generate-nav.js) 从各 cheatsheet 的 `meta.yml` 中读取，并把 `date` 以纯文本形式渲染进 `.card-meta`。进入页面后，[assets/nav.js](E:/project/self.project/cheatsheet-generate/assets/nav.js) 仅对卡片做标题规范化、搜索缓存、复制按钮注入与排序增强，并没有把日期转成可参与视觉表达的数据字段。

这次变更虽然表现形式只是“卡片底部增加一条色条”，但它同时跨越生成脚本、前端增强脚本与导航样式层：生成阶段需要确保日期可被稳定读取，前端需要把日期转换为可比较的时间值，再把结果映射为统一的视觉强度。由于用户明确要求“最新采用绿色，最旧采用灰色”，设计重点不在新增交互，而在定义一套足够稳定、边界可控、不会破坏现有卡片信息密度的时间感知方案。

## Goals / Non-Goals

**Goals:**
- 为每张导航卡片计算一个可比较的新旧程度分值，并驱动底部 bar 的视觉表现。
- 明确“最新 -> 绿色、最旧 -> 灰色”的映射规则，保证中间状态连续过渡而不是离散跳变。
- 在不改动卡片主体内容结构的前提下，将新旧程度表达为轻量、低侵入的装饰层。
- 对缺失日期、无效日期、所有日期相同等情况提供稳定回退策略，避免页面表现异常。
- 让实现能够兼容现有明暗主题变量体系，不引入额外依赖。

**Non-Goals:**
- 不在本次引入新的排序方式或显式“按日期排序”控件。
- 不修改 cheatsheet 目录下 `meta.yml` 的格式约束，只消费已有 `date` 字段。
- 不把卡片主体背景整体染色，避免影响标题、简介、标签与 meta 信息的可读性。
- 不为“最新/最旧”增加额外文案徽章；本次只提供视觉条带提示。

## Decisions

### 1. 继续复用 `meta.yml.date`，并在浏览器端完成日期解析与归一化
- 决策：不修改 [scripts/generate-nav.js](E:/project/self.project/cheatsheet-generate/scripts/generate-nav.js) 的卡片结构，只保留现有日期文本输出；在 [assets/nav.js](E:/project/self.project/cheatsheet-generate/assets/nav.js) 的卡片增强阶段从 `.card-meta` 或现有数据中提取日期，解析为时间戳后统一计算 recency 分值。
- 理由：现有生成脚本已经把日期稳定渲染到卡片中，浏览器端二次解析的改造范围更小，不会扩大到导航页 HTML 生成模板与所有现有产物的结构变更。
- 备选方案：
  - 在生成阶段直接写入 `data-date` 或 `data-timestamp`：数据更干净，但需要同步改动模板输出，并重新生成所有导航页 HTML。
  - 运行时重新请求或读取源 `meta.yml`：实现复杂且不适合静态站点。

### 2. 用归一化区间映射 `0..1` 表示新旧程度，而不是只标记“最新/最旧”
- 决策：先取所有有效日期中的最小值与最大值，再对每张卡片按 `(current - min) / (max - min)` 归一化，得到 `recencyRatio`。值越接近 `1` 越新，越接近 `0` 越旧。
- 理由：用户要求的是从最新到最旧的连续视觉区分，而不是只有两个端点。归一化能保证不同数据规模下都得到稳定梯度，也便于 CSS 用自定义属性消费。
- 备选方案：
  - 按排名分桶：实现简单，但会让日期接近的条目被强行分到不同颜色档位，解释性较差。
  - 仅标记最新与最旧：太粗糙，无法满足“直观区分”的目标。

### 3. 底部 bar 通过伪元素或单独子节点实现，主体卡片保持中性
- 决策：在卡片底部追加一个专用 indicator 节点，例如 `.card-recency-bar`，或等价地使用卡片伪元素承载；其颜色由 CSS 变量驱动，卡片主体背景与文字颜色不随新旧程度变化。
- 理由：当前卡片承载标题、简介、标签与 meta 信息，若直接染色主体，容易破坏明暗主题下的对比度和层级。底部 bar 能以最小视觉占用传达状态，也符合用户提出的展示方式。
- 备选方案：
  - 整张卡片边框换色：存在噪音，且与当前卡片高亮态容易冲突。
  - 左侧色条：已与现有设计方向相悖，[assets/nav.css](E:/project/self.project/cheatsheet-generate/assets/nav.css) 里当前也明确关闭了左侧高亮条。

### 4. 颜色采用“灰 -> 绿”的单向渐变，并为无效日期提供中性兜底
- 决策：定义一组语义变量，例如 `--recency-old-color`、`--recency-new-color`，再根据 `recencyRatio` 生成当前卡片的 `--card-recency-color`。缺失或无效日期的卡片不参与 min/max 计算，并回退为偏灰的中性色条。
- 理由：这能精确对齐“最旧灰、最新绿”的要求，同时避免异常数据把整体梯度拉坏。无效日期使用中性值比硬编码为“最旧”更稳妥，因为它表达的是未知而不是一定陈旧。
- 备选方案：
  - 直接把无效日期当作最旧：实现简单，但语义不准确，可能误导用户。
  - 引入多色热力图：信息密度更高，但超出当前需求，也更容易破坏现有视觉风格。

### 5. 归一化与样式赋值放在 `enhanceCards()` 之后集中执行
- 决策：在 [assets/nav.js](E:/project/self.project/cheatsheet-generate/assets/nav.js) 现有 `enhanceCards()` 完成基础增强后，再新增一段独立逻辑扫描所有 `.card`，提取日期、计算 recency，并把结果写入 `dataset` 或内联 CSS 变量。
- 理由：这能复用现有卡片增强入口，保持初始化顺序单一；同时该能力与搜索、排序解耦，不需要混入 `filterCards()` 或 `sortCards()` 的逻辑。
- 备选方案：
  - 在 `filterCards()` 中动态计算：会造成重复计算，也让过滤逻辑承担无关职责。
  - 在模板渲染时预先写死颜色：缺乏主题适配弹性，不便后续调整色板。

## Risks / Trade-offs

- [日期文本格式不统一，浏览器原生解析结果不稳定] → Mitigation：只接受明确的 `YYYY-MM-DD` 形式，手动拆分成年月日并构造时间值，避免直接依赖 `Date.parse` 的宽松行为。
- [全部卡片日期相同，归一化分母为 0] → Mitigation：当 `max === min` 时，把所有有效日期卡片设为统一的中高强度绿色，而不是进行除零计算。
- [无效日期过多，整体色条价值下降] → Mitigation：将无效日期单独设为中性灰，并保留原始日期文本展示，用户仍可从元信息判断数据质量。
- [新增底部 bar 与卡片高亮态、hover 态冲突] → Mitigation：让底部 bar 独立占位或绝对定位在卡片底边，不复用边框颜色；高亮仍由现有 `.card-highlight` 负责。
- [明暗主题下同一绿色表现不一致] → Mitigation：使用主题变量分别定义浅色与深色环境中的 recency 色值，保证两套主题下都有足够对比度。

## Migration Plan

1. 在 [assets/nav.js](E:/project/self.project/cheatsheet-generate/assets/nav.js) 中增加日期提取、严格解析与 recency 归一化逻辑。
2. 为每张卡片注入 recency 结果，形式为 `data-recency`、`data-recency-state` 或 CSS 自定义属性。
3. 在 [assets/nav.css](E:/project/self.project/cheatsheet-generate/assets/nav.css) 中新增底部 bar 的样式与主题变量消费规则。
4. 校验深色与亮色主题下的卡片表现，确认 bar 不影响标题、简介、标签、复制按钮与高亮态。
5. 通过 `pnpm run build` 重新生成导航页并做视觉检查；如发现异常日期数据，再补充兜底规则。

## Open Questions

- 底部 bar 是采用纯色条，还是在纯色基础上加入轻微渐变与透明度层次；这属于视觉细节，实施时可根据现有卡片质感微调。
- 对于 `date: unknown` 或完全缺失日期的条目，是否需要后续再增加 tooltip 或说明文案，当前设计先按中性灰兜底。
