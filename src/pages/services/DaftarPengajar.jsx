
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Award, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/customSupabaseClient';
import usePageTracking from '@/hooks/usePageTracking';

const DaftarPengajar = () => {
  usePageTracking();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // Using 'users' table instead of 'teachers', filtering by role 'teacher'
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'teacher')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTeachers(data || []);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        // Graceful fallback - empty list handled in UI
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <>
      <Helmet>
        <title>Daftar Pengajar & Mentor - APQI</title>
        <meta name="description" content="Profil pengajar dan mentor berpengalaman di APQI." />
      </Helmet>
      <Navbar />
      <main className="min-h-screen pt-20 bg-slate-50">
        <section className="bg-white py-16 border-b border-slate-200">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Daftar Pengajar & Mentor</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Berkenalan dengan para asatidz dan profesional yang siap membimbing perjalanan belajar Al-Qur'an Anda.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
              </div>
            ) : teachers.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {teachers.map((teacher, index) => (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-200 relative">
                      {teacher.photo_url ? (
                        <img 
                          src={teacher.photo_url} 
                          alt={teacher.nama_lengkap} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <User className="w-20 h-20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white text-sm font-medium">Lihat Profil Lengkap</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-3 border border-sky-100">
                        <Award className="w-3 h-3" />
                        {teacher.specialization || "Pengajar Al-Qur'an"}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                        {teacher.nama_lengkap}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-3">
                        {teacher.description || "Tidak ada deskripsi tersedia."}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">
                Belum ada data pengajar yang tersedia.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default DaftarPengajar;
