"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Sponsors() {
  const sponsors = [
    // Template for sponsors:
    // {
    //   name: 'Sponsor 1',
    //   logo: '/images/sponsor1.png',
    //   link: 'https://www.sponsor1.com',
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative area">
        <ul className="circles">
          {Array(10).fill().map((_, i) => <li key={i} />)}
        </ul>
        <motion.section
          className="relative z-10 text-white py-20 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto">
            <h1 className="text-5xl font-extrabold">Our Sponsors</h1>
            <p className="text-xl mt-4">We are grateful for the support of our sponsors!</p>
          </div>
        </motion.section>
      </div>

      <motion.section
        className="container mx-auto py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-black text-center mb-10">
          Thank You to Our Sponsors!
        </h2>

        {sponsors.length === 0 ? (
          // CTA when no sponsors exist
          <motion.div
            className="bg-white p-10 shadow-lg rounded-lg text-center max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg mb-6 text-black">
              We’re actively seeking partners to support ACM at CSULB! 
              If your organization is interested in sponsoring our events, workshops, and hackathons,
              please get in touch.
            </p>
            <Link href="/contact" passHref>
              <motion.button
                className="mt-8 inline-block bg-acm-blue text-white px-8 py-4 rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}  // Scale up slightly on hover
                whileTap={{ scale: 0.95 }}    // Scale down slightly on tap
                transition={{ duration: 0.2 }} // Animation duration
              >
                Become a Sponsor
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          // Render sponsor logos
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 shadow-lg rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={sponsor.link} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={320}
                    height={80}
                    className="mx-auto object-contain"
                  />
                  <h3 className="text-xl font-semibold mt-4">{sponsor.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
