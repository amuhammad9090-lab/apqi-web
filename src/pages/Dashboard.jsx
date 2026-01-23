import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, ArrowRight, ShieldCheck, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { currentUser } = useAuth();

  const services = [
    {
      title: 'Smart Tilawah',
      description: 'Akses aplikasi belajar Al-Qur\'an berbasis AI.',
      icon: BookOpen,
      path: '/services/smart-tilawah',
      color: 'bg-sky-100 text-sky-600',
      action: 'Pelajari Fitur'
    },
    {
      title: 'Program Mentoring',
      description: 'Daftar bimbingan intensif dengan mentor.',
      icon: Users,
      path: '/services/mentoring',
      color: 'bg-blue-100 text-blue-600',
      action: 'Lihat Program'
    },
    {
      title: 'Sertifikasi',
      description: 'Info uji kompetensi pengajar Al-Qur\'an.',
      icon: Award,
      path: '/services/pengajar',
      color: 'bg-indigo-100 text-indigo-600',
      action: 'Info Sertifikasi'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard Anggota - APQI</title>
        <meta name="description" content="Dashboard Anggota APQI" />
      </Helmet>

      <Layout>
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-gradient-to-r from-sky-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Ahlan Wa Sahlan! 👋
              </h1>
              <p className="text-sky-100 text-lg mb-6">
                Selamat datang di Dashboard Anggota APQI.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                 <span className="flex items-center gap-2">
                   <User className="w-4 h-4" /> {currentUser?.email}
                 </span>
                 <span className="w-1 h-1 bg-sky-300 rounded-full"></span>
                 <span className="flex items-center gap-2 text-green-300">
                   <ShieldCheck className="w-4 h-4" /> Member Aktif
                 </span>
              </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Services Grid */}
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-sky-600" />
                  Layanan APQI
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <motion.div
                        key={service.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:border-sky-200 group"
                      >
                        <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                        <p className="text-slate-500 text-sm mb-6 min-h-[40px]">{service.description}</p>
                        <Link to={service.path}>
                          <Button variant="outline" className="w-full justify-between group-hover:bg-slate-50">
                            {service.action} <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Sidebar / Info Panel */}
            <div className="space-y-6">
              {/* Member Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
              >
                <h3 className="font-bold text-slate-900 mb-4">Status Keanggotaan</h3>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white mb-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6 opacity-80">
                      <img 
                        src="https://horizons-cdn.hostinger.com/301c90b1-6ad0-4903-8c20-8c8de50b6d56/f4e52add59877c454df7f73f23e5c5ad.png" 
                        alt="Logo" 
                        className="h-6 w-auto brightness-0 invert"
                      />
                      <span className="font-bold tracking-widest text-xs">MEMBER CARD</span>
                    </div>
                    <p className="text-slate-400 text-xs mb-1">Nomor Anggota</p>
                    <p className="font-mono text-lg tracking-wider mb-6">APQI-2024-001</p>
                    <div className="flex justify-between items-end">
                      <div>
                         <p className="text-slate-400 text-xs">Nama Anggota</p>
                         <p className="font-semibold text-sm truncate max-w-[150px]">{currentUser?.email?.split('@')[0]}</p>
                      </div>
                      <div className="bg-sky-500 px-2 py-1 rounded text-[10px] font-bold">PREMIUM</div>
                    </div>
                  </div>
                  {/* Card pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                </div>
                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                  Perbarui Profil
                </Button>
              </motion.div>

              {/* Announcement / Info */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-sky-50 rounded-2xl p-6 border border-sky-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sky-600 shadow-sm shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Jadwal Terdekat</h4>
                    <p className="text-sm text-slate-600 mb-3">Webinar Nasional APQI: "Tantangan Pendidikan Al-Qur'an Era 5.0"</p>
                    <p className="text-xs font-semibold text-sky-600">Minggu, 24 Oktober 2024</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;