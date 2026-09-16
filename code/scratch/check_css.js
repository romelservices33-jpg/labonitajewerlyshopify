const fs = require('fs');
const css = fs.readFileSync('c:/TRABAJO/La Bonita Joyeria/code/assets/editorial-luxury.css', 'utf8');
const lines = css.split('\n');

const matches = [];
lines.forEach((line, index) => {
  if (line.includes('cat-square-card') || line.includes('cat-slider-track') || line.includes('hero-overlapping-cards-wrap') || line.includes('cat-card-footer')) {
    matches.push(`Line ${index + 1}: ${line}`);
  }
});

fs.writeFileSync('c:/TRABAJO/La Bonita Joyeria/code/scratch/matches.txt', matches.join('\n'));
