import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ShoppingBag } from 'lucide-react';
import api from '../api';

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

export default function ProductDetail() {
  const { domain, productId } = useParams();
  const [tenant, setTenant] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [paused, setPaused] = useState(false);
  const [contact, setContact] = useState({ customer_name: '', customer_phone: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [tenantResponse, productResponse] = await Promise.all([
          api.get(`/tenants/${domain}`),
          api.get(`/tenants/${domain}/products/${productId}`),
        ]);
        const storeData = tenantResponse.data.data;
        const prodData = productResponse.data.data;
        setTenant(storeData);
        setProduct(prodData);
        if (prodData?.name && storeData?.name) {
          document.title = `${prodData.name} | ${storeData.name}`;
        }
      } catch (err) {
        const code = err.response?.data?.code;
        setPaused(['subscription_expired', 'email_unverified'].includes(code) ? code : false);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [domain, productId]);

  const openWhatsapp = async () => {
    const whatsappNumber = tenant?.whatsapp_number?.replace(/[^\d]/g, '');
    if (!whatsappNumber) {
      alert('Esta tienda aun no tiene WhatsApp configurado.');
      return;
    }

    const message = [
      `Hola, quiero informacion de ${tenant.name}.`,
      contact.customer_name ? `Nombre: ${contact.customer_name}` : null,
      contact.customer_phone ? `Telefono: ${contact.customer_phone}` : null,
      '',
      `Producto: ${product.name}`,
      `Precio: ${formatMoney(product.price)}`,
      product.sku ? `SKU: ${product.sku}` : null,
    ].filter(Boolean).join('\n');

    await api.post(`/tenants/${domain}/checkout`, {
      ...contact,
      source: 'product_qr',
      message,
      items: [{
        id: product.id,
        name: product.name,
        quantity: 1,
        price: Number(product.price),
      }],
    }).catch(() => {});

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f3] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !tenant || !product) {
    return (
      <div className="min-h-screen bg-[#f7f7f3] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-black text-gray-900 mb-4">{paused === 'email_unverified' ? 'Catálogo pendiente de activación' : paused ? 'Catálogo temporalmente pausado' : 'Producto no encontrado'}</h1>
        <p className="text-gray-500 mb-8 max-w-md">{paused ? 'La tienda no está disponible en este momento.' : 'El producto no existe, no esta activo o la tienda no esta disponible.'}</p>
        <Link to={`/${domain}`} className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition-colors">
          Ver tienda
        </Link>
      </div>
    );
  }

  const outOfStock = Number(product.stock_quantity) <= 0;

  return (
    <div className="min-h-screen bg-[#f7f7f3] text-gray-950">
      <header className="border-b border-gray-200 bg-[#f7f7f3]">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">{tenant.name}</h1>
            <p className="text-sm text-gray-500">{tenant.store_description}</p>
          </div>
          <Link to={`/${domain}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-950 font-bold">
            <ArrowLeft className="w-4 h-4" />
            Tienda
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-square bg-gray-100">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
              )}
            </div>
          </div>

          <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <div>
              <p className="uppercase tracking-[0.25em] text-xs text-gray-500 mb-3">{product.category?.name || 'Producto'}</p>
              <h2 className="text-4xl font-black">{product.name}</h2>
              <p className="text-3xl font-black text-accent mt-4">{formatMoney(product.price)}</p>
            </div>

            {product.description && <p className="text-gray-600 leading-relaxed">{product.description}</p>}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500">Disponibilidad</p>
                <p className={outOfStock ? 'font-bold text-red-500' : 'font-bold text-gray-950'}>
                  {outOfStock ? 'Agotado' : `${product.stock_quantity} disponibles`}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500">SKU</p>
                <p className="font-bold text-gray-950">{product.sku || 'Sin SKU'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="border border-gray-200 rounded-lg p-3" placeholder="Tu nombre" value={contact.customer_name} onChange={(event) => setContact((current) => ({ ...current, customer_name: event.target.value }))} />
              <input className="border border-gray-200 rounded-lg p-3" placeholder="Tu telefono" value={contact.customer_phone} onChange={(event) => setContact((current) => ({ ...current, customer_phone: event.target.value }))} />
            </div>

            <button disabled={outOfStock} onClick={openWhatsapp} className="w-full inline-flex justify-center items-center gap-2 bg-green-600 disabled:bg-gray-300 disabled:text-gray-500 hover:bg-green-700 text-white py-4 rounded-lg font-black">
              <MessageCircle className="w-5 h-5" />
              Consultar por WhatsApp
            </button>

            <Link to={`/${domain}`} className="w-full inline-flex justify-center items-center gap-2 bg-gray-950 hover:bg-black text-white py-4 rounded-lg font-black">
              <ShoppingBag className="w-5 h-5" />
              Ver mas productos
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
