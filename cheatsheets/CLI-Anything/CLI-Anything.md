---
title: CLI-Anything 速查表
lang: bash
version: "unknown"
date: 2026-03-14
github: HKUDS/CLI-Anything
colWidth: 430px
---

## 🧭 这是什么
---
lang: markdown
emoji: 🧭
link: https://github.com/HKUDS/CLI-Anything
desc: CLI-Anything 的核心不是单个命令，而是一套把现有软件包装成 Agent 可调用 CLI 的方法论和插件体系。
---

- 目标：把 GUI 软件或复杂代码库转成 Agent 原生 CLI
- 本体：插件命令 + `HARNESS.md` 方法论 + 7 阶段生成流程
- 面向对象：Claude Code、OpenCode、Codex、Qodercli 等编码 Agent
- 典型产物：`cli-anything-<software>` 命令、测试集、文档、可发布包
- 最适合 cookbook 心智：按“接入哪个 Agent、跑哪个阶段、如何迭代 refinement”来用

## 🚀 起手式
---
lang: bash
emoji: 🚀
link: https://github.com/HKUDS/CLI-Anything#-quick-start
desc: 先选你的 Agent 容器，再把 CLI-Anything 的命令装进去，最后对目标软件运行生成命令。
---

### Claude Code
```bash
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything

# 基于本地代码库生成完整 CLI
/cli-anything:cli-anything ./gimp
```

### OpenCode
```bash
git clone https://github.com/HKUDS/CLI-Anything.git
cp CLI-Anything/opencode-commands/*.md ~/.config/opencode/commands/
cp CLI-Anything/cli-anything-plugin/HARNESS.md ~/.config/opencode/commands/

/cli-anything ./gimp
```

### Qodercli
```bash
git clone https://github.com/HKUDS/CLI-Anything.git
bash CLI-Anything/qoder-plugin/setup-qodercli.sh

/cli-anything:cli-anything ./gimp
```

## 🏗️ 七阶段流水线
---
lang: markdown
emoji: 🏗️
link: https://github.com/HKUDS/CLI-Anything#-quick-start
desc: 理解这 7 步，比记单个命令更重要，因为 refine / validate 都围绕同一套流水线扩展。
---

1. `Analyze`：扫描代码与 GUI 能力，映射可暴露接口
2. `Design`：规划命令组、状态模型、输出格式
3. `Implement`：生成基于 Click 的 CLI、REPL、JSON 输出
4. `Plan Tests`：产出 `TEST.md`
5. `Write Tests`：补齐单测和 E2E
6. `Document`：更新测试结果和文档
7. `Publish`：准备 `setup.py`、安装到 PATH

### 产出检查点
- 是否生成 `agent-harness`
- 是否能 `cli-anything-<software> --help`
- 是否支持 `--json`
- 是否能用真实软件完成渲染/导出，而不是 mock 掉核心能力

## 🔁 迭代 refinement
---
lang: bash
emoji: 🔁
link: https://github.com/HKUDS/CLI-Anything#step-4-optional-refine-and-improve-the-cli
desc: 首次生成通常不够，refine 是把覆盖率逐步推向可生产使用的关键动作。
---

```bash
# 广泛补能力
/cli-anything:refine ./gimp

# 聚焦某一类场景
/cli-anything:refine ./gimp "batch processing and filters"
```

### 什么时候立刻 refine
- 目标软件功能面太大
- 首轮生成后命令组明显不完整
- 测试通过但业务能力覆盖不足
- 你已经知道某个场景是关键路径，例如批处理、渲染、导出

## 🤖 各 Agent 接入差异
---
lang: markdown
emoji: 🤖
link: https://github.com/HKUDS/CLI-Anything#-quick-start
desc: CLI-Anything 不同入口共用同一方法论，但安装介质和命令前缀不同。
---

### Claude Code
- 分发方式：插件 marketplace
- 常用命令：`/cli-anything:cli-anything`、`/cli-anything:refine`
- 优势：安装最短，官方主路径最成熟

### OpenCode
- 分发方式：复制命令文件 + `HARNESS.md`
- 常用命令：`/cli-anything`、`/cli-anything-refine`
- 重点：`HARNESS.md` 必须和命令在同目录

### Codex
- 仓库提供实验性社区接入说明
- 使用前先确认本地 skill / command 安装路径是否与当前 Codex 版本匹配

### Qodercli
- 分发方式：执行 `setup-qodercli.sh`
- 常见用途：把插件注册进 `~/.qoder.json`

## 🧪 生成后的 CLI 怎么用
---
lang: bash
emoji: 🧪
link: https://github.com/HKUDS/CLI-Anything#-demo-using-a-generated-cli
desc: 最终交付物不是 CLI-Anything 本身，而是一个可被 Agent 和脚本直接调用的新 CLI。
---

```bash
# 安装生成结果
cd <software>/agent-harness
pip install -e .

# 验证
cli-anything-<software> --help

# 进入 REPL
cli-anything-<software>

# 机器可读输出
cli-anything-<software> --json <command>
```

### 理想交付物特征
- 同时支持人类可读输出和 JSON 输出
- 有 REPL，方便探索式操作
- 真的调用目标软件完成导出或渲染
- 自带测试和发布脚本

## 📐 HARNESS.md 的硬规则
---
lang: markdown
emoji: 📐
link: https://github.com/HKUDS/CLI-Anything#-the-standard-playbook-harnessmd
desc: HARNESS.md 是这个项目最值得反复看的部分，它定义了什么叫“合格的 Agent-Native CLI”。
---

- 必须调用真实软件，不要拿替代库假装完成核心功能
- 导出成功不能只看退出码，必须验证输出文件结构或内容
- GUI 软件很多效果在渲染阶段才真正生效，要处理 rendering gap
- 时间码、滤镜映射、格式转换都是高风险区
- 验证策略应覆盖 magic bytes、ZIP/OOXML 结构、像素/音频分析、时长检查

## ✅ 验证与测试
---
lang: bash
emoji: ✅
link: https://github.com/HKUDS/CLI-Anything#running-tests
desc: 测试不是附属品，而是判断生成结果是否真能代理真实软件的核心信号。
---

```bash
# 进入目标软件的 harness
cd <software>/agent-harness

# 跑测试
python3 -m pytest cli_anything/<software>/tests/ -v

# 强制已安装模式验证
CLI_ANYTHING_FORCE_INSTALLED=1 \
python3 -m pytest cli_anything/<software>/tests/ -v -s
```

### 验证顺序
- 先看命令是否能跑通主流程
- 再看导出产物是否真实有效
- 最后做回归与边界场景

## ⚠️ 使用边界
---
lang: markdown
emoji: ⚠️
link: https://github.com/HKUDS/CLI-Anything#limitations
desc: 这个项目对模型能力和源码可得性要求都不低，别把它当万能包装器。
---

- 强依赖强模型；弱模型生成的 harness 可能需要大量返工
- 最适合“有源码的软件”；只有二进制时质量会明显下降
- 一次生成不等于完成，通常要多轮 refine
- Windows 下某些 Agent 依赖 `bash` / `cygpath`，缺失时命令会失败
