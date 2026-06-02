import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/posts/${slug}`);
      setPost(response.data);
    } catch (err) {
      setError('Artículo no encontrado.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060A08] flex items-center justify-center">
        <div className="text-white">Cargando artículo...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#060A08] flex flex-col items-center justify-center">
        <h1 className="text-3xl text-white mb-4">404</h1>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link to="/blog" className="text-accent hover:underline">Volver al Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060A08] text-white font-sans selection:bg-accent selection:text-white flex flex-col">
      <PublicNavbar />
      
      <div className="flex-grow pt-32 pb-24 w-full">
        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <Link to="/blog" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a todas las noticias
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-white">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center text-sm text-gray-400 space-x-6">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-accent" /> 
              {new Date(post.published_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2 text-accent" /> 
              {post.user?.name || 'Equipo MiCatálogo'}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-black/50">
              <img 
                src={post.featured_image} 
                alt={post.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article 
            className="prose prose-invert prose-lg prose-emerald max-w-none 
              prose-headings:text-white prose-headings:font-bold
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:border prose-img:border-white/10
              prose-blockquote:border-l-accent prose-blockquote:bg-white/[0.02] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </main>
      </div>
      
      <PublicFooter />
    </div>
  );
}
