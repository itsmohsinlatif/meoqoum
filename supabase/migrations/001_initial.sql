-- ════════════════════════════════════════════════════════════════════════════
-- Meo Qoum — complete database schema
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════════════════

-- ── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Reference: Pals (13 clans) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pals (
  id       smallserial PRIMARY KEY,
  slug     text UNIQUE NOT NULL,
  name_en  text NOT NULL,
  name_ur  text NOT NULL,
  vansh    text
);

-- ── Reference: Gotras (52 sub-clans) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gotras (
  id       smallserial PRIMARY KEY,
  pal_id   smallint REFERENCES pals(id),
  slug     text UNIQUE NOT NULL,
  name_en  text NOT NULL,
  name_ur  text NOT NULL
);

-- ── Core member profiles (linked to Supabase Auth) ───────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name       text NOT NULL,
  last_name        text NOT NULL,
  father_name      text NOT NULL,
  date_of_birth    date NOT NULL,
  gender           text NOT NULL CHECK (gender IN ('male','female')),

  -- Lineage
  pal_id           smallint REFERENCES pals(id),
  gotra_id         smallint REFERENCES gotras(id),
  pichla_gaoon     text,

  -- Personal
  marital_status   text NOT NULL DEFAULT 'unmarried'
    CHECK (marital_status IN ('unmarried','married','divorced','widowed','other')),
  blood_group      text
    CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown')),
  religion         text NOT NULL DEFAULT 'Islam',

  -- Education & profession
  education_level  text
    CHECK (education_level IN ('none','primary','secondary','intermediate',
                               'bachelor','master','phd','other')),
  education_field  text,
  profession       text,

  -- Brief introduction
  intro            text,

  -- Contact & location
  permanent_addr   text,
  current_addr     text,
  country          text,
  state_province   text,
  district         text,
  city             text,
  contact_no       text,

  -- Photos (Cloudinary public_ids — max 2)
  profile_pic_id   text,
  profile_pic_id_2 text,

  -- Social media links
  social_whatsapp  text,
  social_facebook  text,
  social_instagram text,
  social_linkedin  text,
  social_twitter   text,

  -- Status
  is_verified      boolean NOT NULL DEFAULT false,
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ── Marriage / Rishta profiles ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marriage_profiles (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Education verification
  degree_doc_id      text,        -- Cloudinary public_id of uploaded degree scan
  degree_type        text,        -- e.g. "MBBS", "BSc Engineering"
  is_degree_verified boolean NOT NULL DEFAULT false,

  -- Profile content
  bio                text,
  height_cm          smallint CHECK (height_cm BETWEEN 100 AND 250),
  weight_kg          smallint,
  complexion         text CHECK (complexion IN ('fair','medium','olive','dark')),

  -- Match preferences
  pref_age_min       smallint NOT NULL DEFAULT 18 CHECK (pref_age_min >= 18),
  pref_age_max       smallint NOT NULL DEFAULT 50 CHECK (pref_age_max <= 80),
  pref_education     text,
  pref_country       text,
  pref_notes         text,

  is_active          boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- ── Auto-update timestamp ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE TRIGGER profiles_ts
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER marriage_ts
  BEFORE UPDATE ON marriage_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE pals              ENABLE ROW LEVEL SECURITY;
ALTER TABLE gotras            ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE marriage_profiles ENABLE ROW LEVEL SECURITY;

-- Reference tables: everyone can read
CREATE POLICY "public read pals"   ON pals   FOR SELECT USING (true);
CREATE POLICY "public read gotras" ON gotras FOR SELECT USING (true);

-- Profiles: owner has full control; authenticated members can read active profiles
CREATE POLICY "own profile"        ON profiles FOR ALL    USING (auth.uid() = id);
CREATE POLICY "members read"       ON profiles FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);

-- Marriage: owner full control; members read active listings
CREATE POLICY "own marriage"       ON marriage_profiles FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "members read rishta"ON marriage_profiles FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);

-- ── Seed: 13 Pals ─────────────────────────────────────────────────────────────
INSERT INTO pals (slug, name_en, name_ur, vansh) VALUES
  ('demrot',    'Demrot',     'ڈَیمروٹ',    'Surajvanshi·Jado'),
  ('poonglot',  'Poonglot',   'پُونگلوٹ',   'Surajvanshi·Jado'),
  ('balot',     'Balot',      'بَلوٹ',      'Surajvanshi·Jado'),
  ('ratwat',    'Ratwat',     'رَتواٹ',     'Chandravanshi·Chauhan'),
  ('sengal',    'Sengal',     'سِنگال',     'Chandravanshi·Chauhan'),
  ('dulot',     'Dulot',      'دُلوٹ',      'Surajvanshi·Jado'),
  ('nai',       'Nai',        'نَئی',       'Agnivanshi'),
  ('lundawat',  'Lundawat',   'لُنداوَت',   'Surajvanshi·Jado'),
  ('chhirkalot','Chhirkalot', 'چِھرکلوٹ',  'Surajvanshi·Jado'),
  ('dhengal',   'Dhengal',    'ڈھینگل',    'Agnivanshi'),
  ('kalisa',    'Kalisa',     'کَلیسا',     'Chandravanshi·Chauhan'),
  ('dedwal',    'Dedwal',     'دیدوال',     'Surajvanshi·Tomar'),
  ('pahat',     'Pahat',      'پاہَت',      'Surajvanshi·Tomar')
ON CONFLICT (slug) DO NOTHING;

-- ── Seed: 52 Gotras ───────────────────────────────────────────────────────────
INSERT INTO gotras (pal_id, slug, name_en, name_ur) VALUES
  -- Demrot
  ((SELECT id FROM pals WHERE slug='demrot'),    'demrot',       'Demrot',       'ڈیمروٹ'),
  ((SELECT id FROM pals WHERE slug='demrot'),    'boridha',      'Boridha',      'بوریدھا'),
  ((SELECT id FROM pals WHERE slug='demrot'),    'kataria',      'Kataria',      'کٹاریہ'),
  ((SELECT id FROM pals WHERE slug='demrot'),    'naharwad',     'Naharwad',     'نہارواڈ'),
  -- Poonglot
  ((SELECT id FROM pals WHERE slug='poonglot'),  'poonglot',     'Poonglot',     'پونگلوٹ'),
  ((SELECT id FROM pals WHERE slug='poonglot'),  'sekhawat',     'Sekhawat',     'سیکھاوٹ'),
  ((SELECT id FROM pals WHERE slug='poonglot'),  'gorwal',       'Gorwal',       'گورول'),
  -- Balot
  ((SELECT id FROM pals WHERE slug='balot'),     'balot',        'Balot',        'بلوٹ'),
  ((SELECT id FROM pals WHERE slug='balot'),     'bugla',        'Bugla',        'بُگلا'),
  ((SELECT id FROM pals WHERE slug='balot'),     'sagadawat',    'Sagadawat',    'ساگداوٹ'),
  ((SELECT id FROM pals WHERE slug='balot'),     'jatlawat',     'Jatlawat',     'جٹلاوٹ'),
  ((SELECT id FROM pals WHERE slug='balot'),     'bhegot',       'Bhegot',       'بھیگوٹ'),
  -- Ratwat
  ((SELECT id FROM pals WHERE slug='ratwat'),    'ratwat',       'Ratwat',       'رتواٹ'),
  ((SELECT id FROM pals WHERE slug='ratwat'),    'veer',         'Veer',         'ویر'),
  ((SELECT id FROM pals WHERE slug='ratwat'),    'godh',         'Godh',         'گودھ'),
  ((SELECT id FROM pals WHERE slug='ratwat'),    'chhokar',      'Chhokar',      'چھوکر'),
  -- Sengal
  ((SELECT id FROM pals WHERE slug='sengal'),    'sengal',       'Sengal',       'سنگال'),
  ((SELECT id FROM pals WHERE slug='sengal'),    'badgujar',     'Badgujar',     'بادگوجر'),
  ((SELECT id FROM pals WHERE slug='sengal'),    'pawar-mewal',  'Pawar (Mewal)','پوار (میوال)'),
  ((SELECT id FROM pals WHERE slug='sengal'),    'bilyana',      'Bilyana',      'بلیانہ'),
  ((SELECT id FROM pals WHERE slug='sengal'),    'bhati',        'Bhati',        'بھاٹی'),
  -- Dulot
  ((SELECT id FROM pals WHERE slug='dulot'),     'dulot',        'Dulot',        'دلوٹ'),
  ((SELECT id FROM pals WHERE slug='dulot'),     'bodhiyan',     'Bodhiyan',     'بودھیان'),
  ((SELECT id FROM pals WHERE slug='dulot'),     'dhatawat',     'Dhatawat',     'دھاٹاوٹ'),
  ((SELECT id FROM pals WHERE slug='dulot'),     'lalawat',      'Lalawat',      'لالاوٹ'),
  -- Nai
  ((SELECT id FROM pals WHERE slug='nai'),       'nai',          'Nai',          'نائی'),
  ((SELECT id FROM pals WHERE slug='nai'),       'bhamdawat',    'Bhamdawat',    'بھامداوٹ'),
  ((SELECT id FROM pals WHERE slug='nai'),       'khokkar',      'Khokkar',      'کھوکھر'),
  ((SELECT id FROM pals WHERE slug='nai'),       'chaurasia',    'Chaurasia',    'چوراسیہ'),
  ((SELECT id FROM pals WHERE slug='nai'),       'kangar',       'Kangar',       'کنگر'),
  -- Lundawat
  ((SELECT id FROM pals WHERE slug='lundawat'),  'lundawat',     'Lundawat',     'لنداوٹ'),
  ((SELECT id FROM pals WHERE slug='lundawat'),  'baghodia',     'Baghodia',     'باگھوڈیا'),
  ((SELECT id FROM pals WHERE slug='lundawat'),  'majilawat',    'Majilawat',    'ماجیلاوٹ'),
  ((SELECT id FROM pals WHERE slug='lundawat'),  'jhelawat',     'Jhelawat',     'جھیلاوٹ'),
  -- Chhirkalot
  ((SELECT id FROM pals WHERE slug='chhirkalot'),'chhirkalot',   'Chhirkalot',   'چھرکلوٹ'),
  ((SELECT id FROM pals WHERE slug='chhirkalot'),'kadawat',      'Kadawat',      'کداوٹ'),
  -- Dhengal
  ((SELECT id FROM pals WHERE slug='dhengal'),   'dhengal',      'Dhengal',      'ڈھینگل'),
  ((SELECT id FROM pals WHERE slug='dhengal'),   'dehangal',     'Dehangal',     'دیہنگل'),
  -- Kalisa
  ((SELECT id FROM pals WHERE slug='kalisa'),    'kalisa',       'Kalisa',       'کلیسا'),
  ((SELECT id FROM pals WHERE slug='kalisa'),    'chauhan',      'Chauhan',      'چوہان'),
  ((SELECT id FROM pals WHERE slug='kalisa'),    'malik',        'Malik',        'ملک'),
  ((SELECT id FROM pals WHERE slug='kalisa'),    'jamaliya',     'Jamaliya',     'جمالیہ'),
  -- Dedwal
  ((SELECT id FROM pals WHERE slug='dedwal'),    'dedwal',       'Dedwal',       'دیدوال'),
  ((SELECT id FROM pals WHERE slug='dedwal'),    'kalsia',       'Kalsia',       'کلسیہ'),
  ((SELECT id FROM pals WHERE slug='dedwal'),    'sukeda',       'Sukeda',       'سوکیدہ'),
  ((SELECT id FROM pals WHERE slug='dedwal'),    'bhabla',       'Bhabla',       'بھابلہ'),
  ((SELECT id FROM pals WHERE slug='dedwal'),    'gehlot',       'Gehlot',       'گہلوٹ'),
  ((SELECT id FROM pals WHERE slug='dedwal'),    'jhangala',     'Jhangala',     'جھنگالہ'),
  ((SELECT id FROM pals WHERE slug='dedwal'),    'silania',      'Silania',      'سیلانیہ'),
  -- Pahat
  ((SELECT id FROM pals WHERE slug='pahat'),     'pahat',        'Pahat',        'پاہت'),
  ((SELECT id FROM pals WHERE slug='pahat'),     'lamkhara',     'Lamkhara',     'لامکھارہ'),
  ((SELECT id FROM pals WHERE slug='pahat'),     'tanwar',       'Tanwar',       'تنور'),
  ((SELECT id FROM pals WHERE slug='pahat'),     'gomal',        'Gomal',        'گومل')
ON CONFLICT (slug) DO NOTHING;
