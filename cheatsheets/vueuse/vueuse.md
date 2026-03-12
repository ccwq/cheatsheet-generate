---
title: VueUse 速查
lang: javascript
version: "14.2.1"
date: 2026-03-12
github: vueuse/vueuse
---

## 状态管理
---
lang: javascript
emoji: 💾
link: https://vueuse.org/core/useLocalStorage
desc: 响应式 LocalStorage，自动序列化为 JSON
---

```javascript
import { useLocalStorage } from '@vueuse/core'

// 基础用法
const store = useLocalStorage('my-key', { name: 'Vue', version: 3 })

// 支持多种类型
const str = useLocalStorage('str', 'default')
const num = useLocalStorage('num', 0)
const bool = useLocalStorage('bool', true)

// 监听变化
watch(store, (newVal) => {
  console.log('storage changed:', newVal)
}, { deep: true })
```

```javascript
import { useSessionStorage } from '@vueuse/core'

// SessionStorage 版本
const session = useSessionStorage('session-key', { foo: 'bar' })
```

```javascript
import { useStorage } from '@vueuse/core'

// 自定义存储后端
const store = useStorage('my-key', {}, {
  storage: customStorageApi,
  mergeDefaults: true
})
```

## 响应式鼠标与键盘
---
lang: javascript
emoji: 🖱️
link: https://vueuse.org/core/useMouse
desc: 响应式追踪鼠标位置
---

```javascript
import { useMouse, usePreferredDark, useClipboard, useFullscreen } from '@vueuse/core'

// 鼠标位置
const { x, y, sourceType } = useMouse()

// 暗黑模式偏好
const isDark = usePreferredDark()

// 剪贴板
const { text, copy, pasted } = useClipboard()

// 全屏
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
```

```javascript
import { useKeyModifier } from '@vueuse/core'

// 键盘修饰键状态
const isCtrlPressed = useKeyModifier('Control')
const isShiftPressed = useKeyModifier('Shift')
const isAltPressed = useKeyModifier('Alt')
const isMetaPressed = useKeyModifier('Meta')
```

```javascript
import { useMagicKeys, whenever } from '@vueuse/core'

// 快捷键组合
const { 
  Ctrl_K, 
  Shift_Alt_P, 
  Meta_Escape,
  Escape
} = useMagicKeys()

whenever(Ctrl_K, () => {
  console.log('Ctrl+K pressed')
})

whenever(Escape, () => {
  console.log('Escape pressed')
})
```

## 响应式窗口与屏幕
---
lang: javascript
emoji: 🪟
link: https://vueuse.org/core/useWindowSize
desc: 响应式窗口尺寸与视口
---

```javascript
import { 
  useWindowSize, 
  useWindowScroll,
  useWindowFocus,
  useDocumentVisibility,
  useOnline,
  useOffline
} from '@vueuse/core'

// 窗口尺寸
const { width, height } = useWindowSize()

// 窗口滚动位置
const { x, y } = useWindowScroll()

// 窗口焦点
const isFocused = useWindowFocus()

// 页面可见性
const isVisible = useDocumentVisibility()

// 网络状态
const isOnline = useOnline()
const isOffline = useOffline()
```

## 响应式主题与样式
---
lang: javascript
emoji: 🎨
link: https://vueuse.org/core/useDark
desc: 响应式暗黑模式与主题切换
---

```javascript
import { useDark, useToggle, usePreferredColorScheme } from '@vueuse/core'

// 暗黑模式
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})

const toggleDark = useToggle(isDark)

// 首选颜色方案
const preferredScheme = usePreferredColorScheme() // 'dark' | 'light' | 'no-preference'
```

```javascript
import { useCssVar } from '@vueuse/core'

// CSS 变量响应式操作
const primaryColor = useCssVar('--primary-color', el)
primaryColor.value = '#007acc'
```

## 传感器与用户状态
---
lang: javascript
emoji: 📡
link: https://vueuse.org/core/useIdle
desc: 追踪用户空闲状态与活动检测
---

```javascript
import { 
  useIdle, 
  usePermission,
  useDeviceOrientation,
  useDeviceMotion,
  useGeolocation,
  useMediaControls
} from '@vueuse/core'

// 用户空闲状态（默认 1 分钟）
const { idle, lastActive } = useIdle(60000)

// 权限请求
const { permission, query: queryPermission } = usePermission('camera')

// 设备方向
const { alpha, beta, gamma } = useDeviceOrientation()

// 设备运动
const { acceleration, rotationRate, interval } = useDeviceMotion()

// 地理位置
const { 
  coords: { latitude, longitude },
  accuracy,
  timestamp
} = useGeolocation()
```

```javascript
import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'

// 媒体查询
const isMobile = useMediaQuery('(max-width: 768px)')
const isDark = useMediaQuery('(prefers-color-scheme: dark)')

// 减少动画偏好
const prefersReducedMotion = usePreferredReducedMotion()
```

## 网络请求
---
lang: javascript
emoji: 🌐
link: https://vueuse.org/core/useFetch
desc: 响应式 Fetch API 封装
---

```javascript
import { useFetch, useAxios } from '@vueuse/core'

// 基础请求
const { data, error, isFetching, abort } = useFetch('/api/user')

// 带配置
const { data, status } = useFetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'foo' }),
  immediate: false,
  timeout: 5000,
  refetch: ref(true)
})

// 监听器
watch(data, (newData) => {
  console.log('response:', newData)
})
```

```javascript
import { useEventSource, useWebSocket } from '@vueuse/core'

// Server-Sent Events
const { data, status, close } = useEventSource('/api/stream')

// WebSocket
const { data, send, close, open, isEstablished } = useWebSocket('ws://localhost:8080')
```

## 定时器与动画
---
lang: javascript
emoji: ⏱️
link: https://vueuse.org/core/useNow
desc: 响应式时间与动画帧
---

```javascript
import { 
  useNow, 
  useTimestamp,
  useDateFormat,
  useTimeAgo,
  useInterval,
  useTimeout
} from '@vueuse/core'

// 当前时间
const now = useNow({ interval: 1000 })

// 时间戳
const timestamp = useTimestamp()

// 格式化
const formatted = useDateFormat(now, 'YYYY-MM-DD HH:mm:ss')

// 相对时间
const timeAgo = useTimeAgo(ref(new Date(Date.now() - 60000)))

// 定时器
const counter = useInterval(1000) // 每秒 +1
const isReady = useTimeout(5000)   // 5 秒后变为 true

// 清理
counter.pause()
counter.resume()
counter.reset()
```

```javascript
import { useRafFn, useAnimationFrame, useSpring } from '@vueuse/core'

// RAF 动画
const { pause, resume } = useRafFn((delta) => {
  // delta 为帧间隔时间(ms)
  position.value += velocity.value * delta
})

// 弹簧动画
const { value, target, precision, stiffness, damping, mass } = useSpring(0, {
  stiffness: 0.1,
  damping: 0.4
})
```

## 响应式 DOM
---
lang: javascript
emoji: 🧩
link: https://vueuse.org/core/useElementBounding
desc: 响应式元素尺寸与位置
---

```javascript
import { 
  useElementBounding,
  useElementSize,
  useElementHover,
  useResizeObserver,
  useMutationObserver
} from '@vueuse/core'

const el = ref(null)

// 元素边界
const { 
  top, right, bottom, left,
  width, height,
  update
} = useElementBounding(el)

// 元素尺寸
const { width, height } = useElementSize(el)

// 元素悬停
const isHovered = useElementHover(el)

// 尺寸变化监听
useResizeObserver(el, (entries) => {
  for (const entry of entries) {
    console.log(entry.contentRect)
  }
})
```

```javascript
import { 
  useDraggable, 
  useDroppable,
  useResizable,
  useMovable
} from '@vueuse/core'

// 可拖拽
const { x, y, isDragging } = useDraggable(el, {
  initialValue: { x: 0, y: 0 },
  handle: handleEl,
  preventDefault: true
})

// 可放置区域
const { isDropped } = useDroppable(targetEl)

// 可调整大小
const { width, height } = useResizable(el)
```

## 响应式表单
---
lang: javascript
emoji: 📝
link: https://vueuse.org/core/useVModel
desc: 响应式表单与双向绑定
---

```javascript
import { 
  useVModel, 
  useModel,
  useInput,
  useTextarea,
  useCheckbox,
  useRadio,
  useSelect,
  useFileSystemAccess
} from '@vueuse/core'

// v-model 简化
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

// 文本输入
const { input, attributes, eventListeners } = useInput('default value')

// 文件系统访问
const { 
  data,
  save,
  open,
  isSupported,
  file: ref(null)
} = useFileSystemAccess({
  dataType: 'Text',
  types: [{ description: 'Text', accept: { 'text/plain': ['.txt'] } }]
})
```

## Watch 工具
---
lang: javascript
emoji: 👁️
link: https://vueuse.org/core/until
desc: Vue Watch 增强工具
---

```javascript
import { 
  until, 
  watchOnce,
  watchDebounced,
  watchThrottled,
  watchArray,
  watchDeep,
  whenever
} from '@vueuse/core'

// 等待条件满足（一次性）
await until(ref(0)).toBeGreaterThan(10)
await until(isLoading).toBe(false)

// 只监听一次
watchOnce(source, (val) => {
  console.log('first change:', val)
})

// 防抖监听
watchDebounced(source, () => {}, { debounce: 500, maxWait: 1000 })

// 节流监听
watchThrottled(source, () => {}, { throttle: 500, leading: true, trailing: false })

// 数组变化监听
watchArray(items, (array, diffs) => {
  console.log('added:', diffs.added)
  console.log('removed:', diffs.removed)
}, { deep: true })

// 深度监听简写
watchDeep(source, () => {})

// 条件监听
whenever(isLoggedIn, () => {
  console.log('user logged in!')
})
```

## Reactivity 工具
---
lang: javascript
emoji: ⚡
link: https://vueuse.org/core/reactify
desc: 响应式转换与工具函数
---

```javascript
import { 
  reactive, 
  ref, computed,
  refAutoReset,
  syncRef,
  syncRefs,
  toRef,
  toRefs,
  createRef,
  isDefined,
  isRef,
  unref,
  triggerRef
} from '@vueuse/core'

// 自动重置 ref
const counter = refAutoReset(0, 1000)

// 同步两个 ref
const source = ref('hello')
const target = ref('')
syncRef(source, target)

// 同步多个 ref
const data = ref({ a: 1, b: 2 })
syncRefs(data, { a: ref(0), b: ref(0) })

// 类型守卫
if (isDefined(value)) {
  // value 在此处类型收窄
}

// 手动触发更新
triggerRef(counter)
```

```javascript
import { 
  reactify,
  reactifyObject,
  createUnrefFn,
  createReactiveFn,
  toReactive
} from '@vueuse/core'

// 普通函数转响应式
const getRandom = () => Math.random()
const reactiveRandom = reactify(getRandom)

// 批量响应式
const obj = { a: 1, b: 2 }
const reactiveObj = toReactive(obj)

// 深度响应式包装
const deepReactive = createReactiveFn(target)
```

## Array 工具
---
lang: javascript
emoji: 🔢
link: https://vueuse.org/core/useArray
desc: 响应式数组操作
---

```javascript
import { 
  useArrayFilter,
  useArrayFind,
  useArrayFindLast,
  useArrayJoin,
  useArrayMap,
  useArrayReduce,
  useArraySome,
  useArrayEvery,
  useUnique,
  useSorted
} from '@vueuse/core'

// 响应式数组操作
const filtered = useArrayFilter(list, (item) => item.age > 18)
const found = useArrayFind(list, (item) => item.id === 1)
const mapped = useArrayMap(list, (item) => item.name)

// 数组去重
const uniqueList = useUnique(items)

// 数组排序
const sorted = useSorted(items, (a, b) => a - b)

// 组合操作
const result = computed(() => 
  useArrayFilter(
    useArrayMap(items, i => i * 2),
    i => i > 10
  )
)
```

## Component 组件工具
---
lang: javascript
emoji: 🧩
link: https://vueuse.org/core/templateRef
desc: 简化组件 ref 操作
---

```javascript
import { 
  templateRef,
  useTemplateRefsList,
  unrefElement,
  useChild,
  useParent
} from '@vueuse/core'

// 模板 ref（自动解包）
const el = templateRef<HTMLElement>('my-element')

// 列表 ref
const refs = useTemplateRefsList<HTMLDivElement>()

// 获取 DOM 元素
const dom = unrefElement(el)

// 父子组件通信
const parent = useParent()
const children = useChild()
```

```javascript
import { 
  computedAsync,
  computedEager,
  computedWithControl,
  controlledComputed,
  controlledRef,
  debouncedRef,
  lazyRef,
  refDebounced,
  refThrottled,
  refWithControl
} from '@vueuse/core'

// 异步计算属性
const user = computedAsync(async () => {
  return await fetchUser(id.value)
})

// 立即计算（不追踪依赖）
const eagerVal = computedEager(() => expensive())

// 防抖/节流 ref
const debouncedInput = refDebounced(input, 500)
const throttledValue = refThrottled(value, 1000)

// 受控 ref
const controlled = refWithControl(initialValue)
```

## Utilities 工具函数
---
lang: javascript
emoji: 🔧
link: https://vueuse.org/core/useAsyncQueue
desc: 异步队列与工具函数
---

```javascript
import { 
  useAsyncQueue,
  useAsyncTask,
  useDebounceFn,
  useThrottleFn,
  useMemoize,
  useCached,
  useToggle,
  useTruncated,
  useUrlSearchParams,
  useQueryParam,
  useRouteQuery
} from '@vueuse/core'

// 异步任务队列
const { result, index } = await useAsyncQueue([
  () => fetch('/api/1').then(r => r.json()),
  () => fetch('/api/2').then(r => r.json()),
])

// 防抖/节流函数
const debouncedFn = useDebounceFn(() => {}, 300)
const throttledFn = useThrottleFn(() => {}, 100)

// 记忆化
const fetchUser = useMemoize(async (id) => {
  return await api.getUser(id)
})

// 布尔切换
const [value, toggle] = useToggle(false)

// URL 参数
const params = useUrlSearchParams('history')
const page = useQueryParam('page')
const sort = useRouteQuery('sort', 'date')
```

## Nuxt 集成
---
lang: javascript
emoji: 🟢
link: https://vueuse.org/guide/nuxt.html
desc: Nuxt 3 自动导入配置
---

```bash
# 安装
npm i -D @vueuse/nuxt @vueuse/core
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt'],
  vueuse: {
    // 配置选项
    ssrExceptions: ['useLocalStorage'],
    autoImports: ['useMouse'],
  }
})
```

```vue
<script setup lang="ts">
// 自动导入，无需手动 import
const { x, y } = useMouse()
const isDark = useDark()
const store = useLocalStorage('app', {})
</script>
```

```html
<!-- 组件中使用 -->
<template>
  <div>Mouse: {{ x }}, {{ y }}</div>
  <div>Dark: {{ isDark }}</div>
</template>
```

## 全局配置
---
lang: javascript
emoji: ⚙️
link: https://vueuse.org/guide/config.html
desc: VueUse 全局配置
---

```javascript
import { 
  useVueUse,
  configRef,
  setGlobalDefaults
} from '@vueuse/core'

// 全局默认配置
setGlobalDefaults({
  window: window,
  document: document,
  silent: false,
})

// 运行时配置
configRef({
  // 响应式配置
  window: window,
  eventFilters: {
    throttle: (fn) => fn,
    debounce: (fn) => fn
  }
})
```

```javascript
// 自定义事件过滤器
import { eventFilter, throttleFilter, debounceFilter } from '@vueuse/core'

// 全局配置
setGlobalDefaults({
  eventFilter: throttleFilter(100)
})

// 单次使用覆盖
useMouse({ eventFilter: debounceFilter(200) })
```
