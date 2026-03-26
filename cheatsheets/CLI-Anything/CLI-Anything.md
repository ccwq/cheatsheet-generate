---
title: CLI-Anything 混合速查
lang: bash
version: "main@ddba3db (2026-03-25)"
date: 2026-03-25
github: HKUDS/CLI-Anything
colWidth: 430px
---

## 🧭 一眼入口
---
lang: markdown
emoji: 🧭
link: https://github.com/HKUDS/CLI-Anything
desc: CLI-Anything 的核心不是“又一个命令”，而是把现有软件包装成 Agent 可稳定调用、可测试、可发布的 CLI 工作流。
---

- 目标：把 GUI 软件或复杂代码库变成 `cli-anything-<software>`
- 交付：`agent-harness/`、Click CLI、REPL、`--json`、`TEST.md`、`HARNESS.md`、`SKILL.md`
- 主入口：build、refine、test、validate、list
- 接入面：Claude Code、OpenCode、Codex、OpenClaw、Qodercli、Goose
- 新重点：CLI-Hub、Phase 6.5 的 `SKILL.md` 生成、Windows `cygpath` 兼容

### Quick Ref
- 先做出来：`/cli-anything:cli-anything`
- 先补缺口：`/cli-anything:refine`
- 先验规范：`/cli-anything:validate`
- 先跑回归：`/cli-anything:test`

## ⚡ 最短闭环
---
lang: bash
emoji: ⚡
link: https://github.com/HKUDS/CLI-Anything#-quick-start
desc: 这套工具最适合先生成最小可用 harness，再用 refine 和 validate 迭代补强。
---

```bash
# Claude Code 先安装插件
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything

# 生成一个软件的 harness
/cli-anything:cli-anything ./gimp

# 按场景补能力
/cli-anything:refine ./gimp "batch processing and filters"

# 交付前做规范检查
/cli-anything:validate ./gimp

# 跑回归并回写测试结果
/cli-anything:test ./gimp
```

### 什么时候停在哪一步
- 只想验证思路：停在 build
- 命令覆盖不够：继续 refine
- 结构和标准不稳：先 validate
- 准备发给别人用：test 后再安装生成结果

## 🏗️ 标准流水线
---
lang: markdown
emoji: 🏗️
link: https://github.com/HKUDS/CLI-Anything/blob/main/cli-anything-plugin/README.md
desc: 官方 README 仍沿用分阶段心智，但插件侧已经把实际流程拆成更明确的 8 个动作。
---

1. `Source Acquisition`：如果输入是 GitHub URL，先获取源码
2. `Codebase Analysis`：扫描源码结构、入口和可暴露能力
3. `CLI Architecture Design`：规划命令组、输出模型和交互方式
4. `Implementation`：生成 Click CLI、REPL、JSON / Human 输出
5. `Test Planning`：产出 `TEST.md` 和测试计划
6. `Test Implementation & Documentation`：补测试并回写结果
7. `SKILL.md Generation`：生成包内技能文件
8. `PyPI Publishing and Installation`：准备安装、发布和 PATH 暴露

### 产物检查
- 有没有生成 `<software>/agent-harness/`
- 有没有 `pip install -e .`
- 有没有 `cli-anything-<software> --help`
- 有没有 `--json`
- 有没有 `skills/SKILL.md`

## 🍳 高频场景
---
lang: bash
emoji: 🍳
link: https://github.com/HKUDS/CLI-Anything/blob/main/cli-anything-plugin/QUICKSTART.md
desc: 先按场景找起手式，再决定是否要 refine、validate 或 test。
---

### 本地源码转 harness
```bash
/cli-anything:cli-anything ./gimp
```

### 直接处理 GitHub 仓库
```bash
/cli-anything https://github.com/blender/blender
```

### 对整个软件做增量补强
```bash
/cli-anything:refine ./obs-studio
```

### 只补某个功能域
```bash
/cli-anything:refine ./shotcut "vid-in-vid and picture-in-picture compositing"
/cli-anything:refine ./blender "particle systems and physics simulation"
```

### 盘点已生成的 harness
```bash
/cli-anything:list
/cli-anything:list --depth 2
/cli-anything:list --json
```

### 交付前验收
```bash
/cli-anything:validate ./audacity
/cli-anything:test ./inkscape
```

## 🤖 接入方式
---
lang: markdown
emoji: 🤖
link: https://github.com/HKUDS/CLI-Anything#-quick-start
desc: 不同平台只是入口不同，方法论一致，核心差别在安装介质、命令格式和可发现性。
---

### Claude Code
- 主路径，生态最完整
- 安装：`/plugin marketplace add HKUDS/CLI-Anything` + `/plugin install cli-anything`
- 常用命令：`/cli-anything:cli-anything`、`/cli-anything:refine`、`/cli-anything:test`、`/cli-anything:validate`
- 旧版兼容：Claude Code 2.x 以下可用 `/cli-anything`

### OpenCode
- 复制 `opencode-commands/*.md` 和 `HARNESS.md`
- 命令：`/cli-anything`、`/cli-anything-refine`、`/cli-anything-test`、`/cli-anything-validate`、`/cli-anything-list`
- 要点：`HARNESS.md` 必须和命令文件放在同一目录

### Codex
- 通过仓库自带安装脚本装 skill
- Windows：`.\CLI-Anything\codex-skill\scripts\install.ps1`
- 更适合自然语言指令，例如“Use CLI-Anything to validate ./libreoffice”

### OpenClaw
- 复制 `openclaw-skill/SKILL.md` 到 `~/.openclaw/skills/cli-anything/`
- 入口不是 slash command，而是 skill 调用
- 示例：`@cli-anything build a CLI for ./gimp`

### Qodercli
- 执行 `bash CLI-Anything/qoder-plugin/setup-qodercli.sh`
- 注册后重启会话
- 支持 build / refine / validate

### Goose
- 通过 Claude Code 一类 CLI provider 复用
- 本质上沿用 provider 的命令格式

## 📋 命令速查
---
lang: bash
emoji: 📋
link: https://github.com/HKUDS/CLI-Anything/blob/main/cli-anything-plugin/README.md
desc: 如果你已经知道自己要 build、补能力、校验还是盘点，这张卡可以直接抄。
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
- `focus`：传具体场景，比“优化一下”有效得多

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

## 🧪 生成后的 CLI
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
- `which cli-anything-<software>`：快速确认是否已进 PATH
- `skills/SKILL.md`：便于 Agent 自动发现可用技能

## 📐 质量门槛
---
lang: markdown
emoji: 📐
link: https://github.com/HKUDS/CLI-Anything#-the-standard-playbook-harnessmd
desc: 这部分决定 harness 是“能跑”，还是“能稳定给 Agent 用”。
---

- 必须调用真实软件，不要拿替代库假装实现核心能力
- 不能只看退出码，要验证输出内容或结构
- GUI 软件常见 rendering gap，要把最终渲染结果纳入检查
- 输出格式验证要覆盖 magic bytes、ZIP / OOXML 结构、像素、音频、时长等
- `validate` 不是可有可无，它是把“勉强可用”拦在交付前的门槛

## ⚠️ 限制与决策
---
lang: markdown
emoji: ⚠️
link: https://github.com/HKUDS/CLI-Anything#limitations
desc: 这个项目很强，但不是万能包装器。质量通常受模型强度、源码可得性和验证覆盖率共同影响。
---

- 更依赖强基模：官方 README 提到 Claude Opus 4.6、Claude Sonnet 4.6、GPT-5.4 这一类前沿模型
- 更适合有源码的软件；只有二进制或需要反编译时，质量会明显下降
- 首轮 build 不等于完成，生产可用通常需要多轮 refine
- Windows 环境如果缺 `bash` 或 `cygpath`，部分链路会失败

### 典型判断
- 有源码、能跑测试：优先 build + refine
- 只有二进制：先评估覆盖率，再决定是否继续
- 目标是交付给 Agent：一定补 validate

## 🌐 发布与收尾
---
lang: markdown
emoji: 🌐
link: https://hkuds.github.io/CLI-Anything/hub/
desc: CLI-Anything 已经从单仓库方法论扩展到可浏览、可安装的 CLI 注册中心。
---

- `CLI-Hub`：集中浏览、搜索、安装社区 CLI
- 社区提交：PR 一个 `registry.json` 条目即可更新 Hub
- 如果要复用生成结果，下一步看 `PUBLISHING.md`
- 如果要判断 harness 质量，先看 `HARNESS.md`，再看示例项目

### 收尾动作
- 再跑一遍 `validate`
- 再跑一遍 `test`
- 再确认 `--help`、`--json`、REPL 都正常
- 再考虑发布或加入 Hub
