'use client';

import { use, useState, useCallback } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SearchIcon, Arrow, StarKhatim } from '@/components/svg';
import { routing } from '@/config/routing';
import { LIBRARY, type Locale } from '@/data/content';
import { BOOKS, type Book, type BookCategory } from '@/data/books';
import { cldUrl } from '@/lib/cloudinary';

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function CoverImage({ book, size }: { book: Book; size: number }) {
  const [err, setErr] = useState(false);
  if (CLOUD && book.coverId && !err) {
    return (
      <Image
        src={cldUrl(book.coverId, { w: size, h: size, crop: 'fill' })}
        alt={book.title.en}
        fill
        style={{ objectFit: 'cover' }}
        onError={() => setErr(true)}
        sizes={`${size}px`}
      />
    );
  }
  return <div style={{ position: 'absolute', inset: 0, background: book.coverGradient }} />;
}

function sourceHref(book: Book): string {
  if (book.source.type === 'archive') {
    return `https://archive.org/embed/${book.source.id}`;
  }
  if (book.source.type === 'cloudinary' && CLOUD) {
    return `https://res.cloudinary.com/${CLOUD}/raw/upload/${book.source.id}`;
  }
  return book.source.id;
}

function ReaderModal({
  book,
  locale,
  onClose,
}: {
  book: Book;
  locale: Locale;
  onClose: () => void;
}) {
  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff  = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const ffH = locale === 'en' ? 'var(--serif)' : 'var(--urdu)';
  const d   = LIBRARY;
  const src = sourceHref(book);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,10,5,0.92)',
      display: 'flex', flexDirection: 'column',
    }} dir={dir}>
      {/* Reader header bar */}
      <div style={{
        background: 'var(--emerald-deep)',
        padding: '12px clamp(16px,3vw,40px)',
        display: 'flex', alignItems: 'center', gap: 16,
        borderBottom: '2px solid var(--gold)',
        flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: ffH,
            fontSize: 'clamp(15px,1.4vw,20px)',
            color: 'var(--cream)',
            lineHeight: 1.2,
          }}>
            {book.title[locale] || book.title.en}
          </div>
          <div style={{
            fontFamily: ff, fontSize: 12,
            color: 'var(--gold-light)', marginTop: 2,
          }}>
            {book.author} · {book.year}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid var(--gold)',
            color: 'var(--gold)',
            padding: '8px 18px',
            fontFamily: ff, fontSize: 13, cursor: 'pointer',
            minHeight: 44,
          }}
        >
          {d.closeBtn[locale]}
        </button>
      </div>

      {/* iframe reader */}
      <iframe
        src={src}
        title={book.title.en}
        style={{ flex: 1, border: 0, width: '100%' }}
        allowFullScreen
      />
    </div>
  );
}

export default function LibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = use(params);
  if (!routing.locales.includes(rawLocale as (typeof routing.locales)[number])) notFound();
  const locale = rawLocale as Locale;

  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff  = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const ffH = locale === 'en' ? 'var(--serif)' : 'var(--urdu)';
  const d   = LIBRARY;

  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState<'all' | BookCategory>('all');
  const [reading,  setReading]  = useState<Book | null>(null);

  const filtered = BOOKS.filter(b => {
    const matchCat = category === 'all' || b.category === category;
    const q = query.toLowerCase();
    const matchQ = !q
      || b.title.en.toLowerCase().includes(q)
      || b.title.ur.includes(q)
      || b.author.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const closeReader = useCallback(() => setReading(null), []);

  const catColors: Record<BookCategory, string> = {
    history:    '#7a4520',
    language:   '#1a4a6a',
    culture:    '#3a5a2a',
    religion:   '#1a1a4a',
    literature: '#5a2a5a',
  };

  return (
    <div className="mp-root" dir={dir}>
      <Header active="library" />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg, var(--emerald-deep) 0%, var(--emerald) 100%)',
        padding: 'clamp(40px,5vw,72px) clamp(20px,5vw,64px) clamp(32px,4vw,56px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30Z' fill='%23D4AF37'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <span className="mp-eyebrow" style={{ fontFamily: ff, color: 'var(--gold-light)' }}>
            {d.eyebrow[locale]}
          </span>
          <h1 style={{
            fontFamily: ffH,
            fontSize: 'clamp(36px,5vw,60px)',
            color: 'var(--cream)',
            marginTop: 14, marginBottom: 16, lineHeight: 1.1,
          }}>
            {d.title[locale]}
          </h1>
          <p style={{
            fontFamily: ff, fontSize: 'clamp(14px,1.2vw,17px)',
            color: 'rgba(245,245,220,0.8)', maxWidth: 640, lineHeight: 1.7,
            marginBottom: 36,
          }}>
            {d.sub[locale]}
          </p>

          {/* Search bar */}
          <div style={{
            background: 'rgba(245,245,220,0.08)',
            border: '1.5px solid var(--gold)',
            display: 'flex', alignItems: 'center',
            padding: '4px 4px 4px 16px',
            maxWidth: 660, gap: 12,
          }}>
            <div style={{ color: 'var(--gold)', display: 'flex' }}>
              <SearchIcon size={18} />
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={d.searchPh[locale]}
              style={{
                flex: 1, border: 0, outline: 0,
                background: 'transparent',
                fontFamily: ff, fontSize: 'clamp(13px,1.1vw,15px)',
                color: 'var(--cream)', padding: '10px 0',
                direction: dir,
              }}
            />
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {(Object.entries(d.filters) as [typeof category, typeof d.filters.all][]).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setCategory(k)}
                style={{
                  padding: '8px 16px', fontFamily: ff, fontSize: 13, fontWeight: 500,
                  background: category === k ? 'var(--gold)' : 'transparent',
                  color: category === k ? 'var(--emerald-deep)' : 'var(--gold-light)',
                  border: '1px solid var(--gold)',
                  borderRadius: 999, cursor: 'pointer',
                  transition: 'background .15s',
                  minHeight: 44,
                }}
              >
                {v[locale]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Book grid */}
      <section style={{
        background: 'var(--cream)',
        padding: 'clamp(40px,5vw,64px) clamp(16px,5vw,64px) clamp(64px,8vw,100px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {filtered.length === 0 ? (
            <p style={{ fontFamily: ff, color: 'var(--ink-mute)', textAlign: 'center', padding: 48 }}>
              {d.noResults[locale]}
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'clamp(20px,2vw,28px)',
            }}>
              {filtered.map(book => (
                <article key={book.id} className="mp-card" style={{
                  display: 'flex', flexDirection: 'column',
                  overflow: 'hidden',
                }}>
                  {/* Cover */}
                  <div style={{
                    position: 'relative',
                    height: 'clamp(180px,22vw,260px)',
                    overflow: 'hidden',
                  }}>
                    <CoverImage book={book} size={400} />

                    {/* Category badge */}
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      insetInlineStart: 12,
                      background: catColors[book.category] ?? 'var(--emerald)',
                      color: '#fff',
                      fontFamily: ff, fontSize: 10, fontWeight: 600,
                      letterSpacing: locale === 'en' ? '0.14em' : 0,
                      textTransform: locale === 'en' ? 'uppercase' : 'none',
                      padding: '4px 10px',
                    }}>
                      {d.filters[book.category as keyof typeof d.filters]?.[locale] ?? book.category}
                    </div>

                    {/* Language dots */}
                    <div style={{
                      position: 'absolute', bottom: 10, insetInlineEnd: 10,
                      display: 'flex', gap: 4,
                    }}>
                      {book.language.map(l => (
                        <span key={l} style={{
                          background: 'rgba(0,0,0,0.6)',
                          color: 'var(--gold-light)',
                          fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 700,
                          padding: '3px 6px', letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}>
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{
                    padding: 'clamp(16px,1.5vw,20px)',
                    flex: 1, display: 'flex', flexDirection: 'column',
                    borderTop: '3px solid var(--gold)',
                  }}>
                    <h3 style={{
                      fontFamily: ffH,
                      fontSize: 'clamp(16px,1.4vw,19px)',
                      color: 'var(--emerald-deep)',
                      lineHeight: 1.25, marginBottom: 6,
                    }}>
                      {book.title[locale] || book.title.en}
                    </h3>
                    <div style={{
                      fontFamily: ff, fontSize: 12,
                      color: 'var(--ink-mute)', marginBottom: 12,
                    }}>
                      {d.by[locale]} {book.author} · {book.year}
                    </div>
                    <p style={{
                      fontFamily: ff, fontSize: 13, lineHeight: 1.65,
                      color: 'var(--ink-soft)', flex: 1, marginBottom: 20,
                    }}>
                      {(book.description[locale] || book.description.en).slice(0, 160)}
                      {(book.description[locale] || book.description.en).length > 160 ? '…' : ''}
                    </p>

                    <button
                      onClick={() => setReading(book)}
                      style={{
                        alignSelf: 'flex-start',
                        background: 'var(--emerald)',
                        color: 'var(--cream)',
                        border: 0, cursor: 'pointer',
                        fontFamily: ff, fontSize: 13, fontWeight: 600,
                        letterSpacing: locale === 'en' ? '0.1em' : 0,
                        textTransform: locale === 'en' ? 'uppercase' : 'none',
                        padding: '10px 20px',
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        minHeight: 44,
                        transition: 'background .15s',
                      }}
                    >
                      {d.readBtn[locale]}
                      <Arrow dir={dir === 'rtl' ? 'left' : 'right'} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Khatim divider + contribute callout */}
      <section style={{
        background: 'var(--emerald-deep)',
        padding: 'clamp(40px,5vw,64px) clamp(20px,5vw,64px)',
        textAlign: 'center',
        borderTop: '3px solid var(--gold)',
      }}>
        <StarKhatim size={40} color="#D4AF37" />
        <h2 style={{
          fontFamily: ffH, fontSize: 'clamp(22px,2.5vw,32px)',
          color: 'var(--cream)', marginTop: 20, marginBottom: 12,
        }}>
          {locale === 'en' ? 'Have a book to share?' :
           locale === 'ur' ? 'کوئی کتاب شیئر کرنا چاہتے ہیں؟' :
           'کوئی کتاب بانٹنو چاہواں ہو؟'}
        </h2>
        <p style={{
          fontFamily: ff, fontSize: 'clamp(13px,1.1vw,16px)',
          color: 'rgba(245,245,220,0.75)', maxWidth: 520, margin: '0 auto 28px',
          lineHeight: 1.7,
        }}>
          {locale === 'en'
            ? 'Upload manuscripts, family histories, pamphlets, or audio recordings. Our editors will verify and catalogue them in all three languages.'
            : locale === 'ur'
            ? 'نسخے، خاندانی تاریخیں، کتابچے یا آڈیو ریکارڈنگ اپ لوڈ کریں۔ ہمارے مدیر انہیں تینوں زبانوں میں مرتب کریں گے۔'
            : 'نسخے، گھر کی تواریخ، کتابچے یا آواز کی ریکارڈنگ اپ لوڈ کرو۔ ہمارے مدیر اناں کوں تیناں بولیاں میں مرتب کریں گے۔'}
        </p>
        <a
          href="mailto:editors@meopehchan.org?subject=Book+Submission"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--gold)',
            color: 'var(--emerald-deep)',
            fontFamily: ff, fontSize: 13, fontWeight: 700,
            letterSpacing: locale === 'en' ? '0.1em' : 0,
            textTransform: locale === 'en' ? 'uppercase' : 'none',
            textDecoration: 'none',
            padding: '12px 28px',
            minHeight: 44,
          }}
        >
          {locale === 'en' ? 'Submit a Book' : locale === 'ur' ? 'کتاب بھیجیں' : 'کتاب بھیجو'}
          <Arrow dir={dir === 'rtl' ? 'left' : 'right'} />
        </a>
      </section>

      <Footer locale={locale} />

      {reading && (
        <ReaderModal book={reading} locale={locale} onClose={closeReader} />
      )}
    </div>
  );
}
