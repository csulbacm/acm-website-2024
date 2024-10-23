import './globals.css'; // Import global styles
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'ACM at CSULB',
  description: 'Official website for ACM at CSULB',
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
        
        {/* Web Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-screen bg-gray-50" id="__next">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content */}
        <main>{children}</main>
        
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}