"use client";

import { motion } from 'framer-motion'; // Import motion from framer-motion
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faInstagram, faXTwitter as faX } from '@fortawesome/free-brands-svg-icons'; // Import required icons
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <motion.section
        className="bg-blue-700 text-white py-12 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold">Contact Us</h1>
        <p className="text-xl mt-4">
          We'd love to hear from you! Feel free to reach out with any questions or inquiries.
        </p>
      </motion.section>

      {/* Contact Form and Additional Contact Info */}
      <motion.section
        className="container mx-auto py-16 px-6 md:px-0 flex flex-col md:flex-row gap-12" // Added flex properties
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Contact Form */}
        <div className="bg-white p-8 shadow-lg rounded-lg flex-1"> {/* Added flex-1 for equal width */}
          <h2 className="text-3xl font-bold text-blue-700 mb-6">Send Us a Message</h2>
          <form action="#" method="POST" className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-semibold">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700"
              ></textarea>
            </div>
            <div>
              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                whileHover={{ scale: 1.05 }} // Scale up on hover
                whileTap={{ scale: 0.95 }} // Scale down on tap
              >
                Send Message
              </motion.button>
            </div>
          </form>
        </div>

        {/* Additional Contact Info */}
        <div className="bg-white p-8 shadow-lg rounded-lg flex-1"> {/* Added flex-1 for equal width */}
          <h2 className="text-3xl font-bold text-blue-700">Other Ways to Reach Us</h2>
          <p className="text-lg mt-4 text-gray-700">
            You can also email us directly at <a href="mailto:acm@csulb.edu" className="text-blue-600">acm@csulb.edu</a> or follow us on our social media channels.
          </p>
          <div className="mt-6 flex justify-center space-x-6">
            <a href="https://twitter.com/acmcsulb" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              <FontAwesomeIcon icon={faX} className="text-2xl" />
            </a>
            <a href="https://linkedin.com/company/acmcsulb" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              <FontAwesomeIcon icon={faLinkedin} className="text-2xl" />
            </a>
            <a href="https://instagram.com/acmcsulb" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
            </a>
            <a href="mailto:acm@csulb.edu" className="text-blue-600 hover:text-blue-800">
              <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />
            </a>
          </div>
        </div>
      </motion.section>

      {/* Map Section */}
      <motion.section
        className="container mx-auto py-12 px-6 md:px-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">Our Location</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1029.0109755573735!2d-118.11206393870413!3d33.783037438855615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDQ3JzAxLjMiTiAxMTjCsDA2JzQwLjQiVw!5e1!3m2!1sen!2sus!4v1728566345561!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="ACM Location"
            className="rounded-lg"
          ></iframe>
        </div>
      </motion.section>
    </div>
  );
}
