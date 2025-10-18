import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'ACM at CSULB',
  description: 'Join ACM at CSULB — California State University, Long Beach’s largest student organization for computer science. Explore events, resources, and collaboration opportunities.',

  openGraph: {
    title: 'ACM at CSULB',
    description: 'Association for Computing Machinery at CSULB: workshops, hackathons, networking, and more.',
    url: 'https://csulb-acm.org',
    siteName: 'ACM at CSULB',
    type: 'website',
    images: [
      {
        url: 'https://www.csulb-acm.org/_next/static/media/acm-csulb.86b72584.svg',
        width: 1200,
        height: 630,
        alt: 'ACM at CSULB Logo',
      },
    ],
  },

  alternates: {
    canonical: 'https://csulb-acm.org/',
  },

  keywords: [
    'ACM',
    'Association for Computing Machinery',
    'CSULB',
    'California State University, Long Beach',
    'Computer Science Club',
    'CSULB ACM',
    'Computer Science',
    'Student Organization',
    'Workshops',
    'Hackathons',
    'Networking',
    'BeachHacks'
  ],

  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },

  authors: [
    { name: 'Charles Milton', url: 'https://chuckmilton.com' },
  ],

  language: 'en-US',
  charset: 'UTF-8',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon Links */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-screen bg-gray-50" id="__next">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}