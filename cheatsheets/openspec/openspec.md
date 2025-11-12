# OpenSpec 规范驱动开发工具

## 安装初始化
```powershell
npm install -g @fission-ai/openspec@latest
openspec --version
cd project
openspec init
```

## 核心命令
- `openspec list` - 活跃变更查看
- `openspec view` - 交互式仪表盘
- `openspec show <change>` - 变更详情展示
- `openspec validate <change>` - 规范格式检查
- `openspec archive <change> [--yes]` - 变更归档

## AI工具集成
- Claude Code: `/openspec:proposal|apply|archive`
- Cursor: `/openspec-proposal|apply|archive`
- CodeBuddy: `/openspec:proposal|apply|archive`
- Qoder: `/openspec:proposal|apply|archive`

## 工作流程
1. 起草提案: AI生成变更文件夹结构
2. 验证审查: `openspec validate <change>` 检查
3. 实施任务: 按 `tasks.md` 执行实现
4. 归档更新: `openspec archive <change>` 合并规范

## 项目结构
```
openspec/
├── specs/      # 当前规范
├── changes/    # 变更提案
└── AGENTS.md   # AI指引
```

## 规范差异格式
- `## ADDED Requirements` - 新增功能
- `## MODIFIED Requirements` - 变更行为
- `## REMOVED Requirements` - 弃用功能

### 格式要求
- `### Requirement: <名称>` 标题
- `#### Scenario:` 场景块
- 需求文本使用SHALL/MUST

## 任务结构
按模块分组任务清单，使用复选框标记进度：
- 数据库设置
- 后端实现
- 前端更新

## 团队采用
1. `openspec init` 初始化
2. 从新功能开始提案
3. 逐步归档建立规范基线
4. 工具切换执行 `openspec update`

## 验证调试
- 规范验证检查格式
- 变更详情审查提案
- 仪表盘监控状态
- 重启工具加载命令

## 最佳实践
- 规范简洁明确
- 场景驱动编写
- 单一功能聚焦
- 定期归档变更
- 团队格式统一
- 版本控制跟踪