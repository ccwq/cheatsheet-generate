仅包含使用：

- Windows：`mklink [/D|/H|/J] Link Target`；默认文件符号链接，/D 目录符号链接，/H 硬链接（仅文件），/J 目录联接。
- Unix：`ln TARGET LINK`（硬链接）；`ln -s TARGET LINK`（符号链接）。
- 注意：跨卷仅符号链接可行；多数场景需管理员（Windows）；复制/打包注意保留链接语义。
