#!/usr/bin/env node
/**
 * 为所有 HTML 页面注入 favicon（不依赖第三方库）
 * - 目录：cheatsheets/、cheatsheets-import/、仓库根 index.html
 * - href 计算：基于文件相对路径，输出为 POSIX 风格（/）
 * - 若已存在 <link rel="icon"> 则跳过
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

function injectFavicon(htmlPath, assetRel) {
  const raw = readText(htmlPath);
  if (!raw) return false;
  if (/\<link[^>]+rel=["']icon["']/i.test(raw)) return false; // 已有，跳过

  const linkTag = `\n    <link rel="icon" type="image/png" href="${assetRel}" />`;
  const appleTag = `\n    <link rel="apple-touch-icon" href="${assetRel}" />`;

  let out;
  if (raw.includes('</head>')) {
    out = raw.replace('</head>', `${linkTag}${appleTag}\n  </head>`);
  } else {
    // 兜底：若无 head，直接前置
    out = `${linkTag}${appleTag}\n${raw}`;
  }
  writeText(htmlPath, out);
  return true;
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
    const rel = toPosix(path.relative(path.dirname(file), brandPng));
    if (injectFavicon(file, rel)) {
      changed++;
      console.log(`[inject-favicon] 注入: ${toPosix(path.relative(cwd, file))} -> ${rel}`);
    }
  }
  console.log(`[inject-favicon] 完成，修改文件数：${changed}`);
}

main();

