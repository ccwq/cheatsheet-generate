# NPS-ScriptKit Cheatsheet 重构指导

## 📋 官方文档章节数据对比分析

### NPS (Node Package Scripts) 官方文档结构
根据kentcdodds/nps官方文档，主要包含：

- **Installation** - 安装方式（本地/全局）
- **Getting Started** - 初始化和迁移
- **Configuration** - package-scripts.js/yml配置
- **Usage** - CLI命令使用（help, init, completion）
- **CLI Commands** - 详细命令行选项
- **Environment Variables** - 环境变量配置
- **Features** - 前缀支持、跨平台兼容、并发串行执行
- **Related Packages** - nps-utils, nps-i等扩展包

### Script Kit 官方文档结构
根据johnlindquist/kit官方文档，主要包含：

- **Installation & Setup** - 包安装管理（npm, installMissingPackage, appInstallMultiple）
- **Core API** - 基础功能（arg, showToast, env, exec等）
- **Package Management** - npm包的自动安装和导入
- **File Operations** - 文件读写操作
- **System Integration** - 剪贴板、通知、窗口操作
- **Development Tools** - 项目脚手架、环境配置检查

### 当前本地 Cheatsheet 内容分析

#### ✅ 已包含的良好内容
1. **ntl部分**：
   - 基本介绍和安装
   - 交互式操作说明
   - 配置选项（ntl.descriptions）
   - 多任务执行功能

2. **nps部分**：
   - 基本安装和初始化
   - package-scripts.js配置示例
   - 脚本嵌套和点语法
   - 跨平台优势说明

3. **Script Kit部分**：
   - 基本API说明（arg, showToast等）
   - 安装和启动方法
   - 文件操作API

#### ❌ 需要补充的关键内容

### NPS 补充内容

1. **YAML配置支持**：
```yaml
# package-scripts.yml
scripts:
  default: "node index.js"
  lint: "eslint ."
  build:
    - "rimraf dist"
    - "webpack"
```

2. **nps-utils 详细用法**：
```javascript
const { series, parallel, rimraf, crossEnv } = require('nps-utils')

module.exports = {
  scripts: {
    clean: rimraf('dist'),
    build: series.nps('clean', 'webpack'),
    test: parallel.nps('lint', 'unit'),
    start: crossEnv('NODE_ENV=production', 'node server.js')
  }
}
```

3. **环境变量配置**：
```bash
export LOG_LEVEL=silent  # 禁用输出
export LOG_LEVEL=info    # 默认级别
```

4. **前缀和快捷命令**：
```bash
nps b     # 运行 build
nps t     # 运行 test
nps help b  # 显示 build 脚本帮助
```

5. **CLI 完整命令参考**：
```bash
nps help          # 显示所有可用脚本
nps init          # 从 package.json 迁移
nps completion    # 生成自动完成脚本
```

### NTL 补充内容

1. **完整命令行选项**：
```bash
ntl                    # 启动交互式界面
ntl -i, --info         # 显示脚本描述信息
ntl -m, --multiple     # 允许多选执行
ntl -o, --ordered      # 按选择顺序执行
ntl --autocomplete     # 自动完成功能
```

2. **高级配置选项**：
```json
{
  "ntl": {
    "descriptions": {
      "build": "编译项目",
      "test": "执行测试"
    },
    "ignore": ["start", "serve"],
    "packageManager": "yarn"  // 指定包管理器
  }
}
```

3. **集成最佳实践**：
```json
{
  "scripts": {
    "start": "ntl",
    "quick": "ntl --autocomplete"
  }
}
```

### Script Kit 补充内容

1. **完整的包管理API**：
```javascript
import "@johnlindquist/kit";

// 基础安装和导入
let lodash = await npm("lodash")
let axios = await npm("axios")

// 安装多个包
await appInstallMultiple(["axios", "lodash", "dayjs"])

// 条件安装（仅当缺失时）
await installMissingPackage("lodash")

// 仅安装不导入
await npmInstall("package-name")

// 作用域包
let kit = await npm("@johnlindquist/kit")
```

2. **项目脚手架功能**：
```javascript
import "@johnlindquist/kit";

async function createProject(projectName, template) {
  // 克隆模板
  await degit(template).clone(`./${projectName}`)

  // 更新 package.json
  let pkgPath = path.join(projectName, 'package.json')
  let pkg = await readJson(pkgPath)
  pkg.name = projectName
  await writeJson(pkgPath, pkg)

  // 安装依赖
  await exec(`cd ${projectName} && npm install`)

  console.log(`✅ Project ${projectName} created!`)
}
```

3. **环境配置检查**：
```javascript
// 检查开发环境配置
async function setupDevEnvironment() {
  let configs = {
    git: path.join(home(), ".gitconfig"),
    ssh: path.join(home(), ".ssh"),
    npm: path.join(home(), ".npmrc"),
    zsh: path.join(home(), ".zshrc")
  }

  let missing = []
  for (let [name, path] of Object.entries(configs)) {
    if (!await pathExists(path)) {
      missing.push(name)
    }
  }

  if (missing.length > 0) {
    console.log("Missing configs:", missing.join(", "))
  }
}
```

4. **扩展的系统API**：
```javascript
// 更多实用功能
let content = await clipboard.read()  // 读取剪贴板
await clipboard.write("text")         // 写入剪贴板

// 系统通知
await notify("完成!", "任务执行完毕")

// 选择器和提示
let choice = await select(["选项1", "选项2", "选项3"])
let confirm = await confirm("确定继续吗？")

// 文件操作
let files = await getFiles("*.js", { recursive: true })
let content = await readFile("config.json")
await writeFile("output.txt", "内容")

// 环境变量
let apiKey = env.API_KEY || "default"
env.NODE_ENV = "production"
```

## 🛠️ 重构实施建议

### 1. 结构重组
- 创建三个独立的 cheatsheet：`ntl`, `nps`, `scriptkit`
- 每个 cheatsheet 包含完整的功能文档
- 保持一致的样式和结构

### 2. 内容优化
- 按官方文档补充缺失的关键功能
- 增加更多实用的代码示例
- 添加最佳实践和使用建议

### 3. 样式统一
- 采用 base.md 中指定的样式标准
- 参考 bash-vs-fish 的页面结构和 css 组织
- 确保响应式设计和良好的可读性

### 4. 附属文件完善
- 为每个工具创建独立的 desc.md
- 生成对应的 refmap.md，引用官方文档
- 制作适当的图标文件

### 5. 文件命名规范
- `ntl/ntl.html`, `ntl/ntl.md`
- `nps/nps.html`, `nps/nps.md`
- `scriptkit/scriptkit.html`, `scriptkit/scriptkit.md`

## 📝 优先级建议

1. **高优先级**：NPS 的 nps-utils 详细用法和 YAML 配置
2. **中优先级**：NTL 的高级配置和完整命令行选项
3. **中优先级**：Script Kit 的完整包管理 API
4. **低优先级**：项目脚手架和环境配置示例

## 🎯 验证要点

1. 与官方文档内容的一致性
2. 代码示例的完整性和可运行性
3. 中文术语的准确性和一致性
4. 页面结构的逻辑性和易用性
5. 与 base.md 样式规范的符合度