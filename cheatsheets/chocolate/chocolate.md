# Chocolatey CLI包管理器命令速查

## 安装卸载
- `choco install pkg` - 安装包
- `choco install pkg1 pkg2` - 批量安装
- `choco install pkg -y` - 自动确认
- `choco install pkg --version=1.0.0` - 指定版本安装
- `choco install pkg -f` - 强制重装
- `choco uninstall pkg` - 卸载包
- `choco uninstall pkg --all-versions` - 卸载所有版本

## 搜索查找
- `choco search keyword` - 搜索包
- `choco find keyword` - 查找包
- `choco search keyword --exact` - 精确匹配
- `choco search keyword --all-versions` - 所有版本
- `choco search --page=0 --page-size=25` - 分页显示
- `choco search git -s "source"` - 指定源搜索

## 更新升级
- `choco upgrade pkg` - 升级包
- `choco upgrade all` - 升级全部
- `choco upgrade all -y` - 自动确认升级全部
- `choco upgrade all --except="pkg1,pkg2"` - 跳过指定包
- `checo upgrade pkg --version=1.0.0` - 升级到指定版本
- `choco outdated` - 查看过期包

## 包管理
- `choco list` - 列出包
- `choco list -i` - 仅已安装
- `choco list --include-programs` - 包含系统程序
- `choco info pkg` - 包详细信息
- `choco pin add -n=pkg` - 固定包版本
- `choco pin remove -n=pkg` - 解除固定

## 源管理
- `choco source list` - 列出源
- `choco source add -n=name -s=url` - 添加源
- `choco source remove -n=name` - 移除源
- `choco source enable -n=name` - 启用源
- `choco source disable -n=name` - 禁用源
- `choco install pkg -s=url` - 指定源安装

## 配置管理
- `choco config list` - 显示配置
- `choco config get item` - 获取配置
- `choco config set item value` - 设置配置
- `choco config unset item` - 取消配置
- `choco feature list` - 功能特性
- `choco feature enable -n=name` - 启用特性
- `choco feature disable -n=name` - 禁用特性

## 高级功能
- `choco export -o="packages.config"` - 导出包列表
- `choco optimize` - 优化空间
- `choco sync` - 同步系统软件
- `choco cache` - 管理缓存
- `choco download pkg --no-progress` - 下载不安装
- `choco setapikey -s=url -k=key` - 设置API密钥

## 常用参数
- `-y` `--yes` - 自动确认
- `-f` `--force` - 强制执行
- `-v` `--verbose` - 详细输出
- `-d` `--debug` - 调试信息
- `-r` `--limit-output` - 限制输出
- `--no-progress` - 无进度显示
- `--timeout=seconds` - 超时设置
- `--proxy=url` - 代理设置
- `--params="params"` - 包参数
- `--install-arguments="args"` - 安装参数

## 退出码
- `0` - 成功
- `-1`或`1` - 错误
- `2` - 无结果/有过期包
- `3010` - 需重启
- `1641` - 重启已启动
- `350` - 待重启未执行

## 最佳实践
- 脚本使用 `-y` 参数
- 定期 `choco upgrade all`
- 重要包用 `choco pin` 固定
- 环境备份用 `choco export`
- 企业环境配置私有源和代理