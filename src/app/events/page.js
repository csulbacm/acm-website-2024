"use client"; // Marks this component as a client-side component

import { motion } from 'framer-motion'; // Import motion
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Fetch the events data from the API
  useEffect(() => {
    setIsClient(true);

    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <motion.section
        className="bg-blue-700 text-white py-12 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold">Upcoming Events</h1>
        <p className="text-xl mt-4">Explore our upcoming workshops, hackathons, and networking events!</p>
      </motion.section>

      {/* Event List */}
      <motion.section
        className="container mx-auto py-16 px-6 md:px-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }} // Delay based on index for staggered animation
            >
              <h2 className="text-2xl font-bold text-blue-700">{event.title}</h2>
              <p className="mt-2 text-gray-700">{event.date} {event.time}</p>
              <p className="mt-4 text-gray-600">{event.description}</p>
              <Link href={event.link} className="mt-4 inline-block text-blue-600 font-bold">Learn More →</Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="bg-blue-700 text-white py-12 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold">Stay Updated on Future Events</h2>
        <p className="text-xl mt-4">
          Join our mailing list to get the latest updates on upcoming workshops, hackathons, and networking events.
        </p>
        <motion.button
            className="mt-8 inline-block bg-white text-blue-700 px-8 py-4 rounded-lg font-bold"
            whileHover={{ scale: 1.05 }}  // Scale up slightly on hover
            whileTap={{ scale: 0.95 }}    // Scale down slightly on tap
            transition={{ duration: 0.2 }} // Animation duration
          >
        <Link href="/subscribe">
          Subscribe Now
        </Link>
        </motion.button>
      </motion.section>
    </div>
  );
}
