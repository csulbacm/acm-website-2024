import { absoluteUrl } from '../../lib/seo';

export default function Head() {
  const url = absoluteUrl('/blog');
  const title = 'Blog | ACM at CSULB';
  const description = 'Read the latest posts from ACM at CSULB: workshops, tutorials, announcements, and community highlights.';
  const image = absoluteUrl('/images/acm-csulb.png');

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="ACM at CSULB" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
