import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';

export default function SubscriptionBanner() {
  const location = useLocation();
  const [subscription, setSubscription] = useState(null);
  useEffect(() => {
    api.get('/admin/subscription').then(({ data }) => setSubscription(data.subscription)).catch(() => {});
  }, [location.pathname]);
  if (!subscription || subscription.status === 'active') return null;
  return <div className={`mb-6 flex flex-wrap justify-between items-center gap-3 rounded-xl border p-4 ${subscription.has_access ? 'border-accent/25 bg-accent/5' : 'border-amber-500/25 bg-amber-500/10'}`}><p className="text-sm">{subscription.has_access ? `Prueba gratuita: te quedan ${subscription.trial_days_remaining} días. Después, USD 5 al mes.` : 'Tu suscripción venció. Renueva para reactivar el catálogo y los cambios en tu tienda.'}</p><Link to="/admin/subscription" className="text-accent text-sm font-bold">Ver suscripción →</Link></div>;
}
