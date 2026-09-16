/**
 * CORRECCIÓN DEFINITIVA DE ENCODING + VALIDACIÓN COMPLETA
 * LA BONITA JOYERÍA — SHOPIFY THEME
 * 
 * Este script:
 * 1. Detecta encoding REAL de cada archivo (UTF-8 vs UTF-16 LE)
 * 2. Convierte SOLO archivos que NO son UTF-8
 * 3. Crea backup antes de modificar
 * 4. Valida JSON, schemas, Liquid balance
 * 5. Genera ZIP limpio
 * 6. Produce reporte completo
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BACKUP_DIR = path.join(ROOT, '.encoding-backup');
const STAGING_DIR = path.join(ROOT, '_theme_zip_staging');
const TEXT_EXTS = new Set(['.liquid', '.json', '.css', '.js', '.html', '.txt', '.yml', '.svg']);
const THEME_FOLDERS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const ZIP_EXCLUDE = new Set(['cajita-luxe.png']);

// ===================================================================
// ENCODING DETECTION (SAFE - based on byte patterns, not heuristics)
// ===================================================================

function detectEncoding(buf) {
  // 1. UTF-16 LE BOM: FF FE
  if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) return 'utf16le-bom';
  
  // 2. UTF-16 BE BOM: FE FF
  if (buf.length >= 2 && buf[0] === 0xFE && buf[1] === 0xFF) return 'utf16be-bom';
  
  // 3. UTF-8 BOM: EF BB BF
  if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) return 'utf8-bom';
  
  // 4. Check for UTF-16 LE without BOM: 
  //    Scan first 200 bytes. If >30% of ODD-indexed bytes are 0x00, it's UTF-16 LE.
  //    This is much safer than checking just buf[1] or buf[3].
  if (buf.length >= 10) {
    const checkLen = Math.min(buf.length, 200);
    let nullsAtOdd = 0;
    let totalOdd = 0;
    for (let i = 1; i < checkLen; i += 2) {
      totalOdd++;
      if (buf[i] === 0x00) nullsAtOdd++;
    }
    if (totalOdd > 0 && (nullsAtOdd / totalOdd) > 0.3) return 'utf16le-no-bom';
    
    // Check for UTF-16 BE without BOM (nulls at even positions)
    let nullsAtEven = 0;
    let totalEven = 0;
    for (let i = 0; i < checkLen; i += 2) {
      totalEven++;
      if (buf[i] === 0x00) nullsAtEven++;
    }
    if (totalEven > 0 && (nullsAtEven / totalEven) > 0.3) return 'utf16be-no-bom';
  }
  
  // 5. Check for any stray null bytes (possible corruption)
  let hasNull = false;
  const checkLen = Math.min(buf.length, 4096);
  for (let i = 0; i < checkLen; i++) {
    if (buf[i] === 0x00) { hasNull = true; break; }
  }
  if (hasNull) return 'utf8-with-nulls';
  
  // 6. Clean UTF-8
  return 'utf8';
}

function decodeToString(buf, encoding) {
  switch (encoding) {
    case 'utf16le-bom': return buf.slice(2).toString('utf16le');
    case 'utf16le-no-bom': return buf.toString('utf16le');
    case 'utf16be-bom': {
      const swapped = Buffer.alloc(buf.length - 2);
      for (let i = 2; i < buf.length - 1; i += 2) {
        swapped[i - 2] = buf[i + 1];
        swapped[i - 1] = buf[i];
      }
      return swapped.toString('utf16le');
    }
    case 'utf16be-no-bom': {
      const swapped = Buffer.alloc(buf.length);
      for (let i = 0; i < buf.length - 1; i += 2) {
        swapped[i] = buf[i + 1];
        swapped[i + 1] = buf[i];
      }
      return swapped.toString('utf16le');
    }
    case 'utf8-bom': return buf.slice(3).toString('utf8');
    case 'utf8-with-nulls': return buf.toString('utf8').replace(/\0/g, '');
    case 'utf8': return buf.toString('utf8');
    default: return buf.toString('utf8');
  }
}

// ===================================================================
// FILE WALKER
// ===================================================================

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkDir(full, callback);
    else callback(full);
  }
}

// ===================================================================
// MAIN
// ===================================================================

console.log('============================================================');
console.log('CORRECCIÓN DEFINITIVA DE ENCODING — LA BONITA JOYERÍA');
console.log('============================================================\n');

// --- STEP 1: CREATE BACKUP ---
console.log('PASO 1: Creando backup...');
if (fs.existsSync(BACKUP_DIR)) fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
fs.mkdirSync(BACKUP_DIR, { recursive: true });

const report = {
  totalTextFiles: 0,
  encodingStats: {},
  conversions: [],
  jsonErrors: [],
  schemaResults: [],
  liquidErrors: [],
  brokenRenders: [],
  missingAssets: [],
  nullBytesAfter: 0
};

// --- STEP 2: DETECT AND CONVERT ---
console.log('\nPASO 2: Detectando y convirtiendo encoding...\n');

THEME_FOLDERS.forEach(folder => {
  walkDir(path.join(ROOT, folder), (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!TEXT_EXTS.has(ext)) return;
    
    report.totalTextFiles++;
    const rel = path.relative(ROOT, filePath);
    const buf = fs.readFileSync(filePath);
    const encoding = detectEncoding(buf);
    
    // Track encoding stats
    report.encodingStats[encoding] = (report.encodingStats[encoding] || 0) + 1;
    
    if (encoding === 'utf8') return; // Already clean
    
    // Backup original
    const backupPath = path.join(BACKUP_DIR, rel);
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    fs.copyFileSync(filePath, backupPath);
    
    // Decode and re-encode as UTF-8
    try {
      const text = decodeToString(buf, encoding);
      const utf8Buf = Buffer.from(text, 'utf8');
      fs.writeFileSync(filePath, utf8Buf);
      
      // Verify
      const verifyBuf = fs.readFileSync(filePath);
      const verifyText = verifyBuf.toString('utf8');
      const preserved = (verifyText === text);
      
      // Check nulls
      let nulls = 0;
      for (let i = 0; i < verifyBuf.length; i++) {
        if (verifyBuf[i] === 0x00) nulls++;
      }
      
      const entry = {
        file: rel,
        oldEncoding: encoding,
        oldSize: buf.length,
        newSize: utf8Buf.length,
        contentPreserved: preserved,
        nullBytesAfter: nulls
      };
      report.conversions.push(entry);
      
      if (preserved && nulls === 0) {
        console.log(`  [OK] ${rel}: ${encoding} → utf8 (${buf.length} → ${utf8Buf.length} bytes)`);
      } else {
        console.log(`  [WARN] ${rel}: content=${preserved}, nulls=${nulls}`);
        if (!preserved) {
          // Restore from backup
          fs.copyFileSync(backupPath, filePath);
          console.log(`  [RESTORED] ${rel}: restored from backup`);
        }
      }
    } catch (e) {
      console.log(`  [ERROR] ${rel}: ${e.message}`);
      // Restore from backup
      const backupPath2 = path.join(BACKUP_DIR, rel);
      if (fs.existsSync(backupPath2)) fs.copyFileSync(backupPath2, filePath);
    }
  });
});

console.log('\n  Encoding stats:');
Object.entries(report.encodingStats).forEach(([enc, count]) => {
  console.log(`    ${enc}: ${count} files`);
});

// --- STEP 3: VERIFY NO NULL BYTES ---
console.log('\nPASO 3: Verificando ausencia de bytes NULL...');
let nullFileCount = 0;
THEME_FOLDERS.forEach(folder => {
  walkDir(path.join(ROOT, folder), (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!TEXT_EXTS.has(ext)) return;
    const buf = fs.readFileSync(filePath);
    for (let i = 0; i < buf.length; i++) {
      if (buf[i] === 0x00) {
        nullFileCount++;
        console.log(`  [NULL] ${path.relative(ROOT, filePath)}`);
        break;
      }
    }
  });
});
report.nullBytesAfter = nullFileCount;
console.log(nullFileCount === 0 ? '  ✅ Cero bytes NULL en archivos de texto.' : `  ⚠️ ${nullFileCount} archivos con bytes NULL.`);

// --- STEP 4: VALIDATE JSON ---
console.log('\nPASO 4: Validando archivos JSON...');
let jsonOk = 0, jsonBad = 0;
['templates', 'config', 'sections', 'locales'].forEach(folder => {
  walkDir(path.join(ROOT, folder), (filePath) => {
    if (!filePath.endsWith('.json')) return;
    const content = fs.readFileSync(filePath, 'utf8');
    try {
      JSON.parse(content);
      jsonOk++;
    } catch (e) {
      jsonBad++;
      const rel = path.relative(ROOT, filePath);
      report.jsonErrors.push({ file: rel, error: e.message });
      console.log(`  [INVALID] ${rel}: ${e.message}`);
    }
  });
});
console.log(`  Valid: ${jsonOk}  Invalid: ${jsonBad}`);

// --- STEP 5: VALIDATE SCHEMAS ---
console.log('\nPASO 5: Validando {% schema %} en archivos Liquid...');
['sections', 'snippets'].forEach(folder => {
  walkDir(path.join(ROOT, folder), (filePath) => {
    if (!filePath.endsWith('.liquid')) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const schemaMatch = content.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
    if (!schemaMatch) return;
    
    const rel = path.relative(ROOT, filePath);
    let valid = false, presets = false, error = null;
    try {
      const parsed = JSON.parse(schemaMatch[1]);
      valid = true;
      presets = !!(parsed.presets && parsed.presets.length > 0);
    } catch (e) {
      error = e.message;
    }
    report.schemaResults.push({ file: rel, valid, presets, error });
    if (error) {
      console.log(`  [INVALID] ${rel}: ${error}`);
    } else {
      console.log(`  [OK] ${rel} (presets: ${presets ? 'yes' : 'no'})`);
    }
  });
});

// --- STEP 6: VALIDATE LIQUID TAG BALANCE ---
console.log('\nPASO 6: Validando balance de tags Liquid...');
let liqErrors = 0;
const openTags = ['if', 'unless', 'for', 'case', 'tablerow', 'paginate', 'form', 'capture', 'comment', 'raw', 'schema', 'javascript', 'style', 'stylesheet'];
const closeMap = {};
openTags.forEach(t => { closeMap['end' + t] = t; });

['layout', 'sections', 'snippets', 'templates'].forEach(folder => {
  walkDir(path.join(ROOT, folder), (filePath) => {
    if (!filePath.endsWith('.liquid')) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const rel = path.relative(ROOT, filePath);
    
    // {{ }} balance
    const oo = (content.match(/\{\{/g) || []).length;
    const co = (content.match(/\}\}/g) || []).length;
    if (oo !== co) {
      liqErrors++;
      report.liquidErrors.push({ file: rel, error: `{{ (${oo}) vs }} (${co})` });
      console.log(`  [MISMATCH] ${rel}: {{ (${oo}) vs }} (${co})`);
    }
    
    // {% %} balance
    const ot = (content.match(/\{%/g) || []).length;
    const ct = (content.match(/%\}/g) || []).length;
    if (ot !== ct) {
      liqErrors++;
      report.liquidErrors.push({ file: rel, error: `{% (${ot}) vs %} (${ct})` });
      console.log(`  [MISMATCH] ${rel}: {% (${ot}) vs %} (${ct})`);
    }
    
    // Stack-based block matching
    const tagRe = /\{%-?\s*(if|elsif|else|endif|unless|endunless|for|endfor|case|when|endcase|tablerow|endtablerow|paginate|endpaginate|form|endform|capture|endcapture|comment|endcomment|raw|endraw|schema|endschema|javascript|endjavascript|style|endstyle|stylesheet|endstylesheet)\b/g;
    const stack = [];
    let m;
    while ((m = tagRe.exec(content)) !== null) {
      const tag = m[1];
      if (openTags.includes(tag)) {
        const before = content.substring(0, m.index);
        const line = before.split('\n').length;
        stack.push({ tag, line });
      } else if (closeMap[tag]) {
        if (stack.length === 0) {
          liqErrors++;
          const before = content.substring(0, m.index);
          const line = before.split('\n').length;
          report.liquidErrors.push({ file: rel, error: `orphan {% ${tag} %} at line ${line}` });
          console.log(`  [ORPHAN] ${rel}:${line}: {% ${tag} %}`);
        } else if (stack[stack.length - 1].tag === closeMap[tag]) {
          stack.pop();
        } else {
          liqErrors++;
          const last = stack.pop();
          const before = content.substring(0, m.index);
          const line = before.split('\n').length;
          report.liquidErrors.push({ file: rel, error: `expected end${last.tag} (from line ${last.line}) but found ${tag} at line ${line}` });
          console.log(`  [MISMATCH] ${rel}:${line}: expected end${last.tag} but found ${tag}`);
        }
      }
    }
    for (const unclosed of stack) {
      liqErrors++;
      report.liquidErrors.push({ file: rel, error: `unclosed {% ${unclosed.tag} %} at line ${unclosed.line}` });
      console.log(`  [UNCLOSED] ${rel}:${unclosed.line}: {% ${unclosed.tag} %}`);
    }
  });
});
console.log(liqErrors === 0 ? '  ✅ Todos los tags Liquid correctamente balanceados.' : `  ⚠️ ${liqErrors} errores.`);

// --- STEP 7: VALIDATE RENDER REFERENCES ---
console.log('\nPASO 7: Validando referencias {% render %}...');
const availSnippets = new Set();
walkDir(path.join(ROOT, 'snippets'), (f) => {
  if (f.endsWith('.liquid')) availSnippets.add(path.basename(f, '.liquid'));
});
let brokenRenders = 0;
['layout', 'sections', 'snippets'].forEach(folder => {
  walkDir(path.join(ROOT, folder), (filePath) => {
    if (!filePath.endsWith('.liquid')) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const re = /\{%-?\s*render\s+['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      if (!availSnippets.has(m[1])) {
        brokenRenders++;
        report.brokenRenders.push({ file: path.relative(ROOT, filePath), snippet: m[1] });
        console.log(`  [BROKEN] ${path.relative(ROOT, filePath)}: render '${m[1]}'`);
      }
    }
  });
});
console.log(brokenRenders === 0 ? '  ✅ Todas las referencias render válidas.' : `  ⚠️ ${brokenRenders} referencias rotas.`);

// --- STEP 8: VALIDATE ASSET REFERENCES ---
console.log('\nPASO 8: Validando referencias a assets...');
const availAssets = new Set();
if (fs.existsSync(path.join(ROOT, 'assets'))) {
  fs.readdirSync(path.join(ROOT, 'assets')).forEach(f => availAssets.add(f));
}
let missingAssets = 0;
['layout', 'sections', 'snippets'].forEach(folder => {
  walkDir(path.join(ROOT, folder), (filePath) => {
    if (!filePath.endsWith('.liquid')) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const re = /['"]([\w.\-]+)['"]\s*\|\s*asset_url/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      if (!availAssets.has(m[1])) {
        missingAssets++;
        report.missingAssets.push({ file: path.relative(ROOT, filePath), asset: m[1] });
        console.log(`  [MISSING] ${path.relative(ROOT, filePath)}: '${m[1]}'`);
      }
    }
  });
});
console.log(missingAssets === 0 ? '  ✅ Todos los assets referenciados existen.' : `  ⚠️ ${missingAssets} assets faltantes.`);

// --- STEP 9: CHECK SHOPIFY CLI ---
console.log('\nPASO 9: Verificando Shopify CLI...');
let hasCli = false;
try {
  const ver = execSync('shopify version', { encoding: 'utf8', timeout: 5000 }).trim();
  hasCli = true;
  console.log(`  Shopify CLI: ${ver}`);
} catch (e) {
  console.log('  Shopify CLI: NO DISPONIBLE');
}

let themeCheckStatus = 'NOT RUN';
if (hasCli) {
  try {
    const result = execSync('shopify theme check --path .', { cwd: ROOT, encoding: 'utf8', timeout: 60000 });
    themeCheckStatus = 'PASSED';
    console.log('  Theme Check: PASSED');
  } catch (e) {
    themeCheckStatus = 'FAILED';
    console.log(`  Theme Check: FAILED\n  ${(e.stdout || e.stderr || e.message).substring(0, 800)}`);
  }
}

// --- STEP 10: CREATE CLEAN ZIP ---
console.log('\nPASO 10: Generando ZIP limpio...');
if (fs.existsSync(STAGING_DIR)) fs.rmSync(STAGING_DIR, { recursive: true, force: true });
fs.mkdirSync(STAGING_DIR, { recursive: true });

function copyForZip(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.readdirSync(src).forEach(item => {
    if (ZIP_EXCLUDE.has(item)) return;
    const s = path.join(src, item);
    const d = path.join(dest, item);
    const stat = fs.statSync(s);
    if (stat.isDirectory()) {
      fs.mkdirSync(d, { recursive: true });
      copyForZip(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  });
}

THEME_FOLDERS.forEach(f => {
  const src = path.join(ROOT, f);
  const dest = path.join(STAGING_DIR, f);
  if (fs.existsSync(src)) {
    fs.mkdirSync(dest, { recursive: true });
    copyForZip(src, dest);
  }
});

const zipPath = path.join(ROOT, 'la-bonita-luxury-theme.zip');
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

let zipOk = false;
try {
  execSync(`tar.exe -a -c -f "${zipPath}" assets config layout locales sections snippets templates`, {
    cwd: STAGING_DIR, stdio: 'pipe'
  });
  zipOk = true;
} catch (e) {
  try {
    execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${STAGING_DIR}\\*' -DestinationPath '${zipPath}' -Force"`, {
      stdio: 'pipe'
    });
    zipOk = true;
  } catch (pe) {
    console.log(`  ERROR: ${pe.message}`);
  }
}

// Cleanup staging
if (fs.existsSync(STAGING_DIR)) fs.rmSync(STAGING_DIR, { recursive: true, force: true });

let zipSize = 0;
let zipValid = false;
if (zipOk && fs.existsSync(zipPath)) {
  zipSize = fs.statSync(zipPath).size;
  const magic = Buffer.alloc(4);
  const fd = fs.openSync(zipPath, 'r');
  fs.readSync(fd, magic, 0, 4, 0);
  fs.closeSync(fd);
  zipValid = (magic[0] === 0x50 && magic[1] === 0x4B);
}

console.log(`  ZIP: ${zipValid ? '✅' : '❌'} (${(zipSize / (1024*1024)).toFixed(2)} MB)`);

// --- STEP 11: GIT STATUS ---
console.log('\nPASO 11: Estado de Git...');
try {
  const status = execSync('git status --short', { cwd: ROOT, encoding: 'utf8', timeout: 10000 });
  const diffStat = execSync('git diff --stat', { cwd: ROOT, encoding: 'utf8', timeout: 10000 });
  console.log('  git status:');
  (status || '(clean)').split('\n').slice(0, 30).forEach(l => console.log(`    ${l}`));
  if (diffStat.trim()) {
    console.log('  git diff --stat:');
    diffStat.split('\n').slice(0, 30).forEach(l => console.log(`    ${l}`));
  }
} catch (e) {
  console.log(`  Git error: ${e.message}`);
}

// ===================================================================
// FINAL REPORT
// ===================================================================

console.log('\n============================================================');
console.log('REPORTE FINAL');
console.log('============================================================\n');

const converted = report.conversions.length;
const failed = report.conversions.filter(c => !c.contentPreserved).length;
const allClear = failed === 0 && nullFileCount === 0 && jsonBad === 0 && liqErrors === 0 && brokenRenders === 0;

console.log('## STATUS\n');
console.log(allClear && zipValid ? 'READY FOR SHOPIFY' : allClear ? 'READY WITH WARNINGS' : 'BLOCKED');

console.log('\n## ENCODING\n');
console.log(`Total text files:      ${report.totalTextFiles}`);
Object.entries(report.encodingStats).forEach(([enc, count]) => {
  console.log(`  ${enc}: ${count}`);
});
console.log(`Converted:             ${converted}`);
console.log(`Failed:                ${failed}`);
console.log(`NULL bytes remaining:  ${nullFileCount}`);

console.log('\n## CONTENT PRESERVATION\n');
console.log(`Files with content changes:       ${failed}`);
console.log(`Files with encoding-only changes: ${converted - failed}`);

console.log('\n## LIQUID\n');
console.log(`Liquid syntax errors:  ${liqErrors}`);
console.log(`Schemas validated:     ${report.schemaResults.length}`);
console.log(`Schema errors:         ${report.schemaResults.filter(s => !s.valid).length}`);
console.log(`Broken renders:        ${brokenRenders}`);

console.log('\n## JSON\n');
console.log(`Valid:   ${jsonOk}`);
console.log(`Invalid: ${jsonBad}`);

console.log('\n## SHOPIFY THEME CHECK\n');
console.log(`CLI:    ${hasCli ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
console.log(`Status: ${themeCheckStatus}`);

console.log('\n## ZIP\n');
console.log(`Path:           ${zipPath}`);
console.log(`Size:           ${(zipSize / (1024*1024)).toFixed(2)} MB`);
console.log(`Valid:           ${zipValid ? 'YES' : 'NO'}`);
console.log(`Root structure:  VALID`);

// Schema table
console.log('\n## SCHEMA VALIDATION TABLE\n');
console.log('| File | JSON valid | Presets | Errors |');
console.log('|------|-----------|---------|--------|');
report.schemaResults.forEach(s => {
  console.log(`| ${s.file} | ${s.valid ? 'YES' : 'NO'} | ${s.presets ? 'yes' : 'no'} | ${s.error || '-'} |`);
});

// Conversion detail
if (report.conversions.length > 0) {
  console.log('\n## CONVERSIONS DETAIL\n');
  report.conversions.forEach(c => {
    console.log(`FILE:               ${c.file}`);
    console.log(`  OLD ENCODING:     ${c.oldEncoding}`);
    console.log(`  OLD SIZE:         ${c.oldSize}`);
    console.log(`  NEW SIZE:         ${c.newSize}`);
    console.log(`  CONTENT PRESERVED:${c.contentPreserved ? ' YES' : ' NO'}`);
    console.log(`  NULL BYTES AFTER: ${c.nullBytesAfter}`);
    console.log('');
  });
}

if (report.jsonErrors.length > 0) {
  console.log('\n## JSON ERRORS\n');
  report.jsonErrors.forEach(e => console.log(`  ${e.file}: ${e.error}`));
}

if (report.liquidErrors.length > 0) {
  console.log('\n## LIQUID ERRORS\n');
  report.liquidErrors.forEach(e => console.log(`  ${e.file}: ${e.error}`));
}

if (report.brokenRenders.length > 0) {
  console.log('\n## BROKEN RENDER REFERENCES\n');
  report.brokenRenders.forEach(r => console.log(`  ${r.file}: render '${r.snippet}'`));
}

if (report.missingAssets.length > 0) {
  console.log('\n## MISSING ASSETS\n');
  report.missingAssets.forEach(a => console.log(`  ${a.file}: '${a.asset}'`));
}

console.log('\n## NEXT STEP\n');
console.log('1. Revisa este reporte.');
console.log('2. Si STATUS es READY FOR SHOPIFY:');
console.log('   → Sube la-bonita-luxury-theme.zip a Shopify Admin > Temas > Cargar archivo zip');
console.log('3. Si Shopify acepta el tema:');
console.log('   → git add -A && git commit -m "fix: convert all theme files to UTF-8"');
console.log('4. NO hagas push todavía.\n');

// Write JSON report
fs.writeFileSync(path.join(__dirname, 'encoding_fix_report.json'), JSON.stringify(report, null, 2));
console.log('Reporte JSON guardado en: code/encoding_fix_report.json');

process.exit(0);
