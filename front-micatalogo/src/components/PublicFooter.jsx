import React from 'react';
import { Link } from 'react-router-dom';

const PublicFooter = () => {
  return (
    <footer className="py-12 border-t border-white/10 bg-[#080808] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white/50 hover:text-white transition-colors">
            Mi<span className="text-accent">Catálogo</span>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mb-6">© 2026 MiCatálogo Venezuela, C.A. Todos los derechos reservados.</p>
        <div className="flex justify-center space-x-6 text-sm text-gray-400 mb-6">
          <Link to="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
          <Link to="/aviso-legal" className="hover:text-white transition-colors">Aviso Legal</Link>
          <Link to="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link>
          <Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link>
        </div>
        <div className="flex justify-center space-x-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">TikTok</a>
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
