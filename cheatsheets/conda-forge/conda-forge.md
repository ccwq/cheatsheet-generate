# Conda-Forge 社区包管理指南

## 🔄 迁移到 conda-forge 的注意事项

### 首要原则
- 设置 conda-forge 为最高且严格优先级
- 避免与其他渠道混用以减少 ABI 不兼容风险
- 迁移时新建环境重建而非就地切换

### 一键配置（推荐）
```bash
conda config --add channels conda-forge
conda config --set channel_priority strict
```

### 开箱即用方案
- 使用 Miniforge 或 Mambaforge
- 预置 conda-forge 为默认源
- 内置更快的 mamba 求解器

### 避免混用场景
- 与 defaults 混用：导致动态库缺失（ImportError: Library not loaded）
- 就地切换渠道：二进制库冲突风险
- 跨渠道混装 GPU 栈：依赖错配问题

### 安全迁移流程
1. 列出当前环境：`conda list`
2. 创建新环境：`conda create -n newenv python=3.11`
3. 从 conda-forge 安装包：`conda install numpy pandas`
4. 测试验证功能
5. 弃用旧环境

### 严格优先级优势
- 确保解析器优先选择 conda-forge 生态内统一固定包
- 显著降低依赖冲突概率
- 避免二进制 ABI 不匹配
- 提高环境复现性

### 性能优化
- 使用 mamba：`conda install mamba -c conda-forge`（比 conda 快 5-10 倍）
- 启用并行下载：`conda config --set download_threads 8`
- 启用索引缓存：`conda config --set use_index_cache true`

### 与 pip 协作
- 优先使用 conda 安装 conda-forge 中可找到的包
- 仅对生态外的包使用 pip
- 避免 pip 升级 conda 管理的依赖
- 将 pip 步骤作为环境配置最后一步

## 基础配置
- 确保conda版本 >=4.9
- 添加conda-forge频道：`conda config --add channels conda-forge`
- 启用严格频道优先：`conda config --set channel_priority strict`
- 关闭base自动激活：`conda config --set auto_activate_base false`

### 国内镜像配置

#### 清华 TUNA 镜像
```yaml
channels:
  - conda-forge
show_channel_urls: true
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

#### 中科大 USTC 镜像
```yaml
channels:
  - conda-forge
show_channel_urls: true
custom_channels:
  conda-forge: https://mirrors.ustc.edu.cn/anaconda/cloud
```

### 一次性指定镜像（无需全局配置）
```bash
# 使用清华 TUNA 镜像单次安装
conda install requests -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/

# 使用南科大 SUSTech 镜像创建环境
mamba create -n ds-env python=3.9 -c https://mirrors.sustech.edu.cn/anaconda/pkgs/main/ -y
```

### Miniforge 安装器获取
- 官方GitHub：https://github.com/conda-forge/miniforge
- 南大NJU镜像：https://mirror.nju.edu.cn/help/miniforge
- 清华TUNA镜像：https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/

### 使用建议
- 推荐使用Miniforge/Mambaforge，预置conda-forge
- 避免通过Homebrew安装Miniforge，建议直接使用安装器
- 优先使用mamba进行安装以提升速度

## 环境管理
- 创建环境：`conda create --name envname python=3.9`
- 激活环境：`conda activate envname`
- 退出环境：`conda deactivate`
- 列出环境：`conda env list`
- 删除环境：`conda env remove --name envname`
- 导出环境：`conda env export > environment.yml`

## 包操作
- 安装包：`conda install packagename`
- 指定版本：`conda install packagename=1.2.3`
- 更新包：`conda update packagename`
- 搜索包：`conda search packagename`
- 列出包：`conda list`
- 删除包：`conda remove packagename`

## 性能优化
- 使用mamba加速：`conda install mamba -c conda-forge`，然后用`mamba install`
- 启用并行下载：`conda config --set download_threads 8`
- 启用缓存：`conda config --set use_index_cache true`

## 贡献新包流程
1. 生成配方：
   - Python包：`grayskull pypi --strict-conda-forge pkgname`
   - R包：使用conda_r_skeleton_helper工具
   - 其他：参考staged-recipes示例
2. 提交到staged-recipes仓库
3. 等待审查和合并
4. 自动生成feedstock仓库

## 维护包指南
- 包不可变原则：已发布包不能修改删除
- 更新包：等待机器人PR或手动创建
- 使用fork方式提交更新，避免直接分支
- 标记损坏包：在meta.yaml中设置broken: true

## 常见问题解决
- 包冲突：检查channel_priority设置
- 安装慢：改用mamba
- 找不到包：考虑贡献新包
- 版本过旧：联系维护者或自行维护

## HPC环境MPI配置
- 安装外部MPI：`conda install "mpich=*=external_*"`
- 设置环境变量指向系统MPI路径
- 验证：`mpirun --version`

## 获取帮助
- Zulip聊天室：conda-forge.zulipchat.com
- GitHub Issues：在对应feedstock仓库提交
- 搜索包：anaconda.org/conda-forge

## 最佳实践
- 每个项目独立环境
- 优先conda-forge而非pip
- 定期更新包
- 参与社区贡献从小处开始