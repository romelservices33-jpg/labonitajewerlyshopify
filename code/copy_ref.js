const fs = require('fs');
const path = require('path');

const src = 'C:\\TRABAJO\\La Bonita Joyeria\\Nueva carpeta\\Luxury_jewelry_video_loop_4K_20260915233606.mp4';
const dest = path.join(__dirname, 'assets', 'hero-jewelry-loop-4k.mp4');

try {
  fs.copyFileSync(src, dest);
  const size = fs.statSync(dest).size;
  fs.writeFileSync(path.join(__dirname, 'copy_status.txt'), 'SUCCESS: ' + size + ' bytes');
} catch (e) {
  fs.writeFileSync(path.join(__dirname, 'copy_status.txt'), 'ERROR: ' + e.message);
}

