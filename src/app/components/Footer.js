import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faXTwitter as faX } from '@fortawesome/free-brands-svg-icons'; // Import the X icon

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-6">
      <div className="container mx-auto flex justify-between items-center">
        <p>© 2024 ACM at CSULB. All rights reserved.</p>
        <div className="flex space-x-4">
          <a 
            href="https://x.com/csulbacm" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-transform transform hover:scale-110" // Add animation classes
          >
            <FontAwesomeIcon icon={faX} className="text-lg h-8" />
          </a>
          <a 
            href="https://www.linkedin.com/company/csulbacm/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-transform transform hover:scale-110" // Add animation classes
          >
            <FontAwesomeIcon icon={faLinkedin} className="text-lg h-8" />
          </a>
          <a 
            href="https://www.instagram.com/csulbacm" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-transform transform hover:scale-110" // Add animation classes
          >
            <FontAwesomeIcon icon={faInstagram} className="text-lg h-8" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
