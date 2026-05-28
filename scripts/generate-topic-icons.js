const path = require('path');
const sharp = require('sharp');

const root = process.cwd();
const size = 256;

const topics = [
  {
    topic: 'codegraph',
    svg: () => `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="56" fill="url(#bg)" />
        <path d="M62 86 L122 56 L188 94 L184 162 L120 198 L64 164 Z" fill="none" stroke="#67e8f9" stroke-width="10" stroke-linejoin="round" opacity="0.95"/>
        <circle cx="62" cy="86" r="10" fill="#67e8f9" />
        <circle cx="122" cy="56" r="10" fill="#67e8f9" />
        <circle cx="188" cy="94" r="10" fill="#67e8f9" />
        <circle cx="184" cy="162" r="10" fill="#67e8f9" />
        <circle cx="120" cy="198" r="10" fill="#67e8f9" />
        <circle cx="64" cy="164" r="10" fill="#67e8f9" />
        <path d="M122 56 L120 198 M62 86 L184 162 M188 94 L64 164" stroke="#22d3ee" stroke-width="7" stroke-linecap="round" opacity="0.75"/>
        <rect x="94" y="104" width="68" height="48" rx="16" fill="#08111f" stroke="#a5f3fc" stroke-width="6"/>
        <text x="128" y="138" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="42" font-weight="800" fill="#e0f2fe">G</text>
      </svg>
    `,
  },
  {
    topic: 'CrewAI',
    svg: () => `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg" cx="50%" cy="40%" r="75%">
            <stop offset="0%" stop-color="#0b3a57" />
            <stop offset="100%" stop-color="#03111c" />
          </radialGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="56" fill="url(#bg)" />
        <circle cx="128" cy="128" r="78" fill="none" stroke="#fbbf24" stroke-width="12" opacity="0.95"/>
        <circle cx="128" cy="128" r="48" fill="none" stroke="#fde68a" stroke-width="8" opacity="0.65"/>
        <circle cx="128" cy="78" r="13" fill="#fbbf24" />
        <circle cx="168" cy="110" r="13" fill="#fbbf24" />
        <circle cx="152" cy="172" r="13" fill="#fbbf24" />
        <circle cx="104" cy="172" r="13" fill="#fbbf24" />
        <circle cx="88" cy="110" r="13" fill="#fbbf24" />
        <path d="M128 78 L168 110 L152 172 L104 172 L88 110 Z" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linejoin="round"/>
        <path d="M128 128 L128 78 M128 128 L168 110 M128 128 L152 172 M128 128 L104 172 M128 128 L88 110" stroke="#fde68a" stroke-width="6" stroke-linecap="round" opacity="0.9"/>
      </svg>
    `,
  },
  {
    topic: 'MetaGPT',
    svg: () => `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4c1d95" />
            <stop offset="100%" stop-color="#111827" />
          </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="56" fill="url(#bg)" />
        <path d="M60 84 H196" stroke="#f9a8d4" stroke-width="12" stroke-linecap="round"/>
        <path d="M68 120 H188" stroke="#f9a8d4" stroke-width="12" stroke-linecap="round" opacity="0.9"/>
        <path d="M76 156 H180" stroke="#f9a8d4" stroke-width="12" stroke-linecap="round" opacity="0.8"/>
        <path d="M84 192 H172" stroke="#f9a8d4" stroke-width="12" stroke-linecap="round" opacity="0.7"/>
        <path d="M70 74 L112 74 L112 102 L70 102 Z" fill="#ec4899"/>
        <path d="M118 110 L160 110 L160 138 L118 138 Z" fill="#c084fc"/>
        <path d="M82 146 L124 146 L124 174 L82 174 Z" fill="#f472b6"/>
        <path d="M130 182 L172 182 L172 210 L130 210 Z" fill="#a855f7"/>
        <text x="188" y="72" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="800" fill="#fce7f3">SOP</text>
      </svg>
    `,
  },
  {
    topic: 'awesome-openclaw-agents',
    svg: () => `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#052e16" />
            <stop offset="100%" stop-color="#10231a" />
          </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="56" fill="url(#bg)" />
        <path d="M68 72 H188 L202 104 V184 H54 V88 Z" fill="#0f3b24" stroke="#86efac" stroke-width="8" stroke-linejoin="round"/>
        <path d="M84 92 H172" stroke="#bbf7d0" stroke-width="10" stroke-linecap="round"/>
        <path d="M84 122 H172" stroke="#86efac" stroke-width="10" stroke-linecap="round"/>
        <path d="M84 152 H130" stroke="#4ade80" stroke-width="10" stroke-linecap="round"/>
        <circle cx="168" cy="150" r="22" fill="#14532d" stroke="#86efac" stroke-width="8"/>
        <path d="M158 150 L166 158 L180 142" fill="none" stroke="#bbf7d0" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="86" y="205" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="800" fill="#dcfce7">205</text>
      </svg>
    `,
  },
];

async function main() {
  for (const item of topics) {
    const out = path.join(root, 'cheatsheets', item.topic, 'icon.png');
    await sharp(Buffer.from(item.svg())).png().toFile(out);
    console.log(`generated ${out}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
