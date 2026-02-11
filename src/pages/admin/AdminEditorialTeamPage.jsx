
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Pencil, Trash2, User } from 'lucide-react';

const AdminEditorialTeamPage = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', description: '' });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('editorial_team').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setTeam(data || []);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let photoUrl = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('editorial-team-photos').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('editorial-team-photos').getPublicUrl(fileName);
        photoUrl = data.publicUrl;
      }

      const payload = {
        name: formData.name,
        role: formData.role,
        description: formData.description,
        ...(photoUrl && { photo_url: photoUrl })
      };

      if (editingId) {
        const { error } = await supabase.from('editorial_team').update(payload).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Updated', description: 'Member updated successfully' });
      } else {
        const { error } = await supabase.from('editorial_team').insert(payload);
        if (error) throw error;
        toast({ title: 'Created', description: 'Member added successfully' });
      }

      setIsDialogOpen(false);
      fetchTeam();
      resetForm();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const { error } = await supabase.from('editorial_team').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Member removed' });
      fetchTeam();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', role: '', description: '' });
    setFile(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Editorial Team</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-gray-900 border border-gray-200 shadow-lg"> {/* Ensure white background, dark text, border, and shadow */}
            <DialogHeader>
              <DialogTitle className="text-gray-900">{editingId ? 'Edit Member' : 'Add New Member'}</DialogTitle> {/* Title text is dark */}
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                <Input id="name" className="text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
                <Input id="role" className="text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                <Textarea id="description" className="text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label htmlFor="photo" className="text-sm font-medium text-gray-700">Photo</label>
                <Input id="photo" className="text-gray-900 border-gray-300 file:text-gray-900 file:bg-gray-100 file:border-none file:mr-4 file:py-2 file:px-4 file:rounded-md" type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
              </div>
              <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Save'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow> :
            team.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-8">No members found</TableCell></TableRow> :
            team.map(member => (
              <TableRow key={member.id}>
                <TableCell>
                  {member.photo_url ? <img src={member.photo_url} alt={member.name} className="w-10 h-10 rounded-full object-cover" /> : <User className="w-10 h-10 text-gray-300" />}
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingId(member.id); setFormData({ name: member.name, role: member.role, description: member.description }); setIsDialogOpen(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminEditorialTeamPage;
