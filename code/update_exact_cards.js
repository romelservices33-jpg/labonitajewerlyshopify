const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const generatorPath = path.join(__dirname, 'generate_storefront_liquid.js');

let generatorCode = fs.readFileSync(generatorPath, 'utf8');

// 1. Vitrine 1: Más Vendidos
const vitrineMasVendidosReplacement = `  <section class="editorial-vitrine-section" id="mas-vendidos" style="background:#FAF9F6; border-bottom:1px solid rgba(209,176,84,0.18);">
    <div class="editorial-vitrine-header">
      <div>
        <span class="editorial-vitrine-kicker">✦ Piezas Favoritas de Nuestros Clientes ✦</span>
        <h2 class="editorial-vitrine-title">Más Vendidos en Oro 10K & 14K</h2>
      </div>
      <a href="/collections/all" style="font-family:'Plus Jakarta Sans', sans-serif; font-size:0.85rem; font-weight:700; color:#D1B054; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
        <span>Ver todas las piezas</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>

    <div class="editorial-vitrine-grid">
      <!-- Best Seller 1 -->
      <div class="product-shop-card cutout-product-card" data-category="cuban" data-karat="14k" data-price="4850" data-weight="64.2" data-size="22" onclick="openProductModalFromCard(this)" style="position:relative;">
        <span class="badge-gold-bestseller">✦ Top #1 Más Vendida</span>
        <div class="cutout-card-media">
          <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="Cadena Cuban Miami Solid 14K" class="cutout-card-img" loading="lazy">
          <div class="cutout-card-pin">
            <span>14K ORO</span>
            <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
          </div>
          <div class="cutout-card-inset-label">
            <span class="cutout-label-text">Cuban Link</span>
            <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
          </div>
        </div>
        <div class="cutout-card-content">
          <div class="cutout-title-row">
            <h4 class="cutout-product-title">Cadena Cuban Miami Solid 14K</h4>
          </div>
          <div class="product-card-pricing-row">
            <div class="pricing-amounts">
              <div class="pricing-numbers-row">
                <span class="price-now">$4,850</span>
                <span class="price-was">$5,400</span>
              </div>
              <div class="affirm-monthly-badge">Oro 100% Auténtico Garantizado</div>
            </div>
            <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Best Seller 2 -->
      <div class="product-shop-card cutout-product-card" data-category="anillos" data-karat="10k" data-price="680" data-weight="7.9" data-size="talla-10" onclick="openProductModalFromCard(this)" style="position:relative;">
        <span class="badge-gold-bestseller">✦ Más Vendido</span>
        <div class="cutout-card-media">
          <img src="{{ 'collection-anillos.jpg' | asset_url }}" alt="Anillo Sello Clásico Cuadrado 10K" class="cutout-card-img" loading="lazy">
          <div class="cutout-card-pin">
            <span>10K ORO</span>
            <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
          </div>
          <div class="cutout-card-inset-label">
            <span class="cutout-label-text">Anillos</span>
            <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
          </div>
        </div>
        <div class="cutout-card-content">
          <div class="cutout-title-row">
            <h4 class="cutout-product-title">Anillo Sello Clásico Cuadrado 10K</h4>
          </div>
          <div class="product-card-pricing-row">
            <div class="pricing-amounts">
              <div class="pricing-numbers-row">
                <span class="price-now">$680</span>
                <span class="price-was">$760</span>
              </div>
              <div class="affirm-monthly-badge">Oro 100% Auténtico Garantizado</div>
            </div>
            <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Best Seller 3 -->
      <div class="product-shop-card cutout-product-card" data-category="aretes" data-karat="14k" data-price="460" data-weight="4.1" data-size="30mm arete-dije" onclick="openProductModalFromCard(this)" style="position:relative;">
        <span class="badge-gold-bestseller">✦ Más Vendido</span>
        <div class="cutout-card-media">
          <img src="{{ 'product-aretes-profile.jpg' | asset_url }}" alt="Arracadas Tubulares 14K" class="cutout-card-img" loading="lazy">
          <div class="cutout-card-pin">
            <span>14K ORO</span>
            <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
          </div>
          <div class="cutout-card-inset-label">
            <span class="cutout-label-text">Aretes</span>
            <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
          </div>
        </div>
        <div class="cutout-card-content">
          <div class="cutout-title-row">
            <h4 class="cutout-product-title">Arracadas Tubulares Gruesas 14K</h4>
          </div>
          <div class="product-card-pricing-row">
            <div class="pricing-amounts">
              <div class="pricing-numbers-row">
                <span class="price-now">$460</span>
                <span class="price-was">$520</span>
              </div>
              <div class="affirm-monthly-badge">Oro 100% Auténtico Garantizado</div>
            </div>
            <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Best Seller 4 -->
      <div class="product-shop-card cutout-product-card" data-category="pulseras" data-karat="10k" data-price="2690" data-weight="32.8" data-size="8.0" onclick="openProductModalFromCard(this)" style="position:relative;">
        <span class="badge-gold-bestseller">✦ Más Vendida</span>
        <div class="cutout-card-media">
          <img src="{{ 'product-anillo-signet.jpg' | asset_url }}" alt="Pulsera Cuban Miami Solid 10K" class="cutout-card-img" loading="lazy">
          <div class="cutout-card-pin">
            <span>10K ORO</span>
            <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
          </div>
          <div class="cutout-card-inset-label">
            <span class="cutout-label-text">Pulseras</span>
            <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
          </div>
        </div>
        <div class="cutout-card-content">
          <div class="cutout-title-row">
            <h4 class="cutout-product-title">Pulsera Cuban Miami Solid 10K</h4>
          </div>
          <div class="product-card-pricing-row">
            <div class="pricing-amounts">
              <div class="pricing-numbers-row">
                <span class="price-now">$2,690</span>
                <span class="price-was">$2,990</span>
              </div>
              <div class="affirm-monthly-badge">Oro 100% Auténtico Garantizado</div>
            </div>
            <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>`;

// 2. Vitrine 2: Novedades 2026
const vitrineNovedadesReplacement = `  <section class="editorial-vitrine-section" id="nuevas-colecciones" style="background:#FFFFFF; border-bottom:1px solid rgba(209,176,84,0.18);">
    <div class="editorial-vitrine-header">
      <div>
        <span class="editorial-vitrine-kicker">✦ Nuevos Lanzamientos Exclusivos ✦</span>
        <h2 class="editorial-vitrine-title">Nuevas Joyas & Colección 2026</h2>
      </div>
      <a href="/collections/all" style="font-family:'Plus Jakarta Sans', sans-serif; font-size:0.85rem; font-weight:700; color:#059669; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
        <span>Ver todas las novedades</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>

    <div class="editorial-vitrine-grid">
      <!-- New Arrival 1 -->
      <div class="product-shop-card cutout-product-card" data-category="cadenas" data-karat="14k" data-price="1620" data-weight="14.8" data-size="24" onclick="openProductModalFromCard(this)" style="position:relative;">
        <span class="badge-emerald-new">✦ Novedad 2026</span>
        <div class="cutout-card-media">
          <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="Cadena Franco Diamantada 14K" class="cutout-card-img" loading="lazy">
          <div class="cutout-card-pin">
            <span>14K ORO</span>
            <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
          </div>
          <div class="cutout-card-inset-label">
            <span class="cutout-label-text">Cadenas</span>
            <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
          </div>
        </div>
        <div class="cutout-card-content">
          <div class="cutout-title-row">
            <h4 class="cutout-product-title">Cadena Franco Diamantada 14K</h4>
          </div>
          <div class="product-card-pricing-row">
            <div class="pricing-amounts">
              <div class="pricing-numbers-row">
                <span class="price-now">$1,620</span>
                <span class="price-was">$1,780</span>
              </div>
              <div class="affirm-monthly-badge">Oro 100% Auténtico Garantizado</div>
            </div>
            <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- New Arrival 2 -->
      <div class="product-shop-card cutout-product-card" data-category="anillos" data-karat="14k" data-price="520" data-weight="4.8" data-size="talla-7" onclick="openProductModalFromCard(this)" style="position:relative;">
        <span class="badge-emerald-new">✦ Novedad 2026</span>
        <div class="cutout-card-media">
          <img src="{{ 'product-anillo-signet.jpg' | asset_url }}" alt="Anillo Solitario Circonia Supreme 14K" class="cutout-card-img" loading="lazy">
          <div class="cutout-card-pin">
            <span>14K ORO</span>
            <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
          </div>
          <div class="cutout-card-inset-label">
            <span class="cutout-label-text">Anillos</span>
            <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
          </div>
        </div>
        <div class="cutout-card-content">
          <div class="cutout-title-row">
            <h4 class="cutout-product-title">Anillo Solitario Circonia Supreme 14K</h4>
          </div>
          <div class="product-card-pricing-row">
            <div class="pricing-amounts">
              <div class="pricing-numbers-row">
                <span class="price-now">$520</span>
                <span class="price-was">$590</span>
              </div>
              <div class="affirm-monthly-badge">Oro 100% Auténtico Garantizado</div>
            </div>
            <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- New Arrival 3 -->
      <div class="product-shop-card cutout-product-card" data-category="pulseras" data-karat="14k" data-price="590" data-weight="4.8" data-size="7.5" onclick="openProductModalFromCard(this)" style="position:relative;">
        <span class="badge-emerald-new">✦ Novedad 2026</span>
        <div class="cutout-card-media">
          <img src="{{ 'product-pulseras-clover.jpg' | asset_url }}" alt="Pulsera Trébol Oro 14K Azul Real" class="cutout-card-img" loading="lazy">
          <div class="cutout-card-pin">
            <span>14K ORO</span>
            <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
          </div>
          <div class="cutout-card-inset-label">
            <span class="cutout-label-text">Pulseras</span>
            <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
          </div>
        </div>
        <div class="cutout-card-content">
          <div class="cutout-title-row">
            <h4 class="cutout-product-title">Pulsera Trébol Oro 14K Azul Real</h4>
          </div>
          <div class="product-card-pricing-row">
            <div class="pricing-amounts">
              <div class="pricing-numbers-row">
                <span class="price-now">$590</span>
                <span class="price-was">$680</span>
              </div>
              <div class="affirm-monthly-badge">Oro 100% Auténtico Garantizado</div>
            </div>
            <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- New Arrival 4 -->
      <div class="product-shop-card cutout-product-card" data-category="dijes" data-karat="14k" data-price="740" data-weight="6.2" data-size="38mm arete-dije" onclick="openProductModalFromCard(this)" style="position:relative;">
        <span class="badge-emerald-new">✦ Novedad 2026</span>
        <div class="cutout-card-media">
          <img src="{{ 'category-cuban.jpg' | asset_url }}" alt="Medalla San Judas Tadeo 14K" class="cutout-card-img" loading="lazy">
          <div class="cutout-card-pin">
            <span>14K ORO</span>
            <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
          </div>
          <div class="cutout-card-inset-label">
            <span class="cutout-label-text">Dijes</span>
            <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
          </div>
        </div>
        <div class="cutout-card-content">
          <div class="cutout-title-row">
            <h4 class="cutout-product-title">Medalla San Judas Tadeo 14K</h4>
          </div>
          <div class="product-card-pricing-row">
            <div class="pricing-amounts">
              <div class="pricing-numbers-row">
                <span class="price-now">$740</span>
                <span class="price-was">$830</span>
              </div>
              <div class="affirm-monthly-badge">Oro 100% Auténtico Garantizado</div>
            </div>
            <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>`;

// Helper function to build exact catalog card
function makeCatalogCard(cat, karat, price, wasPrice, weight, size, title, img, defaultOrder) {
  const karatUpper = karat.toUpperCase();
  const catCap = cat.charAt(0).toUpperCase() + cat.slice(1);
  return `          <div class="product-shop-card cutout-product-card" data-category="${cat}" data-karat="${karat}" data-price="${price}" data-weight="${weight}" data-size="${size}" data-default-order="${defaultOrder}" onclick="openProductModalFromCard(this)">
            <div class="cutout-card-media">
              <img src="{{ '${img}' | asset_url }}" alt="${title}" class="cutout-card-img" loading="lazy">
              <div class="cutout-card-pin">
                <span>${karatUpper} ORO</span>
                <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
              </div>
              <div class="cutout-card-inset-label">
                <span class="cutout-label-text">${catCap}</span>
                <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
              </div>
            </div>
            <div class="cutout-card-content">
              <div class="cutout-title-row">
                <h4 class="cutout-product-title">${title}</h4>
              </div>
              <div class="product-card-pricing-row">
                <div class="pricing-amounts">
                  <div class="pricing-numbers-row">
                    <span class="price-now">$${price.toLocaleString()}</span>
                    <span class="price-was">$${wasPrice.toLocaleString()}</span>
                  </div>
                  <div class="affirm-monthly-badge">Oro 100% Auténtico Garantizado</div>
                </div>
                <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
                </button>
              </div>
            </div>
          </div>`;
}

const fallbackCatalogCards = [
  makeCatalogCard('cadenas', '14k', 1620, 1780, '14.8', '24', 'Cadena Franco Diamantada 14K', 'collection-cadenas.jpg', 1),
  makeCatalogCard('cadenas', '10k', 1150, 1290, '14.2', '22', 'Cadena Cubana Clásica 10K', 'category-cuban.jpg', 2),
  makeCatalogCard('cadenas', '14k', 1390, 1540, '16.8', '20', 'Cadena Soga Torcida 14K (Rope)', 'editorial-dark-cuban.jpg', 3),
  makeCatalogCard('anillos', '14k', 520, 590, '4.8', 'talla-7', 'Anillo Solitario Circonia Supreme 14K', 'product-anillo-signet.jpg', 4),
  makeCatalogCard('anillos', '10k', 680, 760, '7.9', 'talla-10', 'Anillo Sello Clásico Cuadrado 10K', 'collection-anillos.jpg', 5),
  makeCatalogCard('aretes', '14k', 460, 520, '4.1', '30mm arete-dije', 'Arracadas Tubulares Gruesas 14K', 'product-aretes-profile.jpg', 6),
  makeCatalogCard('pulseras', '10k', 2690, 2990, '32.8', '8.0', 'Pulsera Cuban Miami Solid 10K', 'product-anillo-signet.jpg', 7),
  makeCatalogCard('cuban', '14k', 4850, 5400, '64.2', '22', 'Cadena Cuban Miami Solid 14K', 'collection-cadenas.jpg', 8),
  makeCatalogCard('dijes', '14k', 740, 830, '6.2', '38mm arete-dije', 'Medalla San Judas Tadeo 14K', 'category-cuban.jpg', 9),
  makeCatalogCard('dijes', '10k', 490, 560, '4.9', '42mm arete-dije', 'Dije Cruz Diamantada Facetada 10K', 'collection-anillos.jpg', 10),
  makeCatalogCard('cadenas', '10k', 890, 990, '11.6', '24', 'Cadena Fígaro Diamantada 10K', 'product-pulseras-bangle.jpg', 11),
  makeCatalogCard('anillos', '14k', 640, 720, '5.2', 'talla-7', 'Anillo Corona Imperial Pavé 14K', 'product-couple-rings.jpg', 12)
].join('\n');

const fallbackCatalogReplacement = `        <div class="catalog-products-grid" id="catalogProductsGrid">\n${fallbackCatalogCards}\n        </div>`;

// Replace in generator using callback functions to prevent regex group substitution issues
generatorCode = generatorCode.replace(/<section class="editorial-vitrine-section" id="mas-vendidos"[\s\S]*?<\/section>/, () => vitrineMasVendidosReplacement);
generatorCode = generatorCode.replace(/<section class="editorial-vitrine-section" id="nuevas-colecciones"[\s\S]*?<\/section>/, () => vitrineNovedadesReplacement);
generatorCode = generatorCode.replace(/<div class="catalog-products-grid" id="catalogProductsGrid">[\s\S]*?<\/div>(\s*\{%- endif -%\})/m, (match, p1) => fallbackCatalogReplacement + p1);

fs.writeFileSync(generatorPath, generatorCode, 'utf8');
console.log('Successfully updated code/generate_storefront_liquid.js');

// Now execute generate_storefront_liquid.js to build sections/bonita-luxury-storefront.liquid
delete require.cache[require.resolve('./generate_storefront_liquid.js')];
require('./generate_storefront_liquid.js');
