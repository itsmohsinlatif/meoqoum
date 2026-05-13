export type UploadResult = { publicId: string; url: string };

/* Folder constants — import these wherever you reference a folder path */
export const FOLDERS = {
  covers:   'meoqoum/covers',
  books:    'meoqoum/books',
  degrees:  'meoqoum/degrees',
  profiles: 'meoqoum/profiles',
  news:     'meoqoum/news',
} as const;

async function uploadViaServer(file: File, folder: string): Promise<UploadResult | null> {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);

  const res = await fetch('/api/upload', { method: 'POST', body: form });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? 'Upload failed');
  }

  return res.json();
}

/** Upload an image (cover photo, profile picture, etc.) */
export async function uploadToCloudinary(
  file: File,
  folder: string = FOLDERS.covers,
): Promise<UploadResult | null> {
  return uploadViaServer(file, folder);
}

/** Upload a document (PDF, ePub, degree certificate) */
export async function uploadDocToCloudinary(
  file: File,
  folder: string = FOLDERS.degrees,
): Promise<UploadResult | null> {
  const MAX_BYTES = 10 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    throw new Error(
      `File is ${(file.size / 1024 / 1024).toFixed(1)} MB — maximum is 10 MB. Please compress the file.`
    );
  }
  return uploadViaServer(file, folder);
}
