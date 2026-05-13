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

/* Mewati Safa (white pagri) — faithful to the traditional Meo turban:
   diagonal wound folds across a dome, with a pleated fan (shikra) at top-right. */
export const BrandMark = ({ size = 44 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Meo Qoum">
    <defs>
      {/* Clip fold lines to the dome shape */}
      <clipPath id="bm-dome">
        <path d="M 12 47 C 10 36 11 24 19 17 C 24 12 31 11 31 11 C 31 11 43 11 48 23 C 53 33 51 47 51 47 Z" />
      </clipPath>
    </defs>

    {/* Emerald background */}
    <circle cx="32" cy="32" r="30" fill="#004225" />

    {/* ── Turban dome body ── */}
    <path d="M 12 47 C 10 36 11 24 19 17 C 24 12 31 11 31 11 C 31 11 43 11 48 23 C 53 33 51 47 51 47 Z"
      fill="#e4e1db" />

    {/* Diagonal wound-fabric fold lines, clipped to dome */}
    <g clipPath="url(#bm-dome)" stroke="#8c8986" strokeWidth="2.2">
      <line x1="1"  y1="54" x2="35" y2="7"  />
      <line x1="10" y1="56" x2="44" y2="8"  />
      <line x1="19" y1="56" x2="53" y2="10" />
      <line x1="28" y1="56" x2="61" y2="12" />
      <line x1="36" y1="56" x2="67" y2="14" />
    </g>

    {/* ── Fan / shikra — pleated crest at top-right ── */}
    {/* Alternating light/dark wedge segments radiating from (45, 25) */}
    <path d="M 45 25 L 37 10 L 40 9  Z" fill="#ccc8c2" />
    <path d="M 45 25 L 40 9  L 43 8  Z" fill="#e4e1db" />
    <path d="M 45 25 L 43 8  L 47 8  Z" fill="#ccc8c2" />
    <path d="M 45 25 L 47 8  L 50 9  Z" fill="#e4e1db" />
    <path d="M 45 25 L 50 9  L 53 12 Z" fill="#ccc8c2" />
    <path d="M 45 25 L 53 12 L 55 16 Z" fill="#e4e1db" />
    <path d="M 45 25 L 55 16 L 55 21 Z" fill="#ccc8c2" />
    {/* Divider lines between fan segments */}
    <g stroke="#8c8986" strokeWidth="0.9" strokeLinecap="round">
      <line x1="45" y1="25" x2="37" y2="10" />
      <line x1="45" y1="25" x2="40" y2="9"  />
      <line x1="45" y1="25" x2="43" y2="8"  />
      <line x1="45" y1="25" x2="47" y2="8"  />
      <line x1="45" y1="25" x2="50" y2="9"  />
      <line x1="45" y1="25" x2="53" y2="12" />
      <line x1="45" y1="25" x2="55" y2="16" />
      <line x1="45" y1="25" x2="55" y2="21" />
    </g>

    {/* ── Urdu م ق on dome ── */}
    <text x="27" y="37" textAnchor="middle" fontSize="9"
      fontFamily="Noto Nastaliq Urdu, serif" fontWeight="700" fill="#D4AF37">
      م ق
    </text>

    {/* Gold border ring — painted last to cleanly cap any overflow */}
    <circle cx="32" cy="32" r="30" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
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
