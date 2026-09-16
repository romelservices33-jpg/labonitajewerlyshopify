/**
 * AUDITORÍA FORENSE COMPLETA — LA BONITA JOYERÍA SHOPIFY THEME
 * 
 * Valida: estructura OS 2.0, Liquid syntax, JSON, schemas, 
 * references, encoding, assets, section groups, templates.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const THEME_FOLDERS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

const errors = [];
const warnings = [];
const info = [];

function addError(severity, file, line, error, cause) {
  const entry = { severity, file: path.relative(ROOT, file), line, error, cause };
  if (severity === 'BLOCKER' || severity === 'ERROR') errors.push(entry);
  else if (severity === 'WARNING') warnings.push(entry);
  else info.push(entry);
}

// ===========================
// PHASE 2: LIQUID SYNTAX AUDIT
// ===========================

function auditLiquidFile(filePath) {
  const buf = fs.readFileSync(filePath);
  const rel = path.relative(ROOT, filePath);
  
  // --- ENCODING CHECK (Phase 8) ---
  // UTF-16 LE BOM
  if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
    addError('BLOCKER', filePath, 1, 'File is UTF-16 LE encoded', 'Shopify requires UTF-8 without BOM');
    return;
  }
  // UTF-16 BE BOM
  if (buf.length >= 2 && buf[0] === 0xFE && buf[1] === 0xFF) {
    addError('BLOCKER', filePath, 1, 'File is UTF-16 BE encoded', 'Shopify requires UTF-8 without BOM');
    return;
  }
  // UTF-8 BOM
  if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    addError('ERROR', filePath, 1, 'File has UTF-8 BOM', 'BOM can break Liquid parser');
  }
  // Null bytes in text file
  let hasNull = false;
  for (let i = 0; i < Math.min(buf.length, 4096); i++) {
    if (buf[i] === 0x00) { hasNull = true; break; }
  }
  if (hasNull) {
    addError('BLOCKER', filePath, 1, 'File contains NULL bytes (0x00)', 'Likely UTF-16 without BOM or binary corruption');
    return;
  }

  const content = buf.toString('utf8');
  const lines = content.split('\n');

  // --- LIQUID TAG BALANCE ---
  const controlPairs = [
    ['if', 'endif'],
    ['unless', 'endunless'],
    ['for', 'endfor'],
    ['case', 'endcase'],
    ['tablerow', 'endtablerow'],
    ['paginate', 'endpaginate'],
    ['form', 'endform'],
    ['capture', 'endcapture'],
    ['comment', 'endcomment'],
    ['raw', 'endraw'],
    ['schema', 'endschema'],
    ['javascript', 'endjavascript'],
    ['style', 'endstyle'],
    ['stylesheet', 'endstylesheet'],
  ];

  // Extract all liquid tags with line numbers
  const tagPattern = /\{%-?\s*(if|elsif|else|endif|unless|endunless|for|endfor|case|when|endcase|tablerow|endtablerow|paginate|endpaginate|form|endform|capture|endcapture|comment|endcomment|raw|endraw|schema|endschema|javascript|endjavascript|style|endstyle|stylesheet|endstylesheet|render|include|assign|liquid|section|sections|layout|break|continue|cycle|increment|decrement|echo)\b/g;

  const tokens = [];
  let match;
  while ((match = tagPattern.exec(content)) !== null) {
    // Find line number
    const before = content.substring(0, match.index);
    const lineNum = before.split('\n').length;
    tokens.push({ tag: match[1], index: match.index, line: lineNum });
  }

  // Stack-based matching
  const opens = controlPairs.map(p => p[0]);
  const closeMap = {};
  controlPairs.forEach(p => { closeMap['end' + p[0]] = p[0]; });

  const stack = [];
  for (const t of tokens) {
    if (opens.includes(t.tag)) {
      stack.push(t);
    } else if (closeMap[t.tag]) {
      const expectedOpen = closeMap[t.tag];
      if (stack.length === 0) {
        addError('ERROR', filePath, t.line, `Orphan closing tag {% ${t.tag} %} without matching {% ${expectedOpen} %}`, 'Unbalanced Liquid tags');
      } else {
        const last = stack[stack.length - 1];
        if (last.tag === expectedOpen) {
          stack.pop();
        } else {
          addError('ERROR', filePath, t.line, `Mismatched tags: expected {% end${last.tag} %} but found {% ${t.tag} %}`, `Opened {% ${last.tag} %} at line ${last.line}`);
          stack.pop(); // recover
        }
      }
    }
  }

  // Unclosed tags
  for (const unclosed of stack) {
    addError('ERROR', filePath, unclosed.line, `Unclosed {% ${unclosed.tag} %} — missing {% end${unclosed.tag} %}`, 'Unbalanced Liquid tags cause parser failure');
  }

  // --- CHECK FOR {% include %} (deprecated) ---
  const includePattern = /\{%-?\s*include\s/g;
  let incMatch;
  while ((incMatch = includePattern.exec(content)) !== null) {
    const before = content.substring(0, incMatch.index);
    const lineNum = before.split('\n').length;
    addError('WARNING', filePath, lineNum, '{% include %} is deprecated', 'Shopify recommends {% render %} instead');
  }

  // --- CHECK FOR {{ }} and {% %} balance ---
  const openDouble = (content.match(/\{\{/g) || []).length;
  const closeDouble = (content.match(/\}\}/g) || []).length;
  if (openDouble !== closeDouble) {
    addError('ERROR', filePath, 0, `Unbalanced {{ }} output tags: {{ count=${openDouble}, }} count=${closeDouble}`, 'Unclosed output tag breaks parser');
  }

  const openTag = (content.match(/\{%/g) || []).length;
  const closeTag = (content.match(/%\}/g) || []).length;
  if (openTag !== closeTag) {
    addError('ERROR', filePath, 0, `Unbalanced {% %} tags: {% count=${openTag}, %} count=${closeTag}`, 'Unclosed Liquid tag breaks parser');
  }

  // --- SCHEMA VALIDATION (Phase 3) ---
  const schemaPattern = /\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/g;
  let schemaMatch;
  while ((schemaMatch = schemaPattern.exec(content)) !== null) {
    const schemaJson = schemaMatch[1];
    const schemaBefore = content.substring(0, schemaMatch.index);
    const schemaLine = schemaBefore.split('\n').length;
    
    try {
      const parsed = JSON.parse(schemaJson);
      
      // Validate required fields
      if (!parsed.name) {
        addError('WARNING', filePath, schemaLine, 'Schema missing "name" property', 'Required by Shopify');
      }
      
      // Validate settings types
      if (parsed.settings && Array.isArray(parsed.settings)) {
        const validTypes = ['text', 'textarea', 'richtext', 'html', 'image_picker', 'url', 'video_url', 'checkbox', 'number', 'range', 'select', 'radio', 'font_picker', 'color', 'color_background', 'color_scheme', 'color_scheme_group', 'collection', 'product', 'blog', 'page', 'link_list', 'liquid', 'article', 'header', 'paragraph', 'inline_richtext', 'video', 'collection_list', 'product_list', 'metaobject', 'metaobject_list', 'menu'];
        for (const setting of parsed.settings) {
          if (setting.type && !validTypes.includes(setting.type)) {
            addError('WARNING', filePath, schemaLine, `Schema setting type "${setting.type}" may not be supported`, `Setting id: ${setting.id || 'unknown'}`);
          }
        }
      }

      // Validate blocks
      if (parsed.blocks && Array.isArray(parsed.blocks)) {
        for (const block of parsed.blocks) {
          if (!block.type) {
            addError('ERROR', filePath, schemaLine, 'Schema block missing "type"', 'Required by Shopify');
          }
        }
      }
    } catch (e) {
      addError('BLOCKER', filePath, schemaLine, `Invalid JSON in {% schema %}: ${e.message}`, 'Broken schema JSON causes "can\'t be parsed" error');
    }
  }

  // --- CHECK FOR LIQUID INSIDE {% liquid %} BLOCKS ---
  const liquidBlockPattern = /\{%-?\s*liquid\b([\s\S]*?)-?%\}/g;
  let lbMatch;
  while ((lbMatch = liquidBlockPattern.exec(content)) !== null) {
    const inner = lbMatch[1];
    if (inner.includes('{{') || inner.includes('}}') || inner.includes('{%') || inner.includes('%}')) {
      const before = content.substring(0, lbMatch.index);
      const lineNum = before.split('\n').length;
      addError('ERROR', filePath, lineNum, 'Nested {{ }} or {% %} inside {% liquid %} block', 'The liquid tag uses bare syntax without delimiters');
    }
  }
}

// ===========================
// PHASE: JSON VALIDATION
// ===========================

function auditJsonFile(filePath) {
  const buf = fs.readFileSync(filePath);
  const rel = path.relative(ROOT, filePath);
  
  // Encoding check
  if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
    addError('BLOCKER', filePath, 1, 'JSON file is UTF-16 LE encoded', 'Shopify requires UTF-8');
    return;
  }
  if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    addError('ERROR', filePath, 1, 'JSON file has UTF-8 BOM', 'BOM breaks JSON parsing in Shopify');
  }
  let hasNull = false;
  for (let i = 0; i < Math.min(buf.length, 4096); i++) {
    if (buf[i] === 0x00) { hasNull = true; break; }
  }
  if (hasNull) {
    addError('BLOCKER', filePath, 1, 'JSON file contains NULL bytes', 'Likely UTF-16 or binary corruption');
    return;
  }

  const content = buf.toString('utf8');
  try {
    JSON.parse(content);
  } catch (e) {
    addError('BLOCKER', filePath, 1, `Invalid JSON: ${e.message}`, 'Invalid JSON causes import failure');
  }
}

// ===========================
// PHASE: CSS ENCODING CHECK
// ===========================

function auditCssOrJsFile(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
    addError('BLOCKER', filePath, 1, 'CSS/JS file is UTF-16 LE encoded', 'Shopify requires UTF-8');
    return;
  }
  if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    addError('WARNING', filePath, 1, 'CSS/JS file has UTF-8 BOM', 'BOM may cause issues');
  }
  let hasNull = false;
  for (let i = 0; i < Math.min(buf.length, 4096); i++) {
    if (buf[i] === 0x00) { hasNull = true; break; }
  }
  if (hasNull) {
    addError('BLOCKER', filePath, 1, 'CSS/JS file contains NULL bytes', 'Likely UTF-16 or corrupted');
  }
}

// ===========================
// SCAN ALL FILES
// ===========================

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanDir(full);
    } else {
      const ext = path.extname(item).toLowerCase();
      if (ext === '.liquid') {
        auditLiquidFile(full);
      } else if (ext === '.json') {
        auditJsonFile(full);
      } else if (ext === '.css' || ext === '.js') {
        auditCssOrJsFile(full);
      }
    }
  }
}

console.log('========================================');
console.log('AUDITORÍA FORENSE COMPLETA');
console.log('LA BONITA JOYERÍA SHOPIFY THEME');
console.log('========================================\n');

// Scan root-level theme folders (these are what Shopify reads)
THEME_FOLDERS.forEach(folder => {
  const dir = path.join(ROOT, folder);
  if (fs.existsSync(dir)) {
    console.log(`Scanning ${folder}/...`);
    scanDir(dir);
  } else {
    addError('BLOCKER', dir, 0, `Missing required folder: ${folder}/`, 'Shopify OS 2.0 requires this folder');
  }
});

// ===========================
// PHASE 5: TEMPLATE VALIDATION
// ===========================

console.log('\nValidating template references...');
const templatesDir = path.join(ROOT, 'templates');
const sectionsDir = path.join(ROOT, 'sections');

function getAvailableSections() {
  const secs = new Set();
  if (!fs.existsSync(sectionsDir)) return secs;
  for (const f of fs.readdirSync(sectionsDir)) {
    if (f.endsWith('.liquid')) {
      secs.add(f.replace('.liquid', ''));
    }
  }
  return secs;
}

const availableSections = getAvailableSections();
console.log(`  Available sections: ${availableSections.size}`);

function validateTemplateJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch(e) {
    // Already caught by auditJsonFile
    return;
  }

  if (parsed.sections) {
    for (const [key, section] of Object.entries(parsed.sections)) {
      if (section.type && !availableSections.has(section.type)) {
        addError('ERROR', filePath, 0, `Template references non-existent section "${section.type}"`, `Section key: "${key}"`);
      }
    }
  }
}

if (fs.existsSync(templatesDir)) {
  const files = fs.readdirSync(templatesDir);
  for (const f of files) {
    const full = path.join(templatesDir, f);
    const stat = fs.statSync(full);
    if (stat.isFile() && f.endsWith('.json')) {
      validateTemplateJson(full);
    } else if (stat.isDirectory() && f === 'customers') {
      const custFiles = fs.readdirSync(full);
      for (const cf of custFiles) {
        if (cf.endsWith('.json')) {
          validateTemplateJson(path.join(full, cf));
        }
      }
    }
  }
}

// ===========================
// PHASE 6: SECTION GROUPS
// ===========================

console.log('\nValidating section groups...');
const headerGroup = path.join(sectionsDir, 'header-group.json');
const footerGroup = path.join(sectionsDir, 'footer-group.json');

if (!fs.existsSync(headerGroup)) {
  addError('BLOCKER', headerGroup, 0, 'Missing header-group.json', 'Required for Shopify OS 2.0');
} else {
  try {
    const hg = JSON.parse(fs.readFileSync(headerGroup, 'utf8'));
    if (hg.sections) {
      for (const [key, sec] of Object.entries(hg.sections)) {
        if (sec.type && !availableSections.has(sec.type)) {
          addError('ERROR', headerGroup, 0, `header-group references non-existent section "${sec.type}"`, `Key: ${key}`);
        }
      }
    }
    console.log('  header-group.json: OK');
  } catch(e) {
    addError('BLOCKER', headerGroup, 0, `Invalid JSON in header-group.json: ${e.message}`, 'Broken section group');
  }
}

if (!fs.existsSync(footerGroup)) {
  addError('BLOCKER', footerGroup, 0, 'Missing footer-group.json', 'Required for Shopify OS 2.0');
} else {
  try {
    const fg = JSON.parse(fs.readFileSync(footerGroup, 'utf8'));
    if (fg.sections) {
      for (const [key, sec] of Object.entries(fg.sections)) {
        if (sec.type && !availableSections.has(sec.type)) {
          addError('ERROR', footerGroup, 0, `footer-group references non-existent section "${sec.type}"`, `Key: ${key}`);
        }
      }
    }
    console.log('  footer-group.json: OK');
  } catch(e) {
    addError('BLOCKER', footerGroup, 0, `Invalid JSON in footer-group.json: ${e.message}`, 'Broken section group');
  }
}

// ===========================
// PHASE 4: theme.liquid VALIDATION
// ===========================

console.log('\nValidating layout/theme.liquid...');
const themeLiquid = path.join(ROOT, 'layout', 'theme.liquid');
if (fs.existsSync(themeLiquid)) {
  const tl = fs.readFileSync(themeLiquid, 'utf8');
  
  if (!tl.includes('content_for_layout')) {
    addError('BLOCKER', themeLiquid, 0, 'Missing {{ content_for_layout }}', 'Required by Shopify');
  } else {
    console.log('  content_for_layout: PRESENT');
  }
  
  if (!tl.includes('content_for_header')) {
    addError('BLOCKER', themeLiquid, 0, 'Missing {{ content_for_header }}', 'Required by Shopify');
  } else {
    console.log('  content_for_header: PRESENT');
  }
  
  if (!tl.includes("sections 'header-group'")) {
    addError('BLOCKER', themeLiquid, 0, "Missing {% sections 'header-group' %}", 'Required for OS 2.0 section groups');
  } else {
    console.log("  sections 'header-group': PRESENT");
  }
  
  if (!tl.includes("sections 'footer-group'")) {
    addError('BLOCKER', themeLiquid, 0, "Missing {% sections 'footer-group' %}", 'Required for OS 2.0 section groups');
  } else {
    console.log("  sections 'footer-group': PRESENT");
  }
} else {
  addError('BLOCKER', themeLiquid, 0, 'Missing layout/theme.liquid', 'Required by Shopify');
}

// ===========================
// PHASE 7: ASSET REFERENCES
// ===========================

console.log('\nValidating asset references...');
const assetsDir = path.join(ROOT, 'assets');
const availableAssets = new Set();
if (fs.existsSync(assetsDir)) {
  for (const f of fs.readdirSync(assetsDir)) {
    availableAssets.add(f);
  }
}
console.log(`  Available assets: ${availableAssets.size}`);

// Check render references in snippets
console.log('\nChecking render references...');
const availableSnippets = new Set();
const snippetsDir = path.join(ROOT, 'snippets');
if (fs.existsSync(snippetsDir)) {
  for (const f of fs.readdirSync(snippetsDir)) {
    if (f.endsWith('.liquid')) {
      availableSnippets.add(f.replace('.liquid', ''));
    }
  }
}

function checkRenderRefs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const renderPattern = /\{%-?\s*render\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = renderPattern.exec(content)) !== null) {
    const snippetName = m[1];
    if (!availableSnippets.has(snippetName)) {
      const before = content.substring(0, m.index);
      const lineNum = before.split('\n').length;
      addError('ERROR', filePath, lineNum, `{% render '${snippetName}' %} references non-existent snippet`, 'Missing snippet file');
    }
  }
}

// Check all liquid files for render references
function checkAllRenderRefs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      checkAllRenderRefs(full);
    } else if (f.endsWith('.liquid')) {
      checkRenderRefs(full);
    }
  }
}

['layout', 'sections', 'snippets', 'templates'].forEach(folder => {
  checkAllRenderRefs(path.join(ROOT, folder));
});

// ===========================
// PHASE: bonita-luxury-storefront SPECIFIC CHECK
// ===========================

console.log('\nSpecial check: bonita-luxury-storefront.liquid...');
const storefrontPath = path.join(sectionsDir, 'bonita-luxury-storefront.liquid');
if (fs.existsSync(storefrontPath)) {
  const sfContent = fs.readFileSync(storefrontPath, 'utf8');
  console.log(`  File size: ${sfContent.length} bytes (${(sfContent.length / 1024).toFixed(0)} KB)`);
  
  // Check for JavaScript template literals with ${ } that might confuse Liquid parser
  // This is a KNOWN ISSUE: JavaScript template literals using ${} can be confused with Liquid
  const jsBlocks = [];
  const scriptPattern = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let jsMatch;
  while ((jsMatch = scriptPattern.exec(sfContent)) !== null) {
    const jsContent = jsMatch[1];
    const jsBefore = sfContent.substring(0, jsMatch.index);
    const jsStartLine = jsBefore.split('\n').length;
    
    // Check for template literals with ${ }
    const templateLiteralPattern = /`[^`]*\$\{[^}]*\}[^`]*`/g;
    let tlMatch;
    while ((tlMatch = templateLiteralPattern.exec(jsContent)) !== null) {
      const tlBefore = sfContent.substring(0, jsMatch.index + tlMatch.index);
      const tlLine = tlBefore.split('\n').length;
      addError('WARNING', storefrontPath, tlLine, `JavaScript template literal with \${} found`, 'Template literals with \${} can sometimes confuse Liquid parser');
    }
  }
  
  // Check if file has any Liquid tags at all (it's 190KB - might be pure HTML/JS/CSS)
  const liquidTagCount = (sfContent.match(/\{[{%]/g) || []).length;
  console.log(`  Liquid tags found: ${liquidTagCount}`);
  
  if (liquidTagCount === 0 && sfContent.includes('{% schema %}')) {
    console.log('  NOTE: File has schema but no other Liquid tags');
  }
  
  // Check the schema specifically
  const schemaMatch = sfContent.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (schemaMatch) {
    try {
      JSON.parse(schemaMatch[1]);
      console.log('  Schema JSON: VALID');
    } catch(e) {
      console.log(`  Schema JSON: INVALID - ${e.message}`);
    }
  } else {
    console.log('  Schema: NOT FOUND (checking raw bytes...)');
    // Check if schema tags exist but with different encoding
    const rawBuf = fs.readFileSync(storefrontPath);
    const schemaStr = 'schema';
    let found = false;
    for (let i = 0; i < rawBuf.length - schemaStr.length; i++) {
      let match = true;
      for (let j = 0; j < schemaStr.length; j++) {
        if (rawBuf[i + j] !== schemaStr.charCodeAt(j)) { match = false; break; }
      }
      if (match) { found = true; break; }
    }
    console.log(`  Raw 'schema' string found in bytes: ${found}`);
  }
} else {
  addError('BLOCKER', storefrontPath, 0, 'bonita-luxury-storefront.liquid does not exist', 'Referenced by index.json');
}

// ===========================
// REPORT
// ===========================

console.log('\n========================================');
console.log('RESULTS');
console.log('========================================\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('STATUS: ALL CLEAR — NO ERRORS OR WARNINGS FOUND\n');
} else {
  console.log(`BLOCKERS + ERRORS: ${errors.length}`);
  console.log(`WARNINGS: ${warnings.length}`);
  console.log(`INFO: ${info.length}\n`);
}

if (errors.length > 0) {
  console.log('--- ERRORS ---');
  errors.forEach(e => {
    console.log(`[${e.severity}] ${e.file}:${e.line}`);
    console.log(`  Error: ${e.error}`);
    console.log(`  Cause: ${e.cause}`);
    console.log('');
  });
}

if (warnings.length > 0) {
  console.log('--- WARNINGS ---');
  warnings.forEach(w => {
    console.log(`[${w.severity}] ${w.file}:${w.line}`);
    console.log(`  Warning: ${w.error}`);
    console.log(`  Cause: ${w.cause}`);
    console.log('');
  });
}

// Write results to JSON for consumption
const results = { errors, warnings, info, timestamp: new Date().toISOString() };
fs.writeFileSync(path.join(__dirname, 'audit_results.json'), JSON.stringify(results, null, 2));
console.log('Full results written to code/audit_results.json');
