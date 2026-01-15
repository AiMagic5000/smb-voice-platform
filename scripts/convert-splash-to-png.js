const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const splashDir = path.join(__dirname, '..', 'public', 'splash');

async function convertSvgToPng() {
  const files = fs.readdirSync(splashDir).filter(f => f.endsWith('.svg'));

  for (const file of files) {
    const svgPath = path.join(splashDir, file);
    const pngPath = path.join(splashDir, file.replace('.svg', '.png'));

    try {
      const svgBuffer = fs.readFileSync(svgPath);
      await sharp(svgBuffer)
        .png()
        .toFile(pngPath);
      console.log(`Converted: ${file} -> ${file.replace('.svg', '.png')}`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err.message);
    }
  }

  console.log('\nDone! PNG splash screens generated.');
}

convertSvgToPng();
