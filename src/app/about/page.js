"use client";

import { useState, useEffect } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';

export default function About() {
  const [officers, setOfficers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        // Fetch from the correct endpoint to get all officers
        const response = await fetch('/api/about/officers');
        if (!response.ok) throw new Error('Failed to fetch officers data');

        const data = await response.json();

        if (Array.isArray(data)) {
          // Already sorted by API, but ensure stable order client-side
          const sorted = [...data].sort((a,b)=>{
            const ao = a.order ?? Number.MAX_SAFE_INTEGER;
            const bo = b.order ?? Number.MAX_SAFE_INTEGER;
            if (ao !== bo) return ao - bo;
            return (a.name||'').localeCompare(b.name||'') || (a.email||'').localeCompare(b.email||'');
          });
          setOfficers(sorted);
          setIsLoaded(true); // Set loaded state to true after data is fetched
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (error) {
        console.error('Error fetching officers:', error);
        setError(error.message);
      }
    };

    fetchOfficers();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* About Header with Animated Background */}
      <div className="relative area"> {/* Wrapper for animated background */}
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
          className="relative z-10 text-white py-20 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto">
            <h1 className="text-5xl font-extrabold">About ACM at CSULB</h1>
            <p className="text-xl mt-4 max-w-3xl mx-auto">
              ACM at CSULB is dedicated to advancing computing as a science and profession. We organize regular events, workshops, and hackathons to foster learning, collaboration, and innovation among our members.
            </p>
          </div>
        </motion.section>
      </div>

      {/* Our Mission Section */}
      <motion.section
        className="container mx-auto py-12 text-center text-black"
        initial={{ opacity: 0 }}
        animate={{opacity: 1}}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="text-lg mt-4 max-w-2xl mx-auto mb-4">
          Our mission is to empower students with knowledge, resources, and opportunities to thrive in the field of computing. We aim to build a bridge between students and industry professionals by hosting workshops, networking events, and technical challenges.
        </p>
      </motion.section>

      {/* Officers Section */}
      <motion.section
        className="our-team-section py-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black">Meet Our Officers</h2>
          {error && (
            <p className="text-red-600 mt-4">{error}</p>
          )}
          {!isLoaded && !error && (
            <div className="flex justify-center mt-6">
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
          )}
          {isLoaded && officers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-gray-900 text-xl">
              {officers.map((officer, index) => (
                <div key={officer._id || index} className="our-team border-solid border-2 border-black shadow-lg">
                  <div className="picture relative w-full h-64">
                    <Image
                      src={officer.image || '/images/default-profile.jpg'}
                      alt={officer.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                  <div className="team-content">
                    <h3 className="name">{officer.name}</h3>
                    <h4 className="title">{officer.title}</h4>
                  </div>
                  <ul className="social flex justify-center mt-4 space-x-4">
                    {officer.linkedin && (
                      <li>
                        <a href={officer.linkedin} target="_blank" className="text-blue-600 hover:text-blue-800">
                          <FontAwesomeIcon icon={faLinkedin} size="lg" />
                        </a>
                      </li>
                    )}
                    {officer.email && (
                      <li>
                        <a href={`mailto:${officer.email}`} className="text-blue-600 hover:text-blue-800">
                          <FontAwesomeIcon icon={faEnvelope} size="lg" />
                        </a>
                      </li>
                    )}
                    {officer.github && (
                      <li>
                        <a href={officer.github} target="_blank" className="text-blue-600 hover:text-blue-800">
                          <FontAwesomeIcon icon={faGithub} size="lg" />
                        </a>
                      </li>
                    )}
                    {officer.website && (
                      <li>
                        <a href={officer.website} target="_blank" className="text-blue-600 hover:text-blue-800">
                          <FontAwesomeIcon icon={faGlobe} size="lg" />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {isLoaded && !error && officers.length === 0 && (
            <p className="mt-6 text-gray-600">No officers found.</p>
          )}
        </div>
      </motion.section>
    </div>
  );
}
