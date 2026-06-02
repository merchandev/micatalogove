import React, { useState } from 'react';
import { ShoppingBag, X, ArrowRight, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function MinimalDemo() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const products = [
    { id: 1, name: 'Silla Acero Tube', price: 450, category: 'Mobiliario', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'Lámpara Arco', price: 890, category: 'Iluminación', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800' },
    { id: 3, name: 'Mesa Centro Cemento', price: 1200, category: 'Mobiliario', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed286bc0?auto=format&fit=crop&q=80&w=800' },
    { id: 4, name: 'Jarrón Cerámica', price: 180, category: 'Decoración', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800' },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navbar Minimalista */}
      <nav className="fixed w-full z-50 mix-blend-difference text-white p-6 md:p-12 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="pointer-events-auto flex items-center gap-4">
            <Link to="/demos" className="uppercase tracking-widest text-xs hover:underline underline-offset-4">
              [ VOLVER ]
            </Link>
          </div>
          
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-center absolute left-1/2 -translate-x-1/2">
            O B J E K T
          </h1>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto uppercase tracking-widest text-xs hover:underline underline-offset-4 flex items-center gap-2"
          >
            CART ({cart.length})
          </button>
        </div>
      </nav>

      {/* Hero Tipográfico */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h2 className="text-[12vw] leading-none font-black tracking-tighter uppercase">
            Forma &<br/>Función
          </h2>
          <p className="mt-8 text-sm md:text-base uppercase tracking-[0.3em] text-gray-500">
            Diseño Utilitario Contemporáneo
          </p>
        </motion.div>
      </div>

      {/* Grid Brutalista */}
      <div className="w-full">
        {products.map((product, i) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} border-t border-black`}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Imagen del Producto */}
            <div className="w-full md:w-1/2 h-[60vh] md:h-[80vh] relative overflow-hidden bg-gray-100">
              <motion.img 
                animate={{ 
                  scale: hoveredProduct === product.id ? 1.05 : 1,
                  filter: hoveredProduct === product.id ? 'grayscale(0%)' : 'grayscale(100%)'
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Detalles del Producto */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between border-l border-black">
              <div>
                <p className="uppercase tracking-[0.2em] text-xs text-gray-500 mb-4">/ 0{i + 1} — {product.category}</p>
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
                  {product.name}
                </h3>
                <p className="text-xl font-light">${product.price.toFixed(2)}</p>
              </div>
              
              <button 
                onClick={() => addToCart(product)}
                className="mt-12 md:mt-0 flex items-center justify-between w-full pb-4 border-b-2 border-black hover:border-gray-400 group transition-colors"
              >
                <span className="uppercase tracking-widest text-sm font-bold group-hover:text-gray-500 transition-colors">Añadir</span>
                <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Minimalista */}
      <footer className="border-t border-black p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
        <h2 className="text-2xl font-black uppercase tracking-[0.2em]">O B J E K T</h2>
        <div className="flex gap-8 text-xs uppercase tracking-widest">
          <a href="#" className="hover:underline underline-offset-4">Instagram</a>
          <a href="#" className="hover:underline underline-offset-4">Términos</a>
        </div>
      </footer>

      {/* Cart Minimalista */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-md"
              onClick={() => setIsCartOpen(false)}
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-black text-white h-full shadow-2xl flex flex-col p-8 md:p-12"
            >
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-xl font-black tracking-[0.2em] uppercase">CART</h2>
                <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform duration-300">
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center mt-20 uppercase tracking-[0.2em] text-gray-500 text-xs">
                    VACÍO
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index} 
                      className="flex gap-6 border-b border-white/20 pb-8"
                    >
                      <img src={item.image} className="w-24 h-32 object-cover grayscale" alt={item.name} />
                      <div className="flex-1 flex flex-col justify-between">
                        <h4 className="text-xl uppercase font-bold tracking-tighter leading-none">{item.name}</h4>
                        <p className="font-light">${item.price.toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/20">
                  <div className="flex justify-between items-end mb-12">
                    <span className="uppercase tracking-[0.2em] text-xs text-gray-400">Total</span>
                    <span className="text-4xl font-light">${total.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-white text-black py-6 uppercase tracking-[0.2em] font-bold text-sm hover:bg-gray-200 transition-colors flex justify-between px-8 items-center group">
                    <span>Checkout</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
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
