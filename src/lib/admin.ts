import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

export function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase not configured.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** Verifies the Bearer token in the request and checks admin email.
 *  Returns the user object if valid admin, null otherwise. */
export async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return null;

  const admin = getAdmin();
  const { data: { user }, error } = await admin.auth.getUser(token);
  if (error || !user) return null;
  if (user.email !== adminEmail) return null;
  return user;
}

/** Slugify a string for use as a DB slug */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}
