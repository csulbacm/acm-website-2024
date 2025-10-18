"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image'; // Import Next.js Image for better performance and optimization
import logo from '../../../public/images/acm-csulb.svg'; // Adjust the path based on your file structure

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const [isAuthed, setIsAuthed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      try {
        const res = await fetch('/api/auth/verify', { method: 'GET', cache: 'no-store' });
        if (!isMounted) return;
        setIsAuthed(res.ok);
      } catch {
        if (!isMounted) return;
        setIsAuthed(false);
      }
    };
    check();
    const handleFocus = () => check();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);
    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [pathname]);

  const getLinkClass = (path) => {
    return pathname.startsWith(path) ? 'text-acm-blue' : 'text-black';
  };

  const loginBtnClasses =
    'mx-4 inline-block px-4 py-2 bg-acm-blue text-white font-bold rounded-full hover:bg-acm-blue/80 transition';
  
  const mobileLoginBtnClasses =
  'py-4 px-8 bg-white text-acm-blue font-bold rounded-full hover:bg-gray-100 transition';

  const getMobileLinkClass = (path) => {
    return pathname.startsWith(path) ? 'text-acm-yellow' : 'text-white';
  };

  return (
    <header className="bg-white text-white py-4">
      <nav className="container mx-auto flex justify-between items-center px-4"> {/* Added px-4 for padding */}
        <div>
          <Link href="/">
            {/* Replacing the title with the logo */}
            <Image
              src={logo}
              alt="ACM CSULB Logo"
              width={52} // Adjust the width based on your preference
              height={52} // Adjust the height based on your preference
              className="cursor-pointer"
            />
          </Link>
        </div>
        <div className="hidden md:flex text-black font-bold items-center"> {/* Desktop Navbar */}
          <Link href="/about" className={`mx-4 hover:text-acm-blue transition-colors duration-300 ${getLinkClass('/about')}`}>About</Link>
          <Link href="/events" className={`mx-4 hover:text-acm-blue transition-colors duration-300 ${getLinkClass('/events')}`}>Events</Link>
          <Link href="/blog" className={`mx-4 hover:text-acm-blue transition-colors duration-300 ${getLinkClass('/blog')}`}>Blog</Link>
          <Link href="/contact" className={`mx-4 hover:text-acm-blue transition-colors duration-300 ${getLinkClass('/contact')}`}>Contact</Link>
          <Link href="/sponsors" className={`mx-4 hover:text-acm-blue transition-colors duration-300 ${getLinkClass('/sponsors')}`}>Sponsors</Link>
          <Link href={isAuthed ? "/admin" : "/login"} className={loginBtnClasses}>
            {isAuthed ? 'Dashboard' : 'Member Login'}
          </Link>
        </div>
        <div className="md:hidden"> {/* Hamburger Menu Icon */}
          {!isOpen && ( // Only show the hamburger icon when the sidebar is closed
            <button onClick={toggleSidebar} className="px-2 text-black">
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
          )}
        </div>
      </nav>

      {/* Sidebar for small screens */}
      <div className={`fixed inset-0 bg-acm-blue bg-opacity-90 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col items-center pt-20 px-4"> {/* Added px-4 for padding */}
          <button onClick={closeSidebar} className="absolute top-4 right-4">
            <FontAwesomeIcon icon={faTimes} className="text-white text-3xl" />
          </button>
          <Link href="/about" className={`hover:text-acm-yellow transition-colors duration-300 py-5 font-bold text-xl ${getMobileLinkClass('/about')}`} onClick={closeSidebar}>About</Link>
          <Link href="/events" className={`hover:text-acm-yellow transition-colors duration-300 py-5 font-bold text-xl ${getMobileLinkClass('/events')}`} onClick={closeSidebar}>Events</Link>
          <Link href="/blog" className={`hover:text-acm-yellow transition-colors duration-300 py-5 font-bold text-xl ${getMobileLinkClass('/blog')}`} onClick={closeSidebar}>Blog</Link>
          <Link href="/contact" className={`hover:text-acm-yellow transition-colors duration-300 py-5 font-bold text-xl ${getMobileLinkClass('/contact')}`} onClick={closeSidebar}>Contact</Link>
          <Link href="/sponsors" className={`hover:text-acm-yellow transition-colors duration-300 py-5 font-bold text-xl ${getMobileLinkClass('/sponsors')}`} onClick={closeSidebar}>Sponsors</Link>
           <Link href={isAuthed ? "/admin" : "/login"} className={mobileLoginBtnClasses} onClick={closeSidebar}>
             {isAuthed ? 'Dashboard' : 'Member Login'}
           </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
