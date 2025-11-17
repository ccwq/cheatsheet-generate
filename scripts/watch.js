#!/usr/bin/env node
/**
 * 监听 cheatsheets 与 cheatsheets-import 目录的文件变更，
 * 在变更时自动执行构建（npm/pnpm run build）。
 *
 * 约定与行为：
 * - 忽略所有以下划线 "_" 开头的目录（任意层级），以及隐藏目录与 node_modules。
 * - 对新增/删除子目录有自恢复能力：收到 rename 事件后会刷新监听器。
 * - 使用防抖与串行构建：合并短时间内的多次事件，避免重复构建。
 * - 包管理器优先：若在 pnpm 环境中（通过 UA/PNPM_HOME 识别）则使用 pnpm，否则使用 npm。
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');

// 与生成脚本保持一致的根目录
// 新增监听 templates，便于模板改动时自动重建导航页
const ROOTS = ['cheatsheets', 'cheatsheets-import', 'templates'];

/** 工具：判断路径是否存在 */
async function exists(p) {
  try { await fsp.access(p); return true; } catch { return false; }
}

/** 工具：是否应忽略的目录名 */
function shouldIgnoreDirName(name) {
  if (!name) return false;
  return name.startsWith('_') || name.startsWith('.') || name === 'node_modules';
}

/**
 * 递归收集应被监听的目录列表（包含 root 自身），
 * 跳过以 "_"、"." 开头及 "node_modules" 的目录。
 */
async function collectWatchDirs(rootDir) {
  const out = [];
  async function walk(dir) {
    out.push(dir);
    let entries = [];
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch {
      return; // 目录可能被瞬间删除
    }
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      if (shouldIgnoreDirName(ent.name)) continue;
      await walk(path.join(dir, ent.name));
    }
  }
  await walk(rootDir);
  return out;
}

/** 构建触发逻辑（带防抖与串行化） */
let debounceTimer = null;
let building = false;
let buildPending = false;

function detectPM() {
  const ua = process.env.npm_config_user_agent || '';
  if (ua.includes('pnpm') || process.env.PNPM_HOME) {
    return { cmd: 'pnpm', args: ['run', 'build'] };
  }
  return { cmd: 'npm', args: ['run', 'build'] };
}

function scheduleBuild(reason = '变更') {
  if (building) {
    buildPending = true; // 当前构建完成后再补一次
    return;
  }
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => triggerBuild(reason), 250);
}

function triggerBuild(reason) {
  debounceTimer = null;
  const { cmd, args } = detectPM();
  building = true;
  console.log(`[watch] 触发构建（原因：${reason}） -> ${cmd} ${args.join(' ')}`);
  const child = spawn(cmd, args, { stdio: 'inherit', shell: true });
  child.on('close', (code) => {
    building = false;
    if (code === 0) {
      console.log('[watch] 构建完成');
    } else {
      console.error(`[watch] 构建失败，退出码：${code}`);
    }
    if (buildPending) {
      buildPending = false;
      scheduleBuild('合并的后续变更');
    }
  });
}

/** 维护 dir -> watcher 的映射，便于热更新与清理 */
const watchers = new Map();

function watchDir(dir) {
  if (watchers.has(dir)) return;
  try {
    const w = fs.watch(dir, { persistent: true }, (eventType, filename) => {
      const rel = path.relative(process.cwd(), dir);
      const name = filename ? String(filename) : '';
      if (name && shouldIgnoreDirName(name)) return;

      // 记录并触发构建
      const where = name ? `${rel}/${name}`.replace(/\\/g, '/') : `${rel}/*`;
      scheduleBuild(where);

      // 目录结构变化时刷新监听树
      if (eventType === 'rename') {
        setTimeout(() => refreshWatchTree(dir).catch(() => {}), 50);
      }
    });
    watchers.set(dir, w);
  } catch (err) {
    // 某些平台/权限下可能失败，忽略并在下一轮刷新时再试
  }
}

async function refreshWatchTree(rootDir) {
  const desired = new Set((await collectWatchDirs(rootDir)).map(d => path.resolve(d)));
  // 新增监听
  for (const d of desired) {
    if (!watchers.has(d)) watchDir(d);
  }
  // 移除多余监听
  for (const [d, w] of Array.from(watchers.entries())) {
    if (d.startsWith(rootDir) && !desired.has(d)) {
      try { w.close(); } catch {}
      watchers.delete(d);
    }
  }
}

async function main() {
  const roots = [];
  for (const r of ROOTS) {
    const abs = path.join(process.cwd(), r);
    if (await exists(abs)) roots.push(abs);
  }
  if (roots.length === 0) {
    console.log('[watch] 未找到可监听目录（cheatsheets/ 或 cheatsheets-import/）。');
    process.exit(0);
  }

  console.log('[watch] 启动监听（排除下划线开头目录）：');
  for (const r of roots) {
    console.log(' - ' + path.relative(process.cwd(), r));
    await refreshWatchTree(r);
  }

  const cleanup = () => {
    for (const w of watchers.values()) {
      try { w.close(); } catch {}
    }
    watchers.clear();
  };
  process.on('SIGINT', () => { console.log('\n[watch] 已停止'); cleanup(); process.exit(0); });
  process.on('SIGTERM', () => { console.log('\n[watch] 已停止'); cleanup(); process.exit(0); });
}

main().catch(err => {
  console.error('[watch] 监听器启动失败：', err);
  process.exit(1);
});
