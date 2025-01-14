"use client";

import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import 'react-quill/dist/quill.snow.css';

export default function BlogDetails({ params }) {
  const { blogId } = params; // Destructure blogId from params
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0); // Track views locally
  const [upvotes, setUpvotes] = useState(0); // Track upvotes
  const [hasUpvoted, setHasUpvoted] = useState(false); // Track if the user has upvoted

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true); // Start loading
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

        // Increment views
        const viewResponse = await fetch(`/api/blog/${blogId}/view`, { method: "POST" });
        if (viewResponse.ok) {
          setViews((prev) => prev + 1); // Optimistically update views locally
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    if (blogId) fetchBlog();
  }, [blogId]);

  const handleUpvote = async () => {
    try {
      if (hasUpvoted) {
        alert("You have already upvoted this blog!");
        return;
      }
  
      // Optimistically update the UI
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
  
      const response = await fetch(`/api/blog/${blogId}/upvote`, {
        method: "POST",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upvote");
      }
  
      // If backend updates are successful, no need to adjust since UI already reflects the change
    } catch (error) {
      console.error("Error upvoting the blog:", error.message);
  
      // Revert UI update only if an error occurs
      setUpvotes((prev) => Math.max(prev - 1, 0)); // Ensure it doesn't go below zero
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
      {/* Hero Section */}
      <div
        className="relative w-full h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${blog.image || "/default-bg.jpg"})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="relative text-white text-5xl font-bold text-center px-4">
          {blog.title}
        </h1>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
        <p className="text-gray-500 text-sm mb-4">
          <strong>Author:</strong> {blog.author} | <strong>Views:</strong> {views} |{" "}
          <strong>Published:</strong> {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <div
          className="text-lg text-gray-800 leading-relaxed mb-6 ql-editor"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>

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

        {/* Back to Blog Page Button */}
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
