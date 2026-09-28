const fs = require('fs');
const path = require('path');

const nineCardsLiquid = `        <div class="cat-slider-track" id="catSliderTrack">
          <!-- Card 1: Cadenas -->
          <a href="#catalogo" onclick="handleNavCategory(event, 'cadenas')" class="cat-square-card" data-cat-link="cadenas" aria-label="Ver Colección de Cadenas">
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
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </a>

          <!-- Card 2: Cadenas Cubanas -->
          <a href="#catalogo" onclick="handleNavCategory(event, 'cuban')" class="cat-square-card" data-cat-link="cuban" aria-label="Ver Colección Cadenas Cubanas">
            <div class="cat-card-header">
              <span class="cat-card-label">Especialidad</span>
              <h3 class="cat-card-title">Cadenas Cubanas</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-cuban.jpg' | asset_url }}" alt="Cadenas Cubanas Miami de Oro" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </a>

          <!-- Card 3: Anillos -->
          <a href="#catalogo" onclick="handleNavCategory(event, 'anillos')" class="cat-square-card" data-cat-link="anillos" aria-label="Ver Colección de Anillos">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Anillos</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-anillos.jpg' | asset_url }}" alt="Anillos de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </a>

          <!-- Card 4: Aretes -->
          <a href="#catalogo" onclick="handleNavCategory(event, 'aretes')" class="cat-square-card" data-cat-link="aretes" aria-label="Ver Colección de Aretes">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Aretes</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-aretes.jpg' | asset_url }}" alt="Aretes de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </a>

          <!-- Card 5: Pulseras -->
          <a href="#catalogo" onclick="handleNavCategory(event, 'pulseras')" class="cat-square-card" data-cat-link="pulseras" aria-label="Ver Colección de Pulseras">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Pulseras</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-pulseras.jpg' | asset_url }}" alt="Pulseras y Manillas de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </a>

          <!-- Card 6: Dijes & Medallas -->
          <a href="#catalogo" onclick="handleNavCategory(event, 'dijes')" class="cat-square-card" data-cat-link="dijes" aria-label="Ver Colección de Dijes">
            <div class="cat-card-header">
              <span class="cat-card-label">Categorías</span>
              <h3 class="cat-card-title">Dijes & Medallas</h3>
            </div>
            <div class="cat-card-img-wrap">
              <img src="{{ 'collection-dijes.jpg' | asset_url }}" alt="Dijes y Medallas de Oro 10K y 14K" class="cat-square-img" loading="lazy">
            </div>
            <div class="cat-card-footer">
              <span class="cat-pill-btn">
                <span>Ver Colección</span>
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </a>

          <!-- Card 7: Piercings -->
          <a href="#catalogo" onclick="handleNavCategory(event, 'piercings')" class="cat-square-card" data-cat-link="piercings" aria-label="Ver Colección de Piercings">
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
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </a>

          <!-- Card 8: Prendedores -->
          <a href="#catalogo" onclick="handleNavCategory(event, 'prendedores')" class="cat-square-card" data-cat-link="prendedores" aria-label="Ver Colección de Prendedores">
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
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </a>

          <!-- Card 9: Relojes -->
          <a href="#catalogo" onclick="handleNavCategory(event, 'relojes')" class="cat-square-card" data-cat-link="relojes" aria-label="Ver Colección de Relojes">
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
                <svg class="cat-pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </a>
        </div>`;

const targetFiles = [
  'code/sections/bonita-luxury-storefront.liquid',
  'sections/bonita-luxury-storefront.liquid'
];

targetFiles.forEach(relPath => {
  const filePath = path.resolve('c:/TRABAJO/La Bonita Joyeria', relPath);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace cat-slider-track block
  const trackRegex = /<div class="cat-slider-track" id="catSliderTrack">[\s\S]*?<\/div>(\s*<button type="button" class="cat-slider-arrow next")/m;
  if (trackRegex.test(content)) {
    content = content.replace(trackRegex, `${nineCardsLiquid}\n$1`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated 9 categories in: ${relPath}`);
  } else {
    console.log(`Could not match trackRegex in: ${relPath}`);
  }
});
