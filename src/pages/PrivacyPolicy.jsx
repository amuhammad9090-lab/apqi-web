import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Kebijakan Privasi - APQI</title>
        <meta name="description" content="Kebijakan privasi Asosiasi Pegiat Al-Qur'an Indonesia (APQI)" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-white dark:bg-slate-900 pt-24 pb-16 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">Kebijakan Privasi</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="lead text-lg text-slate-600 dark:text-slate-300 mb-6">
              Terakhir diperbarui: 23 Januari 2026. <br/>
              APQI menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi yang Anda bagikan kepada kami.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">1. Informasi yang Kami Kumpulkan</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Kami mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar akun, seperti nama lengkap, alamat email, nomor telepon, dan data profil lainnya. Kami juga dapat mengumpulkan data teknis seperti alamat IP dan informasi perangkat untuk tujuan keamanan.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">2. Penggunaan Informasi</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Data Anda digunakan untuk:
            </p>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4 space-y-2">
              <li>Menyediakan layanan pendidikan dan keanggotaan APQI.</li>
              <li>Mengelola akun dan autentikasi Anda.</li>
              <li>Mengirimkan informasi penting terkait program dan layanan.</li>
              <li>Meningkatkan kualitas platform dan pengalaman pengguna.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">3. Keamanan Data</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang sesuai untuk melindungi data pribadi Anda dari akses tidak sah, perubahan, atau perusakan.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">4. Hak Pengguna</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Anda memiliki hak untuk mengakses, memperbaiki, atau menghapus data pribadi Anda. Anda juga dapat meminta pembatasan pemrosesan data Anda kapan saja dengan menghubungi kami.
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">5. Kontak Kami</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
            </p>
            <address className="not-italic text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <strong>Sekretariat APQI</strong><br/>
              Perumahan Serua Residance Blok B1-B3<br/>
              Bojongsari, Depok<br/>
              Email: admin@apqiquran.com
            </address>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;