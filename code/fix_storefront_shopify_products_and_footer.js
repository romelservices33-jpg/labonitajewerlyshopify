const fs = require('fs');
const path = require('path');

const codeDir = __dirname;
const rootDir = path.resolve(__dirname, '..');

// 1. Update CSS: Fix Footer link colors, hide cart drawer by default, fix modal overlays
let css = fs.readFileSync(path.join(codeDir, 'assets', 'editorial-luxury.css'), 'utf8');

const cssAdditions = `
/* ==========================================================================
   SHOPIFY FIXES: LUXURY FOOTER & MODAL VISIBILITY GUARDS
   ========================================================================== */
.site-white-footer {
  background: #FAF9F6 !important;
  color: #475569 !important;
  border-top: 1px solid rgba(209, 176, 84, 0.25) !important;
  padding: 80px 40px 40px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  position: relative !important;
  z-index: 10 !important;
}

.site-white-footer a,
.footer-col-nav ul a,
.footer-contact-list a {
  color: #64748B !important;
  text-decoration: none !important;
  transition: color 0.2s ease !important;
}

.site-white-footer a:hover,
.footer-col-nav ul a:hover,
.footer-contact-list a:hover {
  color: #D1B054 !important;
}

.footer-col-brand h3,
.footer-col-nav h4 {
  color: #08195B !important;
  font-family: 'Fonda', 'Cormorant Garamond', Georgia, serif !important;
}

/* Cart Drawer and Modals Hidden by Default */
.cart-drawer-backdrop {
  display: none !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(8, 25, 91, 0.5) !important;
  backdrop-filter: blur(4px) !important;
  z-index: 99999 !important;
}

.cart-drawer-backdrop.open {
  display: block !important;
}

.cart-panel {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  width: 100% !important;
  max-width: 440px !important;
  height: 100% !important;
  background: #FFFFFF !important;
  z-index: 100000 !important;
  transform: translateX(100%) !important;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
  display: flex !important;
  flex-direction: column !important;
}

.cart-panel.open {
  transform: translateX(0) !important;
}

/* PDP Quick View Modal hidden by default */
.pdp-quick-modal-overlay {
  display: none !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(8, 25, 91, 0.55) !important;
  backdrop-filter: blur(6px) !important;
  z-index: 99999 !important;
  align-items: center !important;
  justify-content: center !important;
}

.pdp-quick-modal-overlay.active {
  display: flex !important;
}
`;

if (!css.includes('SHOPIFY FIXES: LUXURY FOOTER')) {
  css += '\n' + cssAdditions;
  fs.writeFileSync(path.join(codeDir, 'assets', 'editorial-luxury.css'), css, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'assets', 'editorial-luxury.css'), css, 'utf8');
  console.log('Updated editorial-luxury.css with footer and modal guards.');
}

// 2. Build sections/bonita-luxury-storefront.liquid with DYNAMIC Shopify Products loop
const liquidStorefront = `{{ 'editorial-luxury.css' | asset_url | stylesheet_tag }}

<div class="bonita-luxury-wrapper">

  <!-- TOP ANNOUNCEMENT MARQUEE -->
  <div class="top-announcement-bar" role="region" aria-label="Avisos importantes">
    <div class="top-marquee-track">
      <div class="top-marquee-group">
        <span class="top-marquee-item">
          <svg viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
          <span><strong>Envíos a todo EE. UU. y Puerto Rico</strong> con entrega asegurada</span>
        </span>
        <span class="top-marquee-star">✦</span>
        <span class="top-marquee-item">
          <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
          <span><strong>Oro 100% Auténtico</strong> 10K & 14K Garantizado</span>
        </span>
        <span class="top-marquee-star">✦</span>
        <span class="top-marquee-item">
          <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
          <span>Financiamiento flexible con <strong>Affirm</strong></span>
        </span>
        <span class="top-marquee-star">✦</span>
        <a href="tel:5025994250" class="top-marquee-item">
          <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <span>Atención: <strong>(502) 599-4250</strong></span>
        </a>
        <span class="top-marquee-star">✦</span>
      </div>
      <div class="top-marquee-group" aria-hidden="true">
        <span class="top-marquee-item">
          <svg viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
          <span><strong>Envíos a todo EE. UU. y Puerto Rico</strong> con entrega asegurada</span>
        </span>
        <span class="top-marquee-star">✦</span>
        <span class="top-marquee-item">
          <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
          <span><strong>Oro 100% Auténtico</strong> 10K & 14K Garantizado</span>
        </span>
        <span class="top-marquee-star">✦</span>
        <span class="top-marquee-item">
          <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
          <span>Financiamiento flexible con <strong>Affirm</strong></span>
        </span>
        <span class="top-marquee-star">✦</span>
        <a href="tel:5025994250" class="top-marquee-item">
          <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <span>Atención: <strong>(502) 599-4250</strong></span>
        </a>
        <span class="top-marquee-star">✦</span>
      </div>
    </div>
  </div>

  <!-- 1. DESKTOP FLOATING HEADER -->
  <header class="desktop-floating-header" role="banner" aria-label="Navegación principal">
    <a href="{{ routes.root_url }}" class="desktop-header-logo" title="La Bonita Jewelry">
      <img src="{{ 'logo-completo.svg' | asset_url }}" alt="La Bonita Jewelry">
    </a>

    <nav class="hero-floating-nav" aria-label="Navegación de colecciones">
      <ul class="hero-nav-track">
        <li><a href="#hero" class="hero-nav-link active">Inicio</a></li>
        <li><a href="#catalogo" class="hero-nav-link" onclick="filterCatalog('cadenas');">Cadenas</a></li>
        <li><a href="#catalogo" class="hero-nav-link" onclick="filterCatalog('anillos');">Anillos</a></li>
        <li><a href="#catalogo" class="hero-nav-link" onclick="filterCatalog('aretes');">Aretes</a></li>
        <li><a href="#catalogo" class="hero-nav-link" onclick="filterCatalog('pulseras');">Pulseras</a></li>
        <li><a href="#catalogo" class="hero-nav-link" onclick="filterCatalog('dijes');">Dijes</a></li>
        <li><a href="#contacto" class="hero-nav-link">Contacto</a></li>
      </ul>
    </nav>

    <div class="desktop-header-actions">
      <a href="https://wa.me/15025994250" target="_blank" rel="noopener" class="header-action-link" title="WhatsApp">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.06c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.13.82.83-3.05-.2-.31a8.13 8.13 0 01-1.25-4.28c0-4.51 3.67-8.17 8.18-8.17 2.18 0 4.24.85 5.78 2.39 1.54 1.54 2.39 3.6 2.39 5.78 0 4.51-3.67 8.16-8.18 8.16zm4.49-6.13c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.29z"/>
        </svg>
        <span>WhatsApp</span>
      </a>
      <span class="header-action-divider"></span>
      <a href="{{ routes.cart_url }}" class="header-action-btn" title="Carrito">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <span>Carrito ({{ cart.item_count }})</span>
      </a>
    </div>
  </header>

  <!-- 2. MOBILE TOP NOTCH (< 1024px) -->
  <div class="notch-mobile-island">
    <div class="notch-mobile-bar">
      <a href="{{ routes.root_url }}" title="La Bonita Jewelry">
        <img src="{{ 'logo-completo.svg' | asset_url }}" alt="La Bonita Jewelry" style="height:24px; width:auto;">
      </a>
      <a href="{{ routes.cart_url }}" class="notch-action-btn" style="padding:4px 6px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px; height:18px;">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      </a>
    </div>
  </div>

  <!-- 3. HERO SECTION -->
  <section class="macro-hero-section" id="hero">
    <video class="hero-bg-media" autoplay loop muted playsinline poster="{{ 'luxury-hero-poster.jpg' | asset_url }}">
      {%- if section.settings.hero_video_url != blank -%}
        <source src="{{ section.settings.hero_video_url }}" type="video/mp4">
      {%- endif -%}
      <img src="{{ 'luxury-hero-poster.jpg' | asset_url }}" alt="14K Gold Cuban chain on Carrara marble sculpture">
    </video>
    <div class="hero-gradient-overlay"></div>

    <div class="hero-content-wrap">
      <div class="mobile-top-brand">
        <a href="{{ routes.root_url }}">
          <img src="{{ 'logo-completo.svg' | asset_url }}" alt="La Bonita Jewelry">
        </a>
      </div>
      <h1 class="hero-main-headline">
        Brilla con Estilo, <span class="gold-highlight">Brilla con Oro</span>
      </h1>
      <p class="hero-supporting-copy">
        Descubre joyas auténticas en oro de 10K y 14K con financiamiento y envío asegurado a todos los Estados Unidos y Puerto Rico.
      </p>
      <div class="hero-cta-group">
        <a href="#catalogo" class="btn-pill-white">Ver Catálogo</a>
        <a href="#contacto" class="btn-pill-glass">Financiamiento Affirm</a>
      </div>
    </div>

    <!-- 4 SQUARE COLLECTION CARDS -->
    <div class="hero-overlapping-cards-wrap" id="colecciones">
      <div class="cat-slider-container">
        <div class="cat-slider-track" id="catSliderTrack">
          <a href="#catalogo" onclick="filterCatalog('cadenas');" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Cadenas</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="Cadenas de Oro" class="cat-square-img">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">Ver Colección →</span>
            </div>
          </a>

          <a href="#catalogo" onclick="filterCatalog('anillos');" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Anillos</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-anillos.jpg' | asset_url }}" alt="Anillos de Oro" class="cat-square-img">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">Ver Colección →</span>
            </div>
          </a>

          <a href="#catalogo" onclick="filterCatalog('aretes');" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Aretes</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-aretes.jpg' | asset_url }}" alt="Aretes de Oro" class="cat-square-img">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">Ver Colección →</span>
            </div>
          </a>

          <a href="#catalogo" onclick="filterCatalog('pulseras');" class="cat-square-card">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Pulseras</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-pulseras.jpg' | asset_url }}" alt="Pulseras de Oro" class="cat-square-img">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">Ver Colección →</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. DYNAMIC SHOPIFY PRODUCT CATALOG (CONECTADO AL INVENTARIO REAL) -->
  <section class="middle-split-section full-catalog-layout" id="catalogo">
    <div class="middle-split-inner">
      <div class="catalog-header-wrap">
        <h2 class="catalog-title">
          Catálogo <span class="accent-gold">Exclusivo de Oro</span>
        </h2>
        <p class="catalog-subtitle">
          Oro 100% auténtico 10K y 14K con peso garantizado y financiamiento Affirm disponible.
        </p>

        <nav class="catalog-category-tabs">
          <button class="cat-tab-btn active" onclick="filterCatalog('todos', this)">Todas</button>
          <button class="cat-tab-btn" onclick="filterCatalog('cadenas', this)">Cadenas</button>
          <button class="cat-tab-btn" onclick="filterCatalog('anillos', this)">Anillos</button>
          <button class="cat-tab-btn" onclick="filterCatalog('aretes', this)">Aretes</button>
          <button class="cat-tab-btn" onclick="filterCatalog('pulseras', this)">Pulseras</button>
          <button class="cat-tab-btn" onclick="filterCatalog('dijes', this)">Dijes & Medallas</button>
        </nav>
      </div>

      {%- assign current_collection = section.settings.collection | default: collections['all'] -%}

      <div class="catalog-products-grid" id="catalogProductsGrid">
        {%- if current_collection.products.size > 0 -%}
          {%- for product in current_collection.products limit: 24 -%}
            {%- assign category_tag = product.type | default: 'cadenas' | downcase -%}
            {%- assign karat_tag = '14k' -%}
            {%- if product.tags contains '10k' or product.title contains '10K' or product.title contains '10k' -%}
              {%- assign karat_tag = '10k' -%}
            {%- endif -%}

            <div class="product-shop-card cutout-product-card" data-category="{{ category_tag }}" data-karat="{{ karat_tag }}" data-price="{{ product.price | divided_by: 100 }}">
              <div class="cutout-card-media">
                <a href="{{ product.url }}">
                  {%- if product.featured_image != blank -%}
                    <img src="{{ product.featured_image | image_url: width: 700 }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
                  {%- else -%}
                    <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
                  {%- endif -%}
                </a>
                <div class="cutout-card-pin">
                  <span>{{ karat_tag | upcase }} ORO</span>
                </div>
              </div>

              <div class="cutout-card-details">
                <span class="cutout-card-tag">{{ product.vendor | default: 'LA BONITA JOYERÍA' }}</span>
                <h4 class="cutout-card-title">
                  <a href="{{ product.url }}" style="color: inherit; text-decoration: none;">{{ product.title }}</a>
                </h4>
                <div class="cutout-card-price-row">
                  <span class="price-current">{{ product.price | money }}</span>
                  {%- if product.compare_at_price > product.price -%}
                    <span class="price-original">{{ product.compare_at_price | money }}</span>
                  {%- endif -%}
                </div>
                
                <form method="post" action="/cart/add" style="margin-top: 12px;">
                  <input type="hidden" name="id" value="{{ product.variants.first.id }}">
                  <button type="submit" class="btn-card-buy" style="width: 100%; padding: 10px; background: #08195B; color: #FFFFFF; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Agregar a la Bolsa
                  </button>
                </form>
              </div>
            </div>
          {%- endfor -%}
        {%- else -%}
          <!-- Sample Demo Cards with Real Assets when no products exist yet -->
          <div class="product-shop-card cutout-product-card" data-category="cadenas" data-karat="14k" data-price="1620">
            <div class="cutout-card-media">
              <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="Cadena Franco Diamantada 14K" class="cutout-card-img">
              <div class="cutout-card-pin"><span>ORO 14K</span></div>
            </div>
            <div class="cutout-card-details">
              <span class="cutout-card-tag">CADENAS</span>
              <h4 class="cutout-card-title">Cadena Franco Diamantada 14K Sólida</h4>
              <div class="cutout-card-price-row"><span class="price-current">$1,620 USD</span></div>
            </div>
          </div>
          <div class="product-shop-card cutout-product-card" data-category="cadenas" data-karat="10k" data-price="1150">
            <div class="cutout-card-media">
              <img src="{{ 'category-cuban.jpg' | asset_url }}" alt="Cadena Cubana Miami 10K" class="cutout-card-img">
              <div class="cutout-card-pin"><span>ORO 10K</span></div>
            </div>
            <div class="cutout-card-details">
              <span class="cutout-card-tag">CADENAS CUBANAS</span>
              <h4 class="cutout-card-title">Miami Cuban Link 10K Eslabón Sólido</h4>
              <div class="cutout-card-price-row"><span class="price-current">$1,150 USD</span></div>
            </div>
          </div>
          <div class="product-shop-card cutout-product-card" data-category="anillos" data-karat="14k" data-price="890">
            <div class="cutout-card-media">
              <img src="{{ 'product-anillo-signet.jpg' | asset_url }}" alt="Anillo Signet Sello Imperial" class="cutout-card-img">
              <div class="cutout-card-pin"><span>ORO 14K</span></div>
            </div>
            <div class="cutout-card-details">
              <span class="cutout-card-tag">ANILLOS</span>
              <h4 class="cutout-card-title">Anillo Signet Sello Imperial 14K</h4>
              <div class="cutout-card-price-row"><span class="price-current">$890 USD</span></div>
            </div>
          </div>
          <div class="product-shop-card cutout-product-card" data-category="pulseras" data-karat="14k" data-price="1200">
            <div class="cutout-card-media">
              <img src="{{ 'product-pulseras-bangle.jpg' | asset_url }}" alt="Manillas Oro 14K Bangle Duo" class="cutout-card-img">
              <div class="cutout-card-pin"><span>ORO 14K</span></div>
            </div>
            <div class="cutout-card-details">
              <span class="cutout-card-tag">PULSERAS</span>
              <h4 class="cutout-card-title">Manillas Oro 14K Bangle Duo</h4>
              <div class="cutout-card-price-row"><span class="price-current">$1,200 USD</span></div>
            </div>
          </div>
        {%- endif -%}
      </div>
    </div>
  </section>

  <!-- 5. TRUST PILLARS -->
  <section class="trust-pillars-section">
    <div class="trust-pillars-inner">
      <div class="pillar-card">
        <div class="pillar-icon-box">✦</div>
        <div class="pillar-info">
          <h4>Oro 100% Auténtico</h4>
          <p>Piezas certificadas en oro de 10K y 14K con especificación exacta de peso en gramos.</p>
        </div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon-box">✈</div>
        <div class="pillar-info">
          <h4>Envíos Asegurados</h4>
          <p>Entrega rápida, discreta y asegurada directamente a tu puerta en todos los estados y Puerto Rico.</p>
        </div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon-box">💳</div>
        <div class="pillar-info">
          <h4>Financiamiento Affirm & Acima</h4>
          <p>Compra hoy y divide tus pagos en cuotas mensuales con opciones desde 0% APR.</p>
        </div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon-box">🛡</div>
        <div class="pillar-info">
          <h4>Garantía de Satisfacción</h4>
          <p>Atención personalizada vía WhatsApp y teléfono para tu total tranquilidad.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. LUXURY WHITE & GOLD FOOTER -->
  <footer class="site-white-footer" id="contacto">
    <div class="footer-main-grid">
      <div class="footer-col-brand">
        <img src="{{ 'logo-completo.svg' | asset_url }}" alt="La Bonita Jewelry" style="height: 48px; width: auto;">
        <h3>La Bonita Joyería</h3>
        <p>Creamos impresionantes joyas de oro que encarnan la elegancia, la calidad y el espíritu de sofisticación. Especialistas en cadenas cubanas, anillos, aretes y dijes de oro 10K y 14K.</p>
        <ul class="footer-contact-list" style="list-style: none; padding: 0; margin-top: 16px;">
          <li><a href="tel:5025994250">📞 +1 (502) 599-4250</a></li>
          <li><a href="mailto:romelservices33@gmail.com">✉ romelservices33@gmail.com</a></li>
          <li><a href="https://wa.me/15025994250" target="_blank" rel="noopener">💬 WhatsApp: +1 (502) 599-4250</a></li>
        </ul>
      </div>

      <div class="footer-col-nav">
        <h4>Colecciones</h4>
        <ul>
          <li><a href="#catalogo" onclick="filterCatalog('cadenas');">Cadenas de Oro</a></li>
          <li><a href="#catalogo" onclick="filterCatalog('anillos');">Anillos & Compromiso</a></li>
          <li><a href="#catalogo" onclick="filterCatalog('aretes');">Aretes</a></li>
          <li><a href="#catalogo" onclick="filterCatalog('pulseras');">Pulseras & Manillas</a></li>
          <li><a href="#catalogo" onclick="filterCatalog('dijes');">Dijes Clásicos</a></li>
        </ul>
      </div>

      <div class="footer-col-nav">
        <h4>Atención & Políticas</h4>
        <ul>
          <li><a href="#contacto">Contacto Directo</a></li>
          <li><a href="#contacto">Financiamiento Affirm</a></li>
          <li><a href="#contacto">Envíos EE. UU. & Puerto Rico</a></li>
          <li><a href="{{ routes.root_url }}">Garantía de Autenticidad</a></li>
        </ul>
      </div>

      <div class="footer-col-nav">
        <h4>Pagos Seguros & Financiamiento</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 12px;">Aceptamos las principales tarjetas de crédito, billeteras digitales y financiamiento transparente.</p>
        <div class="payment-methods-pills">
          <span class="pay-badge">AFFIRM</span>
          <span class="pay-badge">APPLE PAY</span>
          <span class="pay-badge">VISA</span>
          <span class="pay-badge">MASTERCARD</span>
          <span class="pay-badge">AMEX</span>
          <span class="pay-badge">PAYPAL</span>
        </div>
      </div>
    </div>

    <div class="footer-bottom-bar">
      <span>© {{ 'now' | date: "%Y" }} La Bonita Jewelry. Todos los derechos reservados. Oro 100% Auténtico 10K & 14K.</span>
      <span>Atención personalizada: (502) 599-4250</span>
    </div>
  </footer>

  <!-- MOBILE FLOATING BOTTOM DOCK (< 1024px) -->
  <nav class="mobile-floating-dock" aria-label="Navegación móvil">
    <a href="#hero" class="dock-item active">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
      <span>Inicio</span>
    </a>
    <a href="#colecciones" class="dock-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
      <span>Colecciones</span>
    </a>
    <a href="#catalogo" class="dock-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
      <span>Catálogo</span>
    </a>
    <a href="https://wa.me/15025994250" target="_blank" rel="noopener" class="dock-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      <span>WhatsApp</span>
    </a>
    <a href="{{ routes.cart_url }}" class="dock-item dock-cart-btn">
      <div class="dock-cart-icon-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>
        <span class="dock-badge">{{ cart.item_count }}</span>
      </div>
      <span>Carrito</span>
    </a>
  </nav>

</div>

<script>
  function filterCatalog(category, btn) {
    if (btn) {
      document.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    const cards = document.querySelectorAll('#catalogProductsGrid .cutout-product-card');
    cards.forEach(card => {
      const cat = card.getAttribute('data-category') || '';
      if (category === 'todos' || cat.includes(category)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
</script>

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
      "info": "Pega aquí el enlace copiado de Shopify Admin > Contenido > Archivos"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Colección de Productos de Shopify",
      "info": "Selecciona la colección de tu tienda para asociar los productos reales de tu inventario."
    }
  ]
}
{% endschema %}
`;

fs.writeFileSync(path.join(codeDir, 'sections', 'bonita-luxury-storefront.liquid'), liquidStorefront, 'utf8');
fs.writeFileSync(path.join(rootDir, 'sections', 'bonita-luxury-storefront.liquid'), liquidStorefront, 'utf8');

console.log('--- REBUILT NATIVE DYNAMIC STOREFRONT LIQUID WITH SHOPIFY CATALOG & CLEAN FOOTER ---');
