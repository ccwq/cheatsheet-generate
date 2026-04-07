# GSD 2 参考地图

## 官方资源

- [GSD 2 GitHub 仓库](https://github.com/gsd-build/gsd-2)
- [GSD 2 官方文档 (Mintlify)](https://gsd.build)
- [Pi SDK — GSD 底层 Agent 框架](https://github.com/badlogic/pi-mono)
- [npm 包: gsd-pi](https://www.npmjs.com/package/gsd-pi)
- [Discord 社区](https://discord.com/invite/nKXTsAcmbT)
- [Agent Skills 标准](https://agentskills.io/)

## 核心文档

### 入门与基础

| 文档 | 说明 |
|------|------|
| [Getting Started](./docs/getting-started.md) | 安装、首次运行、基础使用 |
| [Commands Reference](./docs/commands.md) | 所有命令和快捷键完整参考 |
| [Configuration](./docs/configuration.md) | PREFERENCES.md 配置详解 |
| [Auto Mode](./docs/auto-mode.md) | 自主执行引擎详解 |
| [Migration from v1](./docs/migration.md) | 从 .planning 迁移到 .gsd |

### Git 与工作流

| 文档 | 说明 |
|------|------|
| [Git Strategy](./docs/git-strategy.md) | 工作树隔离、分支策略、提交格式 |
| [Parallel Orchestration](./docs/parallel-orchestration.md) | 多里程碑并行编排 |
| [ADR-001 Branchless Worktree](./docs/ADR-001-branchless-worktree-architecture.md) | 无分支工作树架构设计 |

### 模型与成本

| 文档 | 说明 |
|------|------|
| [Custom Models](./docs/custom-models.md) | Ollama/vLLM/LM Studio 等自定义模型 |
| [Dynamic Model Routing](./docs/dynamic-model-routing.md) | 基于能力的动态模型路由 |
| [Token Optimization](./docs/token-optimization.md) | Token 配置文件、上下文压缩 |
| [Cost Management](./docs/cost-management.md) | 预算上限、成本追踪、预测 |
| [ADR-004 Capability Routing](./docs/ADR-004-capability-aware-model-routing.md) | 能力感知路由 ADR |

### 高级功能

| 文档 | 说明 |
|------|------|
| [Skills](./docs/skills.md) | 技能包安装、发现、生命周期管理 |
| [CI/CD Pipeline](./docs/ci-cd-pipeline.md) | Dev → Test → Prod 三阶段流水线 |
| [Web Interface](./docs/web-interface.md) | 浏览器界面使用 |
| [VS Code Extension](./vscode-extension/README.md) | VS Code 扩展 |
| [Troubleshooting](./docs/troubleshooting.md) | 常见问题与解决方案 |

## 技能包 (Skill Packs)

### iOS/Swift

| 技能包 | 说明 |
|--------|------|
| SwiftUI | 布局、导航、动画、手势、Liquid Glass |
| Swift Core | Swift 语言、并发、Codable、Charts、Testing、SwiftData |
| iOS App Frameworks | App Intents、Widgets、StoreKit、MapKit、Live Activities |
| iOS Data Frameworks | CloudKit、HealthKit、MusicKit、WeatherKit |
| iOS AI & ML | Core ML、Vision、on-device AI、语音识别 |

### Web/Frontend

| 技能包 | 说明 |
|--------|------|
| React & Web Frontend | React 最佳实践、Web 设计、组合模式 |
| React Native | 跨平台移动端模式 |

### 后端/语言

| 技能包 | 说明 |
|--------|------|
| Rust | Rust 模式和最佳实践 |
| Python | Python 模式和最佳实践 |
| Go | Go 模式和最佳实践 |
| Document Handling | PDF、DOCX、XLSX、PPTX 创建和操作 |

## 架构决策记录 (ADR)

| ADR | 说明 |
|-----|------|
| ADR-001 | 无分支工作树架构 |
| ADR-003 | 流水线简化（研究合并到规划） |
| ADR-004 | 能力感知模型路由 |
| ADR-007 | 模型目录拆分 |
