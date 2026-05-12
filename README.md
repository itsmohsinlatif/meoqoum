# Meo Pehchan — میو پہچان

A multilingual community website for the Meo people of Mewat. Built with Next.js 16 App Router, it serves as a living digital archive of gotras, history, language, and culture — available in **English**, **Urdu**, and **Mewati** (Pakistani dialect, Urdu Nastaliq script).

---

## Features

### Trilingual with automatic RTL/LTR layout switching

| Locale | URL prefix | Direction | Font |
|--------|-----------|-----------|------|
| English | `/en/` | LTR | Cormorant Garamond + Inter |
| Urdu | `/ur/` | RTL | Noto Nastaliq Urdu |
| Mewati (Pakistani dialect) | `/mew/` | RTL | Noto Nastaliq Urdu |

The `dir` attribute is set on `<html>` per locale, so the full browser bidi cascade applies — scrollbars, text alignment, flexbox order, and input fields all flip automatically. The language switcher in the header navigates between locale-prefixed URLs without a full reload.

### Four pages

**Home (`/[locale]`)** — Vision page with:
- Mihrab arch SVG ornament with central eight-point Khatim star medallion
- Trilingual hero headline and body text
- Four-stat strip (12 gotras · 1,200+ villages · 7 centuries · 3 languages)
- Three-pillar grid (Lineage / Memory / Mother Tongue), middle pillar inverted to emerald
- From-the-Archive feature grid with sepia/duotone photo placeholders

**History (`/[locale]/history`)** — Interactive timeline:
- Desktop: horizontal scrubber with diamond markers, active chapter card + side chapter list
- Mobile: vertical timeline with gold diamond markers
- Seven eras: Origins (c.1300) → Khanzada → Khanwa (1527) → 1857 → Partition (1947) → Revival (1995) → Today

**Directory (`/[locale]/directory`)** — Searchable gotra directory:
- Live search bar (filters the 12-gotra grid client-side as you type)
- Three filter chips: All / By Region / By Era
- Each gotra card has a crest header (emerald + geometric pattern + Khatim star), region/era metadata, clan and village counts, and an Origin Story link

**News (`/[locale]/news`)** — Community noticeboard + long reads:
- Pinned Community Board: color-coded tag panels for Gathering / Obituary / Wedding / Notice events
- Three-column Long Reads feed with sepia photo placeholders, category labels, author and read-time

### Design system

- **Palette:** Deep Emerald `#004225` · Antique Gold `#D4AF37` · Warm Cream `#F5F5DC` · Paper `#FAF6E8`
- **Ornament:** Eight-point Islamic Khatim stars, Rajput scalloped border strip, repeating geometric tile pattern (low-opacity background), gold diamond rule separators, Mihrab arch SVG
- **Typography:** Cormorant Garamond (display serif) · Inter (UI sans) · Noto Nastaliq Urdu (Urdu/Mewati script) — all loaded via `next/font/google` at build time, no CDN round-trip
- **RTL CSS:** CSS logical properties (`padding-inline-start/end`, `border-inline-end`) are used where possible; `dir`-conditional inline styles handle the rest

### Mewati dialect authenticity

Mewati strings are kept **strictly separate** from Urdu. Key dialect markers preserved from native-speaker copy:

| Urdu (standard) | Mewati |
|----------------|--------|
| خوش آمدید | آؤ |
| ہمارے | ساڈے |
| منتخب کریں | چُنو |
| دیکھیں | دیکھو |
| پڑھیں | پڑھو |

`messages/mew.json` carries an `autoTranslationForbidden: true` guard. Any PR modifying Mewati strings must include a native-speaker review.

### Mobile-first responsive

- Navigation collapses to a hamburger menu + active-page bar below 768 px
- The hero arch ornament is hidden on mobile to free vertical space
- All grids use `auto-fill / minmax()` so they reflow naturally from 1 → 2 → 3 columns
- `clamp()` fluid sizing for font sizes and padding throughout — no breakpoint hacks

---

## Project structure

```
meopehchan/
├── messages/
│   ├── en.json           # Minimal (routing only; content lives in content.ts)
│   ├── ur.json
│   └── mew.json          # Has autoTranslationForbidden: true guard
├── src/
│   ├── app/
│   │   ├── globals.css                  # Design tokens + shared component styles
│   │   └── [locale]/
│   │       ├── layout.tsx               # Sets lang/dir on <html>, loads fonts
│   │       ├── page.tsx                 # Home page
│   │       ├── history/page.tsx         # History — interactive timeline
│   │       ├── directory/page.tsx       # Directory — searchable gotras
│   │       └── news/page.tsx            # News — board + long reads
│   ├── components/
│   │   ├── Header.tsx                   # Sticky header with desktop nav + mobile menu
│   │   ├── Footer.tsx                   # Four-column footer
│   │   ├── LangSwitcher.tsx             # EN / اردو / میواتی pill switcher
│   │   └── svg/index.tsx                # StarKhatim, GeoPattern, RajputBorder, BrandMark, Arrow, …
│   ├── config/
│   │   └── routing.ts                   # next-intl defineRouting — single source of truth
│   ├── data/
│   │   └── content.ts                   # All trilingual copy and data (en / ur / mew keys)
│   ├── i18n.ts                          # next-intl getRequestConfig
│   └── proxy.ts                         # next-intl locale routing middleware (Next.js 16 name)
├── next.config.ts                       # next-intl plugin wired
└── package.json
```

---

## Getting started

```bash
# Install dependencies
npm install

# Run locally
npm run dev
# → http://localhost:3000
# → Redirects / → /en automatically

# Production build
npm run build && npm start
```

**Locale URLs:**

| Page | English | Urdu | Mewati |
|------|---------|------|--------|
| Home | `/en` | `/ur` | `/mew` |
| History | `/en/history` | `/ur/history` | `/mew/history` |
| Directory | `/en/directory` | `/ur/directory` | `/mew/directory` |
| News | `/en/news` | `/ur/news` | `/mew/news` |

---

## Tech stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| i18n / routing | next-intl v4 |
| Styling | CSS custom properties + Tailwind CSS |
| Fonts | `next/font/google` — Cormorant Garamond, Inter, Noto Nastaliq Urdu |
| Language | TypeScript |

---

## Adding or editing translations

All trilingual content lives in [`src/data/content.ts`](src/data/content.ts). Each entry is a plain object with `en`, `ur`, and `mew` keys:

```ts
export const NAV = {
  home: { en: 'Home', ur: 'صفحہ اول', mew: 'گھر' },
  // …
};
```

**Mewati strings must be reviewed by a native Mewati speaker before merging.** Do not use machine translation (Google Translate, DeepL, or LLMs) for `mew` keys — the dialect has distinct phonological and lexical features that machine translation erases.

---

## Contributing Mewati translations

1. Every change to a `mew` key in `content.ts` or `messages/mew.json` must include the name or handle of the native-speaker reviewer in the PR description.
2. Common Mewati markers: retroflex `ڈ`/`ڑ`/`ٹ`, Braj-influenced vocabulary, `ساڈے` (we/our), `کوں` (to/for), `سوں` (from), `ہاں` (are, 1st/3rd pl).
3. Do not alter `_meta.autoTranslationForbidden` in `messages/mew.json`.

---

## Design credits

Visual system designed in Claude Design. Aesthetic: Modern editorial × museum-archival. Ornament vocabulary: Islamic eight-point Khatim stars, Rajput scalloped border strips, Mughal-era geometric tile patterns.
