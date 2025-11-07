import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faInstagram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faXTwitter as faX } from '@fortawesome/free-brands-svg-icons';
import dynamic from 'next/dynamic';

// Dynamically import CurrentYear without SSR
const CurrentYear = dynamic(() => import('./CurrentYear'), { ssr: false });

const primaryLinks = [
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Starbound', href: '/starbound' },
  { label: 'Sponsors', href: '/sponsors' },
];

const resourceLinks = [
  { label: 'Contact', href: '/contact' },
  { label: 'Member Login', href: '/admin' },
  { label: 'Discord', href: 'https://discord.gg/TG2CRQNdQt', external: true },
];

const socials = [
  { icon: faX, href: 'https://x.com/csulbacm', label: 'X (formerly Twitter)' },
  { icon: faLinkedin, href: 'https://www.linkedin.com/company/acm-at-csulb/', label: 'LinkedIn' },
  { icon: faInstagram, href: 'https://www.instagram.com/csulbacm', label: 'Instagram' },
  { icon: faDiscord, href: 'https://discord.gg/TG2CRQNdQt', label: 'Discord' },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700">
      <div className="container mx-auto px-6 py-12 lg:px-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_auto_auto] md:items-start">
          <div className="max-w-md">
            <div className="flex items-center gap-3 text-slate-900">
              <img src="/images/acm-csulb.svg" alt="ACM at CSULB logo" className="h-8 w-8" />
              <span className="text-xl font-semibold tracking-tight">ACM at CSULB</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Empowering students at California State University, Long Beach to explore computing through
              community, mentorship, workshops, and long-term projects.
            </p>

            <div className="mt-6 flex items-center gap-4">
              {socials.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-transform duration-150 hover:-translate-y-1 hover:border-acm-blue/70 hover:text-acm-blue"
                >
                  <FontAwesomeIcon icon={icon} className="h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Navigate</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {primaryLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition-colors duration-150 hover:text-acm-blue"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {resourceLinks.map(({ label, href, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors duration-150 hover:text-acm-blue"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="transition-colors duration-150 hover:text-acm-blue"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex md:items-center md:justify-between">
          <p className="mb-4 md:mb-0">&copy; <CurrentYear /> ACM at CSULB. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="mailto:info@acm-csulb.org" className="hover:text-acm-blue transition-colors duration-150">
              info@acm-csulb.org
            </a>
            <Link href="/contact" className="hover:text-acm-blue transition-colors duration-150">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
