#!/usr/bin/env node
/**
 * 批量补齐 cheatsheets/<dir>/meta.yml 的字段：
 * - version: "unknown"
 * - github: "unknown"（格式要求为 owner/repo，但此脚本不会猜测真实仓库）
 * - date: "YYYY-MM-DD"（优先用 git 中该目录首次出现日期；失败则回退为文件系统时间；再失败为 "unknown"）
 *
 * 设计目标：
 * - 尽量保持原 meta.yml 的格式不变：只在缺失时追加行
 * - 遇到异常时给出清晰输出，便于人工处理
 */

const fs = require('fs/promises');
const path = require('path');
const { execFile } = require('child_process');

const CHEATSHEETS_ROOT = path.join(process.cwd(), 'cheatsheets');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function execFileAsync(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { ...opts, windowsHide: true }, (err, stdout, stderr) => {
      if (err) {
        err.stdout = stdout;
        err.stderr = stderr;
        reject(err);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

function formatLocalDate(ms) {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function tryGetGitFirstDate(relPathPosix) {
  try {
    const { stdout } = await execFileAsync('git', [
      'log',
      '--reverse',
      '--date=short',
      '--format=%ad',
      '--',
      relPathPosix
    ], { cwd: process.cwd() });

    const first = String(stdout || '')
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean)[0];

    if (first && /^\d{4}-\d{2}-\d{2}$/.test(first)) return first;
    return '';
  } catch {
    return '';
  }
}

async function tryGetFsFirstDate(dirPath) {
  try {
    const min = await findMinTimestampMs(dirPath);
    if (!Number.isFinite(min)) return '';
    return formatLocalDate(min);
  } catch {
    return '';
  }
}

async function findMinTimestampMs(dirPath) {
  let min = Number.POSITIVE_INFINITY;
  const q = [dirPath];

  while (q.length > 0) {
    const cur = q.pop();
    const st = await fs.stat(cur);

    // Windows 上 birthtime 通常更接近“创建时间”，但不保证可靠；作为回退策略使用。
    const candidates = [st.birthtimeMs, st.ctimeMs, st.mtimeMs].filter(n => Number.isFinite(n) && n > 0);
    for (const t of candidates) {
      if (t < min) min = t;
    }

    if (!st.isDirectory()) continue;

    const entries = await fs.readdir(cur, { withFileTypes: true });
    for (const ent of entries) {
      q.push(path.join(cur, ent.name));
    }
  }

  return min;
}

function hasKey(content, key) {
  return new RegExp(`^${key}\\s*:`, 'm').test(content);
}

function getKeyLineValue(content, key) {
  const m = content.match(new RegExp(`^${key}\\s*:\\s*(.*)$`, 'm'));
  if (!m) return null;
  return String(m[1] || '').trim();
}

function ensureTrailingNewline(s) {
  if (!s.endsWith('\n')) return `${s}\n`;
  return s;
}

async function migrateOne(dirName, opts) {
  const dirPath = path.join(CHEATSHEETS_ROOT, dirName);
  const metaPath = path.join(dirPath, 'meta.yml');

  let content = '';
  let created = false;

  if (await exists(metaPath)) {
    content = await fs.readFile(metaPath, 'utf8');
  } else {
    created = true;
    content = 'desc: ""\ntags: []\n';
  }

  content = ensureTrailingNewline(content);

  const relPosix = ['cheatsheets', dirName].join('/');
  const dateFromGit = await tryGetGitFirstDate(relPosix);
  const dateFromFs = dateFromGit ? '' : await tryGetFsFirstDate(dirPath);
  const computedDate = dateFromGit || dateFromFs || 'unknown';

  let changed = false;

  // version
  if (!hasKey(content, 'version') || getKeyLineValue(content, 'version') === '') {
    if (!hasKey(content, 'version')) content += 'version: "unknown"\n';
    else content = content.replace(/^version\s*:\s*$/m, 'version: "unknown"');
    changed = true;
  }

  // github
  if (!hasKey(content, 'github') || getKeyLineValue(content, 'github') === '') {
    if (!hasKey(content, 'github')) content += 'github: "unknown"\n';
    else content = content.replace(/^github\s*:\s*$/m, 'github: "unknown"');
    changed = true;
  }

  // date
  if (!hasKey(content, 'date') || getKeyLineValue(content, 'date') === '') {
    if (!hasKey(content, 'date')) content += `date: "${computedDate}"\n`;
    else content = content.replace(/^date\s*:\s*$/m, `date: "${computedDate}"`);
    changed = true;
  }

  if (created || changed) {
    if (!opts.dryRun) {
      await fs.writeFile(metaPath, content, 'utf8');
    }
  }

  return { dirName, created, changed, computedDate, dateFromGit: Boolean(dateFromGit) };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const only = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--only' && args[i + 1]) {
      only.push(String(args[i + 1]));
      i += 1;
    }
  }

  let limit = 0;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--limit' && args[i + 1]) {
      const n = Number(args[i + 1]);
      if (Number.isFinite(n) && n > 0) limit = Math.floor(n);
      i += 1;
    }
  }

  if (!(await exists(CHEATSHEETS_ROOT))) {
    console.error('未找到目录:', CHEATSHEETS_ROOT);
    process.exit(1);
  }

  const entries = await fs.readdir(CHEATSHEETS_ROOT, { withFileTypes: true });
  const dirs = entries
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(name => !name.startsWith('_'))
    .filter(name => (only.length > 0 ? only.includes(name) : true))
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));

  const results = [];
  for (const name of (limit > 0 ? dirs.slice(0, limit) : dirs)) {
    results.push(await migrateOne(name, { dryRun }));
  }

  const changed = results.filter(r => r.created || r.changed);
  const unknownDate = results.filter(r => r.computedDate === 'unknown');

  console.log(`[migrate-meta] dry-run: ${dryRun ? 'yes' : 'no'}`);
  console.log(`[migrate-meta] 扫描目录数: ${results.length}`);
  console.log(`[migrate-meta] 写入/变更数: ${changed.length}`);
  console.log(`[migrate-meta] date=unknown 数: ${unknownDate.length}`);

  if (unknownDate.length > 0) {
    console.log('[migrate-meta] 以下目录无法推断 date（需要人工处理）:');
    unknownDate.forEach(r => {
      console.log(`- ${r.dirName}`);
    });
  }
}

main().catch(err => {
  console.error('[migrate-meta] 失败:', err);
  process.exit(1);
});
