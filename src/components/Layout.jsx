import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, X, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simplified navigation for APQI Member Dashboard
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "Berhasil keluar dari akun.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img 
              src="https://horizons-cdn.hostinger.com/301c90b1-6ad0-4903-8c20-8c8de50b6d56/f4e52add59877c454df7f73f23e5c5ad.png" 
              alt="APQI Logo" 
              className="h-8 w-auto"
            />
            <span className="font-bold text-lg text-slate-900">
              Member Area
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-white z-40 pt-20"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-sky-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="my-2 border-t border-slate-100" />
              
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-sky-50 transition-all"
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">Ke Website Utama</span>
              </Link>

              <Button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                variant="ghost"
                className="justify-start gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Keluar</span>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 flex-col shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="https://horizons-cdn.hostinger.com/301c90b1-6ad0-4903-8c20-8c8de50b6d56/f4e52add59877c454df7f73f23e5c5ad.png" 
              alt="APQI Logo" 
              className="h-10 w-auto group-hover:scale-105 transition-transform"
            />
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">APQI</h1>
              <p className="text-xs text-sky-600 font-medium">Member Area</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-sky-700 hover:bg-sky-50">
              <Globe className="w-5 h-5" />
              <span className="font-medium">Ke Website Utama</span>
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Keluar</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-20 lg:pt-0 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;