import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AdminNewsForm from '@/components/AdminNewsForm';
import { LayoutDashboard, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const EditNewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setNewsData(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        toast({ title: "Error", description: "Could not load article.", variant: "destructive" });
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, navigate, toast]);

  if (loading) {
     return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
           <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        </div>
     );
  }

  return (
    <>
      <Helmet>
        <title>Edit News - Admin APQI</title>
      </Helmet>
      
      <div className="min-h-screen bg-slate-50">
        <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-30">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
             <LayoutDashboard className="w-6 h-6 text-sky-400" />
             <span className="font-bold text-lg">Admin<span className="text-sky-400">Panel</span></span>
             <span className="text-slate-400 mx-2">/</span>
             <span className="text-sm text-slate-300">Edit News</span>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
           <AdminNewsForm initialData={newsData} isEditMode={true} />
        </main>
      </div>
    </>
  );
};

export default EditNewsPage;