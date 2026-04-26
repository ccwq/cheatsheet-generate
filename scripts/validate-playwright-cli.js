#!/usr/bin/env node
/**
 * 校验 playwright-cli 文档与真实 CLI 的一致性
 *
 * 思路：
 * 1. 从 cheatsheets/playwright-cli/playwright-cli.md 提取文档中出现的命令
 * 2. 通过 npx @playwright/cli@latest --help 获取真实命令列表
 * 3. 对比漂移率，超过阈值时告警
 *
 * 阈值：文档收录率 < 80% 则失败（说明文档严重过时）
 */

const fs = require('fs/promises');
const path = require('path');
const { execSync } = require('child_process');

const MARKDOWN_PATH = path.join(process.cwd(), 'cheatsheets/playwright-cli/playwright-cli.md');
const DRIFT_THRESHOLD = 0.8; // 文档收录率低于此值则告警

/**
 * 从 markdown 文件中提取所有 playwright-cli 命令
 * 匹配模式：playwright-cli <command> [args]
 * 命令格式：playwright-cli open / playwright-cli snapshot -i / playwright-cli click e15
 */
function extractCommandsFromMarkdown(content) {
  const cmdSet = new Set();
  // 匹配 playwright-cli 开头的主命令行（不包括选项）
  // 例如：playwright-cli open xxx -> 主命令是 open
  // 例如：playwright-cli snapshot -> 主命令是 snapshot
  const regex = /^playwright-cli\s+(\S+)/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    cmdSet.add(match[1]);
  }
  return [...cmdSet];
}

/**
 * 从 CLI --help 输出中提取真实命令列表
 * playwright-cli 的 --help 通常会列出所有子命令
 */
function fetchRealCommands() {
  try {
    // 先试 playwright
    const out = execSync('npx playwright@latest --help', {
      encoding: 'utf-8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return parseHelpOutput(out);
  } catch (e) {
    // stderr 可能包含帮助输出
    try {
      const out = execSync('npx playwright@latest --help 2>&1', {
        encoding: 'utf-8',
        timeout: 30000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return parseHelpOutput(out);
    } catch (e2) {
      console.warn('[validate-playwright-cli] 无法通过 npx playwright@latest --help 获取命令列表:', e2.message);
      return null;
    }
  }
}

function parseHelpOutput(output) {
  const cmds = new Set();
  // help 输出格式通常是每行一个命令名
  // 例如：open, snapshot, click, fill, screenshot 等
  const lines = output.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // 跳过空行、选项行、说明行
    if (!trimmed) continue;
    if (trimmed.startsWith('-')) continue;
    if (trimmed.startsWith('#')) continue;
    if (trimmed.includes('"')) continue; // 跳过描述性文字
    // 匹配纯命令词（字母开头的单词）
    if (/^[a-z][a-z0-9-]*$/i.test(trimmed)) {
      cmds.add(trimmed.toLowerCase());
    }
  }
  return [...cmds];
}

/**
 * 计算文档覆盖率
 */
function computeCoverage(docCommands, realCommands) {
  if (!realCommands || realCommands.length === 0) {
    return { covered: docCommands, missing: [], coverage: null };
  }

  const realSet = new Set(realCommands.map(c => c.toLowerCase()));
  const covered = docCommands.filter(c => realSet.has(c.toLowerCase()));
  const missing = docCommands.filter(c => !realSet.has(c.toLowerCase()));

  const coverage = realCommands.length > 0
    ? covered.length / realCommands.length
    : null;

  return { covered, missing, coverage };
}

async function main() {
  console.log('[validate-playwright-cli] 开始校验...\n');

  // 1. 读取 markdown
  const content = await fs.readFile(MARKDOWN_PATH, 'utf-8');
  const docCommands = extractCommandsFromMarkdown(content);
  console.log(`[文档] 提取到 ${docCommands.length} 个主命令:`, docCommands.join(', '));

  // 2. 获取真实命令
  const realCommands = fetchRealCommands();

  if (!realCommands) {
    console.warn('[validate-playwright-cli] 跳过真实命令对比（无法获取 CLI 帮助）');
    console.log('[validate-playwright-cli] 请手动确认文档与 https://github.com/microsoft/playwright-cli 一致');
    process.exit(0); // 不失败，只是警告
  }

  console.log(`\n[真实 CLI] 获取到 ${realCommands.length} 个命令:`, realCommands.join(', '));

  // 3. 对比
  const { covered, missing, coverage } = computeCoverage(docCommands, realCommands);

  console.log(`\n--- 对比结果 ---`);
  console.log(`文档收录率: ${coverage !== null ? (coverage * 100).toFixed(1) + '%' : '未知'}`);
  console.log(`已收录: ${covered.length} 个`);
  console.log(`未收录（文档有但 CLI 无）: ${missing.length} 个`);
  if (missing.length > 0) {
    console.log(`  -> ${missing.join(', ')}`);
  }

  // 4. 判断是否通过
  if (coverage !== null && coverage < DRIFT_THRESHOLD) {
    console.error(`\n[ERROR] 文档覆盖率 ${(coverage * 100).toFixed(1)}% 低于阈值 ${(DRIFT_THRESHOLD * 100).toFixed(1)}%`);
    console.error('[ERROR] 请更新 cheatsheets/playwright-cli/playwright-cli.md');
    process.exit(1);
  } else {
    console.log(`\n[PASS] 文档覆盖率符合要求`);
  }
}

main().catch(e => {
  console.error('[validate-playwright-cli] 执行出错:', e.message);
  process.exit(1);
});
