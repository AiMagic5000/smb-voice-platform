#!/usr/bin/env node
/**
 * Generate icons for Electron app
 */
const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
const SOURCE_SVG = path.join(ASSETS_DIR, 'icon.svg');

async function generateIcons() {
  console.log('Generating Electron app icons...');

  // First generate main PNG from SVG
  await sharp(SOURCE_SVG)
    .resize(512, 512)
    .png()
    .toFile(path.join(ASSETS_DIR, 'icon.png'));
  console.log('  Created: icon.png (512x512) from SVG');

  const SOURCE_PNG = path.join(ASSETS_DIR, 'icon.png');

  // Create tray icon (16x16 for Windows, 22x22 for others)
  await sharp(SOURCE_PNG)
    .resize(32, 32)
    .png()
    .toFile(path.join(ASSETS_DIR, 'tray-icon.png'));
  console.log('  Created: tray-icon.png (32x32)');

  // Create multiple sizes for ICO
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const pngBuffers = [];

  for (const size of sizes) {
    const buffer = await sharp(SOURCE_PNG)
      .resize(size, size)
      .png()
      .toBuffer();
    pngBuffers.push(buffer);
  }

  // Create ICO file
  const icoBuffer = await toIco(pngBuffers);
  fs.writeFileSync(path.join(ASSETS_DIR, 'icon.ico'), icoBuffer);
  console.log('  Created: icon.ico (multi-size)');

  // Create 512x512 PNG (required by electron-builder)
  await sharp(SOURCE_PNG)
    .resize(512, 512)
    .png()
    .toFile(path.join(ASSETS_DIR, 'icon-512.png'));
  console.log('  Created: icon-512.png (512x512)');

  console.log('\nIcon generation complete!');
}

generateIcons().catch(console.error);
