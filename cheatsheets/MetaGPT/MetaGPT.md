---
title:MetaGPT 速查表
lang:python
version: "0.10.0"
date: 2026-05-25
github: geekan/MetaGPT
colWidth: 460px
---

## 🚀 安装与入口
---
emoji: 🚀
link: https://docs.deepwisdom.ai/main/
desc: MetaGPT 是一个将 SOP 编码进 prompt 的 multi-agent 软件开发框架，输入一行需求，输出完整软件工程产出物。
---

### 安装

```bash
pip install metagpt                    # 核心包
pip install metagpt[tools]            # 含工具集
# 或
conda install metagpt -c conda-forge
```

### 环境配置

```bash
export OPENAI_API_KEY=your_key_here
export OPENAI_API_MODEL=gpt-4         # 可选，默认 gpt-4
# 或配置文件 ~/.metagpt/config.yml
```

---

## 💡 核心理念：Code = SOP(Team)
---
emoji: 💡
link: https://arxiv.org/abs/2308.00352
desc: 把真实软件公司的标准化操作程序（SOP）编码进 prompt，用装配线模式让多个 Agent 像真实团队一样协作。
---

### 与 CrewAI 的核心区别

| 维度 | CrewAI | MetaGPT |
|------|--------|---------|
| 人格定义 | role + goal + backstory | profile + goal + constraints（职位标准化） |
| 输出风格 | 自由文本 | 强制结构化文档（JSON/PRD/代码） |
| 协作模式 | Agent 自由协商 | 装配线模式，强制顺序依赖 |
| 人格稳定性 | 靠 backstory 驱动，可能漂移 | 靠 SOP 强制约束，极稳定 |
| 适用场景 | 灵活探索 | 标准化质量流程 |

---

## 🏗️ 核心组件
---
emoji: 🏗️
link: https://docs.deepwisdom.ai/main/en/guide/get_started/introduction
desc: MetaGPT 的核心组件：Role（角色）、Action（动作）、Memory（记忆）、Message（消息队列）。
---

### Role：职位人格定义

```python
from metagpt.roles import Role
from metagpt.actions import Action

class MyRole(Role):
    name: str = "角色名"        # Agent 名称
    profile: str = "职位"      # 角色类型，如 ProductManager
    goal: str = "目标"         # 主要目标
    constraints: str = "约束"  # 操作约束

    async def _observe(self) -> None:
        # 观察环境消息
        ...

    async def _think(self) -> None:
        # 决策下一步 Action
        ...

    async def _act(self) -> None:
        # 执行当前 Action
        ...
```

### 内置角色（开箱即用）

| 角色 | 职责 | 输出 |
|------|------|------|
| **ProductManager** | 需求分析 → 写 PRD | 用户故事、需求文档 |
| **Architect** | 系统设计 → 输出架构图 | 数据结构、API 设计 |
| **ProjectManager** | 任务拆分 → 分配任务 | 任务列表、工单 |
| **Engineer** | 编写代码 → 实现功能 | 可运行代码 |
| **QAEngineer** | 测试 → 缺陷报告 | 测试用例、问题列表 |

### Action：动作模块

```python
from metagpt.actions import Action

class MyAction(Action):
    name: str = "动作名"
    async def run(self, *args, **kwargs) -> str:
        # 业务逻辑
        return result
```

### 内置 Action

```python
from metagpt.actions import (
    WritePRD,         # 写需求文档
    WriteDesign,      # 写设计文档
    WriteCode,        # 写代码
    WriteReview,      # 代码审查
    WriteTest,        # 写测试用例
)
```

---

## 📋 SOP 装配线：从需求到代码
---
emoji: 📋
link: https://arxiv.org/abs/2308.00352
desc: MetaGPT 的核心流程：一行需求 → PRD → 架构设计 → 任务拆分 → 代码 → 测试。
---

### 默认流水线

```
用户输入（一行需求）
    ↓
ProductManager  →  写 PRD（用户故事、竞品分析）
    ↓
Architect      →  系统设计（数据结构、API、模块划分）
    ↓
ProjectManager →  任务拆分（子任务分配给 Engineer）
    ↓
Engineer       →  编写代码（各自实现模块）
    ↓
QAEngineer     →  测试验证（生成测试用例、发现缺陷）
```

### 触发方式

```python
import asyncio
from metagpt.roles import ProductManager, Architect, Engineer
from metagpt.const import MAX_TOKENS

async def main():
    idea = "开发一个电商平台的商品推荐系统"

    # 方式一：调用内置角色链
    await ProductManager().run(idea)
    await Architect().run()
    await Engineer().run()

    # 方式二：自定义角色链
    team = Team()
    team.hire([ProductManager(), Architect(), Engineer()])
    team.run_project(idea)

asyncio.run(main())
```

### 最小示例

```python
import asyncio
from metagpt.roles import ProductManager, Architect, Engineer

async def main():
    result = await ProductManager().run(
        "做一个Todo列表应用"
    )
    print(result)

asyncio.run(main())
```

---

## 🧠 Memory：双层记忆架构
---
emoji: 🧠
link: https://docs.deepwisdom.ai/main/en/guide/tutorials/galaxy_archive
desc: MetaGPT 使用 memory（团队共享）+ working_memory（个体工作）双层结构。
---

### 记忆层级

| 层 | 类型 | 说明 |
|----|------|------|
| **memory** | 团队共享记忆 | 所有 Agent 可访问的消息历史 |
| **working_memory** | 个体工作记忆 | 当前 Agent 的状态和待处理任务 |

### 记忆操作

```python
class MyRole(Role):
    async def _observe(self):
        """观察并更新记忆"""
        self.memory.add(message)      # 添加消息
        self.working_memory.add(task) # 添加工作任务

    def recall(self, query: str) -> list:
        """检索记忆"""
        return self.memory.search(query)
```

---

## 💬 Message：结构化消息传递
---
emoji: 💬
link: https://docs.deepwisdom.ai/main/en/guide/get_started/concepts
desc: Agent 之间通过 MessageQueue 结构化传递消息，强制格式减少幻觉。
---

### 消息格式

```python
from metagpt.schema import Message

msg = Message(
    content="需求文档已完成，详见 PRD.md",
    role="assistant",
    cause_by=WritePRD,          # 由哪个 Action 产生
    sent_from="Alice",         # 发送者
    send_to=["Bob", "Charlie"] # 接收者列表
)
```

### 消息队列

```python
class Role:
    msg_buffer: MessageQueue  # 消息缓冲区

    async def _observe(self):
        """从队列中获取新消息"""
        new_messages = self.msg_buffer.get_new()

    def _send(self, msg: Message):
        """发送消息给其他 Agent"""
        self.msg_buffer.put(msg)
```

---

## 🎯 ActionNode：结构化输出模板
---
emoji: 🎯
link: https://docs.deepwisdom.ai/main/en/guide/tutorials/galaxy_archive
desc: ActionNode 强制 Agent 输出 JSON 结构化数据，减少自由文本的幻觉。
---

### 定义 ActionNode

```python
from metagpt.actions.action_node import ActionNode

STRUCT_WRITE = ActionNode(
    key="小说结构",
    expected_type=str,
    instruction="""
    按以下结构输出小说基本信息：
    标题: ...
    主角: ...
    设定: ...
    冲突: ...
    """,
    example="标题: xxx\n主角: xxx\n..."
)

result = await STRUCT_WRITE.run(context="科幻题材")
print(result)  # 结构化 JSON 输出
```

### 使用场景

- PRD 模板强制字段
- 代码审查清单
- 测试用例结构
- 任何需要强制格式的场景

---

## 🔧 自定义扩展
---
emoji: 🔧
link: https://docs.deepwisdom.ai/main/en/guide/advanced_tutorials/customized_actions
desc: 通过继承 Role 和 Action 基类，可以构建领域专家系统。
---

### 自定义 Role 模板

```python
from metagpt.roles import Role
from metagpt.actions import Action

class MedicalDoctor(Role):
    name: str = "MedicalDoctor"
    profile: str = "医疗诊断专家"
    goal: str = "提供准确的医疗诊断建议"
    constraints: str = "遵守医疗伦理，只提供参考信息"

    async def _think(self):
        # 决策逻辑
        ...

    async def _act(self):
        # 诊断动作
        ...
```

### 自定义 Action

```python
class DiagnoseAction(Action):
    name: str = "医疗诊断"

    async def run(self, symptoms: str, history: str) -> str:
        # 诊断逻辑
        return diagnosis_result
```

### 领域 SOP 示例

```python
# 医疗领域 SOP
class MedicalTeam(Team):
    def __init__(self):
        self.hire([
            MedicalDoctor(),    # 诊断
            Pharmacist(),       # 开药
            Nurse(),           # 护理
        ])
        self.setup_sop([
            "收集症状",
            "初步诊断",
            "开药建议",
            "护理计划"
        ])
```

---

## ⚠️ 常见陷阱
---
emoji: ⚠️
link: https://docs.deepwisordom.ai/main/en/guide/get_started/faq
desc: MetaGPT 开发中的高频踩坑点。
---

### 1. 缺少 OPENAI_API_KEY

```bash
# ❌ 直接运行报错
python main.py

# ✅ 先配置环境变量
export OPENAI_API_KEY=sk-xxxx
python main.py
```

### 2. 消息循环死锁

```python
# ❌ Agent 互相等待对方消息，形成死锁
# 解决：设置消息超时，手动终止长时间等待

role.set_timeout(seconds=300)
```

### 3. 输出格式不稳定

```python
# ❌ 缺少 ActionNode 约束，输出格式乱
# 解决：使用 ActionNode 强制 JSON 结构

design_node = ActionNode(
    key="系统设计",
    expected_type=str,
    instruction="输出 JSON：{\"模块\":[], \"接口\":[]}"
)
```

### 4. 长任务上下文截断

```python
# 解决：设置 MAX_TOKENS，或分阶段处理
from metagpt.const import MAX_TOKENS
MAX_TOKENS = 32000  # 增大上下文窗口
```

### 5. 角色职责重叠

```python
# ❌ 两个角色做同样的事
# 解决：明确 constraints，每个角色只做一件事

architect = Architect(constraints="只做系统设计，不写代码")
engineer = Engineer(constraints="只写代码，不做设计")
```

---

## 📊 评分条速查

| 维度 | 评分 | 说明 |
|------|------|------|
| 上手难度 | ⬛⬛⬛⬜⬜ 3/5 | 概念清晰，跟着 SOP 走就行 |
| 人格稳定性 | ⬛⬛⬛⬛⬜ 4/5 | SOP 强制约束，不会漂移 |
| 输出结构化 | ⬛⬛⬛⬛⬛ 5/5 | 强制 JSON/文档，减少幻觉 |
| 软件工程 | ⬛⬛⬛⬛⬛ 5/5 | 开箱即用的完整开发流程 |
| 灵活性 | ⬛⬛⬛⬜⬜ 3/5 | 主要针对软件工程，其他场景弱 |

---

## 🔗 关键资源

- 官方文档：https://docs.deepwisdom.ai/main/en/
- GitHub：https://github.com/geekan/MetaGPT
- 论文：arXiv:2308.00352