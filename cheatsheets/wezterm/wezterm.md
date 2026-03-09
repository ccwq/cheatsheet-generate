---
title: WezTerm 速查
lang: lua
version: "20240203-110809-5046fc22"
date: 2026-03-09
github: wez/wezterm
colWidth: 330px
---

# WezTerm 速查表

## 🚀 安装与下载
---
lang: bash
emoji: 🚀
link: https://wezterm.org/installation.html
---

### Windows 安装
```bash
# 下载 .exe 安装程序
# https://wezfurlong.org/wezterm/releases/latest.html
wezterm-20240203-110809-5046fc22.silent.exe

# 使用 Scoop
scoop install wezterm

# 使用 Chocolatey
choco install wezterm
```

### macOS 安装
```bash
# Homebrew
brew install --cask wezterm

# 下载 .dmg
wezterm-20240203-110809-5046fc22.dmg
```

### Linux 安装
```bash
# Ubuntu/Debian - 下载 .deb 或使用 AppImage
# 从 https://github.com/wez/wezterm/releases 下载
wget https://github.com/wez/wezterm/releases/download/20240203-110809-5046fc22/wezterm_20240203-110809-5046fc22_amd64.deb
sudo dpkg -i wezterm_*.deb

# 或使用 AppImage（推荐）
wget https://github.com/wez/wezterm/releases/download/20240203-110809-5046fc22/wezterm-20240203-110809-5046fc22-x86_64.AppImage
chmod +x wezterm-*.AppImage
./wezterm-*.AppImage

# Fedora - 使用 COPR
sudo dnf copr enable zevm/wezterm
sudo dnf install wezterm

# Arch Linux
yay -S wezterm

# NixOS
nix-env -iA nixpkgs.wezterm
```

### Docker 运行
```bash
docker run --rm -it wez/wezterm:latest
```

## ⚙️ 配置文件
---
lang: lua
emoji: ⚙️
link: https://wezterm.org/config/files.html
---

### 配置文件位置
```bash
# Windows
C:\Users\<你的用户名>\.wezterm.lua
C:\Users\<你的用户名>\.config\wezterm\wezterm.lua

# 或使用 %USERPROFILE% 环境变量
%USERPROFILE%\.wezterm.lua
%USERPROFILE%\.config\wezterm\wezterm.lua

# macOS/Linux
~/.wezterm.lua
~/.config/wezterm/wezterm.lua
```

### 基础配置示例
```lua
local wezterm = require 'wezterm'
-- 使用 config_builder() 作为配置初始化（推荐）
local config = wezterm.config_builder()

-- 字体配置
config.font = wezterm.font 'JetBrains Mono'
config.font_size = 14.0

-- 颜色主题
config.color_scheme = 'OneHalfDark'

-- 窗口配置
config.window_padding = {
  left = 8,
  right = 8,
  top = 8,
  bottom = 8,
}

-- 标签栏配置
config.use_fancy_tab_bar = true
config.hide_tab_bar_if_only_one_tab = true

return config
```

### 启用配置
```bash
# 大部分配置修改后会自动检测并生效
# 但某些配置可能需要重启 WezTerm

# 强制重新加载配置文件
Ctrl+Shift+R

# 或重启 WezTerm 确保所有配置生效
```

## ⌨️ 快捷键配置
---
lang: lua
emoji: ⌨️
link: https://wezterm.org/config/lua/keyassignment/index.html
---

### 重要说明
```bash
# WezTerm 几乎没有默认快捷键
# 所有快捷键都需要在配置文件中手动定义
# 以下为推荐的快捷键配置示例
```

### 窗口管理（推荐配置）
```lua
-- 新建标签页
Ctrl+Shift+T

-- 新建窗口
Ctrl+Shift+N

-- 关闭当前标签页
Ctrl+Shift+W

-- 切换标签页
Ctrl+Tab      -- 下一个
Ctrl+Shift+Tab -- 上一个
```

### 分屏操作（推荐配置）
```lua
-- 水平分割
Ctrl+Shift+H

-- 垂直分割
Ctrl+Shift+V

-- 切换到相邻分屏
Ctrl+Shift+方向键

-- 调整分屏大小
Ctrl+Shift+Alt+方向键
```

### 复制粘贴（需配置）
```bash
# WezTerm 几乎没有默认快捷键
# 以下为推荐配置，需在配置文件中定义

# 复制（推荐配置）
Ctrl+Shift+C (选中文字后)

# 粘贴（推荐配置）
Ctrl+Shift+V

# 粘贴选中内容
Shift+Insert

# 全选（推荐配置）
Ctrl+Shift+A
```

### 其他常用（推荐配置）
```bash
# 打开命令面板
Ctrl+Shift+P

# 搜索滚动历史
Ctrl+Shift+F

# 放大字体
Ctrl++

# 缩小字体
Ctrl+-

# 重置缩放
Ctrl+0

# 切换全屏
F11

# 打开调试器
Ctrl+Shift+D
```

### 配置示例（Lua）
```lua
local wezterm = require 'wezterm'
local act = wezterm.action

return {
  keys = {
    -- 新建标签页
    {
      key = 't',
      mods = 'CTRL|SHIFT',
      action = act.SpawnTab 'CurrentPaneDomain',
    },
    -- 新建窗口
    {
      key = 'n',
      mods = 'CTRL|SHIFT',
      action = act.SpawnWindow,
    },
    -- 水平分割
    {
      key = 'h',
      mods = 'CTRL|SHIFT',
      action = act.SplitHorizontal { domain = 'CurrentPaneDomain' },
    },
    -- 垂直分割
    {
      key = 'v',
      mods = 'CTRL|SHIFT',
      action = act.SplitVertical { domain = 'CurrentPaneDomain' },
    },
  },
}
```

## 🎯 自定义快捷键
---
lang: lua
emoji: 🎯
link: https://wezterm.org/config/lua/keyassignment/index.html
---

### 基础键位绑定
```lua
local wezterm = require 'wezterm'
local act = wezterm.action
local config = wezterm.config_builder()

config.keys = {
  -- 发送 Ctrl+C 到终端
  {
    key = 'c',
    mods = 'CTRL',
    action = act.SendKey { key = 'c', mods = 'CTRL' },
  },
  
  -- 新建标签页
  {
    key = 't',
    mods = 'CTRL|SHIFT',
    action = act.SpawnTab 'CurrentPaneDomain',
  },
  
  -- 关闭标签页
  {
    key = 'w',
    mods = 'CTRL|SHIFT',
    action = act.CloseCurrentTab { confirm = true },
  },
}

return config
```

### Tmux 风格键位
```lua
local wezterm = require 'wezterm'
local act = wezterm.action
local config = wezterm.config_builder()

config.leader = { key = 'b', mods = 'CTRL', timeout_milliseconds = 1000 }

config.keys = {
  -- 前缀键后按 c 创建新标签页
  { key = 'c', mods = 'LEADER', action = act.SpawnTab 'CurrentPaneDomain' },
  
  -- 前缀键后按 % 垂直分割
  { key = '%', mods = 'LEADER', action = act.SplitVertical { domain = 'CurrentPaneDomain' } },
  
  -- 前缀键后按 " 水平分割
  { key = '"', mods = 'LEADER', action = act.SplitHorizontal { domain = 'CurrentPaneDomain' } },
  
  -- 前缀键后按方向键切换分屏
  { key = 'LeftArrow', mods = 'LEADER', action = act.ActivatePaneDirection 'Left' },
  { key = 'RightArrow', mods = 'LEADER', action = act.ActivatePaneDirection 'Right' },
  { key = 'UpArrow', mods = 'LEADER', action = act.ActivatePaneDirection 'Up' },
  { key = 'DownArrow', mods = 'LEADER', action = act.ActivatePaneDirection 'Down' },
}

return config
```

### 命令面板快捷键
```lua
{
  key = 'p',
  mods = 'CTRL|SHIFT',
  action = act.ActivateCommandPalette,
}
```

## 🔀 多路复用与分屏
---
lang: bash
emoji: 🔀
link: https://wezterm.org/multiplexing.html
---

### CLI 分屏命令
```bash
# 水平分割
wezterm split-pane --horizontal

# 垂直分割
wezterm split-pane --vertical

# 指定分割目录
wezterm split-pane --top-level

# 在新窗口中启动
wezterm start
```

### 标签页管理
```bash
# 创建新标签页
wezterm cli spawn-tab

# 切换到指定标签页
wezterm cli activate-tab --tab-id 1

# 切换到下一个标签页
wezterm cli activate-tab --next

# 切换到上一个标签页
wezterm cli activate-tab --prev

# 关闭标签页
wezterm cli kill-tab
```

### 窗口管理
```bash
# 创建新窗口
wezterm cli spawn-window

# 列出所有窗口
wezterm cli list --windows

# 激活指定窗口
wezterm cli activate-window --window-id 123
```

## 📋 复制模式
---
lang: lua
emoji: 📋
link: https://wezterm.org/copy-mode.html
---

### 进入复制模式
```bash
# 快捷键
Ctrl+Shift+F

# 或使用命令面板选择 Copy Mode
```

### 复制模式操作（需配置）
```bash
# WezTerm 复制模式默认快捷键与 Vim 不同
# 以下为 Vim 风格配置示例，需在配置文件中定义

# 移动光标
h/j/k/l 或 方向键

# 选择文本（Vim 风格，需配置）
v          -- 进入选择模式
V          -- 行选择
Ctrl+v     -- 块选择

# 复制选中
Enter 或 y

# 搜索
/          -- 向前搜索
?          -- 向后搜索
n          -- 下一个匹配
N          -- 上一个匹配

# 跳转到（Vim 风格，需配置）
0          -- 行首
$          -- 行尾
gg         -- 顶部
G          -- 底部

# 退出
q 或 Escape
```

### 自定义复制模式键位
```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.copy_mode = {
  enter_select_mode = 'v',
  enter_line_mode = 'V',
  enter_block_mode = 'Ctrl+v',
  select_all = 'Ctrl+a',
  copy = 'Enter',
  cancel = 'q',
}

return config
```

## 🔍 滚动历史
---
lang: lua
emoji: 🔍
link: https://wezterm.org/config/lua/config/scrollback_lines.html
---

### 滚动操作
```bash
# 向上滚动一行
Shift+PageUp 或 Ctrl+↑

# 向下滚动一行
Shift+PageDown 或 Ctrl+↓

# 向上滚动一页
PageUp

# 向下滚动一页
PageDown

# 滚动到顶部
Ctrl+Shift+Home

# 滚动到底部
Ctrl+Shift+End
```

### 配置滚动历史
```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

-- 设置滚动历史行数
config.scrollback_lines = 3500

-- 设置鼠标滚动速度
config.mouse_wheel_scrolls_tabs = false

-- 鼠标滚动倍率
config.mouse_wheel_ease = 1.0

return config
```

### 搜索滚动历史
```bash
# 打开搜索
Ctrl+Shift+F

# 搜索操作
输入关键词      -- 搜索
Enter           -- 下一个匹配
Shift+Enter     -- 上一个匹配
Escape          -- 关闭搜索
```

## 🎨 外观配置
---
lang: lua
emoji: 🎨
link: https://wezterm.org/config/appearance.html
---

### 字体配置
```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.font = wezterm.font 'JetBrains Mono'
config.font_size = 14.0

-- 使用带连字的字体
config.harfbuzz_features = { 'calt', 'clig', 'liga' }

-- 自定义行高
config.line_height = 1.2

-- 自定义字间距
config.cell_width = 1.0

return config
```

### 颜色主题
```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

-- 使用内置主题
config.color_scheme = 'OneHalfDark'

-- 热门主题
-- 'Dracula'
-- 'Gruvbox'
-- 'Nord'
-- 'Solarized Dark'
-- 'Tokyo Night'
-- 'Catppuccin Mocha'

return config
```

### 窗口透明度
```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

-- 设置背景透明度 (0-100)
config.window_background_opacity = 0.85

-- 毛玻璃效果 (macOS)
config.macos_window_background_blur = 10

-- 文本不透明度
config.text_background_opacity = 1.0

return config
```

### 光标配置
```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

-- 光标样式
config.default_cursor_style = 'SteadyBlock'
-- 'SteadyBlock' - 实心底座
-- 'BlinkingBlock' - 闪烁底座
-- 'SteadyUnderline' - 实线下划线
-- 'BlinkingUnderline' - 闪烁下划线
-- 'SteadyBar' - 实线竖条
-- 'BlinkingBar' - 闪烁竖条

-- 光标闪烁频率
config.cursor_blink_rate = 800

return config
```

## 🔗 SSH 与远程
---
lang: lua
emoji: 🔗
link: https://wezterm.org/multiplexing.html#ssh
---

### SSH 连接
```bash
# 通过 SSH 启动
wezterm ssh user@hostname

# 指定端口
wezterm ssh -p 2222 user@hostname

# 使用 SSH 配置
wezterm ssh my-alias
```

### SSH 域配置
```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.ssh_domains = {
  {
    name = 'myserver',
    remote_address = 'server.example.com',
    username = 'myuser',
  },
  {
    name = 'work',
    remote_address = 'work.example.com',
    username = 'dev',
    port = 2222,
  },
}

return config
```

### 多路复用 SSH
```lua
-- 启用 SSH 多路复用
config.ssh_backend = 'WezTerm'

-- 使用内置多路复用器
-- 支持会话持久化、断线重连
```

## 📦 域与命名空间
---
lang: lua
emoji: 📦
link: https://wezterm.org/config/lua/domain-reference/index.html
---

### 本地域
```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.domains = {
  local_domain = {
    name = 'local',
  },
}

return config
```

### WSL 域
```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.wsl_domains = {
  {
    name = 'WSL:Ubuntu',
    distribution = 'Ubuntu',
    username = 'wez',
    default_cwd = '/home/wez',
  },
}

return config
```

### Docker 域
```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.docker_domains = {
  {
    name = 'docker',
    image = 'ubuntu:latest',
    user = 'root',
  },
}

return config
```

### 跨域操作
```bash
# 列出所有域
wezterm cli list --domains

# 在指定域中启动
wezterm cli spawn --domain myserver
```

## 🛠️ CLI 命令参考
---
lang: bash
emoji: 🛠️
link: https://wezterm.org/command-reference.html
---

### 基础命令
```bash
# 启动 WezTerm
wezterm

# 显示帮助
wezterm --help

# 显示版本
wezterm --version

# 启动时执行命令
wezterm start -- bash -c "echo hello"
```

### 窗口管理命令
```bash
# 列出窗口
wezterm cli list

# 激活窗口
wezterm cli activate-window --window-id 123

# 创建窗口
wezterm cli spawn-window

# 关闭窗口
wezterm cli kill-window --window-id 123
```

### 标签页命令
```bash
# 创建标签页
wezterm cli spawn-tab

# 激活标签页
wezterm cli activate-tab --tab-id 456

# 切换标签页
wezterm cli activate-tab --next
wezterm cli activate-tab --prev
```

### 分屏命令
```bash
# 分割窗格
wezterm cli split-pane --horizontal
wezterm cli split-pane --vertical

# 激活窗格
wezterm cli activate-pane --pane-direction right
```

## 🔌 插件与扩展
---
lang: lua
emoji: 🔌
link: https://wezterm.org/config/lua/index.html
---

### 加载外部模块
```lua
local wezterm = require 'wezterm'
local my_module = require 'my_module'

config = my_module.apply(config)
```

### 状态栏配置
```lua
wezterm.on('update-right-status', function(window, pane)
  local date = os.date '%Y-%m-%d %H:%M:%S'
  window:set_right_status(date)
end)

config.enable_tab_bar = true
```

### 事件处理
```lua
-- 窗口焦点变化
wezterm.on('window-focus-changed', function(window, pane)
  if window:is_focused() then
    window:set_config_overrides({
      window_background_opacity = 0.85,
    })
  else
    window:set_config_overrides({
      window_background_opacity = 1.0,
    })
  end
end)
```

## 💡 使用技巧
---
lang: bash
emoji: 💡
link: https://wezterm.org/guides.html
---

### 快速启动
```bash
# 启动到指定目录
wezterm start --cwd /path/to/project

# 启动并执行命令
wezterm start -- bash -c "nvim"

# 启动到新标签页
wezterm cli spawn-tab
```

### 会话恢复
```bash
# WezTerm 自动保存会话
# 重启后会恢复之前的窗口、标签页和分屏

# 手动保存会话状态
# 配置自动保存
config.exit_behavior = "Close"
```

### 性能优化
```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

-- 禁用 GPU 加速（如有问题）
config.front_end = "OpenGL"

-- 调整渲染器
config.webgpu_power_preference = "HighPerformance"

-- 减少滚动历史（节省内存）
config.scrollback_lines = 1000

return config
```

### 调试技巧
```bash
# 打开调试控制台
Ctrl+Shift+D

# 查看日志
wezterm ls-fonts

# 检查配置
wezterm show-config
```

## 🔧 故障排除
---
lang: bash
emoji: 🔧
link: https://wezterm.org/troubleshooting.html
---

### 常见问题
```bash
# 字体渲染问题
wezterm ls-fonts --text "测试文本"

# 性能问题
# 尝试禁用 GPU 加速
config.front_end = "Software"

# 颜色显示异常
# 检查 color_scheme 配置
```

### 重置配置
```bash
# 临时禁用配置文件
wezterm --config-file /dev/null

# 恢复默认配置
# 删除或重命名 .wezterm.lua
```

### 获取帮助
```bash
# 查看完整文档
https://wezterm.org/

# GitHub Issues
https://github.com/wez/wezterm/issues

# 社区讨论
https://github.com/wez/wezterm/discussions
```
