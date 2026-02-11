
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AuthGuard from '@/components/AuthGuard';
import AdminGuard from '@/components/AdminGuard';
import ScrollToTop from '@/components/ScrollToTop';
import { testSupabaseConnection } from '@/lib/testSupabaseConnection';
import { AlertCircle, WifiOff, Database } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

// Public Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import DewanPengurus from '@/pages/DewanPengurus';
import Services from '@/pages/Services';
import Contact from '@/pages/Contact';
import News from '@/pages/News';
import NewsDetail from '@/pages/NewsDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';

// Member Pages
import Dashboard from '@/pages/Dashboard';
import SmartTilawah from '@/pages/services/SmartTilawah';
// Removed: Mentoring
// Removed: Pengajar
import MentoringTahsin from '@/pages/services/MentoringTahsin';
import BimbinganAkademik from '@/pages/services/BimbinganAkademik';
import DaftarPengajar from '@/pages/services/DaftarPengajar';

// Admin Pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboard from '@/pages/admin/Dashboard';
import CreateNewsPage from '@/pages/admin/CreateNewsPage';
import EditNewsPage from '@/pages/admin/EditNewsPage';
import AdminTeachersPage from '@/pages/admin/AdminTeachersPage';
import AdminEditorialTeamPage from '@/pages/admin/AdminEditorialTeamPage';
import AdminZoomLinksPage from '@/pages/admin/AdminZoomLinksPage';
import AdminAnalyticsDashboard from '@/pages/admin/AdminAnalyticsDashboard';

import { Toaster } from '@/components/ui/toaster';

// Theme Wrapper
const ThemeWrapper = ({ children }) => {
  useTheme(); // Initialize theme
  return children;
};

function App() {
  const [appInitError, setAppInitError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({ loading: true, success: false, message: '' });
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const runDiagnostics = async () => {
    setConnectionStatus({ loading: true, success: false, message: '' });
    
    try {
        const res = await testSupabaseConnection();
        
        setConnectionStatus({ loading: false, success: res.success, message: res.error || '' });
        
        if (!res.success) {
          if (res.error && res.error.includes('Missing Supabase')) {
             setAppInitError(res.error);
          } else {
             console.warn("App running with connection issues:", res.error);
             setIsOfflineMode(true);
          }
        } else {
          setAppInitError(null);
          setIsOfflineMode(false);
        }
    } catch (err) {
        console.error("Critical failure in diagnostics:", err);
        setConnectionStatus({ loading: false, success: false, message: err.message });
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  if (appInitError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <Database className="w-8 h-8" />
            <h1 className="text-xl font-bold">Configuration Error</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-4">{appInitError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Reload</button>
        </div>
      </div>
    );
  }

  if (connectionStatus.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-sky-600 mx-auto mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-slate-700 dark:text-slate-300">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeWrapper>
      <AuthProvider>
        <AdminAuthProvider>
          <Router>
            <ScrollToTop />
            {isOfflineMode && (
                <div className="bg-yellow-500 text-white text-center px-4 py-2 text-sm font-medium">
                    You are currently offline or unable to connect to the server. Some features may be unavailable.
                </div>
            )}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/dewan-pengurus" element={<DewanPengurus />} />
              <Route path="/services" element={<Services />} />
              
              {/* New Service Routes */}
              <Route path="/services/smart-tilawah" element={<SmartTilawah />} />
              {/* Removed /services/mentoring */}
              <Route path="/services/mentoring-tahsin" element={<MentoringTahsin />} />
              <Route path="/services/bimbingan-akademik" element={<BimbinganAkademik />} />
              <Route path="/services/daftar-pengajar" element={<DaftarPengajar />} />
              {/* Removed /services/pengajar */}

              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />

              {/* Protected Member Routes */}
              <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              
              <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/news/create" element={<AdminGuard><CreateNewsPage /></AdminGuard>} />
              <Route path="/admin/news/edit/:id" element={<AdminGuard><EditNewsPage /></AdminGuard>} />
              
              {/* New Admin Routes */}
              <Route path="/admin/teachers" element={<AdminGuard><AdminTeachersPage /></AdminGuard>} />
              <Route path="/admin/editorial-team" element={<AdminGuard><AdminEditorialTeamPage /></AdminGuard>} />
              <Route path="/admin/zoom-links" element={<AdminGuard><AdminZoomLinksPage /></AdminGuard>} />
              <Route path="/admin/analytics" element={<AdminGuard><AdminAnalyticsDashboard /></AdminGuard>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </Router>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeWrapper>
  );
}

export default App;
