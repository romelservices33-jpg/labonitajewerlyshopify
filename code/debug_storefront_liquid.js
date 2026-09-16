const fs = require('fs');
const path = require('path');

const liquidPath = path.join(__dirname, 'sections', 'bonita-luxury-storefront.liquid');
const content = fs.readFileSync(liquidPath, 'utf8');

console.log('Size:', content.length);
console.log('First 200 chars:', content.slice(0, 200));

// Find all matches of {{ or {%
const tagRegex = /\{[{%][\s\S]*?[}%]\}/g;
let match;
let count = 0;
while ((match = tagRegex.exec(content)) !== null) {
  count++;
  console.log(`Tag #${count} at ${match.index}: ${match[0].slice(0, 80)}`);
}

// Check for any unclosed or stray { or }
let unclosedBraces = [];
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('{{') && !line.includes('}}')) {
    console.log(`Posible unclosed {{ en línea ${idx + 1}: ${line.trim()}`);
  }
  if (line.includes('{%') && !line.includes('%}')) {
    console.log(`Posible unclosed {% en línea ${idx + 1}: ${line.trim()}`);
  }
});
