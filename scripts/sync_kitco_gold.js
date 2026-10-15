/**
 * Daily Kitco Gold Price Extractor & Shopify Sync
 * Extracts live Spot Gold (AU/USD) from Kitco (https://www.kitco.com/)
 * and calculates La Bonita Jewelry's 93% Store Buyback Prices across 24K, 18K, 14K, and 10K.
 */

const fs = require('fs');
const path = require('path');

const TROY_OUNCE_TO_GRAMS = 31.1034768;
const STORE_BUYBACK_RATE = 0.93; // 93% of official Kitco gold price

const KITCO_GRAPHQL_URL = 'https://kdb-gw.prod.kitco.com/graphql';
const KITCO_WEB_URL = 'https://www.kitco.com/';

const SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN || '184ei8-su.myshopify.com';
const THEME_ID = process.env.SHOPIFY_THEME_ID || '141357809760';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || '';
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || '';

function round2(num) {
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
}

async function fetchFromKitcoGraphQL() {
  const query = `
    query GetMetalQuoteV3($symbol: String!, $currency: String!) {
      GetMetalQuoteV3(symbol: $symbol, currency: $currency) {
        symbol
        currency
        name
        results {
          ask
          bid
          change
          changePercentage
          high
          low
          mid
          originalTime
          timestamp
          unit
        }
      }
    }
  `;

  const response = await fetch(KITCO_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://www.kitco.com',
      'Referer': 'https://www.kitco.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify({
      query,
      variables: { symbol: 'AU', currency: 'USD' }
    })
  });

  if (!response.ok) {
    throw new Error(`Kitco GraphQL HTTP ${response.status}`);
  }

  const json = await response.json();
  const quote = json?.data?.GetMetalQuoteV3?.results?.[0];
  if (!quote || typeof quote.bid !== 'number') {
    throw new Error('Invalid quote payload from Kitco GraphQL');
  }
  return quote;
}

async function fetchFromKitcoWebSSR() {
  const response = await fetch(KITCO_WEB_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!response.ok) {
    throw new Error(`Kitco Web HTTP ${response.status}`);
  }
  const html = await response.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) {
    throw new Error('Could not find __NEXT_DATA__ on kitco.com');
  }
  const nextData = JSON.parse(match[1]);
  const queries = nextData?.props?.pageProps?.dehydratedState?.queries || [];
  for (const q of queries) {
    const res = q?.state?.data?.Gold?.results?.[0] || q?.state?.data?.GetMetalQuoteV3?.results?.[0];
    if (res && typeof res.bid === 'number') {
      return res;
    }
  }
  throw new Error('Could not locate Gold quote in kitco.com __NEXT_DATA__');
}

function buildGoldPricingPayload(quote) {
  const officialSpotOz = Number(quote.bid);
  const officialAskOz = Number(quote.ask || quote.bid);
  const officialMidOz = Number(quote.mid || quote.bid);
  const officialSpotGram24k = officialSpotOz / TROY_OUNCE_TO_GRAMS;

  const karats = {
    '24k': { label: '24K', purity: 1.0, purityPct: '99.9%' },
    '18k': { label: '18K', purity: 18 / 24, purityPct: '75.0%' },
    '14k': { label: '14K', purity: 14 / 24, purityPct: '58.33%' },
    '10k': { label: '10K', purity: 10 / 24, purityPct: '41.67%' }
  };

  const breakdown = {};
  for (const [key, info] of Object.entries(karats)) {
    const officialPerGram = officialSpotGram24k * info.purity;
    const officialPerOz = officialSpotOz * info.purity;
    const buybackPerGram = officialPerGram * STORE_BUYBACK_RATE;
    const buybackPerOz = officialPerOz * STORE_BUYBACK_RATE;

    breakdown[key] = {
      karat: info.label,
      purity: round2(info.purity * 100),
      purityLabel: info.purityPct,
      official_per_gram_usd: round2(officialPerGram),
      official_per_oz_usd: round2(officialPerOz),
      store_buyback_per_gram_usd: round2(buybackPerGram),
      store_buyback_per_oz_usd: round2(buybackPerOz)
    };
  }

  return {
    source: 'Kitco Official (https://www.kitco.com/)',
    symbol: 'AU',
    currency: 'USD',
    troy_ounce_grams: TROY_OUNCE_TO_GRAMS,
    store_buyback_percentage: 93,
    store_buyback_factor: STORE_BUYBACK_RATE,
    updated_at_iso: quote.originalTime || new Date().toISOString(),
    synced_at_iso: new Date().toISOString(),
    official_spot: {
      bid_oz_usd: round2(officialSpotOz),
      ask_oz_usd: round2(officialAskOz),
      mid_oz_usd: round2(officialMidOz),
      gram_24k_usd: round2(officialSpotGram24k),
      change_usd: round2(quote.change || 0),
      change_percentage: round2(quote.changePercentage || 0),
      high_oz_usd: round2(quote.high || officialSpotOz),
      low_oz_usd: round2(quote.low || officialSpotOz)
    },
    store_buyback_93: {
      oz_24k_usd: round2(officialSpotOz * STORE_BUYBACK_RATE),
      gram_24k_usd: breakdown['24k'].store_buyback_per_gram_usd,
      gram_18k_usd: breakdown['18k'].store_buyback_per_gram_usd,
      gram_14k_usd: breakdown['14k'].store_buyback_per_gram_usd,
      gram_10k_usd: breakdown['10k'].store_buyback_per_gram_usd,
      by_karat: breakdown
    }
  };
}

async function getShopifyAccessToken() {
  if (process.env.SHOPIFY_ACCESS_TOKEN) {
    return process.env.SHOPIFY_ACCESS_TOKEN;
  }
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  if (!res.ok) {
    throw new Error(`Shopify token error: ${res.status}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function uploadAssetToShopify(assetKey, contentString) {
  const token = await getShopifyAccessToken();
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: assetKey,
        value: contentString
      }
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to upload ${assetKey}: ${res.status} ${errText}`);
  }
  return await res.json();
}

async function main() {
  console.log('Extracting live official gold price from Kitco (https://www.kitco.com/)...');
  let quote;
  try {
    quote = await fetchFromKitcoGraphQL();
    console.log('Successfully fetched from Kitco GraphQL API.');
  } catch (err) {
    console.warn('GraphQL fetch failed, trying Kitco Web SSR fallback:', err.message);
    quote = await fetchFromKitcoWebSSR();
    console.log('Successfully fetched from Kitco Web SSR.');
  }

  const payload = buildGoldPricingPayload(quote);
  const jsonString = JSON.stringify(payload, null, 2);

  const rootAssetPath = path.join(__dirname, '..', 'assets', 'kitco-gold-price.json');
  fs.writeFileSync(rootAssetPath, jsonString, 'utf8');
  console.log(`Saved ${rootAssetPath}`);

  const codeAssetDir = path.join(__dirname, '..', 'code', 'assets');
  if (fs.existsSync(codeAssetDir)) {
    const codeAssetPath = path.join(codeAssetDir, 'kitco-gold-price.json');
    fs.writeFileSync(codeAssetPath, jsonString, 'utf8');
    console.log(`Saved ${codeAssetPath}`);
  }

  console.log('\n--- RESUMEN COTIZACIÓN KITCO & COMPRA EN TIENDA (93%) ---');
  console.log(`Precio Oficial Kitco (Spot 24K): $${payload.official_spot.bid_oz_usd.toFixed(2)} USD/oz ($${payload.official_spot.gram_24k_usd.toFixed(2)} USD/g)`);
  console.log(`Precio Compra en Tienda (93% Onza 24K): $${payload.store_buyback_93.oz_24k_usd.toFixed(2)} USD/oz`);
  console.log(`  • Oro 24K (99.9%) -> Oficial: $${payload.store_buyback_93.by_karat['24k'].official_per_gram_usd.toFixed(2)}/g | Compra Tienda (93%): $${payload.store_buyback_93.gram_24k_usd.toFixed(2)}/g`);
  console.log(`  • Oro 18K (75.0%) -> Oficial: $${payload.store_buyback_93.by_karat['18k'].official_per_gram_usd.toFixed(2)}/g | Compra Tienda (93%): $${payload.store_buyback_93.gram_18k_usd.toFixed(2)}/g`);
  console.log(`  • Oro 14K (58.3%) -> Oficial: $${payload.store_buyback_93.by_karat['14k'].official_per_gram_usd.toFixed(2)}/g | Compra Tienda (93%): $${payload.store_buyback_93.gram_14k_usd.toFixed(2)}/g`);
  console.log(`  • Oro 10K (41.7%) -> Oficial: $${payload.store_buyback_93.by_karat['10k'].official_per_gram_usd.toFixed(2)}/g | Compra Tienda (93%): $${payload.store_buyback_93.gram_10k_usd.toFixed(2)}/g`);

  try {
    await uploadAssetToShopify('assets/kitco-gold-price.json', jsonString);
    console.log('Successfully synced assets/kitco-gold-price.json to Shopify live theme #141357809760');
  } catch (uploadErr) {
    console.warn('Could not upload to Shopify theme:', uploadErr.message);
  }
}

main().catch((err) => {
  console.error('Fatal error in sync_kitco_gold:', err);
  process.exit(1);
});
