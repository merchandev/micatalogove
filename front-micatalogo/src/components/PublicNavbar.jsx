import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const PublicNavbar = () => {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed w-full z-50 bg-bgDark/60 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight text-white hover:text-accent transition-colors">
              Mi<span className="text-accent">Catálogo</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-accent' : 'text-gray-300 hover:text-accent'}`}>Inicio</Link>
            <Link to="/demos" className={`text-sm font-medium transition-colors ${location.pathname === '/demos' ? 'text-accent' : 'text-gray-300 hover:text-accent'}`}>Demos</Link>
            <Link to="/blog" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/blog') ? 'text-accent' : 'text-gray-300 hover:text-accent'}`}>Blog</Link>
            <Link to="/planes" className={`text-sm font-medium transition-colors ${location.pathname === '/planes' ? 'text-accent' : 'text-gray-300 hover:text-accent'}`}>Planes</Link>
            <Link to="/funcionalidades" className={`text-sm font-medium transition-colors ${location.pathname === '/funcionalidades' ? 'text-accent' : 'text-gray-300 hover:text-accent'}`}>Funcionalidades</Link>
            <Link to="/contacto" className={`text-sm font-medium transition-colors ${location.pathname === '/contacto' ? 'text-accent' : 'text-gray-300 hover:text-accent'}`}>Contacto</Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/admin/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Ingresar</Link>
            <Link to="/admin/login" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accentHover text-white text-sm font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]">
              Crear tienda
            </Link>
            <button className="text-gray-300 hover:text-white transition-colors">
               {/* Moon icon placeholder for dark mode */}
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default PublicNavbar;
