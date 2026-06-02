import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching public posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060A08] text-white font-sans selection:bg-accent selection:text-white flex flex-col">
      <PublicNavbar />
      
      <div className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Blog y Novedades</h1>
          <p className="text-xl text-gray-400">
            Consejos de ventas, actualizaciones de la plataforma y guías para emprendedores en Venezuela.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Cargando artículos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-10">No hay artículos publicados en este momento.</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-[#0D1310] border border-white/5 rounded-2xl overflow-hidden hover:border-accent/30 transition-colors group flex flex-col">
                  {post.featured_image ? (
                    <div className="w-full h-48 overflow-hidden bg-black/50">
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[#1a241f] to-[#0a0f0d] flex items-center justify-center">
                      <span className="text-accent/20 text-4xl font-black">MiCatálogo</span>
                    </div>
                  )}
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(post.published_at).toLocaleDateString()}</span>
                      <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.user?.name || 'Admin'}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-gray-400 mb-6 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                    
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="inline-flex items-center text-sm font-semibold text-accent hover:text-white transition-colors"
                    >
                      Leer artículo <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <PublicFooter />
    </div>
  );
}
