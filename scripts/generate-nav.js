#!/usr/bin/env node
/*
 * 导览页生成脚本
 * - 扫描 ./cheatsheets 与 ./cheatsheets-import 下的各个子目录
 * - 读取 desc.md 的第一行作为“一句话介绍”
 * - 寻找该目录下的入口 HTML（优先 index.html，其次与目录同名的 .html，再次按字母序第一个 .html）
 * - 使用 templates/nav.template.html 作为模版，渲染为仓库根目录的 ./index.html
 */

const fs = require('fs/promises');
const path = require('path');
const he = require('he');
const yaml = require('js-yaml');
const pkg = require(path.join(process.cwd(), 'package.json'));

// 需要扫描的 cheatsheet 根目录
// 决策：仅从 `cheatsheets/` 目录收集数据，避免发布时混入导入源目录
const ROOTS = ['cheatsheets'];
const TEMPLATE_PATH = path.join(process.cwd(), 'templates', 'nav.template.html');
const OUTPUT_PATH = path.join(process.cwd(), 'index.html');

/**
 * 读取文件是否存在
 */
async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

/**
 * 从 meta.yml 中读取元数据
 */
async function readMeta(dirPath) {
  const p = path.join(dirPath, 'meta.yml');
  if (!(await exists(p))) return {};
  try {
    const content = await fs.readFile(p, 'utf8');
    return yaml.load(content) || {};
  } catch (e) {
    console.error(`解析 meta.yml 失败: ${p}`, e);
    return {};
  }
}

/**
 * 寻找目录下最合适的 html 入口
 */
async function findEntryHtml(dirPath, dirName) {
  const files = await fs.readdir(dirPath);
  // 1) index.html
  if (files.includes('index.html')) return 'index.html';
  // 2) 与目录同名 .html（不区分大小写）
  const lower = dirName.toLowerCase();
  const matchSame = files.find(f => f.toLowerCase() === `${lower}.html`);
  if (matchSame) return matchSame;
  // 3) 任意第一个 .html（按字母序）
  const htmls = files.filter(f => f.toLowerCase().endsWith('.html')).sort();
  return htmls[0] || '';
}

/**
 * 判断是否包含 icon.png
 */
async function hasIcon(dirPath) {
  const p = path.join(dirPath, 'icon.png');
  return (await exists(p));
}

/**
 * 收集全部 Cheatsheet 项目信息
 */
async function collectAll() {
  const items = [];
  for (const root of ROOTS) {
    const rootPath = path.join(process.cwd(), root);
    if (!(await exists(rootPath))) continue;
    const entries = await fs.readdir(rootPath, { withFileTypes: true });
    for (const d of entries) {
      if (!d.isDirectory()) continue;
      const dirName = d.name;
      // 跳过以下划线开头的目录（开发中/示例，不参与发布）
      if (dirName.startsWith('_')) continue;
      const dirPath = path.join(rootPath, dirName);
      const entryHtml = await findEntryHtml(dirPath, dirName);
      if (!entryHtml) continue; // 没有可链接的 html 则跳过
      const meta = await readMeta(dirPath);
      const desc = meta.desc || '';
      const icon = await hasIcon(dirPath);
      // 生成相对链接（以仓库根目录为基准）并规范为 POSIX 风格，确保在浏览器中可用
      const hrefFs = path.join(root, dirName, entryHtml);
      const href = hrefFs.split(path.sep).join('/');
      const iconHref = icon ? path.join(root, dirName, 'icon.png').split(path.sep).join('/') : '';
      items.push({
        root,
        dirName,
        title: dirName,
        desc,
        href,
        icon: iconHref,
      });
    }
  }
  // 排序：先按 root，其次按目录名
  items.sort((a, b) => (a.root.localeCompare(b.root) || a.title.localeCompare(b.title, 'zh-Hans-CN')));
  return items;
}

/**
 * 将 items 渲染为卡片 HTML 片段
 */
function renderItems(items) {
  return items.map(it => {
    const title = he.encode(it.title);
    const desc = he.encode(it.desc || '');
    const icon = it.icon ? `<img class="icon" src="${it.icon}" alt="icon" />` : '';
    return [
      '<div class="card">',
      `  <h2>${icon}${title} <a class="link" href="${it.href}" target="_blank" rel="noopener">&gt;&gt;&gt;</a></h2>`,
      desc ? `  <p class="desc">${desc}</p>` : '',
      '</div>'
    ].filter(Boolean).join('\n');
  }).join('\n');
}

async function main() {
  // 读取模版
  const tpl = await fs.readFile(TEMPLATE_PATH, 'utf8');
  const items = await collectAll();
  const html = renderItems(items);
  // 注入卡片与版本号（占位符 __APP_VERSION__）
  const out = tpl.replace('<!-- CHEATSHEET_ITEMS -->', html);
  const out2 = out.replace(/__APP_VERSION__/g, (pkg && pkg.version) ? String(pkg.version) : '0.0.0');
  await fs.writeFile(OUTPUT_PATH, out2, 'utf8');
  console.log(`导航页已生成: ${path.relative(process.cwd(), OUTPUT_PATH)}`);
  console.log(`共收集到 ${items.length} 个 cheatsheet`);
}

main().catch(err => {
  console.error('[generate-nav] 失败:', err);
  process.exit(1);
});
