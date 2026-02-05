import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Berita', path: '/news' },
    { 
      name: 'Layanan Kami', 
      path: '/services', 
      dropdown: [
        { name: 'Smart Tilawah', path: '/services/smart-tilawah' },
        { name: 'Mentoring', path: '/services/mentoring' },
        { name: 'Pengajar', path: '/services/pengajar' },
      ]
    },
    { 
      name: 'Tentang APQI', 
      path: '/about',
      dropdown: [
        { name: 'Profile Kami', path: '/about' },
        { name: 'Dewan Pengurus', path: '/dewan-pengurus' },
      ]
    },
    { name: 'Kontak', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || location.pathname !== '/' 
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="https://horizons-cdn.hostinger.com/301c90b1-6ad0-4903-8c20-8c8de50b6d56/f4e52add59877c454df7f73f23e5c5ad.png"
                alt="APQI Logo"
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
              <span className={`font-bold text-xl transition-colors ${
                isScrolled || location.pathname !== '/' 
                  ? 'text-gray-800 dark:text-gray-100' 
                  : 'text-gray-700 dark:text-gray-100'
              }`}>
                APQI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.dropdown ? (
                    <div className="relative">
                      <button 
                        className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-sky-600 dark:hover:text-sky-400 ${
                          isScrolled || location.pathname !== '/' 
                            ? 'text-gray-600 dark:text-gray-300' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {link.name}
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50 border border-gray-100 dark:border-slate-700">
                        {link.dropdown.map((dropItem) => (
                          <Link
                            key={dropItem.name}
                            to={dropItem.path}
                            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                          >
                            {dropItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`text-sm font-medium transition-colors hover:text-sky-600 dark:hover:text-sky-400 ${
                        isScrolled || location.pathname !== '/' 
                          ? 'text-gray-600 dark:text-gray-300' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Auth Buttons & Theme Toggle */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled || location.pathname !== '/'
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/20'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {currentUser ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="text-gray-700 dark:text-gray-200">Dashboard</Button>
                  </Link>
                  <Button 
                    onClick={logout}
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className={`${
                      isScrolled || location.pathname !== '/' 
                        ? 'text-gray-600 dark:text-gray-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    } hover:text-sky-600 dark:hover:text-sky-400`}>
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-[#92D2F9] hover:bg-sky-500 text-white dark:text-slate-900 rounded-full px-6 transition-colors">
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
               <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-200"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                className="p-2 text-gray-700 dark:text-gray-200 hover:text-sky-600 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col min-h-screen">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <img
                    src="https://horizons-cdn.hostinger.com/301c90b1-6ad0-4903-8c20-8c8de50b6d56/f4e52add59877c454df7f73f23e5c5ad.png"
                    alt="APQI Logo"
                    className="h-8 w-auto"
                  />
                  <span className="font-bold text-lg text-gray-900 dark:text-white">APQI</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-sky-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col p-6 gap-6">
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <div key={link.name}>
                      {link.dropdown ? (
                        <div>
                          <button
                            onClick={() => setActiveMobileDropdown(activeMobileDropdown === link.name ? null : link.name)}
                            className="flex items-center justify-between w-full text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-sky-600 transition-colors"
                          >
                            {link.name}
                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeMobileDropdown === link.name ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {activeMobileDropdown === link.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-4 ml-4 flex flex-col gap-4 border-l-2 border-gray-100 dark:border-slate-700 pl-4">
                                  {link.dropdown.map((dropItem) => (
                                    <Link
                                      key={dropItem.name}
                                      to={dropItem.path}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="text-base text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors py-1"
                                    >
                                      {dropItem.name}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={link.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-sky-600 transition-colors block"
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-4">
                  {currentUser ? (
                    <>
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full py-6 text-lg rounded-xl">
                          Dashboard
                        </Button>
                      </Link>
                      <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="outline" className="w-full py-6 text-lg rounded-xl text-red-600 border-red-200">
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full py-6 text-lg rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white dark:border-slate-700">
                          Masuk
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-[#92D2F9] hover:bg-sky-500 text-white dark:text-slate-900 py-6 text-lg rounded-xl transition-colors">
                          Daftar Sekarang
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;