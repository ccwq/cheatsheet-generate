# Codex 动态工作流速查表

> 把 Claude Code 动态工作流编排逻辑完整搬到 OpenAI Codex，比原生版更省 token。

## 一句话定位

| 属性 | 内容 |
|------|------|
| 类型 | Claude Code → Codex 移植技能（Open Source Skill） |
| 核心价值 | LLM 生成 JS 编排脚本驱动多 Subagent，主 Agent 只看最终答案，省 token |
| 开源地址 | [scasella / claude-dynamic-workflows-codex](https://github.com/scasella/claude-dynamic-workflows-codex) |
| License | 开源（见仓库） |
| 相关生态 | Claude Code Dynamic Workflows、awesome-claude-dynamic-workflows、Claude Code Skills 合集 |

## 核心指标

| 指标 | 值 |
|------|-----|
| 节省 token | 比 Claude Code 原生版更少 |
| 信息隔离 | JS 变量存中间结果，主 Agent 上下文不膨胀 |
| 断点恢复 | 进度实时保存，可从中断处继续 |
| 对抗性验证 | 子代理互相找漏洞、反驳，提升质量 |
| 三种运行模式 | 目标模式 / 子代理模式 / 工作包模拟模式 |

---

## 二、安装 SOP

### 2.1 Codex CLI 安装

#### macOS

```bash
# 方式一：一键安装脚本（推荐）
curl -fsSL https://raw.githubusercontent.com/openai/codex-cli/main/install.sh | sh

# 方式二：Homebrew
brew install openai/codex/codex

# 方式三：npm 全局安装
npm install -g @openai/codex
codex --version
```

#### Linux

```bash
# 一键安装脚本
curl -fsSL https://raw.githubusercontent.com/openai/codex-cli/main/install.sh | sh

# npm
npm install -g @openai/codex
```

#### Windows

```powershell
# 方式一：PowerShell 一键安装（推荐）
irm https://raw.githubusercontent.com/openai/codex-cli/main/install.ps1 | iex

# 方式二：npm
npm install -g @openai/codex
```

#### 验证安装

```bash
codex --version
# codex-cli 0.87.0+（2026年最新）
```

### 2.2 Codex CLI 登录认证

```bash
# 方式一：ChatGPT 订阅登录（需要 Plus/Team 账号）
codex
# 选择 1 → 网页验证 → 提示 "Signed in to Codex"

# 方式二：API Key 登录（国内用户推荐）
# Linux/macOS
export OPENAI_API_KEY=sk-xxxx

# Windows PowerShell
$env:OPENAI_API_KEY="sk-xxxx"

# 方式三：国内代理（修改 base_url）
# ~/.codex/config.toml
model_provider = "openai"
[model_providers.openai]
name = "openai"
base_url = "https://your-proxy.com/v1"   # 国内兼容 API 端点
requires_openai_auth = true
```

### 2.3 Claude Code Dynamic Workflows 技能安装

> 安装完成后，技能出现在 Codex / Claude Code 技能列表里，通过 `/skills` 查看。

```bash
# 在 Claude Code 或 Codex 中直接说：
"/dynamic"           # 激活动态工作流模式
# 或在 Claude Code Desktop：
/skills              # 查看已注册技能列表
# 找到 "dynamic-workflow" 确认已激活
```

**快速上手 3 步：**

```
1. 安装 Skill   → 跟 Codex 说"安装这个 skill"，Skill 自动注入工具链
2. 调用指令     → 在对话框输入 /dynamic
3. 描述任务     → 描述目标，LLM 自动生成编排脚本、启动子代理、进入 /goal 模式执行
```

---

## 三、Codex CLI 配置速查

### 3.1 config.toml 结构

```toml
# ~/.codex/config.toml
# 配置文件位置：CLI 和 IDE 扩展共用同一份

model_provider = "openai"        # 模型供应商
model = "gpt-5-codex"           # 模型选择
model_reasoning_effort = "high" # 推理强度

disable_response_storage = true  # 禁用响应存储（节省空间）

[model_providers.openai]
name = "openai"
base_url = "https://api.openai.com/v1"
wire_api = "responses"         # 使用 Responses API
requires_openai_auth = true

# approval_policy = "manual"   # manual / auto（高风险操作需审批）
# sandbox_mode = true           # 沙盒模式，隔离危险操作
```

### 3.2 AGENTS.md 多层级配置（洋葱模型）

```
~/.codex/AGENTS.md          # 用户级（最外层）
/project/AGENTS.md          # 项目级（中间层）
/project/src/AGENTS.md      # 模块级（最内层）
```

Codex 从外向内逐层解析，内层覆盖外层同名配置。

```markdown
<!-- ~/.codex/AGENTS.md（全局默认） -->
## 全局默认配置
- 代码缩进：2 个空格
- 字符串引号：单引号
- 测试文件后缀：*.spec.js
```

```markdown
<!-- /project/AGENTS.md（项目特殊要求） -->
## 项目特殊要求
- 必须使用 TypeScript 4.8+
- API 响应必须包含 `status` 字段
- 禁止使用 `any` 类型
```

### 3.3 权限配置

```toml
# approval_policy 控制高风险操作
approval_policy = "manual"   # 建议 / 自动编辑 / 全自动

# sandbox_mode 沙盒隔离
sandbox_mode = true          # 隔离文件系统、shell、网络操作
```

### 3.4 IDE 集成

```bash
# JetBrains IDE：搜索 "Codex" 插件，安装后即可使用
# VS Code：搜索 "Codex" 插件
# GitHub 网页端：Copilot Pro+ / Enterprise 订阅可直接用 Claude + Codex
```

---

## 四、Codex 动态工作流技能使用

### 4.1 核心指令

| 指令 | 作用 |
|------|------|
| `/dynamic` | 调用动态工作流模式 |
| `/goal` | 描述最终目标，LLM 自动生成编排脚本并执行 |
| `/skills` | 查看已注册的技能列表 |
| `/deep-research` | 内置深度研究工作流（Claude Code Desktop）|

### 4.2 三种运行模式详解

#### 目标模式（Goal mode）

> 给主 Agent 一个「最终目标」，LLM 自动拆解 + 规划 + 执行。

适用场景：大任务、多文件、容易遗漏的长链路工作。

```
「使用 Codex 动态工作流的目标模式，
帮我把当前项目从 Vue2 迁移到 Vue3，并保持所有测试通过。」
```

#### 子代理模式（Sub-agent mode）

> 提前注册子代理角色，按任务阶段调度不同角色。

适用场景：架构评审 → 编码实现 → 测试验证的分阶段工作。

```
「用 Codex 动态工作流创建一个架构子代理和一个编码子代理，
让架构代理先输出迁移计划，再让编码代理按计划实现。」
```

#### 工作包模拟模式（Work package simulation）

> 只生成「任务拆解 + 执行计划」，不直接改代码，适合事先审核。

适用场景：预算评估、风险预判、人工审批前预览。

```
「先用工作包模拟模式生成完整任务拆解和执行计划，
不要修改任何文件，只给我看计划。」
```

### 4.3 工作原理

```
STEP 1  你描述任务目标（自然语言）
  ↓
STEP 2  LLM 自动生成 JavaScript 编排脚本
        包含：任务拆分、并行/串行逻辑、验证机制、收敛条件、错误处理
  ↓
STEP 3  JS 脚本自动调度执行
        子代理结果只存在 JS 变量里
        主 Agent 只接收最终答案（主上下文不膨胀）
```

---

## 五、Claude Code Dynamic Workflows 完整使用

### 5.1 Claude Code Desktop 快速上手

```
# Claude Code Desktop 中直接使用：
/dynamic              # 激活动态工作流
/deep-research        # 内置深度研究工作流（仓库分析、技术债扫描）
```

### 5.2 Claude Code Dynamic Workflows 的关键限制

| 限制项 | 值 |
|--------|-----|
| 最大并发 Subagent | 16 |
| 最大任务数上限 | 1000 |
| fs + shell 工具 | 默认不可用（需配置权限）|
| 双层 Gate | `CLAUDE_CODE_WORKFLOWS=1` 环境变量 + 服务端开关 |
| Workflow 格式 | .mjs ES Module，`Workflow({name, scriptPath, args})` |

### 5.3 Claude Code Dynamic Workflows 适用场景

适合：大文件、多步骤、易遗漏的长链路任务。

```
✓ 仓库级 Bug 排查
✓ 全局代码迁移（Vue2 → Vue3 等）
✓ 安全审计
✓ 技术债扫描
✓ 多方案交叉研究
✗ 改一个函数、修一个接口（过于简单）
```

### 5.4 Claude Code Skills 安装（中文技能合集）

> 推荐：Claude Code Skills 中文技能合集（laolaoshiren/claude-code-skills-zh）

```bash
# 查看合集文档
# https://github.com/laolaoshiren/claude-code-skills-zh
# 精选 18 个原创可安装技能，复制即装
```

---

## 六、Claude Code + Codex 协作生态

### 6.1 Claude Code + Codex 并行使用

```bash
# 在 Claude Code Desktop 中调用 Codex：
# 安装 OpenAI Codex Plugin CC（官方开源）
# Claude Code 用户可直接在工作流中调用 Codex
# 用 AI 自动审查和修复代码
```

### 6.2 Claude Code Dynamic Workflows 社区资源

| 资源 | 地址 |
|------|------|
| 真实工作流收集 | [lxcong/awesome-claude-dynamic-workflows](https://github.com/lxcong/awesome-claude-workflows) |
| Claude Code Skills 合集 | [laolaoshiren/claude-code-skills-zh](https://github.com/laolaoshiren/claude-code-skills-zh) |
| Claude Code GitHub Actions | [alirezarezvani/claude-code-github-workflow](https://github.com/alirezarezvani/claude-code-github-workflow) |
| CCG Workflow（Claude+Codex+Gemini）| [fengshao1227/ccg-workflow](https://gitcode.com/fengshao1227/ccg-workflow) |

### 6.3 GitHub 平台集成

```
GitHub Copilot Pro+ / Enterprise：
→ 网页端 / 移动版 / VS Code / JetBrains
→ 可同时使用 Claude 和 Codex
→ 多模型协同开发
```

### 6.4 OpenAI Codex macOS 应用（2026年2月）

```
OpenAI Codex 新版 macOS 应用特性：
✓ 多智能体并行作业
✓ 工作树隔离（各 agent 修改操作互不干扰）
✓ 技能系统（工具 + 规范打包为可复用模块）
✓ 后台定时工作流（自动化重复性工作）
```

---

## 七、与 Claude Code 原生 Dynamic Workflows 对比

| 对比项 | Claude Code 原生版 | Codex 动态工作流技能版 |
|--------|--------------------|-----------------------|
| 基础模型 | Claude | GPT-5 / o3 / o4-mini |
| token 节省 | 中间结果隔离 | JS 变量存结果，主 Agent 只看最终答案 |
| 信息隔离 | Runtime 内存 | JS 脚本变量 |
| 对抗性验证 | 支持 | 支持 |
| 断点恢复 | 支持 | 支持 |
| /deep-research | 内置 | 需技能 |
| 适用场景 | Claude Code 用户 | Codex 用户 + Claude Code 迁移者 |

### 传统方案 vs 动态工作流

| 模式 | 特点 | 问题 |
|------|------|------|
| 传统 Subagent | 子代理靠主 Agent 中转通信 | 上下文爆炸，token 消耗大 |
| Agent Team | 子代理之间可直接通信 | 3-5 个实例后开始混乱；会话中断状态全丢 |
| **动态工作流** | **JS 变量存中间结果，主 Agent 只看最终答案** | **—** |

---

## 八、自建动态工作流系统思路

> 以 Codex CLI 为底座，写一个 codex-dynamic-workflow 插件；或用任意语言写独立多 Agent 控制器，通过 API 接入。

### 四部分架构

| 模块 | 职责 |
|------|------|
| **主 Agent** | 接收目标 → 调用工作流模块 → 展示进度 |
| **工作流引擎** | 目标拆解 → 任务状态跟踪 → 子代理调度 |
| **子代理体系** | 各自有输入输出协议 / 模型配置 / 工具权限 |
| **观察/审批/回滚** | 人类随时插手调整；出错时回滚步骤 |

### 两条落地路径

```
🚀 路径 A：直接用现成技能
   安装 → /skills 确认激活 → /dynamic → 选运行模式 → 描述目标

⚙️ 路径 B：自建动态工作流系统
   Codex CLI 插件 / 任意语言多 Agent 控制器
   → 接入 Codex / GPT-5
   → 自定义调度逻辑
```

---

## 九、踩坑与排障

| 问题 | 解决方案 |
|------|----------|
| Codex 进程不退出 | 修改 config.go 添加超时自动终止机制 |
| 权限 denied | 检查 approval_policy 和 sandbox_mode 配置 |
| API Key 失效 | 国内用户改为设置 base_url 指向兼容 API 端点 |
| Workflow 静默失败 | 确认 CLAUDE_CODE_WORKFLOWS=1 环境变量已设置 |
| token 消耗大 | 确认使用目标模式 / 工作包模拟模式，避免全量中间结果返回 |
| Claude Code Workflow 不生效 | 确认双层 Gate：环境变量 + 服务端 GrowthBook 开关均开启 |
| Codex config.toml 路径错误 | Windows：`C:\Users\<用户名>\.codex\config.toml` |
| 中文乱码（Windows）| 安装 PowerShell 7 替代默认 PowerShell 5 |

---

## 十、相关链接

| 资源 | 地址 |
|------|------|
| 动态工作流技能 | [scasella/claude-dynamic-workflows-codex](https://github.com/scasella/claude-dynamic-workflows-codex) |
| Codex CLI 源码 | [openai/codex-cli](https://github.com/openai/codex-cli)（83,200+ ⭐）|
| Claude Code 官方文档 | [code.claude.com/docs/en/workflows](https://code.claude.com/docs/en/workflows) |
| 真实工作流收集 | [lxcong/awesome-claude-dynamic-workflows](https://github.com/lxcong/awesome-claude-workflows) |
| Claude Code Skills 合集 | [laolaoshiren/claude-code-skills-zh](https://github.com/laolaoshiren/claude-code-skills-zh) |
| CCG Workflow | [fengshao1227/ccg-workflow](https://gitcode.com/fengshao1227/ccg-workflow)（Claude+Codex+Gemini）|
| Claude Code GitHub Actions | [alirezarezvani/claude-code-github-workflow](https://github.com/alirezarezvani/claude-code-github-workflow) |
| Codex CLI 国内教程 | [SegmentFault 思否](https://segmentfault.com/a/1190000047776553) |
| Claude Code Dynamic Workflows 深度解析 | [CSDN 博客](https://blog.csdn.net/u010592101/article/details/161582203) |
| Codex config.toml 配置详解 | [CSDN 博客](https://blog.csdn.net/qq_20042935/article/details/157177301) |
| Claude Code 动态工作流来了 | [腾讯新闻](https://so.html5.qq.com/page/real/search_news?docid=70000021_0956a210dcc18352) |
| GitHub 集成 Claude+Codex | [IT之家](https://new.qq.com/rain/a/20260205A02LT100) |
| OpenAI Codex macOS 应用 | [腾讯新闻](https://new.qq.com/rain/a/20260203A0323D00) |
