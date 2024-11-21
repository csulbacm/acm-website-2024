"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faBlog } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('events'); // 'events' or 'profile'
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [image, setImage] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);

    const [name, setName] = useState('');
    const [titleProfile, setTitleProfile] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');
    const [website, setWebsite] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Blog-related state variables
    const [blogs, setBlogs] = useState([]);
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const [blogTitle, setBlogTitle] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [blogImage, setBlogImage] = useState(null);
    const [editingBlog, setEditingBlog] = useState(null);


    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch('/api/auth/verify');
          if (!response.ok) throw new Error('Not authenticated');
        } catch (error) {
          router.push('/login');
        }
      };
      const fetchBlogs = async () => {
        try {
          const response = await fetch('/api/blog');
          const data = await response.json();
          setBlogs(data.blogs);
        } catch (error) {
          console.error('Error fetching blogs:', error);
        }
      };
      checkAuth();
      fetchEvents();
      fetchBlogs();
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

    const handleTabClick = (tab) => setActiveTab(tab);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    };

    const handleProfileUpdate = async (e) => {
      e.preventDefault();
  
      // Build updatedProfile object with only non-empty fields
      const updatedProfile = {};
      if (name) updatedProfile.name = name;
      if (titleProfile) updatedProfile.title = titleProfile;
      if (linkedin) updatedProfile.linkedin = linkedin;
      if (github) updatedProfile.github = github;
      if (website) updatedProfile.website = website;
      if (profileImage) updatedProfile.image = profileImage;
  
      try {
          const response = await fetch('/api/admin/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedProfile),
          });
  
          if (!response.ok) throw new Error('Failed to update profile');
          alert('Profile updated successfully!');
      } catch (error) {
          console.error('Error updating profile:', error);
      }
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
      router.push('/login');
    };

    const handleRegister = async () => {
      router.push('/register');
    };

    const handleChangePassword = async (e) => {
      e.preventDefault();
      if (!newPassword) return alert("Please enter a new password.");
  
      try {
        const response = await fetch('/api/admin/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword }),
        });
  
        const result = await response.json();
        if (response.ok) {
          alert('Password updated successfully');
          setShowChangePasswordModal(false);
        } else {
          alert(result.error || 'Failed to update password');
        }
      } catch (error) {
        console.error('Error changing password:', error);
        alert('Error changing password');
      }
    };
    const handleSubmitBlog = async (e) => {
      e.preventDefault();
      const newBlog = { title: blogTitle, content: blogContent, image: blogImage };
  
      try {
        const method = editingBlog ? "PUT" : "POST";
        const url = editingBlog ? `/api/blog/${editingBlog._id}` : "/api/blog";
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBlog),
        });
  
        if (!response.ok) throw new Error("Failed to save blog");
  
        alert(editingBlog ? "Blog updated successfully!" : "Blog added successfully!");
        resetBlogForm();
        // Refresh blogs list
        const fetchResponse = await fetch("/api/blog");
        const data = await fetchResponse.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Error saving blog:", error);
      }
    };
    
    const resetBlogForm = () => {
      setBlogTitle('');
      setBlogContent('');
      setBlogImage(null);
      setEditingBlog(null);
    };
    const handleSelectBlog = (id) => {
      setSelectedBlogs((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    };
    
    const handleDeleteSelectedBlogs = async () => {
      if (selectedBlogs.length === 0) {
        alert("No blogs selected for deletion");
        return;
      }
  
      try {
        const response = await fetch("/api/blog", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedBlogs }),
        });
  
        if (!response.ok) {
          const result = await response.json();
          console.error("Error deleting blogs:", result.error);
          alert(result.error || "Failed to delete blogs");
          return;
        }
  
        alert("Selected blogs deleted successfully");
        setSelectedBlogs([]);
        // Refresh blogs list
        const fetchResponse = await fetch("/api/blog");
        const data = await fetchResponse.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Error deleting blogs:", error);
        alert("An unexpected error occurred while deleting blogs");
      }
    };
    
    const handleEditBlog = (blog) => {
      setBlogTitle(blog.title);
      setBlogContent(blog.content);
      setBlogImage(blog.image);
      setEditingBlog(blog);
    };
    
    

    return (
      <div className="container mx-auto p-6 text-gray-700">
      {/* Subnavbar with Extra Buttons */}
      <div className="flex flex-wrap justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-wrap space-x-4">
          <button
            onClick={() => handleTabClick('events')}
            className={`flex items-center px-4 py-2 rounded-md font-bold ${activeTab === 'events' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            Events
          </button>
          <button
            onClick={() => handleTabClick('profile')}
            className={`flex items-center px-4 py-2 rounded-md font-bold ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Profile
          </button>
          <button
            onClick={() => handleTabClick('blogs')}
            className={`flex items-center px-4 py-2 rounded-md font-bold ${
              activeTab === 'blogs' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <FontAwesomeIcon icon={faBlog} className="mr-2" />
            Blogs
          </button>
        </div>
        <div className="flex flex-wrap space-x-4">
          <button onClick={handleRegister} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md">
            Register New User
          </button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md">
            Logout
          </button>
          <button onClick={() => setShowChangePasswordModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
            Change Password
          </button>
        </div>
      </div>

        {/* Change Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h2>
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-700">Current Password</label>
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <label className="block text-lg font-semibold text-gray-700">New Password</label>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Conditional Rendering Based on Selected Tab */}
        {activeTab === 'events' ? (
          <EventsSection
            events={events}
            title={title}
            description={description}
            startDate={startDate}
            endDate={endDate}
            allDay={allDay}
            image={image}
            setTitle={setTitle}
            setDescription={setDescription}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setAllDay={setAllDay}
            setImage={setImage}
            handleSubmit={handleSubmit}
            handleEditEvent={handleEditEvent}
            handleDeleteSelected={handleDeleteSelected}
            handleSelectEvent={handleSelectEvent}
            selectedEvents={selectedEvents}
            resetForm={resetForm}
            editingEvent={editingEvent}
          />
        ) : activeTab === 'profile' ? (
          <ProfileSection
            name={name}
            titleProfile={titleProfile}
            linkedin={linkedin}
            github={github}
            website={website}
            profileImage={profileImage}
            setName={setName}
            setTitleProfile={setTitleProfile}
            setLinkedin={setLinkedin}
            setGithub={setGithub}
            setWebsite={setWebsite}
            setProfileImage={setProfileImage}
            handleProfileUpdate={handleProfileUpdate}
            handleImageChange={handleImageChange}
          />
        ) : (
          <BlogsSection
            blogs={blogs}
            blogTitle={blogTitle}
            blogContent={blogContent}
            blogImage={blogImage}
            setBlogTitle={setBlogTitle}
            setBlogContent={setBlogContent}
            setBlogImage={setBlogImage}
            handleSubmitBlog={handleSubmitBlog}
            handleEditBlog={handleEditBlog}
            handleDeleteSelectedBlogs={handleDeleteSelectedBlogs}
            handleSelectBlog={handleSelectBlog}
            selectedBlogs={selectedBlogs}
            resetBlogForm={resetBlogForm}
            editingBlog={editingBlog}
          />
        )}
      </div>
    );
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],       
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],          
    ['link', 'image', 'video'],
    [{ 'align': [] }],
  ]
};
const formats = [
  'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 
  'link', 'color', 'background', 'align', 'image', 'video'
];
// Events Section Component
const EventsSection = ({ events, title, description, startDate, endDate, allDay, image, setTitle, setDescription, setStartDate, setEndDate, setAllDay, setImage, handleSubmit, handleEditEvent, handleDeleteSelected, handleSelectEvent, selectedEvents, resetForm, editingEvent }) => (
  <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-center lg:items-start">
    {/* Event Form */}
    <div className="lg:w-1/2 bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Manage Events</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-lg font-semibold text-gray-700">Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          required 
        />

        {/* Rich Text Editor for Event Description */}
        <label className="block text-lg font-semibold text-gray-700">Event Description</label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          modules={modules}
          formats={formats}
          theme="snow"
          placeholder="Add event description..."
          className="mb-4 text-gray-800"
        />
        
        {/* Submit Button */}

        <label className="block text-lg font-semibold text-gray-700">Start Date</label>
        <input 
          type="datetime-local" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          required 
        />

        <label className="block text-lg font-semibold text-gray-700">End Date</label>
        <input 
          type="datetime-local" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          required 
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
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
          }} 
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
        />

        <div className="flex space-x-4">
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-200">
            {editingEvent ? 'Update Event' : 'Add Event'}
          </button>
          {editingEvent && (
            <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-md transition duration-200">
              Cancel
            </button>
          )}
        </div>
      </form>

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

{/* Live Event Preview */}
<div className="lg:w-1/2 flex flex-col justify-center items-center text-gray-900 text-xl mb-4 lg:mt-60">
  <h2 className="text-3xl font-bold text-gray-900 text-center">Live Event Preview</h2>
  <div className="border-solid border-2 border-black shadow-lg text-start p-8 rounded-lg" style={{ width: '500px', height: 'auto', wordBreak: 'break-word' }}>
    <div className="mt-4">
      {image && <img src={image} alt={title} className="w-full h-64 object-cover rounded-md mb-4" />}
      <h2 className="text-3xl font-bold mb-4 text-black">{title || 'Event Title'}</h2>
      <div
        className="text-gray-800 mb-4"
        dangerouslySetInnerHTML={{ __html: description || 'Event description will appear here.' }}
      ></div>

      <p className="text-gray-800 mb-4">
        <strong>Date:</strong> {startDate ? moment(startDate).format('MMMM Do, YYYY') : 'Select a date'}
        <br />
        <strong>Time:</strong> {allDay ? 'All Day' : `${moment(startDate).format('h:mm A')} - ${moment(endDate).format('h:mm A')}`}
      </p>
    </div>
  </div>
</div>

  </div>
);


const ProfileSection = ({
  name, titleProfile, linkedin, github, website, profileImage,
  setName, setTitleProfile, setLinkedin, setGithub, setWebsite,
  setProfileImage, handleProfileUpdate, handleImageChange
}) => (
  <div className="flex flex-col-reverse lg:flex-row lg:space-x-8">
    {/* Profile Form */}
    <div className="lg:w-1/2 bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Update Profile</h2>
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <label className="block text-lg font-semibold text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-lg font-semibold text-gray-700">Title</label>
        <input
          type="text"
          value={titleProfile}
          onChange={(e) => setTitleProfile(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-lg font-semibold text-gray-700">LinkedIn</label>
        <input
          type="text"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-lg font-semibold text-gray-700">GitHub</label>
        <input
          type="text"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-lg font-semibold text-gray-700">Website</label>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-lg font-semibold text-gray-700">Profile Image</label>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
          }}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-200">
          Save Profile
        </button>
      </form>
    </div>

    {/* Live Profile Preview */}
    <div className="lg:w-1/2 flex flex-col justify-center items-center text-gray-900 text-xl">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Live Profile Preview</h2>
      <div className="our-team border-solid border-2 border-black shadow-lg text-center p-8 rounded-lg" style={{ width: '500px', height: '300px' }}>
        <div className="picture mb-4">
          <img
            src={profileImage || '/images/default-profile.jpg'}
            alt={name || 'Default Name'}
            className="img-fluid w-40 h-40 object-cover rounded-full mx-auto"
          />
        </div>
        <div className="team-content">
          <h3 className="name">{name || 'Officer Name'}</h3>
          <h4 className="title text-gray-600 text-lg">{titleProfile || 'Officer Title'}</h4>
        </div>
        <ul className="social flex justify-center mt-4 space-x-4">
          {linkedin && (
            <li>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
            </li>
          )}
          <li>
            <a href={`mailto:example@example.com`} className="text-blue-600 hover:text-blue-800">
              <FontAwesomeIcon icon={faEnvelope} size="lg" />
            </a>
          </li>
          {github && (
            <li>
              <a href={github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
            </li>
          )}
          {website && (
            <li>
              <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <FontAwesomeIcon icon={faGlobe} size="lg" />
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  </div>
);

const BlogsSection = ({
  blogs,
  blogTitle,
  blogContent,
  blogImage,
  setBlogTitle,
  setBlogContent,
  setBlogImage,
  handleSubmitBlog,
  handleEditBlog,
  handleDeleteSelectedBlogs,
  handleSelectBlog,
  selectedBlogs,
  resetBlogForm,
  editingBlog,
}) => (
  <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-center lg:items-start">
    {/* Blog Form */}
    <div className="lg:w-1/2 bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 text-center">
        {editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}
      </h2>
      <form onSubmit={handleSubmitBlog} className="space-y-4">
        <label className="block text-lg font-semibold text-gray-700">Title</label>
        <input
          type="text"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Rich Text Editor for Blog Content */}
        <label className="block text-lg font-semibold text-gray-700">Content</label>
        <ReactQuill
          value={blogContent}
          onChange={setBlogContent}
          modules={modules}
          formats={formats}
          theme="snow"
          placeholder="Write your blog content here..."
          className="mb-4 text-gray-800"
        />

        <label className="block text-lg font-semibold text-gray-700">Blog Image</label>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setBlogImage(reader.result);
            reader.readAsDataURL(file);
          }}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-200"
          >
            {editingBlog ? 'Update Blog' : 'Create Blog'}
          </button>
          {editingBlog && (
            <button
              type="button"
              onClick={resetBlogForm}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-md transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Your Blog Posts</h3>
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
          {blogs.map((blog) => (
            <tr key={blog._id} className="border-b border-gray-200">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedBlogs.includes(blog._id)}
                  onChange={() => handleSelectBlog(blog._id)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
                />
              </td>
              <td className="p-3 text-gray-800 font-medium">{blog.title}</td>
              <td className="p-3 text-gray-600">{moment(blog.createdAt).format('LL')}</td>
              <td className="p-3">
                <button
                  onClick={() => handleEditBlog(blog)}
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
        onClick={handleDeleteSelectedBlogs}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-md transition duration-200"
      >
        Delete Selected
      </button>
    </div>

    {/* Live Blog Preview */}
    <div className="lg:w-1/2 flex flex-col justify-center items-center text-gray-900 text-xl mb-4 lg:mt-60">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Live Blog Preview</h2>
      <div
        className="border-solid border-2 border-black shadow-lg text-start p-8 rounded-lg"
        style={{ width: '500px', height: 'auto', wordBreak: 'break-word' }}
      >
        <div className="mt-4">
          {blogImage && (
            <img
              src={blogImage}
              alt={blogTitle}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
          )}
          <h2 className="text-3xl font-bold mb-4 text-black">
            {blogTitle || 'Blog Title'}
          </h2>
          <div
            className="text-gray-800 mb-4"
            dangerouslySetInnerHTML={{ __html: blogContent || 'Blog content will appear here.' }}
          ></div>
          <p className="text-gray-800 mb-4">
            <strong>Date:</strong> {moment().format('MMMM Do, YYYY')}
          </p>
        </div>
      </div>
    </div>
  </div>
);
