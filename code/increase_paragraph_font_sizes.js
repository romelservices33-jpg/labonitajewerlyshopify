const fs = require('fs');

// 1. UPDATE CSS FILES
const cssFiles = ['assets/editorial-luxury.css', 'code/assets/editorial-luxury.css'];
cssFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');

    // Hero supporting copy
    c = c.replace(
      /\.hero-supporting-copy\s*\{[\s\S]*?margin-bottom:\s*30px;/m,
      `\.hero-supporting-copy {\n  color: rgba(255, 255, 255, 0.94);\n  font-size: 1.10rem;\n  line-height: 1.65;\n  max-width: 580px;\n  margin-bottom: 30px;`
    );

    // Mobile hero supporting copy
    c = c.replace(
      /\.hero-supporting-copy\s*\{\s*font-size:\s*0\.85rem\s*!important;\s*line-height:\s*1\.55;\s*max-width:\s*320px;/m,
      `\.hero-supporting-copy {\n    font-size: 0.96rem !important;\n    line-height: 1.6;\n    max-width: 360px;`
    );

    // Catalog subtitle
    c = c.replace(
      /\.catalog-subtitle\s*\{\s*color:\s*#6B7280;\s*font-size:\s*0\.94rem;\s*line-height:\s*1\.5;/m,
      `\.catalog-subtitle {\n  color: #64748B;\n  font-size: 1.06rem;\n  line-height: 1.58;`
    );

    // Middle desc
    c = c.replace(
      /\.middle-desc\s*\{\s*color:\s*var\(--color-text-body\);\s*font-size:\s*0\.95rem;/m,
      `\.middle-desc {\n  color: var(--color-text-body);\n  font-size: 1.06rem;`
    );

    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated paragraph font sizes in CSS:', f);
  }
});

// 2. UPDATE LIQUID STOREFRONT FILES (for review paragraphs and text)
const liquidFiles = [
  'sections/bonita-luxury-storefront.liquid',
  'code/sections/bonita-luxury-storefront.liquid'
];

liquidFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');

    // Review paragraphs: 0.82rem -> 0.94rem
    c = c.replace(/font-size:\s*0\.82rem;\s*color:\s*#334155;\s*line-height:\s*1\.55;/g, 'font-size: 0.94rem; color: #334155; line-height: 1.6;');

    // Review client names: 0.86rem -> 0.94rem
    c = c.replace(/font-size:\s*0\.86rem;\s*font-weight:\s*700;\s*color:\s*#08195B;/g, 'font-size: 0.94rem; font-weight: 700; color: #08195B;');

    // Review sub-header description
    c = c.replace(/font-size:\s*0\.88rem;\s*color:\s*#64748B;\s*max-width:\s*600px;/g, 'font-size: 1.02rem; color: #64748B; max-width: 650px;');

    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated review paragraph font sizes in Liquid:', f);
  }
});
