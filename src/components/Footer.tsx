import Link from 'next/link';
import { BrandMark } from './svg';
import { BRAND, NAV, FOOTER, type Locale } from '@/data/content';

export default function Footer({ locale }: { locale: Locale }) {
  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const navKeys = ['home', 'history', 'dir', 'news'] as const;

  function navHref(key: typeof navKeys[number]) {
    const paths: Record<typeof navKeys[number], string> = {
      home:    `/${locale}`,
      history: `/${locale}/history`,
      dir:     `/${locale}/directory`,
      news:    `/${locale}/news`,
    };
    return paths[key];
  }

  return (
    <footer className="mp-footer" dir={dir}>
      <div className="mp-footer-grid" style={{ fontFamily: ff }}>
        {/* About column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <BrandMark size={36} />
            <div style={{
              fontFamily: locale === 'en' ? 'var(--serif)' : 'var(--urdu)',
              fontSize: 18, color: 'var(--gold)', fontWeight: 600,
            }}>
              {BRAND[locale].name}
            </div>
          </div>
          <p style={{ fontFamily: ff }}>{FOOTER.about[locale]}</p>
        </div>

        {/* Explore column */}
        <div>
          <h4 style={{ fontFamily: ff }}>{FOOTER.explore[locale]}</h4>
          <ul>
            {navKeys.map(k => (
              <li key={k}>
                <Link href={navHref(k)}>{NAV[k][locale]}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contribute column */}
        <div>
          <h4 style={{ fontFamily: ff }}>{FOOTER.contribute[locale]}</h4>
          <ul>
            {FOOTER.contributeItems.map((it, i) => (
              <li key={i}><a href="#">{it[locale]}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div>
          <h4 style={{ fontFamily: ff }}>{FOOTER.contact[locale]}</h4>
          <ul>
            {FOOTER.contactItems.map((it, i) => (
              <li key={i} style={{ color: 'rgba(245,245,220,0.7)', fontSize: 13 }}>
                {it[locale]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mp-footer-bottom" style={{
        fontFamily: ff,
        letterSpacing: locale === 'en' ? '0.06em' : 0,
        textTransform: locale === 'en' ? 'uppercase' : 'none',
      }}>
        <span>{FOOTER.rights[locale]}</span>
        <span>v 1.0 · Beta</span>
      </div>
    </footer>
  );
}
