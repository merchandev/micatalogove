import { useEffect, useState } from 'react';
import { MailCheck } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [now, setNow] = useState(Date.now);
  const deadline = user?.email_activation?.deadline_at;
  const remaining = deadline ? Math.max(0, new Date(deadline).getTime() - now) : 0;
  const expired = remaining === 0;
  const totalMinutes = Math.ceil(remaining / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const timer = setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);

  const resend = async () => {
    setSending(true);
    try {
      const { data } = await api.post('/email/verification-notification');
      setMessage(data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'No pudimos enviar el correo. Inténtalo más tarde.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div role="status" className="mb-6 flex flex-wrap justify-between items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
      <div className="text-sm">
      <p className="flex items-center gap-2 font-semibold">
        <MailCheck className="w-4 h-4 text-amber-300 shrink-0" />
        {expired ? 'Confirma tu correo para reactivar tu catálogo.' : `Tu tienda ya está visible. Actívala en ${hours} h ${minutes} min.`}
      </p>
      <p className="mt-2 text-gray-400">{expired ? 'El plazo de 24 horas terminó. Tus datos se conservan; confirma el enlace enviado a tu correo para completar la activación.' : `Tienes 24 horas desde el registro para confirmar ${user?.email}. Puedes seguir preparando y compartiendo tu tienda mientras tanto.`}</p>
      {deadline && <p className="mt-1 text-xs text-gray-400">Plazo: {new Date(deadline).toLocaleString('es-VE', {dateStyle:'medium', timeStyle:'short'})}</p>}
      {message && <p className="mt-2">{message}</p>}
      </div>
      <button type="button" onClick={resend} disabled={sending} className="text-accent text-sm font-bold disabled:opacity-50">
        {sending ? 'Enviando...' : 'Reenviar correo'}
      </button>
    </div>
  );
}
