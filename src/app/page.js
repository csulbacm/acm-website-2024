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

  const scrollToSection = () => {
    const section = document.getElementById('why-join');
    section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-indigo-500">
      {/* Hero Section with Background and Circles */}
      <div className="relative area h-screen"> {/* Set height to 100vh */}
        <ul className="circles"> {/* Floating circles */}
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
          className="relative z-10 text-white py-20 h-full flex flex-col justify-center pt-0" // Center content
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-extrabold">
              Welcome to ACM at CSULB
            </h1>
            <p className="text-2xl mt-4">
              Empowering tomorrow's innovators today
            </p>
            <Link href="/events" passHref>
              <motion.button
                className="mt-8 inline-block bg-white text-blue-700 px-8 py-4 rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}  // Scale up slightly on hover
                whileTap={{ scale: 0.95 }}    // Scale down slightly on tap
                transition={{ duration: 0.2 }} // Animation duration
              >
                View Upcoming Events
              </motion.button>
            </Link>
          </div>

          {/* Scroll Down Icon */}
          <div className="absolute bottom-64 w-full flex justify-center">
            <button onClick={scrollToSection} className="animate-bounce text-white text-5xl">
              ⌄ {/* Downward arrow */}
            </button>
          </div>
        </motion.section>
      </div>

      {/* Key Features Section */}
      <motion.section
        id="why-join"
        className="container mx-auto text-center py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white">Why Join ACM?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Networking Feature */}
          <motion.div
            className="bg-white p-6 shadow-lg rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-blue-700">Networking</h3>
            <p className="mt-4 text-gray-700">
              At ACM, we provide you with invaluable networking opportunities. Connect with students, alumni, and industry professionals through our events and partnerships.
            </p>
          </motion.div>

          {/* Workshops Feature */}
          <motion.div
            className="bg-white p-6 shadow-lg rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-blue-700">Workshops</h3>
            <p className="mt-4 text-gray-700">
              Our hands-on workshops are designed to help you expand your technical skills in areas such as programming, web development, AI, cybersecurity, and more.
            </p>
          </motion.div>

          {/* Hackathons Feature */}
          <motion.div
            className="bg-white p-6 shadow-lg rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-blue-700">Hackathons</h3>
            <p className="mt-4 text-gray-700">
              ACM hosts exciting hackathons where students come together to solve real-world problems, build innovative projects, and showcase their technical prowess.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Recent Events Section */}
      <motion.section
        className="bg-gray-100 py-20 bg-indigo-400"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Recent Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {events.slice(0, 3).map((event) => (
              <motion.div
                key={event.id}
                className="bg-white p-6 shadow-lg rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-semibold text-blue-700">{event.title}</h3>
                <p className="mt-4 text-gray-700">{event.description}</p>
                <Link href={event.link} className="text-blue-600 mt-4 inline-block">
                  Learn More →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        className="bg-indigo-300 text-white py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">Get Involved</h2>
          <p className="text-xl mt-4">
            Ready to become a part of ACM at CSULB? Start your journey today!
          </p>
          <Link href="/contact" passHref>
            <motion.button
              className="mt-8 inline-block bg-white text-blue-700 px-8 py-4 rounded-lg font-bold"
              whileHover={{ scale: 1.05 }}  // Scale up slightly on hover
              whileTap={{ scale: 0.95 }}    // Scale down slightly on tap
              transition={{ duration: 0.2 }} // Animation duration
            >
              Contact Us
            </motion.button>
          </Link>

        </div>
      </motion.section>
    </div>
  );
}
