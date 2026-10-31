import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search, X, RefreshCw } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const date = value => value ? new Date(value).toLocaleString('es-VE', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const money = value => `USD ${Number(value || 0).toFixed(2)}`;
const labels = { active: 'Activo', suspended: 'Suspendido', pending: 'Pendiente', trial: 'En prueba', expired: 'Vencida', approved: 'Aprobado', rejected: 'Rechazado' };
const errorText = error => Object.values(error.response?.data?.errors || {}).flat()[0] || error.response?.data?.message || 'No pudimos completar la operación.';
function Activation({ owner }) {
  if (!owner) return <span className="platform-badge">Sin propietario</span>;
  const activation = owner.email_activation;
  return <div><span className={`platform-badge ${activation?.verified ? 'good' : 'warning'}`}>{activation?.verified ? 'Confirmado' : activation?.can_publish ? 'En plazo de 24 h' : 'Plazo vencido'}</span>{!activation?.verified && <small className="block mt-2 text-gray-400">Hasta {date(activation?.deadline_at)}</small>}</div>;
}
function Pager({ meta, onPage }) {
  if (!meta || meta.last_page < 2) return null;
  return <div className="platform-pagination"><button disabled={meta.current_page <= 1} onClick={() => onPage(meta.current_page - 1)}>Anterior</button><span>Página {meta.current_page} de {meta.last_page} · {meta.total} registros</span><button disabled={meta.current_page >= meta.last_page} onClick={() => onPage(meta.current_page + 1)}>Siguiente</button></div>;
}

export default function PlatformOverview() {
  const { startSupport } = useAuth();
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', activation: '', subscription: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [clientPage, setClientPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailPage, setDetailPage] = useState(1);
  const [form, setForm] = useState({ name: '', domain: '', whatsapp_number: '', store_description: '', theme: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const dialog = useRef(null);
  useEffect(() => {
    let current = true;
    api.get('/admin/platform', { params: { ...filters, page, client_page: clientPage } })
      .then(({ data: result }) => { if (current) setData(result); })
      .catch(err => { if (current) setError(errorText(err)); });
    return () => { current = false; };
  }, [filters, page, clientPage, revision]);
  useEffect(() => {
    const node = dialog.current;
    if (selected && !node.open) node.showModal();
    else if (!selected && node.open) node.close();
  }, [selected]);
  useEffect(() => {
    if (!selected) return;
    let current = true;
    api.get(`/admin/platform/stores/${selected}`, { params: { page: detailPage } }).then(({ data: result }) => {
      if (!current) return;
      setDetail(result);
      const store = result.store;
      setForm({ name: store.name, domain: store.domain, whatsapp_number: store.whatsapp_number || '', store_description: store.store_description || '', theme: store.theme || 'boutique-demo' });
    }).catch(err => { if (current) setError(errorText(err)); });
    return () => { current = false; };
  }, [selected, detailPage, revision]);

  const run = async (operation, message) => {
    setBusy(true); setError(''); setNotice('');
    try { await operation(); setNotice(message); setRevision(value => value + 1); }
    catch (err) { setError(errorText(err)); }
    finally { setBusy(false); }
  };
  const filter = (field, value) => { setFilters(old => ({ ...old, [field]: value })); setPage(1); setClientPage(1); };
  const open = store => { setDetail(null); setDetailPage(1); setSelected(store.id); setError(''); setNotice(''); };
  const enterSupport = async store => {
    if (!window.confirm('¿Entrar al panel de ' + store.name + ' para asistencia? Tendrás sus permisos durante un máximo de 30 minutos y los cambios quedarán registrados.')) return;
    setBusy(true); setError('');
    try { await startSupport(store.id); }
    catch (err) { setError(errorText(err)); setBusy(false); }
  };
  const changeClientStatus = owner => {
    const action = owner.status === 'active' ? 'suspend' : 'approve';
    if (!window.confirm(`${action === 'suspend' ? 'Suspender' : 'Activar'} al cliente ${owner.name} y actualizar el estado de su tienda?`)) return;
    run(() => api.post(`/admin/users/${owner.id}/${action}`), 'Estado del cliente actualizado.');
  };
  const changeStoreStatus = store => {
    const status = store.status === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`${status === 'active' ? 'Reactivar' : 'Suspender'} la tienda ${store.name}? Esto no cambia el correo confirmado ni su período pagado.`)) return;
    run(() => api.patch(`/admin/platform/stores/${store.id}`, { status }), 'Estado de la tienda actualizado.');
  };
  const activate = store => {
    if (!window.confirm('¿Confirmar la activación de este cliente manualmente, sin esperar el enlace de correo? Esto no añade tiempo de suscripción ni levanta suspensiones.')) return;
    run(() => api.post('/admin/platform/stores/' + store.id + '/activation'), 'Activación confirmada por el superadmin.');
  };
  const review = (payment, status) => {
    if (!window.confirm(status === 'approved' ? `¿Verificaste el pago ${payment.reference} por ${money(payment.amount)}? Aprobarlo activará un mes de servicio.` : `¿Rechazar el pago ${payment.reference}?`)) return;
    run(() => api.put(`/admin/subscriptions/payments/${payment.id}`, { status }), status === 'approved' ? 'Pago aprobado y mensualidad activada.' : 'Reporte rechazado.');
  };
  const store = detail?.store;
  const stats = data?.summary;
  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Administración del sistema</p><h1>Tiendas y clientes</h1><p className="text-gray-400 mt-2">Activación, suscripción y mensualidades de todas las tiendas.</p></div><div className="flex gap-4 items-center"><button onClick={() => setRevision(value => value + 1)} className="inline-flex gap-2 items-center text-sm"><RefreshCw size={15} />Actualizar</button><Link to="/admin/users" className="platform-primary">Gestionar usuarios</Link></div></header>
    {error && !selected && <p role="alert" className="platform-alert">{error}</p>}{notice && !selected && <p role="status" className="platform-notice">{notice}</p>}
    {stats && <div className="platform-stats">{[['Tiendas', stats.stores], ['Clientes', stats.clients], ['Correo sin confirmar', stats.unverified_clients], ['Suscripciones pagadas', stats.paid_stores], ['Pagos por revisar', stats.pending_payments], ['Mensualidades aprobadas', money(stats.approved_subscription_total)]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>}
    <form className="platform-filters" onSubmit={event => { event.preventDefault(); filter('search', search.trim()); }}><label className="platform-search"><Search size={17} /><input aria-label="Buscar tienda o cliente" value={search} onChange={event => setSearch(event.target.value)} placeholder="Tienda, enlace, cliente o correo" /></label><button type="submit" className="platform-secondary">Buscar</button><select aria-label="Estado de tienda" value={filters.status} onChange={event => filter('status', event.target.value)}><option value="">Todos los estados</option><option value="active">Activas</option><option value="suspended">Suspendidas</option><option value="pending">Pendientes</option></select><select aria-label="Activación del correo" value={filters.activation} onChange={event => filter('activation', event.target.value)}><option value="">Toda activación</option><option value="verified">Correo confirmado</option><option value="pending">En plazo de 24 h</option><option value="expired">Activación vencida</option></select><select aria-label="Estado de suscripción" value={filters.subscription} onChange={event => filter('subscription', event.target.value)}><option value="">Toda suscripción</option><option value="trial">En prueba</option><option value="active">Pagadas</option><option value="expired">Vencidas</option></select></form>
    <section className="platform-table"><table><thead><tr><th>Tienda / propietario</th><th>Estado</th><th>Activación</th><th>Suscripción</th><th>Pagos</th><th>Administrar</th></tr></thead><tbody>{data?.stores.data.map(item => <tr key={item.id}><td><strong>{item.name}</strong><a href={`/${item.domain}`} target="_blank" rel="noreferrer" className="platform-store-link">/{item.domain}<ArrowUpRight size={13} /></a><p className="mt-2">{item.user?.name || 'Sin propietario'}</p><small className="text-gray-400">{item.user?.email}</small></td><td><span className={`platform-badge ${item.publicly_available ? 'good' : 'warning'}`}>{item.publicly_available ? 'Publicada' : 'Pausada'}</span><p className="mt-2 text-xs text-gray-400">Tienda: {labels[item.status]}<br />Cliente: {labels[item.user?.status] || '—'}</p></td><td><Activation owner={item.user} /></td><td><strong>{item.subscription.status === 'active' ? 'Pagada' : labels[item.subscription.status]}</strong><small className="block text-gray-400 mt-2">Hasta {date(item.subscription.status === 'active' ? item.subscription.subscribed_until : item.subscription.trial_ends_at)}</small></td><td><strong>{item.pending_payments_count} por revisar</strong><small className="block text-gray-400 mt-2">Aprobados: {money(item.approved_payments_total)}</small></td><td><div className="flex flex-col items-start gap-2"><button className="platform-secondary" onClick={() => open(item)}>Administrar</button>{item.user?.status === 'active' && <button disabled={busy} className="platform-primary" onClick={() => enterSupport(item)}>Entrar al panel</button>}</div></td></tr>)}{data?.stores.data.length === 0 && <tr><td colSpan={6}>No hay tiendas que coincidan con los filtros.</td></tr>}{!data && <tr><td colSpan={6}>Cargando tiendas…</td></tr>}</tbody></table><Pager meta={data?.stores} onPage={setPage} /></section>
    {data?.clients_without_store.total > 0 && <section className="platform-table"><h2 className="p-5 text-lg">Clientes sin tienda asociada</h2><table><thead><tr><th>Cliente</th><th>Estado</th><th>Activación</th><th>Acciones</th></tr></thead><tbody>{data.clients_without_store.data.map(owner => <tr key={owner.id}><td><strong>{owner.name}</strong><p className="text-gray-400">{owner.email}</p></td><td>{labels[owner.status]}</td><td><Activation owner={owner} /></td><td><button disabled={busy} className="platform-secondary" onClick={() => changeClientStatus(owner)}>{owner.status === 'active' ? 'Suspender' : 'Activar'} cliente</button></td></tr>)}</tbody></table><Pager meta={data.clients_without_store} onPage={setClientPage} /></section>}
    <dialog ref={dialog} className="platform-dialog" aria-labelledby="store-admin-title" onCancel={event => { event.preventDefault(); setSelected(null); }}><div className="platform-dialog-head"><div><p className="text-xs text-gray-400">Administración de tienda</p><h2 id="store-admin-title">{store?.name || 'Cargando…'}</h2></div><button aria-label="Cerrar administración de tienda" onClick={() => setSelected(null)}><X size={22} /></button></div><div className="platform-dialog-body">{error && <p role="alert" className="platform-alert mb-4">{error}</p>}{notice && <p role="status" className="platform-notice mb-4">{notice}</p>}{store && <>
      <div className="mb-6"><button disabled={busy || store.user?.status !== 'active'} className="platform-primary" onClick={() => enterSupport(store)}>Entrar al panel del cliente</button><p className="text-xs text-gray-400 mt-2">Asistencia de hasta 30 minutos, con registro de cambios y regreso a tu panel.</p></div><div className="platform-detail-grid"><div><span className="text-xs text-gray-400">PROPIETARIO</span><h3 className="mt-2 font-semibold">{store.user?.name || 'Sin propietario'}</h3><p className="text-sm text-gray-400 mb-3">{store.user?.email}</p><Activation owner={store.user} />{store.user && <div className="flex flex-wrap gap-3 mt-4"><button disabled={busy} className="platform-secondary" onClick={() => changeClientStatus(store.user)}>{store.user.status === 'active' ? 'Suspender cliente' : 'Activar cliente'}</button>{!store.user.email_verified_at && <button disabled={busy} className="platform-secondary" onClick={() => activate(store)}>Confirmar activación</button>}{!store.user.email_verified_at && <button disabled={busy} className="platform-secondary" onClick={() => run(() => api.post(`/admin/platform/stores/${store.id}/verification`), 'Correo de activación reenviado.')}>Reenviar activación</button>}</div>}</div><div><span className="text-xs text-gray-400">SUSCRIPCIÓN</span><h3 className="mt-2 font-semibold">{store.subscription.plan.name} · {money(store.subscription.plan.monthly_price)} / mes</h3><p className="text-sm mt-2">{store.subscription.status === 'active' ? 'Pagada' : labels[store.subscription.status]}</p><p className="text-sm text-gray-400 mt-2">Prueba hasta: {date(store.subscription.trial_ends_at)}<br />Pagada hasta: {date(store.subscription.subscribed_until)}</p><button disabled={busy} className="platform-secondary mt-4" onClick={() => changeStoreStatus(store)}>{store.status === 'active' ? 'Suspender tienda' : 'Reactivar tienda'}</button><a className="platform-store-link mt-3" href={`/${store.domain}`} target="_blank" rel="noreferrer">Abrir catálogo <ArrowUpRight size={14} /></a></div></div>
      <form className="platform-edit" onSubmit={event => { event.preventDefault(); run(() => api.put('/admin/store', { tenant_id: store.id, ...form }), 'Configuración de tienda guardada.'); }}><h3 className="font-semibold">Configuración de la tienda</h3><div className="platform-detail-grid">{[['name', 'Nombre'], ['domain', 'Enlace'], ['whatsapp_number', 'WhatsApp']].map(([field, label]) => <label key={field}>{label}<input required={field !== 'whatsapp_number'} value={form[field]} onChange={event => setForm(old => ({ ...old, [field]: event.target.value }))} /></label>)}<label>Diseño<select value={form.theme} onChange={event => setForm(old => ({ ...old, theme: event.target.value }))}>{[['boutique-demo', 'Boutique'], ['tech-demo', 'Tecnología'], ['postres-demo', 'Postres'], ['restaurant-demo', 'Restaurante'], ['minimal-demo', 'Esencial']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div><label>Descripción<textarea value={form.store_description} onChange={event => setForm(old => ({ ...old, store_description: event.target.value }))} /></label><button disabled={busy} className="platform-primary">Guardar cambios</button></form>
      <h3 className="font-semibold mt-7 mb-3">Mensualidades e historial de pagos</h3><p className="text-xs text-gray-400 mb-3">Verifica el pago real antes de aprobar. Un reporte pendiente no concede servicio.</p><div className="platform-table"><table><thead><tr><th>Referencia</th><th>Importe / estado</th><th>Período</th><th>Revisión</th></tr></thead><tbody>{detail.payments.data.map(payment => <tr key={payment.id}><td><strong>{payment.reference}</strong><p className="text-xs text-gray-400 whitespace-pre-wrap mt-2">{payment.notes}</p></td><td>{money(payment.amount)}<p className="mt-2">{labels[payment.status]}</p></td><td><small>{date(payment.period_starts_at)}<br />{date(payment.period_ends_at)}</small></td><td>{payment.status === 'pending' ? <div className="flex gap-3"><button disabled={busy} className="text-accent" onClick={() => review(payment, 'approved')}>Aprobar</button><button disabled={busy} className="text-red-400" onClick={() => review(payment, 'rejected')}>Rechazar</button></div> : date(payment.reviewed_at)}</td></tr>)}{detail.payments.data.length === 0 && <tr><td colSpan={4}>Esta tienda todavía no ha reportado pagos.</td></tr>}</tbody></table><Pager meta={detail.payments} onPage={setDetailPage} /></div>
    </>}</div></dialog>
  </div>;
}
