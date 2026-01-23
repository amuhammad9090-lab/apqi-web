import React from 'react';
import PengurusCardSmall from './PengurusCardSmall';
import { motion } from 'framer-motion';

const AnggotaDivisiSection = () => {
  const divisions = [
    {
      title: "Divisi Diklat & Kurikulum",
      members: [
        { name: "Hj. Ilfi Zakiah Darmanita, M. Pd", role: "Anggota" },
        { name: "Wildan Alwi, M. Pd", role: "Anggota" },
        { name: "Muhammad Luthfi Sulaiman, Lc.", role: "Anggota" },
        { name: "Anisa Nur Lestari, M. Pd", role: "Anggota" },
        { name: "Fatwa Hadi Maulana, Lc", role: "Anggota" },
        { name: "Abdullah Wafy, Lc", role: "Anggota" },
      ]
    },
    {
      title: "Divisi IT & Digital",
      members: [
        { name: "Muhammad Fadhil Al-Fajri", role: "Anggota" },
        { name: "Muhammad Zidan Setiawan", role: "Anggota" },
      ]
    },
    {
      title: "Divisi Humas & Kemitraan",
      members: [
        { name: "Fadhlan Marbun, M. Pd", role: "Anggota" },
        { name: "Fauji Ridwan, M. Pd", role: "Anggota" },
        { name: "Muhammad Rizqon, M. Pd", role: "Anggota" },
        { name: "Muhammad Miftah Faridl", role: "Anggota" },
        { name: "Putri Diana Abdul Jabar", role: "Anggota" },
        { name: "Nafisatul Millah", role: "Anggota" },
      ]
    },
    {
      title: "Divisi Pengembangan Program",
      members: [
        { name: "Panji Ansari, M. Ag, KUMI", role: "Anggota" },
        { name: "Hamdani, S. Pd", role: "Anggota" },
        { name: "Adek Putra Masrianda, M. Ag", role: "Anggota" },
        { name: "Siska Aprianti, S. Pd", role: "Anggota" },
        { name: "Luthfi Lathifah Rizki, S. E", role: "Anggota" },
        { name: "Lili Rahma, S. Pd", role: "Anggota" },
      ]
    }
  ];

  return (
    <div className="space-y-16">
      {divisions.map((div, idx) => (
        <div key={idx} className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-10 w-1.5 bg-gradient-to-b from-sky-400 to-blue-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-slate-800">
              Anggota {div.title}
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
            {div.members.map((member, mIdx) => (
              <PengurusCardSmall 
                key={mIdx}
                name={member.name}
                role={member.role}
                folder="anggota"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnggotaDivisiSection;