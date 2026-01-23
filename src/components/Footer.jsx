import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src="https://horizons-cdn.hostinger.com/301c90b1-6ad0-4903-8c20-8c8de50b6d56/f4e52add59877c454df7f73f23e5c5ad.png" alt="APQI Logo" className="h-10 w-auto" />
              <span className="font-bold text-xl text-white">APQI (Asosiasi Pegiat Al-Qur'an Indonesia)</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              APQI (Asosiasi Pegiat Al-Qur'an Indonesia) berdedikasi untuk menyebarkan literasi Al-Qur'an dan membina komunitas pembelajar di seluruh nusantara.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-sky-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-sky-600 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-sky-600 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-white font-bold text-lg mb-6">Tautan Cepat</h3>
            <ul className="space-y-4">
              <li>
                <a href="#about-apqi" className="hover:text-[#92D2F9] transition-colors">Tentang Kami</a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#92D2F9] transition-colors">Layanan Kami</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#92D2F9] transition-colors">Hubungi Kami</a>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div className="text-left">
            <h3 className="text-white font-bold text-lg mb-6">Layanan Kami</h3>
            <ul className="space-y-4">
              <li>
                <a href="#features" className="hover:text-[#92D2F9] transition-colors">Smart Tilawah</a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#92D2F9] transition-colors">Mentoring Intensif</a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#92D2F9] transition-colors">Sertifikasi Pengajar</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#92D2F9] shrink-0 mt-1" />
                <span>Perumahan Serua Residance Blok B1-B3, Kelurahan Serua, Kecamatan Bojongsari, Kota Depok, Provinsi Jawa Barat 16517 </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#92D2F9] shrink-0" />
                <span>+62 853 5535 9335</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#92D2F9] shrink-0" />
                <span>admin@apqiquran.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} APQI. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Ketentuan Layanan</a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;