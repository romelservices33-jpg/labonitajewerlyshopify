const fs = require('fs');
const path = require('path');

const rootDir = 'c:/TRABAJO/La Bonita Joyeria';

const targetDirs = [
  path.join(rootDir, 'code'),
  path.join(rootDir, 'sections'),
  path.join(rootDir, 'layout'),
  path.join(rootDir, 'snippets'),
  path.join(rootDir, 'templates'),
  path.join(rootDir, 'assets'),
  path.join(rootDir, 'config')
];

let modifiedFilesCount = 0;

function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const validExts = ['.html', '.liquid', '.json', '.js', '.ts', '.tsx', '.css', '.md'];
  if (!validExts.includes(ext)) return;

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/15026407747/g, '15026407747');
    content = content.replace(/5026407747/g, '5026407747');
    content = content.replace(/\(502\)\s*599-4250/g, '(502) 640-7747');
    content = content.replace(/502-640-7747/g, '502-640-7747');
    content = content.replace(/502\.599\.4250/g, '502.640.7747');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedFilesCount++;
      console.log(`[UPDATED PHONE] ${path.relative(rootDir, filePath)}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === 'node_modules' || item === '.git') continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

console.log('--- Updating Phone Number to 5026407747 across all files ---');
targetDirs.forEach(walkDir);
console.log(`--- Completed: ${modifiedFilesCount} files updated ---`);
