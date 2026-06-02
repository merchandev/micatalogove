import React from 'react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

export default function PoliticaCookies() {
  return (
    <div className="min-h-screen bg-[#060A08] text-white font-sans selection:bg-accent selection:text-white flex flex-col">
      <PublicNavbar />
      
      <div className="flex-grow pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#0D1310] border border-white/5 p-8 sm:p-12 rounded-3xl shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-accent">Política de Cookies</h1>
          <p className="text-gray-400 mb-8 text-sm">Última actualización: Junio 2026</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. ¿Qué son las cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que los sitios web almacenan en su ordenador o dispositivo móvil cuando los visita. Permiten que el sitio web recuerde sus acciones y preferencias (como inicio de sesión, idioma, tamaño de letra y otras preferencias de visualización) durante un período de tiempo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. ¿Qué tipos de cookies utiliza MiCatálogo?</h2>
              <ul className="list-disc pl-6 space-y-4 mt-4">
                <li>
                  <strong>Cookies Estrictamente Necesarias:</strong> Estas cookies son esenciales para que pueda navegar por el sitio web y utilizar sus funciones, como el acceso a áreas seguras. Sin ellas, los servicios que ha solicitado no se pueden proporcionar. Estas cookies siempre están activas.
                </li>
                <li>
                  <strong>Cookies Analíticas:</strong> Estas cookies recopilan información sobre cómo los visitantes utilizan nuestro sitio web, por ejemplo, qué páginas visitan con más frecuencia. Utilizamos esta información para mejorar cómo funciona nuestro sitio web. No recogen información que identifique al visitante.
                </li>
                <li>
                  <strong>Cookies de Marketing:</strong> Se utilizan para rastrear a los visitantes a través de las páginas web. La intención es mostrar anuncios relevantes y atractivos para el usuario individual.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. ¿Cómo puede controlar las cookies?</h2>
              <p>
                Puede controlar y/o eliminar las cookies a su voluntad a través del panel de configuración de su navegador web. Puede eliminar todas las cookies que ya están en su computadora y puede configurar la mayoría de los navegadores para evitar que se coloquen.
              </p>
              <p className="mt-4">
                Además, cuando visita nuestro sitio web por primera vez, le ofrecemos la opción de configurar o rechazar el uso de cookies no esenciales mediante nuestro banner de consentimiento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Actualizaciones a esta Política</h2>
              <p>
                Es posible que actualicemos esta Política de Cookies de vez en cuando para reflejar, por ejemplo, cambios en las cookies que utilizamos o por otros motivos operativos, legales o reglamentarios.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
}
