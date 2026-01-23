import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Download, Mic, BookOpen, Smartphone } from 'lucide-react';

const SmartTilawah = () => {
  return (
    <>
      <Helmet>
        <title>Smart Tilawah - APQI</title>
        <meta name="description" content="Aplikasi Smart Tilawah dari APQI. Belajar ngaji mudah dengan AI." />
      </Helmet>
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="bg-gradient-to-b from-sky-50 to-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-6">
              <BookOpen className="w-10 h-10 text-sky-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Smart Tilawah</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Inovasi pembelajaran Al-Qur'an dalam genggaman. Gunakan teknologi AI untuk menyempurnakan bacaan Anda kapan saja.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-8 gap-2">
                <Download className="w-5 h-5" /> Download App
              </Button>
            </div>
          </div>
        </section>

        {/* Features Detail */}
        <section className="py-16">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
               <img 
                 src="https://images.unsplash.com/photo-1512428559087-560fa0db79b5?q=80&w=2070&auto=format&fit=crop" 
                 alt="App Interface" 
                 className="rounded-3xl shadow-2xl"
               />
            </div>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 shrink-0">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Voice Recognition AI</h3>
                  <p className="text-slate-600">Teknologi pendeteksi suara canggih yang mampu mengenali kesalahan makhraj dan tajwid secara real-time.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 shrink-0">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Belajar Fleksibel</h3>
                  <p className="text-slate-600">Akses materi tahsin dan tilawah kapan saja melalui smartphone Anda, tanpa batasan waktu dan tempat.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Kurikulum Terstandar</h3>
                  <p className="text-slate-600">Materi disusun berdasarkan kurikulum standar APQI yang telah teruji dan banyak digunakan.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SmartTilawah;