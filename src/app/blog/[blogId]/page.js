"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RotatingLines } from "react-loader-spinner";
import 'react-quill/dist/quill.snow.css';
import Head from 'next/head';
import { absoluteUrl } from '../../../lib/seo';

export default function BlogDetails({ params }) {
  const { blogId } = params; // can be an ObjectId or slug
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [canonicalId, setCanonicalId] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        // Fetch blog data: try slug first, then id fallback
        let response = await fetch(`/api/blog/${blogId}`);
        if (!response.ok) {
          // retry via slug endpoint (uses query param)
          const url = `/api/blog/slug?slug=${encodeURIComponent(blogId)}`;
          response = await fetch(url);
        }
        if (!response.ok) throw new Error("Failed to fetch blog");
  const data = await response.json();

        // Initialize state
  setBlog(data);
        setViews(data.views || 0);
        setUpvotes(data.upvotes || 0);
  setCanonicalId(data._id || null);

        // Check upvote status (cookie + IP)
        const upvoteCheckRes = await fetch(
          `/api/blog/${encodeURIComponent(data._id || blogId)}/upvote-check`,
          { credentials: "include" }
        );
        if (upvoteCheckRes.ok) {
          const { hasUpvoted } = await upvoteCheckRes.json();
          setHasUpvoted(hasUpvoted);
        }

        // Increment view count
        const viewRes = await fetch(
          `/api/blog/${encodeURIComponent(data._id || blogId)}/view`,
          { method: "POST", credentials: "include" }
        );
        if (viewRes.ok) {
          setViews(prev => prev + 1);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) fetchBlog();
  }, [blogId]);

  const handleUpvote = async () => {
    if (hasUpvoted) {
      alert("You’ve already upvoted this blog!");
      return;
    }

    // Optimistic UI update
    setUpvotes(prev => prev + 1);
    setHasUpvoted(true);

    try {
      const res = await fetch(
        `/api/blog/${encodeURIComponent(canonicalId || blogId)}/upvote`,
        {
          method: "POST",
          credentials: "include"
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upvote");
      }
    } catch (error) {
      console.error("Error upvoting the blog:", error);
      // Revert UI on failure
      setUpvotes(prev => Math.max(prev - 1, 0));
      setHasUpvoted(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <RotatingLines
          visible={true}
          height="50"
          width="50"
          color="grey"
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Blog not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
  <link rel="canonical" href={absoluteUrl(`/blog/${encodeURIComponent(blog.slug || blog._id)}`)} />
        {blog && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: blog.title,
                description: (blog.content || '').replace(/<[^>]+>/g, ' ').slice(0, 200),
                image: (blog.image ? absoluteUrl(blog.image) : absoluteUrl('/images/acm-csulb.png')),
                author: blog.author ? { '@type': 'Person', name: blog.author } : undefined,
                datePublished: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
                dateModified: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
                mainEntityOfPage: absoluteUrl(`/blog/${encodeURIComponent(blog.slug || blog._id)}`),
              }),
            }}
          />
        )}
      </Head>
      {/* Hero Section */}
      <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
        {blog.image ? (
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <Image
            src="/default-bg.jpg"
            alt="Blog hero"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black opacity-50" />
        <h1 className="relative text-white text-5xl font-bold text-center px-4">
          {blog.title}
        </h1>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
        <p className="text-gray-500 text-sm mb-4">
          <strong>Author:</strong> {blog.author} | <strong>Views:</strong> {views} |{' '}
          <strong>Published:</strong> {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <div
          className="text-lg text-gray-800 leading-relaxed mb-6 ql-editor"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleUpvote}
            disabled={hasUpvoted}
            className={`px-6 py-2 rounded-lg text-white font-bold transition ${
              hasUpvoted
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {hasUpvoted ? "Upvoted" : "Upvote"}
          </button>
          <span className="text-lg font-semibold text-gray-700">Upvotes: {upvotes}</span>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <a
            href="/blog"
            className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
          >
            Back to Blog Page
          </a>
        </div>
      </div>
    </div>
  );
}