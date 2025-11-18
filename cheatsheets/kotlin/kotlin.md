Kotlin 使用要点（精简）

基础
- 变量/类型后置；默认/命名参数；字符串模板；原始字符串（三引号）。
- 比较：== 结构相等、=== 引用相等；typealias；顶层声明/const val。
- 包与导入（as 重命名）；遵循编码规范。

控制流
- if/when/try 均为表达式；labels 可用于 return/break/continue。
- 区间/步进：..、downTo、until、step；repeat(n)。

类与对象
- 数据类/密封类型；object 单例与 companion object。
- 构造器/初始化块；get/set 自定义；可见性 public/internal/protected/private。
- 继承：open/final/abstract；nested vs inner；lateinit/lazy。

泛型与内联
- in/out 型变、星投影、where 约束；内联 inline/noinline/crossinline。
- reified 常见用法：is T、Json.decodeFromString<T>(s)。

函数与 Lambda
- 高阶函数；尾随 lambda；vararg 与 * 展开；infix 中缀。
- 扩展函数类型 String.(Int)->Unit；SAM 转换；函数/属性引用 ::。

扩展与作用域函数
- 扩展函数/属性；可空接收者扩展；成员优先于扩展。
- let/run 与 also/apply 选型；with 返回最后表达式。

空安全与类型系统
- ?.、?:、as?、!!；链式 + let；Elvis 与 return/throw。
- 基本类型装箱；Any/Any?、Unit、Nothing；平台类型 String! 谨慎。

集合与序列
- 只读/可变集合；asSequence 惰性流水；终端操作触发。
- 常用：map/filter/flatMap/groupBy/associate；zip/chunked/windowed。
- 序列构建：sequence{}/generateSequence；mapKeys/mapValues；onEach。

泛型进阶
- JVM 类型擦除；reified 协助运行期检查；不变性与使用位置型变。

操作符/数据类
- operator 约定（in/contains、iterator、get/set 等）；data class copy 浅拷贝。

枚举/密封/对象
- enum 项可覆写；sealed + when 穷尽检查更安全。

注解与反射
- @Retention/@Target/@Repeatable；使用位置 @field:/@get:/@param:。
- 反射存在运行期开销，必要时用代码生成替代。

协程与 Flow
- CoroutineScope + SupervisorJob；launch/async、withContext。
- 取消/超时；coroutineScope vs supervisorScope；异常处理。
- Flow：debounce/mapLatest/combine；flowOn/buffer/conflate；catch/retryWhen/onCompletion。
- 热/冷：StateFlow/SharedFlow 与 stateIn/shareIn。

协程进阶
- Channel 与 produce；select 多源选择；背压缓冲；终端 collect。

序列化与时间库
- kotlinx.serialization：@Serializable、Json 配置、encode/decode、@SerialName/@Transient、多态。
- kotlinx.datetime：Clock.System.now、Instant/LocalDate/LocalDateTime、TimeZone 转换。
