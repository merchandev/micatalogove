import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function BoutiqueDemo() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  
  const products = [
    { id: 1, name: 'Vestido Seda Noir', price: 120, category: 'Vestidos', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'Blusa Crepé Blanca', price: 65, category: 'Blusas', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800' },
    { id: 3, name: 'Pantalón Lino Beige', price: 85, category: 'Pantalones', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800' },
    { id: 4, name: 'Bolso Cuero Clásico', price: 150, category: 'Accesorios', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800' },
    { id: 5, name: 'Abrigo Lana Camel', price: 190, category: 'Abrigos', image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=800' },
    { id: 6, name: 'Zapatos Tacón Nude', price: 95, category: 'Calzado', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800' },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#2C2C2C] font-serif selection:bg-[#B79A78] selection:text-white">
      {/* Navbar Glassmorphism */}
      <nav className="fixed w-full z-50 bg-[#FCFBF8]/80 backdrop-blur-md border-b border-[#B79A78]/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Menu className="h-6 w-6 text-[#2C2C2C] cursor-pointer" />
              <Link to="/demos" className="ml-4 text-xs tracking-widest uppercase text-[#B79A78] hover:text-[#2C2C2C] transition-colors font-sans font-semibold">
                Volver
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold tracking-widest text-center absolute left-1/2 -translate-x-1/2">
              L'ÉLÉGANCE
            </h1>

            <div className="flex items-center space-x-6">
              <Search className="h-5 w-5 cursor-pointer hover:text-[#B79A78] transition-colors" />
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative group"
              >
                <ShoppingBag className="h-5 w-5 group-hover:text-[#B79A78] transition-colors" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B79A78] text-white text-[10px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[85vh] overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
          alt="Colección Nueva" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center text-white p-8 border border-white/30 backdrop-blur-sm bg-black/10"
          >
            <p className="font-sans text-xs uppercase tracking-[0.3em] mb-4">Colección Otoño</p>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-wide">NUEVA<br/>LLEGADA</h2>
            <button className="bg-white text-[#2C2C2C] px-8 py-3 font-sans text-xs uppercase tracking-widest hover:bg-[#B79A78] hover:text-white transition-colors duration-300">
              Descubrir
            </button>
          </motion.div>
        </div>
      </div>

      {/* Categorías */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 font-sans text-sm uppercase tracking-widest text-gray-500">
          {['Todos', 'Vestidos', 'Blusas', 'Pantalones', 'Accesorios'].map((cat, i) => (
            <span key={cat} className={`cursor-pointer transition-colors duration-300 ${i === 0 ? 'text-[#2C2C2C] border-b border-[#2C2C2C] pb-1' : 'hover:text-[#B79A78]'}`}>
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  className="absolute bottom-0 left-0 w-full bg-[#B79A78] text-white py-4 font-sans text-xs uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                >
                  Añadir a la bolsa
                </button>
              </div>
              <div className="text-center">
                <p className="font-sans text-[10px] uppercase tracking-widest text-gray-400 mb-2">{product.category}</p>
                <h3 className="text-lg mb-1 group-hover:text-[#B79A78] transition-colors">{product.name}</h3>
                <p className="font-sans text-sm tracking-widest">${product.price.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Minimalista */}
      <footer className="bg-[#2C2C2C] text-white py-20 text-center">
        <h2 className="text-2xl font-bold tracking-widest mb-6">L'ÉLÉGANCE</h2>
        <p className="font-sans text-xs text-gray-400 uppercase tracking-widest mb-8">La belleza en la simplicidad.</p>
        <div className="flex justify-center gap-6 font-sans text-xs text-gray-400 uppercase tracking-widest">
          <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
          <span className="hover:text-white cursor-pointer transition-colors">Pinterest</span>
          <span className="hover:text-white cursor-pointer transition-colors">Contacto</span>
        </div>
      </footer>

      {/* Shopping Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-md bg-[#FCFBF8] h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-widest">TU BOLSA</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center mt-20 text-gray-500 font-sans text-sm uppercase tracking-widest">
                    Tu bolsa está vacía.
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index} 
                      className="flex gap-4"
                    >
                      <img src={item.image} className="w-24 h-32 object-cover" alt={item.name} />
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-lg mb-1">{item.name}</h4>
                        <p className="font-sans text-sm text-gray-500 tracking-widest">${item.price.toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 bg-white border-t border-gray-100">
                  <div className="flex justify-between items-center mb-6 font-sans">
                    <span className="text-sm uppercase tracking-widest text-gray-500">Subtotal</span>
                    <span className="text-lg tracking-widest">${total.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-[#2C2C2C] hover:bg-[#B79A78] text-white py-4 font-sans text-xs uppercase tracking-widest transition-colors flex justify-center items-center gap-2 group">
                    Proceder al pago <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
