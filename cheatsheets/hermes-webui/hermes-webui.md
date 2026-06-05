---
title: Hermes WebUI 速查
lang: zh-CN
version: "master"
date: "2026-06-02"
github: nesquena/hermes-webui
colWidth: 420px
desc: Hermes WebUI 是一个轻量级 Python + 纯前端的 Hermes Agent Web 界面，支持聊天、会话、工作区浏览、语音、主题、配置、Docker 部署和远程访问。
tags:
  - Python
  - Web 前端
  - CLI / Terminal
  - 自动化工具
  - 库 / SDK
---
# Hermes WebUI 速查

## 快速定位
> 这是一个什么：给 Hermes Agent 用的轻量 Web 界面，核心是“从浏览器或手机继续使用同一个 agent”。
> 先从哪开始：看 `start.sh` / `bootstrap.py`，再看环境变量和远程访问。

| 目标 | 最短入口 | 说明 |
|---|---|---|
| 本地快速启动 | `./start.sh` | 自动发现大部分依赖与路径 |
| 一键 bootstrap | `python3 bootstrap.py` | 适合仓库首次安装 |
| 后台守护启动 | `./ctl.sh start` | 适合自托管 / VM / homelab |
| 查看状态 | `./ctl.sh status` | PID、uptime、端口、日志、/health |
| 查看日志 | `./ctl.sh logs --lines 100` | 读 `~/.hermes/webui.log` |
| 停止服务 | `./ctl.sh stop` | 停掉后台 daemon |
| 直接跑服务 | `HERMES_WEBUI_PORT=8787 venv/bin/python server.py` | 仅在你知道 Hermes 依赖已就绪时使用 |
| 健康检查 | `curl http://127.0.0.1:8787/health` | 验证服务是否可用 |

### 一句话架构
- 后端：`server.py` + `api/`，纯 Python 标准库 HTTP 服务。
- 前端：`static/`，纯 vanilla JS，不走构建链。
- 数据：会话、状态、工作区信息放在 `~/.hermes/webui` 一带的状态目录中。

## 最短启动流
### 1) 推荐路径：脚本自动发现
```bash
git clone https://github.com/nesquena/hermes-webui.git hermes-webui
cd hermes-webui
python3 bootstrap.py
# 或者
./start.sh
```

### 2) 自托管常用路径
```bash
./ctl.sh start
./ctl.sh status
./ctl.sh logs --lines 100
./ctl.sh restart
./ctl.sh stop
```

### 3) 直接启动
```bash
cd /path/to/hermes-agent
HERMES_WEBUI_PORT=8787 venv/bin/python /path/to/hermes-webui/server.py
```

## 关键能力块
### 聊天与会话
- 支持继续会话、会话搜索、会话恢复。
- 支持后台任务、工具卡片、会话分组。
- 适合在浏览器里接管 CLI 的大部分工作流。

### 工作区与文件浏览
- 可浏览 workspace 文件。
- 可做文件预览、文件操作、git 检测。
- 这部分主要由前端 `workspace.js` 和后端 `api/workspace.py` 配合。

### 语音与主题
- 支持语音输入。
- 支持主题 / skin。
- 语音引擎、麦克风与浏览器权限相关，常见问题优先看 settings。

### 认证与安全
- 支持密码认证。
- 支持签名 cookie / passkeys 等能力。
- 默认绑定 `127.0.0.1`，远程访问要显式改 host 并加密码。

## 配置与发现规则
### `start.sh` 默认会自动发现
| 项目 | 发现顺序 / 默认值 |
|---|---|
| Hermes agent 目录 | `HERMES_WEBUI_AGENT_DIR` → `$HERMES_HOME/hermes-agent` → 相邻 `../hermes-agent` |
| Python 可执行文件 | agent venv → 本仓库 `.venv` → system `python3` |
| 状态目录 | `HERMES_WEBUI_STATE_DIR` → `$HERMES_HOME/webui` |
| 默认工作区 | `HERMES_WEBUI_DEFAULT_WORKSPACE` → `~/workspace` → 状态目录 |
| 端口 | `HERMES_WEBUI_PORT` → 命令行参数 → `8787` |

### 常用覆盖项
```bash
export HERMES_WEBUI_AGENT_DIR=/path/to/hermes-agent
export HERMES_WEBUI_PYTHON=/path/to/python
export HERMES_WEBUI_PORT=9000
export HERMES_WEBUI_HOST=0.0.0.0
export HERMES_WEBUI_PASSWORD='your-password'
./start.sh
```

### 关键环境变量
| 变量 | 默认值 | 作用 |
|---|---|---|
| `HERMES_WEBUI_AGENT_DIR` | auto-discovered | Hermes Agent checkout 路径 |
| `HERMES_WEBUI_PYTHON` | auto-discovered | Python 可执行文件 |
| `HERMES_WEBUI_HOST` | `127.0.0.1` | 监听地址 |
| `HERMES_WEBUI_PORT` | `8787` | WebUI 端口 |
| `HERMES_WEBUI_STATE_DIR` | `$HERMES_HOME/webui` | 会话和状态存储 |
| `HERMES_WEBUI_DEFAULT_WORKSPACE` | `~/workspace` | 默认工作区 |
| `HERMES_WEBUI_DEFAULT_MODEL` | provider default | 可选模型覆盖 |
| `HERMES_WEBUI_PASSWORD` | unset | 开启密码认证 |
| `HERMES_WEBUI_CSP_CONNECT_EXTRA` | unset | 额外允许的 connect-src origins |
| `HERMES_WEBUI_EXTENSION_DIR` | unset | 扩展目录 |
| `HERMES_HOME` | `~/.hermes` | Hermes 基础状态目录 |
| `HERMES_CONFIG_PATH` | `$HERMES_HOME/config.yaml` | Hermes 配置文件 |

## Docker
### 快速判断用哪种部署
| 场景 | 推荐方式 |
|---|---|
| 本机 / 开发调试 | `start.sh` / `bootstrap.py` |
| 自托管 VM | `ctl.sh` |
| 需要隔离依赖 | Docker / Compose |
| 想看完整容器指南 | `docs/docker.md` |

### Docker 速记
- 官方提供预构建镜像（amd64 + arm64）。
- README 里把 Docker 细节拆到 `docs/docker.md`，这里只保留 happy path。
- 默认 compose 绑定 `127.0.0.1`，对外访问需要改 host / 端口并配置密码。

## 远程访问
### 常见方式
| 方式 | 场景 | 关键点 |
|---|---|---|
| SSH tunnel | 临时远程访问 | `ssh -N -L 8787:127.0.0.1:8787 user@host` |
| Tailscale | 手机 / 多设备 | `HERMES_WEBUI_HOST=0.0.0.0` + `HERMES_WEBUI_PASSWORD` |
| 直接公网监听 | 不推荐 | 要特别注意认证与暴露面 |

### 记住这条
- 默认只绑定 `127.0.0.1`。
- 想让别的机器访问，必须显式改 `HERMES_WEBUI_HOST`。
- 没密码不要裸露到公网。

## 测试与验收
### 运行测试
```bash
cd hermes-webui
pytest tests/ -v --timeout=60
```

### 验收重点
- 服务能启动。
- `/health` 返回正常。
- 远程访问路径正确。
- 运行环境能找到 Hermes Agent 目录和 Python 解释器。

## 常见故障
### 启动失败 / 找不到路径
- `HERMES_WEBUI_AGENT_DIR` 没找到。
- Python 不是 agent 依赖所在的 venv。
- `HERMES_HOME` 指向不对，导致状态目录错位。

### Docker / 权限问题
| 症状 | 常见原因 | 优先修法 |
|---|---|---|
| `PermissionError` at startup | UID mismatch | `.env` 里设 `UID=$(id -u)` |
| `.env: permission denied` | 0600 权限校验 | `HERMES_SKIP_CHMOD=1` |
| workspace 为空 | 挂载 UID 不匹配 | 检查 volume 与 UID |
| 宿主机 localhost 访问失败 | 容器内 localhost 指向容器自身 | 改用 `host.docker.internal` / `host.containers.internal` |
| `git: command not found` | 两容器方案限制 | 改单容器或扩展镜像 |

### 判断优先级
1. 先看 `./ctl.sh status`。
2. 再看 `./ctl.sh logs --lines 100`。
3. 再看 `/health`。
4. 最后才去怀疑前端或浏览器。

## 你要记住的最小集合
- `./start.sh` 是最短启动入口。
- `./ctl.sh start/status/logs` 是自托管日常操作入口。
- `start.sh` 会自动发现大多数路径和依赖。
- 默认只监听本机；远程访问必须显式放开 host 并加密码。
- 真正的服务核心是 Python `server.py` + `api/`，前端只是纯 JS 壳。
