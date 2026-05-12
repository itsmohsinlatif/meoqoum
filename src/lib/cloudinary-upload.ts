const CLOUD  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export type UploadResult = { publicId: string; url: string };

export async function uploadToCloudinary(
  file: File,
  folder: string = 'meoqoum'
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', PRESET);
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? 'Cloudinary upload failed');
  }

  const data = await res.json();
  return { publicId: data.public_id as string, url: data.secure_url as string };
}

export async function uploadDocToCloudinary(
  file: File,
  folder: string = 'meoqoum/degrees'
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', PRESET);
  formData.append('folder', folder);

  const endpoint = file.type === 'application/pdf'
    ? `https://api.cloudinary.com/v1_1/${CLOUD}/raw/upload`
    : `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`;

  const res = await fetch(endpoint, { method: 'POST', body: formData });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? 'Cloudinary upload failed');
  }

  const data = await res.json();
  return { publicId: data.public_id as string, url: data.secure_url as string };
}
