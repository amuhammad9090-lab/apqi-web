import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsTemplate from '@/components/NewsTemplate';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        // Fetch main article
        const { data: mainData, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setArticle(mainData);

        // Fetch related articles (same category, not current article, max 3)
        if (mainData) {
          const { data: related } = await supabase
            .from('news')
            .select('id, title, category, image_url, created_at')
            .eq('category', mainData.category)
            .neq('id', mainData.id)
            .eq('status', 'published')
            .limit(3);
          setRelatedArticles(related || []);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
      // Scroll to top when ID changes
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
            <p className="text-slate-500 font-medium">Memuat artikel...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 bg-slate-50 p-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Artikel Tidak Ditemukan</h2>
          <p className="mb-8 max-w-md">Maaf, artikel yang Anda cari mungkin telah dihapus atau URL yang Anda masukkan salah.</p>
          <Button onClick={() => navigate('/news')} className="bg-sky-600 text-white hover:bg-sky-700">
            Kembali ke Berita
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} - APQI News</title>
        <meta name="description" content={article.description} />
        {/* Open Graph tags for better sharing */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:image" content={article.image_url} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Navbar />
      
      <main>
        <NewsTemplate article={article} relatedArticles={relatedArticles} />
      </main>

      <Footer />
    </>
  );
};

export default NewsDetail;