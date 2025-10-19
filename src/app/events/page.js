"use client";

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import Image from 'next/image';
import Head from 'next/head';
import { absoluteUrl } from '../../lib/seo';

const localizer = momentLocalizer(moment);

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  // subscription form state
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('');

  const fetcher = (url) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  });
  const { data: eventsData, error: eventsError, isLoading: eventsLoading } = useSWR('/api/events', fetcher, { revalidateOnFocus: true });
  useEffect(() => {
    if (eventsData) {
      const formatted = eventsData.map(evt => ({
        ...evt,
        start: new Date(evt.startDate),
        end: new Date(evt.endDate),
        allDay: evt.allDay || false,
        eventLocation: evt.eventLocation || 'CSULB',
      }));
      setEvents(formatted);
    }
    if (eventsError) console.error('Error fetching events:', eventsError);
  }, [eventsData, eventsError]);

  const filteredEvents = (events || []).filter((e)=>{
    const q = (search || '').toLowerCase();
    if (!q) return true;
    return (
      (e.title || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q) ||
      (e.eventLocation || '').toLowerCase().includes(q)
    );
  });

  const handleEventClick = event => {
    if (!modalIsOpen) {
      setSelectedEvent(event);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') Modal.setAppElement('#__next');
  }, []);

  const goToNext = () => {
    const unit =
      currentView === Views.MONTH || currentView === Views.AGENDA
        ? 'month'
        : currentView === Views.WEEK
        ? 'week'
        : 'day';
    setDate(prev => moment(prev).add(1, unit).toDate());
  };

  const goToBack = () => {
    const unit =
      currentView === Views.MONTH || currentView === Views.AGENDA
        ? 'month'
        : currentView === Views.WEEK
        ? 'week'
        : 'day';
    setDate(prev => moment(prev).subtract(1, unit).toDate());
  };

  const goToToday = () => setDate(new Date());

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // grab the form element
    const form = e.target;
    
    // if HTML5 validity fails, show the browser errors and bail
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    // at this point email is non-empty and valid
    setSubStatus('...');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('subscribe failed');
      setSubStatus('Subscribed! ✅');
      setEmail('');
    } catch {
      setSubStatus('Subscription failed. Try again.');
    }
    setTimeout(() => setSubStatus(''), 4000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
  <link rel="canonical" href={absoluteUrl('/events')} />
        {events && events.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'ACM at CSULB Events',
                itemListElement: events.slice(0, 50).map((e, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  item: {
                    '@type': 'Event',
                    name: e.title,
                    description: e.description,
                    startDate: e.start && new Date(e.start).toISOString(),
                    endDate: e.end && new Date(e.end).toISOString(),
                    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                    eventStatus: 'https://schema.org/EventScheduled',
                    image: e.image ? absoluteUrl(e.image) : absoluteUrl('/images/acm-csulb.png'),
                    location: e.eventLocation
                      ? { '@type': 'Place', name: e.eventLocation, address: e.eventLocation }
                      : undefined,
                    organizer: { '@type': 'Organization', name: 'ACM at CSULB', url: absoluteUrl('/events') },
                  },
                })),
              }),
            }}
          />
        )}
      </Head>
      {/* Header */}
      <div className="relative area">
        <ul className="circles">{Array(10).fill().map((_, i) => <li key={i} />)}</ul>
        <motion.section
          className="relative z-10 text-white py-20 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto">
            <h1 className="text-5xl font-extrabold">Upcoming Events</h1>
            <p className="text-xl mt-4">
              Explore our upcoming workshops, hackathons, and networking events!
            </p>
          </div>
        </motion.section>
      </div>

      {/* Navigation */}
      <div className="container mx-auto py-4 pt-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-nowrap justify-center md:justify-start space-x-4">
          <motion.button
            onClick={goToBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-acm-blue text-white px-4 py-2 rounded-lg font-bold"
          >Back</motion.button>
          <motion.button
            onClick={goToToday}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-acm-blue text-white px-4 py-2 rounded-lg font-bold"
          >Today</motion.button>
          <motion.button
            onClick={goToNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-acm-blue text-white px-4 py-2 rounded-lg font-bold"
          >Next</motion.button>
        </div>
        <div className="text-center">
          <span className="block text-black font-bold text-2xl md:text-3xl lg:text-5xl">
            {moment(date).format('MMMM YYYY')}
          </span>
        </div>
        <div className="flex flex-nowrap justify-center md:justify-end space-x-4">
          {[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA].map(view => (
            <motion.button
              key={view}
              onClick={() => setCurrentView(view)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-acm-blue text-white px-4 py-2 rounded-lg font-bold"
            >{view.charAt(0).toUpperCase() + view.slice(1).toLowerCase()}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="container mx-auto px-6 md:px-0 mb-6">
        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search events..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-acm-blue text-gray-700"
        />
      </div>

      {/* Calendar */}
      <motion.section
        className="container mx-auto pb-16 px-6 md:px-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SimpleBar forceVisible="x" autoHide={false} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="min-w-[1200px]">
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              className="rounded-lg shadow-lg text-gray-800 mt-4"
              onSelectEvent={handleEventClick}
              view={currentView}
              onView={setCurrentView}
              date={date}
              onNavigate={setDate}
              views={['month','week','day','agenda']}
              toolbar={false}
              popup
            />
          </div>
        </SimpleBar>
      </motion.section>

      {/* subscription form */}
      <section className="container mx-auto py-8 px-6 md:px-0">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
          {/* Logo (optional) */}
          <div className="hidden sm:block flex-shrink-0">
            <Image
              src="/images/acm-csulb.png"
              alt="ACM Logo"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
              priority={false}
            />
          </div>

          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold mb-2 text-black">Get Event Updates</h2>
            <p className="text-gray-700 mb-4">
              Stay in the loop—never miss a workshop, hackathon, or meetup!
            </p>

            <form 
              onSubmit={handleSubscribe} 
              className="flex flex-col sm:flex-row items-center gap-4" 
              noValidate
            >
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-acm-blue text-gray-700"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-acm-blue transition px-6 py-2 rounded-lg font-bold text-white whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>

            {subStatus && (
              <p className="mt-3 text-sm text-green-600">{subStatus}</p>
            )}
          </div>
        </div>
      </section>


      {/* Modal */}
      {selectedEvent && modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Event Details"
          className="fixed inset-0 z-50 flex items-center justify-center text-black"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <motion.div
            className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {selectedEvent.image && (
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover rounded-md"
                />
              </div>
            )}
            <h2 className="text-3xl font-bold mb-4 text-center">{selectedEvent.title}</h2>
            <div className="text-gray-700 mb-4 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedEvent.description || 'No description provided.' }} />
            <p className="text-gray-800 mb-4 text-center">
              <strong>Start Date:</strong> {moment(selectedEvent.start).format("MMMM Do, YYYY [at] h:mm A")}<br/>
              {moment(selectedEvent.end).isSame(selectedEvent.start, 'day') ? (
                <> <strong>Time:</strong> {moment(selectedEvent.start).format('h:mm A')} - {moment(selectedEvent.end).format('h:mm A')} </>
              ) : (
                <> <strong>End Date:</strong> {moment(selectedEvent.end).format("MMMM Do, YYYY [at] h:mm A")} </>
              )}<br/>
              <strong>Location:</strong> {selectedEvent.eventLocation || 'No location provided.'}
            </p>
            <div className="flex justify-center mt-6 space-x-4">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedEvent.title)}&dates=${moment.tz(selectedEvent.start,'America/Los_Angeles').utc().format('YYYYMMDDTHHmmss[Z]')}/${moment.tz(selectedEvent.end,'America/Los_Angeles').utc().format('YYYYMMDDTHHmmss[Z]')}&details=${encodeURIComponent(selectedEvent.description || 'Event details not provided.')}&location=${encodeURIComponent(selectedEvent.eventLocation||'CSULB')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
              >Add to Google Calendar</a>
              <button onClick={closeModal} className="bg-gray-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition">Close</button>
            </div>
          </motion.div>
        </Modal>
      )}
    </div>
  );
}
