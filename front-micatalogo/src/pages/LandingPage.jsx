import React from 'react';
import { Link } from 'react-router-dom';
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
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed w-full z-50 bg-bgDark/60 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="text-2xl font-bold tracking-tight">Mi<span className="text-accent">Catálogo</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">Inicio</a>
              <a href="#demos" className="text-sm font-medium text-gray-300 hover:text-accent transition-colors">Demos</a>
              <a href="#planes" className="text-sm font-medium text-gray-300 hover:text-accent transition-colors">Planes</a>
              <a href="#funcionalidades" className="text-sm font-medium text-gray-300 hover:text-accent transition-colors">Funcionalidades</a>
              <a href="#contacto" className="text-sm font-medium text-gray-300 hover:text-accent transition-colors">Contacto</a>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/admin/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Ingresar</Link>
              <Link to="/admin/login" className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accentHover text-white text-sm font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]">
                Crear tienda
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

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
              Tu negocio en línea, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                sin complicaciones
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-400 mx-auto mb-10">
              Crea tu catálogo digital, vende por WhatsApp y cobra como prefieras: Pago Móvil, transferencia o Zelle.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/admin/login" className="block w-full sm:w-auto px-8 py-4 rounded-xl bg-accent hover:bg-accentHover text-white font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]">
                  Crear mi catálogo gratis
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
                { icon: Clock, title: "En 2 minutos", desc: "Crea tu tienda, añade tus productos y empieza a vender. Así de rápido." },
                { icon: MessageCircle, title: "Pedidos por WhatsApp", desc: "Recibe los pedidos de tus clientes directamente en tu chat, listos para cerrar." },
                { icon: Wallet, title: "Cobro Flexible", desc: "Recibe pagos en Bolívares (Pago Móvil, Transferencia) o en Dólares (Zelle, Efectivo)." }
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
                { icon: Smartphone, title: "Diseño para el país", desc: "Herramientas de cobro y envíos adaptadas a la realidad venezolana." },
                { icon: Store, title: "Para revendedores", desc: "Ofrece tu catálogo de manera profesional sin importar si tienes tienda física." },
                { icon: Bot, title: "Asistente Inteligente", desc: "Redacta descripciones automáticas para tus productos con ayuda de IA." },
                { icon: Zap, title: "Sin programación", desc: "Todo se administra desde tu panel visual. Cero código, 100% intuitivo." }
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
                { name: "María R.", role: "Emprendedora de repostería, Caracas", quote: "Antes anotaba todo en un cuaderno y perdía muchísimo tiempo. Con MiCatálogo mis clientes ven todo súper claro y me compran más rápido." },
                { name: "Luis C.", role: "Vendedor de zapatos, Valencia", quote: "Poder recibir el resumen de la compra en WhatsApp y con la tasa BCV del día ya calculada no tiene precio. Me ha salvado la vida." }
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
            <h2 className="text-4xl sm:text-5xl font-black mb-6">Empieza hoy y lleva tu negocio al siguiente nivel</h2>
            <p className="text-xl text-gray-300 mb-10">Más de 500 comercios en Venezuela ya confían en MiCatálogo.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link to="/admin/login" className="inline-flex px-10 py-5 rounded-xl bg-accent hover:bg-accentHover text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)]">
                Probar ahora gratis
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <span className="text-2xl font-bold tracking-tight text-white/50 hover:text-white transition-colors">Mi<span className="text-accent">Catálogo</span></span>
            </div>
            <p className="text-sm text-gray-500 mb-6">© 2026 MiCatálogo Venezuela. Todos los derechos reservados.</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
              <a href="#" className="hover:text-white transition-colors">Políticas de privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
