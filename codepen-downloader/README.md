CodePen 下载器

功能
- 读取根目录 `links.md` 中的首个 ```json 代码块，解析为列表
- 对每一项下载：
  - HTML：抓取 CodePen 包装页并提取 `srcdoc`，保存为最终页面
  - 图标：下载 `src` 指向的文件，保留真实扩展名
- 同时保存提取前与提取后的 HTML：
  - `source.html`（原始响应/包装页，已 trim）
  - `index.html`（最终 HTML，若为 CodePen 则为 `srcdoc`，无 `<iframe>`，必要时补全 `<html>` 包裹）

输出目录结构
- `cheatsheets-import/{slug}/index.html`
- `cheatsheets-import/{slug}/source.html`
- `cheatsheets-import/{slug}/icon.*`

`{slug}` 来自 `name` 的安全化形式（重名自动加序号）。

运行方式
- 依赖：Node.js 16+（推荐 18+）
- 首次安装依赖：
  - `npm install`
- 使用 npm 脚本（根目录提供）：
  - 全量下载：`npm run download`
  - 试运行（不联网/不写盘）：`npm run download:dry`
  - 过滤与限量：`npm run download -- --only "关键词" --limit 5`
- 直接运行（可选）：
  - `node codepen-downloader/codepen-downloader.js [--only "关键词"] [--limit N] [--dry-run]`

代理配置（可选）
- 在项目根目录创建 `.env`：
  - `PROXY_URL=http://localhost:7897`
  - 也支持 `HTTPS_PROXY` 或 `HTTP_PROXY`
- 启用后，控制台会打印 `Proxy enabled: http://localhost:7897`，每次 GET 日志尾部显示 `(via proxy)`。

