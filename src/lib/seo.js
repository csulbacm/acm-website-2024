// Small SEO helpers used by head.js files

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://csulb-acm.org';

export function absoluteUrl(path = '') {
  if (!path) return baseUrl;
  try {
    // already absolute
    if (/^https?:\/\//i.test(path)) return path;
  } catch {}
  if (!path.startsWith('/')) path = `/${path}`;
  return `${baseUrl}${path}`;
}

export function stripHtml(html = '') {
  try {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    return String(html || '').trim();
  }
}

export function truncate(text = '', max = 160) {
  const t = String(text || '');
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ACM at CSULB',
    url: baseUrl,
    logo: absoluteUrl('/images/acm-csulb.png'),
    sameAs: [
      'https://www.instagram.com/csulbacm/',
      'https://www.linkedin.com/company/acm-at-csulb/',
      'https://github.com/csulbacm'
    ],
  };
}
