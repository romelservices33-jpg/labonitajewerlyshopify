const fs = require('fs');
const path = require('path');

const codeDir = __dirname;
const rootDir = path.resolve(__dirname, '..');

let storefrontLiquid = fs.readFileSync(path.join(codeDir, 'sections', 'bonita-luxury-storefront.liquid'), 'utf8');

// 1. Update Video Tag to use section.settings.hero_video_url with fallback
const oldVideoBlock = `<video class="hero-bg-media" autoplay loop muted playsinline poster="{{ 'luxury-hero-poster.jpg' | asset_url }}">
      <source src="{{ 'Luxury_jewelry_video_loop_4K_20260915233606.mp4' | asset_url }}" type="video/mp4">
      <source src="../Nueva%20carpeta/Luxury_jewelry_video_loop_4K_20260915233606.mp4" type="video/mp4">
      <source src="{{ 'luxury-jewelry-hero-film.mp4' | asset_url }}" type="video/mp4">
      <img src="{{ 'luxury-hero-poster.jpg' | asset_url }}" alt="14K Gold Cuban chain on Carrara marble sculpture">
    </video>`;

const newVideoBlock = `<video class="hero-bg-media" autoplay loop muted playsinline poster="{{ 'luxury-hero-poster.jpg' | asset_url }}">
      {%- if section.settings.hero_video_url != blank -%}
        <source src="{{ section.settings.hero_video_url }}" type="video/mp4">
      {%- endif -%}
      <source src="https://cdn.shopify.com/videos/c/o/v/luxury-jewelry-hero-film.mp4" type="video/mp4">
      <img src="{{ 'luxury-hero-poster.jpg' | asset_url }}" alt="14K Gold Cuban chain on Carrara marble sculpture">
    </video>`;

storefrontLiquid = storefrontLiquid.replace(oldVideoBlock, newVideoBlock);

// 2. Update Schema to allow setting collection and video url in Shopify Theme Editor
const oldSchema = `{% schema %}
{
  "name": "Bonita Luxury Storefront",
  "tag": "section",
  "class": "section-bonita-luxury",
  "settings": []
}
{% endschema %}`;

const newSchema = `{% schema %}
{
  "name": "Bonita Luxury Storefront",
  "tag": "section",
  "class": "section-bonita-luxury",
  "settings": [
    {
      "type": "text",
      "id": "hero_video_url",
      "label": "Enlace del Video 4K del Hero (URL de Shopify Archivos)",
      "info": "Sube tu video en Shopify Admin > Contenido > Archivos y pega aquí el enlace copiado."
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Colección de Productos",
      "info": "Selecciona la colección de tu tienda para conectar tus productos reales."
    }
  ]
}
{% endschema %}`;

storefrontLiquid = storefrontLiquid.replace(oldSchema, newSchema);

fs.writeFileSync(path.join(codeDir, 'sections', 'bonita-luxury-storefront.liquid'), storefrontLiquid, 'utf8');
fs.writeFileSync(path.join(rootDir, 'sections', 'bonita-luxury-storefront.liquid'), storefrontLiquid, 'utf8');

console.log('Successfully updated sections/bonita-luxury-storefront.liquid with dynamic video and collection settings.');
