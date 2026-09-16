const fs = require('fs');
const path = require('path');

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

console.log('--- Syncing root theme files to code/ folder ---');
themeFolders.forEach(folder => {
  const src = path.join(rootDir, folder);
  const dest = path.join(codeDir, folder);
  console.log(`Syncing ${folder} from root to code/...`);
  copyRecursive(src, dest);
});

themeFiles.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(codeDir, file);
  if (fs.existsSync(src)) {
    console.log(`Syncing ${file} from root to code/...`);
    fs.copyFileSync(src, dest);
  }
});

console.log('--- Bi-directional Sync Complete ---');
