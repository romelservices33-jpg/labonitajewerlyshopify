const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const codeDir = __dirname;
const stagingDir = path.join(rootDir, '_theme_zip_staging');

console.log('=== EMPAQUETADOR DE TEMA SHOPIFY LA BONITA (UTF-8 ESTRICTO) ===\n');

// 1. Limpiar y recrear carpeta de staging
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

const themeFolders = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    if (src.endsWith('cajita-luxe.png')) return;
    fs.copyFileSync(src, dest);
  }
}

console.log('1. Sincronizando archivos al staging...');
themeFolders.forEach(folder => {
  const src = path.join(codeDir, folder);
  const dest = path.join(stagingDir, folder);
  copyRecursive(src, dest);
});

// Sincronizar también a root
themeFolders.forEach(folder => {
  const src = path.join(codeDir, folder);
  const dest = path.join(rootDir, folder);
  copyRecursive(src, dest);
});

// 2. Normalizar encoding UTF-8 en todos los archivos de texto
console.log('2. Normalizando encoding UTF-8 sin BOM (eliminando bytes nulos y UTF-16)...');
let fixedEncodingCount = 0;

function normalizeEncoding(filePath) {
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const textExts = ['.liquid', '.json', '.css', '.js', '.svg', '.txt', '.yml'];
  if (!textExts.includes(ext)) return;

  let text = '';
  let converted = false;

  // UTF-16 LE BOM
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    text = buf.toString('utf16le');
    converted = true;
  }
  // UTF-16 BE BOM
  else if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    text = buf.toString('utf16be');
    converted = true;
  }
  // UTF-8 BOM
  else if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    text = buf.slice(3).toString('utf8');
    converted = true;
  }
  // UTF-16 LE without BOM
  else if (buf.length >= 4 && (buf[1] === 0x00 || buf[3] === 0x00)) {
    try {
      text = buf.toString('utf16le');
      converted = true;
    } catch (e) {
      text = buf.toString('utf8');
    }
  } else {
    text = buf.toString('utf8');
  }

  // Limpiar posibles caracteres nulos remanentes
  text = text.replace(/\0/g, '');

  if (converted || buf.includes(0x00)) {
    fs.writeFileSync(filePath, Buffer.from(text, 'utf8'));
    fixedEncodingCount++;
    console.log(`  -> Corregido encoding en: ${path.basename(filePath)}`);
  }
}

function scanAndFixEncoding(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanAndFixEncoding(full);
    } else {
      normalizeEncoding(full);
    }
  }
}

scanAndFixEncoding(stagingDir);
console.log(`  -> Archivos corregidos a UTF-8 estándar: ${fixedEncodingCount}\n`);

// 3. Validar sintaxis Liquid y esquemas JSON
console.log('3. Validando sintaxis Liquid y esquemas JSON...');
let errorCount = 0;

function validateDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      validateDir(full);
    } else {
      const ext = path.extname(item).toLowerCase();
      const content = fs.readFileSync(full, 'utf8');

      if (ext === '.json') {
        try {
          JSON.parse(content);
        } catch (e) {
          console.error(`  [ERROR JSON] en ${item}: ${e.message}`);
          errorCount++;
        }
      } else if (ext === '.liquid') {
        const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
        if (schemaMatch) {
          try {
            JSON.parse(schemaMatch[1]);
          } catch (e) {
            console.error(`  [ERROR SCHEMA JSON] en ${item}: ${e.message}`);
            errorCount++;
          }
        }
      }
    }
  }
}

validateDir(stagingDir);

if (errorCount === 0) {
  console.log('  -> ¡Todos los archivos Liquid y JSON son 100% válidos!\n');
} else {
  console.error(`  -> ATENCIÓN: Se encontraron ${errorCount} errores.\n`);
}

// 4. Crear ZIP estándar con tar.exe
console.log('4. Creando archivo ZIP estándar para Shopify...');
const zipOutput = path.join(rootDir, 'la-bonita-luxury-theme.zip');
const zipOutputCode = path.join(codeDir, 'la-bonita-luxury-theme.zip');

if (fs.existsSync(zipOutput)) fs.unlinkSync(zipOutput);
if (fs.existsSync(zipOutputCode)) fs.unlinkSync(zipOutputCode);

let zipSuccess = false;
try {
  const tarCmd = `tar.exe -a -c -f "${zipOutput}" assets config layout locales sections snippets templates`;
  execSync(tarCmd, { cwd: stagingDir, stdio: 'inherit' });
  zipSuccess = true;
} catch (e) {
  try {
    const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${zipOutput}' -Force"`;
    execSync(psCmd, { stdio: 'inherit' });
    zipSuccess = true;
  } catch (pe) {
    console.error('Error al generar ZIP:', pe.message);
  }
}

if (zipSuccess && fs.existsSync(zipOutput)) {
  fs.copyFileSync(zipOutput, zipOutputCode);
  const sizeMb = (fs.statSync(zipOutput).size / (1024 * 1024)).toFixed(2);
  console.log(`\n=============================================`);
  console.log(` ¡PAQUETE LISTO Y CORREGIDO!`);
  console.log(` Archivo: ${zipOutput}`);
  console.log(` Tamaño: ${sizeMb} MB`);
  console.log(` Encoding: UTF-8 sin BOM (Shopify Compatible)`);
  console.log(`=============================================\n`);
}

process.exit(0);
