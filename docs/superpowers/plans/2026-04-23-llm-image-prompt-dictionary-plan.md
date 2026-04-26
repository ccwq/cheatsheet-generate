# prompt-image-gen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `prompt-image-gen` 条目重构为按画面维度查词的提示词词典手册，并补充高价值场景专题词库。

**Architecture:** 保留现有 topic 目录和 icon，重写 Markdown 主体结构，删除以模型介绍和 API 为主的段落，改成“入口卡 + 拼装顺序卡 + 通用维度词典 + 场景专题词库 + 收尾提醒”。来源映射同步收敛到提示词相关资料。

**Tech Stack:** Markdown cheatsheet source, YAML meta, existing cheatsheet HTML generator, navigation builder

---

### Task 1: 重写主文档结构

**Files:**
- Modify: `cheatsheets/prompt-image-gen/prompt-image-gen.md`

- [ ] **Step 1: 重写 frontmatter 与总标题下的首屏入口**

把开头收敛成词典定位，不再突出 API 和产品线信息。

- [ ] **Step 2: 写入“最小拼装顺序卡”**

顺序固定为：

```text
主体 -> 场景 -> 构图 -> 镜头 -> 光线 -> 色彩 -> 材质细节 -> 氛围 -> 动作 -> 文字 -> 负面限制
```

- [ ] **Step 3: 写入通用维度词典**

新增以下卡片：

```text
主体
构图
镜头
光线
色彩
材质与细节
氛围
动作与状态
场景
风格
文字排版
负面限制
```

- [ ] **Step 4: 写入场景专题词库**

新增以下卡片：

```text
人像
产品静物
电影感场景
海报与标题字
食物 / 饮品
室内空间
赛博 / 科幻
自然风光 / 天气
```

- [ ] **Step 5: 写入收尾提醒**

补“常见缺词补全提示”和“最常见错误”。

### Task 2: 收敛元数据与来源

**Files:**
- Modify: `cheatsheets/prompt-image-gen/meta.yml`
- Modify: `cheatsheets/prompt-image-gen/refmap.md`

- [ ] **Step 1: 更新 meta 描述**

把 `meta.yml` 改成“提示词词典 / 描述词库 / 场景专题”导向。

- [ ] **Step 2: 更新 refmap**

保留官方 prompt 入口和本地参考页，删除与当前文档定位弱相关的模型关系堆叠。

### Task 3: 生成与验证

**Files:**
- Verify: `cheatsheets/prompt-image-gen/prompt-image-gen.html`
- Verify: `index.html`

- [ ] **Step 1: 生成单页 HTML**

Run: `node ./cheatsheet-html-maker/index.js --input ./cheatsheets/prompt-image-gen/prompt-image-gen.md`

Expected: 输出 `生成完成` 且生成新的 `prompt-image-gen.html`

- [ ] **Step 2: 重建导航页**

Run: `npm run build:nav`

Expected: 输出 `导航页已生成: index.html`

- [ ] **Step 3: 验证预览页面可访问**

Run: `npm run preview`

Then request:

```text
http://localhost:36715/cheatsheets/%E5%A4%A7%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B%E7%94%9F%E5%9B%BE/%E5%A4%A7%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B%E7%94%9F%E5%9B%BE.html
```

Expected: 返回 `HTTP 200`
