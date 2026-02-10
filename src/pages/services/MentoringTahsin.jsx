
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Video, Calendar, Clock, BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import usePageTracking from '@/hooks/usePageTracking';

const MentoringTahsin = () => {
  usePageTracking();
  const [zoomLink, setZoomLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZoomLink = async () => {
      try {
        // Use maybeSingle() to handle cases where no row exists without throwing an error
        const { data, error } = await supabase
          .from('mentoring_zoom_links')
          .select('zoom_link')
          .eq('service_type', 'tahsin')
          .maybeSingle();

        if (error) {
           console.warn("Error fetching zoom link:", error);
        } else if (data) {
          setZoomLink(data.zoom_link);
        } else {
          console.log("No zoom link found for 'tahsin'.");
        }
      } catch (err) {
        console.error('Error fetching zoom link:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchZoomLink();
  }, []);

  return (
    <>
      <Helmet>
        <title>Mentoring Tahsin & Tahfizh - APQI</title>
        <meta name="description" content="Program bimbingan tahsin dan tahfizh intensif bersama pengajar bersanad dari APQI." />
      </Helmet>
      <Navbar />
      <main className="min-h-screen pt-20 bg-slate-50">
        {/* Hero Section */}
        <section className="bg-sky-700 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Mentoring Tahsin & Tahfizh</h1>
              <p className="text-xl text-sky-100 max-w-2xl mx-auto mb-8">
                Perbaiki bacaan dan hafalan Al-Qur'an Anda bersama mentor profesional dan bersanad melalui bimbingan intensif.
              </p>
              
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl max-w-md mx-auto border border-white/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                  <Video className="w-5 h-5" /> Live Session Zoom
                </h3>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : (
                  zoomLink ? (
                    <Button 
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold text-lg h-12"
                      onClick={() => window.open(zoomLink, '_blank')}
                    >
                      Buka Zoom Sekarang <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <p className="text-sky-200">Link Zoom belum tersedia saat ini.</p>
                  )
                )}
                <p className="text-sm text-sky-200 mt-4">
                  Pastikan Anda sudah menginstall aplikasi Zoom Meeting.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Metode Pembelajaran</h2>
                <div className="space-y-6">
                  {[
                    { title: "Talaqqi Musyafahah", desc: "Belajar langsung berhadapan dengan guru untuk koreksi detail makhraj dan sifat huruf." },
                    { title: "Kelompok Kecil", desc: "Setiap sesi dibatasi maksimal 10 peserta agar bimbingan lebih efektif dan fokus." },
                    { title: "Kurikulum Terstruktur", desc: "Materi disusun bertahap dari level pemula hingga mahir sesuai standar sanad." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 flex-shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-800">{item.title}</h4>
                        <p className="text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Jadwal & Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-sky-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Jadwal Rutin</p>
                      <p className="text-sm text-slate-600">Senin & Kamis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Clock className="w-6 h-6 text-sky-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Waktu</p>
                      <p className="text-sm text-slate-600">20.00 - 21.30 WIB</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-500 mb-4">Butuh informasi lebih lanjut?</p>
                    <Button variant="outline" className="w-full">Hubungi Admin</Button>
                  </div>
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

export default MentoringTahsin;
