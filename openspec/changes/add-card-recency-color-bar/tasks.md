## 1. 日期解析与新旧程度计算

- [x] 1.1 盘点导览页卡片当前可读取的日期来源，确认 [assets/nav.js](E:/project/self.project/cheatsheet-generate/assets/nav.js) 中 recency 逻辑使用的日期文本入口
- [x] 1.2 在 [assets/nav.js](E:/project/self.project/cheatsheet-generate/assets/nav.js) 中实现严格的 `YYYY-MM-DD` 日期解析与无效值识别，排除 `unknown`、缺失值 and 非法格式
- [x] 1.3 为所有有效日期卡片计算统一的 recency 分值，并处理“所有日期相同”与“无有效日期”两类边界情况

## 2. 卡片底部 bar 与主题样式

- [x] 2.1 在 [assets/nav.js](E:/project/self.project/cheatsheet-generate/assets/nav.js) 中为每张卡片注入 recency 状态和底部 bar 所需的 dataset 或 CSS 变量
- [x] 2.2 在 [assets/nav.css](E:/project/self.project/cheatsheet-generate/assets/nav.css) 中新增卡片底部 recency bar 样式，实现最旧灰色到最新绿色的连续映射
- [x] 2.3 为亮色与暗色主题分别校准 recency 色条的对比度，并确认其不与 `.card-highlight`、复制按钮和现有卡片内容冲突

## 3. 构建验证与回归检查

- [x] 3.1 重新生成导航页产物，确认 recency bar 在构建后的 `index.html` 中可正常展示
- [x] 3.2 校验包含有效日期、缺失日期、无效日期和相同日期的卡片在页面中都能稳定显示预期 bar
- [x] 3.3 复测搜索、排序、键盘高亮和主题切换流程，确认新增 recency 指示不会破坏现有导航页交互
- [x] 3.4 在排序中增加按时间排序的功能（最新、最旧）
