const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const codeDir = __dirname;

const filesToDelete = [
  'Luxury_jewelry_video_loop_4K_20260915233606.mp4',
  'hero-marble-sculpture-v2.mp4',
  'hero-marble-sculpture.mp4',
  'luxury-jewelry-hero-film.mp4',
  'collection-anillos-original.jpg',
  'collection-aretes-original.jpg',
  'collection-cadenas-original.jpg',
  'collection-pulseras-original.jpg',
  'product-anillo-signet-original.jpg',
  'product-anillo-signet-side-original.jpg',
  'product-aretes-profile-original.jpg',
  'product-pulseras-bangle-original.jpg',
  'product-pulseras-clover-original.jpg'
];

[path.join(rootDir, 'assets'), path.join(codeDir, 'assets')].forEach(assetsPath => {
  if (fs.existsSync(assetsPath)) {
    filesToDelete.forEach(file => {
      const fullPath = path.join(assetsPath, file);
      if (fs.existsSync(fullPath)) {
        console.log(`Deleting large file: ${fullPath}`);
        fs.unlinkSync(fullPath);
      }
    });
  }
});

// Calculate total size of theme
function getFolderSize(dir) {
  let total = 0;
  if (!fs.existsSync(dir)) return total;
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      total += getFolderSize(p);
    } else {
      total += stat.size;
    }
  }
  return total;
}

const themeFolders = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
let totalBytes = 0;
themeFolders.forEach(f => {
  totalBytes += getFolderSize(path.join(rootDir, f));
});

const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);
console.log(`NEW THEME TOTAL SIZE: ${totalMb} MB (Shopify limit is 50 MB)`);

fs.writeFileSync(path.join(codeDir, 'size_report.txt'), `Theme Size: ${totalMb} MB\n`, 'utf8');
