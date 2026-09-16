const fs = require('fs');
const path = require('path');

const codeDir = __dirname;
const rootDir = path.resolve(__dirname, '..');

// 1. Read index.html
const indexHtmlPath = path.join(codeDir, 'index.html');
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// 2. Extract Body Content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (!bodyMatch) {
  console.error('Could not find body tag in index.html');
  process.exit(1);
}

let body = bodyMatch[1];

// 3. Convert all static asset paths to Liquid {{ 'filename' | asset_url }}
body = body.replace(/(?:src|poster)=["']assets\/([^"']+)["']/g, (match, filename) => {
  const attr = match.startsWith('poster') ? 'poster' : 'src';
  return `${attr}="{{ '${filename}' | asset_url }}"`;
});
body = body.replace(/url\(['"]?assets\/([^'")]+)['"]?\)/g, (match, filename) => {
  return `url({{ '${filename}' | asset_url }})`;
});

// 4. Replace mock-camera placeholders with real jewelry images from assets
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
body = body.replace(/<div class="mock-camera-placeholder">[\s\S]*?<\/div>\s*<\/div>/g, (match) => {
  const img = realJewelryImages[imgIndex % realJewelryImages.length];
  imgIndex++;
  return `<img src="{{ '${img}' | asset_url }}" alt="Joya de Oro La Bonita" class="cutout-card-img" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block;">`;
});

// 5. Update Hero Video to allow Shopify CDN video URL
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

// 6. Wrap catalog products grid in Liquid loop to load Shopify store products if available
const dynamicProductLoopPrefix = `
      {%- assign store_collection = section.settings.collection | default: collections['all'] -%}
      {%- if store_collection != blank and store_collection.products.size > 0 -%}
        <div class="catalog-products-grid" id="catalogProductsGrid">
          {%- for product in store_collection.products limit: 30 -%}
            {%- assign cat_tag = product.type | default: 'cadenas' | downcase -%}
            {%- assign karat_tag = '14k' -%}
            {%- if product.tags contains '10k' or product.title contains '10K' or product.title contains '10k' -%}
              {%- assign karat_tag = '10k' -%}
            {%- endif -%}
            <div class="product-shop-card cutout-product-card" data-category="{{ cat_tag }}" data-karat="{{ karat_tag }}" data-price="{{ product.price | divided_by: 100 }}" data-weight="15.0" data-size="24">
              <div class="cutout-card-media">
                <a href="{{ product.url }}">
                  {%- if product.featured_image != blank -%}
                    <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
                  {%- else -%}
                    <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
                  {%- endif -%}
                </a>
                <div class="cutout-card-pin">
                  <span>{{ karat_tag | upcase }} ORO</span>
                  <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
                </div>
                <div class="cutout-card-inset-label">
                  <span class="cutout-label-text">{{ cat_tag | capitalize }}</span>
                  <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
                </div>
              </div>
              <div class="cutout-card-content">
                <div class="cutout-title-row">
                  <h4 class="cutout-product-title"><a href="{{ product.url }}" style="color:inherit; text-decoration:none;">{{ product.title }}</a></h4>
                </div>
                <div class="product-card-pricing-row">
                  <div class="pricing-amounts">
                    <div class="pricing-numbers-row">
                      <span class="price-now">{{ product.price | money }}</span>
                      {%- if product.compare_at_price > product.price -%}
                        <span class="price-was">{{ product.compare_at_price | money }}</span>
                      {%- endif -%}
                    </div>
                    <div class="affirm-monthly-badge">Oro 100% Auténtico Garantizado</div>
                  </div>
                  <form method="post" action="/cart/add">
                    <input type="hidden" name="id" value="{{ product.variants.first.id }}">
                    <button type="submit" class="btn-add-cart-pill" title="Agregar al carrito">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          {%- endfor -%}
        </div>
      {%- else -%}
`;

// Insert the Shopify products loop around the demo grid
body = body.replace(
  /<div class="catalog-products-grid" id="catalogProductsGrid">/,
  dynamicProductLoopPrefix + '<div class="catalog-products-grid" id="catalogProductsGrid">'
);

body = body.replace(
  /<\/section>\s*<!-- 5\. TRUST PILLARS/,
  '{%- endif -%}\n      </div>\n    </div>\n  </section>\n\n  <!-- 5. TRUST PILLARS'
);

// 7. Assemble Section Liquid File
const fullSectionLiquid = `{{ 'editorial-luxury.css' | asset_url | stylesheet_tag }}

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

fs.writeFileSync(path.join(codeDir, 'sections', 'bonita-luxury-storefront.liquid'), fullSectionLiquid, 'utf8');
fs.writeFileSync(path.join(rootDir, 'sections', 'bonita-luxury-storefront.liquid'), fullSectionLiquid, 'utf8');

console.log('COMPLETE LUXURY STOREFRONT RESTORED (3500+ LINES WITH DYNAMIC SHOPIFY CATALOG)!');
