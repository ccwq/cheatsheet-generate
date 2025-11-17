#!/usr/bin/env node
"use strict";
/*
 * 发布工作流脚本（跨平台，原生 Node）
 * 功能节点：编译 -> 修改版本 -> 提交 -> Push（触发 GitHub Pages）
 *
 * 用法示例：
 *   node scripts/workflow.js                 # 默认 patch 版本号递增
 *   node scripts/workflow.js --bump minor    # 次版本号递增
 *   node scripts/workflow.js --bump major    # 主版本号递增
 *   node scripts/workflow.js --set-version 1.2.3  # 直接设置版本号
 *   node scripts/workflow.js -m "feat: 新功能"     # 自定义提交信息
 *   node scripts/workflow.js --no-build      # 跳过编译
 *   node scripts/workflow.js --branch main   # 指定分支（默认 main）
 *   node scripts/workflow.js --remote origin # 指定远程（默认 origin）
 *   node scripts/workflow.js --pages-empty   # 若无变更，生成空提交以触发 Pages
 */

const fs = require("fs");
const cp = require("child_process");
const path = require("path");

function log(msg) { console.log(`[workflow] ${msg}`); }
function run(cmd, opts = {}) {
  log(`运行：${cmd}`);
  cp.execSync(cmd, { stdio: "inherit", ...opts });
}
function tryRun(cmd, opts = {}) {
  try { run(cmd, opts); return true; } catch (e) { return false; }
}

function parseArgs(argv) {
  const args = { bump: "patch", message: "", noBuild: false, branch: "main", remote: "origin", pagesEmpty: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--bump" && argv[i+1]) { args.bump = argv[++i]; continue; }
    if (a === "--set-version" && argv[i+1]) { args.setVersion = argv[++i]; continue; }
    if ((a === "-m" || a === "--message") && argv[i+1]) { args.message = argv[++i]; continue; }
    if (a === "--no-build") { args.noBuild = true; continue; }
    if (a === "--branch" && argv[i+1]) { args.branch = argv[++i]; continue; }
    if (a === "--remote" && argv[i+1]) { args.remote = argv[++i]; continue; }
    if (a === "--pages-empty") { args.pagesEmpty = true; continue; }
  }
  return args;
}

function readPkg(pkgPath) {
  const raw = fs.readFileSync(pkgPath, "utf8");
  const data = JSON.parse(raw);
  return { data, raw };
}

function writePkg(pkgPath, data) {
  const text = JSON.stringify(data, null, 2) + "\n";
  fs.writeFileSync(pkgPath, text, "utf8");
}

function bumpSemver(v, type) {
  // 仅处理 x.y.z 格式，忽略先前的预发布后缀
  const m = (v || "0.0.0").match(/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
  if (!m) throw new Error(`无法解析版本号: ${v}`);
  let [_, maj, min, pat] = m; // eslint-disable-line no-unused-vars
  let major = parseInt(maj, 10) || 0;
  let minor = parseInt(min, 10) || 0;
  let patch = parseInt(pat, 10) || 0;
  switch ((type || "patch").toLowerCase()) {
    case "major": major += 1; minor = 0; patch = 0; break;
    case "minor": minor += 1; patch = 0; break;
    case "patch": default: patch += 1; break;
  }
  return `${major}.${minor}.${patch}`;
}

function hasStagedChanges() {
  // git diff --cached --quiet：无变更返回 0
  try { cp.execSync("git diff --cached --quiet", { stdio: "ignore" }); return false; } catch { return true; }
}

function ensureCleanIndex() {
  // 若存在未暂存变更，允许继续，由脚本统一 git add -A
  return true;
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = process.cwd();
  const pkgPath = path.join(repoRoot, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.error("未找到 package.json，请在项目根目录运行。");
    process.exit(1);
  }

  // 1) 编译：生成 index.html
  if (!args.noBuild) {
    log("开始编译（生成导览页）...");
    run("node scripts/generate-nav.js");
  } else {
    log("已跳过编译步骤 (--no-build)");
  }

  // 2) 修改版本
  const pkg = readPkg(pkgPath).data;
  const oldVer = pkg.version || "0.0.0";
  const newVer = args.setVersion ? args.setVersion : bumpSemver(oldVer, args.bump);
  pkg.version = newVer;
  writePkg(pkgPath, pkg);
  log(`版本号：${oldVer} -> ${newVer}`);

  // 3) 提交变更
  ensureCleanIndex();
  run("git add -A");
  const msg = args.message && args.message.trim().length > 0 ? args.message : `chore(release): v${newVer}`;
  const committed = tryRun(`git commit -m "${msg.replace(/"/g, '\\"')}"`);
  if (!committed) {
    if (args.pagesEmpty) {
      log("无文件变更，创建空提交以触发 Pages...");
      run(`git commit --allow-empty -m "${msg.replace(/"/g, '\\"')} (pages)"`);
    } else {
      log("无文件变更，跳过提交（未使用 --pages-empty）。");
    }
  }

  // 确定当前分支
  let branch = args.branch;
  try {
    const out = cp.execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
    branch = out || branch;
  } catch {}

  // 4) Push，触发 GitHub Pages 自动部署
  log(`推送到远程 ${args.remote}/${branch} 以触发 Pages 构建...`);
  run(`git push ${args.remote} ${branch}`);
  log("完成。GitHub Pages 通常会在 1–3 分钟内更新。");
}

main().catch(err => {
  console.error("[workflow] 失败：", err);
  process.exit(1);
});

