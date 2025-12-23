const fs = require('fs');
const path = require('path');

const svgContent = fs.readFileSync(path.join(__dirname, '../assets/brand/icon.svg'), 'utf8');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const maskableSizes = [192, 512];

const generatePNG = async (size, isMaskable = false) => {
  const { createCanvas } = require('canvas');
  
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const img = new Image();
  img.src = Buffer.from(svgContent);
  
  ctx.drawImage(img, 0, 0, size, size);
  
  const outputPath = path.join(__dirname, '../assets/brand', isMaskable ? `icon-maskable-${size}x${size}.png` : `icon-${size}x${size}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath}`);
};

const main = async () => {
  console.log('Generating PWA icons...');
  
  for (const size of sizes) {
    await generatePNG(size);
  }
  
  for (const size of maskableSizes) {
    await generatePNG(size, true);
  }
  
  console.log('All icons generated successfully!');
};

main().catch(console.error);
