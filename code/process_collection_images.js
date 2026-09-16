const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const assetsDir = path.join(__dirname, 'assets');
const fotosBase = 'C:\\TRABAJO\\La Bonita Joyeria\\fotos';

const mappings = [
  {
    src: path.join(fotosBase, 'collares', 'Gold_chain_on_marble_sculpture_4K_20260914084444.jpeg'),
    destName: 'collection-cadenas.jpg',
    destOriginal: 'collection-cadenas-original.jpg'
  },
  {
    src: path.join(fotosBase, 'anillos', 'Marble_hand_wearing_luxury_rings_4K_20260914100747.jpeg'),
    destName: 'collection-anillos.jpg',
    destOriginal: 'collection-anillos-original.jpg'
  },
  {
    src: path.join(fotosBase, 'anillos', 'Marble_hand_wearing_signet_ring_2K_20260914102226.jpeg'),
    destName: 'product-anillo-signet.jpg',
    destOriginal: 'product-anillo-signet-original.jpg'
  },
  {
    src: path.join(fotosBase, 'anillos', 'Marble_hand_wearing_signet_ring_2K_20260914102237.jpeg'),
    destName: 'product-anillo-signet-side.jpg',
    destOriginal: 'product-anillo-signet-side-original.jpg'
  },
  {
    src: path.join(fotosBase, 'aretes', 'Marble_sculpture_wearing_gold_ea…_4K_20260914095510.jpeg'),
    destName: 'collection-aretes.jpg',
    destOriginal: 'collection-aretes-original.jpg'
  },
  {
    src: path.join(fotosBase, 'aretes', 'Marble_sculpture_wearing_gold_ea…_4K_20260914100215.jpeg'),
    destName: 'product-aretes-profile.jpg',
    destOriginal: 'product-aretes-profile-original.jpg'
  },
  {
    src: path.join(fotosBase, 'pulseras', 'Marble_sculpture_wearing_bracelet_4K_20260914083954.jpeg'),
    destName: 'collection-pulseras.jpg',
    destOriginal: 'collection-pulseras-original.jpg'
  },
  {
    src: path.join(fotosBase, 'pulseras', 'Woman_showcasing_luxury_jewelry_…_4K_20260914085832.jpeg'),
    destName: 'product-pulseras-bangle.jpg',
    destOriginal: 'product-pulseras-bangle-original.jpg'
  },
  {
    src: path.join(fotosBase, 'pulseras', 'Lighting_instructions_for_marble…_4K_20260914083227.jpeg'),
    destName: 'product-pulseras-clover.jpg',
    destOriginal: 'product-pulseras-clover-original.jpg'
  }
];

mappings.forEach(m => {
  if (!fs.existsSync(m.src)) {
    console.error('Source not found:', m.src);
    return;
  }
  // Copy original
  const origPath = path.join(assetsDir, m.destOriginal);
  fs.copyFileSync(m.src, origPath);

  // Generate web-optimized 1600px version
  const optPath = path.join(assetsDir, m.destName);
  try {
    execSync(`ffmpeg -y -i "${m.src}" -vf "scale=1600:-1" -q:v 2 "${optPath}"`, { stdio: 'inherit' });
    console.log(`Processed: ${m.destName} from ${path.basename(m.src)}`);
  } catch(e) {
    console.error(`FFmpeg failed for ${m.destName}, falling back to direct copy:`, e.message);
    fs.copyFileSync(m.src, optPath);
  }
});

console.log('All collection images successfully processed into assets directory.');
