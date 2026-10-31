import { useEffect, useMemo, useState } from 'react';
import { Plus, QrCode, Save, X } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { isPlatformAdmin } from '../../lib/permissions';
import ShareQrCard from '../../components/ShareQrCard';

const emptyForm = {
    id: null,
    tenant_id: '',
    name: '',
    description: '',
    sku: '',
    price: '',
    stock_quantity: 0,
    low_stock_threshold: 5,
    image_url: '',
    status: 'active',
};

export default function ProductsAdmin() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [qrProduct, setQrProduct] = useState(null);

    const platformAdmin = isPlatformAdmin(user);

    useEffect(() => {
        fetchProducts();
        if (platformAdmin) fetchTenants();
    }, [platformAdmin]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/products');
            setProducts(res.data);
        } finally {
            setLoading(false);
        }
    };

    const fetchTenants = async () => {
        const response = await api.get('/admin/tenants');
        setTenants(response.data);
    };

    const defaultTenantId = useMemo(() => {
        if (!platformAdmin) return user?.tenant?.id || '';
        return tenants[0]?.id || '';
    }, [platformAdmin, tenants, user]);

    const handleCreate = () => {
        setFormData({ ...emptyForm, tenant_id: defaultTenantId });
        setIsEditing(false);
        setShowForm(true);
    };

    const handleEdit = (product) => {
        setFormData({
            ...emptyForm,
            ...product,
            tenant_id: product.tenant_id || product.tenant?.id || '',
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Seguro que quieres eliminar este producto?')) return;
        await api.delete(`/admin/products/${id}`);
        fetchProducts();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            ...formData,
            price: Number(formData.price),
            stock_quantity: Number(formData.stock_quantity || 0),
            low_stock_threshold: Number(formData.low_stock_threshold || 0),
        };

        if (!platformAdmin) {
            delete payload.tenant_id;
        }

        if (isEditing) {
            await api.put(`/admin/products/${formData.id}`, payload);
        } else {
            await api.post('/admin/products', payload);
        }

        setShowForm(false);
        fetchProducts();
    };

    const setField = (field, value) => setFormData((current) => ({ ...current, [field]: value }));

    const productDomain = (product) => product?.tenant?.domain || user?.tenant?.domain || '';
    const productSlug = (product) => (product?.name || `${product?.id || ''}`)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-+|-+$/g, '') || product?.id;
    const productUrl = (product) => `${window.location.origin}/${productDomain(product)}/productos/${productSlug(product)}`;
    const productFileName = (product) => `qr-producto-${productDomain(product)}-${product.name || product.id}`
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    if (loading) return <div>Cargando productos...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Inventario</h1>
                    <p className="text-gray-400 mt-1">Productos, precios y stock por tienda.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primaryHover text-black font-bold py-2 px-4 rounded-lg transition"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo producto
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-cardDark p-6 rounded-lg border border-borderDark grid grid-cols-1 md:grid-cols-2 gap-4">
                    {platformAdmin && (
                        <div>
                            <label className="block text-gray-400 mb-1">Tienda</label>
                            <select
                                required
                                className="w-full bg-gray-900 text-white border border-borderDark rounded-lg p-2"
                                value={formData.tenant_id}
                                onChange={(event) => setField('tenant_id', event.target.value)}
                            >
                                <option value="">Seleccionar tienda</option>
                                {tenants.map((tenant) => (
                                    <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-400 mb-1">Nombre</label>
                        <input required className="w-full bg-gray-900 text-white border border-borderDark rounded-lg p-2" value={formData.name} onChange={(event) => setField('name', event.target.value)} />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">SKU</label>
                        <input className="w-full bg-gray-900 text-white border border-borderDark rounded-lg p-2" value={formData.sku || ''} onChange={(event) => setField('sku', event.target.value)} />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Precio USD</label>
                        <input type="number" step="0.01" required className="w-full bg-gray-900 text-white border border-borderDark rounded-lg p-2" value={formData.price} onChange={(event) => setField('price', event.target.value)} />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Stock</label>
                        <input type="number" min="0" className="w-full bg-gray-900 text-white border border-borderDark rounded-lg p-2" value={formData.stock_quantity} onChange={(event) => setField('stock_quantity', event.target.value)} />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Alerta stock bajo</label>
                        <input type="number" min="0" className="w-full bg-gray-900 text-white border border-borderDark rounded-lg p-2" value={formData.low_stock_threshold} onChange={(event) => setField('low_stock_threshold', event.target.value)} />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Estado</label>
                        <select className="w-full bg-gray-900 text-white border border-borderDark rounded-lg p-2" value={formData.status} onChange={(event) => setField('status', event.target.value)}>
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-400 mb-1">URL de imagen</label>
                        <input type="url" className="w-full bg-gray-900 text-white border border-borderDark rounded-lg p-2" value={formData.image_url || ''} onChange={(event) => setField('image_url', event.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-400 mb-1">Descripcion</label>
                        <textarea className="w-full bg-gray-900 text-white border border-borderDark rounded-lg p-2 min-h-24" value={formData.description || ''} onChange={(event) => setField('description', event.target.value)} />
                    </div>
                    <div className="md:col-span-2 flex gap-3">
                        <button type="submit" className="inline-flex items-center gap-2 bg-accent hover:bg-accentHover text-white px-5 py-2 rounded-lg font-bold">
                            <Save className="w-4 h-4" />
                            Guardar
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2 rounded-lg font-bold">
                            <X className="w-4 h-4" />
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-cardDark rounded-lg border border-borderDark overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400">
                        <tr>
                            <th className="p-4">Producto</th>
                            {platformAdmin && <th className="p-4">Tienda</th>}
                            <th className="p-4">Precio</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const lowStock = Number(product.stock_quantity) <= Number(product.low_stock_threshold);
                            return (
                                <tr key={product.id} className="border-t border-borderDark hover:bg-white/[0.03]">
                                    <td className="p-4">
                                        <div className="font-semibold">{product.name}</div>
                                        <div className="text-xs text-gray-500">{product.sku || 'Sin SKU'}</div>
                                    </td>
                                    {platformAdmin && <td className="p-4 text-gray-400">{product.tenant?.name}</td>}
                                    <td className="p-4">${Number(product.price).toFixed(2)}</td>
                                    <td className={`p-4 ${lowStock ? 'text-yellow-400' : 'text-gray-300'}`}>
                                        {product.stock_quantity}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {product.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-3">
                                        <button onClick={() => setQrProduct(product)} className="inline-flex items-center gap-1 text-accent hover:text-accentHover">
                                            <QrCode className="w-4 h-4" />
                                            QR
                                        </button>
                                        <button onClick={() => handleEdit(product)} className="text-blue-400 hover:text-blue-300">Editar</button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300">Eliminar</button>
                                    </td>
                                </tr>
                            );
                        })}
                        {products.length === 0 && (
                            <tr><td colSpan={platformAdmin ? 6 : 5} className="p-5 text-center text-gray-500">No hay productos.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {qrProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="absolute inset-0 bg-black/70" onClick={() => setQrProduct(null)} aria-label="Cerrar QR" />
                    <div className="relative w-full max-w-2xl bg-[#0f1117] border border-borderDark rounded-lg p-5">
                        <div className="flex justify-between items-start gap-4 mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">QR de producto</h2>
                                <p className="text-sm text-gray-400">
                                    {qrProduct.status === 'active'
                                        ? 'Este QR abre la ficha publica del producto.'
                                        : 'Este producto esta inactivo; actívalo para que el QR sea publico.'}
                                </p>
                            </div>
                            <button onClick={() => setQrProduct(null)} className="p-2 rounded-lg hover:bg-white/10">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <ShareQrCard
                            title={qrProduct.name}
                            description={`${qrProduct.tenant?.name || user?.tenant?.name || 'Tienda'} · ${Number(qrProduct.stock_quantity)} disponibles`}
                            value={productUrl(qrProduct)}
                            fileName={productFileName(qrProduct)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
