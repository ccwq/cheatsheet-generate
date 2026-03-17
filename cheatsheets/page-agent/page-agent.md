---
title: Page Agent Cookbook
lang: js
version: 1.5.8
date: 2026-03-16
github: alibaba/page-agent
colWidth: 460px
---

# Page Agent Cookbook

## 快速定位
---
lang: js
link: https://github.com/alibaba/page-agent
desc: Page Agent 是“活在网页里的 GUI agent”。它不是 Puppeteer 那种站外自动化，而是把 agent 直接注入现有页面，用自然语言驱动 DOM 交互，适合做 SaaS Copilot、后台提效和辅助访问。
---

- 核心特点：纯页面内运行、文本化 DOM 理解、OpenAI 兼容模型接口、可选人工接管、多页面能力可接 Chrome Extension
- 适合场景：业务后台 Copilot、表单填写、复杂点击流压缩、站内智能助手、可访问性增强
- 当前核对版本：`1.5.8`
- 官方入口：仓库 `alibaba/page-agent`，站点 `https://alibaba.github.io/page-agent/`

## 起手工作流
---
lang: bash
link: https://alibaba.github.io/page-agent/
desc: 可以把它类比成“给现有页面挂一个会思考的前端控制层”。最低成本的起手方式永远是：先接模型，再给任务，再根据页面特点补规则和护栏。
---

```text
1. 选接入方式
   - 临时评估：script CDN
   - 正式产品：npm 安装 + 业务内初始化
2. 配模型
   - baseURL / apiKey / model
3. 定任务
   - agent.execute("用自然语言描述目标")
4. 加护栏
   - instructions / transformPageContent / enableMask / maxSteps
5. 多页面再补扩展
   - Chrome Extension
```

- Demo 评估优先用 CDN，产品集成优先用 npm
- 单页内任务直接起 `PageAgent`
- 有敏感数据、长页面、复杂业务规则时，优先补 `instructions` 和 `transformPageContent`

## 零后端验证
---
lang: html
link: https://github.com/alibaba/page-agent#one-line-integration
desc: 想先判断“这个页面能不能被自然语言接管”，最快方式不是搭完整工程，而是直接挂 demo 脚本。适合 PoC、售前演示、内网页面验证。
---

### 全局 CDN
```html
<!-- 官方 demo CDN，适合技术评估，不建议直接作为生产方案 -->
<script
  src="https://cdn.jsdelivr.net/npm/page-agent@1.5.8/dist/iife/page-agent.demo.js"
  crossorigin="true"
></script>
```

### 中国镜像
```html
<script
  src="https://registry.npmmirror.com/page-agent/1.5.8/files/dist/iife/page-agent.demo.js"
  crossorigin="true"
></script>
```

- 适合先回答一个问题：当前页面的 DOM 语义质量，够不够 agent 稳定操作
- 这是“技术评估入口”，不是长期生产接法
- 如果页面里本来就有复杂登录态、业务上下文、埋点和权限判断，尽快切到 npm 集成

## 产品内嵌 Copilot
---
lang: js
link: https://github.com/alibaba/page-agent#npm-installation
desc: 这是最像真实项目的 recipe。你像接一个前端 SDK 一样初始化它，只不过它消费的不是单个 API，而是自然语言任务和当前页面上下文。
---

### 最小可用接入
```bash
npm install page-agent
```

```js
import { PageAgent } from 'page-agent'

const agent = new PageAgent({
  model: 'qwen3.5-plus',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: 'YOUR_API_KEY',
  language: 'zh-CN',
})

await agent.execute('打开登录弹窗，然后点击手机号登录')
```

### 更像生产环境的初始化
```js
import { PageAgent } from 'page-agent'

const agent = new PageAgent({
  model: 'gpt-4.1',
  baseURL: 'https://your-openai-compatible-endpoint/v1',
  apiKey: import.meta.env.VITE_LLM_API_KEY,
  language: 'zh-CN',
  maxSteps: 24,
  stepDelay: 0.5,
  enableMask: true,
  viewportExpansion: 1200,
  instructions: {
    system: [
      '只能操作当前租户的数据。',
      '涉及提交、删除、付款前必须先复述你的判断。',
    ].join('\n'),
    getPageInstructions(url) {
      if (url.includes('/orders')) {
        return '订单页优先使用筛选条件缩小范围，不要直接全表扫描。'
      }
      return '找不到明显入口时，先观察可交互元素和按钮文本。'
    },
  },
})

await agent.execute('筛选待支付订单，并打开最新一条详情')
```

- `baseURL` / `apiKey` / `model` 走 OpenAI 兼容接口思路
- `enableMask` 适合在自动执行时阻止用户误点
- `viewportExpansion` 适合长页面，减少 agent 因“只看见首屏”而误判

## 表单与后台操作
---
lang: js
desc: Page Agent 最容易出价值的不是“炫技点按钮”，而是把 ERP / CRM / Admin 里那种 10 到 20 步的表单链路压缩成一句话。思路和前端做流程组件一样：先给上下文，再控副作用。
---

### 给后台表单加业务规则
```js
const agent = new PageAgent({
  model: 'gpt-4.1',
  baseURL: 'https://your-openai-compatible-endpoint/v1',
  apiKey: 'YOUR_API_KEY',
  language: 'zh-CN',
  instructions: {
    system: [
      '新增客户时，不要修改已有客户。',
      '手机号和身份证号属于敏感字段，不要在解释中回显完整值。',
      '如果页面里有多个相似按钮，优先选择主按钮。',
    ].join('\n'),
  },
  transformPageContent(content) {
    // 发送给模型前做脱敏，避免把完整敏感信息暴露给上游模型
    return content
      .replace(/1[3-9]\\d{9}/g, '***********')
      .replace(/[1-9]\\d{16}[\\dXx]/g, '******************')
  },
})

await agent.execute('新建一个上海地区的企业客户，并把联系人手机更新成 13800000000')
```

### 限制步骤，避免长链路失控
```js
const agent = new PageAgent({
  model: 'gpt-4.1',
  baseURL: 'https://your-openai-compatible-endpoint/v1',
  apiKey: 'YOUR_API_KEY',
  maxSteps: 12,
  stepDelay: 0.6,
})

const result = await agent.execute('填写报销单并提交审批')

if (!result.success) {
  console.error(result.data)
}
```

- `maxSteps` 是成本和稳定性的第一道闸门
- `transformPageContent` 适合做脱敏、裁剪噪音、补额外提示
- 对复杂后台来说，先把任务拆小，比一条超长 prompt 更稳

## 人工接管与自定义工具
---
lang: js
desc: 真正可落地的 GUI agent 往往不是“全自动”，而是“自动优先，关键节点有人兜底”。你可以把它理解成前端里的受控组件模式，关键状态仍然掌握在业务方手里。
---

### 让 agent 在不确定时向用户发问
```js
const agent = new PageAgent({
  model: 'gpt-4.1',
  baseURL: 'https://your-openai-compatible-endpoint/v1',
  apiKey: 'YOUR_API_KEY',
})

agent.onAskUser = async (question) => {
  return window.prompt(question) || ''
}

await agent.execute('找到目标客户，如果重名就先问我选哪一个')
```

### 增加业务工具
```js
import { PageAgent, tool } from 'page-agent'
import { z } from 'zod/v4'

const agent = new PageAgent({
  model: 'gpt-4.1',
  baseURL: 'https://your-openai-compatible-endpoint/v1',
  apiKey: 'YOUR_API_KEY',
  customTools: {
    lookup_order: tool({
      description: '根据订单号查询内部订单状态',
      inputSchema: z.object({
        orderId: z.string(),
      }),
      async execute({ orderId }) {
        const data = await fetch(`/api/orders/${orderId}`).then((r) => r.json())
        return JSON.stringify(data)
      },
    }),
  },
})

await agent.execute('查询订单 A2026-0317 的状态，再决定是否点击催单按钮')
```

- `customTools` 适合把“页面外知识”接回 agent
- 可以覆盖或移除内部工具，但这是高阶玩法，先做增量扩展更稳

## 多页面任务
---
lang: text
link: https://alibaba.github.io/page-agent/docs/features/chrome-extension
desc: Page Agent 默认思路是页面内增强，所以单页最顺手。要跨 Tab、跨页面或做更像浏览器助手的链路时，再上 Chrome Extension，不要一开始就把系统做重。
---

- 单页面：优先直接嵌入 `PageAgent`
- 多页面跳转：考虑官方 Chrome Extension
- 场景例子：从列表页打开详情页、跳转审批页、再回到原页面核对状态
- 决策原则：如果任务主价值在“当前页面理解”，先别急着做成浏览器级自动化

```text
推荐路径：
先把单页面任务跑稳
再评估是否真的需要跨页能力
最后才补扩展和更重的控制面
```

## 调优与风险控制
---
lang: js
link: https://alibaba.github.io/page-agent/docs/features/models
desc: Page Agent 的稳定性，核心不在“提示词写多长”，而在三个点：DOM 可读性、模型质量、护栏是否贴着业务规则。它很像前端性能问题，80% 的收益来自少数关键位。
---

- 模型接口配置：`baseURL`、`apiKey`、`model`、`temperature`、`maxRetries`
- DOM 调优：`viewportExpansion`、属性白名单、页面内可交互元素质量
- 执行调优：`maxSteps`、`stepDelay`
- 规则调优：`instructions.system`、`getPageInstructions(url)`、`customSystemPrompt`
- 安全调优：`transformPageContent` 做脱敏，谨慎开启 `experimentalScriptExecutionTool`

### 典型风控配置
```js
const agent = new PageAgent({
  model: 'gpt-4.1',
  baseURL: 'https://your-openai-compatible-endpoint/v1',
  apiKey: 'YOUR_API_KEY',
  maxSteps: 10,
  stepDelay: 0.8,
  language: 'zh-CN',
  experimentalLlmsTxt: true,
  onBeforeTask(agent) {
    console.log('task start:', agent.task)
  },
  onAfterTask(agent, result) {
    console.log('task done:', result.success)
  },
})
```

- `experimentalLlmsTxt` 适合目标站点自己提供了 `/llms.txt` 时使用
- `experimentalScriptExecutionTool` 能力强，但副作用和越权风险也更高
- 收尾动作别忘了 `agent.stop()` 和 `agent.dispose()`

## 收尾与排障
---
lang: js
desc: 当任务开始出现“模型会想，但页面老点错”的情况，通常先查 DOM 可读性和页面规则，而不是先堆更多 prompt。像排前端 bug 一样，先缩小现场，再加约束。
---

```js
const result = await agent.execute('筛选并导出上周新增客户')

if (!result.success) {
  console.error(result.data)
}

// 当前任务可中断，实例也可以复用
agent.stop()

// 页面卸载或组件销毁时记得释放
agent.dispose()
```

- 点错目标：先收窄页面任务描述，再补 `getPageInstructions`
- 反复兜圈：降低 `maxSteps`，拆任务
- 输出包含敏感内容：在 `transformPageContent` 里先遮罩
- 用户会和 agent 抢操作：打开 `enableMask`
