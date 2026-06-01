import { useState, useEffect } from 'react';
import api from '../../api';

export default function ProductsAdmin() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        id: null, name: '', description: '', price: '', image_url: '', status: 'active'
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/products');
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
        setLoading(false);
    };

    const handleCreate = () => {
        setFormData({ id: null, name: '', description: '', price: '', image_url: '', status: 'active' });
        setIsEditing(false);
        setShowForm(true);
    };

    const handleEdit = (product) => {
        setFormData({ ...product });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
            await api.delete(`/admin/products/${id}`);
            fetchProducts();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/admin/products/${formData.id}`, formData);
            } else {
                await api.post('/admin/products', formData);
            }
            setShowForm(false);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product", error);
            alert("Error al guardar el producto");
        }
    };

    if (loading) return <div>Cargando productos...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Mis Productos</h1>
                <button 
                    onClick={handleCreate}
                    className="bg-primary hover:bg-primaryHover text-black font-bold py-2 px-4 rounded transition"
                >
                    + Nuevo Producto
                </button>
            </div>

            {showForm && (
                <div className="bg-cardDark p-6 rounded-xl border border-borderDark mb-8">
                    <h2 className="text-xl font-bold mb-4">{isEditing ? 'Editar Producto' : 'Crear Producto'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Nombre</label>
                            <input 
                                type="text" 
                                required
                                className="w-full bg-gray-800 text-white border border-borderDark rounded p-2 focus:border-primary focus:outline-none"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Precio ($)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                required
                                className="w-full bg-gray-800 text-white border border-borderDark rounded p-2 focus:border-primary focus:outline-none"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1">Descripción</label>
                            <textarea 
                                className="w-full bg-gray-800 text-white border border-borderDark rounded p-2 focus:border-primary focus:outline-none"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-1">URL de Imagen (opcional)</label>
                            <input 
                                type="url" 
                                className="w-full bg-gray-800 text-white border border-borderDark rounded p-2 focus:border-primary focus:outline-none"
                                value={formData.image_url}
                                onChange={e => setFormData({...formData, image_url: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-4 mt-2">
                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-bold transition">
                                Guardar
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded font-bold transition">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-cardDark rounded-xl border border-borderDark overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400">
                        <tr>
                            <th className="p-4">Producto</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-t border-borderDark hover:bg-gray-800 transition">
                                <td className="p-4 font-semibold">{p.name}</td>
                                <td className="p-4">${parseFloat(p.price).toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="p-4 space-x-2">
                                    <button onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-300">Editar</button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-400">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">No hay productos.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
