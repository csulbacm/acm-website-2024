"use client"; // Marks this component as a client-side component

import { motion } from 'framer-motion'; // Import motion from framer-motion

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* About Header */}
      <motion.section
        className="bg-blue-700 text-white py-12 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold">About ACM at CSULB</h1>
        <p className="text-xl mt-4 max-w-3xl mx-auto">
          ACM at CSULB is dedicated to advancing computing as a science and profession. We organize regular events, workshops, and hackathons to foster learning, collaboration, and innovation among our members. Our goal is to create a community of students passionate about technology and computing.
        </p>
      </motion.section>

      {/* Our Mission Section */}
      <motion.section
        className="container mx-auto py-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-blue-700">Our Mission</h2>
        <p className="text-lg mt-4 max-w-2xl mx-auto text-gray-700">
          Our mission is to empower students with knowledge, resources, and opportunities to thrive in the field of computing. We aim to build a bridge between students and industry professionals by hosting workshops, networking events, and technical challenges.
        </p>
      </motion.section>

      {/* Members Section */}
      <motion.section
        className="bg-gray-100 py-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-700">Meet Our Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">

            {/* Member 1 */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-blue-700">John Doe</h3>
              <p className="mt-2 text-gray-600">President</p>
              <p className="mt-4 text-gray-700">John leads ACM at CSULB, organizing events and working closely with the community to foster growth and learning.</p>
            </motion.div>

            {/* Member 2 */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-blue-700">Jane Smith</h3>
              <p className="mt-2 text-gray-600">Vice President</p>
              <p className="mt-4 text-gray-700">Jane helps coordinate workshops and works with industry professionals to bring valuable resources to the club.</p>
            </motion.div>

            {/* Member 3 */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-blue-700">Alex Johnson</h3>
              <p className="mt-2 text-gray-600">Treasurer</p>
              <p className="mt-4 text-gray-700">Alex manages ACM’s finances and ensures the successful execution of events and activities.</p>
            </motion.div>

          </div>
        </div>
      </motion.section>
    </div>
  );
}
