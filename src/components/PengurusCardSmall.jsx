import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const PengurusCardSmall = ({ name, role, photoUrl, folder }) => {
  const [imgError, setImgError] = useState(false);

  const generateImageUrl = (fullName, folderName) => {
    if (!fullName || !folderName) return null;

    let cleanName = fullName.split(',')[0];
    cleanName = cleanName.replace(/^(Dr|Hj|H|Drs|Dra|Ir|Prof|Lc|Ustadz)\.?\s+/i, '');
    cleanName = cleanName.replace(/['"]/g, '');
    cleanName = cleanName.replace(/-/g, '');
    
    const filename = cleanName.trim().split(/\s+/).join('-').toLowerCase();

    return `https://varphhzvnbvjatnixbxu.supabase.co/storage/v1/object/public/pengurus-photos/${folderName}/${filename}.jpg`;
  };

  const imageUrl = folder ? generateImageUrl(name, folder) : photoUrl;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-sky-100 transition-all duration-300 h-full"
    >
      {/* 
        Responsive Image Container 
        sm (Mobile): w-32 (128px)
        md (Tablet): w-40 (160px)
        lg (Desktop): w-48 (192px) - Fits the 180-200px requirement
      */}
      <div className="relative mb-5 flex-shrink-0 
        w-32 h-32 
        md:w-40 md:h-40 
        lg:w-48 lg:h-48 
        rounded-2xl overflow-hidden bg-slate-100 shadow-inner group-hover:shadow-md transition-all duration-500"
      >
        {!imgError ? (
          <img 
            src={imageUrl}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
             <User size={48} strokeWidth={1.5} />
          </div>
        )}
      </div>
      
      <div className="w-full flex flex-col items-center">
        <h4 className="font-bold text-slate-800 text-base md:text-lg leading-snug mb-2 line-clamp-2 px-2">
          {name}
        </h4>
        
        {/* Decorative Divider */}
        <div className="h-1 w-10 bg-sky-200 rounded-full mb-3 group-hover:w-16 group-hover:bg-sky-500 transition-all duration-300"></div>
        
        <p className="text-sky-600 text-xs md:text-sm font-semibold uppercase tracking-wider px-2">
          {role}
        </p>
      </div>
    </motion.div>
  );
};

export default PengurusCardSmall;