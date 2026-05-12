import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    _client = createClient(url, key);
  }
  return _client;
}

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  father_name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  pal_id: number | null;
  gotra_id: number | null;
  pichla_gaoon: string | null;
  marital_status: string;
  blood_group: string | null;
  religion: string;
  education_level: string | null;
  education_field: string | null;
  profession: string | null;
  intro: string | null;
  permanent_addr: string | null;
  current_addr: string | null;
  country: string | null;
  state_province: string | null;
  district: string | null;
  city: string | null;
  contact_no: string | null;
  profile_pic_id: string | null;
  profile_pic_id_2: string | null;
  social_whatsapp: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MarriageProfile = {
  id: string;
  user_id: string;
  degree_doc_id: string | null;
  degree_type: string | null;
  is_degree_verified: boolean;
  bio: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  complexion: string | null;
  pref_age_min: number;
  pref_age_max: number;
  pref_education: string | null;
  pref_country: string | null;
  pref_notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile & { pals?: { name_en: string; name_ur: string } | null; gotras?: { name_en: string; name_ur: string } | null };
};
