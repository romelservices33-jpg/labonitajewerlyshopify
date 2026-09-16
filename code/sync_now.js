const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const codeDir = __dirname;
const folders = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

console.log('Starting sync from code to root...');

for (const folder of folders) {
  const src = path.join(codeDir, folder);
  const dest = path.join(rootDir, folder);
  if (fs.existsSync(src)) {
    console.log(`Copying ${folder}...`);
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log(`Done copying ${folder}.`);
  }
}

// Check verification
const verification = folders.map(f => {
  const p = path.join(rootDir, f);
  return {
    folder: f,
    exists: fs.existsSync(p),
    itemCount: fs.existsSync(p) ? fs.readdirSync(p).length : 0
  };
});

fs.writeFileSync(path.join(__dirname, 'sync_report.json'), JSON.stringify(verification, null, 2), 'utf8');
console.log('SYNC REPORT WRITTEN SUCCESSFULLY');
