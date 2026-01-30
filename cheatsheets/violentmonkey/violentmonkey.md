# Violentmonkey 速查表

## 元数据块 (Metadata Block)

脚本头部配置，定义脚本的基本信息、权限和运行规则。

```javascript
// ==UserScript==
// @name            脚本名称
// @namespace       https://example.com/namespace
// @version         1.0.0
// @description     脚本功能描述
// @author          Your Name
// @license         MIT
// @match           https://example.com/*
// @include         /^https?://www\.example\.com/.*$/
// @exclude         https://example.com/ad/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_addValueChangeListener
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_registerMenuCommand
// @grant           GM_notification
// @grant           GM_setClipboard
// @grant           GM_openInTab
// @grant           GM_log
// @grant           unsafeWindow
// @require         https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @resource        customCSS https://example.com/style.css
// @resource        icon https://example.com/icon.png
// @run-at          document-end
// @noframes
// @connect         api.example.com
// @connect         *
// ==/UserScript==
```

### 元数据指令详解

| 指令 | 说明 | 示例 |
|------|------|------|
| `@name` | 脚本名称，显示在管理器中 | `// @name 视频去广告` |
| `@namespace` | 唯一命名空间，用于区分同名脚本 | `// @namespace https://github.com/user` |
| `@version` | 版本号，用于更新检测 | `// @version 1.2.3` |
| `@description` | 功能描述 | `// @description 自动跳过视频广告` |
| `@author` | 作者信息 | `// @author Your Name` |
| `@license` | 开源许可证 | `// @license MIT` |
| `@match` | URL 匹配规则（推荐，更安全） | `// @match https://*.youtube.com/*` |
| `@include` | URL 包含规则（支持通配符和正则） | `// @include /https:\/\/.*\.com\/.*/` |
| `@exclude` | 排除特定 URL | `// @exclude https://example.com/login` |
| `@grant` | 申请特权 API 权限 | `// @grant GM_setValue` |
| `@require` | 引入外部 JS 库 | `// @require https://cdn.js...` |
| `@resource` | 引入外部资源文件 | `// @resource css https://.../style.css` |
| `@run-at` | 脚本执行时机 | `// @run-at document-start` |
| `@noframes` | 禁止在 iframe 中运行 | `// @noframes` |
| `@connect` | 允许跨域请求的域名 | `// @connect api.github.com` |

### 执行时机 (@run-at)

| 值 | 说明 |
|----|------|
| `document-start` | 文档开始加载时执行（最早） |
| `document-body` | `<body>` 元素出现时执行 |
| `document-end` | DOM 加载完成时执行（默认） |
| `document-idle` | 页面完全加载后执行（最晚） |

### 匹配规则对比

```javascript
// @match 语法 - 更严格、更安全（推荐）
// @match *://*/*              匹配所有 http/https
// @match https://google.com/*  匹配特定域名
// @match https://github.com/*/issues

// @include 语法 - 支持通配符和正则
// @include http://example.com/*      通配符匹配
// @include /^https:\/\/.*\.com\/.*/  正则匹配
// @include *                         匹配所有（不推荐）
```

## 数据存储 API

用于在本地持久化存储数据。

```javascript
// 存储数据（支持任意可序列化类型）
GM_setValue('config', { theme: 'dark', autoPlay: true });
GM_setValue('count', 42);
GM_setValue('username', 'admin');

// 读取数据（支持默认值）
const config = GM_getValue('config', { theme: 'light' });
const count = GM_getValue('count', 0);
const username = GM_getValue('username', 'guest');

// 删除数据
GM_deleteValue('config');

// 列出所有键
const keys = GM_listValues();
keys.forEach(key => console.log(key));

// 监听数据变化（跨标签页同步）
GM_addValueChangeListener('config', (name, oldValue, newValue, remote) => {
  console.log(`配置${remote ? '从其他页面' : ''}发生变化:`, newValue);
});
```

## 网络请求 API

跨域请求需在元数据中声明 `@connect`。

```javascript
// GET 请求
GM_xmlhttpRequest({
  method: 'GET',
  url: 'https://api.example.com/data',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  onload: function(response) {
    if (response.status === 200) {
      const data = JSON.parse(response.responseText);
      console.log('成功:', data);
    }
  },
  onerror: function(error) {
    console.error('请求失败:', error);
  },
  ontimeout: function() {
    console.error('请求超时');
  }
});

// POST 请求
GM_xmlhttpRequest({
  method: 'POST',
  url: 'https://api.example.com/submit',
  headers: { 'Content-Type': 'application/json' },
  data: JSON.stringify({ id: 123, name: 'test' }),
  onload: (res) => console.log(res.responseText)
});

// 同步请求（不推荐，会阻塞）
const response = GM_xmlhttpRequest({
  method: 'GET',
  url: 'https://api.example.com/data',
  synchronous: true
});
```

## 样式与资源 API

```javascript
// 注入 CSS 样式
GM_addStyle(`
  #my-panel {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 99999;
    background: #fff;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .hidden { display: none !important; }
`);

// 获取外部资源内容（需先在元数据中声明 @resource）
// @resource myCSS https://example.com/style.css
const cssText = GM_getResourceText('myCSS');
GM_addStyle(cssText);

// @resource icon https://example.com/icon.png
const iconUrl = GM_getResourceURL('icon');
// 返回 base64 编码的数据 URL
imgElement.src = iconUrl;
```

## 界面交互 API

```javascript
// 注册脚本菜单命令（显示在 Violentmonkey 图标下拉菜单中）
GM_registerMenuCommand('⚙️ 打开设置', () => {
  toggleSettingsPanel();
}, 's'); // 第三个参数为快捷键

GM_registerMenuCommand('🔄 刷新数据', refreshData);

// 显示桌面通知
GM_notification({
  text: '任务已完成',
  title: '脚本通知',
  image: 'https://example.com/icon.png',
  onclick: () => {
    console.log('用户点击了通知');
  },
  ondone: () => {
    console.log('通知关闭');
  }
});

// 简单通知写法
GM_notification('任务完成', '提示');

// 写入剪贴板
GM_setClipboard('要复制的文本内容');
GM_setClipboard('<h1>HTML内容</h1>', { type: 'text/html' });

// 在新标签页打开链接
GM_openInTab('https://example.com', {
  active: false,  // 是否在后台打开
  insert: true    // 是否插入到当前标签页旁边
});

// 控制台日志（带脚本标识）
GM_log('调试信息');
```

## DOM 观察 (MutationObserver)

处理动态加载的内容（SPA 单页应用必备）。

```javascript
// 基础用法：监听整个文档的变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // 检查新增节点
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) { // 元素节点
        // 检查是否匹配目标元素
        if (node.matches('.ad-banner')) {
          node.remove();
        }
        // 检查子元素
        node.querySelectorAll('.ad-banner').forEach(el => el.remove());
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,  // 监听子节点增删
  subtree: true,    // 监听所有后代节点
  attributes: true, // 监听属性变化
  attributeFilter: ['class', 'style'] // 只监听特定属性
});

// 停止观察
// observer.disconnect();
```

## 实用代码片段

### 等待元素出现

```javascript
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    // 如果元素已存在，直接返回
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    // 创建观察器
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 超时处理
    if (timeout > 0) {
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`等待元素 ${selector} 超时`));
      }, timeout);
    }
  });
}

// 使用示例
(async () => {
  try {
    const button = await waitForElement('.submit-btn');
    button.click();
  } catch (err) {
    console.error(err);
  }
})();
```

### 等待多个元素

```javascript
function waitForElements(selector, count = 1, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const check = () => {
      const elements = document.querySelectorAll(selector);
      if (elements.length >= count) {
        observer.disconnect();
        resolve(Array.from(elements));
        return true;
      }
      return false;
    };

    if (check()) return;

    const observer = new MutationObserver(() => check());
    observer.observe(document.body, { childList: true, subtree: true });

    if (timeout > 0) {
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`等待 ${count} 个 ${selector} 超时`));
      }, timeout);
    }
  });
}
```

### 防抖与节流

```javascript
// 防抖：延迟执行，只执行最后一次
function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流：固定间隔执行
function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 使用示例
window.addEventListener('scroll', throttle(() => {
  console.log('滚动事件');
}, 200));
```

### 创建浮动面板

```javascript
function createPanel(html, options = {}) {
  const panel = document.createElement('div');
  panel.id = options.id || 'userscript-panel';
  panel.innerHTML = html;
  
  // 默认样式
  GM_addStyle(`
    #${panel.id} {
      position: fixed;
      top: ${options.top || '10px'};
      right: ${options.right || '10px'};
      z-index: ${options.zIndex || '99999'};
      background: ${options.bg || '#fff'};
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: -apple-system, sans-serif;
      font-size: 14px;
    }
    #${panel.id} .close-btn {
      position: absolute;
      top: 4px;
      right: 8px;
      cursor: pointer;
      opacity: 0.5;
    }
    #${panel.id} .close-btn:hover { opacity: 1; }
  `);

  // 关闭按钮
  if (options.closable !== false) {
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => panel.remove();
    panel.appendChild(closeBtn);
  }

  document.body.appendChild(panel);
  return panel;
}

// 使用
createPanel(`
  <h3>脚本控制面板</h3>
  <button id="btn-action">执行操作</button>
`, { id: 'my-panel', top: '60px' });
```

## 现代 API (GM.*)

Greasemonkey 4+ 风格的异步 API，返回 Promise。

```javascript
(async () => {
  // 数据存储（异步版本）
  await GM.setValue('key', { data: 'value' });
  const value = await GM.getValue('key', 'default');
  await GM.deleteValue('key');
  const keys = await GM.listValues();
  
  // 网络请求
  const response = await new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: 'GET',
      url: 'https://api.example.com/data',
      onload: resolve,
      onerror: reject
    });
  });
  
  // 注意：GM.xmlHttpRequest 回调方式不变
  // 其他 API 与同步版本类似
})();
```

### 新旧 API 对比

| 旧 API (同步) | 新 API (异步) | 说明 |
|--------------|--------------|------|
| `GM_setValue` | `GM.setValue` | 存储数据 |
| `GM_getValue` | `GM.getValue` | 读取数据 |
| `GM_deleteValue` | `GM.deleteValue` | 删除数据 |
| `GM_listValues` | `GM.listValues` | 列出键名 |
| `GM_xmlhttpRequest` | `GM.xmlHttpRequest` | 网络请求（注意大小写） |

## 调试技巧

### 使用 unsafeWindow

```javascript
// 访问页面原生的 window 对象
unsafeWindow.nativeFunction();
unsafeWindow.jQuery = unsafeWindow.$;

// 在页面控制台暴露变量供调试
unsafeWindow.myScriptDebug = {
  config: myConfig,
  data: myData
};
// 然后在浏览器控制台输入 myScriptDebug 查看
```

### 日志标记

```javascript
const log = (...args) => console.log('[MyScript]', ...args);
const warn = (...args) => console.warn('[MyScript]', ...args);
const error = (...args) => console.error('[MyScript]', ...args);

log('脚本已加载');
error('发生错误:', err);
```

### 错误捕获

```javascript
// 全局错误捕获
window.addEventListener('error', (e) => {
  console.error('[MyScript] 全局错误:', e.error);
});

// Promise 错误捕获
window.addEventListener('unhandledrejection', (e) => {
  console.error('[MyScript] 未处理的 Promise 错误:', e.reason);
});

// 包装异步函数
async function safeAsync(fn, ...args) {
  try {
    return await fn(...args);
  } catch (err) {
    console.error('[MyScript] 执行失败:', err);
  }
}
```

## 完整示例脚本

```javascript
// ==UserScript==
// @name         示例脚本 - 自动暗黑模式
// @namespace    https://github.com/example
// @version      1.0.0
// @description  为不支持暗黑模式的网站自动切换
// @author       You
// @match        https://example.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  // 配置
  const CONFIG_KEY = 'darkModeEnabled';
  let isEnabled = GM_getValue(CONFIG_KEY, true);

  // 暗黑模式样式
  const darkStyles = `
    html, body {
      background-color: #1a1a1a !important;
      color: #e0e0e0 !important;
    }
    a { color: #4da6ff !important; }
  `;

  // 应用/移除样式
  function applyDarkMode() {
    if (isEnabled) {
      GM_addStyle(darkStyles);
    }
  }

  // 切换功能
  function toggleDarkMode() {
    isEnabled = !isEnabled;
    GM_setValue(CONFIG_KEY, isEnabled);
    location.reload();
  }

  // 注册菜单
  GM_registerMenuCommand('🌙 切换暗黑模式', toggleDarkMode);

  // 初始化
  applyDarkMode();
  console.log('[DarkMode] 脚本已加载，状态:', isEnabled ? '开启' : '关闭');
})();
```
