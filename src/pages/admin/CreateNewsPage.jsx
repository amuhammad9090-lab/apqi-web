import React from 'react';
import { Helmet } from 'react-helmet';
import AdminNewsForm from '@/components/AdminNewsForm';
import { LayoutDashboard } from 'lucide-react';

const CreateNewsPage = () => {
  return (
    <>
      <Helmet>
        <title>Create News - Admin APQI</title>
      </Helmet>
      
      <div className="min-h-screen bg-slate-50">
        {/* Simple Header */}
        <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-30">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
             <LayoutDashboard className="w-6 h-6 text-sky-400" />
             <span className="font-bold text-lg">Admin<span className="text-sky-400">Panel</span></span>
             <span className="text-slate-400 mx-2">/</span>
             <span className="text-sm text-slate-300">Create News</span>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
           <AdminNewsForm />
        </main>
      </div>
    </>
  );
};

export default CreateNewsPage;