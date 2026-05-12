'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { StarKhatim, Arrow, SearchIcon } from '@/components/svg';
import { routing } from '@/config/routing';
import { RISHTA, type Locale } from '@/data/content';
import { PALS, GOTRAS, EDUCATION_LEVELS, MARITAL_STATUS, COUNTRIES } from '@/data/form-options';
import { getSupabase, type MarriageProfile } from '@/lib/supabase-browser';
import { cldUrl } from '@/lib/cloudinary';
import type { User } from '@supabase/supabase-js';

/* ─── Age helper ────────────────────────────────────────────────────────────── */
function ageFrom(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}

/* ─── Profile card ──────────────────────────────────────────────────────────── */
function ProfileCard({
  mp, locale, ff, ffH, dir, isLoggedIn, d,
}: {
  mp: MarriageProfile; locale: Locale; ff: string; ffH: string; dir: string; isLoggedIn: boolean; d: typeof RISHTA;
}) {
  const p = mp.profiles!;
  const age = ageFrom(p.date_of_birth);

  const palName   = p.pals?.name_en   ?? '—';
  const gotraName = p.gotras?.name_en ?? '—';

  const picSrc = isLoggedIn && p.profile_pic_id
    ? cldUrl(p.profile_pic_id, { w: 300, h: 300, crop: 'fill' })
    : null;

  const eduLabel = EDUCATION_LEVELS.find(e => e.value === p.education_level)?.label ?? p.education_level ?? '—';

  return (
    <article className="mp-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Photo */}
      <div style={{
        height: 200, position: 'relative', overflow: 'hidden',
        background: p.gender === 'male'
          ? 'linear-gradient(135deg, #004225, #002a18)'
          : 'linear-gradient(135deg, #5a2060, #3a1040)',
      }}>
        {picSrc ? (
          <Image src={picSrc} alt="" fill style={{ objectFit: 'cover' }} sizes="300px" />
        ) : (
          <div style={{
            height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isLoggedIn ? (
              <span style={{ fontSize: 60, opacity: 0.3 }}>{p.gender === 'male' ? '👨' : '👩'}</span>
            ) : (
              /* blurred placeholder for non-members */
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 36, filter: 'blur(4px)' }}>👤</span>
              </div>
            )}
          </div>
        )}

        {/* Degree verified badge */}
        {mp.is_degree_verified && (
          <div style={{
            position: 'absolute', top: 10, insetInlineEnd: 10,
            background: 'var(--gold)', color: 'var(--emerald-deep)',
            fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 700,
            padding: '4px 8px', letterSpacing: '0.06em',
          }}>
            {d.degreeVerified[locale]}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', borderTop: '3px solid var(--gold)' }}>
        <div style={{ fontFamily: ffH, fontSize: 20, color: 'var(--emerald-deep)', marginBottom: 4 }}>
          {isLoggedIn
            ? `${p.first_name} ${p.last_name}`
            : <span style={{ filter: 'blur(5px)', userSelect: 'none' }}>████ ████</span>
          }
        </div>
        <div style={{ fontFamily: ff, fontSize: 12, color: 'var(--ink-mute)', marginBottom: 14 }}>
          {age} yrs · {palName} · {gotraName}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', flex: 1 }}>
          {[
            { label: locale === 'en' ? 'Education' : 'تعلیم', value: eduLabel },
            { label: locale === 'en' ? 'Profession' : 'پیشہ', value: p.profession ?? '—' },
            { label: locale === 'en' ? 'City' : 'شہر',       value: isLoggedIn ? (p.city ?? '—') : '***' },
            { label: locale === 'en' ? 'Country' : 'ملک',    value: COUNTRIES.find(c => c.code === p.country)?.name ?? p.country ?? '—' },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 2 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontFamily: ff }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {mp.bio && isLoggedIn && (
          <p style={{ fontFamily: ff, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 12, marginBottom: 0 }}>
            {mp.bio.slice(0, 120)}{mp.bio.length > 120 ? '…' : ''}
          </p>
        )}

        {isLoggedIn ? (
          <Link href={`/${locale}/rishta/${mp.id}`} style={{
            marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--emerald)', textDecoration: 'none',
            fontSize: 12, fontWeight: 700,
            letterSpacing: locale === 'en' ? '0.12em' : 0,
            textTransform: locale === 'en' ? 'uppercase' : 'none',
            fontFamily: ff,
          }}>
            {d.viewProfile[locale]}
            <Arrow dir={dir === 'rtl' ? 'left' : 'right'} />
          </Link>
        ) : (
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--ink-mute)', fontFamily: ff, fontStyle: 'italic' }}>
            {locale === 'en' ? 'Join to view full profile' : 'مکمل پروفائل کے لیے ممبر بنیں'}
          </div>
        )}
      </div>
    </article>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────────── */

export default function RishtaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = use(params);
  if (!routing.locales.includes(rawLocale as (typeof routing.locales)[number])) notFound();
  const locale = rawLocale as Locale;

  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff  = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const ffH = locale === 'en' ? 'var(--serif)' : 'var(--urdu)';
  const d   = RISHTA;

  const [user,      setUser]      = useState<User | null>(null);
  const [profiles,  setProfiles]  = useState<MarriageProfile[]>([]);
  const [loading,   setLoading]   = useState(true);

  /* Filters */
  const [gender,     setGender]     = useState('');
  const [ageMin,     setAgeMin]     = useState('18');
  const [ageMax,     setAgeMax]     = useState('60');
  const [palId,      setPalId]      = useState('');
  const [gotraSlug,  setGotraSlug]  = useState('');
  const [eduLevel,   setEduLevel]   = useState('');
  const [country,    setCountry]    = useState('');
  const [status,     setStatus]     = useState('');

  const palGotras = GOTRAS.filter(g => {
    const pal = PALS.find(p => String(p.id) === palId);
    return pal ? g.palSlug === pal.slug : false;
  });

  /* ── Auth + data fetch ──────────────────────────────── */
  useEffect(() => {
    const sb = getSupabase();
    sb.auth.getUser().then(({ data: { user: u } }) => setUser(u));
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const sb = getSupabase();
      let q = sb
        .from('marriage_profiles')
        .select(`
          *,
          profiles (
            id, first_name, last_name, date_of_birth, gender,
            pal_id, gotra_id, education_level, profession,
            country, city, marital_status, profile_pic_id, bio,
            pals ( name_en, name_ur ),
            gotras ( name_en, name_ur )
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (gender)    q = q.eq('profiles.gender', gender);
      if (status)    q = q.eq('profiles.marital_status', status);
      if (country)   q = q.eq('profiles.country', country);
      if (eduLevel)  q = q.gte('profiles.education_level', eduLevel);
      if (palId)     q = q.eq('profiles.pal_id', Number(palId));

      const { data } = await q;
      let results = (data ?? []) as MarriageProfile[];

      /* Client-side age filter */
      if (ageMin || ageMax) {
        results = results.filter(mp => {
          if (!mp.profiles?.date_of_birth) return true;
          const age = ageFrom(mp.profiles.date_of_birth);
          return age >= Number(ageMin || 18) && age <= Number(ageMax || 100);
        });
      }

      setProfiles(results);
    } finally {
      setLoading(false);
    }
  }, [gender, ageMin, ageMax, palId, gotraSlug, eduLevel, country, status]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  function clearFilters() {
    setGender(''); setAgeMin('18'); setAgeMax('60');
    setPalId(''); setGotraSlug(''); setEduLevel('');
    setCountry(''); setStatus('');
  }

  const SEL: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid var(--rule)', padding: '8px 10px',
    fontFamily: ff, fontSize: 13, color: 'var(--ink)',
    background: 'var(--paper)', appearance: 'none', cursor: 'pointer',
    outline: 'none',
  };

  return (
    <div className="mp-root" dir={dir}>
      <Header active="rishta" />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg, var(--emerald-deep) 0%, var(--emerald) 100%)',
        padding: 'clamp(40px,5vw,64px) clamp(20px,5vw,64px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20Z' fill='%23D4AF37'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <span className="mp-eyebrow" style={{ fontFamily: ff, color: 'var(--gold-light)' }}>
            {d.eyebrow[locale]}
          </span>
          <h1 style={{
            fontFamily: ffH, fontSize: 'clamp(36px,5vw,56px)',
            color: 'var(--cream)', marginTop: 12, marginBottom: 12, lineHeight: 1.1,
          }}>
            {d.title[locale]}
          </h1>
          <p style={{ fontFamily: ff, fontSize: 'clamp(13px,1.1vw,16px)', color: 'rgba(245,245,220,0.8)', maxWidth: 600, lineHeight: 1.7 }}>
            {d.sub[locale]}
          </p>
          {!user && (
            <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <p style={{ fontFamily: ff, color: 'rgba(245,245,220,0.75)', fontSize: 14 }}>
                {d.loginCta[locale]}
              </p>
              <Link href={`/${locale}/join`} style={{
                background: 'var(--gold)', color: 'var(--emerald-deep)',
                textDecoration: 'none', padding: '10px 24px',
                fontFamily: ff, fontWeight: 700, fontSize: 14,
                letterSpacing: locale === 'en' ? '0.08em' : 0,
                textTransform: locale === 'en' ? 'uppercase' : 'none',
              }}>
                {d.joinBtn[locale]}
              </Link>
              <Link href={`/${locale}/login`} style={{
                color: 'var(--gold-light)', textDecoration: 'none',
                fontFamily: ff, fontSize: 14,
                border: '1px solid var(--gold)', padding: '10px 20px',
              }}>
                {locale === 'en' ? 'Log In' : locale === 'ur' ? 'لاگ ان' : 'لاگ ان'}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section style={{
        background: 'var(--cream)',
        padding: 'clamp(32px,4vw,48px) clamp(16px,5vw,64px) clamp(64px,8vw,100px)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'clamp(220px, 22%, 280px) 1fr',
          gap: 'clamp(24px,2vw,40px)',
          alignItems: 'start',
        }}
          className="rishta-grid"
        >
          {/* ── Filter sidebar ── */}
          <aside style={{
            background: 'var(--paper)',
            border: '1px solid var(--rule)',
            padding: '24px 20px',
            position: 'sticky', top: 20,
          }}>
            <div style={{
              fontFamily: ff, fontSize: 12, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--emerald)', marginBottom: 20,
              paddingBottom: 10, borderBottom: '2px solid var(--gold)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>{locale === 'en' ? 'Filters' : 'فلٹر'}</span>
              <button onClick={clearFilters} style={{
                background: 'transparent', border: 0, cursor: 'pointer',
                color: 'var(--ink-mute)', fontFamily: ff, fontSize: 11,
                textDecoration: 'underline',
              }}>
                {d.clearFilters[locale]}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FilterRow label={d.filterGender[locale]} ff={ff}>
                <select style={SEL} value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="">{d.anyOption[locale]}</option>
                  <option value="male">{locale === 'en' ? 'Male' : 'مرد'}</option>
                  <option value="female">{locale === 'en' ? 'Female' : 'عورت'}</option>
                </select>
              </FilterRow>

              <FilterRow label={d.filterAge[locale]} ff={ff}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="number" min={18} max={80} value={ageMin}
                    onChange={e => setAgeMin(e.target.value)}
                    style={{ ...SEL, width: '45%' }} />
                  <span style={{ fontFamily: ff, fontSize: 12, color: 'var(--ink-mute)' }}>–</span>
                  <input type="number" min={18} max={80} value={ageMax}
                    onChange={e => setAgeMax(e.target.value)}
                    style={{ ...SEL, width: '45%' }} />
                </div>
              </FilterRow>

              <FilterRow label={d.filterPal[locale]} ff={ff}>
                <select style={SEL} value={palId} onChange={e => { setPalId(e.target.value); setGotraSlug(''); }}>
                  <option value="">{d.anyOption[locale]}</option>
                  {PALS.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                </select>
              </FilterRow>

              {palId && (
                <FilterRow label={d.filterGotra[locale]} ff={ff}>
                  <select style={SEL} value={gotraSlug} onChange={e => setGotraSlug(e.target.value)}>
                    <option value="">{d.anyOption[locale]}</option>
                    {palGotras.map((g, i) => <option key={i} value={g.name}>{g.name}</option>)}
                  </select>
                </FilterRow>
              )}

              <FilterRow label={d.filterEdu[locale]} ff={ff}>
                <select style={SEL} value={eduLevel} onChange={e => setEduLevel(e.target.value)}>
                  <option value="">{d.anyOption[locale]}</option>
                  {EDUCATION_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
              </FilterRow>

              <FilterRow label={d.filterCountry[locale]} ff={ff}>
                <select style={SEL} value={country} onChange={e => setCountry(e.target.value)}>
                  <option value="">{d.anyOption[locale]}</option>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </FilterRow>

              <FilterRow label={d.filterStatus[locale]} ff={ff}>
                <select style={SEL} value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="">{d.anyOption[locale]}</option>
                  {MARITAL_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </FilterRow>
            </div>
          </aside>

          {/* ── Profile grid ── */}
          <div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <StarKhatim size={40} color="#D4AF37" />
              </div>
            ) : profiles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 80, color: 'var(--ink-mute)', fontFamily: ff }}>
                {d.noResults[locale]}
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 'clamp(16px,1.5vw,20px)',
              }}>
                {profiles.map(mp => (
                  <ProfileCard
                    key={mp.id} mp={mp} locale={locale}
                    ff={ff} ffH={ffH} dir={dir}
                    isLoggedIn={Boolean(user)} d={d}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer locale={locale} />

      <style>{`
        @media (max-width: 700px) {
          .rishta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function FilterRow({ label, ff, children }: { label: string; ff: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: ff, fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 5 }}>
        {label}
      </div>
      {children}
    </div>
  );
}
