const fs = require('fs');

// 1. UPDATE BONITA-LUXURY-STOREFRONT.LIQUID
function updateStorefront(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace comment
  content = content.replace('<!-- Dynamic Pagination Controls (Exact 6 products per page) -->', '<!-- Dynamic Pagination Controls (8 on Desktop, 6 on Mobile) -->');
  content = content.replace('/* Catalog Dynamic 6-Product Pagination & Filtering Engine */', '/* Catalog Dynamic Responsive Pagination & Filtering Engine (8 on Desktop, 6 on Mobile) */');

  // Replace var CATALOG_PER_PAGE = 6; with dynamic getter
  const oldPaginationBlock = `    /* Catalog Dynamic Responsive Pagination & Filtering Engine (8 on Desktop, 6 on Mobile) */
    var catalogPage = 1;
    var CATALOG_PER_PAGE = 6;`;

  const newPaginationBlock = `    /* Catalog Dynamic Responsive Pagination & Filtering Engine (8 on Desktop, 6 on Mobile) */
    var catalogPage = 1;
    function getCatalogPerPage() {
      return (window.innerWidth && window.innerWidth <= 860) ? 6 : 8;
    }`;

  if (content.includes('var CATALOG_PER_PAGE = 6;')) {
    content = content.replace(/var\s+CATALOG_PER_PAGE\s*=\s*6;/, `function getCatalogPerPage() {\n      return (window.innerWidth && window.innerWidth <= 860) ? 6 : 8;\n    }`);
  }

  // Replace uses of CATALOG_PER_PAGE in paginateCatalogGrid()
  content = content.replace(
    /var totalPages = Math\.max\(1, Math\.ceil\(total \/ CATALOG_PER_PAGE\)\);/,
    `var perPage = getCatalogPerPage();\n      var totalPages = Math.max(1, Math.ceil(total / perPage));`
  );

  content = content.replace(
    /var start = \(catalogPage - 1\) \* CATALOG_PER_PAGE;/,
    `var start = (catalogPage - 1) * perPage;`
  );

  content = content.replace(
    /var end = start \+ CATALOG_PER_PAGE;/,
    `var end = start + perPage;`
  );

  // Add resize listener if not present
  if (!content.includes('resizeCatalogTimer')) {
    const initIdx = content.indexOf('paginateCatalogGrid();', content.indexOf('function paginateCatalogGrid'));
    if (initIdx !== -1) {
      const scriptEnd = content.indexOf('</script>', initIdx);
      const resizeCode = `\n    var resizeCatalogTimer;\n    window.addEventListener('resize', function() {\n      clearTimeout(resizeCatalogTimer);\n      resizeCatalogTimer = setTimeout(function() {\n        paginateCatalogGrid();\n      }, 150);\n    });\n  `;
      content = content.slice(0, scriptEnd) + resizeCode + content.slice(scriptEnd);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated 8-cards desktop pagination in: ' + filePath);
}

// 2. UPDATE BONITA-LUXURY-COLLECTION.LIQUID
function updateCollection(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace('<!-- Products Grid (Paginated 6 per page) -->', '<!-- Products Grid (8 on Desktop, 6 on Mobile) -->');
  content = content.replace('<!-- Pagination Controls (6 products per page) -->', '<!-- Pagination Controls (8 on Desktop, 6 on Mobile) -->');
  content = content.replace('/* Collection Filtering & 6-Product Pagination */', '/* Collection Filtering & Responsive Pagination (8 on Desktop, 6 on Mobile) */');

  if (content.includes('var COLLECTION_PER_PAGE = 6;')) {
    content = content.replace(/var\s+COLLECTION_PER_PAGE\s*=\s*6;/, `function getCollectionPerPage() {\n    return (window.innerWidth && window.innerWidth <= 860) ? 6 : 8;\n  }`);
  }

  content = content.replace(
    /var totalPages = Math\.max\(1, Math\.ceil\(total \/ COLLECTION_PER_PAGE\)\);/,
    `var perPage = getCollectionPerPage();\n    var totalPages = Math.max(1, Math.ceil(total / perPage));`
  );

  content = content.replace(
    /var start = \(collectionPage - 1\) \* COLLECTION_PER_PAGE;/,
    `var start = (collectionPage - 1) * perPage;`
  );

  content = content.replace(
    /var end = start \+ COLLECTION_PER_PAGE;/,
    `var end = start + perPage;`
  );

  if (!content.includes('resizeCollectionTimer')) {
    const scriptEnd = content.lastIndexOf('</script>');
    if (scriptEnd !== -1) {
      const resizeCode = `\n  var resizeCollectionTimer;\n  window.addEventListener('resize', function() {\n    clearTimeout(resizeCollectionTimer);\n    resizeCollectionTimer = setTimeout(function() {\n      paginateCollectionGrid();\n    }, 150);\n  });\n`;
      content = content.slice(0, scriptEnd) + resizeCode + content.slice(scriptEnd);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated 8-cards desktop pagination in: ' + filePath);
}

updateStorefront('sections/bonita-luxury-storefront.liquid');
if (fs.existsSync('code/sections/bonita-luxury-storefront.liquid')) {
  updateStorefront('code/sections/bonita-luxury-storefront.liquid');
}

updateCollection('sections/bonita-luxury-collection.liquid');
if (fs.existsSync('code/sections/bonita-luxury-collection.liquid')) {
  updateCollection('code/sections/bonita-luxury-collection.liquid');
}
