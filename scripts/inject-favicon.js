#!/usr/bin/env node
/**
 * 为所有 HTML 页面注入 favicon（不依赖第三方库）
 * - 目录：cheatsheets/、cheatsheets-import/、仓库根 index.html
 * - href 计算：优先使用同目录 icon.png，找不到时回退到品牌图标
 * - 若已存在 favicon 标签则替换其 href，不再跳过
 */
const fs = require('fs');
const path = require('path');

/** 将路径统一换成 POSIX 风格（/） */
const toPosix = (p) => p.split(path.sep).join('/');

/** 读取文本文件，若不存在返回 null */
function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (e) { return null; }
}

/** 写入文本文件（UTF-8） */
function writeText(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

/** 遍历目录，收集 .html 文件 */
function collectHtmlFiles(dir) {
  const list = [];
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      // 忽略 _ 开头目录（与生成同策略）
      if (e.name.startsWith('_')) continue;
      list.push(...collectHtmlFiles(path.join(dir, e.name)));
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) {
      list.push(path.join(dir, e.name));
    }
  }
  return list;
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match ? match[2] : '';
}

function rewriteFaviconTags(html, assetRel) {
  let foundIcon = false;
  let foundApple = false;

  const out = html.replace(/<link\b[^>]*>/gi, (tag) => {
    const rel = getAttr(tag, 'rel').toLowerCase();
    if (rel === 'icon' || rel === 'shortcut icon') {
      foundIcon = true;
      return tag.replace(/\bhref\s*=\s*(["'])(.*?)\1/i, (_m, quote) => `href=${quote}${assetRel}${quote}`);
    }
    if (rel === 'apple-touch-icon') {
      foundApple = true;
      return tag.replace(/\bhref\s*=\s*(["'])(.*?)\1/i, (_m, quote) => `href=${quote}${assetRel}${quote}`);
    }
    return tag;
  });

  return { html: out, foundIcon, foundApple };
}

function injectFavicon(htmlPath, assetRel) {
  const raw = readText(htmlPath);
  if (!raw) return false;

  const rewritten = rewriteFaviconTags(raw, assetRel);
  let out = rewritten.html;
  const linkTag = `\n    <link rel="icon" type="image/png" href="${assetRel}" />`;
  const appleTag = `\n    <link rel="apple-touch-icon" href="${assetRel}" />`;
  const missingTags = [];
  if (!rewritten.foundIcon) missingTags.push(linkTag);
  if (!rewritten.foundApple) missingTags.push(appleTag);

  if (missingTags.length > 0) {
    if (out.includes('</head>')) {
      out = out.replace('</head>', `${missingTags.join('')}\n  </head>`);
    } else {
      // 兜底：若无 head，直接前置
      out = `${missingTags.join('')}\n${out}`;
    }
  }

  if (out === raw) {
    return false;
  }

  writeText(htmlPath, out);
  return true;
}

function resolveFaviconHref(htmlPath, brandPng) {
  const htmlDir = path.dirname(htmlPath);
  const localIcon = path.join(htmlDir, 'icon.png');
  if (fs.existsSync(localIcon)) {
    return toPosix(path.relative(htmlDir, localIcon) || 'icon.png');
  }
  return toPosix(path.relative(htmlDir, brandPng));
}

function main() {
  const cwd = process.cwd();
  const brandPng = path.join(cwd, 'assets', 'brand', 'cheatsheet.png');
  const brandExists = fs.existsSync(brandPng);
  if (!brandExists) {
    console.warn('[inject-favicon] 警告：未找到 assets/brand/cheatsheet.png，仍会注入<link>标签。');
  }

  const targets = [
    path.join(cwd, 'cheatsheets'),
    path.join(cwd, 'cheatsheets-import'),
  ];
  const htmlFiles = [path.join(cwd, 'index.html')];
  for (const d of targets) htmlFiles.push(...collectHtmlFiles(d));

  let changed = 0;
  for (const file of htmlFiles) {
    const rel = resolveFaviconHref(file, brandPng);
    if (injectFavicon(file, rel)) {
      changed++;
      console.log(`[inject-favicon] 注入: ${toPosix(path.relative(cwd, file))} -> ${rel}`);
    }
  }
  console.log(`[inject-favicon] 完成，修改文件数：${changed}`);
}

module.exports = {
  injectFavicon,
  resolveFaviconHref,
  rewriteFaviconTags,
};

if (require.main === module) {
  main();
}
