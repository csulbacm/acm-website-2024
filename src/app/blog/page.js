"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { RotatingLines } from "react-loader-spinner"; // Import the RotatingLines loader

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
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true); // Start loading
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
      } finally {
        setLoading(false); // End loading
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
      <div className="container mx-auto py-4 pt-8 flex flex-wrap justify-center space-x-4">
      <motion.button
        whileHover={{ scale: 1.05 }} // Scale up slightly on hover
        whileTap={{ scale: 0.95 }}   // Scale down slightly on tap
        transition={{ duration: 0.2 }} // Animation duration
        className={`px-4 py-2 rounded-lg font-bold ${
          sortBy === "recent" ? "bg-acm-blue text-white" : "bg-gray-400 text-white"
        }`}
        onClick={() => setSortBy("recent")}
      >
        Recent
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`px-4 py-2 rounded-lg font-bold ${
          sortBy === "popular" ? "bg-acm-blue text-white" : "bg-gray-400 text-white"
        }`}
        onClick={() => setSortBy("popular")}
      >
        Popular
      </motion.button>
      </div>

      {/* Blog List */}
      <motion.section
        className="container mx-auto pb-16 px-6 md:px-0 grid gap-8 md:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <div className="flex justify-center items-center col-span-full h-80">
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
        ) : (
          blogs.map((blog) => (
            <motion.div
              key={blog._id}
              className="bg-white p-6 rounded-lg shadow-lg text-black hover:shadow-xl transition-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
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
                <motion.div
                  whileHover={{ scale: 1.05 }} // Scale up slightly on hover
                  whileTap={{ scale: 0.95 }}   // Scale down slightly on tap
                  transition={{ duration: 0.2 }} // Animation duration
                >
                  <Link
                    href={`/blog/${blog._id}`}
                    className="text-white bg-acm-blue px-4 py-2 rounded-lg font-bold"
                  >
                    Read More
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))
        )}
      </motion.section>

      {/* Pagination */}
      {!loading && (
        <div className="container mx-auto flex justify-center space-x-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-bold mb-8 ${
                page === i + 1 ? "bg-acm-blue text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
