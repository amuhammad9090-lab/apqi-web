import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AuthGuard from '@/components/AuthGuard';
import AdminGuard from '@/components/AdminGuard';
import ScrollToTop from '@/components/ScrollToTop';
import { testSupabaseConnection } from '@/lib/testSupabaseConnection';
import { AlertCircle, WifiOff, Database } from 'lucide-react';

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

// Member Pages
import Dashboard from '@/pages/Dashboard';
import SmartTilawah from '@/pages/services/SmartTilawah';
import Mentoring from '@/pages/services/Mentoring';
import Pengajar from '@/pages/services/Pengajar';

// Admin Pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboard from '@/pages/admin/Dashboard';
import CreateNewsPage from '@/pages/admin/CreateNewsPage';
import EditNewsPage from '@/pages/admin/EditNewsPage';

import { Toaster } from '@/components/ui/toaster';

function App() {
  const [appInitError, setAppInitError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({ loading: true, success: false, message: '' });

  const runDiagnostics = async () => {
    setConnectionStatus({ loading: true, success: false, message: '' });
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      setAppInitError("Missing Supabase Configuration. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.");
      setConnectionStatus({ loading: false, success: false, message: 'Missing environment variables.' });
      return;
    }

    const res = await testSupabaseConnection();
    setConnectionStatus({ loading: false, success: res.success, message: res.error || '' });
    if (!res.success) {
      setAppInitError(res.error || "Failed to connect to Supabase database. Please check your network or configuration.");
    } else {
      setAppInitError(null);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  if (appInitError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            {connectionStatus.message.includes('network') ? <WifiOff className="w-8 h-8" /> : <Database className="w-8 h-8" />}
            <h1 className="text-xl font-bold">Application Error</h1>
          </div>
          <p className="text-slate-600 mb-4">{appInitError}</p>
          {!connectionStatus.loading && (
            <button
              onClick={runDiagnostics}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Connection
            </button>
          )}
          <div className="bg-slate-100 p-4 rounded text-xs font-mono text-slate-700 overflow-x-auto mt-4">
            VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing'}<br/>
            VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
          </div>
        </div>
      </div>
    );
  }

  // Show a loading state while diagnostics are running successfully but appInitError is null
  if (connectionStatus.loading && !appInitError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-sky-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-700">Connecting to services...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dewan-pengurus" element={<DewanPengurus />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/smart-tilawah" element={<SmartTilawah />} />
            <Route path="/services/mentoring" element={<Mentoring />} />
            <Route path="/services/pengajar" element={<Pengajar />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Member Routes */}
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            <Route path="/admin/dashboard" element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            } />
            
            <Route path="/admin/news/create" element={
              <AdminGuard>
                <CreateNewsPage />
              </AdminGuard>
            } />
            
            <Route path="/admin/news/edit/:id" element={
              <AdminGuard>
                <EditNewsPage />
              </AdminGuard>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;