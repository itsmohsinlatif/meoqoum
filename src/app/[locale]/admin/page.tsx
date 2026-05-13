'use client';

import { use, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { routing } from '@/config/routing';
import { getSupabase } from '@/lib/supabase-browser';
import { uploadToCloudinary, uploadDocToCloudinary } from '@/lib/cloudinary-upload';
import type { Locale } from '@/data/content';

/* ── Types ───────────────────────────────────────────────── */
type Tab = 'books' | 'articles' | 'users' | 'degrees';
type LangTab = 'en' | 'ur' | 'mew';

type DbBook = {
  id: string; slug: string;
  title_en: string; title_ur: string; title_mew: string;
  author: string; year: number | null;
  category: string; source_type: string; source_id: string;
  language: string[];
  description_en: string; description_ur: string; description_mew: string;
  cover_id: string | null; cover_gradient: string;
  is_published: boolean; created_at: string;
};

type DbArticle = {
  id: string; slug: string;
  title_en: string; title_ur: string; title_mew: string;
  excerpt_en: string; excerpt_ur: string; excerpt_mew: string;
  body_en: string; body_ur: string; body_mew: string;
  author: string; category: string; read_min: number | null;
  is_pinned: boolean; is_published: boolean;
  published_at: string; cover_id: string | null;
};

type DbUser = {
  id: string; first_name: string; last_name: string;
  gender: string; country: string | null; city: string | null;
  is_verified: boolean; is_active: boolean; created_at: string;
  email: string | null;
  marriage_profiles: Array<{
    id: string; degree_doc_id: string | null; degree_type: string | null;
    is_degree_verified: boolean; degree_status: string; degree_note: string | null;
    is_active: boolean;
  }>;
};

type DbDegree = {
  id: string; user_id: string;
  degree_doc_id: string; degree_type: string | null;
  is_degree_verified: boolean; degree_status: string; degree_note: string | null;
  created_at: string; email: string | null;
  profiles: { first_name: string; last_name: string; country: string | null; gender: string } | null;
};

type FullUser = {
  id: string; first_name: string; last_name: string; gender: string;
  country: string | null; city: string | null; is_verified: boolean;
  email: string | null; created_at: string;
  marriage_profile: {
    id: string; is_active: boolean;
    about: string | null; height: string | null; weight: string | null;
    complexion: string | null; education: string | null; profession: string | null;
    income: string | null; looking_for: string | null;
    degree_doc_id: string | null; degree_type: string | null;
    is_degree_verified: boolean; degree_status: string; degree_note: string | null;
  } | null;
};

/* ── Palette ─────────────────────────────────────────────── */
const A = {
  bg:     '#0f1117',
  panel:  '#181d28',
  border: '#2a3040',
  accent: '#4ade80',  // green
  gold:   '#d4af37',
  text:   '#e8e8e8',
  mute:   '#6a7080',
  danger: '#f87171',
  input:  '#1e2535',
};

/* ── Small helpers ───────────────────────────────────────── */
const css = (styles: React.CSSProperties): React.CSSProperties => styles;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: A.mute, marginBottom: 5 }}>
      {children}
    </div>
  );
}

function Input({ style, ...p }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...p}
      style={css({
        width: '100%', padding: '9px 12px',
        background: A.input, border: `1px solid ${A.border}`,
        color: A.text, borderRadius: 4, fontSize: 13,
        fontFamily: 'inherit', outline: 'none',
        boxSizing: 'border-box',
        ...style,
      })}
    />
  );
}

function Textarea({ style, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...p}
      style={css({
        width: '100%', padding: '9px 12px',
        background: A.input, border: `1px solid ${A.border}`,
        color: A.text, borderRadius: 4, fontSize: 13,
        fontFamily: 'inherit', outline: 'none', resize: 'vertical',
        boxSizing: 'border-box', minHeight: 90,
        ...style,
      })}
    />
  );
}

function Select({ style, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...p}
      style={css({
        width: '100%', padding: '9px 12px',
        background: A.input, border: `1px solid ${A.border}`,
        color: A.text, borderRadius: 4, fontSize: 13,
        fontFamily: 'inherit', outline: 'none',
        boxSizing: 'border-box',
        ...style,
      })}
    />
  );
}

function Btn({
  children, onClick, variant = 'primary', disabled, style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'danger' | 'ghost';
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const colors = {
    primary: { bg: A.accent,  color: '#050f0a' },
    danger:  { bg: A.danger,  color: '#0f0505' },
    ghost:   { bg: 'transparent', color: A.mute },
  };
  const c = colors[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={css({
        background: disabled ? A.border : c.bg,
        color: disabled ? A.mute : c.color,
        border: variant === 'ghost' ? `1px solid ${A.border}` : 'none',
        borderRadius: 4, padding: '9px 18px',
        fontSize: 13, fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', opacity: disabled ? 0.6 : 1,
        transition: 'opacity .15s',
        ...style,
      })}
    >
      {children}
    </button>
  );
}

function ImageUploadField({
  label, value, onChange,
}: {
  label: string; value: string; onChange: (id: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const r = await uploadToCloudinary(file, 'meoqoum/covers');
      if (r) onChange(r.publicId);
    } catch { /* ignore */ }
    finally { setUploading(false); }
  }

  return (
    <div>
      <Label>{label}</Label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Input
          placeholder="Cloudinary public_id (auto-filled on upload)"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ flex: 1 }}
        />
        <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        <Btn variant="ghost" onClick={() => ref.current?.click()} disabled={uploading} style={{ whiteSpace: 'nowrap' }}>
          {uploading ? 'Uploading…' : '↑ Upload'}
        </Btn>
      </div>
      {value && (
        <div style={{ marginTop: 6, fontSize: 11, color: A.accent }}>✓ {value}</div>
      )}
    </div>
  );
}

/* ── Book Form ───────────────────────────────────────────── */
const BOOK_DEFAULTS = {
  title_en: '', title_ur: '', title_mew: '',
  author: '', year: '', category: 'history',
  language: ['en'] as string[],
  description_en: '', description_ur: '', description_mew: '',
  cover_id: '',
  cover_gradient: 'linear-gradient(135deg,#1a3a2a,#004225)',
  source_type: 'pdf_url',
  source_id: '',
  is_published: true,
};

function BookForm({ token, onSaved }: { token: string; onSaved: () => void }) {
  const [f, setF] = useState(BOOK_DEFAULTS);
  const [lt, setLt]       = useState<LangTab>('en');
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof BOOK_DEFAULTS, v: unknown) => setF(p => ({ ...p, [k]: v }));

  const MAX_BYTES = 10 * 1024 * 1024; // 10 MB Cloudinary free limit

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setErr(`File is ${(file.size / 1024 / 1024).toFixed(1)} MB — Cloudinary free plan limit is 10 MB. Please compress the PDF or upgrade your Cloudinary plan.`);
      e.target.value = '';
      return;
    }
    setFileUploading(true);
    try {
      const folder = f.source_type === 'epub_url' ? 'meoqoum/books/epub' : 'meoqoum/books/pdf';
      const r = await uploadDocToCloudinary(file, folder);
      if (r) set('source_id', r.url);
    } catch (e) {
      setErr(String(e));
    } finally {
      setFileUploading(false);
    }
  }

  async function save() {
    if (!f.title_en || !f.author || !f.source_id) {
      setErr('Title (EN), Author, and Source are required.'); return;
    }
    setSaving(true); setErr('');
    const res = await fetch('/api/admin/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...f, year: f.year ? Number(f.year) : null }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setErr(data.error); return; }
    setF(BOOK_DEFAULTS);
    onSaved();
  }

  const langLabel: Record<LangTab, string> = { en: 'English', ur: 'اردو', mew: 'میواتی' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <h3 style={{ color: A.accent, fontSize: 15, margin: 0 }}>Add New Book</h3>

      {/* Language tabs for multilingual fields */}
      <div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 12, borderBottom: `1px solid ${A.border}`, paddingBottom: 8 }}>
          {(['en', 'ur', 'mew'] as LangTab[]).map(l => (
            <button key={l} onClick={() => setLt(l)}
              style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 700,
                background: lt === l ? A.accent : 'transparent',
                color: lt === l ? '#050f0a' : A.mute,
                border: `1px solid ${lt === l ? A.accent : A.border}`,
                borderRadius: 3, cursor: 'pointer', fontFamily: 'inherit',
              }}>
              {langLabel[l]}
            </button>
          ))}
        </div>

        <Label>Title ({langLabel[lt]}){lt === 'en' ? ' *' : ''}</Label>
        <Input
          value={lt === 'en' ? f.title_en : lt === 'ur' ? f.title_ur : f.title_mew}
          onChange={e => set(lt === 'en' ? 'title_en' : lt === 'ur' ? 'title_ur' : 'title_mew', e.target.value)}
          placeholder={lt === 'en' ? 'Book title in English' : lt === 'ur' ? 'کتاب کا عنوان اردو میں' : 'کتاب کو عنوان میواتی میں'}
          dir={lt !== 'en' ? 'rtl' : 'ltr'}
        />

        <div style={{ height: 12 }} />
        <Label>Description ({langLabel[lt]})</Label>
        <Textarea
          value={lt === 'en' ? f.description_en : lt === 'ur' ? f.description_ur : f.description_mew}
          onChange={e => set(lt === 'en' ? 'description_en' : lt === 'ur' ? 'description_ur' : 'description_mew', e.target.value)}
          placeholder="Short description for the book card…"
          dir={lt !== 'en' ? 'rtl' : 'ltr'}
          style={{ minHeight: 70 }}
        />
      </div>

      {/* Author + Year row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12 }}>
        <div>
          <Label>Author *</Label>
          <Input value={f.author} onChange={e => set('author', e.target.value)} placeholder="Author name" />
        </div>
        <div>
          <Label>Year</Label>
          <Input type="number" value={f.year} onChange={e => set('year', e.target.value)} placeholder="2024" min={1800} max={2099} />
        </div>
      </div>

      {/* Category + Language */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <Label>Category *</Label>
          <Select value={f.category} onChange={e => set('category', e.target.value)}>
            {['history', 'language', 'culture', 'religion', 'literature'].map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Language(s)</Label>
          <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
            {(['en', 'ur', 'mew'] as string[]).map(l => (
              <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 12, color: A.text }}>
                <input type="checkbox"
                  checked={f.language.includes(l)}
                  onChange={e => set('language', e.target.checked ? [...f.language, l] : f.language.filter(x => x !== l))}
                  style={{ accentColor: A.accent }}
                />
                {l.toUpperCase()}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Cover image */}
      <ImageUploadField label="Cover Image" value={f.cover_id} onChange={v => set('cover_id', v)} />

      {/* Source type + file */}
      <div>
        <Label>Source Type *</Label>
        <Select value={f.source_type} onChange={e => set('source_type', e.target.value)}>
          <option value="pdf_url">PDF (upload to Cloudinary)</option>
          <option value="epub_url">ePub (upload to Cloudinary)</option>
          <option value="archive">Archive.org (enter ID)</option>
        </Select>
      </div>

      {f.source_type === 'archive' ? (
        <div>
          <Label>Archive.org Identifier *</Label>
          <Input
            value={f.source_id}
            onChange={e => set('source_id', e.target.value)}
            placeholder="e.g. tarikh-i-mewat (from archive.org URL)"
          />
        </div>
      ) : (
        <div>
          <Label>{f.source_type === 'epub_url' ? 'ePub File' : 'PDF File'} *</Label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Input
                value={f.source_id}
                onChange={e => set('source_id', e.target.value)}
                placeholder="Cloudinary URL (auto-filled on upload)"
              />
              {f.source_id && (
                <div style={{ fontSize: 11, color: A.accent, marginTop: 4 }}>✓ {f.source_id.split('/').slice(-1)[0]}</div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={f.source_type === 'epub_url' ? '.epub' : '.pdf'}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <Btn variant="ghost" onClick={() => fileRef.current?.click()} disabled={fileUploading} style={{ whiteSpace: 'nowrap' }}>
              {fileUploading ? 'Uploading…' : `↑ Upload ${f.source_type === 'epub_url' ? 'ePub' : 'PDF'}`}
            </Btn>
          </div>
          <div style={{ fontSize: 11, color: A.mute, marginTop: 4 }}>Max 10 MB (Cloudinary free plan limit)</div>
        </div>
      )}

      {err && <div style={{ color: A.danger, fontSize: 12, padding: '8px 12px', background: `${A.danger}15`, borderRadius: 4 }}>{err}</div>}

      <div style={{ display: 'flex', gap: 8 }}>
        <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Book'}</Btn>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: A.mute, cursor: 'pointer' }}>
          <input type="checkbox" checked={f.is_published} onChange={e => set('is_published', e.target.checked)} style={{ accentColor: A.accent }} />
          Published immediately
        </label>
      </div>
    </div>
  );
}

/* ── Article Form ─────────────────────────────────────────── */
const ART_DEFAULTS = {
  title_en: '', title_ur: '', title_mew: '',
  excerpt_en: '', excerpt_ur: '', excerpt_mew: '',
  body_en: '', body_ur: '', body_mew: '',
  category: 'community', author: '',
  cover_id: '', read_min: '', is_pinned: false, is_published: true,
};

function ArticleForm({ token, onSaved }: { token: string; onSaved: () => void }) {
  const [f, setF]         = useState(ART_DEFAULTS);
  const [lt, setLt]       = useState<LangTab>('en');
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState('');

  const set = (k: keyof typeof ART_DEFAULTS, v: unknown) => setF(p => ({ ...p, [k]: v }));

  async function save() {
    if (!f.title_en || !f.author) {
      setErr('Title (EN) and Author are required.'); return;
    }
    setSaving(true); setErr('');
    const res = await fetch('/api/admin/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...f, read_min: f.read_min ? Number(f.read_min) : null }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setErr(data.error); return; }
    setF(ART_DEFAULTS);
    onSaved();
  }

  const langLabel: Record<LangTab, string> = { en: 'English', ur: 'اردو', mew: 'میواتی' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <h3 style={{ color: A.accent, fontSize: 15, margin: 0 }}>Add New Article</h3>

      {/* Language tabs */}
      <div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 12, borderBottom: `1px solid ${A.border}`, paddingBottom: 8 }}>
          {(['en', 'ur', 'mew'] as LangTab[]).map(l => (
            <button key={l} onClick={() => setLt(l)}
              style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 700,
                background: lt === l ? A.accent : 'transparent',
                color: lt === l ? '#050f0a' : A.mute,
                border: `1px solid ${lt === l ? A.accent : A.border}`,
                borderRadius: 3, cursor: 'pointer', fontFamily: 'inherit',
              }}>
              {langLabel[l]}
            </button>
          ))}
        </div>

        <Label>Title ({langLabel[lt]}){lt === 'en' ? ' *' : ''}</Label>
        <Input
          value={lt === 'en' ? f.title_en : lt === 'ur' ? f.title_ur : f.title_mew}
          onChange={e => set(lt === 'en' ? 'title_en' : lt === 'ur' ? 'title_ur' : 'title_mew', e.target.value)}
          placeholder={lt === 'en' ? 'Article headline' : lt === 'ur' ? 'مضمون کی سرخی اردو میں' : 'مضمون کو عنوان میواتی میں'}
          dir={lt !== 'en' ? 'rtl' : 'ltr'}
        />

        <div style={{ height: 12 }} />
        <Label>Excerpt / Standfirst ({langLabel[lt]})</Label>
        <Textarea
          value={lt === 'en' ? f.excerpt_en : lt === 'ur' ? f.excerpt_ur : f.excerpt_mew}
          onChange={e => set(lt === 'en' ? 'excerpt_en' : lt === 'ur' ? 'excerpt_ur' : 'excerpt_mew', e.target.value)}
          placeholder="2–3 sentence summary shown on the news card…"
          dir={lt !== 'en' ? 'rtl' : 'ltr'}
          style={{ minHeight: 70 }}
        />

        <div style={{ height: 12 }} />
        <Label>Full Body ({langLabel[lt]})</Label>
        <Textarea
          value={lt === 'en' ? f.body_en : lt === 'ur' ? f.body_ur : f.body_mew}
          onChange={e => set(lt === 'en' ? 'body_en' : lt === 'ur' ? 'body_ur' : 'body_mew', e.target.value)}
          placeholder="Full article text — paragraphs separated by blank lines…"
          dir={lt !== 'en' ? 'rtl' : 'ltr'}
          style={{ minHeight: 160 }}
        />
      </div>

      {/* Author + Category + Read time */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 12 }}>
        <div>
          <Label>Author *</Label>
          <Input value={f.author} onChange={e => set('author', e.target.value)} placeholder="Dr. Riyaz Khan" />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={f.category} onChange={e => set('category', e.target.value)}>
            {['community', 'history', 'language', 'culture', 'heritage', 'memory', 'religion'].map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Read (min)</Label>
          <Input type="number" value={f.read_min} onChange={e => set('read_min', e.target.value)} placeholder="5" min={1} max={99} />
        </div>
      </div>

      {/* Cover image */}
      <ImageUploadField label="Cover Image" value={f.cover_id} onChange={v => set('cover_id', v)} />

      {err && <div style={{ color: A.danger, fontSize: 12, padding: '8px 12px', background: `${A.danger}15`, borderRadius: 4 }}>{err}</div>}

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Publish Article'}</Btn>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: A.mute, cursor: 'pointer' }}>
          <input type="checkbox" checked={f.is_pinned} onChange={e => set('is_pinned', e.target.checked)} style={{ accentColor: A.gold }} />
          Pin to Community Board
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: A.mute, cursor: 'pointer' }}>
          <input type="checkbox" checked={f.is_published} onChange={e => set('is_published', e.target.checked)} style={{ accentColor: A.accent }} />
          Published immediately
        </label>
      </div>
    </div>
  );
}

/* ── Item list rows ───────────────────────────────────────── */
function BookRow({ book, token, onDelete }: { book: DbBook; token: string; onDelete: () => void }) {
  const [busy, setBusy] = useState(false);

  async function del() {
    if (!confirm(`Delete "${book.title_en}"?`)) return;
    setBusy(true);
    await fetch('/api/admin/books', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: book.id }),
    });
    onDelete();
  }

  return (
    <tr style={{ borderBottom: `1px solid ${A.border}` }}>
      <td style={{ padding: '10px 12px', color: A.text, fontSize: 13 }}>
        <div style={{ fontWeight: 600 }}>{book.title_en || '—'}</div>
        {book.title_ur && <div style={{ fontSize: 11, color: A.mute, direction: 'rtl', textAlign: 'right' }}>{book.title_ur}</div>}
      </td>
      <td style={{ padding: '10px 12px', color: A.mute, fontSize: 12 }}>{book.author}</td>
      <td style={{ padding: '10px 12px', color: A.mute, fontSize: 12 }}>{book.category} · {book.year ?? '—'}</td>
      <td style={{ padding: '10px 12px', fontSize: 11 }}>
        <span style={{ padding: '2px 8px', borderRadius: 10,
          background: book.is_published ? `${A.accent}20` : `${A.danger}20`,
          color: book.is_published ? A.accent : A.danger }}>
          {book.is_published ? 'Live' : 'Draft'}
        </span>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <Btn variant="danger" onClick={del} disabled={busy} style={{ padding: '5px 12px', fontSize: 12 }}>
          {busy ? '…' : 'Delete'}
        </Btn>
      </td>
    </tr>
  );
}

function ArticleRow({ art, token, onDelete }: { art: DbArticle; token: string; onDelete: () => void }) {
  const [busy, setBusy] = useState(false);

  async function del() {
    if (!confirm(`Delete "${art.title_en}"?`)) return;
    setBusy(true);
    await fetch('/api/admin/articles', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: art.id }),
    });
    onDelete();
  }

  return (
    <tr style={{ borderBottom: `1px solid ${A.border}` }}>
      <td style={{ padding: '10px 12px', color: A.text, fontSize: 13 }}>
        <div style={{ fontWeight: 600 }}>{art.title_en || '—'}</div>
        {art.is_pinned && <span style={{ fontSize: 10, color: A.gold, marginTop: 2, display: 'block' }}>📌 Pinned</span>}
      </td>
      <td style={{ padding: '10px 12px', color: A.mute, fontSize: 12 }}>{art.author}</td>
      <td style={{ padding: '10px 12px', color: A.mute, fontSize: 12 }}>{art.category}</td>
      <td style={{ padding: '10px 12px', color: A.mute, fontSize: 12 }}>
        {new Date(art.published_at).toLocaleDateString()}
      </td>
      <td style={{ padding: '10px 12px', fontSize: 11 }}>
        <span style={{ padding: '2px 8px', borderRadius: 10,
          background: art.is_published ? `${A.accent}20` : `${A.danger}20`,
          color: art.is_published ? A.accent : A.danger }}>
          {art.is_published ? 'Live' : 'Draft'}
        </span>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <Btn variant="danger" onClick={del} disabled={busy} style={{ padding: '5px 12px', fontSize: 12 }}>
          {busy ? '…' : 'Delete'}
        </Btn>
      </td>
    </tr>
  );
}

/* ── User Profile Drawer ─────────────────────────────────── */
function UserDrawer({
  userId, token, locale, onClose,
  onVerify, onAmend,
}: {
  userId: string; token: string; locale: string;
  onClose: () => void;
  onVerify: (marriageProfileId: string) => void;
  onAmend: (marriageProfileId: string) => void;
}) {
  const [fu, setFu] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setFu(d.user ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId, token]);

  const mp = fu?.marriage_profile;
  const pdfUrl = mp?.degree_doc_id
    ? `/api/pdf?url=https://res.cloudinary.com/${cloudName}/raw/upload/${mp.degree_doc_id}`
    : null;

  const statusColor = mp?.degree_status === 'verified' ? A.accent
    : mp?.degree_status === 'amendment_requested' ? A.danger : A.gold;

  function Row({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null;
    return (
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: A.mute, minWidth: 110, paddingTop: 1 }}>{label}</span>
        <span style={{ fontSize: 13, color: A.text, flex: 1 }}>{value}</span>
      </div>
    );
  }

  return (
    <>
      {/* Dark overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          zIndex: 200, cursor: 'pointer',
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(520px, 100vw)',
        background: A.panel, borderInlineStart: `1px solid ${A.border}`,
        zIndex: 201, overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${A.border}`,
          position: 'sticky', top: 0, background: A.panel, zIndex: 1,
        }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: A.text }}>
            Member Profile
          </span>
          <button onClick={onClose} style={{
            background: 'transparent', border: `1px solid ${A.border}`,
            color: A.mute, width: 32, height: 32, borderRadius: 6,
            cursor: 'pointer', fontSize: 18, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {loading ? (
            <p style={{ color: A.mute, fontSize: 13, textAlign: 'center', paddingTop: 40 }}>
              Loading…
            </p>
          ) : !fu ? (
            <p style={{ color: A.danger, fontSize: 13 }}>Could not load profile.</p>
          ) : (
            <>
              {/* ── Basic profile ── */}
              <section style={{ background: A.bg, borderRadius: 6, padding: 16, border: `1px solid ${A.border}` }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: A.mute, marginBottom: 12 }}>
                  Basic Info
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: A.text, marginBottom: 4 }}>
                  {fu.first_name} {fu.last_name}
                  {fu.is_verified && <span style={{ marginInlineStart: 8, fontSize: 11, color: A.accent }}>✓ Verified</span>}
                </div>
                <div style={{ fontSize: 12, color: A.mute, marginBottom: 12 }}>{fu.email}</div>
                <Row label="Gender" value={fu.gender} />
                <Row label="Location" value={[fu.city, fu.country].filter(Boolean).join(', ')} />
                <Row label="Member since" value={new Date(fu.created_at).toLocaleDateString()} />
                <div style={{ marginTop: 10 }}>
                  <a
                    href={`/${locale}/rishta`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, color: A.gold, textDecoration: 'none' }}
                  >
                    View public rishta directory →
                  </a>
                </div>
              </section>

              {/* ── Rishta profile ── */}
              {mp ? (
                <section style={{ background: A.bg, borderRadius: 6, padding: 16, border: `1px solid ${A.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: A.mute }}>
                      Rishta Profile
                    </div>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10,
                      background: mp.is_active ? `${A.accent}20` : `${A.border}`,
                      color: mp.is_active ? A.accent : A.mute }}>
                      {mp.is_active ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  {mp.about && (
                    <p style={{ fontSize: 13, color: '#b0b8c8', lineHeight: 1.7, marginBottom: 12, fontStyle: 'italic' }}>
                      "{mp.about}"
                    </p>
                  )}
                  <Row label="Education"  value={mp.education} />
                  <Row label="Profession" value={mp.profession} />
                  <Row label="Income"     value={mp.income} />
                  <Row label="Height"     value={mp.height} />
                  <Row label="Weight"     value={mp.weight} />
                  <Row label="Complexion" value={mp.complexion} />
                  <Row label="Looking for" value={mp.looking_for} />
                </section>
              ) : (
                <section style={{ background: A.bg, borderRadius: 6, padding: 16, border: `1px solid ${A.border}` }}>
                  <div style={{ fontSize: 13, color: A.mute }}>No rishta profile created.</div>
                </section>
              )}

              {/* ── Degree / Document ── */}
              <section style={{ background: A.bg, borderRadius: 6, padding: 16, border: `1px solid ${mp?.degree_doc_id ? statusColor + '44' : A.border}` }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: A.mute, marginBottom: 12 }}>
                  Degree / Document
                </div>

                {mp?.degree_doc_id ? (
                  <>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
                      <span style={{ fontSize: 13, color: A.text }}>{mp.degree_type ?? 'Document'}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 700,
                        background: `${statusColor}22`, color: statusColor }}>
                        {mp.degree_status === 'verified' ? '✓ Verified'
                          : mp.degree_status === 'amendment_requested' ? '⚠ Amendment Requested'
                          : '⏳ Pending Review'}
                      </span>
                    </div>

                    {mp.degree_note && (
                      <div style={{ marginBottom: 12, fontSize: 12, color: A.mute,
                        background: '#0f1117', padding: '8px 12px', borderRadius: 4 }}>
                        Last note: {mp.degree_note}
                      </div>
                    )}

                    {/* Embedded PDF viewer */}
                    {pdfUrl && (
                      <div style={{ marginBottom: 14 }}>
                        <iframe
                          src={pdfUrl}
                          title="Degree document"
                          style={{
                            width: '100%', height: 420, border: `1px solid ${A.border}`,
                            borderRadius: 4, background: '#fff',
                          }}
                        />
                        <a
                          href={pdfUrl} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-block', marginTop: 6, fontSize: 11, color: A.mute, textDecoration: 'none' }}
                        >
                          ↗ Open in new tab
                        </a>
                      </div>
                    )}

                    {/* Actions */}
                    {mp.degree_status !== 'verified' && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <Btn style={{ flex: 1, minWidth: 120 }}
                          onClick={() => { onVerify(mp.id); onClose(); }}>
                          ✓ Verify Document
                        </Btn>
                        <Btn variant="danger" style={{ flex: 1, minWidth: 140 }}
                          onClick={() => { onAmend(mp.id); onClose(); }}>
                          ⚠ Request Amendment
                        </Btn>
                      </div>
                    )}
                    {mp.degree_status === 'verified' && (
                      <div style={{ fontSize: 12, color: A.accent }}>
                        ✓ Document has been verified
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: A.mute }}>No document uploaded.</div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = use(params);
  if (!routing.locales.includes(rawLocale as (typeof routing.locales)[number])) notFound();
  const locale = rawLocale as Locale;
  const router = useRouter();

  const [tab, setTab]         = useState<Tab>('books');
  const [token, setToken]     = useState('');
  const [checking, setChecking] = useState(true);
  const [books,    setBooks]    = useState<DbBook[]>([]);
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [users,    setUsers]    = useState<DbUser[]>([]);
  const [degrees,  setDegrees]  = useState<DbDegree[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<DbBook | DbArticle | null>(null);
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  /* Auth check */
  useEffect(() => {
    async function check() {
      const sb = getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (!session || (ADMIN_EMAIL && session.user.email !== ADMIN_EMAIL)) {
        router.replace(`/${locale}/login`);
        return;
      }
      setToken(session.access_token);
      setChecking(false);
    }
    check();
  }, [locale, router, ADMIN_EMAIL]);

  const loadBooks = useCallback(async () => {
    if (!token) return;
    const res = await fetch('/api/admin/books', { headers: { Authorization: `Bearer ${token}` } });
    const d = await res.json();
    if (d.books) setBooks(d.books);
  }, [token]);

  const loadArticles = useCallback(async () => {
    if (!token) return;
    const res = await fetch('/api/admin/articles', { headers: { Authorization: `Bearer ${token}` } });
    const d = await res.json();
    if (d.articles) setArticles(d.articles);
  }, [token]);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
    const d = await res.json();
    if (d.users) setUsers(d.users);
  }, [token]);

  const loadDegrees = useCallback(async () => {
    if (!token) return;
    const res = await fetch('/api/admin/degrees', { headers: { Authorization: `Bearer ${token}` } });
    const d = await res.json();
    if (d.degrees) setDegrees(d.degrees);
  }, [token]);

  useEffect(() => {
    if (token) { loadBooks(); loadArticles(); loadUsers(); loadDegrees(); }
  }, [token, loadBooks, loadArticles, loadUsers, loadDegrees]);

  if (checking) {
    return (
      <div style={{ background: A.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: A.mute, fontFamily: 'system-ui' }}>
        Checking admin access…
      </div>
    );
  }

  return (
    <div style={{ background: A.bg, minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: A.text }}>

      {/* Top bar */}
      <div style={{
        background: A.panel, borderBottom: `1px solid ${A.border}`,
        padding: '0 clamp(16px,3vw,40px)',
        display: 'flex', alignItems: 'center', gap: 16, height: 56,
      }}>
        <span style={{ fontWeight: 800, fontSize: 16, color: A.accent }}>Meo Qoum</span>
        <span style={{ color: A.border }}>|</span>
        <span style={{ fontSize: 13, color: A.mute }}>Admin Panel</span>
        <div style={{ flex: 1 }} />
        <a href={`/${locale}`} style={{ color: A.mute, fontSize: 12, textDecoration: 'none' }}>← Back to site</a>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>

        {/* Sidebar */}
        <nav style={{
          width: 200, background: A.panel,
          borderInlineEnd: `1px solid ${A.border}`,
          padding: '24px 0', flexShrink: 0,
        }}>
          {([
            { key: 'books',    label: '📚  Books',    count: books.length },
            { key: 'articles', label: '📰  Articles', count: articles.length },
            { key: 'users',    label: '👥  Members',  count: users.length },
            { key: 'degrees',  label: '🎓  Degrees',  count: degrees.filter(d => d.degree_status === 'pending').length },
          ] as { key: Tab; label: string; count: number }[]).map(item => (
            <button key={item.key} onClick={() => { setTab(item.key); setShowForm(false); }}
              style={{
                width: '100%', padding: '10px 20px',
                background: tab === item.key ? `${A.accent}15` : 'transparent',
                color: tab === item.key ? A.accent : A.mute,
                border: 'none', borderInlineStart: tab === item.key ? `3px solid ${A.accent}` : '3px solid transparent',
                fontSize: 13, fontWeight: tab === item.key ? 700 : 400,
                textAlign: 'start', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
              <span>{item.label}</span>
              <span style={{ fontSize: 11, background: `${A.border}`, borderRadius: 10, padding: '1px 7px', color: A.mute }}>
                {item.count}
              </span>
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: 'clamp(20px,3vw,36px)', overflow: 'auto' }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: A.text }}>
              {tab === 'books' ? '📚 Books' : tab === 'articles' ? '📰 Articles' : tab === 'users' ? '👥 Members' : '🎓 Degree Verification'}
            </h2>
            {(tab === 'books' || tab === 'articles') && (
              <Btn onClick={() => setShowForm(v => !v)}>
                {showForm ? '✕ Close Form' : `+ Add ${tab === 'books' ? 'Book' : 'Article'}`}
              </Btn>
            )}
          </div>

          {/* Upload form */}
          {showForm && (
            <div style={{
              background: A.panel, border: `1px solid ${A.border}`,
              borderRadius: 6, padding: 'clamp(16px,2vw,28px)',
              marginBottom: 28,
            }}>
              {tab === 'books'
                ? <BookForm token={token} onSaved={() => { loadBooks(); setShowForm(false); }} />
                : <ArticleForm token={token} onSaved={() => { loadArticles(); setShowForm(false); }} />
              }
            </div>
          )}

          {/* List table */}
          <div style={{
            background: A.panel, border: `1px solid ${A.border}`,
            borderRadius: 6, overflow: 'hidden',
          }}>
            {tab === 'books' ? (
              books.length === 0
                ? <p style={{ padding: 32, color: A.mute, textAlign: 'center', fontSize: 13 }}>No books yet. Click "Add Book" to upload your first one.</p>
                : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#13172050', borderBottom: `1px solid ${A.border}` }}>
                        {['Title', 'Author', 'Category', 'Status', ''].map(h => (
                          <th key={h} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 700, color: A.mute, textAlign: 'start', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {books.map(b => <BookRow key={b.id} book={b} token={token} onDelete={loadBooks} />)}
                    </tbody>
                  </table>
                )
            ) : tab === 'users' ? (
              users.length === 0
                ? <p style={{ padding: 32, color: A.mute, textAlign: 'center', fontSize: 13 }}>No members yet.</p>
                : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#13172050', borderBottom: `1px solid ${A.border}` }}>
                        {['Member', 'Email', 'Location', 'Joined', 'Verified', 'Rishta', ''].map(h => (
                          <th key={h} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 700, color: A.mute, textAlign: 'start', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: `1px solid ${A.border}` }}>
                          <td style={{ padding: '10px 12px', color: A.text, fontSize: 13, fontWeight: 600 }}>
                            {u.first_name} {u.last_name}
                            <div style={{ fontSize: 10, color: A.mute, marginTop: 2 }}>{u.gender}</div>
                          </td>
                          <td style={{ padding: '10px 12px', color: A.mute, fontSize: 11 }}>{u.email ?? '—'}</td>
                          <td style={{ padding: '10px 12px', color: A.mute, fontSize: 12 }}>{[u.city, u.country].filter(Boolean).join(', ') || '—'}</td>
                          <td style={{ padding: '10px 12px', color: A.mute, fontSize: 11 }}>{new Date(u.created_at).toLocaleDateString()}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 10, background: u.is_verified ? `${A.accent}20` : `${A.danger}20`, color: u.is_verified ? A.accent : A.danger, fontSize: 11 }}>
                              {u.is_verified ? '✓ Yes' : 'No'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            {u.marriage_profiles?.[0] ? (
                              <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, background: u.marriage_profiles[0].is_active ? `${A.accent}15` : `${A.border}`, color: u.marriage_profiles[0].is_active ? A.accent : A.mute }}>
                                {u.marriage_profiles[0].is_active ? 'Active' : 'Hidden'}
                              </span>
                            ) : <span style={{ color: A.mute, fontSize: 11 }}>None</span>}
                          </td>
                          <td style={{ padding: '10px 12px', display: 'flex', gap: 6 }}>
                            <Btn variant="ghost" style={{ padding: '5px 10px', fontSize: 11 }}
                              onClick={() => setDrawerUserId(u.id)}>
                              View
                            </Btn>
                            <Btn variant={u.is_verified ? 'ghost' : 'primary'} style={{ padding: '5px 12px', fontSize: 11 }}
                              onClick={async () => {
                                await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: 'toggle_verified', profile_id: u.id, value: !u.is_verified }) });
                                loadUsers();
                              }}>
                              {u.is_verified ? 'Unverify' : 'Verify'}
                            </Btn>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
            ) : tab === 'degrees' ? (
              degrees.length === 0
                ? <p style={{ padding: 32, color: A.mute, textAlign: 'center', fontSize: 13 }}>No degree submissions yet.</p>
                : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }}>
                    {degrees.map(d => (
                      <div key={d.id} style={{ background: A.bg, border: `1px solid ${d.degree_status === 'verified' ? A.accent + '44' : d.degree_status === 'amendment_requested' ? A.danger + '44' : A.border}`, borderRadius: 6, padding: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: A.text, fontSize: 14 }}>
                              {d.profiles?.first_name} {d.profiles?.last_name}
                              <span style={{ fontSize: 11, color: A.mute, marginInlineStart: 8 }}>{d.profiles?.gender} · {d.profiles?.country ?? '—'}</span>
                            </div>
                            <div style={{ fontSize: 12, color: A.mute, marginTop: 2 }}>{d.email}</div>
                            <div style={{ marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: d.degree_status === 'verified' ? `${A.accent}22` : d.degree_status === 'amendment_requested' ? `${A.danger}22` : `${A.gold}22`, color: d.degree_status === 'verified' ? A.accent : d.degree_status === 'amendment_requested' ? A.danger : A.gold }}>
                                {d.degree_status === 'verified' ? '✓ Verified' : d.degree_status === 'amendment_requested' ? '⚠ Amendment Requested' : '⏳ Pending'}
                              </span>
                              <span style={{ fontSize: 12, color: A.mute }}>{d.degree_type ?? 'Unknown type'}</span>
                            </div>
                            {d.degree_note && (
                              <div style={{ marginTop: 8, fontSize: 12, color: A.mute, background: '#0f1117', padding: '6px 10px', borderRadius: 4 }}>
                                Admin note: {d.degree_note}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <a href={`/api/pdf?url=https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${d.degree_doc_id}`}
                              target="_blank" rel="noopener noreferrer"
                              style={{ padding: '7px 14px', background: A.panel, border: `1px solid ${A.border}`, color: A.mute, fontSize: 12, textDecoration: 'none', borderRadius: 4 }}>
                              📄 View PDF
                            </a>
                            {d.degree_status !== 'verified' && (
                              <Btn style={{ padding: '7px 14px', fontSize: 12 }}
                                onClick={async () => {
                                  await fetch('/api/admin/degrees', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: 'verify', id: d.id }) });
                                  loadDegrees();
                                }}>
                                ✓ Verify
                              </Btn>
                            )}
                            <Btn variant="danger" style={{ padding: '7px 14px', fontSize: 12 }}
                              onClick={async () => {
                                const note = prompt('Amendment message to user:') ?? 'Please re-upload a clearer document.';
                                await fetch('/api/admin/degrees', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: 'amend', id: d.id, note }) });
                                loadDegrees();
                              }}>
                              ⚠ Request Amendment
                            </Btn>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            ) : (
              articles.length === 0
                ? <p style={{ padding: 32, color: A.mute, textAlign: 'center', fontSize: 13 }}>No articles yet. Click "Add Article" to write your first one.</p>
                : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#13172050', borderBottom: `1px solid ${A.border}` }}>
                        {['Title', 'Author', 'Category', 'Date', 'Status', ''].map(h => (
                          <th key={h} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 700, color: A.mute, textAlign: 'start', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map(a => <ArticleRow key={a.id} art={a} token={token} onDelete={loadArticles} />)}
                    </tbody>
                  </table>
                )
            )}
          </div>

          {/* SQL reminder */}
          <details style={{ marginTop: 24, background: A.panel, border: `1px solid ${A.border}`, borderRadius: 6, padding: 16 }}>
            <summary style={{ cursor: 'pointer', fontSize: 12, color: A.mute, fontWeight: 600 }}>
              ⚠️ First time? Run the SQL migration in Supabase
            </summary>
            <pre style={{
              marginTop: 12, padding: 12, background: '#0a0e17',
              borderRadius: 4, overflow: 'auto', fontSize: 11,
              color: '#7ecf9a', lineHeight: 1.6,
            }}>
{`-- Run this in your Supabase SQL Editor:
-- (contents of supabase/migrations/002_admin_tables.sql)`}
            </pre>
          </details>
        </main>
      </div>

      {drawerUserId && (
        <UserDrawer
          userId={drawerUserId}
          token={token}
          locale={locale}
          onClose={() => setDrawerUserId(null)}
          onVerify={async (marriageProfileId) => {
            await fetch('/api/admin/degrees', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ action: 'verify', id: marriageProfileId }),
            });
            loadUsers(); loadDegrees();
          }}
          onAmend={async (marriageProfileId) => {
            const note = prompt('Amendment message to user:') ?? 'Please re-upload a clearer document.';
            await fetch('/api/admin/degrees', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ action: 'amend', id: marriageProfileId, note }),
            });
            loadUsers(); loadDegrees();
          }}
        />
      )}
    </div>
  );
}
