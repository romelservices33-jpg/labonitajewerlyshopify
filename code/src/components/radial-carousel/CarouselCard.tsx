import React from 'react';
import { RadialSectorProps } from './types';

/**
 * Calcula la coordenada cartesiana en base a un ángulo polar (grados) y radio
 */
function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

/**
 * Genera el comando SVG 'd' para un sector anular (entre rIn y rOut de startAngle a endAngle)
 */
export function describeAnnularSector(
  cx: number,
  cy: number,
  rIn: number,
  rOut: number,
  startAngle: number,
  endAngle: number
): string {
  const outerStart = polarToCartesian(cx, cy, rOut, startAngle);
  const outerEnd = polarToCartesian(cx, cy, rOut, endAngle);
  const innerStart = polarToCartesian(cx, cy, rIn, startAngle);
  const innerEnd = polarToCartesian(cx, cy, rIn, endAngle);

  const arcSweep = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOut} ${rOut} 0 ${arcSweep} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${rIn} ${rIn} 0 ${arcSweep} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

export const CarouselCard: React.FC<RadialSectorProps> = ({
  item,
  index,
  startAngleDeg,
  endAngleDeg,
  innerRadius,
  outerRadius,
  cx,
  cy,
  isActive,
  onSelect,
}) => {
  const clipId = `annular-clip-${item.id}-${index}`;
  // Dejar un pequeño gap angular (0.8°) entre sectores para el divisor oscuro
  const gap = 0.6;
  const pathD = describeAnnularSector(
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngleDeg + gap,
    endAngleDeg - gap
  );

  // Calcular centro del sector para posicionar la imagen y el tooltip
  const midAngle = (startAngleDeg + endAngleDeg) / 2;
  const midRadius = (innerRadius + outerRadius) / 2;
  const centerPos = polarToCartesian(cx, cy, midRadius, midAngle);
  const imgWidth = (outerRadius - innerRadius) * 1.5;
  const imgHeight = (outerRadius - innerRadius) * 1.5;

  return (
    <g
      className="group cursor-pointer select-none transition-all duration-500"
      onClick={() => onSelect(index)}
      role="button"
      tabIndex={0}
      aria-label={`Seleccionar pieza ${item.title}`}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={pathD} />
        </clipPath>
      </defs>

      {/* Imagen del producto enmascarada dentro del sector anular */}
      <g clipPath={`url(#${clipId})`}>
        {/* Fondo del sector */}
        <path d={pathD} fill="#1E1E22" />

        <image
          href={item.imageUrl}
          x={centerPos.x - imgWidth / 2}
          y={centerPos.y - imgHeight / 2}
          width={imgWidth}
          height={imgHeight}
          preserveAspectRatio="xMidYMid slice"
          className="transition-transform duration-700 ease-out group-hover:scale-110"
          style={{
            transformOrigin: `${centerPos.x}px ${centerPos.y}px`,
          }}
        />

        {/* Gradiente sutil para profundidad editorial */}
        <path
          d={pathD}
          fill="url(#radialDarkVignette)"
          className="opacity-40 group-hover:opacity-15 transition-opacity duration-300"
        />
      </g>

      {/* Borde divisorio y resaltado de selección */}
      <path
        d={pathD}
        fill="none"
        stroke={isActive ? '#D1B054' : 'transparent'}
        strokeWidth={isActive ? 85 : 0}
        className="transition-all duration-400"
        style={{
          filter: isActive ? 'drop-shadow(0 0 160px rgba(209, 176, 84, 0.75))' : 'none',
        }}
      />
    </g>
  );
};
