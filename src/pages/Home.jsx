import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Users, BookOpen, ChevronRight, Globe, Award, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import NewsCard from '@/components/NewsCard';
import { supabase } from '@/lib/customSupabaseClient';

const Home = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setLatestNews(data || []);
      } catch (error) {
        console.error('Error fetching latest news:', error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <>
      <Helmet>
        <title>APQI - Asosiasi Pegiat Al-Qur'an Indonesia</title>
        <meta name="description" content="Website Resmi Asosiasi Pegiat Al-Qur'an Indonesia. Wadah pemersatu pegiat, pengajar, dan lembaga Al-Qur'an." />
      </Helmet>

      <Navbar />

      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 bg-gradient-to-br from-slate-50 via-white to-sky-50">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <motion.div initial={{
                opacity: 0,
                x: -50
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.8
              }} className="lg:w-1/2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-800 text-sm font-semibold mb-6">
                  <Shield className="w-4 h-4" />
                  Official Association
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                  Juara Mengabdi, Menciptakan <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">Generasi Qur'ani</span>
                </h1>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Asosiasi Pegiat Al-Qur'an Indonesia (APQI) hadir sebagai wadah kolaborasi strategis bagi para pengajar, lembaga, dan pecinta Al-Qur'an untuk meningkatkan literasi dan standar pendidikan Al-Qur'an di Nusantara.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link to="/about">
                    <Button size="lg" className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white h-14 px-8 rounded-full text-lg">
                      Tentang APQI
                    </Button>
                  </Link>
                  <Link to="/services">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full border-slate-300 hover:bg-white hover:text-sky-700 text-lg">
                      Layanan Kami
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div initial={{
                opacity: 0,
                scale: 0.9
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                duration: 0.8,
                delay: 0.2
              }} className="lg:w-1/2 relative">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                  <img src="https://varphhzvnbvjatnixbxu.supabase.co/storage/v1/object/public/pengurus-photos/hero/farhan-mtq-rusia.jpg" alt="Komunitas APQI" className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <p className="font-bold text-xl">Bersama Membumikan Al-Qur'an</p>
                      <p className="text-slate-200">Kolaborasi Lintas Lembaga & Daerah</p>
                    </div>
                  </div>
                </div>
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-200 rounded-full blur-3xl opacity-50 -z-10"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-50 -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="absolute -left-64 top-40 w-96 h-96 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute -right-64 top-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sky-600 font-bold tracking-widest uppercase text-xs mb-3 block">Informasi Terkini</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-sky-800 to-slate-900">
                  Berita Terbaru
                </span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full mx-auto mb-6" />
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
                Dapatkan wawasan terbaru seputar kegiatan, program, dan artikel inspiratif dari komunitas APQI yang terus bergerak.
              </p>
            </div>

            {loadingNews ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
              </div>
            ) : latestNews.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {latestNews.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                  >
                    <NewsCard news={news} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 mb-16">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">Belum ada berita yang dipublikasikan saat ini.</p>
              </div>
            )}

            <div className="text-center">
              <Link to="/news">
                <Button size="lg" className="bg-white text-sky-600 border-2 border-sky-600 hover:bg-sky-50 rounded-full px-10 h-14 text-base font-bold shadow-sm hover:shadow-md transition-all group">
                  Lihat Semua Berita
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Vision & Mission Summary */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Visi & Misi Kami</h2>
              <p className="text-slate-600 text-lg">Membangun Pegiat Al-Qur’an Indonesia yang profesional melalui ekosistem pembelajaran Qur’ani yang inovatif, kolaboratif, dan berdampak bagi umat.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[{
                icon: Globe,
                title: "Jangkauan Nasional",
                desc: "Menghubungkan pegiat Al-Qur’an dari berbagai daerah di Indonesia melalui ekosistem pembelajaran digital yang terintegrasi, inklusif, dan berkelanjutan."
              }, {
                icon: Award,
                title: "Standardisasi Mutu",
                desc: "Membangun standar pembelajaran Al-Qur’an yang terukur melalui kurikulum Tahsin, Naghom, dan Hafalan berbasis modul digital serta pengajar yang kompeten."
              }, {
                icon: Users,
                title: "Pemberdayaan Umat",
                desc: "Meningkatkan kualitas, profesionalisme, dan kesejahteraan pegiat Al-Qur’an melalui pelatihan, pendampingan, dan pengembangan program berbasis pengabdian."
              }].map((item, idx) => <div key={idx} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-sky-600 shadow-sm mx-auto mb-6">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>)}
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="text-sky-400 font-semibold tracking-widest uppercase text-sm">Layanan Unggulan</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">Solusi Digital & Edukasi</h2>
              </div>
              <Link to="/services">
                <Button variant="ghost" className="text-white hover:text-sky-300 hover:bg-white/10 gap-2">
                  Lihat Semua Layanan <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Link to="/services/smart-tilawah" className="group">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-sky-500 transition-all h-full">
                  <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center text-sky-400 mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Smart Tilawah</h3>
                  <p className="text-slate-400 mb-6">Aplikasi pembelajaran Al-Qur'an berbasis AI untuk koreksi bacaan otomatis.</p>
                  <span className="text-sky-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Pelajari Lebih Lanjut <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>

              <Link to="/services/mentoring" className="group">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-sky-500 transition-all h-full">
                  <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center text-sky-400 mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Mentoring Intensif</h3>
                  <p className="text-slate-400 mb-6">Program bimbingan tahsin dan tilawah secara privat atau kelompok.</p>
                  <span className="text-sky-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Pelajari Lebih Lanjut <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>

              <Link to="/services/pengajar" className="group">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-sky-500 transition-all h-full">
                  <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center text-sky-400 mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Sertifikasi Pengajar</h3>
                  <p className="text-slate-400 mb-6">Program standardisasi kompetensi untuk guru Al-Qur'an profesional.</p>
                  <span className="text-sky-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Pelajari Lebih Lanjut <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-sky-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Siap Berkolaborasi?</h2>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              Mari bergabung menjadi bagian dari gerakan perubahan literasi Al-Qur'an di Indonesia. Daftarkan lembaga atau diri Anda sekarang.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-8">
                  Daftar Anggota
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
export default Home;