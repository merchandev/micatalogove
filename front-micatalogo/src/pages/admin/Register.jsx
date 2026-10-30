import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { Mail, Lock, User, Store, Globe, Palette, AlertCircle, ArrowRight, CheckCircle, ChevronDown, Eye, EyeOff } from 'lucide-react';

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
  const [domainChecking, setDomainChecking] = useState(false);
  const [domainCheck, setDomainCheck] = useState(null);
  const [domainTouched, setDomainTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const themes = [
    { id: 'boutique-demo', name: 'Boutique de Ropa' },
    { id: 'postres-demo', name: 'Repostería y Dulces' },
    { id: 'tech-demo', name: 'Tecnología y Gadgets' },
    { id: 'restaurant-demo', name: 'Restaurante / Delivery' },
    { id: 'minimal-demo', name: 'Minimalista Clásico' }
  ];

  const normalizeDomain = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const validationMessage = (err) => {
    const errors = err.response?.data?.errors;
    if (errors) {
      const firstKey = Object.keys(errors)[0];
      return errors[firstKey]?.[0] || 'Revisa los datos del formulario.';
    }

    return err.response?.data?.message || 'Error al registrar. Por favor, intente nuevamente.';
  };

  useEffect(() => {
    if (!formData.domain || formData.domain.length < 3) {
      setDomainCheck(null);
      setDomainChecking(false);
      return;
    }

    setDomainChecking(true);
    const timeout = setTimeout(async () => {
      try {
        const response = await api.get('/domain-availability', {
          params: { domain: formData.domain },
        });
        setDomainCheck(response.data);
      } catch (err) {
        setDomainCheck(null);
      } finally {
        setDomainChecking(false);
      }
    }, 450);

    return () => clearTimeout(timeout);
  }, [formData.domain]);

  const handleStoreNameChange = (value) => {
    setFormData((current) => ({
      ...current,
      store_name: value,
      domain: domainTouched ? current.domain : normalizeDomain(value),
    }));
  };

  const handleDomainChange = (value) => {
    setDomainTouched(true);
    setFormData((current) => ({ ...current, domain: normalizeDomain(value) }));
  };

  const applySuggestion = (domain) => {
    setDomainTouched(true);
    setFormData((current) => ({ ...current, domain }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (domainCheck && !domainCheck.available) {
      setError('Ese enlace de tienda ya esta ocupado. Elige una sugerencia o escribe otro.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/register', formData);
      setSuccess(true);
    } catch (err) {
      setError(validationMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const domainUnavailable = domainCheck && !domainCheck.available;
  const submitDisabled = loading || domainChecking || domainUnavailable;

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
            <h2 className="text-3xl font-black text-white mb-4">¡Tienda creada exitosamente!</h2>
            <p className="text-gray-400 mb-4">
              Tu tienda <strong className="text-white">{formData.store_name}</strong> ya está lista. Te enviamos un correo a <strong className="text-white">{formData.email}</strong>: confírmalo para publicar tu catálogo en:
            </p>
            <a
              href={`/${formData.domain}`}
              target="_blank"
              rel="noreferrer"
              className="block mb-6 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-accent hover:text-accentHover font-mono text-sm break-all"
            >
              {window.location.origin}/{formData.domain}
            </a>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full py-3 px-4 bg-accent hover:bg-accentHover text-white rounded-xl font-bold transition-all flex justify-center items-center gap-2 group"
              >
                Ir al inicio de sesión
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to={`/${formData.domain}`}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all flex justify-center items-center gap-2"
              >
                Ver mi página de catálogo
              </Link>
            </div>
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
              <h2 className="text-2xl font-bold text-white mb-2">Prueba tu tienda durante 7 días</h2>
              <p className="text-gray-400 text-sm">Después de la prueba, continúa por USD 5 al mes.</p>
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
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-gray-500 transition-all"
                    placeholder="Contraseña (mínimo 8 caracteres)"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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
                    onChange={(e) => handleStoreNameChange(e.target.value)}
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
                    onChange={(e) => handleDomainChange(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500 ml-1">Tu enlace será: {window.location.host}/{formData.domain || 'nombre-de-tienda'}</p>
                  {formData.domain.length > 0 && formData.domain.length < 3 && (
                    <p className="mt-2 text-xs text-yellow-400 ml-1">La URL debe tener al menos 3 caracteres.</p>
                  )}
                  {domainChecking && (
                    <p className="mt-2 text-xs text-gray-400 ml-1">Verificando disponibilidad...</p>
                  )}
                  {!domainChecking && domainCheck?.available && (
                    <p className="mt-2 text-xs text-green-400 ml-1">Disponible.</p>
                  )}
                  {!domainChecking && domainUnavailable && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-red-400 ml-1">{domainCheck.message}</p>
                      {domainCheck.suggestions?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {domainCheck.suggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => applySuggestion(suggestion)}
                              className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-semibold hover:bg-accent/20"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Palette className="h-5 w-5 text-gray-500" />
                  </div>
                  <select
                    required
                    className="w-full pl-10 pr-10 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white appearance-none transition-all cursor-pointer"
                    value={formData.theme}
                    onChange={(e) => setFormData({...formData, theme: e.target.value})}
                  >
                    {themes.map(theme => (
                      <option key={theme.id} value={theme.id} className="bg-[#0D1310] text-white py-2">{theme.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitDisabled}
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
