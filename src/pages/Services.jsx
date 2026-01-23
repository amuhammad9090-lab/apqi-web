import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Users, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Services = () => {
  const services = [
    {
      id: 'smart-tilawah',
      title: 'Smart Tilawah App',
      desc: 'Platform belajar Al-Qur\'an mandiri berbasis Artificial Intelligence untuk koreksi bacaan realtime.',
      icon: BookOpen,
      color: 'bg-sky-100 text-sky-600',
      link: '/services/smart-tilawah'
    },
    {
      id: 'mentoring',
      title: 'Program Mentoring',
      desc: 'Bimbingan intensif tatap muka (offline/online) bersama mentor tersertifikasi untuk perbaikan bacaan.',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      link: '/services/mentoring'
    },
    {
      id: 'pengajar',
      title: 'Sertifikasi Pengajar',
      desc: 'Program pelatihan dan uji kompetensi bagi guru Al-Qur\'an untuk mendapatkan lisensi mengajar resmi.',
      icon: Award,
      color: 'bg-indigo-100 text-indigo-600',
      link: '/services/pengajar'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Layanan Kami - APQI</title>
        <meta name="description" content="Daftar layanan APQI mulai dari aplikasi Smart Tilawah, Mentoring, hingga Sertifikasi Pengajar." />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-16 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">Layanan Kami</h1>
            <p className="text-xl text-slate-600">
              Solusi komprehensif untuk kebutuhan pembelajaran dan pengajaran Al-Qur'an di era digital.
            </p>
          </div>

          <div className="grid gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 md:gap-12 hover:shadow-md transition-shadow">
                <div className={`w-24 h-24 ${service.color} rounded-2xl flex items-center justify-center shrink-0`}>
                  <service.icon className="w-12 h-12" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h2>
                  <p className="text-slate-600 text-lg mb-6">{service.desc}</p>
                  <Link to={service.link}>
                    <Button variant="outline" className="gap-2">
                      Selengkapnya <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Services;