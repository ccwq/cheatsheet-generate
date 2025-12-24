const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgContent = fs.readFileSync(path.join(__dirname, '../assets/brand/icon.svg'), 'utf8');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const maskableSizes = [192, 512];

const generatePNG = async (size, isMaskable = false) => {
  const outputPath = path.join(__dirname, '../assets/brand', isMaskable ? `icon-maskable-${size}x${size}.png` : `icon-${size}x${size}.png`);
  
  await sharp(Buffer.from(svgContent))
    .resize(size, size)
    .png()
    .toFile(outputPath);
  
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
