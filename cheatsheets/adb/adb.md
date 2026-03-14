---
title: adb 速查
lang: bash
version: "Platform-Tools 36.0.2"
date: 2026-03-06
github: unknown
colWidth: 380px
---

# adb 速查

## 🧭 连接、多设备与服务器
---
lang: bash
emoji: 🧭
link: https://developer.android.com/studio/command-line/adb
desc: 日常先解决“连到哪台设备”这个问题；多设备场景优先用 `-s` 或 `ANDROID_SERIAL` 固定目标。
---

- `adb devices -l` : 列出设备和详细信息
- `adb -s <serial> shell` : 指定设备执行命令
- `adb start-server` : 启动服务端
- `adb kill-server` : 停止服务端
- `adb reconnect` : 重新连接设备
- `adb wait-for-device` : 阻塞直到设备上线
- `ANDROID_SERIAL=<serial>` : 固定默认设备

```bash
# 查看序列号、型号、传输类型
adb devices -l

# 指定设备执行
adb -s emulator-5554 shell getprop ro.product.model

# 服务异常时重启
adb kill-server
adb start-server
```

## 📡 无线调试
---
lang: bash
emoji: 📡
link: https://developer.android.com/studio/command-line/adb#wireless
desc: Android 11+ 推荐配对模式；老设备仍可走 `tcpip` 方案，但安全性和稳定性都更差。
---

- `adb pair <host>:<pair-port>` : 使用配对码建立信任
- `adb connect <host>:<port>` : 连接已配对设备
- `adb mdns services` : 枚举局域网可发现服务
- `adb disconnect` : 断开全部网络连接
- `adb tcpip 5555` : 旧式无线调试，需先 USB 连接

```bash
# Android 11+：配对码模式
adb pair 192.168.1.23:37099
adb connect 192.168.1.23:43817

# 旧式模式：先用 USB 执行
adb tcpip 5555
adb connect 192.168.1.23:5555
```

### 排查点
- 配对端口和连接端口不是同一个
- 切 Wi-Fi、切热点后 IP 会变化
- 公司网络可能屏蔽 mDNS 或局域网直连

## 📦 安装、卸载与包管理
---
lang: bash
emoji: 📦
link: https://developer.android.com/studio/command-line/adb#copy-tofrom-device
desc: 安装失败优先看 ABI、签名、版本降级和存储空间，应用排查多从 `pm` 开始。
---

- `adb install app.apk` : 安装 APK
- `adb install -r app.apk` : 覆盖安装
- `adb install -d app.apk` : 允许降级安装 debug 包
- `adb install-multiple base.apk split_config.arm64_v8a.apk` : 安装 split APK
- `adb uninstall <package>` : 卸载应用
- `adb shell pm list packages -3` : 仅第三方应用
- `adb shell pm path <package>` : 查看 APK 路径
- `adb shell pm clear <package>` : 清空数据
- `adb shell pm grant <package> <permission>` : 授权运行时权限

```bash
# 覆盖安装并保留数据
adb install -r app-debug.apk

# 查包名和 APK 路径
adb shell pm list packages example
adb shell pm path com.example.app

# 清数据后重启应用
adb shell pm clear com.example.app
adb shell monkey -p com.example.app -c android.intent.category.LAUNCHER 1
```

## 🐚 Shell、输入与 UI 操作
---
lang: bash
emoji: 🐚
link: https://developer.android.com/studio/command-line/adb#shellcommands
desc: `adb shell` 是排障入口；输入命令适合做简单 UI 自动化和复现场景。
---

- `adb shell` : 进入交互 shell
- `adb shell getprop` : 读取系统属性
- `adb shell settings get global airplane_mode_on` : 读系统设置
- `adb shell input text 'hello'` : 模拟文本输入
- `adb shell input keyevent 3` : HOME 键
- `adb shell input tap 540 1800` : 模拟点击
- `adb shell input swipe 540 1800 540 300 300` : 模拟滑动
- `adb shell screencap -p /sdcard/screen.png` : 截图到设备

```bash
# 取前台 Activity
adb shell dumpsys activity activities | grep mResumedActivity

# 常用按键
adb shell input keyevent 4   # BACK
adb shell input keyevent 26  # POWER
adb shell input keyevent 82  # MENU
```

## 🚀 Activity、Service、Broadcast
---
lang: bash
emoji: 🚀
link: https://developer.android.com/studio/command-line/adb#am
desc: `am` 负责组件调起，`cmd activity` 和 `dumpsys activity` 负责排查当前状态。
---

- `adb shell am start -n <pkg>/<activity>` : 显式启动 Activity
- `adb shell am start -a android.intent.action.VIEW -d <url>` : 拉起深链
- `adb shell am force-stop <package>` : 强停应用
- `adb shell am broadcast -a <action>` : 发广播
- `adb shell am startservice -n <pkg>/<service>` : 启动前台外服务
- `adb shell cmd package resolve-activity --brief <package>` : 看默认入口

```bash
# 显式拉起启动页
adb shell am start -n com.example.app/.MainActivity

# 发送自定义广播
adb shell am broadcast \
  -a com.example.app.ACTION_SYNC \
  --es source adb
```

## 📁 文件传输与端口转发
---
lang: bash
emoji: 📁
link: https://developer.android.com/studio/command-line/adb#copy-tofrom-device
desc: 文件问题用 `push/pull`，本地调试桥接用 `forward/reverse`，WebView 和本地服务调试很常用。
---

- `adb push <local> <remote>` : 上传文件
- `adb pull <remote> [local]` : 下载文件
- `adb sync` : 同步 `out/` 到设备分区
- `adb forward tcp:8700 jdwp:<pid>` : 转发到 JDWP
- `adb forward tcp:8081 tcp:8081` : 本地到设备
- `adb reverse tcp:8081 tcp:8081` : 设备到本地
- `adb forward --list` : 查看已建立转发

```bash
# 下载沙盒外文件
adb pull /sdcard/Download/log.txt .

# React Native / 本地 API 调试
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000
```

## 🪵 日志、崩溃与 bugreport
---
lang: bash
emoji: 🪵
link: https://developer.android.com/studio/debug/logcat
desc: 日志要先缩小范围；崩溃排查一般从 `logcat`、`tombstones`、`bugreport` 三层逐步深入。
---

- `adb logcat` : 实时日志
- `adb logcat -c` : 清空缓冲区
- `adb logcat -v threadtime` : 带线程和时间戳
- `adb logcat -s ActivityManager MyTag` : 按 tag 过滤
- `adb shell pidof <package>` : 查进程 PID
- `adb bugreport` : 导出完整问题报告
- `adb shell ls /data/tombstones` : 查看 native 崩溃 tombstone

```bash
# 只看单个进程日志
PID=$(adb shell pidof -s com.example.app)
adb logcat --pid "$PID" -v color

# 导出问题报告到当前目录
adb bugreport bugreport.zip
```

## 📺 屏幕录制、抓图与性能
---
lang: bash
emoji: 📺
link: https://developer.android.com/studio/debug/screenrecord
desc: 录屏、截图、gfxinfo、meminfo 和 top 是轻量级现场取证组合，先用它们再决定是否上 Profiler。
---

- `adb shell screencap -p /sdcard/screen.png` : 截图
- `adb shell screenrecord /sdcard/demo.mp4` : 录屏
- `adb shell screenrecord --time-limit 180` : 最长 180 秒
- `adb shell dumpsys meminfo <package>` : 内存概览
- `adb shell dumpsys gfxinfo <package>` : 渲染统计
- `adb shell top -o RES,%CPU,ARGS -n 1` : 资源占用
- `adb shell dumpsys battery` : 电池状态

```bash
# 录屏后拉回本地
adb shell screenrecord --bit-rate 8m --time-limit 60 /sdcard/run.mp4
adb pull /sdcard/run.mp4 .

# 读取 gfxinfo 帧统计
adb shell dumpsys gfxinfo com.example.app framestats
```

## 🧪 自动化、测试与辅助命令
---
lang: bash
emoji: 🧪
link: https://developer.android.com/training/testing/ui-automator
desc: ADB 自带的 `monkey`、输入事件和 shell 脚本适合轻量自动化，不替代正式 UI 测试框架。
---

- `adb shell monkey -p <package> 1` : 启动应用
- `adb shell monkey -p <package> -v 500` : 压测随机事件
- `adb exec-out uiautomator dump /dev/tty` : 导出当前 UI 层级
- `adb exec-out screencap -p > screen.png` : 直接输出到本地
- `adb shell run-as <package>` : 进入应用沙盒用户

```bash
# 本地直接拿 PNG，不落设备磁盘
adb exec-out screencap -p > screen.png

# 查看当前界面 XML
adb exec-out uiautomator dump /dev/tty
```

## 🩺 常见排障速记
---
lang: bash
emoji: 🩺
link: https://developer.android.com/studio/command-line/adb#troubleshooting
desc: 先判断是授权、线缆、驱动、端口占用还是设备状态异常；避免一上来就重装整套 SDK。
---

- `unauthorized` : 重新插拔 USB，确认设备弹窗已授权
- `offline` : 先 `adb reconnect`，再考虑重启服务
- `more than one device/emulator` : 所有命令补 `-s <serial>`
- `INSTALL_FAILED_VERSION_DOWNGRADE` : 改用 `adb install -d` 或先卸载
- `INSTALL_FAILED_NO_MATCHING_ABIS` : APK ABI 与设备架构不匹配
- `device not found` : 检查开发者选项、USB 调试、线缆和驱动

```bash
# 常用重置动作
adb kill-server
adb start-server
adb reconnect

# 环境变量
echo $ANDROID_SERIAL
echo $ANDROID_ADB_SERVER_PORT
```
