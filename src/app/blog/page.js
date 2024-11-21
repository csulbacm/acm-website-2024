"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

function stripHtml(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`/api/blog?page=${page}&sort=${sortBy}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [page, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="relative area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <motion.section
          className="relative z-10 text-white py-20 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto">
            <h1 className="text-5xl font-extrabold">Blog Posts</h1>
            <p className="text-xl mt-4">Read our latest posts and stay informed!</p>
          </div>
        </motion.section>
      </div>

      {/* Sort and Navigation */}
      <div className="container mx-auto py-4 pt-8 flex flex-wrap justify-center space-x-4 space-y-4 md:space-y-0">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-bold ${
              sortBy === "recent" ? "bg-acm-blue text-white" : "bg-gray-200"
            }`}
            onClick={() => setSortBy("recent")}
          >
            Recent
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold ${
              sortBy === "popular" ? "bg-acm-blue text-white" : "bg-gray-200"
            }`}
            onClick={() => setSortBy("popular")}
          >
            Popular
          </button>
        </div>
      </div>

      {/* Blog List */}
      <motion.section
        className="container mx-auto pb-16 px-6 md:px-0 grid gap-8 md:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white p-6 rounded-lg shadow-lg text-black hover:shadow-xl transition-shadow"
          >
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
            <p className="text-gray-700 mb-4">
              {stripHtml(blog.content).slice(0, 100)}...
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Author:</strong> {blog.author}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Views:</strong> {blog.views}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-acm-blue font-bold">
                Upvotes: {blog.upvotes}
              </span>
              <Link
                href={`/blog/${blog._id}`}
                className="text-white bg-acm-blue px-4 py-2 rounded-lg font-bold"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </motion.section>

      {/* Pagination */}
      <div className="container mx-auto flex justify-center space-x-2 mt-8">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-lg font-bold ${
              page === i + 1 ? "bg-acm-blue text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
