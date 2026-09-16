const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const codeDir = __dirname;
const folders = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

console.log('=== CONVERTIDOR ESTRICTO UTF-8 SIN BOM ===\n');

let converted = [];

function cleanFile(filePath) {
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  
  // Solo procesar archivos de texto
  const textExts = ['.liquid', '.json', '.css', '.js', '.svg', '.txt', '.yml', '.html', '.md'];
  if (!textExts.includes(ext)) return;

  let text = '';
  let wasUtf16 = false;
  let hadBom = false;

  // UTF-16 LE BOM
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    text = buf.toString('utf16le');
    wasUtf16 = true;
  }
  // UTF-16 BE BOM
  else if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    text = buf.toString('utf16be');
    wasUtf16 = true;
  }
  // UTF-8 BOM
  else if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    text = buf.slice(3).toString('utf8');
    hadBom = true;
  }
  // UTF-16 LE without BOM (check for null bytes pattern)
  else if (buf.length >= 4 && (buf[1] === 0x00 || buf[3] === 0x00)) {
    try {
      text = buf.toString('utf16le');
      wasUtf16 = true;
    } catch(e) {
      text = buf.toString('utf8');
    }
  }
  else {
    text = buf.toString('utf8');
  }

  // Remove any remaining null bytes
  text = text.replace(/\0/g, '');

  if (wasUtf16 || hadBom) {
    fs.writeFileSync(filePath, Buffer.from(text, 'utf8'));
    converted.push({ file: path.relative(rootDir, filePath), wasUtf16, hadBom });
    console.log(`Corregido: ${path.relative(rootDir, filePath)} (UTF-16: ${wasUtf16}, BOM: ${hadBom})`);
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else {
      cleanFile(full);
    }
  }
}

folders.forEach(f => {
  walk(path.join(codeDir, f));
  walk(path.join(rootDir, f));
});

console.log(`\nTotal archivos corregidos: ${converted.length}`);
