const fs = require('fs');

let storefront = fs.readFileSync('sections/bonita-luxury-storefront.liquid', 'utf8');

// 1. DYNAMIC BEST SELLERS VITRINE
const dynamicBestSellers = `    <div class="editorial-vitrine-grid">
      {%- assign bs_collection = section.settings.collection | default: collections['all'] -%}
      {%- if bs_collection != blank and bs_collection.products.size > 0 -%}
        {%- for product in bs_collection.products limit: 4 -%}
          {%- assign cat_tag = product.type | default: 'cadenas' | downcase -%}
          {%- assign karat_tag = '14k' -%}
          {%- if product.tags contains '10k' or product.tags contains '10K' or product.title contains '10K' or product.title contains '10k' -%}
            {%- assign karat_tag = '10k' -%}
          {%- endif -%}
          {%- assign price_num = product.price | divided_by: 100.0 -%}
          {%- assign monthly_affirm = product.price | divided_by: 1200 -%}
          {%- if monthly_affirm < 20 -%}{%- assign monthly_affirm = 20 -%}{%- endif -%}
          <div class="product-shop-card cutout-product-card" 
               data-category="{{ cat_tag }}" 
               data-karat="{{ karat_tag }}" 
               data-price="{{ price_num }}" 
               data-weight="15.0" 
               data-size="24" 
               data-variant-id="{{ product.variants.first.id }}"
               onclick="openProductModalFromCard(this)" 
               style="position:relative;">
            <span class="badge-gold-bestseller">✦ Top #{{ forloop.index }} Más Vendido</span>
            <div class="cutout-card-media">
              {%- if product.featured_image != blank -%}
                <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
              {%- else -%}
                <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
              {%- endif -%}
              <div class="cutout-card-pin">
                <span>{{ karat_tag | upcase }} ORO</span>
                <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
              </div>
              <div class="cutout-card-inset-label">
                <span class="cutout-label-text">{{ cat_tag | capitalize }}</span>
                <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
              </div>
            </div>
            <div class="cutout-card-content">
              <div class="cutout-title-row">
                <h4 class="cutout-product-title">{{ product.title }}</h4>
                <span class="spec-weight-tag">{{ karat_tag | upcase }} Oro Auténtico · Envío Asegurado</span>
              </div>
              <div class="product-card-pricing-row">
                <div class="pricing-amounts">
                  <div class="pricing-numbers-row">
                    <span class="price-now">{{ product.price | money }}</span>
                    {%- if product.compare_at_price > product.price -%}
                      <span class="price-was">{{ product.compare_at_price | money }}</span>
                    {%- endif -%}
                  </div>
                  <div class="affirm-monthly-badge">Desde <strong>\${{ monthly_affirm }}/mes</strong> con Affirm</div>
                </div>
                <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
                </button>
              </div>
            </div>
          </div>
        {%- endfor -%}
      {%- else -%}`;

// 2. DYNAMIC NEW ARRIVALS VITRINE
const dynamicNewArrivals = `    <div class="editorial-vitrine-grid">
      {%- assign new_collection = section.settings.collection | default: collections['all'] -%}
      {%- if new_collection != blank and new_collection.products.size > 4 -%}
        {%- for product in new_collection.products offset: 4 limit: 4 -%}
          {%- assign cat_tag = product.type | default: 'cadenas' | downcase -%}
          {%- assign karat_tag = '14k' -%}
          {%- if product.tags contains '10k' or product.tags contains '10K' or product.title contains '10K' or product.title contains '10k' -%}
            {%- assign karat_tag = '10k' -%}
          {%- endif -%}
          {%- assign price_num = product.price | divided_by: 100.0 -%}
          {%- assign monthly_affirm = product.price | divided_by: 1200 -%}
          {%- if monthly_affirm < 20 -%}{%- assign monthly_affirm = 20 -%}{%- endif -%}
          <div class="product-shop-card cutout-product-card" 
               data-category="{{ cat_tag }}" 
               data-karat="{{ karat_tag }}" 
               data-price="{{ price_num }}" 
               data-weight="15.0" 
               data-size="24" 
               data-variant-id="{{ product.variants.first.id }}"
               onclick="openProductModalFromCard(this)" 
               style="position:relative;">
            <span class="badge-emerald-new">✦ Novedad 2026</span>
            <div class="cutout-card-media">
              {%- if product.featured_image != blank -%}
                <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
              {%- else -%}
                <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
              {%- endif -%}
              <div class="cutout-card-pin">
                <span>{{ karat_tag | upcase }} ORO</span>
                <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
              </div>
              <div class="cutout-card-inset-label">
                <span class="cutout-label-text">{{ cat_tag | capitalize }}</span>
                <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
              </div>
            </div>
            <div class="cutout-card-content">
              <div class="cutout-title-row">
                <h4 class="cutout-product-title">{{ product.title }}</h4>
                <span class="spec-weight-tag">{{ karat_tag | upcase }} Oro Auténtico · Envío Asegurado</span>
              </div>
              <div class="product-card-pricing-row">
                <div class="pricing-amounts">
                  <div class="pricing-numbers-row">
                    <span class="price-now">{{ product.price | money }}</span>
                    {%- if product.compare_at_price > product.price -%}
                      <span class="price-was">{{ product.compare_at_price | money }}</span>
                    {%- endif -%}
                  </div>
                  <div class="affirm-monthly-badge">Desde <strong>\${{ monthly_affirm }}/mes</strong> con Affirm</div>
                </div>
                <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
                </button>
              </div>
            </div>
          </div>
        {%- endfor -%}
      {%- elsif new_collection != blank and new_collection.products.size > 0 -%}
        {%- for product in new_collection.products limit: 4 -%}
          {%- assign cat_tag = product.type | default: 'cadenas' | downcase -%}
          {%- assign karat_tag = '14k' -%}
          {%- if product.tags contains '10k' or product.tags contains '10K' or product.title contains '10K' or product.title contains '10k' -%}
            {%- assign karat_tag = '10k' -%}
          {%- endif -%}
          {%- assign price_num = product.price | divided_by: 100.0 -%}
          {%- assign monthly_affirm = product.price | divided_by: 1200 -%}
          {%- if monthly_affirm < 20 -%}{%- assign monthly_affirm = 20 -%}{%- endif -%}
          <div class="product-shop-card cutout-product-card" 
               data-category="{{ cat_tag }}" 
               data-karat="{{ karat_tag }}" 
               data-price="{{ price_num }}" 
               data-weight="15.0" 
               data-size="24" 
               data-variant-id="{{ product.variants.first.id }}"
               onclick="openProductModalFromCard(this)" 
               style="position:relative;">
            <span class="badge-emerald-new">✦ Novedad 2026</span>
            <div class="cutout-card-media">
              {%- if product.featured_image != blank -%}
                <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
              {%- else -%}
                <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
              {%- endif -%}
              <div class="cutout-card-pin">
                <span>{{ karat_tag | upcase }} ORO</span>
                <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
              </div>
              <div class="cutout-card-inset-label">
                <span class="cutout-label-text">{{ cat_tag | capitalize }}</span>
                <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
              </div>
            </div>
            <div class="cutout-card-content">
              <div class="cutout-title-row">
                <h4 class="cutout-product-title">{{ product.title }}</h4>
                <span class="spec-weight-tag">{{ karat_tag | upcase }} Oro Auténtico · Envío Asegurado</span>
              </div>
              <div class="product-card-pricing-row">
                <div class="pricing-amounts">
                  <div class="pricing-numbers-row">
                    <span class="price-now">{{ product.price | money }}</span>
                    {%- if product.compare_at_price > product.price -%}
                      <span class="price-was">{{ product.compare_at_price | money }}</span>
                    {%- endif -%}
                  </div>
                  <div class="affirm-monthly-badge">Desde <strong>\${{ monthly_affirm }}/mes</strong> con Affirm</div>
                </div>
                <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
                </button>
              </div>
            </div>
          </div>
        {%- endfor -%}
      {%- else -%}`;

// 3. DYNAMIC MAIN CATALOG GRID
const dynamicCatalogGrid = `      <!-- Products Grid -->
      {%- assign catalog_collection = section.settings.collection | default: collections['all'] -%}
      <div class="catalog-products-grid" id="catalogProductsGrid">
        {%- if catalog_collection != blank and catalog_collection.products.size > 0 -%}
          {%- for product in catalog_collection.products limit: 48 -%}
            {%- assign cat_tag = product.type | default: 'cadenas' | downcase -%}
            {%- if cat_tag == blank or cat_tag == 'all' -%}
              {%- if product.tags contains 'cadenas' or product.title contains 'Cadena' or product.title contains 'cadena' or product.title contains 'Cuban' -%}
                {%- assign cat_tag = 'cadenas' -%}
              {%- elsif product.tags contains 'anillos' or product.title contains 'Anillo' or product.title contains 'anillo' -%}
                {%- assign cat_tag = 'anillos' -%}
              {%- elsif product.tags contains 'aretes' or product.title contains 'Arete' or product.title contains 'arete' or product.title contains 'Arracada' -%}
                {%- assign cat_tag = 'aretes' -%}
              {%- elsif product.tags contains 'pulseras' or product.title contains 'Pulsera' or product.title contains 'pulsera' or product.title contains 'Esclava' -%}
                {%- assign cat_tag = 'pulseras' -%}
              {%- elsif product.tags contains 'dijes' or product.title contains 'Dije' or product.title contains 'dije' or product.title contains 'Medalla' -%}
                {%- assign cat_tag = 'dijes' -%}
              {%- else -%}
                {%- assign cat_tag = 'cadenas' -%}
              {%- endif -%}
            {%- endif -%}
            {%- assign karat_tag = '14k' -%}
            {%- if product.tags contains '10k' or product.tags contains '10K' or product.title contains '10K' or product.title contains '10k' -%}
              {%- assign karat_tag = '10k' -%}
            {%- endif -%}
            {%- assign price_num = product.price | divided_by: 100.0 -%}
            {%- assign monthly_affirm = product.price | divided_by: 1200 -%}
            {%- if monthly_affirm < 20 -%}{%- assign monthly_affirm = 20 -%}{%- endif -%}
            <div class="product-shop-card cutout-product-card" 
                 data-category="{{ cat_tag }}" 
                 data-karat="{{ karat_tag }}" 
                 data-price="{{ price_num }}" 
                 data-weight="15.0" 
                 data-size="24" 
                 data-default-order="{{ forloop.index }}"
                 data-variant-id="{{ product.variants.first.id }}"
                 onclick="openProductModalFromCard(this)">
              <div class="cutout-card-media">
                {%- if product.featured_image != blank -%}
                  <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
                {%- else -%}
                  <img src="{{ 'collection-cadenas.jpg' | asset_url }}" alt="{{ product.title | escape }}" class="cutout-card-img" loading="lazy">
                {%- endif -%}
                <div class="cutout-card-pin">
                  <span>{{ karat_tag | upcase }} ORO</span>
                  <svg class="cutout-corner cutout-corner-pin-left" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 H24 V32 C17.38 32 12 24.83 12 16 C12 7.17 6.63 0 0 0 Z" fill="currentColor"/></svg>
                </div>
                <div class="cutout-card-inset-label">
                  <span class="cutout-label-text">{{ cat_tag | capitalize }}</span>
                  <svg class="cutout-corner cutout-corner-label-right" width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M0 0 C6.63 0 12 7.17 12 16 C12 24.83 17.38 32 24 32 H0 V0 Z" fill="currentColor"/></svg>
                </div>
              </div>
              <div class="cutout-card-content">
                <div class="cutout-title-row">
                  <h4 class="cutout-product-title">{{ product.title }}</h4>
                  <span class="spec-weight-tag">{{ karat_tag | upcase }} Oro Auténtico · Envío Asegurado</span>
                </div>
                <div class="product-card-pricing-row">
                  <div class="pricing-amounts">
                    <div class="pricing-numbers-row">
                      <span class="price-now">{{ product.price | money }}</span>
                      {%- if product.compare_at_price > product.price -%}
                        <span class="price-was">{{ product.compare_at_price | money }}</span>
                      {%- endif -%}
                    </div>
                    <div class="affirm-monthly-badge">Desde <strong>\${{ monthly_affirm }}/mes</strong> con Affirm</div>
                  </div>
                  <button type="button" class="btn-add-cart-pill" onclick="event.stopPropagation(); openProductModalFromCard(this.closest('.product-shop-card'));" title="Ver y Comprar" aria-label="Ver y Comprar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a4 4 0 0 1-8 0M3.6 7.4L2.9 15.8C2.8 17.6 2.7 18.5 3 19.2c.3.6.7 1.1 1.3 1.4.7.4 1.6.4 3.4.4h8.6c1.8 0 2.7 0 3.4-.4.6-.3 1-.8 1.3-1.4.3-.7.2-1.6.1-3.4l-.7-8.4c-.1-1.6-.2-2.3-.5-2.9-.3-.5-.8-1-1.3-1.2C18 3 17.2 3 15.6 3H8.4C6.8 3 6 3 5.4 3.3c-.5.2-1 .7-1.3 1.2-.3.6-.4 1.3-.5 2.9z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          {%- endfor -%}
        {%- else -%}`;

console.log('Script template defined successfully.');
