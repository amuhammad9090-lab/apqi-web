
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Link as LinkIcon, Save } from 'lucide-react';

const AdminZoomLinksPage = () => {
  const [links, setLinks] = useState({ tahsin: '', akademik: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({ tahsin: false, akademik: false });
  const { toast } = useToast();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase.from('mentoring_zoom_links').select('*');
        if (error) throw error;
        
        const linkMap = {};
        data?.forEach(item => {
          linkMap[item.service_type] = item.zoom_link;
        });
        setLinks(prev => ({ ...prev, ...linkMap }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const handleUpdate = async (type) => {
    const url = links[type];
    // Simple URL validation
    if (!url.startsWith('http')) {
      toast({ title: 'Invalid URL', description: 'URL must start with http:// or https://', variant: 'destructive' });
      return;
    }

    setSaving(prev => ({ ...prev, [type]: true }));
    try {
      const { error } = await supabase
        .from('mentoring_zoom_links')
        .upsert({ service_type: type, zoom_link: url }, { onConflict: 'service_type' });
      
      if (error) throw error;
      toast({ title: 'Success', description: 'Zoom link updated successfully' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(prev => ({ ...prev, [type]: false }));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Zoom Links</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-sky-600" /> Tahsin & Tahfizh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Zoom Meeting URL</label>
              <Input 
                value={links.tahsin} 
                onChange={e => setLinks({...links, tahsin: e.target.value})}
                placeholder="https://zoom.us/j/..." 
              />
            </div>
            <Button onClick={() => handleUpdate('tahsin')} disabled={saving.tahsin} className="w-full">
              {saving.tahsin ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Update Link</>}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-sky-600" /> Bimbingan Akademik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Zoom Meeting URL</label>
              <Input 
                value={links.akademik} 
                onChange={e => setLinks({...links, akademik: e.target.value})}
                placeholder="https://zoom.us/j/..." 
              />
            </div>
            <Button onClick={() => handleUpdate('akademik')} disabled={saving.akademik} className="w-full">
              {saving.akademik ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Update Link</>}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminZoomLinksPage;
