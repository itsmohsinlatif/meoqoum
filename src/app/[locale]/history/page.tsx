'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GeoPattern, RajputBorder, Arrow } from '@/components/svg';
import { routing } from '@/config/routing';
import { HISTORY, type Locale } from '@/data/content';

export default function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = use(params);
  if (!routing.locales.includes(rawLocale as (typeof routing.locales)[number])) notFound();
  const locale = rawLocale as Locale;

  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const ffH = locale === 'en' ? 'var(--serif)' : 'var(--urdu)';
  const h = HISTORY;

  const [active, setActive] = useState(2);

  return (
    <div className="mp-root" dir={dir}>
      <Header active="history" />

      {/* Hero band */}
      <section style={{
        background: 'var(--emerald)',
        color: 'var(--cream)',
        padding: 'clamp(40px,5.5vw,72px) clamp(20px,5vw,64px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <GeoPattern opacity={0.10} color="#D4AF37" size={80} />
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <span className="mp-eyebrow center" style={{ fontFamily: ff, color: 'var(--gold-light)' }}>
            {h.eyebrow[locale]}
          </span>
          <h1 style={{
            fontFamily: ffH, fontSize: 'clamp(36px,4.8vw,60px)',
            color: 'var(--cream)', marginTop: 18, lineHeight: 1.1,
          }}>
            {h.title[locale]}
          </h1>
          <p style={{
            marginTop: 18, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto',
            color: 'rgba(245,245,220,0.85)', fontSize: 'clamp(14px,1.2vw,16px)',
            lineHeight: 1.7, fontFamily: ff,
          }}>
            {h.sub[locale]}
          </p>
        </div>
      </section>

      <RajputBorder height={22} />

      {/* TIMELINE */}
      <section style={{
        background: 'var(--cream)',
        padding: 'clamp(40px,5vw,80px) clamp(20px,5vw,64px)',
        position: 'relative',
      }}>
        {/* Desktop: horizontal scrubber */}
        <div className="timeline-desktop" style={{ maxWidth: 1100, margin: '0 auto 56px', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 24,
            height: 2, background: 'var(--gold-soft)', opacity: 0.4,
          }} />
          <div style={{
            position: 'absolute', left: 0, top: 24,
            width: `${((active + 1) / h.eras.length) * 100}%`,
            height: 2, background: 'var(--gold)',
            transition: 'width .3s',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {h.eras.map((era, i) => (
              <button key={i} onClick={() => setActive(i)}
                style={{
                  background: 'transparent', border: 0, cursor: 'pointer', padding: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  color: i === active ? 'var(--emerald-deep)' : 'var(--ink-mute)',
                  fontFamily: ff, minWidth: 44, minHeight: 44,
                }}>
                <div style={{
                  width: i === active ? 18 : 10,
                  height: i === active ? 18 : 10,
                  borderRadius: i === active ? 0 : '50%',
                  transform: i === active ? 'rotate(45deg)' : 'none',
                  background: i <= active ? 'var(--gold)' : 'var(--cream-deep)',
                  border: i === active ? '2px solid var(--emerald-deep)' : '2px solid var(--gold-soft)',
                  transition: 'all .25s',
                  marginTop: i === active ? 16 : 19,
                }} />
                <div style={{
                  fontSize: 12, fontWeight: 600,
                  color: i === active ? 'var(--emerald)' : 'var(--ink-mute)',
                  fontFamily: locale === 'en' ? 'var(--sans)' : 'var(--urdu)',
                }}>
                  {era.year}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: featured chapter + side list */}
        <div className="timeline-desktop" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 56,
        }}>
          {/* Active chapter card */}
          <div>
            <div style={{
              position: 'relative', height: 320, marginBottom: 28,
              background: 'linear-gradient(135deg, #b8a378 0%, #6b5a3a 100%)',
              border: '1px solid var(--rule)', overflow: 'hidden',
            }}>
              <GeoPattern opacity={0.18} color="#F5F5DC" size={56} />
              <div style={{ position: 'absolute', inset: 16, border: '1px solid rgba(245,245,220,0.4)' }} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--serif)', fontSize: 'clamp(64px,7vw,96px)',
                  color: 'rgba(245,245,220,0.95)', fontWeight: 500, letterSpacing: '-0.02em',
                }}>
                  {h.eras[active].year}
                </div>
              </div>
              <div style={{
                position: 'absolute',
                [dir === 'rtl' ? 'right' : 'left']: 20,
                bottom: 16,
                fontSize: 10, letterSpacing: locale === 'en' ? '0.16em' : 0,
                textTransform: locale === 'en' ? 'uppercase' : 'none',
                color: 'rgba(245,245,220,0.85)', fontFamily: ff,
              }}>
                {h.chapterOf(active + 1, h.eras.length, locale)}
              </div>
            </div>

            <span className="mp-eyebrow" style={{ fontFamily: ff }}>
              {h.eras[active].year}
            </span>
            <h2 style={{ fontFamily: ffH, fontSize: 'clamp(28px,3vw,40px)', marginTop: 12, marginBottom: 18, lineHeight: 1.15 }}>
              {h.eras[active].t[locale]}
            </h2>
            <p style={{ fontSize: 'clamp(15px,1.3vw,17px)', lineHeight: 1.75, color: 'var(--ink-soft)', fontFamily: ff, maxWidth: 580 }}>
              {h.eras[active].d[locale]}
            </p>

            {/* Prev/Next */}
            <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
              <button onClick={() => setActive(Math.max(0, active - 1))}
                className="mp-btn mp-btn-ghost"
                style={{
                  fontFamily: ff,
                  textTransform: locale === 'en' ? 'uppercase' : 'none',
                  letterSpacing: locale === 'en' ? '0.08em' : 0,
                  opacity: active === 0 ? 0.4 : 1,
                }}>
                <Arrow dir={dir === 'rtl' ? 'right' : 'left'} />
                {h.prevEra[locale]}
              </button>
              <button onClick={() => setActive(Math.min(h.eras.length - 1, active + 1))}
                className="mp-btn mp-btn-emerald"
                style={{
                  fontFamily: ff,
                  textTransform: locale === 'en' ? 'uppercase' : 'none',
                  letterSpacing: locale === 'en' ? '0.08em' : 0,
                }}>
                {h.nextEra[locale]}
                <Arrow dir={dir === 'rtl' ? 'left' : 'right'} />
              </button>
            </div>
          </div>

          {/* Side chapter list */}
          <div>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: 24 }}>
              <h4 style={{
                fontFamily: ff, fontSize: 12,
                letterSpacing: locale === 'en' ? '0.18em' : 0,
                textTransform: locale === 'en' ? 'uppercase' : 'none',
                color: 'var(--gold-soft)', fontWeight: 600, marginBottom: 16,
              }}>
                {h.allChapters[locale]}
              </h4>
              {h.eras.map((era, i) => (
                <button key={i} onClick={() => setActive(i)}
                  style={{
                    display: 'block', width: '100%',
                    textAlign: dir === 'rtl' ? 'right' : 'left',
                    background: i === active ? 'var(--emerald)' : 'transparent',
                    color: i === active ? 'var(--cream)' : 'var(--ink)',
                    border: 0, padding: '14px',
                    cursor: 'pointer',
                    borderBottom: i < h.eras.length - 1 ? '1px solid var(--rule)' : 'none',
                    fontFamily: ff,
                    transition: 'background .15s',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontSize: 15, fontWeight: 500, fontFamily: ffH, lineHeight: 1.3 }}>
                      {era.t[locale]}
                    </span>
                    <span style={{
                      fontSize: 12,
                      color: i === active ? 'var(--gold-light)' : 'var(--gold-soft)',
                      fontWeight: 600, whiteSpace: 'nowrap',
                    }}>
                      {era.year}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="timeline-mobile" style={{
          maxWidth: 1100, margin: '0 auto',
          position: 'relative',
          paddingLeft: dir === 'rtl' ? 0 : 28,
          paddingRight: dir === 'rtl' ? 28 : 0,
        }}>
          <div style={{
            position: 'absolute',
            [dir === 'rtl' ? 'right' : 'left']: 7,
            top: 8, bottom: 8, width: 2,
            background: 'var(--gold-soft)', opacity: 0.4,
          }} />
          {h.eras.map((era, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 32 }}
              onClick={() => setActive(i)}>
              <div style={{
                position: 'absolute',
                [dir === 'rtl' ? 'right' : 'left']: -22,
                top: 6, width: 14, height: 14,
                background: i <= active ? 'var(--gold)' : 'var(--cream-deep)',
                border: '2px solid var(--emerald)',
                transform: 'rotate(45deg)',
                cursor: 'pointer',
              }} />
              <div style={{
                fontFamily: locale === 'en' ? 'var(--sans)' : 'var(--urdu)',
                fontSize: 12, color: 'var(--gold-soft)',
                fontWeight: 600, letterSpacing: locale === 'en' ? '0.1em' : 0,
              }}>
                {era.year}
              </div>
              <h3 style={{ fontFamily: ffH, fontSize: 20, marginTop: 4, marginBottom: 8 }}>
                {era.t[locale]}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-soft)', fontFamily: ff }}>
                {era.d[locale]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer locale={locale} />

      <style>{`
        @media (min-width: 769px) { .timeline-mobile { display: none !important; } }
        @media (max-width: 768px) { .timeline-desktop { display: none !important; } }
      `}</style>
    </div>
  );
}
