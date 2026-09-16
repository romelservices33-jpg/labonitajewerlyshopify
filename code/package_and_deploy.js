const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const codeDir = __dirname;
const themeFolders = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

// 1. Sync files to root
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

themeFolders.forEach(folder => {
  const src = path.join(codeDir, folder);
  const dest = path.join(rootDir, folder);
  copyRecursive(src, dest);
});

// 2. Create staging directory for clean zip
const stagingDir = path.join(rootDir, 'shopify_theme_staging');
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

themeFolders.forEach(folder => {
  const src = path.join(codeDir, folder);
  const dest = path.join(stagingDir, folder);
  copyRecursive(src, dest);
});

// 3. Compress using PowerShell Compress-Archive
const zipPath = path.join(rootDir, 'la-bonita-luxury-theme.zip');
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

try {
  const psCmd = `powershell -Command "Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${zipPath}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });
  console.log(`[ZIP SUCCESS] Created ${zipPath} (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(2)} MB)`);
} catch (e) {
  console.error('[ZIP ERROR]', e.message);
}

// Clean up staging
try {
  fs.rmSync(stagingDir, { recursive: true, force: true });
} catch(e) {}

// 4. Git status & staging at root
try {
  execSync('git add assets config layout locales sections snippets templates .gitignore', { cwd: rootDir, stdio: 'inherit' });
  execSync('git commit -m "feat: sync Shopify theme to repository root with mobile luxury fixes"', { cwd: rootDir, stdio: 'inherit' });
  execSync('git push origin main', { cwd: rootDir, stdio: 'inherit' });
  console.log('[GIT SUCCESS] Pushed root theme to GitHub main');
} catch (e) {
  console.log('[GIT NOTICE/ERROR]', e.message);
}
