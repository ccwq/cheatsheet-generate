# Jetpack Compose：官网章节对照与扩展建议

## 官网文档章节（归纳）
- 入门与基础：Get started、Thinking in Compose、@Composable 与重组
- 状态与生命周期：State、Side-effects、remember/rememberSaveable
- 布局体系：Row/Column/Box、Modifier、约束测量、自定义布局
- 列表与懒组件：LazyColumn/LazyRow/LazyGrid、分页 Paging、占位骨架
- 动画与图形：animate*、Transition、AnimatedVisibility/Content、手势
- Material 3 与设计：主题/颜色/排版/形状、常用组件、动态色
- 导航：NavHost、参数/深链接、SavedState、ViewModel/Hilt
- 互操作：AndroidView/ComposeView、视图树、ViewBinding
- 文本与输入：TextField、焦点、键盘、IME 动作
- 资源与图片：Image/painterResource、图片加载（Coil）
- 可访问性：Semantics、Role、contentDescription、无障碍指南
- 测试：UI 测试、语义节点、稳定选择器
- 性能与工具：性能最佳实践、Baseline Profiles、Layout Inspector
- 窗口与系统栏：Insets、安全区域、系统栏着色、BackHandler

## 本地 Cheatsheet 章节（当前）
- @Composable 基础
- 状态与重组
- 副作用与生命周期（LaunchedEffect/DisposableEffect/snapshotFlow/rememberCoroutineScope）
- 布局与修饰符
- 列表与懒加载（含 Paging 提及）
- Material3 与主题
- 导航与多模块
- 动画与手势
- 测试与互操作（含 Baseline Profiles 简述）

## 差异与建议新增
- 文本与焦点输入：TextField、KeyboardOptions/KeyboardActions、FocusRequester、LocalFocusManager
- 资源与图片：Image + painterResource、Coil-Compose 的 AsyncImage/占位/错误图
- 可访问性与语义：Modifier.semantics、contentDescription、Role、mergeDescendants、clearAndSetSemantics、stateDescription
- Lifecycle/Flow 收集：lifecycle-runtime-compose 的 collectAsStateWithLifecycle、repeatOnLifecycle 场景
- 性能与稳定性：@Stable/@Immutable、稳定集合、MutableIntState/MutableLongState、rememberUpdatedState、derivedStateOf、Lazy key/avoid object alloc
- 预览最佳实践：@PreviewLightDark、@PreviewFontScale、@PreviewDynamicColors、多设备组合
- 窗口与系统栏：WindowInsets（systemBarsPadding/statusBarsPadding/navigationBarsPadding）、BackHandler、系统栏着色（accompanist-systemuicontroller）
- 列表增强：stickyHeader、LazyVerticalGrid、item span、差分刷新
- 布局进阶：ConstraintLayout-Compose（可选简述）、SubcomposeLayout（仅点到）
- 导航增强：rememberNavController、DeepLink、返回栈保存、类型安全路由（思路）

## 拟实施改动
- 在 HTML 中新增 6–8 张卡片，覆盖“文本输入与焦点 / 资源与图片 / 可访问性 / Lifecycle Flow / 性能稳定性 / 预览技巧 / 窗口系统栏”
- 在“列表/动画/导航/测试与互操作”卡片内补充 1–2 条关键要点
- 所有新增条目提供简短中文注释与最短可用代码片段
- 保持现有样式与交互（列宽滑块、卡片风格）不变
