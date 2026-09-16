const fs = require('fs');
const path = require('path');

const codeDir = path.resolve(__dirname);
const rootDir = path.resolve(__dirname, '..');

console.log('--- STARTING COMPLETE EXACT STOREFRONT DEPLOYMENT ---');

// 1. Read index.html (the golden master)
const indexHtml = fs.readFileSync(path.join(codeDir, 'index.html'), 'utf8');

// Extract head styles
const styleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/i);
const headStyles = styleMatch ? styleMatch[1] : '';

// Extract body
const bodyMatch = indexHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
let body = bodyMatch[1];

// Convert assets paths to Liquid asset_url
body = body.replace(/(?:src|poster)=["']assets\/([^"']+)["']/g, (match, filename) => {
  const attr = match.startsWith('poster') ? 'poster' : 'src';
  return `${attr}="{{ '${filename}' | asset_url }}"`;
});
body = body.replace(/url\(['"]?assets\/([^'")]+)['"]?\)/g, (match, filename) => {
  return `url({{ '${filename}' | asset_url }})`;
});

// Replace mock cameras in fallback demo cards with real asset images WITHOUT breaking card wrappers
const realJewelryImages = [
  'collection-cadenas.jpg',
  'category-cuban.jpg',
  'editorial-dark-cuban.jpg',
  'product-pulseras-bangle.jpg',
  'product-anillo-signet.jpg',
  'collection-anillos.jpg',
  'product-couple-rings.jpg',
  'product-anillo-signet-side.jpg',
  'product-aretes-profile.jpg',
  'collection-aretes.jpg',
  'product-ruby-earrings.jpg',
  'category-earrings.jpg',
  'product-pulseras-clover.jpg',
  'collection-pulseras.jpg',
  'product-pulseras-bangle.jpg',
  'hero-macro-ring.jpg',
  'collection-cadenas.jpg',
  'product-anillo-signet.jpg',
  'collection-aretes.jpg',
  'product-pulseras-clover.jpg',
  'category-cuban.jpg',
  'collection-anillos.jpg',
  'product-couple-rings.jpg',
  'product-ruby-earrings.jpg'
];

let imgIndex = 0;
body = body.replace(/<div class="mock-camera-placeholder">[\s\S]*?<\/span>\s*<\/div>/g, () => {
  const img = realJewelryImages[imgIndex % realJewelryImages.length];
  imgIndex++;
  return `<img src="{{ '${img}' | asset_url }}" alt="Joya de Oro La Bonita" class="cutout-card-img" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block;">`;
});

// Update Hero video
body = body.replace(
  /<video class="hero-bg-media"[\s\S]*?<\/video>/,
  `<video class="hero-bg-media" autoplay loop muted playsinline poster="{{ 'luxury-hero-poster.jpg' | asset_url }}">
      {%- if section.settings.hero_video_url != blank -%}
        <source src="{{ section.settings.hero_video_url }}" type="video/mp4">
      {%- endif -%}
      <source src="{{ 'luxury-jewelry-hero-film.mp4' | asset_url }}" type="video/mp4">
      <img src="{{ 'luxury-hero-poster.jpg' | asset_url }}" alt="14K Gold Cuban chain on Carrara marble sculpture">
    </video>`
);

// Dynamic Real Shopify Product Card Snippet
const dynamicShopifyProductLoop = `
      {%- assign store_collection = section.settings.collection | default: collections['all'] -%}
      {%- if store_collection != blank and store_collection.products.size > 0 -%}
        <div class="catalog-products-grid" id="catalogProductsGrid">
          {%- for product in store_collection.products limit: 40 -%}
            {%- assign cat_tag = product.type | default: 'cadenas' | downcase -%}
            {%- assign karat_tag = '14k' -%}
            {%- if product.tags contains '10k' or product.title contains '10K' or product.title contains '10k' -%}
              {%- assign karat_tag = '10k' -%}
            {%- endif -%}
            <div class="product-shop-card cutout-product-card" data-category="{{ cat_tag }}" data-karat="{{ karat_tag }}" data-price="{{ product.price | divided_by: 100 }}" data-weight="15.0" data-size="20">
              <div class="cutout-card-media">
                <a href="{{ product.url }}" style="display:block; width:100%; height:100%;">
                  {%- if product.featured_image != blank -%}
                    <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title | escape }}" class="cutout-card-img" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy">
                  {%- else -%}
                    <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="{{ product.title | escape }}" class="cutout-card-img" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy">
                  {%- endif -%}
                </a>
                <div class="cutout-card-overlay"></div>
                <button class="cutout-card-wishlist" onclick="toggleHeart(this)" aria-label="Favoritos" title="Favoritos">
                  <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall" focusable="false" viewBox="0 0 24 24"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path></svg>
                </button>
                <div class="cutout-card-pin">
                  <span>{% if karat_tag == '10k' %}Oro 10K{% else %}Oro 14K{% endif %}</span>
                  <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
                </div>
                <div class="cutout-card-inset-label">
                  <span class="cutout-label-text">{{ product.type | default: 'Joya' | capitalize }}</span>
                  <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
                </div>
              </div>
              <div class="cutout-card-content">
                <div class="cutout-title-row">
                  <h4 class="cutout-product-title"><a href="{{ product.url }}" style="color:inherit; text-decoration:none;">{{ product.title }}</a></h4>
                  <span class="spec-weight-tag">Oro Auténtico Certificado</span>
                </div>
                <div class="product-card-pricing-row">
                  <div class="pricing-amounts">
                    <div class="pricing-numbers-row">
                      <span class="price-now">{{ product.price | money }}</span>
                      {%- if product.compare_at_price > product.price -%}
                        <span class="price-was">{{ product.compare_at_price | money }}</span>
                      {%- endif -%}
                    </div>
                    <div class="affirm-monthly-badge">Desde <strong>\${{ product.price | divided_by: 1200 | at_least: 35 }}/mes</strong> con Affirm</div>
                  </div>
                  <button class="btn-add-cart-pill" onclick="window.location.href='{{ product.url }}'" title="Ver y Comprar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          {%- endfor -%}
        </div>
      {%- else -%}
`;

// Insert the dynamic loop around the demo products grid in catalog section
body = body.replace(
  /<div class="catalog-products-grid" id="catalogProductsGrid">/,
  dynamicShopifyProductLoop + '<div class="catalog-products-grid" id="catalogProductsGrid">'
);

body = body.replace(
  /<\/div>\s*<\/div>\s*<\/section>\s*<!-- 5\. ROYAL BLUE SILK SECTION/,
  '</div>\n      {%- endif -%}\n    </div>\n  </section>\n\n  <!-- 5. ROYAL BLUE SILK SECTION'
);

// Full CSS Injections to guarantee 100% immunity against Dawn theme resets
const scopedOverrides = `
<style>
/* 1. Google Fonts & Material Icons Support */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Open+Sans:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

/* 2. Global Reset for Storefront Root */
.bonita-luxury-wrapper {
  all: initial;
  display: block !important;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
  color: #08195B !important;
  background-color: #FAF9F6 !important;
  width: 100% !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
}

.bonita-luxury-wrapper *,
.bonita-luxury-wrapper *::before,
.bonita-luxury-wrapper *::after {
  box-sizing: border-box !important;
}

/* 3. Hero Visual Integrity */
.macro-hero-section {
  position: relative !important;
  background-color: #08195B !important;
  padding-top: 135px !important;
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: visible !important;
}

.hero-gradient-overlay {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(
    180deg,
    rgba(8, 25, 91, 0.85) 0%,
    rgba(8, 25, 91, 0.55) 30%,
    rgba(8, 25, 91, 0.85) 75%,
    #08195B 100%
  ) !important;
  z-index: 2 !important;
  pointer-events: none !important;
}

.hero-main-headline {
  font-family: 'Fonda', 'Cormorant Garamond', Georgia, serif !important;
  font-size: clamp(2.1rem, 4.3vw, 4.2rem) !important;
  color: #FFFFFF !important;
  margin-bottom: 18px !important;
  text-shadow: 0 4px 20px rgba(8, 25, 91, 0.6) !important;
}

.hero-main-headline .gold-highlight {
  color: #D1B054 !important;
}

/* 4. Trust Pillars Section (Uncontained Clean Grid) */
.trust-pillars-section {
  background: #FAF9F6 !important;
  padding: 56px 40px !important;
  border-top: 1px solid rgba(209, 176, 84, 0.18) !important;
  border-bottom: 1px solid rgba(209, 176, 84, 0.18) !important;
  width: 100% !important;
  display: block !important;
}

.trust-pillars-inner {
  max-width: 1380px !important;
  margin: 0 auto !important;
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
  gap: 36px !important;
}

.pillar-card {
  display: flex !important;
  gap: 16px !important;
  align-items: flex-start !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.pillar-icon-box {
  width: 32px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  color: #D1B054 !important;
}

.pillar-icon-box svg {
  width: 24px !important;
  height: 24px !important;
  fill: currentColor !important;
}

.pillar-info h4 {
  font-size: 0.95rem !important;
  font-weight: 700 !important;
  color: #08195B !important;
  margin: 0 0 6px 0 !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
}

.pillar-info p {
  font-size: 0.83rem !important;
  color: #64748B !important;
  line-height: 1.55 !important;
  margin: 0 !important;
}

/* 5. Luxury Official Footer Layout */
.site-white-footer {
  background: #FAF9F6 !important;
  border-top: 1px solid rgba(209, 176, 84, 0.25) !important;
  padding: 80px 40px 40px !important;
  width: 100% !important;
  display: block !important;
  box-sizing: border-box !important;
}

.footer-main-grid {
  max-width: 1380px !important;
  margin: 0 auto !important;
  display: grid !important;
  grid-template-columns: 2fr 1fr 1fr 1.5fr !important;
  gap: 48px !important;
  margin-bottom: 60px !important;
}

@media (max-width: 1024px) {
  .footer-main-grid {
    grid-template-columns: 1fr 1fr !important;
    gap: 36px !important;
  }
}

@media (max-width: 768px) {
  .site-white-footer {
    padding: 45px 18px 30px !important;
  }
  .footer-main-grid {
    grid-template-columns: 1fr !important;
    gap: 28px !important;
    margin-bottom: 35px !important;
  }
}

.footer-col-brand h3 {
  font-family: 'Fonda', 'Cormorant Garamond', Georgia, serif !important;
  font-size: 1.8rem !important;
  color: #08195B !important;
  margin: 16px 0 12px !important;
}

.footer-col-brand p {
  font-size: 0.88rem !important;
  color: #6B7280 !important;
  line-height: 1.6 !important;
  max-width: 360px !important;
  margin: 0 !important;
}

.footer-contact-list,
.footer-col-nav ul {
  list-style: none !important;
  list-style-type: none !important;
  padding: 0 !important;
  margin: 18px 0 0 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
}

.footer-contact-list li,
.footer-col-nav ul li {
  list-style: none !important;
  list-style-type: none !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
}

.footer-contact-list li::before,
.footer-col-nav ul li::before,
.footer-contact-list li::after,
.footer-col-nav ul li::after {
  display: none !important;
  content: none !important;
}

.footer-contact-list a,
.footer-col-nav ul a {
  color: #64748B !important;
  text-decoration: none !important;
  font-size: 0.88rem !important;
  transition: color 0.2s ease !important;
}

.footer-contact-list a:hover,
.footer-col-nav ul a:hover {
  color: #D1B054 !important;
}

.footer-col-nav h4 {
  font-size: 0.95rem !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  color: #08195B !important;
  margin: 0 0 20px 0 !important;
}

.payment-methods-pills {
  display: flex !important;
  gap: 6px 14px !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  margin-top: 10px !important;
}

.pay-badge {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  border-radius: 0 !important;
  font-size: 0.73rem !important;
  font-weight: 600 !important;
  color: #64748B !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
}

.footer-bottom-bar {
  max-width: 1380px !important;
  margin: 0 auto !important;
  padding-top: 30px !important;
  border-top: 1px solid #E5E7EB !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: 20px !important;
  font-size: 0.82rem !important;
  color: #9CA3AF !important;
}

/* 6. Original Head Styles from Prototype */
${headStyles}
</style>
`;

const finalLiquid = `{{ 'editorial-luxury.css' | asset_url | stylesheet_tag }}

${scopedOverrides}

<div class="bonita-luxury-wrapper">
${body}
</div>

{% schema %}
{
  "name": "Bonita Luxury Storefront",
  "tag": "section",
  "class": "section-bonita-luxury",
  "settings": [
    {
      "type": "text",
      "id": "hero_video_url",
      "label": "Enlace del Video 4K del Hero",
      "info": "Pega aquí el enlace de tu video subido en Shopify Admin > Contenido > Archivos"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Colección de Productos de Shopify",
      "info": "Selecciona la colección para asociar automáticamente los productos reales de tu tienda."
    }
  ]
}
{% endschema %}
`;

// Write to both code and root sections
fs.writeFileSync(path.join(codeDir, 'sections', 'bonita-luxury-storefront.liquid'), finalLiquid, 'utf8');
fs.writeFileSync(path.join(rootDir, 'sections', 'bonita-luxury-storefront.liquid'), finalLiquid, 'utf8');
console.log('SUCCESS: Generated sections/bonita-luxury-storefront.liquid');

// 2. Clean up layout/theme.liquid (remove conflicting dark styles, add fonts)
const themeLiquidPath = path.join(rootDir, 'layout', 'theme.liquid');
let themeLiquid = fs.readFileSync(themeLiquidPath, 'utf8');

// Ensure Google Fonts & Material Icons in theme.liquid
if (!themeLiquid.includes('fonts.googleapis.com/icon?family=Material+Icons')) {
  themeLiquid = themeLiquid.replace(
    /<\/head>/i,
    `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Open+Sans:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>`
  );
}

// Remove legacy luxury-bonita.css call from theme.liquid
themeLiquid = themeLiquid.replace(/\{\{\s*['"]luxury-bonita\.css['"]\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*\}\}\r?\n?/g, '');

fs.writeFileSync(themeLiquidPath, themeLiquid, 'utf8');
const codeThemeLiquidPath = path.join(codeDir, 'layout', 'theme.liquid');
if (fs.existsSync(codeThemeLiquidPath)) {
  fs.writeFileSync(codeThemeLiquidPath, themeLiquid, 'utf8');
}
console.log('SUCCESS: Updated layout/theme.liquid');

console.log('--- DEPLOYMENT PREPARATION COMPLETED SUCCESSFULLY ---');
