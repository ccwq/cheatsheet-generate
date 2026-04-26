---
title: Playwright 自动化测试
lang: zh
version: "1.54"
date: 2026-04-13
github: microsoft/playwright
colWidth: 12
desc: Microsoft出品的跨浏览器自动化测试工具，支持Chromium、Firefox、WebKit，提供自动等待、网络拦截、可视化调试等特性。
---

## 一眼入口

**这是什么**：Microsoft开发的跨浏览器自动化库，支持Chromium/Firefox/WebKit，提供自动等待、网络拦截、可视化调试。

**最短路径**：安装浏览器 → 写测试 → 运行 `npx playwright test`

**核心优势**：自动等待、强大定位器、跨浏览器、多语言支持

---

## 快速安装

```bash
# 安装Playwright（含浏览器）
npm init playwright@latest
# 或单独安装
npm install @playwright/test
npx playwright install

# 安装指定浏览器
npx playwright install chromium
npx playwright install --with-deps  # 含系统依赖
```

---

## 最小工作流

### 起手式

```typescript
import { test, expect } from '@playwright/test';

test('基础测试', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.getByRole('heading')).toHaveText('Example');
});
```

### 配置文件

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

## 核心类速查

### Browser / BrowserContext / Page

```typescript
// 启动浏览器
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  colorScheme: 'dark',
});
const page = await context.newPage();

// 导航
await page.goto('https://example.com', {
  waitUntil: 'domcontentloaded',  // load | domcontentloaded | networkidle
  timeout: 30000,
});

// 清理
await page.close();
await context.close();
await browser.close();
```

| 类 | 职责 | 隔离级别 |
|---|---|---|
| **Browser** | 浏览器实例 | 整个进程 |
| **BrowserContext** | 浏览器上下文（独立Cookie/缓存） | context级 |
| **Page** | 页面/标签页 | page级 |

---

## 定位器速查

### 语义定位器（推荐）

| 方法 | 用途 | 示例 |
|------|------|------|
| `get_by_role(role, name)` | ARIA角色 | `get_by_role('button', { name: 'Submit' })` |
| `get_by_label(text)` | 表单标签 | `get_by_label('Email').fill('a@b.com')` |
| `get_by_placeholder(text)` | 占位符 | `get_by_placeholder('Search...')` |
| `get_by_text(text)` | 可见文本 | `get_by_text('Welcome')` |
| `get_by_alt_text(text)` | alt属性 | `get_by_alt_text('logo')` |
| `get_by_title(text)` | title属性 | `get_by_title('Close')` |
| `get_by_test_id(id)` | data-testid | `get_by_test_id('directions')` |

### CSS / XPath

```typescript
page.locator('button.submit')           // CSS类
page.locator('#submit-btn')             // CSS ID
page.locator('[data-testid="btn"]')     // 属性
page.locator('xpath=//button[1]')       // XPath
page.locator('//button[text()="Go"]')   // XPath文本
```

### 过滤与链式

```typescript
// 文本过滤
page.get_by_role('listitem').filter(has_text='Product 2')

// 组合定位
page.get_by_role('dialog').filter(
  has=page.get_by_role('heading', { name: 'Confirm' })
)

// nth / first / last
page.get_by_role('listitem').nth(2)
page.get_by_role('listitem').first
page.get_by_role('listitem').last

// iframe定位
page.frame_locator('#iframe-id').get_by_role('button').click()
```

---

## 常用操作速查

### 点击与输入

```typescript
// 点击
await page.getByRole('button').click()
await page.locator('.btn').click({ button: 'right', clickCount: 2 })

// 填充（清空后输入）
await page.getByLabel('Email').fill('test@example.com')

// 按键输入（逐字符，有延迟）
await page.getByPlaceholder('Search').type('query', { delay: 50 })

// 特殊键
await page.locator('input').press('Enter')
await page.locator('input').press('Control+A')
await page.locator('input').press('Tab')
```

### 表单操作

```typescript
// 下拉选择
await page.locator('select').selectOption('value')
await page.getByRole('combobox').select_option(['val1', 'val2'])

// 复选框
await page.get_by_role('checkbox', { name: 'Remember me' }).check()

// 清空
await page.get_byLabel('Input').clear()
```

### 文件与对话框

```typescript
// 文件上传
await page.setInputFiles('input[type=file]', 'path/to/file.png')
await page.setInputFiles('input[type=file]', [])  // 清空

// 对话框处理
page.on('dialog', dialog => dialog.accept('answer'))
page.on('dialog', dialog => dialog.dismiss())

// 文件下载
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Download' }).click(),
]);
await download.saveAs('/path/to/file');
```

---

## 等待策略速查

| 策略 | 用法 | 场景 |
|------|------|------|
| **自动等待** | `await page.getByRole('button').click()` | 默认，元素就绪自动等待 |
| **显式等待** | `await page.waitForSelector('.loaded', { timeout: 5000 })` | 特定条件 |
| **网络等待** | `await page.waitForLoadState('networkidle')` | API调用后 |
| **函数等待** | `await page.waitForFunction(() => window.status === 'ready')` | 条件判断 |
| **响应等待** | `await page.waitForResponse(url => url.includes('/api'))` | 拦截响应 |

```typescript
// expect系列
await expect(page.getByRole('heading')).toHaveText('Welcome')
await expect(page.getByLabel('Email')).toHaveValue('test@example.com')
await expect(page.locator('.loading')).toBeHidden()

// 软断言（不中断测试）
await expect.soft(page.getByRole('heading')).toHaveText('Welcome')
```

---

## 截图与PDF

```typescript
// 普通截图
await page.screenshot({ path: 'screenshot.png' })

// 全页截图
await page.screenshot({ path: 'full.png', fullPage: true })

// 元素截图
await page.locator('.header').screenshot({ path: 'header.png' })

// 截图对比（视觉回归）
await expect(page).toHaveScreenshot('home.png', {
  maxDiffPixels: 100,
  maxDiffPixelRatio: 0.2,
})

// PDF（仅Chromium）
await page.emulate_media({ media: 'screen' })
await page.pdf({
  path: 'output.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '1cm', bottom: '1cm' },
})
```

---

## 网络拦截速查

```typescript
// 拦截请求
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());

// 修改响应
await page.route('**/api/**', async route => {
  if (route.request().url().includes('/api/data')) {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ mock: true }),
    });
  } else {
    await route.continue();
  }
});

// 等待请求/响应
const [response] = await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/api') && resp.status() === 200),
  page.getByText('Submit').click(),
]);
```

---

## CLI命令速查

| 命令 | 说明 | 常用选项 |
|------|------|----------|
| `npx playwright test` | 运行测试 | `--headed`, `--debug`, `-g <grep>`, `--project` |
| `npx playwright install` | 安装浏览器 | `--with-deps`, `--force`, `chromium` |
| `npx playwright show-report` | 显示报告 | `--port 8080` |
| `npx playwright codegen [url]` | 生成测试代码 | `--target=python`, `--device="iPhone 13"` |
| `npx playwright open [url]` | 快速打开页面 | `--browser=chromium`, `--device` |
| `npx playwright screenshot <url> <file>` | 页面截图 | `--full-page` |
| `npx playwright show-trace <file>` | 查看跟踪 | `--port 8080` |

### 调试模式

```bash
# 启动调试器
npx playwright test --debug

# 浏览器控制台访问playwright对象
PWDEBUG=console npx playwright test

# 在测试中暂停
await page.pause();
```

---

## Trace Viewer

```typescript
// 配置跟踪录制
export default defineConfig({
  use: { trace: 'on-first-retry' },
});

// 手动控制
await page.tracing.start({ screenshots: true, snapshots: true });
// ... 执行操作 ...
await page.tracing.stop();
```

```bash
# 查看跟踪文件
npx playwright show-trace trace.zip
```

---

## 高频场景Recipes

### 场景1：表单提交测试

```typescript
test('登录表单提交', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL('**/dashboard');
  await expect(page.getByRole('heading')).toHaveText('Welcome');
});
```

### 场景2：数据抓取

```typescript
test('抓取产品列表', async ({ page }) => {
  await page.goto('/products');

  const products = await page.locator('.product-item').evaluateAll(
    items => items.map(item => ({
      title: item.querySelector('h3')?.textContent,
      price: item.querySelector('.price')?.textContent,
    }))
  );

  console.log(products);
});
```

### 场景3：跨浏览器配置

```typescript
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

### 场景4：代理与认证状态

```typescript
// 代理配置
const context = await browser.newContext({
  proxy: {
    server: 'http://proxy:3128',
    username: 'user',
    password: 'pass',
  },
});

// 保存/加载认证状态
await page.context().storageState({ path: 'auth.json' });
const context2 = await browser.newContext({
  storageState: './auth.json',
});
```

---

## Page Object模式

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }

  async expectError() {
    await expect(this.page.locator('.error')).toBeVisible();
  }
}

// tests/login.spec.ts
test('登录失败', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('bad@example.com', 'wrong');
  await loginPage.expectError();
});
```

---

## Fixtures与Hooks

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

export test = base.extend({
  loginPage: async ({ page }, use) => {
    const lp = new LoginPage(page);
    await lp.goto();
    await use(lp);
  },

  authenticatedPage: async ({ browser }, use) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    // 执行登录...
    await use(page);
    await ctx.close();
  },
});

// 使用
test('用户资料', async ({ authenticatedPage }) => {
  // 已登录状态
});
```

---

## 测试分类与命名

```typescript
// 按标签分类
test.describe('Login', () => {
  test('验证邮箱格式 @slow', async ({ page }) => {});
  test('密码错误提示 @smoke', async ({ page }) => {});
});

// 运行特定标签
// npx playwright test --grep @smoke
// npx playwright test --grep-invert @slow
```

---

## 常见坑与风险点

| 坑 | 原因 | 解决方案 |
|---|---|---|
| **固定延迟** | `waitForTimeout` 不稳定 | 使用自动等待或 `waitForSelector` |
| **networkidle不可靠** | 现代SPA持续请求 | 使用 `waitForLoadState('load')` |
| **iframe操作失败** | 未使用frameLocator | `page.frameLocator('#iframe').locator(...)` |
| **上下文共享** | 测试间状态污染 | 每个测试用独立context |
| **截图不一致** | 视口/字体差异 | 配置统一viewport和使用字体 |

---

## Quick Ref

```typescript
// 最小启动
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await browser.close();
})();

// 常用配置速记
timeout: 30000          // 默认超时
waitUntil: 'load'       // 导航等待
headless: true          // 无头模式
fullPage: true          // 全页截图
```

---

## 参考资源

- 官方文档：https://playwright.dev
- API参考：https://playwright.dev/docs/api/class-page
- 配置指南：https://playwright.dev/docs/test-configuration
- 最佳实践：https://playwright.dev/docs/best-practices
- Trace Viewer：https://playwright.dev/docs/trace-viewer
