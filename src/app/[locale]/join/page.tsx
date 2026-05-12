'use client';

import { use, useState, useRef } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { StarKhatim } from '@/components/svg';
import { routing } from '@/config/routing';
import { JOIN, type Locale } from '@/data/content';
import {
  PALS, GOTRAS, EDUCATION_LEVELS, PROFESSIONS,
  BLOOD_GROUPS, MARITAL_STATUS, COUNTRIES,
} from '@/data/form-options';
import { getSupabase } from '@/lib/supabase-browser';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { cldUrl } from '@/lib/cloudinary';

/* ─── Tiny shared components ───────────────────────────────────────────────── */

function Section({ title, ff, children }: { title: string; ff: string; children: React.ReactNode }) {
  return (
    <fieldset style={{
      border: 0, padding: 0, margin: '0 0 36px',
    }}>
      <legend style={{
        fontFamily: ff, fontSize: 13, fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--emerald)', paddingBottom: 10,
        borderBottom: '2px solid var(--gold)',
        width: '100%', marginBottom: 24,
      }}>
        {title}
      </legend>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px 24px' }}>
        {children}
      </div>
    </fieldset>
  );
}

function Field({ label, required, full, children }: {
  label: string; required?: boolean; full?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={full ? { gridColumn: '1 / -1' } : {}}>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 600,
        color: 'var(--ink-soft)', marginBottom: 6,
        letterSpacing: '0.06em',
      }}>
        {label}{required && <span style={{ color: '#c0392b' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const INP: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1.5px solid var(--rule)',
  padding: '10px 12px', fontSize: 14, color: 'var(--ink)',
  background: 'var(--paper)', outline: 'none',
};
const SEL: React.CSSProperties = { ...INP, appearance: 'none', cursor: 'pointer' };

/* ─── Main page ─────────────────────────────────────────────────────────────── */

export default function JoinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = use(params);
  if (!routing.locales.includes(rawLocale as (typeof routing.locales)[number])) notFound();
  const locale = rawLocale as Locale;

  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const ff  = 'var(--sans)';   // form always in sans for readability
  const ffH = locale === 'en' ? 'var(--serif)' : 'var(--urdu)';
  const d   = JOIN;

  /* ── form state ─────────────────────────────────────── */
  const [f, setF] = useState({
    firstName: '', lastName: '', fatherName: '', dob: '', gender: '',
    maritalStatus: '', palId: '', gotraId: '', village: '',
    educationLevel: '', educationField: '', profession: '', bloodGroup: '',
    cnic: '', permAddr: '', currAddr: '',
    country: '', province: '', city: '',
    email: '', contact: '', password: '', confirmPass: '',
  });

  const [picFile,    setPicFile]    = useState<File | null>(null);
  const [picPreview, setPicPreview] = useState<string | null>(null);
  const [picId,      setPicId]      = useState<string | null>(null);

  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Partial<typeof f & { form: string }>>({});
  const [success,  setSuccess]  = useState(false);
  const picInputRef = useRef<HTMLInputElement>(null);

  /* ── derived: filtered gotras by pal, provinces by country, cities by province */
  const palGotras = GOTRAS.filter(g => {
    const pal = PALS.find(p => String(p.id) === f.palId);
    return pal ? g.palSlug === pal.slug : false;
  });

  const countryData = COUNTRIES.find(c => c.code === f.country);
  const provinces   = countryData?.provinces ?? [];
  const cities      = provinces.find(p => p.name === f.province)?.cities ?? [];

  /* ── handlers ─────────────────────────────────────────── */
  function set(key: keyof typeof f, val: string) {
    setF(prev => {
      const next = { ...prev, [key]: val };
      if (key === 'country')  { next.province = ''; next.city = ''; }
      if (key === 'province') { next.city = ''; }
      if (key === 'palId')    { next.gotraId = ''; }
      return next;
    });
  }

  function handlePic(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5 MB.');
      return;
    }
    setPicFile(file);
    setPicPreview(URL.createObjectURL(file));
    setPicId(null);
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!f.firstName.trim()) e.firstName = 'Required';
    if (!f.lastName.trim())  e.lastName  = 'Required';
    if (!f.fatherName.trim())e.fatherName= 'Required';
    if (!f.dob)              e.dob       = 'Required';
    if (!f.gender)           e.gender    = 'Required';
    if (!f.maritalStatus)    e.maritalStatus = 'Required';
    if (!f.palId)            e.palId     = 'Required';
    if (!f.educationLevel)   e.educationLevel = 'Required';
    if (!f.cnic.trim())      e.cnic      = 'Required';
    if (!f.permAddr.trim())  e.permAddr  = 'Required';
    if (!f.country)          e.country   = 'Required';
    if (!f.city)             e.city      = 'Required';
    if (!f.email.trim())     e.email     = 'Required';
    if (!f.password)         e.password  = 'Required';
    if (f.password && f.password.length < 8) e.password = 'Min 8 characters';
    if (f.password !== f.confirmPass) e.confirmPass = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      const sb = getSupabase();

      /* 1. Upload profile picture if selected */
      let uploadedPicId = picId;
      if (picFile && !uploadedPicId) {
        const result = await uploadToCloudinary(picFile, 'meoqoum/profiles');
        uploadedPicId = result.publicId;
        setPicId(uploadedPicId);
      }

      /* 2. Create auth user */
      const { data: authData, error: authErr } = await sb.auth.signUp({
        email: f.email.trim(),
        password: f.password,
      });
      if (authErr) {
        setErrors({ form: authErr.message });
        return;
      }
      const userId = authData.user?.id;
      if (!userId) {
        setErrors({ form: 'Signup failed. Please try again.' });
        return;
      }

      /* 3. Insert profile record */
      const palObj = PALS.find(p => String(p.id) === f.palId);
      const { error: profileErr } = await sb.from('profiles').insert({
        id:              userId,
        first_name:      f.firstName.trim(),
        last_name:       f.lastName.trim(),
        father_name:     f.fatherName.trim(),
        date_of_birth:   f.dob,
        gender:          f.gender,
        marital_status:  f.maritalStatus,
        pal_id:          f.palId ? Number(f.palId) : null,
        gotra_id:        f.gotraId ? Number(f.gotraId) : null,
        pichla_gaoon:    f.village.trim() || null,
        education_level: f.educationLevel || null,
        education_field: f.educationField.trim() || null,
        profession:      f.profession || null,
        blood_group:     f.bloodGroup || null,
        religion:        'Islam',
        cnic_no:         f.cnic.trim(),
        permanent_addr:  f.permAddr.trim(),
        current_addr:    f.currAddr.trim() || null,
        country:         f.country || null,
        state_province:  f.province || null,
        city:            f.city || null,
        contact_no:      f.contact.trim() || null,
        profile_pic_id:  uploadedPicId,
      });

      if (profileErr) {
        setErrors({ form: profileErr.message });
        return;
      }

      setSuccess(true);
    } catch (err) {
      setErrors({ form: String(err) });
    } finally {
      setLoading(false);
    }
  }

  /* ── success screen ─────────────────────────────────── */
  if (success) {
    return (
      <div className="mp-root" dir={dir}>
        <Header active="home" />
        <div style={{
          minHeight: 'calc(100vh - 180px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', textAlign: 'center',
          padding: '60px 24px',
          background: 'linear-gradient(180deg, var(--cream) 0%, var(--cream-warm) 100%)',
        }}>
          <StarKhatim size={48} color="#D4AF37" />
          <h1 style={{ fontFamily: ffH, fontSize: 'clamp(28px,4vw,40px)', marginTop: 24, marginBottom: 16 }}>
            {d.successTitle[locale]}
          </h1>
          <p style={{ fontFamily: ff, fontSize: 16, color: 'var(--ink-soft)', maxWidth: 440, lineHeight: 1.7 }}>
            {d.successSub[locale]}
          </p>
          <Link href={`/${locale}/login`} style={{
            marginTop: 32, display: 'inline-block',
            background: 'var(--emerald)', color: 'var(--cream)',
            padding: '12px 28px', textDecoration: 'none',
            fontFamily: ff, fontWeight: 600,
          }}>
            {locale === 'en' ? 'Go to Login' : locale === 'ur' ? 'لاگ ان پر جائیں' : 'لاگ ان پر جاؤ'}
          </Link>
        </div>
        <Footer locale={locale} />
      </div>
    );
  }

  /* ── form ─────────────────────────────────────────────── */
  return (
    <div className="mp-root" dir={dir}>
      <Header active="home" />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(180deg, var(--emerald-deep) 0%, var(--emerald) 100%)',
        padding: 'clamp(32px,4vw,56px) clamp(20px,5vw,64px)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span className="mp-eyebrow" style={{ fontFamily: ff, color: 'var(--gold-light)' }}>
            {d.eyebrow[locale]}
          </span>
          <h1 style={{
            fontFamily: ffH, fontSize: 'clamp(32px,4vw,48px)',
            color: 'var(--cream)', marginTop: 12, marginBottom: 0, lineHeight: 1.1,
          }}>
            {d.title[locale]}
          </h1>
          <p style={{ fontFamily: ff, fontSize: 15, color: 'rgba(245,245,220,0.8)', marginTop: 12, maxWidth: 600, lineHeight: 1.7 }}>
            {d.sub[locale]}
          </p>
        </div>
      </div>

      {/* Form body */}
      <section style={{ background: 'var(--cream)', padding: 'clamp(32px,4vw,56px) clamp(20px,5vw,64px) 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <form onSubmit={handleSubmit} noValidate>

            {/* ── S1 Personal ── */}
            <Section title={d.s1[locale]} ff={ff}>
              <Field label={d.firstName[locale]} required>
                <input style={{ ...INP, fontFamily: ff }} value={f.firstName}
                  onChange={e => set('firstName', e.target.value)} />
                {errors.firstName && <Err msg={errors.firstName} />}
              </Field>
              <Field label={d.lastName[locale]} required>
                <input style={{ ...INP, fontFamily: ff }} value={f.lastName}
                  onChange={e => set('lastName', e.target.value)} />
                {errors.lastName && <Err msg={errors.lastName} />}
              </Field>
              <Field label={d.fatherName[locale]} required>
                <input style={{ ...INP, fontFamily: ff }} value={f.fatherName}
                  onChange={e => set('fatherName', e.target.value)} />
                {errors.fatherName && <Err msg={errors.fatherName} />}
              </Field>
              <Field label={d.dob[locale]} required>
                <input type="date" style={{ ...INP, fontFamily: ff }} value={f.dob}
                  onChange={e => set('dob', e.target.value)}
                  max={new Date(Date.now() - 18 * 365.25 * 86400000).toISOString().slice(0, 10)}
                />
                {errors.dob && <Err msg={errors.dob} />}
              </Field>
              <Field label={d.gender[locale]} required>
                <div style={{ display: 'flex', gap: 24, paddingTop: 10 }}>
                  {(['male','female'] as const).map(g => (
                    <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: ff, fontSize: 14 }}>
                      <input type="radio" name="gender" value={g} checked={f.gender === g}
                        onChange={() => set('gender', g)} style={{ accentColor: 'var(--emerald)' }} />
                      {g === 'male' ? d.male[locale] : d.female[locale]}
                    </label>
                  ))}
                </div>
                {errors.gender && <Err msg={errors.gender} />}
              </Field>
              <Field label={d.maritalStatus[locale]} required>
                <select style={{ ...SEL, fontFamily: ff }} value={f.maritalStatus}
                  onChange={e => set('maritalStatus', e.target.value)}>
                  <option value="">{d.selectOption[locale]}</option>
                  {MARITAL_STATUS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {errors.maritalStatus && <Err msg={errors.maritalStatus} />}
              </Field>
              <Field label={d.bloodGroup[locale]}>
                <select style={{ ...SEL, fontFamily: ff }} value={f.bloodGroup}
                  onChange={e => set('bloodGroup', e.target.value)}>
                  <option value="">{d.selectOption[locale]}</option>
                  {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
            </Section>

            {/* ── S2 Heritage ── */}
            <Section title={d.s2[locale]} ff={ff}>
              <Field label={d.pal[locale]} required>
                <select style={{ ...SEL, fontFamily: ff }} value={f.palId}
                  onChange={e => set('palId', e.target.value)}>
                  <option value="">{d.selectOption[locale]}</option>
                  {PALS.map(p => (
                    <option key={p.id} value={String(p.id)}>{p.name} — {p.urdu}</option>
                  ))}
                </select>
                {errors.palId && <Err msg={errors.palId} />}
              </Field>
              <Field label={d.gotra[locale]}>
                <select style={{ ...SEL, fontFamily: ff }} value={f.gotraId}
                  onChange={e => set('gotraId', e.target.value)}
                  disabled={!f.palId}>
                  <option value="">{f.palId ? d.selectOption[locale] : (locale === 'en' ? 'Select Pal first' : locale === 'ur' ? 'پہلے پال چنیں' : 'پہلاں پال چُنو')}</option>
                  {palGotras.map((g, i) => (
                    <option key={i} value={String(i + 1)}>{g.name} — {g.urdu}</option>
                  ))}
                </select>
              </Field>
              <Field label={d.village[locale]} full>
                <input style={{ ...INP, fontFamily: ff }} value={f.village}
                  placeholder={locale === 'en' ? 'e.g. Nuh, Alwar, Bharatpur…' : locale === 'ur' ? 'مثلاً نوح، الور، بھرتپور…' : 'مثلاً نوح، الور، بھرتپور…'}
                  onChange={e => set('village', e.target.value)} />
              </Field>
            </Section>

            {/* ── S3 Education & Profession ── */}
            <Section title={d.s3[locale]} ff={ff}>
              <Field label={d.education[locale]} required>
                <select style={{ ...SEL, fontFamily: ff }} value={f.educationLevel}
                  onChange={e => set('educationLevel', e.target.value)}>
                  <option value="">{d.selectOption[locale]}</option>
                  {EDUCATION_LEVELS.map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
                {errors.educationLevel && <Err msg={errors.educationLevel} />}
              </Field>
              <Field label={d.eduField[locale]}>
                <input style={{ ...INP, fontFamily: ff }} value={f.educationField}
                  placeholder={locale === 'en' ? 'e.g. Computer Science, Medicine…' : locale === 'ur' ? 'مثلاً کمپیوٹر سائنس، طب…' : 'مثلاً کمپیوٹر سائنس، طب…'}
                  onChange={e => set('educationField', e.target.value)} />
              </Field>
              <Field label={d.profession[locale]}>
                <select style={{ ...SEL, fontFamily: ff }} value={f.profession}
                  onChange={e => set('profession', e.target.value)}>
                  <option value="">{d.selectOption[locale]}</option>
                  {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
            </Section>

            {/* ── S4 Location & Contact ── */}
            <Section title={d.s4[locale]} ff={ff}>
              <Field label={d.cnic[locale]} required>
                <input style={{ ...INP, fontFamily: ff }} value={f.cnic}
                  placeholder={locale === 'en' ? 'e.g. 35201-1234567-1 or Passport No.' : locale === 'ur' ? 'شناختی کارڈ یا پاسپورٹ نمبر' : 'شناختی کارڈ یا پاسپورٹ نمبر'}
                  onChange={e => set('cnic', e.target.value)} />
                {errors.cnic && <Err msg={errors.cnic} />}
              </Field>
              <Field label={d.country[locale]} required>
                <select style={{ ...SEL, fontFamily: ff }} value={f.country}
                  onChange={e => set('country', e.target.value)}>
                  <option value="">{d.selectOption[locale]}</option>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
                {errors.country && <Err msg={errors.country} />}
              </Field>
              <Field label={d.province[locale]}>
                <select style={{ ...SEL, fontFamily: ff }} value={f.province}
                  onChange={e => set('province', e.target.value)}
                  disabled={!f.country}>
                  <option value="">{d.selectOption[locale]}</option>
                  {provinces.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </Field>
              <Field label={d.city[locale]} required>
                <select style={{ ...SEL, fontFamily: ff }} value={f.city}
                  onChange={e => set('city', e.target.value)}
                  disabled={!f.province}>
                  <option value="">{d.selectOption[locale]}</option>
                  {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                {errors.city && <Err msg={errors.city} />}
              </Field>
              <Field label={d.permAddr[locale]} required full>
                <textarea rows={2} style={{ ...INP, fontFamily: ff, resize: 'vertical' }}
                  value={f.permAddr}
                  onChange={e => set('permAddr', e.target.value)} />
                {errors.permAddr && <Err msg={errors.permAddr} />}
              </Field>
              <Field label={d.currAddr[locale]} full>
                <textarea rows={2} style={{ ...INP, fontFamily: ff, resize: 'vertical' }}
                  value={f.currAddr}
                  onChange={e => set('currAddr', e.target.value)} />
              </Field>
              <Field label={d.contact[locale]}>
                <input style={{ ...INP, fontFamily: ff }} value={f.contact}
                  placeholder="+92 300 0000000"
                  onChange={e => set('contact', e.target.value)} />
              </Field>
            </Section>

            {/* ── S5 Account ── */}
            <Section title={d.s5[locale]} ff={ff}>
              <Field label={d.email[locale]} required full>
                <input type="email" style={{ ...INP, fontFamily: ff }} value={f.email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  onChange={e => set('email', e.target.value)} />
                {errors.email && <Err msg={errors.email} />}
              </Field>
              <Field label={d.password[locale]} required>
                <input type="password" style={{ ...INP, fontFamily: ff }} value={f.password}
                  autoComplete="new-password"
                  onChange={e => set('password', e.target.value)} />
                {errors.password && <Err msg={errors.password} />}
              </Field>
              <Field label={d.confirmPass[locale]} required>
                <input type="password" style={{ ...INP, fontFamily: ff }} value={f.confirmPass}
                  autoComplete="new-password"
                  onChange={e => set('confirmPass', e.target.value)} />
                {errors.confirmPass && <Err msg={errors.confirmPass} />}
              </Field>
            </Section>

            {/* ── S6 Profile Picture ── */}
            <fieldset style={{ border: 0, padding: 0, margin: '0 0 36px' }}>
              <legend style={{
                fontFamily: ff, fontSize: 13, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--emerald)', paddingBottom: 10,
                borderBottom: '2px solid var(--gold)', width: '100%', marginBottom: 24,
              }}>
                {d.s6[locale]}
              </legend>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{
                  width: 100, height: 100,
                  background: 'var(--rule)', position: 'relative', overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  {picPreview
                    ? <Image src={picPreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--emerald-soft), var(--emerald))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 36, color: 'var(--cream)', opacity: 0.5 }}>👤</span>
                      </div>
                  }
                </div>
                <div>
                  <button type="button"
                    onClick={() => picInputRef.current?.click()}
                    style={{
                      border: '1.5px solid var(--emerald)', background: 'transparent',
                      color: 'var(--emerald)', padding: '10px 20px',
                      fontFamily: ff, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}>
                    {d.uploadPic[locale]}
                  </button>
                  <p style={{ fontFamily: ff, fontSize: 11, color: 'var(--ink-mute)', marginTop: 8 }}>
                    {locale === 'en' ? 'JPG/PNG, max 5 MB' : locale === 'ur' ? 'JPG/PNG، زیادہ سے زیادہ 5 MB' : 'JPG/PNG، زیادہ سے زیادہ 5 MB'}
                  </p>
                  <input ref={picInputRef} type="file" accept="image/*"
                    onChange={handlePic} style={{ display: 'none' }} />
                </div>
              </div>
            </fieldset>

            {/* Global error */}
            {errors.form && (
              <div style={{
                background: '#fde8e8', border: '1px solid #c0392b',
                color: '#c0392b', padding: '12px 16px',
                fontFamily: ff, fontSize: 13, marginBottom: 24,
              }}>
                {errors.form}
              </div>
            )}

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <button type="submit" disabled={loading} style={{
                background: 'var(--emerald)', color: 'var(--cream)',
                border: 0, padding: '14px 40px', cursor: loading ? 'wait' : 'pointer',
                fontFamily: ff, fontSize: 15, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? (locale === 'en' ? 'Creating…' : locale === 'ur' ? 'بنا رہے ہیں…' : 'بنا راں ہاں…') : d.submitBtn[locale]}
              </button>
              <p style={{ fontFamily: ff, fontSize: 14, color: 'var(--ink-soft)' }}>
                {d.alreadyMember[locale]}{' '}
                <Link href={`/${locale}/login`} style={{ color: 'var(--emerald)', fontWeight: 600 }}>
                  {d.loginLink[locale]}
                </Link>
              </p>
            </div>

          </form>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}

function Err({ msg }: { msg: string }) {
  return <span style={{ color: '#c0392b', fontSize: 11, display: 'block', marginTop: 4 }}>{msg}</span>;
}
