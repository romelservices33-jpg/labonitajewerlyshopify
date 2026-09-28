const fs = require('fs');
const path = require('path');

const rootDir = 'c:/TRABAJO/La Bonita Joyeria';

const files = [
  path.join(rootDir, 'sections', 'bonita-square-collections.liquid'),
  path.join(rootDir, 'code', 'sections', 'bonita-square-collections.liquid')
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Add onclick to block cards
  content = content.replace(
    /<a href="\{\{ block\.settings\.link \| default: '\/collections\/all' \}\}" class="cat-square-card"/g,
    `<a href="{{ block.settings.link | default: '#catalogo' }}" onclick="if(typeof window.filterCatalog==='function'){var t='{{ block.settings.title | downcase }}'; if(t.includes('cadena'))window.filterCatalog('cadenas');else if(t.includes('anillo'))window.filterCatalog('anillos');else if(t.includes('arete'))window.filterCatalog('aretes');else if(t.includes('pulsera'))window.filterCatalog('pulseras');else if(t.includes('cuban'))window.filterCatalog('cuban');else if(t.includes('dije')||t.includes('medalla'))window.filterCatalog('dijes');else window.filterCatalog('todos'); return false;}" class="cat-square-card"`
  );

  // Add onclick to default fallback cards
  content = content.replace(
    /<a href="\/collections\/cadenas" class="cat-square-card">/g,
    `<a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('cadenas');return false;}" class="cat-square-card">`
  );
  content = content.replace(
    /<a href="\/collections\/anillos" class="cat-square-card">/g,
    `<a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('anillos');return false;}" class="cat-square-card">`
  );
  content = content.replace(
    /<a href="\/collections\/aretes" class="cat-square-card">/g,
    `<a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('aretes');return false;}" class="cat-square-card">`
  );
  content = content.replace(
    /<a href="\/collections\/pulseras" class="cat-square-card">/g,
    `<a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('pulseras');return false;}" class="cat-square-card">`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[UPDATED SQUARE CARDS ONCLICK] ${filePath}`);
});
