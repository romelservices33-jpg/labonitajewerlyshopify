const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'sections', 'bonita-luxury-storefront.liquid');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all affirm-monthly-badge static "Oro 100% Auténtico Garantizado" with dynamic Affirm monthly estimate
content = content.replace(/<div class="product-shop-card cutout-product-card"[^>]*data-price="([^"]+)"[^>]*data-weight="([^"]+)"[^>]*data-size="([^"]+)"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, function(cardMatch, priceStr, weightStr, sizeStr) {
  const price = parseFloat(priceStr) || 500;
  const monthlyAffirm = Math.max(20, Math.round(price / 12));
  
  // Replace affirm-monthly-badge
  let updatedCard = cardMatch.replace(/<div class="affirm-monthly-badge">[\s\S]*?<\/div>/, `<div class="affirm-monthly-badge">Desde <strong>$${monthlyAffirm}/mes</strong> con Affirm</div>`);
  
  // Ensure spec-weight-tag in cutout-title-row
  if (!updatedCard.includes('spec-weight-tag')) {
    let cleanSize = (sizeStr || '').replace('arete-dije', '').replace('talla-', 'Talla ').trim();
    let specText = '';
    if (cleanSize) {
      specText = `${cleanSize} · `;
    }
    specText += `${weightStr} g · Envío Asegurado`;
    
    updatedCard = updatedCard.replace(/(<h4 class="cutout-product-title">[\s\S]*?<\/h4>)/, `$1\n            <span class="spec-weight-tag">${specText}</span>`);
  }
  
  return updatedCard;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Storefront cards updated successfully with clean typography and Affirm financing!');
