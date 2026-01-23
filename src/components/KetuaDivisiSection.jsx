import React from 'react';
import PengurusCard from './PengurusCard';

const KetuaDivisiSection = () => {
  const members = [
    { name: "Hj. Dr. Mestia Lestaluhu, MM", role: "Ketua Diklat & Kurikulum" },
    { name: "Muhammad Hosri, S.E., Gr", role: "Ketua IT & Digital" },
    { name: "Iswandi Abdullah, M. Pd", role: "Ketua Humas & Kemitraan" },
    { name: "Syamsuri Firdaus, M. Ag", role: "Ketua Pengembangan Program" },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {members.map((member, idx) => (
        <PengurusCard 
          key={idx}
          name={member.name}
          role={member.role}
          folder="divisi"
        />
      ))}
    </div>
  );
};

export default KetuaDivisiSection;