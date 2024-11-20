"use client";

import { useEffect, useState } from "react";

export default function BlogDetails({ params }) {
  const { blogId } = params; // Destructure blogId from params
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${blogId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }
        const data = await response.json();
        setBlog(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setLoading(false);
      }
    };

    if (blogId) fetchBlog();
  }, [blogId]);

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
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        <strong>Author:</strong> {blog.author}
      </p>
      <div
        className="text-lg text-gray-800 mb-4"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-auto object-cover rounded-lg mb-4"
        />
      )}
      <p className="text-gray-600">
        <strong>Created At:</strong>{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
