const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = 'c:/TRABAJO/La Bonita Joyeria';
const catDir = path.join(rootDir, 'categorias');
const codeAssets = path.join(rootDir, 'code', 'assets');
const rootAssets = path.join(rootDir, 'assets');

// 1. Move old collection-cadenas.jpg to collection-cuban.jpg & category-cuban.jpg
const oldCadenasSrc = path.join(codeAssets, 'collection-cadenas.jpg');
if (fs.existsSync(oldCadenasSrc)) {
  fs.copyFileSync(oldCadenasSrc, path.join(codeAssets, 'collection-cuban.jpg'));
  fs.copyFileSync(oldCadenasSrc, path.join(rootAssets, 'collection-cuban.jpg'));
  fs.copyFileSync(oldCadenasSrc, path.join(codeAssets, 'category-cuban.jpg'));
  fs.copyFileSync(oldCadenasSrc, path.join(rootAssets, 'category-cuban.jpg'));
  console.log('[MOVED OLD CADENAS TO CUBAN CATEGORY]');
}

// 2. Process and optimize images from categorias/
const newMappings = [
  { src: path.join(catDir, 'cadenas.jpg'), destName: 'collection-cadenas.jpg' },
  { src: path.join(catDir, 'dijes.jpg'), destName: 'collection-dijes.jpg' },
  { src: path.join(catDir, 'piercings.jpg'), destName: 'collection-piercings.jpg' },
  { src: path.join(catDir, 'prendedores.jpg'), destName: 'collection-prendedores.jpg' },
  { src: path.join(catDir, 'relojes.jpg'), destName: 'collection-relojes.jpg' }
];

newMappings.forEach(m => {
  if (!fs.existsSync(m.src)) {
    console.error('File not found:', m.src);
    return;
  }

  const destCode = path.join(codeAssets, m.destName);
  const destRoot = path.join(rootAssets, m.destName);

  try {
    // Resize to max width 1600px maintaining quality, high speed
    execSync(`ffmpeg -y -i "${m.src}" -vf "scale='min(1600,iw)':-1" -q:v 2 "${destCode}"`, { stdio: 'ignore' });
    fs.copyFileSync(destCode, destRoot);
    console.log(`[OPTIMIZED & COPIED] ${m.destName}`);
  } catch (err) {
    console.warn(`[FALLBACK COPY] ${m.destName}:`, err.message);
    fs.copyFileSync(m.src, destCode);
    fs.copyFileSync(m.src, destRoot);
  }
});

console.log('--- Images successfully processed ---');
