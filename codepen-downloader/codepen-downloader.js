#!/usr/bin/env node
/**
 * CodePen Downloader
 *
 * - 解析根目录 links.md（首个 ```json 代码块）
 * - 对每一项：下载源HTML（包装页）、提取最终HTML（CodePen: iframe/srcdoc）
 * - 下载图标 src，并保存为 icon.*
 * - 输出目录：cheatsheets-import/{slug}/{source.html,index.html,icon.*}
 * - 打印请求URL、文件大小，并显示进度条
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { URL } = require('url');

// 解析CLI参数（支持 --only/--limit/--dry-run）
const argv = process.argv.slice(2);
const opts = parseArgs(argv);

// 依赖（CJS）
let fetch, cheerio, he, cliProgress, chalk, dotenv, HttpProxyAgent, HttpsProxyAgent;
try {
  fetch = require('node-fetch'); // v2 CJS
  cheerio = require('cheerio');
  he = require('he');
  cliProgress = require('cli-progress');
  chalk = require('chalk'); // v4 CJS
  dotenv = require('dotenv');
  HttpProxyAgent = require('http-proxy-agent');
  HttpsProxyAgent = require('https-proxy-agent');
} catch (err) {
  if (!opts.dryRun) {
    console.error('[cs-dl] 依赖缺失，请安装:');
    console.error('  npm install node-fetch@^2 cheerio he cli-progress chalk@^4 dotenv http-proxy-agent https-proxy-agent');
    throw err;
  }
  // 干跑降级
  chalk = new Proxy(() => (s) => s, { get: () => (s) => s });
  cliProgress = {
    SingleBar: class { start(){console.log('[cs-dl] (dry-run) start')} increment(){} stop(){console.log('[cs-dl] (dry-run) done')} },
    Presets: { shades_classic: {} },
  };
}

// 常量
const ROOT = process.cwd();
const LINKS_MD = path.join(ROOT, 'links.md');
const OUTPUT_ROOT = path.join(ROOT, 'cheatsheets-import');

// 默认请求头
const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
};

// 读取 .env/代理
let PROXY_URL;
let AGENT_FUNC;
try {
  if (dotenv) {
    const envPath = path.join(ROOT, '.env');
    if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
  }
  PROXY_URL = process.env.PROXY_URL || process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (PROXY_URL) {
    if (HttpProxyAgent && HttpsProxyAgent) {
      const httpAgent = new HttpProxyAgent(PROXY_URL);
      const httpsAgent = new HttpsProxyAgent(PROXY_URL);
      AGENT_FUNC = (u) => u.protocol === 'http:' ? httpAgent : httpsAgent;
      console.log('[cs-dl]', 'Proxy enabled:', PROXY_URL);
    } else if (!opts.dryRun) {
      console.error('[cs-dl] 已配置代理但代理依赖缺失，请安装 http-proxy-agent https-proxy-agent');
      process.exit(1);
    } else {
      console.log('[cs-dl]', '(dry-run) Proxy specified but proxy agent modules are missing.');
    }
  }
} catch {}

// 重试/超时
const RETRIES = Number(process.env.RETRIES || 4);
const RETRY_DELAY_MS = Number(process.env.RETRY_DELAY_MS || 5000);
const FETCH_TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT_MS || 6000);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// —— CLI & 工具 ——
function parseArgs(args){
  const out = { only: undefined, limit: undefined, dryRun: false };
  for (let i=0;i<args.length;i++){
    const a = args[i];
    if (a==='--only' && i+1<args.length) out.only = args[++i];
    else if (a==='--limit' && i+1<args.length){ const n=Number(args[++i]); if(!Number.isNaN(n)&&n>0) out.limit=n; }
    else if (a==='--dry-run') out.dryRun = true;
    else if (a==='--help'||a==='-h'){ console.log('Usage: node codepen-downloader/codepen-downloader.js [--only "keyword"] [--limit N] [--dry-run]'); process.exit(0); }
  }
  return out;
}
const log = (...a)=>console.log(chalk.gray('[cs-dl]'),...a);
const ensureDirSync=(d)=>{ if(!fs.existsSync(d)) fs.mkdirSync(d,{recursive:true}); };
function slugify(input,fallback='item'){
  if(!input||typeof input!=='string') return fallback;
  let s=input.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[<>:"/\\|?*]/g,'-').replace(/[\s\t\n]+/g,'-').replace(/\.+$/g,'').replace(/-+/g,'-').trim();
  return s||fallback;
}
function pickOutputDir(item, used=new Set()){
  const base=slugify(item.name||item.id||'item'); let c=base; let i=2; while(used.has(c)) c=`${base}-${i++}`; used.add(c); return c;
}
function humanBytes(n){ if(n==null) return '0 B'; const u=['B','KB','MB','GB']; let i=0,x=Number(n); while(x>=1024&&i<u.length-1){x/=1024;i++;} return `${x.toFixed(x>=100?0:x>=10?1:2)} ${u[i]}`; }

// —— 解析 links.md ——
async function readLinksJsonFromMd(filePath){
  const md = await fsp.readFile(filePath,'utf8');
  let m = md.match(/```json\s*([\s\S]*?)\s*```/i); if(!m) m = md.match(/```\s*([\s\S]*?)\s*```/);
  if(!m) throw new Error('links.md 中未找到 JSON 代码块');
  const data = JSON.parse(m[1]); if(!Array.isArray(data)) throw new Error('JSON 根节点不是数组');
  return data;
}

// —— 网络请求 ——
function safeParseUrl(u){ try{return new URL(u);}catch{return null;} }
function isCodepenHost(host){ return /(^|\.)codepen\.io$/i.test(host)||/(^|\.)cdpn\.io$/i.test(host); }
function buildCodepenFullpageUrl(u){ try{ const x=new URL(u); const p=x.pathname.split('/').filter(Boolean); const user=p[0], slug=p[2]; if(!user||!slug) return null; return `https://cdpn.io/${user}/fullpage/${slug}?view=fullpage`; }catch{return null;} }

async function fetchWithRetry(url, options){
  const total = RETRIES + 1;
  for (let a=1;a<=total;a++){
    try{
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    }catch(err){
      if (a<total){
        log(chalk.yellow(`请求失败(第${a}/${total-1}次): ${err.message||err}. ${Math.round(RETRY_DELAY_MS/1000)}秒后重试...`));
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      throw err;
    }
  }
}

async function requestText(url){
  const u=safeParseUrl(url); const isCp=u?isCodepenHost(u.hostname):false; const headers={...DEFAULT_HEADERS}; if(isCp) headers['Referer']='https://codepen.io';
  log(chalk.cyan('GET'), url, PROXY_URL?chalk.gray('(via proxy)'):'', isCp?chalk.gray('(with Referer)'):'');
  const res = await fetchWithRetry(url, { headers, redirect:'follow', agent:AGENT_FUNC, timeout:FETCH_TIMEOUT_MS });
  const text = await res.text();
  return { text, headers:Object.fromEntries(res.headers.entries()), url: res.url };
}

async function requestBuffer(url){
  const u=safeParseUrl(url); const isCp=u?isCodepenHost(u.hostname):false; const headers={...DEFAULT_HEADERS}; if(isCp) headers['Referer']='https://codepen.io';
  log(chalk.cyan('GET'), url, PROXY_URL?chalk.gray('(via proxy)'):'', isCp?chalk.gray('(with Referer)'):'');
  const res = await fetchWithRetry(url, { headers, redirect:'follow', agent:AGENT_FUNC, timeout:FETCH_TIMEOUT_MS });
  const ab = await res.arrayBuffer(); const buf = Buffer.from(ab);
  return { buffer: buf, headers:Object.fromEntries(res.headers.entries()), url: res.url };
}

// —— CodePen 提取 ——
function extractIframeSrcdoc(html){
  const $ = cheerio.load(html, { decodeEntities:false });
  let encoded = $('body[translate="no"]').html();
  if(!encoded) return null; // 兼容性：当前 cdpn fullpage 输出位于 body translate=no
  return he.decode(encoded);
}

function escapeHtml(text){ if(text==null) return ''; return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;'); }
function sanitizeFinalHtml(html, title='Cheatsheet'){
  const fragment=(html||'').trim(); if(!fragment) return '';
  const hasHtmlTag = /<\s*html\b/i.test(fragment); if(hasHtmlTag) return fragment;
  const t=escapeHtml(title);
  return ['<!DOCTYPE html>','<html lang="en">','<head>','  <meta charset="UTF-8">','  <meta name="viewport" content="width=device-width, initial-scale=1.0">',`  <title>${t}</title>`,'</head>','<body>',fragment,'</body>','</html>'].join('\n');
}

// —— 下载 ——
async function downloadIcon(item,outDir){
  const iconUrl=item.src; if(!iconUrl) return null;
  if(opts.dryRun){ let ext='.png'; try{const u=new URL(iconUrl); const p=path.extname((u.pathname||'').split('/').pop()||''); if(p) ext=p;}catch{} const iconPath=path.join(outDir,`icon${ext}`); log(chalk.yellow('[dry-run] Icon would save:'), path.relative(ROOT,iconPath)); log(chalk.yellow('[dry-run] Requested URL:'), iconUrl); return iconPath; }
  const { buffer, headers, url } = await requestBuffer(iconUrl);
  const ct=headers['content-type']; let ext=''; try{const u=new URL(url); const p=path.extname((u.pathname||'').split('/').pop()||''); if(p) ext=p;}catch{} if(!ext) ext=guessExtFromContentType(ct); if(!ext) ext='.bin';
  const iconPath=path.join(outDir,`icon${ext}`); await fsp.writeFile(iconPath, buffer); log('Saved icon', chalk.green(path.relative(ROOT,iconPath)), chalk.gray(`(${humanBytes(buffer.length)})`)); return iconPath;
}

function guessExtFromContentType(ct){ if(!ct) return ''; ct=String(Array.isArray(ct)?ct[0]:ct).toLowerCase(); if(ct.includes('image/png'))return'.png'; if(ct.includes('image/jpeg')||ct.includes('image/jpg'))return'.jpg'; if(ct.includes('image/gif'))return'.gif'; if(ct.includes('image/webp'))return'.webp'; if(ct.includes('image/svg'))return'.svg'; if(ct.includes('image/x-icon')||ct.includes('image/vnd.microsoft.icon'))return'.ico'; return ''; }

async function downloadHtmlPair(item){
  const url=item.url; if(!url) throw new Error('Missing url');
  if(opts.dryRun){ return { sourceUrl:url, sourceHtml:`<!-- DRY RUN SOURCE -->\n<!-- Would GET from: ${url} -->\n`, finalHtml:`<!-- DRY RUN FINAL -->\n<!-- Would extract iframe.srcdoc if present -->\n` }; }
  const urlFull = buildCodepenFullpageUrl(url) || url;
  const primary = await requestText(urlFull);
  const sourceHtml = primary.text; const sourceUrl=primary.url;
  const extracted = extractIframeSrcdoc(sourceHtml);
  const finalHtml = extracted != null ? extracted : sourceHtml;
  return { sourceUrl, sourceHtml, finalHtml };
}

// —— 主流程 ——
async function main(){
  const items = await readLinksJsonFromMd(LINKS_MD);
  let filtered = items;
  if(opts.only){ const q=opts.only.toLowerCase(); filtered=items.filter(it=>String(it.name||'').toLowerCase().includes(q)||String(it.url||'').toLowerCase().includes(q)); }
  if(opts.limit) filtered=filtered.slice(0, opts.limit);
  if(!filtered.length){ log('No items to process (check --only/--limit)'); return; }

  ensureDirSync(OUTPUT_ROOT); const usedDirs=new Set();
  const bar = new cliProgress.SingleBar({ format: `${chalk.magenta('Cheatsheets')} |{bar}| {value}/{total} {percentage}% | ETA: {eta_formatted}`, hideCursor:true, clearOnComplete:false }, cliProgress.Presets.shades_classic);
  bar.start(filtered.length, 0);

  for(let idx=0; idx<filtered.length; idx++){
    const item=filtered[idx]; const dirName=pickOutputDir(item,usedDirs); const outDir=path.join(OUTPUT_ROOT,dirName); if(!opts.dryRun) ensureDirSync(outDir);
    console.log(); console.log(chalk.bold(`[${idx+1}/${filtered.length}] ${item.name||item.id||''} -> ${dirName}`));

    if(item.src){ try{ await downloadIcon(item,outDir); } catch(err){ log(chalk.red('Icon download error:'), err.message); } } else { log('No icon src; skipping'); }

    try{
      const { sourceHtml, finalHtml, sourceUrl } = await downloadHtmlPair(item);
      const sourcePath=path.join(outDir,'source.html'); const htmlPath=path.join(outDir,'index.html');
      const trimmedSource=(sourceHtml||'').trim(); const sanitizedFinal=sanitizeFinalHtml(finalHtml, item.name||item.id||'Cheatsheet');
      if(!opts.dryRun){ await fsp.writeFile(sourcePath, trimmedSource, 'utf8'); await fsp.writeFile(htmlPath, sanitizedFinal, 'utf8'); }
      const sourceSize=Buffer.byteLength(trimmedSource||'', 'utf8'); const finalSize=Buffer.byteLength(sanitizedFinal||'', 'utf8');
      log('Saved source', chalk.green(path.relative(ROOT,sourcePath)), chalk.gray(`(${humanBytes(sourceSize)})`));
      log('Saved final ', chalk.green(path.relative(ROOT,htmlPath)), chalk.gray(`(${humanBytes(finalSize)})`));
      if(sourceUrl) log('Source URL:', chalk.blue(sourceUrl));
    }catch(err){ log(chalk.red('HTML download error:'), err.message); }

    bar.increment();
  }
  bar.stop();
}

if (require.main === module) {
  main().catch((err)=>{ console.error('[cs-dl] Fatal error:', err); process.exit(1); });
}

module.exports = { readLinksJsonFromMd, downloadHtmlPair, extractIframeSrcdoc };

