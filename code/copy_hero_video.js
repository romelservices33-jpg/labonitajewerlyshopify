const fs = require('fs');
const path = require('path');

const src = 'C:\\TRABAJO\\La Bonita Joyeria\\Nueva carpeta\\Luxury_jewelry_video_loop_4K_20260915233606.mp4';
const destOriginalName = path.join(__dirname, 'assets', 'Luxury_jewelry_video_loop_4K_20260915233606.mp4');
const destStandardName = path.join(__dirname, 'assets', 'luxury-jewelry-hero-film.mp4');

try {
  console.log('Checking source file:', src);
  if (!fs.existsSync(src)) {
    console.error('ERROR: Source file does not exist:', src);
    process.exit(1);
  }

  const stat = fs.statSync(src);
  console.log('Source size in bytes:', stat.size);

  // Copy to standard hero video path
  fs.copyFileSync(src, destStandardName);
  console.log('Successfully copied to:', destStandardName);

  // Also copy to original filename in assets
  fs.copyFileSync(src, destOriginalName);
  console.log('Successfully copied to:', destOriginalName);

  console.log('DONE!');
  process.exit(0);
} catch (err) {
  console.error('Copy failed:', err);
  process.exit(1);
}
