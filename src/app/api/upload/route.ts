import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name:  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/* Folder map — keeps asset paths consistent across the codebase */
export const FOLDERS = {
  covers:   'meoqoum/covers',       // book & article cover images
  books:    'meoqoum/books',        // book PDFs / ePubs
  degrees:  'meoqoum/degrees',      // member degree documents
  profiles: 'meoqoum/profiles',     // profile photos
  news:     'meoqoum/news',         // news / blog cover images
} as const;

export type FolderKey = keyof typeof FOLDERS;

const ALLOWED_FOLDERS = new Set(Object.values(FOLDERS));

export async function POST(req: NextRequest) {
  /* Read multipart form */
  const form = await req.formData();
  const file   = form.get('file') as File | null;
  const folder = form.get('folder') as string | null;

  if (!file)   return NextResponse.json({ error: 'No file provided' },    { status: 400 });
  if (!folder) return NextResponse.json({ error: 'No folder specified' }, { status: 400 });

  /* Validate folder to prevent path traversal */
  if (!ALLOWED_FOLDERS.has(folder as (typeof FOLDERS)[FolderKey])) {
    return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
  }

  /* Determine resource type */
  const isRaw = file.type === 'application/pdf'
    || file.name.endsWith('.epub')
    || file.name.endsWith('.pdf');
  const resourceType = isRaw ? 'raw' : 'image';

  /* Convert to buffer */
  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await new Promise<{ public_id: string; secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: resourceType, use_filename: false },
          (err, res) => { err ? reject(err) : resolve(res as any); }
        );
        stream.end(buffer);
      }
    );

    return NextResponse.json({
      publicId: result.public_id,
      url:      result.secure_url,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Upload failed' }, { status: 500 });
  }
}
