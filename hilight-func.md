# Cheatsheet 代码高亮实现指南

## 🎯 概述

本指南提供为 cheatsheet 页面添加代码语法高亮功能的完整解决方案，使用 Prism.js 作为核心库。

## 🚀 快速集成（CDN 方式）

### 步骤 1: 添加 Prism.js 依赖

在 HTML 文件的 `<head>` 标签中添加以下代码：

```html
<!-- Prism.js 语法高亮 -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
```

### 步骤 2: 修改代码块格式

将现有的代码块从：
```html
pre>代码内容</
```

修改为：
```html
pre><code class="language-语言">代码内容</code></
```

**常用语言标识符：**
- `language-python` - Python
- `language-bash` - Shell/Bash
- `language-javascript` - JavaScript
- `language-typescript` - TypeScript
- `language-json` - JSON
- `language-yaml` - YAML
- `language-docker` - Dockerfile
- `language-sql` - SQL

### 步骤 3: 初始化脚本

在页面底部（`</body>` 之前）添加初始化脚本：

```html
<script>
// Prism.js 代码高亮初始化
document.addEventListener('DOMContentLoaded', function() {
  // 确保 Prism 已加载
  if (window.Prism) {
    // 高亮所有代码块
    Prism.highlightAll();

    // 可选：添加行号显示
    Prism.plugins.lineNumbers = false; // 禁用行号以保持简洁

    console.log('代码高亮已启用');
  }
});
</script>
```

## 🎨 主题选择

### 推荐主题

1. **prism-tomorrow** - 深色主题，与现有设计协调
2. **prism-coy** - 浅色主题，简洁现代
3. **prism-dark** - 深色主题，对比度高
4. **prism-funky** - 多彩主题，适合编程语言学习

**更换主题：**
将 CSS 链接中的主题名称替换即可：
```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-coy.min.css" rel="stylesheet" />
```

## 🔧 高级配置

### 自定义样式

可以在现有 CSS 中添加自定义样式来覆盖 Prism.js 默认样式：

```css
/* 代码块样式优化 */
pre[class*="language-"] {
  border-radius: 6px;
  font-size: 1em;
  line-height: var(--line-height-base);
  box-shadow: var(--code-shadow);
}

/* 注释样式 */
.token.comment {
  color: #608b4e;
  font-style: italic;
}

/* 关键字样式 */
.token.keyword {
  color: #c678dd;
  font-weight: bold;
}

/* 字符串样式 */
.token.string {
  color: #98c379;
}
```

### 扩展语言支持

如需支持更多语言，可以手动加载特定语言包：

```html
<!-- 支持特定语言 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-go.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-rust.min.js"></script>
```

## 🔍 自动化方案

### Node.js 批量处理脚本

创建 `scripts/add-highlighting.js`：

```javascript
const fs = require('fs');
const path = require('path');

// 配置
const CHEATSHEETS_DIR = './cheatsheets';
const HIGHLIGHT_HEADER = `<!-- Prism.js 语法高亮 -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>`;

const HIGHLIGHT_FOOTER = `<script>
// Prism.js 代码高亮初始化
document.addEventListener('DOMContentLoaded', function() {
  if (window.Prism) {
    Prism.highlightAll();
    Prism.plugins.lineNumbers = false;
    console.log('代码高亮已启用');
  }
});
</script>`;

// 语言检测规则
const languagePatterns = [
  { pattern: /from\s+\w+\s+import/, lang: 'python' },
  { pattern: /pip\s+install/, lang: 'bash' },
  { pattern: /npm\s+(install|run)/, lang: 'bash' },
  { pattern: /const|let|var\s+\w+\s*=/, lang: 'javascript' },
  { pattern: /interface|type\s+\w+/, lang: 'typescript' },
  { pattern: /function\s+\w+\(/, lang: 'javascript' }
];

// 遍历目录
function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.html')) {
      processHtmlFile(fullPath);
    }
  });
}

// 处理 HTML 文件
function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 检查是否已添加高亮支持
  if (content.includes('prism-')) {
    console.log(`跳过已处理文件: ${filePath}`);
    return;
  }

  // 添加 Prism.js 链接
  content = content.replace(
    /(<\/head>\s*<body>)/s,
    `\n  ${HIGHLIGHT_HEADER}\n\n$1`
  );

  // 修改代码块格式
  content = content.replace(
    /<pre>(?!.*<code>)([\s\S]*?)<\/pre>/g,
    (match, codeContent) => {
      const lang = detectLanguage(codeContent.trim());
      return `<pre><code class="language-${lang}">${codeContent}</code></pre>`;
    }
  );

  // 添加初始化脚本
  content = content.replace(
    /<\/body>/,
    `\n  ${HIGHLIGHT_FOOTER}\n</body>`
  );

  fs.writeFileSync(filePath, content);
  console.log(`处理完成: ${filePath}`);
}

// 检测语言
function detectLanguage(code) {
  for (const { pattern, lang } of languagePatterns) {
    if (pattern.test(code)) {
      return lang;
    }
  }
  return 'bash'; // 默认 bash
}

// 执行处理
if (fs.existsSync(CHEATSHEETS_DIR)) {
  processDirectory(CHEATSHEETS_DIR);
  console.log('批量处理完成！');
} else {
  console.error('Cheatsheets 目录不存在');
}
```

### 使用自动化脚本

```bash
# 批量添加高亮功能
node scripts/add-highlighting.js
```

## 🎛️ 可选插件

### 行号显示

```html
<!-- 添加行号插件 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet" />
```

启用行号：
```javascript
Prism.plugins.lineNumbers = true;
```

### 复制代码按钮

```html
<!-- 添加复制插件 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>
```

## 📱 响应式优化

添加移动端适配样式：

```css
/* 移动端代码块优化 */
@media (max-width: 750px) {
  pre[class*="language-"] {
    font-size: 0.9em;
    padding: 6px 8px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
```

## 🔧 故障排除

### 常见问题

1. **高亮不生效**
   - 检查 Prism.js 是否正确加载
   - 确认代码块使用了正确的 `class="language-xxx"` 格式
   - 验证 autoloader 是否支持目标语言

2. **主题样式冲突**
   - 检查现有 CSS 是否覆盖了 Prism.js 样式
   - 调整 CSS 加载顺序

3. **性能问题**
   - 考虑按需加载语言包
   - 使用 CDN 缓存

### 调试方法

```javascript
// 控制台检查 Prism 是否加载
console.log('Prism version:', Prism.version);
console.log('Available languages:', Object.keys(Prism.languages));
```

## 📋 最佳实践清单

- [ ] 选择与项目风格协调的主题
- [ ] 使用语义化的语言标识符
- [ ] 确保移动端可读性
- [ ] 添加适当的错误处理
- [ ] 测试所有支持的语言
- [ ] 优化加载性能
- [ ] 保持代码一致性

## 🌟 扩展建议

1. **主题切换器** - 实现深色/浅色主题切换
2. **语言统计** - 统计最常用的编程语言
3. **代码搜索** - 基于语法结构搜索代码
4. **导出功能** - 支持代码块导出为独立文件
5. **互动高亮** - 鼠标悬停时高亮相关代码

---

*本指南基于 Prism.js 1.29.0 版本编写，适用于 cheatsheet-generate 项目。*