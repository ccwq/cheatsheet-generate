#!/usr/bin/env node
/**
 * Test: final HTML should not contain <iframe>
 * - Reads first two items from links.md
 * - Uses downloader's downloadHtmlPair to fetch and extract
 * - Asserts no <iframe> elements exist in finalHtml
 */

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const cheerio = require('cheerio');

// Load env (proxy etc.)
try {
  require('dotenv').config({ path: path.join(process.cwd(), '.env') });
} catch {}

const { readLinksJsonFromMd, downloadHtmlPair } = require('./codepen-downloader');

const ROOT = process.cwd();
const LINKS_MD = path.join(ROOT, 'links.md');

async function run() {
  console.log(chalk.bold('Test: final HTML should not contain <iframe>'));
  const items = await readLinksJsonFromMd(LINKS_MD);
  if (!Array.isArray(items) || items.length < 2) {
    console.error(chalk.red('Need at least two items in links.md JSON.'));
    process.exit(1);
  }

  const targets = items.slice(0, 2);
  let failed = 0;

  for (let i = 0; i < targets.length; i++) {
    const it = targets[i];
    const label = `${it.name || it.id || 'item'} (${i + 1})`;
    console.log('\n' + chalk.magenta(`Testing ${label}`));
    try {
      const { finalHtml } = await downloadHtmlPair(it);
      if (typeof finalHtml !== 'string' || !finalHtml.trim()) {
        console.error(chalk.red('  FAIL'), 'finalHtml is empty');
        failed++;
        continue;
      }
      // Parse and assert no iframe elements
      const $ = cheerio.load(finalHtml);
      const iframes = $('iframe');
      const containsTag = /<\s*iframe\b/i.test(finalHtml);
      if (iframes.length > 0 || containsTag) {
        console.error(chalk.red('  FAIL'), `found ${iframes.length} <iframe> elements`);
        failed++;
      } else {
        console.log(chalk.green('  PASS'), 'no <iframe> found in finalHtml');
      }
    } catch (err) {
      console.error(chalk.red('  ERROR'), err.message);
      failed++;
    }
  }

  console.log('\n' + (failed ? chalk.red(`Tests failed: ${failed}`) : chalk.green('All tests passed')));
  process.exit(failed ? 1 : 0);
}

run();


