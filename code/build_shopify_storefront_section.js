const fs = require('fs');
const path = require('path');

const codeDir = __dirname;
const rootDir = path.resolve(__dirname, '..');

const indexHtmlPath = path.join(codeDir, 'index.html');
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Extract Body Content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (!bodyMatch) {
  console.error('Could not find body tag in index.html');
  process.exit(1);
}

let bodyContent = bodyMatch[1];

// 2. Replace static asset paths with Liquid asset_url
// e.g. src="assets/logo-completo.svg" -> src="{{ 'logo-completo.svg' | asset_url }}"
// poster="assets/luxury-hero-poster.jpg" -> poster="{{ 'luxury-hero-poster.jpg' | asset_url }}"
// href="assets/favicon.svg" -> href="{{ 'favicon.svg' | asset_url }}"
bodyContent = bodyContent.replace(/(?:src|poster)=["']assets\/([^"']+)["']/g, (match, filename) => {
  const attr = match.startsWith('poster') ? 'poster' : 'src';
  return `${attr}="{{ '${filename}' | asset_url }}"`;
});

// Also replace any background image url('assets/...') or url("assets/...")
bodyContent = bodyContent.replace(/url\(['"]?assets\/([^'")]+)['"]?\)/g, (match, filename) => {
  return `url({{ '${filename}' | asset_url }})`;
});

// 3. Create sections/bonita-luxury-storefront.liquid
const sectionContent = `{{ 'editorial-luxury.css' | asset_url | stylesheet_tag }}

<div class="bonita-luxury-wrapper">
${bodyContent}
</div>

{% schema %}
{
  "name": "Bonita Luxury Storefront",
  "tag": "section",
  "class": "section-bonita-luxury",
  "settings": []
}
{% endschema %}
`;

fs.writeFileSync(path.join(codeDir, 'sections', 'bonita-luxury-storefront.liquid'), sectionContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'sections', 'bonita-luxury-storefront.liquid'), sectionContent, 'utf8');
console.log('Created sections/bonita-luxury-storefront.liquid in code/ and root/');

// 4. Update templates/index.json
const indexJson = {
  "sections": {
    "bonita_luxury_storefront": {
      "type": "bonita-luxury-storefront",
      "settings": {}
    }
  },
  "order": [
    "bonita_luxury_storefront"
  ]
};

fs.writeFileSync(path.join(codeDir, 'templates', 'index.json'), JSON.stringify(indexJson, null, 2), 'utf8');
fs.writeFileSync(path.join(rootDir, 'templates', 'index.json'), JSON.stringify(indexJson, null, 2), 'utf8');
console.log('Updated templates/index.json in code/ and root/');

// 5. Update layout/theme.liquid so that when on index template, Dawn header-group and footer-group don't double render
let themeLiquid = fs.readFileSync(path.join(codeDir, 'layout', 'theme.liquid'), 'utf8');

// Replace header sections and footer sections with conditional check
if (!themeLiquid.includes('template.name != \'index\'')) {
  themeLiquid = themeLiquid.replace(
    "{% sections 'header-group' %}",
    "{% unless template.name == 'index' %}{% sections 'header-group' %}{% endunless %}"
  );
  themeLiquid = themeLiquid.replace(
    "{% sections 'footer-group' %}",
    "{% unless template.name == 'index' %}{% sections 'footer-group' %}{% endunless %}"
  );
  
  fs.writeFileSync(path.join(codeDir, 'layout', 'theme.liquid'), themeLiquid, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'layout', 'theme.liquid'), themeLiquid, 'utf8');
  console.log('Updated layout/theme.liquid to avoid duplicate Dawn headers on homepage.');
}

console.log('--- ALL LIQUID TEMPLATES PREPARED SUCCESSFULLY ---');
