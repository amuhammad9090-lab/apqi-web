import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Target, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Tentang Kami - APQI</title>
        <meta name="description" content="Profil lengkap Asosiasi Pegiat Al-Qur'an Indonesia, Visi Misi, dan Struktur Organisasi." />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp} 
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Tentang APQI</h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Sebuah ikhtiar kolektif untuk membangun peradaban Qur'ani yang inklusif, profesional, dan berkelanjutan di Indonesia.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://varphhzvnbvjatnixbxu.supabase.co/storage/v1/object/public/pengurus-photos/hero/APQI-About.jpg" 
                alt="Pertemuan APQI" 
                className="rounded-2xl shadow-xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sky-100 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-50 rounded-full -z-10"></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Sejarah Singkat</h2>
              <p className="text-slate-600 mb-6 leading-relaxed text-justify">
                Asosiasi Pegiat Al-Qur’an Indonesia (APQI) adalah lembaga literasi Al-Qur’an yang berdiri pada Kamis, 1 Januari 2026, berkedudukan di Depok, Jawa Barat. APQI hadir sebagai respon atas tantangan literasi Al-Qur'an di Indonesia dengan fokus pada peningkatan kualitas bacaan, pemahaman, dan kecintaan masyarakat terhadap Al-Qur'an.
Melalui pendekatan Tahsin, Naghom (seni irama), dan Hafalan Al-Qur’an, APQI mengembangkan sistem pembelajaran modular berbasis aplikasi digital yang inklusif, terukur, dan relevan dengan kebutuhan masyarakat modern. Dengan semangat “Juara Mengabdi”, APQI berkomitmen menjadi pusat edukasi, pengabdian, dan inovasi Qur'ani yang berkelanjutan bagi masyarakat Indonesia.
              </p>
              <p className="text-slate-600 leading-relaxed text-justify">
                Kami percaya bahwa dengan kolaborasi yang kuat, tantangan buta aksara Al-Qur'an di Indonesia dapat diatasi dengan lebih efektif dan efisien melalui pendekatan teknologi dan metode pengajaran modern.
              </p>
            </motion.div>
          </div>

          {/* Visi Misi - Vertical stack */}
          <div className="flex flex-col gap-8 mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center w-full"
            >
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Visi</h3>
              <p className="text-slate-600">
                Menjadikan terwujudnya profesionalitas Pegiat Al-Qur'an Indonesia seiring peran sertanya dalam mengembangkan, menjaga, dan berkhidmat kepada Al-Qur'an.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center w-full"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Misi</h3>
              <ul className="text-slate-600 text-left list-disc list-inside space-y-2">
                <li>Menjadikan perkumpulan sebagai wadah pembelajaran dan pembinaan Al-Qur'an yang kreatif, inovatif, dan bersifat gotong royong.</li>
                <li>Mendidik dan mencetak generasi masyarakat yang mampu membaca, menghafal, memahami, dan menuliskan Al-Qur'an dengan baik dan benar.</li>
								<li>Memperjuangkan hak intelektual Pegiat Al-Qur'an dan kesejahteraan Pegiat Al-Qur'an.</li>
								<li>Memfasilitasi sinergi antara Pegiat Al-Qur'an dengan Lembaga Kementerian, Lembaga Non-Kementerian, Pemerintah Daerah, Perguruan Tinggi, Pihak-pihak Swasta, dan Lembaga Internasional.</li>
								<li>Mendorong publikasi hasil pembelajaran dan pembinaan Baca Tulis Al-Qur'an secara nasional dan internasional melalui media cetak dan digital serta mendorong pemanfaatan hasil-hasil pembelajaran dan pembinaan Baca Tulis Al-Qur'an sebagai landasan dalam perumusan kebijakan pemerintah.</li>
								<li>Mendorong Pegiat Al-Qur'an untuk mentaati Etika Pegiat Al-Qur'an.</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center w-full"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Nilai Inti</h3>
              <p className="text-slate-600">
                Sebagai wadah perkumpulan yang memberikan pembelajaran dan pembinaan Al-Qur'an, perkumpulan memiliki maksud dan tujuan yaitu agar masyarakat dapat membaca, menulis, memahami, dan mengamalkan kandungan Al-Qur'an dalam kehidupan sehari-hari sebagai pedoman hidup, membentuk akhlak mulia, serta meningkatkan keimanan dan ketakwaan.
              </p>
            </motion.div>
          </div>

          {/* Dewan Pengurus Section - Now only contains the link to the dedicated page */}
          <section className="py-16 text-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="space-y-8"
            >
              <div className="text-center">
                <span className="bg-sky-100 text-sky-700 py-1 px-4 rounded-full text-sm font-semibold uppercase tracking-wide">Struktur Organisasi</span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-4">Dewan Pengurus APQI</h2>
                <div className="h-1 w-24 bg-sky-500 mx-auto rounded-full mb-6"></div>
                <p className="max-w-2xl mx-auto text-slate-600 mb-8">
                  Mengenal lebih dekat para tokoh yang mendedikasikan diri untuk kemajuan literasi Al-Qur'an di Indonesia. Lihat struktur kepengurusan lengkap kami.
                </p>
                <Link to="/dewan-pengurus">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8 py-6 text-lg group transition-all duration-300">
                    Lihat Struktur Lengkap
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </section>

        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;