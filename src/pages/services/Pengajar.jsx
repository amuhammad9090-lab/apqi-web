import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle2, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pengajar = () => {
  return (
    <>
      <Helmet>
        <title>Sertifikasi Pengajar - APQI</title>
        <meta name="description" content="Program Sertifikasi Pengajar Al-Qur'an Profesional APQI." />
      </Helmet>
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-to-b from-indigo-50 to-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-6">
              <Award className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Sertifikasi Pengajar</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Tingkatkan kredibilitas dan kompetensi Anda sebagai pengajar Al-Qur'an profesional dengan lisensi resmi dari APQI.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8">
                Ikuti Uji Kompetensi
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
             <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col justify-center">
                   <h3 className="text-2xl font-bold mb-6">Mengapa Sertifikasi Penting?</h3>
                   <ul className="space-y-4">
                      <li className="flex gap-3 items-start">
                         <CheckCircle2 className="w-6 h-6 shrink-0 text-indigo-200" />
                         <span>Standarisasi kualitas pengajaran nasional.</span>
                      </li>
                      <li className="flex gap-3 items-start">
                         <CheckCircle2 className="w-6 h-6 shrink-0 text-indigo-200" />
                         <span>Pengakuan profesionalitas dan kompetensi.</span>
                      </li>
                      <li className="flex gap-3 items-start">
                         <CheckCircle2 className="w-6 h-6 shrink-0 text-indigo-200" />
                         <span>Akses ke jaringan lembaga pendidikan luas.</span>
                      </li>
                   </ul>
                </div>
                <div className="md:w-1/2 p-12">
                   <h3 className="text-2xl font-bold text-slate-900 mb-6">Alur Sertifikasi</h3>
                   <div className="space-y-6">
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">1</div>
                         <div>
                            <h4 className="font-bold">Pendaftaran</h4>
                            <p className="text-sm text-slate-600">Isi formulir dan lengkapi administrasi.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">2</div>
                         <div>
                            <h4 className="font-bold">Pelatihan Pra-Uji</h4>
                            <p className="text-sm text-slate-600">Pembekalan materi pedagogik dan tahsin.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">3</div>
                         <div>
                            <h4 className="font-bold">Uji Kompetensi</h4>
                            <p className="text-sm text-slate-600">Tes tulis dan praktik mengajar.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">4</div>
                         <div>
                            <h4 className="font-bold">Penerbitan Sertifikat</h4>
                            <p className="text-sm text-slate-600">Sertifikat resmi berlaku 3 tahun.</p>
                         </div>
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

export default Pengajar;