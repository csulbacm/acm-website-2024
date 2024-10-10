"use client"; // Marks this component as a client-side component

import Link from 'next/link';
import { motion } from 'framer-motion'; // Import motion from framer-motion

export default function Sponsors() {
  const sponsors = [
    {
      name: 'Sponsor 1',
      logo: '/images/sponsor1.png', // Replace with your actual image path
      link: 'https://www.sponsor1.com', // Replace with your sponsor's link
    },
    {
      name: 'Sponsor 2',
      logo: '/images/sponsor2.png',
      link: 'https://www.sponsor2.com',
    },
    {
      name: 'Sponsor 3',
      logo: '/images/sponsor3.png',
      link: 'https://www.sponsor3.com',
    },
    // Add more sponsors as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="bg-blue-700 text-white py-20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-extrabold">Our Sponsors</h1>
          <p className="text-xl mt-4">We are grateful for the support of our sponsors!</p>
        </div>
      </motion.section>

      {/* Sponsors Section */}
      <motion.section
        className="container mx-auto py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">Thank You to Our Sponsors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 shadow-lg rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }} // Delay for staggered effect
            >
              <Link href={sponsor.link} target="_blank" rel="noopener noreferrer">
                <img src={sponsor.logo} alt={sponsor.name} className="mx-auto h-20 object-contain" />
                <h3 className="text-xl font-semibold mt-4">{sponsor.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
