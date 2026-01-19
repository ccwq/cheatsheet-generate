# Inquirer.js 速查表

## 基础使用

```javascript
// 安装
// npm install inquirer

// 引入
const inquirer = require('inquirer');

// 基本提问结构
inquirer
  .prompt([
    // 提问配置
  ])
  .then(answers => {
    console.log('答案:', answers);
  })
  .catch(error => {
    if (error.isTtyError) {
      // 无法在当前环境中使用
    } else {
      // 其他错误
    }
  });
```

## 提问类型

### Input - 文本输入
```javascript
{
  type: 'input',
  name: 'name',
  message: '请输入你的名字:',
  default: '张三', // 默认值
  validate: function(value) {
    // 验证函数
    const valid = /^[a-zA-Z\u4e00-\u9fa5]+$/.test(value);
    return valid || '请输入有效的名字';
  },
  filter: function(value) {
    // 过滤函数，处理输入值
    return value.trim();
  },
  transformer: function(value) {
    // 转换显示值（不影响实际结果）
    return `名字: ${value}`;
  }
}
```

### Confirm - 确认
```javascript
{
  type: 'confirm',
  name: 'continue',
  message: '是否继续?',
  default: true
}
```

### List - 列表选择
```javascript
{
  type: 'list',
  name: 'framework',
  message: '选择一个框架:',
  choices: [
    'React',
    'Vue',
    'Angular',
    { name: 'Svelte', value: 'svelte-framework' }
  ],
  loop: false // 是否允许循环选择
}
```

### Checkbox - 多选
```javascript
{
  type: 'checkbox',
  name: 'languages',
  message: '选择你熟悉的语言:',
  choices: [
    { name: 'JavaScript', checked: true }, // 默认选中
    { name: 'Python', value: 'python-lang' },
    { name: 'Java' },
    { name: 'C++' }
  ],
  validate: function(answer) {
    if (answer.length < 1) {
      return '至少选择一个语言';
    }
    return true;
  }
}
```

### Password - 密码输入
```javascript
{
  type: 'password',
  name: 'password',
  message: '请输入密码:',
  mask: '*', // 掩码字符
  validate: function(value) {
    return value.length >= 6 || '密码长度至少6位';
  }
}
```

### Number - 数字输入
```javascript
{
  type: 'number',
  name: 'age',
  message: '请输入年龄:',
  default: 18,
  min: 0,
  max: 120,
  step: 1
}
```

### Editor - 编辑器输入
```javascript
{
  type: 'editor',
  name: 'description',
  message: '请输入详细描述:',
  default: '默认内容',
  postfix: '.md', // 临时文件后缀
  editor: 'code' // 指定编辑器
}
```

### Expand - 扩展选择
```javascript
{
  type: 'expand',
  name: 'action',
  message: '选择操作:',
  choices: [
    { key: 'y', name: '覆盖', value: 'overwrite' },
    { key: 'a', name: '覆盖全部', value: 'overwriteAll' },
    { key: 'n', name: '跳过', value: 'skip' },
    { key: 'd', name: '查看差异', value: 'diff' }
  ],
  default: 'y'
}
```

### SearchList - 搜索列表
```javascript
{
  type: 'search-list',
  name: 'package',
  message: '搜索包名:',
  choices: [
    'react',
    'react-dom',
    'react-router',
    'vue',
    'vue-router',
    'angular',
    'svelte'
  ]
}
```

## 高级配置

### 分页选项
```javascript
{
  type: 'list',
  name: 'longList',
  message: '长列表选择:',
  choices: [...Array(50).keys()].map(i => `选项 ${i+1}`),
  pageSize: 10, // 每页显示的选项数量
  loop: true
}
```

### 条件提问
```javascript
inquirer.prompt([
  {
    type: 'confirm',
    name: 'useCustomConfig',
    message: '是否使用自定义配置?',
    default: false
  },
  {
    type: 'input',
    name: 'configPath',
    message: '请输入配置文件路径:',
    when: function(answers) {
      // 只有当useCustomConfig为true时才显示
      return answers.useCustomConfig;
    }
  }
]);
```

### 循环提问
```javascript
const promptLoop = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'item',
      message: '输入项目 (输入q退出):'
    }
  ]);
  
  if (answers.item !== 'q') {
    // 处理输入
    return promptLoop();
  }
};

promptLoop();
```

## 事件处理

```javascript
const prompt = inquirer.createPromptModule();

// 监听键盘事件
const ui = new inquirer.ui.BottomBar();
ui.log.write('正在加载...');

// 处理答案变化
const answers = {};
prompt.on('answer', (name, value) => {
  answers[name] = value;
  ui.updateBottomBar(`已回答: ${name} = ${value}`);
});

prompt.on('complete', () => {
  ui.updateBottomBar('完成!');
});

prompt([
  // 提问配置
]);
```

## 自定义主题

```javascript
inquirer
  .prompt([
    // 提问配置
  ])
  .ui
  .setTheme({
    prefix: '🌈',
    spinner: 'dots',
    styles: {
      message: 'cyan',
      error: 'red',
      answer: 'green bold',
      defaultAnswer: 'gray italic'
    }
  });
```

## 预设主题

```javascript
const chalk = require('chalk');

const customTheme = {
  prefix: chalk.cyan('?'),
  spinner: {
    interval: 100,
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  },
  styles: {
    message: chalk.cyan,
    error: chalk.red,
    answer: chalk.green.bold,
    defaultAnswer: chalk.gray.italic
  }
};
```

## 工具函数

### 创建提问模块
```javascript
const prompt = inquirer.createPromptModule();

prompt([
  // 提问配置
]).then(answers => {
  // 处理答案
});
```

### 注册自定义提问类型
```javascript
inquirer.registerPrompt('custom-prompt', require('custom-prompt-module'));
```

### 验证器
```javascript
// 内置验证器
const { validate } = require('inquirer');

// 自定义验证器
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) || '请输入有效的邮箱地址';
};
```

## 常见示例

### 完整示例
```javascript
const inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入你的名字:',
      default: '开发者'
    },
    {
      type: 'number',
      name: 'age',
      message: '请输入年龄:',
      default: 18,
      min: 0,
      max: 120
    },
    {
      type: 'list',
      name: 'experience',
      message: '选择你的开发经验:',
      choices: ['初级', '中级', '高级']
    },
    {
      type: 'checkbox',
      name: 'skills',
      message: '选择你掌握的技能:',
      choices: ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Vue']
    },
    {
      type: 'confirm',
      name: 'continue',
      message: '是否继续?',
      default: true
    }
  ])
  .then(answers => {
    console.log('\n=== 收集到的信息 ===');
    console.log(`姓名: ${answers.name}`);
    console.log(`年龄: ${answers.age}`);
    console.log(`经验: ${answers.experience}`);
    console.log(`技能: ${answers.skills.join(', ')}`);
    console.log(`继续: ${answers.continue ? '是' : '否'}`);
  });
```

## 最佳实践

1. **合理组织提问顺序**：从简单到复杂，逻辑连贯
2. **提供默认值**：减少用户输入负担
3. **添加验证**：确保输入数据的有效性
4. **使用条件提问**：根据用户选择动态调整后续提问
5. **适当使用分页**：长列表选择时设置合理的pageSize
6. **保持消息简洁**：提问消息清晰明了
7. **处理错误**：捕获并处理可能的错误
8. **测试各种环境**：确保在不同终端环境下正常工作

## 版本兼容

- Inquirer v9.x：支持 ESM 和 CommonJS
- Inquirer v8.x：最后一个支持 Node.js 10 的版本
- Inquirer v7.x：支持 Node.js 8

## 相关资源

- 官方文档：https://www.npmjs.com/package/inquirer
- GitHub 仓库：https://github.com/SBoudrias/Inquirer.js
- 示例集合：https://github.com/SBoudrias/Inquirer.js/tree/master/examples
- 自定义提问类型：https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/README.md#writing-your-own-prompt