import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Users, Video, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Mentoring = () => {
  return (
    <>
      <Helmet>
        <title>Mentoring - APQI</title>
        <meta name="description" content="Program Mentoring Al-Qur'an Intensif bersama APQI." />
      </Helmet>
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-6">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Program Mentoring</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Bimbingan intensif langsung dengan para mentor berpengalaman untuk akselerasi kemampuan bacaan Al-Qur'an Anda.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                Daftar Mentoring
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Keunggulan Program Mentoring</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-blue-50 rounded-xl">
                <div className="inline-block p-3 bg-blue-600 rounded-lg mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Mentor Berpengalaman</h3>
                <p className="text-slate-600">Dipandu oleh mentor yang bersertifikat dan berpengalaman dalam mengajar Al-Qur'an.</p>
              </div>
              <div className="p-8 bg-blue-50 rounded-xl">
                <div className="inline-block p-3 bg-blue-600 rounded-lg mb-4">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Fleksibel & Online</h3>
                <p className="text-slate-600">Sesi mentoring dapat dilakukan secara online dengan jadwal yang fleksibel sesuai kebutuhan Anda.</p>
              </div>
              <div className="p-8 bg-blue-50 rounded-xl">
                <div className="inline-block p-3 bg-blue-600 rounded-lg mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Progres Terukur</h3>
                <p className="text-slate-600">Tracking progress yang jelas dengan evaluasi berkala untuk memastikan peningkatan kemampuan.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Mentoring;