import React, { useState, useCallback, useRef } from 'react';
import { PneumaRadialCarouselProps, JewelryItem } from './types';
import { pneumaReferenceCollection } from './mockData';
import { CarouselCard } from './CarouselCard';

/**
 * CarouselContainer
 * Réplica interactiva de alta costura inspirada en el póster editorial:
 * - Columna Izquierda: Rueda anular radial concéntrica que sale y se esconde en el borde izquierdo de la pantalla.
 * - Columna Derecha: Tipografía editorial blanca (Monograma LB, Año 2026, Título en serifa, ficha de pieza activa y bloque de contacto).
 * - Sin fondo aislado: Se integra fluidamente con la sección anterior sin bordes ni contenedor separado.
 * - Sin tarjeta flotante inferior de WhatsApp.
 */
export const CarouselContainer: React.FC<PneumaRadialCarouselProps> = ({
  data = pneumaReferenceCollection,
  className = '',
  onItemChange,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const isDragging = useRef<boolean>(false);
  const dragStartY = useRef<number>(0);

  const items = data.items;
  const total = items.length;
  const activeItem: JewelryItem = items[activeIndex] || items[0];

  // Geometría del abanico anular extraída exactamente del SVG de CorelDRAW (seccino.svg):
  // cx = -3343, cy = 9637.54, R_in = 9456, R_out = 16888, viewBox="0 0 13545 19275"
  const sectorCount = 12; // 12 sectores continuos de 30° cada uno para rotación 360° fluida
  const sectorSpanDeg = 360 / sectorCount; // 30° exactos por sector
  const cx = -3343;
  const cy = 9637.54;
  const innerRadius = 9456;
  const outerRadius = 16888;

  // Rotación para alinear la pieza activa con el ángulo focal horizontal (0° apuntando a la derecha hacia el texto)
  const targetRotation = -activeIndex * sectorSpanDeg;

  const handleSelectSector = useCallback(
    (index: number) => {
      const normalized = (index % total + total) % total;
      setActiveIndex(normalized);
      if (onItemChange) {
        onItemChange(items[normalized], normalized);
      }
    },
    [total, items, onItemChange]
  );

  const handleNext = () => handleSelectSector(activeIndex + 1);
  const handlePrev = () => handleSelectSector(activeIndex - 1);

  // Manejo de arrastre vertical para girar la rueda
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const diff = e.clientY - dragStartY.current;
    if (Math.abs(diff) > 30) {
      if (diff > 0) handlePrev();
      else handleNext();
      isDragging.current = false;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Mapear 12 sectores a partir de las piezas disponibles
  const sectorsArray = Array.from({ length: sectorCount }, (_, i) => ({
    sectorIdx: i,
    item: items[i % total],
  }));

  return (
    <section
      aria-label="Colección Editorial Radial La Bonita Jewellers"
      className={`relative w-full overflow-hidden bg-transparent text-white py-8 sm:py-12 lg:py-16 ${className}`}
      onMouseUp={handleMouseUp}
    >
      <div className="w-full max-w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[640px] lg:min-h-[780px]">
        {/* =========================================================================
            COLUMNA IZQUIERDA: Rueda Anular Radial (Exacta al archivo Corel seccino.svg)
            ========================================================================= */}
        <div
          className="lg:col-span-7 xl:col-span-7 relative flex items-center justify-start h-[520px] sm:h-[640px] lg:h-[780px] overflow-visible select-none cursor-grab active:cursor-grabbing ml-0"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 5%, rgba(0,0,0,0.88) 14%, #000000 22%, #000000 78%, rgba(0,0,0,0.88) 86%, rgba(0,0,0,0.35) 95%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 5%, rgba(0,0,0,0.88) 14%, #000000 22%, #000000 78%, rgba(0,0,0,0.88) 86%, rgba(0,0,0,0.35) 95%, transparent 100%)',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          {/* Viñeta radial oscura y máscara de difuminado vertical */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            <defs>
              <radialGradient id="pneumaSectorVignetteReact" cx="50%" cy="50%" r="50%">
                <stop offset="65%" stopColor="#000000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
              </radialGradient>
              <mask id="pneumaVerticalFadeMaskReact">
                <linearGradient id="pneumaVerticalFadeGradReact" x1="0" y1="0" x2="0" y2="19275" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="black" />
                  <stop offset="5%" stopColor="white" stopOpacity="0.3" />
                  <stop offset="14%" stopColor="white" stopOpacity="0.85" />
                  <stop offset="22%" stopColor="white" stopOpacity="1" />
                  <stop offset="78%" stopColor="white" stopOpacity="1" />
                  <stop offset="86%" stopColor="white" stopOpacity="0.85" />
                  <stop offset="95%" stopColor="white" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="black" />
                </linearGradient>
                <rect x="0" y="0" width="13545" height="19275" fill="url(#pneumaVerticalFadeGradReact)" />
              </mask>
            </defs>
          </svg>

          {/* SVG de la Rueda Anular con centro polar en (cx = -3343, cy = 9637.54) */}
          <svg
            viewBox="0 0 13545 19275"
            className="w-full h-full max-w-full max-h-full overflow-visible"
            preserveAspectRatio="xMinYMid meet"
          >
            <g
              mask="url(#pneumaVerticalFadeMaskReact)"
              style={{
                transform: `rotate(${targetRotation}deg)`,
                transformOrigin: `${cx}px ${cy}px`,
                transition: 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {sectorsArray.map(({ sectorIdx, item }) => {
                const midAngle = sectorIdx * sectorSpanDeg;
                const gap = 0.7; // Generous luxury separation gap between sector containers
                const startAngle = midAngle - (sectorSpanDeg / 2) + gap;
                const endAngle = midAngle + (sectorSpanDeg / 2) - gap;
                const isActive = (sectorIdx % total) === activeIndex;

                return (
                  <CarouselCard
                    key={`sector-${sectorIdx}`}
                    item={item}
                    index={sectorIdx}
                    total={sectorCount}
                    startAngleDeg={startAngle}
                    endAngleDeg={endAngle}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    cx={cx}
                    cy={cy}
                    isActive={isActive}
                    onSelect={() => handleSelectSector(sectorIdx)}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* =========================================================================
            COLUMNA DERECHA: Columna Editorial de Tipografía Blanca & Credenciales
            ========================================================================= */}
        <aside className="lg:col-span-5 xl:col-span-4 flex flex-col items-center text-center justify-center py-6 sm:py-10 px-4 sm:px-8 z-10 select-none">
          {/* 1. Monograma Clásico Esculpido */}
          <div className="flex flex-col items-center">
            <div className="relative font-serif text-5xl sm:text-6xl font-normal italic tracking-tight text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.28)]">
              {data.monogram}
            </div>

            {/* Línea Divisoria 1 */}
            <div className="my-6 sm:my-8 h-px w-24 sm:w-28 bg-white/35" />

            {/* 2. Año en Tipografía Amplia y Minimalista */}
            <div className="font-sans text-3xl sm:text-4xl font-light tracking-[0.28em] text-white">
              {data.year}
            </div>

            {/* Título de la Colección */}
            <h2 className="mt-3 font-serif text-xs sm:text-sm tracking-[0.34em] text-white/90 uppercase font-normal">
              {data.collectionTitle}
            </h2>

            {/* Ficha Tipográfica Minimalista de la Pieza Activa */}
            <div className="mt-4 flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] tracking-[0.22em] text-[#D1B054] uppercase font-bold">
                {activeItem.category} • {activeItem.purity}
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-white font-normal">
                {activeItem.title}
              </h3>
              <div className="flex items-center gap-2 font-sans text-sm">
                <span className="font-bold text-[#F3E5AB]">
                  ${activeItem.price.toLocaleString('en-US')}
                </span>
                {activeItem.weight && (
                  <>
                    <span className="text-white/30">•</span>
                    <span className="font-mono text-xs text-white/80">
                      {activeItem.weight}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Línea Divisoria 2 */}
            <div className="my-6 sm:my-8 h-px w-24 sm:w-28 bg-white/35" />
          </div>

          {/* 3. Bloque de Contacto Oficial (Fiel a la Referencia) */}
          <div className="space-y-4 font-sans text-[11px] sm:text-xs text-white/85 uppercase leading-relaxed max-w-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] tracking-[0.28em] text-white/50 font-medium">
                CONTACT INFO :
              </span>
              <a
                href={`tel:${data.contact.phone}`}
                className="hover:text-[#F3E5AB] transition-colors tracking-widest text-white font-normal"
              >
                {data.contact.displayPhone}
              </a>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] tracking-[0.28em] text-white/50 font-medium">
                EMAIL :
              </span>
              <a
                href={`mailto:${data.contact.email}`}
                className="hover:text-[#F3E5AB] transition-colors tracking-widest text-white font-normal"
              >
                {data.contact.email}
              </a>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] tracking-[0.28em] text-white/50 font-medium">
                LOCATION : {data.contact.brandName}
              </span>
              <span className="text-[10px] text-white/70 tracking-widest">
                {data.contact.locationLine1}
              </span>
              <span className="text-[11px] text-white/90 tracking-widest font-medium">
                {data.contact.locationLine2}
              </span>
            </div>
          </div>

          {/* Controles de Navegación */}
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Pieza anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition-all hover:border-[#D1B054] hover:text-[#F3E5AB] hover:bg-white/10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="font-mono text-xs tracking-widest text-white/90">
              <strong className="text-[#D1B054]">
                {String(activeIndex + 1).padStart(2, '0')}
              </strong>{' '}
              / {String(total).padStart(2, '0')}
            </div>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente pieza"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition-all hover:border-[#D1B054] hover:text-[#F3E5AB] hover:bg-white/10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};
