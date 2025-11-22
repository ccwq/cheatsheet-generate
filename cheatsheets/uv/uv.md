# uv Python包管理器使用速查

## 快速入门
- `uv init` - 创建新项目
- `uv init --python 3.11 my-project` - 使用特定Python版本
- `uv init --app my-app` - 创建应用项目
- `uv init --lib my-lib` - 创建库项目
- `uv init --template fastapi my-api` - 从模板创建
- `uv add <package>` - 添加依赖包
- `uv run <command>` - 在项目中运行命令
- `uv sync` - 同步项目依赖
- `uv venv` - 创建虚拟环境

## 依赖管理
- `uv add requests@^2.28.0` - 添加特定版本依赖
- `uv add --dev pytest` - 添加开发依赖
- `uv add --optional test pytest` - 添加可选依赖
- `uv remove <package>` - 移除依赖
- `uv tree` - 查看依赖树
- `uv pip install <package>` - 使用pip接口

## requirements文件处理
- `uv pip freeze > requirements.txt` - 生成requirements.txt
- `uv pip compile requirements.in` - 编译requirements
- `uv pip sync requirements.txt` - 同步环境
- `uv pip compile --upgrade requirements.in` - 升级依赖

## 虚拟环境
- `uv venv .venv` - 在当前目录创建环境
- `uv run python script.py` - 直接运行脚本
- `uv pip list` - 列出已安装包
- `uv run --with <package> <script>` - 临时使用包运行
- `uv run --python 3.11 <script>` - 指定Python版本

## 项目管理
- `uv init --lib <name>` - 创建库项目
- `uv init --app <name>` - 创建应用项目
- `uv build` - 构建分发包
- `uv publish` - 发布到PyPI
- `uv lock` - 更新锁文件

## 同步与锁定
- `uv sync` - 同步项目依赖
- `uv sync --dev` - 包含开发依赖
- `uv sync --frozen` - 使用锁文件精确同步
- `uv lock` - 重新生成锁文件

## Python版本管理
- `uv python install 3.11` - 安装Python版本
- `uv python list` - 列出可用版本
- `uv python pin 3.11` - 固定Python版本
- `uv python find` - 查找Python解释器

## 工具与集成
- `uv tool install black` - 安装工具
- `uv run black <file>` - 运行工具
- `uv tool update black` - 更新工具
- `uv tool list` - 列出已安装工具
- `uv tool run black@latest <file>` - 运行特定版本工具
- `uvx black <file>` - 临时运行工具

## uvx 临时工具执行
uvx 是 uv 提供的强大命令行工具，用于无需安装即可快速运行 Python 脚本和工具，相当于 Python 界的 "npx"。

### 基础用法
- `uvx <tool>` - 无需安装临时运行工具
- `uvx black <file>` - 格式化代码文件
- `uvx flake8 <file>` - 代码质量检查
- `uvx mypy <file>` - 静态类型检查
- `uvx pytest` - 运行测试套件
- `uvx jupyter` - 启动Jupyter Notebook
- `uvx http.server` - 启动简单HTTP服务器

### 高级选项
- `uvx --with-reqs requirements.txt black` - 使用指定requirements文件中的依赖运行
- `uvx --python 3.11 black` - 指定特定Python版本运行工具
- `uvx --lockfile uv.lock black` - 使用锁定文件中的依赖版本运行
- `uvx --no-cache black` - 禁用缓存强制重新下载
- `uvx --pin <version> black` - 使用特定版本的工具
- `uvx --system-site-packages black` - 允许访问系统安装的包

### 实用场景
- `uvx easy-code-reader --project-dir /path/to/project` - 快速分析代码库
- `uvx pip-audit` - 安全漏洞扫描而无需安装
- `uvx pre-commit run --all-files` - 运行pre-commit钩子而无需全局安装
- `uvx pipdeptree -p requests` - 查看特定包的依赖树
- `uvx pip-chill` - 简洁显示顶层依赖
- `uvx poetry --version` - 临时使用特定版本的poetry
- `uvx cookiecutter https://github.com/pydantic/pydantic-settings` - 使用模板创建项目

## 预览功能
- `uv --preview <cmd>` - 启用预览功能
- `uvx <tool>` - 临时运行工具
- `uv tool run <tool>` - 运行但不安装工具
- `uv pip install --editable <path>` - 可编辑安装

## 检查与诊断
- `uv pip list` - 列出已安装包
- `uv pip show <package>` - 查看包信息
- `uv pip check` - 检查依赖冲突
- `uv tree` - 显示依赖树
- `uv pip show --outdated` - 显示过期包
- `uv pip list --format=json` - JSON格式输出
- `uv pip list --exclude <pattern>` - 排除包

## 依赖解析
- `uv resolve <package>` - 解析包版本
- `uv pip compile requirements.in` - 编译依赖文件
- `uv pip compile --generate-hashes` - 生成哈希校验
- `uv pip install --no-deps` - 跳过依赖安装
- `uv pip install --force-reinstall` - 强制重装

## 构建后端
- `uv build` - 构建分发包
- `uv build --sdist` - 仅构建源码包
- `uv build --wheel` - 仅构建轮子
- `uv build --no-sdist` - 不构建源码包
- `uv build --no-wheel` - 不构建轮子

## 性能优化
- `uv cache clean` - 清理缓存
- `uv cache dir` - 显示缓存目录
- `--no-cache` - 禁用缓存
- `--cache-dir` - 指定缓存目录
- `uv pip install --concurrent-downloads 8` - 并发下载
- `uv pip install --use-feature truststore` - 使用系统证书
- `uv pip install --only-binary :all:` - 预编译wheels
- `uv pip install --no-deps` - 跳过依赖检查

## 调试命令
- `uv -v add requests` - 详细输出
- `uv -vv sync` - 极详细输出
- `uv pip check` - 检查环境
- `uv lock --check` - 验证锁定文件
- `uv lock --upgrade` - 重建锁定文件

## 故障排除
- `uv pip check` - 检查依赖冲突
- `uv sync --verbose` - 显示详细错误信息
- `uv run --no-deps <cmd>` - 跳过依赖执行
- `uv cache clean` - 清理损坏缓存
- `rm -rf .venv && uv venv` - 重建虚拟环境
- `uv --no-progress <cmd>` - 禁用进度显示

## 常用命令
- `uv --version` - 显示版本
- `uv --help` - 显示帮助
- `uv init <name>` - 初始化项目
- `uv add <deps>` - 添加依赖
- `uv run <cmd>` - 运行命令
- `uv sync` - 同步依赖
- `uv tree` - 显示依赖树
- `uv pip <cmd>` - pip兼容命令

## 环境变量
- `UV_PYTHON` - 指定Python解释器
- `UV_INDEX_URL` - 默认包索引
- `UV_EXTRA_INDEX_URL` - 额外索引列表
- `UV_FIND_LINKS` - 包查找链接
- `UV_NO_INDEX` - 禁用索引搜索
- `UV_CACHE_DIR` - 缓存目录路径
- `UV_NO_CACHE` - 禁用缓存
- `UV_NO_BUILD` - 跳过构建步骤
- `UV_REQUIRE_HASHES` - 要求哈希校验
- `UV_VERBOSE` - 详细输出模式