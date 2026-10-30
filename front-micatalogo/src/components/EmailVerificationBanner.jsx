import { useState } from 'react';
import { MailCheck } from 'lucide-react';
import api from '../api';

export default function EmailVerificationBanner() {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

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
      <p className="text-sm flex items-center gap-2">
        <MailCheck className="w-4 h-4 text-amber-300 shrink-0" />
        {message || 'Confirma tu correo para publicar tu catálogo. Puedes preparar tu tienda mientras tanto.'}
      </p>
      <button type="button" onClick={resend} disabled={sending} className="text-accent text-sm font-bold disabled:opacity-50">
        {sending ? 'Enviando...' : 'Reenviar correo'}
      </button>
    </div>
  );
}
