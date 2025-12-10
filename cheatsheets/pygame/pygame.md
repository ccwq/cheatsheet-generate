# Pygame 速查

## 核心初始化
- pygame.init(): 初始化所有pygame模块
- pygame.quit(): 退出pygame，释放资源
- pygame.display.set_mode((width, height)): 创建显示窗口
- pygame.display.set_caption(title): 设置窗口标题

## 游戏循环
- 事件处理: for event in pygame.event.get()
- 退出事件: pygame.QUIT
- 显示更新: pygame.display.flip()
- 帧率控制: clock.tick(FPS)

## 事件处理
- pygame.event.get(): 获取所有事件
- pygame.event.poll(): 获取单个事件
- 事件类型:
  - pygame.QUIT: 窗口关闭
  - pygame.KEYDOWN: 按键按下
  - pygame.KEYUP: 按键释放
  - pygame.MOUSEBUTTONDOWN: 鼠标按下
  - pygame.MOUSEBUTTONUP: 鼠标释放
  - pygame.MOUSEMOTION: 鼠标移动

## 键盘输入
- pygame.key.get_pressed(): 获取所有按键状态
- 常用按键常量:
  - pygame.K_w/a/s/d: 方向键
  - pygame.K_UP/DOWN/LEFT/RIGHT: 方向键
  - pygame.K_SPACE: 空格键
  - pygame.K_ESCAPE: ESC键

## 鼠标输入
- pygame.mouse.get_pos(): 获取鼠标位置
- pygame.mouse.get_pressed(): 获取鼠标按键状态
- pygame.mouse.set_pos(pos): 设置鼠标位置

## 图形绘制
- 填充背景: screen.fill(color)
- 绘制矩形: pygame.draw.rect(surface, color, rect, width=0)
- 绘制圆形: pygame.draw.circle(surface, color, center, radius, width=0)
- 绘制直线: pygame.draw.line(surface, color, start_pos, end_pos, width=1)
- 绘制多边形: pygame.draw.polygon(surface, color, points, width=0)
- 绘制椭圆: pygame.draw.ellipse(surface, color, rect, width=0)

## 颜色
- RGB元组: (r, g, b) 范围0-255
- 预定义颜色字符串: "red", "green", "blue", "purple", "yellow", "black", "white"
- pygame.Color类: 提供颜色操作

## 精灵系统
- pygame.sprite.Sprite: 精灵基类
- pygame.sprite.Group: 精灵组，管理多个精灵
- 精灵更新: update()方法
- 精灵绘制: draw(surface)方法
- 碰撞检测: spritecollide(), groupcollide(), spritecollideany()

## 图像与表面
- pygame.Surface: 图像表面
- pygame.image.load(filename): 加载图像
- image.convert(): 转换图像格式，提高性能
- image.convert_alpha(): 转换带透明通道的图像
- image.get_rect(): 获取图像矩形
- 图像缩放: pygame.transform.scale(image, size)
- 图像旋转: pygame.transform.rotate(image, angle)
- 图像翻转: pygame.transform.flip(image, xbool, ybool)

## 文本渲染
- pygame.font.init(): 初始化字体模块
- pygame.font.SysFont(name, size): 创建系统字体
- pygame.font.Font(filename, size): 加载自定义字体
- font.render(text, antialias, color, background=None): 渲染文本

## 时间与时钟
- pygame.time.Clock(): 创建时钟对象
- clock.tick(FPS): 控制帧率，返回帧时间(ms)
- clock.get_fps(): 获取实际帧率
- pygame.time.get_ticks(): 获取自初始化以来的毫秒数
- pygame.time.delay(ms): 延迟指定毫秒数

## 音频
- pygame.mixer.init(): 初始化音频模块
- pygame.mixer.music.load(filename): 加载音乐
- pygame.mixer.music.play(loops=0, start=0.0): 播放音乐
- pygame.mixer.music.pause(): 暂停音乐
- pygame.mixer.music.unpause(): 恢复播放
- pygame.mixer.music.stop(): 停止音乐
- pygame.mixer.Sound(filename): 创建音效对象
- sound.play(): 播放音效

## 数学向量
- pygame.math.Vector2: 2D向量
- pygame.math.Vector3: 3D向量
- 向量运算: +, -, *, /, length(), normalize(), dot()

## 碰撞检测
- pygame.Rect.colliderect(rect): 矩形碰撞
- pygame.Rect.collidepoint(point): 点与矩形碰撞
- pygame.sprite.spritecollide(sprite, group, dokill): 精灵与组碰撞
- pygame.sprite.groupcollide(group1, group2, dokill1, dokill2): 组与组碰撞

## 资源管理
- os.path.join(): 路径拼接
- pygame.image.load(): 加载图像
- pygame.font.Font(): 加载字体
- pygame.mixer.Sound(): 加载音效

## 显示模式
- pygame.FULLSCREEN: 全屏模式
- pygame.RESIZABLE: 可调整大小
- pygame.NOFRAME: 无边框
- pygame.SCALED: 自动缩放

## 常用常量
- pygame.K_*: 键盘按键常量
- pygame.BUTTON_*: 鼠标按键常量
- pygame.KEYDOWN/KEYUP: 键盘事件常量
- pygame.MOUSEBUTTONDOWN/MOUSEBUTTONUP: 鼠标事件常量
- pygame.MOUSEMOTION: 鼠标移动事件常量

## 性能优化
- 使用convert()/convert_alpha()转换图像
- 使用精灵组批量绘制
- 避免在循环中加载资源
- 使用clock.tick()控制帧率
- 合理使用碰撞检测方法
- 及时释放不再使用的资源