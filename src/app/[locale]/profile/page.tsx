'use client';

import { use, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { routing } from '@/config/routing';
import { getSupabase } from '@/lib/supabase-browser';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { cldUrl } from '@/lib/cloudinary';
import type { Locale } from '@/data/content';

type Tab = 'profile' | 'rishta' | 'password';

export default function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = use(params);
  if (!routing.locales.includes(rawLocale as (typeof routing.locales)[number])) notFound();
  const locale = rawLocale as Locale;
  const router   = useRouter();
  const search   = useSearchParams();

  const initTab = (search.get('tab') as Tab | null) ?? (search.get('reset') === '1' ? 'password' : 'profile');
  const [tab, setTab]     = useState<Tab>(initTab);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId]   = useState('');

  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff  = locale === 'en' ? 'var(--sans)' : 'var(--urdu)';
  const ffH = locale === 'en' ? 'var(--serif)' : 'var(--urdu)';

  /* ── Profile fields ── */
  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [fatherName, setFatherName] = useState('');
  const [contact,    setContact]    = useState('');
  const [city,       setCity]       = useState('');
  const [country,    setCountry]    = useState('');
  const [intro,      setIntro]      = useState('');
  const [picId,      setPicId]      = useState<string | null>(null);
  const [picPreview, setPicPreview] = useState<string | null>(null);
  const [picUploading, setPicUploading] = useState(false);
  const [profSaving, setProfSaving] = useState(false);
  const [profMsg,    setProfMsg]    = useState('');
  const photoRef = useRef<HTMLInputElement>(null);

  /* ── Rishta profile fields ── */
  const [rishta, setRishta] = useState({
    bio: '', height_cm: '', weight_kg: '', complexion: '',
    pref_age_min: '18', pref_age_max: '50',
    pref_education: '', pref_country: '', pref_notes: '',
    is_active: false,
  });
  const [rishtaExists,   setRishtaExists]   = useState(false);
  const [rishtaSaving,   setRishtaSaving]   = useState(false);
  const [rishtaMsg,      setRishtaMsg]      = useState('');
  const [degreeDocId,    setDegreeDocId]    = useState<string | null>(null);
  const [degreeType,     setDegreeType]     = useState('');
  const [degreeUploading, setDegreeUploading] = useState(false);
  const [degreeMsg,      setDegreeMsg]      = useState('');
  const degreeRef = useRef<HTMLInputElement>(null);

  /* ── Password fields ── */
  const [newPass,    setNewPass]    = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [passSaving, setPassSaving] = useState(false);
  const [passMsg,    setPassMsg]    = useState('');
  const [passErr,    setPassErr]    = useState('');
  const isReset = search.get('reset') === '1';

  useEffect(() => {
    async function load() {
      const sb = getSupabase();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { router.replace(`/${locale}/login`); return; }
      setUserId(user.id);

      const { data: p } = await sb.from('profiles')
        .select('first_name,last_name,father_name,contact_no,city,country,intro,profile_pic_id')
        .eq('id', user.id).single();
      if (p) {
        setFirstName(p.first_name ?? '');
        setLastName(p.last_name ?? '');
        setFatherName(p.father_name ?? '');
        setContact(p.contact_no ?? '');
        setCity(p.city ?? '');
        setCountry(p.country ?? '');
        setIntro(p.intro ?? '');
        setPicId(p.profile_pic_id ?? null);
      }

      const { data: mp } = await sb.from('marriage_profiles')
        .select('*').eq('user_id', user.id).single();
      if (mp) {
        setRishtaExists(true);
        setRishta({
          bio:            mp.bio ?? '',
          height_cm:      mp.height_cm?.toString() ?? '',
          weight_kg:      mp.weight_kg?.toString() ?? '',
          complexion:     mp.complexion ?? '',
          pref_age_min:   mp.pref_age_min?.toString() ?? '18',
          pref_age_max:   mp.pref_age_max?.toString() ?? '50',
          pref_education: mp.pref_education ?? '',
          pref_country:   mp.pref_country ?? '',
          pref_notes:     mp.pref_notes ?? '',
          is_active:      mp.is_active ?? false,
        });
        setDegreeDocId(mp.degree_doc_id ?? null);
        setDegreeType(mp.degree_type ?? '');
      }
      setLoading(false);
    }
    load();
  }, [locale, router]);

  /* ── Photo ── */
  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    /* local preview immediately */
    setPicPreview(URL.createObjectURL(file));
    setPicUploading(true);
    try {
      const r = await uploadToCloudinary(file, 'meoqoum/profiles');
      if (r) {
        setPicId(r.publicId);
        await getSupabase().from('profiles').update({ profile_pic_id: r.publicId }).eq('id', userId);
        setProfMsg(locale === 'en' ? '✓ Profile photo updated.' : '✓ تصویر اپڈیٹ ہو گئی۔');
      }
    } catch { setProfMsg(locale === 'en' ? 'Photo upload failed.' : 'تصویر اپ لوڈ ناکام۔'); }
    finally { setPicUploading(false); }
  }

  /* ── Save profile ── */
  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfSaving(true); setProfMsg('');
    const { error } = await getSupabase().from('profiles').update({
      first_name:  firstName.trim(),
      last_name:   lastName.trim(),
      father_name: fatherName.trim(),
      contact_no:  contact.trim(),
      city:        city.trim(),
      country:     country.trim(),
      intro:       intro.trim(),
    }).eq('id', userId);
    setProfSaving(false);
    setProfMsg(error ? (locale === 'en' ? 'Save failed: ' + error.message : 'ناکام۔') : (locale === 'en' ? '✓ Profile saved.' : '✓ پروفائل محفوظ۔'));
  }

  /* ── Save rishta profile ── */
  async function saveRishta(e: React.FormEvent) {
    e.preventDefault();
    setRishtaSaving(true); setRishtaMsg('');
    const payload = {
      user_id:        userId,
      bio:            rishta.bio.trim(),
      height_cm:      rishta.height_cm ? Number(rishta.height_cm) : null,
      weight_kg:      rishta.weight_kg ? Number(rishta.weight_kg) : null,
      complexion:     rishta.complexion || null,
      pref_age_min:   Number(rishta.pref_age_min) || 18,
      pref_age_max:   Number(rishta.pref_age_max) || 50,
      pref_education: rishta.pref_education || null,
      pref_country:   rishta.pref_country || null,
      pref_notes:     rishta.pref_notes || null,
      is_active:      rishta.is_active,
      degree_doc_id:  degreeDocId,
      degree_type:    degreeType.trim() || null,
    };
    const sb = getSupabase();
    const { error } = rishtaExists
      ? await sb.from('marriage_profiles').update(payload).eq('user_id', userId)
      : await sb.from('marriage_profiles').insert(payload);

    setRishtaSaving(false);
    if (error) { setRishtaMsg(locale === 'en' ? 'Save failed: ' + error.message : 'ناکام۔'); return; }
    setRishtaExists(true);
    setRishtaMsg(locale === 'en' ? '✓ Rishta profile saved.' : '✓ رشتہ پروفائل محفوظ۔');
  }

  /* ── Degree PDF upload ── */
  const MAX_DEGREE_BYTES = 5 * 1024 * 1024; // 5 MB

  async function handleDegreeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_DEGREE_BYTES) {
      setDegreeMsg(locale === 'en'
        ? `File is ${(file.size / 1024 / 1024).toFixed(1)} MB — maximum is 5 MB. Please compress the PDF.`
        : `فائل ${(file.size / 1024 / 1024).toFixed(1)} MB ہے — زیادہ سے زیادہ 5 MB۔ PDF کو چھوٹا کریں۔`);
      e.target.value = '';
      return;
    }
    setDegreeUploading(true); setDegreeMsg('');
    try {
      const { uploadDocToCloudinary } = await import('@/lib/cloudinary-upload');
      const r = await uploadDocToCloudinary(file, 'meoqoum/degrees');
      if (r) {
        setDegreeDocId(r.publicId);
        setDegreeMsg(locale === 'en' ? '✓ Document uploaded. Save your profile to confirm.' : '✓ دستاویز اپ لوڈ ہو گئی۔ پروفائل محفوظ کریں۔');
      }
    } catch (err) {
      setDegreeMsg(String(err));
    } finally {
      setDegreeUploading(false);
    }
  }

  /* ── Change password ── */
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassErr(''); setPassMsg('');
    if (newPass.length < 6) { setPassErr(locale === 'en' ? 'Minimum 6 characters.' : 'کم از کم 6 حروف۔'); return; }
    if (newPass !== confirm)  { setPassErr(locale === 'en' ? 'Passwords do not match.' : 'پاس ورڈ مطابقت نہیں۔'); return; }
    setPassSaving(true);
    const { error } = await getSupabase().auth.updateUser({ password: newPass });
    setPassSaving(false);
    if (error) { setPassErr(error.message); return; }
    setPassMsg(locale === 'en' ? '✓ Password changed.' : '✓ پاس ورڈ بدل گیا۔');
    setNewPass(''); setConfirm('');
  }

  /* ── Shared styles ── */
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1.5px solid var(--rule)',
    background: '#fafaf8', fontFamily: ff, fontSize: 14, outline: 'none',
    boxSizing: 'border-box', direction: dir,
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: ff, fontSize: 11, fontWeight: 600,
    letterSpacing: '0.09em', textTransform: 'uppercase',
    color: 'var(--ink-mute)', marginBottom: 5,
  };
  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 0 };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'profile',  label: locale === 'en' ? 'Profile'         : 'پروفائل'      },
    { key: 'rishta',   label: locale === 'en' ? 'Rishta Profile'  : 'رشتہ پروفائل' },
    { key: 'password', label: locale === 'en' ? 'Password'        : 'پاس ورڈ'      },
  ];

  if (loading) return (
    <div className="mp-root" dir={dir}>
      <Header active="home" />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ff, color: 'var(--ink-mute)' }}>
        {locale === 'en' ? 'Loading…' : 'لوڈ ہو رہا ہے…'}
      </div>
      <Footer locale={locale} />
    </div>
  );

  /* ── display photo src ── */
  const displayPic = picPreview ?? (picId ? cldUrl(picId, { w: 200, h: 200, crop: 'fill' }) : null);

  return (
    <div className="mp-root" dir={dir}>
      <Header active="home" />

      <section style={{ background: 'var(--cream)', padding: 'clamp(40px,5vw,72px) clamp(20px,5vw,64px)', minHeight: 'calc(100vh - 120px)' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>

          {/* Page header with avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, direction: dir }}>
            {/* Avatar with click-to-upload */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%', overflow: 'hidden',
                border: '3px solid var(--gold)', position: 'relative',
                background: 'var(--emerald)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }} onClick={() => photoRef.current?.click()}>
                {displayPic
                  ? <Image src={displayPic} alt="Profile photo" fill style={{ objectFit: 'cover' }} sizes="88px" />
                  : <span style={{ fontFamily: 'var(--serif)', fontSize: 34, fontWeight: 700, color: 'var(--cream)' }}>
                      {firstName.slice(0, 1).toUpperCase() || '?'}
                    </span>
                }
              </div>
              {/* Camera overlay */}
              <button
                onClick={() => photoRef.current?.click()}
                disabled={picUploading}
                style={{
                  position: 'absolute', bottom: 0, insetInlineEnd: 0,
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'var(--gold)', border: '2px solid #fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12,
                }}
                title={locale === 'en' ? 'Change photo' : 'تصویر بدلیں'}
              >
                {picUploading ? '⏳' : '📷'}
              </button>
              <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoSelect} />
            </div>

            <div>
              <h1 style={{ fontFamily: ffH, fontSize: 'clamp(22px,2.8vw,30px)', color: 'var(--emerald-deep)', margin: 0, lineHeight: 1.2 }}>
                {firstName || (locale === 'en' ? 'My Account' : 'میرا اکاؤنٹ')}
              </h1>
              <button onClick={() => photoRef.current?.click()} style={{ fontFamily: ff, fontSize: 12, color: 'var(--emerald)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textDecoration: 'underline', marginTop: 4 }}>
                {picUploading ? (locale === 'en' ? 'Uploading…' : 'اپ لوڈ ہو رہا ہے…') : (locale === 'en' ? 'Change profile photo' : 'پروفائل تصویر بدلیں')}
              </button>
              {profMsg && profMsg.includes('photo') && (
                <div style={{ fontSize: 12, color: profMsg.startsWith('✓') ? 'var(--emerald)' : '#c0392b', marginTop: 2, fontFamily: ff }}>{profMsg}</div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '2px solid var(--rule)' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '10px 18px', fontFamily: ff, fontSize: 13, fontWeight: 600,
                background: 'transparent',
                color: tab === t.key ? 'var(--emerald)' : 'var(--ink-mute)',
                border: 'none', borderBottom: tab === t.key ? '2px solid var(--emerald)' : '2px solid transparent',
                marginBottom: -2, cursor: 'pointer',
                letterSpacing: locale === 'en' ? '0.05em' : 0,
                textTransform: locale === 'en' ? 'uppercase' : 'none',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── PROFILE TAB ── */}
          {tab === 'profile' && (
            <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>{locale === 'en' ? 'First Name *' : 'پہلا نام *'}</label>
                  <input style={inputStyle} value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>{locale === 'en' ? 'Last Name *' : 'آخری نام *'}</label>
                  <input style={inputStyle} value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>{locale === 'en' ? "Father's Name" : 'والد کا نام'}</label>
                <input style={inputStyle} value={fatherName} onChange={e => setFatherName(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>{locale === 'en' ? 'City' : 'شہر'}</label>
                  <input style={inputStyle} value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>{locale === 'en' ? 'Country' : 'ملک'}</label>
                  <input style={inputStyle} value={country} onChange={e => setCountry(e.target.value)} />
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>{locale === 'en' ? 'Contact Number' : 'رابطہ نمبر'}</label>
                <input style={inputStyle} type="tel" value={contact} onChange={e => setContact(e.target.value)} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>{locale === 'en' ? 'About You' : 'اپنے بارے میں'}</label>
                <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={intro} onChange={e => setIntro(e.target.value)} maxLength={500} />
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', textAlign: 'end', marginTop: 2 }}>{intro.length}/500</div>
              </div>
              {profMsg && !profMsg.includes('photo') && (
                <p style={{ fontFamily: ff, fontSize: 13, color: profMsg.startsWith('✓') ? 'var(--emerald)' : '#c0392b', margin: 0 }}>{profMsg}</p>
              )}
              <button type="submit" disabled={profSaving} style={{ background: 'var(--emerald)', color: 'var(--cream)', border: 0, padding: '12px 28px', fontFamily: ff, fontSize: 14, fontWeight: 700, cursor: profSaving ? 'not-allowed' : 'pointer', opacity: profSaving ? 0.7 : 1, alignSelf: 'flex-start' }}>
                {profSaving ? (locale === 'en' ? 'Saving…' : 'محفوظ ہو رہا ہے…') : (locale === 'en' ? 'Save Changes' : 'تبدیلیاں محفوظ')}
              </button>
            </form>
          )}

          {/* ── RISHTA TAB ── */}
          {tab === 'rishta' && (
            <form onSubmit={saveRishta} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Visibility toggle */}
              <div style={{ background: rishta.is_active ? '#f0f8f4' : '#fafaf8', border: `1.5px solid ${rishta.is_active ? 'var(--emerald)' : 'var(--rule)'}`, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: rishta.is_active ? 'var(--emerald)' : 'var(--ink-mute)' }}>
                    {rishta.is_active
                      ? (locale === 'en' ? '🟢 Profile is visible in Rishta directory' : '🟢 پروفائل رشتہ ڈائریکٹری میں نظر آ رہی ہے')
                      : (locale === 'en' ? '⚫ Profile is hidden from Rishta directory' : '⚫ پروفائل رشتہ ڈائریکٹری میں چھپی ہے')}
                  </div>
                  <div style={{ fontFamily: ff, fontSize: 11, color: 'var(--ink-mute)', marginTop: 3 }}>
                    {locale === 'en' ? 'Toggle to show or hide your profile from other members.' : 'اپنی پروفائل دکھانے یا چھپانے کے لیے ٹوگل کریں۔'}
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, flexShrink: 0, cursor: 'pointer' }}>
                  <input type="checkbox" checked={rishta.is_active} onChange={e => setRishta(r => ({ ...r, is_active: e.target.checked }))} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                  <span style={{ position: 'absolute', inset: 0, background: rishta.is_active ? 'var(--emerald)' : '#ccc', borderRadius: 24, transition: '.2s' }} />
                  <span style={{ position: 'absolute', top: 3, insetInlineStart: rishta.is_active ? 'calc(100% - 21px)' : 3, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: '.2s' }} />
                </label>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>{locale === 'en' ? 'Bio / Introduction' : 'مختصر تعارف'}</label>
                <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} value={rishta.bio} onChange={e => setRishta(r => ({ ...r, bio: e.target.value }))} placeholder={locale === 'en' ? 'Tell families a little about yourself…' : 'اپنے بارے میں کچھ لکھیں…'} maxLength={600} />
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', textAlign: 'end', marginTop: 2 }}>{rishta.bio.length}/600</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>{locale === 'en' ? 'Height (cm)' : 'قد (سینٹی میٹر)'}</label>
                  <input style={inputStyle} type="number" min={100} max={250} value={rishta.height_cm} onChange={e => setRishta(r => ({ ...r, height_cm: e.target.value }))} placeholder="165" />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>{locale === 'en' ? 'Weight (kg)' : 'وزن (کلو)'}</label>
                  <input style={inputStyle} type="number" min={30} max={200} value={rishta.weight_kg} onChange={e => setRishta(r => ({ ...r, weight_kg: e.target.value }))} placeholder="65" />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>{locale === 'en' ? 'Complexion' : 'رنگ'}</label>
                  <select style={{ ...inputStyle }} value={rishta.complexion} onChange={e => setRishta(r => ({ ...r, complexion: e.target.value }))}>
                    <option value="">—</option>
                    {['fair', 'medium', 'olive', 'dark'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {/* Degree / Achievement PDF */}
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
                <div style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 14 }}>
                  {locale === 'en' ? 'Degree / Achievement Document' : 'ڈگری / اہم دستاویز'}
                </div>
                <p style={{ fontFamily: ff, fontSize: 12, color: 'var(--ink-mute)', lineHeight: 1.6, marginBottom: 12 }}>
                  {locale === 'en'
                    ? 'Upload one PDF (max 5 MB) combining your degrees, certificates or other achievements for admin verification.'
                    : 'ایک PDF (زیادہ سے زیادہ 5 MB) اپ لوڈ کریں جس میں آپ کی ڈگریاں، سرٹیفکیٹ یا دیگر کامیابیاں شامل ہوں۔ ایڈمن تصدیق کرے گا۔'}
                </p>

                <div style={fieldStyle}>
                  <label style={labelStyle}>{locale === 'en' ? 'Degree / Document Type' : 'ڈگری / دستاویز کی قسم'}</label>
                  <input style={inputStyle} value={degreeType} onChange={e => setDegreeType(e.target.value)} placeholder={locale === 'en' ? 'e.g. MBBS, BSc Engineering, MBA…' : 'مثلاً MBBS، BSc انجینئرنگ، MBA…'} />
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
                  <input ref={degreeRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleDegreeUpload} />
                  <button type="button" onClick={() => degreeRef.current?.click()} disabled={degreeUploading}
                    style={{ background: 'var(--emerald-soft, #f0f8f4)', border: '1.5px dashed var(--emerald)', color: 'var(--emerald)', fontFamily: ff, fontSize: 13, fontWeight: 600, padding: '9px 18px', cursor: degreeUploading ? 'not-allowed' : 'pointer', opacity: degreeUploading ? 0.7 : 1 }}>
                    {degreeUploading ? (locale === 'en' ? '⏳ Uploading…' : '⏳ اپ لوڈ ہو رہا ہے…') : (locale === 'en' ? '↑ Upload PDF (max 5 MB)' : '↑ PDF اپ لوڈ کریں (زیادہ سے زیادہ 5 MB)')}
                  </button>
                  {degreeDocId && (
                    <a href={`/api/pdf?url=https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${degreeDocId}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: ff, fontSize: 12, color: 'var(--emerald)', textDecoration: 'underline' }}>
                      {locale === 'en' ? '📄 View uploaded document' : '📄 اپ لوڈ شدہ دستاویز دیکھیں'}
                    </a>
                  )}
                </div>
                {degreeMsg && (
                  <p style={{ fontFamily: ff, fontSize: 12, color: degreeMsg.startsWith('✓') ? 'var(--emerald)' : '#c0392b', marginTop: 8, margin: '8px 0 0' }}>{degreeMsg}</p>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 16 }}>
                <div style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 14 }}>
                  {locale === 'en' ? 'Partner Preferences' : 'پارٹنر ترجیحات'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>{locale === 'en' ? 'Min Age' : 'کم از کم عمر'}</label>
                    <input style={inputStyle} type="number" min={18} max={80} value={rishta.pref_age_min} onChange={e => setRishta(r => ({ ...r, pref_age_min: e.target.value }))} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>{locale === 'en' ? 'Max Age' : 'زیادہ سے زیادہ عمر'}</label>
                    <input style={inputStyle} type="number" min={18} max={80} value={rishta.pref_age_max} onChange={e => setRishta(r => ({ ...r, pref_age_max: e.target.value }))} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>{locale === 'en' ? 'Preferred Country' : 'پسندیدہ ملک'}</label>
                    <input style={inputStyle} value={rishta.pref_country} onChange={e => setRishta(r => ({ ...r, pref_country: e.target.value }))} placeholder={locale === 'en' ? 'Any country' : 'کوئی بھی'} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>{locale === 'en' ? 'Min Education' : 'کم از کم تعلیم'}</label>
                    <select style={{ ...inputStyle }} value={rishta.pref_education} onChange={e => setRishta(r => ({ ...r, pref_education: e.target.value }))}>
                      <option value="">— Any —</option>
                      {['primary','secondary','intermediate','bachelor','master','phd'].map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ ...fieldStyle, marginTop: 14 }}>
                  <label style={labelStyle}>{locale === 'en' ? 'Additional Notes' : 'اضافی نوٹس'}</label>
                  <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={rishta.pref_notes} onChange={e => setRishta(r => ({ ...r, pref_notes: e.target.value }))} placeholder={locale === 'en' ? 'Any specific preferences…' : 'کوئی خاص ترجیح…'} />
                </div>
              </div>

              {rishtaMsg && (
                <p style={{ fontFamily: ff, fontSize: 13, color: rishtaMsg.startsWith('✓') ? 'var(--emerald)' : '#c0392b', margin: 0 }}>{rishtaMsg}</p>
              )}
              <button type="submit" disabled={rishtaSaving} style={{ background: 'var(--emerald)', color: 'var(--cream)', border: 0, padding: '12px 28px', fontFamily: ff, fontSize: 14, fontWeight: 700, cursor: rishtaSaving ? 'not-allowed' : 'pointer', opacity: rishtaSaving ? 0.7 : 1, alignSelf: 'flex-start' }}>
                {rishtaSaving ? (locale === 'en' ? 'Saving…' : 'محفوظ ہو رہا ہے…') : (locale === 'en' ? (rishtaExists ? 'Update Rishta Profile' : 'Create Rishta Profile') : (rishtaExists ? 'رشتہ پروفائل اپڈیٹ' : 'رشتہ پروفائل بنائیں'))}
              </button>
            </form>
          )}

          {/* ── PASSWORD TAB ── */}
          {tab === 'password' && (
            <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 380 }}>
              {isReset && (
                <div style={{ background: '#f0f8f4', border: '1px solid var(--emerald)', padding: '10px 14px', fontFamily: ff, fontSize: 13, color: 'var(--emerald-deep)' }}>
                  {locale === 'en' ? 'Set your new password below.' : 'نیچے نیا پاس ورڈ سیٹ کریں۔'}
                </div>
              )}
              <div style={fieldStyle}>
                <label style={labelStyle}>{locale === 'en' ? 'New Password' : 'نیا پاس ورڈ'}</label>
                <input type="password" style={inputStyle} value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={6} autoComplete="new-password" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>{locale === 'en' ? 'Confirm New Password' : 'پاس ورڈ دوبارہ'}</label>
                <input type="password" style={inputStyle} value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} autoComplete="new-password" />
              </div>
              {passErr && <p style={{ fontFamily: ff, fontSize: 13, color: '#c0392b', margin: 0 }}>{passErr}</p>}
              {passMsg && <p style={{ fontFamily: ff, fontSize: 13, color: 'var(--emerald)', margin: 0 }}>{passMsg}</p>}
              <button type="submit" disabled={passSaving} style={{ background: 'var(--emerald)', color: 'var(--cream)', border: 0, padding: '12px 28px', fontFamily: ff, fontSize: 14, fontWeight: 700, cursor: passSaving ? 'not-allowed' : 'pointer', opacity: passSaving ? 0.7 : 1, alignSelf: 'flex-start' }}>
                {passSaving ? (locale === 'en' ? 'Updating…' : 'اپڈیٹ ہو رہا ہے…') : (locale === 'en' ? 'Change Password' : 'پاس ورڈ بدلیں')}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}
