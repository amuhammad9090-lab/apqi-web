import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Image as ImageIcon, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { inputSanitizer } from '@/lib/inputSanitizer';
import { csrf } from '@/lib/csrf';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CATEGORIES = ["Kegiatan", "Pengumuman", "Artikel", "Opini", "Lainnya"];

// Quill modules configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'list', 'bullet', 'indent',
  'direction', 'align',
  'blockquote', 'code-block',
  'link', 'image', 'video'
];

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
    image_url: '',
    author_name: 'Admin APQI'
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
        image_url: initialData.image_url || '',
        author_name: initialData.author_name || 'Admin APQI'
      });
      if (initialData.image_url) {
        setImagePreview(initialData.image_url);
      }
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle content change from Quill editor
  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum image size is 2MB. Your file: " + (file.size / 1024 / 1024).toFixed(2) + "MB",
          variant: "destructive"
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPG, PNG, GIF, etc)",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      toast({
        title: "Image Selected",
        description: file.name + " ready to upload",
        className: "bg-green-50 border-green-200 text-green-900"
      });
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;

    console.log('Starting image upload...');
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(filePath);

    console.log('Public URL:', publicUrl);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== SUBMIT STARTED ===');
    
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
      const sanitizedData = {
        ...formData,
        title: inputSanitizer.sanitizeText(formData.title),
        description: inputSanitizer.sanitizeText(formData.description),
        author_name: inputSanitizer.sanitizeText(formData.author_name)
      };
      
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const payload = {
        title: sanitizedData.title,
        description: sanitizedData.description || '',
        content: formData.content, 
        category: sanitizedData.category,
        status: sanitizedData.status,
        image_url: imageUrl || '',
        author_id: adminUser?.uid || adminUser?.id || 'unknown',
        author_name: sanitizedData.author_name || 'Admin APQI',
        updated_at: new Date().toISOString()
      };

      if (!isEditMode) {
        payload.created_at = new Date().toISOString();
      }

      console.log('Final payload:', payload);

      let result, error;
      if (isEditMode) {
        const { data, error: updateError } = await supabase
          .from('news')
          .update(payload)
          .eq('id', initialData.id)
          .select();
        result = data;
        error = updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('news')
          .insert([payload])
          .select();
        result = data;
        error = insertError;
      }

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Success! Result:', result);
      
      toast({
        title: isEditMode ? "Article Updated" : "Article Created",
        description: "Content has been saved successfully.",
        className: "bg-green-50 border-green-200 text-green-900"
      });

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);

    } catch (error) {
      console.error('=== SUBMISSION ERROR ===');
      console.error('Error:', error);
      
      toast({
        title: "Save Failed",
        description: error.message || "An error occurred while saving.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log('=== SUBMIT ENDED ===');
    }
  };

  useEffect(() => {
    csrf.generateToken();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Author Name</label>
              <input
                type="text"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                placeholder="Admin APQI"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Featured Image {imagePreview && <span className="text-green-600 text-xs ml-2">(✓ Loaded)</span>}
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-sky-400 transition-all relative group min-h-[240px] flex items-center justify-center bg-slate-50">
              {imagePreview ? (
                <div className="relative w-full h-full min-h-[200px] flex items-center justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full max-h-[220px] object-contain rounded-lg shadow-md"
                    onError={(e) => {
                      console.error('Image preview failed to load');
                      toast({
                        title: "Preview Error",
                        description: "Failed to display image preview",
                        variant: "destructive"
                      });
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg cursor-pointer">
                    <p className="text-white text-sm font-medium px-4 py-2 bg-black/50 rounded-lg">
                      Click to change
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400 pointer-events-none">
                  <ImageIcon className="w-12 h-12 mb-3" />
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs mt-1">JPG, PNG, GIF (Max 2MB)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Upload featured image"
              />
            </div>
            {imageFile && (
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <span className="text-green-600">✓</span> {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
              </p>
            )}
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Content <span className="text-red-500">*</span>
            <span className="text-xs text-slate-500 ml-2">(Rich text editor with formatting)</span>
          </label>
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Write your article content here with rich formatting..."
              className="bg-white"
              style={{ height: '400px', marginBottom: '42px' }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
             <AlertCircle className="w-4 h-4" />
             Text inputs are sanitized. HTML formatting preserved in content.
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