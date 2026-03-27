const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { injectFavicon, resolveFaviconHref, rewriteFaviconTags } = require('../scripts/inject-favicon.js');

test('inject-favicon: replace existing favicon links', () => {
  const html = [
    '<html><head>',
    '  <link rel="icon" type="image/png" href="../../assets/brand/cheatsheet.png">',
    '  <link rel="apple-touch-icon" href="../../assets/brand/cheatsheet.png">',
    '</head><body></body></html>',
  ].join('\n');

  const result = rewriteFaviconTags(html, 'icon.png');
  assert.equal(result.foundIcon, true);
  assert.equal(result.foundApple, true);
  assert.ok(result.html.includes('href="icon.png"'));
  assert.ok(!result.html.includes('cheatsheet.png"'));
});

test('inject-favicon: resolve local icon when present', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'favicon-test-'));
  const cheatDir = path.join(root, 'cheatsheets', 'demo');
  fs.mkdirSync(cheatDir, { recursive: true });
  fs.writeFileSync(path.join(cheatDir, 'icon.png'), 'x');

  const htmlPath = path.join(cheatDir, 'demo.html');
  const brandPng = path.join(root, 'assets', 'brand', 'cheatsheet.png');
  fs.mkdirSync(path.dirname(brandPng), { recursive: true });
  fs.writeFileSync(brandPng, 'brand');

  assert.equal(resolveFaviconHref(htmlPath, brandPng), 'icon.png');
});

test('inject-favicon: inject missing favicon links', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'favicon-test-'));
  const cheatDir = path.join(root, 'cheatsheets', 'demo');
  fs.mkdirSync(cheatDir, { recursive: true });
  const htmlPath = path.join(cheatDir, 'demo.html');
  fs.writeFileSync(
    htmlPath,
    '<html><head><title>x</title></head><body></body></html>',
  );

  assert.equal(injectFavicon(htmlPath, 'icon.png'), true);
  const out = fs.readFileSync(htmlPath, 'utf8');
  assert.ok(out.includes('<link rel="icon" type="image/png" href="icon.png" />'));
  assert.ok(out.includes('<link rel="apple-touch-icon" href="icon.png" />'));
});
