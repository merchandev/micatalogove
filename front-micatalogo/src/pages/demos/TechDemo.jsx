import React, { useState } from 'react';
import { ShoppingCart, Search, Zap, Cpu, Battery, Wifi, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function TechDemo() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const products = [
    { id: 1, name: 'Auriculares Quantum Pro', price: 299.99, category: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', specs: ['Hi-Res Audio', 'Noise Cancelling', '40h Batería'] },
    { id: 2, name: 'Reloj Inteligente X2', price: 199.50, category: 'Wearables', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800', specs: ['OLED 1.4"', 'GPS', 'Sumergible'] },
    { id: 3, name: 'Cámara DSLR Alpha', price: 899.00, category: 'Fotografía', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', specs: ['24.2 MP', '4K Video', 'Wi-Fi'] },
    { id: 4, name: 'Teclado Mecánico RGB', price: 129.99, category: 'Periféricos', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800', specs: ['Switches Cherry', 'RGB', 'Inalámbrico'] },
    { id: 5, name: 'Monitor UltraWide 34"', price: 450.00, category: 'Monitores', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800', specs: ['144Hz', '1ms', 'HDR10'] },
    { id: 6, name: 'Ratón Gaming Pro', price: 79.99, category: 'Periféricos', image: 'https://images.unsplash.com/photo-1527814050087-379381547969?auto=format&fit=crop&q=80&w=800', specs: ['16000 DPI', 'Ligero 65g', 'RGB'] },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 font-sans selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/demos" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span>Volver</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white tracking-wider">TECH<span className="text-blue-500">NOVA</span></span>
            </div>

            <div className="flex items-center gap-6">
              <Search className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
              <button onClick={() => setIsCartOpen(true)} className="relative group">
                <ShoppingCart className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-24 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Nuevos Lanzamientos 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              El Futuro <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">en tus manos.</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-lg">
              Tecnología de vanguardia diseñada para aquellos que no se conforman. Potencia, rendimiento y diseño sin compromisos.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-3 rounded-sm font-semibold hover:bg-blue-400 hover:text-white transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              Explorar Catálogo
            </motion.button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-2xl rounded-full"></div>
            <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1000" alt="Gadget" className="relative z-10 w-full h-[500px] object-cover rounded-2xl border border-white/10 shadow-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Products */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Equipamiento Pro</h2>
            <p className="text-gray-500">Selección premium para creadores y gamers.</p>
          </div>
          <div className="hidden md:flex gap-4">
            {['Audio', 'Wearables', 'Fotografía', 'Monitores'].map(cat => (
              <span key={cat} className="text-sm px-4 py-1.5 rounded-full border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors cursor-pointer text-gray-400 hover:text-white">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-[#121212] border border-white/5 hover:border-blue-500/30 rounded-xl overflow-hidden transition-colors"
            >
              <div className="relative h-64 overflow-hidden bg-black/50 p-6 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
              </div>
              <div className="p-6 relative">
                <div className="absolute top-0 right-6 -translate-y-1/2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(product)}
                    className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-500"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-blue-400 text-xs font-mono uppercase tracking-wider mb-2">{product.category}</p>
                <h3 className="text-xl font-bold text-white mb-4">{product.name}</h3>
                
                {/* Specs */}
                <div className="flex gap-2 mb-6">
                  {product.specs.map((spec, index) => (
                    <span key={index} className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">
                      {spec}
                    </span>
                  ))}
                </div>
                
                <p className="text-2xl text-white font-light">${product.price.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#0A0A0A] py-12 text-center text-gray-500">
        <Zap className="w-6 h-6 mx-auto mb-4 text-white/20" />
        <p className="text-sm font-mono">TECHNOVA © 2026. All Systems Operational.</p>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-md bg-[#0F0F0F] border-l border-white/10 h-full flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151515]">
                <h2 className="text-lg font-mono text-white tracking-widest uppercase">/ Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-500 hover:text-white rounded-md hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-600 mt-20 font-mono text-sm">
                    <Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    Sin dispositivos en el carrito.
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={index} 
                      className="flex items-center gap-4 bg-[#151515] p-3 rounded-lg border border-white/5"
                    >
                      <div className="w-16 h-16 bg-black rounded-md overflow-hidden p-1">
                        <img src={item.image} className="w-full h-full object-cover rounded opacity-80" alt="" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm mb-1">{item.name}</h4>
                        <p className="text-blue-400 font-mono text-xs">${item.price.toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 bg-[#151515] border-t border-white/10">
                  <div className="flex justify-between items-center mb-6 font-mono">
                    <span className="text-gray-400 text-sm">TOTAL</span>
                    <span className="text-2xl text-white">${total.toFixed(2)}</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 text-white font-mono uppercase text-sm py-4 rounded hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  >
                    Checkout // {cart.length} items
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
