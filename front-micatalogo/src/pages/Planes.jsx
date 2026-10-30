import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import api from '../api';

export default function Planes() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    api.get('/plans').then(({ data }) => setCatalog(data)).catch(() => setError(true));
  }, []);

  return (
    <div className="min-h-screen bg-[#060A08] text-white">
      <PublicNavbar />
      <main className="max-w-5xl mx-auto px-5 pt-32 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-accent font-semibold mb-4">Tu tienda, lista para compartir</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5">Empieza con 7 días gratis.<br />Continúa por USD 5 al mes.</h1>
          <p className="text-gray-400 text-lg">Prueba el catálogo con las funciones del plan. Al terminar la prueba, activa tu mensualidad para mantener tu tienda disponible.</p>
        </div>
        {error && <p role="alert" className="text-center text-red-300">No pudimos cargar el plan. Intenta recargar la página.</p>}
        {!catalog && !error && <p role="status" className="text-center text-gray-400">Cargando plan…</p>}
        {catalog?.plans.map(plan => (
          <section key={plan.code} className="max-w-xl mx-auto rounded-3xl border border-accent/50 bg-[#0D1913] p-8 sm:p-10 shadow-2xl shadow-accent/5">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <span className="rounded-full bg-accent/15 text-accent text-sm px-3 py-1">{catalog.trial_days} días de prueba</span>
            </div>
            <p className="mb-2"><span className="text-6xl font-black">${Number(plan.monthly_price).toFixed(0)}</span><span className="text-gray-400 ml-2">USD / mes</span></p>
            <p className="text-gray-400 text-sm mb-8">La mensualidad comienza después de tu prueba gratuita.</p>
            <ul className="space-y-4 mb-9">{plan.features.map(feature => <li key={feature} className="flex gap-3 items-start"><Check className="w-5 h-5 text-accent shrink-0 mt-0.5" /><span>{feature}</span></li>)}</ul>
            <Link to="/register" className="flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accentHover py-4 font-bold">Probar {catalog.trial_days} días gratis <ArrowRight className="w-4 h-4" /></Link>
          </section>
        ))}
        <div className="max-w-2xl mx-auto mt-14 space-y-7">
          <div><h2 className="font-bold text-lg mb-2">¿Qué sucede al terminar la prueba?</h2><p className="text-gray-400">Tu catálogo público se pausa hasta activar una mensualidad. Puedes entrar al panel, consultar tus datos y gestionar la renovación.</p></div>
          <div><h2 className="font-bold text-lg mb-2">¿Se borran mis productos si vence la suscripción?</h2><p className="text-gray-400">El vencimiento conserva tus productos, pedidos y conversaciones. Al renovar podrás volver a publicar y gestionar tu tienda.</p></div>
          <div><h2 className="font-bold text-lg mb-2">¿Cómo activo la mensualidad?</h2><p className="text-gray-400">Desde Suscripción puedes reportar el pago acordado con soporte. La activación se realiza después de que el administrador lo verifica. No hay cobros automáticos en esta versión.</p></div>
          <div><h2 className="font-bold text-lg mb-2">¿Habrá más planes?</h2><p className="text-gray-400">Por ahora ofrecemos un único plan. Las funciones y precios de los planes adicionales se anunciarán cuando estén disponibles.</p></div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
