const fs = require('fs');

const metaBarHtml = `          <!-- Status Line & Reset -->
          <div class="filter-meta-bar">
            <span class="filter-results-count" id="filterCount">Mostrando joyas de oro disponibles</span>
            <button class="btn-filter-reset" id="btnFilterReset" onclick="resetCatalogFilters()" type="button" aria-label="Restablecer todos los filtros">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>`;

const cleanScheduleHtml = `            <!-- Clean Minimal Schedule (Exact Official Hours) -->
            <div style="margin-bottom: 24px;">
              <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 700; color: #08195B; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.08em;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D1B054" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>Horarios de Atención</span>
              </div>
              
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.84rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1px solid rgba(8, 25, 91, 0.05);">
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
                </div>
              </div>
            </div>`;

['sections/bonita-luxury-storefront.liquid', 'code/sections/bonita-luxury-storefront.liquid'].forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');

    // 1. Ensure filter-meta-bar is present before <!-- Products Grid -->
    if (!c.includes('filter-meta-bar')) {
      const gridMarker = '<!-- Products Grid -->';
      const lastCloseDiv = c.lastIndexOf('</div>', c.indexOf(gridMarker));
      c = c.slice(0, lastCloseDiv) + '\n' + metaBarHtml + '\n\n      ' + c.slice(c.indexOf(gridMarker));
    }

    // 2. Fix schedule block
    const schedStart = c.indexOf('<!-- Clean Minimal Schedule');
    const schedEnd = c.indexOf('<!-- Key Boutique Benefits');
    if (schedStart !== -1 && schedEnd !== -1) {
      c = c.slice(0, schedStart) + cleanScheduleHtml + '\n\n            ' + c.slice(schedEnd);
    }

    // 3. Remove unused updateWeightDisplay function
    c = c.replace(/function updateWeightDisplay\(val\)[\s\S]*?catalogPage = 1;\s*paginateCatalogGrid\(\);\s*\}/m, 'function updateWeightDisplay(val) {}');

    fs.writeFileSync(f, c, 'utf8');
    console.log('Fixed clean layout and schedule in:', f);
  }
});
