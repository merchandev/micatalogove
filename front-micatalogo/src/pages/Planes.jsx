import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { Check, X } from 'lucide-react';

export default function Planes() {
  const faqs = [
    {
      q: "¿Necesito tarjeta de crédito para empezar?",
      a: "No. El plan Básico es 100% gratis y no requiere ningún pago. Para actualizar a Pro puedes pagar en bolívares con Pago Móvil o transferencia."
    },
    {
      q: "¿Cómo recibo los pedidos?",
      a: "Cada vez que un cliente confirma su pedido, te llega un mensaje a tu WhatsApp con la lista de productos, cantidades, total y los datos de contacto. Tú te comunicas para coordinar la entrega y el pago."
    },
    {
      q: "¿Puedo mostrar precios en dólares y bolívares?",
      a: "Sí. Estableces el precio en dólares y el sistema muestra la conversión a bolívares según la tasa que configures. Puedes actualizar la tasa manualmente o dejar la automática (conexión a monitoreo BCV)."
    },
    {
      q: "¿Qué son los catálogos para revendedores?",
      a: "Son réplicas de tu catálogo principal que puedes compartir con personas de confianza. Cada revendedor puede usar tu catálogo con su propio enlace, y los pedidos te llegan a ti. Ideal para modelos de reventa o preventa."
    },
    {
      q: "¿Puedo usar mi propio dominio?",
      a: "En los planes Pro y Empresarial puedes conectar un dominio personalizado (ej. tutienda.com.ve) para mayor profesionalismo."
    },
    {
      q: "¿Qué pasa si cancelo la suscripción?",
      a: "Tus datos no se pierden. Si bajas al plan Gratis, solo podrás tener 10 productos visibles, pero conservas todo lo demás."
    },
    {
      q: "¿Ofrecen facturación?",
      a: "Por ahora no emitimos facturas electrónicas, pero estamos trabajando en una integración con SENIAT para que pronto puedas facturar directamente desde la plataforma."
    }
  ];

  return (
    <div className="min-h-screen bg-[#060A08] text-white font-sans selection:bg-accent selection:text-white">
      <PublicNavbar />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Impulsa tu negocio con el plan ideal</h1>
          <p className="text-gray-400 text-lg">
            Transparencia total: Sin comisiones ocultas. Precios en USD, pagables en Bs a la tasa del día.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* Plan Básico */}
          <div className="bg-[#0D1310] border border-white/5 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-all">
            <h3 className="text-xl font-bold mb-4 text-gray-300">Básico</h3>
            <div className="flex items-baseline mb-2">
              <span className="text-5xl font-extrabold">Gratis</span>
              <span className="text-gray-500 ml-2">/siempre</span>
            </div>
            <p className="text-sm text-gray-400 mb-8 h-10">Valida tu modelo de negocio sin invertir ni un centavo.</p>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Hasta 10 productos</li>
              <li className="flex items-center text-sm text-gray-500"><X className="w-5 h-5 mr-3 shrink-0" /> Sin Revendedores</li>
              <li className="flex items-center text-sm text-gray-500"><X className="w-5 h-5 mr-3 shrink-0" /> Sin Asistente IA</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Estadísticas Básicas</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Soporte Comunidad</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Plantillas básicas</li>
            </ul>
            
            <button className="w-full py-3 rounded-full border border-white/20 hover:bg-white/5 font-semibold transition-colors">
              Comenzar gratis
            </button>
          </div>

          {/* Plan Pro */}
          <div className="bg-[#081810] border border-accent rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-accent/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              MÁS POPULAR
            </div>
            <h3 className="text-xl font-bold mb-4 text-accent">Pro</h3>
            <div className="flex items-baseline mb-1">
              <span className="text-5xl font-extrabold">$3,99</span>
              <span className="text-gray-400 ml-2">/mes</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">(aprox. Bs. 120 al día de hoy)</p>
            <p className="text-sm text-gray-300 mb-8 h-10">Automatiza tus ventas y expande tu alcance con herramientas profesionales.</p>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Hasta 200 productos</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Hasta 5 catálogos (Revendedores)</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> 50 descripciones/mes IA</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Estadísticas Avanzadas</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Soporte WhatsApp + correo</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> 3 plantillas premium</li>
            </ul>
            
            <button className="w-full py-3 rounded-full bg-accent hover:bg-accentHover text-white font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Elegir Pro
            </button>
          </div>

          {/* Plan Empresarial */}
          <div className="bg-[#0D1310] border border-white/5 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-all">
            <h3 className="text-xl font-bold mb-4 text-gray-300">Empresarial</h3>
            <div className="flex items-baseline mb-2">
              <span className="text-5xl font-extrabold">$9,99</span>
              <span className="text-gray-500 ml-2">/mes</span>
            </div>
            <p className="text-sm text-gray-400 mb-8 h-10">La solución definitiva para escalar ventas al mayor y dominar el mercado.</p>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Productos ilimitados</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Hasta 50 catálogos (Revendedores)</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Descripciones ilimitadas IA</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Estadísticas + reportes</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Soporte prioritario</li>
              <li className="flex items-center text-sm"><Check className="w-5 h-5 text-accent mr-3 shrink-0" /> Plantillas premium + dominio propio</li>
            </ul>
            
            <button className="w-full py-3 rounded-full border border-white/20 hover:bg-white/5 font-semibold transition-colors">
              Elegir Empresarial
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mb-16">
          Métodos de pago aceptados: Pago Móvil Interbancario, Transferencia bancaria (Bs), Zelle, Uphold, Reserve (USD), Tarjeta de crédito internacional.
        </p>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#0D1310] border border-white/5 rounded-2xl p-6">
                <h4 className="text-lg font-bold mb-2">{faq.q}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <PublicFooter />
    </div>
  );
}
