import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { ExternalLink } from 'lucide-react';

export default function Demos() {
  const demos = [
    {
      id: 'boutique',
      title: 'Boutique de Ropa',
      description: 'Diseño elegante y minimalista, ideal para moda, joyas o accesorios.',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800',
      path: '/tienda/boutique-demo',
      color: 'bg-[#A68A61]'
    },
    {
      id: 'postres',
      title: 'Repostería y Dulces',
      description: 'Colores vibrantes, esquinas redondeadas y un estilo amigable que abre el apetito.',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=800',
      path: '/tienda/postres-demo',
      color: 'bg-[#E55B7E]'
    },
    {
      id: 'tech',
      title: 'Tecnología (Modo Oscuro)',
      description: 'Estilo premium y futurista, perfecto para electrónica, gadgets y gaming.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      path: '/tienda/tech-demo',
      color: 'bg-blue-600'
    },
    {
      id: 'restaurant',
      title: 'Restaurante / Delivery',
      description: 'Layout para comida rápida o restaurantes, con tiempos de entrega e imágenes grandes.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
      path: '/tienda/restaurant-demo',
      color: 'bg-orange-500'
    },
    {
      id: 'minimal',
      title: 'Minimalista Clásico',
      description: 'Diseño extra limpio en blanco y negro para resaltar la fotografía de producto.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
      path: '/tienda/minimal-demo',
      color: 'bg-gray-900'
    }
  ];

  return (
    <div className="min-h-screen bg-[#060A08] text-white font-sans selection:bg-accent selection:text-white flex flex-col">
      <PublicNavbar />
      
      <div className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Demos de Catálogos</h1>
          <p className="text-xl text-gray-400">
            Explora ejemplos reales de cómo podría lucir tu tienda online con MiCatálogo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demos.map((demo) => (
            <div key={demo.id} className="bg-[#0D1310] border border-white/5 rounded-2xl overflow-hidden hover:border-accent/30 transition-colors group">
              <div className="w-full h-48 overflow-hidden bg-black/50">
                <img 
                  src={demo.image} 
                  alt={demo.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{demo.title}</h3>
                <p className="text-sm text-gray-400 mb-6">{demo.description}</p>
                <a 
                  href={demo.path}
                  className="inline-flex items-center px-4 py-2 bg-white/5 hover:bg-accent/10 text-accent hover:text-accentHover rounded-lg transition-colors font-medium border border-white/5 hover:border-accent/30"
                >
                  Ver Demo <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
}
