import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

export default function Contacto() {
  return <div className="marketing-site"><PublicNavbar /><main className="page-width inner-page"><p className="eyebrow">HABLEMOS DE TU TIENDA</p><div className="page-heading"><h1>Una pregunta<br /><em>es un buen comienzo.</em></h1><p>¿Estás preparando tu catálogo o necesitas ayuda con tu cuenta? Cuéntanos en qué punto estás.</p></div><div className="contact-layout"><section className="contact-address"><Mail size={26} strokeWidth={1.3} /><h2>Escríbenos.</h2><a href="mailto:soporte@micatalogo.com.ve" className="contact-email">soporte@micatalogo.com.ve <ArrowUpRight size={21} /></a><p>Incluye el nombre de tu tienda y el correo de tu cuenta para que podamos ubicar tu consulta.</p></section><section className="contact-shortcuts"><h2>Quizá lo encuentres aquí.</h2><Link to="/planes"><div><strong>El plan y la prueba gratuita</strong><span>Qué incluye y cómo continuar después de siete días.</span></div><ArrowUpRight size={19} /></Link><Link to="/forgot-password"><div><strong>No puedo entrar a mi cuenta</strong><span>Solicita un enlace para recuperar tu contraseña.</span></div><ArrowUpRight size={19} /></Link><Link to="/admin/subscription"><div><strong>Mi mensualidad</strong><span>Revisa las fechas y los reportes de tu suscripción.</span></div><ArrowUpRight size={19} /></Link></section></div></main><PublicFooter /></div>;
}
