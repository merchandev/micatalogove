import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../../api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const hash = searchParams.get('hash');
  const expires = searchParams.get('expires');
  const signature = searchParams.get('signature');
  const [state, setState] = useState(() => (id && hash
    ? { status: 'loading', message: 'Confirmando tu correo...' }
    : { status: 'error', message: 'El enlace de confirmación está incompleto.' }));

  useEffect(() => {
    if (!id || !hash) return;
    api.get(`/email/verify/${encodeURIComponent(id)}/${encodeURIComponent(hash)}`, {
      params: { expires, signature },
    })
      .then(({ data }) => setState({ status: 'ok', message: data.message }))
      .catch((err) => setState({
        status: 'error',
        message: err.response?.status === 403
          ? 'El enlace venció o no es válido. Entra a tu panel y solicita uno nuevo.'
          : err.response?.data?.message || 'No pudimos confirmar tu correo. Inténtalo más tarde.',
      }));
  }, [id, hash, expires, signature]);

  const Icon = state.status === 'error' ? XCircle : CheckCircle;

  return (
    <div className="min-h-screen bg-[#060A08] flex items-center justify-center p-4 text-white">
      <div className="max-w-md w-full bg-[#0D1310] border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
        <Icon className={`w-12 h-12 mx-auto mb-6 ${state.status === 'error' ? 'text-red-400' : 'text-accent'}`} />
        <h1 className="text-2xl font-black mb-3">Confirmación de correo</h1>
        <p role="status" className="text-gray-400 mb-8">{state.message}</p>
        {state.status !== 'loading' && (
          <Link to="/admin/dashboard" className="inline-block w-full py-3 px-4 bg-accent hover:bg-accentHover text-white rounded-xl font-bold">
            Ir a mi panel
          </Link>
        )}
      </div>
    </div>
  );
}
