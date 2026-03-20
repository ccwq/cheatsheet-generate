---
title: CLI-Anything 混合速查
lang: bash
version: "main@edf9755 (2026-03-19)"
date: 2026-03-19
github: HKUDS/CLI-Anything
colWidth: 430px
---

## 🧭 快速定位
---
lang: markdown
emoji: 🧭
link: https://github.com/HKUDS/CLI-Anything
desc: CLI-Anything 不是单个命令，而是一套把现有软件包装成 Agent-Native CLI 的方法论、命令入口和发布链路。
---

- 核心目标：把 GUI 软件或复杂代码库变成 Agent 可调用的 `cli-anything-<software>`
- 当前重点：不只是生成 CLI，还包含 `test`、`validate`、`list`、PyPI 发布和 `SKILL.md` 产出
- 典型入口：Claude Code 插件、OpenCode 命令、Codex skill、OpenClaw skill、Qodercli 社区插件、Goose 通过 CLI provider 复用
- 交付物：`agent-harness/`、可安装 Python 包、Click CLI、REPL、JSON 输出、测试集、`SKILL.md`
- 新变化：`CLI-Hub` 已上线；生成链路新增 `SKILL.md generation (Phase 6.5)`；Windows `cygpath` 兼容已补强

## ⚡ 最小工作流
---
lang: bash
emoji: ⚡
link: https://github.com/HKUDS/CLI-Anything#-quick-start
desc: 先装到你正在用的 Agent 容器里，再跑 build，必要时 refine，最后用 validate 和 test 收尾。
---

```bash
# 1) Claude Code: 安装 marketplace 与插件
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything

# 2) 生成完整 harness
/cli-anything:cli-anything ./gimp

# 3) 补能力缺口
/cli-anything:refine ./gimp "batch processing and filters"

# 4) 校验是否符合 HARNESS.md
/cli-anything:validate ./gimp

# 5) 回归测试
/cli-anything:test ./gimp
```

### Quick Ref
- 你只想“先做出来”：先跑 build
- 你发现命令不全：立刻 refine
- 你怀疑结构不合规：先 validate
- 你准备交付或发布：先 test，再安装生成出来的 CLI

## 🏗️ 生成链路
---
lang: markdown
emoji: 🏗️
link: https://github.com/HKUDS/CLI-Anything/blob/main/cli-anything-plugin/README.md
desc: README 仍常写成 7-phase 心智，但插件 README 已把实际流水线细化为 8 个动作，新增 Source Acquisition 与 SKILL.md 生成。
---

1. `Source Acquisition`：如果输入是 GitHub URL，先 clone 源码
2. `Codebase Analysis`：扫描源码、GUI 能力、可暴露操作
3. `CLI Architecture Design`：规划命令组、状态模型、输出格式
4. `Implementation`：生成 Click CLI、REPL、JSON / Human 输出
5. `Test Planning`：产出 `TEST.md` 与测试计划
6. `Test Implementation & Documentation`：补齐测试并写回结果
7. `SKILL.md Generation`：在包内生成 `cli_anything/<software>/skills/SKILL.md`
8. `PyPI Publishing and Installation`：准备安装、发布与 PATH 暴露

### 产出检查点
- 是否生成 `<software>/agent-harness/`
- 是否能 `pip install -e .`
- 是否支持 `cli-anything-<software> --help`
- 是否支持 REPL 与 `--json`
- 是否能被 Agent 发现 `SKILL.md` 路径

## 🍳 高频 Recipes
---
lang: bash
emoji: 🍳
link: https://github.com/HKUDS/CLI-Anything/blob/main/cli-anything-plugin/QUICKSTART.md
desc: CLI-Anything 最适合按“我现在要做什么”来使用，而不是背参数表。
---

### 从本地源码快速生成
```bash
/cli-anything:cli-anything ./gimp
```

### 直接从 GitHub 仓库生成
```bash
/cli-anything https://github.com/blender/blender
```

### 做一轮广泛补强
```bash
/cli-anything:refine ./obs-studio
```

### 只补某个功能域
```bash
/cli-anything:refine ./shotcut "vid-in-vid and picture-in-picture compositing"
/cli-anything:refine ./blender "particle systems and physics simulation"
```

### 看当前目录里已经有哪些 harness
```bash
/cli-anything:list
/cli-anything:list --depth 2
/cli-anything:list --json
```

### 交付前做规范校验
```bash
/cli-anything:validate ./audacity
```

### 回归测试并更新 TEST.md
```bash
/cli-anything:test ./inkscape
```

## 🤖 Agent 接入速查
---
lang: markdown
emoji: 🤖
link: https://github.com/HKUDS/CLI-Anything#-quick-start
desc: 平台入口越来越多，但方法论一致。区别主要在安装介质、命令名字和被发现方式。
---

### Claude Code
- 主路径，最成熟
- 安装：`/plugin marketplace add HKUDS/CLI-Anything` + `/plugin install cli-anything`
- 常用命令：`/cli-anything:cli-anything`、`/cli-anything:refine`、`/cli-anything:test`、`/cli-anything:validate`
- 兼容提示：Claude Code 2.x 以下可用旧入口 `/cli-anything`

### OpenCode
- 复制 `opencode-commands/*.md` 与 `HARNESS.md` 到 commands 目录
- 新增 5 个 slash commands：`/cli-anything`、`/cli-anything-refine`、`/cli-anything-test`、`/cli-anything-validate`、`/cli-anything-list`
- 重点：`HARNESS.md` 必须与命令文件同目录

### Codex
- 使用仓库自带安装脚本安装 skill
- Windows 用 `.\CLI-Anything\codex-skill\scripts\install.ps1`
- 使用方式偏自然语言，例如“Use CLI-Anything to validate ./libreoffice”

### OpenClaw
- 复制 `openclaw-skill/SKILL.md` 到 `~/.openclaw/skills/cli-anything/`
- 入口不是 slash command，而是 skill 调用
- 示例：`@cli-anything build a CLI for ./gimp`

### Qodercli
- 执行 `bash CLI-Anything/qoder-plugin/setup-qodercli.sh`
- 注册后重启会话
- 支持 build / refine / validate

### Goose
- 通过 Claude Code 之类的 CLI provider 复用 CLI-Anything
- 本质上沿用 provider 的命令格式

## 📋 命令速查
---
lang: bash
emoji: 📋
link: https://github.com/HKUDS/CLI-Anything/blob/main/cli-anything-plugin/README.md
desc: 如果你已经知道自己要 build、补能力、校验还是盘点，直接查这张卡就够了。
---

### Build
```bash
/cli-anything <software-path-or-repo>
```

- 输入：本地源码目录或 GitHub URL
- 输出：完整 harness、测试、文档、可安装包

### Refine
```bash
/cli-anything:refine <software-path> [focus]
```

- 用途：做 gap analysis，增量补命令与测试
- `focus`：传具体场景，比泛泛一句“优化一下”更有效

### Test
```bash
/cli-anything:test <software-path-or-repo>
```

- 用途：跑测试并回写 `TEST.md`
- 适合：回归、重构后验证、准备发布前检查

### Validate
```bash
/cli-anything:validate <software-path-or-repo>
```

- 用途：对照 `HARNESS.md` 检查结构和最佳实践
- 适合：怀疑生成结果“能跑但不规范”时先跑一遍

### List
```bash
/cli-anything:list [--path <directory>] [--depth <n>] [--json]
```

- `--path`：指定搜索根目录
- `--depth`：限制递归深度
- `--json`：输出机器可读结果

## 🧪 生成后的 CLI 怎么看
---
lang: bash
emoji: 🧪
link: https://github.com/HKUDS/CLI-Anything#-demo-using-a-generated-cli
desc: 真正交付给 Agent 的不是 CLI-Anything 本身，而是它生成出来的 `cli-anything-<software>`。
---

```bash
# 安装生成结果
cd <software>/agent-harness
pip install -e .

# 人类可读帮助
cli-anything-<software> --help

# 进入 REPL
cli-anything-<software>

# 机器可读输出
cli-anything-<software> --json <command>
```

### Quick Ref
- `invoke_without_command=True`：裸命令通常直接进 REPL
- `which cli-anything-<software>`：可快速判断是否已安装到 PATH
- 生成包内会带 `skills/SKILL.md`，方便被 Agent 自动发现

## 📐 HARNESS.md 硬规则
---
lang: markdown
emoji: 📐
link: https://github.com/HKUDS/CLI-Anything#-the-standard-playbook-harnessmd
desc: 这部分决定一个 harness 只是“能跑”，还是“能稳定给 Agent 用”。
---

- 必须调用真实软件，不要拿替代库假装实现核心能力
- 不能只看退出码，要验证输出内容或结构
- GUI 软件常见 rendering gap，要把最终渲染后的真实结果纳入检查
- 输出格式验证要覆盖 magic bytes、ZIP / OOXML 结构、像素或音频分析、时长等
- validate 不是可有可无，它是把“勉强可用”拦在交付前的一道门

## ⚠️ 决策点与边界
---
lang: markdown
emoji: ⚠️
link: https://github.com/HKUDS/CLI-Anything#limitations
desc: 这个项目很强，但不是万能包装器。踩坑通常发生在模型强度、源码可得性和覆盖率预期上。
---

- 依赖强基模：官方 README 直接点名 Claude Opus 4.6、Claude Sonnet 4.6、GPT-5.4 这一类前沿模型
- 更适合有源码的软件；只有二进制或需要反编译时，质量会明显下降
- 首轮 build 不等于完成，生产可用通常需要多轮 refine
- Windows 侧若运行环境缺 `bash` / `cygpath`，部分链路会失败

## 🌐 CLI-Hub 与收尾动作
---
lang: markdown
emoji: 🌐
link: https://hkuds.github.io/CLI-Anything/hub/
desc: 项目已经从“单仓库方法论”扩展到“社区可浏览、可安装的 CLI 注册中心”。
---

- `CLI-Hub`：集中浏览、搜索、安装社区 CLI
- 社区提交方式：PR 一个 `registry.json` 条目即可更新 Hub
- 如果你生成的是可复用 harness，下一步应看 `PUBLISHING.md`
- 如果你要研究为什么某个 harness 质量高，先看 `HARNESS.md`，再看现成示例项目
