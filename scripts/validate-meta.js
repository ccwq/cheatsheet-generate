#!/usr/bin/env node
/**
 * 校验 cheatsheets/<dir>/meta.yml 元数据格式
 *
 * 规则（当前提案）：
 * - 必须存在：desc、tags、version、github、date
 * - github: "unknown" 或 owner/repo
 * - date: "unknown" 或 YYYY-MM-DD
 */

const fs = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');

const CHEATSHEETS_ROOT = path.join(process.cwd(), 'cheatsheets');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function isPlainObject(x) {
  return x && typeof x === 'object' && !Array.isArray(x);
}

function isNonEmptyString(x) {
  return typeof x === 'string' && x.trim().length > 0;
}

function isString(x) {
  return typeof x === 'string';
}

function isStringArray(x) {
  return Array.isArray(x) && x.every(v => typeof v === 'string');
}

function isGithubOwnerRepo(x) {
  if (x === 'unknown') return true;
  // 仅允许 owner/repo 的最常见字符集
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(x);
}

function isDateYYYYMMDD(x) {
  if (x === 'unknown') return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(x)) return false;
  const d = new Date(`${x}T00:00:00Z`);
  // 额外校验：避免 2024-99-99 这类“能匹配但无效”的日期
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === x;
}

async function main() {
  const args = process.argv.slice(2);

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

  const errors = [];

  for (const dir of (limit > 0 ? dirs.slice(0, limit) : dirs)) {
    const metaPath = path.join(CHEATSHEETS_ROOT, dir, 'meta.yml');
    if (!(await exists(metaPath))) {
      errors.push(`${dir}: 缺少 meta.yml`);
      continue;
    }

    let doc;
    try {
      const content = await fs.readFile(metaPath, 'utf8');
      doc = yaml.load(content);
    } catch (e) {
      errors.push(`${dir}: meta.yml 解析失败 (${e && e.message ? e.message : 'unknown error'})`);
      continue;
    }

    if (!isPlainObject(doc)) {
      errors.push(`${dir}: meta.yml 顶层必须是对象`);
      continue;
    }

    const { desc, tags, version, github, date } = doc;

    if (!isString(desc)) errors.push(`${dir}: desc 必须为字符串`);
    if (!isStringArray(tags)) errors.push(`${dir}: tags 必须为字符串数组`);

    if (!isString(version)) errors.push(`${dir}: version 必须为字符串`);
    if (!isString(github)) errors.push(`${dir}: github 必须为字符串`);
    if (!isString(date)) errors.push(`${dir}: date 必须为字符串`);

    if (isString(github) && !isGithubOwnerRepo(github)) {
      errors.push(`${dir}: github 必须为 owner/repo 或 unknown，当前为 "${github}"`);
    }

    if (isString(date) && !isDateYYYYMMDD(date)) {
      errors.push(`${dir}: date 必须为 YYYY-MM-DD 或 unknown，当前为 "${date}"`);
    }

    // desc 允许为空，但如果完全没写，通常是漏填
    if (desc === '') {
      errors.push(`${dir}: desc 为空（建议补齐一句话简介）`);
    }

    // tags 允许为空；此处不作为错误
    if (version === '') errors.push(`${dir}: version 为空（建议填 "unknown" 或真实版本）`);
    if (github === '') errors.push(`${dir}: github 为空（建议填 "unknown" 或 owner/repo）`);
    if (date === '') errors.push(`${dir}: date 为空（建议填 "unknown" 或 YYYY-MM-DD）`);
  }

  if (errors.length > 0) {
    console.error(`[validate-meta] 发现问题 ${errors.length} 项:`);
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
  }

  console.log(`[validate-meta] 通过，共校验 ${dirs.length} 个 cheatsheet`);
}

main().catch(err => {
  console.error('[validate-meta] 失败:', err);
  process.exit(1);
});
