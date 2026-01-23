import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const PengurusCard = ({ name, role, photoUrl, folder }) => {
  const [imgError, setImgError] = useState(false);

  const generateImageUrl = (fullName, folderName) => {
    if (!fullName || !folderName) return null;

    // 1. Remove content after comma (degrees)
    let cleanName = fullName.split(',')[0];

    // 2. Remove common prefixes
    cleanName = cleanName.replace(/^(Dr|Hj|H|Drs|Dra|Ir|Prof|Lc|Ustadz)\.?\s+/i, '');

    // 3. Remove specific special characters but keep structure for slugification
    // Remove apostrophes and quotes
    cleanName = cleanName.replace(/['"]/g, '');
    
    // Remove hyphens (e.g. Al-Fajri -> AlFajri) to match requested format
    cleanName = cleanName.replace(/-/g, '');
    
    // 4. Create filename: trim, replace spaces with hyphens, lowercase
    const filename = cleanName.trim().split(/\s+/).join('-').toLowerCase();

    return `https://varphhzvnbvjatnixbxu.supabase.co/storage/v1/object/public/pengurus-photos/${folderName}/${filename}.jpg`;
  };

  const imageUrl = folder ? generateImageUrl(name, folder) : photoUrl;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="group relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg bg-white"
    >
      <div className="absolute inset-0 bg-slate-200">
        {!imgError ? (
          <img 
            src={imageUrl}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
             <User size={64} />
          </div>
        )}
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-300">
        <div className="h-1 w-12 bg-sky-500 rounded-full mb-4"></div>
        <h3 className="text-xl font-bold mb-1 leading-tight">{name}</h3>
        <p className="text-sky-300 font-medium text-sm uppercase tracking-wider">{role}</p>
      </div>
    </motion.div>
  );
};

export default PengurusCard;