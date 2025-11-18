# Kotlin：官网章节对照与扩充建议

# Kotlin 官方文档（归纳）
- 基础：基本语法、Idioms、编码约定
- 类型系统：空安全、类型检查/智能转换、类型别名
- 函数：默认/命名参数、Lambda、函数类型、尾递归、内联
- 类与对象：类/接口、可见性、数据类、枚举、密封、对象、委托
- 泛型：型变（in/out）、星投影、边界、实化类型参数
- 集合：集合与序列、操作、持久化集合（kotlinx.collections.immutable）
- 标准库与作用域函数：let/apply/also/run/with
- 协程：基础、取消、异常、上下文与调度器、通道、Flow/StateFlow/SharedFlow
- 平台特性：Kotlin/JVM 注解与互操作、Kotlin/JS、Kotlin/Native（可选）
- 反射与注解：kotlin.reflect、元注解
- 序列化与时间：kotlinx.serialization、kotlinx.datetime（第三方官方库）
- 多平台：KMP 基本结构（可选）
# 本地卡片（当前）- 基础语法 
- 控制流与集合 
- 类与对象 
- 泛型与内联 
- 协程与 Flow 
- 委托与值类型 
- 空安全与类型系统 
- 函数与 Lambda 
- 扩展与作用域函数 
- 集合与序列 
- 泛型进阶 
- 操作符/解构/数据类 
- 枚举/密封/对象 
- 注解与反射 
- 协程进阶 

# 差异与扩充建议
- 扩充基础语法/函数与Lambda/类型系统：补充 === vs ==、原始字符串、尾递归、typealias、智能转换细节
- 扩充类与对象/委托与值类型：构造器/init、自定义访问器、lateinit/lazy、属性委托 map、object 表达式
- 扩充泛型与内联/泛型进阶：use-site 型变、where 约束、reified 常见用法
- 扩充集合与序列：惰性与急切、Sequence builder、chunked/windowed/distinctBy/groupingBy
- 扩充协程与Flow/协程进阶：异常/取消范式、retry/catch/onCompletion、stateIn/shareIn、热/冷流
- 新增卡片：序列化与时间库（kotlinx.serialization/kotlinx.datetime）
- 选配卡片：JVM 互操作与构建（@Jvm*、SAM、file-level 注解、Gradle Kotlin DSL 简要）
