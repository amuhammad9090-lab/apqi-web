import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Loader2, ChevronLeft, ShieldCheck, User, Phone, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { inputSanitizer } from '@/lib/inputSanitizer';
import { hashPassword } from '@/lib/hashPassword';
import PasswordToggle from '@/components/PasswordToggle';
import { supabase } from '@/lib/customSupabaseClient';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nama_lengkap: '',
    nomor_telepon: '',
    alamat: '',
    tanggal_lahir: '',
    jenis_kelamin: ''
  });
  
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Weak', color: 'bg-slate-200' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (true) {
      case score <= 2: return { score, label: 'Lemah', color: 'bg-red-500' };
      case score === 3: return { score, label: 'Cukup', color: 'bg-orange-500' };
      case score === 4: return { score, label: 'Baik', color: 'bg-yellow-500' };
      case score >= 5: return { score, label: 'Kuat', color: 'bg-green-500' };
      default: return { score: 0, label: 'Lemah', color: 'bg-slate-200' };
    }
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { email, password, confirmPassword, nama_lengkap, nomor_telepon, jenis_kelamin } = formData;

    if (!nama_lengkap) newErrors.nama_lengkap = "Nama lengkap wajib diisi";
    if (!nomor_telepon) newErrors.nomor_telepon = "Nomor telepon wajib diisi";
    if (!jenis_kelamin) newErrors.jenis_kelamin = "Jenis kelamin wajib dipilih";
    
    if (!email) {
      newErrors.email = "Email wajib diisi";
    } else if (!inputSanitizer.validateEmail(email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi";
    } else {
      const strength = calculatePasswordStrength(password);
      if (password.length < 8) newErrors.password = "Minimal 8 karakter";
      else if (strength.score < 3) newErrors.password = "Password terlalu lemah (Gunakan huruf besar, kecil & angka)";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon periksa kembali form anda.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.nama_lengkap,
            phone: formData.nomor_telepon
          }
        }
      });

      if (authError) throw authError;

      if (authData?.user) {
        // 2. Hash password for legacy support (if table requires it)
        const hashedPassword = await hashPassword(formData.password);

        // 3. Create public profile
        const { error: profileError } = await supabase.from('users').insert([{
          id: authData.user.id,
          email: formData.email,
          password_hash: hashedPassword, // Store for legacy schema requirement
          nama_lengkap: inputSanitizer.sanitizeText(formData.nama_lengkap),
          nomor_telepon: inputSanitizer.sanitizeText(formData.nomor_telepon),
          alamat: inputSanitizer.sanitizeText(formData.alamat),
          tanggal_lahir: formData.tanggal_lahir || null,
          jenis_kelamin: formData.jenis_kelamin,
          role: 'member' // Default role
        }]);

        if (profileError) {
          toast({
            title: "Pendaftaran Berhasil dengan Catatan",
            description: "Akun dibuat tapi profil gagal disimpan. Hubungi admin.",
            variant: "warning"
          });
        } else {
          toast({
            title: "Registrasi Berhasil!",
            description: "Silakan login dengan akun baru Anda.",
            variant: "default",
            className: "bg-green-50 border-green-200 text-green-900"
          });
        }

        // Redirect to login
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (error) {
      toast({
        title: "Registrasi Gagal",
        description: error.message || "Terjadi kesalahan saat mendaftar.",
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
      
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
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
              <p className="text-gray-600 mt-2">Form Pendaftaran Anggota Baru</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b pb-2 mb-4">Data Pribadi</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.nama_lengkap ? 'text-red-400' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        name="nama_lengkap"
                        value={formData.nama_lengkap}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 bg-white
                          ${errors.nama_lengkap ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'}`}
                        placeholder="Nama Sesuai KTP"
                      />
                    </div>
                    {errors.nama_lengkap && <p className="text-red-500 text-xs mt-1 ml-1">{errors.nama_lengkap}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon / WA <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.nomor_telepon ? 'text-red-400' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        name="nomor_telepon"
                        value={formData.nomor_telepon}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 bg-white
                          ${errors.nomor_telepon ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'}`}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    {errors.nomor_telepon && <p className="text-red-500 text-xs mt-1 ml-1">{errors.nomor_telepon}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Users className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.jenis_kelamin ? 'text-red-400' : 'text-gray-400'}`} />
                      <select
                        name="jenis_kelamin"
                        value={formData.jenis_kelamin}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 appearance-none bg-white
                          ${errors.jenis_kelamin ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'}`}
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1 ml-1">{errors.jenis_kelamin}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Lahir
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="tanggal_lahir"
                        value={formData.tanggal_lahir}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 bg-white"
                      placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota..."
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Account Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b pb-2 mb-4">Informasi Akun</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 bg-white
                        ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'}`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <PasswordToggle
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 8 karakter, Aa123"
                      error={!!errors.password}
                    />
                    
                    {/* Password Strength Indicator */}
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${passwordStrength.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className={`${passwordStrength.score > 1 ? 'text-slate-600' : 'text-slate-400'}`}>
                           Kekuatan: <span className="font-medium">{passwordStrength.label}</span>
                         </span>
                         {errors.password && <span className="text-red-500">{errors.password}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password <span className="text-red-500">*</span>
                    </label>
                    <PasswordToggle
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Ulangi password"
                      error={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-xs text-slate-500 bg-slate-50 p-4 rounded-xl mt-4 border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-slate-700">Keamanan Data Terjamin</p>
                  <p>Data Anda dienkripsi dan disimpan dengan aman. Kami tidak membagikan data pribadi Anda kepada pihak ketiga tanpa izin.</p>
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
                    Memproses Pendaftaran...
                  </>
                ) : (
                  'Daftar Sekarang'
                )}
              </Button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="text-sky-600 hover:text-sky-700 font-semibold transition-colors"
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