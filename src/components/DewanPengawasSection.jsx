import React from 'react';
import PengurusCard from './PengurusCard';

const DewanPengawasSection = () => {
  const members = [
    { name: "Dr. Rijal Ahmad Rangkuty, M. Pd", role: "Ketua" },
    { name: "Rahmat Batubara, M. H", role: "Anggota" },
    { name: "Tubagus Muhammad Farhan, MM", role: "Anggota" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {members.map((member, idx) => (
        <PengurusCard 
          key={idx}
          name={member.name}
          role={member.role}
          folder="pengawas"
        />
      ))}
    </div>
  );
};

export default DewanPengawasSection;