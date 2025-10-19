import { absoluteUrl } from '../../lib/seo';

export default function Head() {
  const url = absoluteUrl('/contact');
  const title = 'Contact | ACM at CSULB';
  const description = 'Get in touch with ACM at CSULB for questions about events, membership, or partnerships.';
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
    </>
  );
}
