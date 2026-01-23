import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Image as ImageIcon, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { inputSanitizer } from '@/lib/inputSanitizer';
import { csrf } from '@/lib/csrf';

const CATEGORIES = ["Kegiatan", "Pengumuman", "Artikel", "Opini", "Lainnya"];

const AdminNewsForm = ({ initialData, isEditMode = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Kegiatan',
    status: 'draft',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        content: initialData.content || '',
        category: initialData.category || 'Kegiatan',
        status: initialData.status || 'draft',
        image_url: initialData.image_url || ''
      });
      if (initialData.image_url) {
        setImagePreview(initialData.image_url);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum image size is 2MB",
          variant: "destructive"
        });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CSRF Protection
    if (!csrf.validateToken(sessionStorage.getItem('csrf_token'))) {
       toast({ title: "Security Error", description: "Invalid form token. Please refresh.", variant: "destructive" });
       return;
    }

    if (!formData.title || !formData.content) {
      toast({ title: "Validation Error", description: "Title and Content are required.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Sanitize Inputs
      const sanitizedData = inputSanitizer.sanitizeForm(formData);
      const imageUrl = await uploadImage();

      const payload = {
        title: sanitizedData.title,
        description: sanitizedData.description,
        content: sanitizedData.content, // Note: Rich text might need separate handling, simplified here
        category: sanitizedData.category,
        status: sanitizedData.status,
        image_url: imageUrl,
        author_id: adminUser.id
      };

      let error;
      if (isEditMode) {
        const { error: updateError } = await supabase
          .from('news')
          .update(payload)
          .eq('id', initialData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('news')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: isEditMode ? "Article Updated" : "Article Created",
        description: "Content has been saved successfully.",
        className: "bg-green-50 border-green-200 text-green-900"
      });

      navigate('/admin/dashboard');

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Save Failed",
        description: error.message || "An error occurred while saving.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate CSRF Token on mount
  useEffect(() => {
    csrf.generateToken();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </h1>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/dashboard')}
          className="text-slate-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-slate-50">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={handleChange}
                    className="w-4 h-4 text-sky-600"
                  />
                  <span className="text-sm text-slate-700">Draft</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-slate-50">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm text-slate-700">Published</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Featured Image</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative group h-48 flex items-center justify-center">
              {imagePreview ? (
                <div className="relative h-full w-full">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <p className="text-white text-sm font-medium">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <p className="text-sm">Upload Image (Max 2MB)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
            placeholder="Short summary for preview cards..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content <span className="text-red-500">*</span></label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="12"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            placeholder="Write your article content here..."
            required
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
             <AlertCircle className="w-4 h-4" />
             Inputs are automatically sanitized.
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 text-white min-w-[150px]"
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Article</>}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminNewsForm;