import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import api from '../../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'No pudimos enviar el enlace. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen bg-[#060A08] flex items-center justify-center p-4 text-white">
      <div className="max-w-md w-full bg-[#0D1310] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <Link to="/admin/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al login
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">Recuperar contraseña</h1>
          <p className="text-gray-400 text-sm">Escribe tu correo y te enviaremos un enlace para crear una nueva contraseña.</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl text-sm">
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accentHover disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition"
          >
            <Send className="w-5 h-5" />
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
      </div>
    </div>
  );
}
