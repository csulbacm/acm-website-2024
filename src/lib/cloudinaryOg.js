import { baseUrl, absoluteUrl } from './seo';

function getCloudName() {
  const url = process.env.CLOUDINARY_URL || '';
  const m = url.match(/@([^/]+)$/);
  return m ? m[1] : null;
}

export function buildOgFromCloudinary(imageUrl) {
  try {
    const cloudName = getCloudName();
    if (!cloudName || !/^https?:\/\/res\.cloudinary\.com\//.test(imageUrl)) return absoluteUrl(imageUrl);
    // Insert basic resize/crop for OG
    return imageUrl.replace('/image/upload/', '/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/');
  } catch {
    return absoluteUrl(imageUrl);
  }
}

export function buildEventOgImage({ image, fallback = '/images/acm-csulb.png', title, date, location }) {
  const cloudName = getCloudName();
  const rawSrc = image ? image : absoluteUrl(fallback);
  const src = /^https?:\/\//.test(rawSrc) ? rawSrc : absoluteUrl(rawSrc);
  if (!cloudName || !/^https?:\/\/res\.cloudinary\.com\//.test(src)) {
    return buildOgFromCloudinary(src);
  }

  // Branded overlay template: base image blurred with dark overlay, logo top-left, title/date/location bottom-left
  // Encode text overlays
  const enc = (t) => encodeURIComponent((t || '').replace(/\n/g, ' ').slice(0, 120));
  const titleTxt = enc(title || 'ACM at CSULB Event');
  const dateTxt = enc(date || '');
  const locTxt = enc(location || 'CSULB');

  // Build transformation steps
  const base = 'c_fill,w_1200,h_630,q_auto,f_auto,e_blur:200';
  const overlayShade = 'e_colorize:40,co_rgb:000000';
  const logo = `l_text:Arial_60_bold:ACM%20CSULB,co_rgb:ffffff,g_north_west,x_60,y_40`;
  const line1 = `l_text:Arial_64_bold:${titleTxt},co_rgb:ffffff,g_south_west,x_60,y_160`;
  const line2 = dateTxt ? `,l_text:Arial_40_bold:${dateTxt},co_rgb:ffffff,g_south_west,x_60,y_100` : '';
  const line3 = locTxt ? `,l_text:Arial_36_bold:${locTxt},co_rgb:ffffff,g_south_west,x_60,y_60` : '';

  return src.replace(
    '/image/upload/',
    `/image/upload/${base}/${overlayShade}/${logo}/${line1}${line2}${line3}/`
  );
}
