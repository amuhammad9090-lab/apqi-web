import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const DeleteNewsModal = ({ isOpen, onClose, newsId, newsTitle, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!newsId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', newsId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Artikel berhasil dihapus.",
        className: "bg-green-50 border-green-200 text-green-900"
      });

      onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Gagal Menghapus",
        description: error.message || "Terjadi kesalahan saat menghapus artikel.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={!loading ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className="relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg mx-4 animate-in fade-in zoom-in-95">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            Hapus Artikel?
          </h2>
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin menghapus artikel "<strong>{newsTitle}</strong>"? 
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
            className="mt-2 sm:mt-0"
          >
            Batal
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteNewsModal;