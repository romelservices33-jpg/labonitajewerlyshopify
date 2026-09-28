const fs = require('fs');

const indexHtml = fs.readFileSync('c:/TRABAJO/La Bonita Joyeria/code/index.html', 'utf8');
const cardMatches = indexHtml.match(/class="[^"]*cutout-product-card[^"]*"[^>]*>/g) || [];
console.log('Total cutout cards in index.html:', cardMatches.length);
cardMatches.forEach((card, idx) => {
  const cat = card.match(/data-category="([^"]*)"/);
  console.log(`Card ${idx + 1}: category = ${cat ? cat[1] : 'NONE'}`);
});

const liquidFile = fs.readFileSync('c:/TRABAJO/La Bonita Joyeria/code/sections/bonita-luxury-storefront.liquid', 'utf8');
const liquidCards = liquidFile.match(/class="[^"]*cutout-product-card[^"]*"[^>]*>/g) || [];
console.log('Total cutout cards in liquid:', liquidCards.length);
