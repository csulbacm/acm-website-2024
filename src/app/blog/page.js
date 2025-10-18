"use client";

import { useState, useEffect } from "react";
import useSWR from 'swr';
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
  const [search, setSearch] = useState("");

  const fetcher = (url) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  });
  const { data, error: swrError, isLoading } = useSWR(`/api/blog?page=${page}&sort=${sortBy}`, fetcher, { revalidateOnFocus: true });
  useEffect(() => {
    setLoading(isLoading);
    if (data) { setBlogs(data.blogs); setTotalPages(data.totalPages); }
    if (swrError) console.error('Error fetching blogs:', swrError);
  }, [data, isLoading, swrError]);

  const filteredBlogs = (blogs || []).filter((b) => {
    const q = (search || '').toLowerCase();
    if (!q) return true;
    return (
      (b.title || '').toLowerCase().includes(q) ||
      (b.author || '').toLowerCase().includes(q) ||
      (b.content || '').toLowerCase().includes(q)
    );
  });

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

      {/* Search */}
      <div className="container mx-auto px-6 md:px-0 mt-6">
        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search blogs..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-acm-blue text-gray-700"
        />
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
        className="container mx-auto pb-16 px-6 md:px-0 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
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
  filteredBlogs.map((blog) => (
        <motion.div
          key={blog._id}
          className="bg-white p-6 rounded-lg shadow-lg text-black hover:shadow-xl transition-shadow flex flex-col h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {blog.image && (
            <div className="w-full h-40 relative rounded-lg mb-4 overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority={false}
              />
            </div>
          )}
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
            <p className="text-gray-700 mb-4">
              {stripHtml(blog.content).slice(0, 100)}...
            </p>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-gray-500 mb-2">
              <strong>Author:</strong> {blog.author}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <strong>Views:</strong> {blog.views}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-acm-blue font-bold">Upvotes: {blog.upvotes}</span>
              <motion.div
                whileHover={{ scale: 1.05 }} // Scale up slightly on hover
                whileTap={{ scale: 0.95 }}   // Scale down slightly on tap
                transition={{ duration: 0.2 }} // Animation duration
              >
                <Link
                  href={`/blog/${encodeURIComponent(blog.slug || blog._id)}`}
                  className="text-white bg-acm-blue px-4 py-2 rounded-lg font-bold whitespace-nowrap"
                  style={{ fontSize: 'clamp(0.75rem, 1vw, 1rem)' }} // Adjust font size responsively
                >
                  Read More
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))
    )}
      </motion.section>

      {/* Pagination */}
  {!loading && !search && (
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
