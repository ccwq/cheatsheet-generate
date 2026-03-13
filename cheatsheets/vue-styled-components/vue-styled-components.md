---
title: Vue Styled Components
lang: javascript
version: "v1.13.3"
date: "2025-09-10"
github: vue-styled-components/core
colWidth: 360px
---

# Vue Styled Components

## 🧱 styled 起手式
---
lang: javascript
emoji: 🧱
link: https://vue-styled-components.com/guide/basic/quick-start
desc: 先记住 `styled.tag`、`styled(Component)` 和 `styled('tag', propsDef)` 这三种入口，绝大多数写法都从这里展开。
---

### 创建元素组件

- `styled.div` : 直接创建原生标签组件
- `styled(Component)` : 为已有 Vue 组件包一层样式
- `styled('button', buttonProps)` : 同时声明标签和 props

```javascript
import { styled } from "@vue-styled-components/core";

const buttonProps = {
  variant: String,
  block: Boolean,
};

const Button = styled("button", buttonProps)`
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  width: ${(props) => (props.block ? "100%" : "auto")};
  background: ${(props) =>
    props.variant === "ghost" ? "#edf2f7" : "#2563eb"};
  color: ${(props) =>
    props.variant === "ghost" ? "#0f172a" : "#ffffff"};
`;
```

### 样式化已有组件

```javascript
import { styled } from "@vue-styled-components/core";
import BaseCard from "./BaseCard.vue";

const ElevatedCard = styled(BaseCard)`
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
`;
```

## 🎛️ Props 与 attrs
---
lang: javascript
emoji: 🎛️
link: https://vue-styled-components.com/guide/basic/passing-props
desc: 动态样式通常围绕 props 展开；`attrs` 负责补默认属性，`props()` 负责声明样式里会读取的字段。
---

### 声明样式用到的 props

- `styled('tag', propsDef)` : 推荐，声明更集中
- `styled.tag.props(propsDef)\`...\`` : 链式写法，适合已有标签入口
- props 既能影响样式，也会传给目标组件

```javascript
import { styled } from "@vue-styled-components/core";

const Input = styled.input.props({
  invalid: Boolean,
  size: String,
})`
  border: 1px solid ${(props) => (props.invalid ? "#dc2626" : "#cbd5e1")};
  padding: ${(props) => (props.size === "lg" ? "12px 14px" : "8px 10px")};
  outline: none;
`;
```

### 预设属性

- `.attrs({ ... })` : 固定属性
- `.attrs((props) => ({ ... }))` : 根据 props 动态生成属性

```javascript
import { styled } from "@vue-styled-components/core";

const SearchInput = styled.input
  .attrs((props) => ({
    type: "search",
    placeholder: props.placeholder || "搜索关键字",
  }))`
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
`;
```

## 🎨 主题与 useTheme
---
lang: javascript
emoji: 🎨
link: https://vue-styled-components.com/guide/advances/theming
desc: 主题能力适合处理品牌色、语义色和间距体系；样式函数里直接读 `props.theme`，组合式逻辑里用 `useTheme()`。
---

### ThemeProvider

```javascript
import { ThemeProvider, styled } from "@vue-styled-components/core";

const theme = {
  color: {
    primary: "#2563eb",
    text: "#0f172a",
    surface: "#eff6ff",
  },
};

const Panel = styled.section`
  color: ${(props) => props.theme.color.text};
  background: ${(props) => props.theme.color.surface};
  border-left: 4px solid ${(props) => props.theme.color.primary};
  padding: 16px;
`;
```

```vue
<template>
  <ThemeProvider :theme="theme">
    <Panel>主题样式</Panel>
  </ThemeProvider>
</template>
```

### 在 setup 中读取主题

```javascript
import { computed } from "vue";
import { useTheme } from "@vue-styled-components/core";

export function usePrimaryText() {
  const theme = useTheme();

  return computed(() => theme.value.color.primary);
}
```

## ♻️ 复用样式与 css
---
lang: javascript
emoji: ♻️
link: https://vue-styled-components.com/guide/advances/css-mixin
desc: 当多处共享一段样式片段时，用 `css` 抽 mixin；当你要在已有组件基础上微调时，直接 `styled(Base)` 更省事。
---

### 抽出可复用片段

```javascript
import { css, styled } from "@vue-styled-components/core";

const focusRing = css`
  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }
`;

const buttonBase = css`
  border: none;
  border-radius: 12px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const PrimaryButton = styled.button`
  ${buttonBase}
  ${focusRing}
  background: #2563eb;
  color: #ffffff;
`;
```

### 在已有组件上继续扩展

```javascript
import { styled } from "@vue-styled-components/core";

const BaseButton = styled.button`
  padding: 8px 14px;
  border-radius: 10px;
`;

const DangerButton = styled(BaseButton)`
  background: #dc2626;
  color: #ffffff;
`;
```

## 🌍 全局样式与动画
---
lang: javascript
emoji: 🌍
link: https://vue-styled-components.com/guide/advances/global-style
desc: 全局样式只适合放 reset、主题变量和页面级基线；动画用 `keyframes` 定义，再插入到具体组件里。
---

### `createGlobalStyle`

```javascript
import { createGlobalStyle } from "@vue-styled-components/core";

const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;
  }

  body {
    margin: 0;
    font-family: "Segoe UI", sans-serif;
    background: #f8fafc;
    color: #0f172a;
  }
`;
```

### `keyframes`

```javascript
import { keyframes, styled } from "@vue-styled-components/core";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Toast = styled.div`
  animation: ${fadeUp} 180ms ease-out;
`;
```

## 🔌 插件、前缀与性能
---
lang: javascript
emoji: 🔌
link: https://vue-styled-components.com/guide/advances/plugin
desc: 这一组能力偏工程向：自动前缀默认可用；插件用于介入 CSS 生成过程；性能配置适合大量动态样式场景。
---

### 自动前缀

- 默认会为需要兼容处理的 CSS 生成浏览器前缀
- 常规场景不需要手写浏览器私有前缀

```javascript
import { styled } from "@vue-styled-components/core";

const FlexRow = styled.div`
  display: flex;
  user-select: none;
`;
```

### 注册插件

```javascript
import { register } from "@vue-styled-components/core";

register({
  afterBuild(css) {
    return css.replaceAll("color:red", "color:#dc2626");
  },
});
```

### 性能配置

```javascript
import { configureStyleProcessing } from "@vue-styled-components/core";

configureStyleProcessing({
  enableCache: true,
  cacheSize: 2000,
  enableBatchUpdates: true,
});
```

## ✅ 常见模式与坑
---
lang: javascript
emoji: ✅
link: https://vue-styled-components.com/guide/api/core
desc: 这几个点决定你写出来的是“可维护的动态样式”还是“难以收束的运行时 CSS”。
---

- props 只保留样式真正需要的字段，避免把整坨业务对象塞进样式函数
- 主题里优先放颜色、字号、间距 token，不要把页面级临时状态塞进主题对象
- createGlobalStyle 只处理全局基线，不要把组件局部规则挪进去
- 复用优先级通常是先抽 css 片段，再考虑复制大段模板字符串
- 复杂条件样式优先拆成多个小组件，而不是在一个模板字符串里塞过多三元表达式

```javascript
import { css, styled } from "@vue-styled-components/core";

const ghost = css`
  background: transparent;
  color: #334155;
`;

const solid = css`
  background: #2563eb;
  color: #ffffff;
`;

const SmartButton = styled("button", {
  variant: String,
})`
  ${(props) => (props.variant === "ghost" ? ghost : solid)}
`;
```
