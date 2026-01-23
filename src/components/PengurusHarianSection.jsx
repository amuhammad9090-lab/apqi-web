import React from 'react';
import PengurusCard from './PengurusCard';

const PengurusHarianSection = () => {
  const members = [
    { name: "Rahmat Taufik Sipahutar, M. Ag", role: "Ketua Umum" },
    { name: "Qadarasmadi Rasyid, S. Hum", role: "Wakil Ketua" },
    { name: "Nafisah Almais Aidiyah", role: "Sekretaris" },
    { name: "Farhan Muhammadi, S. Pd", role: "Bendahara" },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {members.map((member, idx) => (
        <PengurusCard 
          key={idx}
          name={member.name}
          role={member.role}
          folder="pengurus"
        />
      ))}
    </div>
  );
};

export default PengurusHarianSection;