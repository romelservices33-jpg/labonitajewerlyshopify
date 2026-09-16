const fs = require('fs');
const path = require('path');

const codeDir = path.resolve(__dirname);
const folders = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

let hasError = false;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanDir(full);
    } else {
      const ext = path.extname(file).toLowerCase();
      const content = fs.readFileSync(full, 'utf8');

      if (ext === '.json') {
        try {
          // Strip Shopify comment banners if present
          const cleanJson = content.replace(/\/\*[\s\S]*?\*\//g, '').trim();
          JSON.parse(cleanJson);
        } catch (e) {
          console.error(`[JSON ERROR] in ${full}: ${e.message}`);
          hasError = true;
        }
      } else if (ext === '.liquid') {
        // Validar bloques schema
        const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
        if (schemaMatch) {
          try {
            JSON.parse(schemaMatch[1]);
          } catch (e) {
            console.error(`[LIQUID SCHEMA JSON ERROR] in ${full}: ${e.message}`);
            hasError = true;
          }
        }

        // Validar balance de tags básicos
        const tags = [
          ['{% schema %}', '{% endschema %}'],
          ['{% javascript %}', '{% endjavascript %}'],
          ['{% style %}', '{% endstyle %}'],
          ['{% comment %}', '{% endcomment %}'],
          ['{% raw %}', '{% endraw %}']
        ];

        for (const [openTag, closeTag] of tags) {
          const openCount = (content.match(new RegExp(openTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
          const closeCount = (content.match(new RegExp(closeTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
          if (openCount !== closeCount) {
            console.error(`[LIQUID TAG MISMATCH] in ${full}: ${openTag} (${openCount}) vs ${closeTag} (${closeCount})`);
            hasError = true;
          }
        }
      }
    }
  }
}

folders.forEach(f => {
  const dir = path.join(codeDir, f);
  if (fs.existsSync(dir)) scanDir(dir);
});

if (!hasError) {
  console.log('TODO LOS ARCHIVOS LIQUID Y JSON SON 100% VÁLIDOS!');
} else {
  console.log('Se encontraron errores arriba.');
}
