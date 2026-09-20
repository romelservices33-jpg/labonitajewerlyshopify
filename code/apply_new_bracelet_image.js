const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = 'C:\\Users\\migue\\Downloads\\Change_bracelet_in_image_4K_20260920084121.jpeg';
if (!fs.existsSync(src)) {
  console.error('Source file not found:', src);
  process.exit(1);
}

const targets = [
  path.join(__dirname, '..', 'assets', 'collection-pulseras.jpg'),
  path.join(__dirname, 'assets', 'collection-pulseras.jpg')
];

targets.forEach(dest => {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  // Use ffmpeg to scale to 1600x1600 with high quality q:v 2
  execSync(`ffmpeg -y -i "${src}" -vf "scale=1600:1600" -q:v 2 "${dest}"`, { stdio: 'inherit' });
  const stat = fs.statSync(dest);
  console.log('Generated:', dest, 'Size:', stat.size, 'bytes');
});

// Also backup original if fotos dir exists
const fotosDir = 'C:\\TRABAJO\\La Bonita Joyeria\\fotos\\pulseras';
if (fs.existsSync(fotosDir)) {
  const destOrig = path.join(fotosDir, 'Change_bracelet_in_image_4K_20260920084121.jpeg');
  fs.copyFileSync(src, destOrig);
  console.log('Backed up original to:', destOrig);
}

console.log('New pulseras category image successfully applied.');
