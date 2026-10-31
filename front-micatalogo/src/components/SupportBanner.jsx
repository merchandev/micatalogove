import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SupportBanner() {
  const { user, endSupport } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const support = user?.support_session;
  if (!support) return null;
  const finish = async () => {
    setBusy(true); setError('');
    try { await endSupport(); }
    catch (err) { setError(err.response?.data?.message || 'No pudimos cerrar la asistencia. Inténtalo de nuevo.'); setBusy(false); }
  };
  return <section className="support-banner" aria-label="Modo de asistencia"><div><strong>Asistencia: {support.tenant_name}</strong><p>Estás trabajando en el panel de {user.name}. Los cambios quedan registrados.</p><small>Hasta las {new Date(support.expires_at).toLocaleTimeString('es-VE', {hour:'2-digit', minute:'2-digit'})}. Las contraseñas y los pagos se gestionan fuera de la asistencia.</small>{error && <p role="alert">{error}</p>}</div><button className="platform-primary" disabled={busy} onClick={finish}>{busy ? 'Volviendo…' : 'Volver al superadmin'}</button></section>;
}
