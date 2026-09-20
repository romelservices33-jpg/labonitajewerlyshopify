const fs = require('fs');
const path = require('path');

console.log('=== UPDATING PRODUCT SPECS, FILTER METRICS & STORE HOURS ===');

// -------------------------------------------------------------
// 1. UPDATE QUICK VIEW MODAL (snippets/quick-view-modal.liquid)
// -------------------------------------------------------------
const modalFiles = [
  'snippets/quick-view-modal.liquid',
  'code/snippets/quick-view-modal.liquid'
];

const newQuickViewModalCode = `{% comment %}
  Renders a luxury Quick View PDP Modal for La Bonita Joyeria.
  Dynamically binds to real Shopify product inventory, karats, weights, and sizes.
{% endcomment %}

<div class="product-modal-backdrop" id="productModal" onclick="handleModalBackdropClick(event)">
  <div class="product-modal-panel" id="productModalPanel" role="dialog" aria-modal="true" aria-labelledby="modalProductTitle">
    <button class="modal-close-btn" onclick="closeProductModal()" aria-label="{{ 'accessibility.close' | t | default: 'Cerrar Ficha de Producto' }}">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <!-- Left Media Gallery (Full Bleed Seamless Edge-to-Edge) -->
    <div class="modal-media-col">
      <img id="modalMainImg" class="modal-main-img" src="" alt="Joya La Bonita" style="display:none;">
      <div id="modalMockPlaceholder" class="modal-mock-placeholder" style="display:flex;">
        <div class="mock-camera-icon-wrap">
          <svg class="mock-camera-svg" viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
            <circle cx="18" cy="10" r="1" fill="currentColor"/>
          </svg>
        </div>
        <span class="mock-camera-label" style="font-size:0.75rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--color-royal-navy, #08195B);">Oro Sólido Certificado</span>
      </div>
      <span class="modal-floating-gold-badge" id="modalBadge">Oro 100% Auténtico</span>
    </div>

    <!-- Right Details & Selectors -->
    <div class="modal-details-col">
      <div class="modal-header-meta">
        <span class="modal-category-tag" id="modalCategoryTag">COLECCIÓN LA BONITA</span>
        <span style="font-size:0.75rem; color:#059669; font-weight:700; display:inline-flex; align-items:center; gap:4px;">
          <span style="width:6px; height:6px; background:#059669; border-radius:50%; display:inline-block;"></span> En Stock · Envío Hoy
        </span>
      </div>

      <h2 class="modal-product-title" id="modalProductTitle">Joya de Oro La Bonita</h2>

      <div class="modal-price-row">
        <span class="modal-price-current" id="modalPriceCurrent">$575.00 USD</span>
        <span class="modal-price-old" id="modalPriceOld"></span>
        <span class="modal-gram-rate" id="modalGramRate">Oro Macizo</span>
      </div>

      <div class="modal-affirm-calc" id="modalAffirm">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
        <span>O paga desde <strong id="modalAffirmMo">$47/mes</strong> en cuotas con <strong>Affirm</strong></span>
      </div>

      <!-- Variant Selector: Pureza / Metal (Real registered karat only, or options if real variants exist) -->
      <div class="pdp-option-group" id="modalKaratGroup">
        <div class="pdp-option-label">
          <span>Pureza del Oro</span>
          <span class="opt-selected-val" id="modalSelectedKaratText">Oro Auténtico Garantizado</span>
        </div>
        <div class="pdp-pills-row" id="modalKaratPills">
          <!-- Populated dynamically: Only the actual registered karat badge is shown unless real multiple karat variants exist -->
        </div>
      </div>

      <!-- Variant Selector: Medida / Longitud / Talla -->
      <div class="pdp-option-group" id="modalSizeGroup">
        <div class="pdp-option-label">
          <span id="modalSizeLabel">Medida / Talla</span>
          <span class="opt-selected-val" id="modalSelectedSizeText">Estándar</span>
        </div>
        <div class="pdp-pills-row" id="modalSizePills"></div>
      </div>

      <!-- Goldsmith Specs Table (Binds directly to inventory characteristics) -->
      <table class="pdp-specs-table">
        <tbody>
          <tr>
            <td class="spec-name">Pureza de Metal</td>
            <td class="spec-val" id="modalSpecKarat">Oro Garantizado</td>
          </tr>
          <tr>
            <td class="spec-name">Peso Estimado</td>
            <td class="spec-val" id="modalSpecWeight">Oro Genuino Certificado</td>
          </tr>
          <tr>
            <td class="spec-name">Medida / Dimensión</td>
            <td class="spec-val" id="modalSpecSize">Estándar</td>
          </tr>
          <tr>
            <td class="spec-name">Cierre / Acabado</td>
            <td class="spec-val" id="modalSpecClasp">Caja con Doble Seguro de Presión</td>
          </tr>
          <tr>
            <td class="spec-name">Garantía Oficial</td>
            <td class="spec-val" style="color:#D1B054;">Certificado de Autenticidad de por Vida</td>
          </tr>
        </tbody>
      </table>

      <!-- Actions -->
      <div class="modal-actions-row">
        <div class="pdp-qty-wrap">
          <button type="button" class="pdp-qty-btn" onclick="changeModalQty(-1)" aria-label="Disminuir cantidad">-</button>
          <input type="text" class="pdp-qty-input" id="modalQtyInput" value="1" readonly aria-label="Cantidad">
          <button type="button" class="pdp-qty-btn" onclick="changeModalQty(1)" aria-label="Aumentar cantidad">+</button>
        </div>
        <button type="button" class="pdp-btn-add-cart" id="modalAddToCartBtn" onclick="addModalProductToCart()">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span>Agregar al Carrito</span>
        </button>
      </div>

      <div class="modal-trust-row">
        <span class="modal-trust-item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Oro 100% Genuino</span>
        </span>
        <span class="modal-trust-item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          <span>Envío Asegurado Gratis</span>
        </span>
        <span class="modal-trust-item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>Pago Seguro Cifrado</span>
        </span>
      </div>
    </div>
  </div>
</div>

<script>
  /* Intelligent Jewelry Characteristics Parser */
  function parseJewelrySpecs(title, productType) {
    title = title || '';
    var lowerTitle = title.toLowerCase();
    var lowerType = (productType || '').toLowerCase();

    var isRing = lowerTitle.indexOf('anillo') !== -1 || lowerType.indexOf('anillo') !== -1;
    var isChain = lowerTitle.indexOf('cadena') !== -1 || lowerTitle.indexOf('collar') !== -1 || lowerTitle.indexOf('cuban') !== -1;
    var isBracelet = lowerTitle.indexOf('pulsera') !== -1 || lowerTitle.indexOf('esclava') !== -1 || lowerTitle.indexOf('brazalete') !== -1;
    var isEarring = lowerTitle.indexOf('arete') !== -1 || lowerTitle.indexOf('arracada') !== -1 || lowerTitle.indexOf('topo') !== -1;
    var isPendant = lowerTitle.indexOf('dije') !== -1 || lowerTitle.indexOf('medalla') !== -1 || lowerTitle.indexOf('cruz') !== -1;

    // Karat detection from title
    var karat = null;
    if (/\\b10k\\b/i.test(title)) karat = '10k';
    else if (/\\b14k\\b/i.test(title)) karat = '14k';

    // Strip karat out before extracting numbers
    var clean = title.replace(/\\b10k\\b|\\b14k\\b/gi, ' ');
    var numMatches = clean.match(/\\b\\d+(?:\\.\\d+)?(?:g|gr|gramos)?\\b/gi) || [];

    var weight = null;
    var size = null;

    for (var i = 0; i < numMatches.length; i++) {
      if (/g|gr|gramos/i.test(numMatches[i])) {
        weight = parseFloat(numMatches[i]);
      }
    }

    var remaining = [];
    for (var j = 0; j < numMatches.length; j++) {
      var n = parseFloat(numMatches[j]);
      if (!isNaN(n) && n !== weight) {
        remaining.push(n);
      }
    }

    if (isRing) {
      if (remaining.length >= 2) {
        // e.g. Anillo Hollow 10K 6.5 3.86 -> remaining is [6.5, 3.86]
        if (remaining[0] >= 3.5 && remaining[0] <= 14) {
          size = 'Talla ' + remaining[0];
          weight = weight || remaining[1];
        } else {
          weight = weight || remaining[0];
          size = 'Talla ' + remaining[1];
        }
      } else if (remaining.length === 1) {
        if (remaining[0] >= 4 && remaining[0] <= 14 && !weight) {
          size = 'Talla ' + remaining[0];
        } else {
          weight = weight || remaining[0];
        }
      }
    } else if (isChain) {
      if (remaining.length >= 2) {
        var len = null;
        for (var k = 0; k < remaining.length; k++) {
          var r = Math.round(remaining[k]);
          if ([16, 18, 20, 22, 24, 26, 28, 30].indexOf(r) !== -1) {
            len = remaining[k];
            break;
          }
        }
        if (len) {
          size = len + '" (' + Math.round(len * 2.54) + ' cm)';
          for (var l = 0; l < remaining.length; l++) {
            if (remaining[l] !== len) {
              weight = weight || remaining[l];
            }
          }
        } else {
          size = remaining[0] + '"';
          weight = weight || remaining[1];
        }
      } else if (remaining.length === 1) {
        var r1 = Math.round(remaining[0]);
        if ([16, 18, 20, 22, 24, 26, 28, 30].indexOf(r1) !== -1) {
          size = remaining[0] + '" (' + Math.round(remaining[0] * 2.54) + ' cm)';
        } else {
          weight = weight || remaining[0];
        }
      }
    } else if (isBracelet) {
      if (remaining.length >= 2) {
        size = remaining[0] + '"';
        weight = weight || remaining[1];
      } else if (remaining.length === 1) {
        if (remaining[0] >= 6 && remaining[0] <= 10) {
          size = remaining[0] + '"';
        } else {
          weight = weight || remaining[0];
        }
      }
    } else {
      if (remaining.length >= 2) {
        size = remaining[0] + ' mm';
        weight = weight || remaining[1];
      } else if (remaining.length === 1) {
        weight = weight || remaining[0];
      }
    }

    return { karat: karat, size: size, weight: weight };
  }

  var currentModalProduct = null;

  function openProductModalFromCard(card) {
    if (!card) return;
    var titleEl = card.querySelector('.cutout-product-title');
    var imgEl = card.querySelector('.cutout-card-img') || card.querySelector('img');
    var badgeEl = card.querySelector('.cutout-card-pin span');
    var priceEl = card.querySelector('.price-now');

    var title = titleEl ? titleEl.textContent.trim() : 'Joya de Oro La Bonita';
    var category = (card.getAttribute('data-category') || 'joyas').toLowerCase();

    // Parse real characteristics from the product title
    var parsed = parseJewelrySpecs(title, category);

    var karat = card.getAttribute('data-karat') || '';
    if (parsed.karat) {
      karat = parsed.karat;
    } else if (!karat || karat === 'all') {
      karat = '14k';
    }
    karat = karat.toLowerCase();

    var price = parseFloat(card.getAttribute('data-price')) || (priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 500);

    // Dynamic weight from inventory or title (never hardcode 15g)
    var rawWeightAttr = card.getAttribute('data-weight');
    var weight = null;
    if (rawWeightAttr && rawWeightAttr !== '15.0' && parseFloat(rawWeightAttr) > 0) {
      weight = parseFloat(rawWeightAttr);
    } else if (parsed.weight) {
      weight = parsed.weight;
    }

    // Dynamic size from inventory or title (never hardcode 24 for rings)
    var rawSizeAttr = card.getAttribute('data-size');
    var size = null;
    if (rawSizeAttr && rawSizeAttr !== '24' && rawSizeAttr.trim() !== '') {
      size = rawSizeAttr.trim();
    } else if (parsed.size) {
      size = parsed.size;
    } else {
      size = 'Estándar';
    }

    var variantId = card.getAttribute('data-variant-id') || null;
    var imgSrc = imgEl ? imgEl.getAttribute('src') : null;
    var badge = 'Oro ' + karat.toUpperCase() + ' Sólido';

    currentModalProduct = {
      title: title,
      category: category,
      baseKarat: karat,
      selectedKarat: karat,
      basePrice: price,
      baseWeight: weight,
      baseSize: size,
      selectedSize: size,
      qty: 1,
      imgSrc: imgSrc,
      badge: badge,
      variantId: variantId,
      hasMultipleKaratVariants: false
    };

    populateProductModalUI();

    var modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeProductModal() {
    var modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function handleModalBackdropClick(e) {
    if (e.target.id === 'productModal') {
      closeProductModal();
    }
  }

  function populateProductModalUI() {
    if (!currentModalProduct) return;
    var p = currentModalProduct;

    // Image
    var imgEl = document.getElementById('modalMainImg');
    var placeholderEl = document.getElementById('modalMockPlaceholder');
    var badgeEl = document.getElementById('modalBadge');

    if (p.imgSrc && !p.imgSrc.includes('mock')) {
      if (imgEl) {
        imgEl.src = p.imgSrc;
        imgEl.alt = p.title;
        imgEl.style.display = 'block';
      }
      if (placeholderEl) placeholderEl.style.display = 'none';
    } else {
      if (imgEl) imgEl.style.display = 'none';
      if (placeholderEl) placeholderEl.style.display = 'flex';
    }

    if (badgeEl) badgeEl.textContent = 'Oro ' + p.selectedKarat.toUpperCase() + ' Sólido';

    // Title & Meta
    var catTag = document.getElementById('modalCategoryTag');
    if (catTag) catTag.textContent = 'COLECCIÓN ' + p.category.toUpperCase() + ' · LA BONITA';

    var titleEl = document.getElementById('modalProductTitle');
    if (titleEl) titleEl.textContent = p.title;

    // Pricing
    var priceCurrentEl = document.getElementById('modalPriceCurrent');
    if (priceCurrentEl) {
      priceCurrentEl.textContent = '$' + p.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
    }

    var gramRateEl = document.getElementById('modalGramRate');
    if (gramRateEl) {
      gramRateEl.textContent = 'Oro ' + p.selectedKarat.toUpperCase() + ' Macizo';
    }

    var affirmMoEl = document.getElementById('modalAffirmMo');
    if (affirmMoEl) {
      var mo = Math.max(35, Math.round(p.basePrice / 12));
      affirmMoEl.textContent = '$' + mo + '/mes';
    }

    // Karat Selector (Shows only the real registered karat)
    var karatPillsContainer = document.getElementById('modalKaratPills');
    var karatText = document.getElementById('modalSelectedKaratText');
    if (karatPillsContainer) {
      karatPillsContainer.innerHTML = '';
      if (p.hasMultipleKaratVariants) {
        var btn10 = document.createElement('button');
        btn10.type = 'button';
        btn10.className = 'pdp-variant-pill' + (p.selectedKarat === '10k' ? ' active' : '');
        btn10.textContent = 'Oro 10K';
        btn10.onclick = function() { selectModalKarat('10k'); };
        karatPillsContainer.appendChild(btn10);

        var btn14 = document.createElement('button');
        btn14.type = 'button';
        btn14.className = 'pdp-variant-pill' + (p.selectedKarat === '14k' ? ' active' : '');
        btn14.textContent = 'Oro 14K';
        btn14.onclick = function() { selectModalKarat('14k'); };
        karatPillsContainer.appendChild(btn14);
      } else {
        var singlePill = document.createElement('span');
        singlePill.className = 'pdp-variant-pill active';
        singlePill.style.cursor = 'default';
        singlePill.style.pointerEvents = 'none';
        singlePill.textContent = 'Oro ' + p.selectedKarat.toUpperCase() + ' Auténtico';
        karatPillsContainer.appendChild(singlePill);
      }
    }
    if (karatText) {
      karatText.textContent = 'Oro ' + p.selectedKarat.toUpperCase() + ' Sólido Garantizado';
    }

    // Size Selector
    var sizePillsContainer = document.getElementById('modalSizePills');
    var sizeText = document.getElementById('modalSelectedSizeText');
    var sizeLabel = document.getElementById('modalSizeLabel');
    if (sizeText) {
      sizeText.textContent = p.selectedSize || 'Estándar';
    }
    if (sizeLabel) {
      if (p.category === 'anillos') sizeLabel.textContent = 'Talla de Anillo';
      else if (p.category === 'cadenas') sizeLabel.textContent = 'Largo de Cadena';
      else if (p.category === 'pulseras') sizeLabel.textContent = 'Largo de Pulsera';
      else sizeLabel.textContent = 'Medida / Dimensión';
    }
    if (sizePillsContainer) {
      sizePillsContainer.innerHTML = '';
      if (p.selectedSize && p.selectedSize !== 'Estándar') {
        var sizePill = document.createElement('span');
        sizePill.className = 'pdp-variant-pill active';
        sizePill.style.cursor = 'default';
        sizePill.style.pointerEvents = 'none';
        sizePill.textContent = p.selectedSize;
        sizePillsContainer.appendChild(sizePill);
      } else {
        var defPill = document.createElement('span');
        defPill.className = 'pdp-variant-pill active';
        defPill.style.cursor = 'default';
        defPill.style.pointerEvents = 'none';
        defPill.textContent = 'Medida Estándar / Ajustable';
        sizePillsContainer.appendChild(defPill);
      }
    }

    // Specs Table
    var specKarat = document.getElementById('modalSpecKarat');
    if (specKarat) specKarat.textContent = 'Oro ' + p.selectedKarat.toUpperCase() + ' Sólido Garantizado';

    var specWeight = document.getElementById('modalSpecWeight');
    if (specWeight) {
      if (p.baseWeight && p.baseWeight > 0) {
        specWeight.textContent = p.baseWeight + ' g';
      } else {
        specWeight.textContent = 'Oro Genuino Certificado';
      }
    }

    var specSize = document.getElementById('modalSpecSize');
    if (specSize) {
      specSize.textContent = p.selectedSize || 'Estándar / Ajustable';
    }

    // Reset Qty
    var qtyInput = document.getElementById('modalQtyInput');
    if (qtyInput) qtyInput.value = '1';
  }

  function selectModalKarat(k) {
    if (!currentModalProduct) return;
    currentModalProduct.selectedKarat = k;
    populateProductModalUI();
  }

  function changeModalQty(delta) {
    var input = document.getElementById('modalQtyInput');
    if (!input) return;
    var val = parseInt(input.value) || 1;
    var next = Math.max(1, Math.min(10, val + delta));
    input.value = next;
    if (currentModalProduct) currentModalProduct.qty = next;
  }

  function addModalProductToCart() {
    if (!currentModalProduct) return;
    var p = currentModalProduct;
    var btn = document.getElementById('modalAddToCartBtn');
    var qtyInput = document.getElementById('modalQtyInput');
    var qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
    var variantId = p.variantId;

    if (!variantId) {
      window.location.href = '/collections/all';
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Agregando...</span>';
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: parseInt(variantId), quantity: qty })
    })
    .then(function(res) {
      if (!res.ok) throw new Error('Add to cart failed');
      return res.json();
    })
    .then(function(item) {
      if (btn) {
        btn.innerHTML = '<span>✓ ¡Agregado con Éxito!</span>';
        btn.style.background = '#059669';
      }
      setTimeout(function() {
        closeProductModal();
        if (typeof window.openCartDrawer === 'function') {
          window.openCartDrawer();
        } else {
          window.location.href = '/cart';
        }
      }, 700);
    })
    .catch(function(err) {
      console.warn('Direct add to cart fallback:', err);
      window.location.href = '/cart/add?id=' + variantId + '&quantity=' + qty;
    });
  }
</script>
`;

modalFiles.forEach(f => {
  if (fs.existsSync(f)) {
    fs.writeFileSync(f, newQuickViewModalCode, 'utf8');
    console.log('Updated quick view modal in:', f);
  }
});

// -------------------------------------------------------------
// 2. REMOVE "PESO MÁXIMO" SLIDER & HARDCODED 15g/24 IN STOREFRONT
// -------------------------------------------------------------
const storefrontFiles = [
  'sections/bonita-luxury-storefront.liquid',
  'code/sections/bonita-luxury-storefront.liquid'
];

storefrontFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');

    // A. Remove "PESO MÁXIMO" slider block
    c = c.replace(/<!-- Slider Gramaje a Todo el Ancho -->[\s\S]*?<\/div>\s*<\/div>/m, '');
    c = c.replace(/<div class="filter-range-fullwidth">[\s\S]*?<\/div>\s*<\/div>/m, '');

    // B. Replace hardcoded data-weight="15.0" data-size="24" with dynamic calculations
    // We replace the loop definitions
    c = c.replace(/data-weight="15\.0"\s+data-size="24"/g, 'data-weight="{{ product_weight }}" data-size="{{ product_size | escape }}"');

    // Make sure product_weight and product_size are assigned before the card in loops
    const weightCalcBlock = `{%- assign product_weight = '' -%}
          {%- if product.variants.first.weight > 0 -%}
            {%- assign raw_w = product.variants.first.weight | divided_by: 1.0 -%}
            {%- if raw_w > 500 -%}{%- assign raw_w = raw_w | divided_by: 1000.0 -%}{%- endif -%}
            {%- assign product_weight = raw_w -%}
          {%- endif -%}
          {%- assign product_size = '' -%}
          {%- for opt in product.options_with_values -%}
            {%- assign opt_name = opt.name | downcase -%}
            {%- if opt_name contains 'talla' or opt_name contains 'size' or opt_name contains 'medida' or opt_name contains 'largo' or opt_name contains 'longitud' -%}
              {%- assign product_size = opt.values.first -%}
            {%- endif -%}
          {%- endfor -%}
          {%- if product_size == blank and product.variants.first.title != 'Default Title' -%}
            {%- assign product_size = product.variants.first.title -%}
          {%- endif -%}`;

    // Add weightCalcBlock right after monthly_affirm assignment in storefront loops
    c = c.replace(
      /(\{%- if monthly_affirm < 20 -%\}\{%- assign monthly_affirm = 20 -%\}\{%- endif -%\})/g,
      `$1\n          ${weightCalcBlock}`
    );

    // C. Update Horarios in Boutique / Map section
    c = c.replace(
      /<span style="color: #64748B; font-weight: 500;">Lunes a Viernes<\/span>[\s\S]*?<span style="font-weight: 700; color: #D1B054;">Citas VIP Privadas \/ Online 24\/7<\/span>\s*<\/div>/m,
      `<div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1px solid rgba(8, 25, 91, 0.05);">
                  <span style="color: #64748B; font-weight: 500;">Lunes</span>
                  <span style="font-weight: 700; color: #08195B;">12:00 PM – 7:00 PM</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1px solid rgba(8, 25, 91, 0.05);">
                  <span style="color: #64748B; font-weight: 500;">Martes a Sábado</span>
                  <span style="font-weight: 700; color: #08195B;">10:00 AM – 7:00 PM</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 2px;">
                  <span style="color: #64748B; font-weight: 500;">Domingos</span>
                  <span style="font-weight: 700; color: #08195B;">10:00 AM – 6:00 PM</span>
                </div>`
    );

    // D. Remove weight filter condition in JS: if (weight > activeMaxWeight) return false;
    c = c.replace(/if\s*\(\s*weight\s*>\s*activeMaxWeight\s*\)\s*return\s+false;?/g, '// weight filter removed');

    // E. Remove w & wv from resetCatalogFilters
    c = c.replace(/var w = document\.getElementById\('filterWeight'\);[\s\S]*?if \(wv\) wv\.textContent = 'Hasta: 70\.0 g';/m, '');

    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated storefront file:', f);
  }
});

// -------------------------------------------------------------
// 3. UPDATE FOOTER STORE HOURS (sections/bonita-luxury-footer.liquid)
// -------------------------------------------------------------
const footerFiles = [
  'sections/bonita-luxury-footer.liquid',
  'code/sections/bonita-luxury-footer.liquid'
];

footerFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');

    c = c.replace(
      /<strong>Horario VIP:<\/strong>\s*<span>Lun - Sáb: 10:00 AM - 8:00 PM EST<\/span>/g,
      '<strong>Horario de Atención:</strong>\n              <span>Lun: 12:00 PM – 7:00 PM · Mar - Sáb: 10:00 AM – 7:00 PM · Dom: 10:00 AM – 6:00 PM</span>'
    );

    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated footer hours in:', f);
  }
});

// -------------------------------------------------------------
// 4. UPDATE COLLECTION TEMPLATE (sections/bonita-luxury-collection.liquid)
// -------------------------------------------------------------
const collectionFiles = [
  'sections/bonita-luxury-collection.liquid',
  'code/sections/bonita-luxury-collection.liquid'
];

collectionFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');

    c = c.replace(/data-weight="15\.0"\s+data-size="24"/g, 'data-weight="{{ product_weight }}" data-size="{{ product_size | escape }}"');

    const weightCalcBlock = `{%- assign product_weight = '' -%}
        {%- if product.variants.first.weight > 0 -%}
          {%- assign raw_w = product.variants.first.weight | divided_by: 1.0 -%}
          {%- if raw_w > 500 -%}{%- assign raw_w = raw_w | divided_by: 1000.0 -%}{%- endif -%}
          {%- assign product_weight = raw_w -%}
        {%- endif -%}
        {%- assign product_size = '' -%}
        {%- for opt in product.options_with_values -%}
          {%- assign opt_name = opt.name | downcase -%}
          {%- if opt_name contains 'talla' or opt_name contains 'size' or opt_name contains 'medida' or opt_name contains 'largo' or opt_name contains 'longitud' -%}
            {%- assign product_size = opt.values.first -%}
          {%- endif -%}
        {%- endfor -%}
        {%- if product_size == blank and product.variants.first.title != 'Default Title' -%}
          {%- assign product_size = product.variants.first.title -%}
        {%- endif -%}`;

    c = c.replace(
      /(\{%- if monthly_affirm < 20 -%\}\{%- assign monthly_affirm = 20 -%\}\{%- endif -%\})/g,
      `$1\n        ${weightCalcBlock}`
    );

    // Remove weight filter condition in JS: if (weight > activeCollectionWeight) return false;
    c = c.replace(/if\s*\(\s*weight\s*>\s*activeCollectionWeight\s*\)\s*return\s+false;?/g, '// weight filter removed');

    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated collection file:', f);
  }
});

// -------------------------------------------------------------
// 5. UPDATE PDP SINGLE PRODUCT PAGE (sections/bonita-luxury-product.liquid)
// -------------------------------------------------------------
const pdpFiles = [
  'sections/bonita-luxury-product.liquid',
  'code/sections/bonita-luxury-product.liquid'
];

pdpFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');

    // Add real weight calculation into pdpSpecWeight and size into pdpSpecSize
    const scriptInsert = `
<script>
  (function() {
    // Parse specs from title
    var title = {{ product.title | json }} || '';
    var type = {{ product.type | json }} || '';
    var rawWeight = {{ selected_variant.weight | default: 0 }};
    var weightEl = document.getElementById('pdpSpecWeight');
    var sizeEl = document.getElementById('pdpSpecSize');
    
    // Check if title has specs e.g. Anillo Hollow 10K 6.5 3.86
    var clean = title.replace(/\\b10k\\b|\\b14k\\b/gi, ' ');
    var numMatches = clean.match(/\\b\\d+(?:\\.\\d+)?(?:g|gr|gramos)?\\b/gi) || [];
    var weight = null;
    var size = null;

    for (var i = 0; i < numMatches.length; i++) {
      if (/g|gr|gramos/i.test(numMatches[i])) {
        weight = parseFloat(numMatches[i]);
      }
    }
    var remaining = [];
    for (var j = 0; j < numMatches.length; j++) {
      var n = parseFloat(numMatches[j]);
      if (!isNaN(n) && n !== weight) remaining.push(n);
    }
    
    var isRing = title.toLowerCase().indexOf('anillo') !== -1 || type.toLowerCase().indexOf('anillo') !== -1;
    if (isRing && remaining.length >= 2) {
      if (remaining[0] >= 3.5 && remaining[0] <= 14) {
        size = 'Talla ' + remaining[0];
        weight = weight || remaining[1];
      } else {
        weight = weight || remaining[0];
        size = 'Talla ' + remaining[1];
      }
    } else if (remaining.length >= 2) {
      size = remaining[0] + '"';
      weight = weight || remaining[1];
    } else if (remaining.length === 1) {
      weight = weight || remaining[0];
    }

    if (rawWeight > 0) {
      var w = rawWeight > 500 ? (rawWeight / 1000).toFixed(2) : rawWeight;
      if (weightEl) weightEl.textContent = w + ' g';
    } else if (weight && weightEl) {
      weightEl.textContent = weight + ' g';
    }

    if (size && sizeEl && (sizeEl.textContent.indexOf('Default') !== -1 || sizeEl.textContent.trim() === 'Estándar')) {
      sizeEl.textContent = size;
    }
  })();
</script>
`;

    if (!c.includes('pdpSpecWeight') || !c.includes('var rawWeight =')) {
      c = c.replace('{% schema %}', `${scriptInsert}\n{% schema %}`);
      fs.writeFileSync(f, c, 'utf8');
      console.log('Updated PDP file with dynamic specs:', f);
    }
  }
});

console.log('ALL FILES UPDATED SUCCESSFULLY.');
