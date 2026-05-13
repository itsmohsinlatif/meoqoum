# Graph Report - .  (2026-05-13)

## Corpus Check
- 50 files · ~67,578 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 234 nodes · 275 edges · 32 communities detected
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 53 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin API Routes|Admin API Routes]]
- [[_COMMUNITY_Page Components & Upload Logic|Page Components & Upload Logic]]
- [[_COMMUNITY_Historical Book Content|Historical Book Content]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Admin Auth & CRUD Layer|Admin Auth & CRUD Layer]]
- [[_COMMUNITY_Auth & Header Navigation|Auth & Header Navigation]]
- [[_COMMUNITY_Book Reader & PDF Pipeline|Book Reader & PDF Pipeline]]
- [[_COMMUNITY_LLMs.txt Platform Description|LLMs.txt Platform Description]]
- [[_COMMUNITY_UI Footer & SVG Ornaments|UI Footer & SVG Ornaments]]
- [[_COMMUNITY_Rishta Directory Filters|Rishta Directory Filters]]
- [[_COMMUNITY_Core API & Component Registry|Core API & Component Registry]]
- [[_COMMUNITY_Static Assets & Branding|Static Assets & Branding]]
- [[_COMMUNITY_Interactive Map (MewatiMap)|Interactive Map (MewatiMap)]]
- [[_COMMUNITY_i18n & Locale Routing|i18n & Locale Routing]]
- [[_COMMUNITY_Root Layout & Params|Root Layout & Params]]
- [[_COMMUNITY_Population Page|Population Page]]
- [[_COMMUNITY_News Page|News Page]]
- [[_COMMUNITY_Content Types|Content Types]]
- [[_COMMUNITY_History Page|History Page]]
- [[_COMMUNITY_Routing Config|Routing Config]]
- [[_COMMUNITY_Agent Instructions (AGENTS.md)|Agent Instructions (AGENTS.md)]]
- [[_COMMUNITY_Next.js Type Declarations|Next.js Type Declarations]]
- [[_COMMUNITY_Content Data Module|Content Data Module]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Library Page|Library Page]]
- [[_COMMUNITY_History Page Module|History Page Module]]
- [[_COMMUNITY_Population Page Module|Population Page Module]]
- [[_COMMUNITY_Directory Page Module|Directory Page Module]]
- [[_COMMUNITY_Book Type|Book Type]]
- [[_COMMUNITY_Brand Content|Brand Content]]
- [[_COMMUNITY_Nav Content|Nav Content]]
- [[_COMMUNITY_Footer Content|Footer Content]]

## God Nodes (most connected - your core abstractions)
1. `Against History, Against State (Original English Book)` - 16 edges
2. `Meo Qoum Community Website Project` - 14 edges
3. `MeoQoum.com Community Archive Platform` - 12 edges
4. `getSupabase()` - 11 edges
5. `Library Page` - 10 edges
6. `GET()` - 8 edges
7. `Join Page (Member Registration Form)` - 7 edges
8. `verifyAdmin()` - 6 edges
9. `POST()` - 6 edges
10. `PATCH()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `History Timeline (Seven Eras)` --semantically_similar_to--> `Against History, Against State (Original English Book)`  [INFERRED] [semantically similar]
  README.md → books/تاريخ_اور_رياست_کے_باغی-ڈاکٹر_شيل_مايارام-2012-صاف.pdf
- `Meo People (میو قوم)` --semantically_similar_to--> `Meo Communal Identity Formation`  [INFERRED] [semantically similar]
  README.md → books/تاريخ_اور_رياست_کے_باغی-ڈاکٹر_شيل_مايارام-2012-صاف.pdf
- `Mewat Region` --semantically_similar_to--> `Mewat Region Map (Gurgaon/Bharatpur, incl. Nuh, Tauru, Kaman)`  [INFERRED] [semantically similar]
  README.md → books/تاريخ_اور_رياست_کے_باغی-ڈاکٹر_شيل_مايارام-2012-صاف.pdf
- `1947 Partition — Division of Meo Homeland` --semantically_similar_to--> `1857 Rebellion — Meos and Colonial System`  [INFERRED] [semantically similar]
  public/llms.txt → books/تاريخ_اور_رياست_کے_باغی-ڈاکٹر_شيل_مايارام-2012-صاف.pdf
- `13 Pals (Clans) of the Meo` --semantically_similar_to--> `Pal System — Anti-State Organisation of Meos`  [INFERRED] [semantically similar]
  public/llms.txt → books/تاريخ_اور_رياست_کے_باغی-ڈاکٹر_شيل_مايارام-2012-صاف.pdf

## Hyperedges (group relationships)
- **i18n Locale System (routing + middleware + request config)** — src_config_routing_ts, src_proxy_ts, src_i18n_ts [EXTRACTED 0.95]
- **Supabase Client Abstraction Layer (admin, browser, singleton)** — src_lib_admin_ts, src_lib_supabase_browser_ts, src_lib_supabase_ts [INFERRED 0.85]
- **Cloudinary Image Pipeline (upload, URL builder, book reader)** — src_lib_cloudinary_upload_ts, src_lib_cloudinary_ts, src_components_bookreader_tsx [INFERRED 0.80]
- **Admin CRUD API Pattern (books, articles, users, degrees)** — api_admin_books_route, api_admin_articles_route, api_admin_users_route, api_admin_degrees_route, lib_admin [EXTRACTED 0.95]
- **Multilingual Content Pattern (content.ts + Locale + routing)** — content_contentts, content_locale_type, config_routing, locale_layout [EXTRACTED 0.95]
- **Member Signup Flow (form → Cloudinary → API → Supabase)** — page_join, lib_cloudinary_upload, api_signup_route, supabase_profiles_table [EXTRACTED 0.95]
- **Meo Identity Preserved Across Platform, Census Data, and Historical Scholarship** — readme_meo_people, llms_pals_clans, pdf_meo_identity [INFERRED 0.88]
- **Trilingual RTL/LTR Locale System (EN/UR/MEW)** — readme_locale_en, readme_locale_ur, readme_locale_mew, readme_rtl_ltr [EXTRACTED 1.00]
- **Meo Resistance to State — Oral Traditions, Colonial Records, and Subaltern History** — pdf_oral_history_methodology, pdf_colonial_documents, pdf_subaltern_historiography [EXTRACTED 0.90]
- **Next.js Default Starter Public SVG Icons** — globe_svg_icon, next_svg_logo, vercel_svg_logo, file_svg_icon, window_svg_icon [INFERRED 0.85]

## Communities

### Community 0 - "Admin API Routes"
Cohesion: 0.11
Nodes (28): API Route: /api/admin/articles (CRUD), API Route: /api/admin/books (CRUD), API Route: /api/admin/degrees (Degree Verification), API Route: /api/admin/users/[id] (User Detail), API Route: /api/admin/users (User Management), API Route: /api/signup (User Registration), DIR — Thirteen Pals Directory Content, JOIN — Member Registration Content (+20 more)

### Community 1 - "Page Components & Upload Logic"
Cohesion: 0.13
Nodes (12): uploadToCloudinary(), changePassword(), check(), handleFile(), handleLogin(), handlePhotoSelect(), handleSubmit(), load() (+4 more)

### Community 2 - "Historical Book Content"
Cohesion: 0.1
Nodes (21): 1857 Rebellion — Meos and Colonial System, Against History, Against State (Original English Book), Bhagat Singh (Martyr — Book Dedication), 19th-Century Colonial Documents on Meos (Settlement Reports, Land Records), Colonial State and its Opposition, Daria Khan (Meo Oral Tradition Figure), Fiction House Publishers (Lahore/Hyderabad/Karachi), Ghurchhi Meo Khan (Meo Oral Tradition Figure) (+13 more)

### Community 3 - "Project Documentation"
Cohesion: 0.12
Nodes (20): autoTranslationForbidden Guard on Mewati Strings, src/data/content.ts — Trilingual Content Store, Cormorant Garamond Font, Design System: Emerald, Gold, Cream Palette, Gotra Directory (12 Gotras), History Timeline (Seven Eras), Eight-Point Islamic Khatim Star Ornament, English Locale (en) (+12 more)

### Community 4 - "Admin Auth & CRUD Layer"
Cohesion: 0.22
Nodes (9): getAdmin(), slugify(), verifyAdmin(), Meo Qoum Community Platform, DELETE(), GET(), getAdmin(), PATCH() (+1 more)

### Community 5 - "Auth & Header Navigation"
Cohesion: 0.14
Nodes (4): Supabase JS Client Library, handleLogout(), MarriageProfile Type, Profile Type

### Community 6 - "Book Reader & PDF Pipeline"
Cohesion: 0.17
Nodes (7): cldFetch(), cldUrl(), transforms(), uploadDocToCloudinary(), Cloudinary REST API, epub.js Library, handleDegreeUpload()

### Community 7 - "LLMs.txt Platform Description"
Cohesion: 0.13
Nodes (15): 1947 Partition — Division of Meo Homeland, GET|POST|DELETE /api/admin/articles — Article Management, GET|POST|DELETE /api/admin/books — Book Management, POST /api/signup — User Registration API Route, Cloudinary — Media Storage (Images, PDFs, ePubs), MeoQoum.com Community Archive Platform, Mewati Speakers India — 856,643 (2011 Census), Mewati Speakers Pakistan — 1,094,219 (2023 Census) (+7 more)

### Community 8 - "UI Footer & SVG Ornaments"
Cohesion: 0.17
Nodes (0): 

### Community 9 - "Rishta Directory Filters"
Cohesion: 0.17
Nodes (1): toggleProfile()

### Community 10 - "Core API & Component Registry"
Cohesion: 0.24
Nodes (10): API Route: /api/pdf (Cloudinary PDF Proxy), Cloudinary CDN Service, BookReader Component, Footer Component, Header Component, HOME — Home Page Content, LIBRARY — Digital Library Content, data/books — Static Book Data (+2 more)

### Community 11 - "Static Assets & Branding"
Cohesion: 0.39
Nodes (8): Document / File Icon, Globe / World Icon, Next.js Wordmark Logo, Next.js Framework, Public Static Assets Directory, Vercel Deployment Platform, Vercel Triangle Logo, Browser Window / Desktop App Icon

### Community 12 - "Interactive Map (MewatiMap)"
Cohesion: 0.29
Nodes (2): Leaflet Map Library, MapLocation Type & MAP_LOCATIONS

### Community 13 - "i18n & Locale Routing"
Cohesion: 0.47
Nodes (2): Tri-locale Routing (en/ur/mew), next-intl Library

### Community 14 - "Root Layout & Params"
Cohesion: 0.67
Nodes (0): 

### Community 15 - "Population Page"
Cohesion: 0.67
Nodes (3): MewatiMap Component (Leaflet), POPULATION — Census & Diaspora Content, Population Page (Census & Diaspora)

### Community 16 - "News Page"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Content Types"
Cohesion: 1.0
Nodes (2): content.ts — Multilingual Content Store, Locale Type (en | ur | mew)

### Community 18 - "History Page"
Cohesion: 1.0
Nodes (2): HISTORY — Timeline Eras Content, History Page

### Community 19 - "Routing Config"
Cohesion: 1.0
Nodes (2): config/routing — i18n Locale Routing, Locale Layout (i18n + fonts)

### Community 20 - "Agent Instructions (AGENTS.md)"
Cohesion: 1.0
Nodes (2): Next.js Breaking Changes Warning, Next.js Docs in node_modules

### Community 21 - "Next.js Type Declarations"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Content Data Module"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Home Page"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Library Page"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "History Page Module"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Population Page Module"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Directory Page Module"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Book Type"
Cohesion: 1.0
Nodes (1): Book Type & BOOKS Array

### Community 29 - "Brand Content"
Cohesion: 1.0
Nodes (1): BRAND — Site Brand Strings

### Community 30 - "Nav Content"
Cohesion: 1.0
Nodes (1): NAV — Navigation Labels

### Community 31 - "Footer Content"
Cohesion: 1.0
Nodes (1): FOOTER — Footer Content

## Knowledge Gaps
- **61 isolated node(s):** `Leaflet Map Library`, `epub.js Library`, `Book Type & BOOKS Array`, `MapLocation Type & MAP_LOCATIONS`, `Meo Qoum Community Platform` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `News Page`** (2 nodes): `getServerSupabase()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Content Types`** (2 nodes): `content.ts — Multilingual Content Store`, `Locale Type (en | ur | mew)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `History Page`** (2 nodes): `HISTORY — Timeline Eras Content`, `History Page`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Routing Config`** (2 nodes): `config/routing — i18n Locale Routing`, `Locale Layout (i18n + fonts)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Agent Instructions (AGENTS.md)`** (2 nodes): `Next.js Breaking Changes Warning`, `Next.js Docs in node_modules`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Type Declarations`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Content Data Module`** (1 nodes): `content.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Home Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Library Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `History Page Module`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Population Page Module`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Directory Page Module`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Book Type`** (1 nodes): `Book Type & BOOKS Array`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Brand Content`** (1 nodes): `BRAND — Site Brand Strings`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Nav Content`** (1 nodes): `NAV — Navigation Labels`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Footer Content`** (1 nodes): `FOOTER — Footer Content`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `Page Components & Upload Logic` to `Rishta Directory Filters`, `Auth & Header Navigation`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `toggleProfile()` connect `Rishta Directory Filters` to `Page Components & Upload Logic`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `getSupabase()` (e.g. with `handleLogout()` and `check()`) actually correct?**
  _`getSupabase()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Library Page` (e.g. with `Cloudinary CDN Service` and `API Route: /api/pdf (Cloudinary PDF Proxy)`) actually correct?**
  _`Library Page` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Leaflet Map Library`, `epub.js Library`, `Book Type & BOOKS Array` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Page Components & Upload Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._