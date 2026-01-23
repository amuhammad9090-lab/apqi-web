import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, User } from 'lucide-react';

const NewsCard = ({ news }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 border border-slate-100 flex flex-col h-full group"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        <img
          src={news.image_url}
          alt={news.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 text-sky-700 shadow-md backdrop-blur-sm">
            {news.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
            {formatDate(news.created_at)}
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sky-500" />
            {news.author_name || 'Admin APQI'}
          </div>
        </div>

        {/* Title */}
        <Link to={`/news/${news.id}`} className="block mb-3">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-sky-600 transition-colors leading-tight">
            {news.title}
          </h3>
        </Link>
        
        {/* Description */}
        <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {news.description}
        </p>

        {/* Footer/Action */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link 
            to={`/news/${news.id}`} 
            className="flex items-center text-sky-600 font-bold text-sm group/btn hover:text-sky-700 transition-colors"
          >
            Baca Selengkapnya
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;