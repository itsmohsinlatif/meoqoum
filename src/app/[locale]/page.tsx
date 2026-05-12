import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GeoPattern, StarKhatim, Arrow } from '@/components/svg';
import { routing } from '@/config/routing';
import { HOME, type Locale } from '@/data/content';
import Link from 'next/link';
import { cldFetch } from '@/lib/cloudinary';

export default async function HomePage({
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
  const h = HOME;

  return (
    <div className="mp-root" dir={dir}>
      <Header active="home" />

      {/* HERO */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(180deg, var(--cream) 0%, var(--cream-warm) 100%)',
        padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 64px) clamp(56px, 7vw, 96px)',
        overflow: 'hidden',
      }}>
        <GeoPattern opacity={0.07} color="#004225" size={72} />

        <div style={{
          position: 'relative', maxWidth: 1100, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'clamp(280px, 55%, 620px) 1fr',
          gap: 'clamp(32px, 5vw, 64px)',
          alignItems: 'center',
        }}>
          <div>
            <span className="mp-eyebrow" style={{ fontFamily: ff }}>
              {h.eyebrow[locale]}
            </span>
            <h1 style={{
              fontFamily: ffH,
              fontSize: 'clamp(40px, 5.5vw, 68px)',
              lineHeight: 1.05,
              marginTop: 20,
              marginBottom: 24,
              fontWeight: 500,
            }}>
              {h.hero[locale].map((line, i) => (
                <div key={i} style={{
                  color: i === 0 ? 'var(--emerald-deep)' : 'var(--gold-soft)',
                  fontStyle: i === 1 && locale === 'en' ? 'italic' : 'normal',
                }}>
                  {line}
                </div>
              ))}
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 1.2vw, 17px)', lineHeight: 1.7,
              color: 'var(--ink-soft)', maxWidth: 540, marginBottom: 32, fontFamily: ff,
            }}>
              {h.sub[locale]}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={`/${locale}/history`} className="mp-btn mp-btn-emerald" style={{
                fontFamily: ff,
                textTransform: locale === 'en' ? 'uppercase' : 'none',
                letterSpacing: locale === 'en' ? '0.08em' : 0,
              }}>
                {h.ctaPrimary[locale]}
                <Arrow dir={dir === 'rtl' ? 'left' : 'right'} />
              </Link>
              <Link href={`/${locale}/directory`} className="mp-btn mp-btn-ghost" style={{
                fontFamily: ff,
                textTransform: locale === 'en' ? 'uppercase' : 'none',
                letterSpacing: locale === 'en' ? '0.08em' : 0,
              }}>
                {h.ctaSecondary[locale]}
              </Link>
            </div>
          </div>

          {/* Hero ornament — arch with star medallion (hidden on small screens) */}
          <div style={{
            position: 'relative', height: 480,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
            className="hero-arch"
          >
            <svg viewBox="0 0 400 520" width="100%" height="100%">
              <defs>
                <linearGradient id="arch-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#004225"/>
                  <stop offset="1" stopColor="#003319"/>
                </linearGradient>
              </defs>
              <rect x="20" y="20" width="360" height="480" fill="none" stroke="#D4AF37" strokeWidth="1.5"/>
              <rect x="28" y="28" width="344" height="464" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6"/>
              {([[28,28],[372,28],[28,492],[372,492]] as [number,number][]).map(([x,y],i) => (
                <g key={i} transform={`translate(${x},${y})`}>
                  <circle r="6" fill="#D4AF37"/>
                  <circle r="2.5" fill="#004225"/>
                </g>
              ))}
              <path d="M 50 480 L 50 240 Q 50 100 200 60 Q 350 100 350 240 L 350 480 Z"
                fill="url(#arch-fill)" stroke="#D4AF37" strokeWidth="2"/>
              <path d="M 65 470 L 65 245 Q 65 115 200 78 Q 335 115 335 245 L 335 470 Z"
                fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5"/>
              <g transform="translate(200,260)">
                <polygon points="0,-90 64,-64 90,0 64,64 0,90 -64,64 -90,0 -64,-64"
                  fill="#D4AF37" opacity="0.95"/>
                <polygon points="0,-90 64,-64 90,0 64,64 0,90 -64,64 -90,0 -64,-64"
                  transform="rotate(22.5)" fill="none" stroke="#F5F5DC" strokeWidth="1.2"/>
                <circle r="22" fill="#003319"/>
                <circle r="14" fill="none" stroke="#D4AF37" strokeWidth="1"/>
                <text y="5" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
                  fontSize="18" fill="#D4AF37" fontWeight="600">م ق</text>
              </g>
              <text x="200" y="400" textAnchor="middle"
                fontFamily="Noto Nastaliq Urdu, serif" fontSize="22" fill="#D4AF37">
                میوات کی قوم
              </text>
              <line x1="100" y1="420" x2="300" y2="420" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5"/>
              <text x="200" y="445" textAnchor="middle"
                fontFamily="Cormorant Garamond, serif" fontSize="11" fill="#D4AF37" letterSpacing="0.3em">
                EST · MMXXVI
              </text>
            </svg>
          </div>
        </div>
      </section>

      <div className="mp-geo-strip" />

      {/* STATS */}
      <section style={{ background: 'var(--paper)', padding: 'clamp(40px,5vw,64px) clamp(20px,5vw,64px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span className="mp-eyebrow center" style={{ fontFamily: ff }}>
              {h.statsTitle[locale]}
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 8,
          }}>
            {h.stats.map((s, i) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: 'clamp(16px,2vw,24px) 16px',
                borderRight: i < 3 ? '1px solid var(--rule)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(40px,4.5vw,56px)',
                  color: 'var(--emerald)', fontWeight: 500, lineHeight: 1,
                }}>
                  {s.n}
                </div>
                <div style={{ height: 1, width: 24, background: 'var(--gold)', margin: '8px auto' }}/>
                <div style={{
                  fontSize: 'clamp(11px,1vw,13px)', color: 'var(--ink-soft)',
                  letterSpacing: locale === 'en' ? '0.08em' : 0,
                  textTransform: locale === 'en' ? 'uppercase' : 'none',
                  fontFamily: ff, fontWeight: 500,
                }}>
                  {s.l[locale]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section style={{
        background: 'var(--cream)',
        padding: 'clamp(56px,7vw,96px) clamp(20px,5vw,64px)',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="mp-eyebrow center" style={{ fontFamily: ff }}>
              {h.pillarsEyebrow[locale]}
            </span>
            <h2 style={{
              fontFamily: ffH, fontSize: 'clamp(32px,3.8vw,48px)',
              marginTop: 16, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto',
            }}>
              {h.pillarsTitle[locale]}
            </h2>
            <div className="mp-rule-diamond"><span /></div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(24px,2.5vw,32px)',
          }}>
            {h.pillars.map((p, i) => (
              <div key={i} className="mp-card" style={{
                padding: 'clamp(24px,2.5vw,32px)',
                background: i === 1 ? 'var(--emerald)' : 'var(--paper)',
                color: i === 1 ? 'var(--cream)' : 'var(--ink)',
              }}>
                <div style={{ marginBottom: 20 }}>
                  <StarKhatim size={36} color="#D4AF37" stroke={i === 1 ? '#F5F5DC' : '#004225'} />
                </div>
                <h3 style={{
                  fontFamily: ffH, fontSize: 'clamp(22px,2vw,28px)',
                  color: i === 1 ? 'var(--gold-light)' : 'var(--emerald-deep)',
                  marginBottom: 12,
                }}>
                  {p.t[locale]}
                </h3>
                <p style={{
                  fontSize: 15, lineHeight: 1.7,
                  color: i === 1 ? 'rgba(245,245,220,0.85)' : 'var(--ink-soft)',
                  fontFamily: ff,
                }}>
                  {p.d[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ARCHIVE */}
      <section style={{
        background: 'var(--paper)',
        padding: 'clamp(56px,7vw,96px) clamp(20px,5vw,64px)',
        borderTop: '1px solid var(--rule)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 36,
          }}>
            <div>
              <span className="mp-eyebrow" style={{ fontFamily: ff }}>
                {h.featuredEyebrow[locale]}
              </span>
              <h2 style={{ fontFamily: ffH, fontSize: 'clamp(28px,3vw,40px)', marginTop: 12, maxWidth: 600 }}>
                {h.featuredTitle[locale]}
              </h2>
            </div>
            <a href="#" style={{
              color: 'var(--emerald)', textDecoration: 'none',
              fontSize: 13, fontWeight: 600,
              letterSpacing: locale === 'en' ? '0.1em' : 0,
              textTransform: locale === 'en' ? 'uppercase' : 'none',
              fontFamily: ff,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {h.viewArchive[locale]}
              <Arrow dir={dir === 'rtl' ? 'left' : 'right'} />
            </a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(20px,2vw,24px)',
          }}>
            {/* Big card — Alwar Fort photograph (public domain via Wikimedia) */}
            <div className="mp-card mp-photo" style={{
              gridColumn: 'span 1',
              height: 'clamp(260px, 30vw, 380px)',
              padding: 0,
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              overflow: 'hidden',
              position: 'relative',
              color: 'var(--cream)',
            }}>
              <Image
                src={cldFetch(
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Alwar_City_Palace_facade.jpg/1280px-Alwar_City_Palace_facade.jpg',
                  { w: 800, q: 'auto' }
                )}
                alt="Alwar City Palace, Mewat region"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,20,10,0.85) 0%, rgba(0,20,10,0.1) 55%)',
              }} />
              <div style={{ position: 'relative', zIndex: 2, padding: 24 }}>
                <span style={{
                  fontSize: 11,
                  letterSpacing: locale === 'en' ? '0.18em' : 0,
                  textTransform: locale === 'en' ? 'uppercase' : 'none',
                  color: 'var(--gold-light)', fontFamily: ff,
                }}>
                  {locale === 'en' ? 'Photo · Alwar City Palace, Mewat' :
                   locale === 'ur' ? 'تصویر · الور شاہی محل، میوات' :
                   'تصویر · الور شاہی محل، میوات'}
                </span>
                <h3 style={{
                  fontFamily: ffH, fontSize: 'clamp(22px,2.5vw,30px)',
                  color: 'var(--cream)', marginTop: 8, lineHeight: 1.2,
                }}>
                  {locale === 'en' ? 'The frontier kingdoms of Mewat' :
                   locale === 'ur' ? 'میوات کی سرحدی ریاستیں' :
                   'میوات کی سرحدی ریاستاں'}
                </h3>
              </div>
            </div>

            {/* Smaller cards */}
            {[
              {
                tag: locale === 'en' ? 'Manuscript' : locale === 'ur' ? 'نسخہ' : 'نسخو',
                title: locale === 'en' ? 'A panchayat record from 1842' :
                       locale === 'ur' ? '1842 کی پنچایت کی بہی' :
                       '1842 کی پنچائت کی بہی',
                imgSrc: cldFetch(
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Facsimile_of_ancient_manuscript.jpg/800px-Facsimile_of_ancient_manuscript.jpg',
                  { w: 500, q: 'auto' }
                ),
                imgAlt: 'Ancient manuscript',
                fallbackBg: 'linear-gradient(135deg, #d6c590, #a89060)',
              },
              {
                tag: locale === 'en' ? 'Landscape · Mewat' :
                     locale === 'ur' ? 'منظر · میوات' : 'منظر · میوات',
                title: locale === 'en' ? 'Fields of the Aravalli foothills' :
                       locale === 'ur' ? 'اراولی کی تلہٹی کے کھیت' :
                       'اراولی کی تلہٹی کے کھیت',
                imgSrc: cldFetch(
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Aravalli_hills_Rajasthan_India.jpg/1280px-Aravalli_hills_Rajasthan_India.jpg',
                  { w: 500, q: 'auto' }
                ),
                imgAlt: 'Aravalli hills, Rajasthan — heartland of Mewat',
                fallbackBg: 'linear-gradient(135deg, #5a7d5d, #2d4a30)',
              },
            ].map((card, i) => (
              <div key={i} className="mp-card" style={{
                height: 'clamp(220px, 25vw, 380px)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                  <Image
                    src={card.imgSrc}
                    alt={card.imgAlt}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: card.fallbackBg,
                    zIndex: -1,
                  }} />
                </div>
                <div style={{ padding: 18, borderTop: '3px solid var(--gold)', background: 'var(--paper)' }}>
                  <span style={{
                    fontSize: 10,
                    letterSpacing: locale === 'en' ? '0.18em' : 0,
                    textTransform: locale === 'en' ? 'uppercase' : 'none',
                    color: 'var(--gold-soft)', fontWeight: 600, fontFamily: ff,
                  }}>
                    {card.tag}
                  </span>
                  <h4 style={{ fontFamily: ffH, fontSize: 18, marginTop: 6, lineHeight: 1.3 }}>
                    {card.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer locale={locale} />

      <style>{`
        @media (max-width: 768px) {
          .hero-arch { display: none !important; }
          [style*="gridTemplateColumns: clamp(280px"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          [style*="borderRight"] { border-right: none !important; border-bottom: 1px solid var(--rule); }
        }
      `}</style>
    </div>
  );
}
