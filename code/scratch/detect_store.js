const https = require('https');

https.get('https://www.labonitajewelry.com', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const shopMatch = data.match(/Shopify\.shop\s*=\s*["']([^"']+)["']/i);
    console.log('Shopify.shop match:', shopMatch ? shopMatch[1] : 'None');
    
    const myshopifyMatches = data.match(/[a-zA-Z0-9-]+\.myshopify\.com/gi);
    console.log('myshopify.com domains found:', myshopifyMatches ? [...new Set(myshopifyMatches)] : 'None');

    const themeMatch = data.match(/Shopify\.theme\s*=\s*(\{[^}]+\})/i);
    console.log('Shopify.theme match:', themeMatch ? themeMatch[1] : 'None');
  });
}).on('error', (e) => {
  console.error('Error fetching:', e.message);
});
