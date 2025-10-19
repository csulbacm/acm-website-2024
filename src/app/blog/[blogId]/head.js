import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { absoluteUrl, stripHtml, truncate } from '../../../lib/seo';

export default async function Head({ params }) {
  const { blogId } = params;
  const client = await clientPromise;
  const db = client.db('acmData');
  let id = null;
  try { id = new ObjectId(blogId); } catch {}
  const blog = await db.collection('blogs').findOne({ $or: [{ slug: blogId }, ...(id ? [{ _id: id }] : [])] });

  if (!blog) {
    return (
      <>
        <title>Blog | ACM at CSULB</title>
        <meta name="robots" content="noindex" />
      </>
    );
  }

  const canonicalPath = `/blog/${encodeURIComponent(blog.slug || String(blog._id))}`;
  const url = absoluteUrl(canonicalPath);
  const title = `${blog.title} | ACM at CSULB`;
  const description = truncate(stripHtml(blog.content || blog.description || ''), 160);
  const dynamicOg = absoluteUrl(`/blog/${encodeURIComponent(blog.slug || String(blog._id))}/opengraph-image`);
  const dynamicTw = absoluteUrl(`/blog/${encodeURIComponent(blog.slug || String(blog._id))}/twitter-image`);
  const image = blog.image ? absoluteUrl(blog.image) : absoluteUrl('/images/acm-csulb.png');
  const published = blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined;
  const modified = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description,
    image: image,
    author: blog.author ? { '@type': 'Person', name: blog.author } : undefined,
    datePublished: published,
    dateModified: modified || published,
    mainEntityOfPage: url,
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={dynamicOg} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={dynamicTw} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Blog', item: absoluteUrl('/blog') },
            { '@type': 'ListItem', position: 2, name: blog.title, item: url }
          ]
        }) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
