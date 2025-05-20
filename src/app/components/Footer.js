import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faInstagram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faXTwitter as faX } from '@fortawesome/free-brands-svg-icons';
import dynamic from 'next/dynamic';

// Dynamically import CurrentYear without SSR
const CurrentYear = dynamic(() => import('./CurrentYear'), { ssr: false });

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">&copy; <CurrentYear /> ACM at CSULB. All rights reserved.</p>
        <div className="flex space-x-4">
          <a 
            href="https://x.com/csulbacm" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-transform transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faX} className="text-lg h-8" />
          </a>
          <a 
            href="https://www.linkedin.com/company/acm-at-csulb/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-transform transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faLinkedin} className="text-lg h-8" />
          </a>
          <a 
            href="https://www.instagram.com/csulbacm" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-transform transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-lg h-8" />
          </a>
          <a 
            href="https://discord.gg/TG2CRQNdQt" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-transform transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faDiscord} className="text-lg h-8" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
