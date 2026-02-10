
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Pencil, Trash2, Search, User } from 'lucide-react';

const AdminTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', specialization: '', description: '' });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Using 'users' table instead of 'teachers', filtering by role 'teacher'
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTeachers(data || []);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      toast({ title: 'Error', description: "Failed to load teachers list.", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let photoUrl = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('teachers-photos') // Ensure this bucket exists or use a generic one
          .upload(fileName, file);
        
        if (uploadError) {
           // Fallback if bucket doesn't exist, just log it for now or handle gracefully
           console.error("Upload error (bucket might be missing):", uploadError);
           // throw uploadError; // Optional: decide if we want to block save on image fail
        } else {
           const { data: urlData } = supabase.storage
            .from('teachers-photos')
            .getPublicUrl(fileName);
           photoUrl = urlData.publicUrl;
        }
      }

      // Mapping 'name' to 'nama_lengkap' in users table
      const payload = {
        nama_lengkap: formData.name,
        specialization: formData.specialization,
        description: formData.description,
        role: 'teacher', // Ensure role is set
        ...(photoUrl && { photo_url: photoUrl })
      };

      if (editingId) {
        const { error } = await supabase
          .from('users')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Updated', description: 'Teacher updated successfully' });
      } else {
        // For new users, we need an ID. Since this is the users table, 
        // ideally this should be linked to auth, but for a directory we can generate a UUID.
        const newId = crypto.randomUUID();
        const { error } = await supabase
          .from('users')
          .insert({ ...payload, id: newId });
        if (error) throw error;
        toast({ title: 'Created', description: 'Teacher added successfully' });
      }

      setIsDialogOpen(false);
      fetchTeachers();
      resetForm();
    } catch (err) {
      console.error("Error saving teacher:", err);
      toast({ title: 'Error', description: err.message || "Failed to save teacher.", variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Teacher deleted successfully' });
      fetchTeachers();
    } catch (err) {
      console.error("Error deleting teacher:", err);
      toast({ title: 'Error', description: "Failed to delete teacher.", variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', specialization: '', description: '' });
    setFile(null);
  };

  const filteredTeachers = teachers.filter(t => 
    (t.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.specialization || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Teachers</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Teacher</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <label className="text-sm font-medium">Specialization</label>
                <Input value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Photo</label>
                <Input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 mb-6 bg-white p-2 rounded-lg border w-full max-w-md">
        <Search className="w-4 h-4 text-gray-400" />
        <Input 
          className="border-0 focus-visible:ring-0" 
          placeholder="Search teachers..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : filteredTeachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">No teachers found</TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map(teacher => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    {teacher.photo_url ? (
                      <img src={teacher.photo_url} alt={teacher.nama_lengkap} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{teacher.nama_lengkap}</TableCell>
                  <TableCell>{teacher.specialization}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setEditingId(teacher.id);
                      setFormData({ 
                        name: teacher.nama_lengkap || '', 
                        specialization: teacher.specialization || '', 
                        description: teacher.description || '' 
                      });
                      setIsDialogOpen(true);
                    }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(teacher.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminTeachersPage;
