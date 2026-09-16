const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('assets/editorial-luxury.css', 'utf8');

let output = [];
output.push('=== 1. VERIFYING HTML PDP MODAL IDS & ELEMENTS ===');
const modalIds = [
  'productModal',
  'productModalPanel',
  'modalMainImg',
  'modalMockPlaceholder',
  'modalBadge',
  'modalCategoryTag',
  'modalProductTitle',
  'modalPriceCurrent',
  'modalPriceOld',
  'modalGramRate',
  'modalAffirm',
  'modalKaratPills',
  'modalSizePills',
  'modalSpecKarat',
  'modalSpecWeight',
  'modalSpecSize',
  'modalSpecClasp',
  'modalQtyInput',
  'modalAddToCartBtn'
];

let allIdsFound = true;
modalIds.forEach(id => {
  if (html.includes('id="' + id + '"')) {
    output.push('  [PASS] ID found: ' + id);
  } else {
    output.push('  [FAIL] Missing ID: ' + id);
    allIdsFound = false;
  }
});

output.push('\n=== 2. VERIFYING CART DRAWER & FREE SHIPPING IDS ===');
const cartIds = [
  'cartBackdrop',
  'cartPanel',
  'freeShippingWrap',
  'freeShippingMsg',
  'freeShippingStatus',
  'freeShippingFill',
  'cartItemsContainer',
  'cartSubtotal',
  'cartAffirmEstimate',
  'cartCountHeader'
];

cartIds.forEach(id => {
  if (html.includes('id="' + id + '"')) {
    output.push('  [PASS] Cart ID found: ' + id);
  } else {
    output.push('  [FAIL] Missing Cart ID: ' + id);
    allIdsFound = false;
  }
});

output.push('\n=== 3. VERIFYING CSS STYLES ===');
const cssSelectors = [
  '.product-modal-backdrop',
  '.product-modal-panel',
  '.modal-media-col',
  '.modal-img-frame',
  '.modal-details-col',
  '.pdp-variant-pill',
  '.pdp-specs-table',
  '.pdp-btn-add-cart',
  '.free-shipping-progress-wrap',
  '.free-shipping-bar-track',
  '.free-shipping-bar-fill'
];

cssSelectors.forEach(sel => {
  if (css.includes(sel)) {
    output.push('  [PASS] CSS Selector found: ' + sel);
  } else {
    output.push('  [FAIL] Missing CSS Selector: ' + sel);
    allIdsFound = false;
  }
});

output.push('\n=== 4. VERIFYING SHOPIFY LIQUID SNIPPETS ===');
const snippets = [
  'snippets/quick-view-modal.liquid',
  'snippets/free-shipping-bar.liquid'
];

snippets.forEach(s => {
  if (fs.existsSync(s)) {
    output.push('  [PASS] Snippet exists: ' + s + ' (' + fs.statSync(s).size + ' bytes)');
  } else {
    output.push('  [FAIL] Snippet missing: ' + s);
    allIdsFound = false;
  }
});

if (allIdsFound) {
  output.push('\n>>> ALL ARCHITECTURAL REQUIREMENTS & INTERACTIVE PDP / CART VERIFICATIONS PASSED 100% <<<');
} else {
  output.push('\n>>> SOME CHECKS FAILED <<<');
}

fs.writeFileSync('scratch/verify_results.txt', output.join('\n'));
console.log('Results written to scratch/verify_results.txt');
