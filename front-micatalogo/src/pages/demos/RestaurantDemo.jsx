import React, { useState } from 'react';
import { ShoppingBag, MapPin, Clock, ArrowRight, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestaurantDemo() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const categories = ['Hamburguesas', 'Pizzas', 'Sushi', 'Bebidas', 'Postres'];

  const products = [
    { id: 1, name: 'Doble Smash Burger', price: 12.50, desc: 'Doble carne, cheddar, bacon y salsa secreta.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'Pizza Trufada', price: 18.00, desc: 'Mozzarella, champiñones, crema de trufa.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
    { id: 3, name: 'Sushi Mix 24pzas', price: 24.00, desc: 'Salmón, atún, aguacate y tempura.', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800' },
    { id: 4, name: 'Pollo Frito Coreano', price: 14.00, desc: 'Crujiente con salsa agridulce y sésamo.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800' },
    { id: 5, name: 'Tacos al Pastor', price: 10.50, desc: '3 tacos tradicionales con piña y cilantro.', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=800' },
    { id: 6, name: 'Limonada Menta', price: 4.50, desc: 'Refrescante, hecha al momento.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800' },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
    // Small feedback without opening cart immediately
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24 md:pb-0">
      {/* Header Delivery */}
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/demos" className="text-orange-600 font-bold text-sm bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">
              Volver
            </Link>
            
            <div className="text-center flex-1">
              <h1 className="text-xl font-black text-gray-900">BURGER<span className="text-orange-500">RUSH</span></h1>
            </div>

            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-600 hover:text-orange-500 hidden md:block">
              <ShoppingBag className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Info Bar */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex gap-6 overflow-x-auto whitespace-nowrap text-sm text-gray-600 no-scrollbar">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Entregando en <strong>Tu Dirección 123</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Llega en <strong>25-35 min</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Categorías (Horizontal Scroll) */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat, i) => (
            <button 
              key={cat} 
              className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-500 hover:text-orange-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Platos */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-black mb-6">Populares Hoy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex md:flex-col gap-4"
            >
              <div className="w-32 h-32 md:w-full md:h-48 shrink-0 relative overflow-hidden rounded-xl">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <button className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 md:line-clamp-none mb-2">{product.desc}</p>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="font-black text-lg">${product.price.toFixed(2)}</span>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(product)}
                    className="bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                  >
                    Agregar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <AnimatePresence>
        {cart.length > 0 && !isCartOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 px-4 md:hidden z-40"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-orange-500 text-white rounded-2xl p-4 flex justify-between items-center shadow-2xl shadow-orange-500/30 font-bold"
            >
              <div className="flex items-center gap-3">
                <span className="bg-orange-600 w-8 h-8 rounded-full flex items-center justify-center">{cart.length}</span>
                <span>Ver Pedido</span>
              </div>
              <span>${total.toFixed(2)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0">
                <h2 className="text-xl font-black">Tu Pedido</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    Aún no has agregado nada.
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={index} className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                      <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-orange-600 font-bold">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-4 bg-white border-t shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-xl font-black">${total.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors flex justify-center items-center gap-2">
                    Continuar al pago <ArrowRight className="w-5 h-5" />
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
