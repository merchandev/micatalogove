import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Lock, Mail } from 'lucide-react';
import api from '../../api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const initialEmail = searchParams.get('email') || '';
  const [formData, setFormData] = useState({
    email: initialEmail,
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const missingToken = useMemo(() => !token, [token]);

  const validationMessage = (err) => {
    const errors = err.response?.data?.errors;
    if (errors) {
      const firstKey = Object.keys(errors)[0];
      return errors[firstKey]?.[0] || 'Revisa los datos del formulario.';
    }

    return err.response?.data?.message || 'No pudimos actualizar la contraseña.';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/reset-password', {
        token,
        ...formData,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate('/admin/login'), 1800);
    } catch (err) {
      setError(validationMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const setField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="auth-page min-h-screen bg-[#060A08] flex items-center justify-center p-4 text-white">
      <div className="max-w-md w-full bg-[#0D1310] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <Link to="/admin/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al login
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">Nueva contraseña</h1>
          <p className="text-gray-400 text-sm">Crea una contraseña nueva para recuperar el acceso a tu cuenta.</p>
        </div>

        {missingToken && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 text-red-300 rounded-xl text-sm">
            El enlace de recuperacion no es valido. Solicita uno nuevo.
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl text-sm flex items-start gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 text-red-300 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-gray-500"
              placeholder="Correo electronico"
              value={formData.email}
              onChange={(event) => setField('email', event.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="password"
              required
              minLength={8}
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-gray-500"
              placeholder="Nueva contraseña"
              value={formData.password}
              onChange={(event) => setField('password', event.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="password"
              required
              minLength={8}
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-gray-500"
              placeholder="Confirmar contraseña"
              value={formData.password_confirmation}
              onChange={(event) => setField('password_confirmation', event.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || missingToken}
            className="w-full bg-accent hover:bg-accentHover disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition"
          >
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
