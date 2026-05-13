import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, getAdmin } from '@/lib/admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const admin = getAdmin();

  const { data: profile, error } = await admin
    .from('profiles')
    .select(`
      id, first_name, last_name, gender, country, city,
      is_verified, is_active, created_at,
      marriage_profiles (
        id, is_active, about,
        height, weight, complexion,
        education, profession, income,
        looking_for,
        degree_doc_id, degree_type,
        is_degree_verified, degree_status, degree_note
      )
    `)
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: authData } = await admin.auth.admin.getUserById(id);

  return NextResponse.json({
    user: {
      ...profile,
      email: authData?.user?.email ?? null,
      marriage_profile: (profile as any).marriage_profiles?.[0] ?? null,
    },
  });
}
