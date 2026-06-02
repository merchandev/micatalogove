import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  useEffect(() => {
    if (isEdit) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`http://localhost:8000/api/admin/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        title: response.data.title,
        excerpt: response.data.excerpt || '',
        content: response.data.content,
        featured_image: response.data.featured_image || '',
        status: response.data.status
      });
    } catch (err) {
      setError('Error al cargar la publicación.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (isEdit) {
        await axios.put(`http://localhost:8000/api/admin/posts/${id}`, formData, config);
      } else {
        await axios.post('http://localhost:8000/api/admin/posts', formData, config);
      }
      
      navigate('/admin/blog');
    } catch (err) {
      setError('Error al guardar la publicación. Verifique los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/admin/blog" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-400">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-white">{isEdit ? 'Editar Publicación' : 'Nueva Publicación'}</h2>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-[#121815] border border-white/5 p-6 rounded-xl space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Título *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-[#1A221E] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                placeholder="Ej. 10 estrategias de venta por WhatsApp"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">URL de Imagen Destacada</label>
              <input
                type="text"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                className="w-full bg-[#1A221E] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Extracto (Descripción Corta)</label>
              <textarea
                name="excerpt"
                rows="3"
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full bg-[#1A221E] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent resize-none"
                placeholder="Un breve resumen que aparecerá en la tarjeta de la noticia..."
              ></textarea>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#1A221E] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
            
            {formData.featured_image && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Vista previa de imagen</label>
                <div className="w-full h-32 bg-black/50 rounded-lg overflow-hidden border border-white/5">
                  <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Contenido *</label>
          <div className="bg-[#1A221E] text-white rounded-lg border border-white/10 overflow-hidden quill-editor-wrapper">
            <style>{`
              .quill-editor-wrapper .ql-toolbar {
                border: none;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                background-color: rgba(255,255,255,0.02);
              }
              .quill-editor-wrapper .ql-container {
                border: none;
                min-height: 400px;
                font-size: 16px;
              }
              .quill-editor-wrapper .ql-stroke { stroke: #9ca3af; }
              .quill-editor-wrapper .ql-fill { fill: #9ca3af; }
              .quill-editor-wrapper .ql-picker { color: #9ca3af; }
            `}</style>
            <ReactQuill 
              theme="snow" 
              modules={modules}
              value={formData.content} 
              onChange={handleContentChange} 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2.5 bg-accent hover:bg-accentHover text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Publicación'}
          </button>
        </div>
      </form>
    </div>
  );
}
