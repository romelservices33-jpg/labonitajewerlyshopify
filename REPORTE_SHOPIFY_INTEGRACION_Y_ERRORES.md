# Reporte Completo de Integración de Tema Shopify y Diagnóstico de Errores
**Proyecto**: La Bonita Joyería - Storefront Editorial de Lujo  
**Repositorio GitHub**: `romelservices33-jpg/labonitajewerlyshopify` (Rama `main`)  
**Fecha de Actualización**: 16 de Septiembre de 2026

---

## 1. Resumen Ejecutivo del Objetivo

El objetivo principal es implementar en Shopify la experiencia visual de lujo desarrollada en el prototipo maestro (`code/index.html`), manteniendo:
- **Hero Editorial 4K**: Gradiente profundo Navy Blue (`#08195B`), tipografías de alta gama, y micro-animaciones.
- **6 Colecciones Cuadradas**: Cadenas Cubanas, Pulseras, Aretes, Anillos, Dijes y Conjuntos.
- **24 Tarjetas Cutout de Catálogo**: Botones de wishlist en corazón, especificaciones de peso en gramos, distintivos de financiamiento Affirm y botones pill.
- **Sección de Pilares de Confianza**: Grid editorial de 4 columnas (Oro 10k/14k Certificado, Envío Asegurado, Financiamiento Flexible, Garantía de Por Vida).
- **Footer Blanco de Lujo**: Logotipos, enlaces de navegación, suscripción VIP y métodos de pago oficiales.

---

## 2. Cronología de Cambios y Commits Realizados

### Fase 1: Adaptación de la Arquitectura Dawn a OS 2.0
- Se creó la sección personalizada `bonita-luxury-storefront.liquid` integrando toda la estructura visual del diseño maestro.
- Se conectaron los assets de diseño (`editorial-luxury.css`, `base.css`, fuentes tipográficas `sierra-danielle.otf`, `cogenta-text-light.otf`, `fonda.ttf`, `royal-fortune-serif.ttf`).
- Se configuró el archivo `templates/index.json` para cargar como sección principal `bonita-luxury-storefront`.

### Fase 2: Diagnóstico y Corrección de Errores en Shopify

#### Error 1: Redirección a 404 en el Editor de Temas de Shopify
- **Síntoma**: Al abrir el personalizador de temas (`admin.shopify.com/.../editor`) o cambiar a la página de inicio, el iframe recargaba y mostraba una página 404.
- **Causa Raíz**: En `layout/theme.liquid` se había colocado una condición `{% unless template.name == 'index' %}` alrededor de `{% sections 'header-group' %}` y `{% sections 'footer-group' %}`. El motor de inspección de Shopify OS 2.0 requiere obligatoriamente que los grupos de secciones declarados existan en el DOM para poder renderizar los controles del editor; al no encontrarlos, Shopify arrojaba una excepción interna y redirigía al 404.
- **Solución Aplicada**:
  - Se restauraron `{% sections 'header-group' %}` y `{% sections 'footer-group' %}` dentro del DOM.
  - Para ocultar el header y footer por defecto de Dawn en la página de inicio sin romper el editor, se aplicó CSS scoped:
    ```css
    {% if template.name == 'index' %}
      .section-header, .header-wrapper, .announcement-bar-section, .announcement-bar, header.header, .footer-section, footer.footer, .section-footer {
        display: none !important;
      }
    {% endif %}
    ```
- **Commit**: `e0f9b851917085cbc4648ef7f566b11b33252d71` (*"fix: solucionar redireccion 404 en editor renderizando section groups con display none"*).

---

#### Error 2: Recursos no encontrados (`404 net::ERR_ABORTED` para fuentes locales)
- **Síntoma**: Consola del navegador mostraba errores 404 al solicitar `/assets/cogenta-text-light.otf` y `/assets/fonda.ttf`.
- **Causa Raíz**: En `editorial-luxury.css` habían reglas `@font-face` con rutas relativas fijas `/assets/...` en lugar de utilizar los filtros Liquid de Shopify (`{{ 'fuente.ttf' | asset_url }}`).
- **Solución Aplicada**:
  - Se movieron las declaraciones `@font-face` con filtros dinámicos de Liquid a `layout/theme.liquid` dentro de bloques `{% style %}`.
  - Se colocó la regla `@import` de Google Fonts en la **Línea 1** de `editorial-luxury.css` cumpliendo la especificación CSS.

---

#### Error 3: "file contains Liquid templates that can't be parsed" al Subir ZIP
- **Síntoma**: Al subir el archivo `.zip` en *Shopify Admin > Temas > Cargar archivo zip*, Shopify rechaza el paquete con el mensaje:
  > *"file contains Liquid templates that can't be parsed"*

- **Investigación y Causas Identificadas**:
  1. **Codificación de Archivos (Encoding)**: En sistemas Windows con PowerShell, ciertos scripts guardan archivos de texto con codificación UTF-16 LE o incluyen marcas de orden de bytes (BOM). El motor Liquid de Shopify (basado en Ruby) lee estrictamente en UTF-8 sin BOM. Si encuentra bytes nulos `\0` o caracteres de control no reconocidos, el parser falla de inmediato.
  2. **Estructura Interna del Archivo ZIP**: Shopify exige que las 7 carpetas canónicas del tema (`assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`) se encuentren directamente en la raíz del archivo ZIP o dentro de una única carpeta contenedora válida con cabeceras PKZIP estándar.
  3. **Esquemas JSON (`{% schema %}`)**: Cualquier error de sintaxis en los bloques JSON dentro de archivos `.liquid` (como presets mal formados o tipos de campo inexistentes) provoca que el parser de Shopify aborte la importación.

---

## 3. Estado Actual de los Archivos del Tema

| Directorio | Archivos Clave | Estado |
| :--- | :--- | :--- |
| `layout/` | `theme.liquid`, `password.liquid` | Sección groups en DOM, fuentes vinculadas por Liquid `asset_url`. |
| `templates/` | `index.json`, `product.json`, `collection.json`, `404.json`, etc. | Esquemas JSON válidos apuntando a secciones registradas. |
| `sections/` | `bonita-luxury-storefront.liquid`, `bonita-categories-grid.liquid`, `bonita-hero-luxe.liquid`, `header.liquid`, `footer.liquid` | Sintaxis Liquid balanceada con bloque `{% schema %}` y presets registrados. |
| `assets/` | `editorial-luxury.css`, `base.css`, imágenes y fuentes | `@import` en línea 1, imágenes optimizadas, archivo innecesario de 13MB omitido. |
| `config/` | `settings_data.json`, `settings_schema.json` | Esquemas de tema estándar de Dawn / OS 2.0. |

---

## 4. Próximos Pasos Recomendados

1. **Sincronización directa vía GitHub App de Shopify**:
   - Conectar la rama `main` del repositorio `romelservices33-jpg/labonitajewerlyshopify` directamente desde *Shopify Admin > Temas > Agregar tema > Conectar desde GitHub*.
   - Esto permite que Shopify compile y valide los cambios automáticamente desde el árbol de Git sin depender del empaquetador ZIP de Windows.

2. **Validación en Shopify CLI (`shopify theme check`)**:
   - Ejecutar el linter oficial de Shopify para obtener el número de línea y archivo exacto si el parser estricto de Shopify detecta alguna incompatibilidad en los snippets heredados de Dawn.
