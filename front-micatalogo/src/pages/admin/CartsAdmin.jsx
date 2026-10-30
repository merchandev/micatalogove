import { useEffect, useState } from 'react';
import { PhoneCall } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { isPlatformAdmin } from '../../lib/permissions';

const statuses = [
  { value: 'open', label: 'Abierto' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'recovered', label: 'Recuperado' },
  { value: 'closed', label: 'Cerrado' },
];

export default function CartsAdmin() {
  const { user } = useAuth();
  const [carts, setCarts] = useState([]);
  const platformAdmin = isPlatformAdmin(user);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    const response = await api.get('/admin/carts');
    setCarts(response.data);
  };

  const updateStatus = async (cart, status) => {
    await api.put(`/admin/carts/${cart.id}`, { status });
    fetchCarts();
  };

  const whatsappLink = (cart) => {
    const phone = (cart.customer_phone || '').replace(/[^\d]/g, '');
    if (!phone) return null;
    const text = encodeURIComponent(`Hola, vi que dejaste un carrito pendiente en ${cart.tenant?.name || 'nuestra tienda'}. Puedo ayudarte a completar tu compra?`);
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Carritos incompletos</h1>
        <p className="text-gray-400 mt-1">Seguimiento de visitantes que agregaron productos.</p>
      </div>

      <div className="bg-cardDark border border-borderDark rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="p-4">Contacto</th>
              {platformAdmin && <th className="p-4">Tienda</th>}
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Accion</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => {
              const link = whatsappLink(cart);
              return (
                <tr key={cart.id} className="border-t border-borderDark">
                  <td className="p-4">
                    <div className="font-semibold">{cart.customer_name || 'Visitante'}</div>
                    <div className="text-xs text-gray-500">{cart.customer_phone || 'Sin telefono'}</div>
                  </td>
                  {platformAdmin && <td className="p-4 text-gray-400">{cart.tenant?.name}</td>}
                  <td className="p-4 text-gray-300">
                    {(cart.items || []).map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                  </td>
                  <td className="p-4 font-semibold">${Number(cart.total_amount).toFixed(2)}</td>
                  <td className="p-4">
                    <select className="bg-gray-900 border border-borderDark rounded p-2" value={cart.status} onChange={(event) => updateStatus(cart, event.target.value)}>
                      {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    {link ? (
                      <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-accent hover:text-accentHover">
                        <PhoneCall className="w-4 h-4" />
                        Contactar
                      </a>
                    ) : (
                      <span className="text-gray-600">Sin telefono</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {carts.length === 0 && (
              <tr><td colSpan={platformAdmin ? 6 : 5} className="p-6 text-center text-gray-500">No hay carritos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
