const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = process.cwd();
const size = 256;

const topics = [
  {
    topic: 'codegraph',
    bg: '#0f172a',
    fg: '#5eead4',
    label: 'CG',
  },
  {
    topic: 'CrewAI',
    bg: '#082f49',
    fg: '#fbbf24',
    label: 'CA',
  },
  {
    topic: 'MetaGPT',
    bg: '#3b0764',
    fg: '#f472b6',
    label: 'MG',
  },
  {
    topic: 'awesome-openclaw-agents',
    bg: '#052e16',
    fg: '#86efac',
    label: 'OA',
  },
];

function svgIcon({ bg, fg, label }) {
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg}" />
        <stop offset="100%" stop-color="#111827" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${size}" height="${size}" rx="56" fill="url(#g)" />
    <circle cx="${size / 2}" cy="${size / 2}" r="84" fill="none" stroke="${fg}" stroke-width="10" opacity="0.55" />
    <path d="M52 184 L92 72 L128 150 L164 102 L204 184" fill="none" stroke="${fg}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
    <text x="50%" y="56%" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="700" fill="#f8fafc">${label}</text>
  </svg>`;
}

async function main() {
  for (const item of topics) {
    const out = path.join(root, 'cheatsheets', item.topic, 'icon.png');
    const svg = svgIcon(item);
    await sharp(Buffer.from(svg)).png().toFile(out);
    console.log(`generated ${out}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
