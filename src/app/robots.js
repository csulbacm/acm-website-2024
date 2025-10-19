// Next.js App Router robots configuration
export default function robots() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://acm-csulb.org';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
  disallow: ['/admin', '/api', '/login'],
    },
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
