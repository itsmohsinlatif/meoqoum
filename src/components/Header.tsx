'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { BrandMark } from './svg';
import LangSwitcher from './LangSwitcher';
import { BRAND, NAV, type Locale } from '@/data/content';
import { getSupabase } from '@/lib/supabase-browser';
import { cldUrl } from '@/lib/cloudinary';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  active: 'home' | 'history' | 'dir' | 'news' | 'library' | 'rishta' | 'population';
}

/* ── Avatar circle ───────────────────────────────────────────────────────────── */
function Avatar({
  firstName, picId, size = 34,
}: {
  firstName: string; picId: string | null; size?: number;
}) {
  const [imgErr, setImgErr] = useState(false);
  const initials = firstName ? firstName.slice(0, 1).toUpperCase() : '?';

  if (picId && !imgErr) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        overflow: 'hidden', position: 'relative', flexShrink: 0,
        border: '2px solid var(--gold)',
      }}>
        <Image
          src={cldUrl(picId, { w: size * 2, h: size * 2, crop: 'fill' })}
          alt="Profile"
          fill
          style={{ objectFit: 'cover' }}
          sizes={`${size}px`}
          onError={() => setImgErr(true)}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--emerald)',
      border: '2px solid var(--gold)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: 'var(--serif)', fontSize: size * 0.4,
        fontWeight: 700, color: 'var(--cream)',
        lineHeight: 1, userSelect: 'none',
      }}>
        {initials}
      </span>
    </div>
  );
}

/* ── Dropdown menu item ──────────────────────────────────────────────────────── */
function MenuItem({
  href, onClick, icon, label, danger,
}: {
  href?: string; onClick?: () => void; icon: string; label: string; danger?: boolean;
}) {
  const style: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px', fontSize: 13, fontFamily: 'var(--sans)',
    color: danger ? '#e53e3e' : '#1a2a1a',
    textDecoration: 'none', cursor: 'pointer',
    background: 'transparent', border: 'none', width: '100%',
    textAlign: 'start', transition: 'background .1s',
    whiteSpace: 'nowrap',
  };

  const content = (
    <>
      <span style={{ fontSize: 16, lineHeight: 1, width: 20, textAlign: 'center' }}>{icon}</span>
      {label}
    </>
  );

  if (href) return (
    <Link href={href} style={style}
      onMouseEnter={e => (e.currentTarget.style.background = '#f0f8f4')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      {content}
    </Link>
  );

  return (
    <button onClick={onClick} style={style}
      onMouseEnter={e => (e.currentTarget.style.background = danger ? '#fff5f5' : '#f0f8f4')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      {content}
    </button>
  );
}

/* ── Main component ──────────────────────────────────────────────────────────── */
export default function Header({ active }: HeaderProps) {
  const locale = useLocale() as Locale;
  const router  = useRouter();
  const dir     = locale === 'en' ? 'ltr' : 'rtl';
  const ff      = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';

  const [menuOpen,   setMenuOpen]   = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const [user,       setUser]       = useState<User | null>(null);
  const [firstName,  setFirstName]  = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const sb = getSupabase();

    async function loadUser(u: User | null) {
      setUser(u);
      if (!u) { setFirstName(''); setProfilePic(null); return; }
      const { data } = await sb.from('profiles')
        .select('first_name, profile_pic_id')
        .eq('id', u.id).single();
      setFirstName(data?.first_name ?? '');
      setProfilePic(data?.profile_pic_id ?? null);
    }

    sb.auth.getUser().then(({ data: { user: u } }) => loadUser(u));
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      loadUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* Close dropdown on outside click or Escape */
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setDropOpen(false); }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  async function handleLogout() {
    setDropOpen(false);
    await getSupabase().auth.signOut();
    router.push(`/${locale}`);
  }

  const brand   = BRAND[locale];
  const navKeys = ['home', 'history', 'dir', 'news', 'library', 'rishta', 'population'] as const;

  function navHref(key: typeof navKeys[number]) {
    const paths: Record<typeof navKeys[number], string> = {
      home:       `/${locale}`,
      history:    `/${locale}/history`,
      dir:        `/${locale}/directory`,
      news:       `/${locale}/news`,
      library:    `/${locale}/library`,
      rishta:     `/${locale}/rishta`,
      population: `/${locale}/population`,
    };
    return paths[key];
  }

  const T = {
    profile:   { en: 'My Profile',        ur: 'میری پروفائل',      mew: 'میری پروفائل'   },
    rishta:    { en: 'My Rishta Profile',  ur: 'میرا رشتہ پروفائل', mew: 'میرو رشتو پروفائل' },
    admin:     { en: 'Admin Panel',        ur: 'ایڈمن پینل',        mew: 'ایڈمن پینل'    },
    logout:    { en: 'Log out',            ur: 'لاگ آؤٹ',           mew: 'لاگ آؤٹ'      },
    login:     { en: 'Login',             ur: 'لاگ ان',             mew: 'لاگ ان'       },
    join:      { en: 'Join',              ur: 'جڑیں',               mew: 'جڑو'          },
  };

  return (
    <header className="mp-header" dir={dir}>
      <div className="mp-header-inner">

        {/* Brand */}
        <Link href={`/${locale}`} className="mp-brand">
          <BrandMark size={44} />
          <div className="mp-brand-name" style={{ fontFamily: locale === 'en' ? 'var(--serif)' : 'var(--urdu)' }}>
            {brand.name}
            {locale === 'en' && <span className="urdu">میو قوم</span>}
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="mp-nav" aria-label="Main navigation">
          {navKeys.map(k => (
            <Link key={k} href={navHref(k)} className={active === k ? 'active' : ''} style={{ fontFamily: ff }}>
              {NAV[k][locale]}
            </Link>
          ))}
        </nav>

        {/* Right-side actions — hidden on mobile, shown in flyout instead */}
        <div className="mp-header-actions">
          <LangSwitcher />

          {user ? (
            /* ── Avatar + dropdown ── */
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(v => !v)}
                style={{
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', padding: 0, display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Account menu"
                aria-expanded={dropOpen}
              >
                <Avatar firstName={firstName} picId={profilePic} size={36} />
              </button>

              {dropOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  insetInlineEnd: 0,
                  minWidth: 210,
                  background: '#fff',
                  border: '1.5px solid var(--rule)',
                  borderRadius: 6,
                  boxShadow: '0 8px 32px rgba(0,40,20,0.13)',
                  zIndex: 500,
                  overflow: 'hidden',
                }}>
                  {/* User info header */}
                  <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--rule)',
                    background: '#f8f6f0',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <Avatar firstName={firstName} picId={profilePic} size={40} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', fontFamily: ff, lineHeight: 1.2 }}>
                        {firstName || 'Member'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--sans)', marginTop: 2 }}>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: '4px 0' }}>
                    <MenuItem href={`/${locale}/profile`}        icon="👤" label={T.profile[locale]}  onClick={() => setDropOpen(false)} />
                    <MenuItem href={`/${locale}/profile?tab=rishta`} icon="💍" label={T.rishta[locale]}   onClick={() => setDropOpen(false)} />
                    {ADMIN_EMAIL && user.email === ADMIN_EMAIL && (
                      <MenuItem href={`/${locale}/admin`}        icon="⚙️" label={T.admin[locale]}    onClick={() => setDropOpen(false)} />
                    )}
                  </div>

                  {/* Logout */}
                  <div style={{ borderTop: '1px solid var(--rule)', padding: '4px 0' }}>
                    <MenuItem onClick={handleLogout} icon="↩" label={T.logout[locale]} danger />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link href={`/${locale}/login`} style={{
                fontFamily: ff, fontSize: 12, fontWeight: 700,
                color: 'var(--gold)', textDecoration: 'none',
                padding: '7px 14px',
                border: '1.5px solid var(--gold)',
                borderRadius: 3,
                letterSpacing: locale === 'en' ? '0.08em' : 0,
                textTransform: locale === 'en' ? 'uppercase' : 'none',
                whiteSpace: 'nowrap',
              }}>
                {T.login[locale]}
              </Link>
              <Link href={`/${locale}/join`} style={{ background: 'var(--gold)', color: 'var(--emerald-deep)', fontFamily: ff, fontSize: 11, fontWeight: 700, textDecoration: 'none', padding: '8px 14px', letterSpacing: locale === 'en' ? '0.1em' : 0, textTransform: locale === 'en' ? 'uppercase' : 'none', whiteSpace: 'nowrap', minHeight: 36, display: 'flex', alignItems: 'center' }}>
                {T.join[locale]}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger — shows ☰ / ✕ */}
        <button
          className="mp-nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen
            ? <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round"/></svg>
            : <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/></svg>
          }
        </button>
      </div>

      {/* Mobile flyout — nav + lang + auth */}
      {menuOpen && (
        <div className="mp-mobile-menu" dir={dir}>

          {/* Language switcher at the top */}
          <div style={{
            padding: '12px 0 16px',
            borderBottom: '1px solid rgba(212,175,55,0.15)',
            marginBottom: 4,
          }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: 'rgba(245,245,220,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Language
            </div>
            <LangSwitcher />
          </div>

          {/* Nav links */}
          {navKeys.map(k => (
            <Link key={k} href={navHref(k)} className={active === k ? 'active' : ''} style={{ fontFamily: ff }} onClick={() => setMenuOpen(false)}>
              {NAV[k][locale]}
            </Link>
          ))}

          {/* Account section */}
          {user ? (
            <div style={{ borderTop: '1px solid rgba(212,175,55,0.15)', marginTop: 4, paddingTop: 4 }}>
              {/* User info */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0 14px',
                borderBottom: '1px solid rgba(212,175,55,0.1)',
                marginBottom: 4,
              }}>
                <Avatar firstName={firstName} picId={profilePic} size={36} />
                <div>
                  <div style={{ fontFamily: ff, fontSize: 14, fontWeight: 700, color: 'var(--cream)', lineHeight: 1.2 }}>
                    {firstName || 'Member'}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'rgba(245,245,220,0.5)', marginTop: 2 }}>
                    {user.email}
                  </div>
                </div>
              </div>
              <Link href={`/${locale}/profile`} style={{ fontFamily: ff }} onClick={() => setMenuOpen(false)}>
                👤 {T.profile[locale]}
              </Link>
              <Link href={`/${locale}/profile?tab=rishta`} style={{ fontFamily: ff }} onClick={() => setMenuOpen(false)}>
                💍 {T.rishta[locale]}
              </Link>
              {ADMIN_EMAIL && user.email === ADMIN_EMAIL && (
                <Link href={`/${locale}/admin`} style={{ fontFamily: ff }} onClick={() => setMenuOpen(false)}>
                  ⚙️ {T.admin[locale]}
                </Link>
              )}
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                style={{
                  background: 'transparent', border: 0, fontFamily: ff,
                  fontSize: 14, color: '#f87171', cursor: 'pointer',
                  padding: '12px 0', textAlign: dir === 'rtl' ? 'right' : 'left',
                  width: '100%', display: 'block',
                  borderTop: '1px solid rgba(212,175,55,0.1)',
                  marginTop: 4,
                }}>
                ↩ {T.logout[locale]}
              </button>
            </div>
          ) : (
            <div style={{
              borderTop: '1px solid rgba(212,175,55,0.15)',
              marginTop: 4, paddingTop: 16,
              display: 'flex', gap: 10, flexWrap: 'wrap',
            }}>
              <Link
                href={`/${locale}/login`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: ff, fontSize: 14, fontWeight: 600,
                  color: 'var(--cream)', textDecoration: 'none',
                  border: '1px solid rgba(212,175,55,0.4)',
                  padding: '10px 20px', borderRadius: 4,
                  flex: 1, textAlign: 'center', minWidth: 100,
                }}
              >
                {T.login[locale]}
              </Link>
              <Link
                href={`/${locale}/join`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: ff, fontSize: 14, fontWeight: 700,
                  color: 'var(--emerald-deep)', textDecoration: 'none',
                  background: 'var(--gold)',
                  padding: '10px 20px', borderRadius: 4,
                  flex: 1, textAlign: 'center', minWidth: 100,
                }}
              >
                {locale === 'en' ? 'Join Free' : locale === 'ur' ? 'مفت جڑیں' : 'مفت جڑو'}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
