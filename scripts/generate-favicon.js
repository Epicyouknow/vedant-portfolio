const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Precise vector geometry for the VedantVerse "V" badge icon
// Design: Solid sleek #191919 (or #111111) dark circle with a crisp, geometric, bold white "V"
const createSvg = (size = 512) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#222222"/>
      <stop offset="100%" stop-color="#0E0E0E"/>
    </linearGradient>
  </defs>
  <!-- Sleek dark circle badge -->
  <circle cx="256" cy="256" r="248" fill="url(#bg)"/>
  <!-- Crisp geometric white V -->
  <polygon points="136,136 210,136 256,282 302,136 376,136 294,376 218,376" fill="#FFFFFF"/>
</svg>
`.trim();

// 2. Pure flat version for small sizes (16x16, 32x32) with maximum contrast and optical weight
const createSmallSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="256" fill="#141414"/>
  <polygon points="120,124 204,124 256,280 308,124 392,124 298,388 214,388" fill="#FFFFFF"/>
</svg>
`.trim();

async function generate() {
  console.log('Generating VedantVerse favicon suite...');

  // SVG output for modern browsers
  const svgContent = createSvg(512);
  fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), svgContent);
  console.log('Created public/favicon.svg');

  // Multi-resolution PNGs
  const sizes = [
    { name: 'favicon-16x16.png', size: 16, small: true },
    { name: 'favicon-32x32.png', size: 32, small: true },
    { name: 'favicon-48x48.png', size: 48, small: false },
    { name: 'favicon.png', size: 32, small: true },
    { name: 'icon-16x16.png', size: 16, small: true },
    { name: 'icon-32x32.png', size: 32, small: true },
    { name: 'icon-48x48.png', size: 48, small: false },
    { name: 'icon-96x96.png', size: 96, small: false },
    { name: 'apple-touch-icon.png', size: 180, small: false },
    { name: 'icon-180x180.png', size: 180, small: false },
    { name: 'android-chrome-192x192.png', size: 192, small: false },
    { name: 'icon-192x192.png', size: 192, small: false },
    { name: 'android-chrome-512x512.png', size: 512, small: false },
    { name: 'icon-512x512.png', size: 512, small: false },
    { name: 'logo-circle-exact.png', size: 512, small: false },
    { name: 'logo-icon-exact.png', size: 144, small: false },
  ];

  const pngBuffers = {};

  for (const item of sizes) {
    const svg = item.small ? createSmallSvg(item.size) : createSvg(item.size);
    const buf = await sharp(Buffer.from(svg))
      .resize(item.size, item.size)
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(__dirname, '../public', item.name), buf);
    pngBuffers[item.size] = buf;
    console.log(`Generated public/${item.name} (${item.size}x${item.size})`);
  }

  // Generate valid Windows/Browser .ico file containing 16x16, 32x32, 48x48
  // Standard ICO format specification:
  // Header: 6 bytes (0, 0, 1, 0, count (LE 2 bytes))
  // Directory entries: 16 bytes per image
  // Image data (PNG format supported in all modern browsers and Windows)
  const icoSizes = [16, 32, 48];
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(icoSizes.length, 4); // Number of images

  let offset = 6 + (16 * icoSizes.length);
  const dirEntries = [];
  const imageBuffers = [];

  for (const s of icoSizes) {
    const imgBuf = pngBuffers[s];
    imageBuffers.push(imgBuf);

    const dir = Buffer.alloc(16);
    dir.writeUInt8(s === 256 ? 0 : s, 0); // Width
    dir.writeUInt8(s === 256 ? 0 : s, 1); // Height
    dir.writeUInt8(0, 2); // Color palette
    dir.writeUInt8(0, 3); // Reserved
    dir.writeUInt16LE(1, 4); // Color planes
    dir.writeUInt16LE(32, 6); // Bits per pixel
    dir.writeUInt32LE(imgBuf.length, 8); // Image size in bytes
    dir.writeUInt32LE(offset, 12); // Offset of image data
    dirEntries.push(dir);

    offset += imgBuf.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...imageBuffers]);
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(__dirname, '../src/app/favicon.ico'), icoBuffer);
  console.log(`Generated public/favicon.ico and src/app/favicon.ico (Multi-size ICO: 16x16, 32x32, 48x48)`);

  console.log('All favicon assets updated successfully!');
}

generate().catch(console.error);
