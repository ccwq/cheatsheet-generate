仅涵盖使用：

- 注入：`clink inject`；autorun：`clink autorun install|uninstall`；信息：`clink info`。
- 交互：Ctrl+R/S 历史增量搜索、增强补全、改进粘贴与 Readline 键位。
- 配置：`%LOCALAPPDATA%/clink`；用 `clink set` 查看/修改设置（如 autosuggest、history）。
- Lua：在配置目录放置 `*.lua`；`profile.lua` 先加载；`prompt_filter()` 定制提示符。
- 匹配器：`clink.argmatcher("cmd")` 与 `clink.arg.register_parser` 提供自定义补全。
