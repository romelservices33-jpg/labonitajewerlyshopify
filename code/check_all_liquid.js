const fs = require('fs');
const path = require('path');

const folders = ['layout', 'sections', 'snippets', 'templates'];
const codeDir = path.resolve(__dirname);

console.log('=== ANALIZADOR ESTRICTO DE LIQUID ===\n');

let totalErrors = 0;

function checkLiquidFile(filePath) {
  const rel = path.relative(codeDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // Tokenize Liquid tags: {% ... %} and {{ ... }}
  const tagRegex = /\{%[\s\S]*?%\}/g;
  const outputRegex = /\{\{[\s\S]*?\}\}/g;

  // 1. Check for unclosed {% or {{
  const openTags = (content.match(/\{%/g) || []).length;
  const closeTags = (content.match(/%\}/g) || []).length;
  if (openTags !== closeTags) {
    console.error(`[ERROR] ${rel}: Mismatch en etiquetas Liquid {% (${openTags}) vs %} (${closeTags})`);
    totalErrors++;
  }

  const openOuts = (content.match(/\{\{/g) || []).length;
  const closeOuts = (content.match(/\}\}/g) || []).length;
  if (openOuts !== closeOuts) {
    console.error(`[ERROR] ${rel}: Mismatch en variables Liquid {{ (${openOuts}) vs }} (${closeOuts})`);
    totalErrors++;
  }

  // 2. Stack-based tag matcher for nested control flow
  const stack = [];
  let match;
  const controlRegex = /\{%-?\s*(if|unless|for|case|tablerow|paginate|form|capture|schema|javascript|style|comment|raw)\b[\s\S]*?%\}/g;
  const endControlRegex = /\{%-?\s*end(if|unless|for|case|tablerow|paginate|form|capture|schema|javascript|style|comment|raw)\b[\s\S]*?%\}/g;

  const allTokens = [];
  let m;
  const allTagRegex = /\{%-?\s*(\/?[\w]+)\b([\s\S]*?)%\}/g;
  while ((m = allTagRegex.exec(content)) !== null) {
    const rawTag = m[0];
    const tagName = m[1];
    allTokens.push({ rawTag, tagName, index: m.index });
  }

  const controlPairs = {
    'if': 'endif',
    'unless': 'endunless',
    'for': 'endfor',
    'case': 'endcase',
    'tablerow': 'endtablerow',
    'paginate': 'endpaginate',
    'form': 'endform',
    'capture': 'endcapture',
    'schema': 'endschema',
    'javascript': 'endjavascript',
    'style': 'endstyle',
    'comment': 'endcomment',
    'raw': 'endraw'
  };

  const opens = Object.keys(controlPairs);
  const closes = Object.values(controlPairs);

  const blockStack = [];
  for (const t of allTokens) {
    if (opens.includes(t.tagName)) {
      blockStack.push(t);
    } else if (closes.includes(t.tagName)) {
      const last = blockStack.pop();
      if (!last) {
        console.error(`[ERROR] ${rel}: Cierre huérfano {% ${t.rawTag} %} sin apertura previa`);
        totalErrors++;
      } else if (controlPairs[last.tagName] !== t.tagName) {
        console.error(`[ERROR] ${rel}: Mismatch de bloques: Se abrió {% ${last.tagName} %} pero se cerró con {% ${t.tagName} %}`);
        totalErrors++;
      }
    }
  }

  if (blockStack.length > 0) {
    for (const unclosed of blockStack) {
      console.error(`[ERROR] ${rel}: Bloque {% ${unclosed.tagName} %} nunca fue cerrado (falta {% ${controlPairs[unclosed.tagName]} %})`);
      totalErrors++;
    }
  }

  // 3. Check for liquid tag invalid syntax
  const liquidBlocks = content.match(/\{%-?\s*liquid\b([\s\S]*?)%\}/g) || [];
  for (const lb of liquidBlocks) {
    if (lb.includes('{%') || lb.includes('%}') || lb.includes('{{') || lb.includes('}}')) {
      console.error(`[ERROR] ${rel}: Sintaxis mixta inválida dentro de bloque {% liquid %}`);
      totalErrors++;
    }
  }

  // 4. Check render tags for invalid filters (Shopify strict parser bans filters in render tags)
  const renderTags = content.match(/\{%-?\s*render\s+[^%]+%\}/g) || [];
  for (const rt of renderTags) {
    // Check if there is a pipe | outside of quotes
    const tagInner = rt.replace(/^\{%-?\s*render\s+/, '').replace(/-?%\}$/, '');
    // In Shopify, render tag takes: render 'snippet', var: val (NO filters allowed on snippet name)
    const firstArg = tagInner.trim().split(/[\s,]+/)[0];
    if (firstArg.includes('|')) {
      console.error(`[ERROR] ${rel}: Filtro no permitido en {% render %}: ${rt}`);
      totalErrors++;
    }
  }
}

function scan(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scan(full);
    } else if (item.endsWith('.liquid')) {
      checkLiquidFile(full);
    }
  }
}

folders.forEach(f => {
  const dir = path.join(codeDir, f);
  if (fs.existsSync(dir)) scan(dir);
});

console.log(`\nTotal errores encontrados en Liquid: ${totalErrors}`);
