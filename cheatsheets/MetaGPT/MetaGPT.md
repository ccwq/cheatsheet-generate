---
title: MetaGPT 速查表
lang: python
version: "0.8.2 / main (2026-05)"
date: 2026-05-27
github: FoundationAgents/MetaGPT
colWidth: 460px
---

## 🚀 一句话定位
---
emoji: 🚀
link: https://docs.deepwisdom.ai/main/en/
desc: MetaGPT 是把 SOP 编进多 Agent 协作流程的软件工程框架，强调“像软件公司一样分工”，而不是纯角色聊天。
---

**核心价值：** 不是“多个 Agent 一起聊”，而是把产品、架构、研发、测试这类职责链显式化，让输出更像工程流水线。

---

## ⚡ 安装与前提
---
emoji: ⚡
link: https://docs.deepwisdom.ai/main/en/guide/get_started/installation.html
desc: 当前官方 README 和 PyPI 信息能对齐到安装、Python 版本和配置文件路径，但 release 节奏不连续，版本判断要保守。
---

### 安装

```bash
pip install --upgrade metagpt

# 或直接装主仓
pip install --upgrade git+https://github.com/FoundationAgents/MetaGPT.git
```

### 环境要求

- Python `>=3.9,<3.12`
- 官方 README 明确要求实际使用前安装 Node 和 `pnpm`
- 这是一个偏“工程工作流”的框架，不是只装一个 Python 包就万事大吉

### 配置初始化

```bash
metagpt --init-config
```

配置文件路径是：

```bash
~/.metagpt/config2.yaml
```

这一点要特别注意，本地旧 cheatsheet 写成 `config.yml` 是错误的。

---

## 💡 核心理念：Code = SOP(Team)
---
emoji: 💡
link: https://openreview.net/forum?id=VtmBAGCN7o
desc: MetaGPT 的关键不是人格，而是把团队 SOP 显式编码进角色和动作链路。
---

### 怎么理解这句话

- `Code` 不只是最终代码文件
- `SOP` 代表需求、设计、实现、测试等步骤被拆成规范动作
- `Team` 代表多个角色按固定职责协作，而不是自由聊天

### 和常见多 Agent 框架的区别

| 维度 | MetaGPT | 常见 role-play 框架 |
|---|---|---|
| 核心抽象 | SOP + Role + Action | Persona + Tool + Chat |
| 输出风格 | 文档化、流程化、工程化 | 对话化、灵活但更容易漂 |
| 强项 | 软件工程、结构化交付 | 开放场景、探索型任务 |
| 代价 | 灵活性稍低，约束更强 | 更自由，但工程一致性差 |

---

## 🏗️ 核心对象
---
emoji: 🏗️
link: https://docs.deepwisdom.ai/main/en/guide/get_started/introduction.html
desc: 读 MetaGPT 文档时，最值得先抓住的是 Role、Action、Message、Memory、Team 这几个对象。
---

### Role

```python
from metagpt.roles import Role

class MyRole(Role):
    name: str = "MyRole"
    profile: str = "领域角色"
    goal: str = "完成具体目标"
    constraints: str = "遵守给定约束"
```

`Role` 更像“岗位”，不是单纯人格。你可以把它类比成前端项目里的“组件接口定义”，重点是职责边界清不清楚。

### Action

```python
from metagpt.actions import Action

class MyAction(Action):
    name: str = "动作名"

    async def run(self, *args, **kwargs) -> str:
        return "result"
```

`Action` 更像“岗位里的某一步标准动作”。

### Message / Memory / Team

- `Message` 负责角色之间的结构化消息传递
- `memory` 负责共享记忆
- `working_memory` 负责个体工作记忆
- `Team` 负责把多个角色组织成一个执行单元

---

## 👥 内置软件公司角色
---
emoji: 👥
link: https://docs.deepwisdom.ai/main/en/
desc: MetaGPT 的默认角色链本质上就是一个“软件公司最小组织模型”。
---

| 角色 | 职责 | 常见产物 |
|---|---|---|
| `ProductManager` | 需求分析 | 用户故事、PRD |
| `Architect` | 架构设计 | 设计文档、模块划分、API 草案 |
| `ProjectManager` | 任务拆分 | 子任务、里程碑 |
| `Engineer` | 编码实现 | 代码、实现细节 |
| `QAEngineer` | 测试验证 | 测试报告、缺陷反馈 |

这种设计的优点是稳定，缺点是如果你的任务不是“做软件”，就会显得有点重。

---

## 🛠️ 快速使用
---
emoji: 🛠️
link: https://docs.deepwisdom.ai/main/en/guide/get_started/quickstart.html
desc: MetaGPT 同时支持 CLI 用法和库用法，但真正高频的还是“给一个需求，生成完整工程产物”。
---

### CLI

```bash
metagpt "Create a 2048 game"
```

这类调用会在工作目录里生成产物仓库或工作空间。

### 作为库调用

```python
from metagpt.software_company import generate_repo
from metagpt.utils.project_repo import ProjectRepo

repo: ProjectRepo = generate_repo("Create a 2048 game")
print(repo)
```

### Data Interpreter

```python
import asyncio
from metagpt.roles.di.data_interpreter import DataInterpreter

async def main():
    di = DataInterpreter()
    await di.run("Run data analysis on sklearn Iris dataset, include a plot")

asyncio.run(main())
```

这说明 MetaGPT 不只是“软件公司模拟器”，也在扩展到更广的 agent / tool use 场景。

---

## 🔄 默认流水线
---
emoji: 🔄
link: https://docs.deepwisdom.ai/main/en/guide/get_started/introduction.html
desc: 默认链路就是把一行需求依次喂给产品、架构、项目管理、工程和测试角色。
---

```text
需求
  -> ProductManager
  -> Architect
  -> ProjectManager
  -> Engineer
  -> QAEngineer
```

这种流水线的好处是：

- 产物结构稳定
- 角色职责清晰
- 比纯对话式多 Agent 更容易复盘和审查

代价是：

- 对临时探索任务偏重
- 你需要接受 SOP 约束带来的固定感

---

## 🧠 记忆与结构化输出
---
emoji: 🧠
link: https://docs.deepwisdom.ai/main/en/guide/get_started/concepts
desc: MetaGPT 的稳定性很大程度来自记忆分层和结构化消息，不只是 prompt 写得好。
---

### 记忆层级

| 层 | 说明 |
|---|---|
| `memory` | 团队共享记忆 |
| `working_memory` | 单角色工作记忆 |

### ActionNode

`ActionNode` 用来强制结构化输出，适合：

- PRD 字段模板
- 设计文档骨架
- 测试用例格式约束
- JSON / 表格输出规范

如果你把它类比成前端里的 schema 或表单校验器，会比较好理解：不是让模型自由发挥，而是先把输出接口定下来。

---

## 🚧 当前状态判断
---
emoji: 🚧
link: https://github.com/FoundationAgents/MetaGPT
desc: 这个项目仓库活跃度、官网叙事和 PyPI 版本节奏并不完全同步，更新时必须保守处理版本口径。
---

### 这次 review 后的判断

- GitHub 主仓已是 `FoundationAgents/MetaGPT`
- README 仍持续更新，并引出 `MGX (MetaGPT X)` 等新叙事
- GitHub Releases 最新公开 tag 仍停在 `v0.8.1`
- PyPI 已有 `0.8.2`

因此这里不再沿用本地旧的 `0.10.0`，改为：

```text
0.8.2 / main (2026-05)
```

这比伪造一个“看起来更新”的版本更严谨。

---

## ⚠️ 常见坑
---
emoji: ⚠️
link: https://docs.deepwisdom.ai/main/en/guide/faq.html
desc: MetaGPT 的问题大多不是“API 不会调”，而是环境、角色边界和长流程稳定性没收好。
---

### 1. 配错配置文件路径

正确是：

```bash
~/.metagpt/config2.yaml
```

### 2. 只配 Python，不装 Node / pnpm

官方 README 已明确要求实际使用前安装它们。

### 3. 角色职责重叠

如果 `Architect` 和 `Engineer` 都在做设计决策，最后产物会互相打架。

### 4. 长任务上下文过重

多角色、多文档流水线天然容易膨胀，适合拆阶段，不适合无边界一把跑到底。

### 5. 版本信息误判

- 旧仓库地址 `geekan/MetaGPT` 已不该再作为主引用
- GitHub Release、PyPI、README 三者节奏不同，更新时必须交叉验证

---

## 📊 评分条速查

| 维度 | 评分 | 说明 |
|------|------|------|
| 软件工程表达力 | ⬛⬛⬛⬛⬛ 5/5 | SOP 化表达很强，产物链也清晰 |
| 结构化输出 | ⬛⬛⬛⬛⬜ 4/5 | Role/Action/ActionNode 组合很适合文档和工程产物 |
| 上手成本 | ⬛⬛⬛⬜⬜ 3/5 | 环境、角色链和配置文件都比轻量框架重 |
| 通用场景灵活性 | ⬛⬛⬛⬜⬜ 3/5 | 偏软件工程，不是所有 agent 场景都天然适配 |
| 版本清晰度 | ⬛⬛⬜⬜⬜ 2/5 | GitHub / PyPI / 官网节奏不完全同步，需谨慎核验 |

---

## 🔗 关键资源

- 官方文档：https://docs.deepwisdom.ai/main/en/
- GitHub：https://github.com/FoundationAgents/MetaGPT
- PyPI：https://pypi.org/project/metagpt/
- 论文：https://openreview.net/forum?id=VtmBAGCN7o
- MGX：https://mgx.dev/
