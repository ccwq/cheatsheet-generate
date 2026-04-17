---
title: Commander.js 速查表
lang: javascript
version: "14.0.3"
date: 2026-01-31
github: tj/commander.js
colWidth: 360px
---

# Commander.js 速查表

## 快速定位 / 一眼入口
---
lang: javascript
emoji: 🧱
link: https://www.npmjs.com/package/commander
desc: `commander` 适合做 Node.js CLI 的“骨架层”：负责命令树、参数解析、help、错误输出和子命令分发。它通常和 `inquirer`、`chalk`、`ora` 这类库配合使用，而不是替代它们。
---

### 最短起手式
```javascript
npm install commander

import { Command } from 'commander';

const program = new Command();

program
  .name('acme')
  .description('示例 CLI')
  .version('1.0.0');

program
  .command('build')
  .description('构建项目')
  .action(() => {
    console.log('build');
  });

program.parse();
```

### 快速判断：它负责哪一层
```javascript
命令树 / 子命令分发        -> commander
选项与参数解析            -> commander
自动 help / usage         -> commander
交互式问答               -> 配合 inquirer
彩色输出 / loading 状态   -> 配合 chalk / ora
```

## 最小工作流
---
lang: javascript
emoji: 🧭
link: https://github.com/tj/commander.js#readme
desc: 实战里可以把 Commander 理解成“CLI 路由器”。先把程序级选项、子命令和 action 主线搭起来，再补校验、帮助文案、错误行为和输出策略。
---

### 从 0 到一个能跑的 CLI
```javascript
import { Command } from 'commander';

const program = new Command();

program
  .name('deploy-tool')
  .description('部署工具')
  .version('0.1.0');

program
  .option('-c, --config <path>', '配置文件路径', './deploy.config.json')
  .option('-d, --debug', '输出调试信息');

program
  .command('deploy')
  .description('执行部署')
  .argument('<env>', '目标环境')
  .option('--dry-run', '仅预览，不真正执行')
  .action((env, options, command) => {
    const globalOptions = command.parent.opts();
    console.log({ env, options, globalOptions });
  });

program.parse();
```

### 速查：设计一个 CLI 的顺序
```javascript
1. 先定 program.name / description / version
2. 再拆 command 和 argument
3. 最后补 option、校验、help 文案
4. 输出复杂时，用 opts() / optsWithGlobals() 统一取值
5. 需要中断默认退出行为时，再用 exitOverride()
```

## 高频场景 Recipes
---
lang: javascript
emoji: 🍳
link: https://github.com/tj/commander.js#quick-start
desc: 真正常抄的不是零散 API，而是几种命令设计套路。下面这些场景覆盖了脚本工具、脚手架和团队内部运维 CLI 的高频写法。
---

### Recipe 1：单命令工具，参数比子命令更重要
```javascript
import { Command } from 'commander';

const program = new Command();

program
  .name('resize-image')
  .description('批量处理图片尺寸')
  .requiredOption('-i, --input <dir>', '输入目录')
  .requiredOption('-o, --output <dir>', '输出目录')
  .option('-w, --width <number>', '目标宽度', Number, 1280)
  .option('--webp', '输出为 webp')
  .action(() => {
    const options = program.opts();
    console.log(options);
  });

program.parse();
```

### Recipe 2：多子命令 CLI，把动作拆开
```javascript
program
  .command('init')
  .description('初始化项目')
  .action(() => {
    console.log('init');
  });

program
  .command('dev')
  .description('启动开发环境')
  .option('-p, --port <number>', '端口', Number, 3000)
  .action((options) => {
    console.log(options.port);
  });

program
  .command('release')
  .description('发布版本')
  .argument('<tag>', '版本标签')
  .action((tag) => {
    console.log(tag);
  });
```

### Recipe 3：做布尔反向开关，减少 if/else
```javascript
program
  .option('--cache', '启用缓存')
  .option('--no-color', '关闭彩色输出')
  .option('--no-open', '不要自动打开浏览器');

program.parse();

const options = program.opts();
console.log(options.cache); // true / false
console.log(options.color); // 默认 true，传 --no-color 后变 false
console.log(options.open);  // 默认 true，传 --no-open 后变 false
```

### Recipe 4：自定义 parser，把字符串转成业务值
```javascript
function collect(value, previous) {
  return previous.concat(value);
}

function toPort(value) {
  const port = Number.parseInt(value, 10);

  if (Number.isNaN(port)) {
    throw new Error('端口必须是数字');
  }

  return port;
}

program
  .option('-p, --port <number>', '服务端口', toPort, 8080)
  .option('-t, --tag <name>', '重复收集标签', collect, []);
```

### Recipe 5：把全局选项传进子命令
```javascript
program
  .option('--profile <name>', '当前环境 profile', 'default')
  .option('--debug', '调试模式');

program
  .command('deploy')
  .argument('<env>', '目标环境')
  .action((env, options, command) => {
    const globalOptions = command.optsWithGlobals();

    console.log({
      env,
      profile: globalOptions.profile,
      debug: globalOptions.debug,
    });
  });
```

### Recipe 6：增强帮助文案，降低维护成本
```javascript
program
  .name('acme')
  .usage('[global options] <command>')
  .addHelpText('after', `
Examples:
  $ acme init demo
  $ acme deploy prod --dry-run
`);

program.showHelpAfterError('(参数有误，查看上方帮助)');
program.showSuggestionAfterError();
```

### Recipe 7：拦截退出，给测试和集成调用留空间
```javascript
program.exitOverride();

try {
  program.parse(process.argv);
} catch (error) {
  if (error.code === 'commander.helpDisplayed') {
    process.exit(0);
  }

  if (error.code === 'commander.unknownOption') {
    console.error('未知参数:', error.message);
    process.exit(1);
  }

  throw error;
}
```

## Quick Ref / 命令骨架速查
---
lang: javascript
emoji: 🛠️
link: https://github.com/tj/commander.js#options
desc: 这一段压缩的是 Commander 的“骨架 API”。如果把 CLI 类比成前端路由配置，`command()` 像页面路由，`argument()` 像路径参数，`option()` 像 query / flags，`action()` 就是控制器。
---

### 核心骨架
```javascript
new Command()                // 创建程序实例
program.name('acme')         // CLI 名称
program.description('...')   // 简介
program.version('1.2.3')     // 版本号
program.parse()              // 解析 argv
program.opts()               // 读取当前命令选项
program.optsWithGlobals()    // 连同全局选项一起取值
```

### 命令与参数
```javascript
program.command('init')
program.command('deploy <env> [tag]')
program.argument('<file>', '必填参数')
program.argument('[pattern]', '可选参数')
program.arguments('<src> <dest>')
program.action((...args) => {})
```

### 高频 option 形态
```javascript
.option('-d, --debug', '布尔开关')
.option('-p, --port <number>', '带值选项')
.requiredOption('-c, --config <path>', '必填选项')
.option('--no-color', '反向布尔选项')
.option('-t, --tag <name...>', '变长参数')
.option('-n, --number <n>', '自定义 parser', Number)
```

### Help / Output / Error
```javascript
program.helpOption('-h, --help', '查看帮助')
program.addHelpText('after', 'Examples: ...')
program.summary('短摘要')
program.usage('[options] <command>')
program.showHelpAfterError()
program.showSuggestionAfterError()
program.configureOutput({
  outputError: (str, write) => write(`[ERR] ${str}`),
})
program.exitOverride()
```

### 独立可执行子命令
```javascript
program.command('install [packages...]', '安装依赖')

// 这类写法适合把大命令拆到独立文件
// commander 会查找同名前缀的外部可执行脚本
```

## 设计建议与常见坑
---
lang: javascript
emoji: ⚠️
link: https://github.com/tj/commander.js#stand-alone-executable-subcommands
desc: 旧 cheatsheet 往往只列 API，不告诉你 CLI 设计为什么会越写越乱。真正影响长期维护的是命令粒度、全局参数边界和 help 文案质量。
---

### 三个高频设计决策
```javascript
单动作工具                -> 一个 program + 多个 option
多阶段工具                -> 拆成多个 command
公共配置要跨命令共享       -> 放全局 option，再用 optsWithGlobals()
参数值要转业务对象         -> 自定义 parser
```

### 常见坑速记
```javascript
不要把所有能力都塞进根命令 option
不要把 requiredOption 和默认值逻辑写冲突
不要只写参数名，不写 description / help 示例
不要在 action 里直接散落读取 process.argv
不要忘记 unknown option / help displayed 的退出策略
```

### 和 Inquirer 的职责分工
```javascript
Commander 负责：命令树、flags、help、argv 解析
Inquirer 负责：交互式问答、条件题、列表选择

常见组合：
1. commander 先解析非交互参数
2. 缺的值再交给 inquirer 补问
3. 最后统一进入业务执行函数
```
