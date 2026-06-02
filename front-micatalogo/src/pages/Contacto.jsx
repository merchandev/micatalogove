import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { MessageCircle, Mail, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contacto() {
  return (
    <div className="min-h-screen bg-[#060A08] text-white font-sans selection:bg-accent selection:text-white flex flex-col">
      <PublicNavbar />
      
      <div className="flex-grow pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full">
          {/* Left Side */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold mb-4">Estamos aquí para impulsar tu negocio</h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Ya sea que necesites ayuda configurando tu catálogo o asesoría sobre el mejor plan para ti, nuestro equipo está listo para apoyarte.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0D1310] border border-white/5 p-6 rounded-2xl hover:border-accent/30 transition-colors">
                <div className="flex items-start">
                  <MessageCircle className="w-6 h-6 text-accent mt-1 mr-4 shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">Atención principal: Vía WhatsApp</h3>
                    <p className="text-gray-400 mt-1 text-sm leading-relaxed mb-4">
                      Lunes a viernes de 9:00 am a 6:00 pm (hora de Venezuela)
                    </p>
                    <a href="#" className="text-blue-500 hover:text-blue-400 text-sm font-semibold transition-colors">Escríbenos al WhatsApp</a>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D1310] border border-white/5 p-6 rounded-2xl hover:border-accent/30 transition-colors">
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-400 mr-4 shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">Correo Electrónico</h3>
                    <p className="text-gray-400 mt-1 text-sm">soporte@micatalogo.com.ve</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D1310] border border-white/5 p-6 rounded-2xl hover:border-accent/30 transition-colors">
                <div className="flex items-start">
                  <Users className="w-6 h-6 text-yellow-500 mt-1 mr-4 shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">Comunidad de WhatsApp</h3>
                    <p className="text-gray-400 mt-1 text-sm leading-relaxed mb-4">
                      Únete donde emprendedores comparten tips y resuelven dudas entre todos.
                    </p>
                    <button className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 text-sm font-semibold transition-colors">
                      Unirme al grupo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-[#0a0f0c] p-8 sm:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            {/* Soft glow inside form card */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8">Envíanos un mensaje</h2>
              
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#111714] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="w-full bg-[#111714] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Mensaje</label>
                  <textarea 
                    rows="5"
                    className="w-full bg-[#111714] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="button" 
                  className="w-full bg-accent hover:bg-accentHover text-white font-bold py-4 rounded-full transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-2"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
}
