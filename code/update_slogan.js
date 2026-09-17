const fs = require('fs');

const files = [
  'sections/bonita-luxury-storefront.liquid',
  'code/sections/bonita-luxury-storefront.liquid',
  'sections/editorial-hero.liquid',
  'code/sections/editorial-hero.liquid',
  'code/index.html'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(
      'Brilla con Estilo, <span class="gold-highlight">Brilla con Oro</span>',
      'La Bonita Joyería, <span class="gold-highlight">donde todo el mundo gana</span>'
    );
    c = c.replace(
      'Brilla con Estilo,\nBrilla con Oro.',
      'La Bonita Joyería,\ndonde todo el mundo gana.'
    );
    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated slogan in:', f);
  }
});

// Update CSS white-space for headline
['assets/editorial-luxury.css', 'code/assets/editorial-luxury.css'].forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(
      /\.hero-main-headline\s*\{[\s\S]*?white-space:\s*nowrap;/m,
      (m) => m.replace('white-space: nowrap;', 'white-space: normal;\n  max-width: 680px;')
    );
    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated CSS in:', f);
  }
});
