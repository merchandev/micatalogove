import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { Mail, Lock, User, Store, Globe, Palette, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    store_name: '',
    domain: '',
    theme: 'boutique-demo'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { registerLogin } = useAuth();

  const themes = [
    { id: 'boutique-demo', name: 'Boutique de Ropa' },
    { id: 'postres-demo', name: 'Repostería y Dulces' },
    { id: 'tech-demo', name: 'Tecnología y Gadgets' },
    { id: 'restaurant-demo', name: 'Restaurante / Delivery' },
    { id: 'minimal-demo', name: 'Minimalista Clásico' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/register', formData);
      registerLogin(response.data.user, response.data.token);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060A08] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0D1310] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

        {success ? (
          <div className="relative z-10 text-center py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">¡Tienda Creada!</h2>
            <p className="text-gray-400 mb-8">
              Tu tienda <strong className="text-white">{formData.store_name}</strong> ha sido configurada con éxito. Ya puedes empezar a subir tus productos y personalizarla.
            </p>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full py-3 px-4 bg-accent hover:bg-accentHover text-white rounded-xl font-bold transition-all flex justify-center items-center gap-2 group"
            >
              Ir al Panel de Control
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8 relative z-10">
              <Link to="/" className="inline-flex items-center justify-center gap-2 text-2xl font-black text-white mb-6">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <span className="text-white text-lg">M</span>
                </div>
                MiCatálogo
              </Link>
              <h2 className="text-2xl font-bold text-white mb-2">Crea tu tienda gratis</h2>
              <p className="text-gray-400 text-sm">Empieza a vender online en minutos.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 relative z-10">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {/* Datos del Usuario */}
              <div className="space-y-4 border-b border-white/5 pb-4">
                <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Tus Datos</h3>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-gray-500 transition-all"
                    placeholder="Tu Nombre Completo"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-gray-500 transition-all"
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-gray-500 transition-all"
                    placeholder="Contraseña (mínimo 8 caracteres)"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {/* Datos de la Tienda */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Tu Tienda</h3>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-gray-500 transition-all"
                    placeholder="Nombre de la Tienda"
                    value={formData.store_name}
                    onChange={(e) => setFormData({...formData, store_name: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-gray-500 transition-all"
                    placeholder="URL (ej: mitienda)"
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                  />
                  <p className="mt-1 text-xs text-gray-500 ml-1">Tu enlace será: micatalogo.com/tienda/{formData.domain || '...'}</p>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Palette className="h-5 w-5 text-gray-500" />
                  </div>
                  <select
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white appearance-none transition-all"
                    value={formData.theme}
                    onChange={(e) => setFormData({...formData, theme: e.target.value})}
                  >
                    {themes.map(theme => (
                      <option key={theme.id} value={theme.id}>{theme.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-accent hover:bg-accentHover text-white rounded-xl font-bold transition-all mt-4 flex justify-center items-center gap-2 group disabled:opacity-50"
              >
                {loading ? 'Creando tienda...' : 'Crear Tienda'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400 relative z-10">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/admin/login" className="text-accent hover:text-accentHover font-semibold transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
