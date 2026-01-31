#!/usr/bin/env node
/**
 * 批量将 meta.yml 中的版本/日期/GitHub 注入到 cheatsheet HTML 的 panel 区域
 * - 插入标记：<!-- META_INFO_START --> ... <!-- META_INFO_END -->
 * - 若已存在标记，则替换为最新内容
 */

const fs = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(process.cwd(), 'cheatsheets');
const META_START = '<!-- META_INFO_START -->';
const META_END = '<!-- META_INFO_END -->';

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function findEntryHtml(dirPath, dirName) {
  const files = await fs.readdir(dirPath);
  if (files.includes('index.html')) return 'index.html';
  const lower = dirName.toLowerCase();
  const same = files.find(f => f.toLowerCase() === `${lower}.html`);
  if (same) return same;
  const htmls = files.filter(f => f.toLowerCase().endsWith('.html')).sort();
  return htmls[0] || '';
}

function normalizeVersion(v) {
  if (!v) return 'unknown';
  const s = String(v).trim();
  if (!s) return 'unknown';
  if (s.toLowerCase() === 'unknown') return 'unknown';
  return s.startsWith('v') ? s : `v${s}`;
}

function normalizeDate(d) {
  if (!d) return 'unknown';
  const s = String(d).trim();
  return s || 'unknown';
}

function normalizeGithub(g) {
  if (!g) return 'unknown';
  const s = String(g).trim();
  return s || 'unknown';
}

function buildMetaHtml(version, date, github) {
  const gh = normalizeGithub(github);
  const ghLink = (gh !== 'unknown') ? `https://github.com/${gh}` : '';
  const ghHtml = ghLink
    ? `<a class="meta-link" href="${ghLink}" target="_blank" rel="noopener">${gh}</a>`
    : `<span class="meta-plain">${gh}</span>`;

  return [
    META_START,
    `<div class="meta-info">`,
    `  <span class="meta-item"><span class="meta-label">版本</span><span class="meta-value">${normalizeVersion(version)}</span></span>`,
    `  <span class="meta-item"><span class="meta-label">更新日志</span><span class="meta-value">${normalizeDate(date)}</span></span>`,
    `  <span class="meta-item"><span class="meta-label">GitHub</span><span class="meta-value">${ghHtml}</span></span>`,
    `</div>`,
    META_END
  ].join('\n');
}

function buildMetaStyle() {
  return [
    '<style id="meta-info-style">',
    '.meta-info{display:flex;flex-wrap:wrap;gap:6px 10px;margin:8px 0 6px 0;font-size:12px;color:#9db0d8;}',
    '.meta-item{display:inline-flex;align-items:center;gap:6px;padding:2px 6px;border-radius:6px;background:rgba(31,38,56,.4);border:1px solid rgba(105,167,255,.2);}',
    '.meta-label{color:#7bfbb7;font-weight:700;}',
    '.meta-value{color:#cfe4ff;font-weight:600;}',
    '.meta-link{color:#93cdfc;text-decoration:none;}',
    '.meta-link:hover{text-decoration:underline;}',
    '</style>'
  ].join('');
}

function replaceOrInsert(html, metaBlock) {
  const startIdx = html.indexOf(META_START);
  const endIdx = html.indexOf(META_END);
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    return html.slice(0, startIdx) + metaBlock + html.slice(endIdx + META_END.length);
  }

  const panelRe = /<div\s+class="panel[^\"]*">/i;
  const match = html.match(panelRe);
  if (!match || match.index == null) return { html, inserted: false };

  const openIdx = match.index + match[0].length;
  const spanCloseIdx = html.indexOf('</span>', openIdx);
  const insertPos = spanCloseIdx >= 0 ? spanCloseIdx + 7 : openIdx;
  const nextHtml = html.slice(0, insertPos) + '\n' + metaBlock + '\n' + html.slice(insertPos);
  return { html: nextHtml, inserted: true };
}

async function main() {
  if (!(await exists(ROOT))) {
    console.error('未找到目录:', ROOT);
    process.exit(1);
  }

  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  const dirs = entries.filter(d => d.isDirectory() && !d.name.startsWith('_')).map(d => d.name);

  const updated = [];
  const skipped = [];
  const failed = [];

  for (const dir of dirs) {
    const dirPath = path.join(ROOT, dir);
    const metaPath = path.join(dirPath, 'meta.yml');
    if (!(await exists(metaPath))) {
      skipped.push(`${dir} (meta.yml 缺失)`);
      continue;
    }
    const entry = await findEntryHtml(dirPath, dir);
    if (!entry) {
      skipped.push(`${dir} (html 入口缺失)`);
      continue;
    }

    const htmlPath = path.join(dirPath, entry);
    const meta = yaml.load(await fs.readFile(metaPath, 'utf8')) || {};
    const html = await fs.readFile(htmlPath, 'utf8');

    const metaBlock = buildMetaHtml(meta.version, meta.date, meta.github);
    let result = replaceOrInsert(html, metaBlock);

    // 如果没有 panel，则尝试在 h1 后插入
    if (typeof result === 'object' && !result.inserted) {
      const h1Open = html.indexOf('<h1');
      if (h1Open !== -1) {
        const h1Close = html.indexOf('</h1>', h1Open);
        if (h1Close !== -1) {
          const insertPos = h1Close + 5;
          const nextHtml = html.slice(0, insertPos) + '\n' + metaBlock + '\n' + html.slice(insertPos);
          result = { html: nextHtml, inserted: true };
        }
      }
    }

    // 补充 meta 样式（仅当未引用 cheatsheet.css 且未注入过样式）
    let finalHtml = (typeof result === 'object') ? result.html : result;
    const needsMetaStyle = !finalHtml.includes('cheatsheet.css') && !finalHtml.includes('meta-info-style');
    if (needsMetaStyle) {
      const headClose = finalHtml.indexOf('</head>');
      if (headClose !== -1) {
        finalHtml = finalHtml.slice(0, headClose) + buildMetaStyle() + finalHtml.slice(headClose);
      }
    }

    if (typeof result === 'object' && !result.inserted) {
      failed.push(`${dir} (${entry}) 未找到 panel/h1 入口`);
      continue;
    }
    await fs.writeFile(htmlPath, finalHtml, 'utf8');
    updated.push(dir);
  }

  console.log('[inject-meta] updated:', updated.length);
  console.log('[inject-meta] skipped:', skipped.length);
  if (skipped.length) console.log(skipped.join('\n'));
  console.log('[inject-meta] failed:', failed.length);
  if (failed.length) console.log(failed.join('\n'));
}

main().catch(err => {
  console.error('[inject-meta] 失败:', err);
  process.exit(1);
});
