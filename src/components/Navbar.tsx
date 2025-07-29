import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold text-primary">
            TimeLeft
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            className="text-gray-600 focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/events" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300">Events</Link>
              <Link to="/gallery" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300">Gallery</Link>
              <Link to="/profile" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300">Profile</Link>
              <button 
                onClick={logout} 
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300">Sign Up</Link>
            </>
          )}
        </div>
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md py-4 px-4">
            <Link to="/" className="block py-2 text-gray-700 hover:text-indigo-600">Home</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/events" className="block py-2 text-gray-700 hover:text-indigo-600">Events</Link>
                <Link to="/profile" className="block py-2 text-gray-700 hover:text-indigo-600">Profile</Link>
                <button 
                  onClick={logout} 
                  className="block w-full text-left py-2 text-gray-700 hover:text-indigo-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-indigo-600">Login</Link>
                <Link to="/register" className="block py-2 text-gray-700 hover:text-indigo-600">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;