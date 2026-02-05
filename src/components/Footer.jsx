import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src="https://horizons-cdn.hostinger.com/301c90b1-6ad0-4903-8c20-8c8de50b6d56/f4e52add59877c454df7f73f23e5c5ad.png" alt="APQI Logo" className="h-10 w-auto" />
              <span className="font-bold text-xl text-white">APQI</span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 leading-relaxed mb-6">
              APQI (Asosiasi Pegiat Al-Qur'an Indonesia) berdedikasi untuk menyebarkan literasi Al-Qur'an dan membina komunitas pembelajar di seluruh nusantara.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 dark:bg-slate-900 rounded-lg hover:bg-sky-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 dark:bg-slate-900 rounded-lg hover:bg-sky-600 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 dark:bg-slate-900 rounded-lg hover:bg-sky-600 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-white font-bold text-lg mb-6">Tautan Cepat</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="hover:text-[#92D2F9] transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#92D2F9] transition-colors">Layanan Kami</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#92D2F9] transition-colors">Hubungi Kami</Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div className="text-left">
            <h3 className="text-white font-bold text-lg mb-6">Program</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/services/smart-tilawah" className="hover:text-[#92D2F9] transition-colors">Smart Tilawah</Link>
              </li>
              <li>
                <Link to="/services/mentoring" className="hover:text-[#92D2F9] transition-colors">Mentoring Intensif</Link>
              </li>
              <li>
                <Link to="/services/pengajar" className="hover:text-[#92D2F9] transition-colors">Sertifikasi Pengajar</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#92D2F9] shrink-0 mt-1" />
                <span className="text-sm">Perumahan Serua Residance Blok B1-B3, Bojongsari, Depok, Jawa Barat 16517</span>
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

        <div className="border-t border-slate-800 dark:border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} APQI. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;