/* Meo Qoum — SVG ornaments */

export const StarKhatim = ({ size = 44, color = '#D4AF37', stroke = '#004225' }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
    <g transform="translate(50,50)">
      <polygon points="0,-44 31,-31 44,0 31,31 0,44 -31,31 -44,0 -31,-31"
        fill={color} stroke={stroke} strokeWidth="1.5" />
      <polygon points="0,-44 31,-31 44,0 31,31 0,44 -31,31 -44,0 -31,-31"
        transform="rotate(22.5)"
        fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.9" />
      <circle cx="0" cy="0" r="10" fill={stroke} />
      <circle cx="0" cy="0" r="4" fill={color} />
    </g>
  </svg>
);

export const GeoPattern = ({ opacity = 0.06, color = '#004225', size = 64 }) => (
  <svg width="100%" height="100%"
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}
    aria-hidden="true">
    <defs>
      <pattern id={`geo-${size}`} x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
        <g fill="none" stroke={color} strokeWidth="1">
          <polygon points={`${size/2},4 ${size-4},${size/2} ${size/2},${size-4} 4,${size/2}`} />
          <polygon points={`${size/2},${size*0.18} ${size*0.82},${size/2} ${size/2},${size*0.82} ${size*0.18},${size/2}`} />
          <circle cx={size/2} cy={size/2} r={size*0.08} />
          <line x1="0" y1="0" x2={size} y2={size} />
          <line x1={size} y1="0" x2="0" y2={size} />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#geo-${size})`} />
  </svg>
);

export const RajputBorder = ({ height = 22, color = '#D4AF37', bg = '#004225' }) => (
  <svg width="100%" height={height} preserveAspectRatio="none"
    viewBox="0 0 240 22" aria-hidden="true" style={{ display: 'block' }}>
    <rect width="240" height="22" fill={bg} />
    <g fill={color}>
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i} transform={`translate(${i * 20}, 0)`}>
          <path d="M 4 11 Q 10 4 16 11 Q 10 18 4 11 Z" />
          <rect x="9.2" y="9.5" width="3" height="3" transform="rotate(45 10.7 11)" />
        </g>
      ))}
    </g>
    <line x1="0" y1="1" x2="240" y2="1" stroke={color} strokeWidth="0.5" opacity="0.7" />
    <line x1="0" y1="21" x2="240" y2="21" stroke={color} strokeWidth="0.5" opacity="0.7" />
  </svg>
);

/* Mewati Safa (turban) — the traditional white pagri of the Meo community.
   Layered arcs represent the wound fabric; the tail hangs on the right. */
export const BrandMark = ({ size = 44 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    {/* Background circle */}
    <circle cx="32" cy="32" r="30" fill="#004225" stroke="#D4AF37" strokeWidth="1.5"/>

    {/* Turban dome — uppermost part of the safa */}
    <ellipse cx="32" cy="22" rx="14" ry="8" fill="#D4AF37"/>

    {/* Wound fabric layers — each arc is one wrap of the safa */}
    <path d="M 16 28 Q 32 23 48 28" stroke="#D4AF37" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <path d="M 17 33 Q 32 28 47 33" stroke="#F5F5DC" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M 18 37.5 Q 32 33 46 37.5" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

    {/* Rim band at base of turban */}
    <path d="M 17 41 Q 32 38 47 41" stroke="#c9a430" strokeWidth="2" fill="none" strokeLinecap="round"/>

    {/* Hanging tail — pallu of the safa draped on the right */}
    <path d="M 47 31 Q 54 38 51 48" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

    {/* Urdu م ق centred on the turban dome */}
    <text x="32" y="26" textAnchor="middle" fontSize="8"
      fontFamily="Noto Nastaliq Urdu, serif" fontWeight="700" fill="#004225">
      م ق
    </text>
  </svg>
);

export const Arrow = ({ dir = 'right', size = 14 }: { dir?: string; size?: number }) => {
  const r = dir === 'right' ? '0' : dir === 'left' ? '180' : dir === 'down' ? '90' : '-90';
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} style={{ transform: `rotate(${r}deg)`, flexShrink: 0 }}>
      <path d="M2 8 L13 8 M9 4 L13 8 L9 12" fill="none" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export const SearchIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size}>
    <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 11 L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const PinIcon = ({ size = 14 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size}>
    <path d="M8 1 L10 3 L13 4 L11 7 L11 11 L8 9 L5 11 L5 7 L3 4 L6 3 Z"
      fill="currentColor"/>
  </svg>
);

export const Trefoil = ({ size = 12, color = '#D4AF37' }) => (
  <svg viewBox="0 0 16 16" width={size} height={size}>
    <g fill={color}>
      <circle cx="8" cy="4" r="2.5"/>
      <circle cx="4" cy="11" r="2.5"/>
      <circle cx="12" cy="11" r="2.5"/>
      <circle cx="8" cy="8" r="1.4"/>
    </g>
  </svg>
);
