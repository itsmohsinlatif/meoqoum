'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/data/content';

/* ── Data ───────────────────────────────────────────────── */
export type MapLocation = {
  id: string;
  name: string;
  nameUr: string;
  region: string;
  country: 'IN' | 'PK';
  lat: number;
  lng: number;
  population: number;
  note?: string;
  noteUr?: string;
  censusYear: number;
};

export const MAP_LOCATIONS: MapLocation[] = [
  /* ── INDIA ─────────────────────────────────────── */
  {
    id: 'mewat-nuh',
    name: 'Nuh / Mewat District',
    nameUr: 'نوح / میوات ضلع',
    region: 'Haryana, India',
    country: 'IN',
    lat: 28.10, lng: 77.02,
    population: 620000,
    censusYear: 2011,
    note: 'Core Mewat heartland — largest single concentration of Mewati speakers',
    noteUr: 'میوات کا مرکزی خطہ — میواتی بولنے والوں کی سب سے بڑی آبادی',
  },
  {
    id: 'alwar',
    name: 'Alwar',
    nameUr: 'الور',
    region: 'Rajasthan, India',
    country: 'IN',
    lat: 27.55, lng: 76.61,
    population: 150000,
    censusYear: 2011,
    note: 'Second largest Meo district in India — part of historical Mewat',
    noteUr: 'ہندوستان میں دوسرا بڑا میو ضلع',
  },
  {
    id: 'bharatpur',
    name: 'Bharatpur',
    nameUr: 'بھرتپور',
    region: 'Rajasthan, India',
    country: 'IN',
    lat: 27.21, lng: 77.50,
    population: 86643,
    censusYear: 2011,
    note: 'Eastern edge of historic Mewat; significant Meo villages',
    noteUr: 'تاریخی میوات کا مشرقی حصہ',
  },
  /* ── PAKISTAN ───────────────────────────────────── */
  {
    id: 'kasur',
    name: 'Kasur District',
    nameUr: 'قصور ضلع',
    region: 'Punjab, Pakistan',
    country: 'PK',
    lat: 31.12, lng: 74.45,
    population: 470000,
    censusYear: 2023,
    note: 'Largest Meo settlement in Pakistan — 12% of district population. Home to Qais Muhammad Qasim, the 84-year-old teacher who championed Mewati recognition.',
    noteUr: 'پاکستان میں سب سے بڑی میو آبادی — ضلعی آبادی کا ۱۲٪۔ قیس محمد قاسم کا گھر، جنہوں نے میواتی کو سرکاری شناخت دلانے کی جدوجہد کی۔',
  },
  {
    id: 'lahore',
    name: 'Lahore',
    nameUr: 'لاہور',
    region: 'Punjab, Pakistan',
    country: 'PK',
    lat: 31.55, lng: 74.34,
    population: 250000,
    censusYear: 2023,
    note: '250,000 Meos — many settled in peripheral townships after 1947 Partition',
    noteUr: '۲۵۰,۰۰۰ میو — تقسیم کے بعد نواحی بستیوں میں آباد ہوئے',
  },
  {
    id: 'sialkot',
    name: 'Sialkot & Narowal',
    nameUr: 'سیالکوٹ و نارووال',
    region: 'Punjab, Pakistan',
    country: 'PK',
    lat: 32.49, lng: 74.82,
    population: 25000,
    censusYear: 2023,
    note: 'Combined estimate from article grouping of Sialkot & Narowal districts',
    noteUr: 'سیالکوٹ اور نارووال اضلاع کی مشترکہ تخمینہ آبادی',
  },
  {
    id: 'multan',
    name: 'Multan & Lodhran',
    nameUr: 'ملتان و لودھراں',
    region: 'Punjab, Pakistan',
    country: 'PK',
    lat: 30.16, lng: 71.52,
    population: 25000,
    censusYear: 2023,
    note: 'Combined estimate from article grouping of Multan & Lodhran districts',
    noteUr: 'ملتان اور لودھراں اضلاع کی مشترکہ تخمینہ آبادی',
  },
  {
    id: 'karachi',
    name: 'Karachi',
    nameUr: 'کراچی',
    region: 'Sindh, Pakistan',
    country: 'PK',
    lat: 24.86, lng: 67.01,
    population: 30000,
    censusYear: 2023,
    note: 'Urban diaspora; community maintains Mewati identity through cultural organisations',
    noteUr: 'شہری ڈائسپورا؛ کمیونٹی ثقافتی تنظیموں کے ذریعے میواتی شناخت برقرار رکھتی ہے',
  },
  {
    id: 'mirpurkhas',
    name: 'Mirpurkhas',
    nameUr: 'میرپورخاص',
    region: 'Sindh, Pakistan',
    country: 'PK',
    lat: 25.53, lng: 69.01,
    population: 10000,
    censusYear: 2023,
    note: 'Smaller settlement in interior Sindh — agricultural community',
    noteUr: 'اندرونی سندھ میں چھوٹی بستی',
  },
];

/* ── Helpers ─────────────────────────────────────────────── */
function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return String(n);
}

const MAX_POP = Math.max(...MAP_LOCATIONS.map(l => l.population));

function circleRadius(pop: number, isMobile: boolean): number {
  const max = isMobile ? 45 : 65;
  const min = isMobile ? 10 : 14;
  return Math.max(min, Math.round(Math.sqrt(pop / MAX_POP) * max));
}

/* ── Component ───────────────────────────────────────────── */
export default function MewatiMap({ locale }: { locale: Locale }) {
  const mapRef       = useRef<HTMLDivElement>(null);
  const leafletRef   = useRef<unknown>(null);
  const [selected, setSelected]   = useState<MapLocation | null>(null);
  const [isMobile, setIsMobile]   = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    let map: ReturnType<typeof import('leaflet')['map']>;

    async function initMap() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (leafletRef.current) {
        (leafletRef.current as { remove: () => void }).remove();
      }

      map = L.map(mapRef.current!, {
        center: [29.5, 72.5],
        zoom: isMobile ? 4 : 5,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      });

      leafletRef.current = map;

      /* Tile layer — CartoDB Positron (clean, light, no API key) */
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 10,
        }
      ).addTo(map);

      /* Draw circles */
      MAP_LOCATIONS.forEach(loc => {
        const r = circleRadius(loc.population, isMobile);
        const isIndia = loc.country === 'IN';

        const circle = L.circleMarker([loc.lat, loc.lng], {
          radius: r,
          fillColor: isIndia ? '#C9872A' : '#1a5c38',
          color: isIndia ? '#7a4010' : '#0d3a22',
          weight: 2,
          fillOpacity: 0.75,
          opacity: 1,
        }).addTo(map);

        /* Population label */
        const label = L.divIcon({
          className: '',
          html: `<div style="
            font-family:system-ui,sans-serif;
            font-size:${isMobile ? 9 : 10}px;
            font-weight:700;
            color:#fff;
            text-align:center;
            text-shadow:0 1px 3px rgba(0,0,0,0.7);
            pointer-events:none;
            white-space:nowrap;
          ">${fmt(loc.population)}</div>`,
          iconAnchor: [20, 6],
          iconSize: [40, 12],
        });
        L.marker([loc.lat, loc.lng], { icon: label, interactive: false }).addTo(map);

        circle.on('click', () => setSelected(loc));
        circle.on('mouseover', () => circle.setStyle({ fillOpacity: 0.95, weight: 3 }));
        circle.on('mouseout',  () => circle.setStyle({ fillOpacity: 0.75, weight: 2 }));
      });

      /* Border highlight for Mewat region (rough polygon) */
      const mewatBounds: [number, number][] = [
        [28.65, 76.55], [28.65, 77.60], [27.00, 77.80],
        [27.00, 76.10], [27.55, 76.20], [28.65, 76.55],
      ];
      L.polygon(mewatBounds, {
        color: '#C9872A',
        weight: 1.5,
        fillColor: '#C9872A',
        fillOpacity: 0.06,
        dashArray: '5 4',
      }).addTo(map).bindTooltip(
        locale === 'en' ? 'Historic Mewat Region' : 'تاریخی میوات خطہ',
        { permanent: false, direction: 'top' }
      );
    }

    initMap();

    return () => {
      if (leafletRef.current) {
        (leafletRef.current as { remove: () => void }).remove();
        leafletRef.current = null;
      }
    };
  }, [locale, isMobile]);

  /* ── Popup panel ──────────────────────────────── */
  const isRtl = locale !== 'en';
  const ff    = locale === 'en' ? 'system-ui,sans-serif' : 'var(--urdu)';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Map container */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: 'clamp(340px, 55vw, 560px)',
          borderRadius: 6,
          border: '2px solid var(--gold)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      />

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        insetInlineStart: 12,
        background: 'rgba(255,255,255,0.93)',
        border: '1px solid #ddd',
        borderRadius: 4,
        padding: '8px 12px',
        fontSize: 11,
        fontFamily: ff,
        lineHeight: 1.9,
        zIndex: 10,
        backdropFilter: 'blur(4px)',
        pointerEvents: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#C9872A', opacity: 0.8 }} />
          {locale === 'en' ? 'India (2011)' : locale === 'ur' ? 'بھارت (۲۰۱۱)' : 'بھارت (۲۰۱۱)'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#1a5c38', opacity: 0.8 }} />
          {locale === 'en' ? 'Pakistan (2023)' : locale === 'ur' ? 'پاکستان (۲۰۲۳)' : 'پاکستان (۲۰۲۳)'}
        </div>
        <div style={{ color: '#888', marginTop: 2, fontSize: 10 }}>
          {locale === 'en' ? 'Circle size ∝ population' : 'دائرے کا حجم آبادی کے متناسب'}
        </div>
      </div>

      {/* Detail popup */}
      {selected && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          style={{
            position: 'absolute',
            top: 12, insetInlineEnd: 12,
            width: 'clamp(220px,30vw,300px)',
            background: '#fff',
            border: `2px solid ${selected.country === 'IN' ? '#C9872A' : '#1a5c38'}`,
            borderRadius: 6,
            padding: '14px 16px',
            zIndex: 20,
            boxShadow: '0 6px 32px rgba(0,0,0,0.15)',
            fontFamily: ff,
          }}
        >
          <button
            onClick={() => setSelected(null)}
            style={{
              position: 'absolute', top: 8, insetInlineEnd: 8,
              background: 'transparent', border: 0, cursor: 'pointer',
              fontSize: 16, lineHeight: 1, color: '#888', padding: 4,
            }}
          >×</button>

          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: selected.country === 'IN' ? '#C9872A' : '#1a5c38',
            marginBottom: 4,
          }}>
            {selected.country === 'IN' ? '🇮🇳' : '🇵🇰'} {selected.region}
          </div>

          <div style={{ fontSize: 17, fontWeight: 800, color: '#1a2a1a', lineHeight: 1.2, marginBottom: 2 }}>
            {locale === 'en' ? selected.name : selected.nameUr}
          </div>

          <div style={{
            fontSize: 28, fontWeight: 900, lineHeight: 1,
            color: selected.country === 'IN' ? '#C9872A' : '#1a5c38',
            margin: '10px 0 4px',
            fontFamily: 'system-ui,sans-serif',
          }}>
            {selected.population.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>
            {locale === 'en'
              ? `Mewati speakers · ${selected.censusYear} census`
              : `میواتی بولنے والے · ${selected.censusYear} مردم شماری`}
          </div>

          {(locale === 'en' ? selected.note : selected.noteUr) && (
            <p style={{
              fontSize: 12, color: '#444', lineHeight: 1.65,
              borderTop: '1px solid #eee', paddingTop: 10, margin: 0,
            }}>
              {locale === 'en' ? selected.note : selected.noteUr}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
