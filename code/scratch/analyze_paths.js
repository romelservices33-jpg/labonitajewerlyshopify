const fs = require('fs');

const svgContent = fs.readFileSync('c:/TRABAJO/La Bonita Joyeria/Nueva carpeta/logo comnpleto.svg', 'utf8');

const pathRegex = /<path[^>]*\sd="([^"]+)"/g;
let match;
let count = 0;
let output = [];

while ((match = pathRegex.exec(svgContent)) !== null) {
  count++;
  const d = match[1];
  output.push(`Path ${count}: length of d string = ${d.length}, starts with: ${d.substring(0, 40)}`);
}

fs.writeFileSync('c:/TRABAJO/La Bonita Joyeria/code/scratch/path_results.txt', output.join('\n'));
process.exit(0);

