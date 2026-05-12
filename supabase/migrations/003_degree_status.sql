-- Add degree verification status and admin note to marriage_profiles
ALTER TABLE marriage_profiles
  ADD COLUMN IF NOT EXISTS degree_status text NOT NULL DEFAULT 'pending'
    CHECK (degree_status IN ('pending','verified','amendment_requested')),
  ADD COLUMN IF NOT EXISTS degree_note   text;

-- Update existing verified rows
UPDATE marriage_profiles SET degree_status = 'verified' WHERE is_degree_verified = true;
