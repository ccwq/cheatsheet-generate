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
desc: Making ALL Software Agent-Native — 把任意软件包装成 AI Agent 可稳定调用、可测试、可发布的 CLI 工作流。
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

# 1️⃣ Build：生成完整 harness
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

> **多轮迭代是常态**：单次 build 通常不能覆盖全部功能，需要多次 refine 循环。

---

## 🏗️ 标准流水线（8 阶段）
---
lang: markdown
emoji: 🏗️
link: https://github.com/HKUDS/CLI-Anything/blob/main/cli-anything-plugin/README.md
desc: Build 阶段完整 7+1 流水线，HARNESS.md 为 SOP 主文档。
---

```
Phase 1  Analyze          → 扫描源码，将 GUI 操作映射到 API
Phase 2  Design          → 设计命令组、状态模型、输出格式
Phase 3  Implement       → Click 构建 CLI、REPL、JSON 输出、undo/redo
Phase 4  Plan Tests      → 创建 TEST.md，规划 unit + E2E 测试
Phase 5  Write Tests     → 实现完整测试套件
Phase 6  Document        → 更新 TEST.md 测试结果
Phase 6.5 SKILL.md       → 生成 SKILL.md 供 Agent 发现能力
Phase 7  Publish         → 生成 setup.py，安装到 PATH
```

### 产物检查清单

```bash
# 逐项核对
[ -d <software>/agent-harness/ ]        && echo "✓ harness 目录"
[ -f <software>/agent-harness/pyproject.toml ] && echo "✓ 可安装"
which cli-anything-<software>           && echo "✓ PATH 已暴露"
cli-anything-<software> --help           && echo "✓ CLI 可用"
cli-anything-<software> --json -1       && echo "✓ JSON 输出"
[ -f skills/SKILL.md ]                   && echo "✓ AI 技能卡"
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
/cli-anything:list --depth 2               # 限制递归深度
/cli-anything:list --json                   # 机器可读
```

### 场景 F：交付前验收

```bash
/cli-anything:validate ./audacity           # 结构规范检查
/cli-anything:test ./inkscape               # 回归测试
```

---

## 🧪 测试四层体系
---
lang: markdown
emoji: 🧪
link: https://github.com/HKUDS/CLI-Anything#running-tests
desc: 测试必须覆盖真实软件调用，拒绝 exit code 0 依赖。
---

| 层级 | 文件 | 特点 |
|------|------|------|
| Unit tests | `test_core.py` | 合成数据，无外部依赖 |
| E2E — native | — | 项目文件生成 pipeline 验证 |
| E2E — true backend | — | 调用真实软件 + 输出验证 |
| CLI subprocess tests | — | 以真实用户/Agent 身份调用 |

### Subprocess 测试规则

```bash
# 必须使用 _resolve_cli() — 禁止硬编码路径
# 不得设置 cwd
# CI/release 测试中使用
CLI_ANYTHING_FORCE_INSTALLED=1
```

### 输出验证方法

```
exit code 0 ≠ 成功
必须验证：
  ✓ magic bytes
  ✓ 文件结构（ZIP/OOXML）
  ✓ 像素分析（图像）
  ✓ 时长分析（音视频）
```

---

## 📐 HARNESS.md 核心原则
---
lang: markdown
emoji: 📐
link: https://github.com/HKUDS/CLI-Anything/blob/main/cli-anything-plugin/HARNESS.md
desc: 5 大原则 + 7 个 Architecture Pitfalls，决定 harness 是"能跑"还是"能稳定给 Agent 用"。
---

### 五大核心原则

| 原则 | 说明 |
|------|------|
| **Authenticity** | CLI 必须调用真实应用程序进行渲染/导出 |
| **Flexible Interaction** | REPL 交互式会话 + 子命令脚本两种模式并存 |
| **Consistent UX** | 统一的 --json 输出、--help、错误处理 |
| **Agent-Native Design** | 通过标准 --help 和 which 命令支持 Agent 发现能力 |
| **Zero-Compromise Dependencies** | 真实软件必须安装；测试不允许跳过或伪造结果 |

### Architecture Pitfalls（7 个坑）

| 坑 | 说明 |
|----|------|
| **The Rendering Gap** | GUI App 效果在渲染时应用，naive 实现会静默丢失效果 |
| **MCP Backend Pattern** | MCP 后端包装模式、session 管理、daemon 模式 |
| **Filter Translation** | MLT → ffmpeg 滤镜转换规则：重复滤镜合并、流顺序 |
| **Timecode Precision** | 非整数帧率（29.97fps）使用 `round()` 而非 `int()`，±1 帧容差 |
| **Output Verification** | 不信任 exit code 0 — 验证 magic bytes、文件结构 |
| **Testing Strategy** | 后端缺失时测试失败（fail），而非跳过（skip） |

> **#1 设计铁律**：CLI 必须调用真实软件进行渲染和导出，不允许重新实现其功能。

---

## 📚 guides/ 子文档
---
lang: markdown
emoji: 📚
link: https://github.com/HKUDS/CLI-Anything/tree/main/guides
desc: HARNESS.md 按需加载的专题展开，共 6 个子文档。
---

| 文档 | 内容 |
|------|------|
| `guides/session-locking.md` | `_locked_save_json` 模式实现文件独占锁 |
| `guides/skill-generation.md` | SKILL.md 生成完整流程与模板定制 |
| `guides/pypi-publishing.md` | setup.py 模板、命名空间包结构、发布流程 |
| `guides/mcp-backend.md` | MCP 后端包装模式、session 管理、daemon 模式 |
| `guides/filter-translation.md` | MLT → ffmpeg 滤镜转换规则与示例 |
| `guides/timecode-precision.md` | 非整数帧率处理（±1 帧容差）规范 |

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

### Goose / Pi

```bash
# 复用 Claude Code 类 CLI provider
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
link: https://clianything.cc/hub/
desc: CLI-Anything 从单仓库方法论扩展到可浏览、可安装的 CLI 注册中心。
---

### 安装 Hub

```bash
pip install cli-anything-hub
```

### 浏览器 / 安装 CLI

```bash
# 访问 Hub 主页
clianything.cc/hub

# 命令行搜索
cli-anything-hub search <keyword>

# 安装社区 CLI
cli-anything-hub install <cli-name>
```

### 贡献社区 CLI

```bash
# 1. 生成本地 CLI harness
/cli-anything:cli-anything ./your-software

# 2. PR 到 registry.json
# 3. 审核通过后即可被其他用户安装
```

### 已收录案例（29+ 应用）

GIMP · Blender · Audacity · Inkscape · OBS Studio · Shotcut · LibreOffice · Openscreen · CloudAnalyzer · WireMock · VideoCaptioner 等

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
| 真实软件必须安装 | 无降级处理；测试缺失时必须失败 |

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
link: https://clianything.cc/hub/
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

---

## 📊 测试覆盖统计

| 指标 | 数值 |
|------|------|
| 总测试数 | 2,130+ |
| 通过率 | 100% |
| Unit Tests | ~1,551 |
| E2E Tests | ~560 |
| Node.js Tests | 19 |
| 支持应用 | 29+ |