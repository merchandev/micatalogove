import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { motion } from 'framer-motion';
import { 
  Clock, 
  MessageCircle, 
  Wallet, 
  Smartphone, 
  Store, 
  Bot, 
  Zap, 
  Star 
} from 'lucide-react';

const LandingPage = () => {
  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-bgDark text-white font-sans selection:bg-accent selection:text-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/5 blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <PublicNavbar />

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center px-4 py-2 rounded-full border border-accent/30 bg-accent/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse mr-2"></span>
              <span className="text-xs font-medium text-accent">Lanzamiento oficial</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
              Multiplica tus ventas por WhatsApp, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                en automático
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-400 mx-auto mb-10">
              Crea tu catálogo interactivo en minutos. Recibe los pedidos listos para cobrar por Pago Móvil, Zelle o Efectivo, sin pagar comisiones por venta.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/admin/login" className="block w-full sm:w-auto px-8 py-4 rounded-xl bg-accent hover:bg-accentHover text-white font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]">
                  Comienza totalmente gratis
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href="#demos" className="block w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-white font-semibold transition-all">
                  Ver Demo
                </a>
              </motion.div>
            </motion.div>

            {/* Hero Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.4 }}
              className="mt-20 relative max-w-5xl mx-auto"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-emerald-600 rounded-2xl blur opacity-20"></div>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-white/10 shadow-2xl overflow-hidden aspect-video flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-white/[0.02]"></div>
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-4">
                    <Store className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Interfaz de la Tienda</h3>
                  <p className="text-gray-400">Próximamente se integrará la imagen del catálogo real aquí.</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features 3 Columns */}
        <div className="py-20 border-t border-white/5">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Clock, title: "Lanzamiento Rápido", desc: "Configura tu vitrina digital en menos de 2 minutos. Añade productos y empieza a facturar de inmediato." },
                { icon: MessageCircle, title: "Ventas sin Fricción", desc: "Los clientes arman su carrito y te envían el pedido detallado directamente a tu WhatsApp personal o de empresa." },
                { icon: Wallet, title: "Finanzas Claras", desc: "Monitorea tus ingresos diarios. Configura la tasa del BCV y recibe pagos en Bs o divisas sin confusiones." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-2xl bg-cardDark border border-borderDark hover:border-accent/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Why Section */}
        <div className="py-24 bg-white/[0.01]" id="funcionalidades">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold">¿Por qué MiCatálogo Venezuela?</h2>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { icon: Smartphone, title: "Hecho para Venezuela", desc: "Moneda dual, pasarelas locales y métodos de entrega pensados para el mercado nacional." },
                { icon: Store, title: "Expansión con Revendedores", desc: "Multiplica tu alcance permitiendo que otros vendan por ti con catálogos replicados." },
                { icon: Bot, title: "IA Integrada", desc: "Olvídate de pensar qué escribir. Nuestra IA redacta descripciones persuasivas automáticamente." },
                { icon: Zap, title: "Gestión Intuitiva", desc: "Panel de control visual, estadísticas en tiempo real y cero código. Maneja tu negocio desde el celular." }
              ].map((adv, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ scale: 1.03 }}
                  className="p-6 rounded-2xl bg-cardDark border border-borderDark hover:bg-white/[0.04] transition-all"
                >
                  <div className="mb-4 text-accent/80">
                    <adv.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{adv.title}</h4>
                  <p className="text-sm text-gray-400">{adv.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* How it works */}
        <div className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold">Cómo funciona</h2>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                { step: "1", title: "Regístrate gratis", desc: "Crea tu cuenta en menos de un minuto.", color: "from-emerald-400 to-accent" },
                { step: "2", title: "Añade productos", desc: "Fotos, precios y descripciones. Así de fácil.", color: "from-blue-400 to-indigo-500" },
                { step: "3", title: "Comparte enlace", desc: "Tus clientes lo abren desde su celular.", color: "from-purple-400 to-pink-500" },
                { step: "4", title: "Recibe y cobra", desc: "Llega el mensaje con resumen al chat.", color: "from-orange-400 to-yellow-500" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl bg-cardDark border border-borderDark relative overflow-hidden group hover:border-accent/20 transition-colors"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110">
                    <span className="text-8xl font-black text-accent">{item.step}</span>
                  </div>
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-gray-400 text-sm relative z-10">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-24 border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold">Historias reales de crecimiento</h2>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {[
                { name: "María R.", role: "Emprendedora de repostería, Caracas", quote: "Antes perdía horas pasando fotos por WhatsApp y calculando precios. Con MiCatálogo, mis clientes ven todo actualizado, piden directo y yo solo me encargo de cocinar." },
                { name: "Luis C.", role: "Distribuidor de calzado, Valencia", quote: "El sistema de tasa BCV automática y la opción de tener revendedores disparó mis ventas en un 40%. Es la inversión más rentable que he hecho." }
              ].map((testi, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeUp}
                  className="p-8 rounded-2xl bg-cardDark border border-borderDark hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6 leading-relaxed">"{testi.quote}"</p>
                  <div>
                    <p className="font-bold text-white">{testi.name}</p>
                    <p className="text-sm text-gray-500">{testi.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-24 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-accent/5"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 blur-[120px] rounded-full pointer-events-none"></div>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-6">El momento de digitalizar tu negocio es ahora</h2>
            <p className="text-xl text-gray-300 mb-10">Únete a cientos de emprendedores que ya venden más trabajando menos.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link to="/admin/login" className="inline-flex px-10 py-5 rounded-xl bg-accent hover:bg-accentHover text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)]">
                Probar ahora gratis
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <PublicFooter />
      </div>
    </div>
  );
};

export default LandingPage;
