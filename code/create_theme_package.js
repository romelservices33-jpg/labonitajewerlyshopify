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

console.log('1. Copying theme folders to repository root...');
themeFolders.forEach(folder => {
  const src = path.join(codeDir, folder);
  const dest = path.join(rootDir, folder);
  console.log(`- Copying ${folder}`);
  copyRecursive(src, dest);
});

themeFiles.forEach(file => {
  const src = path.join(codeDir, file);
  const dest = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    console.log(`- Copying ${file}`);
    fs.copyFileSync(src, dest);
  }
});

console.log('2. Creating temporary staging folder for ZIP...');
const stagingDir = path.join(rootDir, '_theme_zip_staging');
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

themeFolders.forEach(folder => {
  const src = path.join(codeDir, folder);
  const dest = path.join(stagingDir, folder);
  copyRecursive(src, dest);
});

themeFiles.forEach(file => {
  const src = path.join(codeDir, file);
  const dest = path.join(stagingDir, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, dest);
});

console.log('3. Compressing ZIP using PowerShell Compress-Archive...');
const zipOutput = path.join(rootDir, 'la-bonita-luxury-theme.zip');
if (fs.existsSync(zipOutput)) fs.unlinkSync(zipOutput);

try {
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${zipOutput}' -Force"`);
  const sizeMb = (fs.statSync(zipOutput).size / (1024 * 1024)).toFixed(2);
  console.log(`SUCCESS: Created ${zipOutput} (${sizeMb} MB)`);
} catch (e) {
  console.error('ZIP Error:', e.message);
}

try {
  fs.rmSync(stagingDir, { recursive: true, force: true });
} catch(e) {}

console.log('4. Staging root files in git...');
try {
  execSync('git add assets config layout locales sections snippets templates .gitignore', { cwd: rootDir });
  console.log('Git add completed successfully.');
} catch(e) {
  console.log('Git add note:', e.message);
}

console.log('ALL DONE.');
