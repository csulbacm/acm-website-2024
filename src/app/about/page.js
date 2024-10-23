"use client"; // Marks this component as a client-side component

import { motion } from 'framer-motion'; // Import motion from framer-motion
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome for icons
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'; // Import LinkedIn and GitHub icons
import { faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons'; // Import Envelope and Website icons
import { officers } from './officers'; // Import officers list

export default function About() {
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
        animate={{ opacity: 1 }}
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
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto text-center bg-white">
          <h2 className="text-3xl font-bold text-black">Meet Our Officers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-gray-900 text-xl">
            {officers.map((officer, index) => (
              <div key={index} className="our-team border-solid border-2 border-black shadow-lg">
                <div className="picture">
                  <img className="img-fluid" src={officer.image} alt={officer.name} />
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
        </div>
      </motion.section>
    </div>
  );
}
