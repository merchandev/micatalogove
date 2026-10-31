import { useEffect, useState } from 'react';
import { Save, Store } from 'lucide-react';
import api from '../../api';
import ShareQrCard from '../../components/ShareQrCard';

const themes = [
  { id: 'boutique-demo', name: 'Boutique' },
  { id: 'postres-demo', name: 'Postres' },
  { id: 'tech-demo', name: 'Tecnologia' },
  { id: 'restaurant-demo', name: 'Restaurante' },
  { id: 'minimal-demo', name: 'Minimalista' },
];

export default function StoreSettings() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await api.get('/admin/store');
        setFormData(response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  const setField = (field, value) => {
    setSaved(false);
    setError('');
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaved(false);
    try {
      const response = await api.put('/admin/store', formData);
      setFormData(response.data);
      setSaved(true);
    } catch (err) {
      const errors = err.response?.data?.errors;
      const firstKey = errors ? Object.keys(errors)[0] : null;
      setError((firstKey && errors[firstKey]?.[0]) || err.response?.data?.message || 'Error al actualizar la tienda.');
    }
  };

  if (loading) return <div>Cargando tienda...</div>;

  if (!formData) {
    return (
      <div className="bg-cardDark border border-borderDark rounded-lg p-6">
        No hay una tienda asociada a esta cuenta.
      </div>
    );
  }

  const storeUrl = formData.domain ? `${window.location.origin}/${formData.domain}` : '';

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuracion de tienda</h1>
        <p className="text-gray-400 mt-1">Datos publicos, tema y WhatsApp de ventas.</p>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-4 rounded-lg">
          Tienda actualizada correctamente.
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      <form onSubmit={handleSubmit} className="xl:col-span-2 bg-cardDark border border-borderDark rounded-lg p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-borderDark">
          <Store className="w-6 h-6 text-accent" />
          <div>
            <h2 className="font-bold">Identidad publica</h2>
            <p className="text-sm text-gray-500">Estos datos se ven en el catalogo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre de tienda</label>
            <input required className="w-full bg-gray-900 border border-borderDark rounded-lg p-3" value={formData.name || ''} onChange={(event) => setField('name', event.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Dominio</label>
            <input required className="w-full bg-gray-900 border border-borderDark rounded-lg p-3" value={formData.domain || ''} onChange={(event) => setField('domain', event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} />
            <p className="text-xs text-gray-500 mt-1">{window.location.host}/{formData.domain || 'mi-tienda'}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">WhatsApp de ventas</label>
            <input className="w-full bg-gray-900 border border-borderDark rounded-lg p-3" placeholder="584121234567" value={formData.whatsapp_number || ''} onChange={(event) => setField('whatsapp_number', event.target.value.replace(/[^\d+]/g, ''))} />
            <p className="text-xs text-gray-500 mt-1">Usa codigo de pais. Ejemplo: 584121234567.</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tema visual</label>
            <select className="w-full bg-gray-900 border border-borderDark rounded-lg p-3" value={formData.theme || 'boutique-demo'} onChange={(event) => setField('theme', event.target.value)}>
              {themes.map((theme) => <option key={theme.id} value={theme.id}>{theme.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Logo URL</label>
            <input type="url" className="w-full bg-gray-900 border border-borderDark rounded-lg p-3" value={formData.store_logo || ''} onChange={(event) => setField('store_logo', event.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Descripcion</label>
            <textarea className="w-full bg-gray-900 border border-borderDark rounded-lg p-3 min-h-32" value={formData.store_description || ''} onChange={(event) => setField('store_description', event.target.value)} />
          </div>
        </div>

        <button type="submit" className="inline-flex items-center gap-2 bg-accent hover:bg-accentHover text-white px-5 py-3 rounded-lg font-bold">
          <Save className="w-4 h-4" />
          Guardar cambios
        </button>
      </form>

      <ShareQrCard
        title="QR del perfil"
        description="Comparte este QR para abrir directamente la tienda publica."
        value={storeUrl}
        fileName={`qr-tienda-${formData.domain || 'micatalogo'}`}
      />
      </div>
    </div>
  );
}
