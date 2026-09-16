const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const codeDir = __dirname;
const themeFolders = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

console.log('=== INSPECCIÓN Y NORMALIZACIÓN DE ENCODING UTF-8 SIN BOM ===\n');

let fixedCount = 0;

function processFile(filePath) {
  const buf = fs.readFileSync(filePath);
  const rel = path.relative(codeDir, filePath);
  
  // Check UTF-16 LE BOM (FF FE)
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    console.log(`[CONVIRTIENDO UTF-16 LE -> UTF-8]: ${rel}`);
    const text = buf.toString('utf16le');
    fs.writeFileSync(filePath, Buffer.from(text, 'utf8'));
    fixedCount++;
    return;
  }

  // Check UTF-8 BOM (EF BB BF)
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    console.log(`[ELIMINANDO UTF-8 BOM]: ${rel}`);
    const cleanBuf = buf.slice(3);
    fs.writeFileSync(filePath, cleanBuf);
    fixedCount++;
    return;
  }

  // For text files, ensure no null bytes / clean line endings
  const ext = path.extname(filePath).toLowerCase();
  const textExts = ['.liquid', '.json', '.css', '.js', '.svg', '.txt', '.yml'];
  if (textExts.includes(ext)) {
    // If it has null bytes but wasn't detected with BOM, it might be UTF-16 without BOM
    if (buf.includes(0x00)) {
      console.log(`[DETECTADOS BYTES NULOS - UTF16 DETECTADO]: ${rel}`);
      try {
        const text = buf.toString('utf16le');
        fs.writeFileSync(filePath, Buffer.from(text, 'utf8'));
        fixedCount++;
      } catch (e) {}
    }
  }
}

function walkDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDir(full);
    } else {
      processFile(full);
    }
  }
}

themeFolders.forEach(folder => {
  const p = path.join(codeDir, folder);
  if (fs.existsSync(p)) walkDir(p);
});

console.log(`\nArchivos normalizados a UTF-8 estándar: ${fixedCount}`);
