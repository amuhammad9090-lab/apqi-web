import React from 'react';
import PengurusCard from './PengurusCard';

const DewanPembinaSection = () => {
  const members = [
    { name: "Dr. Muhammad Aminullah, MA", role: "Ketua" },
    { name: "Ridwan Muslim, M. Pd", role: "Anggota" },
    { name: "Arifiandi, M. Pd", role: "Anggota" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {members.map((member, idx) => (
        <PengurusCard 
          key={idx}
          name={member.name}
          role={member.role}
          folder="pembina"
        />
      ))}
    </div>
  );
};

export default DewanPembinaSection;