---
title: llmfit 速查表
lang: bash
version: "0.7.2"
date: 2026-03-14
github: AlexsJones/llmfit
colWidth: 420px
---

## 🧭 核心定位
---
lang: markdown
emoji: 🧭
link: https://github.com/AlexsJones/llmfit
desc: llmfit 用来回答“这台机器到底能跑什么模型”，重点是推荐、规划和本地运行时联动。
---

- 输入：本机 RAM、CPU、GPU / VRAM、运行时环境
- 输出：模型适配分数、速度估计、量化建议、上下文长度建议
- 形态：默认 TUI，也支持传统 CLI 和本地 REST API
- 适合场景：本地 LLM 选型、硬件规划、Ollama / llama.cpp / MLX 运行前评估

## 🚀 最常用命令
---
lang: bash
emoji: 🚀
link: https://github.com/AlexsJones/llmfit#usage
desc: 高频命令集中在 system、fit、recommend、plan 和 serve 这几个入口。
---

```bash
# 打开 TUI
llmfit

# 传统 CLI 列表
llmfit --cli

# 查看系统硬件
llmfit system

# 推荐最适合当前机器的模型
llmfit recommend --json --limit 5

# 查看完美匹配模型
llmfit fit --perfect -n 5

# 规划某模型需要什么硬件
llmfit plan "Qwen/Qwen3-4B-MLX-4bit" --context 8192 --json

# 作为节点级 API 服务
llmfit serve --host 0.0.0.0 --port 8787
```

## 📊 推荐、筛选与查询
---
lang: bash
emoji: 📊
link: https://github.com/AlexsJones/llmfit#cli-mode
desc: 先用 recommend 缩小范围，再用 search/info/fit 精查，是最省时间的路径。
---

```bash
# 按 use case 推荐
llmfit recommend --json --use-case coding --limit 3

# 搜索模型名 / 提供商 / 尺寸
llmfit search "llama 8b"

# 查看模型详情
llmfit info "Mistral-7B"

# 只看完美适配
llmfit fit --perfect -n 5

# 看所有模型
llmfit list
```

### 常用判断
- 先看 `recommend`：适合直接做决策
- 需要硬件边界：用 `fit`
- 需要某个具体模型细节：用 `info`
- 只是模糊找名字：用 `search`

## 🧮 硬件规划
---
lang: bash
emoji: 🧮
link: https://github.com/AlexsJones/llmfit#tui-plan-mode-p
desc: plan 模式是反向思路，不问“现在能跑什么”，而是问“想跑这个模型要补什么硬件”。
---

```bash
# 指定上下文长度
llmfit plan "Qwen/Qwen3-4B-MLX-4bit" --context 8192

# 固定量化
llmfit plan "Qwen/Qwen3-4B-MLX-4bit" --context 8192 --quant mlx-4bit

# 指定目标吞吐
llmfit plan "Qwen/Qwen3-4B-MLX-4bit" \
  --context 8192 \
  --target-tps 25 \
  --json
```

### plan 会告诉你什么
- 最低和推荐 VRAM / RAM / CPU 核数
- GPU、CPU offload、CPU-only 是否可行
- 达到目标体验还差多少硬件

## 🖥️ TUI 高频按键
---
lang: markdown
emoji: 🖥️
link: https://github.com/AlexsJones/llmfit#tui-default
desc: TUI 适合探索式比较模型，按键不多，但过滤和对比很关键。
---

- `/`：搜索模型
- `f`：切换 fit filter
- `a`：切换 availability filter
- `s`：切换排序列
- `m` / `c`：标记并进入 compare
- `p`：进入 Plan mode
- `d`：下载当前模型
- `r`：刷新已安装模型
- `t`：切换主题
- `q`：退出

## 🌐 REST API
---
lang: bash
emoji: 🌐
link: https://github.com/AlexsJones/llmfit#rest-api-llmfit-serve
desc: 当你要把 llmfit 接到调度器、节点探测器或 Agent 时，直接开 API 最方便。
---

```bash
# 启服务
llmfit serve --host 0.0.0.0 --port 8787

# 健康检查
curl http://localhost:8787/health

# 节点硬件信息
curl http://localhost:8787/api/v1/system

# 拉取可运行模型
curl "http://localhost:8787/api/v1/models?min_fit=good&limit=20"

# 取 top N 模型
curl "http://localhost:8787/api/v1/models/top?limit=5&use_case=coding"
```

### 常用查询参数
- `limit`
- `min_fit=perfect|good|marginal|too_tight`
- `runtime=any|mlx|llamacpp`
- `use_case=coding|chat|reasoning|multimodal|embedding`
- `sort=score|tps|params|mem|ctx|date|use_case`

## 🔌 本地运行时联动
---
lang: markdown
emoji: 🔌
link: https://github.com/AlexsJones/llmfit#runtime-provider-integration
desc: llmfit 不只是做理论估算，还能结合本地 provider 识别已安装模型和下载入口。
---

- `Ollama`：识别已安装模型，可直接 pull
- `llama.cpp`：做 GGUF 下载与本地缓存识别
- `MLX`：面向 Apple Silicon 模型缓存和运行
- 多 provider 可用时，TUI 下载会弹 provider picker

### 远程 Ollama
```bash
OLLAMA_HOST="http://192.168.1.100:11434" llmfit
OLLAMA_HOST="http://ollama-server:666" llmfit --cli
```

## 🧷 估算修正参数
---
lang: bash
emoji: 🧷
link: https://github.com/AlexsJones/llmfit#gpu-memory-override
desc: 当显存探测不准时，手动覆盖内存参数比盲信自动检测更靠谱。
---

```bash
# 手动覆盖 GPU 显存
llmfit --memory=24G --cli
llmfit --memory=24G recommend --json

# 限制估算上下文长度
llmfit --max-context 4096 --cli
llmfit --max-context 8192 fit --perfect -n 5
```

### 适合手动覆盖的情况
- `nvidia-smi` 不可用
- 虚拟机 / 直通环境探测不准
- Android / Termux 看不到移动 GPU

## ⚠️ 使用边界
---
lang: markdown
emoji: ⚠️
link: https://github.com/AlexsJones/llmfit#platform-support
desc: llmfit 的价值在于快速决策，但它毕竟是估算系统，不等于真实 benchmark。
---

- 推荐结果是估算，不是最终吞吐基准
- 多 GPU、MoE、统一内存场景要重点看实际 provider 行为
- Android / Termux 通常看不到移动 GPU，需要配合 `--memory`
- 如果要做自动化调度，建议用 `recommend --json` 或 `serve`，不要解析彩色 TUI 输出
