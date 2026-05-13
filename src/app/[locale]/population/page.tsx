'use client';

import { use, useState } from 'react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { StarKhatim } from '@/components/svg';
import { routing } from '@/config/routing';
import { POPULATION, type Locale } from '@/data/content';
import { MAP_LOCATIONS } from '@/components/MewatiMap';

/* Load Leaflet map only client-side (no SSR) */
const MewatiMap = dynamic(() => import('@/components/MewatiMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: 'clamp(340px,55vw,560px)',
      background: '#f0f0ea',
      border: '2px solid var(--gold)',
      borderRadius: 6,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#888', fontFamily: 'var(--sans)', fontSize: 14,
    }}>
      Loading map…
    </div>
  ),
});

/* ── Stat card ──────────────────────────────────────────── */
function StatCard({
  value, label, sub, accent, ff,
}: {
  value: string; label: string; sub?: string;
  accent: string; ff: string;
}) {
  return (
    <div style={{
      background: '#fff',
      border: `2px solid ${accent}`,
      borderTop: `4px solid ${accent}`,
      borderRadius: 4,
      padding: 'clamp(16px,2vw,24px)',
    }}>
      <div style={{
        fontFamily: 'var(--serif)',
        fontSize: 'clamp(28px,3.5vw,42px)',
        fontWeight: 800,
        color: accent,
        lineHeight: 1,
        marginBottom: 6,
      }}>
        {value}
      </div>
      <div style={{ fontFamily: ff, fontSize: 13, color: '#1a2a1a', lineHeight: 1.4 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontFamily: ff, fontSize: 11, color: '#888', marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* ── Timeline row ───────────────────────────────────────── */
function TimelineRow({
  year, event, accent, ff,
}: {
  year: string; event: string; accent: string; ff: string;
}) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        minWidth: 52,
        fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 700,
        color: accent, paddingTop: 2,
      }}>
        {year}
      </div>
      <div style={{
        flex: 1,
        borderInlineStart: `2px solid ${accent}22`,
        paddingInlineStart: 16,
        paddingBottom: 20,
        fontFamily: ff, fontSize: 13, color: '#444', lineHeight: 1.65,
      }}>
        {event}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function PopulationPage({
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
  const d   = POPULATION;
  const [tab, setTab] = useState<'IN' | 'PK'>('PK');

  const INDIA    = '#C9872A';
  const PAKISTAN = '#1a5c38';

  const indiaTotal    = MAP_LOCATIONS.filter(l => l.country === 'IN').reduce((s, l) => s + l.population, 0);
  const pakistanTotal = MAP_LOCATIONS.filter(l => l.country === 'PK').reduce((s, l) => s + l.population, 0);
  const worldTotal    = indiaTotal + pakistanTotal;

  const timeline = locale === 'en' ? [
    { year: '1947', event: 'Partition divides the Meo homeland. ~193,000 Meos become part of Pakistan — full citizens of the new country. Some later move abroad for work or study.' },
    { year: '1971', event: 'India census records 401,596 Mewati speakers. Pakistan census does not list Mewati as a separate language.' },
    { year: '1995', event: 'First Mewati literary magazine published in Pakistan. Only 12 writers actively using the language.' },
    { year: '2005', event: 'Mewati included in some Pakistan cultural surveys, but still absent from the official census.' },
    { year: '2011', event: 'India census: 856,643 Mewati speakers — reflecting natural population growth over 40 years.' },
    { year: '2017', event: 'Pakistani Meo community activists begin formal campaign to include Mewati in the 2023 census.' },
    { year: '2023', event: 'Pakistan Census officially recognises Mewati as a distinct language: 1,094,219 speakers — more than in India. A milestone for Pakistani Meos.' },
  ] : locale === 'ur' ? [
    { year: '۱۹۴۷', event: 'تقسیم نے میوات کوں دو حصاں میں بانٹ دیو۔ تقریباً ۱۹۳,۰۰۰ میو پاکستان کے مکمل شہری بن گئے۔ بعد میں کچھ کام یا تعلیم کے لیے باہر چلے گئے۔' },
    { year: '۱۹۷۱', event: 'بھارتی مردم شماری میں ۴۰۱,۵۹۶ میواتی بولنے والے درج ہوئے۔ پاکستان میواتی کو علیحدہ زبان تسلیم نہیں کرتا۔' },
    { year: '۱۹۹۵', event: 'پاکستان میں پہلا میواتی ادبی رسالہ شائع۔ صرف ۱۲ لکھاری زبان کو فعال طور پر استعمال کر رہے تھے۔' },
    { year: '۲۰۰۵', event: 'میواتی کو بعض پاکستانی ثقافتی سروے میں شامل کیا گیا، لیکن سرکاری مردم شماری میں نہیں۔' },
    { year: '۲۰۱۱', event: 'بھارتی مردم شماری: ۸۵۶,۶۴۳ میواتی بولنے والے — قدرتی آبادی میں اضافہ۔' },
    { year: '۲۰۱۷', event: 'پاکستانی میو کمیونٹی کارکنوں نے ۲۰۲۳ کی مردم شماری میں میواتی کی شمولیت کی باضابطہ مہم شروع کی۔' },
    { year: '۲۰۲۳', event: 'پاکستانی مردم شماری نے باضابطہ میواتی کو الگ زبان تسلیم کیا: ۱,۰۹۴,۲۱۹ بولنے والے — بھارت سے زیادہ۔ پاکستانی میواں کے لیے ایک اہم سنگ میل۔' },
  ] : [
    { year: '۱۹۴۷', event: 'تقسیم نے میوات کوں دو حصاں میں بانٹ دیو۔ تقریباً ۱۹۳,۰۰۰ میو پاکستان کے مکمل شہری بن گئے۔' },
    { year: '۱۹۷۱', event: 'بھارتی مردم شماری میں ۴۰۱,۵۹۶ میواتی بولنے والے درج ہوئے۔ پاکستان میواتی کوں الگ زبان نہیں مانتو۔' },
    { year: '۲۰۱۱', event: 'بھارتی مردم شماری: ۸۵۶,۶۴۳ میواتی بولنے والے۔' },
    { year: '۲۰۲۳', event: 'پاکستانی مردم شماری نے باضابطہ میواتی کوں الگ زبان منیو: ۱,۰۹۴,۲۱۹ بولنے والے۔ پاکستانی میواں کے لیے اہم مقام۔' },
  ];

  return (
    <div className="mp-root" dir={dir}>
      <Header active="population" />

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(160deg, var(--emerald-deep) 0%, #0a2e1a 100%)',
        padding: 'clamp(40px,5vw,72px) clamp(20px,5vw,64px) clamp(32px,4vw,56px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v1H0zM0 0v40h1V0z' fill='%23D4AF37'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <span className="mp-eyebrow" style={{ fontFamily: ff, color: 'var(--gold-light)' }}>
            {d.eyebrow[locale]}
          </span>
          <h1 style={{
            fontFamily: ffH, color: 'var(--cream)',
            fontSize: 'clamp(30px,4.5vw,54px)',
            lineHeight: 1.1, marginTop: 12, marginBottom: 16,
          }}>
            {d.title[locale]}
          </h1>
          <p style={{
            fontFamily: ff, fontSize: 'clamp(13px,1.2vw,16px)',
            color: 'rgba(245,245,220,0.8)', maxWidth: 680, lineHeight: 1.8,
          }}>
            {d.sub[locale]}
          </p>

          {/* Summary figures */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32,
          }}>
            {[
              { v: '1.95M+', l: locale === 'en' ? 'Census total' : 'مردم شماری مجموعہ', c: 'var(--gold)' },
              { v: '~5.8M', l: locale === 'en' ? 'Community estimate' : 'کمیونٹی تخمینہ', c: 'var(--gold-light)' },
              { v: '76', l: locale === 'en' ? 'Years to recognition' : 'سال بعد شناخت', c: 'var(--gold)' },
              { v: '100+', l: locale === 'en' ? 'Books published' : 'کتابیں شائع', c: 'var(--gold-light)' },
            ].map(s => (
              <div key={s.v} style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${s.c}44`,
                padding: '12px 20px', borderRadius: 4,
              }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 800, color: s.c, lineHeight: 1 }}>
                  {s.v}
                </div>
                <div style={{ fontFamily: ff, fontSize: 11, color: 'rgba(245,245,220,0.65)', marginTop: 4 }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────── */}
      <section style={{
        background: '#f7f5f0',
        padding: 'clamp(32px,4vw,56px) clamp(16px,5vw,64px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Click hint */}
          <p style={{
            fontFamily: ff, fontSize: 12, color: '#888',
            textAlign: 'center', marginBottom: 12,
          }}>
            {d.clickHint[locale]}
          </p>

          {/* MAP */}
          <MewatiMap locale={locale} />

          <p style={{
            fontFamily: ff, fontSize: 11, color: '#aaa',
            textAlign: 'center', marginTop: 8,
          }}>
            {d.sourceCredit[locale]}
          </p>

          {/* ── Stat grid ─────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16, marginTop: 40,
          }}>
            <StatCard
              value={indiaTotal.toLocaleString()}
              label={locale === 'en' ? 'Mewati speakers in India' : 'بھارت میں میواتی بولنے والے'}
              sub={locale === 'en' ? '2011 Indian Census' : '۲۰۱۱ بھارتی مردم شماری'}
              accent={INDIA} ff={ff}
            />
            <StatCard
              value={pakistanTotal.toLocaleString()}
              label={locale === 'en' ? 'Mewati speakers in Pakistan' : 'پاکستان میں میواتی بولنے والے'}
              sub={locale === 'en' ? '2023 Pakistan Census' : '۲۰۲۳ پاکستانی مردم شماری'}
              accent={PAKISTAN} ff={ff}
            />
            <StatCard
              value={worldTotal.toLocaleString()}
              label={locale === 'en' ? 'Combined census total' : 'مشترکہ مردم شماری'}
              sub={locale === 'en' ? 'India + Pakistan' : 'بھارت + پاکستان'}
              accent="var(--emerald)" ff={ff}
            />
            <StatCard
              value="~5.8M"
              label={locale === 'en' ? 'Community leaders\' estimate' : 'کمیونٹی رہنماؤں کا تخمینہ'}
              sub={locale === 'en' ? '3× higher than census' : 'مردم شماری سے ۳ گنا زیادہ'}
              accent="var(--gold)" ff={ff}
            />
          </div>

          {/* ── Estimate note ──────────────────────── */}
          <div style={{
            marginTop: 16,
            background: '#fffbf0',
            border: '1px solid #e8d080',
            borderInlineStart: '4px solid var(--gold)',
            padding: '12px 16px',
            fontFamily: ff, fontSize: 13, color: '#5a4a10', lineHeight: 1.7,
            borderRadius: '0 4px 4px 0',
          }}>
            ⚠️ {d.estimateNote[locale]}
          </div>

          {/* ── Genetic Origins ─────────────────────── */}
          <div style={{
            marginTop: 48,
            paddingTop: 40,
            borderTop: '2px solid #e8e0d0',
          }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
              <div style={{
                background: 'var(--emerald-deep)',
                color: 'var(--gold)',
                fontFamily: 'var(--serif)',
                fontSize: 22,
                fontWeight: 800,
                padding: '6px 16px',
                borderRadius: 4,
                letterSpacing: '0.04em',
              }}>
                R1a1
              </div>
              <h2 style={{
                fontFamily: ffH,
                fontSize: 'clamp(20px,2vw,26px)',
                color: 'var(--emerald-deep)',
                margin: 0,
                lineHeight: 1.2,
              }}>
                {locale === 'en' ? 'Genetic Origins' : locale === 'ur' ? 'نسلی اصل و تاریخ' : 'نسلی اصل و تواریخ'}
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(20px,3vw,40px)',
            }}>
              {/* Left: genetic narrative */}
              <div>
                <p style={{
                  fontFamily: ff, fontSize: 'clamp(13px,1.1vw,15px)',
                  color: '#3a3a2a', lineHeight: 1.85, marginBottom: 20,
                }}>
                  {locale === 'en'
                    ? 'DNA studies place the Meo tribe within Haplogroup R1a1 — identified by the genetic marker M17. This ancient lineage traces to a population on the Eurasian steppes (present-day Ukraine and southern Russia) approximately 10,000–15,000 years ago. Their descendants spread across Europe, Central Asia, and South Asia, carrying the Indo-European language family, the domestication of horses, and this shared marker.'
                    : locale === 'ur'
                    ? 'ڈی این اے تحقیق کے مطابق میو قبیلہ ہیپلوگروپ R1a1 میں آتا ہے — جسے جینیاتی نشان M17 سے پہچانا جاتا ہے۔ یہ قدیم نسل تقریباً ۱۰,۰۰۰–۱۵,۰۰۰ سال پہلے یوریشین میدانوں (موجودہ یوکرین اور جنوبی روس) کی ایک آبادی سے جڑی ہے۔ ان کی نسل یورپ، وسطی ایشیا اور جنوبی ایشیا میں پھیلی، ہند-یورپی زبانوں اور گھوڑوں کو پالتو بنانے کا علم ساتھ لائی۔'
                    : 'ڈی این اے تحقیق کے مطابق میو قوم ہیپلوگروپ R1a1 میں آوے ہے — M17 نشان سے پہچانو جاوے ہے۔ یہ پرانی نسل تقریباً ۱۰,۰۰۰–۱۵,۰۰۰ سال پہلے یوریشین میدانوں سوں آئی ہے۔'}
                </p>

                {/* Two key stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    {
                      pct: '40%',
                      label: locale === 'en' ? 'of men from Czech Republic to Siberia carry M17' : 'چیک ری پبلک سے سائبیریا تک مردوں میں M17',
                    },
                    {
                      pct: '35%',
                      label: locale === 'en' ? 'of Urdu/Hindi-speaking populations carry M17' : 'اردو/ہندی بولنے والی آبادی میں M17',
                    },
                  ].map(s => (
                    <div key={s.pct} style={{
                      background: '#fff',
                      border: '1.5px solid var(--gold)',
                      borderTop: '4px solid var(--gold)',
                      borderRadius: 4,
                      padding: '14px 16px',
                    }}>
                      <div style={{
                        fontFamily: 'var(--serif)',
                        fontSize: 32, fontWeight: 800,
                        color: 'var(--gold)', lineHeight: 1,
                        marginBottom: 6,
                      }}>
                        {s.pct}
                      </div>
                      <div style={{ fontFamily: ff, fontSize: 11, color: '#555', lineHeight: 1.5 }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <p style={{
                  fontFamily: ff, fontSize: 12, color: '#888',
                  marginTop: 16, lineHeight: 1.7,
                }}>
                  {locale === 'en'
                    ? 'These figures show that the Meo genetic lineage connects them to a shared ancestral wave responsible for populating vast stretches of Eurasia — from Central Europe to the Indian subcontinent.'
                    : 'یہ اعداد و شمار ظاہر کرتے ہیں کہ میو نسل ایک قدیم آبادیاتی لہر سے جڑی ہے جس نے وسطی یورپ سے برصغیر تک بڑے علاقوں کو آباد کیا۔'}
                </p>
              </div>

              {/* Right: community structure */}
              <div>
                <h3 style={{
                  fontFamily: ffH,
                  fontSize: 'clamp(16px,1.5vw,20px)',
                  color: 'var(--emerald-deep)',
                  marginBottom: 16, lineHeight: 1.3,
                }}>
                  {locale === 'en' ? 'Community Structure' : locale === 'ur' ? 'قبائلی ڈھانچہ' : 'قبائلی ڈھانچو'}
                </h3>
                <p style={{
                  fontFamily: ff, fontSize: 'clamp(13px,1.1vw,14px)',
                  color: '#3a3a2a', lineHeight: 1.85, marginBottom: 16,
                }}>
                  {locale === 'en'
                    ? 'The Meo community is traditionally divided into two main groups: the Paliya Meos and the Nepaliya Meos. The Paliya Meos are further organised into five ancestral clans (Bans), each tracing lineage through a common patrilineal ancestor.'
                    : locale === 'ur'
                    ? 'میو برادری روایتی طور پر دو بڑے گروہوں میں تقسیم ہے: پالیہ میو اور نیپالیہ میو۔ پالیہ میو مزید پانچ آبائی قبیلوں (بانس) میں منظم ہیں، جن میں سے ہر ایک مشترک نسبی آبا سے جڑا ہے۔'
                    : 'میو برادری دو بڑے گروہاں میں بٹی ہے: پالیہ میو اور نیپالیہ میو۔ پالیہ میو پانچ آبائی بانساں میں بٹے ہیں۔'}
                </p>

                {/* Division cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    {
                      name: locale === 'en' ? 'Paliya Meos' : 'پالیہ میو',
                      detail: locale === 'en' ? '5 ancestral Bans (clans)' : '۵ آبائی بانس (قبائل)',
                      color: PAKISTAN,
                    },
                    {
                      name: locale === 'en' ? 'Nepaliya Meos' : 'نیپالیہ میو',
                      detail: locale === 'en' ? 'Separate lineage group' : 'الگ نسلی گروہ',
                      color: INDIA,
                    },
                  ].map(d => (
                    <div key={d.name} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      background: '#fff',
                      border: `1.5px solid ${d.color}33`,
                      borderInlineStart: `4px solid ${d.color}`,
                      padding: '12px 16px', borderRadius: '0 4px 4px 0',
                    }}>
                      <div>
                        <div style={{ fontFamily: ff, fontSize: 14, fontWeight: 700, color: d.color }}>
                          {d.name}
                        </div>
                        <div style={{ fontFamily: ff, fontSize: 11, color: '#888', marginTop: 2 }}>
                          {d.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total population note */}
                <div style={{
                  marginTop: 20,
                  background: 'var(--emerald-deep)',
                  padding: '14px 18px', borderRadius: 4,
                  display: 'flex', alignItems: 'center', gap: 16,
                }}>
                  <div style={{
                    fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 800,
                    color: 'var(--gold)', lineHeight: 1, flexShrink: 0,
                  }}>
                    ~10M
                  </div>
                  <div style={{ fontFamily: ff, fontSize: 12, color: 'rgba(245,245,220,0.75)', lineHeight: 1.6 }}>
                    {locale === 'en'
                      ? 'Total Meo ethnic population (community DNA project estimate, both countries combined)'
                      : 'کل میو نسلی آبادی (کمیونٹی ڈی این اے منصوبے کا تخمینہ، دونوں ممالک ملا کر)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Source attribution */}
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 11, color: '#aaa',
              marginTop: 20, lineHeight: 1.7,
            }}>
              {locale === 'en' ? 'Source: ' : 'ماخذ: '}
              <a
                href="https://www.familytreedna.com/groups/meo/about/background"
                target="_blank" rel="noopener noreferrer"
                style={{ color: '#888', textDecoration: 'underline' }}
              >
                FamilyTreeDNA — Meo Tribe DNA Project (familytreedna.com/groups/meo/about/background)
              </a>
              {locale === 'en'
                ? '. Haplogroup data based on project administrator Karamat Ullah Khan Meo\'s research.'
                : '۔ ہیپلوگروپ ڈیٹا پراجیکٹ ایڈمنسٹریٹر کرامت اللہ خان میو کی تحقیق پر مبنی ہے۔'}
            </p>
          </div>

          {/* ── City breakdown tabs ─────────────────── */}
          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['IN', 'PK'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setTab(c)}
                  style={{
                    padding: '8px 20px',
                    fontFamily: ff, fontSize: 13, fontWeight: 600,
                    background: tab === c ? (c === 'IN' ? INDIA : PAKISTAN) : '#fff',
                    color: tab === c ? '#fff' : '#444',
                    border: `1.5px solid ${c === 'IN' ? INDIA : PAKISTAN}`,
                    borderRadius: 4, cursor: 'pointer',
                    transition: 'all .15s',
                    minHeight: 40,
                  }}
                >
                  {c === 'IN'
                    ? (locale === 'en' ? '🇮🇳 India' : '🇮🇳 بھارت')
                    : (locale === 'en' ? '🇵🇰 Pakistan' : '🇵🇰 پاکستان')}
                </button>
              ))}
            </div>

            <div style={{
              background: '#fff',
              border: '1.5px solid #e8e0d0',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: tab === 'IN' ? INDIA : PAKISTAN }}>
                    {[
                      locale === 'en' ? 'Location' : 'مقام',
                      locale === 'en' ? 'Region'   : 'خطہ',
                      locale === 'en' ? 'Speakers' : 'بولنے والے',
                      locale === 'en' ? 'Share'    : 'حصہ',
                    ].map(h => (
                      <th key={h} style={{
                        padding: '10px 16px',
                        fontFamily: ff, fontSize: 11, fontWeight: 700,
                        color: '#fff', textAlign: 'start',
                        letterSpacing: locale === 'en' ? '0.08em' : 0,
                        textTransform: locale === 'en' ? 'uppercase' : 'none',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MAP_LOCATIONS
                    .filter(l => l.country === tab)
                    .sort((a, b) => b.population - a.population)
                    .map((loc, i) => {
                      const total = tab === 'IN' ? indiaTotal : pakistanTotal;
                      const pct   = ((loc.population / total) * 100).toFixed(1);
                      const barW  = (loc.population / total) * 100;
                      return (
                        <tr key={loc.id} style={{
                          background: i % 2 === 0 ? '#fafaf8' : '#fff',
                          borderBottom: '1px solid #f0ece4',
                        }}>
                          <td style={{ padding: '12px 16px', fontFamily: ff, fontSize: 13, fontWeight: 600, color: '#1a2a1a' }}>
                            {locale === 'en' ? loc.name : loc.nameUr}
                          </td>
                          <td style={{ padding: '12px 16px', fontFamily: 'var(--sans)', fontSize: 11, color: '#888' }}>
                            {loc.region}
                          </td>
                          <td style={{ padding: '12px 16px', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, color: tab === 'IN' ? INDIA : PAKISTAN }}>
                            {loc.population.toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 16px', minWidth: 100 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{
                                height: 8, borderRadius: 4,
                                background: `${tab === 'IN' ? INDIA : PAKISTAN}33`,
                                flex: 1, overflow: 'hidden',
                              }}>
                                <div style={{
                                  height: '100%',
                                  width: `${barW}%`,
                                  background: tab === 'IN' ? INDIA : PAKISTAN,
                                  borderRadius: 4,
                                }} />
                              </div>
                              <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#666', minWidth: 38 }}>
                                {pct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Two-panel: Story + Timeline ────────────── */}
      <section style={{
        background: 'var(--cream)',
        padding: 'clamp(40px,5vw,64px) clamp(16px,5vw,64px)',
        borderTop: '3px solid var(--gold)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(24px,3vw,48px)',
        }}>

          {/* Recognition story */}
          <div>
            <h2 style={{
              fontFamily: ffH, fontSize: 'clamp(20px,2vw,28px)',
              color: 'var(--emerald-deep)', marginBottom: 16, lineHeight: 1.2,
            }}>
              {d.recognitionTitle[locale]}
            </h2>
            <p style={{
              fontFamily: ff, fontSize: 'clamp(13px,1.1vw,15px)',
              color: '#3a3a2a', lineHeight: 1.85,
              marginBottom: 20,
            }}>
              {d.recognitionBody[locale]}
            </p>

            {/* Literary revival stats */}
            <div style={{
              background: 'var(--emerald-deep)',
              padding: '20px 24px', borderRadius: 4,
            }}>
              <div style={{
                fontFamily: ffH,
                fontSize: 'clamp(16px,1.5vw,20px)',
                color: 'var(--gold)', marginBottom: 12,
              }}>
                {d.writersTitle[locale]}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { n: '12',       l: locale === 'en' ? 'writers in 2005' : '۲۰۰۵ میں لکھاری' },
                  { n: '100s',     l: locale === 'en' ? 'writers today'   : 'آج لکھاری' },
                  { n: '100+',     l: locale === 'en' ? 'books published'  : 'کتابیں شائع' },
                  { n: '10+',      l: locale === 'en' ? 'MPhil/PhD researchers' : 'ایم فل/پی ایچ ڈی محققین' },
                  { n: '2',        l: locale === 'en' ? 'monthly magazines'     : 'ماہانہ رسائل' },
                  { n: '~12',      l: locale === 'en' ? 'orgs in Punjab'        : 'پنجاب میں تنظیمیں' },
                ].map(s => (
                  <div key={s.n} style={{
                    background: 'rgba(255,255,255,0.06)',
                    padding: '10px 12px', borderRadius: 3,
                  }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>
                      {s.n}
                    </div>
                    <div style={{ fontFamily: ff, fontSize: 10, color: 'rgba(245,245,220,0.65)', marginTop: 3 }}>
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 style={{
              fontFamily: ffH, fontSize: 'clamp(20px,2vw,28px)',
              color: 'var(--emerald-deep)', marginBottom: 20, lineHeight: 1.2,
            }}>
              {locale === 'en' ? 'Timeline' : locale === 'ur' ? 'سفرنامہ' : 'وقت کی داستان'}
            </h2>
            {timeline.map(t => (
              <TimelineRow
                key={t.year}
                year={t.year}
                event={t.event}
                accent="var(--gold)"
                ff={ff}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Source attribution ───────────────────────── */}
      <section style={{
        background: 'var(--emerald-deep)',
        padding: 'clamp(28px,3vw,40px) clamp(20px,5vw,64px)',
        textAlign: 'center',
        borderTop: '2px solid var(--gold)',
      }}>
        <StarKhatim size={32} color="#D4AF37" />
        <p style={{
          fontFamily: ff, fontSize: 12, color: 'rgba(245,245,220,0.55)',
          marginTop: 14, lineHeight: 1.7,
        }}>
          {d.sourceCredit[locale]}
          <br />
          <a
            href="https://loksujag.com/story/How-Did-Mewati-Gain-Language-Status-76-Years-After-Migration-eng"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gold-light)', textDecoration: 'underline', fontSize: 11 }}
          >
            {locale === 'en' ? 'Read original article (Lok Sujag)' : 'اصل مضمون پڑھیں (لوک سجاگ)'}
          </a>
        </p>
      </section>

      <Footer locale={locale} />
    </div>
  );
}
