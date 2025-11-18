Jetpack Compose 使用要点（精简）

基础（@Composable）
- 组合三阶段：Compose → Layout → Draw；UI 无副作用。
- Row/Column/Box/Spacer + Modifier 管控尺寸/对齐。
- CompositionLocal/CompositionLocalProvider 提供/覆盖依赖；LocalContext/Density。
- rememberSaveable + Saver 跨重建保存。
- @Preview 组合：设备/明暗/字体缩放。

状态与重组
- remember/mutableStateOf、mutableIntStateOf/Long；rememberUpdatedState 避免闭包陈旧。
- derivedStateOf 延迟昂贵计算；MutableStateList/Map 管集合。
- Hoisting 上提状态；保持数据不可变（@Immutable/@Stable）。
- remember(key…) 键变化重建记忆。

副作用与生命周期
- LaunchedEffect(key) 启动；DisposableEffect 释放；SideEffect 一次性提交。
- snapshotFlow { state } 转 Flow；produceState 将外部源转为状态。
- 仅一次：LaunchedEffect(Unit)。

布局与修饰符
- 常用：padding/size/fillMaxWidth/weight；Alignment/Arrangement。
- 自定义 Layout 与 LayoutModifier；SubcomposeLayout（先测后绘）。
- ConstraintLayout（可选）；widthIn/heightIn、aspectRatio、zIndex。
- onGloballyPositioned 获取尺寸；drawBehind/drawWithContent 自绘；clip/border/background。

列表与懒加载
- LazyColumn/LazyRow/LazyVerticalGrid；items/itemsIndexed + key。
- contentType 提升回收；animateItemPlacement 位置动画。
- rememberLazyListState + animateScrollToItem 控制滚动。
- Paging3：collectAsLazyPagingItems + loadState 处理加载/错误。

Material3 与主题
- MaterialTheme(colorScheme, typography, shapes)。
- isSystemInDarkTheme 动态暗色；动态色不可用时回退静态色板。
- Scaffold 插槽：topBar/bottomBar/snackbarHost。
- ButtonDefaults 自定义；可访问性与对比度。

导航与多模块
- rememberNavController；NavHost/composable 配置路由。
- 参数：navArgument + NavType（Int/Bool/Enum/Parcelable）。
- popUpTo/launchSingleTop/restoreState；嵌套图与多栈（底部导航）。
- accompanist-navigation-animation 的 AnimatedNavHost（可选）。

动画与手势
- animate*AsState/updateTransition/AnimatedVisibility/AnimatedContent/Crossfade。
- spring/tween/keyframes/repeatable；rememberInfiniteTransition。
- pointerInput/detectTapGestures；draggable/swipeable；嵌套滚动。

测试与互操作
- createComposeRule / createAndroidComposeRule；语义与 testTag 选择器。
- performClick/performTextInput；waitUntil/awaitIdle。
- AndroidView(factory/update)；ComposeView 设置 setViewCompositionStrategy。

Lifecycle 与 Flow 收集
- collectAsStateWithLifecycle（lifecycle-runtime-compose）。
- 备选：LaunchedEffect + repeatOnLifecycle。
- ViewModel 层用 stateIn/shareIn 稳定状态来源。

文本输入与焦点
- TextField/OutlinedTextField；singleLine/maxLines；placeholder/label。
- KeyboardOptions(ImeAction…) + KeyboardActions(onSearch/onDone…)。
- FocusRequester/LocalFocusManager；focusProperties/onFocusChanged。
- bringIntoViewRequester 与 IME 顶起。

资源与图片加载
- Image + painterResource；ContentScale。
- Coil-Compose：AsyncImage(model=RequestBuilder, placeholder/error, crossfade)。
- clip(CircleShape)/border 实现头像等样式。

可访问性与语义
- Modifier.semantics { contentDescription/role/stateDescription }。
- mergeDescendants/clearAndSetSemantics；heading/disabled。
- 测试：hasContentDescription/hasTestTag。

性能与稳定性
- @Stable/@Immutable；稳定 key 与稳定参数。
- remember/derivedStateOf；记忆键精确；避免每帧分配。
- 工具：Layout Inspector、Tracing、Baseline Profiles。

预览技巧
- @PreviewLightDark/@PreviewDynamicColors/@PreviewFontScale。
- showSystemUi/showBackground；device = "id:pixel_6"。
- 多个 @Preview 组合覆盖典型场景。

窗口与系统栏
- statusBarsPadding/navigationBarsPadding/systemBarsPadding。
- imePadding/windowInsetsPadding(WindowInsets.ime)。
- BackHandler；accompanist-systemuicontroller 调整系统栏颜色（可选）。
