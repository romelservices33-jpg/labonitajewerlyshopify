const fs = require('fs');
const path = require('path');

const codeDir = __dirname;
const rootDir = path.resolve(__dirname, '..');

// 1. Read the golden master index.html
const indexHtmlPath = path.join(codeDir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Extract head style block
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

// Replace ONLY the inner mock camera placeholder with real images while PRESERVING overlay, wishlist button, and cutout pins/labels
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

// Dynamic Real Shopify Product Card Snippet (Exact same cutout classes, corner SVGs and styling)
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

// Assemble Section Liquid File with embedded scoped CSS to guarantee no style breaks
const finalLiquid = `{{ 'editorial-luxury.css' | asset_url | stylesheet_tag }}

<style>
${headStyles}

/* Explicit overrides to defeat Dawn theme conflicts */
.site-white-footer {
  background: #FAF9F6 !important;
  color: #475569 !important;
  border-top: 1px solid rgba(209, 176, 84, 0.25) !important;
  padding: 80px 40px 40px !important;
  width: 100% !important;
  display: block !important;
}

.site-white-footer a,
.footer-col-nav ul a,
.footer-contact-list a {
  color: #64748B !important;
  text-decoration: none !important;
}

.site-white-footer a:hover,
.footer-col-nav ul a:hover,
.footer-contact-list a:hover {
  color: #D1B054 !important;
}

.footer-col-nav ul {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.trust-pillars-section {
  background: #FAF9F6 !important;
  color: #08195B !important;
  border-top: 1px solid rgba(209, 176, 84, 0.18) !important;
  border-bottom: 1px solid rgba(209, 176, 84, 0.18) !important;
  display: block !important;
}

.pillar-info h4 {
  color: #08195B !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
}

.pillar-info p {
  color: #64748B !important;
}
</style>

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

fs.writeFileSync(path.join(codeDir, 'sections', 'bonita-luxury-storefront.liquid'), finalLiquid, 'utf8');
fs.writeFileSync(path.join(rootDir, 'sections', 'bonita-luxury-storefront.liquid'), finalLiquid, 'utf8');

console.log('FLAWLESS LIQUID STOREFRONT ASSEMBLED SUCCESSFULLY!');
