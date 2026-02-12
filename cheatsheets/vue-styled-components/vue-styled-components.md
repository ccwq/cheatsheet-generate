# Vue Styled Components 速查表

## 核心 API

### `styled` 工厂函数
用于创建样式化组件。

```javascript
import { styled } from '@vue-styled-components/core'

// 方式 1: 标签函数
const StyledDiv = styled.div`
  color: red;
`

// 方式 2: 工厂函数 (支持组件和属性定义)
const StyledButton = styled('button', { size: String })`
  padding: ${props => props.size === 'large' ? '20px' : '10px'};
`
```

### `props` 定义
显式定义 props 以便在样式中使用。

```javascript
const StyledInput = styled.input.props({
  borderColor: { type: String, default: '#ccc' }
})`
  border: 1px solid ${props => props.borderColor};
`
```

### `attrs` 属性设置
静态或动态设置组件属性。

```javascript
const StyledInput = styled.input.attrs({
  type: 'password'
})`
  border: 1px solid blue;
`

const DynamicInput = styled.input.attrs(props => ({
  placeholder: props.hint
}))`
  color: red;
`
```

### `keyframes` 动画
使用 keyframes 函数定义关键帧动画。

```javascript
const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

const AnimatedBox = styled.div`
  animation: ${fadeIn} 1s ease-in;
`
```

## 主题系统

### ThemeProvider
通过 ThemeProvider 为组件设置主题。

```javascript
import { ThemeProvider, styled } from '@vue-styled-components/core'

const theme = {
  primary: '#007bff',
  background: '#f8f9fa'
}

const StyledDiv = styled.div`
  background: ${props => props.theme.background};
  color: ${props => props.theme.primary};
`

// 使用
<ThemeProvider :theme="theme">
  <StyledDiv>主题化组件</StyledDiv>
</ThemeProvider>
```

### useTheme Hook
在组件内获取当前主题。

```javascript
import { useTheme } from '@vue-styled-components/core'

const theme = useTheme()
const Box = styled.div`
  color: ${theme.primary};
`
```

## 辅助函数

### `createGlobalStyle` 全局样式
```javascript
import { createGlobalStyle } from '@vue-styled-components/core'

const GlobalStyle = createGlobalStyle`
  body { margin: 0; padding: 0; }
`
```

### `css` 样式复用
```javascript
import { css } from '@vue-styled-components/core'

// 基础用法
const mixin = css`
  color: white;
  background: black;
`

// 条件样式
const hoverMixin = css`
  &:hover { opacity: 0.8; }
`
```

### `cssClass` 独立类名
```javascript
import { cssClass } from '@vue-styled-components/core'

const myClass = cssClass`
  font-size: 20px;
`
```

### `withAttrs` 属性增强
```javascript
import { withAttrs } from '@vue-styled-components/core'

const Div = withAttrs('div', {
  class: 'custom-div'
})
```

## 进阶特性

### 自动前缀
默认自动添加浏览器私有前缀。

```javascript
import { styled } from '@vue-styled-components/core'

const FlexBox = styled.div`
  display: flex;
`

// 输出包含 -webkit-box, -webkit-flex, -ms-flexbox 前缀
```

### 插件系统 (v1.9+)
自定义 CSS 生成钩子。

```javascript
import { register } from '@vue-styled-components/core'

// 在 app.mount() 之前注册
const plugin = register({
  beforeBuild: (element) => {
    if (element.children === 'red') {
      element.return = 'color: blue'
    }
  },
  afterBuild: (css) => {
    return css.replace(/color:red/g, 'color:blue')
  }
})
```

### 性能优化 (v1.12+)
样式缓存、批量更新和性能监控。

```javascript
import { configureStyleProcessing } from '@vue-styled-components/core'

// 生产环境配置
configureStyleProcessing({
  enableCache: true,
  cacheSize: 2000,
  enableBatchUpdates: true,
  batchDelay: 8,
  enableAsync: true
})
```

## 样式复用

### 扩展样式
继承已有样式化组件。

```javascript
const BaseButton = styled.button`
  padding: 8px 16px;
`

const BlueButton = styled(BaseButton)`
  color: blue;
`
```

### 样式化任意组件
为第三方或自定义组件添加样式。

```javascript
import MyComponent from './MyComponent.vue'
const StyledComp = styled(MyComponent)`
  margin: 10px;
`
```
