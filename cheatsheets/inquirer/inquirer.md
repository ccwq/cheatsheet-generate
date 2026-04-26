---
title: Inquirer.js 速查表
lang: javascript
version: "13.4.1"
date: 2026-04-07
github: SBoudrias/Inquirer.js
colWidth: 360px
---

# Inquirer.js 速查表

## 快速定位 / 一眼入口
---
lang: javascript
emoji: 🎛️
link: https://www.npmjs.com/package/inquirer
desc: `inquirer` 现在更适合维护旧 CLI 或渐进迁移项目。新项目如果只想要现代 prompt API，官方更推荐直接使用 `@inquirer/prompts`；但在需要兼容旧插件、`question[]` 配置流或已有脚手架时，`inquirer` 仍然是常见入口。
---

### 这是什么，先怎么选
```javascript
// 旧项目 / 现有脚手架还在用 question[] -> 继续用 inquirer
npm install inquirer

// 新项目只要 prompt API -> 优先看新包
npm install @inquirer/prompts

// 最小起手式：一次收集一组答案
import inquirer from 'inquirer';

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'projectName',
    message: '项目名?',
  },
]);

console.log(answers.projectName);
```

### 快速判断：什么时候该用它
```javascript
保留旧版脚手架 / prompt 插件生态   -> inquirer
新 CLI，只想直接调用单个 prompt    -> @inquirer/prompts
要按 question[] 批量描述问卷       -> inquirer
要渐进迁移，不想一次性重写         -> 两者并存也可以
```

## 最小工作流
---
lang: javascript
emoji: 🧭
link: https://github.com/SBoudrias/Inquirer.js/blob/main/packages/inquirer/README.md
desc: 实战里可以把 Inquirer 理解成“命令行表单引擎”。典型链路不是把所有类型背下来，而是先定问题流，再给每一步补 `validate`、`when` 和 `choices`。
---

### 从 0 到可运行问答流
```javascript
import inquirer from 'inquirer';

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: '项目名?',
    validate(value) {
      return value.trim() ? true : '项目名不能为空';
    },
    filter(value) {
      return value.trim();
    },
  },
  {
    type: 'confirm',
    name: 'useTypeScript',
    message: '启用 TypeScript?',
    default: true,
  },
  {
    type: 'list',
    name: 'packageManager',
    message: '包管理器?',
    choices: ['npm', 'pnpm', 'yarn'],
  },
]);

console.log(answers);
```

### 速查：一条典型设计思路
```javascript
1. 先用 input / confirm / list 跑通主线
2. 用 validate 保证输入质量
3. 用 filter 做归一化
4. 用 when 把分支题延后
5. 需要兼容旧插件时再考虑 registerPrompt
```

## 高频场景 Recipes
---
lang: javascript
emoji: 🍳
link: https://github.com/SBoudrias/Inquirer.js/tree/main/packages/inquirer/examples
desc: 重点不是“有哪些题型”，而是“如何把 CLI 决策流组织得不乱”。下面这几组写法覆盖了脚手架、发布脚本和交互式运维工具里最常见的场景。
---

### Recipe 1：脚手架首屏，先收最少关键信息
```javascript
const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'appName',
    message: '应用名?',
  },
  {
    type: 'list',
    name: 'template',
    message: '模板?',
    choices: ['web', 'node', 'library'],
  },
  {
    type: 'confirm',
    name: 'installDeps',
    message: '立即安装依赖?',
    default: true,
  },
]);
```

### Recipe 2：按前一个答案决定后续问题
```javascript
const answers = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'needProxy',
    message: '需要代理配置?',
    default: false,
  },
  {
    type: 'input',
    name: 'proxyUrl',
    message: '代理地址?',
    when(answers) {
      return answers.needProxy;
    },
    validate(value) {
      return /^https?:\/\//.test(value) ? true : '请输入 http(s) 地址';
    },
  },
]);
```

### Recipe 3：列表值和展示名分离，避免业务值污染 UI
```javascript
const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'runtime',
    message: '运行时?',
    choices: [
      { name: 'Node.js 20 LTS', value: 'node20' },
      { name: 'Node.js 22 LTS', value: 'node22' },
      { name: 'Bun', value: 'bun' },
    ],
  },
]);

console.log(answers.runtime);
```

### Recipe 4：checkbox 多选 + 最小数量校验
```javascript
const answers = await inquirer.prompt([
  {
    type: 'checkbox',
    name: 'features',
    message: '启用哪些能力?',
    choices: [
      { name: 'ESLint', value: 'eslint', checked: true },
      { name: 'Prettier', value: 'prettier' },
      { name: 'Vitest', value: 'vitest' },
    ],
    validate(value) {
      return value.length > 0 ? true : '至少选择一项';
    },
  },
]);
```

### Recipe 5：传入预填答案，跳过已知问题
```javascript
const presetAnswers = {
  projectName: 'demo-app',
};

const answers = await inquirer.prompt(
  [
    {
      type: 'input',
      name: 'projectName',
      message: '项目名?',
    },
    {
      type: 'confirm',
      name: 'gitInit',
      message: '初始化 Git?',
      default: true,
    },
  ],
  presetAnswers,
);
```

### Recipe 6：为旧生态注册自定义 prompt
```javascript
import inquirer from 'inquirer';
import searchPrompt from 'inquirer-search-list';

inquirer.registerPrompt('search-list', searchPrompt);

const answers = await inquirer.prompt([
  {
    type: 'search-list',
    name: 'packageName',
    message: '搜索依赖',
    choices: ['react', 'vue', 'svelte'],
  },
]);
```

### Recipe 7：在非 TTY 环境给出清晰兜底
```javascript
try {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'deploy',
      message: '继续部署?',
    },
  ]);

  console.log(answers.deploy);
} catch (error) {
  if (error.isTtyError) {
    console.error('当前环境不是交互终端，改走 CI 默认参数');
    process.exitCode = 1;
  }

  throw error;
}
```

## Quick Ref / 题型与配置速查
---
lang: javascript
emoji: 🧰
link: https://github.com/SBoudrias/Inquirer.js/blob/main/packages/inquirer/README.md#prompt-types
desc: 这一段只压高频项。要记住的不是所有字段，而是哪些字段最常组成“输入质量 + 分支流 + 展示层”的组合拳。
---

### 高频 prompt 类型
```javascript
input      // 单行文本输入
number     // 数值输入
confirm    // true / false
list       // 单选列表
rawlist    // 带索引的列表
expand     // 单键快捷选择
checkbox   // 多选列表
password   // 掩码输入
editor     // 打开系统编辑器输入长文本
```

### Question 对象里最常用字段
```javascript
type         // 题型
name         // answer key
message      // 提示文案
default      // 默认值
choices      // list / checkbox / expand 的选项
validate     // 校验输入，返回 true 或报错文本
filter       // 标准化输入后再写入 answers
transformer  // 只改显示，不改最终值
when         // 条件题
pageSize     // 长列表分页尺寸
loop         // list / checkbox 是否循环滚动
```

### 常抄的 choices 写法
```javascript
choices: ['npm', 'pnpm', 'yarn']

choices: [
  { name: '正式环境', value: 'prod' },
  { name: '预发环境', value: 'staging' },
]

choices: [
  '清缓存',
  new inquirer.Separator(),
  '重新安装依赖',
]
```

### 异步校验 / 异步选项
```javascript
{
  type: 'input',
  name: 'repo',
  message: '仓库名?',
  async validate(value) {
    const exists = await checkRepo(value);
    return exists ? '仓库已存在' : true;
  },
}

{
  type: 'list',
  name: 'branch',
  message: '分支?',
  async choices() {
    return await loadBranches();
  },
}
```

## 迁移与常见坑
---
lang: javascript
emoji: ⚠️
link: https://www.npmjs.com/package/@inquirer/prompts
desc: 这部分是这次更新最重要的差异点。旧 cheatsheet 容易把所有第三方 prompt 都算成 Inquirer 内建能力，但新版官方心智已经变了：`inquirer` 是 legacy 主包，现代写法很多时候应转向 `@inquirer/prompts`。
---

### 什么时候该转 `@inquirer/prompts`
```javascript
// 新项目更倾向这种“按需导入单个 prompt”的风格
import { input, confirm, select } from '@inquirer/prompts';

const projectName = await input({
  message: '项目名?',
});

const useTS = await confirm({
  message: '启用 TypeScript?',
  default: true,
});

const runtime = await select({
  message: '运行时?',
  choices: [
    { name: 'Node.js', value: 'node' },
    { name: 'Bun', value: 'bun' },
  ],
});
```

### 这次重构里明确去掉的旧认知
```javascript
// 这些不要再当成“内建 prompt 类型”写进速查主线
search-list      // 常见于第三方插件，不是内建
autocomplete     // 多来自插件生态

// 这些接口仍可用，但不该当成首推新写法
inquirer.ui.BottomBar
Reactive / RxJS 扩展流
createPromptModule + 旧式事件流
```

### 决策速记
```javascript
旧项目延续 + 兼容插件       -> inquirer
新项目 + 现代 API           -> @inquirer/prompts
要保留 question[] 声明式流  -> inquirer
要最小依赖和最直观单题调用   -> @inquirer/prompts
```
