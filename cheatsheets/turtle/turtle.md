# Python Turtle 库速查表

## 🐢 基本设置
- `import turtle`：导入turtle模块
- `from turtle import *`：导入所有turtle函数
- `turtle.Screen()`：创建并返回绘图窗口
- `turtle.Turtle()`：创建并返回海龟对象
- `turtle.setup(width, height)`：设置窗口大小
- `turtle.title(name)`：设置窗口标题

## 🚶 海龟移动
- `forward(distance)` 或 `fd(distance)`：向前移动指定距离
- `backward(distance)` 或 `bk(distance)` 或 `back(distance)`：向后移动指定距离
- `right(angle)` 或 `rt(angle)`：向右旋转指定角度
- `left(angle)` 或 `lt(angle)`：向左旋转指定角度
- `goto(x, y)` 或 `setpos(x, y)` 或 `setposition(x, y)`：移动到指定坐标
- `setx(x)`：设置x坐标，y坐标不变
- `sety(y)`：设置y坐标，x坐标不变
- `home()`：返回原点(0, 0)，朝向x轴正方向

## 📊 海龟状态
- `position()` 或 `pos()`：返回当前位置坐标
- `xcor()`：返回当前x坐标
- `ycor()`：返回当前y坐标
- `heading()`：返回当前朝向角度
- `distance(x, y)`：返回到指定点的距离
- `towards(x, y)`：返回指向指定点的角度
- `degrees()`：设置角度为度（默认）
- `radians()`：设置角度为弧度

## 🖌️ 画笔控制
- `penup()` 或 `pu()` 或 `up()`：抬起画笔，移动时不画线
- `pendown()` 或 `pd()` 或 `down()`：放下画笔，移动时画线
- `pensize(width)` 或 `width(width)`：设置画笔宽度
- `pen(option=value)`：设置画笔属性
- `isdown()`：返回画笔是否放下

## 🎨 颜色控制
- `color(color1, color2)`：设置画笔颜色和填充颜色
- `pencolor(color)`：设置画笔颜色
- `fillcolor(color)`：设置填充颜色
- `begin_fill()`：开始填充
- `end_fill()`：结束填充
- `filling()`：返回是否正在填充
- `bgcolor(color)`：设置背景颜色
- `colormode(mode)`：设置颜色模式（1.0或255）

## 🔶 绘图形状
- `circle(radius, extent=None, steps=None)`：绘制圆形
- `dot(size=None, color=None)`：绘制点
- `stamp()`：在当前位置留下海龟形状印记
- `clearstamp(stampid)`：清除指定印记
- `clearstamps(n=None)`：清除n个印记

## 👀 海龟外观
- `shape(name)`：设置海龟形状
- `shapesize(stretch_wid=None, stretch_len=None, outline=None)`：调整海龟大小
- `resizemode(rmode)`：设置大小调整模式
- `shearfactor(shear=None)`：设置或返回剪切因子
- `settiltangle(angle)`：旋转海龟形状
- `tilt(angle)`：旋转海龟形状
- `tiltangle(angle=None)`：返回当前旋转角度
- `hideturtle()` 或 `ht()`：隐藏海龟
- `showturtle()` 或 `st()`：显示海龟
- `isvisible()`：返回海龟是否可见

## ⚡ 速度与延迟
- `speed(speed=None)`：设置或返回海龟移动速度（0-10）
- `delay(delay=None)`：设置或返回延迟时间
- `tracer(n=None, delay=None)`：设置动画追踪
- `update()`：更新绘图窗口

## 🖼️ 窗口控制
- `clear()`：清除海龟绘制的内容
- `reset()`：重置海龟和绘图
- `clearscreen()` 或 `cs()` 或 `screenreset()`：清除屏幕
- `bye()` 或 `exit()` 或 `quit()`：关闭窗口
- `mainloop()` 或 `done()`：进入主循环
- `exitonclick()`：点击窗口关闭
- `listen()`：监听键盘事件

## 🎯 事件处理
- `onclick(fun, btn=1, add=None)`：鼠标点击事件
- `onrelease(fun, btn=1, add=None)`：鼠标释放事件
- `ondrag(fun, btn=1, add=None)`：鼠标拖动事件
- `onkey(fun, key)`：键盘按键事件
- `onkeypress(fun, key=None)`：键盘按下事件
- `onkeyrelease(fun, key=None)`：键盘释放事件
- `ontimer(fun, t=0)`：定时器事件

## 📝 示例：绘制正方形
```python
from turtle import *

def draw_square(size):
    for _ in range(4):
        forward(size)
        right(90)

draw_square(100)
done()
```
绘制一个边长为100的正方形

## ⭐ 示例：绘制五角星
```python
from turtle import *

color('red')
fillcolor('yellow')
begin_fill()

while True:
    forward(200)
    left(170)
    if abs(pos()) < 1:
        break

end_fill()
done()
```
绘制一个红色边框黄色填充的五角星

## 🌈 示例：彩色螺旋
```python
from turtle import *

speed(0)
for steps in range(100):
    for c in ('blue', 'red', 'green'):
        color(c)
        forward(steps)
        right(30)

done()
```
绘制一个彩色螺旋图案