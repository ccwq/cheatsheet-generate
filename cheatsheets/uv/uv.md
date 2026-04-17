---
title: uv
lang: bash
version: "0.11.7"
date: "2026-04-15"
github: astral-sh/uv
colWidth: 360px
---

# uv

## 快速定位 / 一眼入口
---
emoji: 🐍
link: https://docs.astral.sh/uv/
desc: uv 把项目依赖、单文件脚本、Python 版本、工具分发和 pip 兼容层收进一套统一 workflow。
---
- 新项目起手：`uv init demo`
- 给项目加依赖：`uv add httpx`
- 在项目环境里运行：`uv run pytest`
- 更新并落锁：`uv lock` / `uv sync --locked`
- 单文件脚本：`uv init --script demo.py`、`uv add --script demo.py httpx`、`uv run demo.py`
- 一次性工具：`uvx ruff check .`
- 长期工具安装：`uv tool install ruff`
- Python 版本管理：`uv python install 3.12`、`uv python pin 3.12`
- 兼容旧项目：`uv pip install -r requirements.txt`

## 安装 / 更新入口
---
emoji: 📥
link: https://docs.astral.sh/uv/getting-started/installation/
desc: 第一次使用时先把命令装上；如果是独立安装器安装，后续可直接自更新。
---
- macOS / Linux：`curl -LsSf https://astral.sh/uv/install.sh | sh`
- Windows PowerShell：`powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`
- PyPI：`pip install uv`
- pipx：`pipx install uv`
- 自更新：`uv self update`

```bash
# 安装 uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 使用独立安装器安装时可直接自更新
uv self update
```

## 最小工作流：新项目从 0 到可运行
---
emoji: 🚀
link: https://docs.astral.sh/uv/concepts/projects/init/
desc: 最常见路径是“初始化项目 -> 加依赖 -> 在项目环境运行 -> 锁定 -> 同步”。
---
- `uv init demo`：创建项目
- `cd demo`
- `uv add httpx rich`：写入依赖并创建环境
- `uv run python main.py`：在项目环境内运行
- `uv lock`：更新 `uv.lock`
- `uv sync --locked`：按锁文件同步环境

```bash
# 初始化项目目录
uv init demo

# 进入项目目录
cd demo

# 添加运行依赖
uv add httpx rich

# 在项目环境内运行入口脚本
uv run python main.py

# 生成或更新锁文件
uv lock

# 按锁文件同步环境
uv sync --locked
```

## Recipe：单文件脚本是 uv 的核心主线
---
emoji: 📄
link: https://docs.astral.sh/uv/guides/scripts/
desc: `uv` 不只管项目目录，也把单文件脚本变成可声明依赖、可锁版本的工作流。
---
- `uv init --script example.py --python 3.12`：初始化带 inline metadata 的脚本
- `uv add --script example.py requests rich`：把依赖写进脚本头部
- `uv run example.py`：隔离环境运行脚本
- `uv lock --script example.py`：为脚本生成锁定结果
- shebang 入口：`#!/usr/bin/env -S uv run --script`

```bash
# 初始化带 inline metadata 的脚本
uv init --script example.py --python 3.12

# 把依赖写进脚本头部
uv add --script example.py requests rich

# 直接运行脚本
uv run example.py

# 为脚本生成锁定结果
uv lock --script example.py
```

## Recipe：做应用或包，优先走 project workflow
---
emoji: 📦
link: https://docs.astral.sh/uv/concepts/projects/dependencies/
desc: 要做长期维护的应用或库，主路径还是 project 模式，而不是手动管 `.venv`。
---
- `uv init --app demo`：应用项目
- `uv init --package demo-lib`：库项目
- `uv add pydantic`：运行依赖
- `uv add --dev pytest ruff`：开发依赖
- `uv run pytest`：在项目环境中跑测试
- `uv build` / `uv publish`：构建与发布

```bash
# 初始化包项目
uv init --package demo-lib

# 进入项目目录
cd demo-lib

# 添加运行依赖
uv add pydantic

# 添加开发依赖
uv add --dev pytest ruff

# 在项目环境中运行测试
uv run pytest

# 构建分发包
uv build
```

## Recipe：把命令、测试、临时依赖都收进 `uv run`
---
emoji: ▶️
link: https://docs.astral.sh/uv/concepts/projects/run/
desc: `uv run` 是项目内执行入口；需要额外依赖时，用 `--with` 临时加，不必污染主依赖图。
---
- `uv run pytest`：运行测试
- `uv run ruff check .`：运行工具
- `uv run --with httpx==0.26.0 python -c "import httpx; print(httpx.__version__)"`
- `uv run --python 3.12 python -V`：指定解释器
- 带 inline metadata 的脚本会自动隔离运行，不复用项目环境

```bash
# 在项目环境中运行测试
uv run pytest

# 在项目环境中执行 ruff
uv run ruff check .

# 临时附带 httpx 依赖并执行一段 Python 代码
uv run --with httpx python -c "import httpx; print(httpx.__version__)"

# 指定解释器版本运行 Python
uv run --python 3.12 python -V
```

## Recipe：工具执行分两类，`uvx` 和 `uv tool` 不要混
---
emoji: 🛠️
link: https://docs.astral.sh/uv/concepts/tools/
desc: 一次性执行走 `uvx`；要把可执行文件长期放到 PATH，再用 `uv tool install`。
---
- `uvx ruff check .`：临时执行工具
- `uv tool install ruff`：长期安装工具
- `uv tool list`：列出现有工具
- `uv tool upgrade ruff`：升级工具环境
- `uv tool uninstall ruff`：移除长期安装工具

```bash
# 一次性执行工具
uvx pycowsay "hello"

# 长期安装 ruff 到工具环境
uv tool install ruff

# 查看已安装工具
uv tool list

# 升级 ruff 工具环境
uv tool upgrade ruff
```

## Recipe：管理 Python 版本，而不是手动装解释器
---
emoji: 🧰
link: https://docs.astral.sh/uv/guides/install-python/
desc: `uv` 可以直接安装和固定 Python 版本，适合团队统一解释器和多版本并存。
---
- `uv python install 3.11 3.12`
- `uv python list --only-installed`
- `uv python find 3.12`
- `uv python pin 3.12`
- `uv venv --python 3.12`

```bash
# 安装多个 Python 版本
uv python install 3.11 3.12

# 在当前目录固定 Python 版本
uv python pin 3.12

# 使用指定解释器创建虚拟环境
uv venv --python 3.12

# 确认当前项目实际使用的 Python 版本
uv run python -V
```

## Recipe：旧项目迁移先稳住，再慢慢切主路径
---
emoji: 🔁
link: https://docs.astral.sh/uv/pip/
desc: 已有 `requirements.txt` 的项目不必一次性改完，可以先走 `uv pip` 兼容层。
---
- `uv venv`：创建虚拟环境
- `uv pip install -r requirements.txt`：先让旧项目跑起来
- `uv pip compile requirements.in -o requirements.txt`：锁定版本
- `uv pip sync requirements.txt`：按 requirements 同步环境
- 稳定后再迁到 `pyproject.toml` + `uv add` + `uv lock`

```bash
# 创建虚拟环境
uv venv

# 先按 requirements.txt 安装旧项目依赖
uv pip install -r requirements.txt

# 从 requirements.in 解析并锁定版本
uv pip compile requirements.in -o requirements.txt

# 按 requirements.txt 同步环境
uv pip sync requirements.txt
```

## Recipe：CI / Docker / workspace 以锁文件和缓存为中心
---
emoji: 🧩
link: https://docs.astral.sh/uv/guides/integration/github/
desc: 团队环境里最关键的是锁文件确定性、缓存复用，以及把版本漂移压到最小。
---
- GitHub Actions 推荐 `astral-sh/setup-uv@v7`
- CI 安装项目常用：`uv sync --locked --all-extras --dev`
- 缓存目录用 `UV_CACHE_DIR`
- CI 收尾可执行 `uv cache prune --ci`
- workspace 可用 `uv sync --all-packages`
- Docker 构建时优先先复制锁文件和 `pyproject.toml` 再同步依赖

```bash
# 在 CI 中按锁文件安装依赖和开发环境
uv sync --locked --all-extras --dev

# 执行测试
uv run pytest

# 在 CI 收尾阶段清理缓存
uv cache prune --ci
```

## Recipe：私有索引和认证别只停留在“记得配”
---
emoji: 🔐
link: https://docs.astral.sh/uv/concepts/indexes/
desc: 私有源最常见的问题不是解析失败，而是凭据查找时机不对，导致请求被错误转发到公开索引。
---
- `uv auth login example.com`：把凭据写入 uv credential store
- `uv auth token example.com`：查看当前服务凭据
- 某些私有源需要显式 `authenticate = "always"`，避免先匿名请求再错误回退
- 如果私有源未命中时返回 `403`，可配 `ignore-error-codes = [403]`

```toml
# 定义私有包索引
[[tool.uv.index]]

# 给索引起一个名字，供 source 或日志引用
name = "private"

# 私有 simple API 地址
url = "https://packages.example.com/simple"

# 强制先认证，避免匿名请求错误回退到公开索引
authenticate = "always"

# 某些私有源未命中时会返回 403，可显式忽略
ignore-error-codes = [403]
```

```bash
# 登录私有源并写入凭据
uv auth login packages.example.com

# 查看当前记录的 token / 凭据信息
uv auth token packages.example.com
```

## Quick Ref：高频命令速查
---
emoji: ⚡
link: https://docs.astral.sh/uv/reference/cli/
desc: 下面这组命令覆盖了大多数“我要现在做什么”的检索需求。
---
- 创建项目：`uv init demo`
- 创建脚本：`uv init --script demo.py`
- 加依赖：`uv add httpx`
- 给脚本加依赖：`uv add --script demo.py httpx`
- 运行项目命令：`uv run pytest`
- 运行脚本：`uv run demo.py`
- 临时执行工具：`uvx ruff check .`
- 长期安装工具：`uv tool install ruff`
- 锁定依赖：`uv lock`
- 同步环境：`uv sync --locked`
- 安装 Python：`uv python install 3.12`
- 固定 Python：`uv python pin 3.12`
- pip 兼容：`uv pip install -r requirements.txt`

## 常见决策 / 易错点
---
emoji: ⚠️
link: https://docs.astral.sh/uv/reference/cli/
desc: 真正常见的问题不是命令记不住，而是模式混用、锁文件策略不清和认证时机没想明白。
---
- `uv run` 主要面向项目环境；`uvx` 等价于 `uv tool run`，偏一次性工具执行
- 带 inline metadata 的脚本，用 `uv run script.py` 时会自动走隔离环境，而不是项目 `.venv`
- 想强调可重复构建，CI 优先 `uv sync --locked` 或按团队策略使用更严格的锁文件检查
- 旧项目迁移时，不要长期维护 `requirements.txt` 和 `pyproject.toml` 两套真相源
- 私有索引若会把匿名请求转发到 PyPI，记得在 index 上设置 `authenticate = "always"`
- 独立安装器安装的 `uv` 才支持 `uv self update`；如果用 `pip` / `pipx` 安装，就走对应包管理器升级
