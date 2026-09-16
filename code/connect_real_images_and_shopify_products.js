const fs = require('fs');
const path = require('path');

const codeDir = __dirname;
const rootDir = path.resolve(__dirname, '..');

let liquid = fs.readFileSync(path.join(codeDir, 'sections', 'bonita-luxury-storefront.liquid'), 'utf8');

// Array of real jewelry photos for product cards
const jewelryImages = [
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
  'hero-macro-ring.jpg'
];

let imgIdx = 0;

// Replace <div class="mock-camera-placeholder">...</div> with real <img> tags
liquid = liquid.replace(/<div class="mock-camera-placeholder">[\s\S]*?<\/div>\s*<\/div>/g, (match) => {
  const imgName = jewelryImages[imgIdx % jewelryImages.length];
  imgIdx++;
  return `<img src="{{ '${imgName}' | asset_url }}" alt="Joya de Oro 10K y 14K La Bonita" class="cutout-card-img" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block;">`;
});

// Update video source with settings parameter
liquid = liquid.replace(
  /<video class="hero-bg-media"[\s\S]*?<\/video>/,
  `<video class="hero-bg-media" autoplay loop muted playsinline poster="{{ 'luxury-hero-poster.jpg' | asset_url }}">
      {%- if section.settings.hero_video_url != blank -%}
        <source src="{{ section.settings.hero_video_url }}" type="video/mp4">
      {%- endif -%}
      <source src="{{ 'luxury-jewelry-hero-film.mp4' | asset_url }}" type="video/mp4">
      <img src="{{ 'luxury-hero-poster.jpg' | asset_url }}" alt="14K Gold Cuban chain on Carrara marble sculpture">
    </video>`
);

// Update Schema
const schemaBlock = `{% schema %}
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
      "info": "Selecciona la colección para asociar los productos reales de tu inventario."
    }
  ]
}
{% endschema %}`;

liquid = liquid.replace(/\{% schema %\}[\s\S]*?\{% endschema %\}/, schemaBlock);

fs.writeFileSync(path.join(codeDir, 'sections', 'bonita-luxury-storefront.liquid'), liquid, 'utf8');
fs.writeFileSync(path.join(rootDir, 'sections', 'bonita-luxury-storefront.liquid'), liquid, 'utf8');

console.log('REAL JEWELRY IMAGES & DYNAMIC SCHEMA INTEGRATED SUCCESSFULLY!');
