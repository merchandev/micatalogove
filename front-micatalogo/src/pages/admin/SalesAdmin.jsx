import { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { isPlatformAdmin } from '../../lib/permissions';

const statuses = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
];

export default function SalesAdmin() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const platformAdmin = isPlatformAdmin(user);

  const fetchOrders = () => api.get('/admin/orders').then(({ data }) => setOrders(data));

  useEffect(() => {
    api.get('/admin/orders').then(({ data }) => setOrders(data));
  }, []);

  const updateStatus = async (order, status) => {
    setError('');
    try {
      await api.put(`/admin/orders/${order.id}`, { status, notes: order.notes || '' });
    } catch (err) {
      setError(err.response?.data?.errors?.status?.[0] || err.response?.data?.message || 'No se pudo actualizar la venta.');
    }
    fetchOrders();
  };

  const totals = orders.reduce((summary, order) => {
    summary.count += 1;
    if (order.status === 'completed') summary.revenue += Number(order.total_amount);
    return summary;
  }, { count: 0, revenue: 0 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ventas</h1>
        <p className="text-gray-400 mt-1">Ordenes generadas desde WhatsApp.</p>
      </div>

      {error && <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cardDark border border-borderDark rounded-lg p-5">
          <p className="text-sm text-gray-400">Ordenes</p>
          <p className="text-3xl font-bold">{totals.count}</p>
        </div>
        <div className="bg-cardDark border border-borderDark rounded-lg p-5">
          <p className="text-sm text-gray-400">Ingresos completados</p>
          <p className="text-3xl font-bold text-accent">${totals.revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-cardDark border border-borderDark rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="p-4">Cliente</th>
              {platformAdmin && <th className="p-4">Tienda</th>}
              <th className="p-4">Productos</th>
              <th className="p-4">Total</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-borderDark">
                <td className="p-4">
                  <div className="font-semibold">{order.customer_name || 'Visitante'}</div>
                  <div className="text-xs text-gray-500">{order.customer_phone || 'Sin telefono'}</div>
                </td>
                {platformAdmin && <td className="p-4 text-gray-400">{order.tenant?.name}</td>}
                <td className="p-4 text-gray-300">
                  {(order.items || []).map((item) => `${item.quantity}x ${item.product_name}`).join(', ')}
                </td>
                <td className="p-4 font-semibold">${Number(order.total_amount).toFixed(2)}</td>
                <td className="p-4">
                  <select className="bg-gray-900 border border-borderDark rounded p-2" value={order.status} onChange={(event) => updateStatus(order, event.target.value)}>
                    {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={platformAdmin ? 5 : 4} className="p-6 text-center text-gray-500">No hay ordenes registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
