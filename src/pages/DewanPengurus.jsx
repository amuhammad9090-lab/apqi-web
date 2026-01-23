import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DewanPembinaSection from '@/components/DewanPembinaSection';
import DewanPengawasSection from '@/components/DewanPengawasSection';
import PengurusHarianSection from '@/components/PengurusHarianSection';
import KetuaDivisiSection from '@/components/KetuaDivisiSection';
import AnggotaDivisiSection from '@/components/AnggotaDivisiSection';

const DewanPengurus = () => {
  return (
    <>
      <Helmet>
        <title>Dewan Pengurus - APQI</title>
        <meta name="description" content="Susunan lengkap Dewan Pengurus Asosiasi Pegiat Al-Qur'an Indonesia" />
      </Helmet>

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://varphhzvnbvjatnixbxu.supabase.co/storage/v1/object/public/pengurus-photos/hero/hero-apqi.jpg" 
              alt="Dewan Pengurus Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60 mix-blend-multiply"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Dewan Pengurus APQI
              </h1>
              <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                Mengenal lebih dekat para tokoh yang mendedikasikan diri untuk kemajuan literasi Al-Qur'an di Indonesia.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="bg-white">
          <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 space-y-24">
            
            {/* Pembina */}
            <div>
              <div className="text-center mb-12">
                <span className="text-sky-600 font-semibold tracking-wider uppercase text-sm">Penasihat & Pembimbing</span>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">Dewan Pembina</h2>
                <div className="w-20 h-1.5 bg-sky-500 mx-auto mt-4 rounded-full"></div>
              </div>
              <DewanPembinaSection />
            </div>

            {/* Pengawas */}
            <div>
              <div className="text-center mb-12">
                <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">Pengawasan & Kepatuhan</span>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">Dewan Pengawas</h2>
                <div className="w-20 h-1.5 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
              </div>
              <DewanPengawasSection />
            </div>

            {/* Pengurus Harian */}
            <div className="bg-slate-50 -mx-4 md:-mx-6 px-4 md:px-6 py-16 md:py-24 rounded-3xl">
              <div className="container mx-auto">
                <div className="text-center mb-12">
                  <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Eksekutif</span>
                  <h2 className="text-3xl font-bold text-slate-900 mt-2">Pengurus Harian</h2>
                  <div className="w-20 h-1.5 bg-blue-500 mx-auto mt-4 rounded-full"></div>
                </div>
                <PengurusHarianSection />
              </div>
            </div>

            {/* Ketua Divisi */}
            <div>
              <div className="text-center mb-12">
                <span className="text-orange-600 font-semibold tracking-wider uppercase text-sm">Kepala Bidang</span>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">Ketua Divisi</h2>
                <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
              </div>
              <KetuaDivisiSection />
            </div>

            {/* Anggota Divisi */}
            <div>
              <div className="text-center mb-12">
                <span className="text-slate-500 font-semibold tracking-wider uppercase text-sm">Tim Kerja</span>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">Anggota Divisi</h2>
                <div className="w-20 h-1.5 bg-slate-400 mx-auto mt-4 rounded-full"></div>
              </div>
              <AnggotaDivisiSection />
            </div>

          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DewanPengurus;