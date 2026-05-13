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
import { SAMPLE_RISHTA } from '@/data/sample-profiles';
import { cldUrl } from '@/lib/cloudinary';
import type { User } from '@supabase/supabase-js';

/* ─── Social icon helpers ──────────────────────────────────────────────────── */
function socialIcon(bg: string): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 32, height: 32, background: bg, borderRadius: '50%',
    color: '#fff', textDecoration: 'none', flexShrink: 0,
  };
}
const WhatsAppIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.126 1.533 5.862L.057 23.998l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.369l-.36-.214-3.733.979.997-3.641-.234-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>;
const FbIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>;
const IgIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const LiIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const XIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;

/* ─── Age helper ────────────────────────────────────────────────────────────── */
function ageFrom(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}

/* ─── Profile detail modal ──────────────────────────────────────────────────── */
function ProfileModal({
  mp, locale, ff, ffH, dir, isLoggedIn, d, onClose,
}: {
  mp: MarriageProfile; locale: Locale; ff: string; ffH: string; dir: string;
  isLoggedIn: boolean; d: typeof RISHTA; onClose: () => void;
}) {
  const p   = mp.profiles!;
  const age = ageFrom(p.date_of_birth);
  const palName   = p.pals?.name_en   ?? '—';
  const gotraName = p.gotras?.name_en ?? '—';
  const picSrc = isLoggedIn && p.profile_pic_id
    ? cldUrl(p.profile_pic_id, { w: 400, h: 400, crop: 'fill' }) : null;
  const eduLabel = EDUCATION_LEVELS.find(e => e.value === p.education_level)?.label ?? p.education_level ?? '—';
  const countryName = COUNTRIES.find(c => c.code === p.country)?.name ?? p.country ?? '—';

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const row = (label: string, value: string) => (
    <div key={label} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ minWidth: 110, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-soft)', paddingTop: 1, fontFamily: 'var(--sans)' }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--ink)', fontFamily: ff }}>{value}</div>
    </div>
  );

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1300, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }} />
      <div dir={dir} style={{
        position: 'fixed', zIndex: 1301,
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 'min(92vw, 620px)', maxHeight: '90vh',
        background: '#fff', borderRadius: 6,
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header band */}
        <div style={{
          background: p.gender === 'male' ? 'var(--emerald-deep)' : 'linear-gradient(135deg,#5a2060,#3a1040)',
          padding: '18px 22px',
          display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0,
        }}>
          {/* Photo */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.15)', flexShrink: 0, position: 'relative' }}>
            {picSrc
              ? <Image src={picSrc} alt="" fill style={{ objectFit: 'cover' }} sizes="72px" />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                  {isLoggedIn ? (p.gender === 'male' ? '👨' : '👩') : <span style={{ filter: 'blur(4px)' }}>👤</span>}
                </div>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: ffH, fontSize: 22, color: '#fff', lineHeight: 1.2, marginBottom: 3 }}>
              {isLoggedIn ? `${p.first_name} ${p.last_name}` : <span style={{ filter: 'blur(5px)' }}>████ ████</span>}
            </div>
            <div style={{ fontFamily: ff, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              {age} yrs · {palName} · {gotraName}
            </div>
            {mp.is_degree_verified && (
              <div style={{ display: 'inline-block', marginTop: 5, background: 'var(--gold)', color: 'var(--emerald-deep)', fontSize: 10, fontWeight: 700, padding: '2px 8px', letterSpacing: '0.06em' }}>
                {d.degreeVerified[locale]}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflow: 'auto', padding: '20px 22px', flex: 1 }}>
          {/* Bio */}
          {mp.bio && isLoggedIn && (
            <p style={{ fontFamily: ff, fontSize: 14, lineHeight: 1.75, color: 'var(--ink-soft)', margin: '0 0 20px', padding: '14px 16px', background: 'var(--paper)', borderInlineStart: '3px solid var(--gold)' }}>
              {mp.bio}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {row(locale === 'en' ? 'Education' : 'تعلیم', eduLabel)}
            {row(locale === 'en' ? 'Field' : 'شعبہ', p.education_field ?? '—')}
            {row(locale === 'en' ? 'Profession' : 'پیشہ', p.profession ?? '—')}
            {row(locale === 'en' ? 'Country' : 'ملک', countryName)}
            {isLoggedIn && row(locale === 'en' ? 'City' : 'شہر', p.city ?? '—')}
            {row(locale === 'en' ? 'Marital Status' : 'ازدواجی حیثیت', p.marital_status)}
            {isLoggedIn && p.contact_no && row(locale === 'en' ? 'Contact' : 'رابطہ', p.contact_no)}
            {mp.height_cm && row(locale === 'en' ? 'Height' : 'قد', `${mp.height_cm} cm`)}
            {mp.weight_kg && row(locale === 'en' ? 'Weight' : 'وزن', `${mp.weight_kg} kg`)}
            {mp.complexion && row(locale === 'en' ? 'Complexion' : 'رنگ', mp.complexion)}
            {(mp.pref_age_min || mp.pref_age_max) && row(locale === 'en' ? 'Preferred Age' : 'پسندیدہ عمر', `${mp.pref_age_min ?? 18}–${mp.pref_age_max ?? 50}`)}
            {mp.pref_country && row(locale === 'en' ? 'Preferred Country' : 'پسندیدہ ملک', mp.pref_country)}
            {mp.pref_notes && row(locale === 'en' ? 'Notes' : 'نوٹس', mp.pref_notes)}
          </div>

          {/* Social links */}
          {isLoggedIn && (p.social_whatsapp || p.social_facebook || p.social_instagram || p.social_linkedin || p.social_twitter) && (
            <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {p.social_whatsapp && <a href={`https://wa.me/${p.social_whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" title="WhatsApp" style={socialIcon('#25D366')}><WhatsAppIcon /></a>}
              {p.social_facebook && <a href={p.social_facebook.startsWith('http') ? p.social_facebook : `https://facebook.com/${p.social_facebook}`} target="_blank" rel="noreferrer" title="Facebook" style={socialIcon('#1877F2')}><FbIcon /></a>}
              {p.social_instagram && <a href={`https://instagram.com/${p.social_instagram.replace('@','')}`} target="_blank" rel="noreferrer" title="Instagram" style={socialIcon('#E1306C')}><IgIcon /></a>}
              {p.social_linkedin && <a href={p.social_linkedin.startsWith('http') ? p.social_linkedin : `https://linkedin.com/in/${p.social_linkedin}`} target="_blank" rel="noreferrer" title="LinkedIn" style={socialIcon('#0A66C2')}><LiIcon /></a>}
              {p.social_twitter && <a href={`https://x.com/${p.social_twitter.replace('@','')}`} target="_blank" rel="noreferrer" title="X / Twitter" style={socialIcon('#000')}><XIcon /></a>}
            </div>
          )}

          {!isLoggedIn && (
            <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--paper)', border: '1px dashed var(--gold)', fontFamily: ff, fontSize: 13, color: 'var(--ink-mute)', textAlign: 'center' }}>
              {locale === 'en' ? 'Join Meo Qoum to see contact details, city and full profile.' : locale === 'ur' ? 'مکمل معلومات دیکھنے کے لیے ممبر بنیں۔' : 'پوری معلومات کے لیے ممبر بنو۔'}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Profile card ──────────────────────────────────────────────────────────── */
function ProfileCard({
  mp, locale, ff, ffH, dir, isLoggedIn, d, onExpand,
}: {
  mp: MarriageProfile; locale: Locale; ff: string; ffH: string; dir: string;
  isLoggedIn: boolean; d: typeof RISHTA; onExpand: () => void;
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
    <article
      className="mp-card"
      onClick={onExpand}
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform .15s, box-shadow .15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,40,20,0.13)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
    >
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
            { label: locale === 'en' ? 'Education' : locale === 'ur' ? 'تعلیم' : 'تعلیم', value: eduLabel },
            { label: locale === 'en' ? 'Profession' : locale === 'ur' ? 'پیشہ' : 'پیشو',  value: p.profession ?? '—' },
            { label: locale === 'en' ? 'City' : locale === 'ur' ? 'شہر' : 'شہر',           value: isLoggedIn ? (p.city ?? '—') : '***' },
            { label: locale === 'en' ? 'Country' : locale === 'ur' ? 'ملک' : 'ملک',        value: COUNTRIES.find(c => c.code === p.country)?.name ?? p.country ?? '—' },
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

        {/* Click-to-expand hint */}
        <div style={{
          marginTop: 'auto', paddingTop: 14,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--emerald)', fontSize: 12, fontWeight: 700,
          letterSpacing: locale === 'en' ? '0.12em' : 0,
          textTransform: locale === 'en' ? 'uppercase' : 'none',
          fontFamily: ff,
        }}>
          {d.viewProfile[locale]}
          <Arrow dir={dir === 'rtl' ? 'left' : 'right'} />
        </div>
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

  const [user,        setUser]        = useState<User | null>(null);
  const [profiles,    setProfiles]    = useState<MarriageProfile[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [myProfile,   setMyProfile]   = useState<{ id: string; is_active: boolean } | null | undefined>(undefined);
  const [toggling,    setToggling]    = useState(false);
  const [expanded,    setExpanded]    = useState<MarriageProfile | null>(null);

  /* Filters */
  const [filterOpen, setFilterOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 700 : true
  );
  const [gender,     setGender]     = useState('');
  const [ageMin,     setAgeMin]     = useState('18');
  const [ageMax,     setAgeMax]     = useState('60');
  const [palId,      setPalId]      = useState('');
  const [gotraSlug,  setGotraSlug]  = useState('');
  const [eduLevel,   setEduLevel]   = useState('');
  const [country,    setCountry]    = useState('');
  const [status,     setStatus]     = useState('');
  const [page,       setPage]       = useState(0);
  const [hasMore,    setHasMore]    = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const palGotras = GOTRAS.filter(g => {
    const pal = PALS.find(p => String(p.id) === palId);
    return pal ? g.palSlug === pal.slug : false;
  });

  /* ── Auth + fetch own marriage profile ─────────────── */
  useEffect(() => {
    const sb = getSupabase();
    sb.auth.getUser().then(async ({ data: { user: u } }) => {
      setUser(u);
      if (u) {
        const { data } = await sb
          .from('marriage_profiles')
          .select('id, is_active')
          .eq('user_id', u.id)
          .maybeSingle();
        setMyProfile(data ?? null);
      } else {
        setMyProfile(null);
      }
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setMyProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ── Toggle visibility ──────────────────────────────── */
  async function toggleProfile() {
    if (!user) return;
    setToggling(true);
    const sb = getSupabase();
    try {
      if (myProfile === null) {
        /* No record yet — create one and make it visible */
        const { data } = await sb
          .from('marriage_profiles')
          .insert({ user_id: user.id, is_active: true })
          .select('id, is_active')
          .single();
        setMyProfile(data);
      } else if (myProfile) {
        /* Toggle existing record */
        const next = !myProfile.is_active;
        await sb
          .from('marriage_profiles')
          .update({ is_active: next })
          .eq('id', myProfile.id);
        setMyProfile({ ...myProfile, is_active: next });
      }
    } finally {
      setToggling(false);
    }
  }

  const buildQuery = useCallback((p: number) => {
    const params = new URLSearchParams();
    params.set('page', String(p));
    if (gender)   params.set('gender',   gender);
    if (country)  params.set('country',  country);
    if (palId)    params.set('palId',    palId);
    if (eduLevel) params.set('eduLevel', eduLevel);
    if (status)   params.set('status',   status);
    if (ageMin)   params.set('ageMin',   ageMin);
    if (ageMax)   params.set('ageMax',   ageMax);
    return `/api/rishta?${params}`;
  }, [gender, country, palId, eduLevel, status, ageMin, ageMax]);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setPage(0);
    try {
      const res  = await fetch(buildQuery(0));
      const json = await res.json();
      const results: MarriageProfile[] = json.profiles ?? [];
      /* Fall back to sample data only when DB returns nothing */
      setProfiles(results.length > 0 ? results : SAMPLE_RISHTA as MarriageProfile[]);
      setHasMore(json.hasMore ?? false);
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  async function loadMore() {
    const next = page + 1;
    setLoadingMore(true);
    try {
      const res  = await fetch(buildQuery(next));
      const json = await res.json();
      setProfiles(prev => [...prev, ...(json.profiles ?? [])]);
      setHasMore(json.hasMore ?? false);
      setPage(next);
    } finally {
      setLoadingMore(false);
    }
  }

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

      {/* ── My profile visibility banner (logged-in users only) ── */}
      {user && myProfile !== undefined && (
        <div style={{
          background: myProfile?.is_active ? '#f0faf4' : '#fafafa',
          borderBottom: `2px solid ${myProfile?.is_active ? '#004225' : '#e0e0e0'}`,
          padding: 'clamp(14px,2vw,20px) clamp(16px,5vw,64px)',
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            display: 'flex', alignItems: 'center',
            gap: 16, flexWrap: 'wrap',
          }}>
            {/* Status dot + text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: myProfile?.is_active ? '#22c55e' : '#94a3b8',
                boxShadow: myProfile?.is_active ? '0 0 0 3px #bbf7d0' : 'none',
              }} />
              <div>
                <span style={{
                  fontFamily: ff, fontSize: 13, fontWeight: 600,
                  color: 'var(--ink)',
                }}>
                  {d.myProfileBanner[locale]}
                </span>
                <span style={{
                  fontFamily: ff, fontSize: 13,
                  color: 'var(--ink-soft)', marginInlineStart: 8,
                }}>
                  {myProfile === null
                    ? d.profileNone[locale]
                    : myProfile.is_active
                      ? d.profileVisible[locale]
                      : d.profileHidden[locale]}
                </span>
              </div>
            </div>

            {/* Toggle button */}
            <button
              onClick={toggleProfile}
              disabled={toggling}
              style={{
                background: myProfile?.is_active ? 'transparent' : 'var(--emerald)',
                color: myProfile?.is_active ? '#c0392b' : 'var(--cream)',
                border: myProfile?.is_active ? '1.5px solid #c0392b' : 'none',
                padding: '8px 20px', cursor: toggling ? 'wait' : 'pointer',
                fontFamily: ff, fontSize: 13, fontWeight: 600,
                opacity: toggling ? 0.6 : 1,
                minHeight: 38, whiteSpace: 'nowrap',
              }}
            >
              {toggling
                ? d.saving[locale]
                : myProfile === null
                  ? d.openProfile[locale]
                  : myProfile.is_active
                    ? d.hideProfile[locale]
                    : d.showProfile[locale]}
            </button>
          </div>
        </div>
      )}

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
            padding: '20px 20px',
            position: 'sticky', top: 20,
            alignSelf: 'start',
          }}>
            <div style={{
              fontFamily: ff, fontSize: 12, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--emerald)', marginBottom: filterOpen ? 20 : 0,
              paddingBottom: filterOpen ? 10 : 0,
              borderBottom: filterOpen ? '2px solid var(--gold)' : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <button
                onClick={() => setFilterOpen(v => !v)}
                className="filter-toggle"
                style={{
                  background: 'transparent', border: 0, cursor: 'pointer',
                  fontFamily: ff, fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--emerald)', padding: 0,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span>{filterOpen ? '▲' : '▼'}</span>
                <span>{locale === 'en' ? 'Filters' : locale === 'ur' ? 'فلٹر' : 'فلٹر'}</span>
              </button>
              {filterOpen && (
                <button onClick={clearFilters} style={{
                  background: 'transparent', border: 0, cursor: 'pointer',
                  color: 'var(--ink-mute)', fontFamily: ff, fontSize: 11,
                  textDecoration: 'underline',
                }}>
                  {d.clearFilters[locale]}
                </button>
              )}
            </div>

            {filterOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <FilterRow label={d.filterGender[locale]} ff={ff}>
                  <select style={SEL} value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">{d.anyOption[locale]}</option>
                    <option value="male">{locale === 'en' ? 'Male' : locale === 'ur' ? 'مرد' : 'مرد'}</option>
                    <option value="female">{locale === 'en' ? 'Female' : locale === 'ur' ? 'عورت' : 'عورت'}</option>
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
            )}
          </aside>

          {/* ── Profile grid ── */}
          <div>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: 20 }}>
                <svg width="56" height="56" viewBox="0 0 56 56" style={{ animation: 'rishta-spin 1.1s linear infinite' }}>
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#e8dfc4" strokeWidth="4"/>
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#D4AF37" strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="34 104"
                    strokeDashoffset="0"/>
                  <circle cx="28" cy="28" r="10" fill="none" stroke="#004225" strokeWidth="3"/>
                  <circle cx="28" cy="28" r="4" fill="#D4AF37"/>
                </svg>
                <span style={{ fontFamily: ff, fontSize: 13, color: 'var(--ink-mute)', letterSpacing: locale === 'en' ? '0.1em' : 0 }}>
                  {locale === 'en' ? 'Loading profiles…' : locale === 'ur' ? 'پروفائل لوڈ ہو رہے ہیں…' : 'پروفائل لوڈ ہو راں ہاں…'}
                </span>
                <style>{`@keyframes rishta-spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : profiles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 80, color: 'var(--ink-mute)', fontFamily: ff }}>
                {d.noResults[locale]}
              </div>
            ) : (
              <>
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
                      onExpand={() => setExpanded(mp)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      style={{
                        background: 'var(--emerald)', color: 'var(--cream)',
                        border: 'none', padding: '12px 36px',
                        fontFamily: ff, fontSize: 14, fontWeight: 600,
                        cursor: loadingMore ? 'wait' : 'pointer',
                        opacity: loadingMore ? 0.7 : 1,
                        letterSpacing: locale === 'en' ? '0.06em' : 0,
                        textTransform: locale === 'en' ? 'uppercase' : 'none',
                      }}
                    >
                      {loadingMore ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="18" height="18" viewBox="0 0 56 56" style={{ animation: 'rishta-spin 1.1s linear infinite' }}>
                          <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(245,245,220,0.3)" strokeWidth="5"/>
                          <circle cx="28" cy="28" r="22" fill="none" stroke="var(--cream)" strokeWidth="5"
                            strokeLinecap="round" strokeDasharray="34 104"/>
                        </svg>
                        {locale === 'en' ? 'Loading…' : 'لوڈ ہو رہا ہے…'}
                      </span>
                    ) : (locale === 'en' ? 'Load more profiles' : locale === 'ur' ? 'مزید پروفائل دیکھیں' : 'مزید پروفائل دیکھو')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer locale={locale} />

      {expanded && (
        <ProfileModal
          mp={expanded} locale={locale}
          ff={ff} ffH={ffH} dir={dir}
          isLoggedIn={Boolean(user)} d={d}
          onClose={() => setExpanded(null)}
        />
      )}

      <style>{`
        @media (min-width: 701px) {
          .filter-toggle { pointer-events: none; }
          .filter-toggle span:first-child { display: none; }
        }
        @media (max-width: 700px) {
          .rishta-grid { grid-template-columns: 1fr !important; }
          .rishta-grid aside { position: static !important; top: auto !important; }
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
