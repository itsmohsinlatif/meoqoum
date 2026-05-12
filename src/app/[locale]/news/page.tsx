import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PinIcon, Arrow } from '@/components/svg';
import { routing } from '@/config/routing';
import { NEWS, type Locale } from '@/data/content';
import { createClient } from '@supabase/supabase-js';

const DEMO = 'https://res.cloudinary.com/demo/image/upload';
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function getServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type DbArticle = {
  id: string; slug: string;
  title_en: string; title_ur: string; title_mew: string;
  excerpt_en: string; excerpt_ur: string; excerpt_mew: string;
  category: string; cover_id: string | null;
  author: string; read_min: number | null;
  is_pinned: boolean; published_at: string;
};

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!routing.locales.includes(rawLocale as (typeof routing.locales)[number])) notFound();
  const locale = rawLocale as Locale;

  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const ffH = locale === 'en' ? 'var(--serif)' : 'var(--urdu)';
  const n = NEWS;

  /* Fetch DB articles — falls back to static on error */
  let dbFeed: DbArticle[] = [];
  try {
    const sb = getServerSupabase();
    const { data } = await sb
      .from('articles')
      .select('id,slug,title_en,title_ur,title_mew,excerpt_en,excerpt_ur,excerpt_mew,category,cover_id,author,read_min,is_pinned,published_at')
      .eq('is_published', true)
      .eq('is_pinned', false)
      .order('published_at', { ascending: false })
      .limit(12);
    if (data && data.length > 0) dbFeed = data as DbArticle[];
  } catch { /* use static fallback */ }

  const pinnedColors: Record<string, { bg: string; fg: string }> = {
    Gathering: { bg: 'var(--emerald)',      fg: 'var(--gold-light)' },
    Obituary:  { bg: 'var(--ink)',          fg: 'var(--cream-deep)' },
    Wedding:   { bg: 'var(--gold)',         fg: 'var(--emerald-deep)' },
    Notice:    { bg: 'var(--emerald-soft)', fg: 'var(--gold-light)' },
  };

  const feedBgs = [
    'linear-gradient(135deg, #c8b88a, #7a6840)',
    'linear-gradient(135deg, #5a7d5d, #2d4a30)',
    'linear-gradient(135deg, #b08555, #6b4a28)',
  ];

  return (
    <div className="mp-root" dir={dir}>
      <Header active="news" />

      {/* Hero */}
      <section style={{
        background: 'var(--cream)',
        padding: 'clamp(32px,4vw,64px) clamp(20px,5vw,64px) clamp(24px,3vw,40px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <span className="mp-eyebrow" style={{ fontFamily: ff }}>{n.eyebrow[locale]}</span>
          <h1 style={{
            fontFamily: ffH, fontSize: 'clamp(36px,4.5vw,56px)',
            marginTop: 14, lineHeight: 1.1, maxWidth: 800,
          }}>
            {n.title[locale]}
          </h1>
        </div>
      </section>

      {/* Pinned community board */}
      <section style={{
        background: 'var(--paper)',
        padding: 'clamp(24px,3vw,32px) clamp(16px,5vw,64px) clamp(40px,5vw,64px)',
        borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, color: 'var(--gold-soft)' }}>
            <PinIcon size={14} />
            <h3 style={{
              fontFamily: ff, fontSize: 12,
              letterSpacing: locale === 'en' ? '0.18em' : 0,
              textTransform: locale === 'en' ? 'uppercase' : 'none',
              color: 'var(--gold-soft)', fontWeight: 600, margin: 0,
            }}>
              {n.pinnedTitle[locale]}
            </h3>
            <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'clamp(12px,1.5vw,16px)',
          }}>
            {n.pinned.map((p, i) => {
              const c = pinnedColors[p.kind.en] || pinnedColors.Notice;
              return (
                <div key={i} className="mp-card" style={{ display: 'flex', overflow: 'hidden', background: 'var(--cream)' }}>
                  {/* Colored tag panel */}
                  <div style={{
                    width: 96, flexShrink: 0,
                    background: c.bg, color: c.fg,
                    padding: '16px 8px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', gap: 8,
                    borderInlineEnd: '2px solid var(--gold)',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <PinIcon size={12} />
                    </div>
                    <div style={{
                      fontSize: 10, fontFamily: ff, fontWeight: 600,
                      letterSpacing: locale === 'en' ? '0.14em' : 0,
                      textTransform: locale === 'en' ? 'uppercase' : 'none',
                    }}>
                      {p.kind[locale]}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '16px 18px', flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--sans)', marginBottom: 6, letterSpacing: '0.04em' }}>
                      {p.date}
                    </div>
                    <div style={{
                      fontFamily: ffH, fontSize: 'clamp(15px,1.3vw,18px)',
                      fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 6,
                    }}>
                      {p.t[locale]}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontFamily: ff }}>
                      {p.place[locale]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Long Reads feed */}
      <section style={{
        background: 'var(--cream)',
        padding: 'clamp(40px,5vw,72px) clamp(16px,5vw,64px) clamp(56px,7vw,96px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 36 }}>
            <h2 style={{ fontFamily: ffH, fontSize: 'clamp(28px,3vw,40px)' }}>
              {n.feedTitle[locale]}
            </h2>
            <div style={{ flex: 1, height: 1, background: 'var(--gold-soft)', opacity: 0.5 }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'clamp(20px,2vw,24px)',
          }}>
            {(dbFeed.length > 0 ? dbFeed.map((a, i) => {
              const title   = locale === 'en' ? a.title_en   : locale === 'ur' ? a.title_ur   : a.title_mew   || a.title_en;
              const excerpt = locale === 'en' ? a.excerpt_en : locale === 'ur' ? a.excerpt_ur : a.excerpt_mew || a.excerpt_en;
              const date    = new Date(a.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
              const coverSrc = a.cover_id && CLOUD
                ? `https://res.cloudinary.com/${CLOUD}/image/upload/w_600,h_280,c_fill,q_auto,f_auto/${a.cover_id}`
                : null;
              return (
                <article key={a.id} className="mp-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 'clamp(180px,17vw,220px)', position: 'relative', overflow: 'hidden', background: feedBgs[i % feedBgs.length] }}>
                    {coverSrc && <Image src={coverSrc} alt={title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 400px" />}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,15,8,0.55) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', insetInlineStart: 14, top: 14, background: 'var(--cream)', color: 'var(--emerald)', padding: '4px 10px', fontSize: 10, fontWeight: 600, letterSpacing: locale === 'en' ? '0.14em' : 0, textTransform: locale === 'en' ? 'uppercase' : 'none', fontFamily: ff, zIndex: 2 }}>
                      {a.category}
                    </div>
                  </div>
                  <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginBottom: 10, fontFamily: 'var(--sans)' }}>
                      {date}{a.read_min ? ` · ${a.read_min} min read` : ''}
                    </div>
                    <h3 style={{ fontFamily: ffH, fontSize: 'clamp(18px,1.7vw,22px)', lineHeight: 1.25, marginBottom: 12, fontWeight: 500 }}>{title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: 18, fontFamily: ff }}>{excerpt}</p>
                    <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontFamily: ff }}>{a.author}</span>
                      <span style={{ color: 'var(--emerald)', fontSize: 11, fontWeight: 600, fontFamily: ff, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {n.readBtn[locale]} <Arrow dir={dir === 'rtl' ? 'left' : 'right'} />
                      </span>
                    </div>
                  </div>
                </article>
              );
            }) : n.feed.map((a, i) => (
              <article key={i} className="mp-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 'clamp(180px,17vw,220px)', position: 'relative', overflow: 'hidden', background: feedBgs[i % feedBgs.length] }}>
                  {(a as { img?: string }).img && (
                    <Image src={`${DEMO}/w_600,h_280,c_fill,q_auto,f_auto/${(a as { img?: string }).img}`} alt={a.t.en} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 400px" />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,15,8,0.55) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', insetInlineStart: 14, top: 14, background: 'var(--cream)', color: 'var(--emerald)', padding: '4px 10px', fontSize: 10, fontWeight: 600, letterSpacing: locale === 'en' ? '0.14em' : 0, textTransform: locale === 'en' ? 'uppercase' : 'none', fontFamily: ff, zIndex: 2 }}>{a.cat[locale]}</div>
                </div>
                <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginBottom: 10, fontFamily: 'var(--sans)' }}>{a.date} · <span style={{ color: 'var(--gold-soft)' }}>{a.read[locale]}</span></div>
                  <h3 style={{ fontFamily: ffH, fontSize: 'clamp(18px,1.7vw,22px)', lineHeight: 1.25, marginBottom: 12, fontWeight: 500 }}>{a.t[locale]}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: 18, fontFamily: ff }}>{a.ex[locale]}</p>
                  <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontFamily: ff }}>{a.author}</span>
                    <span style={{ color: 'var(--emerald)', fontSize: 11, fontWeight: 600, fontFamily: ff, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{n.readBtn[locale]} <Arrow dir={dir === 'rtl' ? 'left' : 'right'} /></span>
                  </div>
                </div>
              </article>
            )))}

          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}
