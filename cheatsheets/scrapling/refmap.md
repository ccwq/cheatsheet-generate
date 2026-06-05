# Scrapling 参考映射

## 官方入口
- [GitHub 仓库](https://github.com/D4Vinci/Scrapling) - 源码、README、Dockerfile、tests
- [GitHub Releases](https://github.com/D4Vinci/Scrapling/releases) - 版本与变更记录
- [PyPI](https://pypi.org/project/scrapling/) - 安装包与依赖信息
- [ReadTheDocs](https://scrapling.readthedocs.io/en/latest/) - 官方文档

## 核心文档与元数据
- [README.md](https://github.com/D4Vinci/Scrapling/blob/main/README.md) - 功能总览与示例
- [pyproject.toml](https://github.com/D4Vinci/Scrapling/blob/main/pyproject.toml) - 依赖、extras、CLI entrypoint
- [Dockerfile](https://github.com/D4Vinci/Scrapling/blob/main/Dockerfile) - 官方容器化路径
- [server.json](https://github.com/D4Vinci/Scrapling/blob/main/server.json) - MCP server 元数据

## 代码入口
- [scrapling/__init__.py](https://github.com/D4Vinci/Scrapling/blob/main/scrapling/__init__.py) - 对外导出
- [scrapling/parser.py](https://github.com/D4Vinci/Scrapling/blob/main/scrapling/parser.py) - Selector / 解析核心
- [scrapling/fetchers/__init__.py](https://github.com/D4Vinci/Scrapling/blob/main/scrapling/fetchers/__init__.py) - Fetcher / DynamicFetcher / StealthyFetcher
- [scrapling/spiders/__init__.py](https://github.com/D4Vinci/Scrapling/blob/main/scrapling/spiders/__init__.py) - Spider / Request / Response
- [scrapling/cli.py](https://github.com/D4Vinci/Scrapling/blob/main/scrapling/cli.py) - CLI 命令

## 相关依赖
- [Playwright](https://playwright.dev/python/) - 动态抓取浏览器能力
- [Patchright](https://github.com/microsoft/playwright-python) - 反检测 / 浏览器变体
- [uv](https://github.com/astral-sh/uv) - 官方 Dockerfile 使用的依赖安装工具
