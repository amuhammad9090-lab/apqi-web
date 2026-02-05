import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import PasswordToggle from '@/components/PasswordToggle';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [systemError, setSystemError] = useState(null);

  const authContext = useAdminAuth();
  const navigate = useNavigate();

  // Check if auth system is properly initialized
  useEffect(() => {
    if (!authContext) {
      setSystemError('Admin authentication system is not properly initialized. Please refresh the page.');
    }
  }, [authContext]);

  // Redirect if already logged in
  useEffect(() => {
    if (authContext?.adminUser) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authContext?.adminUser, navigate]);

  // Show system error if auth not available
  if (systemError) {
    return (
      <>
        <Helmet>
          <title>System Error - Admin Login</title>
        </Helmet>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-red-600 p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">System Error</h1>
            </div>
            <div className="p-8">
              <p className="text-center text-slate-700 mb-6">{systemError}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    // Final sanity check
    if (!authContext || typeof authContext.signInWithPassword !== 'function') {
      setErrorMsg("Authentication system not available. Please refresh the page and try again.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authContext.signInWithPassword(email, password);

      if (error) {
        let message = error.message || 'Login failed';

        // Map Firebase error codes to user-friendly messages
        if (message.includes("auth/invalid-credential")) {
          message = "Invalid email or password.";
        } else if (message.includes("auth/user-not-found")) {
          message = "Email not found in the system.";
        } else if (message.includes("auth/wrong-password")) {
          message = "Incorrect password.";
        } else if (message.includes("auth/user-disabled")) {
          message = "This account has been disabled.";
        } else if (message.includes("auth/network-request-failed")) {
          message = "Network error: Unable to reach the authentication server. Please check your internet connection and try again.";
        } else if (message.includes("auth/too-many-requests")) {
          message = "Too many failed login attempts. Please try again later.";
        } else if (message.includes("admin privileges")) {
          message = "Your account does not have admin privileges.";
        } else if (message.includes("admin access")) {
          message = "Your account does not have admin access.";
        }

        setErrorMsg(message);
      }
      // If no error, the useEffect hook will handle redirect

    } catch (err) {
      console.error('Login Handler Error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - APQI</title>
      </Helmet>

      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

          <div className="bg-sky-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-sky-100 mt-2">Secure Access Gateway</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">

              {errorMsg && (
                <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-100 flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Login Failed</p>
                    <p>{errorMsg}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                    placeholder="Enter your admin email"
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <PasswordToggle
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : 'Sign In'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;