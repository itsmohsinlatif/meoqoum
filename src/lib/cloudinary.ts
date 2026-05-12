const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'demo';
const BASE = `https://res.cloudinary.com/${CLOUD}`;

type ImgOpts = { w?: number; h?: number; q?: string; crop?: string };

function transforms(opts: ImgOpts): string {
  return [
    opts.w    ? `w_${opts.w}`    : '',
    opts.h    ? `h_${opts.h}`    : '',
    opts.crop ? `c_${opts.crop}` : '',
    `q_${opts.q ?? 'auto'}`,
    'f_auto',
  ].filter(Boolean).join(',');
}

/** Build a URL for an uploaded asset (image or PDF). */
export function cldUrl(publicId: string, opts: ImgOpts = {}): string {
  return `${BASE}/image/upload/${transforms(opts)}/${publicId}`;
}

/** Fetch + optimise any external image through Cloudinary. */
export function cldFetch(sourceUrl: string, opts: ImgOpts = {}): string {
  return `${BASE}/image/fetch/${transforms(opts)}/${sourceUrl}`;
}

/** PDF stored in Cloudinary — returns a direct URL usable in an iframe. */
export function cldPdf(publicId: string): string {
  return `${BASE}/raw/upload/${publicId}`;
}
