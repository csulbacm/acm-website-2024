"use client";

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Modal from 'react-modal';

const localizer = momentLocalizer(moment);

export default function Events() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState(Views.MONTH);
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

  // Ensure that the app element is set properly for react-modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('#__next');
    }
  }, []);

  const goToNext = () => {
    const newDate = moment(date).add(1, currentView === Views.MONTH || currentView === Views.AGENDA ? 'month' : currentView === Views.WEEK ? 'week' : 'day').toDate();
    setDate(newDate);
  };

  const goToBack = () => {
    const newDate = moment(date).subtract(1, currentView === Views.MONTH || currentView === Views.AGENDA ? 'month' : currentView === Views.WEEK ? 'week' : 'day').toDate();
    setDate(newDate);
  };

  const goToToday = () => {
    setDate(new Date());
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header with Animated Background */}
      <div className="relative area">
        <ul className="circles">
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
            <h1 className="text-5xl font-extrabold">Upcoming Events</h1>
            <p className="text-xl mt-4">Explore our upcoming workshops, hackathons, and networking events!</p>
          </div>
        </motion.section>
      </div>

      {/* Custom Toolbar */}
      <div className="container mx-auto py-4 pt-8 flex justify-center space-x-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold" onClick={goToBack}>Back</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold" onClick={goToToday}>Today</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold" onClick={goToNext}>Next</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold" onClick={() => setCurrentView(Views.MONTH)}>Month</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold" onClick={() => setCurrentView(Views.WEEK)}>Week</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold" onClick={() => setCurrentView(Views.DAY)}>Day</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold" onClick={() => setCurrentView(Views.AGENDA)}>Agenda</button>
      </div>

      {/* Calendar Section */}
      <motion.section
        className="container mx-auto pb-16 px-6 md:px-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
        <span className="text-black font-bold text-5xl">{moment(date).format('MMMM YYYY')}</span>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            className="rounded-lg shadow-lg text-gray-800"
            onSelectEvent={handleEventClick}
            view={currentView}
            onView={(view) => setCurrentView(view)}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            views={['month', 'week', 'day', 'agenda']}
            toolbar={false}
            popup={true}
          />
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
            <h2 className="text-3xl font-bold mb-4 text-blue-700">{selectedEvent.title}</h2>
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

      {/* Call to Action */}
      <motion.section
        className="bg-white text-black py-12 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold">Stay Updated on Future Events</h2>
        <p className="text-xl mt-4">
          Join our mailing list to get the latest updates on upcoming workshops, hackathons, and networking events.
        </p>
        <Link href="/subscribe" passHref>
          <motion.button
            className="mt-8 inline-block bg-acm-blue text-white px-8 py-4 rounded-lg font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Subscribe Now
          </motion.button>
        </Link>
      </motion.section>
    </div>
  );
}
