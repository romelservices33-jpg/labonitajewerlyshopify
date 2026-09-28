const fs = require('fs');
const path = require('path');

const rootDir = 'c:/TRABAJO/La Bonita Joyeria';

// =========================================================================
// 1. UPDATE editorial-luxury.css (Fix Category Cards & Filter Row CSS)
// =========================================================================
const cssFiles = [
  path.join(rootDir, 'assets', 'editorial-luxury.css'),
  path.join(rootDir, 'code', 'assets', 'editorial-luxury.css')
];

cssFiles.forEach(cssPath => {
  if (!fs.existsSync(cssPath)) return;
  let css = fs.readFileSync(cssPath, 'utf8');

  // Fix .cat-slider-track and .cat-square-card
  css = css.replace(
    /\.cat-slider-track\s*\{[\s\S]*?padding:\s*16px 8px 30px 8px;[\s\S]*?\}/,
    `.cat-slider-track {
  display: flex;
  gap: var(--card-gap);
  overflow-x: auto;
  overflow-y: visible;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 16px 12px 36px 12px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}`
  );

  // Fix .middle-split-section padding to avoid cutting off cards
  css = css.replace(
    /padding:\s*calc\(clamp\(290px,\s*22vw,\s*335px\)\s*\/\s*2\s*\+\s*80px\)\s*40px\s*90px;/,
    `padding: 40px 40px 90px;`
  );

  // Ensure .filter-dropdowns-row is cleanly styled as 3 equal columns
  if (!css.includes('.filter-dropdowns-row {')) {
    css += `
.filter-dropdowns-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto 20px;
}
@media (max-width: 860px) {
  .filter-dropdowns-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
`;
  }

  fs.writeFileSync(cssPath, css, 'utf8');
  console.log(`[UPDATED CSS] ${cssPath}`);
});

// =========================================================================
// 2. UPDATE code/index.html (Replace old filter cluster with clean 3-dropdown row)
// =========================================================================
const indexHtmlPath = path.join(rootDir, 'code', 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let html = fs.readFileSync(indexHtmlPath, 'utf8');

  // Replace old filter bar with clean 3 dropdown row (no weight slider)
  const oldFilterBarPattern = /<!-- Ultra-Minimalist Filter Bar[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- 24 Products Grid -->/;
  
  const newCleanFilterBar = `<!-- Seamless Organized 3-Dropdown Filter Bar (No Weight Slider) -->
        <div class="catalog-filter-bar" id="catalogFilterBar">
          <div class="filter-dropdowns-row">
            <!-- 1. Pureza de Oro -->
            <div class="filter-item-wrap">
              <span class="filter-label">Pureza de Oro</span>
              <div class="select uiverse-select" id="selectKarat" tabindex="0">
                <div class="selected" id="selectedKarat">
                  <span class="selected-text" id="selectedKaratText">Todas las purezas</span>
                  <svg class="arrow" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                </div>
                <div class="options">
                  <div title="all">
                    <input id="karat-all" name="filter-karat" type="radio" value="all" checked onchange="handleSelectOption('karat', 'all', 'Todas las purezas')">
                    <label class="option" for="karat-all" data-txt="Todas las purezas"></label>
                  </div>
                  <div title="14k">
                    <input id="karat-14k" name="filter-karat" type="radio" value="14k" onchange="handleSelectOption('karat', '14k', 'Oro 14K Auténtico')">
                    <label class="option" for="karat-14k" data-txt="Oro 14K Auténtico"></label>
                  </div>
                  <div title="10k">
                    <input id="karat-10k" name="filter-karat" type="radio" value="10k" onchange="handleSelectOption('karat', '10k', 'Oro 10K Auténtico')">
                    <label class="option" for="karat-10k" data-txt="Oro 10K Auténtico"></label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Medida / Talla -->
            <div class="filter-item-wrap">
              <span class="filter-label">Medida / Talla</span>
              <div class="select uiverse-select" id="selectSize" tabindex="0">
                <div class="selected" id="selectedSize">
                  <span class="selected-text" id="selectedSizeText">Todas las medidas</span>
                  <svg class="arrow" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                </div>
                <div class="options">
                  <div title="all">
                    <input id="size-all" name="filter-size" type="radio" value="all" checked onchange="handleSelectOption('size', 'all', 'Todas las medidas')">
                    <label class="option" for="size-all" data-txt="Todas las medidas"></label>
                  </div>
                  <div class="options-group-title">Cadenas / Collares</div>
                  <div title="20">
                    <input id="size-20" name="filter-size" type="radio" value="20" onchange="handleSelectOption('size', '20', '20&quot; Cadenas (50 cm)')">
                    <label class="option" for="size-20" data-txt="20&quot; Cadenas (50 cm)"></label>
                  </div>
                  <div title="22">
                    <input id="size-22" name="filter-size" type="radio" value="22" onchange="handleSelectOption('size', '22', '22&quot; Cadenas (55 cm)')">
                    <label class="option" for="size-22" data-txt="22&quot; Cadenas (55 cm)"></label>
                  </div>
                  <div title="24">
                    <input id="size-24" name="filter-size" type="radio" value="24" onchange="handleSelectOption('size', '24', '24&quot; Cadenas (60 cm)')">
                    <label class="option" for="size-24" data-txt="24&quot; Cadenas (60 cm)"></label>
                  </div>
                  <div class="options-group-title">Pulseras & Bangles</div>
                  <div title="7.0">
                    <input id="size-7" name="filter-size" type="radio" value="7.0" onchange="handleSelectOption('size', '7.0', '7.0&quot; - 7.5&quot; Pulseras')">
                    <label class="option" for="size-7" data-txt="7.0&quot; - 7.5&quot; Pulseras"></label>
                  </div>
                  <div title="8.0">
                    <input id="size-8" name="filter-size" type="radio" value="8.0" onchange="handleSelectOption('size', '8.0', '8.0&quot; - 8.5&quot; Pulseras')">
                    <label class="option" for="size-8" data-txt="8.0&quot; - 8.5&quot; Pulseras"></label>
                  </div>
                  <div class="options-group-title">Anillos (Tallas)</div>
                  <div title="talla-7">
                    <input id="size-t7" name="filter-size" type="radio" value="talla-7" onchange="handleSelectOption('size', 'talla-7', 'Talla 7 (Anillos)')">
                    <label class="option" for="size-t7" data-txt="Talla 7 (Anillos)"></label>
                  </div>
                  <div title="talla-9">
                    <input id="size-t9" name="filter-size" type="radio" value="talla-9" onchange="handleSelectOption('size', 'talla-9', 'Talla 9 (Anillos)')">
                    <label class="option" for="size-t9" data-txt="Talla 9 (Anillos)"></label>
                  </div>
                  <div title="talla-10">
                    <input id="size-t10" name="filter-size" type="radio" value="talla-10" onchange="handleSelectOption('size', 'talla-10', 'Talla 10 (Anillos)')">
                    <label class="option" for="size-t10" data-txt="Talla 10 (Anillos)"></label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Ordenar Por -->
            <div class="filter-item-wrap">
              <span class="filter-label">Ordenar Por</span>
              <div class="select uiverse-select" id="selectSort" tabindex="0">
                <div class="selected" id="selectedSort">
                  <span class="selected-text" id="selectedSortText">Destacados La Bonita</span>
                  <svg class="arrow" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                </div>
                <div class="options">
                  <div title="default">
                    <input id="sort-default" name="filter-sort" type="radio" value="default" checked onchange="handleSelectOption('sort', 'default', 'Destacados La Bonita')">
                    <label class="option" for="sort-default" data-txt="Destacados La Bonita"></label>
                  </div>
                  <div title="price-asc">
                    <input id="sort-price-asc" name="filter-sort" type="radio" value="price-asc" onchange="handleSelectOption('sort', 'price-asc', 'Precio: Menor a Mayor')">
                    <label class="option" for="sort-price-asc" data-txt="Precio: Menor a Mayor"></label>
                  </div>
                  <div title="price-desc">
                    <input id="sort-price-desc" name="filter-sort" type="radio" value="price-desc" onchange="handleSelectOption('sort', 'price-desc', 'Precio: Mayor a Menor')">
                    <label class="option" for="sort-price-desc" data-txt="Precio: Mayor a Menor"></label>
                  </div>
                  <div title="weight-desc">
                    <input id="sort-weight-desc" name="filter-sort" type="radio" value="weight-desc" onchange="handleSelectOption('sort', 'weight-desc', 'Gramaje: Mayor a Menor')">
                    <label class="option" for="sort-weight-desc" data-txt="Gramaje: Mayor a Menor"></label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Line & Reset -->
          <div class="filter-meta-bar">
            <span class="filter-results-count" id="filterCount">Mostrando piezas de oro</span>
            <button class="btn-filter-reset" id="btnFilterReset" onclick="resetCatalogFilters()" type="button" aria-label="Limpiar filtros">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <!-- 24 Products Grid -->`;

  if (oldFilterBarPattern.test(html)) {
    html = html.replace(oldFilterBarPattern, newCleanFilterBar);
    console.log(`[REPLACED FILTER BAR IN INDEX.HTML]`);
  }

  // Also add scoped styling in index.html to guarantee category cards and filter row look pristine
  const additionalStyle = `
    /* Category Cards and Filter Row Perfection */
    .hero-overlapping-cards-wrap {
      margin-top: 40px !important;
      margin-bottom: 25px !important;
      overflow: visible !important;
    }
    .cat-slider-container {
      overflow: visible !important;
    }
    .cat-slider-track {
      overflow-x: auto !important;
      overflow-y: visible !important;
      padding: 16px 12px 36px 12px !important;
    }
    .cat-square-card {
      min-height: 290px !important;
      max-height: 340px !important;
      height: clamp(290px, 22vw, 340px) !important;
      border-radius: 22px !important;
      box-shadow: 0 8px 26px rgba(8, 25, 91, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04) !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
    }
    .middle-split-section {
      padding-top: 30px !important;
    }
    .filter-dropdowns-row {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 20px !important;
      width: 100% !important;
      max-width: 1000px !important;
      margin: 0 auto 20px !important;
    }
    @media (max-width: 860px) {
      .filter-dropdowns-row {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }
    }
  </style>`;

  html = html.replace('</style>', additionalStyle);

  fs.writeFileSync(indexHtmlPath, html, 'utf8');
  console.log(`[UPDATED INDEX.HTML] ${indexHtmlPath}`);
}

console.log('--- Fix script completed successfully ---');
