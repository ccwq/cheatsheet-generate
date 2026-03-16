const assert = require('node:assert/strict');
const test = require('node:test');

const { githubHref, renderItems, zreadHref } = require('../scripts/generate-nav.js');

test('generate-nav: GitHub owner/repo 可派生 GitHub 与 Zread 链接', () => {
  assert.equal(githubHref('astral-sh/uv'), 'https://github.com/astral-sh/uv');
  assert.equal(zreadHref('astral-sh/uv'), 'https://zread.ai/astral-sh/uv');
  assert.equal(githubHref('unknown'), '');
  assert.equal(zreadHref('unknown'), '');
});

test('generate-nav: 卡片元信息展示 GitHub 与 Zread', () => {
  const html = renderItems([
    {
      title: 'uv',
      desc: 'demo',
      href: 'cheatsheets/uv/uv.html',
      icon: '',
      tags: ['Python'],
      version: '0.9.18',
      github: 'astral-sh/uv',
      date: '2025-12-16',
      recency: { status: 'valid', ratio: 1, width: 100 },
    },
  ], (tag) => `<span class="tag">${tag}</span>`);

  assert.ok(html.includes('GitHub <a class="meta-link" href="https://github.com/astral-sh/uv"'));
  assert.ok(html.includes('Zread <a class="meta-link" href="https://zread.ai/astral-sh/uv"'));
});
