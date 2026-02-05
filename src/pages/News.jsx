import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowUpDown, Loader2, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { supabase } from '@/lib/customSupabaseClient';

// Export NEWS_DATA for use in other components
export const NEWS_DATA = [];

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("terbaru");

  const categories = ["Semua", "Kegiatan", "Pengumuman", "Artikel", "Opini", "Lainnya"];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setNewsData(data || []);
      } catch (err) {
        console.error("Error fetching news list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter and Sort Logic
  const filteredNews = newsData.filter((item) => {
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === "terbaru" ? dateB - dateA : dateA - dateB;
  });

  return (
    <>
      <Helmet>
        <title>Berita & Artikel - APQI</title>
        <meta name="description" content="Berita terbaru, artikel, dan informasi kegiatan seputar Asosiasi Pegiat Al-Qur'an Indonesia." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900 text-white py-20 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            >
              Warta <span className="text-sky-400">APQI</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Jelajahi informasi terkini, wawasan mendalam, dan kisah inspiratif dari komunitas pegiat Al-Qur'an di seluruh Indonesia.
            </motion.p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6">
          {/* Controls Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-12 sticky top-24 z-30">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      selectedCategory === cat
                        ? "bg-sky-600 text-white shadow-md shadow-sky-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative group w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Cari berita..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
                
                <div className="relative w-full sm:w-auto">
                  <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full sm:w-48 pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none bg-slate-50 focus:bg-white cursor-pointer transition-all font-medium text-slate-600"
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="terlama">Terlama</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-sky-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Memuat berita terbaru...</p>
            </div>
          ) : (
            /* News Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredNews.map((news) => (
                  <motion.div
                    key={news.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NewsCard news={news} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredNews.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Tidak ada berita ditemukan</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Coba ubah kata kunci pencarian atau kategori filter Anda untuk menemukan artikel yang Anda cari.
              </p>
              <button 
                onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Semua');
                }}
                className="mt-6 text-sky-600 font-semibold hover:text-sky-700 hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default News;