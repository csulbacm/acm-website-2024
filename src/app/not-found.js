// app/not-found.js
"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-center">
      <motion.h1
        className="text-6xl font-bold text-acm-blue mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>
      <motion.p
        className="text-xl text-gray-700 mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Oops! The page you're looking for doesn't exist.
      </motion.p>
      <Link href="/" passHref>
        <motion.button
          className="bg-acm-blue text-white px-6 py-3 rounded-lg font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go Back Home
        </motion.button>
      </Link>
    </div>
  );
}
