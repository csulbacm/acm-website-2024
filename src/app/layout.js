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
      <body className="min-h-screen bg-gray-50">
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
