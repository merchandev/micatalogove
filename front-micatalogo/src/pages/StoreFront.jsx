import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import BoutiqueDemo from './demos/BoutiqueDemo';
import PostresDemo from './demos/PostresDemo';
import TechDemo from './demos/TechDemo';
import RestaurantDemo from './demos/RestaurantDemo';
import MinimalDemo from './demos/MinimalDemo';

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const cartPayload = (cart) => cart.map((item) => ({
  id: item.id,
  name: item.name,
  quantity: item.quantity,
  price: Number(item.price),
}));

export default function StoreFront() {
  const { domain } = useParams();
  const [tenant, setTenant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [contact, setContact] = useState({ customer_name: '', customer_phone: '' });
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const key = `micatalogo_session_${domain}`;
    const existing = localStorage.getItem(key);
    const next = existing || (window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    localStorage.setItem(key, next);
    // eslint-disable-next-line
    setSessionId(next);
  }, [domain]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const [tenantResponse, productsResponse] = await Promise.all([
          api.get(`/tenants/${domain}`),
          api.get(`/tenants/${domain}/products`),
        ]);
        const storeData = tenantResponse.data.data;
        setTenant(storeData);
        setProducts(productsResponse.data.data || []);
        if (storeData?.name) {
          document.title = `${storeData.name} | Catálogo Online`;
        }
      } catch (err) {
        const code = err.response?.data?.code;
        setPaused(['subscription_expired', 'email_unverified'].includes(code) ? code : false);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [domain]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cart]
  );

  useEffect(() => {
    if (!tenant || cart.length === 0 || !sessionId) return;

    const timeout = setTimeout(() => {
      api.post(`/tenants/${domain}/carts`, {
        session_id: sessionId,
        ...contact,
        items: cartPayload(cart),
        total_amount: total,
      }).catch(() => {});
    }, 700);

    return () => clearTimeout(timeout);
  }, [cart, contact, domain, sessionId, tenant, total]);

  const addToCart = (product) => {
    if (Number(product.stock_quantity) <= 0) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((current) => current.map((item) => item.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const whatsappNumber = tenant?.whatsapp_number?.replace(/[^\d]/g, '');

  const buildMessage = (items) => {
    const lines = items.map((item) => `- ${item.quantity}x ${item.name} (${formatMoney(item.price)} c/u)`);
    return [
      `Hola, quiero informacion de ${tenant?.name}.`,
      contact.customer_name ? `Nombre: ${contact.customer_name}` : null,
      contact.customer_phone ? `Telefono: ${contact.customer_phone}` : null,
      '',
      'Productos:',
      ...lines,
      `Total estimado: ${formatMoney(items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0))}`,
    ].filter(Boolean).join('\n');
  };

  const openWhatsapp = (message) => {
    if (!whatsappNumber) {
      alert('Esta tienda aun no tiene WhatsApp configurado.');
      return;
    }
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const consultProduct = async (product) => {
    const items = [{ ...product, quantity: 1 }];
    const message = buildMessage(items);

    await api.post(`/tenants/${domain}/checkout`, {
      session_id: sessionId,
      ...contact,
      source: 'product_whatsapp',
      message,
      items: cartPayload(items),
    }).catch(() => {});

    openWhatsapp(message);
  };

  const submitCart = async () => {
    if (!contact.customer_phone.trim()) {
      alert('Agrega tu telefono para que la tienda pueda hacer seguimiento.');
      return;
    }

    const message = buildMessage(cart);
    await api.post(`/tenants/${domain}/checkout`, {
      session_id: sessionId,
      ...contact,
      source: 'cart_whatsapp',
      message,
      items: cartPayload(cart),
    });

    openWhatsapp(message);
    setCart([]);
    setIsCartOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f3] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen bg-[#f7f7f3] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-black text-gray-900 mb-4">{paused === 'email_unverified' ? 'Catálogo pendiente de activación' : paused ? 'Catálogo temporalmente pausado' : 'Tienda no encontrada'}</h1>
        <p className="text-gray-500 mb-8 max-w-md">{paused === 'email_unverified'
            ? 'Este catálogo se publicará cuando el propietario confirme su correo electrónico.'
            : paused ? 'Esta tienda no está disponible en este momento. Si eres el propietario, entra a tu panel para gestionar la suscripción.' : 'La URL no existe o la tienda no esta activa.'}</p>
        {paused && <Link to={paused === 'email_unverified' ? '/admin/dashboard' : '/admin/subscription'} className="text-emerald-700 font-bold mb-6">Entrar a mi panel</Link>}
        <Link to="/" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition-colors">
          Crear mi propia tienda
        </Link>
      </div>
    );
  }

  const storeProps = {
    tenant,
    products,
    cart,
    setCart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    consultProduct,
    submitCart,
    contact,
    setContact,
    total,
    domain,
  };

  const currentTheme = tenant.theme || 'boutique-demo';
  switch (currentTheme) {
    case 'boutique-demo': return <BoutiqueDemo {...storeProps} />;
    case 'postres-demo': return <PostresDemo {...storeProps} />;
    case 'tech-demo': return <TechDemo {...storeProps} />;
    case 'restaurant-demo': return <RestaurantDemo {...storeProps} />;
    case 'minimal-demo': return <MinimalDemo {...storeProps} />;
    default: return <BoutiqueDemo {...storeProps} />;
  }


}
