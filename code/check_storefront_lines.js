const fs = require('fs');
const path = require('path');

const codeDir = __dirname;
const storefrontPath = path.join(codeDir, 'sections', 'bonita-luxury-storefront.liquid');
const content = fs.readFileSync(storefrontPath, 'utf8');

const lines = content.split('\n');
console.log('Total lines in storefront:', lines.length);

let liquidLines = 0;
lines.forEach((l, idx) => {
  if (l.includes('{{') || l.includes('{%')) {
    liquidLines++;
    console.log(`L${idx + 1}: ${l.trim()}`);
  }
});
console.log('Total liquid lines:', liquidLines);
