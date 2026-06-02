import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import BoutiqueDemo from './demos/BoutiqueDemo';
import PostresDemo from './demos/PostresDemo';
import TechDemo from './demos/TechDemo';
import RestaurantDemo from './demos/RestaurantDemo';
import MinimalDemo from './demos/MinimalDemo';

export default function StoreFront() {
  const { domain } = useParams();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await api.get(`/store/${domain}`);
        setTenant(response.data.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [domain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Tienda no encontrada</h1>
        <p className="text-gray-500 mb-8 max-w-md">La URL a la que intentas acceder no existe o la tienda ha sido dada de baja.</p>
        <Link to="/" className="bg-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-accentHover transition-colors">
          Crear mi propia tienda
        </Link>
      </div>
    );
  }

  // Renderizar la plantilla correspondiente basada en el tenant.theme
  switch (tenant.theme) {
    case 'boutique-demo':
      return <BoutiqueDemo tenant={tenant} />;
    case 'postres-demo':
      return <PostresDemo tenant={tenant} />;
    case 'tech-demo':
      return <TechDemo tenant={tenant} />;
    case 'restaurant-demo':
      return <RestaurantDemo tenant={tenant} />;
    case 'minimal-demo':
      return <MinimalDemo tenant={tenant} />;
    default:
      return <BoutiqueDemo tenant={tenant} />; // Fallback
  }
}
