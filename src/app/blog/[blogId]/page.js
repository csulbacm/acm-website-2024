"use client";

import { useEffect, useState } from "react";

export default function BlogDetails({ params }) {
  const { blogId } = params; // Destructure blogId from params
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0); // Track views locally
  const [upvotes, setUpvotes] = useState(0); // Track upvotes
  const [hasUpvoted, setHasUpvoted] = useState(false); // Track if the user has upvoted

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${blogId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }
        const data = await response.json();
        setBlog(data);
        setViews(data.views || 0); // Initialize views
        setUpvotes(data.upvotes || 0); // Initialize upvotes

        // Check if the user has already upvoted based on their IP
        const upvoteCheckResponse = await fetch(`/api/blog/${blogId}/upvote-check`);
        if (upvoteCheckResponse.ok) {
          const { hasUpvoted } = await upvoteCheckResponse.json();
          setHasUpvoted(hasUpvoted); // Update local state
        }

        setLoading(false);

        // Increment views
        const viewResponse = await fetch(`/api/blog/${blogId}/view`, { method: "POST" });
        if (viewResponse.ok) {
          setViews((prev) => prev + 1); // Optimistically update views locally
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setLoading(false);
      }
    };

    if (blogId) fetchBlog();
  }, [blogId]);

  const handleUpvote = async () => {
    if (hasUpvoted) {
      alert("You have already upvoted this blog!");
      return;
    }

    try {
      setUpvotes((prev) => prev + 1); // Optimistically update upvotes locally
      setHasUpvoted(true); // Prevent multiple upvotes

      const response = await fetch(`/api/blog/${blogId}/upvote`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to upvote");
      }

      const updatedBlog = await response.json();
      setUpvotes(updatedBlog.upvotes);
    } catch (error) {
      console.error("Error upvoting the blog:", error);
      setUpvotes((prev) => prev - 1); // Revert optimistic update on failure
      setHasUpvoted(false); // Revert upvote status
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Blog not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-auto object-cover rounded-lg mb-6"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        <strong>Author:</strong> {blog.author}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        <strong>Views:</strong> {views}
      </p>
      <div
        className="text-lg text-gray-800 mb-6"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleUpvote}
          disabled={hasUpvoted}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            hasUpvoted
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-acm-blue text-white hover:bg-acm-dark-blue"
          }`}
        >
          {hasUpvoted ? "Upvoted" : "Upvote"}
        </button>
        <span className="text-lg text-gray-700 font-bold">Upvotes: {upvotes}</span>
      </div>
      <p className="text-gray-600 mt-6">
        <strong>Created At:</strong> {new Date(blog.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
