---
title: hermes-android 速查表
lang: bash
version: "0.1.0"
date: "2026-05-28"
github: raulvidis/hermes-android
colWidth: 360px
desc: 给 Hermes Agent 装上"手机之手"——38 个工具远程控制 Android 设备
tags:
  - AI / LLM
  - AI 辅助工具
  - 自动化工具
  - CLI 工具
  - Python
  - 终端工具
---

# hermes-android 速查表

> 给 AI Agent 装上一双"手机之手"——远程控制 Android 设备，无需 NAT 穿透 / VPN / USB

## 工作原理

```
手机（WiFi） ──WebSocket──▶ Hermes Server（云端中继:8766） ◀──HTTP── AI Agent
★ 手机主动连出 → 无需端口映射 / VPN / USB
★ 6 位配对码配对
```

## 核心工具速查

### 连接管理
| 工具 | 说明 |
|------|------|
| `android_setup` | 启动 relay + 配置配对码 |
| `android_ping` | 检测手机连接状态 |

### 基础操控
| 工具 | 说明 |
|------|------|
| `android_tap` | 按坐标或 node ID 点击 |
| `android_tap_text` | 按可见文字匹配点击 |
| `android_type` | 向聚焦输入框输入文字 |
| `android_swipe` | 上/下/左/右滑动 |
| `android_scroll` | 滚动屏幕或元素 |
| `android_long_press` | 长按坐标或 node ID |
| `android_drag` | 从 A 点拖到 B 点 |
| `android_pinch` | 双指缩放 |

### 屏幕 / UI 读取
| 工具 | 说明 |
|------|------|
| `android_screenshot` | 截图发送给用户 |
| `android_read_screen` | 获取当前 accessibility UI 树 |
| `android_screen_hash` | 当前屏幕 hash（变化检测） |
| `android_diff_screen` | 对比当前 vs 历史 hash |
| `android_find_nodes` | 搜索 UI 节点（text/class） |
| `android_describe_node` | 节点详细信息 |

### 应用管理
| 工具 | 说明 |
|------|------|
| `android_get_apps` | 列出已安装应用 |
| `android_open_app` | 按包名启动应用 |
| `android_current_app` | 获取前台应用信息 |
| `android_press_key` | 按系统键（返回/主页/最近） |

### 通信 / 设备
| 工具 | 说明 |
|------|------|
| `android_send_sms` | 发送短信 |
| `android_call` | 直接拨打电话 |
| `android_search_contacts` | 按姓名搜索通讯录 |
| `android_location` | 获取 GPS 位置 |
| `android_notifications` | 读取通知栏 |
| `android_events` | 读取最近 accessibility 事件 |
| `android_event_stream` | 实时流事件 |

### 系统工具
| 工具 | 说明 |
|------|------|
| `android_clipboard_read/write` | 读写剪贴板 |
| `android_media` | 控制媒体（播放/暂停/切歌） |
| `android_speak / stop` | 文字转语音输出 |
| `android_screen_record` | 录制屏幕视频 |
| `android_send_intent` | 发送 Android Intent |
| `android_broadcast` | 发送广播 Intent |
| `android_read_widgets` | 读取桌面小组件 |
| `android_wait` | 等待元素出现 |

## 安装步骤

### 1. 安装 Android App
```bash
cd hermes-android-bridge
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

### 2. 手机授权
- **无障碍服务**：设置 → 无障碍 → Hermes Bridge → 开启
- **悬浮窗**：设置 → 应用 → 悬浮窗 → Hermes Bridge → 开启
- **录屏权限**：App 内批准系统弹窗（`android_screen_record` 必需）
- **短信/通话/通讯录/位置**：Settings > Apps > Hermes Bridge > 权限

### 3. 连接 Hermes
```
通过 Telegram/Discord 发送：
Connect to my phone, code is <CODE>

（CODE 为 App 显示的 6 位配对码）
```

### 4. 安装为插件（v0.3.0+）
```bash
curl -sSL https://raw.githubusercontent.com/raulvidis/hermes-android/main/install.sh | bash
```

## 仓库结构

| 组件 | 路径 | 语言 | 用途 |
|------|------|------|------|
| Android 桥接 App | `hermes-android-bridge/` | Kotlin | AccessibilityService + WebSocket |
| Python 工具集 | `tools/`, `tests/` | Python | 38 工具 + relay；生产版在 hermes-agent 仓库 |

## 安全设计

- 配对码 + 速率限制（5次/60秒，失败封禁5分钟）
- 手机主动连出（端口永不暴露）
- ⚠️ 当前未加密（`ws://`），生产建议 TLS 代理
- 配对后完整设备权限 → 只连接可信服务器

## Android Automotive OS（车机）

- 支持 AAOS 车机（无短信/通话/通讯录）
- 连接方式：USB 直连 或 WiFi
- 基础操控（tap/scroll/screenshot）等正常

## 版本路线图

| 版本 | 目标 |
|------|------|
| v0.2 | TLS/WSS 加密、持久 relay、防循环 |
| v0.3 ✅ | 通知监听、剪贴板桥接、文件传输 |
| v0.4 | 多设备、计划自动化、宏录制 |
| v0.5 | 语音助手、接听电话 |
| v0.6 | 本地小模型（Qwen 0.5B/Gemma 2B）离线降级 |

## 关联项目

- [hermes-agent](https://github.com/NousResearch/hermes-agent) — 服务端 Python 工具集生产副本