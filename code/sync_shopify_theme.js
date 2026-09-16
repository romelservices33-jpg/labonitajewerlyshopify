const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const codeDir = __dirname;

const themeFolders = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const themeFiles = ['.theme-check.yml', '.prettierrc.json'];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('--- Syncing Shopify theme files to repository root ---');
themeFolders.forEach(folder => {
  const src = path.join(codeDir, folder);
  const dest = path.join(rootDir, folder);
  console.log(`Syncing ${folder}...`);
  copyRecursive(src, dest);
});

themeFiles.forEach(file => {
  const src = path.join(codeDir, file);
  const dest = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    console.log(`Syncing ${file}...`);
    fs.copyFileSync(src, dest);
  }
});

console.log('--- Sync Complete ---');
