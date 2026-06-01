import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export default function StoreFront() {
  const { domain } = useParams();
  const [tenant, setTenant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, total, count, removeFromCart, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenantRes = await axios.get(`http://127.0.0.1:8000/api/tenants/${domain}`);
        setTenant(tenantRes.data.data);
        const productsRes = await axios.get(`http://127.0.0.1:8000/api/tenants/${domain}/products`);
        setProducts(productsRes.data.data);
      } catch (error) {
        console.error("Error fetching store data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [domain]);

  const sendWhatsApp = () => {
    if (!tenant || cart.length === 0) return;
    
    let message = `Hola ${tenant.name}, quisiera pedir lo siguiente:\n\n`;
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
    });
    message += `\n*Total: $${total.toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${tenant.whatsapp_number}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
    clearCart();
    setIsCartOpen(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Cargando catálogo...</div>;
  if (!tenant) return <div className="min-h-screen flex items-center justify-center text-red-500">Tienda no encontrada.</div>;

  return (
    <div className="min-h-screen bg-bgDark pb-24">
      <header className="bg-cardDark border-b border-borderDark py-8 px-6 text-center">
        {tenant.store_logo && (
          <img src={tenant.store_logo} alt={tenant.name} className="w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-lg" />
        )}
        <h1 className="text-4xl font-bold text-white mb-2">{tenant.name}</h1>
        <p className="text-gray-400 max-w-xl mx-auto">{tenant.store_description}</p>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No hay productos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {count > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-cardDark border border-borderDark shadow-2xl rounded-full px-6 py-4 flex items-center gap-4 hover:bg-gray-800 transition z-50"
        >
          <div className="text-white font-bold">🛒 {count} items</div>
          <div className="text-primary font-bold">${total.toFixed(2)}</div>
        </button>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end">
          <div className="bg-bgDark w-full max-w-md h-full flex flex-col p-6 shadow-2xl border-l border-borderDark">
            <div className="flex justify-between items-center border-b border-borderDark pb-4 mb-4">
              <h2 className="text-2xl font-bold text-white">Tu Pedido</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-cardDark p-4 rounded-lg">
                  <div>
                    <h4 className="text-white font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-400">{item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400">Eliminar</button>
                </div>
              ))}
            </div>

            <div className="border-t border-borderDark pt-4 mt-4">
              <div className="flex justify-between items-center text-xl font-bold text-white mb-6">
                <span>Total:</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={sendWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition shadow-lg"
              >
                Pedir por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
