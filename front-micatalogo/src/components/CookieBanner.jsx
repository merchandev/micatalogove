import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings, X, Check } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const prefs = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const prefs = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    setIsVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && !showSettings && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 pointer-events-none flex justify-center"
          >
            <div className="bg-[#0D1310] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
              <div className="flex-1 text-sm text-gray-300">
                <h3 className="text-lg font-bold text-white mb-2">Utilizamos cookies</h3>
                <p>
                  MiCatálogo utiliza cookies propias y de terceros para mejorar tu experiencia, analizar nuestro tráfico y personalizar los anuncios. Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias. Lee más en nuestra <Link to="/cookies" className="text-accent hover:underline">Política de Cookies</Link>.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10 text-sm whitespace-nowrap"
                >
                  Configurar
                </button>
                <button 
                  onClick={handleRejectAll}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10 text-sm whitespace-nowrap"
                >
                  Rechazar no esenciales
                </button>
                <button 
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-lg bg-accent hover:bg-accentHover text-white font-semibold transition-colors text-sm whitespace-nowrap shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Aceptar todas
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D1310] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-accent" /> Configuración de Cookies
                </h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                {/* Strictly Necessary */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-1">Estrictamente Necesarias</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Son fundamentales para el funcionamiento de la web (inicio de sesión, seguridad, etc.). No se pueden desactivar.</p>
                  </div>
                  <div className="mt-1 flex items-center justify-center w-10 h-6 bg-accent rounded-full opacity-50 shrink-0">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-2"></div>
                  </div>
                </div>
                
                {/* Analytics */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-1">Analíticas</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Nos ayudan a entender cómo interactúas con la web, recopilando datos de forma anónima para mejorar el servicio.</p>
                  </div>
                  <button 
                    onClick={() => setPreferences({...preferences, analytics: !preferences.analytics})}
                    className={`mt-1 flex items-center w-10 h-6 rounded-full transition-colors shrink-0 ${preferences.analytics ? 'bg-accent' : 'bg-gray-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.analytics ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </button>
                </div>
                
                {/* Marketing */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-1">Marketing y Publicidad</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Se utilizan para mostrarte anuncios relevantes y medir la eficacia de nuestras campañas publicitarias.</p>
                  </div>
                  <button 
                    onClick={() => setPreferences({...preferences, marketing: !preferences.marketing})}
                    className={`mt-1 flex items-center w-10 h-6 rounded-full transition-colors shrink-0 ${preferences.marketing ? 'bg-accent' : 'bg-gray-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.marketing ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </button>
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-4">
                <button 
                  onClick={handleAcceptSelected}
                  className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accentHover text-white font-semibold transition-colors text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Guardar Preferencias
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
