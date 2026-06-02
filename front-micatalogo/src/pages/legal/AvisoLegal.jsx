import React from 'react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

export default function AvisoLegal() {
  return (
    <div className="min-h-screen bg-[#060A08] text-white font-sans selection:bg-accent selection:text-white flex flex-col">
      <PublicNavbar />
      
      <div className="flex-grow pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#0D1310] border border-white/5 p-8 sm:p-12 rounded-3xl shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-accent">Aviso Legal</h1>
          <p className="text-gray-400 mb-8 text-sm">Última actualización: Junio 2026</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Datos Identificativos</h2>
              <p>
                En cumplimiento con el deber de información, se reflejan los siguientes datos:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Empresa Titular:</strong> MiCatálogo Venezuela, C.A.</li>
                <li><strong>RIF:</strong> J-12345678-9</li>
                <li><strong>Domicilio:</strong> Caracas, Distrito Capital, Venezuela.</li>
                <li><strong>Correo de contacto:</strong> legal@micatalogo.com.ve</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Uso del Portal</h2>
              <p>
                El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Protección de Datos</h2>
              <p>
                MiCatálogo cumple con las directrices de privacidad y protección de datos. Los datos personales recabados a través de la plataforma son utilizados exclusivamente para la prestación del servicio, cobro de planes, y comunicación con el cliente.
              </p>
              <p className="mt-2">
                La plataforma no comparte, vende ni alquila información de los clientes finales de los Usuarios (comercios) con terceros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Exclusión de Garantías y Responsabilidad</h2>
              <p>
                MiCatálogo Venezuela, C.A. no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Modificaciones</h2>
              <p>
                MiCatálogo Venezuela, C.A. se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su portal.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
}
