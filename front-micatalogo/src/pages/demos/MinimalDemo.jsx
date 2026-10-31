import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function MinimalDemo({ 
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
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const productHref = (product) => domain ? `/${domain}/productos/${product.slug || product.id}` : null;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navbar Minimalista */}
      <nav className="fixed w-full z-50 mix-blend-difference text-white p-6 md:p-12 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="pointer-events-auto flex items-center gap-4">
            <Link to="/" className="uppercase tracking-widest text-xs hover:underline underline-offset-4">
              [ VOLVER ]
            </Link>
          </div>
          
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-center absolute left-1/2 -translate-x-1/2">
            {tenant?.name || "O B J E K T"}
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
          <h2 className="text-[10vw] leading-none font-black tracking-tighter uppercase">
            {tenant?.name || "Forma & Función"}
          </h2>
          <p className="mt-8 text-sm md:text-base uppercase tracking-[0.3em] text-gray-500">
            {tenant?.store_description || "Diseño Utilitario Contemporáneo"}
          </p>
        </motion.div>
      </div>

      {/* Grid Brutalista */}
      <div className="w-full">
        {products.length === 0 ? (
          <div className="text-center py-32 uppercase tracking-[0.2em] text-gray-400">
            No hay productos disponibles por el momento.
          </div>
        ) : (
          products.map((product, i) => {
            const outOfStock = Number(product.stock_quantity) <= 0;
            return (
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
                    src={product.image_url || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800'} 
                    alt={product.name} 
                    className={`w-full h-full object-cover ${outOfStock ? 'opacity-40' : ''}`}
                  />
                </div>
                
                {/* Detalles del Producto */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between border-black md:border-l">
                  <div>
                    <p className="uppercase tracking-[0.2em] text-xs text-gray-500 mb-4">/ 0{i + 1} {outOfStock ? '— AGOTADO' : ''}</p>
                    {productHref(product) ? (
                      <Link to={productHref(product)} className="block text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8 hover:underline">
                        {product.name}
                      </Link>
                    ) : (
                      <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
                        {product.name}
                      </h3>
                    )}
                    <p className="text-xl font-light">${Number(product.price).toFixed(2)}</p>
                  </div>
                  
                  <button 
                    onClick={() => { if(!outOfStock) addToCart(product); }}
                    disabled={outOfStock}
                    className="mt-12 md:mt-0 flex items-center justify-between w-full pb-4 border-b-2 border-black hover:border-gray-400 group transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="uppercase tracking-widest text-sm font-bold group-hover:text-gray-500 transition-colors">
                      {outOfStock ? 'Agotado' : 'Añadir al carrito'}
                    </span>
                    {!outOfStock && <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer Minimalista */}
      <footer className="border-t border-black p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
        <h2 className="text-2xl font-black uppercase tracking-[0.2em]">{tenant?.name || "O B J E K T"}</h2>
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
                  <>
                    {cart.map((item, index) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={`${item.id}-${index}`} 
                        className="flex gap-6 border-b border-white/20 pb-8"
                      >
                        <img src={item.image_url || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800'} className="w-24 h-32 object-cover grayscale" alt={item.name} />
                        <div className="flex-1 flex flex-col justify-between">
                          <h4 className="text-xl uppercase font-bold tracking-tighter leading-none">{item.name}</h4>
                          <p className="font-light">{item.quantity} x ${Number(item.price).toFixed(2)}</p>
                        </div>
                      </motion.div>
                    ))}
                    <div className="space-y-6 pt-4">
                      <input 
                        type="text"
                        placeholder="NOMBRE"
                        value={contact.customer_name}
                        onChange={(e) => setContact({...contact, customer_name: e.target.value})}
                        className="w-full border-b border-white/30 py-2 bg-transparent text-white focus:outline-none focus:border-white uppercase tracking-widest text-xs"
                      />
                      <input 
                        type="tel"
                        placeholder="TELÉFONO"
                        value={contact.customer_phone}
                        onChange={(e) => setContact({...contact, customer_phone: e.target.value})}
                        className="w-full border-b border-white/30 py-2 bg-transparent text-white focus:outline-none focus:border-white uppercase tracking-widest text-xs"
                      />
                    </div>
                  </>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/20">
                  <div className="flex justify-between items-end mb-12">
                    <span className="uppercase tracking-[0.2em] text-xs text-gray-400">Total</span>
                    <span className="text-4xl font-light">${Number(total).toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={submitCart}
                    className="w-full bg-white text-black py-6 uppercase tracking-[0.2em] font-bold text-sm hover:bg-gray-200 transition-colors flex justify-between px-8 items-center group"
                  >
                    <span>WhatsApp</span>
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
