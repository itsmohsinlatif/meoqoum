-- ── Books (dynamic, uploaded via admin panel) ────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text        UNIQUE NOT NULL,
  title_en        text        NOT NULL,
  title_ur        text        NOT NULL DEFAULT '',
  title_mew       text        NOT NULL DEFAULT '',
  author          text        NOT NULL,
  year            smallint,
  language        text[]      NOT NULL DEFAULT '{}',
  category        text        NOT NULL DEFAULT 'history'
                              CHECK (category IN ('history','language','culture','religion','literature')),
  description_en  text        NOT NULL DEFAULT '',
  description_ur  text        NOT NULL DEFAULT '',
  description_mew text        NOT NULL DEFAULT '',
  cover_id        text,                    -- Cloudinary public_id
  cover_gradient  text        NOT NULL DEFAULT 'linear-gradient(135deg,#1a3a2a,#004225)',
  source_type     text        NOT NULL DEFAULT 'pdf_url'
                              CHECK (source_type IN ('pdf_url','epub_url','archive','cloudinary')),
  source_id       text        NOT NULL,    -- Cloudinary URL or archive.org identifier
  is_published    boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── Articles (dynamic, uploaded via admin panel) ──────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text        UNIQUE NOT NULL,
  title_en      text        NOT NULL,
  title_ur      text        NOT NULL DEFAULT '',
  title_mew     text        NOT NULL DEFAULT '',
  excerpt_en    text        NOT NULL DEFAULT '',
  excerpt_ur    text        NOT NULL DEFAULT '',
  excerpt_mew   text        NOT NULL DEFAULT '',
  body_en       text        NOT NULL DEFAULT '',
  body_ur       text        NOT NULL DEFAULT '',
  body_mew      text        NOT NULL DEFAULT '',
  category      text        NOT NULL DEFAULT 'community',
  cover_id      text,                    -- Cloudinary public_id
  author        text        NOT NULL DEFAULT '',
  read_min      smallint,
  is_pinned     boolean     NOT NULL DEFAULT false,
  is_published  boolean     NOT NULL DEFAULT true,
  published_at  timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── Timestamps ────────────────────────────────────────────────────────────────
CREATE TRIGGER books_ts
  BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE books    ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public can read published records
CREATE POLICY "public read books"    ON books    FOR SELECT USING (is_published = true);
CREATE POLICY "public read articles" ON articles FOR SELECT USING (is_published = true);
-- Writes are handled server-side via service_role (bypasses RLS)
