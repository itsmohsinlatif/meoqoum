'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GeoPattern, StarKhatim, SearchIcon, Arrow } from '@/components/svg';
import { routing } from '@/config/routing';
import { DIR, type Locale } from '@/data/content';

export default function DirectoryPage({
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
  const d = DIR;

  const [activeFilter, setActiveFilter] = useState<'all' | 'region' | 'era'>('all');
  const [query, setQuery] = useState('');

  const filtered = d.list.filter(g =>
    query === '' ||
    g.name.toLowerCase().includes(query.toLowerCase()) ||
    g.urdu.includes(query)
  );

  const headerBgs = ['var(--emerald-soft)', 'var(--emerald)', 'var(--emerald-deep)'];

  return (
    <div className="mp-root" dir={dir}>
      <Header active="dir" />

      {/* Hero + search */}
      <section style={{
        background: 'linear-gradient(180deg, var(--cream) 0%, var(--cream-warm) 100%)',
        padding: 'clamp(32px,4vw,64px) clamp(20px,5vw,64px) clamp(24px,3vw,32px)',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <span className="mp-eyebrow" style={{ fontFamily: ff }}>{d.eyebrow[locale]}</span>
          <h1 style={{
            fontFamily: ffH, fontSize: 'clamp(36px,4.5vw,56px)',
            marginTop: 14, marginBottom: 16, lineHeight: 1.1,
          }}>
            {d.title[locale]}
          </h1>
          <p style={{ fontSize: 'clamp(14px,1.2vw,17px)', color: 'var(--ink-soft)', maxWidth: 720, lineHeight: 1.7, fontFamily: ff }}>
            {d.sub[locale]}
          </p>

          {/* Search bar */}
          <div style={{
            marginTop: 'clamp(24px,3vw,36px)',
            background: 'var(--paper)',
            border: '1.5px solid var(--emerald)',
            display: 'flex', alignItems: 'center',
            padding: '4px 4px 4px 16px',
            maxWidth: 700, gap: 12,
          }}>
            <div style={{ color: 'var(--emerald)', display: 'flex' }}>
              <SearchIcon size={18} />
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={d.searchPh[locale]}
              style={{
                flex: 1, border: 0, outline: 0, background: 'transparent',
                fontFamily: ff, fontSize: 'clamp(13px,1.1vw,15px)',
                color: 'var(--ink)', padding: '10px 0',
                direction: dir,
              }}
            />
            <button className="mp-btn mp-btn-emerald" style={{
              padding: '10px 18px', fontFamily: ff,
              textTransform: locale === 'en' ? 'uppercase' : 'none',
              letterSpacing: locale === 'en' ? '0.08em' : 0,
            }}>
              {d.searchBtn[locale]}
            </button>
          </div>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            {(Object.entries(d.filters) as [typeof activeFilter, typeof d.filters.all][]).map(([k, v]) => (
              <button key={k} onClick={() => setActiveFilter(k)}
                style={{
                  padding: '8px 16px', fontFamily: ff, fontSize: 13, fontWeight: 500,
                  background: activeFilter === k ? 'var(--emerald)' : 'transparent',
                  color: activeFilter === k ? 'var(--cream)' : 'var(--emerald)',
                  border: '1px solid var(--emerald)',
                  borderRadius: 999, cursor: 'pointer',
                  transition: 'background .15s',
                  minHeight: 44,
                }}>
                {v[locale]}
              </button>
            ))}
            <span style={{
              alignSelf: 'center', fontSize: 12, color: 'var(--ink-mute)',
              marginInlineStart: 12, fontFamily: ff,
            }}>
              {d.shownLabel(filtered.length, locale)}
            </span>
          </div>
        </div>
      </section>

      {/* Gotra grid */}
      <section style={{ background: 'var(--cream)', padding: 'clamp(32px,4vw,48px) clamp(16px,5vw,64px) clamp(56px,7vw,96px)' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'clamp(16px,1.5vw,20px)',
        }}>
          {filtered.map((g, i) => (
            <article key={i} className="mp-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Crest header */}
              <div style={{
                background: headerBgs[i % 3],
                padding: '20px 20px 16px',
                position: 'relative',
                borderBottom: '3px solid var(--gold)',
                color: 'var(--cream)',
                overflow: 'hidden',
              }}>
                <GeoPattern opacity={0.12} color="#D4AF37" size={42} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: ffH, fontSize: 26, color: 'var(--cream)', fontWeight: 500, letterSpacing: '0.01em' }}>
                      {g.name}
                    </div>
                    <div style={{ fontFamily: 'var(--urdu)', fontSize: 18, color: 'var(--gold-light)', marginTop: 2, lineHeight: 1.4 }}>
                      {g.urdu}
                    </div>
                  </div>
                  <StarKhatim size={36} color="#D4AF37" stroke="#F5F5DC" />
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                  {[
                    { label: d.field.region[locale], value: g.region[locale] },
                    { label: d.field.era[locale],    value: g.era[locale] },
                  ].map((item, j) => (
                    <div key={j}>
                      <div style={{
                        fontSize: 10, letterSpacing: locale === 'en' ? '0.16em' : 0,
                        textTransform: locale === 'en' ? 'uppercase' : 'none',
                        color: 'var(--gold-soft)', fontWeight: 600, marginBottom: 4, fontFamily: ff,
                      }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--ink)', fontFamily: ff }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 16, paddingTop: 14, borderTop: '1px solid var(--rule)' }}>
                  {[
                    { n: g.clans,    label: d.field.clans[locale] },
                    { n: g.villages, label: d.field.villages[locale] },
                  ].map((item, j) => (
                    <div key={j} style={{ flex: 1, textAlign: 'center' }}>
                      {j === 1 && <div style={{ position: 'absolute', width: 1, background: 'var(--rule)', alignSelf: 'stretch' }} />}
                      <div style={{ fontFamily: ffH, fontSize: 22, color: 'var(--emerald)', fontWeight: 500 }}>
                        {item.n}
                      </div>
                      <div style={{
                        fontSize: 10, color: 'var(--ink-mute)',
                        letterSpacing: locale === 'en' ? '0.12em' : 0,
                        textTransform: locale === 'en' ? 'uppercase' : 'none',
                        fontFamily: ff,
                      }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <a href="#" style={{
                  marginTop: 'auto', color: 'var(--emerald)', textDecoration: 'none',
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: locale === 'en' ? '0.12em' : 0,
                  textTransform: locale === 'en' ? 'uppercase' : 'none',
                  fontFamily: ff,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  minHeight: 44, alignSelf: 'flex-start',
                }}>
                  {d.field.explore[locale]}
                  <Arrow dir={dir === 'rtl' ? 'left' : 'right'} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}
