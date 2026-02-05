import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Syarat dan Ketentuan - APQI</title>
        <meta name="description" content="Syarat dan Ketentuan Layanan APQI" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-white dark:bg-slate-900 pt-24 pb-16 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">Syarat dan Ketentuan</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="lead text-lg text-slate-600 dark:text-slate-300 mb-6">
              Selamat datang di APQI. Dengan mengakses atau menggunakan layanan kami, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">1. Ketentuan Umum</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Layanan ini disediakan oleh Asosiasi Pegiat Al-Qur'an Indonesia (APQI) untuk tujuan pendidikan dan sosial. Kami berhak mengubah ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">2. Akun Pengguna</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Anda bertanggung jawab untuk menjaga kerahasiaan akun dan password Anda. Segala aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda sepenuhnya.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">3. Hak Kekayaan Intelektual</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Seluruh konten dalam situs ini, termasuk namun tidak terbatas pada teks, grafik, logo, dan materi pelatihan, adalah milik APQI atau pemberi lisensinya dan dilindungi oleh hukum hak cipta.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">4. Batasan Tanggung Jawab</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              APQI tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan ini.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">5. Hukum yang Berlaku</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Syarat dan ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TermsOfService;