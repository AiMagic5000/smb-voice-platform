const fs = require('fs');
const path = require('path');

// iOS Splash Screen sizes
const splashSizes = [
  { width: 1125, height: 2436, name: 'splash-1125x2436.png' }, // iPhone X, XS, 11 Pro
  { width: 1242, height: 2688, name: 'splash-1242x2688.png' }, // iPhone XS Max, 11 Pro Max
  { width: 828, height: 1792, name: 'splash-828x1792.png' },   // iPhone XR, 11
  { width: 1170, height: 2532, name: 'splash-1170x2532.png' }, // iPhone 12, 13, 14
  { width: 1284, height: 2778, name: 'splash-1284x2778.png' }, // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
  { width: 1179, height: 2556, name: 'splash-1179x2556.png' }, // iPhone 14 Pro
  { width: 1290, height: 2796, name: 'splash-1290x2796.png' }, // iPhone 14 Pro Max
];

// Generate SVG splash screen
function generateSplashSVG(width, height) {
  const logoSize = Math.min(width, height) * 0.15;
  const centerX = width / 2;
  const centerY = height / 2 - 50;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E3A5F"/>
      <stop offset="100%" style="stop-color:#2d4a6f"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <!-- Logo circle -->
  <circle cx="${centerX}" cy="${centerY}" r="${logoSize * 0.6}" fill="rgba(201, 162, 39, 0.15)"/>
  <!-- Phone icon -->
  <g transform="translate(${centerX - logoSize * 0.25}, ${centerY - logoSize * 0.25})">
    <svg width="${logoSize * 0.5}" height="${logoSize * 0.5}" viewBox="0 0 24 24" fill="none" stroke="#C9A227" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  </g>
  <!-- Text -->
  <text x="${centerX}" y="${centerY + logoSize * 0.9}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${logoSize * 0.2}" font-weight="700" fill="white">SMB Voice</text>
  <text x="${centerX}" y="${centerY + logoSize * 1.15}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${logoSize * 0.1}" fill="rgba(255,255,255,0.7)">Professional Business Phone</text>
</svg>`;
}

// Create splash screens directory
const splashDir = path.join(__dirname, '..', 'public', 'splash');
if (!fs.existsSync(splashDir)) {
  fs.mkdirSync(splashDir, { recursive: true });
}

// Generate SVG files (PNG conversion would require sharp/canvas)
splashSizes.forEach(({ width, height, name }) => {
  const svgContent = generateSplashSVG(width, height);
  const svgName = name.replace('.png', '.svg');
  fs.writeFileSync(path.join(splashDir, svgName), svgContent);
  console.log(`Generated: ${svgName}`);
});

console.log('\nSplash screens generated as SVG files.');
console.log('Note: For production, convert to PNG using sharp or similar tool.');
