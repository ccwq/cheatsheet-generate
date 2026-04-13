---
title: CLI-Anything 混合速查
lang: bash
version: "v0.2.0@8980fdc (2026-04-02)"
date: 2026-04-02
github: HKUDS/CLI-Anything
colWidth: 430px
---

## 🧭 一眼入口
---
lang: markdown
emoji: 🧭
link: https://github.com/HKUDS/CLI-Anything
desc: 把任意软件包装成 AI Agent 可稳定调用、可测试、可发布的 CLI 工作流。
---

**核心定位**：不是又一个命令，而是把现有软件变成 `cli-anything-<software>`，让 AI Agent 能调用。

| 交付物 | 说明 |
|--------|------|
| `agent-harness/` | 核心产物目录 |
| Click CLI + REPL | 人类/机器双接口 |
| `--json` | 机器可读输出 |
| `SKILL.md` | AI Agent 可发现性 |
| `TEST.md` | 测试覆盖文档 |

**5 条必记命令**

| 命令 | 用途 |
|------|------|
| `/cli-anything:cli-anything` | 生成 harness |
| `/cli-anything:refine` | 增量补能力 |
| `/cli-anything:validate` | 验规范 |
| `/cli-anything:test` | 跑回归 |
| `/cli-anything:list` | 盘点已有 |

**支持平台**：Claude Code · OpenCode · Codex · OpenClaw · Qodercli · Goose · GitHub Copilot CLI · Pi

---

## ⚡ 最短闭环
---
lang: bash
emoji: ⚡
link: https://github.com/HKUDS/CLI-Anything#-quick-start
desc: 先生成最小可用 harness，再用 refine 和 validate 迭代补强。
---

```bash
# Claude Code 安装插件
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything

# 1️⃣ Build：生成 harness
/cli-anything:cli-anything ./gimp

# 2️⃣ Refine：按场景补能力
/cli-anything:refine ./gimp "batch processing and filters"

# 3️⃣ Validate：交付前验规范
/cli-anything:validate ./gimp

# 4️⃣ Test：跑回归
/cli-anything:test ./gimp
```

### 决策树：什么时候停在哪一步

| 目标 | 停在哪 |
|------|--------|
| 只验证思路 | build |
| 命令覆盖不够 | refine |
| 结构和标准不稳 | validate |
| 准备给别人用 | test → 安装 |

---

## 🏗️ 标准流水线（7 阶段）
---
lang: markdown
emoji: 🏗️
link: https://github.com/HKUDS/CLI-Anything/blob/main/cli-anything-plugin/README.md
desc: 插件侧把流程拆成 8 个明确动作，v0.2.0 重构为分层导览。
---

```
Phase 1  Source Acquisition     → 源码获取（GitHub URL 或本地目录）
Phase 2  Codebase Analysis    → 扫描结构、入口、可暴露能力
Phase 3  CLI Architecture      → 规划命令组、输出模型、交互方式
Phase 4  Implementation        → 生成 Click CLI、REPL、JSON/Human 输出
Phase 5  Test Planning         → 产出 TEST.md 和测试计划
Phase 6  Test & Documentation  → 补测试并回写结果
Phase 6.5 SKILL.md Generation  → 生成包内技能文件（AI 可发现性）
Phase 7  PyPI Publishing       → 安装、发布、PATH 暴露
```

### 产物检查清单

```bash
# 逐项核对
[ -d <software>/agent-harness/ ]    && echo "✓ harness 目录"
[ -f <software>/agent-harness/pyproject.toml ] && echo "✓ 可安装"
which cli-anything-<software>       && echo "✓ PATH 已暴露"
cli-anything-<software> --help     && echo "✓ CLI 可用"
cli-anything-<software> --json -1  && echo "✓ JSON 输出"
[ -f skills/SKILL.md ]             && echo "✓ AI 技能卡"
```

---

## 🍳 高频场景 Recipes
---
lang: bash
emoji: 🍳
link: https://github.com/HKUDS/CLI-Anything/blob/main/cli-anything-plugin/QUICKSTART.md
desc: 先按场景找起手式，再决定是否要 refine、validate 或 test。
---

### 场景 A：本地源码 → harness

```bash
/cli-anything:cli-anything ./gimp
```

### 场景 B：GitHub 仓库直连

```bash
/cli-anything https://github.com/blender/blender
```

### 场景 C：整软件增量补强

```bash
/cli-anything:refine ./obs-studio
```

### 场景 D：按功能域精准补

```bash
/cli-anything:refine ./shotcut "vid-in-vid and picture-in-picture compositing"
/cli-anything:refine ./blender "particle systems and physics simulation"
```

### 场景 E：盘点已有 harness

```bash
/cli-anything:list                           # 列出所有
/cli-anything:list --depth 2                 # 限制递归深度
/cli-anything:list --json                   # 机器可读
```

### 场景 F：交付前验收

```bash
/cli-anything:validate ./audacity           # 结构规范检查
/cli-anything:test ./inkscape               # 回归测试
```

---

## 🤖 平台接入对照
---
lang: markdown
emoji: 🤖
link: https://github.com/HKUDS/CLI-Anything#-quick-start
desc: 不同平台只是入口不同，方法论一致，差别在安装介质和命令格式。
---

### Claude Code（主路径，生态最完整）

```bash
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything

# 5 条核心命令
/cli-anything:cli-anything <software-path-or-repo>
/cli-anything:refine <software-path> [focus]
/cli-anything:validate <software-path-or-repo>
/cli-anything:test <software-path-or-repo>
/cli-anything:list [--path <dir>] [--depth <n>] [--json]
```

### OpenCode

```bash
# 复制命令文件和 HARNESS.md 到同一目录
cp opencode-commands/*.md <target>/
cp HARNESS.md <target>/

# 命令（无 slash 前缀）
/cli-anything
/cli-anything-refine
/cli-anything-test
/cli-anything-validate
/cli-anything-list
```

### Codex（自然语言友好）

```bash
# Windows 安装
.\CLI-Anything\codex-skill\scripts\install.ps1

# 自然语言指令示例
Use CLI-Anything to validate ./libreoffice
```

### OpenClaw

```bash
# 复制 SKILL.md 到指定目录
cp openclaw-skill/SKILL.md ~/.openclaw/skills/cli-anything/

# skill 调用（不是 slash command）
@cli-anything build a CLI for ./gimp
```

### Qodercli

```bash
bash CLI-Anything/qoder-plugin/setup-qodercli.sh
# 重启会话后可用 build / refine / validate
```

### GitHub Copilot CLI

```bash
copilot plugin install ./cli-anything-plugin
# 重启会话后可用 /cli-anything:*
```

### Goose

```bash
# 复用 Claude Code 类 CLI provider
# 沿用 provider 的命令格式
```

### Pi

```bash
# 接入方式同 Claude Code
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything
```

---

## 📦 生成后的 CLI
---
lang: bash
emoji: 📦
link: https://github.com/HKUDS/CLI-Anything#-demo-using-a-generated-cli
desc: 真正交付给 Agent 的是 `cli-anything-<software>`，不是 CLI-Anything 本身。
---

```bash
# 安装生成结果
cd <software>/agent-harness
pip install -e .

# 人类可读帮助
cli-anything-<software> --help

# 进入 REPL 交互
cli-anything-<software>

# 机器可读输出
cli-anything-<software> --json <command>
```

### SKILL.md — AI Agent 的可发现性

```markdown
<!-- skills/SKILL.md 示例结构 -->
# Skill: cli-anything-<software>

## Commands
- `cli-anything-<software> --json <cmd>` → 机器输出
- `cli-anything-<software> <cmd>` → 人类输出

## Use Case
当需要调用 <software> 功能时使用此 CLI。
```

> **为什么重要**：没有 SKILL.md，AI Agent 不知道这个 CLI 存在；有了它，Agent 可以自主发现和调用。

---

## 🔌 CLI-Hub — 社区 CLI 注册中心
---
lang: markdown
emoji: 🔌
link: https://hkuds.github.io/CLI-Anything/hub/
desc: CLI-Anything 从单仓库方法论扩展到可浏览、可安装的 CLI 注册中心。
---

### 安装 Hub

```bash
pip install cli-anything-hub
```

### 浏览社区 CLI

```bash
# 查看所有可用 CLI
cli-anything-hub list

# 搜索特定 CLI
cli-anything-hub search <keyword>

# 安装社区 CLI
cli-anything-hub install <cli-name>
```

### 贡献社区 CLI

```bash
# 1. 生成本地 CLI harness
/cli-anything:cli-anything ./your-software

# 2. 提交到 registry.json（PR）
# 3. 审核通过后即可被其他用户安装
```

### 已收录案例（16+）

Openscreen · CloudAnalyzer · WireMock · VideoCaptioner · GIMP · Blender · Audacity · Inkscape · OBS Studio · Shotcut · LibreOffice 等

---

## 📋 命令速查
---
lang: bash
emoji: 📋
link: https://github.com/HKUDS/CLI-Anything/blob/main/cli-anything-plugin/README.md
desc: 5 条核心命令，覆盖完整生命周期。
---

### Build — 生成 harness

```bash
/cli-anything:cli-anything <software-path-or-repo>
```
- **输入**：本地源码目录或 GitHub URL
- **输出**：完整 harness、测试、文档、可安装包

### Refine — 增量补能力

```bash
/cli-anything:refine <software-path> [focus]
```
| 参数 | 必填 | 说明 |
|------|------|------|
| `software-path` | ✓ | 本地源码目录 |
| `focus` | | 具体场景描述，比"优化一下"有效得多 |

### Test — 回归测试

```bash
/cli-anything:test <software-path-or-repo>
```
- 跑测试并回写 `TEST.md`
- 适合：回归验证、重构后检查、发布前验收

### Validate — 规范检查

```bash
/cli-anything:validate <software-path-or-repo>
```
- 对照 `HARNESS.md` 检查结构和最佳实践
- 适合：怀疑"能跑但不规范"时先跑一遍

### List — 盘点已有

```bash
/cli-anything:list [--path <directory>] [--depth <n>] [--json]
```
| 参数 | 说明 |
|------|------|
| `--path` | 指定搜索根目录 |
| `--depth` | 限制递归深度 |
| `--json` | 输出机器可读结果 |

---

## 📐 质量门槛
---
lang: markdown
emoji: 📐
link: https://github.com/HKUDS/CLI-Anything#-the-standard-playbook-harnessmd
desc: 这部分决定 harness 是"能跑"，还是"能稳定给 Agent 用"。
---

| 要求 | 说明 |
|------|------|
| 调用真实软件 | 不要拿替代库假装实现核心能力 |
| 验证输出内容 | 不能只看退出码，要验证结构 |
| 渲染结果检查 | GUI 软件要把最终渲染纳入检查 |
| 多格式验证 | magic bytes、ZIP/OOXML、像素、音频、时长等 |
| 必须 validate | 把"勉强可用"拦在交付前的门槛 |

> **v0.2.0 测试覆盖**：1,839+ 测试，16 个应用，跨创意、生产力、通信等多元领域

---

## ⚠️ 限制与决策
---
lang: markdown
emoji: ⚠️
link: https://github.com/HKUDS/CLI-Anything#limitations
desc: 这个项目很强，但不是万能包装器。
---

| 限制 | 影响 |
|------|------|
| 更依赖强基模 | 推荐 Claude Opus 4.6 / Sonnet 4.6 / GPT-5.4 |
| 适合有源码的软件 | 只有二进制时质量下降 |
| 首轮 build ≠ 完成 | 生产可用通常需要多轮 refine |
| Windows 缺 bash/cygpath | 部分链路可能失败 |

### 典型判断

| 情况 | 行动 |
|------|------|
| 有源码、能跑测试 | build + refine |
| 只有二进制 | 先评估覆盖率，再决定 |
| 目标是交付给 Agent | 一定补 validate |

---

## 🌐 发布与收尾
---
lang: markdown
emoji: 🌐
link: https://hkuds.github.io/CLI-Anything/hub/
desc: 从生成到可分发的完整收尾动作。
---

### 收尾检查清单

```bash
# 逐项确认
/cli-anything:validate ./<software>   # 结构规范
/cli-anything:test ./<software>        # 回归测试
cli-anything-<software> --help         # 人类接口正常
cli-anything-<software> --json -1     # 机器接口正常
# REPL 手动走一遍核心命令
```

### 下一步

| 目标 | 看什么 |
|------|--------|
| 复用生成结果 | `PUBLISHING.md` |
| 判断 harness 质量 | `HARNESS.md` → 示例项目 |
| 分发社区 CLI | CLI-Hub `registry.json` PR |
