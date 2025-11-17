# ADB速查 - Android调试桥命令参考

## 设备管理
- `adb devices [-l]`：列设备
- `adb connect IP:端口`：TCP连接
- `adb tcpip 端口`：无线调试模式
- `adb wait-for-device`：等待设备
- `adb start-server|kill-server`：服务控制

## 应用管理
- `adb install [-r] apk`：安装(-r重装)
- `adb uninstall [-k] 包名`：卸载(-k保留数据)
- `adb shell pm list packages`：列包名
- `adb shell pm path 包名`：APK路径
- `adb shell pm grant 包名 权限`：授予权限
- `adb shell pm clear 包名`：清数据

## Shell操作
- `adb shell`：交互Shell
- `adb shell "命令"`：执行单条
- `adb shell getprop`：系统属性
- `adb shell input keyevent 键值`：按键
- `adb shell input text "文本"`：输入
- `adb shell input tap X Y`：点击
- `adb shell input swipe x1 y1 x2 y2`：滑动

## 文件传输
- `adb push 本地 设备`：上传
- `adb pull 设备 [本地]`：下载
- `adb sync [目录]`：同步

## 端口转发
- `adb forward tcp:本地 tcp:设备`：正向转发
- `adb reverse tcp:设备 tcp:本地`：反向转发
- `adb forward --list`：列出转发

## 日志管理
- `adb logcat`：查看日志
- `adb logcat -s 标签`：过滤标签
- `adb logcat -c`：清日志
- `adb logcat -v time`：时间戳

## 屏幕操作
- `adb shell screencap [-p] 文件`：截图
- `adb shell screenrecord 文件`：录屏
- `adb shell screenrecord --size WxH --bit-rate B --time-limit S 文件`：参数录屏

## Activity管理
- `adb shell am start -n 包名/.Activity`：启动
- `adb shell am force-stop 包名`：强制停止
- `adb shell am broadcast -a 动作`：发广播

## 系统信息
- `adb shell dumpsys [服务]`：服务状态
- `adb shell dumpsys activity`：Activity栈
- `adb shell dumpsys meminfo 包名`：内存
- `adb shell dumpsys battery`：电池
- `adb shell getprop ro.build.version`：版本信息

## 性能监控
- `adb shell top`：进程信息
- `adb shell ps`：进程列表
- `adb shell dumpsys gfxinfo 包名`：图形性能
- `adb shell monkey 包名 事件数`：压力测试

## 网络调试
- `adb shell svc wifi enable|disable`：WiFi控制
- `adb shell netstat`：网络状态
- `adb shell ip addr`：IP信息

## 权限管理
- `adb shell dpm set-device-owner 组件`：设设备所有者
- `adb shell dpm remove-active-admin 组件`：移管理员
- `adb shell settings put global adb_enabled 0|1`：ADB开关

## 环境变量
- `ANDROID_SERIAL`：设备序列号
- `ANDROID_ADB_SERVER_HOST`：服务器地址
- `ANDROID_ADB_SERVER_PORT`：服务器端口

## 常用键值
- 3: HOME, 4: BACK, 82: MENU, 84: SEARCH, 85: POWER

## 日志级别
- V: 详细, D: 调试, I: 信息, W: 警告, E: 错误, F: 致命

## 安装位置
- 0: 自动, 1: 内部存储, 2: 外部存储

## 故障排除
- `adb kill-server && adb start-server`：重启服务
- 检查USB调试是否开启
- 确认设备驱动正常