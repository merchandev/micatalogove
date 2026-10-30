import { useEffect, useState } from 'react';
import { Clock3, CreditCard, CheckCircle2 } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { isSuperAdmin } from '../../lib/permissions';

const date = value => value ? new Date(value).toLocaleString('es-VE', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const labels = { trial: 'En prueba', active: 'Activa', expired: 'Vencida', pending: 'En revisión', approved: 'Aprobado', rejected: 'Rechazado' };

export default function Subscription() {
  const { user } = useAuth();
  const reviewMode = isSuperAdmin(user);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const endpoint = reviewMode ? '/admin/subscriptions/payments' : '/admin/subscription';
  const load = async () => {
    try {
      const response = await api.get(endpoint);
      setData(response.data);
    } catch (err) { setError(err.response?.data?.message || 'No pudimos cargar la suscripción.'); }
  };
  useEffect(() => {
    api.get(endpoint).then(response => setData(response.data)).catch(err => setError(err.response?.data?.message || 'No pudimos cargar la suscripción.'));
  }, [endpoint]);

  const report = async event => {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      await api.post('/admin/subscription/payments', { reference: reference.trim(), notes });
      setReference(''); setNotes('');
      setMessage('Reporte recibido. La mensualidad se activará después de verificar el pago.');
      await load();
    } catch (err) {
      setError(Object.values(err.response?.data?.errors || {}).flat()[0] || err.response?.data?.message || 'No pudimos reportar el pago.');
    } finally { setBusy(false); }
  };
  const review = async (payment, status) => {
    if (!window.confirm(status === 'approved' ? '¿Verificaste este pago? Aprobarlo activará un mes de servicio.' : '¿Rechazar este reporte de pago?')) return;
    setBusy(true); setError('');
    try {
      await api.put(`/admin/subscriptions/payments/${payment.id}`, { status });
      await load();
      setMessage(status === 'approved' ? 'Mensualidad activada.' : 'Reporte rechazado.');
    } catch (err) { setError(err.response?.data?.message || 'No pudimos revisar el pago.'); }
    finally { setBusy(false); }
  };
  const subscription = data?.subscription;
  const payments = reviewMode ? (data || []) : (data?.payments || []);
  const pending = payments.some(payment => payment.status === 'pending');

  return (
    <div className="max-w-5xl space-y-7">
      <header><h1 className="text-3xl font-bold">{reviewMode ? 'Suscripciones' : 'Mi suscripción'}</h1><p className="text-gray-400 mt-2">{reviewMode ? 'Verifica cada pago antes de activar el servicio de una tienda.' : 'Tu plan, fechas de acceso e historial de mensualidades.'}</p></header>
      {error && <p role="alert" className="border border-red-500/30 bg-red-500/10 text-red-200 p-4 rounded-xl">{error}</p>}
      {message && <p role="status" className="border border-accent/30 bg-accent/10 p-4 rounded-xl">{message}</p>}
      {!data && !error && <p role="status">Cargando…</p>}
      {subscription && <>
        <section className="bg-cardDark border border-borderDark rounded-2xl p-7">
          <div className="flex justify-between gap-4 flex-wrap"><div><p className="text-accent font-semibold">{subscription.plan.name}</p><h2 className="text-4xl font-black">USD {Number(subscription.plan.monthly_price).toFixed(2)} <span className="text-base font-normal text-gray-400">/ mes</span></h2></div><span className={`self-start px-4 py-2 rounded-full ${subscription.has_access ? 'bg-accent/10 text-accent' : 'bg-amber-500/10 text-amber-300'}`}>{labels[subscription.status]}</span></div>
          <div className="grid sm:grid-cols-2 gap-5 mt-7 text-sm"><div><p className="text-gray-400 flex gap-2 items-center"><Clock3 className="w-4 h-4" />Tu prueba termina</p><p className="mt-2 font-semibold">{date(subscription.trial_ends_at)}</p>{subscription.status === 'trial' && <p className="text-accent mt-1">{subscription.trial_days_remaining} días restantes</p>}</div><div><p className="text-gray-400 flex gap-2 items-center"><CheckCircle2 className="w-4 h-4" />Servicio pagado hasta</p><p className="mt-2 font-semibold">{date(subscription.subscribed_until)}</p></div></div>
          {!subscription.has_access && <p className="mt-6 text-amber-200">Tu catálogo público está pausado. Puedes consultar tus datos; renueva para volver a publicar y realizar cambios.</p>}
          <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-gray-300 text-sm">{subscription.plan.features.map(feature => <li key={feature}>✓ {feature}</li>)}</ul>
        </section>
        <form onSubmit={report} className="bg-cardDark border border-borderDark rounded-2xl p-7 space-y-4">
          <h2 className="text-xl font-bold flex gap-2 items-center"><CreditCard className="w-5 h-5 text-accent" />Reportar mensualidad</h2>
          <p className="text-gray-400 text-sm">Primero acuerda el método y los datos de pago con soporte. Este formulario solo reporta el pago; no cobra ni activa automáticamente la suscripción. Si pagas antes de vencer, conservas el tiempo que te queda.</p>
          {pending ? <p className="text-amber-200">Ya tienes un pago en revisión.</p> : <><label className="block text-sm">Referencia del pago<input required maxLength={150} value={reference} onChange={event => setReference(event.target.value)} className="mt-2 block w-full bg-gray-900 border border-borderDark rounded-lg p-3" /></label><label className="block text-sm">Observaciones<textarea maxLength={1000} value={notes} onChange={event => setNotes(event.target.value)} className="mt-2 block w-full bg-gray-900 border border-borderDark rounded-lg p-3" /></label><button disabled={busy} className="bg-accent hover:bg-accentHover disabled:opacity-50 px-5 py-3 rounded-lg font-bold">{busy ? 'Enviando…' : 'Enviar a revisión'}</button></>}
        </form>
      </>}
      <section className="bg-cardDark border border-borderDark rounded-2xl overflow-x-auto">
        <h2 className="text-xl font-bold p-6">{reviewMode ? 'Reportes de pago' : 'Historial de pagos'}</h2>
        <table className="w-full text-left text-sm"><thead className="bg-white/5 text-gray-400"><tr>{reviewMode && <th className="p-4">Tienda</th>}<th className="p-4">Referencia</th><th className="p-4">Importe</th><th className="p-4">Estado</th><th className="p-4">Servicio hasta</th>{reviewMode && <th className="p-4">Revisión</th>}</tr></thead><tbody>{payments.map(payment => <tr key={payment.id} className="border-t border-borderDark">{reviewMode && <td className="p-4">{payment.tenant?.name}<p className="text-gray-500 text-xs">/{payment.tenant?.domain}</p></td>}<td className="p-4"><p>{payment.reference}</p><p className="text-gray-400 text-xs mt-1 whitespace-pre-wrap">{payment.notes}</p></td><td className="p-4">USD {payment.amount}</td><td className="p-4">{labels[payment.status]}</td><td className="p-4">{date(payment.period_ends_at)}</td>{reviewMode && <td className="p-4">{payment.status === 'pending' && <div className="flex gap-4"><button disabled={busy} onClick={() => review(payment, 'approved')} className="text-accent disabled:opacity-50">Aprobar</button><button disabled={busy} onClick={() => review(payment, 'rejected')} className="text-red-300 disabled:opacity-50">Rechazar</button></div>}</td>}</tr>)}{data && payments.length === 0 && <tr><td colSpan={reviewMode ? 6 : 4} className="p-6 text-gray-400">Todavía no hay reportes de pago.</td></tr>}</tbody></table>
      </section>
    </div>
  );
}
