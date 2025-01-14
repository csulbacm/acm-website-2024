"use client"; // Marks this component as a client-side component

import { motion } from 'framer-motion'; // Import motion
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaNetworkWired, FaLaptopCode, FaLightbulb } from 'react-icons/fa';
import Modal from 'react-modal';

const localizer = momentLocalizer(moment);

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          allDay: event.allDay || false,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const currentWeekEvents = events.filter((event) => {
    const now = moment();
    const startOfWeek = now.clone().startOf('week');
    const endOfWeek = now.clone().endOf('week');
    return moment(event.start).isBetween(startOfWeek, endOfWeek, null, '[]');
  });

  const handleEventClick = (event) => {
    if (!modalIsOpen) {
      setSelectedEvent(event);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const scrollToSection = () => {
    const section = document.getElementById('why-join');
    section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
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
              CSULB's largest student organization for computer science.
            </p>
            <Link href="/events" passHref>
              <motion.button
                className="mt-8 inline-block bg-white text-acm-blue px-8 py-4 rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}  // Scale up slightly on hover
                whileTap={{ scale: 0.95 }}    // Scale down slightly on tap
                transition={{ duration: 0.2 }} // Animation duration
              >
                View Upcoming Events
              </motion.button>
            </Link>
          </div>

          {/* Scroll Down Icon */}
          <div className="absolute bottom-52 w-full flex justify-center">
            <button onClick={scrollToSection} className="animate-bounce text-white text-5xl">
              ⌄ {/* Downward arrow */}
            </button>
          </div>
        </motion.section>
      </div>

     {/* Key Features Section - Using a Carousel */}
     <motion.section
        id="why-join"
        className="container mx-auto text-center py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-black text-start mb-12">Why Join ACM?</h2>
        
        <div className="max-w-3xl mx-auto"> {/* Limit the width */}
          <Slider {...settings}>
            {/* Networking Feature */}
            <motion.div
              className="bg-white p-8 border-solid border-2 border-black rounded-lg min-h-[300px] flex flex-col justify-center items-center text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <FaNetworkWired className="text-acm-blue text-6xl mb-6" />
                <h3 className="text-2xl font-semibold text-acm-blue mb-4">Networking</h3>
              </div>
              <p className="text-gray-700 mx-10">
                At ACM, we provide you with invaluable networking opportunities. Connect with students, alumni, and industry professionals through our events and partnerships.
              </p>
            </motion.div>

            {/* Workshops Feature */}
            <motion.div
              className="bg-white p-8 border-solid border-2 border-black rounded-lg min-h-[300px] flex flex-col justify-center items-center text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <FaLaptopCode className="text-acm-blue text-6xl mb-6" />
                <h3 className="text-2xl font-semibold text-acm-blue mb-4">Workshops</h3>
              </div>
              <p className="text-gray-700 mx-10">
                Our hands-on workshops are designed to help you expand your technical skills in areas such as programming, web development, AI, cybersecurity, and more.
              </p>
            </motion.div>

            {/* Hackathons Feature */}
            <motion.div
              className="bg-white p-8 border-solid border-2 border-black rounded-lg min-h-[300px] flex flex-col justify-center items-center text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <FaLightbulb className="text-acm-blue text-6xl mb-6" />
                <h3 className="text-2xl font-semibold text-acm-blue mb-4">Hackathons</h3>
              </div>
              <p className="text-gray-700 mx-10">
                ACM hosts exciting hackathons where students come together to solve real-world problems, build innovative projects, and showcase their technical prowess.
              </p>
            </motion.div>
          </Slider>
        </div>
      </motion.section>

      {/* Recent Events Section */}
      <motion.section
        className="bg-gray-100 pt-20 bg-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black text-start mb-12">Upcoming Events</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Calendar
              localizer={localizer}
              events={currentWeekEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              className="rounded-lg shadow-lg mt-12 text-gray-900" // Updated text color for better readability
              view={Views.WEEK}
              onSelectEvent={handleEventClick}
              date={date}
              onNavigate={(newDate) => setDate(newDate)}
              views={['week']}
              toolbar={false}
              popup={true}
            />
          </div>
        </div>
      </motion.section>

      {/* Event Modal */}
      {selectedEvent && modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Event Details"
          className="modal-content fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-40"
          shouldCloseOnOverlayClick={true}
        >
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-64 object-cover rounded-md mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-acm-blue">{selectedEvent.title}</h2>
            <p className="text-gray-800 mb-4">{selectedEvent.description}</p>
            <p className="text-gray-800 mb-4">
              <strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do, YYYY')}<br />
              <strong>Time:</strong> {moment(selectedEvent.start).format('h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 inline-block bg-blue-700 text-white px-6 py-2 rounded-lg font-bold"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Call to Action Section */}
      <motion.section
        className="bg-white text-black py-20"
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
              className="mt-8 inline-block bg-acm-blue text-white px-8 py-4 rounded-lg font-bold"
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
