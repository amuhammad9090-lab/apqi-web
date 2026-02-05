import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Loader2, ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PasswordToggle from '@/components/PasswordToggle';
import { loginUser } from '@/lib/firebaseAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { user, error } = await loginUser(email, password);

      if (error) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
           throw new Error("Email atau password salah.");
        }
        if (error.code === 'auth/too-many-requests') {
           throw new Error("Terlalu banyak percobaan login gagal. Silakan coba lagi nanti.");
        }
        throw error;
      }

      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali!",
        className: "bg-green-50 border-green-200 text-green-900"
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: error.message || "Terjadi kesalahan saat login.",
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
        <meta name="description" content="Login ke akun anggota APQI" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-sky-100 dark:border-slate-700">
            {/* Back Button */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-2"
            >
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')} 
                className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-700 pl-0 pr-4 -ml-2 group transition-all"
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent dark:text-white dark:bg-none">
                APQI
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Selamat Datang Kembali</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-700 outline-none"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <PasswordToggle
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => toast({ title: "Fitur dalam pengembangan", description: "Silakan hubungi admin untuk reset password." })}
                  className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-medium"
                >
                  Lupa Password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#92D2F9] to-sky-600 hover:from-sky-400 hover:to-sky-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Masuk...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>

            {/* Register Link */}
            <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold transition-colors"
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