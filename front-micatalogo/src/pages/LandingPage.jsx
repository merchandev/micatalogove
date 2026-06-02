import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-bgDark text-white font-sans selection:bg-accent selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
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
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-accent/30 bg-accent/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse mr-2"></span>
            <span className="text-xs font-medium text-accent">Lanzamiento oficial</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
            Tu negocio en línea, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              sin complicaciones
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-400 mx-auto mb-10">
            Crea tu catálogo digital, vende por WhatsApp y cobra como prefieras: Pago Móvil, transferencia o Zelle.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/admin/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent hover:bg-accentHover text-white font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]">
              Crear mi catálogo gratis
            </Link>
            <a href="#demos" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-white font-semibold transition-all">
              Ver Demo
            </a>
          </div>

          {/* Hero Image / Mockup Placeholder */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-emerald-600 rounded-2xl blur opacity-20"></div>
            <div className="relative rounded-2xl bg-[#111] border border-white/10 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-4">
                  <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Interfaz de la Tienda</h3>
                <p className="text-gray-400">Próximamente se integrará la imagen del catálogo real aquí.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features 3 Columns */}
      <div className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-cardDark border border-borderDark hover:border-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">En 2 minutos</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Crea tu tienda, añade tus productos y empieza a vender. Así de rápido.</p>
            </div>
            <div className="p-8 rounded-2xl bg-cardDark border border-borderDark hover:border-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Pedidos por WhatsApp</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Recibe los pedidos de tus clientes directamente en tu chat, listos para cerrar.</p>
            </div>
            <div className="p-8 rounded-2xl bg-cardDark border border-borderDark hover:border-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Cobro Flexible</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Recibe pagos en Bolívares (Pago Móvil, Transferencia) o en Dólares (Zelle, Efectivo).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Section */}
      <div className="py-24" id="funcionalidades">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">¿Por qué MiCatálogo Venezuela?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-cardDark border border-borderDark">
              <div className="mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Diseño pensado para el país</h4>
              <p className="text-sm text-gray-400">Las herramientas de cobro y envíos están adaptadas a la realidad venezolana.</p>
            </div>
            <div className="p-6 rounded-2xl bg-cardDark border border-borderDark">
              <div className="mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Ideal para revendedores</h4>
              <p className="text-sm text-gray-400">Ofrece tu catálogo de manera profesional sin importar si tienes tienda física.</p>
            </div>
            <div className="p-6 rounded-2xl bg-cardDark border border-borderDark">
              <div className="mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Asistente Inteligente</h4>
              <p className="text-sm text-gray-400">Redacta descripciones automáticas para tus productos con ayuda de IA.</p>
            </div>
            <div className="p-6 rounded-2xl bg-cardDark border border-borderDark">
              <div className="mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Sin programación</h4>
              <p className="text-sm text-gray-400">Todo se administra desde tu panel visual. Cero código, 100% intuitivo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Cómo funciona</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Regístrate gratis", desc: "Crea tu cuenta en menos de un minuto.", color: "from-emerald-400 to-accent" },
              { step: "2", title: "Añade productos", desc: "Fotos, precios y descripciones. Así de fácil.", color: "from-blue-400 to-indigo-500" },
              { step: "3", title: "Comparte enlace", desc: "Tus clientes lo abren desde su celular, sin apps.", color: "from-purple-400 to-pink-500" },
              { step: "4", title: "Recibe y cobra", desc: "Te llega un mensaje con el resumen y los datos.", color: "from-orange-400 to-yellow-500" }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-cardDark border border-borderDark relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-8xl font-black">{item.step}</span>
                </div>
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-gray-400 text-sm relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Historias reales de crecimiento</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl bg-cardDark border border-borderDark">
              <div className="flex space-x-1 mb-4 text-primary">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-gray-300 italic mb-6">"Antes anotaba todo en un cuaderno y perdía muchísimo tiempo. Con MiCatálogo mis clientes ven todo súper claro y me compran más rápido."</p>
              <div>
                <p className="font-bold text-white">María R.</p>
                <p className="text-sm text-gray-500">Emprendedora de repostería, Caracas</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl bg-cardDark border border-borderDark">
              <div className="flex space-x-1 mb-4 text-primary">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-gray-300 italic mb-6">"Poder recibir el resumen de la compra en WhatsApp y con la tasa BCV del día ya calculada no tiene precio. Me ha salvado la vida."</p>
              <div>
                <p className="font-bold text-white">Luis C.</p>
                <p className="text-sm text-gray-500">Vendedor de zapatos, Valencia</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 blur-[120px] rounded-full"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-6">Empieza hoy y lleva tu negocio al siguiente nivel</h2>
          <p className="text-xl text-gray-300 mb-10">Más de 500 comercios en Venezuela ya confían en MiCatálogo.</p>
          <Link to="/admin/login" className="inline-flex px-10 py-5 rounded-xl bg-accent hover:bg-accentHover text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)] scale-100 hover:scale-105">
            Probar ahora gratis
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
             <span className="text-2xl font-bold tracking-tight">Mi<span className="text-accent">Catálogo</span></span>
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
  );
};

export default LandingPage;
