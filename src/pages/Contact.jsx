import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { securityLogger } from '@/lib/securityLogger';
import { submitContactMessage } from '@/lib/contactService';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'Informasi Umum',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Security: Rate limiting check (client-side)
      const lastSubmit = sessionStorage.getItem('last_contact_submit');
      if (lastSubmit && Date.now() - parseInt(lastSubmit) < 60000) {
        securityLogger.logRateLimitExceeded('contact_form_submit');
        throw new Error("Mohon tunggu sebentar sebelum mengirim pesan lagi.");
      }

      // Prepare payload for service (combining names, matching table structure)
      const payload = {
        nama: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        subjek: formData.subject,
        pesan: formData.message,
        nomor_telepon: null // Optional, currently not collected in UI
      };

      // Call service
      const result = await submitContactMessage(payload);

      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Success handling
      sessionStorage.setItem('last_contact_submit', Date.now().toString());
      
      toast({
        title: "Pesan Berhasil Dikirim!",
        description: "Terima kasih telah menghubungi kami. Tim kami akan segera merespons.",
        className: "bg-green-50 border-green-200 text-green-900"
      });
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'Informasi Umum',
        message: ''
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      toast({
        title: "Gagal Mengirim",
        description: error.message,
        variant: "destructive"
      });
      securityLogger.logError(error, 'ContactForm.submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Kontak Kami - APQI</title>
        <meta name="description" content="Hubungi Asosiasi Pegiat Quran Indonesia." />
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Hubungi Kami</h1>
            <p className="text-xl text-slate-600">
              Punya pertanyaan seputar keanggotaan, program, atau kerjasama?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="bg-sky-600 rounded-3xl p-8 md:p-12 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-8">Informasi Kontak</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Kantor Pusat</h3>
                    <p className="text-sky-100">Perumahan Serua Residance Blok B1-B3, Kelurahan Serua, Kecamatan Bojongsari, Kota Depok, Provinsi Jawa Barat 16517</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Telepon / WhatsApp</h3>
                    <p className="text-sky-100">+62 853 5535 9335</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-sky-100">admin@apqiquran.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Kirim Pesan</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Depan</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                      required 
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Belakang</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                      maxLength={50}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subjek</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option>Informasi Umum</option>
                    <option>Pendaftaran Anggota</option>
                    <option>Kerjasama</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pesan</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" 
                    required
                    maxLength={1000}
                  ></textarea>
                  <p className="text-xs text-slate-400 mt-1 text-right">{formData.message.length}/1000</p>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl">
                  {isSubmitting ? 'Mengirim...' : (
                    <>
                      Kirim Pesan <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;