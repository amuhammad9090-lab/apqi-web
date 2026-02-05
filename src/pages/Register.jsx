import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Loader2, ChevronLeft, ShieldCheck, User, Phone, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PasswordToggle from '@/components/PasswordToggle';
import { supabase } from '@/lib/customSupabaseClient';
import { registerUser, updateUserProfile } from '@/lib/firebaseAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nama_lengkap: '',
    nomor_telepon: '',
    jenis_kelamin: ''
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Pastikan password dan konfirmasi password sama.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password lemah",
        description: "Password minimal 6 karakter.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Sign Up with Firebase
      const { user, error: authError } = await registerUser(formData.email, formData.password);

      if (authError) {
        throw authError;
      }

      if (user) {
        // 2. Update Firebase Profile
        await updateUserProfile(user, formData.nama_lengkap);

        // 3. Insert to public.users in Supabase with complete member data
        // We use the Firebase UID as the ID in Supabase to link them
        const { error: profileError } = await supabase.from('users').insert([{
          id: user.uid,
          email: formData.email,
          role: 'member',
          nama_lengkap: formData.nama_lengkap,
          nomor_telepon: formData.nomor_telepon,
          jenis_kelamin: formData.jenis_kelamin,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

        if (profileError) {
          console.error("Supabase Profile creation error:", profileError);
          // If Supabase insert fails, show warning but don't block registration
          toast({
            title: "Peringatan",
            description: "Data tersimpan di Firebase, tapi gagal sinkronisasi ke database. Silakan hubungi admin.",
            variant: "default"
          });
        }

        toast({
          title: "Registrasi Berhasil!",
          description: "Akun Anda telah berhasil dibuat. Silakan login.",
          className: "bg-green-50 border-green-200 text-green-900"
        });

        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Terjadi kesalahan saat mendaftar.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email sudah terdaftar.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password terlalu lemah.";
      }

      toast({
        title: "Registrasi Gagal",
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
        <title>Daftar Anggota - APQI</title>
        <meta name="description" content="Daftar menjadi anggota APQI" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4 py-12 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
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
              <p className="text-gray-600 dark:text-gray-400 mt-2">Form Pendaftaran Anggota Baru</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider border-b dark:border-slate-700 pb-2 mb-4">Data Pribadi</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="nama_lengkap"
                        value={formData.nama_lengkap}
                        onChange={handleChange}
                        placeholder="Nama Lengkap"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-700 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="nomor_telepon"
                        value={formData.nomor_telepon}
                        onChange={handleChange}
                        placeholder="Nomor Telepon"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-700 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="jenis_kelamin"
                        value={formData.jenis_kelamin}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-700 outline-none appearance-none"
                        required
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                </div>
              </div>

              {/* Account Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider border-b dark:border-slate-700 pb-2 mb-4">Informasi Akun</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan email Anda"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-700 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <PasswordToggle
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Konfirmasi Password <span className="text-red-500">*</span>
                    </label>
                    <PasswordToggle
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 p-4 rounded-xl mt-4 border border-slate-100 dark:border-slate-600">
                <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-slate-700 dark:text-slate-200">Keamanan Data Terjamin</p>
                  <p>Data Anda dienkripsi dan disimpan dengan aman menggunakan Firebase Auth.</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#92D2F9] to-sky-600 hover:from-sky-400 hover:to-sky-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all mt-6 text-lg h-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Daftar Sekarang'
                )}
              </Button>
            </form>

            <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold transition-colors"
              >
                Login disini
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;