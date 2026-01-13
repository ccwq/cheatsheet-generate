# Commander.js 速查表

Commander.js 是 node.js 命令行界面的完整解决方案，灵感来自 Ruby 的 commander。

## 安装

```bash
npm install commander
```

## 声明程序变量

```javascript
// CommonJS
const { program } = require('commander');

// 或者创建实例
const { Command } = require('commander');
const program = new Command();
```

## 选项 (Options)

### 常用选项类型
- `boolean`: 选项是否存在。
- `value`: 选项后接参数。

```javascript
program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

const options = program.opts();
```

### 默认值
```javascript
program.option('-c, --cheese <type>', 'add the specified type of cheese', 'blue');
```

### 取反布尔值 (Negatable Boolean)
定义以 `no-` 开头的选项。
```javascript
program.option('--no-sauce', 'Remove sauce');
```

### 必填选项 (Required Option)
```javascript
program.requiredOption('-c, --cheese <type>', 'pizza must have cheese');
```

### 变长参数 (Variadic Option)
```javascript
program.option('-n, --number <numbers...>', 'specify numbers');
```

### 版本选项 (Version Option)
```javascript
program.version('0.0.1', '-v, --vers', 'output the current version');
```

### 自定义选项处理
```javascript
function myParseInt(value, dummyPrevious) {
  return parseInt(value);
}
program.option('-i, --integer <number>', 'integer argument', myParseInt);
```

## 命令 (Commands)

### 定义命令
```javascript
program
  .command('clone <source> [destination]')
  .description('clone a repository')
  .action((source, destination) => {
    console.log('clone command called');
  });
```

### 命令参数 (Command-arguments)
- `<required>`: 必填
- `[optional]`: 可选
- `variadic...`: 变长

```javascript
program
  .argument('<username>', 'user to login')
  .argument('[password]', 'password for user', 'default');
```

### 独立执行文件 (Stand-alone executable)
```javascript
program
  .command('install [package-names...]', 'install one or more packages');
// 会寻找 pm-install 文件
```

## 帮助 (Help)

### 自动生成帮助
默认提供 `-h, --help`。

### 自定义帮助
```javascript
program.addHelpText('after', `
Example call:
  $ custom-help --help`);
```

### 错误后显示帮助
```javascript
program.showHelpAfterError();
```

### 配置帮助信息
```javascript
program.name("my-command").usage("[global options] command");
```

## 解析 (Parsing)

```javascript
program.parse(); // 自动检测 process.argv
// 或者
program.parse(process.argv);
```

## 其他

### TypeScript
```typescript
import { Command } from 'commander';
const program = new Command();
```

### 覆盖退出和输出
```javascript
program.exitOverride();
program.configureOutput({
  outputError: (str, write) => write(`error: ${str}`)
});
```
