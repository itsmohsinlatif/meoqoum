'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Book } from '@/data/books';
import type { Locale } from '@/data/content';

/* ── Types ───────────────────────────────────────────────── */
type Theme = 'day' | 'sepia' | 'warm' | 'night';

const THEMES: Record<Theme, {
  bg: string; toolbarBg: string; toolbarBorder: string;
  toolbarText: string; toolbarMute: string;
  iframeFilter: string;
  epubBody: Record<string, string>;
  label: string;
}> = {
  day: {
    bg: '#ffffff',
    toolbarBg: '#f7f4ef',
    toolbarBorder: '#d4b896',
    toolbarText: '#1a2a1a',
    toolbarMute: '#6a5a40',
    iframeFilter: 'none',
    epubBody: { background: '#ffffff', color: '#1a1a1a', 'line-height': '1.8' },
    label: 'Day',
  },
  sepia: {
    bg: '#f5edd6',
    toolbarBg: '#ede0be',
    toolbarBorder: '#c4a050',
    toolbarText: '#3a2408',
    toolbarMute: '#7a5a28',
    iframeFilter: 'sepia(0.65) contrast(0.9) brightness(1.04)',
    epubBody: { background: '#f5edd6', color: '#3a2408', 'line-height': '1.8' },
    label: 'Sepia',
  },
  warm: {
    bg: '#eef0e8',
    toolbarBg: '#e5e7dc',
    toolbarBorder: '#a8b090',
    toolbarText: '#252818',
    toolbarMute: '#5a6040',
    iframeFilter: 'sepia(0.22) brightness(0.96) saturate(0.85)',
    epubBody: { background: '#eef0e8', color: '#252818', 'line-height': '1.8' },
    label: 'Warm',
  },
  night: {
    bg: '#0f1117',
    toolbarBg: '#181d28',
    toolbarBorder: '#2d3a2d',
    toolbarText: '#ddd5be',
    toolbarMute: '#8a9a8a',
    iframeFilter: 'invert(0.88) hue-rotate(180deg)',
    epubBody: { background: '#0f1117', color: '#ddd5be', 'line-height': '1.8' },
    label: 'Night',
  },
};

const FONT_SIZES = [85, 100, 115, 130, 150];

/* ── Icons ───────────────────────────────────────────────── */
function ThemeIcon({ id }: { id: Theme }) {
  const fills = {
    day:   ['#f9d835', '#fff9e0', '#f9d835'],
    sepia: ['#c4a050', '#f5edd6', '#c4a050'],
    warm:  ['#8aaa70', '#eef0e8', '#8aaa70'],
    night: ['#3a6aff', '#0f1117', '#8899cc'],
  };
  const [border, bg, ray] = fills[id];
  if (id === 'night') return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" fill={bg} stroke={border} strokeWidth="1.5"/>
      <path d="M11 5a5 5 0 0 0-5 5c0 2.76 2.24 5 5 5a5 5 0 0 0 4.5-2.8A6 6 0 0 1 11 5z" fill={ray} opacity="0.8"/>
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="4" fill={bg} stroke={border} strokeWidth="1.5"/>
      {[0,45,90,135,180,225,270,315].map((a,i) => (
        <line key={i} x1={9+Math.cos(a*Math.PI/180)*5.5} y1={9+Math.sin(a*Math.PI/180)*5.5}
          x2={9+Math.cos(a*Math.PI/180)*7.5} y2={9+Math.sin(a*Math.PI/180)*7.5}
          stroke={ray} strokeWidth="1.5" strokeLinecap="round"/>
      ))}
    </svg>
  );
}

function CloseIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 2l12 12M14 2L2 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function DownloadIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v9m0 0L5 7m3 3 3-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12h12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="1" y="10" width="14" height="5" rx="1" fill="none" stroke={color} strokeWidth="1.4"/>
    </svg>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function resolveUrl(book: Book): string {
  if (book.source.type === 'archive') {
    return `https://archive.org/embed/${book.source.id}?ui=embed`;
  }
  if (book.source.type === 'cloudinary' && CLOUD) {
    return `https://res.cloudinary.com/${CLOUD}/raw/upload/${book.source.id}`;
  }
  return book.source.id;
}

function downloadUrl(book: Book): string {
  if (book.source.type === 'archive') {
    return `https://archive.org/download/${book.source.id}`;
  }
  if (book.source.type === 'cloudinary' && CLOUD) {
    return `https://res.cloudinary.com/${CLOUD}/raw/upload/fl_attachment/${book.source.id}`;
  }
  return book.source.id;
}

/* ── ePub Renderer ───────────────────────────────────────── */
function EpubRenderer({
  url,
  theme,
  fontSize,
  isRtl,
}: {
  url: string;
  theme: Theme;
  fontSize: number;
  isRtl: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renditionRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (!containerRef.current) return;
      const { default: ePub } = await import('epubjs');
      if (cancelled) return;

      if (bookRef.current) bookRef.current.destroy();
      containerRef.current.innerHTML = '';

      const epubBook = ePub(url);
      bookRef.current = epubBook;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rendition = epubBook.renderTo(containerRef.current as any, {
        width: '100%',
        height: '100%',
        spread: 'none',
        flow: 'paginated',
      } as object);
      renditionRef.current = rendition;

      Object.entries(THEMES).forEach(([id, t]) => {
        rendition.themes.register(id, { body: t.epubBody, p: { 'line-height': '1.9' } });
      });
      rendition.themes.select(theme);
      rendition.themes.fontSize(`${fontSize}%`);

      await rendition.display();
    }
    init();
    return () => { cancelled = true; };
  }, [url, isRtl]); // only re-mount on URL/direction change

  useEffect(() => {
    if (!renditionRef.current) return;
    renditionRef.current.themes.select(theme);
  }, [theme]);

  useEffect(() => {
    if (!renditionRef.current) return;
    renditionRef.current.themes.fontSize(`${fontSize}%`);
  }, [fontSize]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', background: THEMES[theme].bg }}
    />
  );
}

/* ── Nav buttons for epub ─────────────────────────────────── */
/* ── Main BookReader ─────────────────────────────────────── */
export default function BookReader({
  book,
  locale,
  onClose,
}: {
  book: Book;
  locale: Locale;
  onClose: () => void;
}) {
  const [theme, setTheme]       = useState<Theme>('day');
  const [fontIdx, setFontIdx]   = useState(1);          // index into FONT_SIZES
  const [showControls, setShowControls] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  const t = THEMES[theme];
  const fontSize = FONT_SIZES[fontIdx];
  const isRtl   = book.language.some(l => l === 'ur' || l === 'mew');
  const dir     = locale === 'en' ? 'ltr' : 'rtl';
  const ff      = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const isEpub  = book.source.type === 'epub_url';
  const isPdf   = book.source.type === 'pdf_url' || book.source.type === 'cloudinary';
  const srcUrl  = resolveUrl(book);

  /* close on Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* prevent body scroll while reader is open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const decFont = useCallback(() => setFontIdx(i => Math.max(0, i - 1)), []);
  const incFont = useCallback(() => setFontIdx(i => Math.min(FONT_SIZES.length - 1, i + 1)), []);

  const iframeStyle: React.CSSProperties = {
    flex: 1,
    border: 0,
    width: '100%',
    display: 'block',
    filter: t.iframeFilter,
    background: t.bg,
    minHeight: 0,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 1200,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
        aria-hidden
      />

      {/* Reader panel */}
      <div
        ref={overlayRef}
        dir={dir}
        style={{
          position: 'fixed',
          inset: 'clamp(8px,2vw,32px)',
          zIndex: 1201,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          background: t.bg,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Toolbar ─────────────────────────────────────── */}
        <div
          style={{
            background: t.toolbarBg,
            borderBottom: `2px solid ${t.toolbarBorder}`,
            padding: '0 clamp(10px,2vw,20px)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(6px,1vw,14px)',
            minHeight: 54,
            flexShrink: 0,
            flexWrap: 'wrap',
          }}
        >
          {/* Title block */}
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', padding: '8px 0' }}>
            <div style={{
              fontFamily: isRtl ? 'var(--urdu)' : 'var(--serif)',
              fontSize: 'clamp(13px,1.2vw,17px)',
              color: t.toolbarText,
              lineHeight: 1.25,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {book.title[locale] || book.title.en}
            </div>
            <div style={{
              fontFamily: ff, fontSize: 11,
              color: t.toolbarMute, marginTop: 2,
            }}>
              {book.author} · {book.year}
            </div>
          </div>

          {/* Theme switcher */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
            {(Object.keys(THEMES) as Theme[]).map(id => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                title={THEMES[id].label}
                aria-label={THEMES[id].label}
                style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  border: theme === id
                    ? `2.5px solid ${t.toolbarBorder}`
                    : '2px solid transparent',
                  background: THEMES[id].toolbarBg,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: theme === id ? `0 0 0 2px ${t.toolbarText}22` : 'none',
                  transition: 'box-shadow .15s',
                  padding: 0,
                }}
              >
                <ThemeIcon id={id} />
              </button>
            ))}
          </div>

          {/* Font size */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 2,
            border: `1px solid ${t.toolbarBorder}`,
            borderRadius: 4, overflow: 'hidden', flexShrink: 0,
          }}>
            <button
              onClick={decFont}
              disabled={fontIdx === 0}
              title="Decrease text size"
              style={{
                width: 34, height: 34,
                background: 'transparent',
                border: 0, cursor: fontIdx === 0 ? 'default' : 'pointer',
                color: fontIdx === 0 ? t.toolbarMute : t.toolbarText,
                fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 700,
                opacity: fontIdx === 0 ? 0.4 : 1,
              }}
            >
              A<sup style={{ fontSize: 9 }}>−</sup>
            </button>
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 10,
              color: t.toolbarMute, padding: '0 4px',
              minWidth: 34, textAlign: 'center',
            }}>
              {fontSize}%
            </span>
            <button
              onClick={incFont}
              disabled={fontIdx === FONT_SIZES.length - 1}
              title="Increase text size"
              style={{
                width: 34, height: 34,
                background: 'transparent',
                border: 0, cursor: fontIdx === FONT_SIZES.length - 1 ? 'default' : 'pointer',
                color: fontIdx === FONT_SIZES.length - 1 ? t.toolbarMute : t.toolbarText,
                fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700,
                opacity: fontIdx === FONT_SIZES.length - 1 ? 0.4 : 1,
              }}
            >
              A
            </button>
          </div>



          {/* Close */}
          <button
            onClick={onClose}
            title="Close reader (Esc)"
            style={{
              width: 34, height: 34,
              background: 'transparent',
              border: `1px solid ${t.toolbarBorder}`,
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.toolbarText,
              flexShrink: 0,
            }}
          >
            <CloseIcon color={t.toolbarText} />
          </button>
        </div>

        {/* ── Reading area ─────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            background: t.bg,
            overflow: 'hidden',
          }}
        >
          {isEpub ? (
            <EpubRenderer
              url={book.source.id}
              theme={theme}
              fontSize={fontSize}
              isRtl={isRtl}
            />
          ) : isPdf ? (
            /* PDF: served through /api/pdf proxy which sets inline headers + CORS */
            <iframe
              key={`${book.id}-${theme}`}
              src={`/api/pdf?url=${encodeURIComponent(srcUrl)}`}
              title={book.title.en}
              style={iframeStyle}
              allowFullScreen
            />
          ) : (
            /* Archive.org or any other iframe source */
            <iframe
              key={book.id}
              src={srcUrl}
              title={book.title.en}
              style={{ ...iframeStyle }}
              allowFullScreen
            />
          )}
        </div>

        {/* ── Bottom bar ───────────────────────────────────── */}
        <div style={{
          background: t.toolbarBg,
          borderTop: `1px solid ${t.toolbarBorder}`,
          padding: '7px clamp(10px,2vw,20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: 8,
          minHeight: 36,
        }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 10, color: t.toolbarMute }}>
            {book.source.type === 'archive'
              ? 'Source: Internet Archive (archive.org)'
              : book.source.type === 'epub_url'
              ? 'Format: ePub'
              : 'Format: PDF'}
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Theme label */}
            <span style={{ fontFamily: 'var(--sans)', fontSize: 10, color: t.toolbarMute }}>
              {THEMES[theme].label}
            </span>
            {/* Mobile hide controls button */}
            <button
              onClick={() => setShowControls(v => !v)}
              style={{
                display: 'none',  /* shown via mobile class below */
                fontFamily: 'var(--sans)', fontSize: 10,
                background: 'transparent', border: 0, cursor: 'pointer',
                color: t.toolbarMute,
              }}
            >
              {showControls ? '▲ Hide' : '▼ Controls'}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 480px) {
          .book-reader-title { font-size: 13px !important; }
        }
      `}</style>
    </>
  );
}
