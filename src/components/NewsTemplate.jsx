import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, Share2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';

const NewsTemplate = ({ article, relatedArticles = [] }) => {
  if (!article) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get current page URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(article.title);

  // Share functions
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      const btn = document.getElementById('copy-link-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="text-green-600 flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Tersalin!</span>';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(article.content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'pre', 'code', 'ul', 'ol', 'li', 'a', 'img', 'video',
      'iframe', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'sub', 'sup'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'width', 'height', 'style', 'class',
      'target', 'rel', 'data-*', 'controls', 'autoplay', 'loop', 'align'
    ]
  });

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
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
              {/* Description */}
              {article.description && (
                <div className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed mb-10 pb-10 border-b border-slate-100 italic">
                  {article.description}
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg md:prose-xl prose-slate max-w-none 
                prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mb-4
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 prose-strong:font-semibold
                prose-em:italic
                prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-2
                prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-2
                prose-li:text-slate-600
                prose-blockquote:border-l-4 prose-blockquote:border-sky-500 
                prose-blockquote:bg-sky-50 prose-blockquote:p-6 
                prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                prose-blockquote:text-slate-700
                prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 
                prose-code:rounded prose-code:text-sm prose-code:text-slate-800
                prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 
                prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:mb-6
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                prose-table:w-full prose-table:border-collapse
                prose-th:bg-slate-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold
                prose-td:p-3 prose-td:border-b prose-td:border-slate-200"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />

              {/* Compact Share Widget */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span className="font-semibold text-slate-900 text-base">
                      Bagikan artikel ini:
                    </span>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Facebook */}
                      <button
                        onClick={shareToFacebook}
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 text-slate-600 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">Facebook</span>
                      </button>

                      {/* Twitter */}
                      <button
                        onClick={shareToTwitter}
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 text-slate-600 group-hover:text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-sky-600">Twitter</span>
                      </button>

                      {/* WhatsApp */}
                      <button
                        onClick={shareToWhatsApp}
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 text-slate-600 group-hover:text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-green-600">WhatsApp</span>
                      </button>

                      {/* Copy Link */}
                      <button
                        onClick={copyLink}
                        id="copy-link-btn"
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                      >
                        <Share2 className="w-4 h-4 text-slate-600 group-hover:text-slate-800" />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-800">Copy Link</span>
                      </button>
                    </div>
                  </div>
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
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
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