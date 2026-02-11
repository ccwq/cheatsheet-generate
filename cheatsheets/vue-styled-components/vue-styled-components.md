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

## 辅助函数

### `createGlobalStyle` 全局样式
```javascript
import { createGlobalStyle } from '@vue-styled-components/core'

const GlobalStyle = createGlobalStyle`
  body { margin: 0; padding: 0; }
`
```

### `keyframes` 动画
```javascript
import { keyframes } from '@vue-styled-components/core'

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`
```

### `css` 样式复用
```javascript
import { css } from '@vue-styled-components/core'

const mixin = css`
  color: white;
  background: black;
`
```

### `cssClass` 独立类名
```javascript
import { cssClass } from '@vue-styled-components/core'

const myClass = cssClass`
  font-size: 20px;
`
```
