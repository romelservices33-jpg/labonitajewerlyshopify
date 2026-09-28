const fs = require('fs');
const path = require('path');

const rootDir = 'c:/TRABAJO/La Bonita Joyeria';

// =========================================================================
// 1. UPDATE bonita-square-collections.liquid
// =========================================================================
const squareSectionFiles = [
  path.join(rootDir, 'sections', 'bonita-square-collections.liquid'),
  path.join(rootDir, 'code', 'sections', 'bonita-square-collections.liquid')
];

const newSquareDefaultCards = `          <!-- Default 9 Luxury Categories -->
          <a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('cadenas');return false;}" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Cadenas</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="Cadenas de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('cuban');return false;}" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Especialidad</span>
              <h3 class="cat-card-title">Cadenas Cubanas</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-cuban.jpg' | asset_url }}" alt="Cadenas Cubanas de Oro" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('anillos');return false;}" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Anillos</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-anillos.jpg' | asset_url }}" alt="Anillos de Oro" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('aretes');return false;}" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Aretes</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-aretes.jpg' | asset_url }}" alt="Aretes de Oro" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('pulseras');return false;}" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Pulseras</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-pulseras.jpg' | asset_url }}" alt="Pulseras de Oro" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('dijes');return false;}" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Dijes & Medallas</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-dijes.jpg' | asset_url }}" alt="Dijes y Medallas de Oro" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('piercings');return false;}" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Nueva Colección</span>
              <h3 class="cat-card-title">Piercings</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-piercings.jpg' | asset_url }}" alt="Piercings de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('prendedores');return false;}" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Nueva Colección</span>
              <h3 class="cat-card-title">Prendedores</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-prendedores.jpg' | asset_url }}" alt="Prendedores y Broches de Oro" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <a href="#catalogo" onclick="if(typeof window.filterCatalog==='function'){window.filterCatalog('relojes');return false;}" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Alta Gama</span>
              <h3 class="cat-card-title">Relojes</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-relojes.jpg' | asset_url }}" alt="Relojes de Lujo y Oro" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>`;

squareSectionFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace fallback cards block
  const oldFallbackPattern = /\{%- else -%\}\s*<!-- Default Fallback Cards -->[\s\S]*?\{%- endif -%\}/;
  if (oldFallbackPattern.test(content)) {
    content = content.replace(oldFallbackPattern, `{%- else -%}\n${newSquareDefaultCards}\n        {%- endif -%}`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`[UPDATED SQUARE COLLECTIONS SECTION] ${file}`);
  }
});

// =========================================================================
// 2. UPDATE bonita-luxury-storefront.liquid (Tabs, Liquid Classifier, JS Controller)
// =========================================================================
const storefrontFiles = [
  path.join(rootDir, 'sections', 'bonita-luxury-storefront.liquid'),
  path.join(rootDir, 'code', 'sections', 'bonita-luxury-storefront.liquid')
];

const newCategoryTabs = `        <!-- Category Tabs -->
        <nav class="catalog-category-tabs" id="catalogCategoryTabs" aria-label="Filtrar por colección">
          <button class="cat-tab-btn active" data-cat="todos" onclick="filterCatalog('todos', this)">Todas</button>
          <button class="cat-tab-btn" data-cat="cadenas" onclick="filterCatalog('cadenas', this)">Cadenas</button>
          <button class="cat-tab-btn" data-cat="cuban" onclick="filterCatalog('cuban', this)">Cadenas Cubanas</button>
          <button class="cat-tab-btn" data-cat="anillos" onclick="filterCatalog('anillos', this)">Anillos</button>
          <button class="cat-tab-btn" data-cat="aretes" onclick="filterCatalog('aretes', this)">Aretes</button>
          <button class="cat-tab-btn" data-cat="pulseras" onclick="filterCatalog('pulseras', this)">Pulseras</button>
          <button class="cat-tab-btn" data-cat="dijes" onclick="filterCatalog('dijes', this)">Dijes & Medallas</button>
          <button class="cat-tab-btn" data-cat="piercings" onclick="filterCatalog('piercings', this)">Piercings</button>
          <button class="cat-tab-btn" data-cat="prendedores" onclick="filterCatalog('prendedores', this)">Prendedores</button>
          <button class="cat-tab-btn" data-cat="relojes" onclick="filterCatalog('relojes', this)">Relojes</button>
        </nav>`;

const newLiquidClassifier = `{%- assign p_type = product.type | downcase -%}
            {%- assign p_title = product.title | downcase -%}
            {%- assign p_tags = product.tags | join: ',' | downcase -%}
            {%- assign cat_tag = 'cadenas' -%}
            {%- if p_type contains 'cuban' or p_title contains 'cuban' or p_tags contains 'cuban' or p_title contains 'miami' -%}
              {%- assign cat_tag = 'cuban' -%}
            {%- elsif p_type contains 'anillo' or p_title contains 'anillo' or p_tags contains 'anillo' or p_type contains 'ring' or p_title contains 'ring' -%}
              {%- assign cat_tag = 'anillos' -%}
            {%- elsif p_type contains 'arete' or p_title contains 'arete' or p_tags contains 'arete' or p_title contains 'arracada' or p_type contains 'arracada' or p_type contains 'earring' -%}
              {%- assign cat_tag = 'aretes' -%}
            {%- elsif p_type contains 'pulsera' or p_title contains 'pulsera' or p_tags contains 'pulsera' or p_title contains 'esclava' or p_title contains 'manilla' or p_title contains 'bangle' or p_type contains 'bracelet' -%}
              {%- assign cat_tag = 'pulseras' -%}
            {%- elsif p_type contains 'dije' or p_title contains 'dije' or p_tags contains 'dije' or p_title contains 'medalla' or p_title contains 'cruz' or p_title contains 'cristo' or p_type contains 'pendant' -%}
              {%- assign cat_tag = 'dijes' -%}
            {%- elsif p_type contains 'piercing' or p_title contains 'piercing' or p_tags contains 'piercing' or p_title contains 'broquel' -%}
              {%- assign cat_tag = 'piercings' -%}
            {%- elsif p_type contains 'prendedor' or p_title contains 'prendedor' or p_tags contains 'prendedor' or p_title contains 'broche' -%}
              {%- assign cat_tag = 'prendedores' -%}
            {%- elsif p_type contains 'reloj' or p_title contains 'reloj' or p_tags contains 'reloj' or p_type contains 'watch' or p_title contains 'watch' -%}
              {%- assign cat_tag = 'relojes' -%}
            {%- else -%}
              {%- assign cat_tag = 'cadenas' -%}
            {%- endif -%}
            {%- assign karat_tag = '14k' -%}
            {%- if p_tags contains '10k' or p_title contains '10k' or p_type contains '10k' -%}
              {%- assign karat_tag = '10k' -%}
            {%- endif -%}`;

const newJsStorefrontFilter = `function getActiveFilteredCatalogCards() {
      var grid = document.getElementById('catalogProductsGrid');
      if (!grid) return [];
      var cards = Array.from(grid.querySelectorAll('.cutout-product-card'));

      return cards.filter(function(card) {
        var cat = (card.getAttribute('data-category') || '').toLowerCase();
        var titleEl = card.querySelector('.cutout-product-title');
        var title = titleEl ? titleEl.textContent.toLowerCase() : '';
        var karat = (card.getAttribute('data-karat') || '').toLowerCase();
        var size = (card.getAttribute('data-size') || '').toLowerCase();

        // 1. Category Filtering
        if (currentCatalogCategory !== 'todos') {
          var target = currentCatalogCategory.toLowerCase();
          var matched = false;

          if (cat === target || cat.indexOf(target) !== -1) {
            matched = true;
          } else if (target === 'cadenas' && (cat.includes('cadena') || title.includes('cadena') || title.includes('collar') || title.includes('franco') || title.includes('soga') || title.includes('rope') || title.includes('figaro'))) {
            matched = true;
          } else if (target === 'cuban' && (cat.includes('cuban') || title.includes('cuban') || title.includes('miami') || title.includes('eslabon') || title.includes('cubana'))) {
            matched = true;
          } else if (target === 'anillos' && (cat.includes('anillo') || title.includes('anillo') || title.includes('sello') || title.includes('solitario') || title.includes('ring'))) {
            matched = true;
          } else if (target === 'aretes' && (cat.includes('arete') || title.includes('arete') || title.includes('arracada') || title.includes('topos') || title.includes('earring'))) {
            matched = true;
          } else if (target === 'pulseras' && (cat.includes('pulsera') || title.includes('pulsera') || title.includes('manilla') || title.includes('esclava') || title.includes('bangle') || title.includes('bracelet'))) {
            matched = true;
          } else if (target === 'dijes' && (cat.includes('dije') || title.includes('dije') || title.includes('medalla') || title.includes('cruz') || title.includes('cristo') || title.includes('virgen') || title.includes('pendant'))) {
            matched = true;
          } else if (target === 'piercings' && (cat.includes('piercing') || title.includes('piercing') || title.includes('broquel') || title.includes('nariz') || title.includes('ombligo'))) {
            matched = true;
          } else if (target === 'prendedores' && (cat.includes('prendedor') || title.includes('prendedor') || title.includes('broche') || title.includes('alfiler') || title.includes('pin'))) {
            matched = true;
          } else if (target === 'relojes' && (cat.includes('reloj') || title.includes('reloj') || title.includes('watch') || title.includes('cronografo'))) {
            matched = true;
          }

          if (!matched) return false;
        }

        // 2. Karat Filtering
        if (activeKaratFilter !== 'all') {
          var targetKarat = activeKaratFilter.toLowerCase();
          if (karat !== targetKarat && !title.includes(targetKarat)) {
            return false;
          }
        }

        // 3. Size Filtering
        if (activeSizeFilter !== 'all') {
          var targetSize = activeSizeFilter.toLowerCase();
          if (size.indexOf(targetSize) === -1 && !title.includes(targetSize)) {
            return false;
          }
        }

        return true;
      });
    }

    function sortCatalogCards(cards) {
      if (activeSortFilter === 'price-asc') {
        cards.sort(function(a, b) {
          return (parseFloat(a.getAttribute('data-price')) || 0) - (parseFloat(b.getAttribute('data-price')) || 0);
        });
      } else if (activeSortFilter === 'price-desc') {
        cards.sort(function(a, b) {
          return (parseFloat(b.getAttribute('data-price')) || 0) - (parseFloat(a.getAttribute('data-price')) || 0);
        });
      } else if (activeSortFilter === 'weight-desc') {
        cards.sort(function(a, b) {
          return (parseFloat(b.getAttribute('data-weight')) || 0) - (parseFloat(a.getAttribute('data-weight')) || 0);
        });
      } else if (activeSortFilter === 'weight-asc') {
        cards.sort(function(a, b) {
          return (parseFloat(a.getAttribute('data-weight')) || 0) - (parseFloat(b.getAttribute('data-weight')) || 0);
        });
      } else {
        cards.sort(function(a, b) {
          var orderA = parseInt(a.getAttribute('data-default-order')) || 0;
          var orderB = parseInt(b.getAttribute('data-default-order')) || 0;
          return orderA - orderB;
        });
      }
      return cards;
    }

    function paginateCatalogGrid() {
      var grid = document.getElementById('catalogProductsGrid');
      if (!grid) return;

      var allCards = grid.querySelectorAll('.cutout-product-card');
      allCards.forEach(function(c) { c.style.display = 'none'; });

      var activeCards = getActiveFilteredCatalogCards();
      activeCards = sortCatalogCards(activeCards);

      var total = activeCards.length;
      var perPage = getCatalogPerPage();
      var totalPages = Math.max(1, Math.ceil(total / perPage));
      if (catalogPage > totalPages) catalogPage = 1;

      var start = (catalogPage - 1) * perPage;
      var end = start + perPage;
      var pageCards = activeCards.slice(start, end);

      pageCards.forEach(function(c) {
        c.style.display = 'flex';
        grid.appendChild(c);
      });

      // Update Results Counter
      var countText = document.getElementById('filterCount');
      if (countText) {
        if (total === 0) {
          countText.textContent = '0 piezas encontradas';
        } else if (total === 1) {
          countText.textContent = 'Mostrando 1 pieza de oro auténtico';
        } else {
          countText.textContent = 'Mostrando ' + (start + 1) + '-' + Math.min(end, total) + ' de ' + total + ' piezas de oro auténtico';
        }
      }

      // Empty State
      var emptyState = document.getElementById('catalogEmptyState');
      if (emptyState) {
        emptyState.style.display = (total === 0) ? 'flex' : 'none';
        if (total === 0) grid.appendChild(emptyState);
      }

      // Reset button active state
      var resetBtn = document.getElementById('btnFilterReset');
      if (resetBtn) {
        var isModified = (currentCatalogCategory !== 'todos') || (activeKaratFilter !== 'all') || (activeSizeFilter !== 'all') || (activeSortFilter !== 'default');
        resetBtn.classList.toggle('active', isModified);
      }

      renderCatalogPaginationButtons(totalPages);
    }

    function renderCatalogPaginationButtons(totalPages) {
      var bar = document.getElementById('catalogPaginationBar');
      if (!bar) return;
      bar.innerHTML = '';

      if (totalPages <= 1) return;

      // Prev Button
      var prevBtn = document.createElement('button');
      prevBtn.className = 'catalog-page-btn nav-btn';
      prevBtn.innerHTML = '← Anterior';
      prevBtn.disabled = (catalogPage === 1);
      prevBtn.onclick = function() {
        if (catalogPage > 1) {
          catalogPage--;
          paginateCatalogGrid();
          var catEl = document.getElementById('catalogo');
          if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
        }
      };
      bar.appendChild(prevBtn);

      // Page numbers
      for (var i = 1; i <= totalPages; i++) {
        (function(pageNum) {
          var numBtn = document.createElement('button');
          numBtn.className = 'catalog-page-btn' + (pageNum === catalogPage ? ' active' : '');
          numBtn.textContent = pageNum;
          numBtn.onclick = function() {
            catalogPage = pageNum;
            paginateCatalogGrid();
            var catEl = document.getElementById('catalogo');
            if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
          };
          bar.appendChild(numBtn);
        })(i);
      }

      // Next Button
      var nextBtn = document.createElement('button');
      nextBtn.className = 'catalog-page-btn nav-btn';
      nextBtn.innerHTML = 'Siguiente →';
      nextBtn.disabled = (catalogPage === totalPages);
      nextBtn.onclick = function() {
        if (catalogPage < totalPages) {
          catalogPage++;
          paginateCatalogGrid();
          var catEl = document.getElementById('catalogo');
          if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
        }
      };
      bar.appendChild(nextBtn);
    }

    function handleSelectOption(type, val, txt) {
      if (type === 'karat') {
        activeKaratFilter = val;
        var t = document.getElementById('selectedKaratText');
        if (t) t.textContent = txt;
      } else if (type === 'size') {
        activeSizeFilter = val;
        var t = document.getElementById('selectedSizeText');
        if (t) t.textContent = txt;
      } else if (type === 'sort') {
        activeSortFilter = val;
        var t = document.getElementById('selectedSortText');
        if (t) t.textContent = txt;
      }
      document.querySelectorAll('.uiverse-select').forEach(function(s) { s.classList.remove('is-open'); });
      catalogPage = 1;
      paginateCatalogGrid();
    }

    function resetCatalogFilters() {
      currentCatalogCategory = 'todos';
      activeKaratFilter = 'all';
      activeSizeFilter = 'all';
      activeSortFilter = 'default';
      activeMaxWeight = 70;

      document.querySelectorAll('.cat-tab-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-cat') === 'todos');
      });

      var kAll = document.getElementById('karat-all');
      if (kAll) kAll.checked = true;
      var kTxt = document.getElementById('selectedKaratText');
      if (kTxt) kTxt.textContent = 'Todas las purezas';

      var sAll = document.getElementById('size-all');
      if (sAll) sAll.checked = true;
      var sTxt = document.getElementById('selectedSizeText');
      if (sTxt) sTxt.textContent = 'Todas las medidas';

      var sortDef = document.getElementById('sort-default');
      if (sortDef) sortDef.checked = true;
      var sortTxt = document.getElementById('selectedSortText');
      if (sortTxt) sortTxt.textContent = 'Destacados La Bonita';

      var titleEl = document.getElementById('catalogTitle');
      var subtitleEl = document.getElementById('catalogSubtitle');
      if (titleEl && subtitleEl) {
        titleEl.innerHTML = 'Catálogo <span class="accent-gold">Exclusivo</span>';
        subtitleEl.textContent = 'Oro 100% auténtico 10K y 14K con peso garantizado y financiamiento Affirm.';
      }

      catalogPage = 1;
      paginateCatalogGrid();
    }

    function filterCatalog(category, tabBtn) {
      currentCatalogCategory = category || 'todos';

      // Dynamic Editorial Collection Banners for all 9 categories
      var titleEl = document.getElementById('catalogTitle');
      var subtitleEl = document.getElementById('catalogSubtitle');
      if (titleEl && subtitleEl) {
        if (category === 'cadenas') {
          titleEl.innerHTML = 'Cadenas & <span class="accent-gold">Collares Italianos</span>';
          subtitleEl.textContent = 'Diseños Franco, Soga, Fígaro y Mónaco fundidos a mano en oro 10K y 14K.';
        } else if (category === 'cuban') {
          titleEl.innerHTML = 'Especialidad <span class="accent-gold">Cadenas Cubanas</span>';
          subtitleEl.textContent = 'Nuestra firma insignia: eslabones Miami Cuban macizos de alto gramaje con broche de seguridad.';
        } else if (category === 'anillos') {
          titleEl.innerHTML = 'Anillos de <span class="accent-gold">Compromiso & Sello</span>';
          subtitleEl.textContent = 'Piezas forjadas con acabados de alta orfebrería y piedras engastadas a mano.';
        } else if (category === 'aretes') {
          titleEl.innerHTML = 'Aretes & <span class="accent-gold">Arracadas de Lujo</span>';
          subtitleEl.textContent = 'Diseños italianos ligeros y cómodos para uso diario en oro sólido garantizado.';
        } else if (category === 'pulseras') {
          titleEl.innerHTML = 'Pulseras & <span class="accent-gold">Bangles Exclusivos</span>';
          subtitleEl.textContent = 'Manillas y brazaletes pesados con cierre de caja reforzado y oro certificado.';
        } else if (category === 'dijes') {
          titleEl.innerHTML = 'Dijes & <span class="accent-gold">Medallas Sagradas</span>';
          subtitleEl.textContent = 'Cruces, Cristos y medallas talladas en relieve con brillo diamantado superior.';
        } else if (category === 'piercings') {
          titleEl.innerHTML = 'Piercings & <span class="accent-gold">Broqueles de Oro</span>';
          subtitleEl.textContent = 'Joyas hipoalergénicas en oro macizo 10K y 14K con rosca de máxima seguridad.';
        } else if (category === 'prendedores') {
          titleEl.innerHTML = 'Prendedores & <span class="accent-gold">Broches de Gala</span>';
          subtitleEl.textContent = 'Prendedores finos de solapa y broches imperdibles en oro auténtico certificado.';
        } else if (category === 'relojes') {
          titleEl.innerHTML = 'Relojes de <span class="accent-gold">Alta Gama & Oro</span>';
          subtitleEl.textContent = 'Relojería fina con biseles de oro, cristales de zafiro y acabados de lujo.';
        } else {
          titleEl.innerHTML = 'Catálogo <span class="accent-gold">Exclusivo</span>';
          subtitleEl.textContent = 'Oro 100% auténtico 10K y 14K con peso garantizado y financiamiento Affirm.';
        }
      }

      var targetBtn = tabBtn || document.querySelector('.cat-tab-btn[data-cat="' + category + '"]');
      document.querySelectorAll('.cat-tab-btn').forEach(function(b) { b.classList.remove('active'); });
      if (targetBtn) {
        targetBtn.classList.add('active');
      }

      catalogPage = 1;
      paginateCatalogGrid();

      var catalogEl = document.getElementById('catalogo');
      if (catalogEl && !tabBtn) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
    window.filterCatalog = filterCatalog;`;

storefrontFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace Category tabs
  const tabsPattern = /<!-- Category Tabs -->\s*<nav class="catalog-category-tabs"[\s\S]*?<\/nav>/;
  if (tabsPattern.test(content)) {
    content = content.replace(tabsPattern, newCategoryTabs);
  }

  // Replace Liquid product classifier
  const classifierPattern = /\{%- assign p_type = product\.type \| downcase -%}[\s\S]*?\{%- assign karat_tag = '14k' -%}[\s\S]*?\{%- endif -%\}/;
  if (classifierPattern.test(content)) {
    content = content.replace(classifierPattern, newLiquidClassifier);
  }

  // Replace JS Controller
  const jsPattern = /function getActiveFilteredCatalogCards\(\)[\s\S]*?window\.filterCatalog = filterCatalog;/;
  if (jsPattern.test(content)) {
    content = content.replace(jsPattern, newJsStorefrontFilter);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[UPDATED STOREFRONT LIQUID ALL 9 CATEGORIES] ${file}`);
});

// =========================================================================
// 3. UPDATE code/index.html (Local Storefront Prototype)
// =========================================================================
const indexHtmlPath = path.join(rootDir, 'code', 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let html = fs.readFileSync(indexHtmlPath, 'utf8');

  // 1. Update Overlapping Square Track in HTML to all 9 categories
  const newIndexSquareTrack = `<!-- Slider Track: Square 1:1 Cards (All 9 Luxury Collections) -->
        <div class="cat-slider-track" id="catSliderTrack">
          <!-- Card 1: Cadenas -->
          <a href="#catalogo" onclick="filterCatalog('cadenas'); return false;" class="cat-square-card" id="cadenas" aria-label="Ver Colección de Cadenas">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Cadenas</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="assets/collection-cadenas.jpg" alt="Cadenas de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <!-- Card 2: Cadenas Cubanas -->
          <a href="#catalogo" onclick="filterCatalog('cuban'); return false;" class="cat-square-card" id="cuban" aria-label="Ver Colección Cadenas Cubanas">
            <div class="cat-card-header">
              <span class="cat-card-label">Especialidad</span>
              <h3 class="cat-card-title">Cadenas Cubanas</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="assets/collection-cuban.jpg" alt="Cadenas Cubanas Miami de Oro" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <!-- Card 3: Anillos -->
          <a href="#catalogo" onclick="filterCatalog('anillos'); return false;" class="cat-square-card" id="anillos" aria-label="Ver Colección de Anillos">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Anillos</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="assets/collection-anillos.jpg" alt="Anillos de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <!-- Card 4: Aretes -->
          <a href="#catalogo" onclick="filterCatalog('aretes'); return false;" class="cat-square-card" id="aretes" aria-label="Ver Colección de Aretes">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Aretes</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="assets/collection-aretes.jpg" alt="Aretes de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <!-- Card 5: Pulseras -->
          <a href="#catalogo" onclick="filterCatalog('pulseras'); return false;" class="cat-square-card" id="pulseras" aria-label="Ver Colección de Pulseras">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Pulseras</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="assets/collection-pulseras.jpg" alt="Pulseras y Manillas de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <!-- Card 6: Dijes & Medallas -->
          <a href="#catalogo" onclick="filterCatalog('dijes'); return false;" class="cat-square-card" id="dijes" aria-label="Ver Colección de Dijes">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Dijes & Medallas</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="assets/collection-dijes.jpg" alt="Dijes y Medallas de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <!-- Card 7: Piercings -->
          <a href="#catalogo" onclick="filterCatalog('piercings'); return false;" class="cat-square-card" id="piercings" aria-label="Ver Colección de Piercings">
            <div class="cat-card-header">
              <span class="cat-card-label">Nueva Colección</span>
              <h3 class="cat-card-title">Piercings</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="assets/collection-piercings.jpg" alt="Piercings de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <!-- Card 8: Prendedores -->
          <a href="#catalogo" onclick="filterCatalog('prendedores'); return false;" class="cat-square-card" id="prendedores" aria-label="Ver Colección de Prendedores">
            <div class="cat-card-header">
              <span class="cat-card-label">Nueva Colección</span>
              <h3 class="cat-card-title">Prendedores</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="assets/collection-prendedores.jpg" alt="Prendedores y Broches de Oro" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          <!-- Card 9: Relojes -->
          <a href="#catalogo" onclick="filterCatalog('relojes'); return false;" class="cat-square-card" id="relojes" aria-label="Ver Colección de Relojes">
            <div class="cat-card-header">
              <span class="cat-card-label">Alta Gama</span>
              <h3 class="cat-card-title">Relojes</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="assets/collection-relojes.jpg" alt="Relojes de Lujo y Oro" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>
        </div>`;

  const oldSquareTrackPattern = /<div class="cat-slider-track" id="catSliderTrack">[\s\S]*?<\/div>\s*<!-- Next Button -->/;
  if (oldSquareTrackPattern.test(html)) {
    html = html.replace(oldSquareTrackPattern, `${newIndexSquareTrack}\n\n        <!-- Next Button -->`);
  }

  // 2. Update Catalog Category Tabs in index.html
  const oldIndexTabsPattern = /<!-- Minimalist Category Navigation \(Navbar Style\) -->\s*<nav class="catalog-category-tabs" id="catalogCategoryTabs"[\s\S]*?<\/nav>/;
  const newIndexTabs = `<!-- Minimalist Category Navigation (Navbar Style) -->
        <nav class="catalog-category-tabs" id="catalogCategoryTabs" aria-label="Filtrar por colección">
          <button class="cat-tab-btn active" data-cat="todos" onclick="filterCatalog('todos', this)">Todas</button>
          <button class="cat-tab-btn" data-cat="cadenas" onclick="filterCatalog('cadenas', this)">Cadenas</button>
          <button class="cat-tab-btn" data-cat="cuban" onclick="filterCatalog('cuban', this)">Cadenas Cubanas</button>
          <button class="cat-tab-btn" data-cat="anillos" onclick="filterCatalog('anillos', this)">Anillos</button>
          <button class="cat-tab-btn" data-cat="aretes" onclick="filterCatalog('aretes', this)">Aretes</button>
          <button class="cat-tab-btn" data-cat="pulseras" onclick="filterCatalog('pulseras', this)">Pulseras</button>
          <button class="cat-tab-btn" data-cat="dijes" onclick="filterCatalog('dijes', this)">Dijes & Medallas</button>
          <button class="cat-tab-btn" data-cat="piercings" onclick="filterCatalog('piercings', this)">Piercings</button>
          <button class="cat-tab-btn" data-cat="prendedores" onclick="filterCatalog('prendedores', this)">Prendedores</button>
          <button class="cat-tab-btn" data-cat="relojes" onclick="filterCatalog('relojes', this)">Relojes</button>
        </nav>`;

  if (oldIndexTabsPattern.test(html)) {
    html = html.replace(oldIndexTabsPattern, newIndexTabs);
  }

  // 3. Update floating nav & mobile notch links to include new categories
  const newFloatingNavLinks = `<a href="#catalogo" onclick="filterCatalog('cadenas'); return false;">Cadenas</a>
        <a href="#catalogo" onclick="filterCatalog('cuban'); return false;">Cubanas</a>
        <a href="#catalogo" onclick="filterCatalog('anillos'); return false;">Anillos</a>
        <a href="#catalogo" onclick="filterCatalog('aretes'); return false;">Aretes</a>
        <a href="#catalogo" onclick="filterCatalog('pulseras'); return false;">Pulseras</a>
        <a href="#catalogo" onclick="filterCatalog('dijes'); return false;">Dijes</a>
        <a href="#catalogo" onclick="filterCatalog('piercings'); return false;">Piercings</a>
        <a href="#catalogo" onclick="filterCatalog('prendedores'); return false;">Prendedores</a>
        <a href="#catalogo" onclick="filterCatalog('relojes'); return false;">Relojes</a>`;

  html = html.replace(/<nav class="hero-floating-nav" aria-label="Navegación de colecciones">[\s\S]*?<\/nav>/, `<nav class="hero-floating-nav" aria-label="Navegación de colecciones">\n        ${newFloatingNavLinks}\n      </nav>`);

  // 4. Add demo cards for Piercings, Prendedores, Relojes inside #catalogProductsGrid if not already present
  if (!html.includes('data-category="piercings"')) {
    const extraCards = `
        <!-- ==========================================
             7. COLECCIÓN PIERCINGS (4 PRODUCTOS)
             ========================================== -->
        <div class="product-shop-card cutout-product-card" data-category="piercings" data-karat="14k" data-price="290" data-weight="2.1" data-size="arete-dije" data-default-order="25">
          <div class="cutout-card-media">
            <img src="assets/collection-piercings.jpg" alt="Piercing Helix Diamantado 14K" class="cutout-card-img" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
            <div class="cutout-card-pin"><span>Oro 14K</span></div>
            <div class="cutout-card-inset-label"><span class="cutout-label-text">Piercings</span></div>
          </div>
          <div class="cutout-card-content">
            <div class="cutout-title-row">
              <h4 class="cutout-product-title">Piercing Helix Diamantado 14K</h4>
              <span class="spec-weight-tag">Rosca Seguridad · 2.10 g</span>
            </div>
            <div class="product-card-pricing-row">
              <div class="pricing-amounts">
                <div class="pricing-numbers-row"><span class="price-now">$290</span><span class="price-was">$340</span></div>
                <div class="affirm-monthly-badge">Desde <strong>$25/mes</strong> con Affirm</div>
              </div>
              <button class="btn-add-cart-pill" onclick="addToCartItem('Piercing Helix Diamantado 14K', 290, 'mock')" title="Agregar al carrito">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ==========================================
             8. COLECCIÓN PRENDEDORES (4 PRODUCTOS)
             ========================================== -->
        <div class="product-shop-card cutout-product-card" data-category="prendedores" data-karat="14k" data-price="480" data-weight="3.8" data-size="arete-dije" data-default-order="26">
          <div class="cutout-card-media">
            <img src="assets/collection-prendedores.jpg" alt="Prendedor Azabache & Oro 14K" class="cutout-card-img" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
            <div class="cutout-card-pin"><span>Oro 14K</span></div>
            <div class="cutout-card-inset-label"><span class="cutout-label-text">Prendedores</span></div>
          </div>
          <div class="cutout-card-content">
            <div class="cutout-title-row">
              <h4 class="cutout-product-title">Prendedor Azabache Protección 14K</h4>
              <span class="spec-weight-tag">Oro & Piedra Genuina · 3.80 g</span>
            </div>
            <div class="product-card-pricing-row">
              <div class="pricing-amounts">
                <div class="pricing-numbers-row"><span class="price-now">$480</span><span class="price-was">$550</span></div>
                <div class="affirm-monthly-badge">Desde <strong>$40/mes</strong> con Affirm</div>
              </div>
              <button class="btn-add-cart-pill" onclick="addToCartItem('Prendedor Azabache Protección 14K', 480, 'mock')" title="Agregar al carrito">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ==========================================
             9. COLECCIÓN RELOJES (4 PRODUCTOS)
             ========================================== -->
        <div class="product-shop-card cutout-product-card" data-category="relojes" data-karat="14k" data-price="3850" data-weight="58.0" data-size="8.0" data-default-order="27">
          <div class="cutout-card-media">
            <img src="assets/collection-relojes.jpg" alt="Reloj Cronógrafo Bisel Oro 14K" class="cutout-card-img" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
            <div class="cutout-card-pin"><span>Edición Oro</span></div>
            <div class="cutout-card-inset-label"><span class="cutout-label-text">Relojes</span></div>
          </div>
          <div class="cutout-card-content">
            <div class="cutout-title-row">
              <h4 class="cutout-product-title">Reloj President Crown Bisel Oro 14K</h4>
              <span class="spec-weight-tag">Cristal Zafiro · 58.00 g Macizo</span>
            </div>
            <div class="product-card-pricing-row">
              <div class="pricing-amounts">
                <div class="pricing-numbers-row"><span class="price-now">$3,850</span><span class="price-was">$4,300</span></div>
                <div class="affirm-monthly-badge">Desde <strong>$320/mes</strong> con Affirm</div>
              </div>
              <button class="btn-add-cart-pill" onclick="addToCartItem('Reloj President Crown Bisel Oro 14K', 3850, 'mock')" title="Agregar al carrito">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
              </button>
            </div>
          </div>
        </div>
`;
    html = html.replace('<div class="catalog-empty-state"', `${extraCards}\n        <div class="catalog-empty-state"`);
  }

  // 5. Update filterCatalog in index.html to support all 9 titles
  const oldFilterCatalogJs = /function filterCatalog\(category, tabBtn\) \{[\s\S]*?catalogEl\.scrollIntoView\(\{ behavior: 'smooth' \}\);\s*\}\s*\}/;
  const newIndexFilterCatalogJs = `function filterCatalog(category, tabBtn) {
      currentCatalogCategory = category || 'todos';

      // Dynamic Editorial Collection Banners for all 9 categories
      const titleEl = document.getElementById('catalogTitle');
      const subtitleEl = document.getElementById('catalogSubtitle');
      if (titleEl && subtitleEl) {
        if (category === 'cadenas') {
          titleEl.innerHTML = 'Cadenas & <span class="accent-gold">Collares Italianos</span>';
          subtitleEl.textContent = 'Diseños Franco, Soga, Fígaro y Mónaco fundidos a mano en oro 10K y 14K.';
        } else if (category === 'cuban') {
          titleEl.innerHTML = 'Especialidad <span class="accent-gold">Cadenas Cubanas</span>';
          subtitleEl.textContent = 'Nuestra firma insignia: eslabones Miami Cuban macizos de alto gramaje con broche de seguridad.';
        } else if (category === 'anillos') {
          titleEl.innerHTML = 'Anillos de <span class="accent-gold">Compromiso & Sello</span>';
          subtitleEl.textContent = 'Piezas forjadas con acabados de alta orfebrería y piedras engastadas a mano.';
        } else if (category === 'aretes') {
          titleEl.innerHTML = 'Aretes & <span class="accent-gold">Arracadas de Lujo</span>';
          subtitleEl.textContent = 'Diseños italianos ligeros y cómodos para uso diario en oro sólido garantizado.';
        } else if (category === 'pulseras') {
          titleEl.innerHTML = 'Pulseras & <span class="accent-gold">Bangles Exclusivos</span>';
          subtitleEl.textContent = 'Manillas y brazaletes pesados con cierre de caja reforzado y oro certificado.';
        } else if (category === 'dijes') {
          titleEl.innerHTML = 'Dijes & <span class="accent-gold">Medallas Sagradas</span>';
          subtitleEl.textContent = 'Cruces, Cristos y medallas talladas en relieve con brillo diamantado superior.';
        } else if (category === 'piercings') {
          titleEl.innerHTML = 'Piercings & <span class="accent-gold">Broqueles de Oro</span>';
          subtitleEl.textContent = 'Joyas hipoalergénicas en oro macizo 10K y 14K con rosca de máxima seguridad.';
        } else if (category === 'prendedores') {
          titleEl.innerHTML = 'Prendedores & <span class="accent-gold">Broches de Gala</span>';
          subtitleEl.textContent = 'Prendedores finos de solapa y broches imperdibles en oro auténtico certificado.';
        } else if (category === 'relojes') {
          titleEl.innerHTML = 'Relojes de <span class="accent-gold">Alta Gama & Oro</span>';
          subtitleEl.textContent = 'Relojería fina con biseles de oro, cristales de zafiro y acabados de lujo.';
        } else {
          titleEl.innerHTML = 'Catálogo <span class="accent-gold">Exclusivo</span>';
          subtitleEl.textContent = 'Oro 100% auténtico 10K y 14K con peso garantizado y financiamiento Affirm.';
        }
      }

      if (tabBtn) {
        document.querySelectorAll('.cat-tab-btn').forEach(btn => btn.classList.remove('active'));
        tabBtn.classList.add('active');
      } else {
        document.querySelectorAll('.cat-tab-btn').forEach(btn => {
          const bCat = btn.getAttribute('data-cat');
          if (bCat === category) {
            document.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          }
        });
      }

      applyCatalogFilters();

      const catalogEl = document.getElementById('catalogo');
      if (catalogEl && !tabBtn) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
    window.filterCatalog = filterCatalog;`;

  if (oldFilterCatalogJs.test(html)) {
    html = html.replace(oldFilterCatalogJs, newIndexFilterCatalogJs);
  }

  fs.writeFileSync(indexHtmlPath, html, 'utf8');
  console.log(`[UPDATED INDEX.HTML WITH ALL 9 CATEGORIES] ${indexHtmlPath}`);
}

console.log('--- All sections and pages successfully updated with 9 categories ---');
