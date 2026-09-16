const fs = require('fs');
const b = fs.readFileSync('sections/bonita-luxury-storefront.liquid');
console.log('SIZE:', b.length);
console.log('FIRST_20_BYTES:', Array.from(b.slice(0,20)).join(','));
let nullCount = 0;
for (let i = 0; i < b.length; i++) { if (b[i] === 0) nullCount++; }
console.log('NULL_BYTES:', nullCount);
let liqTags = 0;
for (let i = 0; i < b.length - 1; i++) {
  if (b[i] === 0x7B && b[i+1] === 0x7B) liqTags++; // {{
  if (b[i] === 0x7B && b[i+1] === 0x25) liqTags++; // {%
}
console.log('LIQUID_TAGS:', liqTags);
process.exit(0);
