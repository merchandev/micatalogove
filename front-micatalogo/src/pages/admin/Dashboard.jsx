import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, MessageSquare, Package, ShoppingCart, Store, Users } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { isPlatformAdmin, isSuperAdmin } from '../../lib/permissions';
import PlatformOverview from './PlatformOverview';

const money = new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' });

function StoreDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/admin/dashboard');
                setData(response.data);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const maxSeries = useMemo(() => {
        if (!data?.sales?.series?.length) return 1;
        return Math.max(...data.sales.series.map((item) => Number(item.total)), 1);
    }, [data]);

    if (loading) return <div>Cargando panel...</div>;

    const cards = [
        { label: 'Clientes', value: data.counts.clients, icon: Users, show: isPlatformAdmin(user) },
        { label: 'Pendientes', value: data.counts.pending_clients, icon: AlertTriangle, show: isPlatformAdmin(user) },
        { label: 'Tiendas activas', value: data.counts.active_tenants, icon: Store, show: true },
        { label: 'Productos', value: data.counts.products, icon: Package, show: true },
        { label: 'Stock bajo', value: data.counts.low_stock, icon: AlertTriangle, show: true },
        { label: 'Conversaciones nuevas', value: data.counts.new_conversations, icon: MessageSquare, show: true },
        { label: 'Carritos abiertos', value: data.counts.open_carts, icon: ShoppingCart, show: true },
    ].filter((card) => card.show);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Panel de control</h1>
                <p className="text-gray-400 mt-1">
                    {data.scope === 'platform' ? 'Vista global de la plataforma.' : `Gestion de ${data.tenant?.name || user?.tenant?.name}.`}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-cardDark p-5 rounded-lg border border-borderDark">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">{label}</span>
                            <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <p className="text-3xl font-bold mt-3">{value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <section className="xl:col-span-2 bg-cardDark border border-borderDark rounded-lg p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold">Ventas</h2>
                            <p className="text-gray-400 text-sm">Ultimos 7 dias</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-accent">{money.format(data.sales.total_revenue)}</p>
                            <p className="text-xs text-gray-500">{data.sales.completed_orders} ordenes completadas</p>
                        </div>
                    </div>
                    <div className="h-56 flex items-end gap-3">
                        {data.sales.series.map((item) => (
                            <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-white/5 rounded-t-md overflow-hidden flex items-end h-44">
                                    <div
                                        className="w-full bg-accent/80 rounded-t-md min-h-[4px]"
                                        style={{ height: `${(Number(item.total) / maxSeries) * 100}%` }}
                                        title={money.format(item.total)}
                                    />
                                </div>
                                <span className="text-xs text-gray-500">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-cardDark border border-borderDark rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Productos destacados</h2>
                    <div className="space-y-3">
                        {data.top_products.length === 0 ? (
                            <p className="text-gray-500 text-sm">Sin ventas completadas todavia.</p>
                        ) : (
                            data.top_products.map((product) => (
                                <div key={product.product_name} className="flex justify-between gap-4 text-sm">
                                    <span className="text-gray-300 truncate">{product.product_name}</span>
                                    <span className="text-accent font-semibold">{product.quantity}</span>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <section className="bg-cardDark border border-borderDark rounded-lg overflow-hidden">
                    <div className="p-5 border-b border-borderDark">
                        <h2 className="text-xl font-bold">Alertas de inventario</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <tbody>
                            {data.low_stock_products.map((product) => (
                                <tr key={product.id} className="border-t border-borderDark">
                                    <td className="p-4">{product.name}</td>
                                    <td className="p-4 text-gray-400">{product.tenant?.name}</td>
                                    <td className="p-4 text-right text-yellow-400">{product.stock_quantity} disponibles</td>
                                </tr>
                            ))}
                            {data.low_stock_products.length === 0 && (
                                <tr><td className="p-5 text-gray-500">No hay productos con stock bajo.</td></tr>
                            )}
                        </tbody>
                    </table>
                </section>

                <section className="bg-cardDark border border-borderDark rounded-lg overflow-hidden">
                    <div className="p-5 border-b border-borderDark">
                        <h2 className="text-xl font-bold">Actividad reciente</h2>
                    </div>
                    <div className="divide-y divide-borderDark">
                        {data.recent_conversations.map((conversation) => (
                            <div key={conversation.id} className="p-4">
                                <div className="flex justify-between gap-4">
                                    <p className="font-semibold">{conversation.customer_name || 'Visitante'}</p>
                                    <span className="text-xs text-accent">{conversation.status}</span>
                                </div>
                                <p className="text-sm text-gray-400 truncate">{conversation.message || conversation.subject}</p>
                            </div>
                        ))}
                        {data.recent_conversations.length === 0 && (
                            <p className="p-5 text-gray-500">Sin conversaciones registradas.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    return isSuperAdmin(user) ? <PlatformOverview /> : <StoreDashboard />;
}
