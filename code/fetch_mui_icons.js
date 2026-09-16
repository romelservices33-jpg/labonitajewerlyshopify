const https = require('https');

function getFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const icons = ['ShoppingCart', 'Favorite', 'FavoriteBorder', 'Phone', 'LocalShipping', 'VerifiedUser', 'Payment', 'Security', 'Close', 'Email', 'Chat', 'Language', 'CheckCircle', 'ChevronLeft', 'ChevronRight'];
  for (const name of icons) {
    try {
      const code = await getFile(`https://unpkg.com/@material-ui/icons@4.11.3/${name}.js`);
      // Find d="..."
      const matches = [...code.matchAll(/d:\s*["']([^"']+)["']/g)];
      console.log(`\n=== ${name} ===`);
      matches.forEach(m => console.log(m[1]));
    } catch(e) {
      console.error(name, e.message);
    }
  }
}

run();
