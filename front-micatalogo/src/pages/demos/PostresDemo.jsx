
import { ShoppingCart, Heart, Search, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostresDemo({ 
  tenant = null, 
  domain = '',
  products = [], 
  cart = [], 
  isCartOpen = false, 
  setIsCartOpen = () => {}, 
  addToCart = () => {}, 
  submitCart = () => {}, 
  total = 0, 
  contact = { customer_name: '', customer_phone: '' }, 
  setContact = () => {} 
}) {
  const productHref = (product) => domain ? `/${domain}/productos/${product.slug || product.id}` : null;
  return (
    <div className="min-h-screen bg-[#FFF5F7] font-sans text-gray-800 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-10 max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-pink-500 hover:text-pink-600 font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm">
            ← Volver
          </Link>
          <span className="text-3xl font-black text-pink-500 tracking-tight">{tenant?.name || 'DulceMordida'}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-pink-500 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors relative hover:-translate-y-1 transform duration-200"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-400 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FFF5F7]">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-pink-100 text-pink-600 font-bold rounded-full text-sm mb-6"
            >
              🍰 Recién Horneados
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6 text-gray-900 leading-tight"
            >
              Hacemos tu día <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">más dulce.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 max-w-md mx-auto md:mx-0"
            >
              {tenant?.store_description || 'Postres artesanales creados con amor y los mejores ingredientes. Pide ahora y recíbelo hoy.'}
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_10px_20px_rgba(236,72,153,0.3)] hover:bg-pink-600"
            >
              Ver Menú Completo
            </motion.button>
          </div>
          <div className="flex-1 relative">
            <motion.div
              initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 1.5 }}
              className="relative z-10"
            >
              <img src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=800" alt="Postre Principal" className="w-full max-w-md mx-auto rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="relative z-10 bg-white rounded-t-[4rem] px-4 py-24 shadow-[0_-20px_40px_rgba(0,0,0,0.02)] min-h-[50vh]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Los Favoritos</h2>
            <p className="text-gray-500">Nuestros productos más populares</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center text-gray-400 py-10 font-medium">
              Aún no hay productos disponibles en esta tienda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product, i) => {
                const outOfStock = Number(product.stock_quantity) <= 0;
                const colors = ['bg-pink-100', 'bg-purple-100', 'bg-yellow-100', 'bg-red-100', 'bg-orange-100', 'bg-green-100'];
                const bgColor = colors[i % colors.length];
                
                return (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                    whileHover={{ y: -10 }}
                    className={`${bgColor} rounded-[2rem] p-6 relative group ${outOfStock ? 'opacity-60' : ''}`}
                  >
                    <div className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm p-2 rounded-full text-pink-500 cursor-pointer hover:bg-white transition-colors">
                      <Heart className="w-5 h-5" />
                    </div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-4 border-white/50"
                    >
                      <img src={product.image_url || 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800'} alt={product.name} className={`w-full h-full object-cover ${outOfStock ? 'grayscale' : ''}`} />
                    </motion.div>
                    
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center">
                      <div>
                        {productHref(product) ? (
                          <Link to={productHref(product)} className="block font-bold text-gray-900 hover:text-pink-500 mb-1">
                            {product.name}
                          </Link>
                        ) : (
                          <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                        )}
                        <p className="text-pink-500 font-black">${Number(product.price).toFixed(2)}</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={outOfStock}
                        onClick={() => addToCart(product)}
                        className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50"
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl rounded-l-[2rem]"
            >
              <div className="p-6 flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900">Tu Cesta 🧁</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-100 text-gray-500 hover:text-gray-900 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-400 mt-10">
                    <p className="text-6xl mb-4">🛒</p>
                    <p className="font-medium">Tu cesta está muy vacía</p>
                  </div>
                ) : (
                  <>
                    {cart.map((item, index) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, type: 'spring' }}
                        key={`${item.id}-${index}`} 
                        className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl"
                      >
                        <img src={item.image_url || 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800'} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt={item.name} />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">{item.name}</h4>
                          <p className="text-pink-500 font-black text-sm">{item.quantity} x ${Number(item.price).toFixed(2)}</p>
                        </div>
                      </motion.div>
                    ))}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <input 
                        type="text"
                        placeholder="Tu Nombre"
                        value={contact.customer_name}
                        onChange={(e) => setContact({...contact, customer_name: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-pink-500 font-medium text-gray-900"
                      />
                      <input 
                        type="tel"
                        placeholder="Tu Teléfono"
                        value={contact.customer_phone}
                        onChange={(e) => setContact({...contact, customer_phone: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-pink-500 font-medium text-gray-900"
                      />
                    </div>
                  </>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 bg-white border-t border-gray-100 rounded-bl-[2rem]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-bold">Total a pagar</span>
                    <span className="text-3xl font-black text-gray-900">${Number(total).toFixed(2)}</span>
                  </div>
                  <motion.button 
                    onClick={submitCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-pink-500 text-white font-bold py-4 rounded-full text-lg shadow-[0_10px_20px_rgba(236,72,153,0.3)] hover:bg-pink-600"
                  >
                    Hacer Pedido por WhatsApp
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
