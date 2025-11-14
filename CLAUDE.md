# 这是一个根据用户提供主题生成的 Cheatsheet的项目

- 根据/base.md的提示词和要求生成
- 生成的 Cheatsheet 保存在/cheatsheets目录下
- 每个 Cheatsheet 都有一个对应的 目录, 目录下有一个 HTML 文件, 文件名与目录文件相相同
- 在生成cheatsheet之后, 需要生成一份md, 在来作为提示词提供给其他大模型开发的agent, 其要求如下
  - 文件名与cheatsheet目录名相同, ext为md
  - 用语需要精确, 优先使用简体中文, 也可以使用文言文, 目的在于减少token数量
  - 不要包含安装和配置的内容, 只需包含使用相关的内容
- 创建对应的refmap.md是一个好习惯, 如果用户提供的事一个网址,并且要求整理refmap, 请使用chrome打开网址, 分析导航链接, 进而整理需要参考的refmap,保存到(/cheatsheets/topic/refmap.md), 最后使用fetch,webfetch(domain:*)来获取分析需要参考的内容
- desc.md文件用来在nav.html中显示cheatsheet的介绍, 如果没有desc.md文件, 则不显示介绍