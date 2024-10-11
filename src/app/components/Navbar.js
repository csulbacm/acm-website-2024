"use client";
import Link from 'next/link';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image'; // Import Next.js Image for better performance and optimization
import logo from '../../../public/images/acm-csulb.svg'; // Adjust the path based on your file structure

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-blue-900 text-white py-4">
      <nav className="container mx-auto flex justify-between items-center px-4"> {/* Added px-4 for padding */}
        <div>
          <Link href="/">
            {/* Replacing the title with the logo */}
            <Image
              src={logo}
              alt="ACM CSULB Logo"
              width={50} // Adjust the width based on your preference
              height={50} // Adjust the height based on your preference
              className="cursor-pointer"
            />
          </Link>
        </div>
        <div className="hidden md:flex"> {/* Desktop Navbar */}
          <Link href="/about" className="mx-4">About</Link>
          <Link href="/events" className="mx-4">Events</Link>
          <Link href="/contact" className="mx-4">Contact</Link>
          <Link href="/sponsors" className="mx-4">Sponsors</Link>
        </div>
        <div className="md:hidden"> {/* Hamburger Menu Icon */}
          {!isOpen && ( // Only show the hamburger icon when the sidebar is closed
            <button onClick={toggleSidebar} className="px-2">
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
          )}
        </div>
      </nav>

      {/* Sidebar for small screens */}
      <div className={`fixed inset-0 bg-blue-900 bg-opacity-90 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col items-center pt-20 px-4"> {/* Added px-4 for padding */}
          <button onClick={closeSidebar} className="absolute top-4 right-4">
            <FontAwesomeIcon icon={faTimes} className="text-white text-xl" />
          </button>
          <Link href="/about" className="py-2 text-white" onClick={closeSidebar}>About</Link>
          <Link href="/events" className="py-2 text-white" onClick={closeSidebar}>Events</Link>
          <Link href="/contact" className="py-2 text-white" onClick={closeSidebar}>Contact</Link>
          <Link href="/sponsors" className="py-2 text-white" onClick={closeSidebar}>Sponsors</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
