const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const artDir = 'C:\\Users\\migue\\.gemini\\antigravity-ide\\brain\\6b641f7b-7651-47e7-bbda-651e524f7cb7\\scratch';
if (!fs.existsSync(artDir)) fs.mkdirSync(artDir, { recursive: true });

const fotosBase = 'C:\\TRABAJO\\La Bonita Joyeria\\fotos';
const dirs = ['anillos', 'aretes', 'collares', 'pulseras'];

dirs.forEach(d => {
  const dirPath = path.join(fotosBase, d);
  const files = fs.readdirSync(dirPath);
  files.forEach((f, idx) => {
    const fullPath = path.join(dirPath, f);
    const outName = `preview_${d}_${idx}.jpg`;
    const outPath = path.join(artDir, outName);
    try {
      execSync(`ffmpeg -y -i "${fullPath}" -vf "scale=600:-1" "${outPath}"`, { stdio: 'inherit' });
      console.log(`Created ${outName} from ${d}/${f}`);
    } catch(e) {
      console.error(`Failed for ${f}:`, e.message);
    }
  });
});
