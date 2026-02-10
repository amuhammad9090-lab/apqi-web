
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Video, Upload, Send, ExternalLink, Loader2, FileText, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import usePageTracking from '@/hooks/usePageTracking';

const BimbinganAkademik = () => {
  usePageTracking();
  const { toast } = useToast();
  const [zoomLink, setZoomLink] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    nama_siswa: '',
    mentor_email: '',
    deskripsi: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Zoom Link with maybeSingle() to handle 0 rows gracefully
        const { data: zoomData, error: zoomError } = await supabase
          .from('mentoring_zoom_links')
          .select('zoom_link')
          .eq('service_type', 'akademik')
          .maybeSingle();
        
        if (zoomError) {
           console.warn("Zoom link fetch error:", zoomError);
        }
        
        if (zoomData) {
          setZoomLink(zoomData.zoom_link);
        } else {
          console.log("No zoom link found for 'akademik'.");
        }

        // Fetch Teachers from 'users' table
        const { data: teacherData, error: teacherError } = await supabase
          .from('users')
          .select('id, nama_lengkap, email')
          .eq('role', 'teacher');
          
        if (teacherError) throw teacherError;
        setTeachers(teacherData || []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !formData.nama_siswa || !formData.mentor_email) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi semua field dan upload file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // 1. Upload File
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('academic-uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get Signed URL
      const { data: signedUrlData } = await supabase.storage
        .from('academic-uploads')
        .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days

      const fileUrl = signedUrlData?.signedUrl;

      // 2. Insert to Database
      const { error: dbError } = await supabase
        .from('academic_uploads')
        .insert({
          student_name: formData.nama_siswa,
          mentor_email: formData.mentor_email,
          file_url: fileUrl,
          description: formData.deskripsi
        });

      if (dbError) throw dbError;

      // 3. Call Edge Function
      const { error: edgeError } = await supabase.functions.invoke('send-mentor-email', {
        body: {
          mentor_email: formData.mentor_email,
          student_name: formData.nama_siswa,
          file_url: fileUrl,
          description: formData.deskripsi
        }
      });

      if (edgeError) {
        console.warn("Email notification failed:", edgeError);
        // We don't throw here, as the main submission succeeded
      }

      toast({
        title: "Berhasil!",
        description: "Tugas berhasil dikirim dan notifikasi telah dikirim ke mentor.",
      });

      // Reset form
      setFormData({ nama_siswa: '', mentor_email: '', deskripsi: '' });
      setFile(null);

    } catch (err) {
      console.error('Submission error:', err);
      toast({
        title: "Gagal Mengirim",
        description: err.message || "Terjadi kesalahan saat mengirim data.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Bimbingan Akademik - APQI</title>
        <meta name="description" content="Layanan bimbingan akademik dan konsultasi tugas akhir bagi mahasiswa dan pelajar." />
      </Helmet>
      <Navbar />
      <main className="min-h-screen pt-20 bg-slate-50">
        <section className="bg-sky-900 text-white py-20 relative">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Bimbingan Akademik</h1>
              <p className="text-xl text-sky-200 mb-8">
                Konsultasi skripsi, tesis, dan tugas akhir seputar studi Al-Qur'an dan Tafsir bersama para ahli.
              </p>
              
              {loading ? (
                 <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
              ) : zoomLink ? (
                <Button 
                  onClick={() => window.open(zoomLink, '_blank')}
                  className="bg-sky-500 hover:bg-sky-600 text-white gap-2 h-12 px-6 text-lg"
                >
                  <Video className="w-5 h-5" /> Join Zoom Meeting
                </Button>
              ) : (
                <Button disabled className="bg-slate-600 text-slate-300 gap-2 h-12 px-6 text-lg cursor-not-allowed">
                   <Video className="w-5 h-5" /> Zoom Belum Tersedia
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Submission Form */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-sky-600" /> Upload Tugas / Draft
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                    <Input 
                      value={formData.nama_siswa}
                      onChange={e => setFormData({...formData, nama_siswa: e.target.value})}
                      placeholder="Masukkan nama anda"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Pilih Mentor</label>
                    <Select 
                      onValueChange={val => setFormData({...formData, mentor_email: val})}
                      value={formData.mentor_email}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Mentor Pembimbing" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map(t => (
                          <SelectItem key={t.id} value={t.email || `mentor-${t.id}@apqi.org`}>
                            {t.nama_lengkap}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1">*Email mentor akan otomatis terisi berdasarkan pilihan</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">File Dokumen (PDF/DOC)</label>
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                      className="cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Catatan / Deskripsi</label>
                    <Textarea 
                      value={formData.deskripsi}
                      onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                      placeholder="Jelaskan kebutuhan konsultasi atau revisi anda..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" disabled={uploading} className="w-full h-12 text-lg">
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" /> Kirim Tugas
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Info Section */}
              <div className="space-y-8">
                <div className="bg-sky-50 p-8 rounded-2xl border border-sky-100">
                  <h3 className="text-xl font-bold text-sky-900 mb-4">Alur Bimbingan</h3>
                  <ul className="space-y-4">
                    {[
                      "Upload draft proposal atau bab skripsi/tesis anda.",
                      "Pilih mentor yang sesuai dengan bidang kajian.",
                      "Mentor akan mereview dokumen yang dikirimkan.",
                      "Jadwal konsultasi via Zoom akan dikonfirmasi via email.",
                      "Pelaksanaan bimbingan daring sesuai jadwal."
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Dokumen Pendukung</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <div className="text-left">
                        <div className="font-semibold text-slate-900">Pedoman Penulisan</div>
                        <div className="text-xs text-slate-500">PDF, 2.4 MB</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div className="text-left">
                        <div className="font-semibold text-slate-900">Template Proposal</div>
                        <div className="text-xs text-slate-500">DOCX, 1.2 MB</div>
                      </div>
                    </Button>
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

export default BimbinganAkademik;
