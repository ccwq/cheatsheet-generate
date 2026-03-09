const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const tagCount = {};
const cheatsheetsDir = path.join(__dirname, '..', 'cheatsheets');

fs.readdirSync(cheatsheetsDir).forEach(dir => {
  if (dir.startsWith('_')) return;
  
  const metaPath = path.join(cheatsheetsDir, dir, 'meta.yml');
  if (fs.existsSync(metaPath)) {
    const data = yaml.load(fs.readFileSync(metaPath, 'utf8'));
    if (data.tags) {
      data.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  }
});

const sorted = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);

console.log('=== 标签使用统计 ===\n');
sorted.forEach(([tag, count]) => {
  const percent = (count / 68 * 100).toFixed(1);
  console.log(`${tag.padEnd(25)} ${count.toString().padStart(3)}  (${percent}%)`);
});

console.log(`\n总计：${sorted.length} 个唯一标签`);
console.log(`总文件数：68 个\n`);
