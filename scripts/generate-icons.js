#!/usr/bin/env node
/**
 * PWA Icon Generator for SMB Voice
 * Generates PNG icons in all required sizes from SVG
 *
 * Run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Icon sizes required for PWA
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

const SVG_SOURCE = path.join(__dirname, '../public/icons/icon.svg');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

// Check if sharp is available (included with Next.js)
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not available. Installing...');
  const { execSync } = require('child_process');
  execSync('npm install sharp --save-dev', { stdio: 'inherit' });
  sharp = require('sharp');
}

async function generateIcons() {
  console.log('Generating PWA icons...');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Read SVG source
  const svgBuffer = fs.readFileSync(SVG_SOURCE);

  for (const size of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`  Created: icon-${size}x${size}.png`);
    } catch (err) {
      console.error(`  Error creating ${size}x${size}:`, err.message);
    }
  }

  // Also create apple-touch-icon (180x180)
  try {
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
    console.log('  Created: apple-touch-icon.png (180x180)');
  } catch (err) {
    console.error('  Error creating apple-touch-icon:', err.message);
  }

  // Create favicon (32x32)
  try {
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '../public/icon-32.png'));
    console.log('  Created: icon-32.png (favicon)');
  } catch (err) {
    console.error('  Error creating favicon:', err.message);
  }

  // Create main icons for manifest
  try {
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(__dirname, '../public/icon-192.png'));

    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(__dirname, '../public/icon-512.png'));

    console.log('  Created: icon-192.png and icon-512.png (main icons)');
  } catch (err) {
    console.error('  Error creating main icons:', err.message);
  }

  console.log('\nIcon generation complete!');
  console.log('\nManifest icon references:');
  SIZES.forEach(size => {
    console.log(`  /icons/icon-${size}x${size}.png`);
  });
}

generateIcons().catch(console.error);
