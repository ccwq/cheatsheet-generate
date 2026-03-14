---
title: uv
lang: bash
version: "0.9.18"
date: "2025-12-16"
github: astral-sh/uv
colWidth: 360px
---

# uv

## 快速定位 / 入口
---
emoji: 🐍
link: https://docs.astral.sh/uv/
desc: uv 把 Python 安装、虚拟环境、依赖锁定、脚本运行和工具分发收进了一套 workflow。
---
- 新项目：`uv init`
- 装依赖：`uv add`
- 跑命令：`uv run`
- 管 Python：`uv python`
- 装工具或临时执行：`uv tool` / `uvx`
- 旧项目兼容层：`uv pip`

## 起手式：从 0 到可运行项目
---
emoji: 🚀
link: https://docs.astral.sh/uv/concepts/projects/init/
desc: 最常见路径是“初始化项目 -> 加依赖 -> 运行 -> 锁定 -> 同步”。
---
- `uv init --app demo`：新建应用项目
- `uv add httpx rich`：添加运行依赖
- `uv run python main.py`：在项目环境里执行
- `uv lock`：生成或更新 `uv.lock`
- `uv sync --frozen`：按锁文件还原环境

```bash
uv init --app demo
cd demo
uv add httpx rich
uv run python main.py
uv lock
uv sync --frozen
```

## Recipe：快速开一个可发布包
---
emoji: 📦
link: https://docs.astral.sh/uv/concepts/projects/dependencies/
desc: 适合“我要做一个库并且以后准备发布到 PyPI”的场景。
---
- `uv init --package demo-lib`：按包结构初始化
- `uv add pydantic`：加运行依赖
- `uv add --dev pytest ruff`：加开发依赖
- `uv build`：构建分发包
- `uv publish`：发布到 PyPI

```bash
uv init --package demo-lib
cd demo-lib
uv add pydantic
uv add --dev pytest ruff
uv run pytest
uv build
```

## Recipe：把命令、测试、脚本都收进同一环境
---
emoji: ▶️
link: https://docs.astral.sh/uv/concepts/projects/run/
desc: 这是 uv 最省事的用法，重点是“不要手动 source `.venv`”。
---
- `uv run python script.py`：跑脚本
- `uv run pytest`：跑测试
- `uv run ruff check .`：跑代码检查
- `uv run --with rich script.py`：临时附带额外依赖
- `uv run --python 3.12 python -V`：指定解释器版本

```bash
uv run pytest
uv run ruff check .
uv run --with httpx python -c "import httpx; print(httpx.get('https://example.com').status_code)"
```

## Recipe：只想临时执行工具，不想污染项目
---
emoji: 🛠️
link: https://docs.astral.sh/uv/concepts/tools/
desc: `uv tool` 是长期安装，`uvx` 是一次性执行，这两个角色要分清。
---
- 长期装：`uv tool install ruff`
- 升级工具：`uv tool upgrade ruff`
- 列出现有工具：`uv tool list`
- 一次性执行：`uvx ruff check .`
- 指定解释器临时执行：`uvx --python 3.12 mypy src`

```bash
uv tool install ruff
uvx pycowsay "hello"
uvx --python 3.12 mypy src
```

## Recipe：管理 Python 版本，不再手装解释器
---
emoji: 🧰
link: https://docs.astral.sh/uv/guides/install-python/
desc: 适合“项目要锁 Python 版本”或者“本机要并存多个 Python”的场景。
---
- `uv python install 3.12`：安装解释器
- `uv python list`：查看可用版本
- `uv python find 3.11`：查找指定版本
- `uv python pin 3.12`：当前目录固定版本
- `uv venv --python 3.12`：按指定解释器建环境

```bash
uv python install 3.11 3.12
uv python pin 3.12
uv venv
uv run python -V
```

## Recipe：从 requirements.txt 迁到 uv，但别一次全重构
---
emoji: 🔁
link: https://docs.astral.sh/uv/pip/
desc: 迁移旧项目时，先用 `uv pip` 兼容层稳住，再逐步切 `pyproject.toml`。
---
- `uv pip install -r requirements.txt`：先让旧项目跑起来
- `uv pip compile requirements.in -o requirements.txt`：生成锁定版本
- `uv pip sync requirements.txt`：同步环境
- 等项目稳定后，再切 `uv add` / `uv lock` 主路径

```bash
uv venv
uv pip install -r requirements.txt
uv pip freeze > requirements.lock.txt
```

## Recipe：CI / Docker / 团队协作的稳妥姿势
---
emoji: 🧩
link: https://docs.astral.sh/uv/guides/integration/github/
desc: 团队环境最重要的是“锁文件确定性”和“缓存目录复用”。
---
- CI 里优先用 `uv sync --frozen`
- 缓存 `UV_CACHE_DIR`
- 固定 Python 版本，避免 runner 漂移
- Docker 里先复制锁文件再执行 `uv sync`
- 多包仓库可用 workspace，再配 `uv sync --all-packages`

```bash
uv sync --frozen
uv run pytest
uv run ruff check .
```

## 常见坑 / 决策规则
---
emoji: ⚠️
link: https://docs.astral.sh/uv/reference/cli/
desc: 真正常见的问题不是命令记不住，而是模式混用。
---
- `uv run` 是项目环境内执行，`uvx` 是临时工具执行
- `uv sync --frozen` 依赖 `uv.lock` 已存在且最新
- 旧项目迁移时别同时维护 `requirements.txt` 和 `pyproject.toml` 两套真相源
- 私有源通常还要补认证配置，否则“解析成功、下载失败”很常见
- 想让团队一致，优先锁 Python 版本，再锁依赖版本
