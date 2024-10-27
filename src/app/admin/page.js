"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EventForm() {
    const router = useRouter(); // Initialize router
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [image, setImage] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch('/api/auth/verify');
          if (!response.ok) throw new Error('Not authenticated');
        } catch (error) {
          router.push('/login'); // Redirect to login if not authenticated
        }
      };
  
      checkAuth();
      fetchEvents();
    }, [router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = { title, description, startDate, endDate, allDay, image };
  
    try {
      const method = editingEvent ? 'PUT' : 'POST';
      const url = editingEvent ? `/api/events/${editingEvent._id}` : '/api/events';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
  
      if (!response.ok) throw new Error('Failed to save event');
      
      alert(editingEvent ? 'Event updated successfully!' : 'Event added successfully!');
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };
  

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setAllDay(false);
    setImage(null);
    setEditingEvent(null);
  };

  const handleSelectEvent = (id) => {
    setSelectedEvents(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDeleteSelected = async () => {
    if (selectedEvents.length === 0) return alert('No events selected for deletion');
  
    try {
      const response = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedEvents }),
      });
  
      if (!response.ok) throw new Error('Failed to delete events');
      
      alert('Selected events deleted successfully');
      setSelectedEvents([]);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting events:', error);
    }
  };
  

  const handleEditEvent = (event) => {
    setTitle(event.title);
    setDescription(event.description);
    setStartDate(event.startDate);
    setEndDate(event.endDate);
    setAllDay(event.allDay);
    setImage(event.image);
    setEditingEvent(event);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'GET' });
    router.push('/login'); // Redirect to login page
  };
  const handleRegister = async () => {
    router.push('/register'); // Redirect to login page
  };

return (
  <div className="container mx-auto p-6">
    <div className="flex justify-end mb-4">
    <button
    onClick={handleRegister}
    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
  >
    Register New User
  </button>
    <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
    >
        Logout
    </button>
    </div>
    <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-12 lg:space-y-0">
      {/* Event List Section */}
      <div className="lg:w-1/2 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Event List</h3>
        <table className="w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3 text-left">Select</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-b border-gray-200">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event._id)}
                    onChange={() => handleSelectEvent(event._id)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
                  />
                </td>
                <td className="p-3 text-gray-800 font-medium">{event.title}</td>
                <td className="p-3 text-gray-600">{new Date(event.startDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleDeleteSelected}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-md transition duration-200"
        >
          Delete Selected
        </button>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="lg:w-1/2 bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          {editingEvent ? 'Edit Event' : 'Add New Event'}
        </h2>

        {/* Form Fields */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-700">Title</label>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-lg font-semibold text-gray-700">Description</label>
          <textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-lg font-semibold text-gray-700">Start Date</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-lg font-semibold text-gray-700">End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-400 border-gray-300"
            />
            <span>All Day Event</span>
          </label>

          <label className="block text-lg font-semibold text-gray-700">Event Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-200"
          >
            {editingEvent ? 'Update Event' : 'Add Event'}
          </button>
          {editingEvent && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-md transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  </div>
);
}  
