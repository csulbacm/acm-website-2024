import { absoluteUrl } from '../../lib/seo';

export default function Head() {
  const url = absoluteUrl('/sponsors');
  const title = 'Sponsors | ACM at CSULB';
  const description = 'Thanks to our sponsors supporting ACM at CSULB and empowering student developers.';
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
