const fs = require('fs');
const path = require('path');

const rootDir = 'c:/TRABAJO/La Bonita Joyeria';

// 1. Update bonita-luxury-storefront.liquid in both sections/ and code/sections/
const storefrontFiles = [
  path.join(rootDir, 'sections', 'bonita-luxury-storefront.liquid'),
  path.join(rootDir, 'code', 'sections', 'bonita-luxury-storefront.liquid')
];

storefrontFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix Liquid categorization logic
  const oldLiquidPattern = /\{%- assign cat_tag = product\.type \| default: 'cadenas' \| downcase -%}[\s\S]*?\{%- assign karat_tag = '14k' -%}[\s\S]*?\{%- endif -%\}/;
  
  const newLiquidBlock = `{%- assign p_type = product.type | downcase -%}
            {%- assign p_title = product.title | downcase -%}
            {%- assign p_tags = product.tags | join: ',' | downcase -%}
            {%- assign cat_tag = 'cadenas' -%}
            {%- if p_type contains 'anillo' or p_title contains 'anillo' or p_tags contains 'anillo' or p_type contains 'ring' or p_title contains 'ring' -%}
              {%- assign cat_tag = 'anillos' -%}
            {%- elsif p_type contains 'arete' or p_title contains 'arete' or p_tags contains 'arete' or p_title contains 'arracada' or p_type contains 'arracada' or p_type contains 'earring' -%}
              {%- assign cat_tag = 'aretes' -%}
            {%- elsif p_type contains 'pulsera' or p_title contains 'pulsera' or p_tags contains 'pulsera' or p_title contains 'esclava' or p_title contains 'manilla' or p_title contains 'bangle' or p_type contains 'bracelet' -%}
              {%- assign cat_tag = 'pulseras' -%}
            {%- elsif p_type contains 'cuban' or p_title contains 'cuban' or p_tags contains 'cuban' or p_title contains 'miami' -%}
              {%- assign cat_tag = 'cuban' -%}
            {%- elsif p_type contains 'dije' or p_title contains 'dije' or p_tags contains 'dije' or p_title contains 'medalla' or p_title contains 'cruz' or p_title contains 'cristo' or p_type contains 'pendant' -%}
              {%- assign cat_tag = 'dijes' -%}
            {%- else -%}
              {%- assign cat_tag = 'cadenas' -%}
            {%- endif -%}
            {%- assign karat_tag = '14k' -%}
            {%- if p_tags contains '10k' or p_title contains '10k' or p_type contains '10k' -%}
              {%- assign karat_tag = '10k' -%}
            {%- endif -%}`;

  if (oldLiquidPattern.test(content)) {
    content = content.replace(oldLiquidPattern, newLiquidBlock);
    console.log(`[UPDATED LIQUID CATEGORIZATION] ${filePath}`);
  }

  // Fix JS getActiveFilteredCatalogCards & filterCatalog
  const oldJsPattern = /function getActiveFilteredCatalogCards\(\)[\s\S]*?window\.filterCatalog = filterCatalog;/;

  const newJsBlock = `function getActiveFilteredCatalogCards() {
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
          } else if (target === 'cadenas' && (cat.includes('cadena') || title.includes('cadena') || title.includes('collar') || title.includes('franco') || title.includes('soga') || title.includes('rope') || title.includes('figaro') || cat.includes('cuban') || title.includes('cuban'))) {
            matched = true;
          } else if (target === 'anillos' && (cat.includes('anillo') || title.includes('anillo') || title.includes('sello') || title.includes('solitario') || title.includes('ring'))) {
            matched = true;
          } else if (target === 'aretes' && (cat.includes('arete') || title.includes('arete') || title.includes('arracada') || title.includes('topos') || title.includes('earring'))) {
            matched = true;
          } else if (target === 'pulseras' && (cat.includes('pulsera') || title.includes('pulsera') || title.includes('manilla') || title.includes('esclava') || title.includes('bangle') || title.includes('bracelet'))) {
            matched = true;
          } else if (target === 'cuban' && (cat.includes('cuban') || title.includes('cuban') || title.includes('miami') || title.includes('eslabon'))) {
            matched = true;
          } else if (target === 'dijes' && (cat.includes('dije') || title.includes('dije') || title.includes('medalla') || title.includes('cruz') || title.includes('cristo') || title.includes('virgen') || title.includes('pendant'))) {
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
          countText.textContent = '0 piezas encontradas con los filtros seleccionados';
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

      // Dynamic Editorial Collection Banners
      var titleEl = document.getElementById('catalogTitle');
      var subtitleEl = document.getElementById('catalogSubtitle');
      if (titleEl && subtitleEl) {
        if (category === 'cadenas') {
          titleEl.innerHTML = 'Cadenas <span class="accent-gold">Cubanas & Italianas</span>';
          subtitleEl.textContent = 'Eslabones macizos fundidos a mano en oro auténtico 10K y 14K con broche de seguridad.';
        } else if (category === 'anillos') {
          titleEl.innerHTML = 'Anillos de <span class="accent-gold">Compromiso & Sello</span>';
          subtitleEl.textContent = 'Piezas forjadas con acabados de alta orfebrería y piedras engastadas a mano.';
        } else if (category === 'aretes') {
          titleEl.innerHTML = 'Aretes & <span class="accent-gold">Arracadas de Lujo</span>';
          subtitleEl.textContent = 'Diseños italianos ligeros y cómodos para uso diario en oro sólido garantizado.';
        } else if (category === 'pulseras') {
          titleEl.innerHTML = 'Pulseras & <span class="accent-gold">Bangles Exclusivos</span>';
          subtitleEl.textContent = 'Manillas y brazaletes pesados con cierre de caja reforzado y oro certificado.';
        } else if (category === 'cuban') {
          titleEl.innerHTML = 'Especialidad <span class="accent-gold">Cuban Links</span>';
          subtitleEl.textContent = 'Nuestra firma insignia: cadenas y manillas Miami Cuban macizas garantizadas.';
        } else if (category === 'dijes') {
          titleEl.innerHTML = 'Dijes & <span class="accent-gold">Medallas Sagradas</span>';
          subtitleEl.textContent = 'Cruces, Cristos y medallas talladas en relieve con brillo diamantado superior.';
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

  if (oldJsPattern.test(content)) {
    content = content.replace(oldJsPattern, newJsBlock);
    console.log(`[UPDATED JS FILTER CONTROLLER] ${filePath}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
});

// 2. Also update code/index.html to ensure 100% matching logic and functionality
const indexHtmlPath = path.join(rootDir, 'code', 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Ensure window.filterCatalog is exposed and filter functions are bulletproof
  const oldIndexJs = /function applyCatalogFilters\(\)[\s\S]*?function filterCatalog\(category, tabBtn\) \{[\s\S]*?catalogEl\.scrollIntoView\(\{ behavior: 'smooth' \}\);\s*\}\s*\}/;

  const newIndexJs = `function applyCatalogFilters() {
      const karatRadio = document.querySelector('input[name="filter-karat"]:checked');
      const karat = karatRadio ? karatRadio.value : 'all';

      const sizeRadio = document.querySelector('input[name="filter-size"]:checked');
      const size = sizeRadio ? sizeRadio.value : 'all';

      const weightEl = document.getElementById('filterWeight');
      const maxWeight = weightEl ? parseFloat(weightEl.value) : 70;

      const sortRadio = document.querySelector('input[name="filter-sort"]:checked');
      const sortBy = sortRadio ? sortRadio.value : 'default';

      const grid = document.getElementById('catalogProductsGrid');
      if (!grid) return;

      const cards = Array.from(grid.querySelectorAll('.cutout-product-card'));
      let visibleCount = 0;

      // 1. Filter cards
      cards.forEach(card => {
        const cCat = (card.getAttribute('data-category') || '').toLowerCase();
        const titleEl = card.querySelector('.cutout-product-title');
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        const cKarat = (card.getAttribute('data-karat') || '').toLowerCase();
        const cSize = (card.getAttribute('data-size') || '').toLowerCase();
        const cWeight = parseFloat(card.getAttribute('data-weight')) || 0;

        let matchCat = (currentCatalogCategory === 'todos');
        if (!matchCat) {
          const target = currentCatalogCategory.toLowerCase();
          if (cCat === target || cCat.indexOf(target) !== -1) {
            matchCat = true;
          } else if (target === 'cadenas' && (cCat.includes('cadena') || title.includes('cadena') || title.includes('collar') || title.includes('franco') || title.includes('soga') || title.includes('rope') || cCat.includes('cuban') || title.includes('cuban'))) {
            matchCat = true;
          } else if (target === 'anillos' && (cCat.includes('anillo') || title.includes('anillo') || title.includes('sello') || title.includes('solitario') || title.includes('ring'))) {
            matchCat = true;
          } else if (target === 'aretes' && (cCat.includes('arete') || title.includes('arete') || title.includes('arracada') || title.includes('topos') || title.includes('earring'))) {
            matchCat = true;
          } else if (target === 'pulseras' && (cCat.includes('pulsera') || title.includes('pulsera') || title.includes('manilla') || title.includes('esclava') || title.includes('bangle') || title.includes('bracelet'))) {
            matchCat = true;
          } else if (target === 'cuban' && (cCat.includes('cuban') || title.includes('cuban') || title.includes('miami') || title.includes('eslabon'))) {
            matchCat = true;
          } else if (target === 'dijes' && (cCat.includes('dije') || title.includes('dije') || title.includes('medalla') || title.includes('cruz') || title.includes('cristo') || title.includes('virgen') || title.includes('pendant'))) {
            matchCat = true;
          }
        }

        const matchKarat = (karat === 'all' || cKarat === karat || title.includes(karat.toUpperCase()));
        const matchSize = (size === 'all' || cSize.indexOf(size) !== -1 || title.includes(size));
        const matchWeight = (cWeight <= maxWeight);

        if (matchCat && matchKarat && matchSize && matchWeight) {
          card.classList.remove('is-filtered-out');
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.classList.add('is-filtered-out');
          card.style.display = 'none';
        }
      });

      // 2. Sort cards if needed
      if (sortBy !== 'default') {
        cards.sort((a, b) => {
          const aPrice = parseFloat(a.getAttribute('data-price')) || 0;
          const bPrice = parseFloat(b.getAttribute('data-price')) || 0;
          const aWeight = parseFloat(a.getAttribute('data-weight')) || 0;
          const bWeight = parseFloat(b.getAttribute('data-weight')) || 0;
          const aOrder = parseInt(a.getAttribute('data-default-order')) || 0;
          const bOrder = parseInt(b.getAttribute('data-default-order')) || 0;

          if (sortBy === 'price-asc') return aPrice - bPrice;
          if (sortBy === 'price-desc') return bPrice - aPrice;
          if (sortBy === 'weight-asc') return aWeight - bWeight;
          if (sortBy === 'weight-desc') return bWeight - aWeight;
          return aOrder - bOrder;
        });
      } else {
        cards.sort((a, b) => {
          const aOrder = parseInt(a.getAttribute('data-default-order')) || 0;
          const bOrder = parseInt(b.getAttribute('data-default-order')) || 0;
          return aOrder - bOrder;
        });
      }

      // Re-append sorted cards before empty state
      const emptyState = document.getElementById('catalogEmptyState');
      cards.forEach(card => {
        if (emptyState) {
          grid.insertBefore(card, emptyState);
        } else {
          grid.appendChild(card);
        }
      });

      // 3. Toggle empty state
      if (emptyState) {
        emptyState.style.display = (visibleCount === 0) ? 'flex' : 'none';
      }

      // 4. Update results counter
      const countEl = document.getElementById('filterCount');
      if (countEl) {
        if (visibleCount === 0) {
          countEl.textContent = '0 piezas encontradas';
        } else if (visibleCount === 1) {
          countEl.textContent = 'Mostrando 1 pieza de oro';
        } else {
          countEl.textContent = 'Mostrando ' + visibleCount + ' piezas de oro';
        }
      }

      // 5. Toggle reset button visibility
      const resetBtn = document.getElementById('btnFilterReset');
      if (resetBtn) {
        const isModified = (currentCatalogCategory !== 'todos') || (karat !== 'all') || (size !== 'all') || (maxWeight < 70) || (sortBy !== 'default');
        resetBtn.classList.toggle('active', isModified);
      }
    }

    function resetCatalogFilters() {
      currentCatalogCategory = 'todos';

      // Reset category tab active states
      document.querySelectorAll('.cat-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-cat') === 'todos');
      });

      // Reset Uiverse custom selects
      const kAll = document.getElementById('karat-all');
      if (kAll) kAll.checked = true;
      const kTxt = document.getElementById('selectedKaratText');
      if (kTxt) kTxt.textContent = 'Todas las purezas';

      const sAll = document.getElementById('size-all');
      if (sAll) sAll.checked = true;
      const sTxt = document.getElementById('selectedSizeText');
      if (sTxt) sTxt.textContent = 'Todas las medidas';

      const sortDef = document.getElementById('sort-default');
      if (sortDef) sortDef.checked = true;
      const sortTxt = document.getElementById('selectedSortText');
      if (sortTxt) sortTxt.textContent = 'Destacados La Bonita';

      const w = document.getElementById('filterWeight');
      if (w) {
        w.value = 70;
        updateWeightDisplay(70);
      }

      const titleEl = document.getElementById('catalogTitle');
      const subtitleEl = document.getElementById('catalogSubtitle');
      if (titleEl && subtitleEl) {
        titleEl.innerHTML = 'Catálogo <span class="accent-gold">Exclusivo</span>';
        subtitleEl.textContent = 'Oro 100% auténtico 10K y 14K con peso garantizado y financiamiento Affirm.';
      }

      applyCatalogFilters();
    }

    function filterCatalog(category, tabBtn) {
      currentCatalogCategory = category || 'todos';

      // Dynamic Editorial Collection Banners
      const titleEl = document.getElementById('catalogTitle');
      const subtitleEl = document.getElementById('catalogSubtitle');
      if (titleEl && subtitleEl) {
        if (category === 'cadenas') {
          titleEl.innerHTML = 'Cadenas <span class="accent-gold">Cubanas & Italianas</span>';
          subtitleEl.textContent = 'Eslabones macizos fundidos a mano en oro auténtico 10K y 14K con broche de seguridad.';
        } else if (category === 'anillos') {
          titleEl.innerHTML = 'Anillos de <span class="accent-gold">Compromiso & Sello</span>';
          subtitleEl.textContent = 'Piezas forjadas con acabados de alta orfebrería y piedras engastadas a mano.';
        } else if (category === 'aretes') {
          titleEl.innerHTML = 'Aretes & <span class="accent-gold">Arracadas de Lujo</span>';
          subtitleEl.textContent = 'Diseños italianos ligeros y cómodos para uso diario en oro sólido garantizado.';
        } else if (category === 'pulseras') {
          titleEl.innerHTML = 'Pulseras & <span class="accent-gold">Bangles Exclusivos</span>';
          subtitleEl.textContent = 'Manillas y brazaletes pesados con cierre de caja reforzado y oro certificado.';
        } else if (category === 'cuban') {
          titleEl.innerHTML = 'Especialidad <span class="accent-gold">Cuban Links</span>';
          subtitleEl.textContent = 'Nuestra firma insignia: cadenas y manillas Miami Cuban macizas garantizadas.';
        } else if (category === 'dijes') {
          titleEl.innerHTML = 'Dijes & <span class="accent-gold">Medallas Sagradas</span>';
          subtitleEl.textContent = 'Cruces, Cristos y medallas talladas en relieve con brillo diamantado superior.';
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

  if (oldIndexJs.test(indexHtml)) {
    indexHtml = indexHtml.replace(oldIndexJs, newIndexJs);
    console.log(`[UPDATED INDEX.HTML FILTER CONTROLLER] ${indexHtmlPath}`);
  }

  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
}

console.log('--- Filter fix script completed ---');
