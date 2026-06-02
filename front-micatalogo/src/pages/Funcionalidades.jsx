import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { Smartphone, ShoppingBag, Palette, Globe, Zap, MessageCircle, BarChart, ShieldCheck, CheckCircle2, X } from 'lucide-react';

export default function Funcionalidades() {
  const features = [
    {
      icon: <Smartphone className="w-8 h-8 text-accent" />,
      title: "Diseño 100% Responsivo",
      description: "Tu tienda se verá increíble en cualquier dispositivo. Optimizada para ofrecer la mejor experiencia de compra desde el móvil, que es desde donde compran la mayoría de tus clientes."
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-accent" />,
      title: "Integración con WhatsApp",
      description: "Recibe los pedidos directamente en tu WhatsApp, estructurados, con el cálculo total y listos para cobrar. Sin intermediarios, tú cierras la venta."
    },
    {
      icon: <Palette className="w-8 h-8 text-accent" />,
      title: "Plantillas Personalizables",
      description: "Elige entre múltiples diseños profesionales y personaliza los colores y tipografías para que tu catálogo refleje la identidad única de tu marca."
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-accent" />,
      title: "Gestión de Productos Avanzada",
      description: "Controla tu inventario, crea categorías ilimitadas y ofrece variantes de productos (tallas, colores, sabores) con precios ajustables."
    },
    {
      icon: <Globe className="w-8 h-8 text-accent" />,
      title: "Blog y Posicionamiento SEO",
      description: "Destaca en Google. MiCatálogo incluye un sistema de blog integrado para publicar noticias, ofertas y artículos que atraigan más tráfico a tu tienda."
    },
    {
      icon: <Zap className="w-8 h-8 text-accent" />,
      title: "Cero Comisiones por Venta",
      description: "A diferencia de otras plataformas, nosotros no nos quedamos con una tajada de tus ventas. Pagas solo tu plan mensual, el 100% de tus ingresos son tuyos."
    },
    {
      icon: <BarChart className="w-8 h-8 text-accent" />,
      title: "Panel de Administración Intuitivo",
      description: "Gestiona todo tu negocio desde un panel de control fácil de usar, donde podrás ver el rendimiento de tu tienda y hacer cambios en tiempo real."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-accent" />,
      title: "Dominio Propio y Seguridad",
      description: "Proyecta confianza utilizando tu propio nombre de dominio (.com) y mantén los datos seguros con nuestros certificados SSL gratuitos."
    }
  ];

  return (
    <div className="min-h-screen bg-[#060A08] text-white font-sans selection:bg-accent selection:text-white flex flex-col">
      <PublicNavbar />
      
      <div className="flex-grow pt-32 pb-24 w-full">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Todo lo que necesitas para <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">
              vender más y mejor
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Descubre las herramientas que hemos construido para llevar tu emprendimiento al siguiente nivel, sin complicaciones técnicas.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#0D1310] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.02] transition-colors group">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
          <div className="bg-gradient-to-b from-[#121815] to-[#0A0F0D] border border-accent/20 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Por qué elegir MiCatálogo</h2>
            
            <div className="grid sm:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center">
                  Otras plataformas
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start text-gray-400"><X className="w-5 h-5 text-red-400 mr-3 shrink-0" /> Cobran comisiones del 2% al 5% por cada venta.</li>
                  <li className="flex items-start text-gray-400"><X className="w-5 h-5 text-red-400 mr-3 shrink-0" /> Interfaces complejas que requieren programadores.</li>
                  <li className="flex items-start text-gray-400"><X className="w-5 h-5 text-red-400 mr-3 shrink-0" /> Obligan a tus clientes a registrarse para comprar.</li>
                  <li className="flex items-start text-gray-400"><X className="w-5 h-5 text-red-400 mr-3 shrink-0" /> Difícil integración con el mercado venezolano (Pago Móvil/Zelle).</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-accent mb-6 flex items-center">
                  MiCatálogo
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start text-white font-medium"><CheckCircle2 className="w-5 h-5 text-accent mr-3 shrink-0" /> 0% de comisiones por venta. Siempre.</li>
                  <li className="flex items-start text-white font-medium"><CheckCircle2 className="w-5 h-5 text-accent mr-3 shrink-0" /> Configuración en 5 minutos, tan fácil como usar WhatsApp.</li>
                  <li className="flex items-start text-white font-medium"><CheckCircle2 className="w-5 h-5 text-accent mr-3 shrink-0" /> Compras rápidas sin fricción ni registros tediosos.</li>
                  <li className="flex items-start text-white font-medium"><CheckCircle2 className="w-5 h-5 text-accent mr-3 shrink-0" /> Hecho a la medida para los métodos de pago locales.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-32 px-4">
          <h2 className="text-3xl font-bold mb-6">¿Listo para transformar tu forma de vender?</h2>
          <a href="/planes" className="inline-block bg-accent hover:bg-accentHover text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]">
            Ver planes y precios
          </a>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
}
