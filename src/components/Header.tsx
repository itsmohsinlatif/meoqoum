'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { BrandMark } from './svg';
import LangSwitcher from './LangSwitcher';
import { BRAND, NAV, type Locale } from '@/data/content';
import { getSupabase } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  active: 'home' | 'history' | 'dir' | 'news' | 'library' | 'rishta';
}

export default function Header({ active }: HeaderProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff  = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    sb.auth.getUser().then(({ data: { user: u } }) => setUser(u));
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await getSupabase().auth.signOut();
    router.push(`/${locale}`);
  }

  const brand   = BRAND[locale];
  const navKeys = ['home', 'history', 'dir', 'news', 'library', 'rishta'] as const;

  function navHref(key: typeof navKeys[number]) {
    const paths: Record<typeof navKeys[number], string> = {
      home:    `/${locale}`,
      history: `/${locale}/history`,
      dir:     `/${locale}/directory`,
      news:    `/${locale}/news`,
      library: `/${locale}/library`,
      rishta:  `/${locale}/rishta`,
    };
    return paths[key];
  }

  return (
    <header className="mp-header" dir={dir}>
      <div className="mp-header-inner">
        {/* Brand */}
        <Link href={`/${locale}`} className="mp-brand">
          <BrandMark size={44} />
          <div
            className="mp-brand-name"
            style={{ fontFamily: locale === 'en' ? 'var(--serif)' : 'var(--urdu)' }}
          >
            {brand.name}
            {locale === 'en' && <span className="urdu">میو قوم</span>}
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="mp-nav" aria-label="Main navigation">
          {navKeys.map(k => (
            <Link
              key={k}
              href={navHref(k)}
              className={active === k ? 'active' : ''}
              style={{ fontFamily: ff }}
            >
              {NAV[k][locale]}
            </Link>
          ))}
        </nav>

        {/* Right-side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <LangSwitcher />

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: ff, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--rule)',
                  color: 'var(--ink-soft)',
                  fontFamily: ff, fontSize: 11, fontWeight: 600,
                  padding: '6px 12px', cursor: 'pointer',
                  letterSpacing: locale === 'en' ? '0.08em' : 0,
                  textTransform: locale === 'en' ? 'uppercase' : 'none',
                  minHeight: 36,
                }}
              >
                {locale === 'en' ? 'Log out' : locale === 'ur' ? 'لاگ آؤٹ' : 'لاگ آؤٹ'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link
                href={`/${locale}/login`}
                style={{
                  fontFamily: ff, fontSize: 12, fontWeight: 600,
                  color: 'var(--ink-soft)', textDecoration: 'none',
                  padding: '6px 10px',
                  letterSpacing: locale === 'en' ? '0.06em' : 0,
                }}
              >
                {locale === 'en' ? 'Login' : locale === 'ur' ? 'لاگ ان' : 'لاگ ان'}
              </Link>
              <Link
                href={`/${locale}/join`}
                style={{
                  background: 'var(--gold)',
                  color: 'var(--emerald-deep)',
                  fontFamily: ff, fontSize: 11, fontWeight: 700,
                  textDecoration: 'none',
                  padding: '8px 14px',
                  letterSpacing: locale === 'en' ? '0.1em' : 0,
                  textTransform: locale === 'en' ? 'uppercase' : 'none',
                  whiteSpace: 'nowrap',
                  minHeight: 36, display: 'flex', alignItems: 'center',
                }}
              >
                {locale === 'en' ? 'Join' : locale === 'ur' ? 'جڑیں' : 'جڑو'}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="mp-nav-toggle"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Mobile active-page bar */}
      <div className="mp-mobile-bar">
        <span style={{ fontFamily: ff }}>{NAV[active][locale]}</span>
        <LangSwitcher compact />
      </div>

      {/* Mobile flyout menu */}
      {menuOpen && (
        <div className="mp-mobile-menu" dir={dir}>
          {navKeys.map(k => (
            <Link
              key={k}
              href={navHref(k)}
              className={active === k ? 'active' : ''}
              style={{ fontFamily: ff }}
              onClick={() => setMenuOpen(false)}
            >
              {NAV[k][locale]}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { setMenuOpen(false); handleLogout(); }}
              style={{ background: 'transparent', border: 0, fontFamily: ff, fontSize: 14, color: 'var(--ink-soft)', cursor: 'pointer', padding: '12px 20px', textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              {locale === 'en' ? 'Log out' : 'لاگ آؤٹ'}
            </button>
          ) : (
            <>
              <Link href={`/${locale}/login`} style={{ fontFamily: ff }} onClick={() => setMenuOpen(false)}>
                {locale === 'en' ? 'Login' : 'لاگ ان'}
              </Link>
              <Link href={`/${locale}/join`} style={{ fontFamily: ff, fontWeight: 700, color: 'var(--gold)' }} onClick={() => setMenuOpen(false)}>
                {locale === 'en' ? 'Join Free' : locale === 'ur' ? 'مفت جڑیں' : 'مفت جڑو'}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
