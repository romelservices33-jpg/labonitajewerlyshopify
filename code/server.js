const http = require('http');
const fs = require('fs');
const path = require('path');

try {
  fs.writeFileSync(path.join(__dirname, 'server_boot.log'), 'BOOT AT ' + new Date().toISOString() + '\n');
} catch(e) {}

const PORT = process.env.PORT || 5173;
const ASSETS_DIR = path.join(__dirname, 'assets');
const NUEVA_CARPETA_DIR = path.join(__dirname, '..', 'Nueva carpeta');
const HERO_4K_FILENAME = 'Luxury_jewelry_video_loop_4K_20260915233606.mp4';
const ROOT_DIR = path.resolve(__dirname, '..');

// Auto-sync theme folders from code to root of repository
try {
  const themeFolders = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
  for (const folder of themeFolders) {
    const src = path.join(__dirname, folder);
    const dest = path.join(ROOT_DIR, folder);
    if (fs.existsSync(src)) {
      fs.cpSync(src, dest, { recursive: true, force: true });
    }
  }
  const rootFiles = ['.theme-check.yml', '.prettierrc.json'];
  for (const file of rootFiles) {
    const src = path.join(__dirname, file);
    const dest = path.join(ROOT_DIR, file);
    if (fs.existsSync(src)) fs.copyFileSync(src, dest);
  }
  fs.writeFileSync(path.join(__dirname, 'sync_status.log'), 'ROOT_SYNC_OK_' + new Date().toISOString() + '\n');
} catch (e) {
  try {
    fs.writeFileSync(path.join(__dirname, 'sync_error.log'), e.stack || e.message);
  } catch(_) {}
}

// Static server configuration (Videos are streamed directly from Nueva carpeta if needed locally)

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // Static Assets Handler
  if (urlPath.startsWith('/assets/')) {
    const filename = decodeURIComponent(urlPath.replace('/assets/', ''));
    let filePath = path.join(ASSETS_DIR, filename);

    // Direct fallback for 4K video directly from Nueva carpeta
    const external4K = path.join(NUEVA_CARPETA_DIR, HERO_4K_FILENAME);
    if (
      (filename === HERO_4K_FILENAME ||
       filename === 'luxury-jewelry-hero-film.mp4' ||
       filename.includes('Luxury_jewelry_video')) &&
      fs.existsSync(external4K)
    ) {
      filePath = external4K;
    } else if (!fs.existsSync(filePath)) {
      const fallbackExt = path.join(NUEVA_CARPETA_DIR, filename);
      if (fs.existsSync(fallbackExt) && fs.statSync(fallbackExt).isFile()) {
        filePath = fallbackExt;
      }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();

      // Video streaming with Range support for smooth loops
      if (ext === '.mp4') {
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = end - start + 1;
          const file = fs.createReadStream(filePath, { start, end });
          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
          });
          if (req.method === 'HEAD') return res.end();
          file.pipe(res);
          return;
        } else {
          res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
            'Accept-Ranges': 'bytes',
          });
          if (req.method === 'HEAD') return res.end();
          fs.createReadStream(filePath).pipe(res);
          return;
        }
      }

      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      if (req.method === 'HEAD') return res.end();
      return fs.createReadStream(filePath).pipe(res);
    }
  }

  // Favicon direct route
  if (urlPath === '/favicon.ico' || urlPath === '/favicon.svg') {
    const favPath = path.join(ASSETS_DIR, 'favicon.svg');
    if (fs.existsSync(favPath)) {
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      return fs.createReadStream(favPath).pipe(res);
    }
  }

  // Main Editorial Storefront HTML
  if (urlPath === '/' || urlPath === '/index.html') {
    const indexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  // Cart Page Route
  if (urlPath === '/cart' || urlPath === '/cart.html') {
    const cartPath = path.join(__dirname, 'cart.html');
    if (fs.existsSync(cartPath)) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      return fs.createReadStream(cartPath).pipe(res);
    }
  }

  // Checkout Page Route
  if (urlPath === '/checkout' || urlPath === '/checkout.html') {
    const checkoutPath = path.join(__dirname, 'checkout.html');
    if (fs.existsSync(checkoutPath)) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      return fs.createReadStream(checkoutPath).pipe(res);
    }
  }

  // Order Status / Thank You Page Route
  if (urlPath === '/order-status' || urlPath === '/order-status.html' || urlPath === '/thank-you') {
    const orderPath = path.join(__dirname, 'order-status.html');
    if (fs.existsSync(orderPath)) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      return fs.createReadStream(orderPath).pipe(res);
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

function renderBrandColorStorefrontHtml() {
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    return fs.readFileSync(indexPath, 'utf8');
  }
  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>La Bonita Jewelry</title></head><body><h1>La Bonita Jewelry</h1></body></html>';
}

const os = require('os');

function startServer(portToTry) {
  server.removeAllListeners('error');
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${portToTry} in use, trying port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      try {
        fs.writeFileSync(path.join(__dirname, 'server_error.log'), 'SERVER ERROR: ' + (err.stack || err) + '\n');
      } catch(e) {}
      console.error('SERVER ERROR:', err);
    }
  });

  server.listen(portToTry, '0.0.0.0', () => {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          addresses.push(net.address);
        }
      }
    }

    const logLines = [
      `=============================================================`,
      `  💎 LA BONITA JEWELRY — SERVIDOR LOCAL ACTIVO`,
      `=============================================================`,
      `  • En tu PC:          http://localhost:${portToTry}`,
      ...addresses.map(ip => `  • En tu TELÉFONO:    http://${ip}:${portToTry}`),
      `  • Hora de inicio:    ${new Date().toLocaleTimeString()}`,
      `=============================================================`
    ].join('\n');

    try {
      fs.writeFileSync(path.join(__dirname, 'server_boot.log'), logLines + '\n');
    } catch(e) {}
    console.log(logLines);
  });
}

startServer(PORT);
