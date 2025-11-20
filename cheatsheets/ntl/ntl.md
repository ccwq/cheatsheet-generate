我无法读取《https://github.com/antfu/ntl#cli-options》、《https://github.com/antfu/ntl#descriptions》、《https://github.com/antfu/ntl#multiple-tasks》、《https://github.com/antfu/ntl#advanced-configuration》、《https://github.com/antfu/ntl#integration》、《https://github.com/antfu/ntl》文件的内容。其他文件已阅读并为你总结如下：
```markdown
# 🚀 ntl交互式npm脚本管理速查表

## 📦 安装与基础使用
- `npm install -g ntl` | 全局安装ntl工具
- `ntl` | 启动交互式脚本选择界面
- `nt` | 快速执行上一次运行的脚本

### 基本操作
```bash
cd /path/to/project  # 进入含package.json的项目目录
ntl                 # 启动交互式界面
↑↓                  # 上下键选择脚本
Enter              # 执行选中的脚本
```

> ntl会自动读取package.json中的scripts并显示交互列表

## ⚙️ 命令行选项
- `--info, -i` | 显示脚本描述信息
- `--multiple, -m` | 允许多选执行多个脚本
- `--ordered, -o` | 按选择顺序执行脚本
- `--autocomplete` | 启用自动完成功能
- `--help, -h` | 显示帮助信息

### 高级用法示例
```bash
ntl -i              # 显示脚本描述
ntl -m              # 多选模式执行
ntl -m -o           # 多选并按顺序执行
ntl --autocomplete  # 启用自动完成
```

> 组合选项可获得更灵活的脚本执行方式

## 📝 脚本描述配置
- `ntl.descriptions` | 在package.json中配置脚本描述
- `ntl.ignore` | 忽略特定脚本不显示
- `ntl.packageManager` | 指定使用的包管理器

### package.json配置示例
```json
{
  "name": "my-project",
  "scripts": {
    "build": "make build",
    "test": "jest",
    "start": "node server.js",
    "deploy": "rsync -avz dist/ user@server:/var/www/"
  },
  "ntl": {
    "descriptions": {
      "build": "编译项目代码",
      "test": "执行单元测试",
      "start": "启动开发服务器",
      "deploy": "部署到生产环境"
    },
    "ignore": ["start"],
    "packageManager": "yarn"
  }
}
```

> 描述信息会在ntl界面中显示，方便理解脚本用途

## 🔍 搜索与过滤
- `Tab` | 切换列表视图与搜索视图
- `Ctrl+R` | 重新加载脚本列表
- `Ctrl+U` | 清除搜索框
- `Esc` | 返回主列表或退出

### 搜索功能
```
启动ntl后：
1. 输入关键词实时过滤脚本
2. 使用Tab键在搜索框和列表间切换
3. 上下键在匹配结果中导航
4. 支持模糊匹配和正则表达式
```

> 模糊搜索让你快速找到目标脚本

## 🎯 多任务执行
- `空格键` | 在多选模式下选择/取消选择脚本
- `Enter` | 执行选中的多个脚本
- `--ordered` | 按选择顺序执行脚本

### 批量执行示例
```bash
ntl -m              # 启动多选模式
[ ] build          # 空格选择
[x] test           # 再次空格取消选择
[ ] lint
[ ] deploy

ntl -m -o         # 多选且按顺序执行
```

> 多任务执行适合构建流水线和CI/CD场景

## 🔧 高级配置
- `process.env.NTL_IGNORE` | 环境变量设置忽略脚本
- `process.env.NTL_PACKAGE_MANAGER` | 环境变量设置包管理器
- `.ntlrc` | 项目级配置文件

### .ntlrc配置示例
```json
{
  "packageManager": "pnpm",
  "descriptions": {
    "custom:build": "自定义构建流程",
    "custom:deploy": "部署到多个环境"
  },
  "ignore": ["dev", "serve"],
  "showHidden": false
}
```

> 项目级配置覆盖package.json中的ntl设置

## 🔗 集成最佳实践
- `"start": "ntl"` | 在package.json中设置启动脚本
- `"quick": "ntl --autocomplete"` | 快速启动自动完成模式
- `ntl --help` | 查看完整的帮助信息

### 团队协作配置
```json
{
  "scripts": {
    "start": "ntl",
    "dev": "ntl --info",
    "build:prod": "ntl --ordered",
    "deploy": "ntl --multiple --ordered"
  },
  "ntl": {
    "descriptions": {
      "start": "启动ntl脚本管理界面",
      "dev": "带描述的开发模式",
      "build:prod": "生产环境有序构建",
      "deploy": "有序部署多个任务"
    },
    "packageManager": "pnpm"
  }
}
```

> 标准化脚本管理，提升团队开发效率
```