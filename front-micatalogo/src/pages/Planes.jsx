import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowUpRight, Plus } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import api from '../api';

const questions = [
  ['¿Qué pasa después de los siete días?', 'Para mantener tu catálogo público y seguir realizando cambios, activa la mensualidad. Puedes entrar al panel y consultar tus datos aunque el período haya vencido.'],
  ['¿Se pierden mis productos si no renuevo?', 'El vencimiento conserva tus productos, pedidos y conversaciones. Al renovar se reactiva el servicio.'],
  ['¿Cómo activo la mensualidad?', 'Acuerda el pago con soporte y reporta su referencia en Suscripción. El administrador verifica el pago antes de activar el período. Esta versión no realiza cargos automáticos.'],
  ['¿Qué sucede si pago antes del vencimiento?', 'Conservas el tiempo que te queda. El nuevo mes comienza después de tu período de acceso vigente.'],
];

export default function Planes() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => { api.get('/plans').then(({ data }) => setCatalog(data)).catch(() => setError(true)); }, []);
  return <div className="marketing-site"><PublicNavbar /><main className="page-width inner-page"><p className="eyebrow">UN PLAN. LAS CUENTAS CLARAS.</p><div className="page-heading"><h1>Pequeña mensualidad.<br /><em>Un lugar propio.</em></h1><p>Primero conócelo. Tienes siete días para montar tu catálogo y probarlo con tus productos.</p></div>{error && <p role="alert">No pudimos cargar el plan. Recarga la página para intentarlo de nuevo.</p>}{!catalog && !error && <p role="status">Cargando el plan…</p>}{catalog?.plans.map(plan => <section className="plan-sheet" key={plan.code}><div className="plan-price"><span className="eyebrow">EL PLAN {plan.name.toUpperCase()}</span><p className="plan-number">${Number(plan.monthly_price).toFixed(0)}<span>USD / mes</span></p><p>{catalog.trial_days} días de prueba gratuita.<br />La mensualidad viene después.</p><Link to="/register" className="button">Crear mi tienda <ArrowUpRight size={18} /></Link></div><div className="plan-includes"><p className="eyebrow">LO QUE VIENE CON TU TIENDA</p><ul>{plan.features.map(feature => <li key={feature}><Check size={18} strokeWidth={1.5} />{feature}</li>)}</ul><p className="plan-footnote">Tu catálogo, inventario y pedidos en un mismo espacio. Los planes adicionales se definirán más adelante.</p></div></section>)}<section className="faq-section"><div><p className="eyebrow">ANTES DE EMPEZAR</p><h2>Sin letra<br /><em>pequeña.</em></h2><Link to="/contacto" className="text-link">¿Otra pregunta? <ArrowUpRight size={17} /></Link></div><div>{questions.map(([q, a]) => <details key={q}><summary>{q}<Plus size={18} /></summary><p>{a}</p></details>)}</div></section></main><PublicFooter /></div>;
}
