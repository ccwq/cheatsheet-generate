# adb 速查参考资源

## 官方文档

### adb 与平台工具
- [adb command-line tool](https://developer.android.com/studio/command-line/adb)
- [SDK Platform-Tools release notes](https://developer.android.com/tools/releases/platform-tools)
- [Logcat command-line tool](https://developer.android.com/tools/logcat)

### 调试与抓取
- [Record a screen capture](https://developer.android.com/studio/debug/screenrecord)
- [Capture and read bug reports](https://developer.android.com/studio/debug/bug-report)
- [App quality insights and debugging tools](https://developer.android.com/studio/debug)

### 自动化与测试
- [UI Automator overview](https://developer.android.com/training/testing/ui-automator)
- [Run tests from the command line](https://developer.android.com/studio/test/command-line)

## AOSP / 平台侧资料
- [ADB architecture overview](https://source.android.com/docs/core/interaction/adb)

## 使用建议
- 无线调试优先查 `adb` 官方文档中的 pairing / connect 流程
- 版本号优先以 `SDK Platform-Tools release notes` 为准
- 设备侧服务状态优先结合 `logcat`、`dumpsys`、`bugreport` 一起看
