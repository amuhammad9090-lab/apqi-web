import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Loader2, ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { inputSanitizer } from '@/lib/inputSanitizer';
import { securityLogger } from '@/lib/securityLogger';
import PasswordToggle from '@/components/PasswordToggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Security: Rate limiting check
    if (attempts >= 5) {
      securityLogger.logRateLimitExceeded('login_attempt');
      toast({
        title: "Too many attempts",
        description: "Please try again later.",
        variant: "destructive"
      });
      return;
    }

    // Security: Basic Input Validation
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const sanitizedEmail = inputSanitizer.validateEmail(email);
    if (!sanitizedEmail) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await login(sanitizedEmail, password);
      setAttempts(0); // Reset attempts on success
      toast({
        title: "Welcome back!",
        description: "Logged in successfully"
      });
      navigate('/dashboard');
    } catch (error) {
      setAttempts(prev => prev + 1);
      
      // Security: Generic Error Message
      const errorMessage = attempts >= 3 
        ? "Too many failed attempts. Please verify your credentials." 
        : "Invalid email or password.";
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - APQI</title>
        <meta name="description" content="Login to your APQI account" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-sky-100">
            {/* Back Button */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-2"
            >
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)} 
                className="text-slate-500 hover:text-sky-600 hover:bg-sky-50 pl-0 pr-4 -ml-2 group transition-all"
              >
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                Kembali
              </Button>
            </motion.div>

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#92D2F9] to-sky-600 flex items-center justify-center mb-4 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                APQI
              </h1>
              <p className="text-gray-600 mt-2">Selamat Datang Kembali</p>
            </div>

            {/* Security Notice */}
            {attempts > 2 && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 mb-4 animate-pulse">
                <AlertCircle className="w-4 h-4" />
                <span>Multiple failed attempts detected.</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 bg-white"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <PasswordToggle
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-sky-600 hover:text-sky-800 font-medium">
                  Lupa Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading || attempts >= 5}
                className="w-full bg-gradient-to-r from-[#92D2F9] to-sky-600 hover:from-sky-400 hover:to-sky-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>

            {/* Register Link */}
            <p className="text-center mt-6 text-gray-600">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="text-sky-600 hover:text-sky-700 font-semibold transition-colors"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;