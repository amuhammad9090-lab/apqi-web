import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, Share2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NewsTemplate = ({ article, relatedArticles = [] }) => {
  if (!article) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        {/* Background Image with Parallax-like effect */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
        </motion.div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/news" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Kembali ke Berita
              </Link>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-sky-600/90 text-white text-sm font-semibold backdrop-blur-sm">
                  {article.category}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm border border-white/20">
                  {article.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-sky-400" />
                  <span className="font-medium">{article.author_name || 'Admin APQI'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-400" />
                  <span>{formatDate(article.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-400" />
                  <span>5 menit baca</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl -mt-10 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100">
              {/* Abstract/Description */}
              <div className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed mb-10 pb-10 border-b border-slate-100 italic">
                {article.description}
              </div>

              {/* Body Content */}
              <div 
                className="prose prose-lg md:prose-xl prose-slate max-w-none 
                prose-headings:font-bold prose-headings:text-slate-900 
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                prose-blockquote:border-l-4 prose-blockquote:border-sky-500 prose-blockquote:bg-sky-50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-bold text-slate-900">Bagikan artikel ini:</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" /> Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" /> Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" /> WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Author Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 sticky top-24"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{article.author_name || 'Admin APQI'}</h3>
                  <p className="text-sky-600 text-sm font-medium">Tim Redaksi</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Penulis aktif yang berfokus pada perkembangan pendidikan Al-Quran dan teknologi pembelajaran modern di Indonesia.
              </p>
              <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                Lihat Profil
              </Button>
            </motion.div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="font-bold text-slate-900 text-xl mb-6">Artikel Terkait</h3>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <Link 
                      key={related.id} 
                      to={`/news/${related.id}`}
                      className="group flex gap-4 bg-white p-3 rounded-xl hover:shadow-md transition-all border border-slate-100"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <img 
                          src={related.image_url} 
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-1">
                          {related.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
                          {related.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsTemplate;