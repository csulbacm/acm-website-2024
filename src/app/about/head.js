import { absoluteUrl } from '../../lib/seo';

export default function Head() {
  const url = absoluteUrl('/about');
  const title = 'About | ACM at CSULB';
  const description = 'Learn about ACM at CSULB, our mission, leadership, and how we support the CS community at Long Beach.';
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
