import React from 'react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

export default function TerminosYCondiciones() {
  return (
    <div className="min-h-screen bg-[#060A08] text-white font-sans selection:bg-accent selection:text-white flex flex-col">
      <PublicNavbar />
      
      <div className="flex-grow pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#0D1310] border border-white/5 p-8 sm:p-12 rounded-3xl shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-accent">Términos y Condiciones de Uso</h1>
          <p className="text-gray-400 mb-8 text-sm">Última actualización: Junio 2026</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar los servicios proporcionados por MiCatálogo Venezuela, C.A. ("nosotros", "la Plataforma"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los términos, no podrá acceder a la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Descripción del Servicio</h2>
              <p>
                MiCatálogo proporciona una plataforma SaaS (Software as a Service) que permite a los comerciantes ("Usuarios") crear catálogos digitales interactivos para mostrar productos y recibir pedidos estructurados directamente a través de WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Responsabilidades del Usuario</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>El Usuario es el único responsable de la legalidad, exactitud y calidad de los productos o servicios que ofrece en su catálogo.</li>
                <li>MiCatálogo no interviene en las transacciones entre el Usuario y sus clientes finales. Los pagos se procesan directamente a través de los métodos acordados por el Usuario (ej. Pago Móvil, Zelle).</li>
                <li>Está prohibida la venta de productos ilegales, regulados sin los permisos correspondientes, armas, drogas, o cualquier artículo que viole las leyes vigentes de la República Bolivariana de Venezuela.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Suscripciones y Pagos</h2>
              <p>
                MiCatálogo ofrece planes gratuitos y de pago (Suscripciones). Las suscripciones se facturan por adelantado en un ciclo recurrente (mensual o anual). La tasa de cambio aplicable para pagos en Bolívares estará basada en la tasa oficial del Banco Central de Venezuela (BCV) del día del pago.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Propiedad Intelectual</h2>
              <p>
                El servicio y todo su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de MiCatálogo Venezuela, C.A. y sus licenciantes. Los Usuarios conservan todos los derechos sobre el contenido (fotos, descripciones) que suben a sus catálogos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Limitación de Responsabilidad</h2>
              <p>
                En ningún caso MiCatálogo será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo sin limitación, pérdida de beneficios, datos, uso, o buena voluntad, que resulten de su acceso o uso o de la incapacidad de acceder o usar el servicio.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
}
